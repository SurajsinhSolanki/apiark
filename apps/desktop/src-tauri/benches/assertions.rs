use std::collections::HashMap;

use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion};

use apiark_lib::scripting::assertions::evaluate_assertions;
use apiark_lib::scripting::ResponseSnapshot;

fn make_response(body: &str) -> ResponseSnapshot {
    ResponseSnapshot {
        status: 200,
        status_text: "OK".to_string(),
        headers: {
            let mut h = HashMap::new();
            h.insert("content-type".to_string(), "application/json".to_string());
            h.insert("x-request-id".to_string(), "abc123".to_string());
            h.insert("cache-control".to_string(), "no-cache".to_string());
            h
        },
        body: body.to_string(),
        time_ms: 150,
        size_bytes: body.len() as u64,
    }
}

fn parse_yaml(yaml: &str) -> serde_yaml::Value {
    serde_yaml::from_str(yaml).unwrap()
}

fn bench_assertions(c: &mut Criterion) {
    let mut group = c.benchmark_group("assertions");

    // Simple status check
    {
        let resp = make_response(r#"{"id": 1}"#);
        let yaml = parse_yaml("status: 200");
        group.bench_function("single_status_eq", |b| {
            b.iter(|| evaluate_assertions(black_box(&yaml), black_box(&resp)))
        });
    }

    // Response time check
    {
        let resp = make_response(r#"{}"#);
        let yaml = parse_yaml("responseTime:\n  lt: 2000");
        group.bench_function("response_time_lt", |b| {
            b.iter(|| evaluate_assertions(black_box(&yaml), black_box(&resp)))
        });
    }

    // Nested body path
    {
        let resp = make_response(
            r#"{"data": {"user": {"email": "test@example.com", "name": "Test", "roles": ["admin"]}}}"#,
        );
        let yaml = parse_yaml("body.data.user.email:\n  eq: \"test@example.com\"");
        group.bench_function("nested_body_path", |b| {
            b.iter(|| evaluate_assertions(black_box(&yaml), black_box(&resp)))
        });
    }

    // Array index access
    {
        let resp = make_response(
            r#"{"users": [{"name": "Alice"}, {"name": "Bob"}, {"name": "Charlie"}]}"#,
        );
        let yaml = parse_yaml("body.users[1].name:\n  eq: Bob");
        group.bench_function("array_index_access", |b| {
            b.iter(|| evaluate_assertions(black_box(&yaml), black_box(&resp)))
        });
    }

    // Regex match
    {
        let resp = make_response(r#"{"email": "test@example.com"}"#);
        let yaml = parse_yaml("body.email:\n  matches: \"^.+@.+\\\\..+$\"");
        group.bench_function("regex_match", |b| {
            b.iter(|| evaluate_assertions(black_box(&yaml), black_box(&resp)))
        });
    }

    // Multiple assertions (typical real-world usage)
    // Build programmatically to guarantee unique YAML keys
    for count in [5, 10, 20] {
        let body_json = serde_json::json!({
            "id": 42, "name": "Test", "email": "t@e.com", "active": true,
            "score": 95.5, "tags": ["a","b","c"],
            "meta": {"version": 2, "region": "us", "env": "prod"},
            "f0": 0, "f1": 1, "f2": 2, "f3": 3, "f4": 4,
            "f5": 5, "f6": 6, "f7": 7, "f8": 8, "f9": 9
        });
        let resp = make_response(&body_json.to_string());

        // Build a YAML mapping directly to avoid duplicate key issues
        let mut mapping = serde_yaml::Mapping::new();
        let all_assertions: Vec<(&str, &str, serde_yaml::Value)> = vec![
            ("status", "eq", serde_yaml::Value::Number(200.into())),
            ("responseTime", "lt", serde_yaml::Value::Number(2000.into())),
            ("body.id", "eq", serde_yaml::Value::Number(42.into())),
            ("body.name", "eq", serde_yaml::Value::String("Test".into())),
            (
                "body.email",
                "contains",
                serde_yaml::Value::String("@".into()),
            ),
            ("body.active", "eq", serde_yaml::Value::Bool(true)),
            (
                "body.score",
                "gt",
                serde_yaml::Value::Number(serde_yaml::Number::from(90)),
            ),
            (
                "body.tags.length",
                "eq",
                serde_yaml::Value::Number(3.into()),
            ),
            (
                "body.meta.version",
                "gte",
                serde_yaml::Value::Number(1.into()),
            ),
            (
                "headers.content-type",
                "contains",
                serde_yaml::Value::String("json".into()),
            ),
            (
                "headers.x-request-id",
                "eq",
                serde_yaml::Value::String("abc123".into()),
            ),
            ("body.tags[0]", "eq", serde_yaml::Value::String("a".into())),
            ("body.tags[1]", "eq", serde_yaml::Value::String("b".into())),
            ("body.tags[2]", "eq", serde_yaml::Value::String("c".into())),
            ("body.nonexistent", "exists", serde_yaml::Value::Bool(false)),
            (
                "body.meta.region",
                "eq",
                serde_yaml::Value::String("us".into()),
            ),
            ("statusText", "eq", serde_yaml::Value::String("OK".into())),
            ("sizeBytes", "gt", serde_yaml::Value::Number(0.into())),
            (
                "headers.cache-control",
                "eq",
                serde_yaml::Value::String("no-cache".into()),
            ),
            (
                "body.meta.env",
                "eq",
                serde_yaml::Value::String("prod".into()),
            ),
        ];
        for (path, op, val) in all_assertions.into_iter().take(count) {
            let mut op_map = serde_yaml::Mapping::new();
            op_map.insert(serde_yaml::Value::String(op.into()), val);
            mapping.insert(
                serde_yaml::Value::String(path.into()),
                serde_yaml::Value::Mapping(op_map),
            );
        }
        let yaml = serde_yaml::Value::Mapping(mapping);

        group.bench_with_input(
            BenchmarkId::new("multiple_assertions", count),
            &count,
            |b, _| b.iter(|| evaluate_assertions(black_box(&yaml), black_box(&resp))),
        );
    }

    group.finish();
}

criterion_group!(benches, bench_assertions);
criterion_main!(benches);

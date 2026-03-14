use std::collections::HashMap;

use criterion::{black_box, criterion_group, criterion_main, Criterion};

use apiark_lib::scripting::engine::execute_script;
use apiark_lib::scripting::{RequestSnapshot, ResponseSnapshot, ScriptContext, ScriptPhase};

fn empty_context() -> ScriptContext {
    ScriptContext {
        request: RequestSnapshot {
            method: "GET".to_string(),
            url: "https://api.example.com/users".to_string(),
            headers: HashMap::new(),
            body: None,
        },
        response: None,
        env: HashMap::new(),
        globals: HashMap::new(),
        variables: HashMap::new(),
    }
}

fn context_with_response() -> ScriptContext {
    let mut ctx = empty_context();
    ctx.env
        .insert("baseUrl".to_string(), "https://api.example.com".to_string());
    ctx.env.insert("token".to_string(), "abc123".to_string());
    ctx.response = Some(ResponseSnapshot {
        status: 200,
        status_text: "OK".to_string(),
        headers: {
            let mut h = HashMap::new();
            h.insert("content-type".to_string(), "application/json".to_string());
            h.insert("x-request-id".to_string(), "req-123".to_string());
            h
        },
        body: r#"{"id": 1, "name": "Test User", "email": "test@example.com", "roles": ["admin", "user"]}"#.to_string(),
        time_ms: 150,
        size_bytes: 1024,
    });
    ctx
}

fn bench_scripting(c: &mut Criterion) {
    let mut group = c.benchmark_group("scripting");

    // Measure the overhead of just creating the runtime + injecting ark API
    group.bench_function("empty_script_overhead", |b| {
        b.iter(|| {
            execute_script(
                black_box("var x = 1;"),
                empty_context(),
                ScriptPhase::PreRequest,
            )
            .unwrap()
        })
    });

    // Simple env mutation
    group.bench_function("env_set_single", |b| {
        b.iter(|| {
            execute_script(
                black_box(r#"ark.env.set("token", "new-value");"#),
                empty_context(),
                ScriptPhase::PreRequest,
            )
            .unwrap()
        })
    });

    // Multiple env mutations
    group.bench_function("env_set_10_vars", |b| {
        let script = (0..10)
            .map(|i| format!(r#"ark.env.set("var{i}", "value{i}");"#))
            .collect::<Vec<_>>()
            .join("\n");
        b.iter(|| {
            execute_script(black_box(&script), empty_context(), ScriptPhase::PreRequest).unwrap()
        })
    });

    // Test with assertion (post-response)
    group.bench_function("single_test_assertion", |b| {
        b.iter(|| {
            execute_script(
                black_box(
                    r#"
                    ark.test("status is 200", function() {
                        ark.expect(ark.response.status).to.equal(200);
                    });
                    "#,
                ),
                context_with_response(),
                ScriptPhase::PostResponse,
            )
            .unwrap()
        })
    });

    // Multiple tests with JSON parsing
    group.bench_function("multiple_tests_with_json", |b| {
        b.iter(|| {
            execute_script(
                black_box(
                    r#"
                    var body = ark.response.json();
                    ark.test("has id", function() {
                        ark.expect(body).to.have.property("id");
                    });
                    ark.test("correct name", function() {
                        ark.expect(body.name).to.equal("Test User");
                    });
                    ark.test("has roles", function() {
                        ark.expect(body.roles).to.include("admin");
                    });
                    ark.test("response time ok", function() {
                        ark.expect(ark.response.time).to.be.below(1000);
                    });
                    "#,
                ),
                context_with_response(),
                ScriptPhase::PostResponse,
            )
            .unwrap()
        })
    });

    // Pre-request script modifying request
    group.bench_function("modify_request", |b| {
        b.iter(|| {
            execute_script(
                black_box(
                    r#"
                    ark.request.setUrl("https://api.example.com/v2/users");
                    ark.request.setHeader("X-Custom", "value");
                    ark.request.setHeader("X-Timestamp", String(Date.now()));
                    ark.env.set("lastRun", String(Date.now()));
                    "#,
                ),
                empty_context(),
                ScriptPhase::PreRequest,
            )
            .unwrap()
        })
    });

    group.finish();
}

criterion_group!(benches, bench_scripting);
criterion_main!(benches);

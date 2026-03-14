use std::collections::HashMap;

use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion};

use apiark_lib::http::interpolation::{interpolate, interpolate_map};

fn make_variables(count: usize) -> HashMap<String, String> {
    (0..count)
        .map(|i| (format!("var{i}"), format!("value{i}")))
        .collect()
}

fn bench_interpolation(c: &mut Criterion) {
    let mut group = c.benchmark_group("interpolation");

    // Simple: 1 variable in a short string
    {
        let vars = HashMap::from([("baseUrl".into(), "http://localhost:3000".into())]);
        group.bench_function("simple_1var", |b| {
            b.iter(|| interpolate(black_box("{{baseUrl}}/api/users"), black_box(&vars)))
        });
    }

    // Medium: 5 variables in a URL + headers template
    {
        let vars = HashMap::from([
            ("baseUrl".into(), "https://api.example.com".into()),
            ("version".into(), "v2".into()),
            ("token".into(), "eyJhbGciOiJIUzI1NiJ9.abc123".into()),
            ("userId".into(), "usr_abc123".into()),
            ("format".into(), "json".into()),
        ]);
        let template = "{{baseUrl}}/{{version}}/users/{{userId}}?format={{format}}&auth={{token}}";
        group.bench_function("medium_5vars", |b| {
            b.iter(|| interpolate(black_box(template), black_box(&vars)))
        });
    }

    // Heavy: 50 variables in a large JSON body
    {
        let vars = make_variables(50);
        let template: String = (0..50)
            .map(|i| format!(r#""field{i}": "{{{{var{i}}}}}"#))
            .collect::<Vec<_>>()
            .join(", ");
        let template = format!("{{{template}}}");
        group.bench_function("heavy_50vars", |b| {
            b.iter(|| interpolate(black_box(&template), black_box(&vars)))
        });
    }

    // No variables (passthrough, should be fast)
    {
        let vars = HashMap::new();
        group.bench_function("no_vars_passthrough", |b| {
            b.iter(|| {
                interpolate(
                    black_box("https://api.example.com/users?page=1&limit=20"),
                    black_box(&vars),
                )
            })
        });
    }

    // Dynamic variables
    {
        let vars = HashMap::new();
        group.bench_function("dynamic_uuid", |b| {
            b.iter(|| interpolate(black_box("{{$uuid}}"), black_box(&vars)))
        });
        group.bench_function("dynamic_timestamp", |b| {
            b.iter(|| interpolate(black_box("{{$timestamp}}"), black_box(&vars)))
        });
        group.bench_function("dynamic_randomString", |b| {
            b.iter(|| interpolate(black_box("{{$randomString}}"), black_box(&vars)))
        });
    }

    group.finish();

    // interpolate_map benchmark
    let mut map_group = c.benchmark_group("interpolate_map");
    for count in [5, 20, 50] {
        let vars = make_variables(10);
        let map: HashMap<String, String> = (0..count)
            .map(|i| {
                (
                    format!("Header-{i}"),
                    format!("{{{{var{}}}}}-suffix", i % 10),
                )
            })
            .collect();
        map_group.bench_with_input(BenchmarkId::new("headers", count), &count, |b, _| {
            b.iter(|| interpolate_map(black_box(&map), black_box(&vars)))
        });
    }
    map_group.finish();
}

criterion_group!(benches, bench_interpolation);
criterion_main!(benches);

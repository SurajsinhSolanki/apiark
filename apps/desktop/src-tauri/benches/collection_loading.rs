use std::fs;
use std::path::Path;

use criterion::{criterion_group, criterion_main, BenchmarkId, Criterion};

use apiark_lib::storage::collection::{load_collection_tree, read_request};

/// Create a temporary collection with N request YAML files.
fn create_temp_collection(dir: &Path, count: usize) {
    // Create .apiark/apiark.yaml
    let apiark_dir = dir.join(".apiark");
    fs::create_dir_all(&apiark_dir).unwrap();
    fs::write(
        apiark_dir.join("apiark.yaml"),
        format!("name: bench-collection-{count}\nversion: 1\n"),
    )
    .unwrap();

    // Create request files across a few folders
    let folders = ["users", "products", "orders", "auth", "admin"];
    for (i, folder) in folders.iter().enumerate() {
        let folder_path = dir.join(folder);
        fs::create_dir_all(&folder_path).unwrap();

        let per_folder = count / folders.len();
        let extra = if i == 0 { count % folders.len() } else { 0 };

        for j in 0..(per_folder + extra) {
            let request_yaml = format!(
                r#"name: Request {folder} {j}
method: {}
url: "https://api.example.com/{folder}/{j}"
description: Benchmark request {j} in {folder}
headers:
  Content-Type: application/json
  Authorization: "Bearer {{{{token}}}}"
  X-Request-ID: "{{{{$uuid}}}}"
body:
  type: json
  content: |
    {{"name": "test-{j}", "email": "user{j}@example.com"}}
assert:
  status: 200
  responseTime:
    lt: 2000
"#,
                match j % 5 {
                    0 => "GET",
                    1 => "POST",
                    2 => "PUT",
                    3 => "PATCH",
                    _ => "DELETE",
                }
            );
            fs::write(folder_path.join(format!("request-{j}.yaml")), &request_yaml).unwrap();
        }
    }
}

fn bench_collection_loading(c: &mut Criterion) {
    let mut group = c.benchmark_group("collection_loading");

    // Adjust measurement time for larger collections
    group.sample_size(20);

    for count in [100, 500, 1000] {
        let tmp = tempfile::tempdir().unwrap();
        create_temp_collection(tmp.path(), count);

        group.bench_with_input(BenchmarkId::new("load_tree", count), &count, |b, _| {
            b.iter(|| load_collection_tree(tmp.path()).unwrap());
        });
    }

    group.finish();

    // Benchmark reading a single request file (full parse)
    let mut single_group = c.benchmark_group("read_request");
    {
        let tmp = tempfile::tempdir().unwrap();
        create_temp_collection(tmp.path(), 10);
        let request_path = tmp.path().join("users").join("request-0.yaml");

        single_group.bench_function("single_yaml_parse", |b| {
            b.iter(|| read_request(&request_path).unwrap());
        });

        // Benchmark a complex request with all fields
        let complex_yaml = r#"name: Complex Request
method: POST
url: "https://api.example.com/v2/users"
description: A complex request with all fields populated
headers:
  Content-Type: application/json
  Authorization: "Bearer {{token}}"
  X-Request-ID: "{{$uuid}}"
  X-Correlation-ID: "{{correlationId}}"
  Accept: application/json
  Accept-Language: en-US
  Cache-Control: no-cache
  X-Api-Version: "2.0"
params:
  page: "1"
  limit: "50"
  sort: "created_at"
  order: "desc"
body:
  type: json
  content: |
    {
      "name": "{{userName}}",
      "email": "{{userEmail}}",
      "role": "admin",
      "permissions": ["read", "write", "delete"],
      "metadata": {
        "source": "api",
        "timestamp": "{{$isoTimestamp}}"
      }
    }
assert:
  status: 201
  body.id:
    type: string
  body.name:
    eq: "{{userName}}"
  responseTime:
    lt: 2000
  headers.content-type:
    contains: application/json
tests: |
  ark.test("should return created user", () => {
    const body = ark.response.json();
    ark.expect(body).to.have.property("id");
    ark.expect(body.name).to.equal(ark.env.get("userName"));
  });
  ark.test("should have correct status", () => {
    ark.expect(ark.response.status).to.equal(201);
  });
preRequestScript: |
  ark.env.set("userName", "User_" + Date.now());
  ark.env.set("userEmail", "test@example.com");
postResponseScript: |
  const body = ark.response.json();
  if (body.id) ark.env.set("createdUserId", body.id);
"#;
        let complex_path = tmp.path().join("complex-request.yaml");
        fs::write(&complex_path, complex_yaml).unwrap();

        single_group.bench_function("complex_yaml_parse", |b| {
            b.iter(|| read_request(&complex_path).unwrap());
        });
    }
    single_group.finish();
}

criterion_group!(benches, bench_collection_loading);
criterion_main!(benches);

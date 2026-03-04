pub mod collection;
pub mod environment;
pub mod history;
pub mod http;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to ApiArk.", name)
}

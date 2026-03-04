pub mod collection;
pub mod curl;
pub mod environment;
pub mod history;
pub mod http;
pub mod settings;
pub mod state;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to ApiArk.", name)
}

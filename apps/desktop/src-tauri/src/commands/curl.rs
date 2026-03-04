use std::collections::HashMap;

use crate::http::curl::{self, ParsedCurlRequest};

#[tauri::command]
pub async fn parse_curl_command(input: String) -> Result<ParsedCurlRequest, String> {
    curl::parse_curl(&input)
}

#[tauri::command]
pub async fn export_curl_command(
    method: String,
    url: String,
    headers: HashMap<String, String>,
    body: Option<String>,
    auth_basic: Option<(String, String)>,
) -> Result<String, String> {
    let auth_ref = auth_basic.as_ref().map(|(u, p)| (u.as_str(), p.as_str()));
    Ok(curl::export_curl(
        &method,
        &url,
        &headers,
        body.as_deref(),
        auth_ref,
    ))
}

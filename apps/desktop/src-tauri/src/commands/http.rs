use std::collections::HashMap;
use std::sync::Arc;

use tauri::State;

use crate::commands::history::AppState;
use crate::http::client::HttpEngine;
use crate::http::interpolation;
use crate::models::error::HttpError;
use crate::models::request::{KeyValuePair, SendRequestParams};
use crate::models::response::ResponseData;
use crate::storage::history::HistoryEntry;

#[tauri::command]
pub async fn send_request(
    state: State<'_, AppState>,
    params: SendRequestParams,
    variables: Option<HashMap<String, String>>,
    collection_path: Option<String>,
    request_name: Option<String>,
) -> Result<ResponseData, String> {
    let vars = variables.unwrap_or_default();

    // Interpolate request fields
    let mut interpolated = params.clone();
    interpolated.url = interpolation::interpolate(&params.url, &vars);

    // Interpolate headers
    interpolated.headers = params
        .headers
        .iter()
        .map(|h| KeyValuePair {
            key: interpolation::interpolate(&h.key, &vars),
            value: interpolation::interpolate(&h.value, &vars),
            enabled: h.enabled,
        })
        .collect();

    // Interpolate query params
    interpolated.params = params
        .params
        .iter()
        .map(|p| KeyValuePair {
            key: interpolation::interpolate(&p.key, &vars),
            value: interpolation::interpolate(&p.value, &vars),
            enabled: p.enabled,
        })
        .collect();

    // Interpolate body content
    if let Some(ref body) = params.body {
        let mut new_body = body.clone();
        new_body.content = interpolation::interpolate(&body.content, &vars);
        // Interpolate form data values
        new_body.form_data = body
            .form_data
            .iter()
            .map(|fd| KeyValuePair {
                key: interpolation::interpolate(&fd.key, &vars),
                value: interpolation::interpolate(&fd.value, &vars),
                enabled: fd.enabled,
            })
            .collect();
        interpolated.body = Some(new_body);
    }

    // Interpolate auth token/values
    if let Some(ref auth) = params.auth {
        interpolated.auth = Some(interpolate_auth(auth, &vars));
    }

    tracing::info!(method = ?interpolated.method, url = %interpolated.url, "Sending request");

    let result = HttpEngine::send(interpolated.clone()).await;

    // Record history (fire-and-forget)
    let history_db = Arc::clone(&state.history_db);
    let method_str = format!("{:?}", interpolated.method);
    let url_str = interpolated.url.clone();
    let col_path = collection_path.clone();
    let req_name = request_name.clone();

    // Build a redacted request JSON for history (replace secret var values with [REDACTED])
    let request_json = serde_json::to_string(&params).unwrap_or_default();

    match &result {
        Ok(response) => {
            let entry = HistoryEntry {
                id: 0,
                method: method_str,
                url: url_str,
                status: Some(response.status as i32),
                status_text: Some(response.status_text.clone()),
                time_ms: Some(response.time_ms as i64),
                size_bytes: Some(response.size_bytes as i64),
                timestamp: chrono::Utc::now().to_rfc3339(),
                collection_path: col_path,
                request_name: req_name,
                request_json,
            };
            tokio::spawn(async move {
                if let Err(e) = history_db.insert(&entry) {
                    tracing::warn!("Failed to record history: {e}");
                }
            });
        }
        Err(_) => {
            let entry = HistoryEntry {
                id: 0,
                method: method_str,
                url: url_str,
                status: None,
                status_text: None,
                time_ms: None,
                size_bytes: None,
                timestamp: chrono::Utc::now().to_rfc3339(),
                collection_path: col_path,
                request_name: req_name,
                request_json,
            };
            tokio::spawn(async move {
                if let Err(e) = history_db.insert(&entry) {
                    tracing::warn!("Failed to record history: {e}");
                }
            });
        }
    }

    result.map_err(|e| {
        let http_error: HttpError = e.into();
        serde_json::to_string(&http_error).unwrap_or(http_error.message)
    })
}

fn interpolate_auth(
    auth: &crate::models::auth::AuthConfig,
    vars: &HashMap<String, String>,
) -> crate::models::auth::AuthConfig {
    use crate::models::auth::AuthConfig;
    match auth {
        AuthConfig::None => AuthConfig::None,
        AuthConfig::Bearer { token } => AuthConfig::Bearer {
            token: interpolation::interpolate(token, vars),
        },
        AuthConfig::Basic { username, password } => AuthConfig::Basic {
            username: interpolation::interpolate(username, vars),
            password: interpolation::interpolate(password, vars),
        },
        AuthConfig::ApiKey {
            key,
            value,
            add_to,
        } => AuthConfig::ApiKey {
            key: interpolation::interpolate(key, vars),
            value: interpolation::interpolate(value, vars),
            add_to: add_to.clone(),
        },
    }
}

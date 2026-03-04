use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::auth::AuthConfig;
use super::request::HttpMethod;

/// On-disk collection config (.apiark/apiark.yaml)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CollectionConfig {
    pub name: String,
    #[serde(default = "default_version")]
    pub version: u32,
    #[serde(default)]
    pub defaults: CollectionDefaults,
}

fn default_version() -> u32 {
    1
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CollectionDefaults {
    pub auth: Option<AuthConfig>,
    #[serde(default = "default_true")]
    pub send_cookies: bool,
    #[serde(default = "default_true")]
    pub store_cookies: bool,
    #[serde(default)]
    pub persist_cookies: bool,
}

fn default_true() -> bool {
    true
}

/// On-disk request file format (e.g. create-user.yaml)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RequestFile {
    pub name: String,
    pub method: HttpMethod,
    pub url: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub headers: HashMap<String, String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth: Option<AuthConfig>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub body: Option<RequestBodyFile>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub params: Option<HashMap<String, String>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub assert: Option<serde_yaml::Value>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tests: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pre_request_script: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub post_response_script: Option<String>,
}

/// Body stored in YAML files
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RequestBodyFile {
    #[serde(rename = "type")]
    pub body_type: String,
    #[serde(default)]
    pub content: String,
}

/// Optional folder config (_folder.yaml)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FolderConfig {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth: Option<AuthConfig>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub order: Vec<String>,
}

/// Lightweight metadata read from YAML without parsing full body/scripts
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RequestMeta {
    pub name: String,
    pub method: HttpMethod,
}

/// Recursive tree node sent to the frontend
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum CollectionNode {
    Collection {
        name: String,
        path: String,
        children: Vec<CollectionNode>,
    },
    Folder {
        name: String,
        path: String,
        children: Vec<CollectionNode>,
    },
    Request {
        name: String,
        method: HttpMethod,
        path: String,
    },
}

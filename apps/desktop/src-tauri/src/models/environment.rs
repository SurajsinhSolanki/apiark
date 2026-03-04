use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// On-disk environment file (environments/development.yaml)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentFile {
    pub name: String,
    #[serde(default)]
    pub variables: HashMap<String, String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub secrets: Vec<String>,
}

use std::collections::HashMap;
use std::path::Path;

use crate::models::environment::EnvironmentFile;
use crate::storage::environment;

#[tauri::command]
pub async fn load_environments(collection_path: String) -> Result<Vec<EnvironmentFile>, String> {
    let path = Path::new(&collection_path);
    tracing::debug!(path = %collection_path, "Loading environments");
    environment::load_environments(path)
}

#[tauri::command]
pub async fn save_environment(
    collection_path: String,
    env: EnvironmentFile,
) -> Result<(), String> {
    let path = Path::new(&collection_path);
    tracing::debug!(path = %collection_path, name = %env.name, "Saving environment");
    environment::save_environment(path, &env)
}

/// Resolve all variables for a given environment, merging env variables + .env secrets.
#[tauri::command]
pub async fn get_resolved_variables(
    collection_path: String,
    environment_name: String,
) -> Result<HashMap<String, String>, String> {
    let path = Path::new(&collection_path);

    // Load the named environment
    let envs = environment::load_environments(path)?;
    let env = envs
        .iter()
        .find(|e| e.name == environment_name)
        .ok_or_else(|| format!("Environment '{}' not found", environment_name))?;

    let mut variables = env.variables.clone();

    // Load secrets from .env file
    let secrets = environment::load_dotenv_secrets(path);

    // Merge secrets that are declared in the environment's secrets list
    for secret_key in &env.secrets {
        if let Some(value) = secrets.get(secret_key) {
            variables.insert(secret_key.clone(), value.clone());
        }
    }

    Ok(variables)
}

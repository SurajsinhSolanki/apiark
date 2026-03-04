use std::path::PathBuf;
use std::sync::Mutex;

use tauri::State;

use crate::storage::settings::{self, AppSettings};

pub struct SettingsState {
    pub settings: Mutex<AppSettings>,
    pub settings_path: PathBuf,
}

#[tauri::command]
pub async fn get_settings(state: State<'_, SettingsState>) -> Result<AppSettings, String> {
    let settings = state.settings.lock().map_err(|e| e.to_string())?;
    Ok(settings.clone())
}

#[tauri::command]
pub async fn update_settings(
    state: State<'_, SettingsState>,
    patch: serde_json::Value,
) -> Result<AppSettings, String> {
    let mut settings = state.settings.lock().map_err(|e| e.to_string())?;

    // Merge patch into current settings
    let mut current = serde_json::to_value(&*settings).map_err(|e| e.to_string())?;
    if let (Some(current_obj), Some(patch_obj)) = (current.as_object_mut(), patch.as_object()) {
        for (key, value) in patch_obj {
            current_obj.insert(key.clone(), value.clone());
        }
    }

    *settings = serde_json::from_value(current).map_err(|e| e.to_string())?;
    settings::save_settings(&state.settings_path, &settings)?;

    Ok(settings.clone())
}

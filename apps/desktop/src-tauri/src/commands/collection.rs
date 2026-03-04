use std::path::Path;

use crate::models::collection::{CollectionNode, RequestFile};
use crate::models::request::HttpMethod;
use crate::storage::collection;

#[tauri::command]
pub async fn open_collection(path: String) -> Result<CollectionNode, String> {
    let collection_path = Path::new(&path);
    tracing::info!(path = %path, "Opening collection");
    collection::load_collection_tree(collection_path)
}

#[tauri::command]
pub async fn read_request_file(path: String) -> Result<RequestFile, String> {
    let file_path = Path::new(&path);
    tracing::debug!(path = %path, "Reading request file");
    collection::read_request(file_path)
}

#[tauri::command]
pub async fn save_request_file(path: String, request: RequestFile) -> Result<(), String> {
    let file_path = Path::new(&path);
    tracing::debug!(path = %path, "Saving request file");
    collection::write_request(file_path, &request)
}

#[tauri::command]
pub async fn create_request(
    dir: String,
    filename: String,
    name: String,
    method: HttpMethod,
    url: String,
) -> Result<String, String> {
    let dir_path = Path::new(&dir);
    let request = RequestFile {
        name,
        method,
        url,
        description: None,
        headers: Default::default(),
        auth: None,
        body: None,
        params: None,
        assert: None,
        tests: None,
        pre_request_script: None,
        post_response_script: None,
    };
    let path = collection::create_request_file(dir_path, &filename, &request)?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn create_folder(parent: String, name: String) -> Result<String, String> {
    let parent_path = Path::new(&parent);
    let path = collection::create_folder(parent_path, &name)?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn delete_item(path: String, collection_name: String) -> Result<(), String> {
    let item_path = Path::new(&path);
    tracing::info!(path = %path, "Deleting item (moving to trash)");
    collection::delete_item(item_path, &collection_name)
}

#[tauri::command]
pub async fn rename_item(path: String, new_name: String) -> Result<String, String> {
    let item_path = Path::new(&path);
    tracing::info!(path = %path, new_name = %new_name, "Renaming item");
    let new_path = collection::rename_item(item_path, &new_name)?;
    Ok(new_path.to_string_lossy().to_string())
}

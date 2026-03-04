import { create } from "zustand";
import type { CollectionNode } from "@apiark/types";
import {
  openCollection as openCollectionApi,
  createRequest as createRequestApi,
  createFolder as createFolderApi,
  deleteItem as deleteItemApi,
  renameItem as renameItemApi,
} from "@/lib/tauri-api";

interface CollectionState {
  collections: CollectionNode[];
  expandedPaths: Set<string>;

  openCollection: (path: string) => Promise<void>;
  closeCollection: (path: string) => void;
  refreshCollection: (path: string) => Promise<void>;
  toggleExpand: (path: string) => void;
  createRequest: (
    dir: string,
    filename: string,
    name: string,
    collectionPath: string,
  ) => Promise<string>;
  createFolder: (parent: string, name: string) => Promise<string>;
  deleteItem: (
    path: string,
    collectionName: string,
    collectionPath: string,
  ) => Promise<void>;
  renameItem: (
    path: string,
    newName: string,
    collectionPath: string,
  ) => Promise<string>;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  expandedPaths: new Set<string>(),

  openCollection: async (path) => {
    // Don't open the same collection twice
    const existing = get().collections.find(
      (c) => c.type === "collection" && c.path === path,
    );
    if (existing) return;

    try {
      const tree = await openCollectionApi(path);
      set((state) => ({
        collections: [...state.collections, tree],
        expandedPaths: new Set([...state.expandedPaths, path]),
      }));
    } catch (err) {
      console.error("Failed to open collection:", err);
      throw err;
    }
  },

  closeCollection: (path) => {
    set((state) => ({
      collections: state.collections.filter(
        (c) => !(c.type === "collection" && c.path === path),
      ),
    }));
  },

  refreshCollection: async (path) => {
    try {
      const tree = await openCollectionApi(path);
      set((state) => ({
        collections: state.collections.map((c) =>
          c.type === "collection" && c.path === path ? tree : c,
        ),
      }));
    } catch (err) {
      console.error("Failed to refresh collection:", err);
    }
  },

  toggleExpand: (path) => {
    set((state) => {
      const newExpanded = new Set(state.expandedPaths);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return { expandedPaths: newExpanded };
    });
  },

  createRequest: async (dir, filename, name, collectionPath) => {
    const path = await createRequestApi(dir, filename, name);
    await get().refreshCollection(collectionPath);
    return path;
  },

  createFolder: async (parent, name) => {
    const path = await createFolderApi(parent, name);
    // Find which collection this belongs to and refresh
    for (const c of get().collections) {
      if (c.type === "collection" && parent.startsWith(c.path)) {
        await get().refreshCollection(c.path);
        break;
      }
    }
    return path;
  },

  deleteItem: async (path, collectionName, collectionPath) => {
    await deleteItemApi(path, collectionName);
    await get().refreshCollection(collectionPath);
  },

  renameItem: async (path, newName, collectionPath) => {
    const newPath = await renameItemApi(path, newName);
    await get().refreshCollection(collectionPath);
    return newPath;
  },
}));

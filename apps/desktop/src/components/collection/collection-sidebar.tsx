import { useState } from "react";
import { useCollectionStore } from "@/stores/collection-store";
import { CollectionTree } from "./collection-tree";
import { EnvironmentSelector } from "@/components/environment/environment-selector";
import { HistoryPanel } from "@/components/history/history-panel";
import { FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";

type SidebarSection = "collections" | "environments" | "history";

export function CollectionSidebar() {
  const { collections, openCollection } = useCollectionStore();
  const [expandedSections, setExpandedSections] = useState<Set<SidebarSection>>(
    new Set(["collections", "environments"]),
  );

  const toggleSection = (section: SidebarSection) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleOpenFolder = async () => {
    try {
      const selected = await open({ directory: true, multiple: false });
      if (selected) {
        await openCollection(selected as string);
      }
    } catch (err) {
      console.error("Failed to open folder:", err);
    }
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#2a2a2e] bg-[#141416]">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-[#2a2a2e] px-4">
        <span className="text-lg font-semibold text-[#3b82f6]">ApiArk</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Collections section */}
        <div>
          <button
            onClick={() => toggleSection("collections")}
            className="flex w-full items-center gap-1 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-[#a1a1aa]"
          >
            {expandedSections.has("collections") ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Collections
          </button>

          {expandedSections.has("collections") && (
            <div className="px-1 pb-2">
              {collections.length === 0 ? (
                <div className="px-3 py-4 text-center">
                  <p className="mb-3 text-xs text-[#52525b]">
                    No collections open
                  </p>
                  <button
                    onClick={handleOpenFolder}
                    className="flex w-full items-center justify-center gap-1.5 rounded bg-[#1c1c1f] px-3 py-2 text-xs text-[#a1a1aa] hover:bg-[#2a2a2e] hover:text-[#e4e4e7]"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    Open Folder
                  </button>
                </div>
              ) : (
                <>
                  {collections.map((collection) => (
                    <CollectionTree
                      key={collection.path}
                      nodes={
                        collection.type === "collection"
                          ? collection.children
                          : [collection]
                      }
                      collectionPath={collection.path}
                      collectionName={collection.name}
                    />
                  ))}
                  <button
                    onClick={handleOpenFolder}
                    className="mt-1 flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs text-[#52525b] hover:text-[#a1a1aa]"
                  >
                    <FolderOpen className="h-3 w-3" />
                    Open Another
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Environment section */}
        <div className="border-t border-[#2a2a2e]">
          <button
            onClick={() => toggleSection("environments")}
            className="flex w-full items-center gap-1 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-[#a1a1aa]"
          >
            {expandedSections.has("environments") ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Environment
          </button>
          {expandedSections.has("environments") && (
            <div className="px-3 pb-2">
              <EnvironmentSelector />
            </div>
          )}
        </div>

        {/* History section */}
        <div className="border-t border-[#2a2a2e]">
          <button
            onClick={() => toggleSection("history")}
            className="flex w-full items-center gap-1 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-[#a1a1aa]"
          >
            {expandedSections.has("history") ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            History
          </button>
          {expandedSections.has("history") && (
            <div className="pb-2">
              <HistoryPanel />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

import { useState } from "react";
import { useCollectionStore } from "@/stores/collection-store";
import { CollectionTree } from "./collection-tree";
import { EnvironmentSelector } from "@/components/environment/environment-selector";
import { HistoryPanel } from "@/components/history/history-panel";
import { FolderOpen, ChevronDown, ChevronRight, Settings } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { useSettingsStore } from "@/stores/settings-store";

type SidebarSection = "collections" | "environments" | "history";

interface CollectionSidebarProps {
  onOpenSettings?: () => void;
}

export function CollectionSidebar({ onOpenSettings }: CollectionSidebarProps) {
  const sidebarWidth = useSettingsStore((s) => s.settings.sidebarWidth);
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
    <aside
      className="flex shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-[var(--color-border)] px-4">
        <span className="text-lg font-semibold text-[var(--color-accent)]">ApiArk</span>
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-secondary)]"
            title="Settings (Ctrl+,)"
          >
            <Settings className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Collections section */}
        <div>
          <button
            onClick={() => toggleSection("collections")}
            className="flex w-full items-center gap-1 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
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
                  <p className="mb-3 text-xs text-[var(--color-text-dimmed)]">
                    No collections open
                  </p>
                  <button
                    onClick={handleOpenFolder}
                    className="flex w-full items-center justify-center gap-1.5 rounded bg-[var(--color-elevated)] px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)]"
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
                    className="mt-1 flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs text-[var(--color-text-dimmed)] hover:text-[var(--color-text-secondary)]"
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
        <div className="border-t border-[var(--color-border)]">
          <button
            onClick={() => toggleSection("environments")}
            className="flex w-full items-center gap-1 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
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
        <div className="border-t border-[var(--color-border)]">
          <button
            onClick={() => toggleSection("history")}
            className="flex w-full items-center gap-1 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
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

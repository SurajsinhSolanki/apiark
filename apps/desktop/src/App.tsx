import { useEffect } from "react";
import { CollectionSidebar } from "@/components/collection/collection-sidebar";
import { TabBar } from "@/components/tabs/tab-bar";
import { UrlBar } from "@/components/request/url-bar";
import { RequestPanel } from "@/components/request/request-panel";
import { ResponsePanel } from "@/components/response/response-panel";
import { useTabStore, useActiveTab } from "@/stores/tab-store";
import { useHistoryStore } from "@/stores/history-store";

function App() {
  const { newTab, closeTab, save } = useTabStore();
  const activeTab = useActiveTab();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      switch (e.key.toLowerCase()) {
        case "n":
        case "t":
          e.preventDefault();
          newTab();
          break;
        case "w":
          e.preventDefault();
          if (activeTab) closeTab(activeTab.id);
          break;
        case "s":
          e.preventDefault();
          save();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [newTab, closeTab, save, activeTab]);

  // Refresh history when a request completes
  useEffect(() => {
    if (activeTab && !activeTab.loading && (activeTab.response || activeTab.error)) {
      useHistoryStore.getState().loadHistory();
    }
  }, [activeTab?.loading, activeTab?.response, activeTab?.error]);

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-[#e4e4e7]">
      {/* Sidebar */}
      <CollectionSidebar />

      {/* Main Panel */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Tab Bar */}
        <TabBar />

        {activeTab ? (
          <>
            {/* URL Bar */}
            <UrlBar />

            {/* Request + Response split */}
            <div className="flex flex-1 overflow-hidden">
              <div className="flex w-1/2 flex-col border-r border-[#2a2a2e]">
                <RequestPanel />
              </div>
              <div className="flex w-1/2 flex-col">
                <ResponsePanel />
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  const { newTab } = useTabStore();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm text-[#52525b]">
        Open a request from the sidebar, or press{" "}
        <kbd className="rounded border border-[#2a2a2e] bg-[#1c1c1f] px-1.5 py-0.5 text-xs text-[#a1a1aa]">
          Ctrl+N
        </kbd>{" "}
        to create one
      </p>
      <button
        onClick={newTab}
        className="rounded bg-[#1c1c1f] px-4 py-2 text-sm text-[#a1a1aa] hover:bg-[#2a2a2e] hover:text-[#e4e4e7]"
      >
        New Request
      </button>
    </div>
  );
}

export default App;

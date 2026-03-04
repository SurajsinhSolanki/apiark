import * as Dialog from "@radix-ui/react-dialog";
import { X, Sun, Moon, Monitor } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import type { AppSettings } from "@apiark/types";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings } = useSettingsStore();

  const update = (patch: Partial<AppSettings>) => {
    updateSettings(patch);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[520px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            <Dialog.Title className="text-lg font-semibold text-[var(--color-text-primary)]">
              Settings
            </Dialog.Title>
            <Dialog.Close className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-6 p-6">
            {/* General Section */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                General
              </h3>

              {/* Theme */}
              <div className="mb-4">
                <label className="mb-2 block text-sm text-[var(--color-text-secondary)]">
                  Theme
                </label>
                <div className="flex gap-2">
                  {([
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "light", label: "Light", icon: Sun },
                    { value: "system", label: "System", icon: Monitor },
                  ] as const).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => update({ theme: value })}
                      className={`flex items-center gap-2 rounded px-4 py-2 text-sm transition-colors ${
                        settings.theme === value
                          ? "bg-[var(--color-accent)] text-white"
                          : "bg-[var(--color-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar width */}
              <div>
                <label className="mb-2 block text-sm text-[var(--color-text-secondary)]">
                  Sidebar Width: {settings.sidebarWidth}px
                </label>
                <input
                  type="range"
                  min={180}
                  max={400}
                  step={4}
                  value={settings.sidebarWidth}
                  onChange={(e) => update({ sidebarWidth: Number(e.target.value) })}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>
            </section>

            {/* Network Section */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Network
              </h3>

              {/* SSL Verification */}
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm text-[var(--color-text-secondary)]">
                  SSL Certificate Verification
                </label>
                <ToggleSwitch
                  checked={settings.verifySsl}
                  onChange={(v) => update({ verifySsl: v })}
                />
              </div>

              {/* Follow Redirects */}
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm text-[var(--color-text-secondary)]">
                  Follow Redirects
                </label>
                <ToggleSwitch
                  checked={settings.followRedirects}
                  onChange={(v) => update({ followRedirects: v })}
                />
              </div>

              {/* Timeout */}
              <div className="mb-4">
                <label className="mb-2 block text-sm text-[var(--color-text-secondary)]">
                  Request Timeout (ms)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={settings.timeoutMs}
                  onChange={(e) => update({ timeoutMs: Number(e.target.value) || 30000 })}
                  className="w-full rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              {/* Proxy */}
              <div>
                <label className="mb-2 block text-sm text-[var(--color-text-secondary)]">
                  Proxy URL
                </label>
                <input
                  type="text"
                  value={settings.proxyUrl ?? ""}
                  onChange={(e) => update({ proxyUrl: e.target.value || null })}
                  placeholder="http://proxy.example.com:8080"
                  className="mb-2 w-full rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-dimmed)] outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
                {settings.proxyUrl && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.proxyUsername ?? ""}
                      onChange={(e) => update({ proxyUsername: e.target.value || null })}
                      placeholder="Username (optional)"
                      className="flex-1 rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-dimmed)] outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    />
                    <input
                      type="password"
                      value={settings.proxyPassword ?? ""}
                      onChange={(e) => update({ proxyPassword: e.target.value || null })}
                      placeholder="Password (optional)"
                      className="flex-1 rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-dimmed)] outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

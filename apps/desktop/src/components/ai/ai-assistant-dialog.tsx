import * as Dialog from "@radix-ui/react-dialog";
import { X, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AiAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiAssistantDialog({ open, onOpenChange }: AiAssistantDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            <Dialog.Title className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-primary)]">
              <MessageSquare className="h-5 w-5 text-[var(--color-accent)]" />
              {t("ai.title")}
            </Dialog.Title>
            <Dialog.Close className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
              <MessageSquare className="h-7 w-7 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {t("ai.comingSoon")}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {t("ai.comingSoonDesc")}
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

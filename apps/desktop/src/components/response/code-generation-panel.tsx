import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { useActiveTab } from "@/stores/tab-store";
import { generateCurl, generateJsFetch, generatePythonRequests } from "@/lib/code-generators";

type Language = "curl" | "javascript" | "python";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "curl", label: "cURL" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
];

export function CodeGenerationPanel() {
  const tab = useActiveTab();
  const [language, setLanguage] = useState<Language>("curl");
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    if (!tab) return "";
    switch (language) {
      case "curl":
        return generateCurl(tab);
      case "javascript":
        return generateJsFetch(tab);
      case "python":
        return generatePythonRequests(tab);
    }
  }, [tab, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tab) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Language selector */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={`rounded px-3 py-1 text-xs transition-colors ${
                language === lang.value
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code display */}
      <div className="flex-1 overflow-auto p-3">
        <pre className="whitespace-pre-wrap break-all font-mono text-sm text-[var(--color-text-primary)]">
          {code}
        </pre>
      </div>
    </div>
  );
}

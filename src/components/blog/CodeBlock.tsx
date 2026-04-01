import { useEffect, useState, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { codeToHtml, type BundledLanguage, bundledLanguages } from "shiki";
import ansphereDark from "@/themes/anysphere-dark.json";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const createFallbackHtml = (rawCode: string) => {
  const lines = rawCode.split("\n");
  const safeLines = lines.map((line) => {
    // Preserve empty lines so line numbers match the source exactly.
    const escaped = escapeHtml(line);
    return escaped.length > 0 ? escaped : "&nbsp;";
  });

  return `<pre class="shiki" tabindex="0"><code>${safeLines
    .map((line) => `<span class="line">${line}</span>`)
    .join("")}</code></pre>`;
};

export const CodeBlock = ({ code, language = "typescript", filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lang = language in bundledLanguages ? (language as BundledLanguage) : "text";

    codeToHtml(code, {
      lang,
      themes: {
        dark: ansphereDark as any,
        light: "github-light",
      },
      defaultColor: false,
    }).then((html) => {
      setHighlightedHtml(html);
    });
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        {filename && <span className="code-filename">{filename}</span>}
        <div className="code-block-actions">
          <span className="code-lang">{language}</span>
          <button
            onClick={handleCopy}
            className="copy-btn"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="shiki-container"
        dangerouslySetInnerHTML={{
          __html: highlightedHtml || createFallbackHtml(code)
        }}
      />
    </div>
  );
};

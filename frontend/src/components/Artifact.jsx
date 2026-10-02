import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import Editor from "@monaco-editor/react";

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);

  const { artifacts } = useSelector((state) => state.message);

  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // No artifact available
  if (!artifacts || artifacts.length === 0) return null;

  // Files
  const file = artifacts[0]?.files?.[activeFile];

  const htmlFile = artifacts[0]?.files?.find(
    (f) => f.name === "index.html"
  );

  const cssFile = artifacts[0]?.files?.find(
    (f) => f.name === "style.css"
  );

  const jsFile = artifacts[0]?.files?.find(
    (f) => f.name === "script.js"
  );

  const canPreview = Boolean(htmlFile);

  /*
   * ---------------------------------------------------------
   * Normalize generated code before putting it inside iframe
   * ---------------------------------------------------------
   *
   * Some generated artifacts contain escaped characters such as:
   *
   *   \\n
   *   \\r
   *   \\t
   *   \\"
   *
   * The browser should receive:
   *
   *   actual newline
   *   actual quote
   *
   * instead of displaying the escape characters literally.
   */
  const normalizeContent = (content = "") => {
    if (!content) return "";

    let normalized = content;

    /*
     * Only decode escaped newline/tab/carriage-return sequences
     * when they are actually present as literal characters.
     */
    normalized = normalized
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"');

    return normalized;
  };

  // Normalize each file separately
  const htmlContent = normalizeContent(htmlFile?.content);
  const cssContent = normalizeContent(cssFile?.content);
  const jsContent = normalizeContent(jsFile?.content);

  // Preview document
  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <style>
    ${cssContent}
  </style>
</head>

<body>
  ${htmlContent}

  <script>
    ${jsContent}
  </script>
</body>
</html>
`;

  // Copy code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file?.content || "");

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Detect language
  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();

    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".c")) return "c";

    return "plaintext";
  };

  // Panel content
  const PanelContent = ({ onClose }) => {
    return (
      <>
        {!collapsed ? (
          <div className="flex flex-col h-full w-full bg-[#07090C]">

            {/* Header */}
            <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">

              {/* Close / Collapse */}
              <button
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
                onClick={
                  onClose
                    ? onClose
                    : () => setCollapsed(true)
                }
              >
                {onClose ? (
                  <X size={15} />
                ) : (
                  <PanelRightClose size={14} />
                )}
              </button>

              {/* Title */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/[0.18] shrink-0">
                  <Code2 size={15} />
                </div>

                <div className="text-[13px] font-medium text-slate-200 truncate">
                  {artifacts?.[0]?.title}
                </div>
              </div>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
                title="Copy code"
              >
                {copied ? (
                  <Check size={15} />
                ) : (
                  <Copy size={15} />
                )}
              </button>

              {/* Tabs */}
              {canPreview && (
                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg shrink-0">

                  {/* Code */}
                  <button
                    onClick={() => setTab("code")}
                    className={`
                      flex items-center gap-1.5
                      px-2.5 py-1
                      text-[11px]
                      font-medium
                      rounded-md
                      border
                      transition-colors
                      duration-150
                      ${
                        tab === "code"
                          ? "bg-indigo-500/10 border-[#35458A] text-[#8ea2ff]"
                          : "bg-transparent border-transparent text-slate-500 hover:bg-[#161D38] hover:text-[#A8B6FF] hover:border-[#4B5FC4]"
                      }
                    `}
                  >
                    <Code2 size={11} />
                    Code
                  </button>

                  {/* Preview */}
                  <button
                    onClick={() => setTab("preview")}
                    className={`
                      flex items-center gap-1.5
                      px-2.5 py-1
                      text-[11px]
                      font-medium
                      rounded-md
                      border
                      transition-colors
                      duration-150
                      ${
                        tab === "preview"
                          ? "bg-indigo-500/10 border-[#35458A] text-[#8ea2ff]"
                          : "bg-transparent border-transparent text-slate-500 hover:bg-[#161D38] hover:text-[#A8B6FF] hover:border-[#4B5FC4]"
                      }
                    `}
                  >
                    <Eye size={11} />
                    Preview
                  </button>

                </div>
              )}

            </div>

            {/* File tabs */}
            {tab === "code" && (
              <div className="h-auto flex border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">

                {artifacts[0]?.files?.map((f, index) => (
                  <button
                    key={f?.name || index}
                    onClick={() => setActiveFile(index)}
                    className={`
                      px-5 py-2.5
                      text-[11px]
                      font-medium
                      whitespace-nowrap
                      transition-colors
                      duration-150
                      border-r border-white/[0.05]
                      relative
                      cursor-pointer
                      ${
                        activeFile === index
                          ? "bg-indigo-500/10 text-[#8ea2ff]"
                          : "bg-transparent text-slate-500 hover:bg-[#161D38] hover:text-[#A8B6FF]"
                      }
                    `}
                  >
                    {f?.name}

                    {activeFile === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-indigo-300 rounded-t-full" />
                    )}
                  </button>
                ))}

              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-hidden">

              {tab === "preview" && canPreview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full bg-white"
                >
                  <iframe
                    title="preview"
                    srcDoc={previewDoc}
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-scripts"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <Editor
                    theme="vs-dark"
                    language={detectLanguage(file?.name)}
                    value={file?.content || ""}
                    options={{
                      readOnly: true,

                      minimap: {
                        enabled: false,
                      },

                      fontSize: 13,

                      wordWrap: "on",

                      automaticLayout: true,

                      scrollBeyondLastLine: false,

                      padding: {
                        top: 16,
                      },

                      lineNumbers: "on",

                      renderLineHighlight: "none",

                      smoothScrolling: true,

                      cursorBlinking: "smooth",

                      folding: true,
                    }}
                  />
                </motion.div>
              )}

            </div>

          </div>
        ) : (
          <div className="flex flex-col h-full w-full bg-[#07090C]">

            {/* Open button */}
            <div className="h-14 flex items-center justify-center border-b border-white/[0.06] shrink-0">

              <button
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
                onClick={() => setCollapsed(false)}
              >
                <PanelRightOpen size={14} />
              </button>

            </div>

            {/* Title */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div
                className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap"
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                }}
              >
                {artifacts?.[0]?.title}
              </div>
            </div>

          </div>
        )}
      </>
    );
  };

  return (
    <>
      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="
          lg:hidden
          fixed bottom-24 right-4 z-40
          flex items-center gap-2
          px-3.5 py-2
          rounded-xl
          bg-indigo-600
          hover:bg-indigo-500
          text-white
          text-[12px] font-medium
          shadow-lg shadow-indigo-500/20
          border-none cursor-pointer
          transition-colors duration-150
        "
      >
        <Code2 size={13} />
        View Code
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[88vw] max-w-[420px] border-l border-white/[0.06] overflow-hidden"
            >
              <PanelContent
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop panel */}
      <motion.div
        initial={{ width: 350 }}
        animate={{
          width: collapsed ? 48 : 350,
        }}
        transition={{
          duration: 0.25,
          ease: easeInOut,
        }}
        className="hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0"
      >
        <PanelContent />
      </motion.div>
    </>
  );
}

export default Artifact;
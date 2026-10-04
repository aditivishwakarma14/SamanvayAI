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

  if (!artifacts || artifacts.length === 0) {
    return null;
  }

  const artifact = artifacts[0];
  const files = artifact?.files || [];
  const file = files[activeFile];

  const htmlFile = files.find(
    (item) => item?.name?.toLowerCase() === "index.html"
  );

  const cssFile = files.find(
    (item) => item?.name?.toLowerCase() === "style.css"
  );

  const jsFile = files.find(
    (item) => item?.name?.toLowerCase() === "script.js"
  );

  const canPreview = Boolean(htmlFile);

  const cleanHtml = (html = "") => {
    let result = html;

    // Remove external JavaScript references.
    result = result.replace(
      /<script\b[^>]*\bsrc\s*=\s*["'][^"']*["'][^>]*>\s*<\/script>/gi,
      ""
    );

    // Remove external stylesheet references.
    result = result.replace(
      /<link\b[^>]*\bhref\s*=\s*["'][^"']*\.css(?:\?[^"']*)?["'][^>]*>/gi,
      ""
    );

    return result;
  };

  const buildPreviewDocument = () => {
    if (!htmlFile?.content) {
      return "";
    }

    const html = cleanHtml(htmlFile.content);
    const css = cssFile?.content || "";
    const js = jsFile?.content || "";

    // If generated HTML already contains a complete document.
    if (/<html[\s>]/i.test(html)) {
      let documentHtml = html;

      // Inject CSS before </head>.
      if (/<\/head>/i.test(documentHtml)) {
        documentHtml = documentHtml.replace(
          /<\/head>/i,
          `
<style>
${css}
</style>
</head>`
        );
      } else {
        documentHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <style>
    ${css}
  </style>
</head>
<body>
  ${documentHtml}
</body>
</html>
`;
      }

      // Inject JavaScript before </body>.
      if (/<\/body>/i.test(documentHtml)) {
        documentHtml = documentHtml.replace(
          /<\/body>/i,
          `
<script>
${js}
</script>
</body>`
        );
      } else {
        documentHtml += `
<script>
${js}
</script>
`;
      }

      return documentHtml;
    }

    // If generated HTML only contains body content.
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <style>
    ${css}
  </style>
</head>

<body>
  ${html}

  <script>
    ${js}
  </script>
</body>
</html>
`;
  };

  const previewDoc = buildPreviewDocument();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file?.content || "");

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

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

  const PanelContent = ({ onClose }) => {
    return (
      <>
        {!collapsed ? (
          <div className="flex flex-col h-full bg-[#07090C]">
            {/* Header */}
            <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
              <button
                className="
                  flex items-center justify-center
                  w-7 h-7
                  rounded-lg
                  text-slate-500
                  hover:text-slate-200
                  hover:bg-white/[0.05]
                  transition-colors duration-150
                  bg-transparent
                  border-none
                  cursor-pointer
                  shrink-0
                "
                onClick={
                  onClose
                    ? onClose
                    : () => setCollapsed(true)
                }
              >
                {onClose ? (
                  <X size={15} />
                ) : (
                  <PanelRightClose size={16} />
                )}
              </button>

              {/* Title */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                  <Code2
                    className="text-indigo-400"
                    size={12}
                  />
                </div>

                <div className="text-[13px] font-medium text-slate-200 truncate">
                  {artifact?.title}
                </div>
              </div>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="
                  flex items-center gap-1.5
                  px-2.5 py-1.5
                  text-[11px]
                  font-medium
                  text-slate-400
                  hover:text-slate-200
                  hover:bg-white/[0.05]
                  rounded-lg
                  transition-colors duration-150
                  bg-transparent
                  border-none
                  cursor-pointer
                "
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy
                  </>
                )}
              </button>

              {/* Tabs */}
              {canPreview && (
                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
                  <button
                    onClick={() => setTab("code")}
                    className={`
                      flex items-center gap-1.5
                      px-2.5 py-1
                      text-[11px]
                      font-medium
                      rounded-md
                      transition-colors duration-150
                      ${
                        tab === "code"
                          ? "bg-[#101124] text-indigo-300 border border-indigo-500/70"
                          : "text-slate-500 hover:text-slate-200 border border-transparent"
                      }
                    `}
                  >
                    <Code2 size={11} />
                    Code
                  </button>

                  <button
                    onClick={() => setTab("preview")}
                    className={`
                      flex items-center gap-1.5
                      px-2.5 py-1
                      text-[11px]
                      font-medium
                      rounded-md
                      transition-colors duration-150
                      ${
                        tab === "preview"
                          ? "bg-[#101124] text-indigo-300 border border-indigo-500/70"
                          : "text-slate-500 hover:text-slate-200 border border-transparent"
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
              <div className="flex h-auto border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
                {files.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveFile(index)}
                    className={`
                      px-4 py-2.5
                      text-[11px]
                      font-medium
                      whitespace-nowrap
                      transition-colors duration-150
                      border-r border-white/[0.05]
                      relative
                      cursor-pointer
                      bg-transparent
                      ${
                        activeFile === index
                          ? "text-indigo-400"
                          : "text-slate-500 hover:text-slate-300"
                      }
                    `}
                  >
                    {item.name}

                    {activeFile === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Editor / Preview */}
            <div className="flex-1 overflow-hidden">
              {tab === "preview" && canPreview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <iframe
                    title="preview"
                    srcDoc={previewDoc}
                    sandbox="allow-scripts"
                    className="w-full h-full bg-white"
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
                    }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex h-full border-l border-white/[0.06] bg-[#07090C] flex-col items-center py-4 gap-3 shrink-0">
            <button
              className="
                flex items-center justify-center
                w-7 h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/[0.05]
                transition-colors duration-150
                bg-transparent
                border-none
                cursor-pointer
                shrink-0
              "
              onClick={() => setCollapsed(false)}
            >
              <PanelRightOpen size={16} />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="
                  text-[10px]
                  font-medium
                  text-slate-600
                  tracking-widest
                  uppercase
                  whitespace-nowrap
                "
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                }}
              >
                {artifact?.title}
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
          fixed
          bottom-24
          right-4
          z-40
          flex
          items-center
          gap-2
          px-4
          py-2.5
          rounded-xl
          bg-[#101124]
          hover:bg-[#15162d]
          border
          border-indigo-500/70
          text-indigo-300
          text-[12px]
          font-medium
          shadow-none
          cursor-pointer
          transition-colors
          duration-150
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
              className="
                lg:hidden
                fixed
                inset-0
                z-50
                bg-black/60
                backdrop-blur-sm
              "
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              className="
                lg:hidden
                fixed
                inset-y-0
                right-0
                z-50
                w-[88vw]
                max-w-[420px]
                border-l
                border-white/[0.06]
                overflow-hidden
                bg-[#07090C]
              "
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
        initial={{ width: 400 }}
        animate={{
          width: collapsed ? 48 : 400,
        }}
        transition={{
          duration: 0.25,
          ease: easeInOut,
        }}
        className="
          hidden
          lg:flex
          h-full
          border-l
          border-white/[0.06]
          flex-col
          overflow-hidden
          shrink-0
        "
      >
        <PanelContent />
      </motion.div>
    </>
  );
}

export default Artifact;
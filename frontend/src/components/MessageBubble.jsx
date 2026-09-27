import {
  Check,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


/* =========================================================
   CUSTOM CODE THEME
   SamanvayAI UI COLORS
========================================================= */

const codeTheme = {
  ...oneDark,

  "pre[class*='language-']": {
    ...oneDark["pre[class*='language-']"],
    background: "#111318",
    color: "#cbd5e1",
    margin: 0,
  },

  "code[class*='language-']": {
    ...oneDark["code[class*='language-']"],
    background: "transparent",
    color: "#cbd5e1",
  },

  comment: {
    color: "#64748b",
  },

  punctuation: {
    color: "#94a3b8",
  },

  tag: {
    color: "#a5b4fc",
  },

  "attr-name": {
    color: "#c4b5fd",
  },

  "attr-value": {
    color: "#93c5fd",
  },

  string: {
    color: "#93c5fd",
  },

  keyword: {
    color: "#a5b4fc",
  },

  function: {
    color: "#c4b5fd",
  },

  boolean: {
    color: "#a5b4fc",
  },

  number: {
    color: "#c4b5fd",
  },

  operator: {
    color: "#94a3b8",
  },

  doctype: {
    color: "#94a3b8",
  },

  property: {
    color: "#c4b5fd",
  },

  variable: {
    color: "#cbd5e1",
  },
};


function MessageBubble({ role, content, images }) {

  const isUser = role === "user";

  const [lightBox, setLightBox] = useState(null);

  const [copiedCode, setCopiedCode] = useState("");


  /* =========================================================
     COPY CODE
  ========================================================= */

  const copyCode = async (code) => {
    try {

      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);

    } catch (error) {

      console.error("COPY CODE ERROR:", error);

    }
  };


  return (

    <div
      className={`flex w-full px-5 my-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      {/* =====================================================
          MESSAGE CONTAINER
      ===================================================== */}

      <div
        className={`max-w-[72%] px-4 py-3 rounded-xl text-[13.5px] leading-relaxed border ${
          isUser
            ? "bg-indigo-500/10 border-indigo-500/[0.18] text-slate-200 rounded-tr-sm"
            : "bg-white/[0.03] border-white/[0.03] text-slate-200 rounded-tl-sm"
        }`}
      >

        {/* ===================================================
            USER MESSAGE
        =================================================== */}

        {isUser ? (

          content

        ) : (

          <>

            {/* =================================================
                MARKDOWN
            ================================================= */}

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}

              components={{

                /* =============================================
                   HEADINGS
                ============================================= */

                h1: ({ children }) => (

                  <h1 className="text-xl font-semibold mb-3 text-white">

                    {children}

                  </h1>

                ),

                h2: ({ children }) => (

                  <h2 className="text-lg font-semibold mt-5 mb-3 text-white">

                    {children}

                  </h2>

                ),

                h3: ({ children }) => (

                  <h3 className="text-base font-semibold mt-4 mb-2 text-white">

                    {children}

                  </h3>

                ),


                /* =============================================
                   PARAGRAPH
                ============================================= */

                p: ({ children }) => (

                  <p className="mb-2 last:mb-0">

                    {children}

                  </p>

                ),


                /* =============================================
                   BOLD
                ============================================= */

                strong: ({ children }) => (

                  <strong className="font-semibold text-white">

                    {children}

                  </strong>

                ),


                /* =============================================
                   ITALIC
                ============================================= */

                em: ({ children }) => (

                  <em className="italic">

                    {children}

                  </em>

                ),


                /* =============================================
                   UNORDERED LIST
                ============================================= */

                ul: ({ children }) => (

                  <ul className="list-disc ml-5 my-3 space-y-1">

                    {children}

                  </ul>

                ),


                /* =============================================
                   ORDERED LIST
                ============================================= */

                ol: ({ children }) => (

                  <ol className="list-decimal ml-5 my-3 space-y-1">

                    {children}

                  </ol>

                ),


                /* =============================================
                   LIST ITEM
                ============================================= */

                li: ({ children }) => (

                  <li className="pl-1">

                    {children}

                  </li>

                ),


                /* =============================================
                   LINKS
                ============================================= */

                a: ({ href, children }) => (

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline"
                  >

                    {children}

                    <ExternalLink size={13} />

                  </a>

                ),


                /* =============================================
                   CODE
                ============================================= */

                code: ({ className, children }) => {

                  const value = String(children).replace(
                    /\n$/,
                    ""
                  );


                  /* ---------------------------------------------
                     INLINE CODE
                  --------------------------------------------- */

                  if (!className) {

                    return (

                      <code className="px-1.5 py-0.5 rounded-md bg-black/30 text-indigo-200 text-[13px]">

                        {children}

                      </code>

                    );

                  }


                  /* ---------------------------------------------
                     LANGUAGE
                  --------------------------------------------- */

                  const language = className
                    .replace("language-", "")
                    .replace("lang-", "");


                  /* ---------------------------------------------
                     CODE BLOCK
                  --------------------------------------------- */

                  return (

                    <div className="my-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111318]">

                      {/* =======================================
                          CODE HEADER
                      ======================================= */}

                      <div className="flex items-center justify-between bg-[#1b1d24] border-b border-white/[0.08] px-4 py-2">

                        <span className="uppercase text-xs text-slate-400">

                          {language || "code"}

                        </span>


                        {/* COPY BUTTON */}

                        <button
                          type="button"
                          onClick={() => copyCode(value)}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                        >

                          {copiedCode === value ? (

                            <>

                              <Check size={14} />

                              Copied

                            </>

                          ) : (

                            <>

                              <Copy size={14} />

                              Copy

                            </>

                          )}

                        </button>

                      </div>


                      {/* =======================================
                          SYNTAX HIGHLIGHTER
                      ======================================= */}

                      <div className="overflow-x-auto">

                        <SyntaxHighlighter
                          language={language || "text"}
                          style={codeTheme}
                          wrapLongLines
                          showLineNumbers

                          customStyle={{
                            margin: 0,
                            padding: "16px",
                            background: "#111318",
                            fontSize: "13px",
                            lineHeight: "1.6",
                          }}

                          lineNumberStyle={{
                            color: "#64748b",
                            minWidth: "2.5em",
                            paddingRight: "1em",
                            userSelect: "none",
                          }}

                          codeTagProps={{
                            style: {
                              fontFamily:
                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            },
                          }}
                        >

                          {value}

                        </SyntaxHighlighter>

                      </div>

                    </div>

                  );

                },


                /* =============================================
                   PRE
                ============================================= */

                pre: ({ children }) => (

                  <>

                    {children}

                  </>

                ),


                /* =============================================
                   BLOCKQUOTE
                ============================================= */

                blockquote: ({ children }) => (

                  <blockquote className="my-3 border-l-2 border-indigo-500/50 pl-4 text-slate-400">

                    {children}

                  </blockquote>

                ),


                /* =============================================
                   HORIZONTAL LINE
                ============================================= */

                hr: () => (

                  <hr className="my-4 border-white/[0.12]" />

                ),


                /* =============================================
                   TABLE
                ============================================= */

                table: ({ children }) => (

                  <div className="overflow-x-auto my-4 rounded-lg">

                    <table className="w-full border-collapse text-sm border border-white/[0.10]">

                      {children}

                    </table>

                  </div>

                ),


                /* =============================================
                   TABLE HEADER
                ============================================= */

                thead: ({ children }) => (

                  <thead className="bg-indigo-500/[0.10]">

                    {children}

                  </thead>

                ),


                th: ({ children }) => (

                  <th className="border border-white/[0.10] px-3 py-2 text-left font-semibold text-white whitespace-nowrap">

                    {children}

                  </th>

                ),


                /* =============================================
                   TABLE BODY
                ============================================= */

                tbody: ({ children }) => (

                  <tbody>

                    {children}

                  </tbody>

                ),


                /* =============================================
                   TABLE ROW
                ============================================= */

                tr: ({ children }) => (

                  <tr className="hover:bg-white/[0.03] transition-colors">

                    {children}

                  </tr>

                ),


                /* =============================================
                   TABLE DATA
                ============================================= */

                td: ({ children }) => (

                  <td className="border border-white/[0.10] px-3 py-2 text-slate-300">

                    {children}

                  </td>

                ),

              }}
            >

              {content}

            </ReactMarkdown>


            {/* =================================================
                SEARCH IMAGES
            ================================================= */}

            {images?.length > 0 && (

              <div className="flex flex-wrap gap-3 mt-4">

                {images.map((img, i) => (

                  <img
                    key={i}
                    src={img}
                    alt=""
                    loading="lazy"

                    onClick={() => {
                      setLightBox(img);
                    }}

                    onError={(e) => {
                      e.currentTarget.remove();
                    }}

                    className="w-40 h-28 rounded-xl object-cover border border-white/[0.08] cursor-zoom-in hover:opacity-90 transition"
                  />

                ))}

              </div>

            )}

          </>

        )}

      </div>


      {/* =====================================================
          IMAGE LIGHTBOX
      ===================================================== */}

      {lightBox && (

        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"

          onClick={() => {
            setLightBox(null);
          }}
        >

          {/* CLOSE BUTTON */}

          <button
            type="button"

            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"

            onClick={(e) => {

              e.stopPropagation();

              setLightBox(null);

            }}
          >

            <X size={20} />

          </button>


          {/* LARGE IMAGE */}

          <img
            src={lightBox}
            alt=""

            onClick={(e) => {
              e.stopPropagation();
            }}

            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />

        </div>

      )}

    </div>

  );

}

export default MessageBubble;
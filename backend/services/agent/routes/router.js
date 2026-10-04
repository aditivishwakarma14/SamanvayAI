import { getModel } from "../config/llmModel.js";

export const router = async (state) => {

  // Manual agent selection
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }

  // Detect uploaded file
  const mimeType =
    state.file?.mimetype ||
    state.file?.mimeType ||
    state.file?.type ||
    "";

  // PDF -> PDF RAG
  if (mimeType === "application/pdf") {
    return {
      ...state,
      agent: "pdfRag",
    };
  }

  // Image -> Image Analyzer
  if (mimeType.startsWith("image/")) {
    return {
      ...state,
      agent: "imageAnalyzer",
    };
  }

  const llm = await getModel("router");

  const prompt = `You are an intelligent agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- imageGen

Rules:

chat:
General conversation, explanations, learning, casual questions,
and questions that can be answered without external information.

search:
Questions requiring internet or external information,
including current, latest, recent, real-time, live,
time-sensitive, or externally verifiable information.

coding:
Programming, debugging, code generation, algorithms,
software development, APIs, architecture, and technical implementation.

pdf:
Generating, creating, modifying, or working with PDF documents.

ppt:
Generating, creating, modifying, or working with PowerPoint presentations.

imageGen:
Requests to generate, create, edit, modify, design,
or visualize images.

Important:
- Do not hardcode specific keywords.
- Understand the meaning and intent of the user's query.
- Choose search when external or up-to-date information is required.
- Choose coding for programming and software development tasks.
- Choose imageGen for image generation or image editing requests.
- Return ONLY ONE agent name.

Valid outputs:

chat
search
coding
pdf
ppt
imageGen

User Query:
${state.prompt}`;

  const response = await llm.invoke(prompt);

  const selectedAgent = response.content
    .trim()
    .toLowerCase();

  return {
    ...state,
    agent: selectedAgent,
  };
};
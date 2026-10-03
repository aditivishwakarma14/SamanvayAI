import { getModel } from "../config/llmModel.js";

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }

   if(state.file.mimeType === "application/pdf"){
    return {
      ...state ,
      agent :  "pdfRag"
    }
   }

    if(state.file.mimeType.startsWith === "image/"){
    return {
      ...state ,
      agent :  "imageAnalyzer"
    }
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

- chat: General conversation, explanations, learning, casual questions, and questions that can be answered from general knowledge without needing external information.

- search: Any query that requires information from the internet, including current, latest, recent, real-time, live, time-sensitive, factual, or externally verifiable information. Use search whenever external information is needed.

- coding: Programming, debugging, code generation, algorithms, errors, and software development.

- pdf: Questions about generating or working with PDFs or PDF documents.

- ppt: Questions about generating or working with PowerPoint/PPT presentations.

- imageGen: Requests to generate, create, edit, modify, or visualize images.

Important:
- Do not hardcode specific keywords or queries.
- Decide based on the meaning and information requirements of the user's request.
- If the answer requires up-to-date or externally retrieved information, choose search.
- If the answer can be answered naturally without external information, choose chat.

Return ONLY ONE word:
chat
search
coding
pdf
ppt
imageGen

User Query:
${state.prompt}`;

  const response = await llm.invoke(prompt);

  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
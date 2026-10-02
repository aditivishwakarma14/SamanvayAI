import { StateGraph } from "@langchain/langgraph";

import { agentState } from "./state.js";

import { router } from "../routes/router.js";

import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { imageGenAgent } from "../agents/imageGen.agent.js";

const workflow = new StateGraph(agentState);

// Nodes
workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("imageGen", imageGenAgent);

// Start
workflow.addEdge("__start__", "router");

// Routing
workflow.addConditionalEdges(
  "router",

  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";

      case "search":
        return "search";

      case "coding":
        return "coding";

      case "pdf":
        return "pdf";

      case "ppt":
        return "ppt";

      case "image":
      case "imageGen":
        return "imageGen";

      default:
        return "chat";
    }
  },

  {
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    image: "imageGen",
    imageGen: "imageGen",
  }
);

// Edges
workflow.addEdge("search", "chat");

workflow.addEdge("chat", "__end__");

workflow.addEdge("coding", "__end__");

workflow.addEdge("pdf", "__end__");

workflow.addEdge("ppt", "__end__");

workflow.addEdge("imageGen", "__end__");

// Compile
export const graph = workflow.compile();
import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "../routes/router.js";
import { chatAgent } from "../agents/chat.agent";
import { searchAgent } from "../agents/search.agent";
import { codingAgent } from "../agents/coding.agent";
import { pdfAgent } from "../agents/pdf.agent";
import { pptAgent } from "../agents/ppt.agent";
import { imageGenAgent } from "../agents/imageGen.agent";

const workflow = new StateGraph(agentState)

workflow.addNode("router" , router)
workflow.addNode("chat" , chatAgent)
workflow.addNode("search" , searchAgent)
workflow.addNode("coding" , codingAgent)
workflow.addNode("pdf" , pdfAgent)
workflow.addNode("ppt" , pptAgent)
workflow.addNode("imageGen" , imageGenAgent)

workflow.addEdge("__start__" , "router")
workflow.addConditionalEdges("router" , (state)=>{
    // jo state hai uske andar k agent ko dekho ki kon sa agent use karna hai
    switch(state.agent) {
    case "chat":
        return "chat" ;
    case "search":
        return "search" ;
    case "coding":
        return "coding" ;
    case "pdf":
        return "pdf" ;
    case "ppt":
        return "ppt" ;
    case "imageGen":
        return "imageGen" ;
        
    default:
        break ;
    }
}, 
{
    chat : "chat" ,
    search : "search" ,
    coding : "coding" ,
    pdf : "pdf" ,
    ppt : "ppt" ,
    imageGen : "imageGen"

}) 
workflow.addEdge("search", "chat")
workflow.addEdge("chat" , "__end__")
workflow.addEdge("coding" , "__end__")
workflow.addEdge("pdf" , "__end__")
workflow.addEdge("ppt" , "__end__")
workflow.addEdge("imageGen" , "__end__")

export const graph = workflow.compile()

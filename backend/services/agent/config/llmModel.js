import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter"

import "dotenv/config"

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
})

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
})

const imageGemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
})

const openrouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
})

export const getModel = async (agent) => {

    switch (agent) {

        case "chat":
            return groq

        case "search":
            return gemini

        case "coding":
            return openrouter

        case "imageAnalyzer":
            return imageGemini

        default:
            return groq
    }
}
import { getModel } from "../config/llmModel"

export const chatAgent = async () => {
    const llm = await getModel("chat")
    const prompt = "You are SamanvayAI , an intelligent AI assistant"
    const response = (await llm).invoke([
       {
        "role" :"system" ,
        "content" : promt
       },
       { "role" : human ,
        "content" : state.prompt
       }
    ])
    
    return {
        ...state ,
        aiResponse : (await response).content
    }

}
import { getModel } from "../config/llmModel.js"

export const router = async (state) => {
    const llm =  await getModel("router")

    const promt  = `You are an agent router.

    Available agents:
    - chat
    - search
    - coding
    - pdf
    - ppt
    - image

    Rules:
    - chat: General conversation, explanations, learning, and casual questions.
    - search: Queries requiring current, latest, real-time, or web information.
    - coding: Programming, debugging, code generation, algorithms, errors, and software development.
    - pdf: Questions about generating or working with PDFs or PDF documents.
    - ppt: Questions about generating or working with PowerPoint/PPT presentations.
    - image: Requests to generate, create, edit, modify, or visualize images.

    imageGen for image generation

    Return ONLY ONE word:
    chat
    search
    coding
    pdf
    ppt
    imageGen

    User Query:
    ${state.promt}`
    
    const response = await llm.invoke(promt)    

    return {
        ...state ,
        agent:response.content
              .trim()
              .toLowerCase()
    }


}



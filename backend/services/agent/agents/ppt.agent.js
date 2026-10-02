import { getModel } from "../config/llmModel.js"
import { generatePpt } from "../utils/generatePpt.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"
// import { deductCredits } from "../utils/deductCredits.js"
// import { checkAgentLimit } from "../config/agentLimit.js"
export const pptAgent=async (state) => {
    try {
        // await checkAgentLimit(state.userId,"ppt")
        const llm=await getModel("ppt")
        
    const prompt = `You are a professional presentation designer and content strategist.

    Return ONLY valid JSON in the exact format below:

    {
    "title": "",
    "subtitle": "",
    "slides": [
        {
        "title": "",
        "points": ["", "", "", ""]
        }
    ]
    }

    Rules:
    - Generate exactly 6 content slides.
    - Each slide must contain 4-6 concise, meaningful bullet points.
    - Keep the content clear, professional, and presentation-friendly.
    - Maintain a logical flow from introduction to conclusion.
    - Avoid repetitive points and unnecessary details.
    - Use simple language suitable for a professional audience.
    - Do not use markdown, special formatting, or code blocks.
    - Return ONLY valid JSON with no additional explanation.

    Topic:
    ${state.prompt}`;

const res=await llm.invoke(prompt)
const data=JSON.parse(res.content)
// await deductCredits(state.userId,"ppt")
const ppt=await generatePpt(data)
const buffer=await ppt.write({
    outputType:"nodebuffer"
})

const filename=`ppt-${Date.now()}.pptx`

await uploadToS3(filename,buffer,"application/vnd.openxmlformats-officedocument.presentationml.presentation")
const downloadUrl=await getFromS3(filename,24*60*60)

return {
    ...state,
    aiResponse:`# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 10 minutes._`
}

    } catch (error) {
        console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate ppt"
        }
       

       
    }
}
import fs from "fs"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { vectorStore } from "../config/vectorDb.js"
import { getModel } from "../config/llmModel.js"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"

export const pdfRag = async (state) => {
  try {
    await checkAgentLimit(state.userId, "pdf")

    const buffer = fs.readFileSync(state.file.path)

    const pdf = new PDFParse({
      data: buffer
    })

    const result = await pdf.getText()
    const text = result.text

    console.log("PDF TEXT LENGTH:", text?.length)
    console.log("PDF TEXT PREVIEW:", text?.slice(0, 1000))

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })

    const docs = await splitter.createDocuments([text])

    console.log("PDF CHUNKS:", docs.length)

    const collectionName = `pdf-${Date.now()}`

    const store = await vectorStore(
      docs,
      collectionName
    )

    /*
     * For summary/analysis requests, use the PDF chunks directly.
     * For specific questions, use semantic search.
     */
    const prompt = state.prompt.toLowerCase()

    const isSummaryRequest =
      prompt.includes("summarize") ||
      prompt.includes("summary") ||
      prompt.includes("analyze") ||
      prompt.includes("analyse") ||
      prompt.includes("overview") ||
      prompt.includes("what is this pdf") ||
      prompt.includes("tell me about this pdf")

    let relevantDocs

    if (isSummaryRequest) {
      relevantDocs = docs
    } else {
      relevantDocs = await store.similaritySearch(
        state.prompt,
        5
      )
    }

    console.log("RELEVANT DOCS:", relevantDocs.length)

    const context = relevantDocs
      .map((doc) => doc.pageContent)
      .join("\n\n")

    console.log(
      "CONTEXT PREVIEW:",
      context.slice(0, 3000)
    )

    const llm = await getModel("pdf-rag")

    const messages = [
      new SystemMessage(`
You are Samanvay AI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.
- Never make up information.
- If the answer is not present in the PDF, reply:
"I couldn't find this information in the uploaded PDF."
- Use Markdown formatting.
- For summary or analysis requests, summarize the important information from the provided PDF context.
- Keep the answer clear, structured, and useful.
`),

      new HumanMessage(`
PDF Context:

${context}

User Question:

${state.prompt}
`)
    ]

    const response = await llm.invoke(messages)

    await deductCredits(state.userId, "pdf")

    console.log("PDF RAG RESPONSE:", response.content)

    return {
      ...state,
      aiResponse: response.content
    }

  } catch (error) {
    console.log("PDF RAG ERROR:", error)

    return {
      ...state,
      aiResponse:
        error?.data?.message ||
        "failed to analyze pdf"
    }

  } finally {
    if (state.file?.path && fs.existsSync(state.file.path)) {
      fs.unlinkSync(state.file.path)
    }
  }
}
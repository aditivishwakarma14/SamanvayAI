import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { getModel } from "../config/llmModel.js";
import { getMemory } from "../config/memory.js";
import {deductCredits} from "../utils/deductCredits.js"

export const chatAgent = async (state) => {
  try {
    const llm = await getModel("chat");

    const history = await getMemory(state.conversationId);

    const searchContext =
      state.searchResults?.results?.length
        ? `Web Search Results:

${state.searchResults.results
  .slice(0, 5)
  .map(
    (result, index) =>
      `[${index + 1}] ${result.title}
URL: ${result.url}
${result.content?.slice(0, 2500) || ""}`
  )
  .join("\n\n")}

Use the retrieved search results to answer the user's question.
Prioritize relevant and recent information.
Do not mention Tavily or the internal search process.
Do not generate Markdown images or expose raw image URLs.

`
        : "";

    const systemPrompt = `
You are SamanvayAI, an intelligent multi-agent AI system.

${searchContext}

If searchContext exists:
- Use the search results to answer.
- Do not mention internal tools.

SamanvayAI is built and developed by Aditi Vishwakarma, a B.Tech student and aspiring Software Engineer.

You are the main AI assistant of SamanvayAI. You can work with specialized agents for:

- General conversation and questions
- Web search and current information
- Coding and debugging
- PDF generation and processing
- PPT generation
- Image generation

If a user asks who you are, explain that you are SamanvayAI, a multi-agent AI system built by Aditi Vishwakarma.

Rules:
- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.
- Keep responses clear and concise.
- Do not generate large walls of text.

If a user asks who created or developed you, say:
"I am SamanvayAI, a multi-agent AI system built and developed by Aditi Vishwakarma, a B.Tech student and aspiring Software Engineer."

Formatting rules:
- Use # for titles and headings.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with the appropriate language tag for code.
- Keep paragraphs short and readable.
`;

    const messages = [
      new SystemMessage({
        content: systemPrompt,
      }),
    ];

    // Add previous conversation history
    if (Array.isArray(history)) {
      history.forEach((msg) => {
        // Ignore invalid memory entries
        if (!msg || typeof msg.content !== "string" || !msg.content.trim()) {
          return;
        }

        if (msg.role === "user") {
          messages.push(
            new HumanMessage({
              content: msg.content,
            })
          );
        }

        if (msg.role === "assistant") {
          messages.push(
            new AIMessage({
              content: msg.content,
            })
          );
        }
      });
    }

    // Add current user message
    if (state.prompt?.trim()) {
      messages.push(
        new HumanMessage({
          content: state.prompt,
        })
      );
    }

    console.log(messages);
    

    const response = await llm.invoke(messages);
    await deductCredits(state.userId , "chat")


    console.log(response.content);

    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
};
import { getModel } from "../config/llmModel.js";

export const chatAgent = async (state) => {
  const llm = await getModel("chat");

  const systemPrompt =
    "You are SamanvayAI, an intelligent AI assistant";

  const response = await llm.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: state.prompt,
    },
  ]);

  console.log("🤖 LLM RESPONSE:", response.content);

  return {
    ...state,
    aiResponse: response.content,
  };
};
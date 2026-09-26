import axios from "axios";
import { graph } from "../graph/graph.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;

    console.log("PROMPT:", prompt);
    console.log("CONVERSATION ID:", conversationId);

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    const result = await graph.invoke({
      prompt,
      conversationId,
    });

    console.log("GRAPH RESULT:", result);

    const response = result.aiResponse;

    console.log("AI RESPONSE:", response);

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "assistant",
      content: response,
    });

    return res.status(200).json({
      response,
    });

  } catch (error) {
    console.error("AGENT ERROR:", error);

    return res.status(500).json({
      message: `agent error ${error.message}`,
    });
  }
};
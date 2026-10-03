import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body
    const userId = req.headers["x-user-id"]
    const file = req.file

    // Save user message
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    // Run LangGraph
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      userId ,
      file
    });

    console.log("result", result);

    await addMessage(
      conversationId,
      "user",
      prompt
    );

    // Save assistant message to memory
    await addMessage(
      conversationId,
      "assistant",
      result.aiResponse
    );

    // Save assistant message to chat service
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "assistant",
      content: result?.aiResponse,
      images: result?.images || [],
      artifacts: result?.artifacts
    });

    return res.status(200).json({
      answer: result?.aiResponse,
      images: result?.images,
      artifacts: result?.artifacts
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: `Agent error: ${error}`,
    });
  }
};
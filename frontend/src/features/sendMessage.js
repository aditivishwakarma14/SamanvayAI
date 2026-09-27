import api from "../utils/axios.js";

const sendMessage = async (payload) => {
  try {
    const { data } = await api.post(
      "/api/agent/chat",
      payload
    );

    console.log("🤖 AI RESPONSE:", data);

    return data;
  } catch (error) {
    console.error(
      "SEND MESSAGE ERROR:",
      error.response?.data || error.message
    );

    // IMPORTANT: error ko ChatInput tak bhejo
    throw error;
  }
};

export default sendMessage;
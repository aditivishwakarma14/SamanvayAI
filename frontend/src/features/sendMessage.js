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
      "sendMessage error:",
      error.response?.data || error.message
    );

    return null;
  }
};

export default sendMessage;
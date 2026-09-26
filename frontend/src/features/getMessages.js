import api from "../utils/axios.js"

async function getMessages(id) {
  try {
    const { data } = await api.get(
      `/api/chat/get-messages/${id}`
    )

    console.log("Messages:", data)

    return data
  } catch (error) {
    console.log("getMessages error:", error)
    return []
  }
}

export default getMessages
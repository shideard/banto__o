import api from "./api";

export async function askChatbot(tanya) {
  // Backend: POST /api/v1/chatbot
  // payload: { tanya: string }
  return api.post("/chatbot", { tanya });
}


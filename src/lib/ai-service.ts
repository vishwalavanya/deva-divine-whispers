const API_URL = "https://dev-ai-1.onrender.com";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export async function callAnthropicAPI(
  systemPrompt: string,
  messages: AIMessage[],
  maxTokens: number = 1500
): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system: systemPrompt,
      messages,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = await response.json();

  // Support multiple response formats from the backend
  if (typeof data === "string") return data;
  if (data.reply) return data.reply;
  if (data.response) return data.response;
  if (data.message) return data.message;
  if (data.content) {
    if (typeof data.content === "string") return data.content;
    if (Array.isArray(data.content)) {
      return data.content
        .filter((block: any) => block.type === "text")
        .map((block: any) => block.text)
        .join("\n");
    }
  }
  if (data.text) return data.text;

  throw new Error("No response from AI");
}

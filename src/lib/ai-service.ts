const API_URL = "https://dev-ai-u687.onrender.com/api/chat";

export interface AIMessage {
  role: "user" | "assistant";
  content: string | AIContentPart[];
}

export interface AIContentPart {
  type: "text" | "image" | "document";
  text?: string;
  source?: {
    media_type: string;
    data: string;
  };
}

export async function callAnthropicAPI(
  systemPrompt: string,
  messages: AIMessage[],
  maxTokens: number = 1500
): Promise<string> {
  const hasImages = messages.some(
    (m) => Array.isArray(m.content) && m.content.some((p) => p.type === "image" || p.type === "document")
  );

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemPrompt,
      messages,
      hasImages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Backend error: ${response.status} - ${errText}`);
  }

  const data = await response.json();

  if (data.reply) return data.reply;
  if (data.response) return data.response;
  if (data.message && typeof data.message === "string") return data.message;
  if (typeof data === "string") return data;
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

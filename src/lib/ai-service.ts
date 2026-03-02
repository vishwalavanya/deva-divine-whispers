const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

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
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  const data = await response.json();
  const reply = data.content
    ?.filter((block: any) => block.type === "text")
    .map((block: any) => block.text)
    .join("\n");

  if (!reply) throw new Error("No response from AI");
  return reply;
}

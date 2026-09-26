import "server-only";
import OpenAI from "openai";

const MODEL = "moonshotai/kimi-k3";

function usableReply(text: string | null | undefined): string {
  const trimmed = text?.trim() ?? "";
  if (!trimmed || /^!+$/.test(trimmed)) return "";
  return trimmed;
}

function normalizeModelOutput(raw: string): string {
  let out = raw.trim();
  if (
    (out.startsWith('"') && out.endsWith('"')) ||
    (out.startsWith("'") && out.endsWith("'"))
  ) {
    out = out.slice(1, -1).trim();
  }
  return out.replace(/—/g, ", ").replace(/–/g, "-");
}

export async function completeChat(userPrompt: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set");
  }

  const client = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey,
    timeout: 120_000,
  });

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: userPrompt }],
    temperature: 1,
    top_p: 0.95,
    max_tokens: 1024,
    stream: false,
    reasoning_effort: "low",
  } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);

  const message = completion.choices[0]?.message as
    | { content?: string | null; reasoning_content?: string | null }
    | undefined;
  const content = usableReply(message?.content) || usableReply(message?.reasoning_content);
  return normalizeModelOutput(String(content));
}

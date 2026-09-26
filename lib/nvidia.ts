import "server-only";
import OpenAI from "openai";

const MODEL = "moonshotai/kimi-k3";

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
  });

  const content = completion.choices[0]?.message?.content ?? "";
  return normalizeModelOutput(String(content));
}

import "server-only";

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

const DEFAULT_API_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";

const UPSTREAM_FETCH_TIMEOUT_MS = 120_000;

function assertTrustedNvidiaHttpsUrl(raw: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("Invalid NVIDIA_API_URL");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("NVIDIA_API_URL must use HTTPS");
  }
  const host = parsed.hostname.toLowerCase();
  const allowedSuffixes = (
    process.env.NVIDIA_API_ALLOWED_HOST_SUFFIXES ?? "nvidia.com"
  )
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const ok = allowedSuffixes.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  );
  if (!ok) {
    throw new Error("NVIDIA_API_URL hostname is not in the allowed list");
  }
  return parsed;
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

  const rawUrl = process.env.NVIDIA_API_URL ?? DEFAULT_API_URL;
  assertTrustedNvidiaHttpsUrl(rawUrl);
  const model =
    process.env.NVIDIA_MODEL ?? "meta/llama-3.3-70b-instruct";

  const res = await fetch(rawUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: userPrompt }],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 650,
      stream: false,
    }),
    signal: AbortSignal.timeout(UPSTREAM_FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Upstream ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = (await res.json()) as ChatCompletionResponse;
  const content = data?.choices?.[0]?.message?.content ?? "";
  return normalizeModelOutput(String(content));
}

import { NextResponse } from "next/server";
import { completeChat } from "@/lib/nvidia";
import { PROMPTS } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_README_LENGTH = 32_000;
const MAX_BODY_BYTES = 384 * 1024;

type SlotResult = { ok: true; text: string } | { ok: false; error: string };

function safeErrorMessage(): string {
  return "Could not generate this post. Try again in a moment.";
}

function assertSameOriginWhenPresent(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }
  try {
    const parsed = new URL(origin);
    const hostHeader = request.headers.get("host") ?? "";
    const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";
    if (!host || parsed.hostname.toLowerCase() !== host) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

function isJsonContentType(request: Request): boolean {
  const raw = request.headers.get("content-type") ?? "";
  const base = raw.split(";")[0]?.trim().toLowerCase() ?? "";
  return base === "application/json";
}

async function runSlot(
  label: string,
  prompt: string,
): Promise<SlotResult> {
  try {
    const text = await completeChat(prompt);
    return { ok: true, text };
  } catch (err) {
    console.error(`forge:${label}`, err);
    return { ok: false, error: safeErrorMessage() };
  }
}

export async function POST(request: Request) {
  const originBlock = assertSameOriginWhenPresent(request);
  if (originBlock) {
    return originBlock;
  }

  if (!isJsonContentType(request)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader !== null) {
    const n = Number(lengthHeader);
    if (Number.isFinite(n) && n > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request body too large." }, {
        status: 413,
      });
    }
  }

  if (!process.env.NVIDIA_API_KEY?.trim()) {
    const devHint =
      process.env.NODE_ENV === "development"
        ? " Create web/.env.local with NVIDIA_API_KEY=your_key and restart npm run dev."
        : " In Vercel: Project → Settings → Environment Variables → add NVIDIA_API_KEY, then redeploy.";
    return NextResponse.json(
      { error: `Server is not configured for generation.${devHint}` },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const readme =
    typeof body === "object" && body !== null && "readme" in body
      ? String((body as { readme: unknown }).readme ?? "")
      : "";

  const text = readme.trim();
  if (!text) {
    return NextResponse.json({ error: "Paste a project description first." }, {
      status: 400,
    });
  }
  if (text.length > MAX_README_LENGTH) {
    return NextResponse.json(
      { error: `Keep input under ${MAX_README_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const slotRaw =
    typeof body === "object" && body !== null && "slot" in body
      ? String((body as { slot: unknown }).slot ?? "").trim().toLowerCase()
      : "";

  if (slotRaw === "tech" || slotRaw === "story" || slotRaw === "lessons") {
    const key = slotRaw;
    const result = await runSlot(key, PROMPTS[key](text));
    return NextResponse.json({ slot: key, result });
  }

  const [tech, story, lessons] = await Promise.all([
    runSlot("tech", PROMPTS.tech(text)),
    runSlot("story", PROMPTS.story(text)),
    runSlot("lessons", PROMPTS.lessons(text)),
  ]);

  return NextResponse.json({ tech, story, lessons });
}

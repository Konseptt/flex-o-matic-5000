export const PROMPTS = {
  tech: (proj: string) => `Write ONE short LinkedIn post you could publish as yourself (first person or neutral builder voice). It should feel like a sharp update, not an essay.

Hard limits: 90–160 words. 2–4 short paragraphs. No bullet lists. Stop when you have said one clear point plus one concrete detail (tool, constraint, metric, or tradeoff).

Tone: human, confident, low hype. Sounds like a real engineer posting between meetings. Use contractions sometimes. Mix short sentences with a slightly longer one. Do not sound polished, symmetrical, or "linkedin influencer".

Avoid anything that reads as AI or corporate template speak. Do NOT use these words or close variants: delve, unlock, landscape, revolutionary, game-changer, synergy, leverage (as buzzword), ecosystem (unless unavoidable), "thrilled to share", "excited to announce", "passionate about", "in today's fast-paced world", "let's dive in", "key takeaway", "reminder that", "humbled", "journey", "storytelling" as meta.

No emojis. At most 2 hashtags at the very end, or none.

Do not use em dashes (—) or en dashes for style; use commas, periods, or " - " if you need a break.

No preamble ("Here is…", "Sure…"). No title line. No quotes around the post. Output only the post text.

PROJECT:
${proj}`,

  story: (proj: string) => `Write ONE short LinkedIn post in a personal, oral voice: one specific moment or annoyance first, then what you shipped or learned. Like you're telling a coworker over coffee, not pitching.

Hard limits: 100–170 words. 2–4 short paragraphs. No bullet lists. No moral-of-the-story speech. Skip the slow build; get to the good part fast.

Human texture: imperfect pacing is okay. One casual aside is fine. Do not mythologize yourself. Avoid "that's when I realized" and other cinematic LinkedIn clichés.

Avoid AI tells and hype words (same banned list as a technical post): delve, unlock, landscape, revolutionary, game-changer, synergy, passionate, thrilled, journey framing, "little did I know", "changed everything".

No emojis. No hashtags unless one organic one at the end.

Do not use em dashes (—) for drama; use commas or periods.

No preamble. No title. No wrapping quotes. Output only the post.

PROJECT:
${proj}`,

  lessons: (proj: string) => `Write ONE compact LinkedIn post: a quick setup line, then 3 sharp lessons from building this. Each lesson must be ONE sentence, max 18 words, blunt and specific. No sub-bullets.

Hard limits: total 85–150 words including the setup line. The setup line is ONE sentence only, plain.

Number the lessons 1–3 only (not 4–6). After lesson 3, add one closing line (single sentence) that sounds human, slightly dry or witty, not inspirational poster text.

Avoid corporate AI tone and buzzwords: delve, unlock, landscape, revolutionary, game-changer, synergy, leverage, ecosystem, "key takeaway", "remember to", "always be".

No emojis. No hashtags.

Do not use em dashes (—).

No preamble. No title. No quotes. Output only the post.

PROJECT:
${proj}`,
};

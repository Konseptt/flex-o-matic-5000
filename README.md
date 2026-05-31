# FLEX-O-MATIC 5000

I built this so I can paste project notes and get three usable LinkedIn posts fast:

- Technical
- Story
- Lessons

Live site: https://syllabuscal.ranjansharma.info.np

## Recommended repository details

- Description: Turn project notes into 3 human sounding LinkedIn posts
- Website: https://syllabuscal.ranjansharma.info.np
- Topics: nextjs react typescript linkedin-post-generator nvidia-api vercel ai-writing

## What it looks like

![FLEX-O-MATIC 5000 live screenshot](https://github.com/user-attachments/assets/8e1e05c6-0397-44e4-af1d-a4bd4c056bbf)

## Product flow

```mermaid
flowchart LR
  A[Paste README or project notes] --> B[Click Forge 3 Posts]
  B --> C[Client sends POST /api/forge]
  C --> D[API validates origin, json, size, and input]
  D --> E[Prompt builder picks tech, story, or lessons]
  E --> F[NVIDIA chat completion API]
  F --> G[Normalized output sent back]
  G --> H[Three cards rendered with copy buttons]
```

## System diagram

```mermaid
flowchart TB
  subgraph Browser
    UI[Retro Next.js UI]
    Cards[Tech Story Lessons cards]
  end

  subgraph NextJsServer
    Route[app/api/forge/route.ts]
    Prompts[lib/prompts.ts]
    NvidiaClient[lib/nvidia.ts]
  end

  subgraph External
    Nvidia[(NVIDIA Chat Completions API)]
  end

  UI --> Route
  Route --> Prompts
  Route --> NvidiaClient
  NvidiaClient --> Nvidia
  Route --> Cards
```

## Repo structure

```text
.
├── app/
│   ├── api/forge/route.ts
│   ├── components/FlexOMatic.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── nvidia.ts
│   ├── prompts.ts
│   └── site-url.ts
├── public/
├── .env.example
├── package.json
└── README.md
```

## Local setup

```bash
cp .env.example .env.local
# add NVIDIA_API_KEY in .env.local
npm install
npm run dev
```

Open http://127.0.0.1:3000

## Deploy notes

For Vercel:

1. Keep Root Directory empty
2. Set `NVIDIA_API_KEY`
3. Set `NEXT_PUBLIC_SITE_URL` to your deployed URL
4. Deploy

## Security notes

- API key stays server side
- `/api/forge` checks origin when provided
- Request size and input length are capped
- Upstream API host is restricted to trusted suffixes

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`
- `npm run audit`

# FLEX-O-MATIC 5000

Turn a README or project note into **three short LinkedIn-style posts** (technical, story, lessons). Built with **Next.js**; your **NVIDIA API key stays on the server only**.

**Application code is in `web/`.** On Vercel, set **Root Directory** to **`web`**.

---

## Push to GitHub (quick)

From this folder:

```bash
git init
git add -A
git status   # confirm .env.local and node_modules are NOT listed
git branch -M main
git commit -m "Initial commit: FLEX-O-MATIC 5000"
```

Create an empty repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

**Before you push:** ensure **`web/.env.local`** is not staged (it is ignored by default). Never commit API keys.

---

## What’s in the box

| Item | Purpose |
|------|--------|
| Retro UI | Marquee, “windows”, three output cards, copy buttons |
| `POST /api/forge` | Server-side NVIDIA chat calls; supports `slot: tech \| story \| lessons` |
| Social preview | `opengraph-image` / `twitter-image` (1200×630) + metadata for LinkedIn / X |
| Security | Same-origin check (when `Origin` is sent), JSON + body limits, HTTPS host allowlist for API URL, upstream timeout, security headers |

---

## Repo layout

```
.
├── README.md
├── .gitignore
└── web/                 ← Vercel root directory
    ├── app/
    ├── lib/
    ├── public/
    ├── .env.example
    ├── package.json
    ├── vercel.json
    └── ...
```

---

## Local development

```bash
cd web
cp .env.example .env.local
# Set NVIDIA_API_KEY in .env.local (never commit this file)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy on Vercel

1. Import the GitHub repo into Vercel.  
2. **Root Directory:** `web`  
3. **Environment variables**
   - **`NVIDIA_API_KEY`** (required for generation)  
   - **`NEXT_PUBLIC_SITE_URL`** (e.g. `https://your-app.vercel.app`) for correct Open Graph / link previews  
   - Optional: `NVIDIA_API_URL`, `NVIDIA_MODEL`, `NVIDIA_API_ALLOWED_HOST_SUFFIXES` — see `web/.env.example`  
4. Deploy  

Refresh cached previews with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) if needed.

---

## Environment variables

| Variable | Scope | Notes |
|----------|--------|--------|
| `NVIDIA_API_KEY` | Server only | Required for Forge. Do **not** use `NEXT_PUBLIC_*`. |
| `NEXT_PUBLIC_SITE_URL` | Public | Your canonical `https://` URL for metadata. |
| `NVIDIA_API_URL` | Server | Optional override (HTTPS + allowed hosts). |
| `NVIDIA_MODEL` | Server | Optional model id. |

---

## Scripts (`web/`)

- `npm run dev` — dev server  
- `npm run build` — production build  
- `npm run start` — run production build locally  
- `npm run lint` — ESLint  
- `npm run audit` — `npm audit` (moderate+)  

---

## Security checklist

- [ ] No `nvapi-` strings or keys in `.env.example`, README, or source.  
- [ ] `web/.env.local` exists only on your machine and is **gitignored**.  
- [ ] Keys on Vercel are in **Environment Variables**, not in the repo.  
- [ ] Rotate any key that was ever committed or leaked.  

---

## License

Your project — add a `LICENSE` file if you want to specify terms.

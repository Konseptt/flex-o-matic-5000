# FLEX-O-MATIC 5000

Turn a README or project note into **three short LinkedIn-style posts** (technical, story, lessons). Built with **Next.js**; your **NVIDIA API key stays on the server only**.

The Next.js app lives at the **repository root** (this folder). **Vercel:** leave **Root Directory** empty, or set it to **`.`** — do **not** use `web` (that path no longer exists).

---

## Fix Vercel `404 NOT_FOUND` (plain “The page could not be found”)

That response is **Vercel’s edge** (`x-vercel-error: NOT_FOUND`), not the Next.js app. The build can succeed while the **production domain** doesn’t point at a live deployment.

### Checklist (in order)

1. **Settings → General → Root Directory** → **empty** (not `web`, not a subfolder).
2. **Settings → General → Build & Development Settings**
   - **Framework Preset:** **Next.js**
   - **Build Command:** leave default, or `npm run build`
   - **Output Directory:** **leave empty** (must **not** be `.next`, `out`, or `dist` unless you know you need it).
   - **Install Command:** leave default, or `npm install` / `npm ci`.
3. **Deployments** → open the latest **Production · Ready** deployment → use the **Visit** button. If that URL works but `https://<project>.vercel.app` does not, it’s a **domain** issue (step 4).
4. **Settings → Domains** → ensure **`<name>.vercel.app`** is listed and **Valid**; remove and re-add it if it’s stuck.
5. **Git** → Production should track **`main`** and include the latest commit (we ship `next build --webpack` for reliable Vercel output).
6. Pull latest **`main`** and **Redeploy** if your dashboard was on an old commit.

### Preview URLs return `401`

**Deployment Protection** is on for previews. Use the **production** domain, or temporarily allow unauthenticated previews in **Settings → Deployment Protection**.

---

## Push to GitHub

```bash
git add -A
git status   # .env.local and node_modules must NOT appear
git commit -m "your message"
git push
```

**Never commit** `.env.local` or API keys. Only `.env.example` is tracked (empty key).

---

## What's in the box

| Item | Purpose |
|------|--------|
| Retro UI | Marquee, “windows”, three output cards, copy buttons |
| `POST /api/forge` | Server-side NVIDIA chat; `slot: tech \| story \| lessons` |
| Social preview | `opengraph-image` / `twitter-image` (1200×630) + metadata |
| Security | Same-origin when `Origin` is sent, JSON/size limits, HTTPS host allowlist, upstream timeout, security headers |

---

## Repo layout

```
.
├── README.md
├── .gitignore
├── app/              # Next.js App Router
├── lib/
├── public/
├── .env.example
├── package.json
└── ...
```

---

## Local development

```bash
cp .env.example .env.local
# Set NVIDIA_API_KEY in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy on Vercel

1. Import this repo (or reconnect if already linked).
2. **Root Directory:** leave **blank** (repo root).
3. **Environment variables:** `NVIDIA_API_KEY`; `NEXT_PUBLIC_SITE_URL` (your live `https://…` URL); optional vars in `.env.example`.
4. Deploy.

Link previews: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

---

## Environment variables

| Variable | Notes |
|----------|--------|
| `NVIDIA_API_KEY` | Server only. Required for Forge. |
| `NEXT_PUBLIC_SITE_URL` | Public canonical URL for Open Graph. |
| `NVIDIA_API_URL`, `NVIDIA_MODEL`, `NVIDIA_API_ALLOWED_HOST_SUFFIXES` | Optional — see `.env.example`. |

---

## Scripts

- `npm run dev` — dev server  
- `npm run build` — production build  
- `npm run start` — run production build locally  
- `npm run lint` — ESLint  
- `npm run audit` — `npm audit` (moderate+)  

---

## Security checklist

- [ ] No real `nvapi-*` strings in `.env.example` or source.  
- [ ] `.env.local` is gitignored and never force-added.  
- [ ] Secrets only in Vercel **Environment Variables**.  

---

## License

Your project — add a `LICENSE` file if you want explicit terms.

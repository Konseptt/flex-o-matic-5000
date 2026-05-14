"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SlotResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

type OutputState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; text: string }
  | { status: "err"; message: string };

type Outputs = {
  tech: OutputState;
  story: OutputState;
  lessons: OutputState;
};

const initialOutputs: Outputs = {
  tech: { status: "idle" },
  story: { status: "idle" },
  lessons: { status: "idle" },
};

function slotToState(s: SlotResult): OutputState {
  if (s.ok) return { status: "ok", text: s.text };
  return { status: "err", message: s.error };
}

function LoadingBlock() {
  return (
    <>
      <div className="loading-bars" aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="loading-cooking">
        cooking<span className="blinking-cursor" aria-hidden />
      </div>
    </>
  );
}

function OutputPane({
  state,
  variant,
}: {
  state: OutputState;
  variant: "tech" | "story" | "lessons";
}) {
  if (state.status === "loading") {
    return <LoadingBlock />;
  }
  if (state.status === "ok") {
    return <>{state.text}</>;
  }
  if (state.status === "err") {
    return <>ERR: {state.message}</>;
  }
  /* idle */
  if (variant === "tech") {
    return (
      <>
        {"> awaiting input..."}
        <span className="blinking-cursor" aria-hidden />
      </>
    );
  }
  if (variant === "story") {
    return (
      <>
        once upon a time, a developer pasted some code here and magic
        happened...
      </>
    );
  }
  return <>Lesson #1: always paste something in the box first.</>;
}

export default function FlexOMatic() {
  const readmeRef = useRef<HTMLTextAreaElement>(null);
  const [readme, setReadme] = useState("");
  const [outputs, setOutputs] = useState<Outputs>(initialOutputs);
  const [busy, setBusy] = useState(false);
  const [forgedOnce, setForgedOnce] = useState(false);
  const [status, setStatus] = useState("READY");
  const [uptime, setUptime] = useState("00:00:00");
  const [copyNotice, setCopyNotice] = useState<
    { key: keyof Outputs; kind: "ok" | "fail" } | null
  >(null);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const t = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(t / 3600)).padStart(2, "0");
      const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
      const s = String(t % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const copyText = useCallback(async (key: keyof Outputs) => {
    const st = outputs[key];
    if (st.status !== "ok") return;
    try {
      await navigator.clipboard.writeText(st.text);
      setCopyNotice({ key, kind: "ok" });
      window.setTimeout(() => setCopyNotice(null), 1500);
    } catch {
      setCopyNotice({ key, kind: "fail" });
      window.setTimeout(() => setCopyNotice(null), 1500);
    }
  }, [outputs]);

  function copyLabel(key: keyof Outputs) {
    if (copyNotice?.key !== key) return "[ COPY TO CLIPBOARD ]";
    if (copyNotice.kind === "ok") return "[ COPIED!!! ]";
    return "[ COPY FAILED ]";
  }

  function copyClass(key: keyof Outputs) {
    const copied =
      copyNotice?.key === key && copyNotice.kind === "ok" ? " copied" : "";
    return `copy-btn${copied}`;
  }

  const FETCH_TIMEOUT_MS = 150_000;

  function timeoutMessage(err: unknown): string {
    if (err instanceof DOMException) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return "Timed out (model or network too slow). Retry, or on Vercel Hobby try a faster model / Pro for longer limits.";
      }
    }
    if (err instanceof Error && /abort|timeout/i.test(err.name + err.message)) {
      return "Timed out. Retry or shorten input.";
    }
    return "Network error. Check your connection.";
  }

  async function onForge() {
    const text = readme.trim();
    if (!text) {
      setStatus("PASTE SOMETHING FIRST !!!");
      readmeRef.current?.focus();
      return;
    }

    setBusy(true);
    setForgedOnce(true);
    setStatus("FORGING POSTS");
    setOutputs({
      tech: { status: "loading" },
      story: { status: "loading" },
      lessons: { status: "loading" },
    });

    const slots = ["tech", "story", "lessons"] as const;

    async function forgeOne(slot: (typeof slots)[number]): Promise<OutputState> {
      try {
        const res = await fetch("/api/forge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ readme: text, slot }),
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });

        if (!res.ok) {
          let message = "Something went wrong.";
          try {
            const j = (await res.json()) as { error?: unknown };
            if (typeof j.error === "string") message = j.error;
          } catch {
            /* ignore */
          }
          return { status: "err", message };
        }

        const data = (await res.json()) as { result: SlotResult };
        return slotToState(data.result);
      } catch (err) {
        return { status: "err", message: timeoutMessage(err) };
      }
    }

    const results = await Promise.all(
      slots.map(async (slot) => {
        const state = await forgeOne(slot);
        setOutputs((prev) => ({ ...prev, [slot]: state }));
        return state;
      }),
    );

    setBusy(false);
    const oks = results.filter((r) => r.status === "ok").length;
    const errs = results.filter((r) => r.status === "err").length;
    if (errs === 3) setStatus("REQUEST FAILED");
    else if (oks === 3) setStatus("DONE. GO POST IT.");
    else setStatus("PARTIAL — SOME SLOTS FAILED");
  }

  return (
    <>
      <div className="marquee">
        <span className="marquee-track">
          ★ <b>FRESH POSTS</b> ★ <em>HOT TAKES</em> ★{" "}
          <b>CAREER GLOW UP</b> ★ <em>FORGED IN THE COMPUTER</em> ★{" "}
          <b>NOW WITH 300% MORE PIZZAZZ</b> ★ <em>BRAG RESPONSIBLY</em> ★{" "}
          <b>FRESH POSTS</b> ★ <em>HOT TAKES</em> ★ <b>CAREER GLOW UP</b> ★
        </span>
      </div>

      <div className="container">
        <div className="header">
          <div className="badge b1">NEW!!!</div>
          <div className="badge b2">v5.0</div>
          <div className="tagline">{"// EST. 1995 // SHIP YOUR FLEX //"}</div>
          <h1>
            FLEX-O-MATIC
            <br />
            5000
          </h1>
          <div className="subtitle">drop a project, get 3 posts. easy.</div>
        </div>

        <div className="ascii-divider">
          +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
        </div>

        <div className="window">
          <div className="titlebar">
            <span>PROJECT_INTAKE.EXE</span>
            <div className="dots">
              <div className="dot">_</div>
              <div className="dot">o</div>
              <div className="dot">x</div>
            </div>
          </div>
          <div className="window-body">
            <textarea
              id="readme"
              ref={readmeRef}
              className="readme-input"
              value={readme}
              onChange={(e) => setReadme(e.target.value)}
              placeholder={`paste your README, project description, or just rant about what you built...

example:
GLYPHMIND_3D is a single-file HTML/Three.js cognitive game where you navigate egyptian ruins doing real-time N-back matching with hieroglyphs. built for cognition research with CSV data export.`}
            />
            <div className="controls">
              <div className="char-count">
                <span className="blip" aria-hidden />
                BYTES:{" "}
                <span id="char-count-value">
                  {String(readme.length).padStart(4, "0")}
                </span>
              </div>
              <button
                type="button"
                id="forge"
                className="forge-btn"
                disabled={busy}
                onClick={onForge}
              >
                {busy
                  ? "... FORGING ..."
                  : forgedOnce
                    ? "★ FORGE AGAIN ★"
                    : "★ FORGE 3 POSTS ★"}
              </button>
            </div>
          </div>
        </div>

        <div className="ascii-divider">
          &gt;&gt;&gt; &gt;&gt;&gt; &gt;&gt;&gt; OUTPUT BAY &gt;&gt;&gt;
          &gt;&gt;&gt; &gt;&gt;&gt;
        </div>

        <div className="results-grid">
          <div className="card technical">
            <div className="card-sticker">TECH</div>
            <div className="window">
              <div className="titlebar">
                <span>POST_01_TECHNICAL.LOG</span>
                <div className="dots">
                  <div className="dot">_</div>
                  <div className="dot">o</div>
                  <div className="dot">x</div>
                </div>
              </div>
              <div className="window-body">
                <div id="out-tech" className="output-area">
                  <OutputPane state={outputs.tech} variant="tech" />
                </div>
                <button
                  type="button"
                  className={copyClass("tech")}
                  onClick={() => copyText("tech")}
                >
                  {copyLabel("tech")}
                </button>
              </div>
            </div>
          </div>

          <div className="card story">
            <div className="card-sticker">STORY</div>
            <div className="window">
              <div className="titlebar">
                <span>POST_02_STORYTIME.TXT</span>
                <div className="dots">
                  <div className="dot">_</div>
                  <div className="dot">o</div>
                  <div className="dot">x</div>
                </div>
              </div>
              <div className="window-body">
                <div id="out-story" className="output-area">
                  <OutputPane state={outputs.story} variant="story" />
                </div>
                <button
                  type="button"
                  className={copyClass("story")}
                  onClick={() => copyText("story")}
                >
                  {copyLabel("story")}
                </button>
              </div>
            </div>
          </div>

          <div className="card lessons">
            <div className="card-sticker">LESSONS</div>
            <div className="window">
              <div className="titlebar">
                <span>POST_03_LESSONS.NOTE</span>
                <div className="dots">
                  <div className="dot">_</div>
                  <div className="dot">o</div>
                  <div className="dot">x</div>
                </div>
              </div>
              <div className="window-body">
                <div id="out-lessons" className="output-area">
                  <OutputPane state={outputs.lessons} variant="lessons" />
                </div>
                <button
                  type="button"
                  className={copyClass("lessons")}
                  onClick={() => copyText("lessons")}
                >
                  {copyLabel("lessons")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="statusbar">
          <span>
            <span className="blip" aria-hidden />
            STATUS: <span id="status">{status}</span>
          </span>
          <span>MODEL: llama-3.3-70b</span>
          <span>
            UPTIME: <span id="uptime">{uptime}</span>
          </span>
        </div>
      </div>
    </>
  );
}

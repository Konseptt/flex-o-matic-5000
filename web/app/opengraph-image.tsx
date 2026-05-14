import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "FLEX-O-MATIC 5000 — drop a project, get three LinkedIn-ready posts";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/* Brand palette matches the app (globals.css) */
const pink = "#ff2d87";
const cyan = "#00e5ff";
const yellow = "#ffd60a";
const green = "#39ff14";
const black = "#0a0a0a";
const paper = "#fff8e7";
const purple = "#8b5cf6";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: paper,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 14,
          }}
        >
          <div style={{ flex: 1, backgroundColor: pink }} />
          <div style={{ flex: 1, backgroundColor: yellow }} />
          <div style={{ flex: 1, backgroundColor: cyan }} />
          <div style={{ flex: 1, backgroundColor: black }} />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 64px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 48,
              right: 64,
              backgroundColor: yellow,
              color: black,
              padding: "10px 18px",
              border: `3px solid ${black}`,
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            NEW
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#404040",
              letterSpacing: 4,
              marginBottom: 16,
              fontFamily: "monospace",
            }}
          >
            {"// SHIP YOUR FLEX //"}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 92,
                fontWeight: 900,
                color: pink,
                lineHeight: 0.95,
                letterSpacing: -3,
                textShadow: `${4}px ${4}px 0 ${cyan}, ${9}px ${9}px 0 ${yellow}, ${14}px ${14}px 0 ${black}`,
              }}
            >
              FLEX-O-MATIC
            </div>
            <div
              style={{
                fontSize: 92,
                fontWeight: 900,
                color: pink,
                lineHeight: 0.95,
                letterSpacing: -3,
                textShadow: `${4}px ${4}px 0 ${cyan}, ${9}px ${9}px 0 ${yellow}, ${14}px ${14}px 0 ${black}`,
                marginTop: 4,
              }}
            >
              5000
            </div>
          </div>

          <div
            style={{
              marginTop: 36,
              backgroundColor: black,
              color: paper,
              padding: "14px 36px",
              border: `4px solid ${yellow}`,
              fontSize: 32,
              fontFamily: "monospace",
              boxShadow: `6px 6px 0 ${pink}`,
            }}
          >
            From README to 3 LinkedIn-ready posts
          </div>

          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: 20,
              fontSize: 26,
              fontFamily: "monospace",
              color: black,
            }}
          >
            <span style={{ color: green, fontWeight: 700 }}>TECH</span>
            <span style={{ color: "#888" }}>·</span>
            <span style={{ color: pink, fontWeight: 700 }}>STORY</span>
            <span style={{ color: "#888" }}>·</span>
            <span style={{ color: purple, fontWeight: 700 }}>LESSONS</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            height: 10,
            opacity: 0.95,
          }}
        >
          <div style={{ flex: 1, backgroundColor: cyan }} />
          <div style={{ flex: 1, backgroundColor: pink }} />
          <div style={{ flex: 1, backgroundColor: green }} />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

"use client";

import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

/* ─── Scene 1: Title Card ─────────────────────────────────────────────── */
function TitleScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });
  const badgesOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({ frame: frame - 5, fps, config: { damping: 20, mass: 0.8 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #050507 0%, #0a0a1a 50%, #050507 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        {/* Logo */}
        <div
          style={{
            opacity: titleOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <Img
            src={staticFile("app-icon.png")}
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
            }}
          />
          <span
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#e4e4e7",
              letterSpacing: "-0.02em",
            }}
          >
            ApiArk
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #818cf8, #6366f1, #a78bfa, #06b6d4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            maxWidth: 900,
          }}
        >
          No Login. No Cloud.
          <br />
          No Bloat.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            marginTop: 24,
            opacity: subtitleOpacity,
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          The open-source API platform that respects your privacy,
          <br />
          your RAM, and your Git workflow.
        </p>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            marginTop: 40,
            opacity: badgesOpacity,
          }}
        >
          {["~50MB RAM", "<2s Startup", "MIT License", "100% Local"].map((badge) => (
            <div
              key={badge}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "#818cf8",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Scene 2: Performance ────────────────────────────────────────────── */
function PerformanceScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tools = [
    { name: "Postman", ram: 800, color: "#ef4444" },
    { name: "Insomnia", ram: 400, color: "#f97316" },
    { name: "Bruno", ram: 250, color: "#eab308" },
    { name: "Hoppscotch", ram: 80, color: "#06b6d4" },
    { name: "ApiArk", ram: 50, color: "#6366f1" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#050507",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        padding: 80,
      }}
    >
      <h2
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: "#e4e4e7",
          marginBottom: 60,
          textAlign: "center",
        }}
      >
        RAM Usage Comparison
      </h2>

      <div style={{ width: "100%", maxWidth: 800, display: "flex", flexDirection: "column", gap: 20 }}>
        {tools.map((tool, i) => {
          const delay = i * 8;
          const width = interpolate(frame - delay, [0, 30], [0, (tool.ram / 800) * 100], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={tool.name} style={{ display: "flex", alignItems: "center", gap: 16, opacity }}>
              <span
                style={{
                  width: 100,
                  textAlign: "right",
                  color: tool.name === "ApiArk" ? "#818cf8" : "#a1a1aa",
                  fontSize: 18,
                  fontWeight: tool.name === "ApiArk" ? 700 : 500,
                }}
              >
                {tool.name}
              </span>
              <div
                style={{
                  flex: 1,
                  height: tool.name === "ApiArk" ? 44 : 36,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${width}%`,
                    height: "100%",
                    background:
                      tool.name === "ApiArk"
                        ? "linear-gradient(90deg, #6366f1, #818cf8)"
                        : tool.color,
                    borderRadius: 8,
                    boxShadow:
                      tool.name === "ApiArk" ? "0 0 20px rgba(99,102,241,0.4)" : "none",
                  }}
                />
              </div>
              <span
                style={{
                  width: 80,
                  color: tool.name === "ApiArk" ? "#818cf8" : "#71717a",
                  fontSize: 18,
                  fontWeight: tool.name === "ApiArk" ? 700 : 400,
                }}
              >
                {tool.ram}MB
              </span>
            </div>
          );
        })}
      </div>

      <p
        style={{
          marginTop: 50,
          fontSize: 28,
          fontWeight: 700,
          background: "linear-gradient(90deg, #f59e0b, #ef4444)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        16x less RAM than Postman.
      </p>
    </AbsoluteFill>
  );
}

/* ─── Scene 3: Terminal Demo ──────────────────────────────────────────── */
function TerminalScene() {
  const frame = useCurrentFrame();

  const lines = [
    { text: "$ apiark run my-api --env production", color: "#e4e4e7", delay: 0 },
    { text: "", color: "", delay: 15 },
    { text: "  ✓ GET  /api/users          200 OK        45ms", color: "#22c55e", delay: 20 },
    { text: "  ✓ POST /api/users          201 Created   123ms", color: "#22c55e", delay: 28 },
    { text: "  ✓ GET  /api/users/:id      200 OK        38ms", color: "#22c55e", delay: 36 },
    { text: "  ✓ PUT  /api/users/:id      200 OK        67ms", color: "#22c55e", delay: 44 },
    { text: "  ✓ DELETE /api/users/:id    204 No Content 29ms", color: "#22c55e", delay: 52 },
    { text: "", color: "", delay: 60 },
    { text: "  Results: 5 passed, 0 failed (302ms)", color: "#818cf8", delay: 65 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#050507",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: 700,
          background: "#0a0a0f",
          borderRadius: 12,
          border: "1px solid #1e1e2a",
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(99,102,241,0.1)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            background: "#111118",
            borderBottom: "1px solid #1e1e2a",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ marginLeft: 8, color: "#71717a", fontSize: 13 }}>Terminal — apiark</span>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", fontFamily: "JetBrains Mono, monospace", fontSize: 15, lineHeight: 1.8 }}>
          {lines.map((line, i) => {
            const opacity = interpolate(frame - line.delay, [0, 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={i} style={{ opacity, color: line.color || "#e4e4e7", whiteSpace: "pre" }}>
                {line.text || "\u00A0"}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Scene 4: CTA ────────────────────────────────────────────────────── */
function CTAScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 15 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #050507, #0f0f1a, #050507)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div style={{ textAlign: "center", opacity, transform: `scale(${scale})` }}>
        <h2
          style={{
            fontSize: 64,
            fontWeight: 800,
            background: "linear-gradient(135deg, #818cf8, #a78bfa, #06b6d4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 24,
          }}
        >
          Ready to switch?
        </h2>
        <p style={{ fontSize: 24, color: "#a1a1aa", marginBottom: 48 }}>
          Free. Open source. Available now.
        </p>
        <div
          style={{
            display: "inline-flex",
            padding: "16px 48px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            color: "#fff",
            fontSize: 22,
            fontWeight: 600,
            boxShadow: "0 0 40px rgba(99,102,241,0.3)",
          }}
        >
          apiark.dev
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Main Composition ────────────────────────────────────────────────── */
export function ApiArkDemoVideo() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <TitleScene />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <PerformanceScene />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <TerminalScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
}

export const VIDEO_CONFIG = {
  id: "ApiArkDemo",
  fps: 30,
  durationInFrames: 360, // 12 seconds
  width: 1920,
  height: 1080,
};

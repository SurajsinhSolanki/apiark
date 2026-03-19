"use client";

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  Easing,
} from "remotion";

/* ─── Design Tokens ─────────────────────────────────────────────────── */

const BG = "#09090b";
const SURFACE = "#111113";
const SURFACE2 = "#18181b";
const BORDER = "#2a2a35";
const MUTED = "#71717a";
const TEXT = "#e4e4e7";
const TEXT_DIM = "#a1a1aa";
const ACCENT = "#6366f1";
const ACCENT_LIGHT = "#818cf8";
const GREEN = "#22c55e";
const YELLOW = "#eab308";
const BLUE = "#3b82f6";
const PINK = "#ec4899";
const RED = "#ef4444";
const CYAN = "#06b6d4";
const VIOLET = "#8b5cf6";
const ORANGE = "#f97316";
const MONO = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace";
const SANS = "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/* ─── Helpers ───────────────────────────────────────────────────────── */

function GlowDot({ x, y, color, size = 4, delay = 0 }: { x: number; y: number; color: string; size?: number; delay?: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 20], [0, 0.3], CLAMP);
  const pulse = Math.sin((frame - delay) * 0.08) * 0.15 + 0.85;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity: opacity * pulse,
        boxShadow: `0 0 ${size * 3}px ${color}40`,
      }}
    />
  );
}

function GridBackground({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage: `
          linear-gradient(${BORDER}40 1px, transparent 1px),
          linear-gradient(90deg, ${BORDER}40 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

function GradientOrb({ x, y, size, color, opacity = 0.12 }: { x: number; y: number; size: number; color: string; opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── App Chrome (macOS window frame) ───────────────────────────────── */

function AppChrome({
  children,
  title,
  scale = 1,
  opacity = 1,
  translateY = 0,
}: {
  children: React.ReactNode;
  title: string;
  scale?: number;
  opacity?: number;
  translateY?: number;
}) {
  return (
    <div
      style={{
        width: 1440,
        borderRadius: 16,
        border: `1px solid ${BORDER}`,
        background: SURFACE,
        overflow: "hidden",
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px ${BORDER}, inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "11px 16px",
          background: "#08080a",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        <span
          style={{
            marginLeft: 12,
            color: MUTED,
            fontSize: 13,
            fontFamily: SANS,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ─── Scene 1: Cinematic Hook ───────────────────────────────────────── */

function Scene1_Hook() {
  const frame = useCurrentFrame();

  const problems = [
    { text: "Forced logins", delay: 8, icon: "🔒" },
    { text: "800MB RAM", delay: 18, icon: "💀" },
    { text: "Cloud lock-in", delay: 28, icon: "☁️" },
    { text: "30s startup", delay: 38, icon: "⏳" },
  ];

  const strikeDelay = 55;
  const solutionDelay = 70;

  // Fade out at end
  const fadeOut = interpolate(frame, [130, 150], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SANS, opacity: fadeOut }}>
      <GridBackground opacity={0.04} />
      <GradientOrb x={960} y={540} size={800} color={RED} opacity={0.06} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* "Tired of..." */}
        <div
          style={{
            fontSize: 22,
            color: MUTED,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 40,
            opacity: interpolate(frame, [0, 12], [0, 1], CLAMP),
          }}
        >
          Your API client shouldn&apos;t need...
        </div>

        {/* Problem pills */}
        <div style={{ display: "flex", gap: 20, marginBottom: 60 }}>
          {problems.map((p, i) => {
            const pillOpacity = interpolate(frame, [p.delay, p.delay + 8], [0, 1], CLAMP);
            const pillY = interpolate(frame, [p.delay, p.delay + 8], [20, 0], CLAMP);
            const struck = frame >= strikeDelay + i * 3;
            return (
              <div
                key={i}
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  border: `1px solid ${struck ? RED + "60" : BORDER}`,
                  background: struck ? `${RED}10` : SURFACE2,
                  fontSize: 18,
                  fontWeight: 600,
                  color: struck ? `${RED}90` : TEXT,
                  opacity: pillOpacity,
                  transform: `translateY(${pillY}px)`,
                  textDecoration: struck ? "line-through" : "none",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ marginRight: 10 }}>{p.icon}</span>
                {p.text}
              </div>
            );
          })}
        </div>

        {/* Solution: ApiArk */}
        <div
          style={{
            opacity: interpolate(frame, [solutionDelay, solutionDelay + 15], [0, 1], CLAMP),
            transform: `scale(${interpolate(frame, [solutionDelay, solutionDelay + 15], [0.85, 1], CLAMP)})`,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              textAlign: "center",
              background: `linear-gradient(135deg, ${TEXT} 0%, ${ACCENT_LIGHT} 50%, ${ACCENT} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ApiArk
          </div>
          <div
            style={{
              fontSize: 24,
              color: TEXT_DIM,
              fontWeight: 400,
              textAlign: "center",
              marginTop: 16,
              letterSpacing: "0.02em",
              opacity: interpolate(frame, [solutionDelay + 15, solutionDelay + 25], [0, 1], CLAMP),
            }}
          >
            No login. No cloud. No bloat. Just speed.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Scene 2: Speed Comparison ─────────────────────────────────────── */

function Scene2_SpeedComparison() {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [130, 150], [1, 0], CLAMP);

  const competitors = [
    { name: "Postman", ram: 800, startup: 28, color: "#ff6c37", ramDelay: 20, startupDelay: 20 },
    { name: "Insomnia", ram: 350, startup: 12, color: "#7b68ee", ramDelay: 28, startupDelay: 28 },
    { name: "Bruno", ram: 220, startup: 6, color: "#eab308", ramDelay: 36, startupDelay: 36 },
    { name: "ApiArk", ram: 60, startup: 1.2, color: ACCENT, ramDelay: 50, startupDelay: 50 },
  ];

  const maxRam = 800;
  const maxStartup = 28;

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SANS, opacity: fadeIn * fadeOut }}>
      <GridBackground opacity={0.03} />
      <GradientOrb x={400} y={300} size={600} color={ACCENT} opacity={0.05} />
      <GradientOrb x={1500} y={700} size={500} color={GREEN} opacity={0.04} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 120px",
        }}
      >
        {/* Section title */}
        <div
          style={{
            fontSize: 16,
            color: ACCENT_LIGHT,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 12,
            opacity: interpolate(frame, [4, 14], [0, 1], CLAMP),
          }}
        >
          Performance
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: TEXT,
            letterSpacing: "-0.03em",
            marginBottom: 60,
            opacity: interpolate(frame, [8, 18], [0, 1], CLAMP),
          }}
        >
          Native speed. Real numbers.
        </div>

        {/* Charts side by side */}
        <div style={{ display: "flex", gap: 80, width: "100%" }}>
          {/* RAM Usage */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>
              Memory Usage (MB)
            </div>
            {competitors.map((c, i) => {
              const barWidth = interpolate(
                frame,
                [c.ramDelay, c.ramDelay + 25],
                [0, (c.ram / maxRam) * 100],
                { ...CLAMP, easing: Easing.out(Easing.cubic) }
              );
              const isApiArk = c.name === "ApiArk";
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 15, color: isApiArk ? TEXT : TEXT_DIM, fontWeight: isApiArk ? 700 : 500 }}>{c.name}</span>
                    <span
                      style={{
                        fontSize: 15,
                        fontFamily: MONO,
                        fontWeight: 700,
                        color: isApiArk ? GREEN : TEXT_DIM,
                        opacity: interpolate(frame, [c.ramDelay + 15, c.ramDelay + 25], [0, 1], CLAMP),
                      }}
                    >
                      {c.ram} MB
                    </span>
                  </div>
                  <div style={{ height: 32, borderRadius: 8, background: "#1a1a1f", overflow: "hidden", border: `1px solid ${BORDER}` }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${barWidth}%`,
                        borderRadius: 7,
                        background: isApiArk
                          ? `linear-gradient(90deg, ${ACCENT}, ${GREEN})`
                          : `linear-gradient(90deg, ${c.color}80, ${c.color}40)`,
                        boxShadow: isApiArk ? `0 0 20px ${GREEN}30` : "none",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Startup Time */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>
              Cold Start (seconds)
            </div>
            {competitors.map((c, i) => {
              const barWidth = interpolate(
                frame,
                [c.startupDelay + 5, c.startupDelay + 30],
                [0, (c.startup / maxStartup) * 100],
                { ...CLAMP, easing: Easing.out(Easing.cubic) }
              );
              const isApiArk = c.name === "ApiArk";
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 15, color: isApiArk ? TEXT : TEXT_DIM, fontWeight: isApiArk ? 700 : 500 }}>{c.name}</span>
                    <span
                      style={{
                        fontSize: 15,
                        fontFamily: MONO,
                        fontWeight: 700,
                        color: isApiArk ? GREEN : TEXT_DIM,
                        opacity: interpolate(frame, [c.startupDelay + 20, c.startupDelay + 30], [0, 1], CLAMP),
                      }}
                    >
                      {c.startup}s
                    </span>
                  </div>
                  <div style={{ height: 32, borderRadius: 8, background: "#1a1a1f", overflow: "hidden", border: `1px solid ${BORDER}` }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${barWidth}%`,
                        borderRadius: 7,
                        background: isApiArk
                          ? `linear-gradient(90deg, ${ACCENT}, ${GREEN})`
                          : `linear-gradient(90deg, ${c.color}80, ${c.color}40)`,
                        boxShadow: isApiArk ? `0 0 20px ${GREEN}30` : "none",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Callout */}
        <div
          style={{
            marginTop: 48,
            fontSize: 20,
            fontWeight: 600,
            color: GREEN,
            opacity: interpolate(frame, [80, 95], [0, 1], CLAMP),
            transform: `translateY(${interpolate(frame, [80, 95], [10, 0], CLAMP)}px)`,
          }}
        >
          13x less memory than Postman. 23x faster startup.
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Scene 3: REST Demo — The Core Flow ────────────────────────────── */

function Scene3_RESTDemo() {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], CLAMP);
  const chromeScale = interpolate(frame, [0, 20], [0.92, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const chromeY = interpolate(frame, [0, 20], [30, 0], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], CLAMP);

  // Typing animation
  const fullUrl = "https://api.example.com/v1/users";
  const typingStart = 20;
  const charsTyped = Math.min(Math.max(Math.floor((frame - typingStart) / 1.2), 0), fullUrl.length);
  const typedUrl = fullUrl.slice(0, charsTyped);
  const showCursor = frame >= typingStart && frame < typingStart + fullUrl.length * 1.2 + 15;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  // Send
  const sendFrame = 70;
  const sendFlash = frame >= sendFrame && frame < sendFrame + 8;
  const sendPulse = frame >= sendFrame && frame < sendFrame + 4;

  // Response
  const responseDelay = sendFrame + 12;
  const responseOpacity = interpolate(frame, [responseDelay, responseDelay + 12], [0, 1], CLAMP);
  const statusScale = interpolate(frame, [responseDelay, responseDelay + 10], [0.85, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  const responseLines = [
    "{",
    '  "users": [',
    "    {",
    '      "id": "usr_k8x2m",',
    '      "name": "Sarah Chen",',
    '      "email": "sarah@example.com",',
    '      "role": "admin"',
    "    },",
    "    {",
    '      "id": "usr_p3n7q",',
    '      "name": "Marcus Johnson",',
    '      "role": "developer"',
    "    }",
    "  ],",
    '  "total": 2,',
    '  "page": 1',
    "}",
  ];

  const sidebarItems: Array<{
    name?: string;
    type?: "folder" | "divider";
    expanded?: boolean;
    method?: string;
    color?: string;
    active?: boolean;
  }> = [
    { name: "User Service", type: "folder", expanded: true },
    { name: "List Users", method: "GET", color: GREEN, active: true },
    { name: "Create User", method: "POST", color: YELLOW },
    { name: "Get User", method: "GET", color: GREEN },
    { name: "Update User", method: "PUT", color: BLUE },
    { name: "Delete User", method: "DEL", color: RED },
    { type: "divider" },
    { name: "Products", type: "folder" },
    { name: "Payments", type: "folder" },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: SANS, opacity: fadeIn * fadeOut }}>
      <GridBackground opacity={0.02} />
      <GradientOrb x={300} y={400} size={400} color={ACCENT} opacity={0.04} />

      <AppChrome title="ApiArk" scale={chromeScale} translateY={chromeY}>
        <div style={{ display: "flex", height: 580 }}>
          {/* Activity bar */}
          <div
            style={{
              width: 48,
              background: "#06060a",
              borderRight: `1px solid ${BORDER}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 12,
              gap: 4,
            }}
          >
            {[
              { icon: "📁", color: BLUE, active: true },
              { icon: "🔧", color: GREEN },
              { icon: "🕐", color: YELLOW },
              { icon: "⚡", color: VIOLET },
              { icon: "📊", color: PINK },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  background: item.active ? `${item.color}15` : "transparent",
                  borderLeft: item.active ? `2px solid ${item.color}` : "2px solid transparent",
                }}
              >
                {item.icon}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div style={{ width: 230, borderRight: `1px solid ${BORDER}`, padding: "12px 8px", background: "#0a0a0f" }}>
            {/* Search */}
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                background: SURFACE2,
                marginBottom: 12,
                fontSize: 12,
                color: MUTED,
              }}
            >
              🔍 Search requests...
            </div>

            <div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, paddingLeft: 8 }}>
              Collections
            </div>

            {sidebarItems.map((item, i) => {
              if (item.type === "divider") {
                return <div key={i} style={{ height: 1, background: BORDER, margin: "8px 0" }} />;
              }
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    marginLeft: item.type === "folder" ? 0 : 20,
                    fontSize: 13,
                    borderRadius: 8,
                    background: item.active ? `${ACCENT}12` : "transparent",
                    color: item.active ? TEXT : TEXT_DIM,
                    fontWeight: item.active ? 500 : 400,
                  }}
                >
                  {item.type === "folder" ? (
                    <span style={{ color: MUTED, fontSize: 12 }}>{item.expanded ? "▼" : "▶"} {item.name}</span>
                  ) : (
                    <>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: item.color,
                          fontFamily: MONO,
                          width: 32,
                          textAlign: "center",
                          padding: "2px 0",
                          borderRadius: 4,
                          background: `${item.color}12`,
                        }}
                      >
                        {item.method}
                      </span>
                      <span>{item.name}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Tab bar */}
            <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, background: "#0c0c10" }}>
              {[
                { method: "GET", name: "List Users", color: GREEN, active: true },
                { method: "POST", name: "Create User", color: YELLOW },
              ].map((tab, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    fontSize: 12,
                    borderRight: `1px solid ${BORDER}`,
                    background: tab.active ? SURFACE : "transparent",
                    borderBottom: tab.active ? `2px solid ${ACCENT}` : "2px solid transparent",
                    color: tab.active ? TEXT : MUTED,
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 800, color: tab.color, fontFamily: MONO }}>{tab.method}</span>
                  {tab.name}
                </div>
              ))}
            </div>

            {/* URL bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 16px",
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: GREEN,
                  background: `${GREEN}15`,
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontFamily: MONO,
                }}
              >
                GET
              </span>
              <div
                style={{
                  flex: 1,
                  fontFamily: MONO,
                  fontSize: 14,
                  color: TEXT,
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: SURFACE2,
                  border: `1px solid ${frame >= typingStart && frame < sendFrame ? ACCENT + "60" : BORDER}`,
                }}
              >
                {typedUrl}
                {showCursor && cursorBlink && <span style={{ color: ACCENT }}>|</span>}
              </div>
              <div
                style={{
                  padding: "8px 28px",
                  borderRadius: 10,
                  background: sendFlash ? GREEN : sendPulse ? `${ACCENT}dd` : ACCENT,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  boxShadow: sendFlash ? `0 0 30px ${GREEN}40` : `0 2px 12px ${ACCENT}30`,
                  transform: sendPulse ? "scale(0.95)" : "scale(1)",
                }}
              >
                Send
              </div>
            </div>

            {/* Split: Request config tabs + Response */}
            <div style={{ flex: 1, display: "flex" }}>
              {/* Response */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Response status bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "8px 16px",
                    borderBottom: `1px solid ${BORDER}`,
                    opacity: responseOpacity,
                    transform: `scale(${statusScale})`,
                    transformOrigin: "left center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#fff",
                      background: GREEN,
                      padding: "3px 10px",
                      borderRadius: 6,
                    }}
                  >
                    200 OK
                  </span>
                  <span style={{ fontSize: 12, color: GREEN, fontFamily: MONO, fontWeight: 600 }}>45ms</span>
                  <span style={{ fontSize: 12, color: MUTED, fontFamily: MONO }}>2.4 KB</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
                    {["Body", "Headers", "Cookies", "Tests", "Timing"].map((tab, i) => (
                      <span
                        key={tab}
                        style={{
                          fontSize: 12,
                          color: i === 0 ? TEXT : MUTED,
                          fontWeight: i === 0 ? 600 : 400,
                          borderBottom: i === 0 ? `2px solid ${ACCENT}` : "none",
                          paddingBottom: 2,
                        }}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Response body with syntax highlighting */}
                <div style={{ padding: "12px 16px", fontFamily: MONO, fontSize: 13, lineHeight: 1.75, opacity: responseOpacity, overflow: "hidden" }}>
                  {responseLines.map((line, i) => {
                    const lineDelay = responseDelay + 6 + i * 1.2;
                    const lineOpacity = interpolate(frame, [lineDelay, lineDelay + 5], [0, 1], CLAMP);
                    const highlighted = line
                      .replace(/"(\w+)":/g, `<span style="color:${ACCENT_LIGHT}">"$1"</span>:`)
                      .replace(/: "([^"]+)"/g, `: <span style="color:#34d399">"$1"</span>`)
                      .replace(/: (\d+)/g, `: <span style="color:#fbbf24">$1</span>`);
                    return (
                      <div key={i} style={{ opacity: lineOpacity, color: TEXT_DIM }}>
                        <span style={{ color: "#3f3f46", marginRight: 16, userSelect: "none", fontSize: 11 }}>
                          {String(i + 1).padStart(2)}
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: highlighted }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  );
}

/* ─── Scene 4: Multi-Protocol Montage ───────────────────────────────── */

function Scene4_MultiProtocol() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [170, 190], [1, 0], CLAMP);

  const protocols = [
    {
      name: "GraphQL",
      badge: "GQL",
      color: PINK,
      delay: 15,
      code: [
        "query GetUser($id: ID!) {",
        "  user(id: $id) {",
        "    name",
        "    email",
        "    orders { total }",
        "  }",
        "}",
      ],
      response: '{ "data": { "user": { "name": "Sarah" } } }',
    },
    {
      name: "WebSocket",
      badge: "WS",
      color: GREEN,
      delay: 60,
      code: [
        "Connected to ws://localhost:8080",
        "",
        "↑ SENT    {\"type\":\"subscribe\",\"channel\":\"updates\"}",
        "↓ RECV    {\"type\":\"ack\",\"id\":\"sub_1\"}",
        "↓ RECV    {\"type\":\"data\",\"payload\":{\"user\":\"online\"}}",
        "↓ RECV    {\"type\":\"data\",\"payload\":{\"msg\":\"Hello!\"}}",
      ],
      response: "",
    },
    {
      name: "gRPC",
      badge: "gRPC",
      color: CYAN,
      delay: 105,
      code: [
        "service UserService {",
        "  rpc GetUser (UserRequest)",
        "    returns (UserResponse);",
        "  rpc ListUsers (ListRequest)",
        "    returns (stream UserResponse);",
        "}",
      ],
      response: '{ "user": { "id": 1, "name": "Sarah" } }',
    },
  ];

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SANS, opacity: fadeIn * fadeOut }}>
      <GridBackground opacity={0.03} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {/* Title */}
        <div style={{ marginBottom: 12, opacity: interpolate(frame, [4, 14], [0, 1], CLAMP) }}>
          <span style={{ fontSize: 16, color: ACCENT_LIGHT, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Multi-Protocol
          </span>
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: TEXT,
            letterSpacing: "-0.03em",
            marginBottom: 50,
            opacity: interpolate(frame, [8, 18], [0, 1], CLAMP),
          }}
        >
          One tool. Every protocol.
        </div>

        {/* Protocol cards */}
        <div style={{ display: "flex", gap: 24 }}>
          {protocols.map((proto, pi) => {
            const cardOpacity = interpolate(frame, [proto.delay, proto.delay + 12], [0, 1], CLAMP);
            const cardY = interpolate(frame, [proto.delay, proto.delay + 12], [30, 0], { ...CLAMP, easing: Easing.out(Easing.cubic) });
            return (
              <div
                key={pi}
                style={{
                  width: 420,
                  borderRadius: 14,
                  border: `1px solid ${proto.color}30`,
                  background: SURFACE,
                  overflow: "hidden",
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                  boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 0 1px ${proto.color}10`,
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    borderBottom: `1px solid ${BORDER}`,
                    background: `${proto.color}08`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: proto.color,
                      background: `${proto.color}18`,
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontFamily: MONO,
                    }}
                  >
                    {proto.badge}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{proto.name}</span>
                  <div style={{ marginLeft: "auto" }}>
                    <span
                      style={{
                        fontSize: 10,
                        color: GREEN,
                        background: `${GREEN}15`,
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      ● Connected
                    </span>
                  </div>
                </div>

                {/* Code */}
                <div style={{ padding: "12px 16px", fontFamily: MONO, fontSize: 12, lineHeight: 1.8, height: 220 }}>
                  {proto.code.map((line, li) => {
                    const lineOpacity = interpolate(frame, [proto.delay + 10 + li * 3, proto.delay + 16 + li * 3], [0, 1], CLAMP);
                    let color = TEXT_DIM;
                    if (line.startsWith("↑")) color = GREEN;
                    if (line.startsWith("↓")) color = BLUE;
                    if (line.includes("query") || line.includes("service") || line.includes("rpc")) color = PINK;
                    if (line.includes("returns") || line.includes("stream")) color = CYAN;
                    return (
                      <div key={li} style={{ opacity: lineOpacity, color, whiteSpace: "pre" }}>
                        {line || "\u00A0"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Protocol badges row */}
        <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
          {[
            { name: "REST", color: GREEN },
            { name: "GraphQL", color: PINK },
            { name: "gRPC", color: CYAN },
            { name: "WebSocket", color: GREEN },
            { name: "SSE", color: ORANGE },
            { name: "MQTT", color: VIOLET },
          ].map((p, i) => {
            const badgeOpacity = interpolate(frame, [140 + i * 4, 148 + i * 4], [0, 1], CLAMP);
            return (
              <div
                key={i}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: `1px solid ${p.color}30`,
                  background: `${p.color}08`,
                  fontSize: 13,
                  fontWeight: 600,
                  color: p.color,
                  fontFamily: MONO,
                  opacity: badgeOpacity,
                }}
              >
                {p.name}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Scene 5: Testing & Collection Runner ──────────────────────────── */

function Scene5_Testing() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [150, 170], [1, 0], CLAMP);

  const requests = [
    { method: "GET", methodColor: GREEN, name: "List Users", status: "200 OK", statusColor: GREEN, time: "45ms", assertions: "3/3" },
    { method: "POST", methodColor: YELLOW, name: "Create User", status: "201 Created", statusColor: GREEN, time: "123ms", assertions: "4/4" },
    { method: "GET", methodColor: GREEN, name: "Get User", status: "200 OK", statusColor: GREEN, time: "38ms", assertions: "2/2" },
    { method: "PUT", methodColor: BLUE, name: "Update User", status: "200 OK", statusColor: GREEN, time: "67ms", assertions: "3/3" },
    { method: "DEL", methodColor: RED, name: "Delete User", status: "204", statusColor: GREEN, time: "29ms", assertions: "1/1" },
  ];

  const progressWidth = interpolate(frame, [20, 80], [0, 100], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const allDone = frame > 85;

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: SANS, opacity: fadeIn * fadeOut }}>
      <GridBackground opacity={0.02} />
      <GradientOrb x={960} y={400} size={600} color={GREEN} opacity={0.04} />

      <AppChrome title="ApiArk — Collection Runner" scale={interpolate(frame, [0, 15], [0.93, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) })}>
        <div style={{ height: 580, display: "flex", flexDirection: "column" }}>
          {/* Runner header */}
          <div style={{ padding: "14px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>User Service</span>
            <span
              style={{
                fontSize: 11,
                color: ACCENT_LIGHT,
                background: `${ACCENT}15`,
                padding: "3px 10px",
                borderRadius: 6,
                fontFamily: MONO,
              }}
            >
              production
            </span>
            <span style={{ fontSize: 12, color: MUTED }}>5 requests · 13 assertions</span>

            {/* Progress bar */}
            <div style={{ flex: 1, marginLeft: 16 }}>
              <div style={{ height: 6, borderRadius: 3, background: "#1a1a1f", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progressWidth}%`,
                    borderRadius: 3,
                    background: allDone
                      ? `linear-gradient(90deg, ${GREEN}, ${GREEN}cc)`
                      : `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                    boxShadow: `0 0 12px ${allDone ? GREEN : ACCENT}40`,
                  }}
                />
              </div>
            </div>

            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: allDone ? GREEN : ACCENT,
                opacity: interpolate(frame, [85, 92], [0, 1], CLAMP),
              }}
            >
              {allDone ? "✓ All Passed" : "Running..."}
            </span>
          </div>

          {/* Results */}
          <div style={{ flex: 1, padding: "16px 24px" }}>
            {/* Column headers */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 16px 12px", borderBottom: `1px solid ${BORDER}`, marginBottom: 8 }}>
              <span style={{ width: 24 }} />
              <span style={{ width: 44, fontSize: 10, color: MUTED, fontWeight: 600, textTransform: "uppercase" }}>Method</span>
              <span style={{ flex: 1, fontSize: 10, color: MUTED, fontWeight: 600, textTransform: "uppercase" }}>Name</span>
              <span style={{ width: 100, fontSize: 10, color: MUTED, fontWeight: 600, textTransform: "uppercase" }}>Status</span>
              <span style={{ width: 60, fontSize: 10, color: MUTED, fontWeight: 600, textTransform: "uppercase", textAlign: "right" }}>Time</span>
              <span style={{ width: 70, fontSize: 10, color: MUTED, fontWeight: 600, textTransform: "uppercase", textAlign: "right" }}>Tests</span>
            </div>

            {requests.map((req, i) => {
              const rowDelay = 25 + i * 12;
              const rowOpacity = interpolate(frame, [rowDelay, rowDelay + 8], [0, 1], CLAMP);
              const checkDelay = rowDelay + 6;
              const checkOpacity = interpolate(frame, [checkDelay, checkDelay + 6], [0, 1], CLAMP);
              const checkScale = interpolate(frame, [checkDelay, checkDelay + 6], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "11px 16px",
                    marginBottom: 4,
                    borderRadius: 10,
                    border: `1px solid ${BORDER}`,
                    background: checkOpacity > 0.5 ? `${GREEN}06` : "transparent",
                    opacity: rowOpacity,
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: `${GREEN}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: GREEN,
                      opacity: checkOpacity,
                      transform: `scale(${checkScale})`,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ width: 44, fontSize: 10, fontWeight: 800, color: req.methodColor, fontFamily: MONO }}>{req.method}</span>
                  <span style={{ flex: 1, fontSize: 14, color: TEXT, fontWeight: 500 }}>{req.name}</span>
                  <span style={{ width: 100, fontSize: 12, color: req.statusColor, fontWeight: 600, fontFamily: MONO }}>{req.status}</span>
                  <span style={{ width: 60, fontSize: 12, color: MUTED, fontFamily: MONO, textAlign: "right" }}>{req.time}</span>
                  <span style={{ width: 70, fontSize: 12, color: GREEN, fontWeight: 600, fontFamily: MONO, textAlign: "right" }}>{req.assertions}</span>
                </div>
              );
            })}

            {/* Summary bar */}
            <div
              style={{
                marginTop: 20,
                padding: "18px 24px",
                borderRadius: 12,
                background: `linear-gradient(135deg, ${GREEN}08, ${ACCENT}08)`,
                border: `1px solid ${GREEN}20`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: interpolate(frame, [90, 100], [0, 1], CLAMP),
                transform: `translateY(${interpolate(frame, [90, 100], [10, 0], CLAMP)}px)`,
              }}
            >
              <div style={{ display: "flex", gap: 48 }}>
                {[
                  { label: "Passed", value: "5/5", color: GREEN },
                  { label: "Assertions", value: "13/13", color: GREEN },
                  { label: "Duration", value: "302ms", color: TEXT },
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, fontFamily: MONO }}>{stat.value}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: GREEN,
                  background: `${GREEN}12`,
                  padding: "8px 20px",
                  borderRadius: 8,
                }}
              >
                ✓ All tests passed
              </div>
            </div>
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  );
}

/* ─── Scene 6: Feature Grid ─────────────────────────────────────────── */

function Scene6_Features() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const fadeOut = interpolate(frame, [140, 160], [1, 0], CLAMP);

  const features = [
    { icon: "🛡️", title: "Zero Login", desc: "No accounts ever", color: GREEN, delay: 15 },
    { icon: "📁", title: "Git-Native", desc: "YAML files, versionable", color: BLUE, delay: 22 },
    { icon: "⚡", title: "Tauri v2", desc: "Rust-powered, 60MB RAM", color: ACCENT, delay: 29 },
    { icon: "🧪", title: "Full Testing", desc: "Assertions + runner + CI", color: YELLOW, delay: 36 },
    { icon: "🎭", title: "Mock Servers", desc: "Local, zero config", color: VIOLET, delay: 43 },
    { icon: "📊", title: "Monitors", desc: "Cron-based, local", color: PINK, delay: 50 },
    { icon: "🔌", title: "Plugin System", desc: "JS + WASM extensible", color: ORANGE, delay: 57 },
    { icon: "💻", title: "CLI Tool", desc: "CI/CD ready", color: CYAN, delay: 64 },
    { icon: "🌍", title: "9 Languages", desc: "i18n out of the box", color: GREEN, delay: 71 },
    { icon: "♿", title: "Accessible", desc: "WCAG 2.1 AA", color: BLUE, delay: 78 },
    { icon: "🔐", title: "Secure", desc: "CSP, secret redaction", color: RED, delay: 85 },
    { icon: "📖", title: "API Docs Gen", desc: "HTML + Markdown", color: ACCENT, delay: 92 },
  ];

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SANS, opacity: fadeIn * fadeOut }}>
      <GridBackground opacity={0.03} />
      <GradientOrb x={960} y={540} size={900} color={ACCENT} opacity={0.04} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ marginBottom: 12, opacity: interpolate(frame, [4, 14], [0, 1], CLAMP) }}>
          <span style={{ fontSize: 16, color: ACCENT_LIGHT, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Everything You Need
          </span>
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: TEXT,
            letterSpacing: "-0.03em",
            marginBottom: 50,
            opacity: interpolate(frame, [8, 18], [0, 1], CLAMP),
          }}
        >
          More than Postman. Lighter than Bruno.
        </div>

        {/* Feature grid 4x3 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: 1200, justifyContent: "center" }}>
          {features.map((f, i) => {
            const cardOpacity = interpolate(frame, [f.delay, f.delay + 10], [0, 1], CLAMP);
            const cardScale = interpolate(frame, [f.delay, f.delay + 10], [0.88, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
            return (
              <div
                key={i}
                style={{
                  width: 280,
                  padding: "20px 22px",
                  borderRadius: 14,
                  border: `1px solid ${f.color}20`,
                  background: `linear-gradient(135deg, ${SURFACE}, ${f.color}05)`,
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{f.icon}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{f.title}</span>
                </div>
                <span style={{ fontSize: 13, color: MUTED }}>{f.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Scene 7: CTA / Outro ──────────────────────────────────────────── */

function Scene7_CTA() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], CLAMP);

  // Logo animation
  const logoScale = interpolate(frame, [5, 25], [0.7, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const logoOpacity = interpolate(frame, [5, 20], [0, 1], CLAMP);

  // Tagline
  const taglineOpacity = interpolate(frame, [25, 40], [0, 1], CLAMP);
  const taglineY = interpolate(frame, [25, 40], [15, 0], CLAMP);

  // Badges
  const badgeDelay = 45;

  // URL
  const urlOpacity = interpolate(frame, [60, 75], [0, 1], CLAMP);

  // Stats
  const statsDelay = 80;

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SANS, opacity: fadeIn }}>
      <GridBackground opacity={0.04} />
      <GradientOrb x={960} y={400} size={900} color={ACCENT} opacity={0.08} />
      <GradientOrb x={700} y={600} size={500} color={PINK} opacity={0.04} />
      <GradientOrb x={1200} y={600} size={500} color={GREEN} opacity={0.04} />

      {/* Floating glow dots */}
      {[
        { x: 200, y: 200, color: ACCENT },
        { x: 1700, y: 300, color: GREEN },
        { x: 300, y: 800, color: PINK },
        { x: 1600, y: 700, color: CYAN },
        { x: 960, y: 150, color: YELLOW },
      ].map((dot, i) => (
        <GlowDot key={i} x={dot.x} y={dot.y} color={dot.color} size={6} delay={i * 5} />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              background: `linear-gradient(135deg, ${TEXT} 0%, ${ACCENT_LIGHT} 40%, ${ACCENT} 80%, ${PINK} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            ApiArk
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: TEXT_DIM,
            fontWeight: 400,
            letterSpacing: "0.01em",
            marginBottom: 40,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          The API platform that respects your privacy, your RAM, and your workflow.
        </div>

        {/* Feature badges */}
        <div style={{ display: "flex", gap: 14, marginBottom: 48 }}>
          {[
            { text: "Open Source", color: GREEN },
            { text: "MIT Licensed", color: BLUE },
            { text: "Cross-Platform", color: VIOLET },
            { text: "Tauri v2", color: ACCENT },
          ].map((badge, i) => {
            const bOpacity = interpolate(frame, [badgeDelay + i * 5, badgeDelay + 8 + i * 5], [0, 1], CLAMP);
            return (
              <div
                key={i}
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: `1px solid ${badge.color}30`,
                  background: `${badge.color}10`,
                  fontSize: 15,
                  fontWeight: 600,
                  color: badge.color,
                  opacity: bOpacity,
                }}
              >
                {badge.text}
              </div>
            );
          })}
        </div>

        {/* CTA URL */}
        <div
          style={{
            opacity: urlOpacity,
            display: "flex",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "18px 48px",
              borderRadius: 14,
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}dd)`,
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.02em",
              boxShadow: `0 8px 32px ${ACCENT}40, 0 0 0 1px ${ACCENT}80`,
            }}
          >
            Download Free
          </div>
          <div
            style={{
              padding: "18px 40px",
              borderRadius: 14,
              border: `2px solid ${BORDER}`,
              background: SURFACE,
              color: TEXT,
              fontSize: 22,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            ⭐ Star on GitHub
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            fontFamily: MONO,
            color: ACCENT_LIGHT,
            fontWeight: 600,
            letterSpacing: "0.05em",
            opacity: interpolate(frame, [75, 90], [0, 1], CLAMP),
          }}
        >
          apiark.dev
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 60,
            marginTop: 40,
            opacity: interpolate(frame, [statsDelay, statsDelay + 15], [0, 1], CLAMP),
          }}
        >
          {[
            { value: "60MB", label: "RAM Usage" },
            { value: "<2s", label: "Cold Start" },
            { value: "6", label: "Protocols" },
            { value: "MIT", label: "License" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: TEXT, fontFamily: MONO }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Main Composition ──────────────────────────────────────────────── */

export function ApiArkDemoVideo() {
  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Scene 1: Hook — 0-150 (5s) */}
      <Sequence from={0} durationInFrames={150}>
        <Scene1_Hook />
      </Sequence>

      {/* Scene 2: Speed Comparison — 150-300 (5s) */}
      <Sequence from={150} durationInFrames={150}>
        <Scene2_SpeedComparison />
      </Sequence>

      {/* Scene 3: REST Demo — 300-510 (7s) */}
      <Sequence from={300} durationInFrames={210}>
        <Scene3_RESTDemo />
      </Sequence>

      {/* Scene 4: Multi-Protocol — 510-700 (6.3s) */}
      <Sequence from={510} durationInFrames={190}>
        <Scene4_MultiProtocol />
      </Sequence>

      {/* Scene 5: Testing & Runner — 700-870 (5.7s) */}
      <Sequence from={700} durationInFrames={170}>
        <Scene5_Testing />
      </Sequence>

      {/* Scene 6: Feature Grid — 870-1030 (5.3s) */}
      <Sequence from={870} durationInFrames={160}>
        <Scene6_Features />
      </Sequence>

      {/* Scene 7: CTA/Outro — 1030-1230 (6.7s) */}
      <Sequence from={1030} durationInFrames={200}>
        <Scene7_CTA />
      </Sequence>
    </AbsoluteFill>
  );
}

export const VIDEO_CONFIG = {
  id: "ApiArkDemo",
  fps: 30,
  durationInFrames: 1230, // 41 seconds
  width: 1920,
  height: 1080,
};

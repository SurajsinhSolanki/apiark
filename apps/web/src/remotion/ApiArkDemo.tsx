"use client";

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
} from "remotion";

/* ─── Shared Styles ──────────────────────────────────────────────────── */

const BG = "#09090b";
const SURFACE = "#111113";
const BORDER = "#2a2a35";
const MUTED = "#71717a";
const TEXT = "#e4e4e7";
const ACCENT = "#6366f1";
const GREEN = "#22c55e";
const YELLOW = "#eab308";
const BLUE = "#3b82f6";
const PINK = "#ec4899";
const RED = "#ef4444";
const MONO = "JetBrains Mono, Menlo, monospace";
const SANS = "Inter, system-ui, sans-serif";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/* ─── App Chrome (reusable window frame) ─────────────────────────────── */

function AppChrome({
  children,
  title,
  opacity = 1,
}: {
  children: React.ReactNode;
  title: string;
  opacity?: number;
}) {
  return (
    <div
      style={{
        width: 1400,
        borderRadius: 16,
        border: `1px solid ${BORDER}`,
        background: SURFACE,
        overflow: "hidden",
        opacity,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: "#08080d",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: RED }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: YELLOW }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: GREEN }} />
        <span style={{ marginLeft: 8, color: MUTED, fontSize: 13, fontFamily: SANS }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ─── Scene 1: Open app, type URL, send GET request ──────────────────── */

function Scene1_SendRequest() {
  const frame = useCurrentFrame();

  // Typing animation for URL
  const fullUrl = "https://api.example.com/v1/users";
  const charsTyped = Math.min(Math.floor(frame / 1.5), fullUrl.length);
  const typedUrl = fullUrl.slice(0, charsTyped);
  const showCursor = frame < fullUrl.length * 1.5 + 10;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  // Send button click
  const sendFrame = 55;
  const sent = frame >= sendFrame;
  const sendFlash = frame >= sendFrame && frame < sendFrame + 6;

  // Response appears
  const responseOpacity = interpolate(frame, [sendFrame + 8, sendFrame + 18], [0, 1], CLAMP);

  // Status badge
  const statusScale = interpolate(frame, [sendFrame + 8, sendFrame + 14], [0.8, 1], CLAMP);

  const responseLines = [
    '{',
    '  "users": [',
    '    {',
    '      "id": "usr_k8x2m",',
    '      "name": "Sarah Chen",',
    '      "email": "sarah@example.com",',
    '      "role": "admin"',
    '    },',
    '    {',
    '      "id": "usr_p3n7q",',
    '      "name": "Marcus Johnson",',
    '      "email": "marcus@example.com",',
    '      "role": "developer"',
    '    }',
    '  ],',
    '  "total": 2',
    '}',
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: SANS }}>
      <div style={{ opacity: interpolate(frame, [0, 12], [0, 1], CLAMP) }}>
        <AppChrome title="ApiArk — REST" opacity={1}>
          <div style={{ display: "flex", height: 560 }}>
            {/* Sidebar */}
            <div style={{ width: 220, borderRight: `1px solid ${BORDER}`, padding: 12, background: "#08080d" }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Collections</div>
              {[
                { name: "User Service", type: "folder" },
                { name: "List Users", method: "GET", color: GREEN, active: true },
                { name: "Create User", method: "POST", color: YELLOW },
                { name: "Get User", method: "GET", color: GREEN },
                { name: "Delete User", method: "DEL", color: RED },
                { name: "Products", type: "folder" },
                { name: "List Products", method: "GET", color: GREEN },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 8px",
                    marginLeft: item.type === "folder" ? 0 : 16,
                    fontSize: 13,
                    borderRadius: 6,
                    background: item.active ? "rgba(99,102,241,0.08)" : "transparent",
                    color: item.active ? TEXT : "#a1a1aa",
                  }}
                >
                  {item.type === "folder" ? (
                    <span style={{ color: MUTED }}>▼ {item.name}</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 10, fontWeight: 700, color: item.color, fontFamily: MONO, width: 32 }}>{item.method}</span>
                      <span>{item.name}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Main area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* URL bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: GREEN, background: `${GREEN}15`, padding: "4px 10px", borderRadius: 6, fontFamily: MONO }}>GET</span>
                <div style={{ flex: 1, fontFamily: MONO, fontSize: 14, color: TEXT, position: "relative" }}>
                  {typedUrl}
                  {showCursor && cursorBlink && <span style={{ color: ACCENT }}>|</span>}
                </div>
                <div
                  style={{
                    padding: "8px 24px",
                    borderRadius: 8,
                    background: sendFlash ? GREEN : ACCENT,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "background 0.1s",
                  }}
                >
                  Send
                </div>
              </div>

              {/* Response area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Response header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "8px 16px",
                    borderBottom: `1px solid ${BORDER}`,
                    opacity: responseOpacity,
                    transform: `scale(${statusScale})`,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>200 OK</span>
                  <span style={{ fontSize: 12, color: MUTED }}>45ms</span>
                  <span style={{ fontSize: 12, color: MUTED }}>2.4 KB</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
                    {["Body", "Headers", "Cookies"].map((tab, i) => (
                      <span key={tab} style={{ fontSize: 12, color: i === 0 ? TEXT : MUTED, fontWeight: i === 0 ? 600 : 400 }}>{tab}</span>
                    ))}
                  </div>
                </div>

                {/* Response body */}
                <div style={{ padding: 16, fontFamily: MONO, fontSize: 13, lineHeight: 1.7, opacity: responseOpacity }}>
                  {responseLines.map((line, i) => {
                    const lineDelay = sendFrame + 12 + i * 1.5;
                    const lineOpacity = interpolate(frame, [lineDelay, lineDelay + 6], [0, 1], CLAMP);
                    const highlighted = line
                      .replace(/"(\w+)":/g, '<span style="color:#818cf8">"$1"</span>:')
                      .replace(/: "([^"]+)"/g, ': <span style="color:#34d399">"$1"</span>')
                      .replace(/: (\d+)/g, ': <span style="color:#fbbf24">$1</span>');
                    return (
                      <div key={i} style={{ opacity: lineOpacity, color: "#a1a1aa" }}>
                        <span style={{ color: "#3f3f46", marginRight: 16, userSelect: "none" }}>{String(i + 1).padStart(2)}</span>
                        <span dangerouslySetInnerHTML={{ __html: highlighted }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </AppChrome>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Scene 2: Write a test, run assertions ──────────────────────────── */

function Scene2_WriteTest() {
  const frame = useCurrentFrame();

  const scriptLines = [
    { text: '// Post-response test', color: MUTED },
    { text: 'ark.test("returns users", () => {', color: TEXT },
    { text: '  const body = ark.response.json();', color: TEXT },
    { text: '  ark.expect(body.users).to.have.length(2);', color: TEXT },
    { text: '  ark.expect(body.users[0]).to.have.property("email");', color: TEXT },
    { text: '  ark.expect(body.total).to.equal(2);', color: TEXT },
    { text: '});', color: TEXT },
    { text: '', color: '' },
    { text: 'ark.test("response is fast", () => {', color: TEXT },
    { text: '  ark.expect(ark.response.time).to.be.below(500);', color: TEXT },
    { text: '});', color: TEXT },
  ];

  // Test results appear after code is shown
  const resultsFrame = 50;
  const results = [
    { name: "returns users", pass: true, time: "3ms" },
    { name: "response is fast", pass: true, time: "1ms" },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: SANS }}>
      <AppChrome title="ApiArk — Tests">
        <div style={{ display: "flex", height: 560 }}>
          {/* Script editor (left) */}
          <div style={{ flex: 1, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", gap: 16 }}>
              {["Params", "Headers", "Body", "Auth", "Scripts"].map((tab, i) => (
                <span key={tab} style={{ fontSize: 12, color: i === 4 ? TEXT : MUTED, fontWeight: i === 4 ? 600 : 400 }}>{tab}</span>
              ))}
            </div>
            <div style={{ padding: 16, fontFamily: MONO, fontSize: 13, lineHeight: 1.8 }}>
              {scriptLines.map((line, i) => {
                const lineOpacity = interpolate(frame, [i * 3, i * 3 + 8], [0, 1], CLAMP);
                return (
                  <div key={i} style={{ opacity: lineOpacity, color: line.color || "transparent" }}>
                    <span style={{ color: "#3f3f46", marginRight: 16, userSelect: "none" }}>{String(i + 1).padStart(2)}</span>
                    {line.text || "\u00A0"}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test results (right) */}
          <div style={{ width: 440, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", gap: 16 }}>
              <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>Test Results</span>
            </div>
            <div style={{ padding: 16 }}>
              {results.map((r, i) => {
                const rOpacity = interpolate(frame, [resultsFrame + i * 12, resultsFrame + i * 12 + 8], [0, 1], CLAMP);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      marginBottom: 8,
                      borderRadius: 8,
                      background: `${GREEN}08`,
                      border: `1px solid ${GREEN}20`,
                      opacity: rOpacity,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>✓</span>
                    <span style={{ color: TEXT, fontSize: 14, flex: 1 }}>{r.name}</span>
                    <span style={{ color: GREEN, fontSize: 13, fontWeight: 600 }}>PASS</span>
                    <span style={{ color: MUTED, fontSize: 12 }}>{r.time}</span>
                  </div>
                );
              })}

              {/* Summary */}
              {(() => {
                const sumOpacity = interpolate(frame, [resultsFrame + 30, resultsFrame + 38], [0, 1], CLAMP);
                return (
                  <div style={{ marginTop: 24, padding: "12px 16px", borderRadius: 8, border: `1px solid ${BORDER}`, opacity: sumOpacity }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <span style={{ color: MUTED }}>Total</span>
                      <span style={{ color: TEXT, fontWeight: 600 }}>2 tests</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 8 }}>
                      <span style={{ color: MUTED }}>Passed</span>
                      <span style={{ color: GREEN, fontWeight: 600 }}>2 / 2</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 8 }}>
                      <span style={{ color: MUTED }}>Duration</span>
                      <span style={{ color: TEXT, fontWeight: 600 }}>4ms</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  );
}

/* ─── Scene 3: Collection runner — run all requests ──────────────────── */

function Scene3_CollectionRunner() {
  const frame = useCurrentFrame();

  const requests = [
    { method: "GET", methodColor: GREEN, name: "List Users", status: "200 OK", time: "45ms", delay: 5 },
    { method: "POST", methodColor: YELLOW, name: "Create User", status: "201 Created", time: "123ms", delay: 18 },
    { method: "GET", methodColor: GREEN, name: "Get User", status: "200 OK", time: "38ms", delay: 31 },
    { method: "PUT", methodColor: BLUE, name: "Update User", status: "200 OK", time: "67ms", delay: 44 },
    { method: "DEL", methodColor: RED, name: "Delete User", status: "204 No Content", time: "29ms", delay: 57 },
  ];

  const allDone = frame > 70;
  const summaryOpacity = interpolate(frame, [72, 80], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: SANS }}>
      <AppChrome title="ApiArk — Collection Runner">
        <div style={{ height: 560, display: "flex", flexDirection: "column" }}>
          {/* Runner header */}
          <div style={{ padding: "12px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>Running: User Service</span>
            <span style={{ fontSize: 12, color: MUTED }}>Environment: production</span>
            <div style={{ marginLeft: "auto" }}>
              {allDone ? (
                <span style={{ fontSize: 13, fontWeight: 600, color: GREEN, opacity: summaryOpacity }}>5/5 passed</span>
              ) : (
                <span style={{ fontSize: 13, color: ACCENT }}>Running...</span>
              )}
            </div>
          </div>

          {/* Results list */}
          <div style={{ flex: 1, padding: 20 }}>
            {requests.map((req, i) => {
              const rowOpacity = interpolate(frame, [req.delay, req.delay + 8], [0, 1], CLAMP);
              const checkOpacity = interpolate(frame, [req.delay + 5, req.delay + 10], [0, 1], CLAMP);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 16px",
                    marginBottom: 6,
                    borderRadius: 8,
                    border: `1px solid ${BORDER}`,
                    opacity: rowOpacity,
                  }}
                >
                  <span style={{ fontSize: 16, color: GREEN, opacity: checkOpacity, width: 20 }}>✓</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: req.methodColor, fontFamily: MONO, width: 40 }}>{req.method}</span>
                  <span style={{ fontSize: 14, color: TEXT, flex: 1 }}>{req.name}</span>
                  <span style={{ fontSize: 13, color: GREEN, fontWeight: 500 }}>{req.status}</span>
                  <span style={{ fontSize: 12, color: MUTED, fontFamily: MONO }}>{req.time}</span>
                </div>
              );
            })}

            {/* Summary bar */}
            <div
              style={{
                marginTop: 24,
                padding: "16px 20px",
                borderRadius: 8,
                background: `${GREEN}08`,
                border: `1px solid ${GREEN}15`,
                display: "flex",
                justifyContent: "space-between",
                opacity: summaryOpacity,
              }}
            >
              <div style={{ display: "flex", gap: 32 }}>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>Passed</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: GREEN }}>5</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>Failed</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: TEXT }}>0</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>Duration</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: TEXT }}>302ms</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: GREEN }}>All tests passed</span>
              </div>
            </div>
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  );
}

/* ─── Scene 4: GraphQL query + response ──────────────────────────────── */

function Scene4_GraphQL() {
  const frame = useCurrentFrame();

  const queryLines = [
    'query GetUserProfile($id: ID!) {',
    '  user(id: $id) {',
    '    id',
    '    name',
    '    email',
    '    orders {',
    '      id',
    '      total',
    '      status',
    '    }',
    '  }',
    '}',
  ];

  const responseLines = [
    '{',
    '  "data": {',
    '    "user": {',
    '      "id": "usr_k8x2m",',
    '      "name": "Sarah Chen",',
    '      "email": "sarah@example.com",',
    '      "orders": [',
    '        { "id": "ord_9x2k", "total": 149.99, "status": "delivered" },',
    '        { "id": "ord_3m8p", "total": 89.00, "status": "shipped" }',
    '      ]',
    '    }',
    '  }',
    '}',
  ];

  const sendFrame = 42;
  const sent = frame >= sendFrame;

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: SANS }}>
      <AppChrome title="ApiArk — GraphQL">
        <div style={{ display: "flex", height: 560 }}>
          {/* Query editor */}
          <div style={{ flex: 1, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: PINK, background: `${PINK}15`, padding: "4px 10px", borderRadius: 6, fontFamily: MONO }}>GQL</span>
              <span style={{ fontSize: 13, color: MUTED, fontFamily: MONO }}>api.example.com/graphql</span>
            </div>
            <div style={{ padding: 16, fontFamily: MONO, fontSize: 13, lineHeight: 1.8 }}>
              {queryLines.map((line, i) => {
                const lineOpacity = interpolate(frame, [i * 2.5, i * 2.5 + 6], [0, 1], CLAMP);
                const highlighted = line
                  .replace(/\b(query|mutation)\b/g, '<span style="color:#f472b6">$1</span>')
                  .replace(/(\$\w+)/g, '<span style="color:#fbbf24">$1</span>')
                  .replace(/\b(ID|String|Int)(!?)\b/g, '<span style="color:#06b6d4">$1$2</span>');
                return (
                  <div key={i} style={{ opacity: lineOpacity, color: "#a1a1aa" }}>
                    <span style={{ color: "#3f3f46", marginRight: 16 }}>{String(i + 1).padStart(2)}</span>
                    <span dangerouslySetInnerHTML={{ __html: highlighted }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Response */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 16, opacity: sent ? 1 : 0.3 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>200 OK</span>
              <span style={{ fontSize: 12, color: MUTED }}>89ms</span>
              <span style={{ fontSize: 12, color: MUTED }}>1.8 KB</span>
            </div>
            <div style={{ padding: 16, fontFamily: MONO, fontSize: 13, lineHeight: 1.7 }}>
              {responseLines.map((line, i) => {
                const lineOpacity = interpolate(frame, [sendFrame + 4 + i * 2, sendFrame + 10 + i * 2], [0, 1], CLAMP);
                const highlighted = line
                  .replace(/"(\w+)":/g, '<span style="color:#818cf8">"$1"</span>:')
                  .replace(/: "([^"]+)"/g, ': <span style="color:#34d399">"$1"</span>')
                  .replace(/: (\d+\.?\d*)/g, ': <span style="color:#fbbf24">$1</span>');
                return (
                  <div key={i} style={{ opacity: lineOpacity, color: "#a1a1aa" }}>
                    <span style={{ color: "#3f3f46", marginRight: 16 }}>{String(i + 1).padStart(2)}</span>
                    <span dangerouslySetInnerHTML={{ __html: highlighted }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  );
}

/* ─── Scene 5: CLI runner in terminal ────────────────────────────────── */

function Scene5_CLI() {
  const frame = useCurrentFrame();

  const lines = [
    { text: "$ apiark run user-service --env production", color: TEXT, delay: 0 },
    { text: "", color: "", delay: 12 },
    { text: " Running 5 requests...", color: MUTED, delay: 14 },
    { text: "", color: "", delay: 18 },
    { text: "  ✓ GET    /api/users          200 OK          45ms", color: GREEN, delay: 20 },
    { text: "  ✓ POST   /api/users          201 Created    123ms", color: GREEN, delay: 28 },
    { text: "  ✓ GET    /api/users/:id      200 OK          38ms", color: GREEN, delay: 36 },
    { text: "  ✓ PUT    /api/users/:id      200 OK          67ms", color: GREEN, delay: 44 },
    { text: "  ✓ DELETE /api/users/:id      204 No Content  29ms", color: GREEN, delay: 52 },
    { text: "", color: "", delay: 58 },
    { text: "  Tests:    7 passed, 0 failed", color: ACCENT, delay: 60 },
    { text: "  Duration: 302ms", color: ACCENT, delay: 63 },
    { text: "  Status:   PASS", color: GREEN, delay: 66 },
    { text: "", color: "", delay: 70 },
    { text: "$ echo $?", color: TEXT, delay: 74 },
    { text: "0", color: GREEN, delay: 78 },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: SANS }}>
      <AppChrome title="Terminal — apiark">
        <div style={{ height: 560, padding: "20px 24px", fontFamily: MONO, fontSize: 14, lineHeight: 1.9 }}>
          {lines.map((line, i) => {
            const opacity = interpolate(frame - line.delay, [0, 6], [0, 1], CLAMP);
            return (
              <div key={i} style={{ opacity, color: line.color || TEXT, whiteSpace: "pre" }}>
                {line.text || "\u00A0"}
              </div>
            );
          })}
        </div>
      </AppChrome>
    </AbsoluteFill>
  );
}

/* ─── Main Composition ───────────────────────────────────────────────── */

export function ApiArkDemoVideo() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={120}>
        <Scene1_SendRequest />
      </Sequence>
      <Sequence from={120} durationInFrames={110}>
        <Scene2_WriteTest />
      </Sequence>
      <Sequence from={230} durationInFrames={110}>
        <Scene3_CollectionRunner />
      </Sequence>
      <Sequence from={340} durationInFrames={100}>
        <Scene4_GraphQL />
      </Sequence>
      <Sequence from={440} durationInFrames={100}>
        <Scene5_CLI />
      </Sequence>
    </AbsoluteFill>
  );
}

export const VIDEO_CONFIG = {
  id: "ApiArkDemo",
  fps: 30,
  durationInFrames: 540, // 18 seconds
  width: 1920,
  height: 1080,
};

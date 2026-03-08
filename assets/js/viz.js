/* ============================================================
   SENTINEL MESH — Detection Cascade Visualization
   viz.css — SM-VIZ-1.3
   3rc0.github.io/assets/css/viz.css
   ============================================================ */

/* ── SELF-HOSTED FONTS ─────────────────────────────────────── */
@font-face {
  font-family: 'Share Tech Mono';
  src: url('../fonts/share-tech-mono-v16-latin-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Barlow Condensed';
  src: url('../fonts/barlow-condensed-v13-latin-300.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Barlow Condensed';
  src: url('../fonts/barlow-condensed-v13-latin-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Barlow Condensed';
  src: url('../fonts/barlow-condensed-v13-latin-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Barlow Condensed';
  src: url('../fonts/barlow-condensed-v13-latin-900.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Barlow';
  src: url('../fonts/barlow-v13-latin-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ── DESIGN TOKENS ─────────────────────────────────────────── */
:root {
  /* Colours */
  --bg:       #030810;
  --bg2:      #060d18;
  --bg3:      #0a1525;
  --surface:  #0d1b2e;
  --amber:    #f5a623;
  --amber2:   #fbbf4e;
  --amber-d:  #7a4f0a;
  --cyan:     #00d4f5;
  --green:    #39d353;
  --red:      #ff4757;
  --text:     #c8daea;
  --text2:    #6b8aaa;
  --muted:    #304560;
  --grid:     rgba(0, 212, 245, 0.04);
  --accent:   var(--amber);

  /* Typography */
  --f-mono: 'Share Tech Mono', 'Courier New', Courier, monospace;
  --f-head: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
  --f-body: 'Barlow', system-ui, -apple-system, sans-serif;

  /* Canvas */
  --det-range: 55px;
}

/* ── FIXED STATS BAR ────────────────────────────────────────── */
.stats-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 500;
  background: rgba(3, 8, 16, 0.96);
  border-bottom: 1px solid rgba(0, 212, 245, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.stats-bar-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 42px;
  display: flex;
  align-items: center;
  gap: 0;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0 1.4rem;
  flex-shrink: 0;
}

.stat-value {
  font-family: var(--f-head);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: var(--accent);
  line-height: 1;
  transition: color 0.4s;
}

.stat-label {
  font-family: var(--f-mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text2);
  white-space: nowrap;
}

.stat-div {
  width: 1px;
  height: 18px;
  background: var(--muted);
  flex-shrink: 0;
}

.stat-tagline {
  font-family: var(--f-head);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text2);
  margin-left: auto;
  padding-left: 1.4rem;
  white-space: nowrap;
}

/* Push page content below fixed bar */
.stats-bar-offset {
  padding-top: 42px;
}

/* ── RESET ──────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { font-size: 18px; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--f-body);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Background grid */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

/* Scanline overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 1;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 3px
  );
  pointer-events: none;
}

/* ── LAYOUT ─────────────────────────────────────────────────── */
.wrap {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 1.5rem;
  align-items: start;
}

.pipeline {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1rem;
}

/* ── ANIMATIONS ─────────────────────────────────────────────── */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes poleGlow {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

/* ── HEADER ─────────────────────────────────────────────────── */
.sys-header {
  border-bottom: 1px solid rgba(0, 212, 245, 0.14);
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
}

.sys-logo {
  font-family: var(--f-head);
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--amber);
}
.sys-logo span { color: var(--text2); font-weight: 300; }

.sys-tag {
  font-family: var(--f-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--text2);
  border: 1px solid var(--muted);
  padding: 0.22rem 0.55rem;
}

.sys-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.sys-clock {
  font-family: var(--f-mono);
  font-size: 0.85rem;
  color: var(--cyan);
  letter-spacing: 0.08em;
}

.sys-status {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--f-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--green);
  text-transform: uppercase;
}

.pulse-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: blink 1.8s infinite;
  flex-shrink: 0;
}

/* ── PAGE TITLE ─────────────────────────────────────────────── */
.viz-title {
  text-align: center;
  margin-bottom: 1.2rem;
}

.viz-title h1 {
  font-family: var(--f-head);
  font-size: clamp(2.2rem, 4.5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  line-height: 1;
  margin-bottom: 0.4rem;
}
.viz-title h1 em { color: var(--amber); font-style: normal; }

.viz-title .sub {
  font-family: var(--f-mono);
  font-size: 0.78rem;
  letter-spacing: 0.15em;
  color: var(--text2);
  text-transform: uppercase;
}

/* ── SCENARIO SELECTOR ──────────────────────────────────────── */
.scenario-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.sc-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 0.5rem 0.65rem;
  background: var(--surface);
  border: 1px solid var(--muted);
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s;
  overflow: hidden;
  color: inherit;
  font-family: inherit;
}
.sc-btn::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--muted);
  transition: background 0.25s, box-shadow 0.25s;
}
.sc-btn:hover {
  border-color: rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.025);
}
.sc-btn.active {
  border-color: var(--btn-accent, var(--amber));
  background: rgba(245,166,35,0.04);
}
.sc-btn.active::before {
  background: var(--btn-accent, var(--amber));
  box-shadow: 0 0 10px var(--btn-accent, var(--amber));
}

.sc-btn-icon {
  font-size: 1.6rem;
  line-height: 1;
  filter: grayscale(1) opacity(0.4);
  transition: filter 0.25s;
}
.sc-btn.active .sc-btn-icon { filter: none; }

.sc-btn-label {
  font-family: var(--f-head);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text2);
  line-height: 1.1;
  text-align: center;
  transition: color 0.25s;
}
.sc-btn.active .sc-btn-label { color: var(--btn-accent, var(--amber)); }

.sc-btn-status {
  font-family: var(--f-mono);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.25s;
}
.sc-btn.active .sc-btn-status {
  color: var(--btn-accent, var(--amber));
}

/* ── SCENARIO INFO CARD ─────────────────────────────────────── */
.scenario-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--muted);
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.4rem;
  transition: border-color 0.4s, background 0.4s;
  overflow: hidden;
}

.scenario-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--accent);
  box-shadow: 0 0 16px var(--accent);
  transition: background 0.4s, box-shadow 0.4s;
}

.sc-icon {
  font-size: 2.2rem;
  flex-shrink: 0;
  line-height: 1;
  width: 46px;
  text-align: center;
}

.sc-left { flex: 1; }

.sc-label {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text2);
  margin-bottom: 0.28rem;
}

.sc-name {
  font-family: var(--f-head);
  font-size: 1.7rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  line-height: 1;
}
.sc-name em { font-style: normal; color: var(--accent); }

.sc-desc {
  font-family: var(--f-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--text2);
  margin-top: 0.3rem;
  line-height: 1.75;
}

.sc-sensors {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.sc-sensor-tag {
  font-family: var(--f-mono);
  font-size: 0.63rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.18rem 0.5rem;
  border: 1px solid var(--muted);
  color: var(--text2);
  background: rgba(0,0,0,0.3);
}
.sc-sensor-tag.active {
  color: var(--accent);
  border-color: var(--accent);
}

/* Auto-rotate indicator */
.sc-auto {
  font-family: var(--f-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  white-space: nowrap;
}
.sc-auto .auto-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  transition: background 0.3s;
}
.sc-auto.running .auto-dot {
  background: var(--green);
  box-shadow: 0 0 5px var(--green);
  animation: blink 2s infinite;
}
.sc-auto.manual .auto-dot { background: var(--amber); }

/* Title overlay removed — replaced by scenario selector buttons */

/* ── TIMER BAR ──────────────────────────────────────────────── */
.timer-bar-wrap {
  background: var(--bg3);
  border: 1px solid var(--muted);
  padding: 0.75rem 1.3rem;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.timer-label {
  font-family: var(--f-mono);
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  color: var(--text2);
  text-transform: uppercase;
  flex-shrink: 0;
}

.timer-track {
  flex: 1;
  height: 4px;
  background: var(--muted);
  position: relative;
  overflow: hidden;
}

.timer-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: var(--accent);
  width: 0%;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px var(--accent);
}

.timer-elapsed {
  font-family: var(--f-mono);
  font-size: 1rem;
  color: var(--accent);
  letter-spacing: 0.05em;
  flex-shrink: 0;
  min-width: 58px;
  text-align: right;
}

.timer-cycle {
  font-family: var(--f-mono);
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

/* ── STAGE ──────────────────────────────────────────────────── */
.stage {
  border: 1px solid var(--muted);
  background: var(--surface);
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, background 0.3s;
}

.stage::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--muted);
  transition: background 0.3s, box-shadow 0.3s;
}

.stage.active {
  border-color: var(--accent);
  background: rgba(245, 166, 35, 0.04);
}
.stage.active::before {
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent);
}

.stage.done {
  border-color: rgba(57, 211, 83, 0.35);
  background: rgba(57, 211, 83, 0.02);
}
.stage.done::before { background: var(--green); }

/* Stage header */
.stage-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.3rem;
  cursor: pointer;
  user-select: none;
  min-height: 62px;
  transition: background 0.2s;
}
.stage-head:hover { background: rgba(255,255,255,0.02); }

.stage-num {
  font-family: var(--f-mono);
  font-size: 0.74rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  width: 28px;
  flex-shrink: 0;
}
.stage.active .stage-num { color: var(--accent); }
.stage.done   .stage-num { color: var(--green); }

.stage-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 30px;
  text-align: center;
  filter: grayscale(1) opacity(0.3);
  transition: filter 0.3s;
}
.stage.active .stage-icon,
.stage.done   .stage-icon { filter: none; }

.stage-name {
  font-family: var(--f-head);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text2);
  transition: color 0.3s;
}
.stage.active .stage-name { color: var(--accent); }
.stage.done   .stage-name { color: var(--green); }

.stage-summary {
  font-family: var(--f-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--text2);
  margin-left: auto;
  text-align: right;
  line-height: 1.8;
  padding-right: 0.6rem;
}
.stage.active .stage-summary { color: var(--amber2); }
.stage.done   .stage-summary { color: var(--green); }

.conf-mini {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: flex-end;
  margin-top: 0.18rem;
}

.conf-track {
  width: 72px;
  height: 2px;
  background: var(--muted);
  position: relative;
}

.conf-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: var(--accent);
  transition: width 0.8s ease;
}
.stage.done .conf-fill { background: var(--green); }

.conf-pct {
  font-family: var(--f-mono);
  font-size: 0.68rem;
  color: var(--muted);
}

.stage-toggle {
  font-size: 0.68rem;
  color: var(--muted);
  transition: transform 0.3s, color 0.2s;
  flex-shrink: 0;
  margin-left: 0.5rem;
}
.stage-toggle.open { transform: rotate(90deg); color: var(--accent); }

/* Stage body */
.stage-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.stage-body.open { max-height: 700px; }

/* Sub-section button */
.sub-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.62rem 1.3rem;
  background: none;
  border: none;
  border-top: 1px solid rgba(74, 100, 128, 0.12);
  cursor: pointer;
  text-align: left;
  color: inherit;
  transition: background 0.15s;
}
.sub-btn:hover { background: rgba(255,255,255,0.025); }

.sub-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
  width: 22px;
  text-align: center;
  opacity: 0.4;
  transition: opacity 0.2s;
}
.sub-btn.active .sub-icon { opacity: 1; }

.sub-label {
  font-family: var(--f-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text2);
  flex: 1;
  transition: color 0.2s;
}
.sub-btn.active .sub-label { color: var(--accent); }

.sub-badge {
  font-family: var(--f-mono);
  font-size: 0.67rem;
  letter-spacing: 0.07em;
  color: var(--muted);
  padding: 0.14rem 0.44rem;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.sub-btn.active .sub-badge {
  color: var(--accent);
  border-color: var(--amber-d);
}

.sub-arr {
  font-size: 0.62rem;
  color: var(--muted);
  transition: transform 0.25s, color 0.2s;
  flex-shrink: 0;
}
.sub-btn.active .sub-arr { transform: rotate(90deg); color: var(--accent); }

/* Sub content */
.sub-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(3, 8, 16, 0.5);
}
.sub-content.open { max-height: 420px; }

.sub-inner {
  padding: 0.8rem 1.3rem;
  border-top: 1px solid rgba(74, 100, 128, 0.08);
}

/* ── DATA — SENSOR ROWS ─────────────────────────────────────── */
.sensor-row {
  display: grid;
  grid-template-columns: 150px 110px 1fr 60px;
  gap: 0.5rem;
  align-items: center;
  padding: 0.42rem 0;
  border-bottom: 1px solid rgba(74, 100, 128, 0.07);
  font-family: var(--f-mono);
  font-size: 0.76rem;
  letter-spacing: 0.05em;
}
.sensor-row:last-child { border-bottom: none; }

.sr-name { color: var(--text2); }
.sr-type { color: var(--cyan); font-size: 0.66rem; }

.sr-bar {
  height: 3px;
  background: var(--muted);
  position: relative;
}

.sr-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  transition: width 1.1s ease;
}

.sr-val { color: var(--amber); text-align: right; }

/* ── DATA — TABLE ───────────────────────────────────────────── */
.dtable { width: 100%; border-collapse: collapse; }

.dtable td {
  font-family: var(--f-mono);
  font-size: 0.76rem;
  letter-spacing: 0.04em;
  padding: 0.38rem 0.52rem;
  border-bottom: 1px solid rgba(74, 100, 128, 0.07);
  vertical-align: top;
}
.dtable td:first-child {
  color: var(--text2);
  width: 175px;
  white-space: nowrap;
}
.dtable td:last-child { color: var(--text); }

.dtable .hi   { color: var(--amber); }
.dtable .ok   { color: var(--green); }
.dtable .warn { color: var(--red); }

/* ── DATA — RAW LOG ─────────────────────────────────────────── */
.raw-log {
  background: rgba(3, 8, 16, 0.95);
  padding: 0.6rem 0.85rem;
  font-family: var(--f-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--text2);
  line-height: 2.1;
  max-height: 140px;
  overflow-y: auto;
  white-space: pre;
}
.raw-log .lt { color: var(--muted); }
.raw-log .lh { color: var(--amber); }
.raw-log .lo { color: var(--green); }
.raw-log .le { color: var(--red); }

/* ── RIGHT PANEL ────────────────────────────────────────────── */
.panel-card {
  background: var(--surface);
  border: 1px solid var(--muted);
}

.panel-head {
  font-family: var(--f-mono);
  font-size: 0.73rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text2);
  padding: 0.65rem 1.1rem;
  border-bottom: 1px solid rgba(74, 100, 128, 0.2);
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.panel-head .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cyan);
  flex-shrink: 0;
}

/* Canvas */
#node-canvas { display: block; width: 100%; }

/* Node grid legend */
.node-legend {
  display: flex;
  gap: 0.9rem;
  padding: 0.55rem 1.1rem;
  border-top: 1px solid rgba(74, 100, 128, 0.15);
  flex-wrap: wrap;
}

.nl-item {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  font-family: var(--f-mono);
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  color: var(--text2);
}

.nl-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Evidence chain */
.ev-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.52rem 1.1rem;
  border-bottom: 1px solid rgba(74, 100, 128, 0.08);
  font-family: var(--f-mono);
  font-size: 0.72rem;
  letter-spacing: 0.05em;
}
.ev-row:last-child { border-bottom: none; }

.ev-icon  { font-size: 0.95rem; flex-shrink: 0; }
.ev-label { color: var(--text2); flex: 1; }
.ev-val   { color: var(--text); text-align: right; }

.ev-val.hi      { color: var(--amber); }
.ev-val.ok      { color: var(--green); }
.ev-val.pending { color: var(--muted); }

/* Alert feed */
.alert-list {
  padding: 0.3rem 0;
  max-height: 170px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  gap: 0.65rem;
  padding: 0.42rem 1.1rem;
  border-bottom: 1px solid rgba(74, 100, 128, 0.08);
  animation: slideIn 0.3s ease;
  align-items: flex-start;
}
.alert-item:last-child { border-bottom: none; }

.alert-ts {
  font-family: var(--f-mono);
  font-size: 0.65rem;
  color: var(--muted);
  flex-shrink: 0;
  margin-top: 0.1rem;
  white-space: nowrap;
}

.alert-msg {
  font-family: var(--f-mono);
  font-size: 0.71rem;
  letter-spacing: 0.04em;
  color: var(--text2);
  line-height: 1.7;
}
.alert-msg .hi   { color: var(--amber); }
.alert-msg .ok   { color: var(--green); }
.alert-msg .warn { color: var(--red); }

/* ── BOTTOM LOG ─────────────────────────────────────────────── */
.bottom-log {
  margin-top: 1.2rem;
  background: var(--bg2);
  border: 1px solid var(--muted);
}

.log-stream {
  padding: 0.5rem 1.1rem;
  height: 90px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

.ls-line {
  font-family: var(--f-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--text2);
  line-height: 2.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: fadeIn 0.3s ease;
}
.ls-line .ts   { color: var(--muted); }
.ls-line .node { color: var(--cyan); }
.ls-line .evt  { color: var(--amber); }
.ls-line .ok   { color: var(--green); }

/* ── VERSION BADGE ──────────────────────────────────────────── */
.version-badge {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  font-family: var(--f-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  border: 1px solid var(--muted);
  padding: 0.3rem 0.6rem;
  background: var(--bg);
  z-index: 200;
}

/* ── RESPONSIVE ─────────────────────────────────────────────── */
@media (max-width: 1000px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  .right-panel {
    position: static;
  }
  .stat-tagline { display: none; }
}

@media (max-width: 600px) {
  html { font-size: 16px; }
  .scenario-selector { grid-template-columns: repeat(2, 1fr); }
  .scenario-card { flex-wrap: wrap; }
  .sensor-row {
    grid-template-columns: 110px 80px 1fr 48px;
    font-size: 0.68rem;
  }
  .stat-item { padding: 0 0.7rem; }
  .stat-label { display: none; }
}

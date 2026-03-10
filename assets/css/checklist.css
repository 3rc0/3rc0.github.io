/*
 * checklist.css — SecCheck Modern Edition
 * Linear-inspired · DM Sans · Purple accent
 * Light default + Dark toggle via data-theme="dark"
 * WCAG AA compliant
 */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=JetBrains+Mono:wght@400;600&display=swap');

/* ─── 1. SCOPED RESET ───────────────────────────────── */
#cl-app { max-width: 800px; margin: 0 auto; padding: 0 0 60px; font-size: 14px; line-height: 1.5; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
#cl-app *, #cl-app *::before, #cl-app *::after { box-sizing: border-box; }
#cl-app div, #cl-app span, #cl-app button, #cl-app input, #cl-app textarea, #cl-app label, #cl-app a, #cl-app p, #cl-app h1, #cl-app h2, #cl-app h3 { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
#cl-app p { margin:0; padding:0; line-height:inherit; }
#cl-app h2 { margin:0; padding:0; font-weight:700; line-height:1.2; font-size:inherit; }
#cl-app a { color:inherit; text-decoration:none; }
#cl-app a:hover { color:inherit; }
#cl-app label { margin:0; font-weight:inherit; }

/* ─── 2. LIGHT THEME (default) ───────────────────────── */
#cl-app {
  --accent:#7c3aed; --accent2:#8b5cf6; --accent-subtle:rgba(124,58,237,0.07); --accent-border:rgba(124,58,237,0.18); --accent-glow:rgba(124,58,237,0.1);
  --bg:#ffffff; --bg2:#fafafa; --bg3:#f4f4f5; --surface:#ffffff;
  --border:#e4e4e7; --border2:#d4d4d8;
  --text:#18181b; --text2:#52525b; --text3:#a1a1aa; --text-dim:#71717a;
  --green:#10b981; --green2:rgba(16,185,129,0.08); --green-border:rgba(16,185,129,0.2);
  --red:#ef4444; --red2:rgba(239,68,68,0.06); --red-border:rgba(239,68,68,0.18);
  --orange:#f59e0b; --blue:#3b82f6;
  --done-bg:rgba(16,185,129,0.05);
  --shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04); --shadow-lg:0 4px 12px rgba(0,0,0,0.08);
  --r:8px; --r-lg:12px;
  --mono:'JetBrains Mono','SF Mono','Fira Code',monospace;
  color:var(--text); background:transparent;
}

/* ─── 3. DARK THEME ──────────────────────────────────── */
#cl-app[data-theme="dark"] {
  --accent:#8b5cf6; --accent2:#a78bfa; --accent-subtle:rgba(139,92,246,0.1); --accent-border:rgba(139,92,246,0.22); --accent-glow:rgba(139,92,246,0.12);
  --bg:#09090b; --bg2:#0f0f12; --bg3:#18181b; --surface:#18181b;
  --border:#27272a; --border2:#3f3f46;
  --text:#fafafa; --text2:#a1a1aa; --text3:#52525b; --text-dim:#71717a;
  --green:#34d399; --green2:rgba(52,211,153,0.1); --green-border:rgba(52,211,153,0.25);
  --red:#f87171; --red2:rgba(248,113,113,0.1); --red-border:rgba(248,113,113,0.2);
  --orange:#fbbf24; --blue:#60a5fa;
  --done-bg:rgba(52,211,153,0.06);
  --shadow:0 1px 3px rgba(0,0,0,0.3); --shadow-lg:0 4px 12px rgba(0,0,0,0.4);
  color:var(--text);
}

/* ─── 4. ANIMATIONS ──────────────────────────────────── */
@keyframes cl-up { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
@keyframes cl-spin { to{transform:rotate(360deg)} }
@keyframes cl-shake { 0%,100%{transform:translateX(0)} 30%{transform:translateX(-4px)} 70%{transform:translateX(4px)} }
@keyframes cl-pop { 0%{transform:scale(0.92)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
@keyframes cl-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
.fade-up { animation:cl-up 0.2s ease both; }

/* ─── 5. SPINNER ─────────────────────────────────────── */
#cl-app .cl-spinner { width:24px; height:24px; border:2.5px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:cl-spin 0.7s linear infinite; margin:0 auto 12px; }

/* ─── 6. THEME TOGGLE ────────────────────────────────── */
#cl-app .cl-theme-toggle { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:6px; border:1px solid var(--border); background:none; color:var(--text2); font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s; font-family:inherit; }
#cl-app .cl-theme-toggle:hover { border-color:var(--accent); color:var(--accent); }

/* ─── 7. AUTH ────────────────────────────────────────── */
#cl-app .cl-auth { max-width:380px; margin:0 auto; padding-top:40px; }
#cl-app .cl-auth-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:28px 24px; position:relative; box-shadow:var(--shadow-lg); }
#cl-app .cl-auth-logo { font-size:32px; text-align:center; margin-bottom:8px; }
#cl-app .cl-auth-title { font-size:20px; font-weight:700; color:var(--text); text-align:center; margin-bottom:4px; letter-spacing:-0.02em; }
#cl-app .cl-auth-sub { font-size:13px; color:var(--text3); text-align:center; margin-bottom:20px; }
#cl-app .cl-tabs { display:flex; gap:2px; background:var(--bg3); border-radius:var(--r); padding:3px; margin-bottom:18px; }
#cl-app .cl-tab { flex:1; padding:7px; border:none; border-radius:6px; background:transparent; color:var(--text3); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:inherit; }
#cl-app .cl-tab.active { background:var(--surface); color:var(--text); box-shadow:var(--shadow); }
#cl-app .cl-field { margin-bottom:12px; }
#cl-app .cl-label { display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px; }
#cl-app .cl-input { display:block; width:100%; background:var(--bg2); border:1px solid var(--border); color:var(--text); border-radius:var(--r); padding:9px 12px; font-size:14px; transition:border-color 0.15s,box-shadow 0.15s; font-family:inherit; }
#cl-app .cl-input:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
#cl-app .cl-input.error { border-color:var(--red); animation:cl-shake 0.35s ease; }
#cl-app .cl-input-hint { font-size:11px; color:var(--text3); margin-top:3px; }
#cl-app .cl-auth-error { display:none; background:var(--red2); border:1px solid var(--red-border); border-radius:var(--r); padding:9px 12px; font-size:13px; color:var(--red); margin-bottom:12px; }
#cl-app .cl-auth-error.show { display:block; }

/* ─── 8. BUTTONS ─────────────────────────────────────── */
#cl-app .cl-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:7px 14px; border:none; border-radius:var(--r); font-size:13px; font-weight:600; line-height:1; cursor:pointer; transition:all 0.15s; text-decoration:none; white-space:nowrap; font-family:inherit; }
#cl-app .cl-btn:hover:not(:disabled) { transform:translateY(-1px); }
#cl-app .cl-btn:active:not(:disabled) { transform:translateY(0); }
#cl-app .cl-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
#cl-app .cl-btn-full { width:100%; margin-top:4px; }
#cl-app .cl-btn-primary { background:var(--accent); color:#fff; }
#cl-app .cl-btn-primary:hover:not(:disabled) { background:var(--accent2); }
#cl-app .cl-btn-ghost { background:none; color:var(--text2); border:1px solid var(--border); }
#cl-app .cl-btn-ghost:hover { border-color:var(--accent); color:var(--accent); }
#cl-app .cl-btn-success { background:var(--green2); color:var(--green); border:1px solid var(--green-border); }
#cl-app .cl-btn-danger { background:var(--red2); color:var(--red); border:1px solid var(--red-border); }
#cl-app .cl-btn-warn { background:var(--accent-subtle); color:var(--accent); border:1px solid var(--accent-border); }
#cl-app .cl-btn-sm { padding:5px 10px; font-size:12px; }

/* ─── 9. APP HEADER ──────────────────────────────────── */
#cl-app .cl-header { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:16px 18px; margin-bottom:8px; box-shadow:var(--shadow); }
#cl-app .cl-header-top { display:flex; align-items:center; gap:14px; }
#cl-app .cl-ring { position:relative; width:48px; height:48px; flex-shrink:0; }
#cl-app .cl-ring svg { display:block; }
#cl-app .cl-ring-label { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:var(--accent); font-family:var(--mono); }
#cl-app .cl-title-block { flex:1; min-width:0; }
#cl-app .cl-title-block h2 { font-size:18px; font-weight:700; color:var(--text); margin-bottom:2px; letter-spacing:-0.02em; }
#cl-app .cl-user-badge { font-size:12px; color:var(--accent); margin-bottom:3px; font-family:var(--mono); }
#cl-app .cl-prog-text { font-size:12px; color:var(--text3); margin-bottom:6px; }
#cl-app .cl-progress-bar { height:3px; background:var(--bg3); border-radius:99px; overflow:hidden; }
#cl-app .cl-progress-fill { height:100%; background:var(--accent); border-radius:99px; transition:width 0.4s ease; }
#cl-app .cl-header-actions { display:flex; gap:6px; flex-wrap:wrap; margin-top:12px; padding-top:12px; border-top:1px solid var(--border); }
#cl-app .cl-saving { font-size:11px; color:var(--accent); text-align:right; margin-top:4px; font-family:var(--mono); opacity:0.6; }

/* ─── 10. COST STRIP ────────────────────────────────── */
#cl-app .cl-costs { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:8px; }
#cl-app .cl-cost-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:10px 8px; text-align:center; transition:border-color 0.15s; }
#cl-app .cl-cost-card:hover { border-color:var(--border2); }
#cl-app .cl-cost-icon { font-size:18px; margin-bottom:3px; }
#cl-app .cl-cost-val { font-size:15px; font-weight:700; color:var(--accent); }
#cl-app .cl-cost-lbl { font-size:11px; color:var(--text3); margin-top:2px; }

/* ─── 11. SECTIONS ───────────────────────────────────── */
#cl-app .cl-section { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); margin-bottom:6px; overflow:hidden; transition:border-color 0.15s; content-visibility:auto; contain-intrinsic-size:auto 200px; }
#cl-app .cl-section:hover { border-color:var(--border2); }
#cl-app .cl-section.complete { border-color:var(--green-border); }
#cl-app .cl-sec-header { display:flex; align-items:center; gap:10px; padding:10px 14px; cursor:pointer; user-select:none; transition:background 0.1s; }
#cl-app .cl-sec-header:hover { background:var(--bg2); }
#cl-app .cl-sec-icon { width:28px; height:28px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; background:var(--accent-subtle); }
#cl-app .cl-sec-info { flex:1; min-width:0; }
#cl-app .cl-sec-title { font-size:13px; font-weight:600; color:var(--text); }
#cl-app .cl-sec-hint { font-size:11px; color:var(--text3); line-height:1.4; }
#cl-app .cl-sec-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
#cl-app .cl-sec-count { font-size:11px; font-weight:600; color:var(--text3); font-family:var(--mono); background:var(--bg3); padding:1px 8px; border-radius:20px; }
#cl-app .cl-sec-count.done { color:var(--green); background:var(--green2); }
#cl-app .cl-sec-bar { width:36px; height:3px; background:var(--bg3); border-radius:99px; overflow:hidden; }
#cl-app .cl-sec-bar-fill { height:100%; border-radius:99px; transition:width 0.4s ease; }
#cl-app .cl-chevron { font-size:10px; color:var(--text3); transition:transform 0.2s; display:inline-block; line-height:1; }
#cl-app .cl-chevron.open { transform:rotate(180deg); }
#cl-app .cl-sec-del { padding:3px 8px; border-radius:6px; font-size:11px; font-weight:700; background:var(--red2); color:var(--red); border:1px solid var(--red-border); cursor:pointer; font-family:inherit; }

/* ─── 12. ITEMS ──────────────────────────────────────── */
#cl-app .cl-items { border-top:1px solid var(--border); }
#cl-app .cl-item { display:flex; align-items:flex-start; gap:10px; padding:8px 14px; border-bottom:1px solid var(--border); transition:background 0.1s; cursor:pointer; }
#cl-app .cl-item:last-child { border-bottom:none; }
#cl-app .cl-item:hover { background:var(--bg2); }
#cl-app .cl-item.done { background:var(--done-bg); }
#cl-app .cl-item.done .cl-item-name { text-decoration:line-through; color:var(--text3); }
#cl-app .cl-item.done .cl-item-model { opacity:0.3; text-decoration:line-through; }
#cl-app .cl-item.done .cl-item-price { opacity:0.3; text-decoration:line-through; }
#cl-app .cl-item-num { font-size:10px; font-weight:700; color:var(--text3); width:20px; text-align:right; flex-shrink:0; padding-top:3px; font-family:var(--mono); }
#cl-app .cl-item.done .cl-item-num { color:var(--green); opacity:0.5; }
#cl-app .cl-cb { width:16px; height:16px; border-radius:4px; border:1.5px solid var(--border2); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.15s; background:transparent; margin-top:1px; }
#cl-app .cl-cb:hover { border-color:var(--accent); }
#cl-app .cl-cb.on { background:var(--green); border-color:var(--green); animation:cl-pop 0.2s ease; }
#cl-app .cl-item-body { flex:1; min-width:0; }
#cl-app .cl-item-name { font-size:13px; font-weight:500; color:var(--text); line-height:1.4; display:flex; align-items:center; flex-wrap:wrap; gap:6px; }
#cl-app .cl-item-model { font-size:12px; color:var(--accent); margin-top:1px; opacity:0.7; font-family:var(--mono); }
#cl-app .cl-item-detail { font-size:12px; color:var(--text2); margin-top:4px; line-height:1.5; display:none; border-left:2px solid var(--accent-border); padding-left:8px; }
#cl-app .cl-item-detail.open { display:block; }
#cl-app .cl-expand-btn { font-size:11px; color:var(--text3); background:none; border:none; padding:0; margin-top:3px; display:inline-flex; align-items:center; gap:3px; transition:color 0.15s; cursor:pointer; font-family:inherit; }
#cl-app .cl-expand-btn:hover { color:var(--accent); }
#cl-app .cl-item-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
#cl-app .cl-item-price { font-family:var(--mono); font-size:13px; font-weight:600; white-space:nowrap; }
#cl-app .price-free { color:var(--green); }
#cl-app .price-dash { color:var(--text3); }
#cl-app .price-cost { color:var(--accent); }

/* ─── 13. TAGS ───────────────────────────────────────── */
#cl-app .cl-tag { display:inline-flex; align-items:center; padding:1px 6px; border-radius:4px; font-size:10px; font-weight:600; font-family:var(--mono); }
#cl-app .tag-warn { background:var(--red2); color:var(--red); border:1px solid var(--red-border); }
#cl-app .tag-free { background:var(--green2); color:var(--green); border:1px solid var(--green-border); }

/* ─── 14. EDIT CONTROLS ──────────────────────────────── */
#cl-app .cl-edit-btns { display:flex; gap:4px; }
#cl-app .cl-edit-btn { padding:3px 8px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:none; font-family:inherit; }
#cl-app .cl-edit-btn.edit { background:var(--accent-subtle); color:var(--accent); border:1px solid var(--accent-border); }
#cl-app .cl-edit-btn.del { background:var(--red2); color:var(--red); border:1px solid var(--red-border); }
#cl-app .cl-edit-form { flex:1; display:flex; flex-direction:column; gap:5px; }
#cl-app .cl-form-input { display:block; width:100%; background:var(--bg2); border:1px solid var(--border); color:var(--text); border-radius:var(--r); padding:7px 10px; font-size:13px; transition:border-color 0.15s; font-family:inherit; }
#cl-app .cl-form-input:focus { outline:none; border-color:var(--accent); }
#cl-app .cl-form-row { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
#cl-app .cl-add-row { padding:8px 14px; border-top:1px solid var(--border); }
#cl-app .cl-add-btn { background:none; border:1px dashed var(--border); color:var(--text3); padding:6px 12px; border-radius:var(--r); font-size:12px; cursor:pointer; width:100%; transition:all 0.15s; font-family:inherit; }
#cl-app .cl-add-btn:hover { border-color:var(--accent); color:var(--accent); }
#cl-app .cl-add-section { margin:8px 0 20px; }

/* ─── 15. LOG PANEL ──────────────────────────────────── */
#cl-app .cl-log-panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:14px; margin-bottom:8px; max-height:300px; overflow-y:auto; }
#cl-app .cl-log-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
#cl-app .cl-log-title { font-weight:700; font-size:14px; color:var(--text); }
#cl-app .cl-log-empty { font-size:13px; color:var(--text3); text-align:center; padding:16px; }
#cl-app .cl-log-entry { display:flex; gap:8px; align-items:flex-start; padding:6px 0; border-bottom:1px solid var(--border); font-size:13px; }
#cl-app .cl-log-entry:last-child { border-bottom:none; }
#cl-app .cl-log-time { font-size:11px; color:var(--text3); white-space:nowrap; padding-top:1px; min-width:90px; font-family:var(--mono); }
#cl-app .cl-log-action { font-size:11px; padding:1px 6px; border-radius:4px; white-space:nowrap; font-weight:600; font-family:var(--mono); }
#cl-app .log-check { background:var(--green2); color:var(--green); }
#cl-app .log-uncheck { background:var(--red2); color:var(--red); }
#cl-app .log-edit { background:var(--accent-subtle); color:var(--accent); }
#cl-app .log-login { background:rgba(59,130,246,0.08); color:var(--blue); }
#cl-app .log-register { background:var(--accent-subtle); color:var(--accent); }
#cl-app .cl-log-detail { font-size:13px; color:var(--text2); flex:1; }
#cl-app .cl-saving { font-family:var(--mono); }

/* ─── 16. TOAST ──────────────────────────────────────── */
.cl-toast { position:fixed; bottom:22px; left:50%; transform:translateX(-50%); padding:8px 18px; border-radius:8px; font-size:13px; font-weight:600; font-family:'DM Sans',-apple-system,sans-serif; box-shadow:0 4px 20px rgba(0,0,0,0.15); z-index:9999; white-space:nowrap; animation:cl-up 0.2s ease; pointer-events:none; background:#18181b; border:1px solid #3f3f46; color:#fafafa; }

/* ─── 17. PRINT ──────────────────────────────────────── */
@media print { #cl-app .cl-header-actions,#cl-app .cl-theme-toggle,#cl-app .cl-edit-btns,#cl-app .cl-add-row,#cl-app .cl-add-section,#cl-app .cl-log-panel,#cl-app .cl-saving,#cl-app .cl-sec-del,#cl-app .cl-expand-btn,#cl-app .cl-drag-handle,#cl-app .cl-move-btns,#cl-app .cl-offline-banner,.cl-toast{display:none!important} #cl-app .cl-header{background:#fff!important;border:1px solid #e4e4e7!important;box-shadow:none!important} #cl-app .cl-section{border:1px solid #e4e4e7!important;background:#fff!important;break-inside:avoid;box-shadow:none!important} #cl-app .cl-item-detail{display:block!important} @page{margin:15mm;size:A4} }

/* ─── 18. MOBILE ─────────────────────────────────────── */
@media (max-width:500px) { #cl-app{padding:0 0 40px} #cl-app .cl-header{padding:12px 14px} #cl-app .cl-header-actions{gap:4px} #cl-app .cl-btn{font-size:12px;padding:6px 10px} #cl-app .cl-sec-header{padding:8px 12px} #cl-app .cl-item{padding:7px 12px} #cl-app .cl-costs{gap:6px} #cl-app .cl-cost-val{font-size:13px} #cl-app .cl-title-block h2{font-size:16px} #cl-app .cl-ring{width:42px;height:42px} }

/* ─── 19. DRAG HANDLES ───────────────────────────────── */
#cl-app .cl-drag-handle { display:flex; align-items:center; justify-content:center; width:22px; min-width:22px; height:24px; cursor:grab; color:var(--text3); opacity:0.3; transition:opacity 0.15s,color 0.15s,background 0.15s; border-radius:4px; flex-shrink:0; user-select:none; touch-action:none; -webkit-user-select:none; }
#cl-app .cl-drag-handle:hover,#cl-app .cl-drag-handle:focus-visible { opacity:1; color:var(--accent); background:var(--accent-subtle); outline:none; }
#cl-app .cl-drag-handle:active { cursor:grabbing; }
#cl-app .cl-drag-handle svg { pointer-events:none; }
#cl-drag-ghost { cursor:grabbing!important; }
#cl-app .cl-kb-grabbed { background:var(--accent-subtle)!important; outline:2px solid var(--accent)!important; outline-offset:2px; border-radius:var(--r); }
#cl-app .cl-dragging-source { opacity:0.18!important; pointer-events:none; }
#cl-app [data-item].dnd-shift-up { transform:translateY(-3px); transition:transform 0.15s ease; }
#cl-app [data-item].dnd-shift-down { transform:translateY(3px); transition:transform 0.15s ease; }
#cl-app .cl-section.dnd-shift-up { transform:translateY(-5px); transition:transform 0.15s ease; }
#cl-app .cl-section.dnd-shift-down { transform:translateY(5px); transition:transform 0.15s ease; }
.cl-drop-line { position:fixed; height:2px; background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),var(--accent),transparent); border-radius:99px; pointer-events:none; z-index:9998; display:none; box-shadow:0 0 6px var(--accent-glow); }

/* ─── 20. MOBILE MOVE BUTTONS ────────────────────────── */
#cl-app .cl-move-btns { display:none; flex-direction:column; gap:2px; }
@media (max-width:600px) { #cl-app .cl-move-btns{display:flex} }
#cl-app .cl-move-btn { width:22px; height:18px; background:var(--bg3); border:1px solid var(--border); border-radius:4px; color:var(--text3); font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; line-height:1; font-family:inherit; transition:all 0.15s; }
#cl-app .cl-move-btn:hover { color:var(--accent); border-color:var(--accent-border); background:var(--accent-subtle); }
#cl-app .cl-move-btn:active { transform:scale(0.92); }

/* ─── 21. OFFLINE BANNER ─────────────────────────────── */
#cl-app .cl-offline-banner { background:var(--red2); border:1px solid var(--red-border); border-radius:var(--r); padding:8px 14px; font-size:12px; color:var(--red); text-align:center; margin-bottom:8px; font-family:var(--mono); font-weight:600; }

/* ─── 22. VIEW TRANSITIONS ───────────────────────────── */
@starting-style { #cl-app .cl-item{opacity:0;transform:translateY(6px)} #cl-app .cl-section{opacity:0;transform:translateY(10px)} }
@keyframes cl-vt-out { to{opacity:0;transform:translateY(-4px) scale(0.98)} }
@keyframes cl-vt-in { from{opacity:0;transform:translateY(4px) scale(0.98)} }
::view-transition-old(*) { animation:150ms ease-out both cl-vt-out; }
::view-transition-new(*) { animation:200ms ease-out both cl-vt-in; }
::view-transition-group(*) { animation-duration:220ms; animation-timing-function:cubic-bezier(0.34,1.2,0.64,1); }

/* ════════════════════════════════════════════════════════
   Dashboard, Onboarding, Templates
   ════════════════════════════════════════════════════════ */
.cl-loading-screen { display:flex; align-items:center; justify-content:center; min-height:100vh; }
.cl-loading-inner { text-align:center; }
.cl-loading-text { color:var(--accent); font-family:var(--mono); font-size:13px; margin-top:12px; }

.cl-dash-header { display:flex; align-items:center; justify-content:space-between; padding:16px 24px 12px; border-bottom:1px solid var(--border); position:sticky; top:0; z-index:10; background:var(--bg); }
.cl-dash-header-left { display:flex; align-items:center; gap:8px; }
.cl-dash-logo { font-size:20px; }
.cl-dash-title { font-size:17px; font-weight:700; color:var(--accent); letter-spacing:-0.02em; }
.cl-dash-header-right { display:flex; align-items:center; gap:8px; }
.cl-dash-user { font-size:12px; color:var(--text-dim); font-family:var(--mono); }

.cl-btn--new-project { display:block; margin:16px 24px 4px; width:calc(100% - 48px); font-size:14px; padding:10px; }
.cl-btn--gold { background:var(--accent); color:#fff; border:none; font-weight:700; }
.cl-btn--gold:hover { background:var(--accent2); }
.cl-dash-section { padding:8px 24px 40px; }

.cl-project-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:10px; margin-top:12px; }
.cl-project-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:14px; transition:all 0.15s; position:relative; }
.cl-project-card:hover { border-color:var(--accent-border); box-shadow:var(--shadow-lg); }
.cl-project-card--archived { opacity:0.5; cursor:default!important; }
.cl-project-card--archived:hover { transform:none; border-color:var(--border); box-shadow:none; }
.cl-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; }
.cl-card-icon { font-size:24px; }
.cl-card-ring { position:relative; display:inline-block; }
.cl-card-ring-pct { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; font-family:var(--mono); }
.cl-card-name { font-size:14px; font-weight:600; color:var(--text); margin-bottom:4px; line-height:1.3; }
.cl-card-meta { display:flex; justify-content:space-between; font-size:11px; color:var(--text-dim); margin-bottom:8px; }
.cl-card-countdown { font-size:10px; color:var(--text-dim); margin-bottom:6px; font-family:var(--mono); }
.cl-card-countdown.urgent { color:var(--red); font-weight:700; }
.cl-card-actions { display:flex; gap:6px; justify-content:flex-end; }

.cl-card-due { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:500; padding:2px 8px; border-radius:20px; margin-top:6px; background:var(--bg3); color:var(--text-dim); }
.cl-card-due.soon { background:rgba(245,158,11,0.1); color:#d97706; border:1px solid rgba(245,158,11,0.2); }
.cl-card-due.overdue { background:var(--red2); color:var(--red); border:1px solid var(--red-border); animation:cl-pulse 2s ease-in-out infinite; }

.cl-card-dropdown { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:4px; min-width:150px; box-shadow:var(--shadow-lg); z-index:100; }
.cl-dropdown-item { display:block; width:100%; text-align:left; padding:7px 10px; background:none; border:none; color:var(--text); font-size:13px; border-radius:6px; cursor:pointer; font-family:inherit; }
.cl-dropdown-item:hover { background:var(--bg3); }
.cl-dropdown-item--danger:hover { background:var(--red2); color:var(--red); }

.cl-dash-empty { text-align:center; padding:48px 24px; color:var(--text-dim); }
.cl-dash-empty-icon { font-size:36px; margin-bottom:12px; opacity:0.5; }
.cl-dash-empty-title { font-size:16px; font-weight:600; color:var(--text); margin-bottom:4px; }
.cl-dash-empty-sub { font-size:13px; max-width:300px; margin:0 auto; }

.cl-dash-archived { margin-top:24px; }
.cl-arch-toggle { background:none; border:none; color:var(--text-dim); font-size:12px; cursor:pointer; padding:0; display:flex; align-items:center; gap:6px; font-family:inherit; }
.cl-arch-toggle:hover { color:var(--text); }
.cl-arch-arrow { font-size:10px; }
.cl-arch-body { margin-top:10px; }

.cl-breadcrumb { display:flex; align-items:center; gap:4px; padding:10px 0 0; font-size:13px; color:var(--text-dim); }
.cl-breadcrumb-back { background:none; border:none; color:var(--accent); font-size:13px; cursor:pointer; padding:0; font-family:inherit; }
.cl-breadcrumb-back:hover { text-decoration:underline; }
.cl-breadcrumb-sep { color:var(--border2); }
.cl-breadcrumb-current { color:var(--text); font-weight:500; }

.cl-confirm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:200; }
.cl-confirm-dialog { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:24px 20px 18px; max-width:340px; width:90%; box-shadow:var(--shadow-lg); }
.cl-confirm-message { font-size:14px; line-height:1.5; color:var(--text); margin-bottom:18px; }
.cl-confirm-message small { color:var(--text-dim); font-size:12px; }
.cl-confirm-actions { display:flex; gap:8px; justify-content:flex-end; }
.cl-btn--danger { background:#dc2626; color:#fff; border:none; }
.cl-btn--danger:hover { background:#b91c1c; }

.cl-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:150; overflow-y:auto; padding:20px; }
.cl-modal { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:20px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; position:relative; box-shadow:var(--shadow-lg); }
.cl-modal-close { position:absolute; top:14px; right:14px; background:none; border:none; color:var(--text3); font-size:16px; cursor:pointer; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:all 0.15s; }
.cl-modal-close:hover { background:var(--bg3); color:var(--text); }
.cl-modal-title { font-size:17px; font-weight:700; color:var(--text); margin-bottom:4px; letter-spacing:-0.01em; }
.cl-modal-sub { font-size:13px; color:var(--text-dim); margin-bottom:14px; }

.cl-template-search { width:100%; margin-bottom:12px; }
.cl-template-tabs { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:14px; }
.cl-template-tab { padding:4px 10px; border-radius:20px; background:none; border:1px solid var(--border); color:var(--text-dim); font-size:11px; cursor:pointer; font-family:inherit; transition:all 0.15s; }
.cl-template-tab.active { background:var(--accent); color:#fff; border-color:var(--accent); font-weight:600; }
.cl-template-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:8px; }
.cl-template-card { background:var(--bg2); border:1.5px solid var(--border); border-radius:var(--r); padding:14px 10px; text-align:center; cursor:pointer; transition:all 0.15s; }
.cl-template-card:hover { border-color:var(--accent); }
.cl-template-card.selected { border-color:var(--accent); background:var(--accent-subtle); }
.cl-tcard-icon { font-size:24px; margin-bottom:6px; }
.cl-tcard-name { font-size:12px; font-weight:600; color:var(--text); margin-bottom:3px; line-height:1.3; }
.cl-tcard-meta { font-size:10px; color:var(--text-dim); }
.cl-template-empty { text-align:center; padding:24px; color:var(--text-dim); grid-column:1/-1; font-size:13px; }
.cl-template-grid--onboard { max-height:340px; overflow-y:auto; }

.cl-onboarding { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px; }
.cl-onboarding-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:28px 24px; width:100%; max-width:460px; box-shadow:var(--shadow-lg); }
.cl-onboard-dots { display:flex; gap:8px; justify-content:center; margin-bottom:16px; }
.cl-onboard-dot { width:8px; height:8px; border-radius:50%; background:var(--border); }
.cl-onboard-dot.active { background:var(--accent); }
.cl-onboard-dot.done { background:var(--green); }
.cl-onboard-title { font-size:18px; font-weight:700; color:var(--text); text-align:center; margin-bottom:16px; letter-spacing:-0.02em; }
.cl-onboard-cat-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px; }
.cl-onboard-cat-btn { background:var(--bg2); border:1.5px solid var(--border); border-radius:var(--r); padding:12px 10px; display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; font-size:12px; color:var(--text); transition:border-color 0.15s; font-family:inherit; }
.cl-onboard-cat-btn:hover,.cl-onboard-cat-btn.selected { border-color:var(--accent); }
.cl-onboard-cat-icon { font-size:22px; }
.cl-onboard-skip { display:block; width:100%; text-align:center; background:none; border:none; color:var(--text-dim); font-size:12px; cursor:pointer; margin-top:8px; padding:8px; font-family:inherit; }
.cl-onboard-skip:hover { color:var(--accent); }
.cl-onboard-body { margin-top:4px; }
.cl-btn--icon { padding:5px 7px; font-size:14px; }
.cl-btn--sm { font-size:11px; padding:4px 8px; }
.cl-btn--full { width:100%; }
.cl-btn--ghost { background:none; color:var(--text2); border:1px solid var(--border); }
.cl-btn--ghost:hover { border-color:var(--accent); color:var(--accent); }

/* ── Password ──────────────────────────────────── */
.cl-pass-row { position:relative; display:flex; align-items:center; }
.cl-pass-row .cl-input { flex:1; padding-right:40px; }
.cl-pass-toggle { position:absolute; right:8px; background:none; border:none; font-size:15px; cursor:pointer; color:var(--text-dim); padding:4px; line-height:1; user-select:none; }
.cl-pass-toggle:hover { color:var(--text); }
.cl-caps-warn { font-size:11px; color:var(--orange); margin-top:4px; font-weight:600; }
.cl-strength-wrap { margin-top:6px; }
.cl-strength-bar { height:3px; background:var(--border); border-radius:2px; overflow:hidden; }
.cl-strength-fill { height:100%; width:0%; border-radius:2px; transition:width 0.3s,background 0.3s; }
.cl-strength-label { font-size:10px; font-weight:700; margin-top:3px; text-transform:uppercase; letter-spacing:0.05em; min-height:14px; }
.cl-privacy-note { font-size:11px; color:var(--text-dim); text-align:center; margin-top:12px; padding:8px 10px; background:var(--green2); border:1px solid var(--green-border); border-radius:var(--r); line-height:1.4; }

/* ── File Attachments ──────────────────────────── */
#cl-app .cl-file-toggle { background:none; border:1px solid var(--border); border-radius:4px; padding:1px 6px; font-size:11px; color:var(--text-dim); cursor:pointer; margin-top:4px; transition:all 0.15s; font-family:inherit; }
#cl-app .cl-file-toggle:hover { border-color:var(--accent); color:var(--accent); }
#cl-app .cl-file-toggle.has-files { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
#cl-app .cl-file-panel { margin-top:6px; padding:8px 10px; background:var(--bg2); border:1px solid var(--border); border-radius:var(--r); }
#cl-app .cl-file-row { display:flex; align-items:center; gap:6px; padding:4px 0; border-bottom:1px solid var(--border); flex-wrap:wrap; }
#cl-app .cl-file-row:last-of-type { border-bottom:none; }
#cl-app .cl-file-name { flex:1; font-size:12px; color:var(--text); min-width:100px; word-break:break-all; }
#cl-app .cl-file-meta { font-size:10px; color:var(--text-dim); white-space:nowrap; }
#cl-app .cl-file-btn { background:none; border:1px solid var(--border); border-radius:4px; padding:1px 6px; font-size:11px; color:var(--text-dim); cursor:pointer; text-decoration:none; transition:all 0.15s; }
#cl-app .cl-file-btn:hover { border-color:var(--accent); color:var(--accent); }
#cl-app .cl-file-btn.del:hover { border-color:var(--red); color:var(--red); }
#cl-app .cl-file-empty { font-size:11px; color:var(--text-dim); text-align:center; padding:6px 0; }
#cl-app .cl-file-input { display:none; }
#cl-app .cl-file-upload-btn { display:inline-block; margin-top:6px; padding:4px 12px; border-radius:6px; border:1px dashed var(--accent-border); color:var(--accent); font-size:11px; cursor:pointer; transition:all 0.15s; background:var(--accent-subtle); }
#cl-app .cl-file-upload-btn:hover { background:var(--accent-glow); }

/* ── Due Date Modal ────────────────────────────── */
#cl-app .cl-duedate-modal { max-width:340px; width:100%; }
#cl-app .cl-duedate-picker-wrap { margin-bottom:8px; }
#cl-app .cl-duedate-cal { width:100%; cursor:pointer; }
#cl-app .cl-duedate-or { text-align:center; font-size:11px; color:var(--text-dim); margin:10px 0; }
#cl-app .cl-duedate-shortcuts { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
#cl-app .cl-shortcut-btn { flex:1; min-width:60px; padding:6px 8px; border-radius:6px; border:1px solid var(--border); background:none; color:var(--text); font-size:11px; cursor:pointer; transition:all 0.15s; text-align:center; font-family:inherit; }
#cl-app .cl-shortcut-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
#cl-app .cl-duedate-btns { display:flex; gap:8px; justify-content:flex-end; margin-top:8px; }

/* ── AI Generate ───────────────────────────────── */
#cl-app .cl-ai-banner { display:flex; align-items:center; gap:12px; padding:12px 16px; margin:10px 0 14px; background:var(--accent-subtle); border:1px solid var(--accent-border); border-radius:var(--r-lg); cursor:pointer; transition:all 0.15s; }
#cl-app .cl-ai-banner:hover { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
#cl-app .cl-ai-banner-icon { font-size:22px; flex-shrink:0; }
#cl-app .cl-ai-banner-text { flex:1; }
#cl-app .cl-ai-banner-text strong { display:block; font-size:13px; color:var(--accent); font-weight:600; }
#cl-app .cl-ai-banner-text span { font-size:12px; color:var(--text2); }
#cl-app .cl-ai-banner-arrow { color:var(--accent); font-weight:600; font-size:15px; }
#cl-app .cl-ai-modal { max-width:480px; }
#cl-app .cl-ai-textarea { width:100%; min-height:110px; resize:vertical; font-family:inherit; font-size:13px; line-height:1.5; padding:10px; border-radius:var(--r); background:var(--bg2); border:1px solid var(--border); color:var(--text); transition:border-color 0.15s; }
#cl-app .cl-ai-textarea:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
#cl-app .cl-ai-textarea::placeholder { color:var(--text3); }
#cl-app .cl-ai-counter { font-size:10px; color:var(--text3); text-align:right; margin-top:3px; font-family:var(--mono); }
#cl-app .cl-ai-hint { font-size:11px; color:var(--text3); text-align:center; margin-top:10px; }

/* ── Responsive ────────────────────────────────── */
@media (max-width:640px) { .cl-project-grid{grid-template-columns:1fr} .cl-template-grid{grid-template-columns:repeat(2,1fr)} .cl-onboard-cat-grid{grid-template-columns:1fr 1fr} .cl-dash-header{padding:12px 16px} .cl-btn--new-project{margin:12px 16px 4px;width:calc(100% - 32px)} .cl-dash-section{padding:8px 16px 32px} .cl-dash-user{display:none} .cl-ai-modal{max-width:100%;margin:0 8px} }

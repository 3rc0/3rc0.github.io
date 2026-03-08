/* ============================================================
   SENTINEL MESH — Detection Cascade Visualization
   viz.js — SM-VIZ-1.3
   3rc0.github.io/assets/js/viz.js

   Main orchestrator.
   Depends on: scenarios.js (SCENARIOS[])
               canvas.js   (SM_Canvas)
   Handles: simulation loop, stage progression,
            title card, UI interactions, all DOM updates.
   ============================================================ */

'use strict';

/* ── GUARD: wait for deps ─────────────────────────────────────── */
if (typeof SCENARIOS === 'undefined') {
  console.error('viz.js: SCENARIOS not found. Load scenarios.js first.');
}
if (typeof SM_Canvas === 'undefined') {
  console.error('viz.js: SM_Canvas not found. Load canvas.js first.');
}

/* ── CONSTANTS ────────────────────────────────────────────────── */
const CDUR        = 22000;   // ms per scenario
const TITLE_SECS  = 6;       // title card display seconds

// Stage time windows (ms from scenario start)
const STAGE_T = [
  { s: 0,     e: 4000  },   // Stage 1 — Suspicion
  { s: 4000,  e: 9000  },   // Stage 2 — Confirmation
  { s: 9000,  e: 13000 },   // Stage 3 — Location Fix
  { s: 13000, e: 17000 },   // Stage 4 — Trail
  { s: 17000, e: 22000 },   // Stage 5 — Human Alert
];

/* ── STATE ────────────────────────────────────────────────────── */
let sIdx      = 0;        // current scenario index
let curStage  = 0;        // current active stage (1–5)
let t0        = null;     // scenario start timestamp (performance.now())
let simIv     = null;     // main interval handle
let ev        = {};       // current event data object
let sc        = null;     // current scenario definition

// Expose t0 globally so scenarios.js buildS2 can compute elapsed
window._t0 = null;

/* ── UTILS ────────────────────────────────────────────────────── */
function _ts() {
  return new Date().toISOString().slice(11, 22) + 'Z';
}
function _ri(a, b) {
  return Math.floor(a + Math.random() * (b - a));
}

/* ── CLOCK ────────────────────────────────────────────────────── */
function _updateClock() {
  const el = document.getElementById('sys-clock');
  if (el) el.textContent = new Date().toISOString().slice(11, 19) + 'Z';
}
_updateClock();
setInterval(_updateClock, 1000);

/* ── ACCORDION INTERACTIONS ───────────────────────────────────── */
function toggleStage(id) {
  const body = document.getElementById(id + '-body');
  const tog  = document.getElementById(id + '-tog');
  if (!body || !tog) return;
  const isOpen = body.classList.contains('open');

  // Close all
  document.querySelectorAll('.stage-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('[id$="-tog"]').forEach(t => t.classList.remove('open'));
  document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('open'));
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));

  if (!isOpen) {
    body.classList.add('open');
    tog.classList.add('open');
  }
}

function toggleSub(stageId, key) {
  const content = document.getElementById(stageId + '-sub-' + key);
  const btn     = document.getElementById(stageId + '-btn-' + key);
  const body    = document.getElementById(stageId + '-body');
  if (!content || !body) return;
  const isOpen = content.classList.contains('open');

  body.querySelectorAll('.sub-content').forEach(c => c.classList.remove('open'));
  body.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));

  if (!isOpen) {
    content.classList.add('open');
    if (btn) btn.classList.add('active');
  }
}

// Expose to HTML onclick attributes
window.toggleStage = toggleStage;
window.toggleSub   = toggleSub;

/* ── DOM HELPERS ──────────────────────────────────────────────── */
function _set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function _setHTML(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}
function _setBadge(id, val) {
  _set(id, val);
}

function _animConf(confId, pctId, targetPct, delay) {
  setTimeout(() => {
    let v = 0;
    const iv = setInterval(() => {
      v = Math.min(v + 2.2, targetPct);
      const ec = document.getElementById(confId);
      if (ec) ec.style.width = v + '%';
      const ep = document.getElementById(pctId);
      if (ep) {
        ep.textContent  = (v / 100).toFixed(2);
        ep.style.color  = 'var(--accent)';
      }
      if (v >= targetPct) clearInterval(iv);
    }, 20);
  }, delay || 0);
}

function _buildSrRows(containerId, rows) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  rows.forEach((r, i) => {
    const vc  = r.vc || 'var(--amber)';
    const div = document.createElement('div');
    div.className = 'sensor-row';
    div.innerHTML =
      `<span class="sr-name">${r.n}</span>` +
      `<span class="sr-type">${r.t}</span>` +
      `<div class="sr-bar"><div class="sr-fill" id="sf-${containerId}-${i}" style="width:0%;background:${r.c}"></div></div>` +
      `<span class="sr-val" style="color:${vc}">${r.v}</span>`;
    c.appendChild(div);
    // Animate bar fill
    setTimeout(() => {
      let v = 0;
      const iv = setInterval(() => {
        v = Math.min(v + 2, r.p);
        const el = document.getElementById(`sf-${containerId}-${i}`);
        if (el) el.style.width = v + '%';
        if (v >= r.p) clearInterval(iv);
      }, 20);
    }, i * 200);
  });
}

function _buildTable(tableId, rows) {
  const t = document.getElementById(tableId);
  if (!t) return;
  t.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r[0]}</td><td class="${r[2] || ''}">${r[1]}</td>`;
    t.appendChild(tr);
  });
}

function _buildEvChain(items) {
  const c = document.getElementById('ev-chain');
  if (!c) return;
  c.innerHTML = '';
  items.forEach(item => {
    const eid = 'evc-' + item.lbl.replace(/[\s—]+/g, '-').toLowerCase().slice(0, 32);
    const div = document.createElement('div');
    div.className = 'ev-row';
    div.innerHTML =
      `<span class="ev-icon">${item.icon}</span>` +
      `<span class="ev-label">${item.lbl}</span>` +
      `<span class="ev-val pending" id="${eid}">PENDING</span>`;
    c.appendChild(div);
  });
}

function _setEv(lbl, val, cls) {
  const eid = 'evc-' + lbl.replace(/[\s—]+/g, '-').toLowerCase().slice(0, 32);
  const el  = document.getElementById(eid);
  if (el) {
    el.textContent = val;
    el.className   = 'ev-val ' + cls;
  }
}

function _sysLog(msg) {
  const s = document.getElementById('log-stream');
  if (!s) return;
  const d = document.createElement('div');
  d.className = 'ls-line';
  d.innerHTML = msg;
  s.prepend(d);
  while (s.children.length > 40) s.lastChild.remove();
}

function _addAlert(msg) {
  const l = document.getElementById('alert-list');
  if (!l) return;
  // Clear placeholder
  if (l.children.length === 1 && l.children[0].textContent.includes('Awaiting')) {
    l.innerHTML = '';
  }
  const item = document.createElement('div');
  item.className = 'alert-item';
  item.innerHTML =
    `<div class="alert-ts">${_ts()}</div>` +
    `<div class="alert-msg">${msg}</div>`;
  l.prepend(item);
  while (l.children.length > 8) l.lastChild.remove();
}

/* ── ACCENT COLOUR ────────────────────────────────────────────── */
function _setAccent(color) {
  document.documentElement.style.setProperty('--accent', color);
}

/* ── RESET UI ─────────────────────────────────────────────────── */
function _resetUI() {
  document.querySelectorAll('.stage').forEach(s => s.classList.remove('active', 'done'));
  document.querySelectorAll('.stage-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.stage-toggle').forEach(t => t.classList.remove('open'));
  document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('open'));
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));

  ['s1', 's2', 's3', 's4', 's5'].forEach(id => {
    const cf = document.getElementById(id + '-conf');
    if (cf) cf.style.width = '0%';
    const pt = document.getElementById(id + '-pct');
    if (pt) { pt.textContent = '—'; pt.style.color = 'var(--muted)'; }
    const sm = document.getElementById(id + '-sum');
    if (sm) sm.textContent = '—';
  });

  const tf = document.getElementById('timer-fill');
  if (tf) tf.style.width = '0%';
  _set('timer-elapsed', '0.0s');
}

/* ── UPDATE SCENARIO CARD ─────────────────────────────────────── */
function _updateScenarioCard(s, idx) {
  _setHTML('sc-icon', s.icon);
  _setHTML('sc-name', s.name);
  _set('sc-desc', s.desc);
  _set('sc-num-label', idx + 1);
  _set('sc-cycle-num', idx + 1);

  const sensorsEl = document.getElementById('sc-sensors');
  if (sensorsEl) {
    sensorsEl.innerHTML = s.sensors
      .map(x => `<span class="sc-sensor-tag active">${x}</span>`)
      .join('');
  }

  for (let i = 0; i < 4; i++) {
    const d = document.getElementById('dot-' + i);
    if (d) d.className = 'sc-dot' + (i < idx ? ' done' : i === idx ? ' active' : '');
  }

  // Stage name + icon overrides
  ['s1', 's2', 's3', 's4'].forEach((sid, i) => {
    const def = s['s' + (i + 1)];
    const ie  = document.getElementById(sid + '-icon');
    const ne  = document.getElementById(sid + '-name');
    if (ie) ie.textContent = def.icon;
    if (ne) ne.textContent = def.name;
  });

  const sl1 = document.getElementById('s4-sub1-label');
  const sl2 = document.getElementById('s4-sub2-label');
  if (sl1) sl1.textContent = s.s4l1;
  if (sl2) sl2.textContent = s.s4l2;

  _set('timer-cycle', s.short);
}

/* ── TITLE CARD — 6 SECONDS ───────────────────────────────────── */
function _showTitleCard(s, idx, callback) {
  const ov = document.getElementById('title-overlay');
  if (!ov) { callback(); return; }

  _setHTML('to-icon', s.icon);
  _setHTML('to-name', s.name);
  _set('to-desc', s.desc);
  _set('to-scenario-num', `SCENARIO ${idx + 1} OF 4`);

  const sensorsEl = document.getElementById('to-sensors');
  if (sensorsEl) {
    sensorsEl.innerHTML = s.sensors
      .map(x => `<span class="to-tag">${x}</span>`)
      .join('');
  }

  // Progress bar — drain over 6s
  const pf = document.getElementById('to-progress-fill');
  if (pf) {
    pf.style.transition = 'none';
    pf.style.width      = '100%';
  }

  ov.classList.add('show');

  let count = TITLE_SECS;
  _set('to-count', count);

  // Start drain after a tick so transition fires
  setTimeout(() => {
    if (pf) {
      pf.style.transition = `width ${TITLE_SECS}s linear`;
      pf.style.width      = '0%';
    }
  }, 60);

  const cd = setInterval(() => {
    count--;
    _set('to-count', count);
    if (count <= 0) {
      clearInterval(cd);
      ov.classList.remove('show');
      setTimeout(callback, 450);
    }
  }, 1000);
}

/* ── STAGE ACTIVATION ─────────────────────────────────────────── */
function _activateStage(n, elapsed) {
  curStage = n;

  // Mark previous stages done
  for (let i = 1; i < n; i++) {
    const el = document.getElementById('s' + i);
    if (el) { el.classList.remove('active'); el.classList.add('done'); }
  }

  // Mark current stage active
  const cur = document.getElementById('s' + n);
  if (cur) { cur.classList.add('active'); cur.classList.remove('done'); }

  const ft = (elapsed / 1000).toFixed(1);

  // Trigger blast wave at stage 1 for explosion scenario
  if (sc.id === 'explosion' && n === 1) {
    SM_Canvas.TARGET.visible = true;
    setTimeout(() => SM_Canvas.blastWave(), 900);
  }

  // Reveal static event marker at stage 1
  if (!sc.isMoving && n === 1) {
    SM_Canvas.TARGET.visible = true;
  }

  switch (n) {
    case 1: _doStage1();     break;
    case 2: _doStage2();     break;
    case 3: _doStage3(ft);   break;
    case 4: _doStage4();     break;
    case 5: _doStage5(elapsed); break;
  }
}

/* ── STAGE HANDLERS ───────────────────────────────────────────── */
function _doStage1() {
  const d = sc.buildS1(ev);

  _set('s1-sum', sc.s1sum(ev));
  _animConf('s1-conf', 's1-pct', parseFloat(ev.conf) * 50);
  _setBadge('s1-bdg-sr',  `${d.sr.length} sensor`);
  _setBadge('s1-bdg-det', `${d.det.length} fields`);
  _setBadge('s1-bdg-log', '1 entry');

  _buildSrRows('s1-sr-inner', d.sr);
  _buildTable('s1-det-table', d.det);
  _setHTML('s1-log', d.log);

  _setEv(sc.evChainDef[0].lbl, 'DETECTED', 'hi');

  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">[${sc.short}]</span>  STAGE_1_TRIGGER`);
  _addAlert(`<span class="hi">${sc.icon} SUSPICION</span> — ${sc.short}`);
}

function _doStage2() {
  const d = sc.buildS2(ev);

  _set('s2-sum', sc.s2sum(ev));
  _animConf('s2-conf', 's2-pct', parseFloat(ev.conf) * 100);
  _setBadge('s2-bdg-sensors', `${d.sr.length} sensors`);
  _setBadge('s2-bdg-fusion',  ev.conf);
  _setBadge('s2-bdg-log',     '3 entries');

  _buildSrRows('s2-sensors-inner', d.sr);
  _buildTable('s2-fusion-table', d.fus);
  _setHTML('s2-log', d.log);

  // Mark first 3 evidence items confirmed
  for (let i = 1; i < Math.min(3, sc.evChainDef.length); i++) {
    _setEv(sc.evChainDef[i].lbl, 'CONFIRMED', 'ok');
  }

  // Upgrade detecting nodes on canvas
  SM_Canvas.NODES.forEach(n => {
    if (n.state === 'detecting') n.state = 'confirmed';
  });

  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">[${sc.short}]</span>  CONFIRMED  class=${ev.cls}  conf=${ev.conf}`);
  _addAlert(`<span class="ok">✓ CONFIRMED</span> — ${ev.cls} · conf ${ev.conf}`);
}

function _doStage3(ft) {
  const d = sc.buildS3(ev, ft);

  _set('s3-sum', sc.s3sum(ev));
  _animConf('s3-conf', 's3-pct', 88);
  _setBadge('s3-bdg-nodes', 'synced');
  _setBadge('s3-bdg-fix',   `±${ev.cep}m`);
  _setBadge('s3-bdg-log',   '2 entries');

  _buildSrRows('s3-nodes-inner', d.nodes);
  _buildTable('s3-fix-table', d.fix);
  _setHTML('s3-log', d.log);

  if (sc.evChainDef[3]) _setEv(sc.evChainDef[3].lbl, 'CONFIRMED', 'ok');

  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">[${sc.short}]</span>  GPS_FIX  ±${ev.cep}m`);
  _addAlert(`<span class="ok">📍 GPS FIX</span> — ${ev.lat}°N ${ev.lng}°E · ±${ev.cep}m`);
}

function _doStage4() {
  const d = sc.buildS4(ev);

  _set('s4-sum', sc.s4sum(ev));
  _animConf('s4-conf', 's4-pct', 94);
  _setBadge('s4-bdg-move',  sc.isMoving ? `~${ev.speed}km/h` : 'static');
  _setBadge('s4-bdg-trail', 'live');
  _setBadge('s4-bdg-log',   'building');

  _buildTable('s4-move-table',  d.move);
  _buildTable('s4-trail-table', d.trail);
  _setHTML('s4-log', d.log);

  if (sc.evChainDef[4]) _setEv(sc.evChainDef[4].lbl, 'LOGGING', 'hi');

  // Live counter for track points
  const trailIv = setInterval(() => {
    ev.trackPts++;
    _setBadge('s4-bdg-trail', `${ev.trackPts} pts`);
    _set('s4-sum', sc.s4sum(ev));
    if (curStage > 4) clearInterval(trailIv);
  }, 600);

  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">[${sc.short}]</span>  STAGE_4_ACTIVE`);
  _addAlert(`<span class="hi">${sc.icon} TRACKING</span> — ${ev.cls}`);
}

function _doStage5(elapsed) {
  const tt = (elapsed / 1000).toFixed(1);

  _set('s5-sum', `${ev.alertId} · ${tt}s`);
  _animConf('s5-conf', 's5-pct', 96);
  _setBadge('s5-bdg-pkg', ev.alertId);
  _setBadge('s5-bdg-ev',  'full chain');
  _setBadge('s5-bdg-log', '3 entries');

  _buildTable('s5-pkg-table', [
    ['Alert ID',       ev.alertId,                           'hi'  ],
    ['Threat class',   ev.cls,                               'warn'],
    ['Confidence',     ev.conf + ' — HIGH',                  'hi'  ],
    ['Scenario',       sc.short                                     ],
    ['GPS position',   `${ev.lat}°N  ${ev.lng}°E`                  ],
    ['Evidence items', (sc.evChainDef.length - 1) + ' confirmed'   ],
    ['Cascade time',   tt + 's from first trigger',           'ok' ],
  ]);

  // Evidence summary table
  const evInner = document.getElementById('s5-ev-inner');
  if (evInner) {
    evInner.innerHTML =
      '<table class="dtable">' +
      sc.evChainDef.slice(0, -1)
        .map(e => `<tr><td>${e.lbl}</td><td class="ok">CONFIRMED</td></tr>`)
        .join('') +
      '</table>';
  }

  // Mark all evidence items confirmed
  sc.evChainDef.forEach(e => _setEv(e.lbl, 'CONFIRMED', 'ok'));

  _setHTML('s5-log',
    `<span class="lt">${_ts()}</span>  <span class="lh">ALERT DISPATCHED</span>  id=${ev.alertId}\n` +
    `<span class="lt">${_ts()}</span>  cascade=${tt}s  class=${ev.cls}  conf=${ev.conf}\n` +
    `<span class="lt">${_ts()}</span>  <span class="le">AWAITING OPERATOR ACTION</span>`
  );

  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">⚡ ALERT ${ev.alertId}</span>  ${ev.cls}  ${tt}s  <span class="ok">→ OPERATOR</span>`);
  _addAlert(`<span class="warn">⚠ ${ev.alertId}</span> — ${ev.cls} · ${tt}s · <span class="warn">AWAITING</span>`);
}

/* ── START SCENARIO ───────────────────────────────────────────── */
function _startScenario(idx) {
  sc  = SCENARIOS[idx];
  sIdx = idx;

  _setAccent(sc.accent);
  _updateScenarioCard(sc, idx);

  // Generate fresh event
  ev           = sc.genEv();
  ev.alertId   = `SM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(_ri(1, 9999)).padStart(4, '0')}`;
  ev.trackPts  = 0;
  ev.nodesHit  = 0;

  // Build evidence chain
  _buildEvChain(sc.evChainDef);

  // Reset UI + canvas
  _resetUI();
  SM_Canvas.resetNodes();
  SM_Canvas.initTarget(sc.isMoving);

  curStage = 0;
  t0       = performance.now();
  window._t0 = t0;

  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">// SCENARIO ${idx + 1} — ${sc.short} //</span>`);

  // Clear old interval
  if (simIv) clearInterval(simIv);

  simIv = setInterval(() => {
    const elapsed = performance.now() - t0;

    // Timer bar + elapsed display
    const tf = document.getElementById('timer-fill');
    if (tf) tf.style.width = Math.min(elapsed / CDUR * 100, 100) + '%';
    _set('timer-elapsed', (elapsed / 1000).toFixed(1) + 's');

    // Move target
    SM_Canvas.moveTarget(curStage, sc.isMoving);

    // Update track count
    if (sc.isMoving && curStage >= 4) ev.trackPts++;

    // Check node detection
    if (sc.isMoving && curStage >= 1) {
      SM_Canvas.checkNodeDetection(curStage, (nodeId, dist) => {
        _sysLog(
          `<span class="ts">${_ts()}</span>  ` +
          `<span class="node">${nodeId}</span>  ` +
          `ENTER_RANGE  dist=${dist}px`
        );
      });
    }

    // Animate canvas
    SM_Canvas.animateNodes();

    // Draw frame — pass whether it's a static event for marker type
    SM_Canvas.drawFrame(sc.accent);
    if (!sc.isMoving && curStage >= 1) SM_Canvas.drawStaticMarker();

    // Advance stages
    const ni = STAGE_T.findIndex(s => elapsed >= s.s && elapsed < s.e);
    if (ni !== -1 && ni !== curStage - 1) _activateStage(ni + 1, elapsed);

    // End of scenario
    if (elapsed >= CDUR) {
      clearInterval(simIv);
      setTimeout(() => {
        const next = (idx + 1) % SCENARIOS.length;
        _showTitleCard(SCENARIOS[next], next, () => _startScenario(next));
      }, 600);
    }
  }, 50); // ~20fps — smooth but not heavy
}

/* ── BOOT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Draw empty canvas immediately so page doesn't look broken
  SM_Canvas.drawFrame('#f5a623');

  // Short delay then show first title card
  setTimeout(() => {
    _showTitleCard(SCENARIOS[0], 0, () => _startScenario(0));
  }, 400);
});

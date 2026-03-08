/* ============================================================
   SENTINEL MESH — Detection Cascade Visualization
   viz.js — SM-VIZ-1.3
   3rc0.github.io/assets/js/viz.js

   Main orchestrator.
   Depends on: scenarios.js (SCENARIOS[])
               canvas.js   (SM_Canvas)
   ============================================================ */

'use strict';

if (typeof SCENARIOS === 'undefined') console.error('viz.js: SCENARIOS not found.');
if (typeof SM_Canvas === 'undefined')  console.error('viz.js: SM_Canvas not found.');

/* ── CONSTANTS ────────────────────────────────────────────────── */
const CDUR   = 22000;
const STAGE_T = [
  { s: 0,     e: 4000  },
  { s: 4000,  e: 9000  },
  { s: 9000,  e: 13000 },
  { s: 13000, e: 17000 },
  { s: 17000, e: 22000 },
];

/* ── STATE ────────────────────────────────────────────────────── */
let sIdx     = 0;
let curStage = 0;
let t0       = null;
let simIv    = null;
let ev       = {};
let sc       = null;
let manualMode = false;   // true when user has clicked a scenario button

window._t0 = null;

/* ── UTILS ────────────────────────────────────────────────────── */
function _ts() { return new Date().toISOString().slice(11, 22) + 'Z'; }
function _ri(a, b) { return Math.floor(a + Math.random() * (b - a)); }

/* ── CLOCK ────────────────────────────────────────────────────── */
function _updateClock() {
  const el = document.getElementById('sys-clock');
  if (el) el.textContent = new Date().toISOString().slice(11, 19) + 'Z';
}
_updateClock();
setInterval(_updateClock, 1000);

/* ── SCENARIO SELECTOR ────────────────────────────────────────── */
// Buttons are in HTML — we just handle state here

function _setActiveBtn(idx) {
  SCENARIOS.forEach((s, i) => {
    const btn = document.getElementById('sc-btn-' + i);
    if (btn) btn.classList.toggle('active', i === idx);
  });
}

function _setBtnStatus(idx, text) {
  const el = document.getElementById('sc-btn-status-' + idx);
  if (el) el.textContent = text;
}

// Called by onclick in HTML
function selectScenario(idx) {
  manualMode = true;
  _updateAutoIndicator();
  if (simIv) clearInterval(simIv);
  _startScenario(idx);
}
window.selectScenario = selectScenario;

/* ── ACCORDION ────────────────────────────────────────────────── */
function toggleStage(id) {
  const body = document.getElementById(id + '-body');
  const tog  = document.getElementById(id + '-tog');
  if (!body || !tog) return;
  const isOpen = body.classList.contains('open');
  document.querySelectorAll('.stage-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('[id$="-tog"]').forEach(t => t.classList.remove('open'));
  document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('open'));
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  if (!isOpen) { body.classList.add('open'); tog.classList.add('open'); }
}

function toggleSub(stageId, key) {
  const content = document.getElementById(stageId + '-sub-' + key);
  const btn     = document.getElementById(stageId + '-btn-' + key);
  const body    = document.getElementById(stageId + '-body');
  if (!content || !body) return;
  const isOpen  = content.classList.contains('open');
  body.querySelectorAll('.sub-content').forEach(c => c.classList.remove('open'));
  body.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  if (!isOpen) { content.classList.add('open'); if (btn) btn.classList.add('active'); }
}

window.toggleStage = toggleStage;
window.toggleSub   = toggleSub;

/* ── DOM HELPERS ──────────────────────────────────────────────── */
function _set(id, val)     { const e = document.getElementById(id); if (e) e.textContent = val; }
function _setHTML(id, val) { const e = document.getElementById(id); if (e) e.innerHTML   = val; }
function _setBadge(id, val){ _set(id, val); }

function _animConf(confId, pctId, targetPct, delay) {
  setTimeout(() => {
    let v = 0;
    const iv = setInterval(() => {
      v = Math.min(v + 2.2, targetPct);
      const ec = document.getElementById(confId); if (ec) ec.style.width = v + '%';
      const ep = document.getElementById(pctId);
      if (ep) { ep.textContent = (v / 100).toFixed(2); ep.style.color = 'var(--accent)'; }
      if (v >= targetPct) clearInterval(iv);
    }, 20);
  }, delay || 0);
}

function _buildSrRows(containerId, rows) {
  const c = document.getElementById(containerId); if (!c) return;
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
  const t = document.getElementById(tableId); if (!t) return;
  t.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r[0]}</td><td class="${r[2] || ''}">${r[1]}</td>`;
    t.appendChild(tr);
  });
}

function _buildEvChain(items) {
  const c = document.getElementById('ev-chain'); if (!c) return;
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
  if (el) { el.textContent = val; el.className = 'ev-val ' + cls; }
}

function _sysLog(msg) {
  const s = document.getElementById('log-stream'); if (!s) return;
  const d = document.createElement('div'); d.className = 'ls-line'; d.innerHTML = msg;
  s.prepend(d); while (s.children.length > 40) s.lastChild.remove();
}

function _addAlert(msg) {
  const l = document.getElementById('alert-list'); if (!l) return;
  if (l.children.length === 1 && l.children[0].textContent.includes('Awaiting')) l.innerHTML = '';
  const item = document.createElement('div'); item.className = 'alert-item';
  item.innerHTML = `<div class="alert-ts">${_ts()}</div><div class="alert-msg">${msg}</div>`;
  l.prepend(item); while (l.children.length > 8) l.lastChild.remove();
}

/* ── ACCENT ────────────────────────────────────────────────────── */
function _setAccent(color) {
  document.documentElement.style.setProperty('--accent', color);
}

/* ── RESET ────────────────────────────────────────────────────── */
function _resetUI() {
  document.querySelectorAll('.stage').forEach(s => s.classList.remove('active', 'done'));
  document.querySelectorAll('.stage-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.stage-toggle').forEach(t => t.classList.remove('open'));
  document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('open'));
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
  ['s1','s2','s3','s4','s5'].forEach(id => {
    const cf = document.getElementById(id + '-conf'); if (cf) cf.style.width = '0%';
    const pt = document.getElementById(id + '-pct');  if (pt) { pt.textContent = '—'; pt.style.color = 'var(--muted)'; }
    const sm = document.getElementById(id + '-sum');  if (sm) sm.textContent = '—';
  });
  const tf = document.getElementById('timer-fill'); if (tf) tf.style.width = '0%';
  _set('timer-elapsed', '0.0s');
}

/* ── UPDATE SCENARIO CARD ─────────────────────────────────────── */
function _updateScenarioCard(s, idx) {
  _setHTML('sc-icon', s.icon);
  _setHTML('sc-name', s.name);
  _set('sc-desc', s.desc);
  const sensorsEl = document.getElementById('sc-sensors');
  if (sensorsEl) {
    sensorsEl.innerHTML = s.sensors
      .map(x => `<span class="sc-sensor-tag active">${x}</span>`).join('');
  }
  // Stage overrides
  ['s1','s2','s3','s4'].forEach((sid, i) => {
    const def = s['s' + (i + 1)];
    const ie  = document.getElementById(sid + '-icon'); if (ie) ie.textContent = def.icon;
    const ne  = document.getElementById(sid + '-name'); if (ne) ne.textContent = def.name;
  });
  const sl1 = document.getElementById('s4-sub1-label'); if (sl1) sl1.textContent = s.s4l1;
  const sl2 = document.getElementById('s4-sub2-label'); if (sl2) sl2.textContent = s.s4l2;
  _set('timer-cycle', s.short);
  _setActiveBtn(idx);
}

/* ── STAGE HANDLERS ───────────────────────────────────────────── */
function _activateStage(n, elapsed) {
  curStage = n;
  for (let i = 1; i < n; i++) {
    const el = document.getElementById('s' + i);
    if (el) { el.classList.remove('active'); el.classList.add('done'); }
  }
  const cur = document.getElementById('s' + n);
  if (cur) { cur.classList.add('active'); cur.classList.remove('done'); }
  const ft = (elapsed / 1000).toFixed(1);
  if (sc.id === 'explosion' && n === 1) { SM_Canvas.TARGET.visible = true; setTimeout(() => SM_Canvas.blastWave(), 900); }
  if (!sc.isMoving && n === 1) SM_Canvas.TARGET.visible = true;
  switch (n) {
    case 1: _doStage1();      break;
    case 2: _doStage2();      break;
    case 3: _doStage3(ft);    break;
    case 4: _doStage4();      break;
    case 5: _doStage5(elapsed); break;
  }
}

function _doStage1() {
  const d = sc.buildS1(ev);
  _set('s1-sum', sc.s1sum(ev));
  _animConf('s1-conf', 's1-pct', parseFloat(ev.conf) * 50);
  _setBadge('s1-bdg-sr', `${d.sr.length} sensor`);
  _setBadge('s1-bdg-det', `${d.det.length} fields`);
  _setBadge('s1-bdg-log', '1 entry');
  _buildSrRows('s1-sr-inner', d.sr);
  _buildTable('s1-det-table', d.det);
  _setHTML('s1-log', d.log);
  _setEv(sc.evChainDef[0].lbl, 'DETECTED', 'hi');
  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">[${sc.short}]</span>  STAGE_1_TRIGGER`);
  _addAlert(`<span class="hi">${sc.icon} SUSPICION</span> — ${sc.short}`);
  _setBtnStatus(sIdx, 'STAGE 1');
}

function _doStage2() {
  const d = sc.buildS2(ev);
  _set('s2-sum', sc.s2sum(ev));
  _animConf('s2-conf', 's2-pct', parseFloat(ev.conf) * 100);
  _setBadge('s2-bdg-sensors', `${d.sr.length} sensors`);
  _setBadge('s2-bdg-fusion', ev.conf);
  _setBadge('s2-bdg-log', '3 entries');
  _buildSrRows('s2-sensors-inner', d.sr);
  _buildTable('s2-fusion-table', d.fus);
  _setHTML('s2-log', d.log);
  for (let i = 1; i < Math.min(3, sc.evChainDef.length); i++) _setEv(sc.evChainDef[i].lbl, 'CONFIRMED', 'ok');
  SM_Canvas.NODES.forEach(n => { if (n.state === 'detecting') n.state = 'confirmed'; });
  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">[${sc.short}]</span>  CONFIRMED  class=${ev.cls}  conf=${ev.conf}`);
  _addAlert(`<span class="ok">✓ CONFIRMED</span> — ${ev.cls} · conf ${ev.conf}`);
  _setBtnStatus(sIdx, 'STAGE 2');
}

function _doStage3(ft) {
  const d = sc.buildS3(ev, ft);
  _set('s3-sum', sc.s3sum(ev));
  _animConf('s3-conf', 's3-pct', 88);
  _setBadge('s3-bdg-nodes', 'synced');
  _setBadge('s3-bdg-fix', `±${ev.cep}m`);
  _setBadge('s3-bdg-log', '2 entries');
  _buildSrRows('s3-nodes-inner', d.nodes);
  _buildTable('s3-fix-table', d.fix);
  _setHTML('s3-log', d.log);
  if (sc.evChainDef[3]) _setEv(sc.evChainDef[3].lbl, 'CONFIRMED', 'ok');
  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">[${sc.short}]</span>  GPS_FIX  ±${ev.cep}m`);
  _addAlert(`<span class="ok">📍 GPS FIX</span> — ${ev.lat}°N ${ev.lng}°E · ±${ev.cep}m`);
  _setBtnStatus(sIdx, 'STAGE 3');
}

function _doStage4() {
  const d = sc.buildS4(ev);
  _set('s4-sum', sc.s4sum(ev));
  _animConf('s4-conf', 's4-pct', 94);
  _setBadge('s4-bdg-move', sc.isMoving ? `~${ev.speed}km/h` : 'static');
  _setBadge('s4-bdg-trail', 'live');
  _setBadge('s4-bdg-log', 'building');
  _buildTable('s4-move-table', d.move);
  _buildTable('s4-trail-table', d.trail);
  _setHTML('s4-log', d.log);
  if (sc.evChainDef[4]) _setEv(sc.evChainDef[4].lbl, 'LOGGING', 'hi');
  const trailIv = setInterval(() => {
    ev.trackPts++;
    _setBadge('s4-bdg-trail', `${ev.trackPts} pts`);
    _set('s4-sum', sc.s4sum(ev));
    if (curStage > 4) clearInterval(trailIv);
  }, 600);
  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">[${sc.short}]</span>  STAGE_4_ACTIVE`);
  _addAlert(`<span class="hi">${sc.icon} TRACKING</span> — ${ev.cls}`);
  _setBtnStatus(sIdx, 'STAGE 4');
}

function _doStage5(elapsed) {
  const tt = (elapsed / 1000).toFixed(1);
  _set('s5-sum', `${ev.alertId} · ${tt}s`);
  _animConf('s5-conf', 's5-pct', 96);
  _setBadge('s5-bdg-pkg', ev.alertId);
  _setBadge('s5-bdg-ev', 'full chain');
  _setBadge('s5-bdg-log', '3 entries');
  _buildTable('s5-pkg-table', [
    ['Alert ID',       ev.alertId,                         'hi'  ],
    ['Threat class',   ev.cls,                             'warn'],
    ['Confidence',     ev.conf + ' — HIGH',                'hi'  ],
    ['Scenario',       sc.short                                   ],
    ['GPS position',   `${ev.lat}°N  ${ev.lng}°E`               ],
    ['Evidence items', (sc.evChainDef.length - 1) + ' confirmed' ],
    ['Cascade time',   tt + 's from first trigger',        'ok'  ],
  ]);
  const evInner = document.getElementById('s5-ev-inner');
  if (evInner) {
    evInner.innerHTML = '<table class="dtable">' +
      sc.evChainDef.slice(0, -1).map(e => `<tr><td>${e.lbl}</td><td class="ok">CONFIRMED</td></tr>`).join('') +
      '</table>';
  }
  sc.evChainDef.forEach(e => _setEv(e.lbl, 'CONFIRMED', 'ok'));
  _setHTML('s5-log',
    `<span class="lt">${_ts()}</span>  <span class="lh">ALERT DISPATCHED</span>  id=${ev.alertId}\n` +
    `<span class="lt">${_ts()}</span>  cascade=${tt}s  class=${ev.cls}  conf=${ev.conf}\n` +
    `<span class="lt">${_ts()}</span>  <span class="le">AWAITING OPERATOR ACTION</span>`
  );
  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">⚡ ALERT ${ev.alertId}</span>  ${ev.cls}  ${tt}s  <span class="ok">→ OPERATOR</span>`);
  _addAlert(`<span class="warn">⚠ ${ev.alertId}</span> — ${ev.cls} · ${tt}s · <span class="warn">AWAITING</span>`);
  _setBtnStatus(sIdx, '✓ COMPLETE');
}

/* ── START SCENARIO ───────────────────────────────────────────── */
function _startScenario(idx) {
  sc   = SCENARIOS[idx];
  sIdx = idx;

  _setAccent(sc.accent);
  _updateScenarioCard(sc, idx);

  // Reset status badges on all buttons
  SCENARIOS.forEach((_, i) => _setBtnStatus(i, i === idx ? 'ACTIVE' : '—'));

  ev           = sc.genEv();
  ev.alertId   = `SM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(_ri(1, 9999)).padStart(4, '0')}`;
  ev.trackPts  = 0;
  ev.nodesHit  = 0;

  _buildEvChain(sc.evChainDef);
  _resetUI();
  SM_Canvas.resetNodes();
  SM_Canvas.initTarget(sc.isMoving);

  curStage   = 0;
  t0         = performance.now();
  window._t0 = t0;

  _sysLog(`<span class="ts">${_ts()}</span>  <span class="evt">// SCENARIO ${idx + 1} — ${sc.short} //</span>`);

  if (simIv) clearInterval(simIv);

  simIv = setInterval(() => {
    const elapsed = performance.now() - t0;

    const tf = document.getElementById('timer-fill');
    if (tf) tf.style.width = Math.min(elapsed / CDUR * 100, 100) + '%';
    _set('timer-elapsed', (elapsed / 1000).toFixed(1) + 's');

    SM_Canvas.moveTarget(curStage, sc.isMoving);
    if (sc.isMoving && curStage >= 4) ev.trackPts++;

    if (sc.isMoving && curStage >= 1) {
      SM_Canvas.checkNodeDetection(curStage, (nodeId, dist) => {
        _sysLog(`<span class="ts">${_ts()}</span>  <span class="node">${nodeId}</span>  ENTER_RANGE  dist=${dist}px`);
      });
    }

    SM_Canvas.animateNodes();
    SM_Canvas.drawFrame(sc.accent);
    if (!sc.isMoving && curStage >= 1) SM_Canvas.drawStaticMarker();

    // Stage advance
    const ni = STAGE_T.findIndex(s => elapsed >= s.s && elapsed < s.e);
    if (ni !== -1 && ni !== curStage - 1) _activateStage(ni + 1, elapsed);

    // End of scenario
    if (elapsed >= CDUR) {
      clearInterval(simIv);
      _setBtnStatus(idx, '✓ DONE');
      // Only auto-advance if still in auto mode
      if (!manualMode) {
        const next = (idx + 1) % SCENARIOS.length;
        setTimeout(() => _startScenario(next), 800);
      }
    }
  }, 50);
}

/* ── BOOT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  SM_Canvas.drawFrame('#f5a623');
  setTimeout(() => _startScenario(0), 300);
});

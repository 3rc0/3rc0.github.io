/* ============================================================
   SENTINEL MESH — Detection Cascade Visualization
   canvas.js — SM-VIZ-1.3
   3rc0.github.io/assets/js/canvas.js

   Street-light-pole node grid drawing engine.
   Handles all canvas rendering — poles, lights, target,
   trail, rings, blast wave, mesh lines.
   No scenario logic. No UI interaction. Pure drawing.
   ============================================================ */

'use strict';

/* ── CANVAS SETUP ─────────────────────────────────────────────── */
const _canvas = document.getElementById('node-canvas');
if (!_canvas) { console.error('canvas.js: #node-canvas not found in DOM.'); }
const _ctx    = _canvas ? _canvas.getContext('2d') : null;

const CW = 420;   // canvas width  px
const CH = 420;   // canvas height px
if (_canvas) { _canvas.width = CW; _canvas.height = CH; }

/* ── GRID LAYOUT ──────────────────────────────────────────────── */
// 4 rows × 5 cols of street light poles
// Outer margin gives space for target to be visible before hitting first node
const ROWS  = 4;
const COLS  = 5;
const NX0   = 60;   // first pole x
const NY0   = 70;   // first pole y
const NSX   = 76;   // horizontal spacing
const NSY   = 88;   // vertical spacing

// Detection radius — how close target must be to trigger a node
const DET_R = 52;

// Pole dimensions
const POLE_H      = 22;   // pole height px
const POLE_W      = 2;    // pole width px
const HEAD_R      = 7;    // sensor head radius
const HEAD_HALO_R = 14;   // max glow halo radius

/* ── NODE OBJECTS ─────────────────────────────────────────────── */
// Build the grid
const NODES = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    NODES.push({
      // Head position (top of pole)
      x:    NX0 + c * NSX,
      y:    NY0 + r * NSY,
      row:  r,
      col:  c,
      id:   `N${String(r * COLS + c + 1).padStart(2, '0')}`,

      // Visual state
      state:    'off',        // 'off' | 'detecting' | 'confirmed'
      glow:     0,            // current glow intensity 0–1
      glowDir:  1,            // 1 = increasing, -1 = decreasing (pulse)

      // Ripple ring
      ringR:    0,
      ringA:    0,

      // For blast wave — individual delay
      blastDelay: 0,
    });
  }
}

/* ── TARGET OBJECT ────────────────────────────────────────────── */
// Target starts OUTSIDE the canvas and moves in
const TARGET = {
  x:     0,
  y:     0,
  vx:    0,
  vy:    0,
  trail: [],

  // Visual
  visible: false,

  // Entry annotation
  entryX: 0,
  entryY: 0,
  entryLabelled: false,
};

/* ── PUBLIC: reset all nodes ──────────────────────────────────── */
function resetNodes() {
  NODES.forEach(n => {
    n.state      = 'off';
    n.glow       = 0;
    n.glowDir    = 1;
    n.ringR      = 0;
    n.ringA      = 0;
    n.blastDelay = 0;
  });
  TARGET.trail        = [];
  TARGET.visible      = false;
  TARGET.entryLabelled = false;
}

/* ── PUBLIC: place target at edge, outside canvas ─────────────── */
function initTarget(isMoving) {
  if (!isMoving) {
    // Static event — place epicentre inside grid, near centre
    const cx = NX0 + NSX * 2 + _ri(-20, 20);
    const cy = NY0 + NSY * 1.5 + _ri(-15, 15);
    TARGET.x  = cx;
    TARGET.y  = cy;
    TARGET.vx = 0;
    TARGET.vy = 0;
    TARGET.visible = false; // revealed at stage 1
    TARGET.trail   = [];
    return;
  }

  // Moving target — start WELL outside the canvas so it's visible
  // approaching from a distance before hitting any node
  const edge = _ri(0, 3); // 0=left, 1=top, 2=right

  if (edge === 0) {
    // Enters from left side
    TARGET.x  = -80;
    TARGET.y  = NY0 + NSY * _ri(0, ROWS - 1) + _ri(-20, 20);
    TARGET.vx = 0.9 + Math.random() * 0.5;
    TARGET.vy = (Math.random() - 0.5) * 0.4;
  } else if (edge === 1) {
    // Enters from top
    TARGET.x  = NX0 + NSX * _ri(0, COLS - 1) + _ri(-20, 20);
    TARGET.y  = -80;
    TARGET.vx = (Math.random() - 0.5) * 0.4;
    TARGET.vy = 0.9 + Math.random() * 0.5;
  } else {
    // Enters from right side
    TARGET.x  = CW + 80;
    TARGET.y  = NY0 + NSY * _ri(0, ROWS - 1) + _ri(-20, 20);
    TARGET.vx = -(0.9 + Math.random() * 0.5);
    TARGET.vy = (Math.random() - 0.5) * 0.4;
  }

  TARGET.entryX       = TARGET.x;
  TARGET.entryY       = TARGET.y;
  TARGET.entryLabelled = false;
  TARGET.trail        = [];
  TARGET.visible      = true;
}

/* ── PUBLIC: check nodes for detection ───────────────────────── */
// Called every frame for moving targets.
// Nodes nearest to target light up first — realistic propagation.
function checkNodeDetection(curStage, logFn) {
  NODES.forEach(n => {
    if (n.state !== 'off') return;
    const dist = Math.hypot(TARGET.x - n.x, TARGET.y - n.y);
    if (dist <= DET_R) {
      n.state  = 'detecting';
      n.glow   = 0.3;
      n.glowDir = 1;
      _triggerRing(n);
      if (logFn) logFn(n.id, Math.round(dist));
    }
  });

  // Stage 2+ — upgrade detecting → confirmed
  if (curStage >= 2) {
    NODES.forEach(n => {
      if (n.state === 'detecting') {
        n.state = 'confirmed';
        _triggerRing(n);
      }
    });
  }
}

/* ── PUBLIC: blast wave — all nodes fire with radial delay ───── */
function blastWave() {
  const cx = TARGET.x;
  const cy = TARGET.y;
  TARGET.visible = true;

  NODES.forEach(n => {
    const dist = Math.hypot(cx - n.x, cy - n.y);
    // Stagger based on distance — simulates pressure wave propagation
    const delay = dist * 3.5;
    setTimeout(() => {
      n.state    = 'confirmed';
      n.glow     = 1;
      n.glowDir  = -1;
      n.ringR    = 6;
      n.ringA    = 1.0;
    }, delay);
  });
}

/* ── PUBLIC: move target one frame ───────────────────────────── */
function moveTarget(curStage, isMoving) {
  if (!isMoving || curStage < 1) return;

  TARGET.x += TARGET.vx * 0.42;
  TARGET.y += TARGET.vy * 0.34;

  // Gentle bounce if deep inside canvas and moving away from nodes
  if (TARGET.x > CW + 40)  TARGET.vx = -Math.abs(TARGET.vx);
  if (TARGET.x < -40)      TARGET.vx =  Math.abs(TARGET.vx);
  if (TARGET.y > CH + 40)  TARGET.vy = -Math.abs(TARGET.vy);
  if (TARGET.y < -40)      TARGET.vy =  Math.abs(TARGET.vy);

  // Record trail — only points inside or near canvas
  if (TARGET.x > -60 && TARGET.x < CW + 60 && TARGET.y > -60 && TARGET.y < CH + 60) {
    TARGET.trail.push({ x: TARGET.x, y: TARGET.y });
    if (TARGET.trail.length > 90) TARGET.trail.shift();
  }
}

/* ── PUBLIC: animate rings + pole glow each frame ────────────── */
function animateNodes() {
  NODES.forEach(n => {
    // Pulse glow for detecting nodes
    if (n.state === 'detecting') {
      n.glow += n.glowDir * 0.04;
      if (n.glow >= 1)   { n.glow = 1;   n.glowDir = -1; }
      if (n.glow <= 0.2) { n.glow = 0.2; n.glowDir =  1; }
    }

    // Confirmed nodes — steady full glow
    if (n.state === 'confirmed') {
      n.glow = Math.min(n.glow + 0.05, 1);
    }

    // Ripple ring — expand and fade, re-trigger
    if (n.ringR > 0) {
      n.ringR += 0.7;
      n.ringA  = Math.max(0, n.ringA - 0.018);
      if (n.ringA <= 0) {
        n.ringR = 0;
        n.ringA = 0;
        // Re-trigger for active nodes
        if (n.state !== 'off') {
          setTimeout(() => _triggerRing(n), _ri(600, 2200));
        }
      }
    }
  });
}

/* ── PUBLIC: draw one frame ───────────────────────────────────── */
function drawFrame(scenarioAccent) {
  if (!_ctx) return;

  // Background
  _ctx.fillStyle = '#060d18';
  _ctx.fillRect(0, 0, CW, CH);

  // BG grid lines
  _ctx.strokeStyle = 'rgba(0,212,245,0.05)';
  _ctx.lineWidth   = 0.5;
  for (let i = 0; i < CW; i += 24) {
    _ctx.beginPath(); _ctx.moveTo(i, 0); _ctx.lineTo(i, CH); _ctx.stroke();
  }
  for (let i = 0; i < CH; i += 24) {
    _ctx.beginPath(); _ctx.moveTo(0, i); _ctx.lineTo(CW, i); _ctx.stroke();
  }

  // Perimeter label (faint, outside node grid)
  _ctx.font      = '8px Share Tech Mono, monospace';
  _ctx.fillStyle = 'rgba(48,69,96,0.6)';
  _ctx.fillText('PERIMETER', 4, 12);
  _ctx.fillText('◄ OUTER DETECTION ZONE ►', NX0 - 10, CH - 8);

  _drawMeshLines();
  _drawDetectionZones();
  _drawRings();
  _drawTrail(scenarioAccent);
  _drawTargetApproach(scenarioAccent);
  _drawPoles();
  _drawStatusLine();
}

/* ── PRIVATE DRAWING FUNCTIONS ────────────────────────────────── */

function _drawMeshLines() {
  NODES.forEach((a, i) => {
    NODES.forEach((b, j) => {
      if (j <= i) return;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > NSX * 1.65) return;
      const active = a.state !== 'off' || b.state !== 'off';
      _ctx.strokeStyle = `rgba(0,212,245,${active ? 0.28 : 0.06})`;
      _ctx.lineWidth   = active ? 0.8 : 0.4;
      _ctx.beginPath();
      _ctx.moveTo(a.x, a.y);
      _ctx.lineTo(b.x, b.y);
      _ctx.stroke();
    });
  });
}

function _drawDetectionZones() {
  // Dashed detection radius circle around active nodes
  NODES.forEach(n => {
    if (n.state === 'off') return;
    _ctx.beginPath();
    _ctx.arc(n.x, n.y, DET_R, 0, Math.PI * 2);
    _ctx.setLineDash([4, 5]);
    _ctx.strokeStyle = n.state === 'confirmed'
      ? 'rgba(57,211,83,0.10)'
      : 'rgba(245,166,35,0.08)';
    _ctx.lineWidth = 1;
    _ctx.stroke();
    _ctx.setLineDash([]);
  });
}

function _drawRings() {
  NODES.forEach(n => {
    if (n.ringR < 2 || n.ringA <= 0) return;
    const col = n.state === 'confirmed' ? '57,211,83' : '245,166,35';
    _ctx.beginPath();
    _ctx.arc(n.x, n.y, n.ringR, 0, Math.PI * 2);
    _ctx.strokeStyle = `rgba(${col},${n.ringA})`;
    _ctx.lineWidth   = 1.8;
    _ctx.stroke();
  });
}

function _drawTrail(accent) {
  if (TARGET.trail.length < 2) return;

  // Trail line
  _ctx.beginPath();
  _ctx.moveTo(TARGET.trail[0].x, TARGET.trail[0].y);
  TARGET.trail.forEach(p => _ctx.lineTo(p.x, p.y));
  _ctx.strokeStyle = 'rgba(255,71,87,0.45)';
  _ctx.lineWidth   = 2;
  _ctx.stroke();

  // Entry dot + label — shown once trail is long enough
  if (TARGET.trail.length > 8) {
    const ex = TARGET.trail[0].x;
    const ey = TARGET.trail[0].y;
    _ctx.beginPath();
    _ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
    _ctx.fillStyle = 'rgba(255,71,87,0.45)';
    _ctx.fill();
    _ctx.font      = '8px Share Tech Mono, monospace';
    _ctx.fillStyle = 'rgba(255,110,110,0.65)';
    _ctx.fillText('ENTRY', ex + 6, ey - 5);
  }
}

function _drawTargetApproach(accent) {
  if (!TARGET.visible) return;

  const x = TARGET.x;
  const y = TARGET.y;

  // Approach arrow — visible even when outside canvas
  // Dashed line from entry point toward current position if off-canvas
  const offCanvas = x < 0 || x > CW || y < 0 || y > CH;

  if (offCanvas) {
    // Clamp to canvas edge and draw arrow + label
    const ex = Math.max(4, Math.min(CW - 4, x));
    const ey = Math.max(4, Math.min(CH - 4, y));

    // Direction arrow on canvas edge
    _ctx.save();
    _ctx.translate(ex, ey);
    const angle = Math.atan2(TARGET.vy, TARGET.vx);
    _ctx.rotate(angle);

    // Arrow
    _ctx.strokeStyle = `rgba(255,71,87,0.85)`;
    _ctx.lineWidth   = 2;
    _ctx.beginPath(); _ctx.moveTo(0, 0); _ctx.lineTo(18, 0); _ctx.stroke();
    _ctx.beginPath(); _ctx.moveTo(18, 0); _ctx.lineTo(11, -5); _ctx.stroke();
    _ctx.beginPath(); _ctx.moveTo(18, 0); _ctx.lineTo(11,  5); _ctx.stroke();

    _ctx.restore();

    // Distance label
    const distToBorder = Math.min(
      Math.abs(x), Math.abs(x - CW), Math.abs(y), Math.abs(y - CH)
    );
    _ctx.font      = 'bold 8px Share Tech Mono, monospace';
    _ctx.fillStyle = 'rgba(255,100,100,0.8)';
    const lx = Math.max(8, Math.min(CW - 70, ex));
    const ly = Math.max(16, Math.min(CH - 8, ey - 12));
    _ctx.fillText('TARGET APPROACHING', lx, ly);

    return;
  }

  // Target is inside canvas — draw full marker
  // Outer glow ring
  _ctx.shadowColor = '#ff4757';
  _ctx.shadowBlur  = 16;
  _ctx.beginPath();
  _ctx.arc(x, y, 6, 0, Math.PI * 2);
  _ctx.fillStyle = '#ff4757';
  _ctx.fill();
  _ctx.shadowBlur = 0;

  // Crosshair
  _ctx.strokeStyle = 'rgba(255,71,87,0.55)';
  _ctx.lineWidth   = 1;
  _ctx.beginPath(); _ctx.moveTo(x - 16, y); _ctx.lineTo(x + 16, y); _ctx.stroke();
  _ctx.beginPath(); _ctx.moveTo(x, y - 16); _ctx.lineTo(x, y + 16); _ctx.stroke();

  // Rotating scan ring
  const now    = performance.now() / 1000;
  const scanR  = 20 + Math.sin(now * 3) * 4;
  _ctx.beginPath();
  _ctx.arc(x, y, scanR, 0, Math.PI * 1.5);
  _ctx.strokeStyle = 'rgba(255,71,87,0.35)';
  _ctx.lineWidth   = 1.5;
  _ctx.stroke();

  // Label
  _ctx.font      = 'bold 9px Share Tech Mono, monospace';
  _ctx.fillStyle = 'rgba(255,110,110,0.95)';
  _ctx.fillText('TARGET', x + 10, y - 10);
}

function _drawStaticEvent() {
  // For gunshot / explosion — X marker at epicentre
  const x = TARGET.x;
  const y = TARGET.y;
  if (!TARGET.visible) return;

  _ctx.strokeStyle = 'rgba(255,71,87,0.85)';
  _ctx.lineWidth   = 2.5;
  _ctx.beginPath(); _ctx.moveTo(x - 12, y - 12); _ctx.lineTo(x + 12, y + 12); _ctx.stroke();
  _ctx.beginPath(); _ctx.moveTo(x + 12, y - 12); _ctx.lineTo(x - 12, y + 12); _ctx.stroke();

  _ctx.font      = 'bold 9px Share Tech Mono, monospace';
  _ctx.fillStyle = 'rgba(255,110,110,0.95)';
  _ctx.fillText('EPICENTRE', x + 14, y - 8);
}

function _drawPoles() {
  NODES.forEach(n => {
    const hx = n.x;   // head x
    const hy = n.y;   // head y (top of pole)
    const bx = hx;    // base x
    const by = hy + POLE_H; // base y (bottom of pole)

    // ── Pole shaft ──────────────────────────────────────────────
    const poleCol = n.state === 'off'
      ? 'rgba(48,69,96,0.7)'
      : n.state === 'confirmed'
        ? 'rgba(57,211,83,0.6)'
        : 'rgba(245,166,35,0.6)';

    _ctx.strokeStyle = poleCol;
    _ctx.lineWidth   = POLE_W;
    _ctx.beginPath();
    _ctx.moveTo(bx, by);
    _ctx.lineTo(hx, hy);
    _ctx.stroke();

    // Small arm at top of pole (like a real street light)
    _ctx.beginPath();
    _ctx.moveTo(hx, hy);
    _ctx.lineTo(hx + 5, hy - 4);
    _ctx.strokeStyle = poleCol;
    _ctx.lineWidth   = POLE_W;
    _ctx.stroke();

    // ── Sensor head (light) ─────────────────────────────────────
    const headX = hx + 5;
    const headY = hy - 4;

    // Glow halo — only for active nodes
    if (n.state !== 'off' && n.glow > 0) {
      const glowCol = n.state === 'confirmed'
        ? `rgba(57,211,83,${n.glow * 0.25})`
        : `rgba(245,166,35,${n.glow * 0.28})`;
      const grad = _ctx.createRadialGradient(headX, headY, HEAD_R, headX, headY, HEAD_HALO_R);
      grad.addColorStop(0, glowCol);
      grad.addColorStop(1, 'transparent');
      _ctx.fillStyle = grad;
      _ctx.beginPath();
      _ctx.arc(headX, headY, HEAD_HALO_R, 0, Math.PI * 2);
      _ctx.fill();
    }

    // Head circle
    const headCol = n.state === 'confirmed'
      ? '#39d353'
      : n.state === 'detecting'
        ? '#f5a623'
        : '#304560';

    if (n.state !== 'off') {
      _ctx.shadowColor = headCol;
      _ctx.shadowBlur  = n.state === 'confirmed' ? 12 : 8 + n.glow * 8;
    }

    _ctx.beginPath();
    _ctx.arc(headX, headY, HEAD_R, 0, Math.PI * 2);
    _ctx.fillStyle = headCol;
    _ctx.fill();

    // Inner bright spot — confirms sensor is live
    if (n.state !== 'off') {
      _ctx.beginPath();
      _ctx.arc(headX, headY, HEAD_R * 0.45, 0, Math.PI * 2);
      _ctx.fillStyle = n.state === 'confirmed'
        ? 'rgba(180,255,180,0.7)'
        : 'rgba(255,220,140,0.7)';
      _ctx.fill();
    }

    _ctx.shadowBlur = 0;

    // ── Node label ───────────────────────────────────────────────
    const labelCol = n.state === 'confirmed'
      ? 'rgba(57,211,83,0.9)'
      : n.state === 'detecting'
        ? 'rgba(251,191,78,0.9)'
        : 'rgba(150,180,210,0.45)';

    _ctx.font      = 'bold 9px Share Tech Mono, monospace';
    _ctx.fillStyle = labelCol;
    _ctx.fillText(n.id, headX + HEAD_R + 3, headY + 3);

    // State label — only active
    if (n.state !== 'off') {
      _ctx.font      = '7.5px Share Tech Mono, monospace';
      _ctx.fillStyle = n.state === 'confirmed'
        ? 'rgba(57,211,83,0.65)'
        : 'rgba(245,166,35,0.65)';
      _ctx.fillText(
        n.state === 'confirmed' ? 'CONFIRMED' : 'DETECTING',
        headX + HEAD_R + 3,
        headY + 14
      );
    }

    // ── Ground base dot ──────────────────────────────────────────
    _ctx.beginPath();
    _ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
    _ctx.fillStyle = n.state === 'off'
      ? 'rgba(48,69,96,0.5)'
      : n.state === 'confirmed'
        ? 'rgba(57,211,83,0.4)'
        : 'rgba(245,166,35,0.4)';
    _ctx.fill();
  });
}

function _drawStatusLine() {
  const confirmed = NODES.filter(n => n.state === 'confirmed').length;
  const detecting = NODES.filter(n => n.state === 'detecting').length;
  const inactive  = NODES.length - confirmed - detecting;
  _ctx.font      = '8.5px Share Tech Mono, monospace';
  _ctx.fillStyle = 'rgba(100,140,180,0.65)';
  _ctx.fillText(
    `CONFIRMED: ${confirmed}   DETECTING: ${detecting}   INACTIVE: ${inactive}`,
    8, CH - 8
  );
}

/* ── HELPER ───────────────────────────────────────────────────── */
function _triggerRing(n) {
  n.ringR = 5;
  n.ringA = 0.85;
}

function _ri(a, b) {
  return Math.floor(a + Math.random() * (b - a));
}

/* ── PUBLIC: draw static event marker (gunshot / explosion) ───── */
function drawStaticMarker() {
  _drawStaticEvent();
}

/* ── EXPORTS ──────────────────────────────────────────────────── */
// Everything viz.js needs from this module
window.SM_Canvas = {
  NODES,
  TARGET,
  DET_R,
  resetNodes,
  initTarget,
  checkNodeDetection,
  blastWave,
  moveTarget,
  animateNodes,
  drawFrame,
  drawStaticMarker,
};

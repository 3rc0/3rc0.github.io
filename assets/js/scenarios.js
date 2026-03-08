/* ============================================================
   SENTINEL MESH — Detection Cascade Visualization
   scenarios.js — SM-VIZ-1.3
   3rc0.github.io/assets/js/scenarios.js

   Contains all scenario definitions.
   No DOM access. No canvas. No UI.
   Add new scenarios here without touching any other file.
   ============================================================ */

'use strict';

/* ── HELPERS (used only inside this file) ────────────────────── */
function _ts() {
  return new Date().toISOString().slice(11, 22) + 'Z';
}
function _ri(a, b) {
  return Math.floor(a + Math.random() * (b - a));
}

/* ============================================================
   SCENARIO DEFINITIONS
   Each scenario must have:
     id, icon, name, short, desc, accent
     sensors[]         — sensor tags shown on title card + scenario card
     evChainDef[]      — evidence chain items {icon, lbl}
     isMoving          — true = target moves across grid
                         false = static event (explosion, gunshot)
     s1–s4             — stage icon + name overrides
     s4l1, s4l2        — sub-section labels for stage 4
     genEv()           — generates a fresh random event object
     buildS1–S4(ev)    — builds data for each stage panel
     s1sum–s4sum(ev)   — one-line summary string per stage
   ============================================================ */

const SCENARIOS = [

  /* ── 0 — DRONE ─────────────────────────────────────────────── */
  {
    id: 'drone',
    icon: '🚁',
    name: '<em>Drone</em> Detection',
    short: 'DRONE DETECTION',
    desc: 'FPV / quadcopter / loitering munition. Target enters from outside the sensor grid perimeter. Edge nodes detect first — cascade spreads inward. RF fingerprint + acoustic rotor + thermal heat + optical camera all confirm before threat reaches centre.',
    accent: '#f5a623',

    sensors: [
      'ACOUSTIC ARRAY',
      'RF SDR',
      'THERMAL IR',
      'OPTICAL CAMERA',
      'GPS TDOA',
    ],

    evChainDef: [
      { icon: '🎙', lbl: 'Acoustic rotor harmonic' },
      { icon: '📡', lbl: 'RF protocol fingerprint' },
      { icon: '🔴', lbl: 'Thermal heat signature' },
      { icon: '📷', lbl: 'Optical visual confirm' },
      { icon: '📍', lbl: 'GPS position fix' },
      { icon: '🛤', lbl: 'Flight trail log' },
      { icon: '🔔', lbl: 'Alert dispatched' },
    ],

    isMoving: true,

    s1: { icon: '👁',  name: 'Perimeter Node Triggered' },
    s2: { icon: '✓',  name: 'Multi-Sensor Confirm' },
    s3: { icon: '📍', name: 'Location Fix' },
    s4: { icon: '🛤', name: 'Flight Trail' },
    s4l1: 'Flight Data',
    s4l2: 'Trail Log',

    genEv() {
      return {
        cls:      ['FPV_DRONE', 'QUADCOPTER', 'LOITERING_MUNITION'][_ri(0, 3)],
        freq:     _ri(380, 620),
        snr:      _ri(12, 28).toFixed(1),
        conf:     (0.72 + Math.random() * 0.2).toFixed(2),
        lat:      (33.3  + Math.random() * 0.05).toFixed(5),
        lng:      (44.4  + Math.random() * 0.05).toFixed(5),
        cep:      _ri(15, 25),
        speed:    _ri(55, 145),
        bearing:  _ri(30, 310),
        rfProto:  ['DJI FPV 5.8GHz', 'DJI OcuSync 2.4GHz', 'Skydio 5.8GHz'][_ri(0, 3)],
        trackPts: 0,
        nodesHit: 0,
      };
    },

    buildS1(ev) {
      return {
        sr: [
          { n: 'ACOUSTIC (EDGE NODE)', t: 'ROTOR HARMONIC', c: 'var(--amber)', v: (0.28 + Math.random() * 0.18).toFixed(2), p: 40 },
        ],
        det: [
          ['Detection zone',   'PERIMETER — outer edge nodes only',       'hi'],
          ['Frequency',        `${ev.freq}Hz (drone rotor band 50–8kHz)`       ],
          ['SNR',              `+${ev.snr}dB above ambient`                    ],
          ['Status',           'SINGLE SENSOR — escalating to confirm',    'hi'],
          ['Node clock',       _ts()                                           ],
        ],
        log:
          `<span class="lt">${_ts()}</span>  EDGE_NODE  ACO_TRIGGER  freq=${ev.freq}Hz  snr=+${ev.snr}dB\n` +
          `<span class="lt">${_ts()}</span>  zone=PERIMETER  escalating_to_confirmation`,
      };
    },

    buildS2(ev) {
      return {
        sr: [
          { n: 'ACOUSTIC',     t: 'ROTOR HARMONIC',             c: 'var(--amber)', v: (0.74 + Math.random() * 0.12).toFixed(2), p: 76               },
          { n: 'RF SDR',       t: ev.rfProto.split(' ')[0],     c: 'var(--cyan)',  v: (0.69 + Math.random() * 0.12).toFixed(2), p: 71, vc: 'var(--cyan)'  },
          { n: 'THERMAL IR',   t: 'LWIR HEAT SIG',              c: 'var(--red)',   v: (0.64 + Math.random() * 0.10).toFixed(2), p: 64, vc: 'var(--red)'   },
          { n: 'OPTICAL CAM',  t: 'VISUAL TRACK',               c: 'var(--green)', v: (0.71 + Math.random() * 0.10).toFixed(2), p: 73, vc: 'var(--green)' },
        ],
        fus: [
          ['Sensors agreed',    '4 of 4 — ACO + RF + THM + OPT'              ],
          ['Fusion score',      `${ev.conf} ✓ THRESHOLD PASSED`,         'hi'],
          ['Classification',    ev.cls,                                  'hi'],
          ['RF protocol',       ev.rfProto                                    ],
          ['Thermal bearing',   ev.bearing + '° TRUE'                        ],
          ['Optical',           'UAV shape/size profile — MATCH'              ],
          ['Time from perimeter', ((performance.now() - (window._t0 || 0)) / 1000).toFixed(1) + 's' ],
        ],
        log:
          `<span class="lt">${_ts()}</span>  FUSION  aco=0.74  rf=0.69  thm=0.64  opt=0.71  score=<span class="lo">${ev.conf}</span>\n` +
          `<span class="lt">${_ts()}</span>  RF: <span class="lh">${ev.rfProto}</span>\n` +
          `<span class="lt">${_ts()}</span>  OPT: UAV_PROFILE_MATCH  THM: bearing=${ev.bearing}°`,
      };
    },

    buildS3(ev, ft) {
      return {
        nodes: [
          { n: 'EDGE NODE (FIRST HIT)', t: 'PERIMETER', v: '1.000', p: 94 },
          { n: 'NODE +1',               t: 'TDOA REF',  v: '0.981', p: 86 },
          { n: 'NODE +2',               t: 'TDOA REF',  v: '0.944', p: 78 },
        ],
        fix: [
          ['Algorithm',        'Chan-Ho TDOA Hyperbolic'                   ],
          ['GPS coordinates',  `${ev.lat}°N  ${ev.lng}°E`,            'hi'],
          ['CEP90 accuracy',   `±${ev.cep}m`                               ],
          ['GPS sync offset',  '±50 ns'                                    ],
          ['Fix time',         ft + 's from perimeter trigger'             ],
        ],
        log:
          `<span class="lt">${_ts()}</span>  TDOA_FIX  ${ev.lat},${ev.lng}  CEP90=±${ev.cep}m  fix_time=${ft}s`,
      };
    },

    buildS4(ev) {
      return {
        move: [
          ['Entry point',       'Perimeter — outer edge',            'hi'],
          ['Current position',  `${ev.lat}°N  ${ev.lng}°E`,         'hi'],
          ['Heading',           `${ev.bearing}°T`                       ],
          ['Speed',             `~${ev.speed} km/h`                     ],
          ['Nodes tracking',    'Spreading inward from perimeter'        ],
        ],
        trail: [
          ['Track points',  '—',             'ok'],
          ['Update rate',   '~5s'                ],
          ['Cloud archive', 'ACTIVE',        'ok'],
          ['Local buffer',  'ACTIVE',        'ok'],
        ],
        log:
          `<span class="lt">${_ts()}</span>  TRAIL  heading=${ev.bearing}°  ~${ev.speed}km/h  entry=PERIMETER`,
      };
    },

    s1sum: ev => `Perimeter node · ${ev.freq}Hz · +${ev.snr}dB`,
    s2sum: ev => `${ev.cls} · conf ${ev.conf}`,
    s3sum: ev => `${ev.lat}°N ${ev.lng}°E ±${ev.cep}m`,
    s4sum: ev => `${ev.trackPts} track pts · ~${ev.speed}km/h`,
  },


  /* ── 1 — GUNSHOT ────────────────────────────────────────────── */
  {
    id: 'gunshot',
    icon: '💥',
    name: '<em>Gunshot</em> & Ballistic Trace',
    short: 'GUNSHOT DETECTION',
    desc: 'Two distinct acoustic signatures. Muzzle blast hits the nearest node first. Ballistic shockwave arrives at a DIFFERENT node 0.3s later from a different angle. Cross-bearing triangulates exact shooter position. No RF or thermal required.',
    accent: '#ff4757',

    sensors: [
      'ACOUSTIC — MUZZLE BLAST',
      'ACOUSTIC — BALLISTIC WAVE',
      'TDOA CROSS-BEARING',
    ],

    evChainDef: [
      { icon: '💥', lbl: 'Muzzle blast — node 1'         },
      { icon: '🔊', lbl: 'Ballistic shockwave — node 2'  },
      { icon: '🎯', lbl: 'Cross-bearing triangulation'   },
      { icon: '📍', lbl: 'Shooter GPS position'          },
      { icon: '📁', lbl: 'Forensic waveform log'         },
      { icon: '🔔', lbl: 'Alert dispatched'              },
    ],

    isMoving: false,

    s1: { icon: '💥', name: 'Muzzle Blast — Node 1' },
    s2: { icon: '🔊', name: 'Shockwave Cross-Bearing' },
    s3: { icon: '🎯', name: 'Shooter Position Fix' },
    s4: { icon: '📁', name: 'Forensic Evidence Log' },
    s4l1: 'Incident Data',
    s4l2: 'Forensic Archive',

    genEv() {
      return {
        cls:       ['SMALL_ARMS', 'SNIPER_FIRE', 'AUTOMATIC_BURST'][_ri(0, 3)],
        db:        _ri(118, 142),
        freq:      _ri(80, 200),
        conf:      (0.80 + Math.random() * 0.16).toFixed(2),
        lat:       (33.3  + Math.random() * 0.05).toFixed(5),
        lng:       (44.4  + Math.random() * 0.05).toFixed(5),
        cep:       _ri(6, 16),
        speed:     0,
        bearing:   _ri(0, 360),
        delay:     (0.28 + Math.random() * 0.14).toFixed(2),
        cal:       ['.308 Win', '7.62×39mm', '5.56×45mm', '12.7×99mm'][_ri(0, 4)],
        muzzleVel: _ri(750, 920),
        trackPts:  0,
        nodesHit:  0,
      };
    },

    buildS1(ev) {
      return {
        sr: [
          { n: 'NODE-07 — MUZZLE BLAST', t: 'FIRST HIT', c: 'var(--red)', v: (0.87 + Math.random() * 0.1).toFixed(2), p: 90, vc: 'var(--red)' },
        ],
        det: [
          ['Event type',    'Impulsive acoustic transient',                  'hi'],
          ['Peak SPL',      `${ev.db} dB SPL`                                   ],
          ['Duration',      '< 5ms — gunshot profile confirmed'                 ],
          ['Frequency',     `${ev.freq}Hz`                                      ],
          ['First node',    'NODE-07 — nearest to muzzle'                       ],
          ['Status',        'MUZZLE BLAST — awaiting shockwave on 2nd node', 'hi'],
        ],
        log:
          `<span class="lt">${_ts()}</span>  NODE-07  BLAST_TRIGGER  spl=${ev.db}dB  dur=<5ms  conf=0.89`,
      };
    },

    buildS2(ev) {
      return {
        sr: [
          { n: 'MUZZLE BLAST',   t: `NODE-07 · T+0.000s`,   c: 'var(--red)',   v: '0.91',    p: 91, vc: 'var(--red)'   },
          { n: 'BALLISTIC WAVE', t: `NODE-09 · T+${ev.delay}s`, c: 'var(--amber)', v: '0.86', p: 86                    },
          { n: 'CROSS-BEARING',  t: 'COMPUTED',              c: 'var(--green)', v: ev.conf,   p: Math.min(parseFloat(ev.conf) * 100, 98), vc: 'var(--green)' },
        ],
        fus: [
          ['Method',           'Dual-signature cross-bearing TDOA'           ],
          ['Muzzle blast',     'NODE-07 · conf 0.91'                         ],
          ['Shockwave arrival', `NODE-09 · T+${ev.delay}s`                  ],
          ['Angle difference', `${_ri(18, 48)}° — shooter bearing computed`  ],
          ['Classification',   ev.cls,                                  'hi'],
          ['Caliber estimate', ev.cal                                        ],
          ['Muzzle velocity',  `~${ev.muzzleVel} m/s`                       ],
        ],
        log:
          `<span class="lt">${_ts()}</span>  BLAST  spl=${ev.db}dB  t=0.000s  N07\n` +
          `<span class="lt">${_ts()}</span>  SHOCKWAVE  delay=${ev.delay}s  N09  angle_diff=${_ri(18, 48)}°\n` +
          `<span class="lt">${_ts()}</span>  CROSS_BEARING: <span class="lh">${ev.cls}</span>  conf=<span class="lo">${ev.conf}</span>`,
      };
    },

    buildS3(ev, ft) {
      return {
        nodes: [
          { n: 'NODE-07', t: 'BLAST REF', v: '1.000', p: 91 },
          { n: 'NODE-09', t: 'WAVE REF',  v: '0.862', p: 86 },
          { n: 'NODE-08', t: 'ACO REF',   v: '0.791', p: 79 },
        ],
        fix: [
          ['Algorithm',        'Dual-signature cross-bearing'                  ],
          ['Shooter position', `${ev.lat}°N  ${ev.lng}°E`,               'hi'],
          ['CEP90 accuracy',   `±${ev.cep}m — tighter (single point event)`   ],
          ['Direction of fire', `${ev.bearing}°T`                             ],
          ['Fix time',         ft + 's from muzzle blast'                     ],
        ],
        log:
          `<span class="lt">${_ts()}</span>  SHOOTER_FIX  ${ev.lat},${ev.lng}  CEP90=±${ev.cep}m\n` +
          `<span class="lt">${_ts()}</span>  direction=${ev.bearing}°T  cal=${ev.cal}  vel=~${ev.muzzleVel}m/s`,
      };
    },

    buildS4(ev) {
      const caseRef = `SM-GS-${_ri(1000, 9999)}`;
      return {
        move: [
          ['Shooter position',  `${ev.lat}°N  ${ev.lng}°E`,   'hi'],
          ['Direction of fire', `${ev.bearing}°T`                 ],
          ['Caliber',           ev.cal                             ],
          ['Muzzle velocity',   `~${ev.muzzleVel} m/s`            ],
          ['Post-shot movement', 'Unknown — log open'              ],
        ],
        trail: [
          ['Forensic entries',   '—',                         'ok'],
          ['Waveform captured',  '44.1kHz — all nodes'            ],
          ['Cloud sync',         'ACTIVE — immutable log',    'ok'],
          ['Case reference',     caseRef                          ],
        ],
        log:
          `<span class="lt">${_ts()}</span>  FORENSIC_LOG_OPEN  case=${caseRef}\n` +
          `<span class="lt">${_ts()}</span>  waveform_all_nodes  44100Hz`,
      };
    },

    s1sum: ev => `Muzzle blast · NODE-07 · ${ev.db}dB`,
    s2sum: ev => `Dual sig · delay ${ev.delay}s · conf ${ev.conf}`,
    s3sum: ev => `Shooter: ${ev.lat}°N ±${ev.cep}m`,
    s4sum: ev => `Forensic log · ${ev.trackPts} entries`,
  },


  /* ── 2 — EXPLOSION / IED ────────────────────────────────────── */
  {
    id: 'explosion',
    icon: '🔥',
    name: '<em>Explosion</em> / IED',
    short: 'EXPLOSION DETECTION',
    desc: 'Detonation triggers ALL sensor nodes simultaneously — the defining signature of a blast event. Seismic MEMS detects ground spike. Thermal IR captures bloom. Single point in space, no movement trail. Full forensic evidence log opens immediately.',
    accent: '#ff4757',

    sensors: [
      'ACOUSTIC — PRESSURE WAVE',
      'SEISMIC MEMS',
      'THERMAL IR BLOOM',
    ],

    evChainDef: [
      { icon: '💥', lbl: 'Pressure wave — all nodes'    },
      { icon: '📳', lbl: 'Seismic ground spike'         },
      { icon: '🔴', lbl: 'Thermal bloom'                },
      { icon: '📍', lbl: 'Blast epicentre GPS'          },
      { icon: '📁', lbl: 'Forensic evidence archive'    },
      { icon: '🔔', lbl: 'Alert dispatched'             },
    ],

    isMoving: false,

    s1: { icon: '🔥', name: 'Simultaneous Pressure Wave' },
    s2: { icon: '📳', name: 'Seismic + Thermal Confirm' },
    s3: { icon: '📍', name: 'Blast Epicentre Fix' },
    s4: { icon: '📁', name: 'Forensic Evidence Log' },
    s4l1: 'Blast Data',
    s4l2: 'Evidence Archive',

    genEv() {
      return {
        cls:      ['IED_DETONATION', 'MORTAR_IMPACT', 'VEHICLE_BOMB', 'GRENADE'][_ri(0, 4)],
        db:       _ri(138, 162),
        freq:     _ri(2, 25),
        conf:     (0.84 + Math.random() * 0.13).toFixed(2),
        lat:      (33.3  + Math.random() * 0.05).toFixed(5),
        lng:      (44.4  + Math.random() * 0.05).toFixed(5),
        cep:      _ri(4, 14),
        speed:    0,
        bearing:  0,
        seismicG: (0.8 + Math.random() * 1.8).toFixed(2),
        yield:    _ri(3, 80),
        nodesHit: 0,
        trackPts: 0,
      };
    },

    buildS1(ev) {
      return {
        sr: [
          { n: 'ALL NODES — SIMULTANEOUS', t: 'PRESSURE WAVE', c: 'var(--red)', v: (0.95 + Math.random() * 0.04).toFixed(2), p: 97, vc: 'var(--red)' },
        ],
        det: [
          ['Key signature',    'ALL nodes triggered at the SAME TIME',     'warn'],
          ['Peak SPL',         `${ev.db} dB SPL`                                 ],
          ['Frequency',        `${ev.freq}Hz — low-frequency blast`              ],
          ['Normal events',    'Only 1–3 nearby nodes trigger'                   ],
          ['This event',       'ALL nodes — SIMULTANEOUS = BLAST',          'warn'],
        ],
        log:
          `<span class="lt">${_ts()}</span>  ALL_NODES  SIMULTANEOUS_TRIGGER  spl=${ev.db}dB\n` +
          `<span class="lt">${_ts()}</span>  pattern=RADIAL_BLAST  NOT_single_point_trigger`,
      };
    },

    buildS2(ev) {
      return {
        sr: [
          { n: 'ACOUSTIC PRESSURE', t: 'ALL NODES',    c: 'var(--red)',   v: '0.97',          p: 97, vc: 'var(--red)'   },
          { n: 'SEISMIC MEMS',      t: 'GROUND SPIKE', c: 'var(--amber)', v: `${ev.seismicG}g`, p: Math.min(parseFloat(ev.seismicG) * 30, 95) },
          { n: 'THERMAL IR',        t: 'BLOOM',        c: 'var(--green)', v: '0.89',          p: 89, vc: 'var(--green)' },
        ],
        fus: [
          ['Seismic reading',  `${ev.seismicG}g — threshold: >0.5g`      ],
          ['Thermal bloom',    'Rapid temperature rise — CONFIRMED'       ],
          ['Classification',   ev.cls,                               'warn'],
          ['Estimated yield',  `~${ev.yield}kg TNT equivalent`            ],
          ['Fusion score',     ev.conf,                              'hi'  ],
          ['Note',             'No optical/RF needed — signature unmistakable'],
        ],
        log:
          `<span class="lt">${_ts()}</span>  SEISMIC  ${ev.seismicG}g  BLAST_CONFIRMED\n` +
          `<span class="lt">${_ts()}</span>  THERMAL_BLOOM  CONFIRMED\n` +
          `<span class="lt">${_ts()}</span>  CLASSIFY: <span class="le">${ev.cls}</span>  yield=~${ev.yield}kg`,
      };
    },

    buildS3(ev, ft) {
      return {
        nodes: [
          { n: 'WAVE ARRIVAL', t: 'T-DELTA ALL NODES', v: `±${ev.cep}m`, p: 96  },
          { n: 'SEISMIC ORIGIN', t: 'MEMS',            v: '1.000',        p: 100 },
          { n: 'THERMAL CENTROID', t: 'IR',            v: '0.91',         p: 91  },
        ],
        fix: [
          ['Algorithm',       'Multi-sensor time-of-arrival'                ],
          ['Blast epicentre', `${ev.lat}°N  ${ev.lng}°E`,              'hi'],
          ['CEP90 accuracy',  `±${ev.cep}m`                                ],
          ['Yield estimate',  `~${ev.yield}kg TNT equivalent`              ],
          ['Fix time',        ft + 's from detonation'                     ],
        ],
        log:
          `<span class="lt">${_ts()}</span>  BLAST_EPICENTRE  ${ev.lat},${ev.lng}  CEP90=±${ev.cep}m\n` +
          `<span class="lt">${_ts()}</span>  yield=~${ev.yield}kg  class=${ev.cls}`,
      };
    },

    buildS4(ev) {
      return {
        move: [
          ['Blast epicentre', `${ev.lat}°N  ${ev.lng}°E`,  'hi'  ],
          ['Event class',     ev.cls,                       'warn'],
          ['Yield',           `~${ev.yield}kg TNT`               ],
          ['Seismic reading', `${ev.seismicG}g`                  ],
          ['Movement',        'N/A — single detonation point'     ],
        ],
        trail: [
          ['Acoustic waveform', 'All nodes · 44.1kHz',       'ok'],
          ['Seismic waveform',  '1kHz sample rate',          'ok'],
          ['Thermal frame',     'LWIR snapshot',             'ok'],
          ['Case status',       'OPEN — forensic mode',      'ok'],
        ],
        log:
          `<span class="lt">${_ts()}</span>  FORENSIC_CASE_OPEN  class=${ev.cls}  yield=~${ev.yield}kg\n` +
          `<span class="lt">${_ts()}</span>  evidence_capture  ACO + SEISMIC + THERMAL`,
      };
    },

    s1sum: ev => `Simultaneous · all nodes · ${ev.db}dB`,
    s2sum: ev => `${ev.cls} · seismic ${ev.seismicG}g`,
    s3sum: ev => `Epicentre: ${ev.lat}°N ±${ev.cep}m`,
    s4sum: ev => `Forensic archive · ${ev.trackPts} entries`,
  },


  /* ── 3 — SUSPICIOUS VEHICLE ─────────────────────────────────── */
  {
    id: 'vehicle',
    icon: '🚗',
    name: '<em>Suspicious Vehicle</em>',
    short: 'VEHICLE SURVEILLANCE',
    desc: 'Continuous low-speed engine acoustic matched against thermal undercarriage heat signature and optical camera visual track. Trail builds slowly as vehicle moves through the node grid. Pattern-of-life analysis flags slow-mover surveillance behaviour.',
    accent: '#00d4f5',

    sensors: [
      'ENGINE ACOUSTIC',
      'THERMAL UNDERCARRIAGE',
      'OPTICAL CAMERA',
      'GPS TRAIL',
    ],

    evChainDef: [
      { icon: '🚗', lbl: 'Engine acoustic profile'   },
      { icon: '🌡', lbl: 'Thermal undercarriage heat' },
      { icon: '📷', lbl: 'Optical visual track'       },
      { icon: '📍', lbl: 'GPS position fix'           },
      { icon: '🗺', lbl: 'Movement trail'             },
      { icon: '🔔', lbl: 'Alert dispatched'           },
    ],

    isMoving: true,

    s1: { icon: '🚗', name: 'Engine Signature Detected' },
    s2: { icon: '🌡', name: 'Thermal + Optical Confirm' },
    s3: { icon: '📍', name: 'Position Fix' },
    s4: { icon: '🗺', name: 'Movement Trail' },
    s4l1: 'Vehicle Data',
    s4l2: 'Trail Log',

    genEv() {
      return {
        cls:       ['SUSPICIOUS_VEHICLE', 'SURVEILLANCE_VEH', 'UNMARKED_VAN', 'SLOW_MOVER'][_ri(0, 4)],
        freq:      _ri(80, 180),
        snr:       _ri(8, 18).toFixed(1),
        conf:      (0.65 + Math.random() * 0.2).toFixed(2),
        lat:       (33.3  + Math.random() * 0.05).toFixed(5),
        lng:       (44.4  + Math.random() * 0.05).toFixed(5),
        cep:       _ri(14, 28),
        speed:     _ri(5, 35),
        bearing:   _ri(0, 360),
        engType:   ['Diesel heavy', 'Petrol 4-cyl', 'Petrol V6', 'Diesel pickup'][_ri(0, 4)],
        thermTemp: _ri(55, 120),
        trackPts:  0,
        nodesHit:  0,
      };
    },

    buildS1(ev) {
      return {
        sr: [
          { n: 'ACOUSTIC ARRAY', t: 'ENGINE IDLE', c: 'var(--cyan)', v: (0.52 + Math.random() * 0.18).toFixed(2), p: 55, vc: 'var(--cyan)' },
        ],
        det: [
          ['Event type',   'Continuous engine acoustic',              'hi'],
          ['Frequency',    `${ev.freq}Hz — engine idle band`              ],
          ['SNR',          `+${ev.snr}dB above ambient`                  ],
          ['Speed est.',   `~${ev.speed}km/h — slow mover`               ],
          ['Status',       'ENGINE SIG — escalating to confirm',     'hi'],
        ],
        log:
          `<span class="lt">${_ts()}</span>  ACO  ENGINE_SIG  freq=${ev.freq}Hz  snr=+${ev.snr}dB  speed=~${ev.speed}km/h`,
      };
    },

    buildS2(ev) {
      return {
        sr: [
          { n: 'ENGINE ACOUSTIC',    t: 'CONTINUOUS',   c: 'var(--cyan)',  v: (0.74 + Math.random() * 0.12).toFixed(2), p: 76, vc: 'var(--cyan)'  },
          { n: 'THERMAL UNDERBODY',  t: 'LWIR',         c: 'var(--amber)', v: (0.70 + Math.random() * 0.12).toFixed(2), p: 72                     },
          { n: 'OPTICAL CAMERA',     t: 'VISUAL TRACK', c: 'var(--green)', v: (0.68 + Math.random() * 0.10).toFixed(2), p: 70, vc: 'var(--green)' },
        ],
        fus: [
          ['Engine type',       ev.engType                                          ],
          ['Thermal undercarriage', `${ev.thermTemp}°C — warm engine`              ],
          ['Optical',           'Vehicle silhouette · movement tracking'            ],
          ['Speed',             `~${ev.speed}km/h — SLOW MOVER flag`               ],
          ['Classification',    ev.cls,                                        'hi'],
          ['Fusion score',      ev.conf,                                       'hi'],
        ],
        log:
          `<span class="lt">${_ts()}</span>  ENGINE: <span class="lh">${ev.engType}</span>  thermal=${ev.thermTemp}°C\n` +
          `<span class="lt">${_ts()}</span>  OPTICAL: vehicle_silhouette  CONFIRMED\n` +
          `<span class="lt">${_ts()}</span>  CLASSIFY: <span class="lh">${ev.cls}</span>  conf=<span class="lo">${ev.conf}</span>`,
      };
    },

    buildS3(ev, ft) {
      return {
        nodes: [
          { n: 'NEAREST NODE', t: 'MASTER', v: '1.000', p: 83 },
          { n: 'NODE +1',      t: 'REF',    v: '0.912', p: 78 },
          { n: 'NODE +2',      t: 'REF',    v: '0.841', p: 71 },
        ],
        fix: [
          ['Algorithm',     'Acoustic TDOA + thermal centroid'           ],
          ['Position',      `${ev.lat}°N  ${ev.lng}°E`,             'hi'],
          ['CEP90',         `±${ev.cep}m`                               ],
          ['Heading',       `${ev.bearing}°T`                           ],
          ['Fix time',      ft + 's from first detection'               ],
        ],
        log:
          `<span class="lt">${_ts()}</span>  VEHICLE_FIX  ${ev.lat},${ev.lng}  CEP90=±${ev.cep}m\n` +
          `<span class="lt">${_ts()}</span>  heading=${ev.bearing}°T  speed=~${ev.speed}km/h`,
      };
    },

    buildS4(ev) {
      return {
        move: [
          ['Position',      `${ev.lat}°N  ${ev.lng}°E`,        'hi'],
          ['Heading',       `${ev.bearing}°T`                      ],
          ['Speed',         `~${ev.speed}km/h`                     ],
          ['Engine',        ev.engType                             ],
          ['Behaviour',     'SLOW_MOVER — surveillance flag'       ],
        ],
        trail: [
          ['Waypoints',     '—',                              'ok'],
          ['Avg speed',     `~${ev.speed}km/h`                    ],
          ['Pattern flag',  'SLOW_MOVER — surveillance risk'      ],
          ['Cloud archive', 'ACTIVE',                         'ok'],
        ],
        log:
          `<span class="lt">${_ts()}</span>  TRAIL_START  heading=${ev.bearing}°  ~${ev.speed}km/h\n` +
          `<span class="lt">${_ts()}</span>  pattern=SLOW_MOVER  surveillance_flag=TRUE`,
      };
    },

    s1sum: ev => `Engine ${ev.freq}Hz · ~${ev.speed}km/h`,
    s2sum: ev => `${ev.cls} · thermal ${ev.thermTemp}°C`,
    s3sum: ev => `${ev.lat}°N ${ev.lng}°E ±${ev.cep}m`,
    s4sum: ev => `${ev.trackPts} waypoints · ~${ev.speed}km/h`,
  },

];

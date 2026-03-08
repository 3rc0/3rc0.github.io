(function(){
"use strict";

const API      = "https://checklist-api.3rc0.workers.dev";
const STORE_KEY = "cl_session";
const THEME_KEY = "cl_theme";
const SW_PATH   = "/service-worker.js";

// ── SEC_META ─────────────────────────────────────────
const SEC_META = {
  A:{icon:"🖥️",color:"#38bdf8",hint:"Main devices that power the whole system"},
  B:{icon:"📡",color:"#a78bfa",hint:"Door and window sensors for intrusion alerts"},
  C:{icon:"💾",color:"#34d399",hint:"Drives that store camera footage"},
  D:{icon:"⚡",color:"#fb923c",hint:"Backup power — keeps everything on during outages"},
  E:{icon:"🗄️",color:"#60a5fa",hint:"Cabinet that holds all equipment"},
  F:{icon:"🔇",color:"#4ade80",hint:"Mods to make the system run silently"},
  G:{icon:"🌐",color:"#f472b6",hint:"Access cameras and doors from anywhere, free"},
  H:{icon:"🛡️",color:"#f87171",hint:"Built-in security features — all free"},
  I:{icon:"🚪",color:"#fbbf24",hint:"Configure door locks, access codes and alerts"},
  J:{icon:"📶",color:"#38bdf8",hint:"Connect your internet to the system"},
};

const DEFAULT_SECTIONS = [
  {id:"A",title:"Main Hardware",items:[
    {n:1,name:"Central Controller",model:"Ubiquiti UDM-SE",detail:"The brain of the whole system — manages cameras, door locks, WiFi and security all in one box.",price:"$599",warn:false},
    {n:2,name:"Panoramic Cameras ×3",model:"UniFi G6 180",detail:"Three 180° wide-angle cameras, 4K quality. AI detects people, vehicles and faces automatically.",price:"$897",warn:false},
    {n:3,name:"Front Door Camera",model:"UniFi G6 Entry",detail:"Doorbell camera with NFC tap-to-enter, Face ID and PIN keypad.",price:"~$200",warn:true},
    {n:4,name:"Front Door Access Hub",model:"UA-Hub-Door",detail:"Controller that activates the front door electric bolt.",price:"$199",warn:false},
    {n:5,name:"Backyard Door Hub",model:"UA-Hub-Door-Mini",detail:"Smaller hub for the backyard door. Phone unlock only.",price:"$99",warn:false},
    {n:6,name:"Garage Door Controller",model:"UA-Hub-Gate",detail:"Wires to your existing garage opener. Open/close from your phone.",price:"$279",warn:true},
    {n:7,name:"Front Door Electric Bolt",model:"UA-Lock-Electric",detail:"Fail-secure bolt. Physical key always works regardless of power.",price:"$79",warn:false},
    {n:8,name:"Backyard Electric Bolt",model:"UA-Lock-Electric",detail:"Same fail-secure bolt for the backyard door.",price:"$79",warn:false},
    {n:9,name:"WiFi Access Point",model:"UniFi U7 Pro",detail:"WiFi 7 — fastest available. Also Bluetooth bridge for all sensors.",price:"$199",warn:false},
  ]},
  {id:"B",title:"Security Sensors",items:[
    {n:10,name:"Door Sensors ×2",model:"UniFi UP-SENSE",detail:"Backyard and kitchen doors. Detects motion, opening, alarm sounds.",price:"$70",warn:false},
    {n:11,name:"Window Sensors ×10",model:"UniFi USL-Entry",detail:"All 10 windows. Simple open/close. 6-year battery — set and forget.",price:"$250",warn:false},
  ]},
  {id:"C",title:"Storage Drives",items:[
    {n:12,name:"Silent SSD Drives ×2",model:"WD Red SA500 2TB",detail:"Completely silent, no moving parts. Stores months of camera recordings.",price:"$160",warn:false},
  ]},
  {id:"D",title:"Backup Power (UPS)",items:[
    {n:13,name:"Uninterruptible Power Supply",model:"Tripp Lite SU2200RTXLCD2U",detail:"System stays on ~45 min if power goes out. Zero switchover time. Auto restarts.",price:"$450",warn:false},
  ]},
  {id:"E",title:"Rack Cabinet",items:[
    {n:14,name:"Soundproof Rack 9U",model:"XRackPro2",detail:"Holds all equipment in one quiet cabinet. Reduces noise by up to 80%.",price:"$300",warn:false},
    {n:15,name:"Shelf for Modem",model:"1U Vented Shelf",detail:"Mounts the XB8 modem flat with proper ventilation.",price:"$35",warn:false},
    {n:16,name:"Cable Organizer",model:"1U D-Ring",detail:"Keeps all cables neatly routed inside the cabinet.",price:"$20",warn:false},
  ]},
  {id:"F",title:"Noise Reduction",items:[
    {n:17,name:"Silent Fan Replacement",model:"Noctua NF-A6x25 PWM",detail:"Replaces the stock fan in the UDM-SE with a near-silent Noctua fan.",price:"$15",warn:false},
    {n:18,name:"Fan Speed Script",model:"SSH configuration",detail:"Reduces fan speed at idle via software. Near-inaudible combined with Noctua fan.",price:"FREE",warn:false},
  ]},
  {id:"G",title:"Remote Access Setup",items:[
    {n:19,name:"Zero Trust Account",model:"Cloudflare Zero Trust",detail:"Free. Access cameras remotely without exposing your home IP address.",price:"FREE",warn:false},
    {n:20,name:"Dynamic DNS Account",model:"DuckDNS",detail:"Gives your home a permanent address even when your IP changes.",price:"FREE",warn:false},
    {n:21,name:"Tunnel Software Install",model:"cloudflared on UDM-SE",detail:"Secure outbound tunnel — no ports opened on your router.",price:"FREE",warn:false},
    {n:22,name:"Remote App on Phone",model:"Cloudflare WARP",detail:"Connect securely to your home system from anywhere in the world.",price:"FREE",warn:false},
    {n:23,name:"Disable Modem WiFi",model:"Xfinity XB8 admin",detail:"Turn off XB8 WiFi. U7 Pro handles all WiFi instead.",price:"FREE",warn:false},
  ]},
  {id:"H",title:"Security Configuration",items:[
    {n:24,name:"Threat Detection IDS/IPS",model:"Suricata engine",detail:"Scans all internet traffic and blocks known threats. 25,000+ threat signatures.",price:"FREE",warn:false},
    {n:25,name:"Country Blocking",model:"GeoIP filter",detail:"Block all traffic from specific countries with one click.",price:"FREE",warn:false},
    {n:26,name:"Honeypot Trap",model:"UDM-SE built-in",detail:"Decoy target — any attacker who probes it gets instantly detected.",price:"FREE",warn:false},
    {n:27,name:"DNS Protection",model:"UDM-SE built-in",detail:"Blocks malicious and phishing sites before they load on any device.",price:"FREE",warn:false},
    {n:28,name:"Tor and Malicious IP Block",model:"UDM-SE built-in",detail:"Blocks known attack tools and anonymous proxy networks.",price:"FREE",warn:false},
    {n:29,name:"Camera Network VLAN 10",model:"192.168.10.0/24",detail:"Cameras on their own isolated network — cannot talk to your other devices.",price:"FREE",warn:false},
    {n:30,name:"Door Access Network VLAN 20",model:"192.168.20.0/24",detail:"All door locks and hubs isolated from cameras and main network.",price:"FREE",warn:false},
    {n:31,name:"Smart Home Network VLAN 30",model:"192.168.30.0/24",detail:"IoT devices isolated from computers and phones.",price:"FREE",warn:false},
    {n:32,name:"Disable Cloud Connection",model:"Ubiquiti local-only mode",detail:"Everything runs locally — nothing sent to external servers after setup.",price:"FREE",warn:false},
  ]},
  {id:"I",title:"Door & Alarm Setup",items:[
    {n:33,name:"Front Door Access Config",model:"UniFi Access app",detail:"Set up NFC cards, Face ID profiles and PIN codes for the front door.",price:"FREE",warn:false},
    {n:34,name:"Backyard Door Config",model:"UniFi Access app",detail:"Configure phone-based unlocking for the backyard door.",price:"FREE",warn:false},
    {n:35,name:"Garage Door Config",model:"UniFi Access app",detail:"Test open/close trigger, set schedules and review access logs.",price:"FREE",warn:false},
    {n:36,name:"Alarm Rules Setup",model:"UniFi Alarm Manager",detail:"Set what happens when motion, door openings or sounds are detected.",price:"FREE",warn:false},
    {n:37,name:"Pair Door Sensors",model:"Bluetooth via U7 Pro",detail:"Pair 2 UP-SENSE sensors through the U7 Pro Bluetooth radio.",price:"FREE",warn:false},
    {n:38,name:"Install Window Sensors",model:"USL-Entry ×10",detail:"Attach magnetic sensors to all 10 windows. No wiring needed.",price:"FREE",warn:false},
    {n:39,name:"Geofencing Setup",model:"UniFi Protect",detail:"Optional. System arms/disarms automatically based on your phone location.",price:"FREE",warn:false},
  ]},
  {id:"J",title:"Internet Connection",items:[
    {n:40,name:"Mount Modem in Rack",model:"Xfinity XB8",detail:"Place XB8 flat on vented shelf inside the rack with airflow clear.",price:"—",warn:false},
    {n:41,name:"Disable Modem WiFi",model:"Xfinity admin panel",detail:"Log into 10.0.0.1 and turn off the XB8 internal WiFi radio.",price:"—",warn:false},
    {n:42,name:"Connect Internet Cable",model:"Cat6 Ethernet",detail:"Cat6 from XB8 LAN port to UDM-SE WAN port. This is your internet feed.",price:"—",warn:false},
  ]},
];

// ── State ─────────────────────────────────────────────
// ── Session storage key ──────────────────────────────
const TOKEN_KEY    = "cl_token";
const ONBOARD_KEY  = "cl_onboarded";

function loadToken()  { try { return localStorage.getItem(TOKEN_KEY); } catch(e) { return null; } }
function saveToken(t) { try { localStorage.setItem(TOKEN_KEY, t); } catch(e) {} }
function clearToken() { try { localStorage.removeItem(TOKEN_KEY); } catch(e) {} }

// ── State v2 — multi-project aware ───────────────────
let state = {
  // View router
  view:          "loading",   // loading|auth|onboarding|dashboard|checklist|template-picker

  // Auth
  authTab:       "login",
  session:       null,        // { token, username }

  // Dashboard
  projects:      [],          // list of project summaries from /api/projects
  projectsLoaded: false,

  // Active project (checklist view)
  activeProject: null,        // full project object from /api/projects/:id
  sections:      DEFAULT_SECTIONS,
  checks:        {},

  // Template picker
  templates:     [],          // cached from /api/templates
  templatesLoaded: false,
  templateFilter: "All",
  templateSearch: "",

  // Onboarding
  onboardStep:   1,           // 1=category, 2=template, 3=name
  onboardCategory: null,
  onboardTemplate: null,
  onboardName:   "",

  // UI state (preserved from v5)
  collapsed:     {},
  expanded:      {},
  itemFiles:     {},          // { [itemUid]: [{id,name,size,type,uploaded}] }
  filesOpen:     {},          // { [itemUid]: true } — panels open
  editMode:      false,
  editItem:      null,
  editDraft:     {},
  addingSec:     null,
  newItem:       {name:"",model:"",detail:"",price:"",warn:false},
  newSecTitle:   "",
  saving:        false,
  logs:          [],
  showLog:       false,
  theme:         localStorage.getItem(THEME_KEY) || "dark",
  online:        navigator.onLine,

  // Confirm dialog
  confirmDialog: null,       // { message, onConfirm } or null
};

// Keyboard drag state
let kbDrag = { active:false, type:null, si:-1, ii:-1 };

// ── UID helpers ───────────────────────────────────────
function uid7() { return Math.random().toString(36).slice(2,9); }
function ensureUIDs(sections) {
  return sections.map(s => ({
    ...s,
    items: s.items.map(it => it.uid ? it : {...it, uid: uid7()})
  }));
}

// ── Session ───────────────────────────────────────────
// Legacy session helpers — kept for compatibility during transition
function loadSession() { try { return JSON.parse(sessionStorage.getItem(STORE_KEY)); } catch(e) { return null; } }
function saveSession(s) { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(s)); if(s&&s.token) saveToken(s.token); } catch(e) {} }
function clearSession() { try { sessionStorage.removeItem(STORE_KEY); clearToken(); } catch(e) {} }

// ── API ───────────────────────────────────────────────
async function apiFetch(path, opts) {
  const isFormData = opts && opts.isFormData;
  const headers = isFormData
    ? {}  // Let browser set Content-Type with boundary for multipart
    : {"Content-Type":"application/json", ...((opts&&opts.headers)||{})};
  const token = state.session && state.session.token;
  if (token) headers["X-Session-Token"] = token;
  const r = await fetch(API+path, { method:(opts&&opts.method)||"GET", headers, body: opts&&opts.body });
  return r.json();
}

// ── Toast ─────────────────────────────────────────────
let toastTimer;
function toast(msg, color) {
  let t = document.getElementById("cl-toast");
  if (!t) { t=document.createElement("div"); t.id="cl-toast"; t.className="cl-toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.color = color || "var(--green)";
  t.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.style.display="none"; }, 2500);
}

// ── h() helper ────────────────────────────────────────
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k,v])=>{
    if (k==="class") el.className=v;
    else if (k==="style") el.style.cssText=v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2).toLowerCase(),v);
    else el.setAttribute(k,v);
  });
  children.flat().forEach(c=>{
    if (c===null||c===undefined) return;
    el.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return el;
}

// ── Ring ──────────────────────────────────────────────
function ring(pct) {
  const size=64,stroke=5,r=(size-stroke*2)/2,circ=2*Math.PI*r;
  const color = pct===100?"#5dbb8a":"#c9a96e";
  const offset = circ*(1-pct/100);
  const wrap = h("div",{"class":"cl-ring"});
  wrap.innerHTML=`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(201,169,110,0.12)" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
      style="transition:stroke-dashoffset 0.6s ease"/>
  </svg><div class="cl-ring-label" style="color:${color}">${pct}%</div>`;
  return wrap;
}

// ── Auth ──────────────────────────────────────────────
function renderAuth() {
  const isLogin = state.authTab === "login";
  const wrap = h("div", { class: "cl-auth fade-up" });
  const card = h("div", { class: "cl-auth-card" });

  card.appendChild(h("div", { class: "cl-auth-logo" }, "🔐"));
  card.appendChild(h("div", { class: "cl-auth-title" }, "SecCheck"));
  card.appendChild(h("div", { class: "cl-auth-sub" },
    isLogin ? "Sign in to your account" : "Create your free account"
  ));

  card.appendChild(h("div", { class: "cl-tabs" },
    h("button", { class: "cl-tab" + (isLogin  ? " active" : ""),
      onClick: () => { state.authTab = "login"; render(); }
    }, "Sign In"),
    h("button", { class: "cl-tab" + (!isLogin ? " active" : ""),
      onClick: () => { state.authTab = "register"; render(); }
    }, "Create Account"),
  ));

  const errBox = h("div", { class: "cl-auth-error", id: "cl-auth-err" });
  card.appendChild(errBox);

  function showAuthErr(msg, fieldId) {
    const e = document.getElementById("cl-auth-err");
    if (e) { e.textContent = msg; e.className = "cl-auth-error show"; }
    if (fieldId) {
      const f = document.getElementById(fieldId);
      if (f) { f.classList.add("error"); f.focus(); }
    }
  }
  function clearAuthErr() {
    const e = document.getElementById("cl-auth-err");
    if (e) e.className = "cl-auth-error";
    document.querySelectorAll(".cl-input.error").forEach(f => f.classList.remove("error"));
  }

  // Username
  card.appendChild(h("div", { class: "cl-field" },
    h("label", { class: "cl-label" }, "Username"),
    h("input", {
      class: "cl-input", id: "cl-user", type: "text",
      placeholder: "your_username", autocomplete: "username", maxlength: "30",
      onInput: () => clearAuthErr()
    }),
    !isLogin ? h("div", { class: "cl-input-hint" }, "3–30 chars · letters, numbers, dash, underscore") : null,
  ));

  // Password + show/hide + caps lock
  const passWrap = h("div", { class: "cl-field cl-pass-field" });
  const passRow  = h("div", { class: "cl-pass-row" });
  const passInput = h("input", {
    class: "cl-input", id: "cl-pass", type: "password",
    placeholder: "••••••••",
    autocomplete: isLogin ? "current-password" : "new-password",
    maxlength: "100",
    onInput: (e) => { clearAuthErr(); if (!isLogin) updateStrength(e.target.value); },
    onKeyUp: (e) => {
      const w = document.getElementById("cl-caps-warn");
      if (w) w.style.display = e.getModifierState("CapsLock") ? "block" : "none";
    }
  });
  const toggleBtn = h("button", {
    class: "cl-pass-toggle", type: "button",
    onClick: () => {
      const input = document.getElementById("cl-pass");
      const hide = input.type === "password";
      input.type = hide ? "text" : "password";
      toggleBtn.textContent = hide ? "🙈" : "👁";
    }
  }, "👁");
  passRow.append(passInput, toggleBtn);
  passWrap.append(
    h("label", { class: "cl-label" }, "Password"),
    passRow,
    h("div", { class: "cl-caps-warn", id: "cl-caps-warn", style: "display:none" }, "⚠ Caps Lock is on")
  );
  card.appendChild(passWrap);

  // Strength meter (register only)
  if (!isLogin) {
    const sm = h("div", { class: "cl-strength-wrap" });
    sm.innerHTML = `<div class="cl-strength-bar"><div class="cl-strength-fill" id="cl-strength-fill"></div></div><div class="cl-strength-label" id="cl-strength-label"></div>`;
    card.appendChild(sm);
  }

  function updateStrength(pw) {
    const fill = document.getElementById("cl-strength-fill");
    const label = document.getElementById("cl-strength-label");
    if (!fill || !label) return;
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { label: "",          color: "transparent", width: "0%"   },
      { label: "Weak",      color: "#f87171",     width: "25%"  },
      { label: "Fair",      color: "#fb923c",     width: "50%"  },
      { label: "Good",      color: "#facc15",     width: "75%"  },
      { label: "Strong",    color: "#5dbb8a",     width: "90%"  },
      { label: "Excellent", color: "#5dbb8a",     width: "100%" },
    ];
    const lvl = levels[Math.min(score, 5)];
    fill.style.width = lvl.width; fill.style.background = lvl.color;
    label.textContent = lvl.label; label.style.color = lvl.color;
  }

  // Forgot password (login only)
  if (isLogin) {
    card.appendChild(h("div", { class: "cl-forgot" },
      h("button", { class: "cl-link-btn",
        onClick: () => {
          const e = document.getElementById("cl-auth-err");
          if (e) { e.textContent = "Password reset coming soon. Contact support if urgent."; e.className = "cl-auth-error show"; }
        }
      }, "Forgot password?")
    ));
  }

  // Submit
  const submitBtn = h("button", {
    class: "cl-btn cl-btn-primary cl-btn-full", id: "cl-auth-btn",
    onClick: async () => {
      const username = (document.getElementById("cl-user")?.value || "").trim().toLowerCase();
      const password = (document.getElementById("cl-pass")?.value || "");
      const btn = document.getElementById("cl-auth-btn");
      clearAuthErr();

      if (!username) { showAuthErr("Please enter your username.", "cl-user"); return; }
      if (!isLogin && !/^[a-z0-9_-]{3,30}$/.test(username)) {
        showAuthErr("Username must be 3–30 characters: letters, numbers, dash or underscore.", "cl-user"); return;
      }
      if (!password) { showAuthErr("Please enter your password.", "cl-pass"); return; }
      if (!isLogin && password.length < 8) {
        showAuthErr("Password must be at least 8 characters.", "cl-pass"); return;
      }

      btn.disabled = true; btn.textContent = isLogin ? "Signing in…" : "Creating account…";

      try {
        const d = await apiFetch(
          isLogin ? "/api/login" : "/api/register",
          { method: "POST", body: JSON.stringify({ username, password }) }
        );
        if (d.locked) {
          showAuthErr("Too many failed attempts. Please wait 15 minutes.");
          btn.disabled = false; btn.textContent = isLogin ? "Sign In" : "Create Account"; return;
        }
        if (!d.ok) {
          const msg = d.error || "Something went wrong.";
          const friendly = msg.includes("already") ? "That username is already taken. Try a different one."
            : (msg.includes("Invalid") || msg.includes("not found")) ? "Incorrect username or password. Please try again."
            : msg;
          showAuthErr(friendly);
          btn.disabled = false; btn.textContent = isLogin ? "Sign In" : "Create Account"; return;
        }
        if (isLogin) {
          state.session = { token: d.token, username: d.username };
          saveSession(state.session); saveToken(d.token);
          await loadProjects();
          const onboarded = localStorage.getItem(ONBOARD_KEY);
          if (state.projects.length === 0 && !onboarded) {
            await loadTemplates(); state.view = "onboarding";
          } else { state.view = "dashboard"; }
          render();
        } else {
          toast("✅ Account created! Please sign in.");
          state.authTab = "login"; render();
        }
      } catch(e) {
        showAuthErr("Could not connect to the server. Check your connection and try again.");
        btn.disabled = false; btn.textContent = isLogin ? "Sign In" : "Create Account";
      }
    }
  }, isLogin ? "Sign In" : "Create Account");
  card.appendChild(submitBtn);

  if (!isLogin) {
    card.appendChild(h("div", { class: "cl-privacy-note" },
      "🔒 Your data stays on your account. We never sell or share it."
    ));
  }

  wrap.appendChild(card);
  return wrap;
}


// ════════════════════════════════════════════════════
// STEP C — DASHBOARD VIEW
// ════════════════════════════════════════════════════

function timeAgo(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d/30)}mo ago`;
}

function daysUntilDelete(archivedAt) {
  if (!archivedAt) return null;
  const remaining = 30 - Math.floor((Date.now() - archivedAt) / 86400000);
  return Math.max(0, remaining);
}

function renderDashboard() {
  const wrap = h("div", { class: "cl-dashboard fade-up" });

  // ── Header bar
  const hdr = h("div", { class: "cl-dash-header" });
  const hdrLeft = h("div", { class: "cl-dash-header-left" },
    h("div", { class: "cl-dash-logo" }, "🔐"),
    h("div", { class: "cl-dash-title" }, "SecCheck")
  );
  const hdrRight = h("div", { class: "cl-dash-header-right" });

  const userBadge = h("div", { class: "cl-dash-user" },
    "👤 " + (state.session && state.session.username ? state.session.username : "")
  );

  const themeBtn = h("button", { class: "cl-btn cl-btn--ghost cl-btn--icon",
    title: "Toggle theme",
    onClick: () => { state.theme = state.theme==="dark"?"light":"dark"; localStorage.setItem(THEME_KEY, state.theme); render(); }
  }, state.theme === "dark" ? "☀️" : "🌙");

  const logoutBtn = h("button", { class: "cl-btn cl-btn--ghost cl-btn--sm",
    onClick: async () => {
      try { await apiFetch("/api/logout", { method: "POST" }); } catch(e) {}
      clearToken(); clearSession();
      state.session = null; state.projects = []; state.projectsLoaded = false;
      state.view = "auth"; render();
    }
  }, "Sign out");

  hdrRight.append(userBadge, themeBtn, logoutBtn);
  hdr.append(hdrLeft, hdrRight);

  // ── New project button
  const newBtn = h("button", { class: "cl-btn cl-btn--gold cl-btn--new-project",
    onClick: async () => {
      await loadTemplates();
      state.view = "template-picker";
      render();
    }
  }, "＋ New Project");

  // ── Active projects grid
  const active = state.projects.filter(p => !p.archived);
  const archived = state.projects.filter(p => p.archived);

  const section = h("div", { class: "cl-dash-section" });

  if (active.length === 0 && archived.length === 0) {
    // Empty state
    const empty = h("div", { class: "cl-dash-empty" });
    empty.innerHTML = `
      <div class="cl-dash-empty-icon">📋</div>
      <div class="cl-dash-empty-title">No projects yet</div>
      <div class="cl-dash-empty-sub">Create your first security checklist from a template or start blank.</div>`;
    const emptyBtn = h("button", { class: "cl-btn cl-btn--gold", style: "margin-top:24px",
      onClick: async () => { await loadTemplates(); state.view="template-picker"; render(); }
    }, "＋ Create First Project");
    empty.appendChild(emptyBtn);
    section.appendChild(empty);
  } else {
    const grid = h("div", { class: "cl-project-grid" });
    active.forEach(p => grid.appendChild(renderProjectCard(p, false)));
    section.appendChild(grid);
  }

  // ── Archived section
  if (archived.length > 0) {
    const archSection = h("div", { class: "cl-dash-archived" });
    const archToggle  = h("button", { class: "cl-arch-toggle",
      onClick: () => {
        const body = archSection.querySelector(".cl-arch-body");
        const isOpen = body.style.display !== "none";
        body.style.display = isOpen ? "none" : "grid";
        archToggle.querySelector(".cl-arch-arrow").textContent = isOpen ? "▶" : "▼";
      }
    });
    archToggle.innerHTML = `<span class="cl-arch-arrow">▶</span> Archived (${archived.length})`;
    const archBody = h("div", { class: "cl-arch-body cl-project-grid", style: "display:none" });
    archived.forEach(p => archBody.appendChild(renderProjectCard(p, true)));
    archSection.append(archToggle, archBody);
    section.appendChild(archSection);
  }

  wrap.append(hdr, newBtn, section);
  return wrap;
}

function renderProjectCard(p, isArchived) {
  const pct   = p.total > 0 ? Math.round((p.checked / p.total) * 100) : 0;
  const card  = h("div", { class: "cl-project-card" + (isArchived ? " cl-project-card--archived" : "") });

  // Progress ring
  const ringSize = 56, stroke = 4, r = (ringSize - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct === 100 ? "#5dbb8a" : isArchived ? "#666" : "#c9a96e";
  const offset = circ * (1 - pct / 100);
  const ringHtml = `
    <div class="cl-card-ring" aria-label="${pct}% complete">
      <svg width="${ringSize}" height="${ringSize}" viewBox="0 0 ${ringSize} ${ringSize}" style="transform:rotate(-90deg)">
        <circle cx="${ringSize/2}" cy="${ringSize/2}" r="${r}" fill="none" stroke="rgba(201,169,110,0.12)" stroke-width="${stroke}"/>
        <circle cx="${ringSize/2}" cy="${ringSize/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
          stroke-linecap="round" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"/>
      </svg>
      <div class="cl-card-ring-pct" style="color:${color}">${pct}%</div>
    </div>`;

  // Card body
  const icon  = p.icon || "📋";
  const daysLeft = isArchived ? daysUntilDelete(p.archivedAt) : null;

  card.innerHTML = `
    <div class="cl-card-top">
      <div class="cl-card-icon">${icon}</div>
      ${ringHtml}
    </div>
    <div class="cl-card-name">${escHtml(p.name)}</div>
    <div class="cl-card-meta">
      <span class="cl-card-progress">${p.checked || 0} of ${p.total || 0} done</span>
      <span class="cl-card-time">${timeAgo(p.updatedAt)}</span>
    </div>
    ${isArchived ? `<div class="cl-card-countdown ${daysLeft <= 7 ? "urgent" : ""}">Deletes in ${daysLeft}d</div>` : ""}
    ${!isArchived && p.due_date ? (() => {
      const due    = new Date(p.due_date + "T23:59:59Z");
      const diffMs = due - Date.now();
      const diffD  = Math.ceil(diffMs / 86400000);
      if (diffD < 0)  return `<div class="cl-card-due overdue">🔴 Overdue · ${p.due_date}</div>`;
      if (diffD <= 7) return `<div class="cl-card-due soon">⚠️ Due in ${diffD}d · ${p.due_date}</div>`;
      return `<div class="cl-card-due">📅 Due ${p.due_date}</div>`;
    })() : ""}
    <div class="cl-card-actions"></div>`;

  const actions = card.querySelector(".cl-card-actions");

  if (isArchived) {
    const restoreBtn = h("button", { class: "cl-btn cl-btn--ghost cl-btn--sm",
      onClick: async (e) => {
        e.stopPropagation();
        const d = await apiFetch(`/api/projects/${p.id}/restore`, { method: "POST" });
        if (d.ok) { await loadProjects(); render(); }
        else toast("Restore failed", "var(--warn)");
      }
    }, "↩ Restore");
    actions.appendChild(restoreBtn);
  } else {
    const menuBtn = h("button", { class: "cl-btn cl-btn--ghost cl-btn--icon cl-card-menu-btn",
      title: "Project options",
      onClick: (e) => { e.stopPropagation(); toggleCardMenu(p, card); }
    }, "⋯");
    actions.appendChild(menuBtn);
    // Open on card click (not on menu btn)
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".cl-card-actions")) openProject(p.id);
    });
    card.style.cursor = "pointer";
  }

  return card;
}

function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function toggleCardMenu(p, card) {
  // Remove existing menu if open
  const existing = document.querySelector(".cl-card-dropdown");
  if (existing) { existing.remove(); if (existing.dataset.pid === p.id) return; }

  const menu = h("div", { class: "cl-card-dropdown" });
  menu.dataset.pid = p.id;

  const renameBtn = h("button", { class: "cl-dropdown-item",
    onClick: async () => {
      menu.remove();
      const newName = window.prompt("Rename project:", p.name);
      if (!newName || newName.trim() === p.name) return;
      const d = await apiFetch(`/api/projects/${p.id}`, {
        method: "PATCH", body: JSON.stringify({ name: newName.trim() })
      });
      if (d.ok) { await loadProjects(); render(); toast("Renamed ✓"); }
      else toast("Rename failed", "var(--warn)");
    }
  }, "✏️ Rename");

  const archiveBtn = h("button", { class: "cl-dropdown-item cl-dropdown-item--danger",
    onClick: () => {
      menu.remove();
      confirm(
        `Archive <strong>${escHtml(p.name)}</strong>?<br><small>It will be deleted after 30 days unless restored.</small>`,
        async () => {
          const d = await apiFetch(`/api/projects/${p.id}/archive`, { method: "POST" });
          if (d.ok) { await loadProjects(); render(); toast("Project archived"); }
          else toast("Archive failed", "var(--warn)");
        },
        { confirmLabel: "Archive", danger: true }
      );
    }
  }, "🗄️ Archive");

  const dueDateBtn = h("button", { class: "cl-dropdown-item",
    onClick: async () => {
      menu.remove();
      const current = p.due_date || "";
      const val = window.prompt("Set due date (YYYY-MM-DD), or leave blank to clear:", current);
      if (val === null) return; // cancelled
      const due = val.trim();
      // Validate format
      if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
        toast("Invalid date format. Use YYYY-MM-DD", "var(--red)"); return;
      }
      const d = await apiFetch(`/api/projects/${p.id}/due-date`, {
        method: "PATCH", body: JSON.stringify({ due_date: due || null })
      });
      if (d.ok) { await loadProjects(); render(); toast(due ? `📅 Due date set: ${due}` : "Due date cleared"); }
      else toast("Failed to set due date", "var(--red)");
    }
  }, "📅 Set Due Date");

  menu.append(renameBtn, dueDateBtn, archiveBtn);

  // Position near the card
  const rect = card.getBoundingClientRect();
  menu.style.position = "fixed";
  menu.style.top  = (rect.bottom + 4) + "px";
  menu.style.left = (rect.right - 160) + "px";
  document.body.appendChild(menu);

  // Close on outside click
  setTimeout(() => {
    document.addEventListener("click", () => menu.remove(), { once: true });
  }, 0);
}

// ════════════════════════════════════════════════════
// STEP D — TEMPLATE PICKER MODAL
// ════════════════════════════════════════════════════

const TEMPLATE_CATEGORIES = ["All", "Starter", "Smart Home", "Home Automation", "Enterprise", "Cybersecurity"];

function renderTemplatePicker() {
  const overlay = h("div", { class: "cl-modal-overlay",
    onClick: (e) => { if (e.target === overlay) { state.view="dashboard"; render(); } }
  });
  const modal = h("div", { class: "cl-modal cl-template-picker" });

  const closeBtn = h("button", { class: "cl-modal-close",
    onClick: () => { state.view="dashboard"; render(); }
  }, "✕");

  const title = h("div", { class: "cl-modal-title" }, "Choose a Template");

  // Search
  const search = h("input", { class: "cl-input cl-template-search",
    type: "text", placeholder: "Search templates…",
    value: state.templateSearch || "",
    onInput: (e) => { state.templateSearch = e.target.value; renderTemplateGrid(grid); }
  });

  // Category tabs
  const tabs = h("div", { class: "cl-template-tabs" });
  TEMPLATE_CATEGORIES.forEach(cat => {
    const tab = h("button", {
      class: "cl-template-tab" + (state.templateFilter === cat ? " active" : ""),
      onClick: () => { state.templateFilter = cat; renderTemplateGrid(grid);
        tabs.querySelectorAll(".cl-template-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
      }
    }, cat);
    tabs.appendChild(tab);
  });

  const grid = h("div", { class: "cl-template-grid" });
  renderTemplateGrid(grid);

  modal.append(closeBtn, title, search, tabs, grid);
  overlay.appendChild(modal);
  return overlay;
}

function renderTemplateGrid(grid) {
  grid.innerHTML = "";
  const q = (state.templateSearch || "").toLowerCase();
  const cat = state.templateFilter || "All";
  const filtered = state.templates.filter(t => {
    const matchCat = cat === "All" || t.category === cat;
    const matchQ   = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="cl-template-empty">No templates match your search.</div>`;
    return;
  }

  filtered.forEach(t => {
    const card = h("div", { class: "cl-template-card",
      onClick: () => promptProjectName(t)
    });
    card.innerHTML = `
      <div class="cl-tcard-icon">${t.icon}</div>
      <div class="cl-tcard-name">${escHtml(t.name)}</div>
      <div class="cl-tcard-meta">${t.category} · ${t.items} items</div>`;
    grid.appendChild(card);
  });
}

function promptProjectName(template) {
  const modal = document.querySelector(".cl-template-picker");
  if (!modal) return;

  modal.innerHTML = "";

  const back = h("button", { class: "cl-btn cl-btn--ghost cl-btn--sm",
    onClick: () => { state.view="template-picker"; render(); }
  }, "← Back");

  const title = h("div", { class: "cl-modal-title" },
    template.icon + " " + template.name
  );
  const sub = h("div", { class: "cl-modal-sub" },
    `${template.items} items · ${template.category}`
  );
  const label = h("label", { class: "cl-label", style: "display:block;margin:24px 0 8px" }, "Project name");
  const input = h("input", {
    class: "cl-input",
    type: "text",
    value: template.name,
    maxlength: "80",
    placeholder: "My project name…"
  });

  const createBtn = h("button", { class: "cl-btn cl-btn--gold cl-btn--full", style: "margin-top:16px",
    onClick: async () => {
      const name = input.value.trim();
      if (!name) { input.focus(); return; }
      createBtn.disabled = true;
      createBtn.textContent = "Creating…";
      await createProject(name, template.key);
    }
  }, "Create Project");

  modal.append(back, title, sub, label, input, createBtn);
  setTimeout(() => { input.select(); input.focus(); }, 50);
}

// ════════════════════════════════════════════════════
// STEP E — ONBOARDING WIZARD
// ════════════════════════════════════════════════════

const ONBOARD_CATEGORIES = [
  { key: "Smart Home",     icon: "🏠", label: "Smart Home" },
  { key: "Enterprise",     icon: "🏢", label: "Enterprise Network" },
  { key: "Cybersecurity",  icon: "🔐", label: "Cybersecurity" },
  { key: "Home Automation",icon: "⚙️",  label: "Home Automation" },
  { key: "blank",          icon: "⬜", label: "Start Blank" },
];

function renderOnboarding() {
  const wrap = h("div", { class: "cl-onboarding fade-up" });
  const card = h("div", { class: "cl-onboarding-card" });

  // Progress dots
  const dots = h("div", { class: "cl-onboard-dots" });
  [1,2,3].forEach(i => {
    dots.appendChild(h("div", { class: "cl-onboard-dot" + (state.onboardStep === i ? " active" : (state.onboardStep > i ? " done" : "")) }));
  });

  const logo  = h("div", { class: "cl-auth-logo" }, "🔐");
  const title = h("div", { class: "cl-onboard-title" });
  const body  = h("div", { class: "cl-onboard-body" });

  if (state.onboardStep === 1) {
    title.textContent = "What are you setting up?";
    const grid = h("div", { class: "cl-onboard-cat-grid" });
    ONBOARD_CATEGORIES.forEach(cat => {
      const btn = h("button", {
        class: "cl-onboard-cat-btn" + (state.onboardCategory === cat.key ? " selected" : ""),
        onClick: () => {
          state.onboardCategory = cat.key;
          if (cat.key === "blank") {
            // Skip template step
            state.onboardStep = 3;
            state.onboardTemplate = { key: "blank", name: "My Project" };
            state.onboardName = "My Project";
          } else {
            state.onboardStep = 2;
          }
          render();
        }
      });
      btn.innerHTML = `<span class="cl-onboard-cat-icon">${cat.icon}</span><span>${cat.label}</span>`;
      grid.appendChild(btn);
    });
    const skip = h("button", { class: "cl-onboard-skip",
      onClick: () => { localStorage.setItem(ONBOARD_KEY, "1"); state.view="dashboard"; render(); }
    }, "Skip for now →");
    body.append(grid, skip);

  } else if (state.onboardStep === 2) {
    title.textContent = "Choose a template";
    const filtered = state.templates.filter(t => t.category === state.onboardCategory);
    const grid = h("div", { class: "cl-template-grid cl-template-grid--onboard" });
    filtered.forEach(t => {
      const card2 = h("div", {
        class: "cl-template-card" + (state.onboardTemplate && state.onboardTemplate.key === t.key ? " selected" : ""),
        onClick: () => {
          state.onboardTemplate = t;
          state.onboardName = t.name;
          state.onboardStep = 3;
          render();
        }
      });
      card2.innerHTML = `
        <div class="cl-tcard-icon">${t.icon}</div>
        <div class="cl-tcard-name">${escHtml(t.name)}</div>
        <div class="cl-tcard-meta">${t.items} items</div>`;
      grid.appendChild(card2);
    });
    const back = h("button", { class: "cl-btn cl-btn--ghost cl-btn--sm", style: "margin-top:16px",
      onClick: () => { state.onboardStep = 1; render(); }
    }, "← Back");
    body.append(grid, back);

  } else if (state.onboardStep === 3) {
    title.textContent = "Name your project";
    const input = h("input", {
      class: "cl-input",
      type: "text",
      value: state.onboardName || "",
      maxlength: "80",
      placeholder: "My project name…",
      onInput: (e) => { state.onboardName = e.target.value; }
    });
    const createBtn = h("button", { class: "cl-btn cl-btn--gold cl-btn--full", style: "margin-top:16px",
      onClick: async () => {
        const name = (state.onboardName || "").trim();
        if (!name) { input.focus(); return; }
        createBtn.disabled = true;
        createBtn.textContent = "Creating…";
        await createProject(name, state.onboardTemplate ? state.onboardTemplate.key : "blank");
      }
    }, "Create Project →");
    const back = h("button", { class: "cl-btn cl-btn--ghost cl-btn--sm", style: "margin-top:12px",
      onClick: () => { state.onboardStep = state.onboardCategory === "blank" ? 1 : 2; render(); }
    }, "← Back");
    body.append(input, createBtn, back);
    setTimeout(() => { const inp = wrap.querySelector(".cl-input"); if(inp){inp.select();inp.focus();} }, 50);
  }

  card.append(dots, logo, title, body);
  wrap.appendChild(card);
  return wrap;
}

// ── Load / Save ───────────────────────────────────────
async function loadUserData() {
  try {
    const d=await apiFetch("/api/data");
    if(d.ok!==false){
      state.sections = ensureUIDs(d.sections||DEFAULT_SECTIONS);
      state.checks   = d.checks||{};
    }
  } catch(e){}
}
async function saveData(key,value,logEntry) {
  state.saving=true; renderSaving();
  try {
    if (state.activeProject) {
      if (key === "checks") {
        // checks are saved per-item via checkItem() — saveData("checks") is a no-op here
        // bulk update only used as fallback via /projects/:id/save with key=checks
        await apiFetch("/api/projects/"+state.activeProject.id+"/save",{
          method:"POST",body:JSON.stringify({key:"checks",value,entry:logEntry})
        });
      } else if (key === "sections" && Array.isArray(value)) {
        // Embed current checked state into items before saving
        const payload = value.map(sec => ({
          ...sec,
          items: (sec.items||[]).map(it => ({
            ...it,
            checked: !!state.checks[it.n]
          }))
        }));
        await apiFetch("/api/projects/"+state.activeProject.id+"/save",{
          method:"POST",body:JSON.stringify({sections:payload,entry:logEntry})
        });
      }
    } else {
      // Legacy fallback (old single-project API)
      await apiFetch("/api/save",{method:"POST",body:JSON.stringify({key,value,entry:logEntry})});
    }
  } catch(e){ console.error("saveData:", e); }
  state.saving=false; renderSaving();
}

// ── Check item (new per-item API) ─────────────────────
async function checkItem(itemId, checked, logEntry) {
  state.saving=true; renderSaving();
  try {
    if (state.activeProject) {
      await apiFetch("/api/items/"+itemId+"/check",{
        method:"POST",body:JSON.stringify({checked,entry:logEntry})
      });
    } else {
      // Legacy path via saveData
      await saveData("checks", state.checks, logEntry);
      state.saving=false; renderSaving();
      return;
    }
  } catch(e){ console.error("checkItem:", e); }
  state.saving=false; renderSaving();
}
function renderSaving() {
  const el=document.getElementById("cl-saving");
  if(el) el.style.display=state.saving?"block":"none";
}

// ── Progress ──────────────────────────────────────────
function calcProgress() {
  const all=state.sections.flatMap(s=>s.items);
  const done=all.filter(i=>state.checks[i.n]);
  const pct=all.length?Math.round(done.length/all.length*100):0;
  return {total:all.length,done:done.length,pct};
}
function secProg(sec) {
  const t=sec.items.length,d=sec.items.filter(i=>state.checks[i.n]).length;
  return {t,d,pct:t?Math.round(d/t*100):0};
}
function renumber(secs) {
  let n=1; return secs.map(s=>({...s,items:s.items.map(i=>({...i,n:n++}))}));
}

// ── Tag / remap checks (travels with item object) ─────
function tagChecks() {
  state.sections.forEach(s=>s.items.forEach(it=>{it._chk=!!state.checks[it.n];}));
}
function rebuildChecks(numbered) {
  const c={};
  numbered.forEach(s=>s.items.forEach(it=>{if(it._chk)c[it.n]=true;delete it._chk;}));
  return c;
}

// ── Theme ─────────────────────────────────────────────
function applyTheme() {
  const app=document.getElementById("cl-app");
  if(app) app.setAttribute("data-theme",state.theme);
}

// ── Header ────────────────────────────────────────────

// ════════════════════════════════════════════════════════════
// PDF EXPORT — jsPDF · Professional handover document
// ════════════════════════════════════════════════════════════
async function exportPDF() {
  // Dynamically load jsPDF from CDN
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W    = 210; // A4 width mm
  const ML   = 14;  // margin left
  const MR   = 14;  // margin right
  const TW   = W - ML - MR; // text width
  const now  = new Date();

  function fmtDate(ts) {
    if (!ts) return "—";
    const d = new Date(Number(ts));
    return d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
      + "  " + d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
  }

  function fmtShort(ts) {
    if (!ts) return "";
    const d = new Date(Number(ts));
    return d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
  }

  // ── Colours
  const GOLD   = [201, 169, 110];
  const GREEN  = [93,  187, 138];
  const RED    = [248, 113, 113];
  const DARK   = [26,  22,  20];
  const MID    = [92,  80,  72];
  const LIGHT  = [245, 240, 235];
  const WHITE  = [255, 255, 255];
  const BORDER = [220, 210, 200];

  let y = 0;

  function newPage() {
    doc.addPage();
    y = 16;
    // Page footer
    doc.setFontSize(8); doc.setTextColor(...MID);
    doc.text(`SecCheck Export · ${now.toLocaleDateString("en-GB")} · Page ${doc.getNumberOfPages()}`,
      W / 2, 290, { align: "center" });
  }

  function checkY(needed = 10) {
    if (y + needed > 278) newPage();
  }

  // ══════════════════════════════════════════════
  // COVER PAGE
  // ══════════════════════════════════════════════
  // Dark header band
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 60, "F");

  // Gold accent line
  doc.setFillColor(...GOLD);
  doc.rect(0, 60, W, 1.5, "F");

  // Logo area
  doc.setFontSize(28); doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.text("🔐  SecCheck", ML, 28);

  doc.setFontSize(11); doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "normal");
  doc.text("Security Assessment Report", ML, 38);

  // Project name
  doc.setFontSize(18); doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  y = 78;
  const projName = state.activeProject?.name || "Checklist";
  const nameLines = doc.splitTextToSize(projName, TW);
  doc.text(nameLines, ML, y);
  y += nameLines.length * 9 + 4;

  // Meta table
  const { total, done, pct } = calcProgress();
  const meta = [
    ["Generated",  now.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })
                   + "  " + now.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })],
    ["Prepared by", state.session?.username || "—"],
    ["Template",    state.activeProject?.template || "—"],
    ["Total tasks", String(total)],
    ["Completed",   `${done} of ${total} (${pct}%)`],
    ["Status",      pct === 100 ? "✅ Complete" : pct >= 50 ? "⚠️ In Progress" : "🔴 Needs Attention"],
  ];

  doc.setFontSize(10);
  meta.forEach(([label, value]) => {
    checkY(8);
    doc.setFont("helvetica", "bold"); doc.setTextColor(...MID);
    doc.text(label, ML, y);
    doc.setFont("helvetica", "normal"); doc.setTextColor(...DARK);
    doc.text(String(value), ML + 36, y);
    y += 7;
  });

  // Progress bar
  y += 4;
  checkY(14);
  doc.setFillColor(...BORDER); doc.roundedRect(ML, y, TW, 5, 2, 2, "F");
  const fillW = Math.max(4, (pct / 100) * TW);
  const barCol = pct === 100 ? GREEN : pct >= 50 ? GOLD : RED;
  doc.setFillColor(...barCol); doc.roundedRect(ML, y, fillW, 5, 2, 2, "F");
  y += 9;
  doc.setFontSize(9); doc.setTextColor(...MID);
  doc.text(`${pct}% complete`, ML, y);
  y += 12;

  // ── Category summary table on cover
  checkY(12);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
  doc.text("Summary by Section", ML, y); y += 6;
  doc.setFillColor(...LIGHT); doc.rect(ML, y, TW, 7, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...MID);
  doc.text("Section", ML + 2, y + 4.5);
  doc.text("Tasks", ML + TW - 40, y + 4.5);
  doc.text("Done", ML + TW - 24, y + 4.5);
  doc.text("Updated", ML + TW - 12, y + 4.5, { align: "right" });
  y += 7;

  state.sections.forEach((sec, si) => {
    checkY(7);
    const secTotal = sec.items.length;
    const secDone  = sec.items.filter(it => state.checks[it.n]).length;
    // Most recent update in this section
    const latestTs = sec.items.reduce((max, it) => {
      const t = it.checked_at ? Number(it.checked_at) : 0;
      return t > max ? t : max;
    }, 0);

    const rowBg = si % 2 === 0 ? WHITE : [250, 247, 244];
    doc.setFillColor(...rowBg); doc.rect(ML, y, TW, 6.5, "F");
    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...DARK);

    const secLabel = (sec.icon ? sec.icon + "  " : "") + sec.title;
    const secLines = doc.splitTextToSize(secLabel, TW - 50);
    doc.text(secLines[0], ML + 2, y + 4.2);
    doc.text(String(secTotal), ML + TW - 40, y + 4.2);
    const doneCol = secDone === secTotal ? GREEN : secDone > 0 ? GOLD : RED;
    doc.setTextColor(...doneCol);
    doc.text(String(secDone), ML + TW - 24, y + 4.2);
    doc.setTextColor(...MID);
    doc.setFontSize(7.5);
    doc.text(latestTs ? fmtShort(latestTs) : "—", ML + TW - 12, y + 4.2, { align: "right" });
    y += 6.5;
  });

  // ══════════════════════════════════════════════
  // DETAIL PAGES — one section per block
  // ══════════════════════════════════════════════
  state.sections.forEach((sec) => {
    newPage();

    // Section header band
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, 18, "F");
    doc.setFillColor(...GOLD);
    doc.rect(0, 18, W, 1, "F");

    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(...GOLD);
    const secHead = (sec.icon ? sec.icon + "  " : "") + sec.title;
    doc.text(secHead, ML, 12);

    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...WHITE);
    const secDone  = sec.items.filter(it => state.checks[it.n]).length;
    doc.text(`${secDone} / ${sec.items.length} tasks completed`, W - MR, 12, { align: "right" });
    y = 26;

    if (sec.hint) {
      doc.setFontSize(8.5); doc.setTextColor(...MID); doc.setFont("helvetica", "italic");
      doc.text(sec.hint, ML, y); y += 7;
    }

    // Column headers
    doc.setFillColor(...LIGHT); doc.rect(ML, y, TW, 6.5, "F");
    doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...MID);
    doc.text("#",   ML + 2,         y + 4.2);
    doc.text("Task",ML + 10,        y + 4.2);
    doc.text("Status",    W - MR - 54, y + 4.2);
    doc.text("Completed", W - MR - 36, y + 4.2);
    doc.text("By",        W - MR - 10, y + 4.2, { align: "right" });
    y += 7;

    sec.items.forEach((item, idx) => {
      const isDone   = !!state.checks[item.n];
      const rowH     = item.detail ? 11 : 7.5;
      checkY(rowH + 2);

      const rowBg = idx % 2 === 0 ? WHITE : [250, 247, 244];
      doc.setFillColor(...rowBg); doc.rect(ML, y, TW, rowH, "F");

      // Checkbox indicator
      doc.setFillColor(...(isDone ? GREEN : BORDER));
      doc.roundedRect(ML + 1, y + 1.5, 4, 4, 1, 1, "F");
      if (isDone) {
        doc.setTextColor(...WHITE); doc.setFontSize(6); doc.setFont("helvetica", "bold");
        doc.text("✓", ML + 1.8, y + 4.8);
      }

      // Item number
      doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...MID);
      doc.text(String(item.n), ML + 7, y + 4.2);

      // Item name
      doc.setTextColor(...DARK); doc.setFont("helvetica", item.warn ? "bolditalic" : "normal");
      const nameLines = doc.splitTextToSize(item.name, TW - 65);
      doc.text(nameLines[0], ML + 12, y + 4.2);

      // Warn badge
      if (item.warn) {
        doc.setFontSize(6.5); doc.setTextColor(...RED);
        doc.text("⚠ Critical", ML + 12, y + 8.5);
      }

      // Detail line
      if (item.detail) {
        doc.setFontSize(7); doc.setFont("helvetica", "italic"); doc.setTextColor(...MID);
        const detLines = doc.splitTextToSize(item.detail, TW - 65);
        doc.text(detLines[0], ML + 12, y + (item.warn ? 8.5 : 8.2));
      }

      // Status
      doc.setFontSize(7.5); doc.setFont("helvetica", "bold");
      doc.setTextColor(...(isDone ? GREEN : RED));
      doc.text(isDone ? "Done" : "Pending", W - MR - 54, y + 4.2);

      // Timestamp
      doc.setFont("helvetica", "normal"); doc.setTextColor(...MID); doc.setFontSize(7);
      doc.text(isDone && item.checked_at ? fmtDate(item.checked_at) : "—", W - MR - 36, y + 4.2);

      // Checked by
      doc.setFontSize(7);
      doc.text(isDone && item.checked_by ? item.checked_by : "—", W - MR - 10, y + 4.2, { align: "right" });

      y += rowH;
    });
  });

  // ══════════════════════════════════════════════
  // FINAL PAGE — Sign-off
  // ══════════════════════════════════════════════
  newPage();
  doc.setFillColor(...DARK); doc.rect(0, 0, W, 18, "F");
  doc.setFillColor(...GOLD); doc.rect(0, 18, W, 1, "F");
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(...GOLD);
  doc.text("Sign-off & Certification", ML, 12);
  y = 30;

  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(...DARK);
  doc.text("This document certifies the completion status of the above security assessment.", ML, y); y += 8;
  doc.text(`Project:    ${state.activeProject?.name || "—"}`, ML, y); y += 7;
  doc.text(`Prepared by: ${state.session?.username || "—"}`, ML, y); y += 7;
  doc.text(`Date:        ${now.toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}`, ML, y); y += 7;
  doc.text(`Completion:  ${pct}% (${done} of ${total} tasks)`, ML, y); y += 7;
  if (state.activeProject?.due_date) {
    const due    = new Date(state.activeProject.due_date + "T23:59:59Z");
    const diffD  = Math.ceil((due - now) / 86400000);
    const status = diffD < 0 ? " ⚠ OVERDUE" : diffD === 0 ? " (today)" : ` (in ${diffD} days)`;
    doc.text(`Due date:    ${state.activeProject.due_date}${status}`, ML, y); y += 7;
  }
  y += 13;

  // Signature lines
  const sigY = y + 20;
  doc.setDrawColor(...BORDER); doc.setLineWidth(0.4);
  doc.line(ML,      sigY, ML + 70, sigY);
  doc.line(ML + 90, sigY, ML + 160, sigY);
  doc.setFontSize(8); doc.setTextColor(...MID);
  doc.text("Signature", ML, sigY + 5);
  doc.text("Date", ML + 90, sigY + 5);

  // Footer on all pages — already added via newPage(), add for page 1
  doc.setPage(1);
  doc.setFontSize(8); doc.setTextColor(...MID);
  doc.text(`SecCheck Export · ${now.toLocaleDateString("en-GB")} · Page 1`, W / 2, 290, { align: "center" });

  // Save
  const safeName = (state.activeProject?.name || "checklist").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`seccheck_${safeName}_${now.toISOString().slice(0,10)}.pdf`);
  toast("📄 PDF exported!");
}

function renderHeader() {
  const {total,done,pct}=calcProgress();
  const wrap=h("div",{"class":"cl-header fade-up"});

  // Offline banner
  if(!state.online){
    wrap.appendChild(h("div",{"class":"cl-offline-banner"},"● Offline — changes will sync when reconnected"));
  }

  // Breadcrumb — back to dashboard
  const breadcrumb = h("div", { class: "cl-breadcrumb" },
    h("button", { class: "cl-breadcrumb-back",
      onClick: () => goToDashboard()
    }, "← All Projects"),
    h("span", { class: "cl-breadcrumb-sep" }, " / "),
    h("span", { class: "cl-breadcrumb-current" },
      state.activeProject ? state.activeProject.name : "Checklist"
    )
  );

  wrap.appendChild(breadcrumb);

  const top=h("div",{"class":"cl-header-top"},
    ring(pct),
    h("div",{"class":"cl-title-block"},
      h("h2",{}, state.activeProject ? state.activeProject.name : "Home Security Checklist"),
      h("div",{"class":"cl-user-badge"},"👤 "+(state.session&&state.session.username||"")),
      h("div",{"class":"cl-prog-text"},`${done} of ${total} tasks completed`),
      h("div",{"class":"cl-progress-bar"},h("div",{"class":"cl-progress-fill","style":`width:${pct}%`}))
    )
  );

  const editBtn=h("button",{"class":"cl-btn "+(state.editMode?"cl-btn-warn":"cl-btn-ghost"),
    onClick:()=>{state.editMode=!state.editMode;state.editItem=null;state.addingSec=null;render();}},
    state.editMode?"✓ Done Editing":"✏️ Edit");

  const logBtn=h("button",{"class":"cl-btn cl-btn-ghost",
    onClick:async()=>{
      if(!state.showLog){const d=await apiFetch("/api/log");state.logs=d.logs||[];}
      state.showLog=!state.showLog; render();
    }},state.showLog?"✕ Close Log":"📋 Activity Log");

  const printBtn=h("button",{"class":"cl-btn cl-btn-success",
    onClick: () => exportPDF()},
    "📄 Export PDF");

  const themeBtn=h("button",{"class":"cl-theme-toggle",
    onClick:()=>{
      state.theme=state.theme==="dark"?"light":"dark";
      localStorage.setItem(THEME_KEY,state.theme);
      applyTheme();
      themeBtn.textContent=state.theme==="dark"?"☀ Light Mode":"◑ Dark Mode";
    }},state.theme==="dark"?"☀ Light Mode":"◑ Dark Mode");

  const logoutBtn=h("button",{"class":"cl-btn cl-btn-danger",
    onClick:async()=>{
      await apiFetch("/api/logout",{method:"POST"});
      clearSession();
      state.session=null;state.checks={};state.sections=DEFAULT_SECTIONS;
      state.editMode=false;state.showLog=false;state.view="auth";
      render();
    }},"Sign Out");

  const actions=h("div",{"class":"cl-header-actions"},editBtn,logBtn,printBtn,themeBtn,logoutBtn);
  const saving =h("div",{"class":"cl-saving","id":"cl-saving","style":"display:none"},"● syncing…");
  wrap.append(top,actions,saving);
  return wrap;
}

// ── Log panel ─────────────────────────────────────────
function renderLog() {
  const panel=h("div",{"class":"cl-log-panel fade-up"});
  const hdr=h("div",{"class":"cl-log-header"},
    h("div",{"class":"cl-log-title"},"📋 Activity Log"),
    h("div",{"class":"cl-saving","style":"font-size:11px;color:var(--text3)"},`${state.logs.length} entries`)
  );
  panel.appendChild(hdr);
  if(!state.logs.length){panel.appendChild(h("div",{"class":"cl-log-empty"},"No activity yet."));return panel;}
  const aClass={check:"log-check",uncheck:"log-uncheck",login:"log-login",register:"log-register",logout:"log-login","add-item":"log-edit","del-item":"log-edit","edit-item":"log-edit","add-section":"log-edit","del-section":"log-edit",reorder:"log-edit"};
  state.logs.slice(0,50).forEach(entry=>{
    const d=new Date(entry.ts);
    const ts=d.toLocaleDateString()+" "+d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const cls=aClass[entry.action]||"log-edit";
    panel.appendChild(h("div",{"class":"cl-log-entry"},
      h("div",{"class":"cl-log-time"},ts),
      h("div",{"class":"cl-log-action "+cls},entry.action),
      h("div",{"class":"cl-log-detail"},entry.detail)
    ));
  });
  return panel;
}

// ── Make drag handle ──────────────────────────────────
function makeDragHandle(type, si, ii) {
  const handle = h("div", {"class":"cl-drag-handle","aria-label":"Drag to reorder","tabindex":"0","role":"button"});
  handle.dataset.dndType = type;
  handle.dataset.si = si;
  if (ii !== undefined) handle.dataset.ii = ii;
  handle.innerHTML = `<svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
    <circle cx="2.5" cy="2.5" r="1.5"/><circle cx="7.5" cy="2.5" r="1.5"/>
    <circle cx="2.5" cy="8"   r="1.5"/><circle cx="7.5" cy="8"   r="1.5"/>
    <circle cx="2.5" cy="13.5" r="1.5"/><circle cx="7.5" cy="13.5" r="1.5"/>
  </svg>`;
  // Keyboard handler
  handle.addEventListener("keydown", e => dndKeyboard(e, type, si, ii));
  return handle;
}

// ── Mobile move buttons ───────────────────────────────
function makeMoveButtons(type, si, ii) {
  const wrap = h("div", {"class":"cl-move-btns"});
  const up = h("button", {"class":"cl-move-btn","aria-label":"Move up",
    onClick: e => { e.stopPropagation(); mobileMoveUp(type, si, ii); }}, "↑");
  const dn = h("button", {"class":"cl-move-btn","aria-label":"Move down",
    onClick: e => { e.stopPropagation(); mobileMoveDown(type, si, ii); }}, "↓");
  wrap.append(up, dn);
  return wrap;
}

function mobileMoveUp(type, si, ii) {
  if (type === "section") {
    if (si === 0) return;
    applyReorder(type, si, ii, si - 1, -1);
  } else {
    if (ii === 0) return;
    applyReorder(type, si, ii, si, ii - 1);
  }
}
function mobileMoveDown(type, si, ii) {
  if (type === "section") {
    if (si >= state.sections.length - 1) return;
    applyReorder(type, si, ii, si + 1, -1);
  } else {
    if (ii >= state.sections[si].items.length - 1) return;
    applyReorder(type, si, ii, si, ii + 1);
  }
}

// ── Core reorder logic ────────────────────────────────
function applyReorder(type, srcSi, srcIi, dstSi, dstIi) {
  tagChecks();
  let newSections;

  if (type === "item") {
    const items = [...state.sections[srcSi].items];
    const [moved] = items.splice(srcIi, 1);
    items.splice(dstIi, 0, moved);
    newSections = state.sections.map((s, i) => i !== srcSi ? s : {...s, items});
  } else {
    const secs = [...state.sections];
    const [moved] = secs.splice(srcSi, 1);
    secs.splice(dstSi, 0, moved);
    newSections = secs;
  }

  const numbered = renumber(newSections);
  state.checks = rebuildChecks(numbered);
  state.sections = numbered;

  const doRender = () => render();
  if (document.startViewTransition) {
    document.startViewTransition(doRender);
  } else { doRender(); }

  const label = type === "section" ? `Reordered sections` : `Reordered items in ${state.sections[srcSi]?.title || ""}`;
  saveData("sections", state.sections, {action:"reorder", detail:label});
}

// ── Keyboard drag ─────────────────────────────────────
function dndKeyboard(e, type, si, ii) {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    if (!kbDrag.active) {
      kbDrag = {active:true, type, si, ii: ii !== undefined ? ii : -1};
      toast("Grabbed — use ↑↓ to move, Space to drop, Esc to cancel");
    } else {
      kbDrag = {active:false, type:null, si:-1, ii:-1};
      saveData("sections", state.sections, {action:"reorder", detail:"Keyboard reorder"});
      toast("✓ Position saved");
    }
  } else if (e.key === "Escape" && kbDrag.active) {
    e.preventDefault();
    kbDrag = {active:false, type:null, si:-1, ii:-1};
    toast("Cancelled");
    render();
  } else if (kbDrag.active) {
    if (e.key === "ArrowUp")   { e.preventDefault(); kbMove(-1); }
    if (e.key === "ArrowDown") { e.preventDefault(); kbMove(+1); }
  }
}

function kbMove(dir) {
  const {type, si, ii} = kbDrag;
  if (type === "section") {
    const newSi = si + dir;
    if (newSi < 0 || newSi >= state.sections.length) return;
    tagChecks();
    const secs = [...state.sections];
    [secs[si], secs[newSi]] = [secs[newSi], secs[si]];
    const numbered = renumber(secs);
    state.checks = rebuildChecks(numbered);
    state.sections = numbered;
    kbDrag.si = newSi;
  } else {
    const newIi = ii + dir;
    if (newIi < 0 || newIi >= state.sections[si].items.length) return;
    tagChecks();
    const items = [...state.sections[si].items];
    [items[ii], items[newIi]] = [items[newIi], items[ii]];
    const newSections = state.sections.map((s, i) => i !== si ? s : {...s, items});
    const numbered = renumber(newSections);
    state.checks = rebuildChecks(numbered);
    state.sections = numbered;
    kbDrag.ii = newIi;
  }
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      render();
      refocusHandle();
    });
  } else {
    render();
    refocusHandle();
  }
}

function refocusHandle() {
  setTimeout(() => {
    const all = [...document.querySelectorAll("#cl-root .cl-drag-handle")];
    const target = all.find(h => {
      const t = h.dataset.dndType, s = parseInt(h.dataset.si), i = parseInt(h.dataset.ii);
      return t === kbDrag.type && s === kbDrag.si && (t === "section" || i === kbDrag.ii);
    });
    if (target) target.focus();
  }, 60);
}

// ── Pointer DnD state ─────────────────────────────────
const dnd = {
  active:false, type:null, si:-1, ii:-1,
  ghost:null, line:null,
  targetSi:-1, targetIi:-1,
  pointerId:null, startX:0, startY:0, offsetX:0, offsetY:0,
  moved:false, wasDrag:false, srcEl:null,
  longPressTimer:null,
};

// ── Attach drag listeners (called after every render) ─
function dndAttach() {
  document.querySelectorAll("#cl-root .cl-drag-handle").forEach(handle => {
    const type = handle.dataset.dndType;
    const si   = parseInt(handle.dataset.si);
    const ii   = handle.dataset.ii !== undefined ? parseInt(handle.dataset.ii) : undefined;

    handle.addEventListener("pointerdown", e => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      if (e.pointerType === "touch") {
        dnd.longPressTimer = setTimeout(() => dndStart(e, type, si, ii, handle), 400);
        const abort = () => { clearTimeout(dnd.longPressTimer); };
        handle.addEventListener("pointermove", abort, {once:true, passive:true});
        handle.addEventListener("pointerup",   abort, {once:true});
      } else {
        dndStart(e, type, si, ii, handle);
      }
    }, {passive:false});
  });
}

function dndStart(e, type, si, ii, handle) {
  const srcEl = type === "section"
    ? document.getElementById(`sec-${state.sections[si].id}`)
    : document.querySelector(`[data-item="${si}-${ii}"]`);
  if (!srcEl) return;

  try { handle.setPointerCapture(e.pointerId); } catch(_) {}
  e.preventDefault();

  const rect = srcEl.getBoundingClientRect();
  Object.assign(dnd, {
    active:true, type, si, ii: ii !== undefined ? ii : -1,
    pointerId: e.pointerId,
    startX: e.clientX, startY: e.clientY,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
    moved:false, wasDrag:false, srcEl,
    targetSi: -1, targetIi: -1,
  });

  // Ghost — clone then strip inner content so only compact header shows
  dnd.ghost = srcEl.cloneNode(true);
  dnd.ghost.removeAttribute("id");

  // Sections: remove items list so ghost shows only the header bar
  const ghostItems = dnd.ghost.querySelector(".cl-items");
  if (ghostItems) ghostItems.remove();

  // Items: remove detail panel, edit forms, move buttons, expand button
  dnd.ghost.querySelectorAll(".cl-item-detail, .cl-edit-form, .cl-move-btns, .cl-expand-btn, .cl-add-row").forEach(el => el.remove());

  Object.assign(dnd.ghost.style, {
    position:"fixed", top:rect.top+"px", left:rect.left+"px",
    width:rect.width+"px", margin:"0",
    pointerEvents:"none", zIndex:"9999",
    opacity:"0.95",
    transform:"scale(1.02) rotate(0.3deg)",
    boxShadow:"0 24px 60px rgba(0,0,0,0.55), 0 0 0 2px #c9a96e, 0 0 24px rgba(201,169,110,0.18)",
    borderRadius:"12px",
    transition:"transform 0.12s ease, box-shadow 0.12s ease",
    cursor:"grabbing",
    willChange:"transform",
  });
  document.body.appendChild(dnd.ghost);

  // Insertion line
  dnd.line = document.createElement("div");
  dnd.line.className = "cl-drop-line";
  document.body.appendChild(dnd.line);

  // Dim source
  srcEl.classList.add("cl-dragging-source");

  document.addEventListener("pointermove", dndMove, {passive:false});
  document.addEventListener("pointerup",   dndEnd);
  document.addEventListener("pointercancel", dndCancel);
}

function dndMove(e) {
  if (!dnd.active || e.pointerId !== dnd.pointerId) return;
  e.preventDefault();

  const dx = e.clientX - dnd.startX, dy = e.clientY - dnd.startY;
  if (!dnd.moved && Math.hypot(dx, dy) > 4) { dnd.moved = true; dnd.wasDrag = true; }
  if (!dnd.moved) return;

  dnd.ghost.style.top  = (e.clientY - dnd.offsetY) + "px";
  dnd.ghost.style.left = (e.clientX - dnd.offsetX) + "px";

  if (dnd.type === "item") updateItemTarget(e.clientY);
  else updateSectionTarget(e.clientY);
}

function updateItemTarget(clientY) {
  const sec   = state.sections[dnd.si];
  if (!sec) return;
  const secEl = document.getElementById(`sec-${sec.id}`);
  if (!secEl) return;
  const rows  = [...secEl.querySelectorAll("[data-item]")];

  // Clear magnetic classes
  rows.forEach(r => r.classList.remove("dnd-shift-up","dnd-shift-down"));

  let targetIi = rows.length, lineY = null;
  for (let i = 0; i < rows.length; i++) {
    const rect = rows[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      targetIi = i;
      lineY = rect.top;
      rows[i].classList.add("dnd-shift-up");
      if (i > 0) rows[i-1].classList.add("dnd-shift-down");
      break;
    }
    if (i === rows.length - 1) lineY = rect.bottom;
  }
  dnd.targetIi = targetIi;
  positionLine(lineY, secEl.getBoundingClientRect());
}

function updateSectionTarget(clientY) {
  const root = document.getElementById("cl-root");
  const secs = [...root.querySelectorAll(".cl-section")];

  secs.forEach(s => s.classList.remove("dnd-shift-up","dnd-shift-down"));

  let targetSi = secs.length, lineY = null;
  for (let i = 0; i < secs.length; i++) {
    const rect = secs[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      targetSi = i;
      lineY = rect.top;
      secs[i].classList.add("dnd-shift-up");
      if (i > 0) secs[i-1].classList.add("dnd-shift-down");
      break;
    }
    if (i === secs.length - 1) lineY = rect.bottom;
  }
  dnd.targetSi = targetSi;
  positionLine(lineY, root.getBoundingClientRect());
}

function positionLine(lineY, containerRect) {
  if (lineY === null || !dnd.line) return;
  Object.assign(dnd.line.style, {
    display: "block",
    top:  lineY + "px",
    left: containerRect.left + "px",
    width: containerRect.width + "px",
  });
}

function dndEnd(e) {
  if (!dnd.active || e.pointerId !== dnd.pointerId) return;
  dndCleanup();
  if (!dnd.moved) return;
  if (dnd.type === "item")    doItemDrop();
  else                        doSectionDrop();
}

function dndCancel() {
  dndCleanup();
  render();
}

function dndCleanup() {
  dnd.active = false;
  if (dnd.ghost)  { dnd.ghost.remove();  dnd.ghost = null; }
  if (dnd.line)   { dnd.line.remove();   dnd.line  = null; }
  if (dnd.srcEl)  { dnd.srcEl.classList.remove("cl-dragging-source"); }
  document.querySelectorAll(".dnd-shift-up,.dnd-shift-down")
    .forEach(el => el.classList.remove("dnd-shift-up","dnd-shift-down"));
  document.removeEventListener("pointermove", dndMove);
  document.removeEventListener("pointerup",   dndEnd);
  document.removeEventListener("pointercancel", dndCancel);
}

function doItemDrop() {
  const {si, ii, targetIi} = dnd;
  if (ii < 0 || targetIi < 0) return;
  // Adjust for splice offset
  const insertAt = targetIi > ii ? targetIi - 1 : targetIi;
  if (ii === insertAt) { render(); return; }

  tagChecks();
  const items = [...state.sections[si].items];
  const [moved] = items.splice(ii, 1);
  items.splice(insertAt, 0, moved);
  const numbered = renumber(state.sections.map((s,i) => i !== si ? s : {...s, items}));
  state.checks   = rebuildChecks(numbered);
  state.sections = numbered;

  const title = state.sections[si]?.title || "";
  if (document.startViewTransition) { document.startViewTransition(() => render()); }
  else { render(); }
  saveData("sections", state.sections, {action:"reorder", detail:`Reordered items in ${title}`});
}

function doSectionDrop() {
  const {si, targetSi} = dnd;
  const insertAt = targetSi > si ? targetSi - 1 : targetSi;
  if (si === insertAt) { render(); return; }

  tagChecks();
  const secs = [...state.sections];
  const [moved] = secs.splice(si, 1);
  secs.splice(insertAt, 0, moved);
  const numbered = renumber(secs);
  state.checks   = rebuildChecks(numbered);
  state.sections = numbered;

  if (document.startViewTransition) { document.startViewTransition(() => render()); }
  else { render(); }
  saveData("sections", state.sections, {action:"reorder", detail:"Reordered sections"});
}

// ── Checklist render ──────────────────────────────────
function renderChecklist() {
  const frag = document.createDocumentFragment();
  frag.appendChild(renderHeader());

  // Cost strip
  const costs = h("div",{"class":"cl-costs"},
    ...[ ["💰","~$4,298","Total incl. tax"], ["📅","$0 / yr","No subscriptions"], ["⚡","~$138 / yr","Electricity"] ]
      .map(([icon,val,lbl]) => h("div",{"class":"cl-cost-card"},
        h("div",{"class":"cl-cost-icon"},icon),
        h("div",{"class":"cl-cost-val"},val),
        h("div",{"class":"cl-cost-lbl"},lbl)
      ))
  );
  frag.appendChild(costs);

  if (state.showLog) frag.appendChild(renderLog());

  // Sections
  state.sections.forEach((sec, si) => {
    const meta = SEC_META[sec.id]||{icon:"📌",color:"#8ba3bf",hint:""};
    const {t,d,pct:sp} = secProg(sec);
    const isComplete = d===t && t>0;
    const isOpen     = !state.collapsed[sec.id];
    const isKbGrab   = kbDrag.active && kbDrag.type==="section" && kbDrag.si===si;

    const secEl = h("div",{
      "class":"cl-section fade-up"+(isComplete?" complete":"")+(isKbGrab?" cl-kb-grabbed":""),
      "id":"sec-"+sec.id,
      "style":`animation-delay:${si*0.03}s`
    });
    // Stable transition name for View Transitions API
    secEl.style.viewTransitionName = `vt-sec-${sec.id}`;

    // Section drag handle
    const secHandle = makeDragHandle("section", si);
    const secMoveBtns = makeMoveButtons("section", si);

    const secHdr = h("div",{"class":"cl-sec-header"},
      secHandle,
      h("div",{"class":"cl-sec-icon","style":`background:${meta.color}18;border:1px solid ${meta.color}28`},meta.icon),
      h("div",{"class":"cl-sec-info"},
        h("div",{"class":"cl-sec-title"},sec.title, isComplete?" ✅":""),
        h("div",{"class":"cl-sec-hint"},meta.hint)
      ),
      h("div",{"class":"cl-sec-right"},
        state.editMode ? h("button",{"class":"cl-sec-del",
          onClick: async e=>{ e.stopPropagation();
            const nx=renumber(state.sections.filter((_,i)=>i!==si));
            tagChecks(); state.sections=nx; state.checks=rebuildChecks(renumber(nx));
            await saveData("sections",state.sections,{action:"del-section",detail:`Removed section: ${sec.title}`});
            render();
          }},"✕") : null,
        h("div",{},
          h("div",{"class":"cl-sec-count"+(isComplete?" done":"")},`${d}/${t}`),
          h("div",{"class":"cl-sec-bar"},h("div",{"class":"cl-sec-bar-fill","style":`width:${sp}%;background:${meta.color}`}))
        ),
        secMoveBtns,
        h("span",{"class":"cl-chevron"+(isOpen?" open":"")}, "▾")
      )
    );
    // Collapse toggle — skip if drag just happened
    secHdr.addEventListener("click", () => {
      if (dnd.wasDrag) { dnd.wasDrag=false; return; }
      state.collapsed[sec.id]=!state.collapsed[sec.id]; render();
    });
    secEl.appendChild(secHdr);

    if (isOpen) {
      const itemsWrap = h("div",{"class":"cl-items"});

      sec.items.forEach((item, ii) => {
        const isDone    = !!state.checks[item.n];
        const isEditing = state.editItem && state.editItem.si===si && state.editItem.ii===ii;
        const expKey    = `${si}-${ii}`;
        const isExp     = !!state.expanded[expKey];
        const isKbItem  = kbDrag.active && kbDrag.type==="item" && kbDrag.si===si && kbDrag.ii===ii;

        const row = h("div",{
          "class":"cl-item"+(isDone?" done":"")+(isKbItem?" cl-kb-grabbed":""),
          "data-item":`${si}-${ii}`,
        });
        // Stable transition name using UID
        if (item.uid) row.style.viewTransitionName = `vt-item-${item.uid}`;

        // Item drag handle
        const itemHandle = makeDragHandle("item", si, ii);
        const itemMoveBtns = makeMoveButtons("item", si, ii);
        row.appendChild(itemHandle);
        row.appendChild(h("span",{"class":"cl-item-num"},`#${item.n}`));

        const cb = h("div",{"class":"cl-cb"+(isDone?" on":""),
          onClick: async e=>{ e.stopPropagation();
            const val=!state.checks[item.n];
            state.checks[item.n]=val;
            const action=val?"check":"uncheck";
            const logEntry={action,detail:`${val?"Checked":"Unchecked"}: #${item.n} ${item.name}`};
            if (item.uid && state.activeProject) {
              await checkItem(item.uid, val, logEntry);
            } else {
              await saveData("checks",state.checks,logEntry);
            }
            render();
          }
        });
        if (isDone) cb.innerHTML=`<svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="#065f46" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        row.appendChild(cb);

        if (isEditing) {
          const d=state.editDraft;
          const nameI  = h("input",{"class":"cl-form-input","value":d.name||"","placeholder":"Name"});
          const modelI = h("input",{"class":"cl-form-input","value":d.model||"","placeholder":"Model"});
          const detI   = h("input",{"class":"cl-form-input","value":d.detail||"","placeholder":"Description"});
          const priceI = h("input",{"class":"cl-form-input","value":d.price||"","placeholder":"Price","style":"max-width:90px"});
          const warnI  = h("input",{"type":"checkbox"}); warnI.checked=!!d.warn;
          const saveBtn = h("button",{"class":"cl-btn cl-btn-success cl-btn-sm",
            onClick: async ()=>{
              const nx=state.sections.map((s,i)=>i!==si?s:{...s,items:s.items.map((it,j)=>j!==ii?it:{...it,
                name:nameI.value,model:modelI.value,detail:detI.value,price:priceI.value,warn:warnI.checked
              })});
              state.sections=nx; state.editItem=null;
              await saveData("sections",nx,{action:"edit-item",detail:`Edited: #${item.n} ${nameI.value}`});
              render(); toast("✓ Item updated");
            }},"Save");
          const cancelBtn=h("button",{"class":"cl-btn cl-btn-ghost cl-btn-sm",onClick:()=>{state.editItem=null;render();}},"Cancel");
          const form=h("div",{"class":"cl-edit-form"},nameI,modelI,detI,
            h("div",{"class":"cl-form-row"},priceI,
              h("label",{"style":"font-size:12px;color:var(--text2);display:flex;align-items:center;gap:4px;cursor:pointer"},warnI,"⚠ Pending"),
              saveBtn,cancelBtn)
          );
          row.appendChild(form);
        } else {
          const nameRow = h("div",{"class":"cl-item-name"},item.name,
            item.warn?h("span",{"class":"cl-tag tag-warn"},"⚠ Pending"):null,
            item.price==="FREE"&&!isDone?h("span",{"class":"cl-tag tag-free"},"FREE"):null,
          );
          const body = h("div",{"class":"cl-item-body"},nameRow);
          if (item.model) body.appendChild(h("div",{"class":"cl-item-model"},item.model));
          if (item.detail) {
            const expBtn=h("button",{"class":"cl-expand-btn",onClick:e=>{e.stopPropagation();state.expanded[expKey]=!isExp;render();}},isExp?"▾ Hide":"▸ What is this?");
            const detail=h("div",{"class":"cl-item-detail"+(isExp?" open":"")},item.detail);
            body.append(expBtn,detail);
          }
          // ── File attachment panel ──────────────────────────────
          const fileKey  = item.uid;
          const filesArr = state.itemFiles[fileKey] || [];
          const fileOpen = !!state.filesOpen[fileKey];
          const fileCount = filesArr.length;

          const fileToggle = h("button", {
            class: "cl-file-toggle" + (fileCount > 0 ? " has-files" : ""),
            title: "Attachments",
            onClick: async (e) => {
              e.stopPropagation();
              if (!state.filesOpen[fileKey]) {
                // Load files from API on first open
                try {
                  const d = await apiFetch("/api/items/" + item.uid + "/files");
                  state.itemFiles[fileKey] = d.files || [];
                } catch(err) { state.itemFiles[fileKey] = []; }
              }
              state.filesOpen[fileKey] = !state.filesOpen[fileKey];
              render();
            }
          }, fileCount > 0 ? `📎 ${fileCount}` : "📎");
          body.appendChild(fileToggle);

          if (fileOpen) {
            const filePanel = h("div", { class: "cl-file-panel" });

            // File list
            if (filesArr.length > 0) {
              filesArr.forEach(f => {
                const fRow = h("div", { class: "cl-file-row" });
                const icon = f.type?.startsWith("image/") ? "🖼" :
                             f.type === "application/pdf" ? "📄" :
                             f.type?.includes("word") ? "📝" :
                             f.type?.includes("zip") ? "🗜" : "📁";
                const size = f.size > 1048576 ? (f.size/1048576).toFixed(1)+"MB"
                           : f.size > 1024 ? (f.size/1024).toFixed(0)+"KB" : f.size+"B";
                const date = new Date(f.uploaded).toLocaleDateString("en-GB",
                  {day:"2-digit", month:"short", year:"numeric"});

                const nameEl = h("span", { class: "cl-file-name" }, `${icon} ${f.name}`);
                const metaEl = h("span", { class: "cl-file-meta" }, `${size} · ${date}`);

                const dlBtn = h("a", {
                  class: "cl-file-btn",
                  href: "https://checklist-api.3rc0.workers.dev/api/files/" + f.id,
                  download: f.name,
                  title: "Download",
                  onClick: e => e.stopPropagation()
                }, "⬇");

                const delBtn = h("button", {
                  class: "cl-file-btn del",
                  title: "Delete",
                  onClick: async (e) => {
                    e.stopPropagation();
                    if (!confirm(`Delete "${f.name}"?`)) return;
                    await apiFetch("/api/files/" + f.id, { method: "DELETE" });
                    state.itemFiles[fileKey] = state.itemFiles[fileKey].filter(x => x.id !== f.id);
                    render();
                    toast("🗑 File deleted");
                  }
                }, "✕");

                fRow.append(nameEl, metaEl, dlBtn, delBtn);
                filePanel.appendChild(fRow);
              });
            } else {
              filePanel.appendChild(h("div", { class: "cl-file-empty" }, "No attachments yet"));
            }

            // Upload button
            const uploadInput = h("input", {
              type: "file", class: "cl-file-input", id: "cl-file-" + item.uid,
              onChange: async (e) => {
                e.stopPropagation();
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 10 * 1024 * 1024) { toast("File too large (max 10MB)", "var(--red)"); return; }
                const fd = new FormData();
                fd.append("file", file);
                toast("⬆ Uploading…");
                try {
                  const d = await apiFetch("/api/items/" + item.uid + "/files", {
                    method: "POST", body: fd, isFormData: true
                  });
                  if (!d.ok) { toast(d.error || "Upload failed", "var(--red)"); return; }
                  state.itemFiles[fileKey] = [...(state.itemFiles[fileKey] || []), d.file];
                  render();
                  toast("✅ File attached!");
                } catch(err) { toast("Upload failed", "var(--red)"); }
              }
            });

            const uploadBtn = h("label", {
              class: "cl-file-upload-btn",
              for: "cl-file-" + item.uid,
              onClick: e => e.stopPropagation()
            }, "+ Attach file");

            filePanel.append(uploadInput, uploadBtn);
            body.appendChild(filePanel);
          }

          row.appendChild(body);

          const priceClass=item.price==="FREE"?"price-free":item.price==="—"?"price-dash":"price-cost";
          const right=h("div",{"class":"cl-item-right"},
            itemMoveBtns,
            h("span",{"class":"cl-item-price "+priceClass},item.price)
          );
          if (state.editMode) {
            right.appendChild(h("div",{"class":"cl-edit-btns"},
              h("button",{"class":"cl-edit-btn edit",onClick:e=>{e.stopPropagation();state.editItem={si,ii};state.editDraft={...item};render();}},"✏"),
              h("button",{"class":"cl-edit-btn del",onClick:async e=>{e.stopPropagation();
                tagChecks();
                const nx=renumber(state.sections.map((s,i)=>i!==si?s:{...s,items:s.items.filter((_,j)=>j!==ii)}));
                state.checks=rebuildChecks(nx); state.sections=nx;
                await saveData("sections",nx,{action:"del-item",detail:`Removed: #${item.n} ${item.name}`});
                render(); toast("✓ Item removed","var(--red)");
              }},"✕")
            ));
          }

          // Row click = toggle check (not on handle/checkbox/expand/edit)
          row.addEventListener("click", async () => {
            if (state.editMode || isEditing) return;
            const val=!state.checks[item.n];
            state.checks[item.n]=val;
            const action=val?"check":"uncheck";
            const logEntry2={action,detail:`${val?"Checked":"Unchecked"}: #${item.n} ${item.name}`};
            if (item.uid && state.activeProject) {
              await checkItem(item.uid, val, logEntry2);
            } else {
              await saveData("checks",state.checks,logEntry2);
            }
            render();
          });
          row.appendChild(right);
        }

        itemsWrap.appendChild(row);
      });

      // Add item form
      if (state.editMode) {
        const addRow=h("div",{"class":"cl-add-row"});
        if (state.addingSec===si) {
          const ni=state.newItem;
          const nameI =h("input",{"class":"cl-form-input","value":ni.name,"placeholder":"Item name *"});
          const modelI=h("input",{"class":"cl-form-input","value":ni.model,"placeholder":"Model / spec"});
          const detI  =h("input",{"class":"cl-form-input","value":ni.detail,"placeholder":"Description"});
          const priceI=h("input",{"class":"cl-form-input","value":ni.price,"placeholder":"Price","style":"max-width:90px"});
          const warnI =h("input",{"type":"checkbox"}); warnI.checked=ni.warn;
          nameI.oninput =e=>{state.newItem.name  =e.target.value;};
          modelI.oninput=e=>{state.newItem.model =e.target.value;};
          detI.oninput  =e=>{state.newItem.detail=e.target.value;};
          priceI.oninput=e=>{state.newItem.price =e.target.value;};
          warnI.onchange=e=>{state.newItem.warn  =e.target.checked;};
          const addBtn=h("button",{"class":"cl-btn cl-btn-success cl-btn-sm",
            onClick:async()=>{
              if(!state.newItem.name.trim()) return;
              const maxN=Math.max(0,...state.sections.flatMap(s=>s.items.map(i=>i.n)));
              const newIt={n:maxN+1,uid:uid7(),...state.newItem};
              const nx=renumber(state.sections.map((s,i)=>i!==si?s:{...s,items:[...s.items,newIt]}));
              state.sections=nx; state.addingSec=null;
              state.newItem={name:"",model:"",detail:"",price:"",warn:false};
              await saveData("sections",nx,{action:"add-item",detail:`Added: ${nameI.value}`});
              render(); toast("✓ Item added");
            }},"Add");
          const cancelBtn=h("button",{"class":"cl-btn cl-btn-ghost cl-btn-sm",
            onClick:()=>{state.addingSec=null;state.newItem={name:"",model:"",detail:"",price:"",warn:false};render();}},"Cancel");
          addRow.appendChild(h("div",{"class":"cl-edit-form"},nameI,modelI,detI,
            h("div",{"class":"cl-form-row"},priceI,
              h("label",{"style":"font-size:12px;color:var(--text2);display:flex;align-items:center;gap:4px;cursor:pointer"},warnI,"⚠"),
              addBtn,cancelBtn)
          ));
        } else {
          addRow.appendChild(h("button",{"class":"cl-add-btn",
            onClick:()=>{state.addingSec=si;render();}},"+ Add item to "+sec.title));
        }
        itemsWrap.appendChild(addRow);
      }

      secEl.appendChild(itemsWrap);
    }
    frag.appendChild(secEl);
  });

  // Add section
  if (state.editMode) {
    const addSec=h("div",{"class":"cl-add-section"});
    const label=h("div",{"style":"font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;font-family:var(--mono)"},"+ New Section");
    const inp  =h("input",{"class":"cl-form-input","placeholder":"Section title e.g. Cabling","style":"flex:1"});
    const btn  =h("button",{"class":"cl-btn cl-btn-primary","style":"margin-left:8px",
      onClick:async()=>{
        if(!inp.value.trim()) return;
        const ids="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const nx=[...state.sections,{id:ids[state.sections.length]||String(state.sections.length+1),title:inp.value.trim(),items:[]}];
        state.sections=nx;
        await saveData("sections",nx,{action:"add-section",detail:`Added section: ${inp.value.trim()}`});
        render(); toast("✓ Section added");
      }},"Add");
    addSec.append(label,h("div",{"style":"display:flex;align-items:center"},inp,btn));
    frag.appendChild(addSec);
  }

  frag.appendChild(h("div",{"style":"text-align:center;padding:20px 0 8px;font-size:12px;color:var(--text3);font-family:var(--mono)"},"3rc0.github.io"));
  return frag;
}

// ── Main render ───────────────────────────────────────
function render() {
  applyTheme();
  const root = document.getElementById("cl-root");
  root.innerHTML = "";

  // Confirm dialog overlay — rendered on top of any view
  if (state.confirmDialog) {
    root.appendChild(renderConfirmDialog());
    return;
  }

  if (state.view === "loading")          { root.appendChild(renderLoading()); return; }
  if (state.view === "auth")             { root.appendChild(renderAuth()); return; }
  if (state.view === "onboarding")       { root.appendChild(renderOnboarding()); return; }
  if (state.view === "dashboard")        { root.appendChild(renderDashboard()); return; }
  if (state.view === "checklist")        { root.appendChild(renderChecklist()); dndAttach(); return; }
  if (state.view === "template-picker")  { root.appendChild(renderDashboard()); root.appendChild(renderTemplatePicker()); return; }
}

// ── Loading screen ────────────────────────────────────
function renderLoading() {
  const wrap = h("div", { class: "cl-loading-screen" });
  wrap.innerHTML = `
    <div class="cl-loading-inner">
      <div class="cl-spinner"></div>
      <div class="cl-loading-text">Loading…</div>
    </div>`;
  return wrap;
}

// ── Confirm dialog ────────────────────────────────────
function renderConfirmDialog() {
  const { message, onConfirm, confirmLabel, danger } = state.confirmDialog;
  const overlay = h("div", { class: "cl-confirm-overlay" });
  const dialog  = h("div", { class: "cl-confirm-dialog" });

  dialog.innerHTML = `
    <div class="cl-confirm-message">${message}</div>
    <div class="cl-confirm-actions"></div>`;

  const actions = dialog.querySelector(".cl-confirm-actions");

  const cancelBtn = h("button", {
    class: "cl-btn cl-btn--ghost",
    onClick: () => { state.confirmDialog = null; render(); }
  }, "Cancel");

  const confirmBtn = h("button", {
    class: `cl-btn ${danger ? "cl-btn--danger" : "cl-btn--gold"}`,
    onClick: () => {
      state.confirmDialog = null;
      onConfirm();
    }
  }, confirmLabel || "Confirm");

  actions.appendChild(cancelBtn);
  actions.appendChild(confirmBtn);
  overlay.appendChild(dialog);

  // ESC to cancel
  overlay.addEventListener("keydown", e => {
    if (e.key === "Escape") { state.confirmDialog = null; render(); }
  });

  // Focus confirm button
  setTimeout(() => confirmBtn.focus(), 50);

  return overlay;
}

// ── Confirm helper ────────────────────────────────────
function confirm(message, onConfirm, opts = {}) {
  state.confirmDialog = { message, onConfirm, ...opts };
  render();
}

// ── PWA ───────────────────────────────────────────────
function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register(SW_PATH)
    .then(reg => {
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        nw.addEventListener("statechange", () => {
          if (nw.state==="installed" && navigator.serviceWorker.controller) {
            toast("🔄 Update available — reload to apply");
          }
        });
      });
    })
    .catch(err => console.warn("SW registration failed:", err));
}

// ── Offline tracking ──────────────────────────────────
window.addEventListener("online",  () => { state.online=true;  if(state.view==="app") render(); });
window.addEventListener("offline", () => { state.online=false; if(state.view==="app") render(); });

// ── Boot ──────────────────────────────────────────────
async function boot() {
  applyTheme();
  state.view = "loading";
  render();

  const token = loadToken();

  if (token) {
    state.session = { token };
    try {
      // Verify session is valid by loading projects
      const d = await apiFetch("/api/projects");
      if (d.ok === false) {
        // Session expired or invalid
        clearToken();
        state.session = null;
        state.view    = "auth";
      } else {
        state.session.username = d.projects.length > 0
          ? null  // will be set on login response
          : null;
        state.projects      = d.projects || [];
        state.projectsLoaded = true;

        // Check if new user (no projects) → show onboarding
        const onboarded = localStorage.getItem(ONBOARD_KEY);
        if (state.projects.length === 0 && !onboarded) {
          await loadTemplates();
          state.view = "onboarding";
        } else {
          state.view = "dashboard";
        }
      }
    } catch(e) {
      console.error("Boot error:", e);
      clearToken();
      state.session = null;
      state.view    = "auth";
    }
  } else {
    state.view = "auth";
  }

  render();
  registerSW();
}

// ── Load projects list ────────────────────────────────
async function loadProjects() {
  try {
    const d = await apiFetch("/api/projects");
    if (d.ok) {
      state.projects      = d.projects || [];
      state.projectsLoaded = true;
    }
  } catch(e) { console.error("Load projects:", e); }
}

// ── Load template list (cached) ───────────────────────
async function loadTemplates() {
  if (state.templatesLoaded) return;
  try {
    const d = await apiFetch("/api/templates");
    if (d.ok) {
      state.templates      = d.templates || [];
      state.templatesLoaded = true;
    }
  } catch(e) { console.error("Load templates:", e); }
}

// ── Open a project ────────────────────────────────────
async function openProject(projectId) {
  state.view = "loading";
  render();
  try {
    const d = await apiFetch("/api/projects/" + projectId);
    if (d.ok) {
      state.activeProject = d.project;
      state.sections      = ensureUIDs(d.sections || []);
      state.checks        = d.checks || {};
      state.view          = "checklist";
      // Reset checklist UI state
      state.collapsed  = {};
      state.expanded   = {};
      state.editMode   = false;
      state.editItem   = null;
      state.showLog    = false;
    } else {
      toast("Failed to load project", "var(--warn)");
      state.view = "dashboard";
    }
  } catch(e) {
    console.error("Open project:", e);
    toast("Network error", "var(--warn)");
    state.view = "dashboard";
  }
  render();
}

// ── Back to dashboard ─────────────────────────────────
async function goToDashboard() {
  state.view          = "loading";
  state.activeProject = null;
  render();
  await loadProjects();
  state.view = "dashboard";
  render();
}

// ── Create project ────────────────────────────────────
async function createProject(name, templateKey) {
  try {
    const d = await apiFetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name, template: templateKey || "blank" })
    });
    if (d.ok) {
      localStorage.setItem(ONBOARD_KEY, "1");
      await openProject(d.project.id);
    } else {
      toast("Failed to create project: " + (d.error || ""), "var(--warn)");
    }
  } catch(e) {
    toast("Network error", "var(--warn)");
  }
}

boot();
})();

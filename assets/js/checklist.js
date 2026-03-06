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
let state = {
  view: "loading",
  authTab: "login",
  session: null,
  sections: DEFAULT_SECTIONS,
  checks: {},
  collapsed: {},
  expanded: {},
  editMode: false,
  editItem: null,
  editDraft: {},
  addingSec: null,
  newItem: {name:"",model:"",detail:"",price:"",warn:false},
  newSecTitle: "",
  saving: false,
  logs: [],
  showLog: false,
  theme: localStorage.getItem(THEME_KEY) || "dark",
  online: navigator.onLine,
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
function loadSession() { try { return JSON.parse(sessionStorage.getItem(STORE_KEY)); } catch(e) { return null; } }
function saveSession(s) { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch(e) {} }
function clearSession() { try { sessionStorage.removeItem(STORE_KEY); } catch(e) {} }

// ── API ───────────────────────────────────────────────
async function apiFetch(path, opts) {
  const headers = {"Content-Type":"application/json",...((opts&&opts.headers)||{})};
  if (state.session) headers["X-Session-Token"] = state.session.token;
  const r = await fetch(API+path,{method:(opts&&opts.method)||"GET",headers,body:opts&&opts.body});
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
  const wrap = h("div",{"class":"cl-auth fade-up"});
  const card = h("div",{"class":"cl-auth-card"});
  const logo  = h("div",{"class":"cl-auth-logo"},"🔐");
  const title = h("div",{"class":"cl-auth-title"},"Home Security Checklist");
  const sub   = h("div",{"class":"cl-auth-sub"},"Sign in to access your personal checklist");
  const tabs  = h("div",{"class":"cl-tabs"},
    h("button",{"class":"cl-tab"+(isLogin?" active":""),onClick:()=>{state.authTab="login";render();}},"Sign In"),
    h("button",{"class":"cl-tab"+(!isLogin?" active":""),onClick:()=>{state.authTab="register";render();}},"Create Account"),
  );
  const errBox = h("div",{"class":"cl-auth-error","id":"cl-auth-err"});
  const userField = h("div",{"class":"cl-field"},
    h("label",{"class":"cl-label"},"Username"),
    h("input",{"class":"cl-input","id":"cl-user","type":"text","placeholder":"your_username","autocomplete":"username","maxlength":"30"}),
    !isLogin?h("div",{"class":"cl-input-hint"},"3–30 chars, letters/numbers/dash/underscore"):null,
  );
  const passField = h("div",{"class":"cl-field"},
    h("label",{"class":"cl-label"},"Password"),
    h("input",{"class":"cl-input","id":"cl-pass","type":"password","placeholder":"••••••••","autocomplete":isLogin?"current-password":"new-password","maxlength":"100"}),
    !isLogin?h("div",{"class":"cl-input-hint"},"Minimum 8 characters"):null,
  );
  function showAuthErr(msg) {
    const e=document.getElementById("cl-auth-err");
    if(e){e.textContent=msg;e.className="cl-auth-error show";}
  }
  const submitBtn = h("button",{"class":"cl-btn cl-btn-primary cl-btn-full","id":"cl-auth-btn",
    onClick: async ()=>{
      const username=document.getElementById("cl-user").value.trim().toLowerCase();
      const password=document.getElementById("cl-pass").value;
      const btn=document.getElementById("cl-auth-btn");
      document.getElementById("cl-auth-err").className="cl-auth-error";
      if(!username||!password){showAuthErr("Please enter username and password.");return;}
      btn.disabled=true; btn.textContent=isLogin?"Signing in…":"Creating account…";
      try {
        const d=await apiFetch(isLogin?"/api/login":"/api/register",{method:"POST",body:JSON.stringify({username,password})});
        if(d.locked){showAuthErr("Too many failed attempts. Try again in 15 minutes.");btn.disabled=false;btn.textContent=isLogin?"Sign In":"Create Account";return;}
        if(!d.ok){showAuthErr(d.error||"Something went wrong.");btn.disabled=false;btn.textContent=isLogin?"Sign In":"Create Account";return;}
        if(isLogin){
          state.session={token:d.token,username:d.username};
          saveSession(state.session);
          await loadUserData();
          state.view="app"; render();
        } else {
          toast("Account created! Please sign in.");
          state.authTab="login"; render();
        }
      } catch(e){
        showAuthErr("Could not connect to server. Try again.");
        btn.disabled=false; btn.textContent=isLogin?"Sign In":"Create Account";
      }
    }
  },isLogin?"Sign In":"Create Account");
  card.append(logo,title,sub,tabs,errBox,userField,passField,submitBtn);
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
    await apiFetch("/api/save",{method:"POST",body:JSON.stringify({key,value,entry:logEntry})});
  } catch(e){}
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
function renderHeader() {
  const {total,done,pct}=calcProgress();
  const wrap=h("div",{"class":"cl-header fade-up"});

  // Offline banner
  if(!state.online){
    wrap.appendChild(h("div",{"class":"cl-offline-banner"},"● Offline — changes will sync when reconnected"));
  }

  const top=h("div",{"class":"cl-header-top"},
    ring(pct),
    h("div",{"class":"cl-title-block"},
      h("h2",{},"Home Security Checklist"),
      h("div",{"class":"cl-user-badge"},"👤 "+state.session.username),
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
    onClick:()=>{state.collapsed={};setTimeout(()=>window.print(),300);}},
    "🖨️ Print PDF");

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
  saveData("checks", state.checks, null);
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
      saveData("checks", state.checks, null);
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
  saveData("checks",   state.checks,   null);
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
  saveData("checks",   state.checks,   null);
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
            await saveData("checks",state.checks,{action,detail:`${val?"Checked":"Unchecked"}: #${item.n} ${item.name}`});
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
            await saveData("checks",state.checks,{action,detail:`${val?"Checked":"Unchecked"}: #${item.n} ${item.name}`});
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
  if (state.view==="loading") {
    root.innerHTML=`<div style="text-align:center;padding:60px 0;color:#c9a96e;font-family:monospace;font-size:14px"><div class="cl-spinner"></div>Loading…</div>`;
    return;
  }
  if (state.view==="auth") { root.appendChild(renderAuth()); return; }
  if (state.view==="app")  { root.appendChild(renderChecklist()); dndAttach(); return; }
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
  const saved = loadSession();
  if (saved && saved.token) {
    state.session = saved;
    try {
      const d = await apiFetch("/api/data");
      if (d.ok===false && d.error==="Not authenticated") {
        clearSession(); state.session=null; state.view="auth";
      } else {
        state.sections = ensureUIDs(d.sections||DEFAULT_SECTIONS);
        state.checks   = d.checks||{};
        state.view = "app";
      }
    } catch(e) {
      clearSession(); state.session=null; state.view="auth";
    }
  } else {
    state.view = "auth";
  }
  render();
  registerSW();
}

boot();
})();

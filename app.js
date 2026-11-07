/* Nemčina – učenie hovorenej a business nemčiny (SK ↔ DE)
   app.js: stav, opakovanie (spaced repetition), obrazovky. Rozhovor s AI je v talk.js, cloud v cloud.js. */
'use strict';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtD = k => { if (!k) return ''; const [y, m, d] = k.slice(0, 10).split('-'); return `${+d}.${+m}.${y}`; };
const uid = (p = 'x') => p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const DAY = 864e5;
const norm = s => String(s || '').toLowerCase().replace(/[.,!?;:„“"”'’‚‘()«»\-–—…]/g, ' ').replace(/\s+/g, ' ').trim();

/* ================= content ================= */
const DATA = window.DE_DATA || { categories: [], grammar: [] };
const CATS = DATA.categories;
const GRAM = DATA.grammar;
const GROUPS = [{ id: 'business', sk: 'Business', icon: '💼' }, { id: 'industry', sk: 'Priemysel a P&L', icon: '🏭' }, { id: 'everyday', sk: 'Bežný život', icon: '☕' }];
const catById = id => CATS.find(c => c.id === id);
const gramById = id => GRAM.find(g => g.id === id);
const TOPIC_SK = {
  'word-order': 'Slovosled', 'articles-gender': 'Rod a členy', 'cases-akk-dat': 'Akuzatív / datív', prepositions: 'Predložky',
  'adjective-endings': 'Koncovky prídavných mien', perfekt: 'Perfekt', 'separable-verbs': 'Odlučiteľné slovesá', 'modal-verbs': 'Modálne slovesá',
  'konjunktiv-ii': 'Konjunktív II', reflexive: 'Zvratné slovesá a predložky', passive: 'Pasív', connectors: 'Spojky', negation: 'Zápor',
  'relative-clauses': 'Vzťažné vety', vocabulary: 'Slovná zásoba', style: 'Štýl / prirodzenosť',
};
const topicName = t => gramById(t)?.title_sk?.split(':')[0] || TOPIC_SK[t] || t || 'iné';

/* every learnable item by id: built-in phrases/vocab + AI-generated + own words + mistakes */
let ITEMS = {};
function buildItems() {
  ITEMS = {};
  CATS.forEach(c => {
    c.phrases.forEach(p => ITEMS[p.id] = { ...p, kind: 'phrase', cat: c.id });
    c.vocab.forEach(v => ITEMS[v.id] = { ...v, kind: 'vocab', cat: c.id });
    (S.gen[c.id] || []).forEach(p => ITEMS[p.id] = { ...p, kind: 'phrase', cat: c.id, ai: true });
  });
  S.words.forEach(w => ITEMS[w.id] = { ...w, kind: 'word' });
  S.mistakes.forEach(m => ITEMS[m.id] = { ...m, kind: 'mistake' });
}
const catItems = c => [...c.phrases, ...c.vocab, ...(S.gen[c.id] || [])].map(x => ITEMS[x.id]).filter(Boolean);
const catTexts = c => [...c.texts, ...(S.gentexts[c.id] || [])];
const textById = id => { for (const c of CATS) { const t = catTexts(c).find(t => t.id === id); if (t) return { t, c }; } return null; };
const scenById = id => { for (const c of CATS) { const s = c.scenarios.find(s => s.id === id); if (s) return { s, c }; } return null; };

/* ================= state ================= */
const LS_KEY = 'nemcina-v1';
const DEFAULTS = () => ({
  v: 1, updated: '', created: new Date().toISOString(),
  srs: {},            // id -> {iv, ef, reps, lapses, due(ms), last(ms), ok, bad}
  words: [],          // own dictionary {id, de, sk, note, ex, cat, src, at}
  mistakes: [],       // {id, wrong, right, explain, topic, cat, src, at, n}
  gen: {},            // catId -> AI phrases
  gentexts: {},       // catId -> AI texts
  genex: {},          // grammarId -> AI exercises
  gram: {},           // grammarId -> {ok, bad, done:{idx:true}, last}
  read: {},           // textId -> date
  act: {},            // day -> {xp, rev, ok, min, msg, nw}
  sessions: [],       // {id, at, kind, ctx, min, turns, summary, mistakes, phrases}
  visited: {},        // catId -> last visit ms
  profile: { facts: [] }, // long-term memory: what Lena knows about the learner {t, at}
  settings: { goal: 40, newPerDay: 12, skRatio: 'mid', rate: 0.95, voiceName: '', typing: true, theme: 'auto', name: '' },
});
let S = load();
function load() {
  try { const d = JSON.parse(localStorage.getItem(LS_KEY)); if (d && d.v) return merge(d); } catch (e) {}
  return DEFAULTS();
}
function merge(d) { const def = DEFAULTS(); const out = { ...def, ...d }; out.settings = { ...def.settings, ...(d.settings || {}) }; out.profile = { ...def.profile, ...(d.profile || {}) }; return out; }
function remember(t) { t = String(t || '').trim().slice(0, 200); if (!t || S.profile.facts.some(f => norm(f.t) === norm(t))) return false; S.profile.facts.unshift({ t, at: new Date().toISOString() }); S.profile.facts = S.profile.facts.slice(0, 40); save(); return true; }
let saveT = null;
function save(now) {
  S.updated = new Date().toISOString();
  clearTimeout(saveT);
  const w = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { toast('Nepodarilo sa uložiť do prehliadača'); } window.cloudQueue?.(); };
  now ? w() : (saveT = setTimeout(w, 250));
}
function replaceState(d) { S = merge(d); buildItems(); try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {} applyTheme(); render(); }

/* activity & XP */
function act(k, n = 1) { const d = dayKey(); const a = S.act[d] || (S.act[d] = { xp: 0, rev: 0, ok: 0, min: 0, msg: 0, nw: 0 }); a[k] = (a[k] || 0) + n; save(); }
function xp(n) { act('xp', n); renderSide(); }
const today = () => S.act[dayKey()] || { xp: 0, rev: 0, ok: 0, min: 0, msg: 0, nw: 0 };
function streak() { let n = 0; const d = new Date(); if (!(S.act[dayKey(d)]?.xp > 0)) d.setDate(d.getDate() - 1); while (S.act[dayKey(d)]?.xp > 0) { n++; d.setDate(d.getDate() - 1); } return n; }

/* ================= spaced repetition (SM-2, 4 buttons) ================= */
const st = id => S.srs[id];
function status(id) {
  const s = st(id); if (!s) return 'new';
  if (s.lapses >= 2 && s.iv < 7) return 'weak';
  return s.iv >= 21 ? 'known' : 'learning';
}
const isDue = id => { const s = st(id); return s && s.due <= Date.now(); };
function rate(id, q) { // 0 again, 1 hard, 2 good, 3 easy
  const now = Date.now();
  const s = S.srs[id] || (S.srs[id] = { iv: 0, ef: 2.5, reps: 0, lapses: 0, due: now, last: 0, ok: 0, bad: 0 });
  const fresh = !s.last;
  if (q === 0) { s.lapses += s.reps > 0 ? 1 : 0; s.reps = 0; s.iv = 0; s.ef = Math.max(1.3, s.ef - 0.2); s.due = now + 10 * 60e3; s.bad++; }
  else {
    if (q === 1) { s.iv = s.reps === 0 ? 1 : Math.max(1, Math.round(s.iv * 1.2)); s.ef = Math.max(1.3, s.ef - 0.15); }
    if (q === 2) s.iv = s.reps === 0 ? 1 : s.reps === 1 ? 3 : Math.round(Math.max(s.iv, 1) * s.ef);
    if (q === 3) { s.iv = s.reps === 0 ? 4 : Math.round(Math.max(s.iv, 1) * s.ef * 1.3); s.ef += 0.15; }
    s.reps++; s.ok++; s.due = now + s.iv * DAY - 2 * 3600e3;
  }
  s.last = now;
  act('rev'); if (q > 0) act('ok'); if (fresh) act('nw');
  xp(q === 0 ? 1 : 2);
}
function markKnown(id) { const now = Date.now(); S.srs[id] = { iv: 30, ef: 2.6, reps: 3, lapses: 0, due: now + 30 * DAY, last: now, ok: 1, bad: 0 }; save(); }
function addToReview(id) { const s = S.srs[id]; if (s) { s.due = Date.now(); s.iv = Math.min(s.iv, 1); } else S.srs[id] = { iv: 0, ef: 2.5, reps: 0, lapses: 0, due: Date.now(), last: 0, ok: 0, bad: 0 }; save(); }
const dueIds = (filter = () => true) => Object.keys(S.srs).filter(id => ITEMS[id] && isDue(id) && filter(ITEMS[id])).sort((a, b) => S.srs[a].due - S.srs[b].due);
function catProgress(c) {
  const its = catItems(c); let known = 0, learning = 0;
  its.forEach(i => { const s = status(i.id); if (s === 'known') known++; else if (s !== 'new') learning++; });
  return { total: its.length, known, learning, pct: its.length ? Math.round((known + learning * 0.4) / its.length * 100) : 0 };
}
function weakTopics() {
  const m = {};
  S.mistakes.forEach(x => { if (!x.topic || x.topic === 'style') return; m[x.topic] = (m[x.topic] || 0) + (x.n || 1) * (status(x.id) === 'known' ? 0.3 : 1); });
  Object.entries(S.gram).forEach(([g, v]) => { if (v.bad) m[g] = (m[g] || 0) + v.bad * 0.5; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

/* ================= mistakes & words ================= */
function addMistake(x, src = 'chat', cat = '') {
  if (!x || !x.right || !x.wrong || norm(x.wrong) === norm(x.right)) return null;
  const ex = S.mistakes.find(m => norm(m.right) === norm(x.right) && norm(m.wrong) === norm(x.wrong));
  if (ex) { ex.n = (ex.n || 1) + 1; ex.at = new Date().toISOString(); addToReview(ex.id); save(); return ex; }
  const m = { id: uid('m'), wrong: String(x.wrong).slice(0, 300), right: String(x.right).slice(0, 300), explain: String(x.explain || '').slice(0, 400), topic: x.topic || '', cat: cat || ROUTE.catId || '', src, at: new Date().toISOString(), n: 1 };
  S.mistakes.unshift(m); ITEMS[m.id] = { ...m, kind: 'mistake' }; addToReview(m.id); save(); return m;
}
function addWord(w, src = 'manual') {
  if (!w?.de) return null;
  const ex = S.words.find(x => norm(x.de) === norm(w.de));
  if (ex) { addToReview(ex.id); return ex; }
  const it = { id: uid('w'), de: w.de, sk: w.sk || '', note: w.note || '', ex: w.ex || '', cat: w.cat || ROUTE.catId || '', src, at: new Date().toISOString() };
  S.words.unshift(it); ITEMS[it.id] = { ...it, kind: 'word' }; addToReview(it.id); save(); return it;
}

/* ================= speech (browser TTS + dictation) ================= */
let VOICES = [];
function loadVoices() { VOICES = (speechSynthesis?.getVoices?.() || []).filter(v => /^de(-|_|$)/i.test(v.lang)); }
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function pickVoice() {
  if (S.settings.voiceName) { const v = VOICES.find(v => v.name === S.settings.voiceName); if (v) return v; }
  const pref = [/natural/i, /online/i, /google/i, /katja|conrad|amala|seraphina|florian/i];
  for (const p of pref) { const v = VOICES.find(v => p.test(v.name) && /de-DE/i.test(v.lang)); if (v) return v; }
  return VOICES.find(v => /de-DE/i.test(v.lang)) || VOICES[0];
}
function speak(text, rate) {
  if (!('speechSynthesis' in window)) return toast('Prehliadač nepodporuje čítanie nahlas');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).replace(/\|/g, '').replace(/<[^>]+>/g, ''));
  u.lang = 'de-DE'; const v = pickVoice(); if (v) u.voice = v; u.rate = rate || S.settings.rate || 0.95;
  speechSynthesis.speak(u);
}
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let REC = null;
function dictate(onText, lang = 'de-DE', btn) {
  if (!SR) return toast('Diktovanie funguje v Chrome / Edge');
  if (REC) { REC.stop(); return; }
  const r = REC = new SR(); r.lang = lang; r.interimResults = true; r.continuous = false;
  let final = '';
  btn?.classList.add('live');
  r.onresult = e => { let t = ''; for (const res of e.results) t += res[0].transcript; final = t; onText(t, false); };
  r.onerror = e => { if (e.error !== 'no-speech' && e.error !== 'aborted') toast('Mikrofón: ' + e.error); };
  r.onend = () => { REC = null; btn?.classList.remove('live'); if (final) onText(final, true); };
  r.start();
}

/* ================= UI helpers ================= */
let toastT;
function toast(msg, ms = 2600) { const t = $('#toast'); t.textContent = stripEmoji(msg); t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, ms); }
function modal(html) { const m = $('#modal'); m.innerHTML = iconize(`<div class="modal" role="dialog">${html}</div>`); m.hidden = false; }
function closeModal() { $('#modal').hidden = true; $('#modal').innerHTML = ''; }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
const spk = (t, small) => `<button class="ib" data-act="say" data-t="${esc(t)}" title="Prečítať nahlas">🔊</button>`;
const statusDot = id => `<span class="dot ${status(id)}" title="${{ new: 'nové', learning: 'učím sa', known: 'viem', weak: 'slabé – vracia sa' }[status(id)]}"></span>`;
const REG = { formal: 'Sie', informal: 'du', neutral: '' };
function applyTheme() { const t = S.settings.theme; if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t; }
const hello = () => { const h = new Date().getHours(); return h < 10 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend'; };

/* wrap German words so they can be tapped for translation */
function wordify(t) {
  return esc(t).replace(/([A-Za-zÄÖÜäöüß]+(?:[-’'][A-Za-zÄÖÜäöüß]+)*)/g, w => `<span class="w" data-w="${w}">${w}</span>`);
}

/* ================= router ================= */
let ROUTE = { name: 'home' };
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, ''); const [a, b, c] = h.split('/').map(decodeURIComponent);
  if (a === 'cat' && catById(b)) return { name: 'cat', catId: b, tab: c || 'phrases' };
  if (a === 'text' && textById(b)) return { name: 'text', textId: b, catId: textById(b).c.id };
  if (a === 'review') return { name: 'review', filter: b || '' };
  if (a === 'learn' && catById(b)) return { name: 'review', filter: 'learn:' + b, catId: b };
  if (a === 'grammar' && b && gramById(b)) return { name: 'gtopic', gid: b };
  if (a === 'grammar') return { name: 'grammar' };
  if (a === 'mistakes') return { name: 'mistakes' };
  if (a === 'words') return { name: 'words' };
  if (a === 'history') return { name: 'history' };
  if (a === 'settings') return { name: 'settings' };
  if (a === 'cats') return { name: 'cats' };
  if (a === 'drive') return { name: 'home' };
  if (a === 'stats') return { name: 'stats' };
  return { name: 'home' };
}
const go = h => { location.hash = h; };
window.addEventListener('hashchange', () => { ROUTE = parseRoute(); if (ROUTE.name !== 'review') RV = null; render(); scrollTo(0, 0); window.onScreenChange?.(); });

/* ================= render ================= */
function render() { renderSide(); renderTop(); renderMain(); renderBnav(); }
function navLink(h, ico, label, on, badge) { return `<a class="nav ${on ? 'on' : ''}" href="#/${h}"><span class="ico">${ico}</span><span>${label}</span>${badge ? `<span class="badge">${badge}</span>` : ''}</a>`; }
function renderSide() {
  const r = ROUTE.name, due = dueIds().length, t = today();
  $('#side').innerHTML = iconize(`<a class="brand" href="#/"><span class="flag"><i></i><i></i><i></i></span>Nemčina</a>
  ${navLink('', '🎙️', 'Hovoriť s Lenou', r === 'home')}
  ${navLink('stats', '📈', 'Progres', r === 'stats')}
  ${navLink('review', '🔁', 'Kartičky', r === 'review' && !(ROUTE.filter || '').startsWith('learn'), due || '')}
  ${navLink('grammar', '🧩', 'Gramatika', r === 'grammar' || r === 'gtopic')}
  ${navLink('mistakes', '🎯', 'Moje chyby', r === 'mistakes', S.mistakes.filter(m => isDue(m.id)).length || '')}
  ${navLink('words', '📒', 'Môj slovník', r === 'words')}
  ${navLink('history', '🗣️', 'Rozhovory', r === 'history')}
  ${GROUPS.map(g => `<div class="side-h">${g.icon} ${g.sk}</div>` + CATS.filter(c => c.group === g.id).map(c => {
    const p = catProgress(c); return `<a class="nav cat ${ROUTE.catId === c.id ? 'on' : ''}" href="#/cat/${c.id}"><span class="ico">${c.icon}</span><span>${esc(c.sk)}</span><span class="pbar"><b style="width:${p.pct}%"></b></span></a>`;
  }).join('')).join('')}
  <div style="height:8px"></div>
  ${navLink('settings', '⚙️', 'Nastavenia', r === 'settings')}
  <div class="side-foot">${ic('flame')} ${streak()} dní v rade · dnes ${t.xp}/${S.settings.goal} XP<div id="cloudline">${window.cloudLine?.() || ''}</div></div>`);
}
function renderBnav() {
  const r = ROUTE.name, due = dueIds().length, live = window.LV && window.LV.state !== 'off';
  const a = (h, ico, l, on, b) => `<a href="#/${h}" class="${on ? 'on' : ''}"><span class="ico">${ico}</span>${l}${b ? `<span class="badge">${b}</span>` : ''}</a>`;
  $('#bnav').innerHTML = iconize(a('', '🎙️', 'Lena', r === 'home') + a('cats', '📚', 'Témy', ['cats', 'cat', 'text'].includes(r)) +
    `<button class="fab voice ${live ? 'live' : ''}" data-act="voice" aria-label="Hlasový rozhovor">${live ? '⏹' : '🎙️'}</button>` +
    a('mistakes', '🎯', 'Chyby', r === 'mistakes', S.mistakes.filter(m => isDue(m.id)).length || '') + a('settings', '☰', 'Viac', ['settings', 'stats', 'words', 'history', 'grammar', 'gtopic', 'review'].includes(r)));
}
function crumbs() {
  const r = ROUTE, c = catById(r.catId);
  const C = { home: '<b>Hovoriť s Lenou</b>', stats: '<b>Progres</b>', cats: '<b>Témy</b>', review: (r.filter || '').startsWith('learn') ? `${esc(c?.sk)} › <b>Učenie</b>` : '<b>Opakovanie</b>', grammar: '<b>Gramatika</b>', mistakes: '<b>Moje chyby</b>', words: '<b>Môj slovník</b>', history: '<b>Rozhovory</b>', settings: '<b>Viac</b>' };
  if (r.name === 'cat') return `${c.icon} <b>${esc(c.de)}</b> <span class="mut">· ${esc(c.sk)}</span>`;
  if (r.name === 'text') return `<a href="#/cat/${c.id}/texts">${esc(c.de)}</a> › <b>${esc(textById(r.textId).t.title_de)}</b>`;
  if (r.name === 'gtopic') return `<a href="#/grammar">Gramatika</a> › <b>${esc(gramById(r.gid).title_sk)}</b>`;
  return C[r.name] || '';
}
function renderTop() {
  const ctx = screenContext();
  const live = window.LV && window.LV.state !== 'off';
  $('#top').innerHTML = iconize(`<div class="crumb">${crumbs()}</div>
  <div class="ctxchip" title="Lena začne rozhovor tu">📍 ${esc(ctx.label)}</div>
  <div class="talk"><button class="btn voice ${live ? (window.LV.state === 'connecting' ? 'connecting' : 'live') : 'pri'}" data-act="voice" title="Hlasový rozhovor s Lenou o tom, čo máš na obrazovke">${live ? '⏹' : '🎙️'}<span class="lbl">${live ? 'Ukončiť' : 'Hovoriť'}</span></button></div>`);
  renderBnav();
}
function renderMain() {
  const V = { home: () => window.vDrive?.() || '', stats: vHome, cats: vCats, cat: vCat, text: vText, review: vReview, grammar: vGrammar, gtopic: vGTopic, mistakes: vMistakes, words: vWords, history: vHistory, settings: vSettings, drive: () => window.vDrive?.() || '' }[ROUTE.name] || vHome;
  $('#main').innerHTML = iconize(V());
  if (ROUTE.name === 'review') rvAfter();
  document.body.classList.toggle('driving', ROUTE.name === 'home');
  window.afterRender?.();
}

/* ================= screen context – tells the AI where the user is ================= */
function lastMistakes(n = 8, filt = () => true) { return S.mistakes.filter(filt).slice(0, n).map(m => `- „${m.wrong}“ → „${m.right}“ (${topicName(m.topic)})`).join('\n'); }
function weakItems(filt = () => true, n = 12) {
  return Object.keys(S.srs).filter(id => ITEMS[id] && ITEMS[id].kind !== 'mistake' && filt(ITEMS[id]) && (status(id) === 'weak' || S.srs[id].bad > 0 && status(id) !== 'known'))
    .slice(0, n).map(id => `- ${ITEMS[id].de} = ${ITEMS[id].sk}`).join('\n');
}
function screenContext() {
  const r = ROUTE, c = catById(r.catId);
  const wt = weakTopics().slice(0, 4).map(([t, n]) => `${topicName(t)} (${t})`).join(', ');
  const base = `\nSchwache Grammatikthemen des Lerners: ${wt || 'noch keine Daten'}.\nLetzte Fehler des Lerners (greife sie auf, wenn es passt):\n${lastMistakes(6) || '- noch keine'}`;
  let label = 'Prehľad', text = '', start = '';
  if (r.name === 'cat' && c) {
    const tab = { phrases: 'Frázy', vocab: 'Slovíčka', texts: 'Texty', scenarios: 'Scenáre' }[r.tab] || '';
    label = `${c.sk} · ${tab}`;
    const ph = catItems(c).filter(i => i.kind === 'phrase').slice(0, 26).map(p => `- ${p.de} = ${p.sk}`).join('\n');
    const vo = c.vocab.map(v => `${v.de}${v.pl ? ' (' + v.pl + ')' : ''} = ${v.sk}`).join('; ');
    text = `Der Lerner ist im Themenbereich „${c.de}“ (${c.sk}), Reiter ${tab}.\nWendungen auf dem Bildschirm:\n${ph}\nWortschatz: ${vo}\nSchwache Wendungen in diesem Thema:\n${weakItems(i => i.cat === c.id) || '- keine'}`;
    start = `Beginne ein natürliches Gespräch zum Thema „${c.de}“ und baue Wendungen vom Bildschirm ein, damit der Lerner sie aktiv benutzt. Wenn er Wendungen falsch benutzt, wiederhole sie richtig.`;
  } else if (r.name === 'text') {
    const { t } = textById(r.textId);
    label = `Text: ${t.title_de}`;
    text = `Der Lerner liest gerade den Text „${t.title_de}“ (${t.title_sk}) aus dem Thema „${c.de}“:\n${t.lines.map(l => (l.who ? l.who + ': ' : '') + l.de).join('\n')}`;
    start = 'Sprich mit dem Lerner über diesen Text: stelle Verständnisfragen, lass ihn den Inhalt mit eigenen Worten wiedergeben, frage nach seiner Meinung und eigenen Erfahrungen. Benutze den Wortschatz des Textes.';
  } else if (r.name === 'review' && RV) {
    const cur = RV.cur && ITEMS[RV.cur];
    const failed = RV.failed.map(id => ITEMS[id]).filter(Boolean).map(i => i.kind === 'mistake' ? `- ${i.right} (statt: ${i.wrong})` : `- ${i.de} = ${i.sk}`).join('\n');
    label = r.filter.startsWith('learn') ? `Učenie: ${c?.sk}` : 'Opakovanie';
    text = `Der Lerner wiederholt gerade Karteikarten (Spaced Repetition).${cur ? `\nAktuelle Karte: ${cur.kind === 'mistake' ? cur.right + ' (Fehler war: ' + cur.wrong + ')' : cur.de + ' = ' + cur.sk}` : ''}\nIn dieser Runde nicht gewusst:\n${failed || '- nichts'}\nDiese Runde: ${RV.queue.slice(0, 15).map(id => ITEMS[id]?.de || ITEMS[id]?.right).filter(Boolean).join(' | ')}`;
    start = 'Übe die nicht gewussten und aktuellen Wendungen im Gespräch: stelle Fragen, bei denen der Lerner genau diese Wendungen benutzen muss (z. B. „Wie würdest du sagen …?“, kurze Rollenspiele).';
  } else if (r.name === 'gtopic') {
    const g = gramById(r.gid);
    label = `Gramatika: ${g.title_sk}`;
    text = `Der Lerner lernt gerade das Grammatikthema „${g.title_de}“ (${g.title_sk}).\nBeispiele: ${g.examples.map(e => e.de.replace(/<[^>]+>/g, '')).join(' | ')}\nTypische Fehler: ${g.mistakes.map(m => m.wrong + ' → ' + m.right).join(' | ')}\nFrühere Fehler des Lerners zu diesem Thema:\n${lastMistakes(8, m => m.topic === g.id) || '- keine'}`;
    start = `Trainiere genau dieses Grammatikthema im Gespräch: stelle Fragen, deren natürliche Antwort diese Struktur verlangt. Korrigiere Fehler in diesem Thema immer explizit und kurz (Slowakisch erlaubt), lobe richtige Formen.`;
  } else if (r.name === 'home' && window.driveContext) {
    ({ label, text, start } = window.driveContext({ weakItems, lastMistakes }));
  } else if (r.name === 'grammar') {
    label = 'Gramatika'; text = 'Der Lerner ist in der Grammatikübersicht.'; start = `Führe ein lockeres Gespräch, in dem die schwachen Grammatikthemen des Lerners (${wt || 'Kasus, Satzstellung'}) oft vorkommen.`;
  } else if (r.name === 'mistakes') {
    label = 'Moje chyby'; text = `Der Lerner sieht die Liste seiner Fehler:\n${lastMistakes(15)}`; start = 'Übe gezielt diese Fehler: Situationen schaffen, in denen der Lerner die richtigen Formen benutzen muss.';
  } else if (r.name === 'words') {
    label = 'Môj slovník'; text = `Eigene Wörter des Lerners:\n${S.words.slice(0, 30).map(w => `- ${w.de} = ${w.sk}`).join('\n') || '- noch keine'}`; start = 'Benutze diese Wörter im Gespräch und lass den Lerner sie aktiv verwenden.';
  } else {
    label = 'Voľný rozhovor';
    const recent = Object.entries(S.visited).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => catById(id)?.de).filter(Boolean).join(', ');
    text = `Der Lerner ist auf der Startseite. Zuletzt geübte Themen: ${recent || '—'}.\nSchwache Wendungen:\n${weakItems() || '- keine'}`;
    start = 'Führe ein freies Gespräch über den Alltag und die Arbeit des Lerners (er arbeitet im Bereich Finanzen/Controlling). Wiederhole dabei schwache Wendungen und frühere Fehler.';
  }
  if (TALK.scenario) {
    const sc = scenById(TALK.scenario);
    if (sc) { label = `Scéna: ${sc.s.title_sk}`; start = `ROLLENSPIEL: ${sc.s.ai_role}\nZiel des Lerners: ${sc.s.goal_sk}\nBleib in deiner Rolle, sprich natürlich. Wenn das Ziel erreicht ist, beende die Szene und gib ein kurzes Feedback (was gut war, 2–3 Verbesserungen).`; }
  }
  return { label, text: text + base, start };
}
const TALK = { scenario: null };

/* ================= views ================= */
function vHome() {
  const t = today(), due = dueIds().length, goal = S.settings.goal, pct = Math.min(100, Math.round(t.xp / goal * 100));
  const known = Object.keys(S.srs).filter(id => ITEMS[id] && status(id) === 'known').length;
  const week = Array.from({ length: 7 }, (_, i) => S.act[dayKey(new Date(Date.now() - i * DAY))]?.min || 0).reduce((a, b) => a + b, 0);
  const wt = weakTopics()[0];
  const recentCat = Object.entries(S.visited).sort((a, b) => b[1] - a[1])[0]?.[0];
  const focus = catById(recentCat) || CATS.find(c => catProgress(c).pct < 100) || CATS[0];
  const unread = focus ? catTexts(focus).find(x => !S.read[x.id]) : null;
  const sc = focus?.scenarios[Math.floor((Date.now() / DAY) % (focus?.scenarios.length || 1))];
  const heat = Array.from({ length: 28 }, (_, i) => { const x = S.act[dayKey(new Date(Date.now() - (27 - i) * DAY))]?.xp || 0; return `<i class="${x >= goal ? 'l3' : x >= goal / 2 ? 'l2' : x > 0 ? 'l1' : ''}" title="${fmtD(dayKey(new Date(Date.now() - (27 - i) * DAY)))}: ${x} XP"></i>`; }).join('');
  const recs = [];
  if (due) recs.push(`<a class="card catcard" href="#/review"><span class="em">🔁</span><b>Zopakuj ${due} ${due === 1 ? 'kartu' : due < 5 ? 'karty' : 'kariet'}</b><span class="mut small">Spaced repetition – vraciame sa k tomu, čo zabúdaš, presne vtedy, keď to treba.</span></a>`);
  if (focus) recs.push(`<a class="card catcard" href="#/cat/${focus.id}"><span class="em">${focus.icon}</span><b>Téma: ${esc(focus.sk)}</b><span class="mut small">${catProgress(focus).known}/${catProgress(focus).total} vieš. Otvor a stlač mikrofón.</span></a>`);
  if (wt) recs.push(`<a class="card catcard" href="#/grammar/${wt[0]}"><span class="em">🧩</span><b>Gramatika: ${esc(topicName(wt[0]))}</b><span class="mut small">Tu robíš najviac chýb. Krátky výklad + cvičenia.</span></a>`);
  if (sc) recs.push(`<button class="card catcard" style="text-align:left" data-act="scen" data-id="${sc.id}" data-mode="voice"><span class="em">🎭</span><b>Scéna: ${esc(sc.title_sk)}</b><span class="mut small">${esc(sc.goal_sk)}</span></button>`);
  if (unread) recs.push(`<a class="card catcard" href="#/text/${unread.id}"><span class="em">📖</span><b>Čítaj: ${esc(unread.title_de)}</b><span class="mut small">${esc(unread.title_sk)} · klikni na slovo = preklad</span></a>`);
  return `<div class="hero"><div><h1>Progres</h1><p>Tvoj progres. Na ktorejkoľvek obrazovke stlač mikrofón – Lena vie, kde si, a začne rozhovor presne tam.</p></div>
    <div class="row"><div class="ring" style="--p:${pct}" data-l="${pct}%"></div><div class="stat"><b>${t.xp} XP</b><span>dnešný cieľ ${goal} XP</span></div></div></div>
  <div class="grid g4">
    <div class="card stat"><b>${due}</b><span>na opakovanie</span></div>
    <div class="card stat"><b>🔥 ${streak()}</b><span>dní v rade</span></div>
    <div class="card stat"><b>${known}</b><span>fráz a slov viem</span></div>
    <div class="card stat"><b>${Math.round(week)}</b><span>min. rozhovoru (7 dní)</span></div>
  </div>
  <div class="section card"><div class="card-h"><h3>🧠 Čo si Lena pamätá</h3><span class="mut small">${S.profile.facts.length} faktov · ${S.sessions.length} rozhovorov · ${Object.keys(S.srs).length} kartičiek · ${S.mistakes.length} chýb</span></div>
    <p class="mut small" style="margin-top:0">Toto Lena dostane na začiatku každého rozhovoru – spolu s tvojimi chybami, slabou gramatikou, kartičkami na opakovanie a zhrnutím posledných rozhovorov. Povedz jej „zapamätaj si…“ a pridá sem nový fakt.</p>
    ${S.profile.facts.length ? `<div class="facts">${S.profile.facts.map((f, i) => `<span class="fact">${esc(f.t)}<button class="ib" data-act="forget" data-i="${i}" aria-label="Zabudnúť">✕</button></span>`).join('')}</div>` : '<p class="small mut">Zatiaľ nič – Lena si začne zapisovať po prvom rozhovore.</p>'}</div>
  <div class="section"><h2>Dnes odporúčam</h2><div class="grid g3">${recs.slice(0, 6).join('')}</div></div>
  <div class="section grid g2">
    <div class="card"><div class="card-h"><h3>Posledných 28 dní</h3><span class="mut small">tmavšie = viac XP</span></div><div class="heat">${heat}</div></div>
    <div class="card"><div class="card-h"><h3>Posledné chyby</h3><a class="btn sm" href="#/mistakes">Všetky</a></div>
      ${S.mistakes.length ? S.mistakes.slice(0, 4).map(m => `<div class="small" style="margin:6px 0"><span class="mut" style="text-decoration:line-through">${esc(m.wrong)}</span> → <b style="color:var(--green)">${esc(m.right)}</b></div>`).join('') : '<p class="mut small">Zatiaľ žiadne. Chyby z rozhovorov sa sem ukladajú automaticky a vrátia sa v opakovaní.</p>'}</div>
  </div>
  ${catGrid()}`;
}
function catGrid() {
  return GROUPS.map(g => `<div class="section"><h2>${g.icon} ${g.sk}</h2><div class="grid g3">${CATS.filter(c => c.group === g.id).map(c => {
    const p = catProgress(c);
    return `<a class="card catcard" href="#/cat/${c.id}"><div class="row"><span class="em">${c.icon}</span><div><div class="de">${esc(c.de)}</div><div class="mut small">${esc(c.sk)}</div></div></div>
      <div class="bar"><b style="width:${p.total ? p.known / p.total * 100 : 0}%"></b><i style="width:${p.total ? p.learning / p.total * 100 : 0}%"></i></div>
      <div class="legend"><span style="--c:var(--green)">${p.known} viem</span><span style="--c:var(--gold)">${p.learning} učím sa</span><span style="--c:var(--line)">${p.total - p.known - p.learning} nové</span></div></a>`;
  }).join('')}</div></div>`).join('');
}
function vCats() { return `<div class="hero"><div><h1>Témy</h1><p>Frázy, slovíčka, texty a scény podľa oblastí.</p></div></div>${catGrid()}`; }

function vCat() {
  const c = catById(ROUTE.catId); S.visited[c.id] = Date.now(); save();
  const its = catItems(c), ph = its.filter(i => i.kind === 'phrase'), vo = its.filter(i => i.kind === 'vocab'), tx = catTexts(c), p = catProgress(c);
  const tab = ROUTE.tab;
  const T = (k, l, n) => `<a class="tab ${tab === k ? 'on' : ''}" href="#/cat/${c.id}/${k}">${l}<span class="n">${n}</span></a>`;
  let body = '';
  if (tab === 'phrases' || tab === 'vocab') {
    const list = tab === 'phrases' ? ph : vo;
    body = `<div class="row wrap" style="margin-bottom:12px"><button class="btn pri" data-act="cat-quiz" data-cat="${c.id}">🧠 Kvíz s Lenou</button><button class="btn" data-act="cat-listen" data-cat="${c.id}">🎧 Počúvať</button><a class="btn" href="#/learn/${c.id}">🔁 Kartičky</a>
      ${tab === 'phrases' ? `<button class="btn ghost" data-act="gen-phrases" data-cat="${c.id}">✨ Ďalšie frázy</button>` : ''}</div>
      <div class="list">${list.map(itemRow).join('')}</div>`;
  } else if (tab === 'texts') {
    body = `<div class="row" style="margin-bottom:12px"><button class="btn" data-act="gen-text" data-cat="${c.id}">✨ Nový text od AI</button><span class="mut small">Ťukni na slovo → preklad.</span></div>
    <div class="grid g2">${tx.map(t => `<a class="card catcard" href="#/text/${t.id}"><span class="tag ${S.read[t.id] ? '' : 'gold'}">${S.read[t.id] ? '✓ prečítané ' + fmtD(S.read[t.id]) : t.type === 'dialog' ? 'dialóg' : t.type === 'email' ? 'e-mail' : 'text'} · ${esc(t.level || 'B1')}${t.ai ? ' · AI' : ''}</span><div class="de">${esc(t.title_de)}</div><div class="mut small">${esc(t.title_sk)}</div></a>`).join('')}</div>`;
  } else if (tab === 'scenarios') {
    body = `<p class="mut">Hraj rolu v reálnej situácii. Lena hrá druhú stranu, opravuje ťa a na konci dá spätnú väzbu.</p>
    <div class="grid g2">${c.scenarios.map(s => `<div class="card scen"><span class="tag">${esc(s.level || 'B1')}</span><h3>${esc(s.title_sk)}</h3><div class="goal">🎯 ${esc(s.goal_sk)}</div>
      <div class="row" style="margin-top:6px"><button class="btn pri sm" data-act="scen" data-id="${s.id}">🎙️ Zahrať si scénu</button></div></div>`).join('')}</div>`;
  }
  return `<div class="hero"><div><h1>${c.icon} ${esc(c.de)}</h1><p>${esc(c.sk)} – ${esc(c.desc || '')}</p></div>
    <div class="row"><div class="ring" style="--p:${p.pct}" data-l="${p.pct}%"></div><div class="stat"><b>${p.known}/${p.total}</b><span>vieš</span></div></div></div>
  <div class="tabs">${T('phrases', 'Frázy', ph.length)}${T('vocab', 'Slovíčka', vo.length)}${T('texts', 'Texty', tx.length)}${T('scenarios', 'Scény', c.scenarios.length)}</div>${body}`;
}
function itemRow(i) {
  return `<div class="li" data-id="${i.id}">${statusDot(i.id)}<div class="body"><div class="de">${esc(i.de.replace(/\|/g, ''))}${i.pl ? ` <span class="pl">${esc(i.pl)}</span>` : ''}${REG[i.reg] ? `<span class="reg">${REG[i.reg]}</span>` : ''}${i.ai ? '<span class="reg">AI</span>' : ''}</div>
    <div class="sk">${esc(i.sk)}</div>${i.note ? `<div class="note">${esc(i.note)}</div>` : ''}${i.ex ? `<div class="sk small" style="font-style:italic">„${esc(i.ex)}“</div>` : ''}</div>
    <div class="acts">${spk(i.de)}<button class="ib" data-act="known" data-id="${i.id}" title="Už viem – nedávaj mi to">✓</button><button class="ib" data-act="again" data-id="${i.id}" title="Pridať do opakovania">↺</button></div></div>`;
}

let SHOW_TR = false;
function vText() {
  const { t, c } = textById(ROUTE.textId); S.visited[c.id] = Date.now();
  const saved = new Set(S.words.map(w => norm(w.de).split(' ').pop()));
  const lines = t.lines.map((l, i) => `<div class="line ${l.who ? '' : 'plain'} ${SHOW_TR ? '' : 'notr'}" data-i="${i}"><div class="who">${esc(l.who || '')}</div>
    <div><div class="txt">${wordify(l.de).replace(/data-w="([^"]+)">/g, (m, w) => saved.has(w.toLowerCase()) ? `data-w="${w}" data-s="1">` : m).replace(/class="w" data-w="([^"]+)" data-s="1"/g, 'class="w saved" data-w="$1"')}</div><div class="tr">${esc(l.sk)}</div></div>
    <div class="row" style="gap:0">${spk(l.de)}<button class="ib" data-act="tr-line" title="Preklad vety">SK</button></div></div>`).join('');
  return `<div class="hero"><div><span class="tag">${esc(t.level || 'B1')} · ${t.type === 'dialog' ? 'dialóg' : t.type === 'email' ? 'e-mail' : 'text'}</span><h1 style="margin-top:6px">${esc(t.title_de)}</h1><p>${esc(t.title_sk)}</p></div>
    <div class="row wrap"><button class="btn" data-act="say-all">🔊 Prečítať celé</button><button class="btn" data-act="tr-all">${SHOW_TR ? 'Skryť preklad' : 'Zobraziť preklad'}</button></div></div>
  <p class="mut small">Tip: najprv si text prečítaj bez prekladu, neznáme slovo klikni (preklad + uloženie do slovníka). Potom si ho vypočuj a nahlas opakuj po vetách (shadowing). Nakoniec 🎙️ – porozprávaj sa o ňom s AI.</p>
  <div class="reader">${lines}</div>
  <div class="row wrap" style="margin-top:16px"><button class="btn gold" data-act="text-done" data-id="${t.id}">${S.read[t.id] ? '✓ Prečítané' : 'Označiť ako prečítané (+5 XP)'}</button><button class="btn pri" data-act="voice">🎙️ Porozprávať sa o texte</button><a class="btn ghost" href="#/cat/${c.id}/texts">← Späť na texty</a></div>`;
}

/* ---------- review / learning session ---------- */
let RV = null;
function startReview(filter) {
  let queue = [];
  if (filter.startsWith('learn:')) {
    const c = catById(filter.slice(6));
    const due = catItems(c).filter(i => isDue(i.id)).map(i => i.id);
    const left = Math.max(0, S.settings.newPerDay);
    const nw = catItems(c).filter(i => status(i.id) === 'new').slice(0, left).map(i => i.id);
    queue = [...due, ...nw];
  } else if (filter === 'mistakes') queue = dueIds(i => i.kind === 'mistake');
  else if (filter === 'weak') queue = Object.keys(S.srs).filter(id => ITEMS[id] && status(id) === 'weak');
  else queue = dueIds();
  RV = { filter, queue: queue.slice(0, 60), done: 0, total: Math.min(queue.length, 60), cur: null, shown: false, typed: '', failed: [], stats: [0, 0, 0, 0] };
  RV.cur = RV.queue[0] || null;
}
function vReview() {
  if (!RV || RV.filter !== ROUTE.filter) startReview(ROUTE.filter);
  const learn = ROUTE.filter.startsWith('learn:'), c = catById(ROUTE.catId);
  if (!RV.cur) {
    const did = RV.done;
    return `<div class="fc-wrap"><div class="fc"><div style="font-size:46px">${did ? '🎉' : '✨'}</div><h2>${did ? 'Hotovo, výborne!' : 'Nič na opakovanie'}</h2>
      <p class="mut">${did ? `Prešiel si ${did} kariet · ${RV.stats[0]}× znova, ${RV.stats[2] + RV.stats[3]}× dobre.${RV.failed.length ? ' Precvič si ťažké frázy v rozhovore – AI ich použije.' : ''}` : 'Všetko, čo sa učíš, je naplánované na neskôr. Nauč sa nové frázy v niektorej téme alebo si pohovor s AI.'}</p>
      <div class="row wrap" style="justify-content:center">${RV.failed.length ? '<button class="btn pri" data-act="voice">🎙️ Precvičiť v rozhovore</button>' : ''}${learn ? `<a class="btn" href="#/cat/${c.id}">← ${esc(c.sk)}</a>` : '<a class="btn" href="#/cats">Vybrať tému</a>'}<a class="btn ghost" href="#/">Prehľad</a></div></div></div>`;
  }
  const it = ITEMS[RV.cur], s = status(it.id), nw = s === 'new';
  const pct = RV.total ? Math.round(RV.done / RV.total * 100) : 0;
  let q, a, hint = '', kind;
  if (it.kind === 'mistake') { kind = 'Oprav svoju chybu'; q = `<span style="color:var(--red)">${esc(it.wrong)}</span>`; a = it.right; hint = it.explain; }
  else { kind = (nw ? 'Nové · ' : '') + (it.kind === 'vocab' || it.kind === 'word' ? 'Ako sa povie po nemecky? (podst. meno aj so členom)' : 'Povedz po nemecky'); q = esc(it.sk); a = it.de.replace(/\|/g, ''); hint = it.note || ''; }
  const typed = RV.shown && RV.typed ? diffHTML(RV.typed, a) : '';
  return `<div class="fc-wrap"><div class="progress-top"><span>${RV.done}/${RV.total}</span><div class="bar"><b style="width:${pct}%"></b></div><span>${learn ? esc(c.sk) : RV.filter === 'mistakes' ? 'chyby' : 'všetko'}</span></div>
  <div class="fc"><div class="kind">${kind}</div><div class="q">${q}</div>
   ${RV.shown ? `<div class="a">${esc(a)} ${spk(a)}</div>${typed ? `<div class="diff">${typed}</div>` : ''}${hint ? `<div class="hint">💡 ${esc(hint)}</div>` : ''}${it.ex ? `<div class="hint">„${esc(it.ex)}“</div>` : ''}`
   : `<div class="hint">Povedz odpoveď nahlas.</div>${RV.typed ? `<div class="hint"><b>${esc(RV.typed)}</b></div>` : ''}
      <div class="row" style="justify-content:center"><button class="btn pri" data-act="rv-mic">🎤 Povedať odpoveď</button><button class="btn" data-act="rv-show">Ukázať</button></div>`}
  </div>
  ${RV.shown ? `<div class="rate"><button class="btn r0" data-act="rate" data-q="0">Znova<small>&lt;10 min</small></button><button class="btn" data-act="rate" data-q="1">Ťažké<small>${ivLabel(it.id, 1)}</small></button><button class="btn" data-act="rate" data-q="2">Dobre<small>${ivLabel(it.id, 2)}</small></button><button class="btn r3" data-act="rate" data-q="3">Ľahké<small>${ivLabel(it.id, 3)}</small></button></div>
   <p class="mut small" style="text-align:center">Klávesy 1–4 · ${nw ? 'nová karta' : 'opakované ' + (st(it.id)?.ok || 0) + '×'}</p>` : ''}</div>`;
}
function ivLabel(id, q) { const s = st(id) || { iv: 0, ef: 2.5, reps: 0 }; let iv; if (q === 1) iv = s.reps === 0 ? 1 : Math.max(1, Math.round(s.iv * 1.2)); if (q === 2) iv = s.reps === 0 ? 1 : s.reps === 1 ? 3 : Math.round(Math.max(s.iv, 1) * s.ef); if (q === 3) iv = s.reps === 0 ? 4 : Math.round(Math.max(s.iv, 1) * s.ef * 1.3); return iv < 30 ? iv + ' d' : Math.round(iv / 30) + ' mes'; }
function rvAfter() { const i = $('#rvIn'); if (i) { i.value = RV.typed || ''; i.focus(); } }
function rvShow() { const i = $('#rvIn'); RV.typed = i ? i.value.trim() : RV.typed; RV.shown = true; renderMain(); window.onScreenChange?.(); }
function rvRate(q) {
  const id = RV.cur; rate(id, q); RV.stats[q]++;
  RV.queue.shift();
  if (q === 0) { RV.queue.splice(Math.min(4, RV.queue.length), 0, id); if (!RV.failed.includes(id)) RV.failed.push(id); } else RV.done++;
  if (q === 0) RV.total = Math.max(RV.total, RV.done + RV.queue.length);
  RV.cur = RV.queue[0] || null; RV.shown = false; RV.typed = '';
  renderMain(); renderSide(); renderBnav(); window.onScreenChange?.();
}
function diffHTML(a, b) { // word diff typed vs correct
  const A = a.split(/\s+/), B = b.split(/\s+/), n = A.length, m = B.length, L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = norm(A[i]) === norm(B[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0, out = [];
  while (i < n && j < m) { if (norm(A[i]) === norm(B[j])) { out.push(esc(B[j])); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) out.push(`<del>${esc(A[i++])}</del>`); else out.push(`<ins>${esc(B[j++])}</ins>`); }
  while (i < n) out.push(`<del>${esc(A[i++])}</del>`); while (j < m) out.push(`<ins>${esc(B[j++])}</ins>`);
  const same = norm(a) === norm(b);
  return (same ? '✅ ' : 'Povedal si: ') + out.join(' ');
}

/* ---------- grammar ---------- */
function gramStats(g) { const v = S.gram[g.id] || {}; const total = g.exercises.length + (S.genex[g.id] || []).length; const done = Object.keys(v.done || {}).length; const errs = S.mistakes.filter(m => m.topic === g.id).length; return { total, done, errs, pct: total ? Math.round(done / total * 100) : 0 }; }
function vGrammar() {
  const wt = weakTopics().map(x => x[0]);
  const sorted = [...GRAM].sort((a, b) => { const ia = wt.indexOf(a.id), ib = wt.indexOf(b.id); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
  return `<div class="hero"><div><h1>🧩 Gramatika</h1><p>Len to, čo potrebuješ pri rozprávaní. Témy s tvojimi chybami sú hore – poradie sa mení podľa toho, čo ti robí problém v rozhovoroch.</p></div></div>
  <div class="grid g3">${sorted.map(g => { const s = gramStats(g); return `<a class="card catcard" href="#/grammar/${g.id}"><div class="row"><span class="em">${g.icon || '🧩'}</span><div><div class="de" style="font-size:16px">${esc(g.title_sk)}</div><div class="mut small">${esc(g.title_de)} · ${esc(g.level || '')}</div></div></div>
    <div class="bar"><b style="width:${s.pct}%"></b></div><div class="legend"><span style="--c:var(--green)">${s.done}/${s.total} cvičení</span>${s.errs ? `<span style="--c:var(--red)">${s.errs} chýb v rozhovoroch</span>` : ''}</div></a>`; }).join('')}</div>`;
}
function vGTopic() {
  const g = gramById(ROUTE.gid), v = S.gram[g.id] || {}, exs = [...g.exercises, ...(S.genex[g.id] || [])];
  const myErr = S.mistakes.filter(m => m.topic === g.id).slice(0, 8);
  return `<div class="hero"><div><span class="tag">${esc(g.level || '')}</span><h1 style="margin-top:6px">${g.icon || ''} ${esc(g.title_sk)}</h1><p>${esc(g.why_sk || '')}</p></div>
    <div class="row wrap"><button class="btn pri" data-act="voice">🎙️ Precvičiť s Lenou</button></div></div>
  <div class="grid g2" style="align-items:start">
   <div class="card gram-explain"><h3>Výklad</h3>${g.explain}</div>
   <div class="grid">
    <div class="card"><h3>Príklady</h3>${g.examples.map(e => `<div style="margin:8px 0"><div class="row" style="gap:4px"><span style="font-size:16px">${e.de}</span>${spk(e.de)}</div><div class="mut small">${esc(e.sk)}</div></div>`).join('')}</div>
    <div class="card"><h3>Typické chyby</h3>${g.mistakes.map(m => `<div style="margin:8px 0"><span style="color:var(--red);text-decoration:line-through">${esc(m.wrong)}</span><br><b style="color:var(--green)">${esc(m.right)}</b><div class="mut small">${esc(m.why)}</div></div>`).join('')}</div>
    ${myErr.length ? `<div class="card"><h3>Tvoje chyby z rozhovorov</h3>${myErr.map(m => `<div class="small" style="margin:6px 0"><span style="color:var(--red);text-decoration:line-through">${esc(m.wrong)}</span> → <b style="color:var(--green)">${esc(m.right)}</b><div class="mut">${esc(m.explain)}</div></div>`).join('')}</div>` : ''}
   </div>
  </div>
  <div class="section"><div class="card-h"><h2>Cvičenia</h2><div class="row"><button class="btn sm" data-act="gen-ex" data-g="${g.id}">✨ Nové cvičenia od AI${myErr.length ? ' (na tvoje chyby)' : ''}</button><button class="btn sm ghost" data-act="ex-reset" data-g="${g.id}">Od začiatku</button></div></div>
   <div class="list" id="exlist">${exs.map((e, i) => { const ok = v.done?.[i]; const [pre, post] = e.q.split('___'); return `<div class="ex ${ok ? 'ok' : ''}" data-i="${i}"><div class="q">${i + 1}. ${esc(pre)}<span class="gap">${ok ? esc(e.a[0]) : '…'}</span>${esc(post || '')}</div><div class="mut small">${esc(e.sk || '')}</div>
     <div class="exbtns">${ok ? '<span class="fb">✓ vedel som</span>' : `<button class="btn sm" data-act="ex-show" data-i="${i}">Ukázať odpoveď</button>`}</div></div>`; }).join('')}</div>
   <p class="mut small">Povedz si odpoveď nahlas, potom ju odkry. Čo nevieš, ide medzi chyby a vráti sa v opakovaní.</p></div>`;
}
function checkEx(input) {
  const g = gramById(ROUTE.gid), i = +input.dataset.ex, e = [...g.exercises, ...(S.genex[g.id] || [])][i], row = input.closest('.ex');
  const val = input.value.trim(); if (!val) return;
  const v = S.gram[g.id] || (S.gram[g.id] = { ok: 0, bad: 0, done: {} });
  const ok = e.a.some(a => norm(a) === norm(val));
  row.classList.toggle('ok', ok); row.classList.toggle('bad', !ok);
  if (ok) { v.ok++; v.done[i] = true; input.readOnly = true; row.querySelector('.fb').textContent = '✓ správne'; xp(2); const nx = $$('#exlist input:not([readonly])').find(x => +x.dataset.ex > i); nx?.focus(); }
  else { v.bad++; row.querySelector('.fb').innerHTML = `✗ správne: <b>${esc(e.a[0])}</b>${e.hint ? ' · ' + esc(e.hint) : ''}`; addMistake({ wrong: e.q.replace('___', val), right: e.q.replace('___', e.a[0]), explain: e.hint || '', topic: g.id }, 'grammar'); }
  v.last = Date.now(); save(); renderSide();
}

/* ---------- mistakes, words, history ---------- */
let MFILTER = '';
function vMistakes() {
  const topics = {}; S.mistakes.forEach(m => topics[m.topic || 'other'] = (topics[m.topic || 'other'] || 0) + 1);
  const list = S.mistakes.filter(m => !MFILTER || (m.topic || 'other') === MFILTER);
  const due = S.mistakes.filter(m => isDue(m.id)).length;
  return `<div class="hero"><div><h1>🎯 Moje chyby</h1><p>Všetko, čo si v rozhovoroch a cvičeniach povedal zle. Každá chyba je kartička – vracia sa, kým ju nebudeš hovoriť správne.</p></div>
   <div class="row wrap"><a class="btn gold" href="#/review/mistakes">▶ Opakovať chyby (${due})</a><button class="btn pri" data-act="voice">🎙️ Precvičiť v rozhovore</button></div></div>
  ${S.mistakes.length ? `<div class="row wrap" style="margin-bottom:12px"><button class="chip ${MFILTER ? '' : 'on'}" data-act="mfilter" data-t="">Všetky ${S.mistakes.length}</button>${Object.entries(topics).sort((a, b) => b[1] - a[1]).map(([t, n]) => `<button class="chip" data-act="mfilter" data-t="${t}" style="${MFILTER === t ? 'background:var(--ink);color:var(--bg)' : ''}">${esc(topicName(t))} ${n}</button>`).join('')}</div>
  <div class="list">${list.map(m => `<div class="mistake"><div class="wr">${esc(m.wrong)}</div><div class="ri">${esc(m.right)} ${spk(m.right)}</div><div class="ex2">${statusDot(m.id)} ${esc(m.explain)} · <span class="tag">${esc(topicName(m.topic))}</span>${m.n > 1 ? ` <span class="tag gold">${m.n}×</span>` : ''} · ${fmtD(m.at)} <button class="btn sm ghost" data-act="del-m" data-id="${m.id}">Zmazať</button></div></div>`).join('')}</div>`
  : `<div class="card empty"><div class="em">🌱</div><p>Zatiaľ žiadne chyby. Začni rozhovor – AI ti opraví chyby a uloží ich sem.</p></div>`}`;
}
let WQ = '';
function vWords() {
  const q = norm(WQ);
  const all = q ? Object.values(ITEMS).filter(i => i.kind !== 'mistake' && (norm(i.de).includes(q) || norm(i.sk).includes(q))).slice(0, 80) : S.words;
  return `<div class="hero"><div><h1>📒 Môj slovník</h1><p>Slová a frázy, ktoré si uložil pri čítaní alebo ich Lena uložila v rozhovore.</p></div>
</div>
</div></div>
  ${all.length ? `<div class="list">${all.map(i => itemRow(i).replace('<div class="acts">', `<div class="acts">${i.kind === 'word' ? `<button class="ib" data-act="del-w" data-id="${i.id}" title="Zmazať">🗑</button>` : ''}`) + '').join('')}</div>`
  : `<div class="card empty"><div class="em">📖</div><p>${q ? 'Nič sa nenašlo.' : 'Zatiaľ prázdne. Pri čítaní ťukni na slovo → „Do slovníka“, alebo povedz Lene „ulož si to“.'}</p></div>`}`;
}
function vHistory() {
  return `<div class="hero"><div><h1>🗣️ Rozhovory</h1><p>História rozhovorov s Lenou: zhrnutie, chyby a nové frázy.</p></div></div>
  ${S.sessions.length ? `<div class="grid">${S.sessions.slice(0, 50).map(s => `<div class="card"><div class="card-h"><h3>${s.kind === 'live' ? '🎙️' : '💬'} ${esc(s.ctx || 'Rozhovor')}</h3><span class="mut small">${fmtD(s.at)} · ${s.min ? Math.round(s.min) + ' min · ' : ''}${s.turns || 0} replík</span></div>
    ${s.summary ? `<p style="margin:0 0 8px">${esc(s.summary)}</p>` : ''}${(s.mistakes || []).length ? `<div class="small mut">Chyby: ${s.mistakes.map(m => `<span style="text-decoration:line-through">${esc(m.wrong)}</span> → <b style="color:var(--green)">${esc(m.right)}</b>`).join(' · ')}</div>` : ''}${(s.phrases || []).length ? `<div class="small mut" style="margin-top:4px">Nové frázy: ${s.phrases.map(p => esc(p.de)).join(' · ')}</div>` : ''}</div>`).join('')}</div>`
  : `<div class="card empty"><div class="em">🎙️</div><p>Zatiaľ žiadny rozhovor. Stlač mikrofón a začni hovoriť s Lenou.</p></div>`}`;
}
function vSettings() {
  const s = S.settings;
  const seg = (k, opts) => `<div class="seg">${opts.map(([v, l]) => `<button class="${String(s[k]) === String(v) ? 'on' : ''}" data-act="set" data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div>`;
  return `<div class="hero"><div><h1>☰ Viac</h1></div></div>
  <div class="grid g4 morelinks" style="margin-bottom:14px"><a class="card catcard" href="#/mistakes"><span class="em">🎯</span><b>Moje chyby</b></a><a class="card catcard" href="#/grammar"><span class="em">🧩</span><b>Gramatika</b></a><a class="card catcard" href="#/words"><span class="em">📒</span><b>Môj slovník</b></a><a class="card catcard" href="#/history"><span class="em">🗣️</span><b>Rozhovory</b></a></div>
  <h2 style="margin:18px 0 12px">⚙️ Nastavenia</h2>
  <div class="grid g2" style="align-items:start">
   <div class="card" id="cloudcard">${window.cloudCard?.() || ''}</div>
   <div class="card"><h3>Učenie</h3>
    <div class="field"><label>Denný cieľ (XP)</label>${seg('goal', [[20, '20'], [40, '40'], [80, '80'], [120, '120']])}</div>
    <div class="field"><label>Nových kariet naraz</label>${seg('newPerDay', [[6, '6'], [12, '12'], [20, '20']])}</div>
    <div class="field"><label>Koľko slovenčiny v rozhovore</label>${seg('skRatio', [['low', 'Takmer nič'], ['mid', 'Občas vysvetlí'], ['high', 'Viac pomoci']])}</div>
    <div class="field"><label>Rýchlosť čítania nahlas</label>${seg('rate', [[0.8, 'Pomaly'], [0.95, 'Normálne'], [1.1, 'Rýchlo']])}</div>
    <div class="field"><label>Hlas prehliadača (čítanie fráz)</label><select data-set="voiceName"><option value="">Automaticky (najlepší dostupný)</option>${VOICES.map(v => `<option ${v.name === s.voiceName ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></div>
    <div class="field"><label>Vzhľad</label>${seg('theme', [['auto', 'Automaticky'], ['light', 'Svetlý'], ['dark', 'Tmavý']])}</div>
   </div>
   <div class="card"><h3>Dáta</h3><p class="mut small">Progres sa ukladá v tomto prehliadači a po prihlásení aj do cloudu (Supabase), takže ho máš na počítači aj mobile.</p>
    <div class="row wrap"><button class="btn sm" data-act="export">⬇ Export (.json)</button><button class="btn sm" data-act="import">⬆ Import</button><button class="btn sm danger" data-act="reset">Vymazať progres</button></div></div>
   <div class="card"><h3>Ako sa s touto stránkou učiť</h3><ul class="small" style="padding-left:18px;margin:0">
    <li><b>Každý deň 15–30 min</b> – pravidelnosť je dôležitejšia ako dĺžka.</li>
    <li><b>Opakovanie</b> (spaced repetition) – najprv vždy karty „na opakovanie“; vracajú sa tesne predtým, ako by si ich zabudol.</li>
    <li><b>Hovor nahlas</b> – všetko sa ovláda hlasom. Rozprávanie sa učí rozprávaním (output).</li>
    <li><b>Frázy namiesto slov</b> – uč sa celé obraty (chunks), gramatiku v nich získaš automaticky.</li>
    <li><b>Čítaj a počúvaj</b> texty o kúsok nad tvojou úrovňou, potom opakuj po vetách (shadowing).</li>
    <li><b>Chyby sú materiál</b> – AI ich zbiera, gramatika sa radí podľa nich a vracajú sa v opakovaní.</li>
    <li><b>Scény</b> – precvič si reálne situácie (porada, telefonát, vyjednávanie) skôr, ako ich zažiješ.</li></ul></div>
  </div>`;
}

/* ================= word lookup popover ================= */
const LOOK = (() => { try { return JSON.parse(localStorage.getItem('nemcina-lookups') || '{}'); } catch (e) { return {}; } })();
async function lookup(word, sentence, el) {
  const pop = $('#pop'), r = el.getBoundingClientRect();
  pop.style.left = Math.max(12, Math.min(r.left, innerWidth - 302)) + 'px';
  pop.style.top = (r.bottom + 8 + 220 > innerHeight ? Math.max(12, r.top - 230) : r.bottom + 8) + 'px';
  pop.hidden = false;
  const key = word.toLowerCase() + '|' + norm(sentence).slice(0, 80);
  const show = d => {
    pop.innerHTML = iconize(`<div class="row"><div class="pw">${esc(d.lemma || word)}</div><span class="sp"></span>${spk(d.lemma || word)}</div><div class="ps">${esc(d.sk || '')}</div>${d.note ? `<div class="small mut" style="margin-bottom:8px">💡 ${esc(d.note)}</div>` : ''}
      <div class="row"><button class="btn sm pri" data-act="save-word">+ Do slovníka</button><button class="btn sm ghost" data-act="close-pop">Zavrieť</button></div>`);
    pop._d = { de: d.lemma || word, sk: d.sk, note: d.note, ex: sentence };
  };
  if (LOOK[key]) return show(LOOK[key]);
  pop.innerHTML = iconize(`<div class="pw">${esc(word)}</div><div class="ps"><span class="typing"><i></i><i></i><i></i></span> prekladám…</div>`);
  try {
    const j = await window.api({ json: `Wort: "${word}"\nSatz: "${sentence}"\nGib JSON: {"lemma": "Grundform (Nomen mit Artikel und Pluralendung, z. B. 'die Rechnung, -en'; Verb im Infinitiv + Perfekt, z. B. 'verschieben (hat verschoben)'; trennbare Verben mit |)", "sk": "slowakische Bedeutung in diesem Satz (1–4 Wörter)", "note": "kurzer Grammatikhinweis auf Slowakisch, z. B. Kasus/Form in diesem Satz (max. 12 Wörter)"}` });
    LOOK[key] = j.data; try { localStorage.setItem('nemcina-lookups', JSON.stringify(LOOK)); } catch (e) {}
    if (!pop.hidden) show(j.data);
  } catch (e) { pop.innerHTML = iconize(`<div class="pw">${esc(word)}</div><div class="ps" style="color:var(--red)">${esc(e.message)}</div><button class="btn sm ghost" data-act="close-pop">Zavrieť</button>`); }
}

/* ================= AI-generated content ================= */
async function genPhrases(catId, btn) {
  const c = catById(catId); btn.disabled = true; btn.textContent = '✨ Generujem…';
  const have = catItems(c).map(i => i.de).join(' | ');
  try {
    const j = await window.api({ json: `Erstelle 10 NEUE, häufige, natürliche gesprochene Wendungen (Chunks) für das Thema „${c.de}“ (${c.sk}), Niveau B1–B2, für einen slowakischen Lerner mit Fokus auf gesprochenes ${c.group === 'business' ? 'Business-' : 'Alltags-'}Deutsch.
Nicht wiederholen: ${have}
Berücksichtige seine schwachen Grammatikthemen: ${weakTopics().slice(0, 3).map(x => x[0]).join(', ') || '—'}.
JSON: {"phrases":[{"de":"...","sk":"slowakische Übersetzung","note":"optionaler kurzer Grammatikhinweis auf Slowakisch oder leer","reg":"formal|neutral|informal"}]}`, temperature: 0.8 });
    const arr = (j.data.phrases || []).filter(p => p.de && p.sk).map(p => ({ id: uid('g-' + catId), de: p.de, sk: p.sk, note: p.note || '', reg: p.reg || 'neutral' }));
    (S.gen[catId] = S.gen[catId] || []).push(...arr); buildItems(); save(); toast(`Pridaných ${arr.length} fráz ✨`); renderMain();
  } catch (e) { toast(e.message); btn.disabled = false; btn.textContent = '✨ Ďalšie frázy od AI'; }
}
async function genText(catId, btn) {
  const c = catById(catId); btn.disabled = true; btn.textContent = '✨ Píšem text…';
  const weak = weakItems(i => i.cat === catId, 8);
  try {
    const j = await window.api({ json: `Schreibe einen neuen, realistischen ${Math.random() < 0.6 ? 'Dialog (12–16 Zeilen, 2–3 Personen mit Namen)' : 'kurzen Text oder eine E-Mail (6–9 Zeilen)'} zum Thema „${c.de}“ (${c.sk}), Niveau B1–B2, natürliches gesprochenes ${c.group === 'business' ? 'Business-' : 'Alltags-'}Deutsch.
Baue einige dieser Wendungen ein, die der Lerner noch übt:\n${weak || catItems(c).slice(0, 10).map(i => '- ' + i.de).join('\n')}
Vorhandene Titel (nicht wiederholen): ${catTexts(c).map(t => t.title_de).join(', ')}
JSON: {"type":"dialog|text|email","title_de":"...","title_sk":"...","level":"B1|B2","lines":[{"who":"Sprechername oder leer","de":"...","sk":"slowakische Übersetzung"}]}`, temperature: 0.9, think: 'low' });
    const t = { ...j.data, id: uid('gt-' + catId), ai: true };
    if (!Array.isArray(t.lines) || !t.lines.length) throw new Error('AI nevrátila text');
    (S.gentexts[catId] = S.gentexts[catId] || []).push(t); save(); go('#/text/' + t.id);
  } catch (e) { toast(e.message); btn.disabled = false; btn.textContent = '✨ Nový text od AI'; }
}
async function genEx(gid, btn) {
  const g = gramById(gid); btn.disabled = true; btn.textContent = '✨ Generujem…';
  try {
    const j = await window.api({ json: `Erstelle 8 neue Lückentext-Übungen zum Grammatikthema „${g.title_de}“ (${g.title_sk}) für einen slowakischen Lerner (B1–B2), Kontexte: Büro, Meetings, Finanzen, Alltag, Reisen.
Frühere Fehler des Lerners zu diesem Thema (übe genau diese Muster):\n${lastMistakes(10, m => m.topic === gid) || '- keine'}
Jede Übung: genau eine Lücke "___" in q, in Klammern am Ende die Grundform als Hilfe, falls nötig.
JSON: {"exercises":[{"q":"Ich warte schon seit einer Stunde auf ___ Bus. (der)","a":["den"],"sk":"slowakische Übersetzung des ganzen Satzes","hint":"kurzer Hinweis auf Slowakisch"}]}`, temperature: 0.8 });
    const arr = (j.data.exercises || []).filter(e => e.q && (e.q.match(/___/g) || []).length === 1 && Array.isArray(e.a) && e.a.length);
    (S.genex[gid] = S.genex[gid] || []).push(...arr); save(); toast(`Pridaných ${arr.length} cvičení ✨`); renderMain();
  } catch (e) { toast(e.message); btn.disabled = false; btn.textContent = '✨ Nové cvičenia od AI'; }
}

/* ================= events ================= */
document.addEventListener('click', e => {
  const w = e.target.closest('.w');
  if (w && !e.target.closest('[data-act]')) { const line = w.closest('.txt, .msg'); lookup(w.dataset.w, (line?.innerText || '').split('\n')[0].slice(0, 300), w); return; }
  if (!e.target.closest('#pop')) $('#pop').hidden = true;
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, id = b.dataset.id;
  switch (a) {
    case 'say': speak(b.dataset.t); break;
    case 'known': markKnown(id); b.closest('.li')?.querySelector('.dot')?.setAttribute('class', 'dot known'); toast('Označené ako „viem“ ✓'); renderSide(); break;
    case 'again': addToReview(id); b.closest('.li')?.querySelector('.dot')?.setAttribute('class', 'dot ' + status(id)); toast('Pridané do opakovania ↺'); renderSide(); break;
    case 'tr-line': b.closest('.line').classList.toggle('notr'); break;
    case 'tr-all': SHOW_TR = !SHOW_TR; renderMain(); break;
    case 'say-all': speak(textById(ROUTE.textId).t.lines.map(l => l.de).join(' \n ')); break;
    case 'text-done': if (!S.read[id]) { S.read[id] = dayKey(); xp(5); save(); } toast('Prečítané ✓'); renderMain(); break;
    case 'rv-show': rvShow(); break;
    case 'rv-mic': dictate((t, fin) => { const i = $('#rvIn'); if (i) i.value = t; RV.typed = t; if (fin) rvShow(); }, 'de-DE', b); break;
    case 'rate': rvRate(+b.dataset.q); break;
    case 'gen-phrases': genPhrases(b.dataset.cat, b); break;
    case 'gen-text': genText(b.dataset.cat, b); break;
    case 'gen-ex': genEx(b.dataset.g, b); break;
    case 'ex-show': { const g = gramById(ROUTE.gid), i = +b.dataset.i, e = [...g.exercises, ...(S.genex[g.id] || [])][i], row = b.closest('.ex');
      row.querySelector('.gap').textContent = e.a[0];
      row.querySelector('.exbtns').innerHTML = iconize(`${e.hint ? `<span class="mut small">💡 ${esc(e.hint)}</span>` : ''}<button class="btn sm" data-act="ex-grade" data-i="${i}" data-ok="1">✅ Vedel som</button><button class="btn sm" data-act="ex-grade" data-i="${i}" data-ok="0">❌ Nevedel</button>`);
      speak(e.q.replace('___', e.a[0]).replace(/\s*\([^)]*\)\s*$/, '')); break; }
    case 'ex-grade': { const g = gramById(ROUTE.gid), i = +b.dataset.i, e = [...g.exercises, ...(S.genex[g.id] || [])][i], row = b.closest('.ex'), v = S.gram[g.id] || (S.gram[g.id] = { ok: 0, bad: 0, done: {} });
      if (b.dataset.ok === '1') { v.ok++; v.done[i] = true; row.classList.add('ok'); row.querySelector('.exbtns').innerHTML = '<span class="fb">✓ vedel som</span>'; xp(2); }
      else { v.bad++; row.classList.add('bad'); row.querySelector('.exbtns').innerHTML = '<span class="fb">uložené medzi chyby</span>'; addMistake({ wrong: e.q, right: e.q.replace('___', e.a[0]), explain: e.hint || '', topic: g.id }, 'grammar'); }
      v.last = Date.now(); save(); renderSide(); break; }
    case 'cat-quiz': if (window.DRIVE) { DRIVE.topic = b.dataset.cat; DRIVE.mode = 'quiz'; } go('#/'); setTimeout(() => window.talkAction('voice'), 60); break;
    case 'cat-listen': if (window.DRIVE) DRIVE.topic = b.dataset.cat; go('#/'); setTimeout(() => window.talkAction('drive-listen'), 60); break;
    case 'forget': S.profile.facts.splice(+b.dataset.i, 1); save(); renderMain(); break;
    case 'ex-reset': S.gram[b.dataset.g] = { ...(S.gram[b.dataset.g] || {}), done: {} }; save(); renderMain(); break;
    case 'mfilter': MFILTER = b.dataset.t; renderMain(); break;
    case 'del-m': S.mistakes = S.mistakes.filter(m => m.id !== id); delete S.srs[id]; buildItems(); save(); renderMain(); renderSide(); break;
    case 'del-w': S.words = S.words.filter(m => m.id !== id); delete S.srs[id]; buildItems(); save(); renderMain(); break;
    case 'save-word': { const d = $('#pop')._d; if (d) { addWord(d, 'reading'); toast(`„${d.de}“ uložené do slovníka 📒`); $('#pop').hidden = true; } break; }
    case 'close-pop': $('#pop').hidden = true; break;
    case 'add-word': modal(`<h3>Pridať slovo / frázu</h3><div class="field"><label>Po nemecky</label><input id="nwDe" placeholder="die Rechnung, -en"></div><div class="field"><label>Po slovensky</label><input id="nwSk" placeholder="faktúra"></div><div class="field"><label>Poznámka / príklad (voliteľné)</label><input id="nwNote"></div><div class="row" style="justify-content:flex-end"><button class="btn" data-act="close-modal">Zrušiť</button><button class="btn pri" data-act="add-word-ok">Pridať</button></div>`); setTimeout(() => $('#nwDe')?.focus(), 50); break;
    case 'add-word-ok': { const de = $('#nwDe').value.trim(); if (!de) return; addWord({ de, sk: $('#nwSk').value.trim(), note: $('#nwNote').value.trim() }); closeModal(); renderMain(); toast('Pridané 📒'); break; }
    case 'close-modal': closeModal(); break;
    case 'set': { let v = b.dataset.v; if (v === 'true' || v === 'false') v = v === 'true'; else if (!isNaN(+v)) v = +v; S.settings[b.dataset.k] = v; save(); applyTheme(); renderMain(); renderSide(); break; }
    case 'export': { const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }); const l = document.createElement('a'); l.href = URL.createObjectURL(blob); l.download = `nemcina-progres-${dayKey()}.json`; l.click(); break; }
    case 'import': { const f = document.createElement('input'); f.type = 'file'; f.accept = '.json'; f.onchange = async () => { try { const d = JSON.parse(await f.files[0].text()); if (!d.v) throw 0; replaceState(d); save(true); toast('Importované ✓'); } catch (x) { toast('Neplatný súbor'); } }; f.click(); break; }
    case 'reset': modal(`<h3>Vymazať celý progres?</h3><p class="mut">Zmaže opakovanie, chyby, slovník aj históriu v tomto prehliadači${window.CL?.user ? ' aj v cloude' : ''}. Nedá sa vrátiť – najprv si urob export.</p><div class="row" style="justify-content:flex-end"><button class="btn" data-act="close-modal">Zrušiť</button><button class="btn danger" data-act="reset-ok">Vymazať</button></div>`); break;
    case 'reset-ok': { const keep = S.settings; replaceState({ ...DEFAULTS(), settings: keep }); save(true); closeModal(); toast('Progres vymazaný'); break; }
    default: window.talkAction?.(a, b, e);
  }
});
document.addEventListener('keydown', e => {
  if (e.target.matches?.('#rvIn') && e.key === 'Enter') { e.preventDefault(); rvShow(); return; }
  if (e.target.matches?.('[data-ex]') && e.key === 'Enter') { e.preventDefault(); checkEx(e.target); return; }
  if (e.key === 'Escape') { $('#pop').hidden = true; closeModal(); }
  if (ROUTE.name === 'review' && RV?.cur && !e.target.closest('input,textarea')) {
    if (!RV.shown && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); rvShow(); }
    else if (RV.shown && /^[1-4]$/.test(e.key)) rvRate(+e.key - 1);
    else if (RV.shown && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); rvRate(2); }
  }
});
document.addEventListener('focusout', e => { if (e.target.matches?.('[data-ex]') && e.target.value.trim() && !e.target.readOnly) checkEx(e.target); });
document.addEventListener('input', e => {
  if (e.target.id === 'wq') { WQ = e.target.value; const pos = e.target.selectionStart; renderMain(); const i = $('#wq'); i.focus(); i.setSelectionRange(pos, pos); }
  if (e.target.dataset?.set) { S.settings[e.target.dataset.set] = e.target.value; save(); }
});
document.addEventListener('change', e => { if (e.target.dataset?.set) { S.settings[e.target.dataset.set] = e.target.value; save(); if (e.target.dataset.set === 'voiceName') speak('Hallo, so klinge ich.'); } });

/* ================= init ================= */
buildItems(); applyTheme(); ROUTE = parseRoute(); render();
try { navigator.storage?.persist?.(); } catch (e) {}

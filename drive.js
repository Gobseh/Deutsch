/* drive.js – domovská obrazovka „Hovoriť s Lenou“ (navrhnutá pre mobil a auto: len hlas, veľké tlačidlá, obrazovka nezhasne).
   Režimy: Rozhovor · Kvíz (Lena skúša kartičky a sama hodnotí) · Gramatika (najslabšia téma) · Počúvanie fráz bez AI. */
'use strict';
const DRIVE = window.DRIVE = { topic: 'free', mode: null, loop: null, readSess: null };

/* ---------- context for the AI (screenContext in app.js calls this on the home screen) ---------- */
function quizItems() {
  const t = DRIVE.topic, cat = catById(t);
  let ids = dueIds(i => t === 'mistakes' ? i.kind === 'mistake' : cat ? i.cat === t : true);
  if (ids.length < 10 && t !== 'mistakes') {
    const pool = cat ? catItems(cat) : Object.values(ITEMS).filter(i => i.kind !== 'mistake');
    const extra = pool.filter(i => !ids.includes(i.id) && status(i.id) !== 'known').sort((a, b) => (st(b.id)?.bad || 0) - (st(a.id)?.bad || 0) || (st(b.id) ? 1 : 0) - (st(a.id) ? 1 : 0)).slice(0, 15 - ids.length).map(i => i.id);
    ids = [...ids, ...extra];
  }
  return ids.slice(0, 25);
}
window.quizItems = quizItems;
const weakestGrammar = () => gramById(weakTopics().find(([g]) => gramById(g))?.[0]) || GRAM[0];
window.driveContext = ({ weakItems, lastMistakes }) => {
  const car = '\nDer Lerner benutzt die App oft im Auto: halte alles kurz und klar, keine Hinweise auf den Bildschirm, keine Listen.';
  const c = catById(DRIVE.topic);
  const tName = c ? c.sk : DRIVE.topic === 'mistakes' ? 'Moje chyby' : 'Voľne';
  if (DRIVE.mode === 'quiz') {
    const list = quizItems().map(id => { const i = ITEMS[id]; return i.kind === 'mistake' ? `${id} | FEHLERKARTE: falsch „${i.wrong}“ → richtig „${i.right}“` : `${id} | SK: ${i.sk} | DE: ${i.de.replace(/\|/g, '')}`; }).join('\n');
    return { label: `Kvíz · ${tName}`, text: `Hlasquiz. Karten (id | Inhalt):\n${list || '- keine Karten'}` + car,
      start: 'QUIZ: Gehe die Karten der Reihe nach durch. Sag die slowakische Bedeutung (auf Slowakisch, kurz), der Lerner antwortet auf Deutsch. Bei FEHLERKARTEN sag den falschen Satz und lass ihn korrigieren. Bewerte JEDE Antwort sofort mit grade_card, sag kurz „Richtig!“ oder die Lösung, lass ihn die richtige Form einmal nachsprechen, dann die nächste Karte. Am Ende kurze Zusammenfassung auf Slowakisch.' };
  }
  if (DRIVE.mode === 'grammar') {
    const g = weakestGrammar();
    return { label: `Gramatika · ${g.title_sk}`, text: `Grammatikthema „${g.title_de}“ (${g.title_sk}).\nRegel kurz: ${g.why_sk}\nBeispiele: ${g.examples.map(e => e.de.replace(/<[^>]+>/g, '')).join(' | ')}\nTypische Fehler: ${g.mistakes.map(m => m.wrong + ' → ' + m.right).join(' | ')}\nFrühere Fehler des Lerners dazu:\n${lastMistakes(8, m => m.topic === g.id) || '- keine'}` + car,
      start: 'GRAMMATIK-TRAINING: Erkläre die Regel in 2–3 Sätzen auf Slowakisch mit einem Beispiel. Dann mündliche Übungen: sag einen slowakischen Satz oder einen deutschen Satz mit Lücke/Fehler, er antwortet auf Deutsch. Korrigiere sofort, logge Fehler mit log_mistake, wiederhole schwierige Muster. Nach ca. 8 Übungen kurzes Feedback.' };
  }
  if (c) {
    const ph = catItems(c).filter(i => i.kind === 'phrase').slice(0, 24).map(p => `- ${p.de} = ${p.sk}`).join('\n');
    const vo = c.vocab.map(v => `${v.de} = ${v.sk}`).join('; ');
    const sc = c.scenarios[Math.floor(Math.random() * c.scenarios.length)];
    return { label: c.sk, text: `Thema „${c.de}“ (${c.sk}). Wendungen:\n${ph}\nWortschatz: ${vo}\nSchwache Wendungen:\n${weakItems(i => i.cat === c.id) || '- keine'}\nMögliches Rollenspiel: ${sc?.ai_role || ''} (Ziel: ${sc?.goal_sk || ''})` + car,
      start: `Führe ein natürliches Gespräch zum Thema „${c.de}“ und lass den Lerner die Wendungen und den Wortschatz aktiv benutzen. Biete nach ein paar Minuten das Rollenspiel an.` };
  }
  if (DRIVE.topic === 'mistakes') return { label: 'Moje chyby', text: `Frühere Fehler des Lerners:\n${lastMistakes(15) || '- keine'}` + car, start: 'Übe genau diese Fehler im Gespräch: schaffe Situationen, in denen er die richtigen Formen benutzen muss.' };
  return { label: 'Voľný rozhovor', text: `Schwache Wendungen:\n${weakItems() || '- keine'}` + car,
    start: 'Freies Gespräch: knüpfe an das an, was du über ihn weißt (Gedächtnis) und an das letzte Gespräch; frag nach seinem Tag, seiner Arbeit (Finanzen/Controlling in einem Lackhersteller) und seinen Plänen. Baue schwache Wendungen und frühere Fehler ein. Er kann dich jederzeit bitten, ein Thema zu öffnen oder ihn abzufragen.' };
};

/* ---------- listening loop (no AI, works offline) ---------- */
const say = (text, lang, rate) => tts(text, lang, rate);
const wait = ms => new Promise(r => setTimeout(r, ms));
function listenItems() {
  const t = DRIVE.topic, cat = catById(t);
  const pool = t === 'mistakes' ? S.mistakes.map(m => ITEMS[m.id]).filter(Boolean) : cat ? catItems(cat) : Object.values(ITEMS).filter(i => i.kind !== 'mistake');
  const score = i => (isDue(i.id) ? 0 : status(i.id) === 'weak' ? 1 : status(i.id) === 'learning' ? 2 : status(i.id) === 'new' ? 3 : 5) + Math.random();
  return pool.sort((a, b) => score(a) - score(b)).slice(0, 40);
}
async function listenStart() {
  if (LV.state !== 'off') lvStop(true);
  const items = listenItems(); if (!items.length) return toast('V tejto téme nie sú frázy');
  const L = DRIVE.loop = { items, i: 0, phase: '', paused: false, token: Math.random() };
  DRIVE.mode = 'listen'; render(); keepAwake();
  const alive = () => DRIVE.loop === L && !L.stop;
  while (alive() && L.i < L.items.length) {
    const it = L.items[L.i], tok = L.token;
    const steps = it.kind === 'mistake'
      ? [['sk', 'Oprav chybu.', 1], ['de', it.wrong, 0.95], ['gap', 3500], ['de', it.right, 0.9], ['gap', 3500], ['de', it.right, 0.8], ['gap', 2500]]
      : [['sk', it.sk, 1], ['gap', 2800], ['de', it.de, S.settings.rate || 0.95], ['gap', 3800], ['de', it.de, 0.8], ['gap', 3000]];
    for (const [k, v, r] of steps) {
      while (alive() && L.paused) await wait(300);
      if (!alive() || L.token !== tok) break;
      L.phase = k === 'gap' ? 'repeat' : k; renderDriveNow();
      if (k === 'gap') await wait(v); else await say(v, k === 'sk' ? 'sk-SK' : 'de-DE', r);
    }
    if (!alive()) break;
    if (L.token === tok) { L.i++; xp(1); }
    L.token = Math.random();
  }
  if (DRIVE.loop === L) { if (!L.stop) await say(`Hotovo. Prešli sme ${L.i} fráz.`, 'sk-SK', 1); DRIVE.loop = null; DRIVE.mode = null; render(); keepAwake(); }
}
function listenStop(quiet) { const L = DRIVE.loop; if (!L) return; L.stop = true; DRIVE.loop = null; ttsStop(); DRIVE.mode = null; if (!quiet) render(); keepAwake(); }
window.listenStop = listenStop;

/* ---------- home view ---------- */
function topicChips() {
  const t = (id, label) => `<button class="dchip ${DRIVE.topic === id ? 'on' : ''}" data-act="drive-topic" data-id="${id}">${label}</button>`;
  return t('free', 'Voľne') + t('mistakes', `Moje chyby${S.mistakes.length ? ' · ' + S.mistakes.length : ''}`) +
    GROUPS.map(g => CATS.filter(c => c.group === g.id).map(c => t(c.id, `${c.icon}${esc(c.sk)}`)).join('')).join('');
}
window.vDrive = () => {
  const live = LV.state !== 'off' || LV.reviewing;
  if (live) {
    const lastAI = [...CH.msgs].reverse().find(m => m.role === 'live'), lastMe = [...CH.msgs].reverse().find(m => m.role === 'me');
    const lastSys = [...CH.msgs].reverse().find(m => m.role === 'sys');
    const sp = LV.reviewing ? 'Vyhodnocujem…' : LV.state === 'connecting' ? 'Pripájam…' : aiSpeaking() ? 'Lena hovorí' : 'Počúvam ťa';
    return `<div class="drive live-on"><div class="dstate">${esc(CH.label || '')}</div>
      <button class="bigmic voice live" data-act="voice" aria-label="Ukončiť rozhovor">${ic(LV.reviewing ? 'clipboard' : aiSpeaking() ? 'wave' : 'mic')}<small>${sp}</small></button>
      <div class="dtr">${lastAI ? `<div class="dai">${esc(lastAI.text.slice(-220))}</div>` : ''}${lastMe ? `<div class="dme">${esc(lastMe.text.slice(-140))}</div>` : ''}${lastSys ? `<div class="dsys">${esc(lastSys.text)}</div>` : ''}</div>
      ${LV.reviewing ? '' : `<button class="dbtn stop" data-act="voice">⏹ Ukončiť a vyhodnotiť</button>`}
      <p class="mut tiny">Povedz napr. „otvor financie“, „vyskúšaj ma“, „koľko mám na opakovanie“, „vysvetli mi datív“.</p></div>`;
  }
  if (DRIVE.mode === 'listen' && DRIVE.loop) {
    const L = DRIVE.loop, it = L.items[L.i] || {};
    return `<div class="drive"><div class="dstate">Počúvanie · ${Math.min(L.i + 1, L.items.length)}/${L.items.length}</div>
      <div class="dcard"><div class="dsk ${L.phase === 'sk' ? 'hi' : ''}">${esc(it.kind === 'mistake' ? it.wrong : it.sk)}</div><div class="dde ${L.phase !== 'sk' ? 'hi' : ''}">${L.phase === 'sk' ? '…' : esc((it.kind === 'mistake' ? it.right : it.de || '').replace(/\|/g, ''))}</div>
      <div class="dphase">${L.phase === 'repeat' ? 'Zopakuj nahlas' : L.phase === 'sk' ? 'Slovensky' : 'Nemecky'}</div></div>
      <div class="drow"><button class="dbtn" data-act="drive-pause">${L.paused ? '▶ Pokračovať' : '⏸ Pauza'}</button><button class="dbtn" data-act="drive-next">⏭ Ďalšia</button></div>
      <button class="dbtn stop" data-act="drive-stop">⏹ Stop</button></div>`;
  }
  const t = today(), due = dueIds().length, last = S.sessions[0], qn = quizItems().length, g = weakestGrammar();
  return `<div class="drive">
    <div class="dhead"><div><h1>${hello()}</h1><p class="mut">Vyber tému a ťukni. Ďalej už len hovoríš – Lena vie ovládať celú aplikáciu.</p></div></div>
    <div class="dstats"><a href="#/stats"><b>${t.xp}<small>/${S.settings.goal}</small></b><span>XP dnes</span></a><a href="#/stats"><b>${streak()}</b><span>dní v rade</span></a><a href="#/review"><b>${due}</b><span>na opakovanie</span></a><a href="#/mistakes"><b>${S.mistakes.length}</b><span>chýb v pamäti</span></a></div>
    <div class="dtopics">${topicChips()}</div>
    <button class="dbig pri" data-act="drive-talk"><span class="em">${ic('mic')}</span><b>Rozhovor s Lenou</b><small>${DRIVE.topic === 'free' ? 'voľne, nadviaže na minulý rozhovor' : 'na tému · opravuje chyby'}</small></button>
    <div class="dgrid">
      <button class="dbig" data-act="drive-quiz"><span class="em">${ic('quiz')}</span><b>Kvíz</b><small>${qn} kariet</small></button>
      <button class="dbig" data-act="drive-grammar"><span class="em">${ic('grammar')}</span><b>Gramatika</b><small>${esc(g.title_sk.split(':')[0])}</small></button>
      <button class="dbig" data-act="drive-listen"><span class="em">${ic('headphones')}</span><b>Počúvať</b><small>bez AI</small></button>
      <a class="dbig" href="#/cats"><span class="em">${ic('layers')}</span><b>Témy</b><small>frázy a texty</small></a>
    </div>
    ${last && last.summary ? `<div class="card dlast"><div class="row"><b>Posledný rozhovor</b><span class="mut tiny">${fmtD(last.at)}</span><span class="sp"></span><button class="ib" data-act="drive-read" aria-label="Prečítať">🔊</button></div><p class="small" style="margin:4px 0 0">${esc(last.summary)}</p></div>` : ''}
    </div>`;
};
let drT = 0;
function renderDriveNow() { if (ROUTE.name === 'home') $('#main').innerHTML = iconize(window.vDrive()); }
window.renderDrive = () => { if (ROUTE.name !== 'home') return; const n = Date.now(); if (n - drT > 150) { drT = n; renderDriveNow(); } else { clearTimeout(window._drT); window._drT = setTimeout(renderDriveNow, 160); } keepAwake(); };

/* read the evaluation aloud after a conversation (hands-free) */
setInterval(() => {
  if (ROUTE.name !== 'home' || LV.state !== 'off' || LV.reviewing) return;
  const s = S.sessions[0];
  if (s && s.summary && s.kind === 'live' && DRIVE.readSess !== s.id && Date.now() - new Date(s.at).getTime() < 120000) {
    DRIVE.readSess = s.id;
    say(s.summary + (s.mistakes?.length ? ` Uložila som ${s.mistakes.length} chýb na opakovanie.` : ''), 'sk-SK', 1);
  }
}, 1000);

/* keep the screen on while talking or listening */
let WAKE = null;
async function keepAwake() {
  const want = LV.state !== 'off' || !!DRIVE.loop;
  try {
    if (want && !WAKE && navigator.wakeLock) { WAKE = await navigator.wakeLock.request('screen'); WAKE.addEventListener('release', () => { WAKE = null; }); }
    if (!want && WAKE) { WAKE.release(); WAKE = null; }
  } catch (e) {}
}
window.afterRender = () => { keepAwake(); if (ROUTE.name !== 'home' && DRIVE.loop) listenStop(true); };
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') keepAwake(); });

/* ---------- actions ---------- */
const prevDrive = window.talkAction;
window.talkAction = (a, b, e) => {
  switch (a) {
    case 'drive-topic': DRIVE.topic = b.dataset.id; renderMain(); break;
    case 'drive-talk': DRIVE.mode = 'talk'; TALK.scenario = null; lvStart(); break;
    case 'drive-quiz': DRIVE.mode = 'quiz'; TALK.scenario = null; lvStart(); break;
    case 'drive-grammar': DRIVE.mode = 'grammar'; TALK.scenario = null; lvStart(); break;
    case 'drive-listen': listenStart(); break;
    case 'drive-pause': if (DRIVE.loop) { DRIVE.loop.paused = !DRIVE.loop.paused; if (DRIVE.loop.paused) ttsStop(); renderDriveNow(); } break;
    case 'drive-next': if (DRIVE.loop) { DRIVE.loop.i++; DRIVE.loop.token = Math.random(); ttsStop(); } break;
    case 'drive-stop': listenStop(); break;
    case 'drive-read': { const s = S.sessions[0]; if (s?.summary) say(s.summary, 'sk-SK', 1); break; }
    case 'voice': if (LV.state === 'off' && ROUTE.name === 'home' && !DRIVE.mode) DRIVE.mode = 'talk'; prevDrive?.(a, b, e); break;
    default: prevDrive?.(a, b, e);
  }
};
if (ROUTE.name === 'home') render();

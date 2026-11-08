/* talk.js – hlasový rozhovor s Lenou (Gemini Live). Aplikácia sa ovláda hlasom:
   Lena vie, kde si (get_screen), vie prepínať obrazovky (navigate), pozná progres (get_progress),
   skúša kartičky (get_quiz_cards + grade_card), ukladá chyby a frázy. */
'use strict';

/* ---------- server call ---------- */
async function api(body, ms = 50000) {
  if (!/^https?:/.test(location.protocol)) throw new Error('AI funguje len cez server (npm run dev alebo Vercel)');
  const headers = { 'Content-Type': 'application/json' };
  const tok = await window.cloudToken?.();
  if (tok) headers.Authorization = 'Bearer ' + tok;
  let r;
  try { r = await fetch('/api/ai', { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout?.(ms) }); }
  catch (e) { throw new Error(e.name === 'TimeoutError' || e.name === 'AbortError' ? 'Server neodpovedal včas – skús znova' : 'Bez spojenia so serverom'); }
  const j = await r.json().catch(() => ({ error: r.status === 404 ? 'API nebeží (npm run dev alebo Vercel)' : 'Chyba servera ' + r.status }));
  if (r.status === 401) setTimeout(() => go('#/settings'), 600);
  if (!r.ok) throw new Error(j.error || 'Chyba servera ' + r.status);
  return j;
}
window.api = api;

/* transcript of the current conversation (shown on the home screen and in the live bar) */
const CH = { msgs: [], label: '' };

/* ---------- Gemini Live ---------- */
const LV = { state: 'off', ws: null, ctx: null, stream: null, src: null, proc: null, an: null, next: 0, srcs: new Set(), micLv: 0, lv: 0, raf: 0, tr: [], logged: [], phrases: [], t0: 0, label: '', err: '' };
window.LV = LV;
const aiB64 = u8 => { let b = ''; for (let i = 0; i < u8.length; i += 0x8000) b += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(b); };
const aiSpeaking = () => !!(LV.ctx && LV.ctx.state === 'running' && LV.next > LV.ctx.currentTime + 0.02);
function lvLoop() {
  LV.raf = 0; if (LV.state === 'off') return;
  let v = LV.micLv;
  if (aiSpeaking() && LV.an) { const d = new Float32Array(LV.an.fftSize); LV.an.getFloatTimeDomainData(d); let s = 0; for (let i = 0; i < d.length; i++) s += d[i] * d[i]; v = Math.sqrt(s / d.length); }
  const t = Math.min(1, v * 7); LV.lv += (t - LV.lv) * (t > LV.lv ? .5 : .15);
  $$('.voice').forEach(b => b.style.setProperty('--lv', LV.lv.toFixed(3)));
  const sp = aiSpeaking() ? 'speaking' : 'listening';
  if (LV.lastSp !== sp) { LV.lastSp = sp; renderLive(); }
  LV.raf = requestAnimationFrame(lvLoop);
}
function lvFlush() { LV.srcs.forEach(s => { try { s.stop(); } catch (e) {} }); LV.srcs.clear(); if (LV.ctx) LV.next = LV.ctx.currentTime; }
function lvPlay(b64, mime) {
  const ctx = LV.ctx; if (!ctx || !LV.an) return; const rate = +((mime || '').match(/rate=(\d+)/) || [])[1] || 24000;
  const bin = atob(b64); const n = bin.length >> 1; if (!n) return; const buf = ctx.createBuffer(1, n, rate); const ch = buf.getChannelData(0);
  for (let i = 0; i < n; i++) { let v = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8); if (v >= 0x8000) v -= 0x10000; ch[i] = v / 32768; }
  const s = ctx.createBufferSource(); s.buffer = buf; s.connect(LV.an); const at = Math.max(ctx.currentTime + 0.04, LV.next); s.start(at); LV.next = at + buf.duration;
  LV.srcs.add(s); s.onended = () => LV.srcs.delete(s);
}
function lvTr(role, text) {
  if (!text) return;
  const last = LV.tr[LV.tr.length - 1];
  if (last && last.role === role && !last.closed) last.text += text; else LV.tr.push({ role, text });
  const r = role === 'user' ? 'me' : 'live', lm = CH.msgs[CH.msgs.length - 1];
  if (lm && lm.role === r && !lm.closed) lm.text += text; else CH.msgs.push({ role: r, text });
  clearTimeout(LV.rt); LV.rt = setTimeout(renderLive, 120);
}
function lvTurnEnd() { const l = LV.tr[LV.tr.length - 1]; if (l) l.closed = true; const m = CH.msgs[CH.msgs.length - 1]; if (m) m.closed = true; }
function note(text) { CH.msgs.push({ role: 'sys', text }); renderLive(); }

const TOPICS = 'word-order|articles-gender|cases-akk-dat|prepositions|adjective-endings|perfekt|separable-verbs|modal-verbs|konjunktiv-ii|reflexive|passive|connectors|negation|relative-clauses|vocabulary|style';
const LV_TOOLS = [{ functionDeclarations: [
  { name: 'get_screen', description: 'Was der Lerner gerade in der App sieht (Thema, Text, Grammatik, Karte) und seine Fehler. Rufe es auf, wenn er sich auf „hier/das/tento/táto“ bezieht oder nach navigate.' },
  { name: 'navigate', description: 'Öffnet einen Bildschirm der App (der Lerner steuert die App nur per Stimme, z. B. „otvor financie“, „ukáž moje chyby“, „poďme na gramatiku datív“, „späť domov“). Gibt den neuen Bildschirmkontext zurück – setze das Gespräch dort fort.',
    parameters: { type: 'OBJECT', properties: {
      target: { type: 'STRING', description: 'home | topic | grammar | mistakes | progress | text | words | history' },
      id: { type: 'STRING', description: `bei topic: ${CATS.map(c => c.id + ' (' + c.sk + ')').join(', ')}; bei grammar: ${GRAM.map(g => g.id).join(', ')}; bei text: Text-id aus get_screen` },
    }, required: ['target'] } },
  { name: 'get_progress', description: 'Fortschritt des Lerners: Karten zur Wiederholung, Serie, XP heute, Fortschritt je Thema, schwache Grammatikthemen. Für Fragen wie „koľko mám na opakovanie“, „ako mi to ide“, „čo mám robiť“.' },
  { name: 'get_quiz_cards', description: 'Liefert die Karten, die der Lerner jetzt wiederholen sollte (id, Slowakisch, Deutsch). Für „vyskúšaj ma“, „opakujme“, „kvíz“. Danach jede Antwort mit grade_card bewerten.',
    parameters: { type: 'OBJECT', properties: { topic: { type: 'STRING', description: 'optional: Themen-id oder "mistakes"' } } } },
  { name: 'grade_card', description: 'Bewertet eine Quiz-Antwort. q: 0 = nicht gewusst/falsch, 1 = mit Mühe/teilweise, 2 = richtig, 3 = sofort perfekt.',
    parameters: { type: 'OBJECT', properties: { id: { type: 'STRING' }, q: { type: 'INTEGER' } }, required: ['id', 'q'] } },
  { name: 'log_mistake', description: 'Speichert einen echten Grammatik- oder Wortschatzfehler des Lerners (nicht Aussprache) für die Wiederholung. Bei JEDEM solchen Fehler aufrufen.',
    parameters: { type: 'OBJECT', properties: { wrong: { type: 'STRING' }, right: { type: 'STRING' }, explain: { type: 'STRING', description: 'kurz auf Slowakisch' }, topic: { type: 'STRING', description: TOPICS } }, required: ['wrong', 'right'] } },
  { name: 'remember', description: 'Merkt sich dauerhaft einen Fakt über den Lerner (Arbeit, Familie, Interessen, Pläne, Termine, Lernziele, Vorlieben – z. B. „hat nächste Woche ein Meeting mit dem Werk in Köln“). Aufrufen, wenn er etwas Persönliches erzählt oder „zapamätaj si“ sagt.',
    parameters: { type: 'OBJECT', properties: { fact: { type: 'STRING', description: 'kurzer Fakt auf Slowakisch' } }, required: ['fact'] } },
  { name: 'save_phrase', description: 'Speichert eine neue Wendung/ein Wort im Wörterbuch des Lerners (wenn er nach einem Wort fragt oder es sich merken will).',
    parameters: { type: 'OBJECT', properties: { de: { type: 'STRING' }, sk: { type: 'STRING' } }, required: ['de', 'sk'] } },
] }];
function lvTool(name, a) {
  if (name === 'get_screen') { const c = screenContext(); return { screen: c.label, details: c.text, task: c.start }; }
  if (name === 'navigate') {
    const id = a.id || '';
    const h = { home: '#/', topic: catById(id) ? '#/cat/' + id : null, grammar: gramById(id) ? '#/grammar/' + id : '#/grammar', mistakes: '#/mistakes', progress: '#/stats', text: textById(id) ? '#/text/' + id : null, words: '#/words', history: '#/history' }[a.target];
    if (!h) return { error: 'Unbekanntes Ziel/id' };
    TALK.scenario = null; if (window.DRIVE) DRIVE.mode = DRIVE.mode === 'quiz' ? 'quiz' : 'talk';
    location.hash = h; ROUTE = parseRoute(); render();
    const c = screenContext(); note('→ ' + c.label); return { ok: true, screen: c.label, details: c.text, task: c.start };
  }
  if (name === 'get_progress') {
    const t = today();
    return { due: dueIds().length, streakDays: streak(), xpToday: t.xp, goal: S.settings.goal, mistakes: S.mistakes.length,
      weakGrammar: weakTopics().slice(0, 4).map(([g]) => topicName(g)), topics: CATS.map(c => { const p = catProgress(c); return `${c.sk}: ${p.known}/${p.total} gelernt`; }) };
  }
  if (name === 'get_quiz_cards') {
    if (a.topic && window.DRIVE) DRIVE.topic = catById(a.topic) || a.topic === 'mistakes' ? a.topic : DRIVE.topic;
    return { cards: (window.quizItems?.() || []).map(id => { const i = ITEMS[id]; return i.kind === 'mistake' ? { id, fehlerkarte: true, falsch: i.wrong, richtig: i.right } : { id, sk: i.sk, de: i.de.replace(/\|/g, '') }; }) };
  }
  if (name === 'grade_card') {
    if (!ITEMS[a.id]) return { error: 'unknown id' };
    const q = Math.max(0, Math.min(3, +a.q || 0)); rate(a.id, q);
    note(`${['❌', '🟡', '✅', '⭐'][q]} ${ITEMS[a.id].de || ITEMS[a.id].right}`); renderSide(); return { ok: true, remaining: dueIds().length };
  }
  if (name === 'log_mistake') { const m = addMistake(a, 'voice'); if (m) { LV.logged.push({ wrong: m.wrong, right: m.right }); note(`🎯 ${m.wrong} → ${m.right}`); } return { ok: true }; }
  if (name === 'remember') { if (remember(a.fact)) note('🧠 ' + a.fact); return { ok: true }; }
  if (name === 'save_phrase') { const w = addWord({ de: a.de, sk: a.sk }, 'voice'); if (w) { LV.phrases.push({ de: w.de, sk: w.sk }); note(`📒 ${w.de} – ${w.sk}`); } return { ok: true }; }
  return { error: 'unknown tool' };
}
function lvMsg(m) {
  if (m.setupComplete) {
    LV.state = 'listening'; render();
    LV.ws.send(JSON.stringify({ clientContent: { turns: [{ role: 'user', parts: [{ text: 'Hallo! Bitte fang an – passend zu dem, was ich gerade auf dem Bildschirm habe.' }] }], turnComplete: true } }));
    return;
  }
  if (m.toolCall) {
    const out = (m.toolCall.functionCalls || []).map(fc => { let response; try { response = lvTool(fc.name, fc.args || {}); } catch (e) { response = { error: e.message }; } return { id: fc.id, name: fc.name, response }; });
    if (LV.ws?.readyState === 1) LV.ws.send(JSON.stringify({ toolResponse: { functionResponses: out } }));
    return;
  }
  const sc = m.serverContent;
  if (sc) {
    if (sc.interrupted) lvFlush();
    (sc.modelTurn?.parts || []).forEach(p => { if (p.inlineData?.data) lvPlay(p.inlineData.data, p.inlineData.mimeType); });
    if (sc.inputTranscription?.text) lvTr('user', sc.inputTranscription.text);
    if (sc.outputTranscription?.text) lvTr('model', sc.outputTranscription.text);
    if (sc.turnComplete) lvTurnEnd();
  }
  if (m.goAway) toast('Rozhovor sa čoskoro ukončí – začni nový');
}
function lvMic() {
  const ctx = LV.ctx; const src = LV.src = ctx.createMediaStreamSource(LV.stream); const proc = LV.proc = ctx.createScriptProcessor(4096, 1, 1); const ratio = ctx.sampleRate / 16000;
  proc.onaudioprocess = e => {
    const d = e.inputBuffer.getChannelData(0); let q = 0; for (let i = 0; i < d.length; i++) q += d[i] * d[i]; LV.micLv = Math.sqrt(q / d.length);
    if (LV.state !== 'listening' || !LV.ws || LV.ws.readyState !== 1 || aiSpeaking()) return;
    const len = Math.floor(d.length / ratio); const out = new Int16Array(len);
    for (let i = 0; i < len; i++) { const a = Math.floor(i * ratio), b = Math.min(d.length, Math.floor((i + 1) * ratio)); let s = 0; for (let k = a; k < b; k++) s += d[k]; s = b > a ? s / (b - a) : 0; out[i] = Math.max(-1, Math.min(1, s)) * 0x7fff; }
    LV.ws.send(JSON.stringify({ realtimeInput: { audio: { data: aiB64(new Uint8Array(out.buffer)), mimeType: 'audio/pcm;rate=16000' } } }));
  };
  src.connect(proc); proc.connect(ctx.destination);
}
async function lvStart() {
  if (LV.state !== 'off') return;
  window.listenStop?.(true); window.ttsStop?.();
  if (!/^https?:/.test(location.protocol)) return toast('Hlasový rozhovor funguje len cez server (npm run dev / Vercel)');
  const AC = window.AudioContext || window.webkitAudioContext; const ctx = LV.ctx = new AC(); ctx.resume?.(); LV.next = 0;
  LV.an = ctx.createAnalyser(); LV.an.fftSize = 1024; LV.an.connect(ctx.destination);
  ctx.onstatechange = () => { if (LV.ctx !== ctx || LV.state === 'off') return; if (ctx.state !== 'running') { lvFlush(); ctx.resume?.().catch(() => {}); } };
  try { if (navigator.audioSession) navigator.audioSession.type = 'play-and-record'; } catch (e) {}
  const sc = screenContext();
  LV.state = 'connecting'; LV.err = ''; LV.tr = []; LV.logged = []; LV.phrases = []; LV.t0 = Date.now(); LV.label = sc.label;
  CH.msgs = []; CH.label = sc.label;
  render();
  if (!LV.raf) LV.raf = requestAnimationFrame(lvLoop);
  try {
    const micP = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
    const [stream, tok] = await Promise.all([micP, api({ live: true }, 20000)]);
    if (LV.state !== 'connecting' || LV.ctx !== ctx) { stream.getTracks().forEach(t => t.stop()); return; }
    LV.stream = stream; lvMic();
    const skr = { low: 'Sprich fast ausschließlich Deutsch.', mid: 'Wenn der Lerner etwas nicht versteht, erkläre kurz auf Slowakisch.', high: 'Erkläre Grammatik und unbekannte Wörter ruhig auf Slowakisch, dann weiter auf Deutsch.' }[S.settings.skRatio] || '';
    const system = `${tok.system}
SPRACHE: Du sprichst Deutsch (Hochdeutsch, deutlich, etwas langsamer als normal). ${skr}
Gesprochenes Gespräch: kurze Antworten (1–3 Sätze), keine Listen, kein Markdown. Lass den Lerner viel sprechen.
Fehler: korrigiere kurz und natürlich (Recast oder „Man sagt: …“) und rufe IMMER log_mistake auf. Fragt er nach einem Wort: sag es und rufe save_phrase auf.
STEUERUNG PER STIMME: Der Lerner bedient die App NUR mit der Stimme (oft im Auto, Befehle oft auf Slowakisch). Wenn er ein Thema, die Grammatik, seine Fehler, den Fortschritt usw. öffnen will („otvor…“, „poďme na…“, „ukáž…“), rufe navigate auf und mach dann dort weiter. „Vyskúšaj ma / kvíz / opakujme“ → get_quiz_cards, dann Karte für Karte (slowakisch vorlesen, er antwortet deutsch, grade_card, kurz korrigieren, nachsprechen lassen). „Koľko mám…/ako mi to ide“ → get_progress. Bestätige Navigation in einem kurzen Satz.
Duze den Lerner, außer in Rollenspielen mit Sie-Form.

${memoryBlock()}

AKTUELLER BILDSCHIRM: ${sc.label}
${sc.text}

AUFGABE FÜR DEN START: ${sc.start}`;
    const ws = LV.ws = new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=' + encodeURIComponent(tok.token));
    ws.onopen = () => ws.send(JSON.stringify({ setup: {
      model: 'models/' + tok.model,
      generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: tok.voice } } } },
      systemInstruction: { parts: [{ text: system }] },
      tools: LV_TOOLS,
      inputAudioTranscription: {}, outputAudioTranscription: {},
      realtimeInputConfig: { automaticActivityDetection: { silenceDurationMs: 900 } },
      contextWindowCompression: { slidingWindow: {} },
    } }));
    ws.onmessage = async e => { if (ws !== LV.ws) return; let t = e.data; if (typeof t !== 'string') t = await (t.text ? t.text() : new Response(t).text()); let m; try { m = JSON.parse(t); } catch (x) { return; } lvMsg(m); };
    ws.onclose = e => { if (ws !== LV.ws) return; const was = LV.state; lvStop(); if (e.code !== 1000 || was !== 'listening') toast(`Rozhovor sa ukončil${e.code ? ` (${e.code}${e.reason ? ': ' + e.reason : ''})` : ''}`); };
  } catch (e) {
    LV.err = e.name === 'NotAllowedError' ? 'Prístup k mikrofónu je zamietnutý' : (e.message || String(e));
    lvStop(true); toast(LV.err, 5000);
  }
}
function lvStop(silent) {
  if (LV.state === 'off') return;
  LV.state = 'off'; const ws = LV.ws; LV.ws = null; try { if (ws && ws.readyState < 2) ws.close(1000); } catch (e) {}
  try { LV.proc?.disconnect(); LV.src?.disconnect(); } catch (e) {} LV.proc = LV.src = null; LV.stream?.getTracks().forEach(t => t.stop()); LV.stream = null;
  lvFlush(); try { LV.ctx?.close(); } catch (e) {} LV.ctx = LV.an = null; LV.micLv = LV.lv = 0; cancelAnimationFrame(LV.raf); LV.raf = 0;
  try { if (navigator.audioSession) navigator.audioSession.type = 'auto'; } catch (e) {}
  if (window.DRIVE && DRIVE.mode !== 'listen') DRIVE.mode = null;
  render();
  if (!silent) lvReview();
}
/* long-term memory handed to Lena at the start of every conversation */
function memoryBlock() {
  const facts = S.profile.facts.slice(0, 30).map(f => '- ' + f.t).join('\n');
  const sess = S.sessions.filter(s => s.summary).slice(0, 4).map(s => `- ${fmtD(s.at)} (${s.ctx}): ${s.summary}`).join('\n');
  const freq = [...S.mistakes].sort((a, b) => (b.n || 1) - (a.n || 1)).slice(0, 6).map(m => `- „${m.wrong}“ → „${m.right}“ (${m.n || 1}×)`).join('\n');
  const known = Object.keys(S.srs).filter(id => ITEMS[id] && status(id) === 'known').length;
  return `GEDÄCHTNIS (dauerhaft, aus früheren Sitzungen – nutze es natürlich, z. B. „Letztes Mal hast du erzählt…“):
Was du über den Lerner weißt:\n${facts || '- noch nichts (frag ihn nach Arbeit, Plänen, Interessen und merke es dir mit remember)'}
Letzte Gespräche:\n${sess || '- erstes Gespräch'}
Fortschritt: ${known} Wendungen sicher gelernt, ${dueIds().length} Karten fällig, ${S.mistakes.length} gespeicherte Fehler, Serie ${streak()} Tage. Schwache Grammatik: ${weakTopics().slice(0, 4).map(([g]) => topicName(g)).join(', ') || '—'}.
Häufigste Fehler:\n${freq || '- keine'}`;
}

/* after a conversation: summary + mistakes the tutor did not log live; read aloud on the home screen */
async function lvReview() {
  const min = (Date.now() - LV.t0) / 60000, tr = LV.tr.filter(t => t.text.trim()), userTurns = tr.filter(t => t.role === 'user').length;
  if (min > 0.2) { act('min', min); xp(Math.round(min * 3)); }
  const sess = { id: uid('s'), at: new Date().toISOString(), kind: 'live', ctx: LV.label, min, turns: userTurns, mistakes: [...LV.logged], phrases: [...LV.phrases], summary: '' };
  if (userTurns < 2) { if (userTurns) { S.sessions.unshift(sess); save(); } return; }
  LV.reviewing = true; renderLive();
  try {
    const j = await api({ json: `Analysiere dieses gesprochene Gespräch zwischen einem slowakischen Deutschlerner (USER) und seiner Tutorin (TUTOR). Die Transkription des USER kann Spracherkennungsfehler enthalten – markiere nur sichere Grammatik-/Wortschatzfehler.
Bereits gespeicherte Fehler (nicht wiederholen): ${LV.logged.map(m => m.wrong + ' → ' + m.right).join(' | ') || '—'}
Transkript:\n${tr.map(t => (t.role === 'user' ? 'USER: ' : 'TUTOR: ') + t.text.trim()).join('\n').slice(0, 30000)}
JSON: {"summary_sk":"2–3 Sätze auf Slowakisch (zum Vorlesen): worüber gesprochen wurde und wie es lief, ehrlich und ermutigend","mistakes":[{"wrong":"...","right":"...","explain":"kurz auf Slowakisch","topic":"${TOPICS}"}],"phrases":[{"de":"nützliche Wendung zum Lernen","sk":"..."}],"tips_sk":["1–3 konkrete Tipps auf Slowakisch"],"facts_sk":["neue dauerhafte Fakten über den Lerner aus dem Gespräch (Arbeit, Pläne, Interessen, Lernziele), kurz auf Slowakisch, max. 4, nur wenn wirklich neu"]}
mistakes max. 8, phrases max. 5.`, think: 'low' }, 60000);
    const d = j.data || {};
    (d.mistakes || []).forEach(x => { const m = addMistake(x, 'voice'); if (m) sess.mistakes.push({ wrong: m.wrong, right: m.right }); });
    (d.phrases || []).filter(p => p.de && p.sk).slice(0, 5).forEach(p => { const w = addWord(p, 'voice'); if (w) sess.phrases.push({ de: w.de, sk: w.sk }); });
    (d.facts_sk || []).slice(0, 4).forEach(f => remember(f));
    sess.summary = d.summary_sk || ''; sess.tips = d.tips_sk || [];
  } catch (e) { sess.summary = ''; toast('Vyhodnotenie zlyhalo: ' + e.message); }
  LV.reviewing = false;
  S.sessions.unshift(sess); S.sessions = S.sessions.slice(0, 200); save();
  render();
}

/* ---------- live bar: visible on every screen except home while talking ---------- */
function renderLive() {
  window.renderDrive?.();
  const bar = $('#livebar'); if (!bar) return;
  const on = LV.state !== 'off' || LV.reviewing;
  if (!on || ROUTE.name === 'home') { bar.hidden = true; return; }
  const last = [...CH.msgs].reverse().find(m => m.role === 'live' || m.role === 'sys');
  const st = LV.reviewing ? 'Vyhodnocujem…' : LV.state === 'connecting' ? 'Pripájam…' : aiSpeaking() ? 'Lena hovorí' : 'Počúvam';
  bar.hidden = false;
  bar.innerHTML = iconize(`<button class="lb-mic voice live" data-act="voice" aria-label="Ukončiť">${ic('stop')}</button><div class="lb-t"><b>${st}</b><span>${esc(last ? last.text.slice(-120) : CH.label)}</span></div><a class="lb-home" href="#/" aria-label="Domov">${ic('home')}</a>`);
}

/* ---------- actions ---------- */
window.talkAction = (a, b) => {
  switch (a) {
    case 'voice': if (LV.state === 'off') lvStart(); else lvStop(); break;
    case 'scen': TALK.scenario = b.dataset.id; lvStart(); break;
  }
};
window.onScreenChange = () => { renderTop(); renderLive(); };

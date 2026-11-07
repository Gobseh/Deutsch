// Vercel serverless function: German tutor on Google Gemini (same setup as "Project management").
// The Gemini key lives only in the env var GEMINI_API_KEY (never in the page).
// Only signed-in users (valid Supabase session) may call it. Locally, ALLOW_NO_AUTH=1 skips the check.

const SUPABASE_URL = 'https://whdrarypezuptwdjdcdp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YfBi-d7c4xwtVjZ1uNswLw_u3RNj01a'; // public key, same as in the page
const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const FALLBACKS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-flash-lite-latest,gemini-2.5-flash').split(',').map(s => s.trim()).filter(Boolean);
const LIVE_MODEL = process.env.GEMINI_LIVE_MODEL || 'gemini-3.8-live';
const LIVE_VOICE = process.env.GEMINI_LIVE_VOICE || 'Kore';
const busy = (status, j) => status === 503 || status === 429 || status === 500 || /overloaded|high demand|unavailable|try again/i.test(j?.error?.message || '');
const THINK = { minimal: [{ thinkingLevel: 'minimal' }, { thinkingBudget: 0 }, null], low: [{ thinkingLevel: 'low' }, { thinkingBudget: 512 }, null] };
const thinkOk = {};
const short = m => m.replace(/^gemini-/, '');

async function callModel(model, payload, think, ms, ctrl) {
  const opts = THINK[think] || [null];
  let last = { ok: false, json: {}, status: 0, model };
  for (let k = thinkOk[model + think] ?? 0; k < opts.length; k++) {
    const gc = { ...(payload.generationConfig || {}) };
    if (opts[k]) gc.thinkingConfig = opts[k];
    try {
      const timeout = AbortSignal.timeout(ms);
      const signal = AbortSignal.any ? AbortSignal.any([ctrl.signal, timeout]) : timeout;
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({ ...payload, generationConfig: gc }),
        signal,
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { thinkOk[model + think] = k; return { ok: true, json: j, status: r.status, model }; }
      last = { ok: false, json: j, status: r.status, model };
      if (r.status === 400 && opts[k] && /think/i.test(j.error?.message || '')) continue;
      return last;
    } catch (e) {
      const to = e.name === 'TimeoutError' || e.name === 'AbortError';
      return { ok: false, json: { error: { message: to ? `${model} did not answer in time` : 'Could not reach Gemini' } }, status: to ? 504 : 502, model };
    }
  }
  return last;
}

// Hedged call: if the first model is slow or busy, start the next one; first good answer wins.
function generate(payload, { models, think = 'low', budgetMs = 45000, callMs = 20000, hedgeMs = 6000 } = {}) {
  models = [...new Set((models || [MODEL, ...FALLBACKS]).filter(Boolean))];
  return new Promise(resolve => {
    const t0 = Date.now(), ctrls = [], trace = [];
    let idx = 0, running = 0, done = false, last = null, hedge = null;
    const finish = res => { if (done) return; done = true; clearTimeout(hedge); ctrls.forEach(c => c.abort()); resolve({ ...res, ms: Date.now() - t0, trace }); };
    const fail = () => finish(last || { ok: false, json: { error: { message: 'No model answered' } }, status: 502, model: models[0] });
    const startNext = () => {
      if (done) return;
      const left = budgetMs - (Date.now() - t0);
      if (idx >= models.length || left < 3000) { if (!running) fail(); return; }
      const model = models[idx++], c = new AbortController(), ts = Date.now();
      ctrls.push(c); running++;
      clearTimeout(hedge); if (idx < models.length) hedge = setTimeout(startNext, hedgeMs);
      callModel(model, payload, think, Math.min(left, callMs), c).then(r => {
        running--; if (done) return;
        trace.push(`${short(model)} ${r.ok ? ((Date.now() - ts) / 1000).toFixed(1) + ' s' : r.status}`);
        if (r.ok) return finish(r);
        last = r;
        if (!busy(r.status, r.json) && r.status !== 404 && r.status !== 504 && r.status !== 502) return finish(r);
        startNext();
        if (!running && !done) fail();
      });
    };
    startNext();
  });
}
const textOf = j => (j.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('').trim();
function parseJSON(t) {
  try { return JSON.parse(t); } catch (e) {}
  const m = t.match(/[\[{][\s\S]*[\]}]/);
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return null;
}

/* ---------------- prompts ---------------- */
const TUTOR = `Du bist „Lena“, eine erfahrene, warmherzige Deutschlehrerin und Gesprächspartnerin für einen slowakischen Muttersprachler.
Lernerprofil: spricht Deutsch etwa auf Niveau B1/B2, versteht viel, macht aber Grammatikfehler (Artikel, Kasus, Adjektivendungen, Satzstellung, Perfekt haben/sein, Präpositionen).
Ziel: flüssiges gesprochenes Alltags- und Business-Deutsch. Schreiben muss nicht perfekt sein.
Methodik (folge ihr):
- Comprehensible input i+1: sprich natürlich, aber etwas langsamer und klarer als unter Muttersprachlern; benutze häufige Wendungen (Chunks).
- Output fördern: der Lerner soll MEHR sprechen als du. Stelle offene Fragen, eine Frage pro Antwort, halte deine Antworten kurz (1–3 Sätze).
- Korrektives Feedback: Bei Fehlern zuerst eine natürliche Umformulierung (Recast) einbauen. Bei wichtigen oder wiederholten Fehlern kurz und freundlich explizit korrigieren.
- Bleib beim Thema/Szenario des aktuellen Bildschirms, aber reagiere flexibel auf den Lerner.
- Wenn der Lerner etwas nicht versteht oder auf Slowakisch fragt, erkläre kurz auf Slowakisch und kehre dann zum Deutschen zurück.
- Nie über Fehler belehren, die keine sind. Österreichische/schweizerische Varianten sind ok.`;

const CHAT_FORMAT = `Antworte AUSSCHLIESSLICH als JSON-Objekt mit diesen Feldern:
{
 "reply": "deine nächste Antwort auf Deutsch (kurz, natürlich, mit einer Frage, die das Gespräch weiterführt)",
 "reply_sk": "slowakische Übersetzung von reply",
 "corrections": [ { "wrong": "fehlerhafter Teil aus der LETZTEN Nachricht des Lerners", "right": "korrekte Form", "explain": "kurze Erklärung auf Slowakisch (1 Satz)", "topic": "eine id aus: word-order, articles-gender, cases-akk-dat, prepositions, adjective-endings, perfekt, separable-verbs, modal-verbs, konjunktiv-ii, reflexive, passive, connectors, negation, relative-clauses, vocabulary, style" } ],
 "better": "die ganze letzte Nachricht des Lerners in natürlichem, korrektem Deutsch (leer, wenn sie schon gut war)",
 "phrases": [ { "de": "nützliche Wendung, die zum Gespräch passt", "sk": "slowakisch" } ]
}
corrections: nur echte Fehler der letzten Lerner-Nachricht (max. 4); bei slowakischen Wörtern in der Nachricht gib das deutsche Wort als "right" an (topic "vocabulary"). Wenn die Nachricht auf Slowakisch war, hilf ihr auf Deutsch zu sagen (better). phrases: 0–2 Stück.`;

const JSON_SYS = `Du bist ein präziser Deutschlehrer für slowakische Lerner (Niveau B1/B2, Fokus gesprochenes Alltags- und Business-Deutsch).
Antworte immer ausschließlich mit gültigem JSON im verlangten Format. Slowakisch immer mit korrekter Diakritik. Deutsch immer korrekt und natürlich.`;

/* ---------------- handlers ---------------- */
async function chat(body, res) {
  const { message, history = [], context = '', settings = {} } = body;
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Missing message' });
  const sk = { low: 'Sprich fast nur Deutsch.', mid: 'Erkläre Grammatik kurz auf Slowakisch, wenn nötig.', high: 'Erkläre gern auf Slowakisch, der Lerner braucht mehr Unterstützung.' }[settings.skRatio] || '';
  const sys = `${TUTOR}\n${sk}\n\nAKTUELLER KONTEXT (wo der Lerner in der App gerade ist):\n${String(context).slice(0, 12000)}\n\n${CHAT_FORMAT}`;
  const contents = [
    ...history.slice(-16).filter(h => h && h.text).map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: [{ text: String(h.text).slice(0, 3000) }] })),
    { role: 'user', parts: [{ text: message.slice(0, 3000) }] },
  ];
  if (contents[0].role === 'model') contents.unshift({ role: 'user', parts: [{ text: 'Hallo!' }] });
  const g = await generate({
    systemInstruction: { parts: [{ text: sys }] }, contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 4096, responseMimeType: 'application/json' },
  }, { think: 'minimal', budgetMs: 45000, callMs: 22000 });
  if (!g.ok) return res.status(502).json({ error: `Gemini (${g.model}): ${g.json.error?.message || g.status}` });
  const t = textOf(g.json); const j = parseJSON(t);
  if (!j || !j.reply) return res.status(200).json({ reply: t || '…', reply_sk: '', corrections: [], phrases: [], model: g.model });
  return res.status(200).json({ ...j, model: g.model, ms: g.ms });
}

async function json(body, res) {
  const prompt = String(body.json || '').slice(0, 60000);
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  const g = await generate({
    systemInstruction: { parts: [{ text: JSON_SYS }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: body.temperature ?? 0.4, maxOutputTokens: 8192, responseMimeType: 'application/json' },
  }, { think: body.think === 'low' ? 'low' : 'minimal', budgetMs: 50000, callMs: 25000 });
  if (!g.ok) return res.status(502).json({ error: `Gemini (${g.model}): ${g.json.error?.message || g.status}` });
  const data = parseJSON(textOf(g.json));
  if (data == null) return res.status(502).json({ error: 'Gemini returned no valid JSON' });
  return res.status(200).json({ data, model: g.model, ms: g.ms });
}

async function liveToken(res) {
  const now = Date.now();
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        uses: 1,
        expireTime: new Date(now + 30 * 60000).toISOString(),
        newSessionExpireTime: new Date(now + 2 * 60000).toISOString(),
      }),
      signal: AbortSignal.timeout(15000),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.name) return res.status(502).json({ error: `Gemini Live token: ${j.error?.message || r.status}` });
    return res.status(200).json({ token: j.name, model: LIVE_MODEL, voice: LIVE_VOICE, system: TUTOR });
  } catch (e) {
    return res.status(504).json({ error: 'Could not get a Gemini Live token' });
  }
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server' });

  if (process.env.ALLOW_NO_AUTH !== '1' || process.env.VERCEL) { // auth is always required on Vercel
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Prihlás sa (Nastavenia → Účet), aby si mohol používať AI' });
    try {
      const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } });
      if (!u.ok) return res.status(401).json({ error: 'Prihlásenie vypršalo – prihlás sa znova' });
      // only these accounts may use the AI (comma-separated e-mails in the Vercel env var ALLOWED_EMAILS)
      const allowed = (process.env.ALLOWED_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
      const user = await u.json().catch(() => ({}));
      if (allowed.length && !allowed.includes(String(user.email || '').toLowerCase())) return res.status(403).json({ error: 'Tento účet nemá prístup k AI' });
    } catch (e) {
      return res.status(502).json({ error: 'Could not verify the session' });
    }
  }

  let body;
  try { body = await readBody(req); } catch (e) { return res.status(400).json({ error: 'Bad request' }); }
  if (body?.live) return liveToken(res);
  if (typeof body?.message === 'string') return chat(body, res);
  if (typeof body?.json === 'string') return json(body, res);
  return res.status(400).json({ error: 'Unknown request' });
};

// Local dev server: serves the static app and runs api/ai.js like Vercel does.
// Usage: put GEMINI_API_KEY=... into .env.local, then `node server.js` and open http://localhost:3000
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
for (const f of ['.env.local', '.env']) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) fs.readFileSync(p, 'utf8').split(/\r?\n/).forEach(l => {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
}
if (process.env.ALLOW_NO_AUTH === undefined) process.env.ALLOW_NO_AUTH = '1'; // local only
const handler = require('./api/ai.js');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const PORT = +process.env.PORT || 3000;
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/ai') {
    res.status = c => { res.statusCode = c; return res; };
    res.json = o => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); };
    try { await handler(req, res); } catch (e) { console.error(e); if (!res.headersSent) res.status(500).json({ error: String(e.message || e) }); }
    return;
  }
  let p = path.normalize(path.join(root, decodeURIComponent(url.pathname)));
  if (!p.startsWith(root) || /[\/]\.(env|git)/.test(p) || p.includes(path.sep + 'api' + path.sep)) { res.statusCode = 403; return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) p = path.join(root, 'index.html');
  res.setHeader('Content-Type', TYPES[path.extname(p)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-cache');
  fs.createReadStream(p).pipe(res);
}).listen(PORT, () => console.log(`Nemčina beží na http://localhost:${PORT}  (Gemini key: ${process.env.GEMINI_API_KEY ? 'OK' : 'CHÝBA – doplň .env.local'})`));

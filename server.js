// Local run: ANTHROPIC_API_KEY=sk-ant-... node server.js  →  http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');
const claude = require('./api/claude');

try { // minimal .env support
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n').forEach(l => {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch {}

http.createServer((req, res) => {
  if (req.url.startsWith('/api/claude')) {
    if (req.method !== 'POST') return claude(req, res);
    let raw = ''; req.on('data', c => (raw += c)); req.on('end', () => { req.body = raw; claude(req, res); });
    return;
  }
  fs.readFile(path.join(__dirname, 'index.html'), (err, html) => {
    if (err) { res.statusCode = 500; return res.end('index.html missing'); }
    res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(html);
  });
}).listen(process.env.PORT || 3000, () => console.log(`Saathi on http://localhost:${process.env.PORT || 3000} · AI key ${process.env.ANTHROPIC_API_KEY ? 'loaded' : 'MISSING'}`));

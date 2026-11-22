// Serverless proxy to Claude (Vercel: /api/claude). Also used by server.js for local runs.
// The API key lives only in the ANTHROPIC_API_KEY environment variable — never in the browser or the repo.
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';

module.exports = async function handler(req, res) {
  const send = (code, obj) => { res.statusCode = code; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(obj)); };
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === 'GET') return send(200, { ok: !!key, model: MODEL, reason: key ? undefined : 'ANTHROPIC_API_KEY not set' });
  if (req.method !== 'POST') return send(405, { error: 'POST only' });
  if (!key) return send(503, { error: 'ANTHROPIC_API_KEY not set' });

  let body = req.body;
  if (!body || typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch { return send(400, { error: 'bad JSON' }); } }
  const { system, content } = body;
  if (!content) return send(400, { error: 'content required' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 900, system: String(system || '').slice(0, 8000), messages: [{ role: 'user', content }] })
    });
    const data = await r.json();
    return send(r.status, data);
  } catch (e) {
    return send(502, { error: String(e.message || e) });
  }
};

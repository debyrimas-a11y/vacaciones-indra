const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9Cz9e1PrtmLy9oZ-us5uLG0OpTW0uXoUYwkKBEbAcUeB9bZHbPYngE9hw48z_aqIh-w/exec";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const action = req.method === "POST" ? req.body?.action : req.query?.action;
    const employees = req.method === "POST" ? req.body?.employees : null;
    const periods   = req.method === "POST" ? req.body?.periods   : null;

    const params = new URLSearchParams({ action });
    if (employees) params.append("employees", JSON.stringify(employees));
    if (periods)   params.append("periods",   JSON.stringify(periods));

    const googleRes = await fetch(`${SCRIPT_URL}?${params.toString()}`);
    const text = await googleRes.text();

    let data;
    try { data = JSON.parse(text); }
    catch { data = { ok: false, error: "Respuesta inválida de Google: " + text.substring(0, 200) }; }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.toString() });
  }
}

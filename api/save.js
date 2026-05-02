const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9Cz9e1PrtmLy9oZ-us5uLG0OpTW0uXoUYwkKBEbAcUeB9bZHbPYngE9hw48z_aqIh-w/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    let action, employees, periods;

    if (req.method === "POST") {
      ({ action, employees, periods } = req.body);
    } else {
      ({ action, employees, periods } = req.query);
    }

    const params = new URLSearchParams({ action });
    if (employees) params.append("employees", JSON.stringify(employees));
    if (periods)   params.append("periods",   JSON.stringify(periods));

    const googleRes = await fetch(`${SCRIPT_URL}?${params.toString()}`);
    const data = await googleRes.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.toString() });
  }
}

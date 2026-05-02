const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9Cz9e1PrtmLy9oZ-us5uLG0OpTW0uXoUYwkKBEbAcUeB9bZHbPYngE9hw48z_aqIh-w/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // GET → getAll
    if (req.method === "GET") {
      const googleRes = await fetch(`${SCRIPT_URL}?action=getAll`);
      const data = await googleRes.json();
      return res.status(200).json(data);
    }

    // POST → saveAll
    if (req.method === "POST") {
      const body = req.body;
      console.log("Body recibido:", JSON.stringify(body).substring(0, 200));

      const { employees, periods } = body;

      const params = new URLSearchParams({
        action: "saveAll",
        employees: JSON.stringify(employees),
        periods: JSON.stringify(periods)
      });

      const googleRes = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      const text = await googleRes.text();
      console.log("Respuesta de Google:", text.substring(0, 300));

      let data;
      try { data = JSON.parse(text); }
      catch { data = { ok: false, error: "Google respondió: " + text.substring(0, 200) }; }

      return res.status(200).json(data);
    }

    return res.status(405).json({ ok: false, error: "Método no permitido" });

  } catch (err) {
    console.error("Error en proxy:", err);
    return res.status(500).json({ ok: false, error: err.toString() });
  }
}

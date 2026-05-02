const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9Cz9e1PrtmLy9oZ-us5uLG0OpTW0uXoUYwkKBEbAcUeB9bZHbPYngE9hw48z_aqIh-w/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // GET → getAll (datos pequeños, GET está bien)
    if (req.method === "GET") {
      const googleRes = await fetch(`${SCRIPT_URL}?action=getAll`);
      const data = await googleRes.json();
      return res.status(200).json(data);
    }

    // POST → saveAll usando POST a Google (evita límite de URL)
    if (req.method === "POST") {
      const { employees, periods } = req.body;

      const googleRes = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveAll",
          employees,
          periods
        }),
        redirect: "follow"
      });

      const text = await googleRes.text();
      console.log("Respuesta Google:", text.substring(0, 300));

      let data;
      try { data = JSON.parse(text); }
      catch { data = { ok: false, error: "Google respondió: " + text.substring(0, 300) }; }

      return res.status(200).json(data);
    }

    return res.status(405).json({ ok: false, error: "Método no permitido" });

  } catch (err) {
    console.error("Error en proxy:", err);
    return res.status(500).json({ ok: false, error: err.toString() });
  }
}

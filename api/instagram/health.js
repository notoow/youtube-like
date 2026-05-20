const { getInstagramHealth, verifyInstagramAdminKey } = require("../../lib/instagram");

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type, X-Instagram-Admin-Key");
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    verifyInstagramAdminKey(req);
    const health = await getInstagramHealth();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(health);
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || "Instagram health check failed.",
      meta: error.meta || null,
    });
  }
};

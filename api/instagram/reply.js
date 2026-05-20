const { replyToInstagramComment } = require("../../lib/instagram");

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const data = await replyToInstagramComment({
      commentId: String(body.commentId || "").trim(),
      message: String(body.message || "").trim(),
    });
    res.status(200).json({ ok: true, data });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || "Instagram reply could not be posted.",
      meta: error.meta || null,
    });
  }
};

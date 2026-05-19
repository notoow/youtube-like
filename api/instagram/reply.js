const { replyToInstagramComment } = require("../../lib/instagram");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
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

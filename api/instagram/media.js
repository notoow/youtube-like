const { buildInstagramInbox, verifyInstagramAdminKey } = require("../../lib/instagram");

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
    const inbox = await buildInstagramInbox({
      limit: req.query.limit,
      commentsLimit: req.query.commentsLimit,
    });
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(inbox);
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || "Instagram comments could not be loaded.",
      meta: error.meta || null,
    });
  }
};

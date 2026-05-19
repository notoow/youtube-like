const { buildInstagramInbox } = require("../../lib/instagram");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
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

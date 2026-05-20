const crypto = require("crypto");

const DEFAULT_GRAPH_VERSION = "v23.0";

function verifyInstagramAdminKey(req) {
  const expected = String(process.env.INSTAGRAM_ADMIN_KEY || "").trim();
  if (!expected) {
    const error = new Error("INSTAGRAM_ADMIN_KEY is not configured.");
    error.status = 503;
    error.meta = { missing: ["INSTAGRAM_ADMIN_KEY"] };
    throw error;
  }

  const provided = String(req.headers["x-instagram-admin-key"] || "").trim();
  if (!provided || !secureCompare(provided, expected)) {
    const error = new Error("Instagram admin key is required.");
    error.status = 401;
    throw error;
  }
}

function secureCompare(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function buildInstagramInbox({ limit = 50, commentsLimit = 50 } = {}) {
  const config = getConfig();
  if (!config.accessToken || !config.accountId) {
    const missing = [
      !config.accessToken ? "META_ACCESS_TOKEN" : "",
      !config.accountId ? "INSTAGRAM_BUSINESS_ACCOUNT_ID" : "",
    ].filter(Boolean);
    const error = new Error(`Instagram API is not configured. Missing: ${missing.join(", ")}.`);
    error.status = 503;
    error.meta = { missing };
    throw error;
  }

  const mediaLimit = normalizeLimit(limit, 50, 500);
  const commentLimit = normalizeLimit(commentsLimit, 50, 100);
  const mediaItems = await fetchPagedGraph(config, `${config.accountId}/media`, {
    fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,comments_count,like_count",
    limit: String(Math.min(mediaLimit, 100)),
  }, mediaLimit);

  const media = [];
  for (const item of mediaItems) {
    const comments = await fetchCommentsForMedia(config, item.id, commentLimit);
    media.push(normalizeMedia(item, comments, config.ownerUsername));
  }

  return addInboxStats({
    source: "meta",
    needsConfiguration: false,
    account: {
      id: config.accountId,
      username: config.ownerUsername,
    },
    media,
  });
}

async function getInstagramHealth() {
  const config = getConfig();
  if (!config.accessToken || !config.accountId) {
    const missing = [
      !config.accessToken ? "META_ACCESS_TOKEN" : "",
      !config.accountId ? "INSTAGRAM_BUSINESS_ACCOUNT_ID" : "",
    ].filter(Boolean);
    const error = new Error(`Instagram API is not configured. Missing: ${missing.join(", ")}.`);
    error.status = 503;
    error.meta = { missing };
    throw error;
  }

  const account = await graphFetch(config, config.accountId, {
    fields: "id,username,name,profile_picture_url",
  });

  return {
    ok: true,
    source: "meta",
    checkedAt: new Date().toISOString(),
    graphVersion: config.graphVersion,
    account: {
      id: account.id || config.accountId,
      username: account.username || config.ownerUsername,
      name: account.name || "",
      profilePictureUrl: account.profile_picture_url || "",
    },
  };
}

async function fetchCommentsForMedia(config, mediaId, limit) {
  const data = await graphFetch(config, `${mediaId}/comments`, {
    fields: "id,text,username,timestamp,like_count,replies.limit(25){id,text,username,timestamp,like_count}",
    limit: String(limit),
  });

  return (data.data || []).map((comment) => normalizeComment(comment, config.ownerUsername));
}

async function replyToInstagramComment({ commentId, message }) {
  const config = getConfig();
  if (!config.accessToken) {
    const error = new Error("META_ACCESS_TOKEN is not configured.");
    error.status = 501;
    throw error;
  }
  if (!commentId || !message) {
    const error = new Error("commentId and message are required.");
    error.status = 400;
    throw error;
  }

  return graphFetch(
    config,
    `${commentId}/replies`,
    { message },
    { method: "POST" },
  );
}

function normalizeMedia(item, comments, ownerUsername) {
  const title = getTitleFromCaption(item.caption) || "Instagram 영상";
  const normalizedComments = comments.map((comment) => ({
    ...comment,
    hasOwnerReply: comment.hasOwnerReply || hasOwnerReply(comment.replies, ownerUsername),
  }));

  return {
    id: item.id,
    title,
    caption: item.caption || "",
    mediaType: item.media_type || "",
    thumbnailUrl: item.thumbnail_url || item.media_url || "",
    permalink: item.permalink || "",
    timestamp: item.timestamp || "",
    commentsCount: item.comments_count || normalizedComments.length,
    likeCount: item.like_count || 0,
    needsReplyCount: normalizedComments.filter((comment) => !comment.hasOwnerReply).length,
    comments: normalizedComments,
  };
}

function normalizeComment(comment, ownerUsername) {
  const replies = (comment.replies?.data || []).map((reply) => ({
    id: reply.id,
    username: reply.username || "",
    text: reply.text || "",
    timestamp: reply.timestamp || "",
    likeCount: reply.like_count || 0,
  }));

  return {
    id: comment.id,
    username: comment.username || "",
    text: comment.text || "",
    timestamp: comment.timestamp || "",
    likeCount: comment.like_count || 0,
    category: classifyComment(comment.text || ""),
    hasOwnerReply: hasOwnerReply(replies, ownerUsername),
    replies,
  };
}

function addInboxStats(inbox) {
  const comments = inbox.media.flatMap((item) => item.comments || []);
  const candidates = comments.filter((comment) => !comment.hasOwnerReply);
  inbox.stats = {
    needsReply: candidates.length,
    questions: candidates.filter((comment) => comment.category === "question").length,
    price: candidates.filter((comment) => comment.category === "price").length,
    warnings: candidates.filter((comment) => comment.category === "warning").length,
  };
  inbox.media = inbox.media
    .map((item) => ({
      ...item,
      needsReplyCount: (item.comments || []).filter((comment) => !comment.hasOwnerReply).length,
    }))
    .sort((a, b) => {
      if (b.needsReplyCount !== a.needsReplyCount) return b.needsReplyCount - a.needsReplyCount;
      return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    });
  return inbox;
}

function classifyComment(text) {
  const normalized = String(text || "").toLowerCase();
  if (/(가격|비용|얼마|상담비|실비|보험)/.test(normalized)) return "price";
  if (/(무조건|100%|보장|제품|영양제|크림|광고|추천하나요|커진다던데)/.test(normalized)) {
    return "warning";
  }
  if (/[?？]|(가능|궁금|되나요|되나|차이|언제|어떻게|뭔가요|무엇)/.test(normalized)) {
    return "question";
  }
  return "reaction";
}

function hasOwnerReply(replies, ownerUsername) {
  const owner = normalizeUsername(ownerUsername);
  if (!owner) return false;
  return replies.some((reply) => normalizeUsername(reply.username) === owner);
}

function normalizeUsername(value) {
  return String(value || "").replace(/^@/, "").trim().toLowerCase();
}

function getTitleFromCaption(caption) {
  const firstLine = String(caption || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
  if (!firstLine) return "";
  return firstLine.length > 42 ? `${firstLine.slice(0, 42)}...` : firstLine;
}

function getConfig() {
  return {
    graphVersion: process.env.META_GRAPH_VERSION || DEFAULT_GRAPH_VERSION,
    accessToken: process.env.META_ACCESS_TOKEN || "",
    accountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "",
    ownerUsername: normalizeUsername(process.env.INSTAGRAM_OWNER_USERNAME || "nonhyeon_dr_koo"),
  };
}

function normalizeLimit(value, fallback, max) {
  if (String(value || "").toLowerCase() === "all") return max;
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return fallback;
  return Math.min(Math.floor(numeric), max);
}

async function fetchPagedGraph(config, path, params = {}, maxItems = 100) {
  const firstUrl = createGraphUrl(config, path, params);
  const items = [];
  let nextUrl = firstUrl.toString();

  while (nextUrl && items.length < maxItems) {
    const data = await graphFetchUrl(nextUrl);
    items.push(...(data.data || []));
    nextUrl = data.paging?.next || "";
  }

  return items.slice(0, maxItems);
}

async function graphFetch(config, path, params = {}, options = {}) {
  const url = createGraphUrl(config, path, params);
  return graphFetchUrl(url, options);
}

function createGraphUrl(config, path, params = {}) {
  const url = new URL(`https://graph.facebook.com/${config.graphVersion}/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  url.searchParams.set("access_token", config.accessToken);

  return url;
}

async function graphFetchUrl(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error?.message || response.statusText);
    error.status = response.status;
    error.meta = data.error;
    throw error;
  }

  return data;
}

module.exports = {
  buildInstagramInbox,
  getInstagramHealth,
  replyToInstagramComment,
  verifyInstagramAdminKey,
};

const DEFAULT_GRAPH_VERSION = "v23.0";

const SAMPLE_INBOX = {
  source: "sample",
  needsConfiguration: true,
  account: {
    id: "sample",
    username: "nonhyeon_dr_koo",
  },
  media: [
    {
      id: "sample-media-1",
      title: "수면마취 잘 안되는 사람 특징",
      caption: "수면마취가 잘 안 되는 경우와 상담 전 확인할 점",
      permalink: "https://www.instagram.com/nonhyeon_dr_koo/",
      timestamp: "2026-05-19T08:30:00.000Z",
      commentsCount: 37,
      comments: [
        createSampleComment("sample-c1", "lager6591", "남자 여유증이랑 함몰유두도 동시에 수술이 가능한가요?", "question", 2),
        createSampleComment("sample-c2", "body_qna", "확대수술 비용은 재료마다 차이가 큰가요? 상담 전에 대략 알고 싶어요.", "price", 5),
        createSampleComment("sample-c3", "fast_growth", "이 제품 먹으면 수술 없이 무조건 커진다던데 병원에서도 추천하나요?", "warning", 24),
        createSampleComment("sample-c4", "real_review_82", "설명 깔끔하네요. 궁금했던 내용이 풀렸습니다.", "reaction", 28),
      ],
    },
    {
      id: "sample-media-2",
      title: "확대수술 후 회복 과정",
      caption: "동종진피 확대수술 후 회복과 사후관리",
      permalink: "https://www.instagram.com/nonhyeon_dr_koo/",
      timestamp: "2026-05-18T04:10:00.000Z",
      commentsCount: 29,
      comments: [
        createSampleComment("sample-c5", "clinic_question", "동종진피랑 필러는 회복 기간이 많이 다른가요?", "question", 9),
        createSampleComment("sample-c6", "natural_size", "자연스러운 정도가 제일 중요한데 상담 때 어떤 걸 보나요?", "question", 12),
      ],
    },
    {
      id: "sample-media-3",
      title: "발기부전 치료 옵션 정리",
      caption: "약물치료와 주사치료를 포함한 발기부전 상담",
      permalink: "https://www.instagram.com/nonhyeon_dr_koo/",
      timestamp: "2026-05-17T06:00:00.000Z",
      commentsCount: 24,
      comments: [
        createSampleComment("sample-c7", "health_check", "당뇨가 있어도 발기부전 주사치료 상담이 가능한가요?", "question", 18),
        createSampleComment("sample-c8", "ed_info", "약 먹어도 효과가 약하면 다음 단계는 뭔가요?", "question", 21),
      ],
    },
    {
      id: "sample-media-4",
      title: "남성수술 상담 전 확인할 점",
      caption: "수술 전 피부 여유, 재료, 기대치 확인",
      permalink: "https://www.instagram.com/nonhyeon_dr_koo/",
      timestamp: "2026-05-15T01:00:00.000Z",
      commentsCount: 18,
      comments: [
        createSampleComment("sample-c9", "first_visit", "상담할 때 사진이나 이전 수술 기록도 가져가야 하나요?", "question", 33),
      ],
    },
    {
      id: "sample-media-5",
      title: "여유증 수술 Q&A",
      caption: "여유증 수술과 회복 Q&A",
      permalink: "https://www.instagram.com/nonhyeon_dr_koo/",
      timestamp: "2026-05-12T05:40:00.000Z",
      commentsCount: 16,
      comments: [
        createSampleComment("sample-c10", "recovery_q", "운동은 보통 언제부터 다시 가능한가요?", "question", 45),
      ],
    },
  ],
};

function createSampleComment(id, username, text, category, hoursAgo) {
  return {
    id,
    username,
    text,
    category,
    timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
    likeCount: Math.floor(hoursAgo / 2),
    hasOwnerReply: false,
    replies: [],
  };
}

function getSampleInbox() {
  return addInboxStats(JSON.parse(JSON.stringify(SAMPLE_INBOX)));
}

async function buildInstagramInbox({ limit = 50, commentsLimit = 50 } = {}) {
  const config = getConfig();
  if (!config.accessToken || !config.accountId) {
    return getSampleInbox();
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
  getSampleInbox,
  replyToInstagramComment,
};

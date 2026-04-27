const STORAGE_KEYS = {
  apiKey: "yt-heart-helper-api-key",
  channelId: "yt-heart-helper-channel-id",
};

const form = document.querySelector("#settingsForm");
const apiKeyInput = document.querySelector("#apiKey");
const channelIdInput = document.querySelector("#channelId");
const videoScopeInput = document.querySelector("#videoScope");
const statusTitle = document.querySelector("#statusTitle");
const statusDetail = document.querySelector("#statusDetail");
const results = document.querySelector("#results");
const template = document.querySelector("#commentTemplate");
const clearButton = document.querySelector("#clearButton");
const filterButtons = [...document.querySelectorAll(".filterButton")];

let comments = [];
let activeFilter = "all";

init();

function init() {
  apiKeyInput.value = localStorage.getItem(STORAGE_KEYS.apiKey) || "";
  channelIdInput.value =
    localStorage.getItem(STORAGE_KEYS.channelId) || channelIdInput.value;
  renderEmpty("아직 불러온 댓글이 없습니다.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const apiKey = apiKeyInput.value.trim();
  const channelId = channelIdInput.value.trim();
  const videoScope = videoScopeInput.value;

  if (!apiKey || !channelId) {
    setStatus("입력 필요", "API 키와 채널 ID를 모두 입력해주세요.");
    return;
  }

  localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
  localStorage.setItem(STORAGE_KEYS.channelId, channelId);

  try {
    setLoading(true);
    comments = [];
    renderEmpty("댓글을 가져오는 중입니다.");

    setStatus("영상 확인 중", "채널의 업로드 영상 목록을 가져오고 있습니다.");
    const videos = await fetchChannelVideos({ apiKey, channelId, videoScope });

    setStatus(
      "댓글 확인 중",
      `${videos.length}개 영상에서 댓글을 끝까지 가져오고 있습니다. 영상이 많으면 시간이 걸립니다.`,
    );
    comments = await fetchCommentsForVideos({ apiKey, videos });
    renderComments();
    setStatus("완료", `${videos.length}개 영상에서 댓글 ${comments.length}개를 불러왔습니다.`);
  } catch (error) {
    console.error(error);
    renderEmpty("댓글을 불러오지 못했습니다.");
    setStatus("오류", explainError(error));
  } finally {
    setLoading(false);
  }
});

clearButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEYS.apiKey);
  localStorage.removeItem(STORAGE_KEYS.channelId);
  apiKeyInput.value = "";
  channelIdInput.value = "UCFCMjPa9xYNKkGQLHAQRTuw";
  setStatus("초기화됨", "브라우저에 저장된 API 키와 채널 ID를 지웠습니다.");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderComments();
  });
});

async function fetchChannelVideos({ apiKey, channelId, videoScope }) {
  const channelParams = new URLSearchParams({
    key: apiKey,
    part: "contentDetails",
    id: channelId,
  });
  const channelData = await getJson(
    `https://www.googleapis.com/youtube/v3/channels?${channelParams}`,
  );
  const uploadsPlaylistId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error("채널의 업로드 재생목록을 찾지 못했습니다.");
  }

  const limit = videoScope === "all" ? Infinity : Number(videoScope);
  const videos = [];
  let pageToken = "";

  while (videos.length < limit) {
    const params = new URLSearchParams({
      key: apiKey,
      part: "snippet,contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: "50",
    });

    if (pageToken) params.set("pageToken", pageToken);

    const data = await getJson(
      `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
    );

    for (const item of data.items || []) {
      const videoId = item.contentDetails?.videoId;
      if (!videoId) continue;
      videos.push({
        id: videoId,
        title: item.snippet?.title || "제목 없음",
        publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt,
      });
      if (videos.length >= limit) break;
    }

    setStatus("영상 확인 중", `영상 ${videos.length}개를 찾았습니다.`);

    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }

  return videos;
}

async function fetchCommentsForVideos({ apiKey, videos }) {
  const collected = [];

  for (const [index, video] of videos.entries()) {
    const videoComments = await fetchAllCommentsForVideo({ apiKey, video });
    collected.push(...videoComments);
    setStatus(
      "댓글 확인 중",
      `${index + 1}/${videos.length}개 영상 처리 완료, 댓글 ${collected.length}개 수집.`,
    );
  }

  return collected.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

async function fetchAllCommentsForVideo({ apiKey, video }) {
  const videoComments = [];
  let pageToken = "";

  while (true) {
    const params = new URLSearchParams({
      key: apiKey,
      part: "snippet,replies",
      videoId: video.id,
      maxResults: "100",
      order: "time",
      textFormat: "plainText",
    });

    if (pageToken) params.set("pageToken", pageToken);

    try {
      const data = await getJson(
        `https://www.googleapis.com/youtube/v3/commentThreads?${params}`,
      );
      videoComments.push(
        ...(data.items || []).map((item) => normalizeComment(item, video)),
      );
      pageToken = data.nextPageToken || "";
      if (!pageToken) break;
    } catch (error) {
      if (String(error.message).includes("commentsDisabled")) {
        return [];
      }
      throw error;
    }
  }

  return videoComments;
}

function normalizeComment(item, video) {
  const snippet = item.snippet.topLevelComment.snippet;
  return {
    id: item.id,
    videoId: video.id,
    videoTitle: decodeHtml(video.title),
    author: snippet.authorDisplayName,
    avatar: snippet.authorProfileImageUrl,
    text: snippet.textDisplay,
    likeCount: snippet.likeCount || 0,
    replyCount: item.snippet.totalReplyCount || 0,
    publishedAt: snippet.publishedAt,
  };
}

async function getJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const reason = data.error?.errors?.[0]?.reason;
    const message = data.error?.message || response.statusText;
    throw new Error(reason ? `${message} (${reason})` : message);
  }

  return data;
}

function renderComments() {
  const filtered = comments.filter((comment) => {
    if (activeFilter === "unreplied") return comment.replyCount === 0;
    if (activeFilter === "liked") return comment.likeCount > 0;
    return true;
  });

  results.replaceChildren();

  if (filtered.length === 0) {
    renderEmpty("조건에 맞는 댓글이 없습니다.");
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach((comment) => {
    const card = template.content.cloneNode(true);
    card.querySelector(".avatar").src = comment.avatar;
    card.querySelector(".author").textContent = comment.author;
    card.querySelector(".meta").textContent =
      `${formatDate(comment.publishedAt)} · ${comment.videoTitle}`;
    card.querySelector(".commentText").textContent = comment.text;
    card.querySelector(".likeBadge").textContent =
      comment.replyCount > 0
        ? `답글 ${comment.replyCount}개 · 좋아요 ${comment.likeCount}개`
        : `답글 없음 · 좋아요 ${comment.likeCount}개`;
    card.querySelector(".watchLink").href =
      `https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}`;
    card.querySelector(".studioLink").href =
      `https://studio.youtube.com/channel/${channelIdInput.value.trim()}/comments/inbox`;
    fragment.append(card);
  });

  results.append(fragment);
}

function renderEmpty(message) {
  results.replaceChildren();
  const empty = document.createElement("p");
  empty.className = "empty";
  empty.textContent = message;
  results.append(empty);
}

function setStatus(title, detail) {
  statusTitle.textContent = title;
  statusDetail.textContent = detail;
}

function setLoading(isLoading) {
  const button = document.querySelector("#loadButton");
  button.disabled = isLoading;
  button.textContent = isLoading ? "불러오는 중" : "댓글 불러오기";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function decodeHtml(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function explainError(error) {
  const message = error.message || "YouTube Data API 요청에 실패했습니다.";
  if (message.includes("Requests from referer") || message.includes("forbidden")) {
    return "API 키의 웹사이트 제한에 https://notoow.github.io/* 를 추가해주세요.";
  }
  return message;
}

const STORAGE_KEYS = {
  apiKey: "yt-heart-helper-api-key",
  channelId: "yt-heart-helper-channel-id",
  clientId: "yt-heart-helper-client-id",
};

const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";

const form = document.querySelector("#settingsForm");
const apiKeyInput = document.querySelector("#apiKey");
const clientIdInput = document.querySelector("#clientId");
const channelIdInput = document.querySelector("#channelId");
const videoScopeInput = document.querySelector("#videoScope");
const statusTitle = document.querySelector("#statusTitle");
const statusDetail = document.querySelector("#statusDetail");
const results = document.querySelector("#results");
const template = document.querySelector("#commentTemplate");
const clearButton = document.querySelector("#clearButton");
const authButton = document.querySelector("#authButton");
const filterButtons = [...document.querySelectorAll(".filterButton")];

let comments = [];
let activeFilter = "all";
let accessToken = "";

init();

function init() {
  apiKeyInput.value = localStorage.getItem(STORAGE_KEYS.apiKey) || "";
  clientIdInput.value =
    localStorage.getItem(STORAGE_KEYS.clientId) || clientIdInput.value;
  channelIdInput.value =
    localStorage.getItem(STORAGE_KEYS.channelId) || channelIdInput.value;
  renderEmpty("아직 불러온 댓글이 없습니다.");
}

authButton.addEventListener("click", async () => {
  try {
    await ensureAccessToken();
    setStatus("Google 연결됨", "이제 댓글 카드에서 답글을 작성할 수 있습니다.");
  } catch (error) {
    setStatus("연결 실패", error.message || "Google OAuth 연결에 실패했습니다.");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const apiKey = apiKeyInput.value.trim();
  const clientId = clientIdInput.value.trim();
  const channelId = channelIdInput.value.trim();
  const videoScope = videoScopeInput.value;

  if (!apiKey || !clientId || !channelId) {
    setStatus("입력 필요", "API 키, OAuth 클라이언트 ID, 채널 ID를 모두 입력해주세요.");
    return;
  }

  localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
  localStorage.setItem(STORAGE_KEYS.clientId, clientId);
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
  localStorage.removeItem(STORAGE_KEYS.clientId);
  accessToken = "";
  apiKeyInput.value = "";
  clientIdInput.value =
    "550773902598-ted9eeglebq3jo5ju7t61rh3gh5bakim.apps.googleusercontent.com";
  channelIdInput.value = "UCFCMjPa9xYNKkGQLHAQRTuw";
  setStatus("초기화됨", "브라우저에 저장된 API 키, OAuth 클라이언트 ID, 채널 ID를 지웠습니다.");
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

async function insertReply({ parentId, text }) {
  const token = await ensureAccessToken();
  const params = new URLSearchParams({ part: "snippet" });
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/comments?${params}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        snippet: {
          parentId,
          textOriginal: text,
        },
      }),
    },
  );
  const data = await response.json();

  if (!response.ok) {
    const reason = data.error?.errors?.[0]?.reason;
    const message = data.error?.message || response.statusText;
    throw new Error(reason ? `${message} (${reason})` : message);
  }

  return data;
}

async function ensureAccessToken() {
  if (accessToken) return accessToken;

  const clientId = clientIdInput.value.trim();
  if (!clientId) {
    throw new Error("OAuth 클라이언트 ID를 입력해주세요.");
  }

  localStorage.setItem(STORAGE_KEYS.clientId, clientId);

  if (!window.google?.accounts?.oauth2) {
    throw new Error("Google 로그인 스크립트를 아직 불러오지 못했습니다. 잠시 뒤 다시 눌러주세요.");
  }

  accessToken = await requestAccessToken(clientId);
  return accessToken;
}

function requestAccessToken(clientId) {
  return new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: YOUTUBE_SCOPE,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (error) => {
        reject(new Error(error.message || "Google OAuth 팝업이 닫혔습니다."));
      },
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  });
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
  const groups = groupCommentsByVideo(filtered);
  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "videoGroup";

    const header = document.createElement("header");
    header.className = "videoGroupHeader";

    const titleBlock = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = group.videoTitle;
    const count = document.createElement("p");
    count.textContent = `댓글 ${group.comments.length}개 · 최신 ${formatDate(group.latestAt)}`;
    titleBlock.append(title, count);

    const watch = document.createElement("a");
    watch.href = `https://www.youtube.com/watch?v=${group.videoId}`;
    watch.target = "_blank";
    watch.rel = "noreferrer";
    watch.textContent = "영상 열기";

    header.append(titleBlock, watch);

    const grid = document.createElement("div");
    grid.className = "videoComments";
    group.comments.forEach((comment) => {
      grid.append(renderCommentCard(comment));
    });

    section.append(header, grid);
    fragment.append(section);
  });

  results.append(fragment);
}

function groupCommentsByVideo(commentList) {
  const byVideo = new Map();

  commentList.forEach((comment) => {
    if (!byVideo.has(comment.videoId)) {
      byVideo.set(comment.videoId, {
        videoId: comment.videoId,
        videoTitle: comment.videoTitle,
        latestAt: comment.publishedAt,
        comments: [],
      });
    }

    const group = byVideo.get(comment.videoId);
    group.comments.push(comment);
    if (new Date(comment.publishedAt) > new Date(group.latestAt)) {
      group.latestAt = comment.publishedAt;
    }
  });

  return [...byVideo.values()].sort((a, b) => new Date(b.latestAt) - new Date(a.latestAt));
}

function renderCommentCard(comment) {
  const card = template.content.cloneNode(true);
  card.querySelector(".avatar").src = comment.avatar;
  card.querySelector(".author").textContent = comment.author;
  card.querySelector(".meta").textContent = formatDate(comment.publishedAt);
  card.querySelector(".commentText").textContent = comment.text;
  card.querySelector(".likeBadge").textContent =
    comment.replyCount > 0
      ? `답글 ${comment.replyCount}개 · 좋아요 ${comment.likeCount}개`
      : `답글 없음 · 좋아요 ${comment.likeCount}개`;
  card.querySelector(".watchLink").href =
    `https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}`;
  card.querySelector(".studioLink").href =
    `https://studio.youtube.com/channel/${channelIdInput.value.trim()}/comments/inbox`;

  const replyForm = card.querySelector(".replyForm");
  const replyText = card.querySelector(".replyText");
  const replyButton = card.querySelector(".replyButton");
  replyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = replyText.value.trim();
    if (!text) return;

    replyButton.disabled = true;
    replyButton.textContent = "전송 중";
    try {
      await insertReply({ parentId: comment.id, text });
      comment.replyCount += 1;
      replyText.value = "";
      setStatus("답글 완료", `${comment.author}님의 댓글에 답글을 달았습니다.`);
      renderComments();
    } catch (error) {
      setStatus("답글 실패", explainError(error));
    } finally {
      replyButton.disabled = false;
      replyButton.textContent = "답글 달기";
    }
  });

  return card;
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
  if (message.includes("insufficient") || message.includes("permission")) {
    return "Google 연결 권한이 부족합니다. OAuth 동의 화면의 테스트 사용자와 YouTube 채널 계정을 확인해주세요.";
  }
  return message;
}

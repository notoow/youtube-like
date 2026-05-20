const STORAGE_KEYS = {
  apiKey: "yt-heart-helper-api-key",
  channelId: "yt-heart-helper-channel-id",
  channels: "yt-heart-helper-channels",
  clientId: "yt-heart-helper-client-id",
  clinicGuidelines: "yt-heart-helper-clinic-guidelines",
  clinicStrengths: "yt-heart-helper-clinic-strengths",
  clinicDefaultsVersion: "yt-heart-helper-clinic-defaults-version",
  instagramDoneIds: "yt-heart-helper-instagram-done-ids",
  instagramDrafts: "yt-heart-helper-instagram-drafts",
  instagramApiBase: "yt-heart-helper-instagram-api-base",
  instagramAdminKey: "yt-heart-helper-instagram-admin-key",
  instagramMediaScope: "yt-heart-helper-instagram-media-scope",
  instagramScope: "yt-heart-helper-instagram-scope",
  viewMode: "yt-heart-helper-view-mode",
};

const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";
const INSTAGRAM_API_BASE_FALLBACK = "https://youtube-like.vercel.app";
const OWNER_REPLY_HANDLES = [
  "@논현동구원장",
  "@Mens_BodyLab",
  "@highsturology",
  "하이스트 비뇨의학과",
  "남성체형연구소",
];
const CLINIC_DEFAULTS_VERSION = "2026-05-07-stem-cell-ed-injection";
const DEFAULT_CHANNELS = [
  {
    name: "하이스트 비뇨의학과",
    id: "https://www.youtube.com/channel/UCFCMjPa9xYNKkGQLHAQRTuw",
  },
  {
    name: "논현동구원장",
    id: "https://www.youtube.com/@논현동구원장",
  },
  {
    name: "남성체형연구소",
    id: "https://www.youtube.com/@Mens_BodyLab",
  },
];
const DEFAULT_CLINIC_GUIDELINES = [
  "하이스트비뇨의학과는 안전성을 가장 중요하게 생각하는 병원이라는 톤을 유지한다.",
  "성기확대는 “무조건 크게”가 아니라 안전성, 자연스러움, 귀두·몸통·길이의 전체 비율, 개인 조직 상태를 함께 본다는 방향으로 답한다.",
  "성기확대 재료는 돼지진피 같은 이종진피를 사용하지 않고, 감염 예방과 자연스러운 결과를 고려해 동종진피를 사용한다는 점을 자연스럽게 반영한다.",
  "성기확대에서 자가지방 생착을 돕기 위한 줄기세포 보조 수술 옵션을 상담할 수 있으며, 줄기세포는 지방 생착을 도와주는 보조적 역할로 설명한다.",
  "줄기세포, 자가지방 생착, 확대 결과를 설명할 때 생착 보장·확대 보장처럼 과장하거나 확정적으로 표현하지 않는다.",
  "필러, 진피분말, 지방, 실리콘, 구슬, 링 관련 댓글에는 뭉침·쏠림·흡수·이물감·통증·상대방 불편감·제거 어려움 등이 생길 수 있어 신중해야 한다고 답한다.",
  "발기부전 치료에서는 주사치료를 시행하며, 약물치료 등 환자 상태에 맞는 치료 옵션을 함께 상담한다.",
  "줄기세포 연구실을 운영 중이라는 점은 필요할 때만 사실 범위에서 과장 없이 짧게 언급한다.",
  "의미가 거의 없거나 단순 반응성 댓글은 답글 대신 하트만 권장한다.",
];
const DEFAULT_CLINIC_STRENGTHS = [
  "남성수술과 남성 비뇨기 분야를 전문적으로 다루는 병원이라는 톤을 유지한다.",
  "의사가 직접 상태를 보고 상담하며, 개인의 해부학적 구조와 목표에 맞춰 계획한다.",
  "재료 선택, 수술 범위, 귀두와 몸통의 비율, 피부 여유, 기존 수술 여부, 재수술 가능성까지 종합적으로 본다.",
  "안전성, 자연스러움, 감염 예방, 사후관리, 현실적인 기대치 설정을 중요하게 생각한다.",
  "줄기세포 연구실을 운영하며 관련 연구를 이어가고 있다는 점을 과장 없이 반영한다.",
  "자가지방 생착을 보조하는 줄기세포 연구와 수술 옵션을 병원 강점으로 설명할 수 있다.",
  "발기부전 치료 옵션을 약물치료와 주사치료 등으로 넓혀 환자 상태에 맞춰 상담한다.",
];

const shell = document.querySelector(".shell");
const modeButtons = [...document.querySelectorAll(".modeTab")];
const instagramInbox = document.querySelector("#instagramInbox");
const form = document.querySelector("#settingsForm");
const apiKeyInput = document.querySelector("#apiKey");
const copyApiKeyButton = document.querySelector("#copyApiKeyButton");
const clientIdInput = document.querySelector("#clientId");
const channelIdInput = document.querySelector("#channelId");
const channelNameInputs = [...document.querySelectorAll(".channelNameInput")];
const channelIdInputs = [...document.querySelectorAll(".channelIdInput")];
const videoScopeInput = document.querySelector("#videoScope");
const statusTitle = document.querySelector("#statusTitle");
const statusDetail = document.querySelector("#statusDetail");
const results = document.querySelector("#results");
const template = document.querySelector("#commentTemplate");
const clearButton = document.querySelector("#clearButton");
const authButton = document.querySelector("#authButton");
const listEditors = [...document.querySelectorAll(".listEditor")];
const copyPromptButton = document.querySelector("#copyPromptButton");
const filterButtons = [...document.querySelectorAll(".filterButton")];
const instagramUi = {
  loadButton: document.querySelector("#instagramLoadButton"),
  refreshButton: document.querySelector("#instagramRefreshButton"),
  healthButton: document.querySelector("#instagramHealthButton"),
  generateKeyButton: document.querySelector("#instagramGenerateKeyButton"),
  copyKeyButton: document.querySelector("#instagramCopyKeyButton"),
  copyEnvButton: document.querySelector("#instagramCopyEnvButton"),
  apiBaseInput: document.querySelector("#instagramApiBase"),
  adminKeyInput: document.querySelector("#instagramAdminKey"),
  scopeInput: document.querySelector("#instagramScope"),
  mediaScopeButtons: [...document.querySelectorAll("[data-ig-media-scope]")],
  mediaList: document.querySelector(".igMediaList"),
  commentList: document.querySelector(".igCommentList"),
  promptBox: document.querySelector(".igPromptBox"),
  promptSelectedButton: document.querySelector("[data-ig-prompt='selected']"),
  promptAllButton: document.querySelector("[data-ig-prompt='all']"),
  aiPasteInput: document.querySelector("#instagramAiPaste"),
  applySelectedButton: document.querySelector("[data-ig-apply='selected']"),
  applyAllButton: document.querySelector("[data-ig-apply='all']"),
  clearDoneButton: document.querySelector("#instagramClearDoneButton"),
  sourcePill: document.querySelector(".igSourcePill"),
  sourceTitle: document.querySelector(".igSourceTitle"),
  sourceDetail: document.querySelector(".igSourceDetail"),
  setupItems: [...document.querySelectorAll(".igSetupItem")],
  stats: [...document.querySelectorAll(".instagramStats article")],
  filters: [...document.querySelectorAll(".igFilterSet button")],
};

let comments = [];
let activeFilter = "needsReply";
let activeMode = "youtube";
let instagramLoaded = false;
let instagramData = null;
let selectedInstagramMediaId = "";
let activeInstagramFilter = "all";
let activeInstagramMediaScope = "needs";
let instagramDoneIds = new Set();
let instagramDrafts = {};
let accessToken = "";
let clinicGuidelines = [];
let clinicStrengths = [];
let activeChannels = [];

init();
window.addEventListener("load", refreshIcons);

function init() {
  apiKeyInput.value = localStorage.getItem(STORAGE_KEYS.apiKey) || "";
  clientIdInput.value =
    localStorage.getItem(STORAGE_KEYS.clientId) || clientIdInput.value;
  if (instagramUi.scopeInput) {
    instagramUi.scopeInput.value =
      localStorage.getItem(STORAGE_KEYS.instagramScope) || instagramUi.scopeInput.value;
  }
  if (instagramUi.apiBaseInput) {
    instagramUi.apiBaseInput.value =
      localStorage.getItem(STORAGE_KEYS.instagramApiBase) || getDefaultInstagramApiBase();
  }
  if (instagramUi.adminKeyInput) {
    instagramUi.adminKeyInput.value = localStorage.getItem(STORAGE_KEYS.instagramAdminKey) || "";
  }
  activeInstagramMediaScope =
    localStorage.getItem(STORAGE_KEYS.instagramMediaScope) || activeInstagramMediaScope;
  instagramDoneIds = readInstagramDoneIds();
  instagramDrafts = readInstagramDrafts();
  hydrateChannels();
  migrateClinicDefaults();
  clinicGuidelines = readRuleList(STORAGE_KEYS.clinicGuidelines, DEFAULT_CLINIC_GUIDELINES);
  clinicStrengths = readRuleList(STORAGE_KEYS.clinicStrengths, DEFAULT_CLINIC_STRENGTHS);
  renderAllRuleLists();
  const requestedMode =
    window.location.hash === "#instagram"
      ? "instagram"
      : localStorage.getItem(STORAGE_KEYS.viewMode) === "instagram"
        ? "instagram"
        : "youtube";
  setMode(requestedMode);
  renderEmpty("아직 불러온 댓글이 없습니다.");
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode === "instagram" ? "instagram" : "youtube");
  });
});

function setMode(mode) {
  activeMode = mode;
  localStorage.setItem(STORAGE_KEYS.viewMode, mode);
  if (mode === "instagram" && window.location.hash !== "#instagram") {
    history.replaceState(null, "", "#instagram");
  } else if (mode === "youtube" && window.location.hash === "#instagram") {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  shell.classList.toggle("instagramMode", mode === "instagram");
  instagramInbox.hidden = mode !== "instagram";
  if (mode === "instagram") {
    loadInstagramInbox();
  }
  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  refreshIcons();
}

authButton.addEventListener("click", async () => {
  try {
    await ensureAccessToken();
    setStatus("Google 연결됨", "이제 댓글 카드에서 답글을 작성할 수 있습니다.");
  } catch (error) {
    setStatus("연결 실패", error.message || "Google OAuth 연결에 실패했습니다.");
  }
});

copyApiKeyButton.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    setStatus("복사할 키 없음", "연결 키를 먼저 입력해주세요.");
    return;
  }

  try {
    await copyText(apiKey);
    setStatus("연결 키 복사 완료", "현재 입력된 연결 키를 클립보드에 복사했습니다.");
  } catch (error) {
    setStatus("복사 실패", error.message || "연결 키를 복사하지 못했습니다.");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const apiKey = apiKeyInput.value.trim();
  const clientId = clientIdInput.value.trim();
  const channels = getConfiguredChannels();
  const videoScope = videoScopeInput.value;

  if (!apiKey || !clientId || channels.length === 0) {
    setStatus("입력 필요", "API 키, OAuth 클라이언트 ID, 채널 ID를 하나 이상 입력해주세요.");
    return;
  }

  localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
  localStorage.setItem(STORAGE_KEYS.clientId, clientId);
  saveChannels(channels);

  try {
    setLoading(true);
    comments = [];
    activeChannels = channels;
    renderEmpty("댓글을 가져오는 중입니다.");

    const collected = [];
    for (const [channelIndex, channel] of channels.entries()) {
      setStatus(
        "댓글 영상 확인 중",
        `${channel.name} 채널에서 최근 댓글이 달린 영상 목록을 가져오고 있습니다. (${channelIndex + 1}/${channels.length})`,
      );
      const videos = await fetchChannelVideos({ apiKey, channel, videoScope });

      setStatus(
        "댓글 확인 중",
        `${channel.name} 채널의 최근 댓글 영상 ${videos.length}개에서 댓글을 가져오고 있습니다.`,
      );
      const channelComments = await fetchCommentsForVideos({ apiKey, videos, channel });
      collected.push(...channelComments);
    }

    comments = collected.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    renderComments();
    setStatus("완료", `${channels.length}개 채널에서 댓글 ${comments.length}개를 불러왔습니다.`);
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
  localStorage.removeItem(STORAGE_KEYS.channels);
  localStorage.removeItem(STORAGE_KEYS.clientId);
  localStorage.removeItem(STORAGE_KEYS.clinicGuidelines);
  localStorage.removeItem(STORAGE_KEYS.clinicStrengths);
  localStorage.removeItem(STORAGE_KEYS.instagramDoneIds);
  localStorage.removeItem(STORAGE_KEYS.instagramDrafts);
  localStorage.removeItem(STORAGE_KEYS.instagramApiBase);
  localStorage.removeItem(STORAGE_KEYS.instagramAdminKey);
  localStorage.removeItem(STORAGE_KEYS.instagramMediaScope);
  localStorage.setItem(STORAGE_KEYS.clinicDefaultsVersion, CLINIC_DEFAULTS_VERSION);
  accessToken = "";
  activeInstagramMediaScope = "needs";
  instagramDoneIds = new Set();
  instagramDrafts = {};
  apiKeyInput.value = "";
  clientIdInput.value =
    "550773902598-ted9eeglebq3jo5ju7t61rh3gh5bakim.apps.googleusercontent.com";
  resetChannelInputs();
  activeChannels = [];
  if (instagramUi.apiBaseInput) instagramUi.apiBaseInput.value = getDefaultInstagramApiBase();
  if (instagramUi.adminKeyInput) instagramUi.adminKeyInput.value = "";
  clinicGuidelines = [...DEFAULT_CLINIC_GUIDELINES];
  clinicStrengths = [...DEFAULT_CLINIC_STRENGTHS];
  renderAllRuleLists();
  setStatus("초기화됨", "브라우저에 저장된 API 키, OAuth 클라이언트 ID, 채널 ID를 지웠습니다.");
});

listEditors.forEach((editor) => {
  editor.addEventListener("click", (event) => handleListEditorClick(event, editor));
  editor.querySelector(".newRuleInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addRule(editor);
    }
  });
  editor.querySelector(".importFile").addEventListener("change", (event) =>
    importRules(event, editor),
  );
});

copyPromptButton.addEventListener("click", async () => {
  try {
    const prompt = buildAiReplyPrompt();
    await copyText(prompt);
    const count = getPromptCandidateComments(getActiveFilteredComments()).length;
    setStatus("복사 완료", `전체 채널 AI 답글 프롬프트에 댓글 후보 ${count}개를 담았습니다.`);
  } catch (error) {
    setStatus("복사 실패", error.message || "클립보드 복사에 실패했습니다.");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderComments();
  });
});

["all", "question", "price", "warning", "draft", "done"].forEach((filter, index) => {
  const button = instagramUi.filters[index];
  if (!button) return;
  button.dataset.igFilter = filter;
  button.addEventListener("click", () => {
    activeInstagramFilter = filter;
    instagramUi.filters.forEach((item) => item.classList.toggle("active", item === button));
    renderInstagramComments();
  });
});

instagramUi.loadButton?.addEventListener("click", () => {
  loadInstagramInbox({ force: true });
});

instagramUi.refreshButton?.addEventListener("click", () => {
  loadInstagramInbox({ force: true });
});

instagramUi.healthButton?.addEventListener("click", () => {
  testInstagramConnection();
});

instagramUi.generateKeyButton?.addEventListener("click", () => {
  generateInstagramAdminKey();
});

instagramUi.copyKeyButton?.addEventListener("click", () => {
  copyInstagramAdminKey();
});

instagramUi.copyEnvButton?.addEventListener("click", () => {
  copyInstagramEnvTemplate();
});

instagramUi.scopeInput?.addEventListener("change", () => {
  localStorage.setItem(STORAGE_KEYS.instagramScope, instagramUi.scopeInput.value);
  loadInstagramInbox({ force: true });
});

instagramUi.apiBaseInput?.addEventListener("change", () => {
  const apiBase = normalizeInstagramApiBase(instagramUi.apiBaseInput.value);
  if (apiBase) {
    localStorage.setItem(STORAGE_KEYS.instagramApiBase, apiBase);
  } else {
    localStorage.removeItem(STORAGE_KEYS.instagramApiBase);
  }
  instagramUi.apiBaseInput.value = apiBase || getDefaultInstagramApiBase();
  loadInstagramInbox({ force: true });
});

instagramUi.adminKeyInput?.addEventListener("change", () => {
  const adminKey = getInstagramAdminKey();
  if (adminKey) {
    localStorage.setItem(STORAGE_KEYS.instagramAdminKey, adminKey);
  } else {
    localStorage.removeItem(STORAGE_KEYS.instagramAdminKey);
  }
  loadInstagramInbox({ force: true });
});

instagramUi.clearDoneButton?.addEventListener("click", () => {
  clearInstagramDoneMarks();
});

instagramUi.mediaScopeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeInstagramMediaScope = button.dataset.igMediaScope || "needs";
    localStorage.setItem(STORAGE_KEYS.instagramMediaScope, activeInstagramMediaScope);
    renderInstagramMediaList();
    renderInstagramComments();
    renderInstagramPromptBox();
  });
});

function hydrateChannels() {
  const stored = localStorage.getItem(STORAGE_KEYS.channels);
  const legacyId = localStorage.getItem(STORAGE_KEYS.channelId);
  let channels = [];

  if (stored) {
    try {
      channels = JSON.parse(stored);
    } catch {
      channels = [];
    }
  }

  channels = normalizeStoredChannels(channels, legacyId);

  channelNameInputs.forEach((input, index) => {
    input.value = channels[index]?.name || "";
  });
  channelIdInputs.forEach((input, index) => {
    input.value = channels[index]?.id || "";
  });
}

function normalizeStoredChannels(channels, legacyId = "") {
  const defaults = getDefaultChannels(legacyId);
  if (!Array.isArray(channels) || channels.length === 0) return defaults;

  return defaults.map((defaultChannel, index) => {
    const stored = channels[index] || {};
    const name = String(stored.name || "").trim();
    const id = String(stored.id || "").trim();
    return {
      name: name || defaultChannel.name,
      id: id || defaultChannel.id,
    };
  });
}

function getDefaultChannels(legacyId = "") {
  return DEFAULT_CHANNELS.map((channel, index) => ({
    ...channel,
    id: index === 0 && legacyId ? legacyId : channel.id,
  }));
}

function getConfiguredChannels() {
  return channelIdInputs
    .map((input, index) => {
      const id = input.value.trim();
      const name = channelNameInputs[index]?.value.trim() || `채널 ${index + 1}`;
      return id ? { id, name, index } : null;
    })
    .filter(Boolean);
}

function saveChannels(channels = getConfiguredChannels()) {
  const padded = [0, 1, 2].map((index) => ({
    name: channelNameInputs[index]?.value.trim() || channels.find((item) => item.index === index)?.name || "",
    id: channelIdInputs[index]?.value.trim() || channels.find((item) => item.index === index)?.id || "",
  }));
  localStorage.setItem(STORAGE_KEYS.channels, JSON.stringify(padded));
  localStorage.setItem(STORAGE_KEYS.channelId, padded[0]?.id || "");
}

function resetChannelInputs() {
  const defaults = getDefaultChannels();
  channelNameInputs.forEach((input, index) => {
    input.value = defaults[index].name;
  });
  channelIdInputs.forEach((input, index) => {
    input.value = defaults[index].id;
  });
}

[...channelNameInputs, ...channelIdInputs].forEach((input) => {
  input.addEventListener("change", () => saveChannels());
});

function readRuleList(storageKey, defaults) {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return [...defaults];

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return sanitizeRules(parsed);
    }
  } catch {
    return sanitizeRules(stored.split(/\r?\n/).map(stripNumbering));
  }

  return [...defaults];
}

function migrateClinicDefaults() {
  if (localStorage.getItem(STORAGE_KEYS.clinicDefaultsVersion) === CLINIC_DEFAULTS_VERSION) {
    return;
  }

  const currentGuidelines = readRuleList(
    STORAGE_KEYS.clinicGuidelines,
    DEFAULT_CLINIC_GUIDELINES,
  );
  const currentStrengths = readRuleList(
    STORAGE_KEYS.clinicStrengths,
    DEFAULT_CLINIC_STRENGTHS,
  );
  const nextGuidelines = mergeUpdatedRules(currentGuidelines, DEFAULT_CLINIC_GUIDELINES, [
    "주사치료는 시행하지 않고",
  ]);
  const nextStrengths = mergeUpdatedRules(currentStrengths, DEFAULT_CLINIC_STRENGTHS);

  localStorage.setItem(STORAGE_KEYS.clinicGuidelines, JSON.stringify(nextGuidelines));
  localStorage.setItem(STORAGE_KEYS.clinicStrengths, JSON.stringify(nextStrengths));
  localStorage.setItem(STORAGE_KEYS.clinicDefaultsVersion, CLINIC_DEFAULTS_VERSION);
}

function mergeUpdatedRules(current, defaults, removeSnippets = []) {
  const next = [...defaults];
  sanitizeRules(current).forEach((rule) => {
    if (removeSnippets.some((snippet) => rule.includes(snippet))) return;
    if (!next.includes(rule)) next.push(rule);
  });
  return next;
}

function sanitizeRules(items) {
  return items
    .map((item) => stripNumbering(String(item || "").trim()))
    .filter(Boolean);
}

function stripNumbering(value) {
  return value.replace(/^\s*\d+[\.)]\s*/, "").trim();
}

function renderAllRuleLists() {
  listEditors.forEach(renderRuleList);
  refreshIcons();
}

function renderRuleList(editor) {
  const list = getRuleList(editor);
  const container = editor.querySelector(".ruleList");
  container.replaceChildren();

  list.forEach((rule, index) => {
    const row = document.createElement("article");
    row.className = "ruleItem";
    row.dataset.index = String(index);

    const text = document.createElement("p");
    text.textContent = rule;

    const actions = document.createElement("div");
    actions.className = "iconActions";
    actions.append(
      createIconButton("edit", "pencil", "수정"),
      createIconButton("delete", "x", "삭제"),
    );

    row.append(text, actions);
    container.append(row);
  });
}

function createIconButton(action, icon, title) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "iconButton";
  button.dataset.action = action;
  button.title = title;
  button.innerHTML = `<i data-lucide="${icon}"></i>`;
  return button;
}

function handleListEditorClick(event, editor) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "add") addRule(editor);
  if (action === "edit") startEditRule(editor, button);
  if (action === "delete") deleteRule(editor, button);
  if (action === "save") saveEditedRule(editor, button);
  if (action === "cancel") renderRuleList(editor);
  if (action === "download") downloadRules(editor);
  if (action === "trigger-import") editor.querySelector(".importFile").click();

  refreshIcons();
}

function addRule(editor) {
  const input = editor.querySelector(".newRuleInput");
  const value = stripNumbering(input.value);
  if (!value) return;

  const list = getRuleList(editor);
  list.push(value);
  input.value = "";
  persistRuleList(editor, list);
  renderRuleList(editor);
  refreshIcons();
}

function startEditRule(editor, button) {
  const row = button.closest(".ruleItem");
  const index = Number(row.dataset.index);
  const list = getRuleList(editor);
  const value = list[index] || "";

  row.replaceChildren();
  row.classList.add("editing");

  const input = document.createElement("input");
  input.className = "editRuleInput";
  input.type = "text";
  input.value = value;

  const actions = document.createElement("div");
  actions.className = "iconActions";
  actions.append(
    createIconButton("save", "check", "저장"),
    createIconButton("cancel", "x", "취소"),
  );

  row.append(input, actions);
  input.focus();
  input.select();
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveEditedRule(editor, actions.querySelector("[data-action='save']"));
    if (event.key === "Escape") renderRuleList(editor);
  });
}

function saveEditedRule(editor, button) {
  const row = button.closest(".ruleItem");
  const index = Number(row.dataset.index);
  const input = row.querySelector(".editRuleInput");
  const value = stripNumbering(input.value);
  const list = getRuleList(editor);

  if (value) {
    list[index] = value;
  } else {
    list.splice(index, 1);
  }

  persistRuleList(editor, list);
  renderRuleList(editor);
}

function deleteRule(editor, button) {
  const row = button.closest(".ruleItem");
  const index = Number(row.dataset.index);
  const list = getRuleList(editor);
  list.splice(index, 1);
  persistRuleList(editor, list);
  renderRuleList(editor);
}

function downloadRules(editor) {
  const list = getRuleList(editor);
  const name = getListType(editor) === "guidelines" ? "hospital-reply-guidelines" : "hospital-strengths";
  const blob = new Blob([list.join("\r\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function importRules(event, editor) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  const text = await file.text();
  const list = sanitizeRules(text.split(/\r?\n/));
  if (!list.length) {
    setStatus("불러오기 실패", "txt 파일에서 불러올 항목을 찾지 못했습니다.");
    return;
  }

  persistRuleList(editor, list);
  renderRuleList(editor);
  refreshIcons();
  setStatus("불러오기 완료", `${list.length}개 항목을 불러왔습니다.`);
}

function getListType(editor) {
  return editor.dataset.list;
}

function getRuleList(editor) {
  return getListType(editor) === "guidelines" ? clinicGuidelines : clinicStrengths;
}

function persistRuleList(editor, list) {
  const cleaned = sanitizeRules(list);
  if (getListType(editor) === "guidelines") {
    clinicGuidelines = cleaned;
    localStorage.setItem(STORAGE_KEYS.clinicGuidelines, JSON.stringify(cleaned));
  } else {
    clinicStrengths = cleaned;
    localStorage.setItem(STORAGE_KEYS.clinicStrengths, JSON.stringify(cleaned));
  }
}

function refreshIcons() {
  window.lucide?.createIcons();
}

async function fetchChannelVideos({ apiKey, channel, videoScope }) {
  const resolvedChannel = await resolveChannel({ apiKey, channel });
  Object.assign(channel, {
    id: resolvedChannel.id,
    input: resolvedChannel.input,
    name: resolvedChannel.name,
  });

  const limit = Number(videoScope) || 10;
  const videoIds = await fetchRecentlyCommentedVideoIds({
    apiKey,
    channelId: resolvedChannel.id,
    channelName: resolvedChannel.name,
    limit,
  });

  return fetchVideoDetailsByIds({
    apiKey,
    videoIds,
    channel: resolvedChannel,
  });
}

async function fetchRecentlyCommentedVideoIds({ apiKey, channelId, channelName, limit }) {
  const videoIds = [];
  const seen = new Set();
  let pageToken = "";

  while (videoIds.length < limit) {
    const params = new URLSearchParams({
      key: apiKey,
      part: "snippet",
      allThreadsRelatedToChannelId: channelId,
      maxResults: "100",
      order: "time",
      textFormat: "plainText",
    });

    if (pageToken) params.set("pageToken", pageToken);

    const data = await getJson(
      `https://www.googleapis.com/youtube/v3/commentThreads?${params}`,
    );

    for (const item of data.items || []) {
      const videoId = item.snippet?.videoId;
      if (!videoId || seen.has(videoId)) continue;
      seen.add(videoId);
      videoIds.push(videoId);
      if (videoIds.length >= limit) break;
    }

    setStatus("댓글 영상 확인 중", `${channelName} 최근 댓글 기준 영상 ${videoIds.length}개를 찾았습니다.`);

    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }

  return videoIds;
}

async function fetchVideoDetailsByIds({ apiKey, videoIds, channel }) {
  if (!videoIds.length) return [];

  const details = new Map();
  for (let index = 0; index < videoIds.length; index += 50) {
    const batch = videoIds.slice(index, index + 50);
    const params = new URLSearchParams({
      key: apiKey,
      part: "snippet",
      id: batch.join(","),
    });
    const data = await getJson(`https://www.googleapis.com/youtube/v3/videos?${params}`);

    for (const item of data.items || []) {
      details.set(item.id, {
        id: item.id,
        channelId: channel.id,
        channelName: channel.name,
        channelIndex: channel.index,
        title: item.snippet?.title || "제목 없음",
        thumbnail: pickThumbnail(item.snippet?.thumbnails),
        publishedAt: item.snippet?.publishedAt,
      });
    }
  }

  return videoIds.map((videoId) => details.get(videoId)).filter(Boolean);
}

async function resolveChannel({ apiKey, channel }) {
  const parsed = parseChannelInput(channel.id);
  const channelParams = new URLSearchParams({
    key: apiKey,
    part: "snippet,contentDetails",
  });

  if (parsed.type === "handle") {
    channelParams.set("forHandle", `@${parsed.value}`);
  } else {
    channelParams.set("id", parsed.value);
  }

  const channelData = await getJson(
    `https://www.googleapis.com/youtube/v3/channels?${channelParams}`,
  );
  const item = channelData.items?.[0];

  if (!item?.id) {
    throw new Error(`${channel.name || "채널"}을 찾지 못했습니다. 채널 URL, @핸들, UC 채널 ID를 확인해주세요.`);
  }

  return {
    id: item.id,
    input: channel.id,
    index: channel.index,
    name: channel.name || item.snippet?.title || item.id,
    uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads || "",
  };
}

function parseChannelInput(value) {
  const input = String(value || "").trim();
  if (!input) throw new Error("채널 URL, @핸들, UC 채널 ID를 입력해주세요.");

  const normalized = getChannelPathOrInput(input);
  const channelIdMatch =
    normalized.match(/(?:^|\/)channel\/(UC[\w-]{20,})/i) ||
    normalized.match(/^(UC[\w-]{20,})$/i);
  if (channelIdMatch) {
    return { type: "id", value: channelIdMatch[1] };
  }

  const handleMatch = normalized.match(/(?:^|\/)@([^/?#]+)/) || normalized.match(/^@(.+)$/);
  if (handleMatch) {
    return { type: "handle", value: stripHandle(handleMatch[1]) };
  }

  if (!normalized.includes("/")) {
    return { type: "handle", value: stripHandle(normalized) };
  }

  throw new Error("지원하는 채널 입력 형식은 채널 URL, @핸들 URL, @핸들, UC 채널 ID입니다.");
}

function getChannelPathOrInput(input) {
  try {
    const url = new URL(input);
    return decodeURIComponent(url.pathname);
  } catch {
    return input;
  }
}

function stripHandle(value) {
  return String(value || "").replace(/^@/, "").replace(/\/.*$/, "").trim();
}

async function fetchCommentsForVideos({ apiKey, videos, channel }) {
  const collected = [];

  for (const [index, video] of videos.entries()) {
    const videoComments = await fetchAllCommentsForVideo({ apiKey, video });
    collected.push(...videoComments);
    setStatus(
      "댓글 확인 중",
      `${channel.name} ${index + 1}/${videos.length}개 영상 처리 완료, 댓글 ${collected.length}개 수집.`,
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
      const normalized = await Promise.all(
        (data.items || []).map((item) => normalizeComment(item, video, apiKey)),
      );
      videoComments.push(...normalized);
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

async function normalizeComment(item, video, apiKey) {
  const snippet = item.snippet.topLevelComment.snippet;
  const initialReplies = (item.replies?.comments || []).map(normalizeReply);
  const totalReplyCount = item.snippet.totalReplyCount || 0;
  const replies =
    totalReplyCount > initialReplies.length
      ? await fetchAllReplies({ apiKey, parentId: item.id })
      : initialReplies;

  return {
    id: item.id,
    channelId: video.channelId,
    channelName: video.channelName,
    channelIndex: video.channelIndex,
    videoId: video.id,
    videoTitle: decodeHtml(video.title),
    videoThumbnail: video.thumbnail,
    author: snippet.authorDisplayName,
    avatar: snippet.authorProfileImageUrl,
    text: snippet.textDisplay,
    likeCount: snippet.likeCount || 0,
    replyCount: totalReplyCount,
    replies,
    publishedAt: snippet.publishedAt,
  };
}

async function fetchAllReplies({ apiKey, parentId }) {
  const replies = [];
  let pageToken = "";

  while (true) {
    const params = new URLSearchParams({
      key: apiKey,
      part: "snippet",
      parentId,
      maxResults: "100",
      textFormat: "plainText",
    });

    if (pageToken) params.set("pageToken", pageToken);

    const data = await getJson(`https://www.googleapis.com/youtube/v3/comments?${params}`);
    replies.push(...(data.items || []).map(normalizeReply));
    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }

  return replies;
}

function normalizeReply(item) {
  const snippet = item.snippet;
  return {
    id: item.id,
    author: snippet.authorDisplayName,
    avatar: snippet.authorProfileImageUrl,
    text: snippet.textDisplay,
    likeCount: snippet.likeCount || 0,
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
  const filtered = getActiveFilteredComments();

  results.replaceChildren();

  if (filtered.length === 0) {
    renderEmpty("조건에 맞는 댓글이 없습니다.");
    return;
  }

  const fragment = document.createDocumentFragment();
  const channelGroups = groupCommentsByChannel(filtered);
  channelGroups.forEach((channel) => {
    fragment.append(renderChannelColumn(channel));
  });

  results.append(fragment);
  refreshIcons();
}

async function loadInstagramInbox({ force = false } = {}) {
  if (instagramLoaded && !force) return;

  const scope = getInstagramScope();
  const params = new URLSearchParams({
    limit: scope,
    commentsLimit: scope === "all" ? "100" : "50",
  });

  instagramUi.loadButton.disabled = true;
  if (instagramUi.refreshButton) instagramUi.refreshButton.disabled = true;
  setInstagramButtonLabel("불러오는 중");

  try {
    const response = await fetch(buildInstagramApiUrl("/api/instagram/media", params), {
      headers: buildInstagramApiHeaders({ Accept: "application/json" }),
    });
    if (!response.ok) {
      throw await createInstagramApiError(response, "Instagram API에서 댓글을 불러오지 못했습니다.");
    }
    instagramData = await response.json();
    if (instagramData.source !== "meta") {
      throw new Error("Vercel API는 연결됐지만 Meta 환경변수가 아직 실제 댓글 모드로 설정되지 않았습니다.");
    }
    instagramData.apiBase = getInstagramApiBase() || window.location.origin;
    instagramLoaded = true;
    selectedInstagramMediaId = instagramData.media?.[0]?.id || "";
    renderInstagramInbox();
    setInstagramButtonLabel("댓글 불러오기");
  } catch (error) {
    console.error(error);
    instagramData = createInstagramErrorInbox(error);
    instagramLoaded = true;
    selectedInstagramMediaId = "";
    renderInstagramInbox();
    setInstagramButtonLabel("다시 시도");
    setStatus("Instagram 연결 실패", getInstagramErrorMessage(error));
  } finally {
    instagramUi.loadButton.disabled = false;
    if (instagramUi.refreshButton) instagramUi.refreshButton.disabled = false;
    refreshIcons();
  }
}

async function testInstagramConnection() {
  if (instagramUi.healthButton) instagramUi.healthButton.disabled = true;
  setStatus("Instagram 연결 테스트", "Vercel API, 운영 키, Meta 계정 접근을 확인하고 있습니다.");

  try {
    const response = await fetch(buildInstagramApiUrl("/api/instagram/health"), {
      headers: buildInstagramApiHeaders({ Accept: "application/json" }),
    });
    if (!response.ok) {
      throw await createInstagramApiError(response, "Instagram 연결 테스트에 실패했습니다.");
    }

    const data = await response.json();
    const account = data.account?.username ? `@${data.account.username}` : "Instagram 계정";
    setStatus(
      "Instagram 연결 정상",
      `${account} 계정 접근이 확인됐습니다. 이제 댓글 불러오기를 사용할 수 있습니다.`,
    );
    if (instagramData) {
      instagramData.source = "meta";
      instagramData.account = data.account || instagramData.account;
      instagramData.apiBase = getInstagramApiBase() || window.location.origin;
      renderInstagramSourceStatus();
    }
  } catch (error) {
    console.error(error);
    instagramData = createInstagramErrorInbox(error);
    renderInstagramInbox();
    setStatus("Instagram 연결 테스트 실패", getInstagramErrorMessage(error));
  } finally {
    if (instagramUi.healthButton) instagramUi.healthButton.disabled = false;
    refreshIcons();
  }
}

function generateInstagramAdminKey() {
  ensureInstagramAdminKey({ forceNew: true });
  setStatus("운영 키 생성 완료", "새 운영 키를 만들고 이 브라우저에 저장했습니다. Vercel env에도 같은 값을 넣어주세요.");
}

async function copyInstagramAdminKey() {
  const adminKey = ensureInstagramAdminKey();

  await copyText(adminKey);
  setStatus("운영 키 복사 완료", "Vercel의 INSTAGRAM_ADMIN_KEY 값으로 붙여넣으면 됩니다.");
}

async function copyInstagramEnvTemplate() {
  const adminKey = ensureInstagramAdminKey();
  const envText = [
    "META_GRAPH_VERSION=v23.0",
    "META_ACCESS_TOKEN=",
    "INSTAGRAM_BUSINESS_ACCOUNT_ID=",
    "INSTAGRAM_OWNER_USERNAME=nonhyeon_dr_koo",
    `INSTAGRAM_ADMIN_KEY=${adminKey}`,
  ].join("\n");

  await copyText(envText);
  setStatus(
    "Vercel env 복사 완료",
    "Vercel 환경변수에 붙여넣고 Meta 토큰과 계정 ID만 채우면 됩니다.",
  );
}

function ensureInstagramAdminKey({ forceNew = false } = {}) {
  const existing = getInstagramAdminKey();
  const key = !forceNew && existing ? existing : createInstagramAdminKey();
  if (instagramUi.adminKeyInput) instagramUi.adminKeyInput.value = key;
  localStorage.setItem(STORAGE_KEYS.instagramAdminKey, key);
  return key;
}

function createInstagramAdminKey() {
  const bytes = new Uint8Array(24);
  window.crypto.getRandomValues(bytes);
  return [...bytes]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getInstagramScope() {
  return instagramUi.scopeInput?.value || "50";
}

function getDefaultInstagramApiBase() {
  return window.location.hostname.endsWith("github.io") ? INSTAGRAM_API_BASE_FALLBACK : "";
}

function normalizeInstagramApiBase(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function getInstagramApiBase() {
  const inputValue = instagramUi.apiBaseInput?.value || "";
  const storedValue = localStorage.getItem(STORAGE_KEYS.instagramApiBase) || "";
  return normalizeInstagramApiBase(inputValue || storedValue || getDefaultInstagramApiBase());
}

function getInstagramAdminKey() {
  return String(
    instagramUi.adminKeyInput?.value || localStorage.getItem(STORAGE_KEYS.instagramAdminKey) || "",
  ).trim();
}

function buildInstagramApiHeaders(headers = {}) {
  const adminKey = getInstagramAdminKey();
  return adminKey ? { ...headers, "X-Instagram-Admin-Key": adminKey } : headers;
}

function buildInstagramApiUrl(path, params) {
  const apiBase = getInstagramApiBase();
  const url = new URL(path, apiBase || window.location.origin);
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => url.searchParams.set(key, value));
  } else {
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

async function createInstagramApiError(response, fallback) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  return createInstagramApiErrorFromData(response, data, fallback);
}

function createInstagramApiErrorFromData(response, data, fallback) {
  const rawMessage = data?.error || fallback || response.statusText || "Instagram API 요청에 실패했습니다.";
  const error = new Error(rawMessage);
  error.status = response.status;
  error.meta = data?.meta || null;
  error.rawMessage = rawMessage;
  error.userMessage = explainInstagramApiError(error);
  return error;
}

function getInstagramErrorMessage(error) {
  return error?.userMessage || explainInstagramApiError(error);
}

function explainInstagramApiError(error) {
  const status = Number(error?.status || 0);
  const rawMessage = String(error?.rawMessage || error?.message || "").trim();
  const missing = Array.isArray(error?.meta?.missing) ? error.meta.missing : [];

  if (missing.length) {
    return `${formatMissingInstagramEnv(missing)} Vercel 프로젝트의 환경변수에 값을 넣은 뒤 다시 배포해 주세요.`;
  }

  if (status === 401) {
    return "운영 키가 비어 있거나 Vercel의 INSTAGRAM_ADMIN_KEY와 다릅니다. 화면의 운영 키와 Vercel 환경변수 값을 같게 맞춰 주세요.";
  }

  if (status === 404) {
    return "Instagram API 주소가 잘못됐습니다. API 주소가 Vercel 프로젝트 루트인지, /api/instagram 경로가 배포됐는지 확인해 주세요.";
  }

  if (status === 405) {
    return "Instagram API 요청 방식이 맞지 않습니다. 최신 페이지로 새로고침한 뒤 다시 시도해 주세요.";
  }

  if (status === 503) {
    return "Vercel API는 응답했지만 필수 환경변수가 아직 완성되지 않았습니다. env 복사 값과 Meta 토큰, Instagram 비즈니스 계정 ID를 확인해 주세요.";
  }

  if (/failed to fetch|load failed|networkerror/i.test(rawMessage)) {
    return "Vercel API에 연결하지 못했습니다. API 주소, Vercel 배포 상태, 브라우저 네트워크 차단 여부를 확인해 주세요.";
  }

  if (/invalid oauth|access token|oauth/i.test(rawMessage)) {
    return "Meta access token이 만료됐거나 권한이 부족합니다. META_ACCESS_TOKEN을 다시 발급해서 Vercel 환경변수에 넣어 주세요.";
  }

  if (/permission|permissions|not authorized/i.test(rawMessage)) {
    return "Meta 앱 권한이 부족합니다. Instagram 댓글 읽기/관리 권한과 연결된 비즈니스 계정을 확인해 주세요.";
  }

  if (/unsupported get request|object does not exist|cannot be loaded/i.test(rawMessage)) {
    return "Instagram 비즈니스 계정 ID가 잘못됐거나 토큰이 그 계정에 접근할 수 없습니다. INSTAGRAM_BUSINESS_ACCOUNT_ID와 토큰 발급 계정을 확인해 주세요.";
  }

  if (status >= 500) {
    return `Vercel 함수 오류입니다. Vercel 로그를 확인해 주세요.${rawMessage ? ` 원문: ${rawMessage}` : ""}`;
  }

  return rawMessage || "Instagram API 설정을 확인해 주세요.";
}

function formatMissingInstagramEnv(missing) {
  const labels = {
    INSTAGRAM_ADMIN_KEY: "운영 키(INSTAGRAM_ADMIN_KEY)",
    META_ACCESS_TOKEN: "Meta 토큰(META_ACCESS_TOKEN)",
    INSTAGRAM_BUSINESS_ACCOUNT_ID: "Instagram 비즈니스 계정 ID",
    INSTAGRAM_OWNER_USERNAME: "Instagram 운영 계정 이름",
  };
  return `${missing.map((item) => labels[item] || item).join(", ")}가 Vercel에 없습니다.`;
}

function createInstagramErrorInbox(error) {
  return recalculateInstagramStats({
    source: "error",
    needsConfiguration: true,
    apiBase: getInstagramApiBase() || window.location.origin,
    error: {
      message: getInstagramErrorMessage(error),
    },
    account: {
      id: "",
      username: "nonhyeon_dr_koo",
    },
    media: [],
  });
}

function readInstagramDoneIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.instagramDoneIds) || "[]");
    return new Set(Array.isArray(stored) ? stored.filter(Boolean) : []);
  } catch {
    return new Set();
  }
}

function persistInstagramDoneIds() {
  localStorage.setItem(STORAGE_KEYS.instagramDoneIds, JSON.stringify([...instagramDoneIds].slice(-2000)));
}

function readInstagramDrafts() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.instagramDrafts) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

function persistInstagramDrafts() {
  localStorage.setItem(STORAGE_KEYS.instagramDrafts, JSON.stringify(instagramDrafts));
}

function getInstagramDraft(commentId) {
  return instagramDrafts[commentId] || "";
}

function setInstagramDraft(commentId, value) {
  if (!commentId) return;
  const text = String(value || "");
  if (text.trim()) {
    instagramDrafts[commentId] = text;
  } else {
    delete instagramDrafts[commentId];
  }
  persistInstagramDrafts();
}

function clearInstagramDraft(commentId) {
  if (!commentId || !instagramDrafts[commentId]) return;
  delete instagramDrafts[commentId];
  persistInstagramDrafts();
}

function clearInstagramDoneMarks() {
  instagramDoneIds = new Set();
  localStorage.removeItem(STORAGE_KEYS.instagramDoneIds);
  if (instagramData) {
    applyInstagramDoneState();
    recalculateInstagramStats();
    renderInstagramInbox();
  }
  setStatus("Instagram 완료 표시 초기화", "이 브라우저에 저장된 Instagram 처리 완료 표시를 지웠습니다.");
}

function applyInstagramDoneState(inbox = instagramData) {
  if (!inbox?.media) return inbox;
  inbox.media.forEach((media) => {
    (media.comments || []).forEach((comment) => {
      comment.localDone = instagramDoneIds.has(comment.id);
    });
  });
  return inbox;
}

function recalculateInstagramStats(inbox = instagramData) {
  if (!inbox?.media) return inbox;
  const comments = inbox.media.flatMap((media) => media.comments || []);
  const candidates = comments.filter((comment) => !isInstagramCommentResolved(comment));
  inbox.stats = {
    needsReply: candidates.length,
    questions: candidates.filter((comment) => comment.category === "question").length,
    price: candidates.filter((comment) => comment.category === "price").length,
    warnings: candidates.filter((comment) => comment.category === "warning").length,
  };
  inbox.media = inbox.media
    .map((media) => ({
      ...media,
      needsReplyCount: (media.comments || []).filter((comment) => !isInstagramCommentResolved(comment)).length,
    }))
    .sort((a, b) => {
      if (b.needsReplyCount !== a.needsReplyCount) return b.needsReplyCount - a.needsReplyCount;
      return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    });
  return inbox;
}

function renderInstagramInbox() {
  if (!instagramData) return;
  applyInstagramDoneState();
  recalculateInstagramStats();
  renderInstagramSourceStatus();
  renderInstagramStats();
  renderInstagramMediaList();
  renderInstagramComments();
  renderInstagramPromptBox();
}

function renderInstagramSourceStatus() {
  const source = instagramData?.source || "error";
  const isMeta = source === "meta";
  const accountName = instagramData?.account?.username || "nonhyeon_dr_koo";
  const apiBase = instagramData?.apiBase || getInstagramApiBase() || window.location.origin;
  const errorMessage = instagramData?.error?.message || "Vercel API와 Meta 환경변수를 확인해 주세요.";

  instagramUi.sourcePill.textContent = isMeta ? "Meta 실데이터" : "연결 필요";
  instagramUi.sourcePill.classList.toggle("ready", isMeta);
  instagramUi.sourcePill.classList.toggle("error", !isMeta);
  instagramUi.sourceTitle.textContent = isMeta
    ? `@${accountName} 실데이터 연결됨`
    : "Instagram 실데이터 연결 실패";
  instagramUi.sourceDetail.textContent = isMeta
    ? "Vercel API가 Meta Graph API에서 실제 게시물과 댓글을 불러오고 있습니다."
    : `${errorMessage} API 주소: ${apiBase}`;

  instagramUi.setupItems.forEach((item) => {
    item.classList.toggle("ready", isMeta);
    const prefix = isMeta ? "완료" : "필요";
    const envNames = {
      token: "META_ACCESS_TOKEN",
      account: "INSTAGRAM_BUSINESS_ACCOUNT_ID",
      owner: "INSTAGRAM_OWNER_USERNAME",
      admin: "INSTAGRAM_ADMIN_KEY",
    };
    item.textContent = `${prefix}: ${envNames[item.dataset.key] || item.dataset.key}`;
  });
}

function renderInstagramStats() {
  const stats = instagramData.stats || {};
  const values = [
    [stats.needsReply || 0, "답글 필요"],
    [stats.questions || 0, "질문성 댓글"],
    [stats.price || 0, "가격/상담 문의"],
    [stats.warnings || 0, "주의 댓글"],
  ];

  values.forEach(([value, label], index) => {
    const card = instagramUi.stats[index];
    if (!card) return;
    card.querySelector("strong").textContent = value;
    card.querySelector("span").textContent = label;
  });
}

function renderInstagramMediaList() {
  instagramUi.mediaList.replaceChildren();
  const mediaItems = getVisibleInstagramMedia();
  instagramUi.mediaScopeButtons.forEach((button) => {
    const isActive = button.dataset.igMediaScope === activeInstagramMediaScope;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (!mediaItems.some((media) => media.id === selectedInstagramMediaId)) {
    selectedInstagramMediaId = mediaItems[0]?.id || instagramData.media?.[0]?.id || "";
  }

  if (!mediaItems.length) {
    const empty = document.createElement("p");
    empty.className = "channelEmpty";
    empty.textContent = "답글 후보가 남은 영상이 없습니다.";
    instagramUi.mediaList.append(empty);
    return;
  }

  mediaItems.forEach((media) => {
    const item = document.createElement("article");
    item.className = `igMediaItem${media.id === selectedInstagramMediaId ? " active" : ""}`;
    item.tabIndex = 0;

    const thumb = document.createElement("div");
    thumb.className = "igThumb";
    if (media.thumbnailUrl) {
      thumb.style.backgroundImage = `url("${media.thumbnailUrl}")`;
      thumb.style.backgroundSize = "cover";
      thumb.style.backgroundPosition = "center";
    }

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = media.title || "Instagram 영상";
    const count = document.createElement("p");
    const draftCount = countInstagramDraftsForMedia(media);
    count.textContent = [
      `댓글 ${media.commentsCount || media.comments?.length || 0}개`,
      `답글 필요 ${media.needsReplyCount || 0}개`,
      draftCount ? `초안 ${draftCount}개` : "",
    ].filter(Boolean).join(" · ");
    body.append(title, count);
    item.append(thumb, body);

    item.addEventListener("click", () => selectInstagramMedia(media.id));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectInstagramMedia(media.id);
      }
    });
    instagramUi.mediaList.append(item);
  });
}

function getVisibleInstagramMedia() {
  if (activeInstagramFilter === "done") {
    return (instagramData.media || []).filter((media) =>
      (media.comments || []).some((comment) => isInstagramCommentResolved(comment)),
    );
  }
  if (activeInstagramFilter === "draft") {
    return (instagramData.media || []).filter((media) => countInstagramDraftsForMedia(media) > 0);
  }
  if (activeInstagramMediaScope === "all") return instagramData.media || [];
  return (instagramData.media || []).filter((media) => (media.needsReplyCount || 0) > 0);
}

function countInstagramDraftsForMedia(media) {
  return (media.comments || []).filter((comment) =>
    !isInstagramCommentResolved(comment) && Boolean(getInstagramDraft(comment.id)),
  ).length;
}

function selectInstagramMedia(mediaId) {
  selectedInstagramMediaId = mediaId;
  renderInstagramMediaList();
  renderInstagramComments();
  renderInstagramPromptBox();
}

function renderInstagramComments() {
  instagramUi.commentList.replaceChildren();
  const media = getSelectedInstagramMedia();
  if (!media) {
    const empty = document.createElement("p");
    empty.className = "channelEmpty";
    empty.textContent = instagramData?.source === "error"
      ? "Instagram 실데이터를 불러오지 못했습니다. API 주소와 Vercel 환경변수를 확인해 주세요."
      : "불러온 Instagram 댓글이 없습니다.";
    instagramUi.commentList.append(empty);
    return;
  }

  getVisibleInstagramComments(media).forEach((comment) => {
    instagramUi.commentList.append(renderInstagramCommentCard(media, comment));
  });

  if (!instagramUi.commentList.children.length) {
    const empty = document.createElement("p");
    empty.className = "channelEmpty";
    empty.textContent = "현재 필터에 맞는 댓글이 없습니다.";
    instagramUi.commentList.append(empty);
  }
}

function renderInstagramCommentCard(media, comment) {
  const card = document.createElement("article");
  card.className = `igCommentCard${comment.category === "warning" ? " warning" : ""}`;
  card.classList.toggle("resolved", isInstagramCommentResolved(comment));

  const header = document.createElement("header");
  const avatar = document.createElement("div");
  avatar.className = `avatar ${getInstagramAvatarClass(comment.category)}`;
  const author = document.createElement("div");
  const name = document.createElement("h3");
  name.textContent = `@${comment.username || "instagram_user"}`;
  const meta = document.createElement("p");
  meta.textContent = `${formatDate(comment.timestamp)} · ${getInstagramCategoryLabel(comment.category)}`;
  author.append(name, meta);
  header.append(avatar, author);

  const text = document.createElement("p");
  text.textContent = comment.text || "";

  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.placeholder = "답글 초안 작성";
  textarea.value = getInstagramDraft(comment.id);
  textarea.disabled = isInstagramCommentResolved(comment);

  const footer = document.createElement("footer");
  const badge = document.createElement("span");
  badge.textContent = getInstagramCommentStateLabel(comment);
  textarea.addEventListener("input", () => {
    setInstagramDraft(comment.id, textarea.value);
    badge.textContent = getInstagramCommentStateLabel(comment);
  });
  const actions = document.createElement("div");
  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = "AI 복사용";
  copy.addEventListener("click", async () => {
    await copyText(buildInstagramReplyPrompt(media, [comment]));
    setStatus("Instagram 프롬프트 복사", `${media.title} 댓글 1개를 복사했습니다.`);
  });
  const done = document.createElement("button");
  done.type = "button";
  done.textContent = "처리 완료";
  done.addEventListener("click", () => markInstagramCommentDone(comment));
  const reply = document.createElement("button");
  reply.type = "button";
  reply.textContent = "답글 달기";
  reply.addEventListener("click", () => submitInstagramReply(comment, textarea, reply));
  if (!isInstagramCommentResolved(comment)) {
    actions.append(copy, done, reply);
  } else if (comment.localDone && !comment.hasOwnerReply) {
    const undo = document.createElement("button");
    undo.type = "button";
    undo.textContent = "처리 취소";
    undo.addEventListener("click", () => unmarkInstagramCommentDone(comment));
    actions.append(undo);
  }
  footer.append(badge, actions);

  card.append(header, text, textarea, footer);
  return card;
}

function getInstagramCommentStateLabel(comment) {
  if (comment.hasOwnerReply) return "답글 완료";
  if (comment.localDone) return "처리 완료";
  if (getInstagramDraft(comment.id)) return "초안 있음";
  return "답글 없음";
}

function isInstagramCommentResolved(comment) {
  return Boolean(comment?.hasOwnerReply || comment?.localDone);
}

function markInstagramCommentDone(comment) {
  if (!comment?.id) return;
  instagramDoneIds.add(comment.id);
  persistInstagramDoneIds();
  clearInstagramDraft(comment.id);
  comment.localDone = true;
  renderInstagramInbox();
  setStatus("Instagram 처리 완료", `@${comment.username || "instagram_user"} 댓글을 완료 처리했습니다.`);
}

function unmarkInstagramCommentDone(comment) {
  if (!comment?.id) return;
  instagramDoneIds.delete(comment.id);
  persistInstagramDoneIds();
  comment.localDone = false;
  renderInstagramInbox();
  setStatus("Instagram 처리 취소", `@${comment.username || "instagram_user"} 댓글을 답글 후보로 되돌렸습니다.`);
}

async function submitInstagramReply(comment, textarea, button) {
  const message = textarea.value.trim();
  if (!message) return;
  if (instagramData?.source !== "meta") {
    setStatus("Meta 설정 필요", "Vercel 환경변수와 Meta 권한이 연결되면 이 버튼으로 실제 답글을 달 수 있습니다.");
    return;
  }

  button.disabled = true;
  button.textContent = "전송 중";
  try {
    const response = await fetch(buildInstagramApiUrl("/api/instagram/reply"), {
      method: "POST",
      headers: buildInstagramApiHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ commentId: comment.id, message }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw createInstagramApiErrorFromData(response, data, "Instagram 답글 전송에 실패했습니다.");
    }
    comment.hasOwnerReply = true;
    comment.replies = [
      ...(comment.replies || []),
      {
        id: data.data?.id || `local-${Date.now()}`,
        username: instagramData.account?.username || "owner",
        text: message,
        timestamp: new Date().toISOString(),
      },
    ];
    textarea.value = "";
    clearInstagramDraft(comment.id);
    renderInstagramInbox();
    setStatus("Instagram 답글 완료", `@${comment.username} 댓글에 답글을 달았습니다.`);
  } catch (error) {
    setStatus("Instagram 답글 실패", getInstagramErrorMessage(error));
  } finally {
    button.disabled = false;
    button.textContent = "답글 달기";
  }
}

function renderInstagramPromptBox() {
  const media = getSelectedInstagramMedia();
  if (!instagramUi.promptBox) return;
  if (!media) {
    instagramUi.promptBox.querySelector("p").textContent = "선택 영상 0개 · 전체 후보 0개";
    const noCandidates = () => {
      setStatus("복사할 댓글 없음", "Instagram 실데이터를 먼저 불러와 주세요.");
    };
    if (instagramUi.promptSelectedButton) instagramUi.promptSelectedButton.onclick = noCandidates;
    if (instagramUi.promptAllButton) instagramUi.promptAllButton.onclick = noCandidates;
    if (instagramUi.applySelectedButton) instagramUi.applySelectedButton.onclick = noCandidates;
    if (instagramUi.applyAllButton) instagramUi.applyAllButton.onclick = noCandidates;
    return;
  }
  const selectedComments = getInstagramPromptComments(media);
  const promptGroups = getInstagramPromptGroups();
  const totalCount = countInstagramPromptComments(promptGroups);
  instagramUi.promptBox.querySelector("p").textContent =
    `선택 영상 ${selectedComments.length}개 · 전체 후보 ${totalCount}개`;

  if (instagramUi.promptSelectedButton) {
    instagramUi.promptSelectedButton.onclick = async () => {
      if (!selectedComments.length) {
        setStatus("복사할 댓글 없음", "현재 선택한 영상에 답글 후보가 없습니다.");
        return;
      }
      await copyText(buildInstagramReplyPrompt(media, selectedComments));
      setStatus("Instagram 프롬프트 복사", `${media.title} 댓글 ${selectedComments.length}개를 복사했습니다.`);
    };
  }

  if (instagramUi.promptAllButton) {
    instagramUi.promptAllButton.onclick = async () => {
      if (!totalCount) {
        setStatus("복사할 댓글 없음", "현재 필터 조건에 맞는 전체 답글 후보가 없습니다.");
        return;
      }
      await copyText(buildInstagramReplyPromptGroups(promptGroups));
      setStatus("Instagram 전체 프롬프트 복사", `불러온 영상 전체에서 댓글 후보 ${totalCount}개를 복사했습니다.`);
    };
  }

  if (instagramUi.applySelectedButton) {
    instagramUi.applySelectedButton.onclick = () => {
      applyInstagramAiRepliesToDrafts([{ media, comments: selectedComments }], "선택 영상");
    };
  }

  if (instagramUi.applyAllButton) {
    instagramUi.applyAllButton.onclick = () => {
      applyInstagramAiRepliesToDrafts(promptGroups, "전체 후보");
    };
  }
}

function getSelectedInstagramMedia() {
  return instagramData?.media?.find((media) => media.id === selectedInstagramMediaId) ||
    instagramData?.media?.[0] ||
    null;
}

function getVisibleInstagramComments(media) {
  return (media.comments || []).filter((comment) => {
    if (activeInstagramFilter === "done") return isInstagramCommentResolved(comment);
    if (activeInstagramFilter === "draft") {
      return !isInstagramCommentResolved(comment) && Boolean(getInstagramDraft(comment.id));
    }
    if (isInstagramCommentResolved(comment)) return false;
    if (activeInstagramFilter === "all") return true;
    return comment.category === activeInstagramFilter;
  });
}

function getInstagramPromptComments(media) {
  return (media.comments || []).filter((comment) => {
    if (isInstagramCommentResolved(comment)) return false;
    if (activeInstagramFilter === "done") return false;
    if (activeInstagramFilter === "draft") return Boolean(getInstagramDraft(comment.id));
    if (activeInstagramFilter === "all") return true;
    return comment.category === activeInstagramFilter;
  });
}

function getInstagramPromptGroups() {
  return (instagramData?.media || [])
    .map((media) => ({
      media,
      comments: getInstagramPromptComments(media),
    }))
    .filter((group) => group.comments.length);
}

function countInstagramPromptComments(groups) {
  return groups.reduce((sum, group) => sum + group.comments.length, 0);
}

function applyInstagramAiRepliesToDrafts(groups, scopeLabel) {
  const replies = parseInstagramAiReplies(instagramUi.aiPasteInput?.value || "");
  const entries = groups.flatMap((group) =>
    group.comments.map((comment) => ({ media: group.media, comment })),
  );

  if (!entries.length) {
    setStatus("적용할 댓글 없음", `${scopeLabel}에 답글 후보가 없습니다.`);
    return;
  }
  if (!replies.length) {
    setStatus("붙여넣기 필요", "GPT/Gemini에서 받은 코드블럭 답글을 먼저 붙여넣어 주세요.");
    return;
  }

  const count = Math.min(entries.length, replies.length);
  if (replies.length !== entries.length) {
    const message =
      `${scopeLabel}: 댓글 후보 ${entries.length}개, 붙여넣은 답글 ${replies.length}개입니다.\n` +
      `앞에서부터 ${count}개만 적용할까요?`;
    if (!window.confirm(message)) {
      setStatus(
        "AI 답글 개수 불일치",
        `${scopeLabel} 후보 ${entries.length}개와 붙여넣은 답글 ${replies.length}개가 달라 적용하지 않았습니다.`,
      );
      return;
    }
  }

  let draftCount = 0;
  let doneCount = 0;

  for (let index = 0; index < count; index += 1) {
    const { comment } = entries[index];
    const reply = replies[index];
    if (isHeartOnlyReply(reply)) {
      instagramDoneIds.add(comment.id);
      clearInstagramDraft(comment.id);
      comment.localDone = true;
      doneCount += 1;
    } else {
      setInstagramDraft(comment.id, reply);
      draftCount += 1;
    }
  }

  persistInstagramDoneIds();
  if (instagramUi.aiPasteInput) instagramUi.aiPasteInput.value = "";
  renderInstagramInbox();
  setStatus(
    "AI 답글 초안 적용",
    `${scopeLabel}에서 초안 ${draftCount}개를 저장하고, 하트 처리 ${doneCount}개를 완료 표시했습니다. (${count}/${entries.length}개 적용)`,
  );
}

function parseInstagramAiReplies(text) {
  const source = String(text || "").trim();
  if (!source) return [];

  const blocks = [...source.matchAll(/```(?:[a-z0-9_-]+)?\s*([\s\S]*?)```/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean);
  if (blocks.length) return blocks;

  return source
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isHeartOnlyReply(text) {
  return String(text || "").replace(/\s+/g, "").toLowerCase() === "하트";
}

function buildInstagramReplyPrompt(media, targetComments) {
  return buildInstagramReplyPromptGroups([{ media, comments: targetComments }]);
}

function buildInstagramReplyPromptGroups(groups) {
  let number = 0;
  const lines = groups.flatMap((group) => {
    return group.comments.map((comment) => {
      number += 1;
      return [
        `${number}.`,
        `영상 제목(참고용): ${group.media.title}`,
        `원댓글: ${comment.text}`,
      ].join("\n");
    });
  });

  return [
    "아래는 Instagram 댓글 인박스에서 복사한 답글 후보 목록입니다.",
    "영상 제목은 참고만 하고, 실제 댓글 내용에만 답글해 주세요.",
    "",
    "조건:",
    "1. 이미 답글이 필요한 댓글만 대상으로 봅니다.",
    "2. 의료 답변은 사실 기반으로만 작성하고 과장, 보장, 확정 표현은 피합니다.",
    "3. 단순 반응 댓글은 코드블럭 안에 \"하트\"라고만 써 주세요.",
    "4. 원댓글 일반 텍스트 + 답글 코드블럭만 순서대로 출력해 주세요.",
    "",
    "병원 답변 방향:",
    formatNumberedRules(clinicGuidelines.length ? clinicGuidelines : DEFAULT_CLINIC_GUIDELINES),
    "",
    "부가 특장점:",
    formatNumberedRules(clinicStrengths.length ? clinicStrengths : DEFAULT_CLINIC_STRENGTHS),
    "",
    "댓글 후보 목록:",
    lines.join("\n\n"),
  ].join("\n");
}

function getInstagramAvatarClass(category) {
  if (category === "price") return "coral";
  if (category === "warning") return "dark";
  if (category === "reaction") return "green";
  return "";
}

function getInstagramCategoryLabel(category) {
  return {
    question: "질문성",
    price: "가격 문의",
    warning: "주의 필요",
    reaction: "단순 반응",
  }[category] || "댓글";
}

function setInstagramButtonLabel(label) {
  const labelNode = instagramUi.loadButton?.querySelector("span");
  if (labelNode) labelNode.textContent = label;
}

function groupCommentsByChannel(commentList) {
  const configured = activeChannels.length ? activeChannels : getConfiguredChannels();
  const byChannel = new Map();

  configured.forEach((channel) => {
    byChannel.set(channel.id, {
      id: channel.id,
      name: channel.name,
      index: channel.index,
      comments: [],
    });
  });

  commentList.forEach((comment) => {
    if (!byChannel.has(comment.channelId)) {
      byChannel.set(comment.channelId, {
        id: comment.channelId,
        name: comment.channelName || "채널",
        index: comment.channelIndex ?? byChannel.size,
        comments: [],
      });
    }
    byChannel.get(comment.channelId).comments.push(comment);
  });

  return [...byChannel.values()].sort((a, b) => a.index - b.index);
}

function renderChannelColumn(channel) {
  const column = document.createElement("section");
  column.className = "channelColumn";

  const header = document.createElement("header");
  header.className = "channelColumnHeader";
  const titleBlock = document.createElement("div");
  titleBlock.className = "channelTitleBlock";
  const title = document.createElement("h2");
  title.textContent = channel.name;
  const count = document.createElement("p");
  const candidateCount = getPromptCandidateComments(channel.comments).length;
  count.textContent = `댓글 ${channel.comments.length}개 · AI 후보 ${candidateCount}개`;
  titleBlock.append(title, count);
  header.append(titleBlock, renderChannelActions(channel));

  const body = document.createElement("div");
  body.className = "channelColumnBody";

  if (channel.comments.length === 0) {
    const empty = document.createElement("p");
    empty.className = "channelEmpty";
    empty.textContent = "조건에 맞는 댓글이 없습니다.";
    body.append(empty);
  } else {
    const groups = groupCommentsByVideo(channel.comments);
    groups.forEach((group) => {
      body.append(renderVideoGroup(group));
    });
  }

  column.append(header, body);
  return column;
}

function renderChannelActions(channel) {
  const actions = document.createElement("div");
  actions.className = "channelActions";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "channelAction";
  copyButton.title = `${channel.name} 프롬프트 복사`;
  copyButton.innerHTML = `<i data-lucide="copy"></i><span>복사</span>`;
  copyButton.addEventListener("click", async () => {
    try {
      const prompt = buildAiReplyPrompt(channel.comments, { scopeLabel: channel.name });
      await copyText(prompt);
      const count = getPromptCandidateComments(channel.comments).length;
      setStatus("채널 프롬프트 복사 완료", `${channel.name} 댓글 후보 ${count}개를 프롬프트와 함께 복사했습니다.`);
    } catch (error) {
      setStatus("복사 실패", error.message || `${channel.name}에서 복사할 댓글 후보가 없습니다.`);
    }
  });

  actions.append(
    copyButton,
    createAiLink("GPT", "chatgpt.com", "https://chatgpt.com/", "ChatGPT 새 탭에서 열기"),
    createAiLink("Gemini", "gemini.google.com", "https://gemini.google.com/app", "Gemini 새 탭에서 열기"),
  );

  return actions;
}

function createAiLink(label, faviconDomain, href, title) {
  const link = document.createElement("a");
  link.className = "channelAction";
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.title = title;
  link.innerHTML = [
    `<img src="https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=64" alt="" />`,
    `<span>${label}</span>`,
  ].join("");
  return link;
}

function renderVideoGroup(group) {
  const section = document.createElement("section");
  section.className = "videoGroup";

  const header = document.createElement("header");
  header.className = "videoGroupHeader";

  const thumbnail = document.createElement("img");
  thumbnail.className = "videoThumb";
  thumbnail.alt = "";
  thumbnail.src = group.videoThumbnail || "";

  const titleBlock = document.createElement("div");
  titleBlock.className = "videoGroupTitle";
  const title = document.createElement("h2");
  title.textContent = group.videoTitle;
  const count = document.createElement("p");
  count.textContent = `댓글 ${group.comments.length}개 · 최신 ${formatDate(group.latestAt)}`;
  titleBlock.append(title, count);

  const watch = document.createElement("a");
  watch.href = `https://www.youtube.com/watch?v=${group.videoId}`;
  watch.target = "_blank";
  watch.rel = "noreferrer";
  watch.textContent = "영상";

  const media = document.createElement("div");
  media.className = "videoGroupMedia";
  media.append(thumbnail, titleBlock);

  header.append(media, watch);

  const grid = document.createElement("div");
  grid.className = "videoComments";
  group.comments.forEach((comment) => {
    grid.append(renderCommentCard(comment));
  });

  section.append(header, grid);
  return section;
}

function groupCommentsByVideo(commentList) {
  const byVideo = new Map();

  commentList.forEach((comment) => {
    if (!byVideo.has(comment.videoId)) {
      byVideo.set(comment.videoId, {
        videoId: comment.videoId,
        videoTitle: comment.videoTitle,
        videoThumbnail: comment.videoThumbnail,
        latestAt: comment.publishedAt,
        comments: [],
      });
    }

    const group = byVideo.get(comment.videoId);
    if (!group.videoThumbnail && comment.videoThumbnail) {
      group.videoThumbnail = comment.videoThumbnail;
    }
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
  renderReplies(card.querySelector(".existingReplies"), comment.replies || []);
  card.querySelector(".likeBadge").textContent =
    comment.replyCount > 0
      ? `답글 ${comment.replyCount}개 · 좋아요 ${comment.likeCount}개`
      : `답글 없음 · 좋아요 ${comment.likeCount}개`;
  card.querySelector(".watchLink").href =
    `https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}`;
  card.querySelector(".studioLink").href =
    `https://studio.youtube.com/channel/${comment.channelId}/comments/inbox`;

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
      const reply = await insertReply({ parentId: comment.id, text });
      comment.replies = [...(comment.replies || []), normalizeReply(reply)];
      comment.replyCount = Math.max(comment.replyCount + 1, comment.replies.length);
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

function renderReplies(container, replies) {
  container.replaceChildren();

  if (!replies.length) {
    container.hidden = true;
    return;
  }

  container.hidden = false;

  const label = document.createElement("p");
  label.className = "replyListTitle";
  label.textContent = `기존 답글 ${replies.length}개`;
  container.append(label);

  replies.forEach((reply) => {
    const item = document.createElement("article");
    item.className = "replyItem";

    const avatar = document.createElement("img");
    avatar.className = "replyAvatar";
    avatar.alt = "";
    avatar.src = reply.avatar;

    const body = document.createElement("div");
    const meta = document.createElement("p");
    meta.className = "replyMeta";
    meta.textContent = `${reply.author} · ${formatDate(reply.publishedAt)}`;
    const text = document.createElement("p");
    text.className = "replyBody";
    text.textContent = reply.text;

    body.append(meta, text);
    item.append(avatar, body);
    container.append(item);
  });
}

function getActiveFilteredComments() {
  return comments.filter((comment) => {
    const ownerReplied = hasOwnerReply(comment);
    if (activeFilter === "replied") return ownerReplied;
    return !ownerReplied;
  });
}

function getPromptCandidateComments(sourceComments) {
  const source = Array.isArray(sourceComments) ? sourceComments : getActiveFilteredComments();
  return source.filter((comment) => !hasOwnerReply(comment));
}

function hasOwnerReply(comment) {
  return (comment.replies || []).some((reply) => isOwnerReplyAuthor(reply.author));
}

function isOwnerReplyAuthor(author) {
  const normalizedAuthor = normalizeHandle(author);
  return OWNER_REPLY_HANDLES.some((handle) => {
    const normalizedHandle = normalizeHandle(handle);
    return (
      normalizedAuthor.includes(normalizedHandle) ||
      normalizedHandle.includes(normalizedAuthor)
    );
  });
}

function normalizeHandle(value) {
  return String(value || "").replace(/\s+/g, "").toLowerCase();
}

function buildAiReplyPrompt(sourceComments, options = {}) {
  const candidates = getPromptCandidateComments(sourceComments);
  if (!candidates.length) {
    throw new Error("복사할 댓글 후보가 없습니다.");
  }

  const clinicGuidelineText = formatNumberedRules(
    clinicGuidelines.length ? clinicGuidelines : DEFAULT_CLINIC_GUIDELINES,
  );
  const clinicStrengthText = formatNumberedRules([
    "필요할 때만 자연스럽게 반영하고, 모든 답글에 억지로 넣지 마.",
    ...(clinicStrengths.length ? clinicStrengths : DEFAULT_CLINIC_STRENGTHS),
    "해외 의료진 연수나 수술 노하우 관련 댓글이 나오면, 하이스트 구진모 원장은 동종진피 확대수술 노하우를 국내외 의료진에게 교육해온 경험이 있다는 점을 과장 없이 자연스럽게 언급해.",
    "병원을 홍보하는 느낌이 너무 강하지 않게, 댓글 질문에 답하는 선에서만 특장점을 넣어.",
  ]);
  const commentBlock = candidates
    .map((comment, index) => {
      return [
        `${index + 1}.`,
        `채널명(참고용): ${comment.channelName}`,
        `영상 제목(참고용): ${comment.videoTitle}`,
        `원댓글: ${comment.text}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    options.scopeLabel
      ? `아래는 유튜브 댓글관리 도구에서 ${options.scopeLabel} 채널만 분리해 정리한 댓글 후보 목록이야.`
      : "아래는 유튜브 댓글관리 도구에서 정리한 댓글 후보 목록이야.",
    "",
    "영상 제목은 참고용이고, 답글 대상은 “원댓글” 내용이야.",
    "",
    "너는 이 중에서 “아직 답글이 필요한 실제 댓글”만 골라서, 비뇨기과 의사 관점의 댓글 답글을 추천해줘.",
    "",
    "기본 원칙:",
    "1. 영상 제목은 답글 대상에서 제외해.",
    "2. “답글”, “답글 0개”, “답글 1개”, “자세히 알아보기” 같은 UI 문구는 제외해.",
    `3. 이미 병원 운영 계정(${OWNER_REPLY_HANDLES.join(", ")})으로 답글이 달린 댓글은 제외해. 아래 목록은 1차 제외 후 복사했지만, 내용상 이미 답변된 댓글도 제외해.`,
    "4. 댓글 작성자 아이디와 작성 시간은 제외하고, 실제 댓글 내용만 보고 답글해.",
    "5. 답글은 한 댓글당 1개씩만 작성해.",
    "6. 각 답변 위에는 어떤 댓글에 대한 답변인지 알 수 있게, 원댓글 내용을 일반 텍스트로 먼저 표시해.",
    "7. 원댓글 표시는 코드블럭 밖에 작성해.",
    "8. 답글은 각각 개별 코드블럭으로 줘.",
    "9. 코드블럭 안에는 답글 텍스트만 넣어. 제목, 번호, 설명, HTML 태그는 절대 넣지 마.",
    "10. 답글은 바로 복사해서 붙여넣을 수 있게 자연스럽고 짧게 작성해.",
    "11. 설명은 하지 말고, 원댓글 일반 텍스트 + 답글 코드블럭만 순서대로 출력해.",
    "",
    "의료 답변 원칙:",
    "1. 의료 관련 답변은 반드시 사실 기반으로만 작성해.",
    "2. 과장, 보장, 확정 표현은 피하고 “개인 상태에 따라 다릅니다”, “정확한 진단이 필요합니다”, “상담 후 결정하는 것이 안전합니다” 같은 표현을 사용해.",
    "3. “무조건 안전하다”, “부작용 없다”, “100% 효과 있다”, “반드시 좋아진다” 같은 표현은 절대 쓰지 마.",
    "4. 조롱성 댓글에는 싸우지 말고 짧고 차분하게 응대해.",
    "5. 광고성 댓글이나 검증 안 된 제품 홍보 댓글에는 의학적으로 주의가 필요하다는 답변을 달아.",
    "6. 의미가 거의 없거나 단순 반응성 댓글은 답글을 쓰지 말고 코드블럭 안에 “하트”라고만 써줘.",
    "",
    "하이스트비뇨의학과 답변 방향:",
    clinicGuidelineText,
    "",
    "발기부전 답변 방향:",
    "1. 발기부전 치료는 약물치료와 주사치료 등 여러 옵션을 환자 상태에 맞춰 상담한다고 답해.",
    "2. 발기부전 댓글에는 혈관, 신경, 호르몬, 당뇨, 고혈압, 복용 약물, 심리적 요인 등 원인이 다양하므로 정확한 진단이 중요하다고 답해.",
    "3. 발기부전 보형물은 처음부터 권하는 치료가 아니라, 약물치료나 주사치료 등으로 효과가 부족한 경우 신중하게 고려하는 치료라고 답해.",
    "4. 팽창형과 굴곡형의 차이는 간단히 설명하되, 개인 해면체 상태와 선택 가능한 보형물 크기에 따라 결과가 달라질 수 있다고 답해.",
    "5. 당뇨는 발기부전의 원인이 될 수 있지만 혈당 조절 상태와 전신 건강이 안정적이면 치료나 수술 가능성을 검토할 수 있고 감염 위험과 회복 상태 확인이 중요하다고 답해.",
    "6. 발기부전 크림, 영양제, 운동법 등 검증이 부족한 방법에는 효과를 단정하기 어렵고 반복되는 증상은 비뇨의학과 진료로 원인을 확인하는 것이 안전하다고 답해.",
    "7. 성기 운동, 세수공, 기역도 같은 댓글에는 혈류 개선 운동은 도움이 될 수 있지만 성기 길이·굵기를 확실히 늘린다고 보기 어렵고, 무리한 압박이나 견인은 손상 위험이 있어 주의해야 한다고 답해.",
    "",
    "하이스트 병원 특장점 반영:",
    clinicStrengthText,
    "",
    "출력 형식:",
    "원댓글 내용",
    "",
    "```text",
    "답글 내용",
    "```",
    "",
    "댓글 후보 목록:",
    commentBlock,
  ].join("\n");
}

function formatNumberedRules(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("브라우저가 클립보드 복사를 허용하지 않았습니다.");
  }
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

function pickThumbnail(thumbnails) {
  return (
    thumbnails?.medium?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.default?.url ||
    ""
  );
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

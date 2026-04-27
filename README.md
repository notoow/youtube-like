# YouTube Comment Heart Helper

GitHub Pages에서 바로 열 수 있는 정적 댓글 검토 도구입니다. YouTube Data API로 최근 영상 댓글을 불러오고, 하트를 누를 댓글 후보를 빠르게 고른 뒤 YouTube Studio 댓글함으로 이동합니다.

## 사용 방법

1. Google Cloud Console에서 YouTube Data API v3를 활성화합니다.
2. API 키를 하나 만들고, 가능하면 HTTP referrer 제한을 GitHub Pages 주소로 겁니다.
3. `index.html`을 GitHub Pages에 배포합니다.
4. 페이지에서 API 키와 채널 ID를 입력한 뒤 댓글을 불러옵니다.

## 중요한 제한

- YouTube Data API에는 댓글에 creator heart를 자동으로 누르는 공식 메서드가 없습니다.
- 이 도구는 하트 클릭을 자동화하지 않고, 댓글 후보를 모아 YouTube Studio로 이동시키는 보조 도구입니다.
- API 키는 서버로 보내지지 않고 브라우저 `localStorage`에만 저장됩니다. 공개 PC에서는 사용 후 저장값을 지우세요.

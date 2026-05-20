# Instagram / Vercel setup

The Instagram tab uses Vercel API routes for real Meta Graph API data. Without
Meta credentials the API returns a configuration error instead of demo data.

When the static GitHub Pages app is open, it calls this Vercel API base by
default:

```text
https://youtube-like.vercel.app
```

If the Vercel project uses a different domain, update the `API 주소` field in
the Instagram header. The value is saved in the browser.
You can paste the Vercel root domain or a full API URL such as
`https://your-project.vercel.app/api/instagram/health`; the app keeps only the
project root.

Set the same private value in Vercel `INSTAGRAM_ADMIN_KEY` and in the
Instagram header `운영 키` field. Both comment loading and replying require
this key, so the public Vercel URL cannot be used casually from another site.
Use `키 생성` and `env 복사` in the Instagram header tools to prepare the
matching browser key and Vercel environment-variable block.

It is fine to deploy this backend from a different Vercel account than the one
used for GitHub Pages. The only requirement is that the GitHub Pages app can
reach the public Vercel domain entered in `API 주소`.

Set these environment variables in Vercel:

```text
META_GRAPH_VERSION=v23.0
META_ACCESS_TOKEN=your_long_lived_meta_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
INSTAGRAM_OWNER_USERNAME=nonhyeon_dr_koo
INSTAGRAM_ADMIN_KEY=make-a-long-random-private-key
```

API routes:

- `GET /api/instagram/health` checks the admin key, Meta credentials, and
  Instagram account access without loading the full comment inbox.
- `GET /api/instagram/media` loads recent media and comments.
- `POST /api/instagram/reply` replies to a comment when Meta permissions are ready.

Meta permissions to prepare during app setup:

- Instagram professional account access
- Comment read/manage access for owned media
- App review screencast showing comments loaded and replied to inside this app

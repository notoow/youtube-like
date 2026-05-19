# Instagram / Vercel setup

The Instagram tab can run as a Vercel app. Without Meta credentials it returns
sample data, so the UI remains testable before app review.

Set these environment variables in Vercel:

```text
META_GRAPH_VERSION=v23.0
META_ACCESS_TOKEN=your_long_lived_meta_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
INSTAGRAM_OWNER_USERNAME=nonhyeon_dr_koo
```

API routes:

- `GET /api/instagram/media` loads recent media and comments.
- `POST /api/instagram/reply` replies to a comment when Meta permissions are ready.

Meta permissions to prepare during app setup:

- Instagram professional account access
- Comment read/manage access for owned media
- App review screencast showing comments loaded and replied to inside this app

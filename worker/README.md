# holdfast-appview (worker)

Minimal Cloudflare Worker stub for the Holdfast trust-provider AppView. v0.1
scope: it serves the lexicon spec over HTTP and exposes one working query
endpoint against D1. It does not ingest the firehose yet, so `searchListings`
will return an empty list until something writes to the `listings` table
(TASKS.md #2).

## Routes

- `GET /` — health check
- `GET /lexicons/:nsid` — raw lexicon JSON, e.g. `/lexicons/app.holdfast.market.listing`
- `GET /xrpc/app.holdfast.market.searchListings` — queries D1, params: `listingType`, `category`, `currency`, `limit`

## Local development

```bash
npm install
npm run db:init   # applies schema.sql to a local D1 emulation
npm run dev        # wrangler dev on http://localhost:8787
```

## Deploying

Requires a Cloudflare account with `wrangler login` (or an API token) —
not something this session can do on your behalf.

```bash
npx wrangler d1 create holdfast   # then copy the database_id into wrangler.toml
npx wrangler d1 execute holdfast --remote --file=./schema.sql
npm run deploy
```

## Typecheck

```bash
npm run typecheck
```

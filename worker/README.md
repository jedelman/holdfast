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

The D1 database (`holdfast`, id `ebc48f27-50fb-4c48-ab00-db547dd5c4d6`) and
Cloudflare Workers Builds git integration are already set up, deploying on
push to `main`. Deploys will fail until the schema has been applied to the
*remote* database at least once — that step needs your own `wrangler login`
or API token, so it's not something this session can do on your behalf:

```bash
npx wrangler d1 execute holdfast --remote --file=./schema.sql
```

After that, `git push` to `main` (via a merged PR) triggers Workers Builds
to run `npx wrangler deploy` automatically. Manual deploy also works:

```bash
npm run deploy
```

## Typecheck

```bash
npm run typecheck
```

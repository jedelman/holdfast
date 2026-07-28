# Holdfast — Task Backlog

## v0.1 (shipped 2026-07-28)

Scope: a validated, published lexicon spec plus a minimal running AppView
stub — not the full marketplace. See README.md "Status" section.

- [x] Lexicon validation script (`scripts/validate-lexicons.mjs`) — checks
      JSON validity, id-matches-path, no duplicate ids, and that every
      internal `app.holdfast.*` ref/knownValues token resolves. External
      refs (`com.atproto.*`) are reported, not resolved.
- [x] CI (`.github/workflows/ci.yml`) — runs the validator and the worker
      typecheck on every push/PR.
- [x] Minimal Cloudflare Worker AppView stub (`worker/`) — health check,
      lexicon-serving (`GET /lexicons/:nsid`), and a working
      `app.holdfast.market.searchListings` query against D1.
- [x] D1 schema for `listings` (`worker/schema.sql`) — table exists and the
      query path is real, but nothing populates it yet (firehose ingestion
      is item #2 below, still open).
- [ ] Deploy — needs Jason's own `wrangler login` / Cloudflare account;
      can't be done from an agent session. See `worker/README.md`.

## Next session priorities

### 1. Dispute schema
- [ ] Design `app.holdfast.market.dispute` record type
- [ ] Decide: dispute written by buyer or provider?
- [ ] Define dispute states and resolution flow
- [ ] XRPC endpoint for submitting dispute evidence
- [ ] Link dispute to transaction (sidecar or strong ref?)

### 2. Provider AppView architecture
- [x] Cloudflare Worker + D1 — scaffolded in `worker/` (v0.1)
- [ ] Firehose ingestion into D1 — `listings` table exists but nothing
      writes to it yet; `searchListings` is real but returns empty until this lands
- [ ] D1 schema: extend to offers, transactions, reviews (only `listings` exists so far)
- [ ] Remaining XRPC endpoints beyond `searchListings` (see #5, #6 below)
- [ ] submitReview window logic — how long to hold before publishing unmatched review?
- [ ] Tracking middleware design — carrier API integrations (USPS, UPS, FedEx, DHL)

### 3. Lexicon publishing
- [ ] Follow https://atproto.com/guides/publishing-lexicons for the formal
      `com.atproto.lexicon.schema` record-based publishing
- [ ] Register `app.holdfast` namespace
- [x] Pragmatic interim hosting — `worker` serves raw lexicon JSON at
      `GET /lexicons/:nsid` (v0.1). Not the formal atproto publishing flow above.
- [x] Validate all lexicons — `scripts/validate-lexicons.mjs`, run in CI (v0.1)

### 4. OpenCollective page
- [ ] Create Holdfast collective at opencollective.com
- [ ] Write governance charter (who can propose changes, how spec evolves)
- [ ] Link from README

### 5. getListing endpoint
- [ ] `app.holdfast.market.getListing` — hydrated single listing view
- [ ] Include seller review summary
- [ ] Include active offers count (for seller view, authenticated only)

### 6. Additional query endpoints
- [ ] `app.holdfast.market.getTransaction` — hydrated transaction with shipment + events
- [ ] `app.holdfast.trust.getReviewReplies` — or fold into getReviews (already done)

### 7. Validation + tooling
- [x] Add lexicon validation script (v0.1, `scripts/validate-lexicons.mjs`)
- [x] CI: validate on every push (v0.1)
- [ ] Generate TypeScript types from lexicons

## Design questions to resolve

- **submitReview window:** 14 days? 30 days? Configurable per transaction type?
- **Dispute arbitration:** Who decides? Provider as arbiter vs. community labelers?
- **Digital goods delivery:** What's the evidentiary equivalent of a tracking event for digital delivery?
- **Service completion:** How does a service transaction get marked delivered? Calendar/attestation record?

## Done
- [x] Initial lexicon spec — all namespaces, 16 files (2026-04-03)

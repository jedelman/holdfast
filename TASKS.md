# Holdfast — Task Backlog

## Next session priorities

### 1. Dispute schema
- [ ] Design `app.holdfast.market.dispute` record type
- [ ] Decide: dispute written by buyer or provider?
- [ ] Define dispute states and resolution flow
- [ ] XRPC endpoint for submitting dispute evidence
- [ ] Link dispute to transaction (sidecar or strong ref?)

### 2. Provider AppView architecture
- [ ] Cloudflare Worker + D1 — natural fit given existing stack
- [ ] D1 schema: index listings, offers, transactions, reviews
- [ ] Worker routes map to XRPC endpoints
- [ ] submitReview window logic — how long to hold before publishing unmatched review?
- [ ] Tracking middleware design — carrier API integrations (USPS, UPS, FedEx, DHL)

### 3. Lexicon publishing
- [ ] Follow https://atproto.com/guides/publishing-lexicons
- [ ] Register `app.holdfast` namespace
- [ ] Set up lexicon hosting (Cloudflare Worker serving lexicon JSON at well-known path)
- [ ] Validate all lexicons with atproto lexicon tooling

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
- [ ] Add lexicon validation script (see openmkt-app approach)
- [ ] CI: validate on every push
- [ ] Generate TypeScript types from lexicons

## Design questions to resolve

- **submitReview window:** 14 days? 30 days? Configurable per transaction type?
- **Dispute arbitration:** Who decides? Provider as arbiter vs. community labelers?
- **Digital goods delivery:** What's the evidentiary equivalent of a tracking event for digital delivery?
- **Service completion:** How does a service transaction get marked delivered? Calendar/attestation record?

## Done
- [x] Initial lexicon spec — all namespaces, 16 files (2026-04-03)

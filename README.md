# Holdfast

**Decentralized marketplace lexicon and trusted third party on AT Protocol.**

Holdfast is a governance project — not a platform. Its goal is to define an open, interoperable standard for peer-to-peer commerce on atproto, with a trust and reputation layer that keeps accountability on-chain without centralizing control.

## What Holdfast is

- A **lexicon spec** defining the record types and XRPC endpoints for decentralized trade
- A **trust provider** (AppView) that acts as a neutral evidentiary clearinghouse — holding the escrow of *proof*, not money
- A **governance process** for evolving the spec, hosted as an open conversation

## What Holdfast is not

- A payment processor
- A platform with listing takedown authority
- A centralized marketplace

## How it works

Sellers publish listings to their own AT Protocol repositories. Buyers publish offers to theirs. Sellers write transaction records as acceptance. The Holdfast AppView indexes everything, bridges carrier tracking APIs to produce evidentiary shipment records, and manages the double-blind review system via XRPC.

Reviews are published to the provider's repository and hit the firehose — they are public, permanent, and portable across AppViews. The reviewed party has one right of reply.

## Namespace map

```
app.holdfast.defs                         Shared types (money, location, condition)
app.holdfast.currency.code                ISO 4217 currency registry (provider repo)
app.holdfast.market.listing               Listing (seller repo)
app.holdfast.market.offer                 Offer (buyer repo)
app.holdfast.market.transaction           Accepted transaction (seller repo)
app.holdfast.market.defs                  Hydrated view types
app.holdfast.market.searchListings        Query: search listings
app.holdfast.tracking.shipment            Shipment (seller repo)
app.holdfast.tracking.event               Carrier event, immutable (middleware repo)
app.holdfast.trust.provider               Provider declaration (provider repo)
app.holdfast.trust.review                 Published review (provider repo)
app.holdfast.trust.reviewReply            One-shot reply from review subject (provider repo)
app.holdfast.trust.getReviews             Query: get reviews for a DID
app.holdfast.subscription.membership     Participation attestation (user repo)
app.holdfast.subscription.cancellation   Departure attestation (user repo)
```

## Record ownership

| Record | Repository |
|---|---|
| `market.listing` | Seller |
| `market.offer` | Buyer |
| `market.transaction` | Seller |
| `tracking.shipment` | Seller |
| `tracking.event` | Tracking middleware |
| `trust.provider` | Trust provider |
| `trust.review` | Trust provider |
| `trust.reviewReply` | Trust provider |
| `currency.code` | Trust provider |
| `subscription.membership` | User |
| `subscription.cancellation` | User |

## Design principles

- **Evidentiary over reported** — carrier events, not user claims, are the ground truth for physical delivery
- **Double-blind reviews** — both parties submit before either sees the other's review, coordinated by the provider via XRPC
- **One-shot reply** — the reviewed party may reply once; no brigading
- **Schema evolution first** — fields are optional unless truly required; open unions throughout; token-based extensibility over closed enums
- **Section 230 + transparency** — the firehose is its own audit trail; Holdfast hosts the conversation, not the enforcement

## License

Apache 2.0

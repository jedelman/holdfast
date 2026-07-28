// Bundled copies of the lexicon JSON so the Worker can serve them without
// filesystem access at runtime. Keep this list in sync with lexicons/**.
// scripts/validate-lexicons.mjs (run in CI) is the source of truth for
// whether the underlying files are still valid.

import defs from '../../lexicons/app/holdfast/defs.json';
import currencyCode from '../../lexicons/app/holdfast/currency/code.json';
import marketDefs from '../../lexicons/app/holdfast/market/defs.json';
import marketListing from '../../lexicons/app/holdfast/market/listing.json';
import marketOffer from '../../lexicons/app/holdfast/market/offer.json';
import marketSearchListings from '../../lexicons/app/holdfast/market/searchListings.json';
import marketTransaction from '../../lexicons/app/holdfast/market/transaction.json';
import subscriptionCancellation from '../../lexicons/app/holdfast/subscription/cancellation.json';
import subscriptionMembership from '../../lexicons/app/holdfast/subscription/membership.json';
import trackingEvent from '../../lexicons/app/holdfast/tracking/event.json';
import trackingShipment from '../../lexicons/app/holdfast/tracking/shipment.json';
import trustGetReviews from '../../lexicons/app/holdfast/trust/getReviews.json';
import trustProvider from '../../lexicons/app/holdfast/trust/provider.json';
import trustReview from '../../lexicons/app/holdfast/trust/review.json';
import trustReviewReply from '../../lexicons/app/holdfast/trust/reviewReply.json';

export const LEXICONS: Record<string, unknown> = {
  'app.holdfast.defs': defs,
  'app.holdfast.currency.code': currencyCode,
  'app.holdfast.market.defs': marketDefs,
  'app.holdfast.market.listing': marketListing,
  'app.holdfast.market.offer': marketOffer,
  'app.holdfast.market.searchListings': marketSearchListings,
  'app.holdfast.market.transaction': marketTransaction,
  'app.holdfast.subscription.cancellation': subscriptionCancellation,
  'app.holdfast.subscription.membership': subscriptionMembership,
  'app.holdfast.tracking.event': trackingEvent,
  'app.holdfast.tracking.shipment': trackingShipment,
  'app.holdfast.trust.getReviews': trustGetReviews,
  'app.holdfast.trust.provider': trustProvider,
  'app.holdfast.trust.review': trustReview,
  'app.holdfast.trust.reviewReply': trustReviewReply,
};

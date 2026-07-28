import { LEXICONS } from './lexicons';

export interface Env {
  DB: D1Database;
}

interface ListingRow {
  uri: string;
  cid: string;
  seller_did: string;
  title: string;
  description: string | null;
  price_amount: string;
  price_currency: string;
  listing_type: string;
  condition: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function toListingView(row: ListingRow) {
  return {
    uri: row.uri,
    cid: row.cid,
    record: {
      title: row.title,
      description: row.description ?? undefined,
      price: { amount: row.price_amount, currency: row.price_currency },
      listingType: row.listing_type,
      condition: row.condition ?? undefined,
      category: row.category ?? undefined,
      status: row.status,
      createdAt: row.created_at,
    },
    sellerDid: row.seller_did,
  };
}

// GET /xrpc/app.holdfast.market.searchListings
// v0.1: reads whatever is in D1. Nothing writes to `listings` yet — that's
// firehose ingestion, tracked in TASKS.md #2 — so this returns [] until then,
// but the query path, param handling, and response shape are real.
async function searchListings(url: URL, env: Env): Promise<Response> {
  const params = url.searchParams;
  const limitParam = Number.parseInt(params.get('limit') ?? '', 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 25;

  const conditions: string[] = ["status = 'active'"];
  const binds: unknown[] = [];

  const listingType = params.get('listingType');
  if (listingType) {
    conditions.push('listing_type = ?');
    binds.push(listingType);
  }

  const category = params.get('category');
  if (category) {
    conditions.push('category = ?');
    binds.push(category);
  }

  const currency = params.get('currency');
  if (currency) {
    conditions.push('price_currency = ?');
    binds.push(currency);
  }

  const query = `
    SELECT uri, cid, seller_did, title, description, price_amount, price_currency,
           listing_type, condition, category, status, created_at
    FROM listings
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
    LIMIT ?
  `;
  binds.push(limit);

  const { results } = await env.DB.prepare(query)
    .bind(...binds)
    .all<ListingRow>();

  return json({ listings: results.map(toListingView) });
}

function serveLexicon(nsid: string): Response {
  const lexicon = LEXICONS[nsid];
  if (!lexicon) return json({ error: 'NotFound', message: `Unknown lexicon "${nsid}"` }, 404);
  return json(lexicon);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return json({ service: 'holdfast-appview', status: 'ok', version: '0.1.0' });
    }

    const lexiconMatch = url.pathname.match(/^\/lexicons\/(.+)$/);
    if (lexiconMatch?.[1]) {
      return serveLexicon(lexiconMatch[1]);
    }

    if (url.pathname === '/xrpc/app.holdfast.market.searchListings' && request.method === 'GET') {
      return searchListings(url, env);
    }

    return json({ error: 'NotFound', message: `No route for ${request.method} ${url.pathname}` }, 404);
  },
};

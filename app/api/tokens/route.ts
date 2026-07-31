const tokenIds = [
  "ethereum",
  "solana",
  "binancecoin",
  "chainlink",
  "avalanche-2",
  "polygon-ecosystem-token",
];

type CoinGeckoMarket = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number | null;
  sparkline_in_7d?: { price?: number[] };
  last_updated: string;
  market_cap_rank: number | null;
};

type CoinGeckoSearchCoin = {
  id: string;
};

const marketPageSize = 50;
const searchPageSize = 20;

function mapMarket(market: CoinGeckoMarket) {
  return {
    id: market.id,
    name: market.name,
    symbol: market.symbol.toUpperCase(),
    image: market.image,
    price: market.current_price,
    marketCap: market.market_cap,
    change24h: market.price_change_percentage_24h ?? 0,
    sparkline: market.sparkline_in_7d?.price ?? [],
    lastUpdated: market.last_updated,
    rank: market.market_cap_rank,
  };
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const allTokens = requestUrl.searchParams.get("mode") === "all";
  const page = Math.max(1, Math.min(200, Number(requestUrl.searchParams.get("page")) || 1));
  const search = requestUrl.searchParams.get("search")?.trim().slice(0, 100) ?? "";
  const apiKey = process.env.COINGECKO_API_KEY;
  const headers = apiKey ? { "x-cg-demo-api-key": apiKey } : undefined;

  try {
    if (allTokens && search) {
      const searchResponse = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(search)}`,
        { headers, next: { revalidate: 60 } },
      );
      if (!searchResponse.ok) throw new Error(`CoinGecko returned ${searchResponse.status}`);

      const searchData = (await searchResponse.json()) as { coins?: CoinGeckoSearchCoin[] };
      const matches = searchData.coins ?? [];
      const start = (page - 1) * searchPageSize;
      const pageMatches = matches.slice(start, start + searchPageSize);

      if (pageMatches.length === 0) {
        return Response.json({ tokens: [], page, hasMore: false, total: matches.length });
      }

      const marketQuery = new URLSearchParams({
        vs_currency: "usd",
        ids: pageMatches.map((coin) => coin.id).join(","),
        sparkline: "true",
        price_change_percentage: "24h",
        precision: "full",
      });
      const marketResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?${marketQuery}`,
        { headers, next: { revalidate: 60 } },
      );
      if (!marketResponse.ok) throw new Error(`CoinGecko returned ${marketResponse.status}`);

      const markets = (await marketResponse.json()) as CoinGeckoMarket[];
      const marketsById = new Map(markets.map((market) => [market.id, market]));
      const tokens = pageMatches
        .map((coin) => marketsById.get(coin.id))
        .filter((market): market is CoinGeckoMarket => Boolean(market))
        .map(mapMarket);

      return Response.json(
        { tokens, page, hasMore: start + searchPageSize < matches.length, total: matches.length },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
      );
    }

    const query = new URLSearchParams({
      vs_currency: "usd",
      order: "market_cap_desc",
      sparkline: "true",
      price_change_percentage: "24h",
      precision: "full",
      per_page: allTokens ? String(marketPageSize) : String(tokenIds.length),
      page: allTokens ? String(page) : "1",
    });
    if (!allTokens) query.set("ids", tokenIds.join(","));
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${query}`, {
      headers,
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error(`CoinGecko returned ${response.status}`);

    const markets = (await response.json()) as CoinGeckoMarket[];
    const tokens = markets.map(mapMarket);

    return Response.json(
      { tokens, page, hasMore: allTokens && tokens.length === marketPageSize },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch {
    return Response.json(
      { error: "Live market data is temporarily unavailable." },
      { status: 503 },
    );
  }
}

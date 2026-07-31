type CoinDetails = {
  id: string;
  symbol: string;
  name: string;
  description?: { en?: string };
  image?: { large?: string };
  market_cap_rank?: number;
  categories?: string[];
  links?: { homepage?: string[]; blockchain_site?: string[] };
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    high_24h?: { usd?: number };
    low_24h?: { usd?: number };
    circulating_supply?: number;
    total_supply?: number;
    ath?: { usd?: number };
    ath_change_percentage?: { usd?: number };
    price_change_percentage_24h?: number;
    sparkline_7d?: { price?: number[] };
  };
  last_updated?: string;
};

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9-]{1,100}$/.test(id))
    return Response.json({ error: "Invalid token ID." }, { status: 400 });

  const query = new URLSearchParams({
    localization: "false",
    tickers: "false",
    market_data: "true",
    community_data: "false",
    developer_data: "false",
    sparkline: "true",
  });
  const apiKey = process.env.COINGECKO_API_KEY;
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}?${query}`,
      {
        headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
        next: { revalidate: 300 },
      },
    );
    if (!response.ok)
      return Response.json(
        { error: response.status === 404 ? "Token not found." : "Token data is unavailable." },
        { status: response.status === 404 ? 404 : 503 },
      );
    const coin = (await response.json()) as CoinDetails;
    const market = coin.market_data;
    const description = (coin.description?.en ?? "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return Response.json(
      {
        token: {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          image: coin.image?.large,
          rank: coin.market_cap_rank,
          categories: coin.categories?.filter(Boolean).slice(0, 5) ?? [],
          description,
          homepage: coin.links?.homepage?.find(Boolean),
          explorer: coin.links?.blockchain_site?.find(Boolean),
          price: market?.current_price?.usd ?? 0,
          marketCap: market?.market_cap?.usd ?? 0,
          volume24h: market?.total_volume?.usd ?? 0,
          high24h: market?.high_24h?.usd ?? 0,
          low24h: market?.low_24h?.usd ?? 0,
          circulatingSupply: market?.circulating_supply ?? 0,
          totalSupply: market?.total_supply ?? 0,
          ath: market?.ath?.usd ?? 0,
          athChange: market?.ath_change_percentage?.usd ?? 0,
          change24h: market?.price_change_percentage_24h ?? 0,
          sparkline: market?.sparkline_7d?.price ?? [],
          lastUpdated: coin.last_updated,
        },
      },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch {
    return Response.json({ error: "Token data is temporarily unavailable." }, { status: 503 });
  }
}

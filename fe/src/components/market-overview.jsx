import { ArrowDown, ArrowUp, DollarSign, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CryptoChart } from "@/components/crypto-chart"

export function MarketOverview({ isLoading, marketData }) {
  // Calculate total market cap
  const totalMarketCap = marketData.reduce((acc, coin) => acc + (coin.market_cap || 0), 0)

  // Calculate 24h volume
  const total24hVolume = marketData.reduce((acc, coin) => acc + (coin.total_volume || 0), 0)

  // Calculate market cap change percentage (weighted average)
  const marketCapChangePercentage =
    marketData.length > 0
      ? marketData.reduce(
          (acc, coin) => acc + (coin.market_cap_change_percentage_24h || 0) * (coin.market_cap || 0),
          0,
        ) / totalMarketCap
      : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-[70%] animate-pulse rounded bg-muted"></div>
              <div className="h-3 w-[40%] animate-pulse rounded bg-muted"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">${(totalMarketCap / 1_000_000_000).toFixed(2)}B</div>
              <p
                className={`text-xs ${marketCapChangePercentage >= 0 ? "text-green-500" : "text-red-500"} flex items-center`}
              >
                {marketCapChangePercentage >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(marketCapChangePercentage).toFixed(2)}% from yesterday
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Trading Volume</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-[70%] animate-pulse rounded bg-muted"></div>
              <div className="h-3 w-[40%] animate-pulse rounded bg-muted"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">${(total24hVolume / 1_000_000_000).toFixed(2)}B</div>
              <p className="text-xs text-muted-foreground">Across all cryptocurrencies</p>
            </>
          )}
        </CardContent>
      </Card>
      {marketData.slice(0, 2).map((coin, index) => (
        <Card key={coin?.id || index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{coin?.name || `Cryptocurrency ${index + 1}`}</CardTitle>
            <div className="h-4 w-4 overflow-hidden rounded-full">
              {coin?.image && (
                <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="h-full w-full object-cover" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-[70%] animate-pulse rounded bg-muted"></div>
                <div className="h-3 w-[40%] animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">${coin?.current_price?.toLocaleString() || "0.00"}</div>
                <div className="flex items-center">
                  <p
                    className={`text-xs ${(coin?.price_change_percentage_24h || 0) >= 0 ? "text-green-500" : "text-red-500"} flex items-center`}
                  >
                    {(coin?.price_change_percentage_24h || 0) >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(coin?.price_change_percentage_24h || 0).toFixed(2)}%
                  </p>
                  <div className="ml-auto h-8 w-20">
                    {coin?.sparkline_in_7d?.price && (
                      <CryptoChart
                        data={coin.sparkline_in_7d.price}
                        color={(coin.price_change_percentage_7d_in_currency || 0) >= 0 ? "#10b981" : "#ef4444"}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

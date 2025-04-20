import { ArrowDown, ArrowUp, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CryptoChart } from "@/components/crypto-chart"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function MarketOverview({ isLoading, marketData, error }) {
  const [totalMarketCap, setTotalMarketCap] = useState(0)
  const [total24hVolume, setTotal24hVolume] = useState(0)
  const [marketCapChangePercentage, setMarketCapChangePercentage] = useState(0)

  useEffect(() => {
    if (!isLoading && marketData && marketData.length > 0) {
      // Calculate total market cap
      const marketCap = marketData.reduce((acc, coin) => acc + (coin.market_cap || 0), 0)
      setTotalMarketCap(marketCap)

      // Calculate 24h volume
      const volume = marketData.reduce((acc, coin) => acc + (coin.total_volume || 0), 0)
      setTotal24hVolume(volume)

      // Calculate market cap change percentage (weighted average)
      const capChange = marketData.reduce(
        (acc, coin) => acc + (coin.market_cap_change_percentage_24h || 0) * (coin.market_cap || 0),
        0
      ) / marketCap
      
      setMarketCapChangePercentage(capChange)
    }
  }, [isLoading, marketData])

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading market data: {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
  }

  const formatNumber = (num) => {
    if (num >= 1_000_000_000_000) {
      return `$${(num / 1_000_000_000_000).toFixed(2)}T`
    } else if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`
    } else {
      return `$${num.toLocaleString()}`
    }
  }

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
              <div className="text-2xl font-bold">{formatNumber(totalMarketCap)}</div>
              <p
                className={`text-xs ${marketCapChangePercentage >= 0 ? "text-green-500" : "text-red-500"} flex items-center`}
              >
                {marketCapChangePercentage >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {!isNaN(marketCapChangePercentage) ? Math.abs(marketCapChangePercentage).toFixed(2) : "0.00"}% from yesterday
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
              <div className="text-2xl font-bold">{formatNumber(total24hVolume)}</div>
              <p className="text-xs text-muted-foreground">Across all cryptocurrencies</p>
            </>
          )}
        </CardContent>
      </Card>
      {marketData && marketData.slice(0, 2).map((coin, index) => (
        <Card key={coin?.id || `coin-${index}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{coin?.name || `Cryptocurrency ${index + 1}`}</CardTitle>
            <div className="h-4 w-4 overflow-hidden rounded-full">
              {coin?.image && (
                <img 
                  src={coin.image} 
                  alt={coin.name} 
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.svg";
                  }}
                />
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
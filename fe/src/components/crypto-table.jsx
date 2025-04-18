import { ArrowDown, ArrowUp } from "lucide-react"

import { CryptoChart } from "./crypto-chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"


export function CryptoTable({ isLoading, data }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right">7d %</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume (24h)</TableHead>
            <TableHead className="text-right w-[100px]">Last 7 Days</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
                        <div className="space-y-1">
                          <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                          <div className="h-3 w-12 animate-pulse rounded bg-muted"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 w-20 animate-pulse rounded bg-muted ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 w-16 animate-pulse rounded bg-muted ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 w-16 animate-pulse rounded bg-muted ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-[80px] animate-pulse rounded bg-muted ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
            : data.map((coin, index) => (
                <TableRow key={coin.id}>
                  <TableCell>{coin.market_cap_rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 overflow-hidden rounded-full">
                        <img
                          src={coin.image || "/placeholder.svg"}
                          alt={coin.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">${coin.current_price.toLocaleString()}</TableCell>
                  <TableCell
                    className={`text-right ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {coin.price_change_percentage_24h >= 0 ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right ${(coin.price_change_percentage_7d_in_currency || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {(coin.price_change_percentage_7d_in_currency || 0) >= 0 ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {Math.abs(coin.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${(coin.market_cap / 1_000_000).toFixed(2)}M</TableCell>
                  <TableCell className="text-right">${(coin.total_volume / 1_000_000).toFixed(2)}M</TableCell>
                  <TableCell>
                    <div className="h-8 w-[80px] ml-auto">
                      {coin.sparkline_in_7d?.price && (
                        <CryptoChart
                          data={coin.sparkline_in_7d.price}
                          color={(coin.price_change_percentage_7d_in_currency || 0) >= 0 ? "#10b981" : "#ef4444"}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}

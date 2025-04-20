"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Lock, LockOpen, MoreHorizontal, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreatePortfolioDialog } from "@/components/create-portfolio-dialog"
import { toast } from "sonner"

// Mock data for portfolios
const mockPortfolios = [
  {
    id: "1",
    name: "Main Portfolio",
    isLocked: true,
    totalValue: 12567.89,
    change24h: 3.45,
    coins: [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", amount: 0.5, value: 8765.43, change24h: 2.1 },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", amount: 4.2, value: 3456.78, change24h: 5.6 },
      { id: "cardano", name: "Cardano", symbol: "ADA", amount: 1000, value: 345.68, change24h: -1.2 },
    ],
  },
  {
    id: "2",
    name: "Experimental Portfolio",
    isLocked: false,
    totalValue: 5432.1,
    change24h: -2.34,
    coins: [
      { id: "solana", name: "Solana", symbol: "SOL", amount: 25, value: 2345.67, change24h: -4.3 },
      { id: "polkadot", name: "Polkadot", symbol: "DOT", amount: 100, value: 1234.56, change24h: 1.2 },
      { id: "avalanche", name: "Avalanche", symbol: "AVAX", amount: 30, value: 1851.87, change24h: -1.8 },
    ],
  },
  {
    id: "3",
    name: "Long-term Holds",
    isLocked: true,
    totalValue: 8765.43,
    change24h: 1.23,
    coins: [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", amount: 0.3, value: 5259.26, change24h: 2.1 },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", amount: 2.5, value: 2057.85, change24h: 5.6 },
      { id: "chainlink", name: "Chainlink", symbol: "LINK", amount: 150, value: 1448.32, change24h: -3.4 },
    ],
  },
]

export function PortfolioList() {
  const [portfolios, setPortfolios] = useState(mockPortfolios)
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false)

  const handleLockPortfolio = (id) => {
    setPortfolios(
      portfolios.map((portfolio) =>
        portfolio.id === id ? { ...portfolio, isLocked: !portfolio.isLocked } : portfolio,
      ),
    )

    const portfolio = portfolios.find((p) => p.id === id)

    toast.success(`${portfolio?.isLocked ? "Portfolio unlocked" : "Portfolio locked"}`,{
      description: `${portfolio?.name} has been ${portfolio?.isLocked ? "unlocked" : "locked"}.`,
    })
   
  }

  const handleDeletePortfolio = (id) => {
    const portfolio = portfolios.find((p) => p.id === id)

    setPortfolios(portfolios.filter((portfolio) => portfolio.id !== id))

    toast.success("Portfolio deleted",{
      description: `${portfolio?.name} has been deleted.`,
    })
   
  }

  const addPortfolio = (portfolio) => {
    setPortfolios([...portfolios, portfolio])
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">My Portfolios</h3>
        <Button size="sm" className="h-8 gap-1" onClick={() => setShowCreatePortfolio(true)}>
          <Plus className="h-3.5 w-3.5" />
          <span>New Portfolio</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Portfolios</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
          <TabsTrigger value="temp">Temporary</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.name}
                portfolio={portfolio}
                onLock={handleLockPortfolio}
                onDelete={handleDeletePortfolio}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios
              .filter((portfolio) => portfolio.isLocked)
              .map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onLock={handleLockPortfolio}
                  onDelete={handleDeletePortfolio}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="temp" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios
              .filter((portfolio) => !portfolio.isLocked)
              .map((portfolio) => (
                <PortfolioCard
                  key={portfolio.name}
                  portfolio={portfolio}
                  onLock={handleLockPortfolio}
                  onDelete={handleDeletePortfolio}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreatePortfolioDialog
        open={showCreatePortfolio}
        onOpenChange={setShowCreatePortfolio}
        onPortfolioCreated={addPortfolio}
      />
    </>
  )
}

function PortfolioCard({ portfolio, onLock, onDelete }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{portfolio.name}</CardTitle>
            {portfolio.isLocked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <LockOpen className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLock(portfolio.id)}>
                {portfolio.isLocked ? (
                  <>
                    <LockOpen className="mr-2 h-4 w-4" />
                    <span>Unlock Portfolio</span>
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Lock Portfolio</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(portfolio.id)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete Portfolio</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{portfolio.isLocked ? "Locked portfolio" : "Temporary portfolio"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</div>
          <div className={`flex items-center ${portfolio.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
            {portfolio.change24h >= 0 ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
            {Math.abs(portfolio.change24h).toFixed(2)}%
          </div>
        </div>
        <div className="space-y-2">
          {portfolio.coins.map((coin) => (
            <div key={coin.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-medium">{coin.symbol}</div>
                <div className="text-xs text-muted-foreground">{coin.amount}</div>
              </div>
              <div className="flex items-center gap-2">
                <div>${coin.value.toLocaleString()}</div>
                <div className={`text-xs ${coin.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.change24h >= 0 ? "+" : ""}
                  {coin.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

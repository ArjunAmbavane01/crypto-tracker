"use client"

import { useState } from "react"
import { Lock, Plus, Search, X } from "lucide-react"

import { Button } from "./ui/button"    
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { toast } from "sonner"


// Mock data for available cryptocurrencies
const availableCoins = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 35000,
    image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 2000,
    image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.35,
    image: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 100,
    image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    price: 5,
    image: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    price: 20,
    image: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  },
]

export function CreatePortfolioDialog({ open, onOpenChange, onPortfolioCreated }) {
  const [portfolioName, setPortfolioName] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCoins, setSelectedCoins] = useState([])
  const [coinAmounts, setCoinAmounts] = useState({})

  const filteredCoins = availableCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectCoin = (coin) => {
    if (!selectedCoins.some((c) => c.id === coin.id)) {
      setSelectedCoins([...selectedCoins, coin])
      setCoinAmounts({ ...coinAmounts, [coin.id]: 0 })
    }
  }

  const handleRemoveCoin = (coinId) => {
    setSelectedCoins(selectedCoins.filter((coin) => coin.id !== coinId))
    const newAmounts = { ...coinAmounts }
    delete newAmounts[coinId]
    setCoinAmounts(newAmounts)
  }

  const handleAmountChange = (coinId, amount) => {
    const numAmount = Number.parseFloat(amount) || 0
    setCoinAmounts({ ...coinAmounts, [coinId]: numAmount })
  }

  const calculateTotalValue = () => {
    return selectedCoins.reduce((total, coin) => {
      const amount = coinAmounts[coin.id] || 0
      return total + amount * coin.price
    }, 0)
  }

  const handleCreatePortfolio = () => {
    if (!portfolioName.trim()) {
      toast.error("Portfolio name required",{
        description: "Please enter a name for your portfolio.",
      })
      return
    }

    if (selectedCoins.length === 0) {
      toast.error("No coins selected",{
        description: "Please add at least one coin to your portfolio.",
      })
      return
    }

    const newPortfolio = {
      id: Date.now().toString(),
      name: portfolioName,
      isLocked,
      totalValue: calculateTotalValue(),
      change24h: Math.random() * 10 - 5, // Random change for demo
      coins: selectedCoins.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        amount: coinAmounts[coin.id] || 0,
        value: (coinAmounts[coin.id] || 0) * coin.price,
        change24h: Math.random() * 10 - 5, // Random change for demo
      })),
    }

    if (onPortfolioCreated) {
      onPortfolioCreated(newPortfolio)
    }

    toast.success("Portfolio created",{
      description: `${portfolioName} has been created successfully.`,
    })

    // Reset form
    setPortfolioName("")
    setIsLocked(false)
    setSearchTerm("")
    setSelectedCoins([])
    setCoinAmounts({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Portfolio</DialogTitle>
          <DialogDescription>Create a new portfolio to track your cryptocurrency investments.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Portfolio Name</Label>
            <Input
              id="name"
              placeholder="My Portfolio"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="locked" checked={isLocked} onCheckedChange={setIsLocked} />
            <Label htmlFor="locked" className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              Lock Portfolio
            </Label>
          </div>
          <div className="grid gap-2">
            <Label>Add Cryptocurrencies</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coins..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="max-h-[150px] overflow-y-auto rounded-md border p-2">
                {filteredCoins.length > 0 ? (
                  filteredCoins.map((coin) => (
                    <div
                      key={coin.id}
                      className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted"
                      onClick={() => handleSelectCoin(coin)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 overflow-hidden rounded-full">
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
                      <div className="text-sm">${coin.price.toLocaleString()}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">No coins found</div>
                )}
              </div>
            )}
          </div>
          {selectedCoins.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Coins</Label>
              <div className="rounded-md border p-2">
                {selectedCoins.map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between gap-2 p-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 overflow-hidden rounded-full">
                        <img
                          src={coin.image || "/placeholder.svg"}
                          alt={coin.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="font-medium">{coin.symbol.toUpperCase()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        className="w-24"
                        value={coinAmounts[coin.id] || ""}
                        onChange={(e) => handleAmountChange(coin.id, e.target.value)}
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCoin(coin.id)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t pt-2">
                  <div className="font-medium">Total Value:</div>
                  <div className="font-bold">${calculateTotalValue().toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePortfolio}>
            <Plus className="mr-2 h-4 w-4" />
            Create Portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

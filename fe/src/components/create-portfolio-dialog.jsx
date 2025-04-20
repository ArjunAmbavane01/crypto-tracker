"use client";

import { useState, useEffect } from "react";
import { Loader2, Lock, Plus, Search, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

export function CreatePortfolioDialog({
  open,
  onOpenChange,
  onPortfolioCreated,
}) {
  const [portfolioName, setPortfolioName] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [coinAmounts, setCoinAmounts] = useState({});
  const [availableCoins, setAvailableCoins] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchCoins = async () => {
      if (open) {
        try {
          const res = await fetch("http://localhost:8080/api/market/coins");
          const data = await res.json();
          setAvailableCoins(data);
        } catch (error) {
          toast.error("Failed to fetch coins", {
            description: "Try refreshing the page.",
          });
        }
      }
      console.log(availableCoins);
    };
    fetchCoins();
  }, [open]);

  const filteredCoins = availableCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCoin = (coin) => {
    if (!selectedCoins.some((c) => c.id === coin.id)) {
      setSelectedCoins([...selectedCoins, coin]);
      setCoinAmounts({ ...coinAmounts, [coin.id]: 0 });
    }
  };

  const handleRemoveCoin = (coinId) => {
    setSelectedCoins(selectedCoins.filter((coin) => coin.id !== coinId));
    const newAmounts = { ...coinAmounts };
    delete newAmounts[coinId];
    setCoinAmounts(newAmounts);
  };

  const handleAmountChange = (coinId, amount) => {
    const numAmount = Number.parseFloat(amount) || 0;
    setCoinAmounts({ ...coinAmounts, [coinId]: numAmount });
  };

  const calculateTotalValue = () => {
    return selectedCoins.reduce((total, coin) => {
      const amount = coinAmounts[coin.id] || 0;
      return total + amount * coin.price;
    }, 0);
  };

  const handleCreatePortfolio = async () => {
    console.log(portfolioName);
    console.log(selectedCoins);
    if (!portfolioName.trim()) {
      toast.error("Portfolio name required", {
        description: "Please enter a name for your portfolio.",
      });
      return;
    }

    if (selectedCoins.length === 0) {
      toast.error("No coins selected", {
        description: "Please add at least one coin to your portfolio.",
      });
      return;
    }
    setIsCreating(true);
    const clerkId = user?.id;
    const newPortfolio = {
      userId: clerkId,
      name: portfolioName,
      isLocked,
      totalValue: calculateTotalValue(),
      change24h: Math.random() * 10 - 5,
      coins: selectedCoins.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        amount: coinAmounts[coin.id] || 0,
        value: (coinAmounts[coin.id] || 0) * coin.price,
        change24h: Math.random() * 10 - 5,
      })),
    };

    try {
      const res = await fetch("http://localhost:8080/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPortfolio),
      });
      if (!res.ok) throw new Error("Failed to create portfolio");
      console.log("here");

      const created = await res.text();
      console.log("here2");
      if (onPortfolioCreated) onPortfolioCreated({...newPortfolio,id:newPortfolio.userId+newPortfolio.name});
      console.log("here3");

      toast.success("Portfolio created", {
        description: `${portfolioName} has been created successfully.`,
      });

      // Reset form
      setPortfolioName("");
      setIsLocked(false);
      setSearchTerm("");
      setSelectedCoins([]);
      setCoinAmounts({});
      onOpenChange(false);
    } catch (error) {
      toast.error("Creation failed", {
        description: "Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Portfolio</DialogTitle>
          <DialogDescription>
            Create a new portfolio to track your cryptocurrency investments.
          </DialogDescription>
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
            <Switch
              id="locked"
              checked={isLocked}
              onCheckedChange={setIsLocked}
            />
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
                          <div className="text-xs text-muted-foreground">
                            {coin.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        ${coin.price.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No coins found
                  </div>
                )}
              </div>
            )}
          </div>
          {selectedCoins.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Coins</Label>
              <div className="rounded-md border p-2">
                {selectedCoins.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between gap-2 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 overflow-hidden rounded-full">
                        <img
                          src={coin.image || "/placeholder.svg"}
                          alt={coin.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="font-medium">
                        {coin.symbol.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        className="w-24"
                        value={coinAmounts[coin.id] || ""}
                        onChange={(e) =>
                          handleAmountChange(coin.id, e.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveCoin(coin.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t pt-2">
                  <div className="font-medium">Total Value:</div>
                  <div className="font-bold">
                    ${calculateTotalValue().toLocaleString()}
                  </div>
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
            {isCreating ? (
              <>
                <Loader2 className="animate-spin size-4 mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Portfolio
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

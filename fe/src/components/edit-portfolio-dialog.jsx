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
import { toast } from "sonner";

export function EditPortfolioDialog({
  open,
  onOpenChange,
  onPortfolioUpdated,
  portfolio,
}) {
  const [portfolioName, setPortfolioName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [coinAmounts, setCoinAmounts] = useState({});
  const [availableCoins, setAvailableCoins] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    portfolioName: "",
    selectedCoins: "",
    coinAmounts: {},
  });

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (open && portfolio) {
      setPortfolioName(portfolio.name || "");
      
      // Initialize selected coins from portfolio with price data
      const coins = portfolio.coins || [];
      const coinsWithPrice = coins.map(coin => ({
        ...coin,
        price: coin.value / (coin.amount || 1) // Calculate price if not available
      }));
      setSelectedCoins(coinsWithPrice);
      
      // Initialize coin amounts
      const amounts = {};
      coins.forEach(coin => {
        amounts[coin.id] = coin.amount;
      });
      setCoinAmounts(amounts);
      
      // Reset form errors
      setFormErrors({
        portfolioName: "",
        selectedCoins: "",
        coinAmounts: {},
      });
      setError(null);
    }
  }, [open, portfolio]);

  useEffect(() => {
    const fetchCoins = async () => {
      if (open) {
        setIsLoading(true);
        try {
          const res = await fetch("http://localhost:8080/api/market/coins");
          const data = await res.json();
          setAvailableCoins(data);
        } catch (error) {
          toast.error("Failed to fetch coins", {
            description: "Try refreshing the page.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchCoins();
  }, [open]);

  useEffect(() => {
    if (!open) {
      // Reset form state when dialog closes
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setPortfolioName("");
    setSearchTerm("");
    setSelectedCoins([]);
    setCoinAmounts({});
    setFormErrors({
      portfolioName: "",
      selectedCoins: "",
      coinAmounts: {},
    });
    setError(null);
  };

  const filteredCoins = availableCoins.filter(
    (coin) =>
      !selectedCoins.some(selected => selected.id === coin.id) &&
      (coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectCoin = (coin) => {
    if (!selectedCoins.some((c) => c.id === coin.id)) {
      setSelectedCoins([...selectedCoins, coin]);
      setCoinAmounts({ ...coinAmounts, [coin.id]: 0 });

      // Clear any error for selected coins
      setFormErrors((prev) => ({
        ...prev,
        selectedCoins: "",
      }));
    }
  };

  const handleRemoveCoin = (coinId) => {
    setSelectedCoins(selectedCoins.filter((coin) => coin.id !== coinId));
    const newAmounts = { ...coinAmounts };
    delete newAmounts[coinId];
    setCoinAmounts(newAmounts);

    // Clear any error for this specific coin
    const newCoinAmountErrors = { ...formErrors.coinAmounts };
    delete newCoinAmountErrors[coinId];
    setFormErrors((prev) => ({
      ...prev,
      coinAmounts: newCoinAmountErrors,
    }));

    // If no coins are left, show an error
    if (selectedCoins.length <= 1) {
      setFormErrors((prev) => ({
        ...prev,
        selectedCoins: "Please add at least one coin to your portfolio.",
      }));
    }
  };

  const handleAmountChange = (coinId, amount) => {
    // Validate input is a positive number
    let numAmount = parseFloat(amount);

    // Update coin amount
    setCoinAmounts({ ...coinAmounts, [coinId]: numAmount || 0 });

    // Validate and set error if needed
    const newCoinAmountErrors = { ...formErrors.coinAmounts };
    if (isNaN(numAmount) || numAmount < 0) {
      newCoinAmountErrors[coinId] = "Please enter a valid positive number";
    } else {
      delete newCoinAmountErrors[coinId];
    }

    setFormErrors((prev) => ({
      ...prev,
      coinAmounts: newCoinAmountErrors,
    }));
  };

  const calculateTotalValue = () => {
    return selectedCoins.reduce((total, coin) => {
      const amount = parseFloat(coinAmounts[coin.id]) || 0;
      return total + amount * (coin.price || 0);
    }, 0);
  };

  const validateForm = () => {
    const errors = {
      portfolioName: "",
      selectedCoins: "",
      coinAmounts: {},
    };
    let isValid = true;

    // Validate portfolio name
    if (!portfolioName.trim()) {
      errors.portfolioName = "Portfolio name is required";
      isValid = false;
    }

    // Validate coins selection
    if (selectedCoins.length === 0) {
      errors.selectedCoins = "Please add at least one coin to your portfolio";
      isValid = false;
    }

    // Validate coin amounts
    let hasValidAmount = false;
    selectedCoins.forEach((coin) => {
      const amount = parseFloat(coinAmounts[coin.id]);
      if (isNaN(amount) || amount <= 0) {
        errors.coinAmounts[coin.id] = "Please enter a valid amount";
        isValid = false;
      } else {
        hasValidAmount = true;
      }
    });

    if (selectedCoins.length > 0 && !hasValidAmount) {
      errors.selectedCoins = "At least one coin must have a valid amount";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleUpdatePortfolio = async () => {
    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);

    try {
      if (!isLoaded || !user) {
        throw new Error("User authentication required");
      }

      const clerkId = user.id;
      const totalValue = calculateTotalValue();

      const updatedPortfolio = {
        userId: clerkId,
        id: portfolio.id,
        originalName: portfolio.name, // Used to identify the portfolio to update
        name: portfolioName,
        totalValue,
        change24h: 0, // We'll calculate this properly
        coins: selectedCoins.map((coin) => {
          const amount = parseFloat(coinAmounts[coin.id]) || 0;
          return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            amount,
            value: amount * (coin.price || 0),
            price: coin.price || 0,
            change24h: coin.price_change_percentage_24h || 0,
          };
        }),
      };

      // Calculate portfolio 24h change as weighted average of coins
      if (updatedPortfolio.totalValue > 0) {
        updatedPortfolio.change24h =
          updatedPortfolio.coins.reduce(
            (acc, coin) => acc + coin.change24h * coin.value,
            0
          ) / updatedPortfolio.totalValue;
      }

      console.log(updatedPortfolio)
      const res = await fetch("http://localhost:8080/api/portfolios/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPortfolio),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update portfolio (${res.status})`
        );
      }

      if (onPortfolioUpdated) {
        onPortfolioUpdated(updatedPortfolio);
      }

      toast.success("Portfolio updated", {
        description: `${portfolioName} has been updated successfully.`,
      });

      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update portfolio:", error);
      toast.error("Update failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Portfolio</DialogTitle>
          <DialogDescription>
            Update your portfolio details and coin allocations.
          </DialogDescription>
        </DialogHeader>

        {/* Show error if any */}
        {error && (
          <div className="rounded-md bg-red-50 p-3 mb-4">
            <div className="flex">
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex justify-between">
              Portfolio Name
              {formErrors.portfolioName && (
                <span className="text-red-500 text-xs">
                  {formErrors.portfolioName}
                </span>
              )}
            </Label>
            <Input
              id="name"
              placeholder="My Portfolio"
              value={portfolioName}
              onChange={(e) => {
                setPortfolioName(e.target.value);
                if (e.target.value.trim()) {
                  setFormErrors((prev) => ({ ...prev, portfolioName: "" }));
                }
              }}
              className={formErrors.portfolioName ? "border-red-500" : ""}
            />
          </div>

          <div className="grid gap-2">
            <Label className="flex justify-between">
              Add Cryptocurrencies
              {formErrors.selectedCoins && (
                <span className="text-red-500 text-xs">
                  {formErrors.selectedCoins}
                </span>
              )}
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coins..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
              </div>
            ) : searchTerm ? (
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
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.svg";
                            }}
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
                        ${(coin.price || 0).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No coins found
                  </div>
                )}
              </div>
            ) : null}
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
                        {/* <img
                          src={coin.image || "/placeholder.svg"}
                          alt={coin.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.svg";
                          }}
                        /> */}
                      </div>
                      <div className="font-medium">
                        {coin.symbol.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <Input
                          type="number"
                          placeholder="Amount"
                          className={`w-24 ${
                            formErrors.coinAmounts[coin.id]
                              ? "border-red-500"
                              : ""
                          }`}
                          value={coinAmounts[coin.id] || ""}
                          onChange={(e) =>
                            handleAmountChange(coin.id, e.target.value)
                          }
                          min="0"
                          step="any"
                        />
                        {formErrors.coinAmounts[coin.id] && (
                          <span className="text-red-500 text-xs mt-1">
                            {formErrors.coinAmounts[coin.id]}
                          </span>
                        )}
                      </div>
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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdatePortfolio} disabled={isUpdating} className="bg-blue-500 text-white">
            {isUpdating ? (
              <>
                <Loader2 className="animate-spin size-4 mr-2" />
                Updating...
              </>
            ) : (
              "Update Portfolio"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
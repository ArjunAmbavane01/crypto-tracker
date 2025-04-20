"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Edit, Lock, LockOpen, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePortfolioDialog } from "@/components/create-portfolio-dialog";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EditPortfolioDialog } from "@/components/edit-portfolio-dialog";
import { useUser } from "@clerk/clerk-react";

export function PortfolioList() {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [showEditPortfolio, setShowEditPortfolio] = useState(false);
  const { user } = useUser();

  // Fetch portfolios on component mount
  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/portfolios/user/${user.id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolios: ${response.status}`);
      }

      const data = await response.json();

      // Transform the data to match our component's expected format
      const transformedPortfolios = data.map((portfolio) => ({
        id: portfolio.id,
        name: portfolio.name || "Unnamed Portfolio",
        isLocked: portfolio.locked || false,
        totalValue: portfolio.totalValue || 0,
        change24h: Math.random() * 10 - 5,
        coins: (portfolio.portfolioCoins || []).map((coin) => ({
          id: coin.coinId || coin.symbol,
          name: coin.name,
          symbol: coin.symbol,
          amount: coin.amount,
          value: coin.value,
          change24h: Math.random() * 10 - 5,
        })),
      }));

      setPortfolios(transformedPortfolios);
    } catch (err) {
      console.error("Error fetching portfolios:", err);
      setError(err.message);
      toast.error("Failed to load portfolios", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockPortfolio = async (id) => {
    try {
      const portfolio = portfolios.find((p) => p.id === id);
      const newLockedStatus = !portfolio.isLocked;

      setPortfolios(
        portfolios.map((portfolio) =>
          portfolio.id === id
            ? { ...portfolio, isLocked: newLockedStatus }
            : portfolio
        )
      );

      // // API call to update lock status
      // const response = await fetch(`/api/portfolios/${id}/lock`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ locked: newLockedStatus }),
      // })

      // if (!response.ok) {
      //   throw new Error(`Failed to update portfolio: ${response.status}`)
      // }

      toast.success(`Portfolio ${newLockedStatus ? "locked" : "unlocked"}`, {
        description: `${portfolio?.name} has been ${
          newLockedStatus ? "locked" : "unlocked"
        }.`,
      });
    } catch (err) {
      console.error("Error updating portfolio:", err);
      // Revert the optimistic update
      fetchPortfolios();
      toast.error("Failed to update portfolio", {
        description: err.message,
      });
    }
  };

  const handleDeletePortfolio = async (id) => {
    try {
      const portfolio = portfolios.find((p) => p.id === id);
      // Optimistic UI update
      setPortfolios(portfolios.filter((p) => p.id !== id));

      const response = await fetch(
        `http://localhost:8080/api/portfolios/delete?clerkId=${user.id}&portfolioName=${portfolio.name}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete portfolio: ${response.status}`);
      }

      toast.success("Portfolio deleted", {
        description: `${portfolio?.name} has been deleted.`,
      });
    } catch (err) {
      console.error("Error deleting portfolio:", err);
      // Revert the optimistic update
      fetchPortfolios();
      toast.error("Failed to delete portfolio", {
        description: err.message,
      });
    }
  };

  const addPortfolio = (portfolio) => {
    setPortfolios([...portfolios, portfolio]);
  };

  const handleUpdatePortfolio = (updatedPortfolio) => {
    setPortfolios(
      portfolios.map((p) =>
        p.id === updatedPortfolio.id ? updatedPortfolio : p
      )
    );
  };

  // Render loading state
  if (isLoading && portfolios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">Loading your portfolios...</p>
      </div>
    );
  }

  // Render error state
  if (error && portfolios.length === 0) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          {error}. Please try refreshing the page or contact support if the
          problem persists.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">My Portfolios</h3>
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={() => setShowCreatePortfolio(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Portfolio</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="cursor-pointer">All Portfolios</TabsTrigger>
          <TabsTrigger value="locked" className="cursor-pointer">Locked</TabsTrigger>
          <TabsTrigger value="temp" className="cursor-pointer">Temporary</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && portfolios.length > 0 && (
            <div className="flex items-center justify-center p-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Refreshing...</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                You don't have any portfolios yet. Create one to get started.
              </div>
            ) : (
              portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onLock={handleLockPortfolio}
                  onDelete={handleDeletePortfolio}
                  onEdit={(portfolio) => {
                    setEditingPortfolio(portfolio);
                    setShowEditPortfolio(true);
                  }}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.filter((p) => p.isLocked).length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                You don't have any locked portfolios.
              </div>
            ) : (
              portfolios
                .filter((portfolio) => portfolio.isLocked)
                .map((portfolio) => (
                  <PortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    onLock={handleLockPortfolio}
                    onDelete={handleDeletePortfolio}
                  />
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="temp" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.filter((p) => !p.isLocked).length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                You don't have any temporary portfolios.
              </div>
            ) : (
              portfolios
                .filter((portfolio) => !portfolio.isLocked)
                .map((portfolio) => (
                  <PortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    onLock={handleLockPortfolio}
                    onDelete={handleDeletePortfolio}
                  />
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CreatePortfolioDialog
        open={showCreatePortfolio}
        onOpenChange={setShowCreatePortfolio}
        onPortfolioCreated={(newPortfolio) => {
          addPortfolio(newPortfolio);
          toast.success("Portfolio created", {
            description: `${newPortfolio.name} has been created successfully.`,
          });
        }}
      />

      <EditPortfolioDialog
        open={showEditPortfolio}
        onOpenChange={setShowEditPortfolio}
        portfolio={editingPortfolio}
        onPortfolioUpdated={handleUpdatePortfolio}
      />
    </>
  );
}

function PortfolioCard({ portfolio, onLock, onDelete, onEdit }) {
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
            <DropdownMenuContent
              align="end"
              className="bg-white shadow-lg shadow-blue-200"
            >
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
              <DropdownMenuItem
                onClick={() => onDelete(portfolio.id)}
                className="bg-red-500 text-white"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete Portfolio</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          {portfolio.isLocked ? "Locked portfolio" : "Temporary portfolio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">
            ${portfolio.totalValue.toLocaleString()}
          </div>
          <div
            className={`flex items-center ${
              portfolio.change24h >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {portfolio.change24h >= 0 ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4" />
            )}
            {Math.abs(portfolio.change24h).toFixed(2)}%
          </div>
        </div>
        <div className="space-y-2">
          {portfolio.coins.map((coin) => (
            <div key={coin.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-medium">{coin.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {coin.amount}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>${coin.value.toLocaleString()}</div>
                <div
                  className={`text-xs ${
                    coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {coin.change24h >= 0 ? "+" : ""}
                  {coin.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {!portfolio.isLocked && (
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={() => onEdit(portfolio)}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Portfolio</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

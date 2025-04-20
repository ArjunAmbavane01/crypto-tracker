import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronsUpDown,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { MainNav } from "../components/main-nav";
import { MarketOverview } from "../components/market-overview";
import { PortfolioList } from "../components/portfolio-list";
import { CryptoTable } from "../components/crypto-table";
import { UserNav } from "../components/user-nav";
import { CreatePortfolioDialog } from "../components/create-portfolio-dialog";
import { toast } from "sonner";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);  // Initialize as empty array
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const syncUser = async () => {
        try {
          const res = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName,
            }),
          });

          if (!res.ok) {
            console.error("Failed to sync user to backend");
          }
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      };

      syncUser();
    }
  }, [user]);

  useEffect(() => {
    // Get tab from URL if present
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch top cryptocurrencies
      const marketResponse = await fetch(
        "http://localhost:8080/api/market/top-coins"
      );
      
      if (!marketResponse.ok) {
        throw new Error(`HTTP error! Status: ${marketResponse.status}`);
      }
      
      const marketData = await marketResponse.json();
      
      // Verify marketData is an array before setting state
      if (Array.isArray(marketData)) {
        setMarketData(marketData);
        toast.success("Data refreshed", {
          description: "Market data has been updated.",
        });
      } else {
        console.error("Market data is not an array:", marketData);
        toast.error("Invalid market data format received");
        // Maintain current state instead of overwriting with non-array
      }

      // Fetch trending coins
      const trendingResponse = await fetch(
        "http://localhost:8080/api/market/trending"
      );
      
      if (!trendingResponse.ok) {
        throw new Error(`HTTP error! Status: ${trendingResponse.status}`);
      }
      
      const trendingData = await trendingResponse.json();
      
      if (trendingData && trendingData.coins) {
        setTrendingCoins(trendingData.coins.map((coin) => coin.item));
      } else {
        console.error("Invalid trending data format:", trendingData);
        // Keep existing trending coins data
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);

      toast.error("Error fetching data", {
        description: error.message === "Rate limit exceeded" 
          ? "Rate limit exceeded. Please try again later." 
          : "Please try again later or check your connection.",
      });
      
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 120000);

    return () => clearInterval(intervalId);
  }, []);

  const refreshData = async () => {
    await fetchData();
  };

  const safeSlice = (arr, start, end) => {
    if (!Array.isArray(arr)) return [];
    return arr.slice(start, end);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between px-8 h-16 items-center mx-auto">
          <MainNav />
          <div className="flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1 bg-blue-600 text-white"
              onClick={() => setShowCreatePortfolio(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Portfolio</span>
            </Button>
          </div>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview" className="cursor-pointer">
              Overview
            </TabsTrigger>
            <TabsTrigger value="portfolios" className="cursor-pointer">
              My Portfolios
            </TabsTrigger>
            <TabsTrigger value="market" className="cursor-pointer">
              Market
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <MarketOverview
              isLoading={isLoading}
              marketData={safeSlice(marketData, 0, 4)}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Top Cryptocurrencies</CardTitle>
                  <CardDescription>
                    Market performance of the top cryptocurrencies by market cap
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CryptoTable
                    isLoading={isLoading}
                    data={safeSlice(marketData, 0, 5)}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => handleTabChange("market")}
                  >
                    View All
                  </Button>
                </CardFooter>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Trending Coins</CardTitle>
                  <CardDescription>
                    Most popular coins in the last 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading
                      ? Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="h-9 w-9 animate-pulse rounded-full bg-muted"></div>
                              <div className="space-y-2">
                                <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                                <div className="h-3 w-16 animate-pulse rounded bg-muted"></div>
                              </div>
                              <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted"></div>
                            </div>
                          ))
                      : safeSlice(trendingCoins, 0, 5).map((coin) => (
                          <div
                            key={coin?.id || Math.random().toString()}
                            className="flex items-center gap-4"
                          >
                            <div className="h-9 w-9 overflow-hidden rounded-full">
                              <img
                                src={coin?.thumb || "https://placehold.co/100"}
                                alt={coin?.name || "Coin"}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{coin?.name || "Unknown"}</div>
                              <div className="text-xs text-muted-foreground">
                                {coin?.symbol || "---"}
                              </div>
                            </div>
                            <div className="ml-auto flex items-center gap-1 text-sm">
                              <span>#{coin?.market_cap_rank || "?"}</span>
                              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="portfolios" className="space-y-4">
            <PortfolioList />
          </TabsContent>
          <TabsContent value="market" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cryptocurrency Market</CardTitle>
                <CardDescription>
                  Live prices and stats for the top cryptocurrencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CryptoTable isLoading={isLoading} data={marketData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <CreatePortfolioDialog
        open={showCreatePortfolio}
        onOpenChange={setShowCreatePortfolio}
      />
    </div>
  );
}
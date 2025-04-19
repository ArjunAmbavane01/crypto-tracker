import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronsUpDown,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const [marketData, setMarketData] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Get tab from URL if present
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/dashboard?tab=${value}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch top cryptocurrencies
        const marketResponse = await fetch(
          "http://localhost:8080/api/market/top-coins"
        );
        const marketData = await marketResponse.json();
        setMarketData(marketData);

        // Fetch trending coins
        const trendingResponse = await fetch(
          "https://api.coingecko.com/api/v3/search/trending"
        );
        const trendingData = await trendingResponse.json();
        setTrendingCoins(trendingData.coins.map((coin) => coin.item));
      } catch (error) {
        console.error("Error fetching data:", error);

        toast.error("Error fetching data", {
          description: "Please try again later or check your connection.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Set up a refresh interval (every 2 minutes)
    const intervalId = setInterval(fetchData, 120000);

    return () => clearInterval(intervalId);
  }, [toast]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const marketResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h,7d"
      );
      const marketData = await marketResponse.json();
      setMarketData(marketData);

      toast.success("Data refreshed", {
        description: "Market data has been updated.",
      });
    } catch (error) {
      toast.error("Error refreshing data", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
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
            <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
            <TabsTrigger value="portfolios" className="cursor-pointer">My Portfolios</TabsTrigger>
            <TabsTrigger value="market" className="cursor-pointer">Market</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <MarketOverview
              isLoading={isLoading}
              marketData={marketData.slice(0, 4)}
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
                    data={marketData.slice(0, 5)}
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
                      : trendingCoins.slice(0, 5).map((coin) => (
                          <div
                            key={coin.id}
                            className="flex items-center gap-4"
                          >
                            <div className="h-9 w-9 overflow-hidden rounded-full">
                              <img
                                src={coin.thumb || "https://placehold.co/100"}
                                alt={coin.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {coin.symbol}
                              </div>
                            </div>
                            <div className="ml-auto flex items-center gap-1 text-sm">
                              <span>#{coin.market_cap_rank}</span>
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
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <span>Filter</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <span>Sort by</span>
                    <ChevronsUpDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
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

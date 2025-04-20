import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { CryptoChart } from "./crypto-chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Pagination } from "./ui/pagination"

export function CryptoTable({ isLoading, data, error, onPageChange, currentPage, totalPages }) {
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      let sortedData = [...data];
      
      // Apply search filter
      if (searchTerm) {
        sortedData = sortedData.filter(
          coin => 
            coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      sortedData.sort((a, b) => {
        // Handle undefined or null values
        if (a[sortConfig.key] === undefined || a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === undefined || b[sortConfig.key] === null) return -1;
        
        if (sortConfig.direction === 'asc') {
          return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
        } else {
          return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
        }
      });
      
      setFilteredData(sortedData);
    }
  }, [data, sortConfig, searchTerm]);

  const handleSort = (key) => {
    setSortConfig(prevSortConfig => ({
      key,
      direction: prevSortConfig.key === key && prevSortConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
      <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading crypto data: {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search coins..."
          className="max-w-xs"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="text-sm text-muted-foreground">
          {filteredData.length} of {data ? data.length : 0} coins
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[50px] cursor-pointer"
                onClick={() => handleSort('market_cap_rank')}
              >
                # {renderSortIcon('market_cap_rank')}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {renderSortIcon('name')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort('current_price')}
              >
                Price {renderSortIcon('current_price')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                24h % {renderSortIcon('price_change_percentage_24h')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort('price_change_percentage_7d_in_currency')}
              >
                7d % {renderSortIcon('price_change_percentage_7d_in_currency')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort('market_cap')}
              >
                Market Cap {renderSortIcon('market_cap')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort('total_volume')}
              >
                Volume (24h) {renderSortIcon('total_volume')}
              </TableHead>
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
              : filteredData.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell>{coin.market_cap_rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full">
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
                          <div className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${typeof coin.current_price === 'number' ? coin.current_price.toLocaleString() : '0.00'}
                    </TableCell>
                    <TableCell
                      className={`text-right ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {coin.price_change_percentage_24h >= 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
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
                    <TableCell className="text-right">
                      ${typeof coin.market_cap === 'number' ? 
                          coin.market_cap >= 1_000_000_000 
                            ? (coin.market_cap / 1_000_000_000).toFixed(2) + 'B' 
                            : (coin.market_cap / 1_000_000).toFixed(2) + 'M'
                          : '0.00'}
                    </TableCell>
                    <TableCell className="text-right">
                      ${typeof coin.total_volume === 'number' ? 
                          coin.total_volume >= 1_000_000_000 
                            ? (coin.total_volume / 1_000_000_000).toFixed(2) + 'B' 
                            : (coin.total_volume / 1_000_000).toFixed(2) + 'M'
                          : '0.00'}
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-[80px] ml-auto">
                        {coin.sparkline_in_7d?.price ? (
                          <CryptoChart
                            data={coin.sparkline_in_7d.price}
                            color={(coin.price_change_percentage_7d_in_currency || 0) >= 0 ? "#10b981" : "#ef4444"}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">No data</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
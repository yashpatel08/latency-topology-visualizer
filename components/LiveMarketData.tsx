"use client";

import type { FC } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "./ui/skeleton";
import { useTheme } from "./ThemeProvider";

// Type definitions for the Blockchain.com ticker API response
interface Ticker {
  symbol: string;
  price_24h: number;
  volume_24h: number;
  last_trade_price: number;
}

type SortKey = keyof Ticker;

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

const LiveMarketDataPage: FC = () => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("volume_24h");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_OPTIONS[0]
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const {theme} = useTheme();
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.blockchain.com/v3/exchange/tickers"
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch market data. Status: ${response.status}`
        );
      }
      const data: Ticker[] = await response.json();
      setTickers(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortDirection("desc");
      }
      return key;
    });
    setCurrentPage(1); // Reset to first page on sort
  }, []);

  const filteredTickers = useMemo(() => {
    let filtered = tickers;

    if (debouncedSearch) {
      filtered = filtered.filter((ticker) =>
        ticker.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (priceFilter !== "all") {
      filtered = filtered.filter((ticker) => {
        const price = ticker.last_trade_price;
        switch (priceFilter) {
          case "low":
            return price < 1000;
          case "medium":
            return price >= 1000 && price < 10000;
          case "high":
            return price >= 10000;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [tickers, sortKey, sortDirection, debouncedSearch, priceFilter]);

  const paginatedTickers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTickers.length / itemsPerPage);

  const getPriceChange = useCallback((ticker: Ticker) => {
    return ticker.last_trade_price - ticker.price_24h;
  }, []);

  const getPriceChangePercent = useCallback(
    (ticker: Ticker) => {
      if (ticker.price_24h === 0) return 0;
      return (getPriceChange(ticker) / ticker.price_24h) * 100;
    },
    [getPriceChange]
  );

  return (
    <div className={`min-h-screen w-full bg-black font-body text-foreground antialiased ${theme === "dark"
      ? "bg-black text-gray-100"
      : "bg-gray-50 text-gray-900"}`}>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Card className={`${theme === "dark" ? "bg-black" : "bg-gray-50"} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              Market Tickers
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Data is refreshed automatically every 30 seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Input
                placeholder="Search by symbol..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64"
              />
              <div className="flex items-center gap-4">
                <Select
                  value={priceFilter}
                  onValueChange={(value) => {
                    setPriceFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="low">Under $1,000</SelectItem>
                    <SelectItem value="medium">$1,000 - $10,000</SelectItem>
                    <SelectItem value="high">Over $10,000</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceFilter("all");
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Items per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>

            {loading && <TableSkeleton />}
            {error && (
              <div className="py-8 text-center text-destructive">{error}</div>
            )}
            {!loading && !error && (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader
                        id="symbol"
                        title="Symbol"
                        currentSort={sortKey}
                        direction={sortDirection}
                        onSort={handleSort}
                        className="w-[120px] sm:w-[150px]"
                      />
                      <SortableHeader
                        id="last_trade_price"
                        title="Last Price"
                        currentSort={sortKey}
                        direction={sortDirection}
                        onSort={handleSort}
                        className="w-[120px] sm:w-[150px]"
                      />
                      <TableHead className="w-[120px] sm:w-[150px]">
                        24h Change
                      </TableHead>
                      <SortableHeader
                        id="volume_24h"
                        title="24h Volume"
                        currentSort={sortKey}
                        direction={sortDirection}
                        onSort={handleSort}
                        className="w-[120px] sm:w-[150px]"
                      />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTickers.map((ticker) => (
                      <TableRow key={ticker.symbol}>
                        <TableCell className="font-medium whitespace-nowrap text-sm sm:text-base">
                          {ticker.symbol}
                        </TableCell>
                        <TableCell className="font-mono whitespace-nowrap text-sm sm:text-base">
                          ${ticker.last_trade_price.toLocaleString()}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm sm:text-base">
                          <span
                            className={
                              getPriceChange(ticker) >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {getPriceChange(ticker).toFixed(4)} (
                            {getPriceChangePercent(ticker).toFixed(2)}%)
                          </span>
                        </TableCell>
                        <TableCell className="font-mono whitespace-nowrap text-sm sm:text-base">
                          $
                          {ticker.volume_24h.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const SortableHeader: FC<{
  id: SortKey;
  title: string;
  currentSort: SortKey;
  direction: "asc" | "desc";
  onSort: (key: SortKey) => void;
  className?: string;
}> = ({ id, title, currentSort, direction, onSort, className }) => (
  <TableHead
    className={`cursor-pointer hover:bg-muted/50 whitespace-nowrap ${className}`}
    onClick={() => onSort(id)}
  >
    <div className="flex items-center gap-2">
      {title}
      {currentSort === id &&
        (direction === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        ))}
    </div>
  </TableHead>
);

const TableSkeleton = () => (
  <div className="space-y-2">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);

export default LiveMarketDataPage;
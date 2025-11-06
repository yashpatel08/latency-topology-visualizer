"use client";

import type { FC } from "react";
import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import MarketDashboard from "@/components/MarketDashboard";
import { ControlPanel, Filters } from "@/components/ControlPanel";
import geoData from "@/data/data.json";
import { Header } from "@/components/Header";
import { MapContainer } from "@/components/MapContainer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/ThemeProvider";

const LatencyMap: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    exchange: "all",
    latency: [0, 500],
    providers: { AWS: true, GCP: true, Azure: true, Other: true },
    layers: { servers: true, regions: true },
  });
  const [isControlPanelOpen, setIsControlPanelOpen] = useState<boolean>(false);

  const exchanges = useMemo(() => {
    const uniqueExchanges = [
      ...new Set(geoData.servers.map((s) => s.exchange)),
    ];
    return ["all", ...uniqueExchanges.sort()];
  }, []);

  const filteredGeoData = useMemo(() => {
    const searchLower = filters.search.toLowerCase();

    const filteredServers = geoData.servers
      .filter((server) => {
        const searchMatch =
          !filters.search ||
          server.name.toLowerCase().includes(searchLower) ||
          server.city.toLowerCase().includes(searchLower) ||
          server.country.toLowerCase().includes(searchLower) ||
          server.exchange.toLowerCase().includes(searchLower);

        const exchangeMatch =
          filters.exchange === "all" || server.exchange === filters.exchange;

        const latencyMatch =
          server.latency >= filters.latency[0] &&
          server.latency <= filters.latency[1];

        const providerMatch =
          filters.providers[
          server.cloudProvider as keyof typeof filters.providers
          ];

        return searchMatch && exchangeMatch && latencyMatch && providerMatch;
      })
      .map((server) => ({
        ...server,
        cloudProvider: server.cloudProvider as
          | "AWS"
          | "GCP"
          | "Azure"
          | "Other",
      }));

    const filteredRegions = geoData.regions
      .filter(
        (region) =>
          filters.providers[region.provider as keyof typeof filters.providers]
      )
      .map((region) => ({
        ...region,
        provider: region.provider as "AWS" | "GCP" | "Azure",
        code:
          typeof region.code === "string"
            ? region.code
            : (region as any).code_attention ?? "",
      }));

    return { servers: filteredServers, regions: filteredRegions };
  }, [filters]);

  return (
    // <div className="relative min-h-[100vh] w-full bg-black font-body antialiased overflow-x-hidden theme-transition">
      <div
            className={`relative min-h-[100vh] w-full font-body antialiased overflow-x-hidden theme-transition ${theme === "dark"
                    ? "bg-black text-gray-100"
                    : "bg-gray-50 text-gray-900"
                }`}
        >
      <Header />
      <main className="relative h-[100vh] w-full flex flex-col md:flex-row">
        {loading && <MapSkeleton />}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <MapContainer
              geoData={filteredGeoData}
              layerVisibility={filters.layers}
            />
            <div className="md:hidden absolute top-20 left-2 z-20 ">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
                className="bg-background/80 backdrop-blur-sm"
              >
                <SlidersHorizontal className="h-5 w-5" />
                
              </Button>
            </div>
            <ControlPanel
              filters={filters}
              onFiltersChange={setFilters}
              exchanges={exchanges}
              className={`
                absolute top-20 md:top-24 left-2 md:left-4 z-10
                w-[90vw] md:w-80 max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-7rem)]
                transition-transform duration-300 ease-in-out
                ${isControlPanelOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
                }
              `}
              onClose={() => setIsControlPanelOpen(false)}
            />
          </>
        )}
      </main>

      <div className="mt-4 h-full w-full max-w-7xl mx-auto px-4">
        <MarketDashboard />
      </div>
    </div>
  );
};

const MapSkeleton = () => (
  <div className="absolute inset-0">
    <Skeleton className="h-full w-full bg-gray-800" />
  </div>
);

export default LatencyMap;
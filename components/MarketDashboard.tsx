"use client";
import type { FC } from "react";
import { useState } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "../components/ui/tabs";
import { BarChart3, Server } from "lucide-react";
import ServerLatencyPage from "./LatencyTable";
import LiveMarketDataPage from "./LiveMarketData";
import { useTheme } from "./ThemeProvider";

const MarketDashboard: FC = () => {
    const [activeTab, setActiveTab] = useState<"market" | "latency">("market");
    const { theme } = useTheme();
    return (
        <div
            className={`min-h-screen w-full font-body antialiased transition-colors duration-500 ${theme === "dark"
                    ? "bg-black text-gray-100"
                    : "bg-gray-50 text-gray-900"
                }`}
        >
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "market" | "latency")}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 bg-background backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2 gap-4 h-auto shadow-xl">
                        <TabsTrigger
                            value="market"
                            className="group flex items-center justify-center gap-3 py-4 px-6 text-sm sm:text-base font-medium rounded-xl transition-all duration-500 ease-out data-[state=active]:bg-linear-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/25 data-[state=active]:font-semibold data-[state=active]:scale-[1.02] text-gray-300 hover:text-white hover:bg-gray-700/50"
                        >
                            <BarChart3 className="w-5 h-5 transition-all duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:drop-shadow-sm group-data-[state=active]:animate-pulse" />
                            <span className="transition-all duration-300">Market Data</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="latency"
                            className="group flex items-center justify-center gap-3 py-4 px-6 text-sm sm:text-base font-medium rounded-xl transition-all duration-500 ease-out data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:font-semibold data-[state=active]:scale-[1.02] text-gray-300 hover:text-white hover:bg-gray-700/50"
                        >
                            <Server className="w-5 h-5 transition-all duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:drop-shadow-sm group-data-[state=active]:animate-pulse" />
                            <span className="transition-all duration-300">
                                Server Latency
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="market">
                        <LiveMarketDataPage />
                    </TabsContent>

                    <TabsContent value="latency">
                        <ServerLatencyPage />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default MarketDashboard;
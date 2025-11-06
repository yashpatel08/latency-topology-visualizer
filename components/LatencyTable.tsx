"use client";

import type { FC } from "react";
import { useState, useMemo, useCallback } from "react";
import geoData from "../data/data.json";
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
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import CloudflareLatencyFeed from "./CloudflareLatencyFeed";
import HistoricalLatencyTrends from "./HistoricalLatencyTrends";
import { useTheme } from "./ThemeProvider";

const providerColors = {
    AWS: "#FF9900",
    GCP: "#4285F4",
    Azure: "#0078D4",
    Other: "#9E9E9E",
};

function getProviderColor(provider: string): string {
    if (providerColors.hasOwnProperty(provider)) {
        return providerColors[provider as keyof typeof providerColors];
    }
    return providerColors.Other;
}

function getLatencyColor(latency: number) {
    if (latency < 50) return "#2E8B57"; // SeaGreen
    if (latency < 100) return "#FFD700"; // Gold
    if (latency > 100) return "#E34B30"; // Red
    return "#DC143C"; // Crimson
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

const ServerLatencyPage: FC = () => {
    const [isTableOpen, setIsTableOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [latencyRange, setLatencyRange] = useState<[number, number]>([0, 500]);
    const [selectedProviders, setSelectedProviders] = useState<{
        AWS: boolean;
        GCP: boolean;
        Azure: boolean;
        Other: boolean;
    }>({
        AWS: true,
        GCP: true,
        Azure: true,
        Other: true,
    });
    const [selectedExchange, setSelectedExchange] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(
        ITEMS_PER_PAGE_OPTIONS[0]
    );
    const {theme} = useTheme();
    const exchanges = useMemo(() => {
        const uniqueExchanges = [
            ...new Set(geoData.servers.map((s) => s.exchange)),
        ];
        return ["all", ...uniqueExchanges.sort()];
    }, []);

    const filteredServers = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return geoData.servers.filter((server) => {
            const searchMatch =
                !searchTerm ||
                server.name.toLowerCase().includes(searchLower) ||
                server.exchange.toLowerCase().includes(searchLower) ||
                server.city.toLowerCase().includes(searchLower) ||
                server.country.toLowerCase().includes(searchLower) ||
                server.cloudProvider.toLowerCase().includes(searchLower);

            const latencyMatch =
                server.latency >= latencyRange[0] && server.latency <= latencyRange[1];

            const providerMatch =
                selectedProviders[
                server.cloudProvider as keyof typeof selectedProviders
                ];

            const exchangeMatch =
                selectedExchange === "all" || server.exchange === selectedExchange;

            return searchMatch && latencyMatch && providerMatch && exchangeMatch;
        });
    }, [searchTerm, latencyRange, selectedProviders, selectedExchange]);

    const paginatedServers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredServers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredServers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredServers.length / itemsPerPage);

    const handleLatencyChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, value: number | number[]) => {
            const [min, max] = Array.isArray(value) ? value : [0, value];
            setLatencyRange([Math.max(0, min), Math.min(500, max)]);
            setCurrentPage(1); // Reset to first page on filter change
        },
        []
    );

    const handleFilterChange = useCallback(() => {
        setCurrentPage(1); // Reset to first page on any filter change
    }, []);

    return (
        <div className={`min-h-[50vh] w-full font-body antialiased ${theme === "dark"
            ? "bg-black text-gray-100"
            : "bg-white text-gray-900"}`}>
            <main className="p-2 sm:p-4 md:p-6 lg:p-8">
                <Card className={`${theme === "dark" ? "bg-black" : "bg-white"} backdrop-blur-sm w-full max-w-[100vw] mx-auto`}>
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle className="text-base sm:text-lg md:text-xl">
                            Server Latency Information
                        </CardTitle>
                        <div className="w-full sm:w-auto">
                            <Card className=" shadow-lg rounded-lg p-4 border border-gray-700">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="text"
                                            placeholder="Search servers..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                handleFilterChange();
                                            }}
                                            className={`w-full ${theme === "dark"
                                                ? "bg-black text-gray-100"
                                                : "bg-gray-50 text-gray-900"} border-gray-600 placeholder-gray-400 rounded-md focus:ring-2 focus:ring-blue-500`}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Select
                                            value={selectedExchange}
                                            onValueChange={(value) => {
                                                setSelectedExchange(value);
                                                handleFilterChange();
                                            }}
                                        >
                                            <SelectTrigger className={`w-full ${theme === "dark"
                                                ? "bg-black text-gray-100"
                                                : "bg-gray-50 text-gray-900"} rounded-md focus:ring-2 focus:ring-blue-500`}>
                                                <SelectValue placeholder="All Exchanges" />
                                            </SelectTrigger>
                                            <SelectContent className={`${theme === "dark"
                                                ? "bg-black text-gray-100"
                                                : "bg-gray-50 text-gray-900"} border-gray-600`}>
                                                {exchanges.map((exchange) => (
                                                    <SelectItem
                                                        key={exchange}
                                                        value={exchange}
                                                        className="hover:bg-gray-700"
                                                    >
                                                        {exchange}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="500"
                                            value={latencyRange[1]}
                                            onChange={(e) =>
                                                handleLatencyChange(e, [
                                                    latencyRange[0],
                                                    parseInt(e.target.value) || 500,
                                                ])
                                            }
                                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <span className="text-white text-sm">
                                            {latencyRange[1]} ms
                                        </span>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-wrap gap-2">
                                        {(["AWS", "GCP", "Azure", "Other"] as const).map(
                                            (provider) => (
                                                <div
                                                    key={provider}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Switch
                                                        checked={selectedProviders[provider]}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedProviders((prev) => ({
                                                                ...prev,
                                                                [provider]: checked,
                                                            }));
                                                            handleFilterChange();
                                                        }}
                                                        className="bg-gray-600 data-[state=checked]:bg-blue-500"
                                                    />
                                                    <Label className="text-white text-sm">
                                                        {provider}
                                                    </Label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsTableOpen(!isTableOpen)}
                            className="md:hidden text-white hover:text-blue-500"
                        >
                            {isTableOpen ? (
                                <ChevronUp className="h-5 w-5" />
                            ) : (
                                <ChevronDown className="h-5 w-5" />
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent
                        className={`transition-all duration-300 ease-in-out ${isTableOpen ? "block" : "hidden md:block"
                            }`}
                    >
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
                                    <SelectTrigger className="w-24 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className=" border-gray-600">
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
                                    className="border-gray-600 hover:bg-gray-700"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-white">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="border-gray-600 hover:bg-gray-700"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs sm:text-sm w-[20%] min-w-20">
                                            Server Name
                                        </TableHead>
                                        <TableHead className="text-xs sm:text-sm w-[20%] min-w-20">
                                            Exchange
                                        </TableHead>
                                        <TableHead className="text-xs sm:text-sm w-[25%] min-w-[120px]">
                                            Location
                                        </TableHead>
                                        <TableHead className="text-xs sm:text-sm w-[20%] min-w-20">
                                            Provider
                                        </TableHead>
                                        <TableHead className="text-xs sm:text-sm w-[15%] min-w-20 text-right">
                                            Latency
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedServers.map((server) => (
                                        <TableRow key={server.id}>
                                            <TableCell className="font-medium text-xs sm:text-sm truncate">
                                                {server.name}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm truncate">
                                                {server.exchange}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm">
                                                {server.city}, {server.country}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm">
                                                <Badge
                                                    variant="secondary"
                                                    style={{
                                                        backgroundColor: getProviderColor(
                                                            server.cloudProvider
                                                        ),
                                                        color: "#fff",
                                                        textShadow: "0 0 2px black",
                                                        fontSize: "0.75rem",
                                                        padding: "0.25rem 0.5rem",
                                                    }}
                                                >
                                                    {server.cloudProvider}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-xs sm:text-sm">
                                                <span
                                                    className="font-bold text-sm sm:text-base md:text-lg"
                                                    style={{ color: getLatencyColor(server.latency) }}
                                                >
                                                    {server.latency}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-8">
                                <Card className="bg-background backdrop-blur-sm border border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-base sm:text-lg md:text-xl">
                                            🌐 Real-Time Global Latency (Cloudflare Radar)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CloudflareLatencyFeed />
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="mt-8">
                                <HistoricalLatencyTrends />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default ServerLatencyPage;
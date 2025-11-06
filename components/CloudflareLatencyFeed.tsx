"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type LatencyData = {
  timestamp: string;
  p25: number;
  p50: number;
  p75: number;
};

export default function CloudflareLatencyFeed() {
  const [data, setData] = useState<LatencyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatency = async () => {
    try {
      const res = await fetch("/api/latency");
      const json = await res.json();
      console.log("res", json);

      if (json.latency) setData(json.latency);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLatency();
    const interval = setInterval(fetchLatency, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const getColor = (latency: number) => {
    if (latency < 50) return "bg-green-600";
    if (latency < 120) return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-20">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>P25 (ms)</TableHead>
              <TableHead>P50 (Median)</TableHead>
              <TableHead>P75 (ms)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>
                  {new Date(row.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>{row.p25?.toFixed(2)}</TableCell>
                <TableCell>{row.p50?.toFixed(2)}</TableCell>
                <TableCell>{row.p75?.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={`${getColor(row.p50)} text-white`}>
                    {row.p50 < 50
                      ? "Excellent"
                      : row.p50 < 120
                      ? "Moderate"
                      : "Poor"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

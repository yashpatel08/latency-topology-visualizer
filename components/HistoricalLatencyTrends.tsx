import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingDown, TrendingUp, Activity } from 'lucide-react';

// Mock historical data generator
const generateHistoricalData = (hours: number, serverPair: string) => {
  const data = [];
  const now = Date.now();
  const baseLatency = Math.random() * 100 + 50;
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 30;
    const latency = Math.max(10, baseLatency + variation);
    
    data.push({
      timestamp: timestamp.toISOString(),
      time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      latency: parseFloat(latency.toFixed(2)),
      date: timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Mock server pairs data
const serverPairs = [
  { id: 'okx-binance', label: 'OKX (AWS Tokyo) → Binance (AWS Singapore)', region1: 'AWS Tokyo', region2: 'AWS Singapore' },
  { id: 'deribit-bybit', label: 'Deribit (GCP London) → Bybit (GCP Hong Kong)', region1: 'GCP London', region2: 'GCP Hong Kong' },
  { id: 'coinbase-kraken', label: 'Coinbase (Azure N.Virginia) → Kraken (Azure Frankfurt)', region1: 'Azure N.Virginia', region2: 'Azure Frankfurt' },
  { id: 'ftx-huobi', label: 'FTX (AWS Oregon) → Huobi (AWS Seoul)', region1: 'AWS Oregon', region2: 'AWS Seoul' }
];

const timeRanges = [
  { value: '1', label: '1 Hour', hours: 1 },
  { value: '24', label: '24 Hours', hours: 24 },
  { value: '168', label: '7 Days', hours: 168 },
  { value: '720', label: '30 Days', hours: 720 }
];

type LatencyData = {
  timestamp: string;
  time: string;
  latency: number;
  date: string;
};

export default function HistoricalLatencyTrends() {
  const [selectedPair, setSelectedPair] = useState(serverPairs[0].id);
  const [timeRange, setTimeRange] = useState('24');
  const [data, setData] = useState<LatencyData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const hours = timeRanges.find(tr => tr.value === timeRange)?.hours || 24;
    
    // Simulate API call delay
    setTimeout(() => {
      const historicalData = generateHistoricalData(hours, selectedPair);
      setData(historicalData);
      setLoading(false);
    }, 500);
  }, [selectedPair, timeRange]);

  const statistics = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 0, avg: 0 };
    
    const latencies = data.map(d => d.latency);
    const min = Math.min(...latencies);
    const max = Math.max(...latencies);
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    
    return {
      min: min.toFixed(2),
      max: max.toFixed(2),
      avg: avg.toFixed(2)
    };
  }, [data]);

  const currentPair = serverPairs.find(p => p.id === selectedPair);

  const getLatencyColor = (latency) => {
    if (latency < 50) return '#10b981'; // green
    if (latency < 100) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.date} {data.time}</p>
          <p className="text-lg font-bold" style={{ color: getLatencyColor(data.latency) }}>
            {data.latency} ms
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-background/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-primary" />
            Historical Latency Trends
          </CardTitle>
          <CardDescription>
            Analyze historical latency patterns between exchange server pairs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Server Pair</label>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serverPairs.map(pair => (
                    <SelectItem key={pair.id} value={pair.id}>
                      {pair.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Range
              </label>
              <div className="flex gap-2">
                {timeRanges.map(range => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range.value)}
                    className="flex-1"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Minimum</p>
                    <p className="text-2xl font-bold text-green-400">{statistics.min} ms</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average</p>
                    <p className="text-2xl font-bold text-blue-400">{statistics.avg} ms</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Maximum</p>
                    <p className="text-2xl font-bold text-red-400">{statistics.max} ms</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Information */}
          {currentPair && (
            <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {currentPair.region1}
              </Badge>
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-primary" />
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <div className="h-px w-8 bg-primary" />
              </div>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {currentPair.region2}
              </Badge>
            </div>
          )}

          {/* Chart */}
          <div className="w-full h-[400px] pt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading historical data...</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey={timeRange === '1' ? 'time' : 'date'} 
                    stroke="#888"
                    tick={{ fill: '#888' }}
                  />
                  <YAxis 
                    stroke="#888"
                    tick={{ fill: '#888' }}
                    label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', fill: '#888' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 6 }}
                    name="Latency (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
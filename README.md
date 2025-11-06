---

# 🌐 Latency Topology Visualizer

A **Next.js** application that displays a **3D world map** visualizing exchange server locations and **real-time/historical latency data** across **AWS, GCP, and Azure co-location regions** for cryptocurrency trading infrastructure.

---

## 🚀 Features

### 🌍 Core Features
- **3D Interactive Globe:** Rendered using Three.js with React Three Fiber for smooth performance  
- **Exchange Server Visualization:** Major cryptocurrency exchanges (Binance, OKX, Deribit, Bybit, etc.) plotted on the globe  
- **Real-time Latency Monitoring:** Animated connections showing latency between exchange pairs  
- **Cloud Provider Integration:** Visual distinction between AWS, GCP, and Azure hosted servers  
- **Historical Latency Charts:** Time-series visualization with multiple time ranges (1h, 24h, 7d, 30d)  
- **Interactive Controls:** Filtering by exchange, cloud provider, and latency range  
- **Performance Metrics Dashboard:** Real-time system health monitoring  
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices  
- **Dark/Light Theme:** Theme toggle for better UX  

### ⚙️ Technical Highlights
- **TypeScript:** Full type safety throughout the application  
- **Real-time Updates:** Latency data updates every 5 seconds  
- **Smooth Animations:** Pulsing markers and animated arcs  
- **Performance Optimized:** Efficient 3D rendering with memoization  
- **Modern React Patterns:** Hooks, Context, and proper state management  

---

## 📋 Prerequisites
- **Node.js 18.x** or higher  
- **npm** or **yarn** package manager  

---

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yashpatel08/latency-topology-visualizer
cd latency-topology-visualizer
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
latency-topology-visualizer/
├── api/
|   └──latency(route.ts)
├── app/
│   ├── Layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── CloudflareLatencyFeed.tsx
│   ├── ControlPanel.tsx
│   ├── Header.tsx
│   ├── HistoricalLatencyTrends.tsx
|   ├── LatencyTable.tsx
|   ├── LiveMarketData.tsx
|   ├── MapContainer.tsx
|   ├── MarketDashboard.tsx
│   └── LatencyTable.tsx 
├── hooks/
│   └── useLatencyData.ts  
├── lib/
|   ├── three-utils.ts
│   └── utils.ts
├── data
|   ├── data.json
├── types/
│   └── geo.ts      
├── package.json
├── .env    
├── tsconfig.json       
├── tailwind.config.ts   
├── next.config.js
└── README.md  
```

---
.env.example
```
CLOUDFLARE_API_TOKEN=XXXXXXXXXXXXXXXXXXXXX
```
---

## 🎯 Key Components

### 🌐 **Globe Component**

* Renders 3D Earth using **Three.js**
* Displays exchange locations as **animated markers**
* Cloud regions shown as **ring markers**
* **Animated latency arcs** with color-coding
* **Interactive controls:** rotate, zoom, and pan

### 🧭 **Control Panel**

* Search exchanges
* Toggle visualization layers (real-time, historical, regions)
* Filter by cloud provider (AWS, GCP, Azure)
* Latency range slider
* Multi-select exchange filtering
* Reset filters button

### 📈 **Historical Chart**

* Time-series visualization using **Recharts**
* Time range selectors: 1h, 24h, 7d, 30d
* Latency statistics (min, max, avg)
* Responsive layout

### 📊 **Metrics Dashboard**

* Active connections count
* Average latency monitoring
* Healthy vs degraded connections
* System status indicator
* Real-time health percentage

---

## 🧰 Technologies Used

* **Next.js 14** – React framework for production
* **TypeScript** – Type-safe development
* **Three.js** – 3D rendering
* **React Three Fiber** – React renderer for Three.js
* **@react-three/drei** – Utility helpers for R3F
* **Recharts** – Data visualization
* **Tailwind CSS** – Utility-first CSS framework
* **Lucide React** – Icon library

---

## ⚡ Performance Optimization

* **Dynamic Imports:** Load heavy components (like Globe) lazily
* **Memoization:** Optimize computations using `useMemo`
* **Efficient Filtering:** Fast exchange filtering
* **Frame-rate Optimization:** Smooth 60fps rendering
* **Lazy Loading:** Load on demand

---

## 🔒 Assumptions

* Mock latency data (no real API integration)
* Static exchange locations
* No persistent storage (data resets on refresh)
* WebGL-enabled modern browser required
* Historical data generated programmatically

---

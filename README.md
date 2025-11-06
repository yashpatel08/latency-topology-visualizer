# Latency Topology Visualizer
A Next.js application that displays a 3D world map visualizing exchange server locations and real-time/historical latency data across AWS, GCP, and Azure co-location regions for cryptocurrency trading infrastructure.

## 🚀 Features
### Core Features
- 3D Interactive Globe: Rendered using Three.js with React Three Fiber for smooth performance
- Exchange Server Visualization: Major cryptocurrency exchanges (Binance, OKX, Deribit, Bybit, etc.) plotted on the globe
- Real-time Latency Monitoring: Animated connections showing latency between exchange pairs
- Cloud Provider Integration: Visual distinction between AWS, GCP, and Azure hosted servers
- Historical Latency Charts: Time-series data visualization with multiple time ranges (1h, 24h, 7d, 30d)
- Interactive Controls: Comprehensive filtering by exchange, cloud provider, and latency range
- Performance Metrics Dashboard: Real-time system health monitoring
- Responsive Design: Optimized for desktop, tablet, and mobile devices
- Dark/Light Theme: Toggle between themes for better user experience
- Technical Highlights
- TypeScript: Full type safety throughout the application
- Real-time Updates: Latency data updates every 5 seconds
- Smooth Animations: Pulsing markers and animated latency arcs
- Performance Optimized: Efficient 3D rendering with proper memoization
- Modern React Patterns: Hooks, context, and proper state management
### 📋 Prerequisites
Node.js 18.x or higher
npm or yarn package manager
### 🛠️ Installation
Clone the repository:
bash
git clone https://github.com/yashpatel08/latency-topology-visualizer
cd latency-topology-visualizer
Install dependencies:
bash
npm install
# or
yarn install
Run the development server:
bash
npm run dev
# or
yarn dev
Open your browser and navigate to:
http://localhost:3000
📁 Project Structure
latency-topology-visualizer/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── Globe.tsx           # 3D globe visualization
│   ├── ControlPanel.tsx    # Filter controls
│   ├── HistoricalChart.tsx # Time-series chart component
│   ├── MetricsDashboard.tsx # Performance metrics
│   └── Legend.tsx          # Visualization legend
├── hooks/
│   └── useLatencyData.ts   # Real-time latency data hook
├── lib/
│   └── data.ts             # Exchange and cloud region data
├── types/
│   └── index.ts            # TypeScript type definitions
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.js          # Next.js configuration
└── README.md              # This file
🎯 Key Components
Globe Component
Renders 3D Earth using Three.js
Displays exchange locations as animated markers
Shows cloud regions as ring markers
Animated latency connections with color-coded arcs
Interactive camera controls (rotate, zoom, pan)
Control Panel
Search functionality for exchanges
Toggle visualization layers (real-time, historical, regions)
Filter by cloud provider (AWS, GCP, Azure)
Adjust latency range slider
Multi-select exchange filtering
Reset filters button
Historical Chart
Interactive time-series visualization using Recharts
Time range selectors (1h, 24h, 7d, 30d)
Latency statistics (min, max, average)
Responsive chart design
Metrics Dashboard
Active connections count
Average latency monitoring
Healthy vs. degraded connections
System status indicator
Real-time health percentage
🔧 Technologies Used
Next.js 14: React framework for production
TypeScript: Type-safe development
Three.js: 3D graphics library
React Three Fiber: React renderer for Three.js
@react-three/drei: Useful helpers for R3F
Recharts: Charting library for historical data
Tailwind CSS: Utility-first CSS framework
Lucide React: Icon library
📊 Data Structure
Exchange Locations
Each exchange has:

Unique ID
Name
Latitude/Longitude coordinates
Cloud provider (AWS/GCP/Azure)
Region code
Cloud Regions
Each region has:

Provider name
Region code
Geographic coordinates
Server count
Latency Data
Real-time connections include:

From/To exchange IDs
Latency in milliseconds
Timestamp
🎨 Customization
Adding New Exchanges
Edit lib/data.ts and add to the EXCHANGES array:

typescript
{
  id: 'exchange-location',
  name: 'Exchange Name',
  lat: 0.0,
  lon: 0.0,
  cloudProvider: 'AWS', // or 'GCP' or 'Azure'
  region: 'region-code',
}
Modifying Latency Ranges
Update the getLatencyColor function in lib/data.ts to adjust color thresholds.

Changing Update Intervals
Modify the interval in hooks/useLatencyData.ts:

typescript
const interval = setInterval(updateLatency, 5000); // 5 seconds
🚀 Performance Optimization
Dynamic Imports: Globe component loaded dynamically to reduce initial bundle
Memoization: useMemo hooks for expensive computations
Efficient Filtering: Optimized data filtering in components
Frame-rate Optimization: Smooth 60fps 3D rendering
Lazy Loading: Components loaded on demand
📱 Responsive Design
Desktop: Full feature set with side-by-side layout
Tablet: Stacked layout with touch controls
Mobile: Optimized 3D performance with touch gestures
🔒 Assumptions Made
Mock Latency Data: Since this is a demo, latency data is simulated using a deterministic algorithm that generates realistic values
No Real API: The application doesn't connect to actual latency monitoring APIs to avoid costs
Static Exchange Locations: Exchange locations are hardcoded based on known data center locations
Browser Support: Assumes modern browser with WebGL support
Historical Data: Generated programmatically for the last 24 hours
🐛 Known Limitations
Latency data is simulated, not real-time from actual servers
Limited to 10 major exchanges (expandable)
Historical data is generated, not fetched from real APIs
No data persistence (resets on page refresh)
🔮 Future Enhancements
Integration with real latency monitoring APIs (Cloudflare Radar, Pingdom)
Data persistence using localStorage or database
Export functionality for reports (PDF, CSV)
Latency heatmap overlay
Network topology visualization
Trading volume visualization
Websocket support for true real-time updates
User authentication and saved preferences
📄 License
This project is created for the GoQuant recruitment process and is confidential.

👤 Author
Created as part of the GoQuant Front-End Developer application process.

📞 Support
For questions or issues, please contact the GoQuant team at careers@goquant.io

Note: This application is designed for demonstration purposes as part of the hiring process. All data is simulated for testing and evaluation.


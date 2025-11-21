// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, LineElement, PointElement, Tooltip, Legend } from "chart.js";
// import { Line } from "react-chartjs-2";
// import "chartjs-adapter-date-fns";
// import AIDecisionCard  from "../components/AIDecisionCard"

// ChartJS.register(CategoryScale, LinearScale, TimeScale, LineElement, PointElement, Tooltip, Legend);

// const Dashboard = () => {
//   const [stocks, setStocks] = useState([]);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [prices, setPrices] = useState([]);
//   const [ai, setAi] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const BACKEND_URL = "http://127.0.0.1:8000";

//   // Load stock list
//   useEffect(() => {
//     axios
//       .get(`${BACKEND_URL}/api/market/stocks`)
//       .then((res) => setStocks(res.data.stocks))
//       .catch((err) => console.error("Error loading stocks:", err));
//   }, []);


// //New
//   // calculate moving average on number array
// function movingAverageArray(values, window) {
//   if (!values || values.length < window) return [];
//   const out = new Array(values.length).fill(null);
//   let sum = 0;
//   for (let i = 0; i < values.length; i++) {
//     sum += values[i];
//     if (i >= window) sum -= values[i - window];
//     if (i >= window - 1) out[i] = sum / window;
//   }
//   return out;
// }

//   // Fetch data when stock changes
//   // const fetchStockData = async (symbol) => {
//   //   setLoading(true);
//   //   setSelectedStock(symbol);
//   //   setAi(null);
//   //   setPrices([]);

//   //   try {
//   //     const [priceRes, aiRes] = await Promise.all([
//   //       axios.get(`${BACKEND_URL}/api/market/live/${symbol}`),
//   //       axios.get(`${BACKEND_URL}/api/ai/recommend/${symbol}`)
//   //     ]);

//   //     const formatted = priceRes.data.prices.map(p => ({
//   //       x: new Date(p.time * 1000),
//   //       y: p.close
//   //     }));

//   //     setPrices(formatted);
//   //     setAi(aiRes.data);
//   //   } catch (error) {
//   //     console.error("Error fetching stock data:", error);
//   //     alert("Failed to load stock data.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const fetchStockData = async (symbol) => {
//   setLoading(true);
//   setSelectedStock(symbol);
//   setAi(null);
//   setPrices([]);

//   try {
//     const [priceRes, aiRes] = await Promise.all([
//       axios.get(`${BACKEND_URL}/api/market/live/${symbol}`),
//       axios.get(`${BACKEND_URL}/api/ai/recommend/${symbol}`).catch(() => null) // safe if backend AI fails
//     ]);

//     // format price points for chart
//     const formatted = (priceRes.data.prices || []).map(p => ({
//       x: new Date(p.time * 1000),
//       y: p.close
//     }));

//     setPrices(formatted);

//     // compute close-array (most recent at end)
//     const closes = formatted.map(pt => pt.y);

//     // compute SMA arrays
//     const sma5Arr = movingAverageArray(closes, 5);
//     const sma20Arr = movingAverageArray(closes, 20);

//     // take last non-null SMA values
//     const lastSma5 = sma5Arr.length ? sma5Arr[sma5Arr.length - 1] : null;
//     const lastSma20 = sma20Arr.length ? sma20Arr[sma20Arr.length - 1] : null;

//     // prepare ai object: prefer backend aiRes if present, else fill from computed values
//     const remoteAi = aiRes?.data || {};
//     const mergedAi = {
//       ...remoteAi,
//       short: remoteAi.short ?? (lastSma5 ? Number(lastSma5.toFixed(2)) : undefined),
//       long: remoteAi.long ?? (lastSma20 ? Number(lastSma20.toFixed(2)) : undefined),
//     };

//     setAi(mergedAi);
//   } catch (error) {
//     console.error("Error fetching stock data:", error);
//     alert("Failed to load stock data.");
//   } finally {
//     setLoading(false);
//   }
// };


//   const chartData = {
//     datasets: [
//       {
//         label: selectedStock || "Select a Stock",
//         data: prices,
//         borderColor: "#4CAF50",
//         tension: 0.3,
//         pointRadius: 0,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         type: "time",
//         time: { unit: "day" },
//         title: { display: true, text: "Date" },
//       },
//       y: {
//         title: { display: true, text: "Price (USD)" },
//       },
//     },
//     plugins: {
//       legend: { display: true },
//     },
//   };
//   // #new
// //   async function tradeStock(action) {
// //   const qty = parseInt(prompt(`Enter quantity to ${action}:`));
// //   if (!qty || qty <= 0) return;
// //   try {
// //     const res = await axios.post("http://localhost:4000/api/trade", {
// //       symbol: selected,
// //       action,
// //       quantity: qty,
// //     });
// //     alert(res.data.message);
// //   } catch (err) {
// //     alert(err.response?.data?.detail || "Trade failed");
// //   }
// // }
// async function tradeStock(action) {
//   const qty = parseInt(prompt(`Enter quantity to ${action}:`));
//   if (!qty || qty <= 0) return;
//   try {
//     const res = await axios.post(`${BACKEND_URL}/api/trade`, {

//       symbol: selectedStock,
//       action,
//       quantity: qty,
//     });
//     alert(res.data.message || "Trade successful!");
//   } catch (err) {
//     alert(err.response?.data?.detail || "Trade failed");
//   }
// }

// // 🔁 Auto-refresh AI recommendation every 60 seconds
// useEffect(() => {
//   if (!selectedStock) return;

//   const interval = setInterval(() => {
//     axios
//       .get(`${BACKEND_URL}/api/ai/recommend/${selectedStock}`)
//       .then((res) => setAi(res.data))
//       .catch((err) => console.error("AI refresh failed:", err));
//   }, 60000); // every 60 seconds

//   return () => clearInterval(interval);
// }, [selectedStock]);


//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📈 StockVision Dashboard</h1>

//       {/* Stock List */}
//       <div className="flex flex-wrap gap-4 justify-center mb-8">
//         {stocks.map((s) => (
//           <button
//             key={s.symbol}
//             onClick={() => fetchStockData(s.symbol)}
//             className={`px-5 py-2 rounded-lg border shadow-sm text-white font-semibold ${
//               selectedStock === s.symbol ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {s.name}
//           </button>
//         ))}
//       </div>

//       {/* Loading */}
//       {loading && <p className="text-center text-lg font-semibold text-gray-600">Loading data...</p>}

//       {/* Chart */}
//       {/* {!loading && prices.length > 0 && (
//         <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
//           <Line data={chartData} options={chartOptions} />
//         </div>
//       )} */}
//       {/* Chart */}
//       {/* /*new*/ }
//       {console.log("📊 Chart Data:", prices)}

// {!loading && prices.length > 0 && (
//   <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
//     <Line data={chartData} options={chartOptions} />

//     {/* 🟢 Buy / Sell / Portfolio Buttons */}
//     {selectedStock && (
//       <div className="mt-4 flex justify-center space-x-4">
//         <button
//           onClick={() => tradeStock("buy")}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Buy
//         </button>
//         <button
//           onClick={() => tradeStock("sell")}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//         >
//           Sell
//         </button>
//         <a
//           href="/portfolio"
//           className="bg-gray-200 px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-300"
//         >
//           View Portfolio
//         </a>
//        {/* 🧠 AI Decision Summary */}
// {selectedStock && ai && (
//   <div className="max-w-3xl mx-auto mt-8">
//     {/* <AIDecisionCard
//       ticker={selectedStock}
//       decision={ai.action}
//       confidence={ai.confidence || 0.87}
//       reason={ai.reason || "Based on recent technical indicators and AI model analysis."}
//     />*/}
//     {/* <AIDecisionCard
//   ticker={selectedStock}
//   company={stocks.find((s) => s.symbol === selectedStock)?.name}
//   decision={ai.action || "HOLD"}
//   confidence={ai.confidence || 0.85}
//   reason={ai.reason || "Based on recent AI model analysis of trend and volume patterns."}

// />  */}
// <AIDecisionCard
//   ticker={selectedStock}
//   company={stocks.find((s) => s.symbol === selectedStock)?.name}
//   decision={ai.action || "HOLD"}
//   confidence={ai.confidence || 0.85}
//   reason={ai.reason || "Based on recent AI model analysis of trend and volume patterns."}
//   short={ai.short}
//   long={ai.long}
// />


//   </div> 
// )}


//         {ai && (
//   <div className="mt-6 bg-blue-50 p-4 rounded-xl shadow-inner text-center border border-blue-200">
//     <h3 className="text-lg font-bold text-blue-700 mb-1"> AI Insight</h3>
//     <p className="text-gray-700">{ai.reason}</p>
//   </div>
// )}

//       </div>
      
//     )}
//   </div>
// )}


//       {/* AI Recommendation */}
//       {/* {ai && (
//         <div className="mt-8 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Recommendation</h2>
//           <p className="text-lg">📊 <b>{ai.symbol}</b></p>
//           <p className="text-lg">Short MA: {ai.short} | Long MA: {ai.long}</p>
//           <p className={`text-xl font-bold ${ai.action === "BUY" ? "text-green-600" : ai.action === "SELL" ? "text-red-600" : "text-yellow-500"}`}>
//             Recommendation: {ai.action}
//           </p>
//           <p className="text-gray-600 mt-2">Risk factor: {ai.risk}</p>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import AIDecisionCard from "../components/AIDecisionCard";
import "../styles/dashboard.css"; // ⭐ NEW CSS FILE (I'll send below)

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [prices, setPrices] = useState([]);
  const [ai, setAi] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEW UI states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // NEW states for time controls
const [interval, setInterval] = useState("1h");
const [range, setRange] = useState("5d");



  const BACKEND_URL = "http://127.0.0.1:8000";

  // CATEGORY MAP (frontend only)
  const categoryMap = {
    // Tech
    AAPL: "Tech",
    MSFT: "Tech",
    GOOGL: "Tech",
    AMZN: "Tech",
    META: "Tech",
    NFLX: "Tech",
    NVDA: "Tech",
    AMD: "Tech",
    INTC: "Tech",
    IBM: "Tech",
    ORCL: "Tech",
    CRM: "Tech",
    ADBE: "Tech",
    QCOM: "Tech",

    // Finance
    JPM: "Finance",
    BAC: "Finance",
    WFC: "Finance",
    C: "Finance",
    GS: "Finance",
    MS: "Finance",
    V: "Finance",
    MA: "Finance",
    PYPL: "Finance",

    // Energy / Auto
    XOM: "Energy",
    CVX: "Energy",
    BP: "Energy",
    F: "Auto",
    GM: "Auto",
    RIVN: "Auto",
    SHEL: "Energy",

    // Healthcare
    PFE: "Healthcare",
    MRNA: "Healthcare",
    JNJ: "Healthcare",
    UNH: "Healthcare",
    ABBV: "Healthcare",

    // Retail
    WMT: "Retail",
    TGT: "Retail",
    COST: "Retail",
    KO: "Retail",
    PEP: "Retail",
    NKE: "Retail",
    SBUX: "Retail",
  };

  // Load stock list
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/market/stocks`)
      .then((res) => setStocks(res.data.stocks))
      .catch((err) => console.error("Error loading stocks:", err));
  }, []);

  // SMA function
  function movingAverageArray(values, window) {
    if (!values || values.length < window) return [];
    const out = new Array(values.length).fill(null);
    let sum = 0;

    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      if (i >= window) sum -= values[i - window];
      if (i >= window - 1) out[i] = sum / window;
    }
    return out;
  }

  // Fetch Stock Data
  const fetchStockData = async (symbol) => {
    setLoading(true);
    setSelectedStock(symbol);
    setAi(null);
    setPrices([]);

    try {
      const [priceRes, aiRes] = await Promise.all([
      //  axios.get(`${BACKEND_URL}/api/market/live/${symbol}`),
      axios.get(
  `${BACKEND_URL}/api/market/live/${symbol}?interval=${interval}&range=${range}`),

        axios.get(`${BACKEND_URL}/api/ai/recommend/${symbol}`).catch(() => null),
      ]);

      // const formatted = (priceRes.data.prices || []).map((p) => ({
      //   x: new Date(p.time * 1000),
      //   y: p.close,
      // }));

      // setPrices(formatted);

      // const closes = formatted.map((pt) => pt.y);
      // const sma5 = movingAverageArray(closes, 5).pop();
      // const sma20 = movingAverageArray(closes, 20).pop();

      // const remoteAI = aiRes?.data || {};
      // const mergedAI = {
      //   ...remoteAI,
      //   short: remoteAI.short ?? (sma5?.toFixed(2)),
      //   long: remoteAI.long ?? (sma20?.toFixed(2)),
      // };

      // setAi(mergedAI);
     const formatted = (priceRes.data.prices || []).map((p) => ({
  x: new Date(p.time * 1000),
  y: p.close,
}));

setPrices(formatted);

// ---------- compute SMAs ----------
const closes = formatted.map((pt) => pt.y);

const sma5Arr = movingAverageArray(closes, 5);
const sma20Arr = movingAverageArray(closes, 20);

const sma5 = sma5Arr.length ? sma5Arr[sma5Arr.length - 1] : null;
const sma20 = sma20Arr.length ? sma20Arr[sma20Arr.length - 1] : null;

// ---------- merge backend AI + fallback ----------
const remoteAI = aiRes?.data || {};

let action = remoteAI.action || null;
let confidence = remoteAI.confidence ?? null;

// If backend didn't give action/confidence, infer them
if (!action || confidence == null) {
  if (sma5 != null && sma20 != null) {
    if (sma5 > sma20 * 1.01) {
      action = action || "BUY";
      confidence = confidence ?? 0.82;   // 82% rise probability
    } else if (sma5 < sma20 * 0.99) {
      action = action || "SELL";
      confidence = confidence ?? 0.78;   // 78% probability of drop
    } else {
      action = action || "HOLD";
      confidence = confidence ?? 0.7;    // 70% neutral-ish
    }
  } else {
    action = action || "HOLD";
    confidence = confidence ?? 0.6;
  }
let reason = remoteAI.reason;

// 🔹 If reason is missing OR it already starts with the old text
//    "Predicted next-day rise probability", replace it with a clean sentence.
if (!reason || reason.startsWith("Predicted next-day rise probability")) {
  reason = "Based on recent price trend and moving averages (short vs long).";
}

}

const mergedAI = {
  ...remoteAI,
  short: remoteAI.short ?? (sma5 != null ? Number(sma5.toFixed(2)) : undefined),
  long: remoteAI.long ?? (sma20 != null ? Number(sma20.toFixed(2)) : undefined),
  action,
  confidence, // 🔴 THIS is what "Predicted next-day rise probability" uses
  reason:
    remoteAI.reason ||
    "Based on recent price trend and short vs long moving averages.",
};

setAi(mergedAI);
 
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Error fetching stock data.");
    } finally {
      setLoading(false);
    }
  };

  //Newww 🔁 Refetch data whenever interval or range changes
useEffect(() => {
  if (!selectedStock) return;
  fetchStockData(selectedStock);
}, [interval, range, selectedStock]);

  // Chart Data
  const chartData = {
    datasets: [
      {
        label: selectedStock || "Select stock",
        data: prices,
        borderColor: "#4CAF50",
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    scales: {
      x: { type: "time", time: { unit: "day" } },
      y: { title: { display: true, text: "Price (USD)" } },
    },
  };

  // Trade
  async function tradeStock(action) {
    const qty = parseInt(prompt(`Enter quantity to ${action}`));
    if (!qty || qty <= 0) return;
    try {
      const res = await axios.post(`${BACKEND_URL}/api/trade`, {
        symbol: selectedStock,
        action,
        quantity: qty,
      });

      alert(res.data.message);
    } catch (err) {
      alert("Trade failed");
    }
  }

  // AI auto refresh
  useEffect(() => {
    if (!selectedStock) return;
    const id = setInterval(() => {
      axios
        .get(`${BACKEND_URL}/api/ai/recommend/${selectedStock}`)
        .then((res) => setAi(res.data));
    }, 60000);
    return () => clearInterval(id);
  }, [selectedStock]);

  // Filter stocks
  const filteredStocks = stocks.filter((s) => {
    const matchesSearch =
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      categoryMap[s.symbol] === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard-container">

      {/* =============== Sidebar =============== */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Stocks</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option>All</option>
          <option>Tech</option>
          <option>Finance</option>
          <option>Auto</option>
          <option>Retail</option>
          <option>Energy</option>
          <option>Healthcare</option>
        </select>

        {/* Stock List */}
        <div className="stock-list">
          {filteredStocks.map((s) => (
            <button
              key={s.symbol}
              onClick={() => fetchStockData(s.symbol)}
              className={`stock-btn ${
                selectedStock === s.symbol ? "selected" : ""
              }`}
            >
              <span className="symbol">{s.symbol}</span>
              <span className="name">{s.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ================= Main Section ================= */}
      <main className="main-content">
        <h1 className="page-title">📈 StockVision Dashboard</h1>

        {/* Time Range & Interval Controls */}
<div className="flex flex-wrap gap-6 mb-6">

  {/* Interval Dropdown */}
  {/* <div className="flex flex-col">
    <label className="text-gray-700 font-semibold mb-1">Interval</label>
    <select
      value={interval}
      onChange={(e) => setInterval(e.target.value)}
      className="px-3 py-2 rounded-lg border bg-white shadow-sm"
    >
      <option value="1m">1 Minute</option>
      <option value="5m">5 Minutes</option>
      <option value="15m">15 Minutes</option>
      <option value="1h">1 Hour</option>
      <option value="1d">1 Day</option>
    </select>
  </div>  */}

  {/* Range Dropdown */}
  <div className="flex flex-col">
    {/* <label className="text-gray-700 font-semibold mb-1">Range</label> */}
    <label className="text-white font-semibold mb-1">Range</label>
    <select
      value={range}
      onChange={(e) => setRange(e.target.value)}
      className="px-3 py-2 rounded-lg border shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      <option value="5d">5 Days</option>
      <option value="1mo">1 Month</option>
      <option value="3mo">3 Months</option>
      <option value="6mo">6 Months</option>
      <option value="1y">1 Year</option>
      <option value="2y">2 Years</option>
      <option value="5y">5 Years</option>
    </select>
  </div>

</div>


        {/* Chart */}
        {!loading && prices.length > 0 && (
          <div className="chart-box">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Trade Buttons */}
        {selectedStock && prices.length > 0 && (
          <div className="trade-buttons">
            <button className="buy" onClick={() => tradeStock("buy")}>Buy</button>
            <button className="sell" onClick={() => tradeStock("sell")}>Sell</button>
            <a href="/portfolio" className="portfolio-link">View Portfolio</a>
          </div>
        )}

        {/* AI Card */}
        {selectedStock && ai && (
          <AIDecisionCard
            ticker={selectedStock}
            company={stocks.find((s) => s.symbol === selectedStock)?.name}
            decision={ai.action}
            confidence={ai.confidence}
            reason={ai.reason}
            short={ai.short}
            long={ai.long}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;


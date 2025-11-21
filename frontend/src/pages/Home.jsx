import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import "../index.css";
import "../styles/styles.css";
import axios from "axios";
import { RefreshCcw } from "lucide-react";

export default function Home() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8000/api/market/highlights")
//       .then((res) => {
//         setGainers(res.data.gainers || []);
//         setLosers(res.data.losers || []);
//       })
//       .catch((err) => console.error("Error loading highlights:", err));
//   }, []);
// useEffect(() => {
//   const fetchHighlights = () => {
//     axios.get("http://127.0.0.1:8000/api/market/highlights")
//       .then((res) => {
//         setGainers(res.data.gainers || []);
//         setLosers(res.data.losers || []);
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch(err => console.error("Error loading highlights:", err));
//   };

//   fetchHighlights(); // initial load
//   const interval = setInterval(fetchHighlights, 60000); // refresh every 60 sec

//   return () => clearInterval(interval);
// }, []);

useEffect(() => {
  fetchHighlights();
  const interval = setInterval(fetchHighlights, 60000); // auto refresh every 1 min
  return () => clearInterval(interval);
}, []);

const fetchHighlights = () => {
  axios.get("http://127.0.0.1:8000/api/market/highlights")
    .then((res) => {
      setGainers(res.data.gainers || []);
      setLosers(res.data.losers || []);
      setLastUpdated(new Date().toLocaleTimeString());
    })
    .catch(err => console.error("Error loading highlights:", err));
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      {/* Animated Gradient Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
          Welcome to StockVision AI
        </h1>

        <p className="text-gray-300 max-w-xl mx-auto">
          AI-powered stock analytics and real-time market simulation platform.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          to="/dashboard"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition"
        >
          Go to Dashboard
        </Link>

        <Link
          to="/about"
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition"
        >
          Learn More
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <h3 className="text-xl font-semibold text-blue-400 mb-2"> Live Market Data</h3>
          <p className="text-gray-400 text-sm">
            Get the latest stock prices and charts updated in real-time.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <h3 className="text-xl font-semibold text-blue-400 mb-2"> AI Predictions</h3>
          <p className="text-gray-400 text-sm">
            AI engine analyzes data to recommend buy, sell, or hold decisions.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <h3 className="text-xl font-semibold text-blue-400 mb-2"> Dashboard Insights</h3>
          <p className="text-gray-400 text-sm">
            View performance charts, historical trends, and portfolio summaries.
          </p>
        </div>
      </div>

      {/* Market Highlights */}
<div className="mt-16 w-full max-w-6xl mx-auto">
  <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400"> Market Highlights</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Top Gainers */}
    <div className="bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-2xl font-semibold text-green-400 mb-4"> Top Gainers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gainers.length > 0 ? (
          gainers.map((g, i) => (
            <div
              key={i}
              className="bg-gray-900 p-4 rounded-xl border border-gray-700 hover:border-green-400 hover:scale-105 transform transition duration-300"
            >
              <h4 className="text-lg font-bold text-white">{g.symbol}</h4>
              <p className="text-gray-400 text-sm">Price: ${g.price}</p>
              <p className="text-green-400 font-semibold">+{g.change}%</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>

    {/* Top Losers */}
    <div className="bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h3 className="text-2xl font-semibold text-red-400 mb-4">Top Losers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {losers.length > 0 ? (
          losers.map((l, i) => (
            <div
              key={i}
              className="bg-gray-900 p-4 rounded-xl border border-gray-700 hover:border-red-400 hover:scale-105 transform transition duration-300"
            >
              <h4 className="text-lg font-bold text-white">{l.symbol}</h4>
              <p className="text-gray-400 text-sm">Price: ${l.price}</p>
              <p className="text-red-400 font-semibold">{l.change}%</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  </div>
</div>

    </div>
  );
}

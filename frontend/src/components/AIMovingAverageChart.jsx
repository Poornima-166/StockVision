import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(CategoryScale, LinearScale, TimeScale, LineElement, PointElement, Tooltip, Legend);

const AIMovingAverageChart = ({ data }) => {
  if (!data || !data.length) return null;

  const labels = data.map((d) => new Date(d.time * 1000));
  const shortMA = data.map((d) => d.shortMA);
  const longMA = data.map((d) => d.longMA);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Short MA (5-day)",
        data: shortMA,
        borderColor: "#10B981", // green
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: "Long MA (20-day)",
        data: longMA,
        borderColor: "#3B82F6", // blue
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: { unit: "day" },
        ticks: { color: "#aaa" },
        grid: { color: "#333" },
      },
      y: {
        ticks: { color: "#aaa" },
        grid: { color: "#333" },
      },
    },
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { mode: "index", intersect: false },
    },
  };

  return (
    <div className="bg-gray-900 rounded-2xl mt-6 p-4 shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-2">
        📊 Moving Average Crossover
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AIMovingAverageChart;

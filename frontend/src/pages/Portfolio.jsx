// frontend/src/pages/Portfolio.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = "http://127.0.0.1:8000";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    symbol: "",
    action: "buy",
    quantity: 1,
    price: ""
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/api/portfolio`);
      setPortfolio(res.data.portfolio || []);
      setTrades(res.data.trades || []);
    } catch (e) {
      console.error("Failed to load portfolio", e);
      alert("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitTrade = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        symbol: form.symbol,
        action: form.action,
        quantity: parseInt(form.quantity, 10),
        price: form.price ? parseFloat(form.price) : undefined,
      };
      const res = await axios.post(`${BACKEND}/api/trade`, payload);
      alert(res.data.message);
      setForm({ symbol: "", action: "buy", quantity: 1, price: "" });
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.detail || "Trade failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Portfolio</h2>

      <div className="mb-6">
        <form onSubmit={submitTrade} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm">Symbol</label>
            <input value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value.toUpperCase()})}
              required className="border px-2 py-1 rounded" />
          </div>

          <div>
            <label className="block text-sm">Action</label>
            <select value={form.action} onChange={e => setForm({...form, action: e.target.value})}
              className="border px-2 py-1 rounded">
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Quantity</label>
            <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
              required className="border px-2 py-1 rounded w-24" />
          </div>

          <div>
            <label className="block text-sm">Price (optional)</label>
            <input value={form.price} onChange={e => setForm({...form, price: e.target.value})}
              className="border px-2 py-1 rounded w-36" />
          </div>

          <div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Holdings</h3>
          {loading ? <p>Loading...</p> : (
            portfolio.length ? (
              <ul>
                {portfolio.map(p => (
                  <li key={p.symbol} className="py-1 flex justify-between">
                    <span>{p.symbol}</span>
                    <strong>{p.quantity}</strong>
                  </li>
                ))}
              </ul>
            ) : <p>No holdings yet.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recent Trades & Recommendations</h3>
          {loading ? <p>Loading...</p> : (
            trades.length ? (
              <ul>
                {trades.map(t => (
                  <li key={t.id} className="py-2 border-b last:border-b-0">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{t.symbol} <span className="text-sm text-gray-500">({t.action})</span></div>
                        <div className="text-sm text-gray-600">{t.note || ""}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{t.quantity || "-"}</div>
                        <div className="text-xs text-gray-500">{new Date(t.time).toLocaleString()}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p>No trades yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

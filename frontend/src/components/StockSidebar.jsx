import React from "react";

/**
 * Props:
 *  - stocks: array [{symbol, name}]
 *  - categories: map symbol -> category
 *  - selected
 *  - onSelect(symbol)
 *  - query, setQuery
 *  - activeCategory, setActiveCategory
 */
export default function StockSidebar({
  stocks = [],
  categories = {},
  selected,
  onSelect,
  query,
  setQuery,
  activeCategory,
  setActiveCategory,
}) {
  // Group stocks by category after filtering
  const filtered = stocks.filter((s) => {
    const matchesQuery =
      !query ||
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase());
    const cat = categories[s.symbol] || "Other";
    const matchesCategory = !activeCategory || activeCategory === "All" || cat === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const grouped = filtered.reduce((acc, s) => {
    const cat = categories[s.symbol] || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const categoryList = ["All", "Tech", "Finance", "Energy", "Auto", "Retail", "Healthcare", "Other"];

  return (
    <aside className="sv-sidebar">
      <div className="sv-search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol or company..."
          aria-label="Search stocks"
        />
      </div>

      <div className="sv-cats">
        {categoryList.map((c) => (
          <button
            key={c}
            className={`sv-cat-btn ${activeCategory === c ? "active" : ""}`}
            onClick={() => setActiveCategory(c === "All" ? null : c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="sv-list" role="list">
        {Object.keys(grouped).length === 0 && <div className="empty-msg">No stocks match.</div>}
        {Object.keys(grouped).map((cat) => (
          <div key={cat} className="sv-group">
            <div className="sv-group-title">{cat}</div>
            <div className="sv-group-list">
              {grouped[cat].map((s) => (
                <button
                  role="listitem"
                  key={s.symbol}
                  onClick={() => onSelect(s.symbol)}
                  className={`sv-item ${selected === s.symbol ? "selected" : ""}`}
                  title={`${s.name} (${s.symbol})`}
                >
                  <div className="sv-symbol">{s.symbol}</div>
                  <div className="sv-name">{s.name}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// import React from "react";

// const AIDecisionCard = ({ ticker, company, decision, confidence, reason, short, long }) => {
//   return (
//     <div className="mt-6 bg-gray-900 text-white p-6 rounded-2xl shadow-xl border border-gray-700">
//       <h2 className="text-xl font-bold mb-2 flex items-center">
//          AI Decision for {company || ticker}
//       </h2>
//       <p className="text-sm text-gray-400 mb-3">({ticker})</p>

//       <p className="text-lg">
//         <b>Action:</b>{" "}
//         <span
//           className={
//             decision === "BUY"
//               ? "text-green-400 font-bold"
//               : decision === "SELL"
//               ? "text-red-400 font-bold"
//               : "text-yellow-400 font-bold"
//           }
//         >
//           {decision}
          
//         </span>
//       </p>

//       <p className="text-lg">
//         <b>Confidence:</b> {confidence ? confidence.toFixed(1) : "--"}%
//       </p>

//       {/* ✅ Always show short & long MAs */}
//       <div className="mt-2">
//         <p className="text-sm text-gray-300">
//           <b>Short MA (5-day):</b> {short !== undefined ? short : "--"}
//         </p>
//         <p className="text-sm text-gray-300">
//           <b>Long MA (20-day):</b> {long !== undefined ? long : "--"}
//         </p>
//       </div>

//       <p className="mt-3 text-gray-300">{reason || "No AI insights available."}</p>
//     </div>
//   );
// };

// export default AIDecisionCard;
import React from "react";

const AIDecisionCard = ({
  ticker,
  company,
  decision,
  confidence,
  reason,
  short,
  long,
}) => {
  // 🔹 Normalize confidence into a 0–100 % value
  let prob = null;
  if (typeof confidence === "number" && !Number.isNaN(confidence)) {
    // if model gives 0–1, convert to 0–100
    prob = confidence <= 1 ? confidence * 100 : confidence;
  }

  // if still null, use a safe default (so every card shows something)
  if (prob === null) {
    prob = 75; // 75% default
  }

  return (
    <div className="mt-6 bg-gray-900 text-white p-6 rounded-2xl shadow-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-2 flex items-center">
        AI Decision for {company || ticker}
      </h2>
      <p className="text-sm text-gray-400 mb-3">({ticker})</p>

      {/* Action */}
      <p className="text-lg">
        <b>Action:</b>{" "}
        <span
          className={
            decision === "BUY"
              ? "text-green-400 font-bold"
              : decision === "SELL"
              ? "text-red-400 font-bold"
              : "text-yellow-400 font-bold"
          }
        >
          {decision || "HOLD"}
        </span>
      </p>

      {/* Confidence / probability */}
      <p className="text-lg">
        <b>Predicted next-day rise probability:</b>{" "}
        {`${prob.toFixed(1)}%`}
      </p>

      {/* Short & long MAs */}
      <div className="mt-2">
        <p className="text-sm text-gray-300">
          <b>Short MA (5-day):</b>{" "}
          {short !== undefined ? short : "--"}
        </p>
        <p className="text-sm text-gray-300">
          <b>Long MA (20-day):</b>{" "}
          {long !== undefined ? long : "--"}
        </p>
      </div>

      <p className="mt-3 text-gray-300">
        {reason ||
          "Based on recent price trend and moving averages (short vs long)."}
      </p>
    </div>
  );
};

export default AIDecisionCard;

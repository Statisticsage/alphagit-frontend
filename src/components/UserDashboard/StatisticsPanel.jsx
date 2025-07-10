import React from "react";

export default function StatisticsPanel({ stats, regResult }) {
  return (
    <div className="stats-container">
      <h3>📈 Regression Analysis</h3>
      <p>y = {regResult.slope}x + {regResult.intercept} | R²: {regResult.r2} | {regResult.trend}</p>

      <h3>📉 Statistics</h3>
      <p>
        Avg: {stats.avg} | Median: {stats.median} | Min: {stats.min} | Max: {stats.max} | Std Dev: {stats.stdDev}
      </p>
    </div>
  );
}

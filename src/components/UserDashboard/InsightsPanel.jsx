import React from "react";

export default function InsightsPanel({ xAxis, yAxis, stats, regResult, filteredData }) {
  if (!xAxis || !yAxis || !filteredData.length) return null;

  const totalRows = filteredData.length;
  const missingY = filteredData.filter(item => !item[yAxis]).length;
  const topY = [...filteredData]
    .map(item => item[yAxis])
    .filter(Boolean)
    .reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
  const topValues = Object.entries(topY)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([val, count]) => `${val} (${count})`)
    .join(", ");

  return (
    <div className="insights-panel">
      <h3>🔍 Data Insights</h3>
      <ul>
        <li><strong>Total Rows:</strong> {totalRows}</li>
        <li><strong>Missing Y values:</strong> {missingY}</li>
        <li><strong>Top Y values:</strong> {topValues}</li>
        <li><strong>Regression Trend:</strong> {regResult.trend || "N/A"}</li>
        <li><strong>R² Score:</strong> {regResult.r2 || "N/A"}</li>
        <li><strong>Avg (Y):</strong> {stats.avg} | <strong>Median:</strong> {stats.median}</li>
        <li><strong>Std Dev (Y):</strong> {stats.stdDev}</li>
      </ul>
    </div>
  );
}

import regression from "regression";

export function filterData(data, xAxis, yAxis) {
  return data.filter(item => item[xAxis] !== undefined && item[yAxis] !== undefined && !isNaN(parseFloat(item[yAxis])));
}

export function computeStatistics(filteredData, yAxis) {
  const vals = filteredData.map(item => parseFloat(item[yAxis])).filter(Number.isFinite);
  if (!vals.length) return {};
  const avg = vals.reduce((a,b) => a + b, 0)/vals.length;
  const stdDev = Math.sqrt(vals.reduce((s,v) => s + (v-avg)**2, 0)/vals.length);
  const sorted = [...vals].sort((a,b)=>a-b);
  const median = sorted[Math.floor(sorted.length/2)];
  return {
    avg: avg.toFixed(4),
    min: Math.min(...vals).toFixed(4),
    max: Math.max(...vals).toFixed(4),
    median: median.toFixed(4),
    stdDev: stdDev.toFixed(4),
  };
}

export function computeRegression(filteredData, xAxis, yAxis) {
  const pairs = filteredData.map(item => [parseFloat(item[xAxis]), parseFloat(item[yAxis])]).filter(pair => pair.every(Number.isFinite));
  if (!pairs.length) return {};
  const res = regression.linear(pairs);
  return {
    slope: res.equation[0].toFixed(4),
    intercept: res.equation[1].toFixed(4),
    r2: res.r2.toFixed(4),
    trend: res.equation[0] > 0 ? "📈 Upward Trend" : "📉 Downward Trend",
  };
}

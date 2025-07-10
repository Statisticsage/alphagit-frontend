import React from "react";
import {
  Bar, Line, Pie, Scatter, Doughnut, Radar, Bubble, PolarArea,
} from "react-chartjs-2";

const chartMap = {
  bar: Bar,
  line: Line,
  pie: Pie,
  scatter: Scatter,
  doughnut: Doughnut,
  radar: Radar,
  bubble: Bubble,
  polar: PolarArea,
};

export default function ChartDisplay({ chartRef, chartType, chartData, options }) {
  const ChartComp = chartMap[chartType] || Bar;

  const handleRef = (chartInstance) => {
    if (chartInstance && chartRef) {
      chartRef.current = chartInstance; // ✅ Assign Chart.js instance directly
    }
  };

  const isValid = chartData?.datasets?.some(
    ds => Array.isArray(ds.data) && ds.data.length > 0
  );

  return (
    <div className="chart-wrapper" style={{ height: 500, width: "100%", marginTop: 16 }}>
      {isValid ? (
        <ChartComp ref={handleRef} data={chartData} options={options} />
      ) : (
        <p style={{ textAlign: "center", color: "#888", paddingTop: 32 }}>
          ⚠️ No valid data to display.
        </p>
      )}
    </div>
  );
}

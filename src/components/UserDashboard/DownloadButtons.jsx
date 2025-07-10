import React from "react";
import { exportToExcel } from "./Utils/fileUtils";

export default function DownloadButtons({ chartRef, filteredData }) {
  const handleResetZoom = () => {
    if (!chartRef.current) {
      console.warn("❌ chartRef.current is null");
      return;
    }
    if (typeof chartRef.current.resetZoom !== "function") {
      console.warn("❌ resetZoom() is not a function", chartRef.current);
      return;
    }

    console.log("✅ Calling resetZoom...");
    chartRef.current.resetZoom();
  };

  const handleExport = () => {
    if (!filteredData || !Array.isArray(filteredData) || !filteredData.length) {
      alert("⚠️ No data to export.");
      return;
    }

    console.log("📤 Exporting to Excel...");
    exportToExcel(filteredData);
  };

  return (
    <div className="download-buttons">
      <button onClick={handleResetZoom}>🔄 Reset Zoom</button>
      <button onClick={handleExport}>📤 Export to Excel</button>
    </div>
  );
}

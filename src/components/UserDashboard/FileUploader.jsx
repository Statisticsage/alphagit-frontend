import React from "react";
import * as XLSX from "xlsx";

export default function FileUploader({ setData, setFilteredData, setLoading, setDataUploaded }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      alert("❌ Unsupported file format. Only CSV or Excel files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("⚠️ File too large! Max: 10MB.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (ev) => {
      try {
        let jsonData = [];

        if (ext === "csv") {
          const text = ev.target.result;
          const lines = text.trim().split("\n");
          const headers = lines[0].split(",");
          jsonData = lines.slice(1).map((line) => {
            const values = line.split(",");
            return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i]?.trim()]));
          });
        } else {
          const arr = new Uint8Array(ev.target.result);
          const wb = XLSX.read(arr, { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          jsonData = XLSX.utils.sheet_to_json(sheet);
        }

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          throw new Error("No valid data found.");
        }

        setData(jsonData);
        setFilteredData(jsonData);
        setDataUploaded(true);
      } catch (err) {
        console.error("❌ File parsing error:", err);
        alert("❌ Failed to load file. Ensure it's a valid CSV or Excel format.");
      } finally {
        setLoading(false);
      }
    };

    if (ext === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <input
      type="file"
      accept=".csv,.xlsx,.xls"
      onChange={handleFileUpload}
      className="dashboard-input-file"
      aria-label="Upload CSV or Excel file"
    />
  );
}

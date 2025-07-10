import React from "react";
import "./DataPreview.css";

export default function DataPreview({ data }) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="data-preview">
      <h3>🧾 Preview of Uploaded Data</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col}>{String(row[col] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note">Showing first 10 rows only.</p>
      </div>
    </div>
  );
}

import React, { useMemo } from "react";
import "./CorrelationMatrix.css";

function computeCorrelationMatrix(data) {
  const cols = Object.keys(data[0] || {}).filter(key =>
    data.every(row => typeof row[key] === "number" || !isNaN(parseFloat(row[key])))
  );

  const matrix = cols.map(col1 =>
    cols.map(col2 => {
      const x = data.map(row => parseFloat(row[col1])).filter(Number.isFinite);
      const y = data.map(row => parseFloat(row[col2])).filter(Number.isFinite);

      const n = Math.min(x.length, y.length);
      if (n === 0) return 0;

      const meanX = x.reduce((a, b) => a + b, 0) / n;
      const meanY = y.reduce((a, b) => a + b, 0) / n;
      const num = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
      const den = Math.sqrt(
        x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) *
        y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0)
      );

      return den === 0 ? 0 : num / den;
    })
  );

  return { cols, matrix };
}

export default function CorrelationMatrix({ data }) {
  const { cols, matrix } = useMemo(() => computeCorrelationMatrix(data), [data]);

  if (!cols.length) return null;

  return (
    <div className="correlation-matrix">
      <h3>📈 Correlation Matrix</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            {cols.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {cols.map((rowCol, i) => (
            <tr key={rowCol}>
              <td><strong>{rowCol}</strong></td>
              {matrix[i].map((value, j) => (
                <td
                  key={j}
                  style={{
                    background: `rgba(33, 150, 243, ${Math.abs(value)})`,
                    color: Math.abs(value) > 0.5 ? "#fff" : "#000"
                  }}
                >
                  {value.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

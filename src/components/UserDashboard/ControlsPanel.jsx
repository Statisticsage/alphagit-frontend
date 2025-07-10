import React from "react";

export default function ControlsPanel({
  dataSample = {}, chartType, setChartType,
  xAxis, setXAxis, yAxis, setYAxis,
  secondaryYAxis, setSecondaryYAxis,
  showHistogram, setShowHistogram,
  showKDE, setShowKDE, disabled
}) {
  const columns = Object.keys(dataSample || {});

  return (
    <div className="dashboard-controls">
      <select value={chartType} onChange={e => setChartType(e.target.value)}>
        {["bar","line","pie","scatter","doughnut","radar","bubble","polar"].map(type => (
          <option key={type} value={type}>{type.toUpperCase()}</option>
        ))}
      </select>

      {["X", "Y", "Secondary Y"].map((label, i) => {
        const value = i === 0 ? xAxis : i === 1 ? yAxis : secondaryYAxis;
        const setter = i === 0 ? setXAxis : i === 1 ? setYAxis : setSecondaryYAxis;

        return (
          <select
            key={label}
            value={value}
            onChange={e => setter(e.target.value)}
            disabled={disabled}
          >
            <option value="">{`Select ${label}`}</option>
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        );
      })}

      <label>
        <input type="checkbox" checked={showHistogram} onChange={() => setShowHistogram(prev => !prev)} />
        Show Histogram
      </label>

      <label>
        <input type="checkbox" checked={showKDE} onChange={() => setShowKDE(prev => !prev)} />
        Show KDE
      </label>
    </div>
  );
}

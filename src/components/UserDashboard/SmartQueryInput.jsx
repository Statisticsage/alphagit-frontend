import React, { useState } from "react";

export default function SmartQueryInput({ data, setXAxis, setYAxis, setChartType }) {
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleInterpret = () => {
    if (!query.trim()) {
      setFeedback("⚠️ Please enter a query.");
      return;
    }

    if (!data.length) {
      setFeedback("⚠️ Upload a dataset first.");
      return;
    }

    const queryLower = query.toLowerCase();
    const headers = Object.keys(data[0]);

    // Detect chart type from query
    let detectedType = "bar";
    const chartKeywords = {
      scatter: ["scatter", "scatterplot"],
      line: ["line", "trend"],
      pie: ["pie"],
      doughnut: ["doughnut"],
      polar: ["polar"],
      bubble: ["bubble"],
      bar: ["bar", "column", "histogram"],
    };

    for (const [type, keywords] of Object.entries(chartKeywords)) {
      if (keywords.some(kw => queryLower.includes(kw))) {
        detectedType = type;
        break;
      }
    }

    // Try to intelligently extract x and y based on known patterns
    const vsMatch = queryLower.match(/(\w+)\s*(vs|by|against)\s*(\w+)/);
    let xCol = "", yCol = "";

    if (vsMatch) {
      const [_, first, , second] = vsMatch;
      xCol = headers.find(h => h.toLowerCase().includes(first));
      yCol = headers.find(h => h.toLowerCase().includes(second));
    }

    // Fallback to any two matching headers
    if (!xCol || !yCol) {
      const matched = headers.filter(h => queryLower.includes(h.toLowerCase()));
      const [first, second] = matched;
      xCol = xCol || first;
      yCol = yCol || second;
    }

    if (!xCol || !yCol) {
      setFeedback("⚠️ Couldn't detect X and Y axes. Try mentioning columns like 'sales vs year'.");
      return;
    }

    setXAxis(xCol);
    setYAxis(yCol);
    setChartType(detectedType);
    setFeedback(`✅ Showing ${detectedType} of ${xCol} vs ${yCol}`);
  };

  return (
    <div className="smart-query">
      <h3>💬 Ask a Question</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. gdp vs inflation scatter plot"
      />
      <button onClick={handleInterpret}>Generate Chart</button>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}

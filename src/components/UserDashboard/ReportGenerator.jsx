import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ReportGenerator({ chartRef, stats, regResult, xAxis, yAxis }) {
  const handleGeneratePDF = async () => {
    const chartInstance = chartRef.current;
    const canvas = chartInstance?.canvas;

    if (!canvas) {
      alert("❌ Chart canvas is not available or not yet rendered.");
      console.warn("chartRef.current:", chartInstance);
      return;
    }

    try {
      // Ensures the browser has laid out the DOM before capturing
      await new Promise(requestAnimationFrame);

      const image = await html2canvas(canvas, { useCORS: true });
      const imgData = image.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(imgData, "PNG", 10, 10, 180, 80);
      pdf.setFontSize(12);
      pdf.text("📊 Summary Report", 10, 100);
      pdf.text(`X-Axis: ${xAxis}`, 10, 110);
      pdf.text(`Y-Axis: ${yAxis}`, 10, 117);

      if (stats) {
        pdf.text("Statistics:", 10, 127);
        pdf.text(`- Avg: ${stats.avg}`, 15, 134);
        pdf.text(`- Min: ${stats.min}`, 15, 141);
        pdf.text(`- Max: ${stats.max}`, 15, 148);
        pdf.text(`- Median: ${stats.median}`, 15, 155);
        pdf.text(`- Std Dev: ${stats.stdDev}`, 15, 162);
      }

      if (regResult?.slope !== undefined) {
        pdf.text("Regression:", 10, 172);
        pdf.text(
          `y = ${regResult.slope}x + ${regResult.intercept} (R² = ${regResult.r2})`,
          15,
          179
        );
        pdf.text(`${regResult.trend}`, 15, 186);
      }

      pdf.save("data_report.pdf");
    } catch (err) {
      console.error("❌ Failed to export PDF:", err);
      alert("Failed to export PDF. Check the console for more details.");
    }
  };

  return (
    <div style={{ marginTop: "1rem", textAlign: "center" }}>
      <button onClick={handleGeneratePDF} className="download-button">
        📄 Export Full Report (PDF)
      </button>
    </div>
  );
}

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Converts filtered data to Excel and triggers download
 * @param {Array} data - Array of JSON objects to export
 * @param {string} filename - Desired filename, default is "filtered_data.xlsx"
 */
export function exportToExcel(data, filename = "filtered_data.xlsx") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "FilteredData");
  XLSX.writeFile(wb, filename);
}

/**
 * Captures a chart DOM element as PDF
 * @param {HTMLCanvasElement} canvas - The chart canvas element
 * @param {string} filename - Desired filename, default is "chart-report.pdf"
 */
export async function exportChartToPDF(canvas, filename = "chart-report.pdf") {
  if (!canvas) return;

  const canvasImage = await html2canvas(canvas);
  const pdf = new jsPDF();
  pdf.addImage(canvasImage.toDataURL("image/png"), "PNG", 10, 10, 190, 100);
  pdf.save(filename);
}

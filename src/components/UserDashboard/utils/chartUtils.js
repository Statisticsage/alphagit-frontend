import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  RadialLinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

// ✅ Register all necessary components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  RadialLinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

// 🎨 Color palette
export const palette = [
  "#1b9e77",
  "#d95f02",
  "#7570b3",
  "#e7298a",
  "#66a61e",
  "#e6ab02",
  "#a6761d",
  "#666"
];

// 📊 Chart options factory
export function getChartOptions(xAxis, yAxis, secondaryYAxis) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const x = ctx.label ?? ctx.raw?.x;
            const y = ctx.raw?.y ?? ctx.raw;
            return `${ctx.dataset.label}: (${x}, ${y})`;
          }
        }
      },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "xy" },
      },
    },
    scales: {
      x: { title: { display: true, text: xAxis } },
      y: {
        type: "linear",
        position: "left",
        title: { display: true, text: yAxis }
      },
      y1: {
        type: "linear",
        position: "right",
        title: { display: true, text: secondaryYAxis || "Secondary Y" },
        grid: { drawOnChartArea: false }
      },
      y2: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Histogram" },
        grid: { drawOnChartArea: false }
      },
      y3: {
        type: "linear",
        position: "right",
        title: { display: true, text: "KDE" },
        grid: { drawOnChartArea: false }
      },
    },
  };
}

import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import ChartDisplay from "./ChartDisplay";
import ControlsPanel from "./ControlsPanel";
import FileUploader from "./FileUploader";
// import StatisticsPanel from "./StatisticsPanel"; // intentionally removed
//import DownloadButtons from "./DownloadButtons";
import Chatbot from "../Chatbot";
import InsightsPanel from "./InsightsPanel";
import DataPreview from "./DataPreview";
import SmartQueryInput from "./SmartQueryInput";
import CorrelationMatrix from "./CorrelationMatrix";
import ReportGenerator from "./ReportGenerator";
import { filterData, computeStatistics, computeRegression } from "./utils/dataUtils";
import { getChartOptions, palette } from "./utils/chartUtils";
import "../../styles/UserDashboard.css";
import { ClipLoader } from "react-spinners";

const UserDashboard = memo(() => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [secondaryYAxis, setSecondaryYAxis] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState({});
  const [regResult, setRegResult] = useState({});
  const [dataUploaded, setDataUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHistogram, setShowHistogram] = useState(true);
  const [showKDE, setShowKDE] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    if (xAxis && yAxis && data.length) {
      const fd = filterData(data, xAxis, yAxis);
      setFilteredData(fd);
    }
  }, [xAxis, yAxis, data]);

  useEffect(() => {
    if (filteredData.length) {
      setStats(computeStatistics(filteredData, yAxis));
      setRegResult(computeRegression(filteredData, xAxis, yAxis));
    }
  }, [filteredData, xAxis, yAxis]);

  const chartData = useMemo(() => {
    if (!xAxis || !yAxis || !filteredData.length) return { labels: [], datasets: [] };

    const isXY = ["scatter", "line", "bubble"].includes(chartType);
    const isCategory = ["pie", "doughnut", "polar"].includes(chartType);

    if (isCategory) {
      const values = filteredData.map(item => parseFloat(item[yAxis]) || 0);
      const labels = filteredData.map(item => String(item[xAxis] ?? ""));
      return {
        labels,
        datasets: [{
          label: `${yAxis} by ${xAxis}`,
          data: values,
          backgroundColor: palette.slice(0, values.length),
        }],
      };
    }

    const datasets = [{
      label: `${xAxis} vs ${yAxis}`,
      data: filteredData.map(item => {
        const x = item[xAxis];
        const y = parseFloat(item[yAxis]) || 0;
        return isXY ? { x: isNaN(x) ? String(x) : +x, y } : y;
      }),
      borderColor: palette[0],
      backgroundColor: palette[0] + "88",
      borderWidth: 2,
      ...(isXY && { parsing: false }),
    }];

    if (secondaryYAxis) {
      datasets.push({
        label: `${xAxis} vs ${secondaryYAxis}`,
        data: filteredData.map(item => {
          const x = item[xAxis];
          const y = parseFloat(item[secondaryYAxis]) || 0;
          return isXY ? { x: isNaN(x) ? String(x) : +x, y } : y;
        }),
        borderColor: palette[1],
        backgroundColor: palette[1] + "88",
        borderWidth: 2,
        yAxisID: "y1",
        ...(isXY && { parsing: false }),
      });
    }

    if (showHistogram) {
      datasets.push({
        label: "Histogram",
        data: filteredData.map(item => parseFloat(item[yAxis]) || 0),
        backgroundColor: palette[2] + "88",
        type: "bar",
        yAxisID: "y2",
      });
    }

    if (showKDE) {
      datasets.push({
        label: "KDE Estimate",
        data: filteredData.map(item => parseFloat(item[yAxis]) || 0),
        backgroundColor: palette[3] + "88",
        type: "line",
        yAxisID: "y3",
      });
    }

    return {
      labels: isXY ? undefined : filteredData.map(item => item[xAxis]),
      datasets,
    };
  }, [filteredData, xAxis, yAxis, secondaryYAxis, showHistogram, showKDE, chartType]);

  const options = getChartOptions(xAxis, yAxis, secondaryYAxis);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 User Analytics Dashboard</h1>

      <FileUploader
        setData={setData}
        setFilteredData={setFilteredData}
        setLoading={setLoading}
        setDataUploaded={setDataUploaded}
      />

      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color="#123abc" loading={loading} />
          <p>Loading data, please wait...</p>
        </div>
      ) : (
        <>
          {dataUploaded && <DataPreview data={data} />}
          {dataUploaded && (
            <SmartQueryInput
              data={data}
              setXAxis={setXAxis}
              setYAxis={setYAxis}
              setChartType={setChartType}
            />
          )}

          <ControlsPanel
            dataSample={data[0] || {}}
            chartType={chartType}
            setChartType={setChartType}
            xAxis={xAxis}
            setXAxis={setXAxis}
            yAxis={yAxis}
            setYAxis={setYAxis}
            secondaryYAxis={secondaryYAxis}
            setSecondaryYAxis={setSecondaryYAxis}
            showHistogram={showHistogram}
            setShowHistogram={setShowHistogram}
            showKDE={showKDE}
            setShowKDE={setShowKDE}
            disabled={!dataUploaded}
          />

          {xAxis && yAxis && filteredData.length > 0 && (
            <>
              <InsightsPanel
                xAxis={xAxis}
                yAxis={yAxis}
                stats={stats}
                regResult={regResult}
                filteredData={filteredData}
              />
              <CorrelationMatrix data={data} />

              <div className="chart-container">
                <ChartDisplay
                  chartRef={chartRef}
                  chartType={chartType}
                  chartData={chartData}
                  options={options}
                />
              </div>
            </>
          )}
        </>
      )}

      <div className="chart-tools"><br /><br /><br /><br /><br />
        <button
    className="reset-zoom-btn"
    onClick={() => {
      if (chartRef.current && typeof chartRef.current.resetZoom === "function") {
        chartRef.current.resetZoom();
      } else {
        console.warn("Chart instance not ready or resetZoom() not available.");
      }
    }}
  >
    🔄 Reset Zoom
  </button>
   <ReportGenerator
        chartRef={chartRef}
        stats={stats}
        regResult={regResult}
        xAxis={xAxis}
        yAxis={yAxis}
      />
</div>


      <Chatbot dashboardData={filteredData} />
    </div>
  );
});

export default UserDashboard;

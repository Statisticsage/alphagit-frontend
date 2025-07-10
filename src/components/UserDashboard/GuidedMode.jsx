import React, { useState } from "react";
import FileUploader from "./FileUploader";
import DataPreview from "./DataPreview";
import ControlsPanel from "./ControlsPanel";
import ChartDisplay from "./ChartDisplay";
import StatisticsPanel from "./StatisticsPanel";
import DownloadButtons from "./DownloadButtons";
import ReportGenerator from "./ReportGenerator";
import { getChartOptions, palette } from "./utils/chartUtils";

export default function GuidedMode({ data, setData, chartRef }) {
  const [step, setStep] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [dataUploaded, setDataUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [secondaryYAxis, setSecondaryYAxis] = useState("");
  const [showHistogram, setShowHistogram] = useState(true);
  const [showKDE, setShowKDE] = useState(true);

  const [stats, setStats] = useState({});
  const [regResult, setRegResult] = useState({});

  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => Math.max(1, prev - 1));

  const options = getChartOptions(xAxis, yAxis, secondaryYAxis);

  const chartData = {
    labels: filteredData.map(row => row[xAxis]),
    datasets: [
      {
        label: `${xAxis} vs ${yAxis}`,
        data: filteredData.map(row => ({
          x: row[xAxis],
          y: parseFloat(row[yAxis]) || 0
        })),
        backgroundColor: palette[0] + "88",
        borderColor: palette[0],
        borderWidth: 2,
      }
    ]
  };

  return (
    <div className="guided-mode">
      <h2>👩‍🏫 Guided Analysis Mode</h2>

      {step === 1 && (
        <>
          <h3>Step 1: Upload your file</h3>
          <FileUploader
            setData={setData}
            setFilteredData={setFilteredData}
            setDataUploaded={setDataUploaded}
            setLoading={setLoading}
          />
          {dataUploaded && <button onClick={next}>Next ➡️</button>}
        </>
      )}

      {step === 2 && (
        <>
          <h3>Step 2: Preview your data</h3>
          <DataPreview data={data} />
          <button onClick={back}>⬅️ Back</button>
          <button onClick={next}>Next ➡️</button>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Step 3: Select chart and axes</h3>
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
          <button onClick={back}>⬅️ Back</button>
          {xAxis && yAxis && <button onClick={next}>Next ➡️</button>}
        </>
      )}

      {step === 4 && (
        <>
          <h3>Step 4: View Visualizations</h3>
          <ChartDisplay
            chartRef={chartRef}
            chartType={chartType}
            chartData={chartData}
            options={options}
          />
          <StatisticsPanel stats={stats} regResult={regResult} />
          <DownloadButtons chartRef={chartRef} filteredData={filteredData} />
          <ReportGenerator
            chartRef={chartRef}
            stats={stats}
            regResult={regResult}
            xAxis={xAxis}
            yAxis={yAxis}
          />
          <button onClick={back}>⬅️ Back</button>
        </>
      )}
    </div>
  );
}

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "react-chartjs-2";
import styled from "styled-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Legend, // 범례
  ChartDataLabels,
  annotationPlugin
);

const convertTimestampsToHours = (timestamps) => {
  return timestamps.map((timestamp) => {
    return new Date(timestamp).getHours();
  });
};

const ForecastChart = ({
  timestamps,
  temperatures,
  weatherIcons,
  sunrise,
  sunset,
  windSpeeds,
  windDirections,
  waveHeights,
  wavePeriods,
  waveDirections,
}) => {
  const labels = convertTimestampsToHours(timestamps);
  const chartData = {
    labels: labels, // 배열을 넣으면, x축의 label을 지정하는 데 사용됨
    datasets: [
      {
        type: "bar",
        label: "파고",
        data: waveHeights,
        backgroundColor: "rgba(152, 225, 232, 0.5)",
        borderColor: "rgb(152, 225, 232)",
        borderWidth: 1,
      },
    ],
  };

  const annotations = [];

  let targets = [18, 21, 0, 3]; // annotation으로 추가할 값을 정의
  labels.forEach((label, index) => {
    if (targets.includes(label)) {
      // x-axis의 label에 값이 존재하는 지 검사
      // 18-3시를 채우는 box 추가
      annotations.push({
        type: "box",
        drawTime: "beforeDraw",
        xMin: index - 0.5,
        xMax: index + 0.5,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderWidth: 0,
      });
    }
  });

  targets = [21];
  labels.forEach((label, index) => {
    if (targets.includes(label)) {
      // 21-0시 사이에 line 추가
      annotations.push({
        type: "line",
        scaleID: "x",
        value: index + 0.5,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1.5,
      });
    }
  });

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false, // 종횡비 유지 false => 부모 div를 따름
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        align: "end",
        textAlign: "center",
        anchor: "end",
        formatter: (value) => {
          // 소수점 셋째 자리에서 반올림
          return Math.round(value * 100) / 100;
        },
      },
      annotation: {
        annotations: annotations,
      },
    },
  };

  return (
    <ChartContainer>
      <Chart data={chartData} options={options} />
    </ChartContainer>
  );
};

export default ForecastChart;

const ChartContainer = styled.div`
  position: relative;
  margin: auto;
  height: 25vh;
  width: 60vw;
`;

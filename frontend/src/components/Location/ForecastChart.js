import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Legend, // 범례
  ChartDataLabels
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
  const chartData = {
    labels: convertTimestampsToHours(timestamps),
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

  const options = {
    responsive: true,
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
    },
  };

  return <Chart data={chartData} options={options} />;
};

export default ForecastChart;

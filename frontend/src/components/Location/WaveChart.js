import DirectionPNG from "assets/img/direction.png";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useRef } from "react";
import { Chart } from "react-chartjs-2";
import styled from "styled-components";
import { degreeToDirection } from "../../lib/mathUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  ChartDataLabels,
  annotationPlugin,
  Tooltip,
  Title
);

// createAnnotaions(labels)의 labels 구현에 필요
const convertTimestampsToHours = (timestamps) => {
  return timestamps.map((timestamp) => {
    return new Date(timestamp).getHours();
  });
};

// tooltip의 title이 될 Date 객체를 string 형태로 변환
const convertTimestampsToDate = (timestamp) => {
  const date = new Date(+timestamp);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시`;
};

const createAnnotations = (labels) => {
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

  return annotations;
};

const WaveChart = ({
  timestamps,
  waveHeights,
  wavePeriods,
  waveDirections,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;

    if (chart) {
      console.log("ChartJS", chart);
    }
  }, []);

  const labels = convertTimestampsToHours(timestamps);
  const chartData = {
    // labels: labels, // 배열을 넣으면, x축의 label을 지정하는 데 사용됨
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

  const getOrCreateTooltip = (chart) => {
    let tooltipWrapper = chart.canvas.parentNode.querySelector("div");

    if (!tooltipWrapper) {
      tooltipWrapper = document.createElement("div");
      tooltipWrapper.id = "chartjs-tooltip";
      tooltipWrapper.style.position = "absolute";
      tooltipWrapper.style.display = "flex";
      tooltipWrapper.style.justifyContent = "center";
      tooltipWrapper.style.width = "180px";
      tooltipWrapper.style.fontFamily = "Kopub Dotum Light";
      tooltipWrapper.style.color = "#000";
      tooltipWrapper.style.background = "rgba(252, 252, 252, 0.85)";
      tooltipWrapper.style.borderRadius = "7px";
      tooltipWrapper.style.pointerEvents = "none";
      tooltipWrapper.style.boxShadow = "0px 0px 20px 0px rgb(205, 205, 205)";
      tooltipWrapper.style.transform = "translate(-50%, 0)";
      tooltipWrapper.style.transition = "all .1s ease";
      tooltipWrapper.style.opacity = 1;

      const table = document.createElement("table");
      table.style.margin = "0px";

      tooltipWrapper.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipWrapper);
    }

    return tooltipWrapper;
  };

  const externalTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    const tooltipWrapper = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipWrapper.style.opacity = 0;
      return;
    }

    // Set data
    if (tooltip.body) {
      const title = tooltip.title[0];

      const tableHead = document.createElement("thead");
      let tr = document.createElement("tr");
      const th = document.createElement("th");
      const textDate = document.createTextNode(convertTimestampsToDate(title));

      th.appendChild(textDate);
      tr.appendChild(th);
      tableHead.appendChild(tr);

      const tableBody = document.createElement("tbody");
      tr = document.createElement("tr");
      const td = document.createElement("td");
      td.style.fontSize = "12px";

      const colors = tooltip.labelColors[0];
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.style.width = "10px";
      span.style.height = "10px";
      span.style.marginRight = "5px";
      span.style.background = colors.backgroundColor;
      span.style.borderWidth = "2px";
      span.style.borderColor = colors.borderColor;

      const firstDataPoint = tooltip.dataPoints[0];

      const textHeight = document.createTextNode(
        waveHeights[firstDataPoint.dataIndex].toFixed(2) + "m | "
      );

      const textPeriod = document.createTextNode(
        wavePeriods[firstDataPoint.dataIndex].toFixed(1) + "s | "
      );

      const waveDirectionValue = degreeToDirection(
        waveDirections[firstDataPoint.dataIndex]
      );

      const directionIcon = document.createElement("div");
      directionIcon.style.display = "inline-block";
      directionIcon.style.margin = "0 5px 0 5px";
      directionIcon.style.width = "18px";
      directionIcon.style.height = "18px";
      directionIcon.style.backgroundImage = `url(${DirectionPNG})`;
      directionIcon.style.backgroundSize = "cover";
      directionIcon.style.verticalAlign = "middle"; // text와 높이 맞춤
      directionIcon.style.transform = waveDirectionValue.transform;

      const textDirection = document.createTextNode(waveDirectionValue.name);

      td.appendChild(span);
      td.appendChild(textHeight);
      td.appendChild(textPeriod);
      td.appendChild(directionIcon);
      td.appendChild(textDirection);
      tr.appendChild(td);
      tableBody.appendChild(tr);

      const tableRoot = tooltipWrapper.querySelector("table");

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    tooltipWrapper.style.opacity = 1;
    tooltipWrapper.style.left = positionX + tooltip.caretX + "px";
    tooltipWrapper.style.top = positionY + tooltip.caretY / 2 + "px";
    tooltipWrapper.style.padding =
      tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };

  const options = {
    scales: {
      x: {
        labels: timestamps, // tooltip의 title이 됨
        grid: {
          display: false,
        },
        ticks: {
          // 눈금
          maxRotation: 0,
          callback: (value, index, ticks) => {
            return new Date(timestamps[index]).getHours();
          },
        },
      },
    },
    interaction: {
      // tooltip과 관련
      mode: "index", // 내용으로 어떤 element를 보여줄 지 설정 ex) index, dataset, point, nearest, x, y
      intersect: false, // true면, 마우스의 위치가 차트의 항목을 지날 때만 hover 모드가 적용
    },
    responsive: true,
    maintainAspectRatio: false, // 종횡비 유지 false => 부모 div를 따름
    plugins: {
      title: {
        display: true,
        text: "파도",
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
        annotations: createAnnotations(labels),
      },
      tooltip: {
        enabled: false,
        position: "nearest",
        external: externalTooltipHandler,
      },
    },
  };

  return (
    <ChartWrapper>
      <Chart ref={chartRef} data={chartData} options={options} />
    </ChartWrapper>
  );
};

export default WaveChart;

const ChartWrapper = styled.div`
  position: relative;
  margin: 12px;
  height: 27vh;
  width: 68vw;
`;

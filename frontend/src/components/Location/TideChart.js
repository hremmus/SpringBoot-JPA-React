import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Chart } from "react-chartjs-2";
import styled from "styled-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Filler,
  annotationPlugin,
  Tooltip,
  Title
);

const createAnnotations = (labels) => {
  const annotations = [];

  let targets = ["19:30", "22:30", "01:30"]; // annotation으로 추가할 값을 정의
  labels.forEach((label, index) => {
    if (targets.includes(label)) {
      // x-axis의 label에 값이 존재하는 지 검사
      // 18-3시를 채우는 box 추가
      annotations.push({
        type: "box",
        drawTime: "beforeDraw",
        xMin: index - 3,
        xMax: index + 3,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderWidth: 0,
      });
    }
  });

  targets = ["00:00"];
  labels.forEach((label, index) => {
    if (targets.includes(label)) {
      // 0시에 line 추가
      annotations.push({
        type: "line",
        scaleID: "x",
        value: index,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1.5,
      });
    }
  });

  return annotations;
};

const TideChart = ({ tides, observatory }) => {
  const labels = tides.map(
    (tide) => tide.record_time.split(" ")[1].slice(0, 5) // => HH:mm
  ); // for creating annotations

  const chartData = {
    datasets: [
      {
        type: "line",
        label: "파고",
        data: tides,
        parsing: {
          xAxisKey: "record_time", // default: 'yyyy-MM-dd HH:mm:ss'
          yAxisKey: "tide_level",
        },
        borderColor: "#343a40",
        borderWidth: 1,
        pointRadius: 0.2,
        fill: true,
        tension: 0.5, // 둥글게
        backgroundColor: "#98e1e8",
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
      tooltipWrapper.style.width = "100px";
      tooltipWrapper.style.fontFamily = "Kopub Dotum Light";
      tooltipWrapper.style.color = "#fff";
      tooltipWrapper.style.background = "rgba(252, 252, 252, 0.85)";
      tooltipWrapper.style.borderRadius = "7px";
      tooltipWrapper.style.pointerEvents = "none";
      tooltipWrapper.style.backgroundColor = "#000";
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
      th.style.fontSize = "12px";
      const textDate = document.createTextNode(title);

      th.appendChild(textDate);
      tr.appendChild(th);
      tableHead.appendChild(tr);

      const tableBody = document.createElement("tbody");
      tableBody.style.textAlign = "center";
      tr = document.createElement("tr");
      const td = document.createElement("td");
      td.style.fontSize = "12px";

      const textTideLevel = document.createTextNode(
        tides[tooltip.dataPoints[0].dataIndex].tide_level + "cm"
      );

      td.appendChild(textTideLevel);
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
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          /*
           * The category axis, which is the default x-axis for line and bar charts, uses the index as internal data format.
           * For accessing the label, use this.getLabelForValue(value)
           * Arrow functions don't have this.
           */
          callback(index) {
            const label = this.getLabelForValue(index).split(" ")[1]; // HH:mm:ss
            const hours = parseInt(label.slice(0, 2));
            const minute = parseInt(label.slice(3, 5));
            // 데이터가 정각/30분씩 있기에 hours가 두 번 출력되는 것을 방지
            return minute === 0 && (hours % 3 === 0 || hours === 0)
              ? hours
              : "";
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
        text: `타이드 (${observatory}관측소)`,
      },
      datalabels: {
        display: false,
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
      <Chart data={chartData} options={options} />
    </ChartWrapper>
  );
};

export default TideChart;

const ChartWrapper = styled.div`
  position: relative;
  margin: auto;
  height: 25vh;
  width: 60vw;
`;

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  ScatterController,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";
import annotationPlugin from "chartjs-plugin-annotation";
import { Chart } from "react-chartjs-2";
import styled from "styled-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  Filler,
  annotationPlugin,
  Tooltip,
  Title,
  TimeScale
);

// tooltip의 title이 될 Date 객체를 string 형태로 변환
const convertTimestampsToDate = (timestamp) => {
  const date = new Date(+timestamp);
  if (date.getMinutes() === 0) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시`;
  } else {
    return `${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
  }
};

const filterTidesByHour = (tides, hour) => {
  const filteredTides = [];

  tides.forEach((tide) => {
    const date = new Date(tide.record_time);

    if (date.getHours() === hour && date.getMinutes() === 0) {
      filteredTides.push(tide.record_time);
    }
  });

  return filteredTides;
};

const createAnnotations = (midnightTides, sixTides, threeTides) => {
  const annotations = [];

  // 0시에 line 추가
  midnightTides.forEach((midnight) => {
    annotations.push({
      type: "line",
      mode: "vertical",
      scaleID: "tides",
      value: midnight,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1.5,
    });
  });

  // 18시-3시에 box 추가
  sixTides.forEach((six) => {
    annotations.push({
      type: "box",
      scaleID: "tides",
      xMin: six,
      xMax: six + 16200000,
      borderWidth: 0.1,
      borderColor: "rgba(0, 0, 0, 0.05)",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    });
  });

  threeTides.forEach((three) => {
    annotations.push({
      type: "box",
      scaleID: "tides",
      xMin: three - 16200000,
      xMax: three,
      borderWidth: 0,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    });
  });

  return annotations;
};

const TideChart = ({ tides, highAndLowWater, observatory }) => {
  const midnightTides = filterTidesByHour(tides, 0);
  const sixTides = filterTidesByHour(tides, 18);
  const threeTides = filterTidesByHour(tides, 3);

  const chartData = {
    datasets: [
      {
        type: "line",
        label: "조위",
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
        backgroundColor: "rgba(152, 225, 232, 0.5)",
        xAxisID: "tides",
      },
      {
        type: "scatter",
        label: "간조/만조",
        data: highAndLowWater,
        parsing: {
          xAxisKey: "tph_time",
          yAxisKey: "tph_level",
        },
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        xAxisID: "tides", // x: {display: false} 한 상태에서 id를 지정해 주지 않으면 점이 따로 떠다님
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
      tooltipWrapper.style.width = "160px";
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
      const date = convertTimestampsToDate(tooltip.dataPoints[0].parsed.x);
      const tableHead = document.createElement("thead");
      let tr = document.createElement("tr");
      const th = document.createElement("th");
      const textDate = document.createTextNode(date);

      th.appendChild(textDate);
      tr.appendChild(th);
      tableHead.appendChild(tr);

      const tableBody = document.createElement("tbody");
      tableBody.style.textAlign = "center";
      tr = document.createElement("tr");
      const td = document.createElement("td");
      const spanOption = document.createElement("span");
      spanOption.style.fontSize = "14px";
      spanOption.style.color = "#fa7828";
      spanOption.style.fontWeight = "bold";
      const hlWater = tooltip.dataPoints[0].raw.hl_code;
      if (hlWater === "고조") {
        const textHLWater = document.createTextNode(`[만조] `);
        spanOption.appendChild(textHLWater);
        td.appendChild(spanOption);
      } else if (hlWater === "저조") {
        const textHLWater = document.createTextNode(`[간조] `);
        spanOption.appendChild(textHLWater);
        td.appendChild(spanOption);
      }
      const span = document.createElement("span");
      span.style.fontSize = "13px";
      const textTideLevel = document.createTextNode(
        `조위: ${tooltip.dataPoints[0].parsed.y} cm`
      );
      span.appendChild(textTideLevel);
      td.appendChild(span);
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
      tides: {
        type: "time",
        time: {
          unit: "hour",
          // https://www.chartjs.org/docs/latest/axes/cartesian/time.html#display-formats
          displayFormats: {
            hour: "H",
          },
          tooltipFormat: "yyyy-MM-DD HH:mm:ss",
        },
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          stepSize: 3,
          maxRotation: 0,
        },
      },
      x: {
        display: false,
      },
    },
    interaction: {
      // tooltip과 관련
      mode: "nearest", // 내용으로 어떤 element를 보여줄 지 설정 ex) index, dataset, point, nearest, x, y
      intersect: false, // true면, 마우스의 위치가 차트의 항목을 지날 때만 hover 모드가 적용
    },
    responsive: true,
    maintainAspectRatio: false, // 종횡비 유지 false => 부모 div를 따름
    plugins: {
      title: {
        display: true,
        text: `타이드   🏢 ${observatory}관측소`,
      },
      annotation: {
        annotations: createAnnotations(midnightTides, sixTides, threeTides),
      },
      datalabels: {
        align: "end",
        textAlign: "center",
        formatter: function (value, context) {
          if (context.datasetIndex === 1) {
            return highAndLowWater[context.dataIndex].tph_level;
          } else {
            return null; // 꼭 ! 안하면 tides 데이터에도 labal이 생김
          }
        },
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

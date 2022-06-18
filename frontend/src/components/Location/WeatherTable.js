import DirectionPNG from "assets/img/direction.png";
import SunrisePNG from "assets/img/sunrise.png";
import SunsetPNG from "assets/img/sunset.png";
import { degreeToDirection } from "lib/mathUtils";
import styled from "styled-components";

const convertTimestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  return `${date.getMonth() + 1}/${date.getDate()} (${week[date.getDay()]})`;
};

const convertTimestampToTime = (timestamp) => {
  const date = new Date(timestamp);

  return `${date.getHours()}:${
    date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()
  }`;
};

const WeatherTable = ({
  timestamps,
  temperatures,
  weatherIcons,
  sunrise,
  sunset,
  windSpeeds,
  windDirections,
}) => {
  const hour21IndexArray = timestamps.reduce((accumulator, ts, index) => {
    if (new Date(ts).getHours() === 21) {
      accumulator.push(index);
    }
    return accumulator;
  }, []); // reduce의 두 번째 파라미터인 initialValue로 빈 배열을 주면, 차례로 push된 리턴 값 accumulator를 담는 map의 역할을 수행

  const now = new Date();
  const dates = [];
  for (let i = 0; i <= 5; i++) {
    const currentDate = new Date(timestamps[0]);
    currentDate.setDate(currentDate.getDate() + i);
    dates.push(currentDate.getTime());
  }

  const thElements = [];
  let colspanValue;
  for (let i = 1; i <= 6; i++) {
    // 현 시간에 따라 i는 5 or 6 (일)
    if (i === 1) {
      colspanValue = hour21IndexArray[i - 1] + 1;
    } else if (i === 6) {
      colspanValue = 8 - parseInt(hour21IndexArray[0] + 1);
    } else {
      colspanValue = 8;
    }

    const currentSunrise = sunrise + (i - 1) * 86400000 - i * 60000; // + 24h - 1m
    const currentSunset = sunset + (i - 1) * 86460000; // + 24h + 1m

    thElements.push(
      <>
        {!(i === 6 && colspanValue === 0) && (
          <th className="date" colspan={colspanValue} align="center">
            {colspanValue >= 4 && <>{convertTimestampToDate(dates[i - 1])}</>}
            {colspanValue >= 4 && now.getTime() < currentSunrise && (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <SunriseIcon src={SunrisePNG} alt="sunrise" />
                &nbsp;
                {convertTimestampToTime(currentSunrise)}
              </>
            )}
            {((colspanValue >= 4 && i < 6) || colspanValue >= 7) && (
              <>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <SunsetIcon src={SunsetPNG} alt="sunset" />
                &nbsp;
                {convertTimestampToTime(currentSunset)}
              </>
            )}
          </th>
        )}
      </>
    );
  }

  return (
    <WeatherTableWrapper>
      <table>
        <caption>날씨와 바람</caption>
        <thead>
          {thElements.map((thElement) => (
            <>{thElement}</>
          ))}
          <tr>
            {timestamps.map((ts) => (
              <th align="center">{new Date(ts).getHours()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timestamps.map((ts, index) => (
            <td align="center">
              <img
                src={`https://openweathermap.org/img/wn/${weatherIcons[index]}@2x.png`}
                width="20px"
                height="20px"
                alt=""
              ></img>
              {temperatures[index].toFixed(0)}℃
            </td>
          ))}
        </tbody>
        <tbody>
          {timestamps.map((ts, index) => (
            <td align="center">
              <DirectionIcon
                src={DirectionPNG}
                alt="arrow"
                className={degreeToDirection(windDirections[index]).name}
              />
              <br />
              {windSpeeds[index].toFixed(1)}㎧
            </td>
          ))}
        </tbody>
        <tfoot>
          <tr></tr>
        </tfoot>
      </table>
    </WeatherTableWrapper>
  );
};

const WeatherTableWrapper = styled.div`
  max-width: 100%;
  margin: 5px 0 15px 0;
  font-family: "Kopub Dotum Light";
  border-radius: 12px;
  border: 1px solid #dae2ed;
  overflow: clip;

  caption {
    padding: 6px;
    font-size: 1rem;
  }

  table {
    margin: -1px;
    font-family: "Kopub Dotum Light";
    font-size: 0.75rem;
    border: none;
    border-collapse: collapse;
  }

  td,
  th {
    width: auto;
    padding: 6px 3px 6px 3px;
    border: 1px solid #dae2ed;
  }

  & .date {
    background-color: rgba(152, 225, 232, 0.2);
  }
`;

const DirectionIcon = styled.img`
  width: 15px;
  height: 15px;

  &.N {
    transform: rotate(180deg);
  }

  &.NNE {
    transform: rotate(202.5deg);
  }

  &.NE {
    transform: rotate(225deg);
  }

  &.ENE {
    transform: rotate(247.5deg);
  }

  &.E {
    transform: rotate(270deg);
  }

  &.ESE {
    transform: rotate(292.5deg);
  }

  &.SE {
    transform: rotate(315deg);
  }

  &.SSE {
    transform: rotate(337.5deg);
  }

  &.S {
    transform: rotate(0deg);
  }

  &.SSW {
    transform: rotate(22.5deg);
  }

  &.SW {
    transform: rotate(45deg);
  }

  &.WSW {
    transform: rotate(67.5deg);
  }

  &.W {
    transform: rotate(90deg);
  }

  &.WNW {
    transform: rotate(112.5deg);
  }

  &.NW {
    transform: rotate(135deg);
  }

  &.NNW {
    transform: rotate(157.5deg);
  }
`;

const SunriseIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const SunsetIcon = styled.img`
  width: 15px;
  height: 15px;
`;

export default WeatherTable;

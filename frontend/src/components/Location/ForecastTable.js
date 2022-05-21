import { Box } from "@material-ui/core";
import DirectionPNG from "assets/img/direction.png";
import { ReactComponent as Sunrise } from "assets/svg/sunrise.svg";
import { ReactComponent as Sunset } from "assets/svg/sunset.svg";
import { degreeToDirection } from "lib/mathUtils";
import styled from "styled-components";

const ForecastTable = ({
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
  const convertTimestampToHours = (timestamp) => {
    return new Date(timestamp).getHours();
  };

  return (
    <Box fontFamily="Goldplay">
      <div>
        <SunriseStyled />
        {sunrise.getHours()}:{sunrise.getMinutes()}
        <SunsetStyled />
        {sunset.getHours()}:{sunset.getMinutes()}
        <br />
      </div>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Weather</th>
            <th>Temperature</th>
            <th>Wave Height</th>
            <th>Wave Period</th>
            <th>Wave Direction</th>
            <th>Wind Speed</th>
            <th>Wind Direction</th>
          </tr>
        </thead>
        <tbody>
          {temperatures.length !== 0 &&
            waveHeights.length !== 0 &&
            wavePeriods.length !== 0 &&
            windSpeeds.length !== 0 &&
            timestamps.map((ts, index) => (
              <tr key={index}>
                <td>{convertTimestampToHours(ts)}</td>
                <td>
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherIcons[index]}@2x.png`}
                    width="25px"
                    height="25px"
                    alt=""
                  ></img>
                </td>
                <td>{temperatures[index].toFixed(0)}℃</td>
                <td>{waveHeights[index].toFixed(1)}m</td>
                <td>{wavePeriods[index].toFixed(1)}s</td>
                <td>
                  <DirectionIcon
                    src={DirectionPNG}
                    alt="arrow"
                    className={degreeToDirection(waveDirections[index]).name}
                  />
                  {degreeToDirection(waveDirections[index]).name}
                </td>
                <td>{windSpeeds[index].toFixed(1)}m/s</td>
                <td>
                  <DirectionIcon
                    src={DirectionPNG}
                    alt="arrow"
                    className={degreeToDirection(windDirections[index]).name}
                  />
                  {degreeToDirection(windDirections[index]).name}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Box>
  );
};

export default ForecastTable;

const SunriseStyled = styled(Sunrise)`
  fill: #fff;
  stroke: #3a3c42;
`;

const SunsetStyled = styled(Sunset)`
  fill: #fff;
  stroke: #3a3c42;
`;

const DirectionIcon = styled.img`
  width: 20px;
  height: 20px;

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

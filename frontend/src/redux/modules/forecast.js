import { createAction, handleActions } from "redux-actions";

const SET_WEATHERS = "forecast/SET_WEATHERS";
const SET_WAVES = "forecast/SET_WAVES";

export const setWeathers = createAction(SET_WEATHERS);
export const setWaves = createAction(SET_WAVES);

const initialState = {
  timestamps: [],
  temperatures: [],
  weatherIcons: [],
  windSpeeds: [],
  windDirections: [],
  sunrise: null,
  sunset: null,
  waveHeights: [],
  wavePeriods: [],
  waveDirections: [],
};

const forecast = handleActions(
  {
    [SET_WEATHERS]: (state, { payload }) => ({
      ...state,
      timestamps: payload.timestamps,
      temperatures: payload.temperatures,
      weatherIcons: payload.weatherIcons,
      sunrise: payload.sunrise,
      sunset: payload.sunset,
      windSpeeds: payload.windSpeeds,
      windDirections: payload.windDirections,
    }),
    [SET_WAVES]: (state, { payload }) => ({
      ...state,
      waveHeights: payload["waves_height-surface"],
      wavePeriods: payload["waves_period-surface"],
      waveDirections: payload["waves_direction-surface"],
    }),
  },
  initialState
);

export default forecast;

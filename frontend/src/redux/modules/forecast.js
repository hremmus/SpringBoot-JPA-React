import { createAction, handleActions } from "redux-actions";

const SET_WEATHERS = "forecast/SET_WEATHERS";
const SET_WAVES = "forecast/SET_WAVES";
const SET_TIDES = "forecast/SET_TIDES";
const SET_HIGH_AND_LOW_WATER = "forecast/SET_HIGH_AND_LOW_WATER";

export const setWeathers = createAction(SET_WEATHERS);
export const setWaves = createAction(SET_WAVES);
export const setTides = createAction(SET_TIDES);
export const setHighAndLowWater = createAction(SET_HIGH_AND_LOW_WATER);

const initialState = {
  timestamps: [],
  temperatures: [],
  tides: [],
  highAndLowWater: [],
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
    [SET_TIDES]: (state, { payload }) => ({
      ...state,
      tides: payload,
    }),
    [SET_HIGH_AND_LOW_WATER]: (state, { payload }) => ({
      ...state,
      highAndLowWater: payload,
    }),
  },
  initialState
);

export default forecast;

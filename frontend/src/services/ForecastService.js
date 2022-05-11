import axios from "axios";

export const getWebCam = (lat, lon) => {
  const url = new URL("https://api.windy.com/webcams/api/v3/webcams");
  const { searchParams: sp } = url;
  sp.set("limit", 1);
  sp.set("nearby", `${lat},${lon},7`); // {latitude},{longitude},{radius} radius ~250km
  sp.set("include", "images,urls");

  return axios.get(url, {
    headers: {
      "x-windy-api-key": process.env.REACT_APP_WINDY_WEBCAM_API_KEY,
    },
  });
};

export const getWeathers = (lat, lon) => {
  return axios.get("https://api.openweathermap.org/data/2.5/forecast", {
    params: {
      lat: lat,
      lon: lon,
      units: "metric", // for temperature in Celsius
      appid: process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY,
    },
  });
};

// use API trial to return randomly shuffled and slightly modified data
export const getWaves = (lat, lon) => {
  return axios.post("https://api.windy.com/api/point-forecast/v2", {
    lat: lat,
    lon: lon,
    model: "gfsWave", // parameters로 waves, windWaves, swell1, swell2 선택 가능
    parameters: ["waves"],
    levels: ["surface"],
    key: process.env.REACT_APP_WINDY_POINT_FORECAST_API_KEY,
  });
};

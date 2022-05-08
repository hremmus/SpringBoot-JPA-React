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

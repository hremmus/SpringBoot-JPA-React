import api from "services";

export const getWebCams = (lat, lon) => {
  const url = new URL("https://api.windy.com/webcams/api/v3/webcams");
  const { searchParams: sp } = url;
  sp.set("limit", 1);
  sp.set("nearby", `${lat},${lon},5`);
  sp.set("include", "images,urls");

  return api.get(url, {
    headers: {
      "x-windy-api-key": process.env.REACT_APP_WINDY_WEBCAM_API_KEY,
    },
    withCredentials: false,
  });
};

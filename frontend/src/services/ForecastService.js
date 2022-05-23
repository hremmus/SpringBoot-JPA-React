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

export const getTides = (obsCode, date) => {
  const url = new URL(
    "http://www.khoa.go.kr/api/oceangrid/tideObsPre/search.do"
  );
  const { searchParams: sp } = url;
  sp.set("ServiceKey", process.env.REACT_APP_KHOA_API_KEY);
  sp.set("ObsCode", obsCode);
  sp.set("Date", date);
  sp.set("ResultType", "json");

  return axios.get(url);
};

export const getHighAndLowWater = (obsCode, date) => {
  const url = new URL(
    "http://www.khoa.go.kr/api/oceangrid/tideObsPreTab/search.do"
  );
  const { searchParams: sp } = url;
  sp.set("ServiceKey", process.env.REACT_APP_KHOA_API_KEY);
  sp.set("ObsCode", obsCode);
  sp.set("Date", date);
  sp.set("ResultType", "json");

  return axios.get(url);
};

export const observatories = [
  // { id: "DT_0063", name: "가덕도", latitude: 35.024, longitude: 128.81 },
  // { id: "DT_0032", name: "강화대교", latitude: 37.731, longitude: 126.522 },
  // { id: "DT_0031", name: "거문도", latitude: 34.028, longitude: 127.308 },
  // { id: "DT_0029", name: "거제도", latitude: 34.801, longitude: 128.699 },
  // { id: "DT_0026", name: "고흥발포", latitude: 34.481, longitude: 127.342 },
  // { id: "DT_0049", name: "광양", latitude: 34.903, longitude: 127.754 },
  // { id: "DT_0042", name: "교본초", latitude: 34.704, longitude: 128.306 },
  // { id: "DT_0018", name: "군산", latitude: 35.975, longitude: 126.563 },
  // { id: "DT_0017", name: "대산", latitude: 37.007, longitude: 126.352 },
  // { id: "DT_0065", name: "덕적도", latitude: 37.226, longitude: 126.156 },
  // { id: "DT_0057", name: "동해항", latitude: 37.494, longitude: 129.143 },
  // { id: "DT_0062", name: "마산", latitude: 35.197, longitude: 128.576 },
  // { id: "DT_0023", name: "모슬포", latitude: 33.214, longitude: 126.251 },
  // { id: "DT_0007", name: "목포", latitude: 34.779, longitude: 126.375 },
  { id: "DT_0006", name: "묵호", latitude: 37.55, longitude: 129.116 },
  // { id: "DT_0025", name: "보령", latitude: 36.406, longitude: 126.486 },
  // { id: "DT_0041", name: "복사초", latitude: 34.098, longitude: 126.168 },
  // { id: "DT_0005", name: "부산", latitude: 35.096, longitude: 129.035 },
  // { id: "DT_0056", name: "부산항신항", latitude: 35.077, longitude: 128.786 },
  // { id: "DT_0061", name: "삼천포", latitude: 34.924, longitude: 128.069 },
  { id: "DT_0010", name: "서귀포", latitude: 33.24, longitude: 126.561 },
  // { id: "DT_0051", name: "서천마량", latitude: 36.128, longitude: 126.495 },
  // { id: "DT_0022", name: "성산포", latitude: 33.474, longitude: 126.927 },
  { id: "DT_0012", name: "속초", latitude: 38.207, longitude: 128.594 },
  // { id: "IE_0061", name: "신안가거초", latitude: 33.941, longitude: 124.592 },
  // { id: "DT_0008", name: "안산", latitude: 37.192, longitude: 126.647 },
  // { id: "DT_0067", name: "안흥", latitude: 36.674, longitude: 126.129 },
  // { id: "DT_0037", name: "어청도", latitude: 36.117, longitude: 125.984 },
  // { id: "DT_0016", name: "여수", latitude: 34.747, longitude: 127.765 },
  { id: "DT_0092", name: "여호항", latitude: 34.661, longitude: 127.469 },
  // { id: "DT_0003", name: "영광", latitude: 35.426, longitude: 126.42 },
  // { id: "DT_0044", name: "영종대교", latitude: 37.545, longitude: 126.584 },
  // { id: "DT_0043", name: "영흥도", latitude: 37.238, longitude: 126.428 },
  // { id: "IE_0062", name: "옹진소청초", latitude: 37.423, longitude: 124.738 },
  // { id: "DT_0027", name: "완도", latitude: 34.315, longitude: 126.759 },
  // { id: "DT_0039", name: "왕돌초", latitude: 36.719, longitude: 129.732 },
  // { id: "DT_0013", name: "울릉도", latitude: 37.491, longitude: 130.913 },
  // { id: "DT_0130", name: "울릉도(임시)", latitude: 37.495, longitude: 130.912 },
  // { id: "DT_0020", name: "울산", latitude: 35.501, longitude: 129.387 },
  // { id: "DT_0068", name: "위도", latitude: 35.618, longitude: 126.301 },
  // { id: "IE_0060", name: "이어도", latitude: 32.122, longitude: 125.182 },
  // { id: "DT_0001", name: "인천", latitude: 37.451, longitude: 126.592 },
  // { id: "DT_0052", name: "인천송도", latitude: 37.338, longitude: 126.586 },
  // { id: "DT_0024", name: "장항", latitude: 36.006, longitude: 126.687 },
  { id: "DT_0004", name: "제주", latitude: 33.527, longitude: 126.543 },
  // { id: "DT_0028", name: "진도", latitude: 34.377, longitude: 126.308 },
  // { id: "DT_0021", name: "추자도", latitude: 33.961, longitude: 126.3 },
  // { id: "DT_0050", name: "태안", latitude: 36.913, longitude: 126.238 },
  // { id: "DT_0014", name: "통영", latitude: 34.827, longitude: 128.434 },
  // { id: "DT_0002", name: "평택", latitude: 36.966, longitude: 126.822 },
  { id: "DT_0091", name: "포항", latitude: 36.051, longitude: 129.376 },
  // { id: "DT_0902", name: "포항시청_냉천항만교(수위)", latitude: 36.003, longitude: 129.413 },
  // { id: "DT_0066", name: "향화도", latitude: 35.167, longitude: 126.359 },
  // { id: "DT_0011", name: "후포", latitude: 36.677, longitude: 129.453 },
  // { id: "DT_0035", name: "흑산도", latitude: 34.684, longitude: 125.435 },
];

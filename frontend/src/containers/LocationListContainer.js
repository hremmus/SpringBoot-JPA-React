import { Box } from "@material-ui/core";
import ForecastTable from "components/Location/ForecastTable";
import GlobalLocation from "components/Location/GlobalLocation";
import LocationCard from "components/Location/LocationCard";
import NaverMap from "components/Location/NaverMap";
import TideChart from "components/Location/TideChart";
import WaveChart from "components/Location/WaveChart";
import WebCam from "components/Location/WebCam";
import { media } from "lib/styleUtils";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setTides, setWaves, setWeathers } from "redux/modules/forecast";
import { loadLocations, setGrade, setWebcam } from "redux/modules/location";
import { initialize, setMenu } from "redux/modules/menu";
import {
  getTides,
  getWaves,
  getWeathers,
  getWebCam,
} from "services/ForecastService";
import { getLocations } from "services/LocationService";
import styled from "styled-components";

const menuData = [
  { name: "양양 yangyang", link: "/location/yangyang", state: "양양" },
  { name: "제주 jeju", link: "/location/jeju", state: "제주" },
  { name: "고성 goseong", link: "/location/goseong", state: "고성" },
  { name: "강릉 gangneung", link: "/location/gangeung", state: "강릉" },
  { name: "포항 pohang", link: "/location/pohang", state: "포항" },
  { name: "남해 namhae", link: "/location/namhae", state: "남해" },
];

const globalLocationData = [
  {
    title: "양양",
    description1: "강원도 양양군",
    description2:
      "국내 최고의 서핑 명소로 불리우며 북동, 남동, 정동의 너울을 받아 발생하는 다양한 서핑 포인트와 넓은 해변의 질 좋은 파도를 사계절 즐길 수 있다. 수심이 얕고 해변 바닥이 모래로 되어 있어 서핑 입문에 좋은 스폿으로 알려져 있다.",
    center: { latitude: 38.048, longitude: 128.72 },
    zoom: 11,
  },
  {
    title: "제주",
    description1: "제주특별자치도",
    description2:
      "제주도는 바다마다 파도의 성향이 뚜렷하기 때문에, 이를 알아야 제주바당에서 서핑을 할 수 있다. 중문의 경우 바깥으로 밀어내는 조류가 강한 해변이기 때문에 파도가 큰 날은 주의하여 입수해야 한다.",
    center: { latitude: 33.38, longitude: 126.555 },
    zoom: 10,
  },
  {
    title: "고성",
    description1: "강원도 고성군",
    description2:
      "한적하고 깨끗한 해변들이 자리한 고성은 여유로운 서핑을 즐기고 싶은 서퍼들의 성지로 등극했다.",
    center: { latitude: 38.305, longitude: 128.54 },
    zoom: 12,
  },
  {
    title: "강릉",
    description1: "강원도 강릉시",
    description2:
      "강릉의 해변은 서핑을 하기에 적당한 형태의 파도가 지속적으로 형성되는 서핑포인트를 다수 보유하고 있다.",
    center: { latitude: 37.84, longitude: 128.88 },
    zoom: 11,
  },
  {
    title: "포항",
    description1: "경상북도 포항시",
    description2:
      "호주와 비슷하다고 평가받는 적절한 파도가 비교적 평온한 수온, 알맞게 불어오는 바람과 함께 서퍼들을 유혹한다. 가장 추운 날에도 영상 5도 이상의 수온을 유지하기에 겨울철이면 더욱 서퍼들이 모여들고는 한다.",
    center: { latitude: 36.114, longitude: 129.427 },
    zoom: 11,
  },
  {
    title: "남해",
    description1: "전라남도 고흥군",
    description2:
      "아름다운 해돋이 풍경과 넓고 깨끗한 모래사장, 울창한 솔숲 등으로 입소문을 타다가 몇 해 전부터 ‘남도를 대표하는 서핑 포인트’로 이름을 알렸다. 앞바다를 막는 섬이 없으니 먼 바다에서 밀려온 파도가 크고 깨끗해 서핑에 안성맞춤이다. 이런 파도가 4월부터 10월까지 꾸준히 밀려와 서핑 시즌도 길다.",
    center: { latitude: 34.58, longitude: 127.487 },
    zoom: 13,
  },
];

const convert = ({ title, urls, images }) => {
  const name = title.replace(/'/g, "&apos;");
  return {
    name,
    source: urls.detail,
    image: images.current.preview,
  };
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};

// 시(o'clock)로 index를 구함
const getIndexByHours = (hours) => {
  switch (hours) {
    case 0:
      return 0;
    case 3:
      return 180;
    case 6:
      return 360;
    case 9:
      return 540;
    case 12:
      return 720;
    case 15:
      return 900;
    case 18:
      return 1080;
    case 21:
      return 1260;
    default:
      return -1; // Return -1 for other hours, indicating an invalid input
  }
};

const LocationListContainer = () => {
  const { state } = useLocation();
  const {
    locations,
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
    grades,
    webcams,
    tides,
  } = useSelector(({ forecast, location }) => ({
    locations: location.locations,
    timestamps: forecast.timestamps,
    temperatures: forecast.temperatures,
    weatherIcons: forecast.weatherIcons,
    sunrise: forecast.sunrise,
    sunset: forecast.sunset,
    windSpeeds: forecast.windSpeeds,
    windDirections: forecast.windDirections,
    waveHeights: forecast.waveHeights,
    wavePeriods: forecast.wavePeriods,
    waveDirections: forecast.waveDirections,
    grades: location.grades,
    webcams: location.webcams,
    tides: forecast.tides,
  }));
  const dispatch = useDispatch();
  const [selectedGlobalLocation, setSelectedGlobalLocation] = useState({});
  const [selectedLocalIndex, setSelectedLocalIndex] = useState(0);
  const [observatory, setObservatory] = useState("");

  useEffect(() => {
    dispatch(setMenu(menuData));

    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  const fetchLocationsData = useCallback(
    async (global) => {
      try {
        const response = await getLocations(global);
        dispatch(loadLocations(response.data.result.data.locationList));
      } catch (error) {
        console.error("error fetcing locations:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const selectedGlobalData = globalLocationData.find(
      (element) => element.title === state
    );
    setSelectedGlobalLocation(selectedGlobalData || {});

    fetchLocationsData(state);

    return () => {
      setSelectedLocalIndex(0); // 다른 카테고리로 이동해도(global이 변경되어도) index 값이 유지되므로 초기화 필요
      setObservatory("");
    };
  }, [state, fetchLocationsData]);

  const fetchForSetGrade = useCallback(async () => {
    if (locations.length > 0) {
      try {
        const promises = locations.map(async (location) => {
          const { id, latitude, longitude } = location;

          const response = await getWaves(latitude, longitude);
          const height = response.data["waves_height-surface"][0];
          const period = response.data["waves_period-surface"][0];

          let grade;
          if (height <= 1 && period < 7) {
            grade = "초급";
          } else if (height <= 1.5 || period < 9) {
            grade = "중급";
          } else {
            grade = "상급";
          }
          dispatch(setGrade(id, grade));
        });

        await Promise.all(promises);
      } catch (error) {
        console.error("error fetching waves:", error);
      }
    }
  }, [dispatch, locations]);

  useEffect(() => {
    fetchForSetGrade();
  }, [fetchForSetGrade]);

  const fetchWebcamData = useCallback(async () => {
    if (locations.length > 0) {
      try {
        // 배열을 Promise.all의 매개변수로 하여 호출하면, 모든 약속의 이행 결과(response.data)를 새 배열에 담아서 반환
        // 일련의 비동기 작업 여러 개가 모두 이행 or 하나라도 거부되는 경우를 다룸
        // 장점: 비동기 작업의 동시 실행 = 병렬 처리가 가능 => 시간 단축, 오류 처리 간소화
        const promises = locations.map(async (location) => {
          const { id, latitude, longitude } = location;
          const response = await getWebCam(latitude, longitude);

          if (response.data.webcams.length > 0) {
            dispatch(setWebcam(id, convert(response.data.webcams[0])));
          }

          return response.data; // 응답 데이터, 데이터 속성을 포함
        });

        // await가 앞에 있으면 배열의 모든 promise가 처리될 때까지 기다림 (다음 코드의 실행을 차단)
        await Promise.all(promises); // 각 location의 response.data가 배열로 수집됨
      } catch (error) {
        console.error("error fetching webcam:", error);
      }
    }
  }, [dispatch, locations]);

  useEffect(() => {
    fetchWebcamData();
  }, [fetchWebcamData]);

  const fetchForecastData = useCallback(async () => {
    if (locations.length > 0) {
      try {
        const { latitude, longitude } = locations[selectedLocalIndex];
        await getWeathers(latitude, longitude)
          .then((response) => {
            const data = response.data;
            const {
              list,
              city: { sunrise, sunset },
            } = data;

            const currentTime = Date.now();

            const timestamps = [],
              temperatures = [],
              weatherIcons = [],
              windSpeeds = [],
              windDirections = [];

            // forEach는 async/await 동작 X
            list.forEach((item) => {
              const {
                dt,
                main: { temp },
                weather: [{ icon }],
                wind: { speed, deg },
              } = item;
              // 지나간 시간대는 데이터를 다루지 않음: 반복 시 검사할 조건문 추가
              const timestamp = dt * 1000; // s -> ms
              const timestampDifference = timestamp - currentTime; // 현재와의 시간차를 구함

              let nearestTimestampDifference = Infinity;
              if (
                // 현재와 가장 가까우면서(시간차가 가장 작음), 지나간 시간이 아니어야 함(시간차가 0보다 큼)
                timestampDifference > 0 &&
                timestampDifference < nearestTimestampDifference
              ) {
                nearestTimestampDifference = timestampDifference;
                timestamps.push(timestamp);
                temperatures.push(temp);
                weatherIcons.push(icon);
                windSpeeds.push(speed);
                windDirections.push(deg);
              }
            });

            dispatch(
              setWeathers({
                timestamps: timestamps,
                temperatures: temperatures,
                weatherIcons: weatherIcons,
                sunrise: sunrise * 1000,
                sunset: sunset * 1000,
                windSpeeds: windSpeeds,
                windDirections: windDirections,
              })
            );
          })
          .catch((error) => console.log(error));

        await getWaves(latitude, longitude)
          .then((response) => {
            dispatch(setWaves(response.data));
          })
          .catch((error) => console.log(error.response.data));
      } catch (error) {
        console.error("error fetching forecast:", error);
      }
    }
  }, [dispatch, locations, selectedLocalIndex]);

  useEffect(() => {
    fetchForecastData();
  }, [fetchForecastData]);

  const fetchTidesData = useCallback(async () => {
    if (locations.length > 0) {
      try {
        const { latitude, longitude } = locations[selectedLocalIndex];
        const tides = [];

        const startDate = new Date(timestamps[0]);
        const endDate = new Date(timestamps[timestamps.length - 1]);

        let currentDate = new Date(startDate); // while문에 사용할 변수
        while (currentDate <= endDate) {
          const formattedDate = formatDate(currentDate); // 요청 데이터 yyyyMMdd
          await getTides(latitude, longitude, formattedDate)
            .then((response) => {
              const responseData = response.data.result.data;

              // for start date
              if (currentDate.getTime() === startDate.getTime()) {
                // 24시간 동안의 데이터를 1분 단위로 제공하기 때문에(고정) index로 데이터에 접근이 가능
                const startIndex = getIndexByHours(startDate.getHours());
                for (let i = startIndex; i < responseData.length - 1; i++) {
                  tides.push(responseData[i]);
                }

                // end date push하기 전에 currentDate > endDate면 안 됨
                currentDate.setHours(0);
                // for end date
              } else if (currentDate.getDay() === endDate.getDay()) {
                const endIndex = getIndexByHours(endDate.getHours());

                for (let i = 0; i < endIndex - 1; i++) {
                  tides.push(responseData[i]);
                }

                setObservatory(response.data.result.meta.obs_post_name);
                // for middle date
              } else {
                for (let i = 0; i < responseData.length - 1; i++) {
                  tides.push(responseData[i]);
                }
              }

              currentDate.setDate(currentDate.getDate() + 1); // 다음 날로 이동
            })
            .catch((error) => console.log(error));
        }

        // 데이터를 1분마다 -> 30분마다로 축소
        const halfHourlyTides = tides.filter((tide, index) => index % 30 === 0);
        dispatch(setTides(halfHourlyTides));
      } catch (error) {
        console.error("error fetching tides:", error);
      }
    }
  }, [dispatch, locations, timestamps, selectedLocalIndex]);

  useEffect(() => {
    fetchTidesData();
  }, [fetchTidesData]);

  if (!locations) return;
  return (
    <>
      <GlobalLocation selectedGlobalLocation={selectedGlobalLocation} />
      <Box marginY={2} border={1} borderColor="lightgray">
        <NaverMap
          center={selectedGlobalLocation.center}
          zoom={selectedGlobalLocation.zoom}
          locations={locations}
        />
      </Box>
      <Box marginY="1rem" paddingY="1rem">
        <CardGrid>
          {locations.map((location, index) => (
            <CardWrapper
              key={location.id}
              id={location.latitude + `,` + location.longitude}
              onClick={() => setSelectedLocalIndex(index)}
              className="location-card"
            >
              <WebCam webcam={webcams?.[location.id]} />
              <LocationCard
                local={location.local}
                grade={grades?.[location.id] || "─"}
              />
            </CardWrapper>
          ))}
        </CardGrid>
      </Box>
      <ForecastTable
        timestamps={timestamps}
        waveHeights={waveHeights}
        wavePeriods={wavePeriods}
        waveDirections={waveDirections}
        temperatures={temperatures}
        weatherIcons={weatherIcons}
        sunrise={new Date(sunrise)}
        sunset={new Date(sunset)}
        windSpeeds={windSpeeds}
        windDirections={windDirections}
      />
      <WaveChart
        timestamps={timestamps}
        waveHeights={waveHeights}
        wavePeriods={wavePeriods}
        waveDirections={waveDirections}
      />
      <TideChart tides={tides} observatory={observatory} />
    </>
  );
};

export default LocationListContainer;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  row-gap: 1.5rem;
  column-gap: 1.5rem;

  ${media.wide`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.tablet`
    grid-template-columns: repeat(1, 1fr);
  `}
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 25% 10%;

  &.active {
    border: 2px solid #025262;
  }
`;

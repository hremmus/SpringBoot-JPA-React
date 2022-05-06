import { Box } from "@material-ui/core";
import GlobalLocation from "components/Location/GlobalLocation";
import LocationList from "components/Location/LocationList";
import WebCam from "components/Location/WebCam";
import { media } from "lib/styleUtils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { loadLocations } from "redux/modules/location";
import { setMenu } from "redux/modules/menu";
import { getLocations } from "services/LocationService";
import styled from "styled-components";

const menuData = [
  { name: "양양 yangyang", link: "/location/yangyang" },
  { name: "제주 jeju", link: "/location/jeju" },
  { name: "고성 goseong", link: "/location/goseong" },
  { name: "강릉 gangneung", link: "/location/gangeung" },
  { name: "포항 pohang", link: "/location/pohang" },
  { name: "남해 namhae", link: "/location/namhae" },
];

const globalLocationData = [
  {
    title: "양양",
    description1: "강원도 양양군",
    description2:
      "국내 최고의 서핑 명소로 불리우며 북동, 남동, 정동의 너울을 받아 발생하는 다양한 서핑 포인트와 넓은 해변의 질 좋은 파도를 사계절 즐길 수 있다. 수심이 얕고 해변 바닥이 모래로 되어 있어 서핑 입문에 좋은 스폿으로 알려져 있다.",
  },
  {
    title: "제주",
    description1: "제주특별자치도",
    description2:
      "제주도는 바다마다 파도의 성향이 뚜렷하기 때문에, 이를 알아야 제주바당에서 서핑을 할 수 있다. 중문의 경우 바깥으로 밀어내는 조류가 강한 해변이기 때문에 파도가 큰 날은 주의하여 입수해야 한다.",
  },
  {
    title: "고성",
    description1: "강원도 고성군",
    description2:
      "한적하고 깨끗한 해변들이 자리한 고성은 여유로운 서핑을 즐기고 싶은 서퍼들의 성지로 등극했다.",
  },
  {
    title: "강릉",
    description1: "강원도 강릉시",
    description2:
      "강릉의 해변은 서핑을 하기에 적당한 형태의 파도가 지속적으로 형성되는 서핑포인트를 다수 보유하고 있다.",
  },
  {
    title: "포항",
    description1: "경상북도 포항시",
    description2:
      "호주와 비슷하다고 평가받는 적절한 파도가 비교적 평온한 수온, 알맞게 불어오는 바람과 함께 서퍼들을 유혹한다. 가장 추운 날에도 영상 5도 이상의 수온을 유지하기에 겨울철이면 더욱 서퍼들이 모여들고는 한다.",
  },
  {
    title: "남해",
    description1: "전라남도 고흥군",
    description2:
      "아름다운 해돋이 풍경과 넓고 깨끗한 모래사장, 울창한 솔숲 등으로 입소문을 타다가 몇 해 전부터 ‘남도를 대표하는 서핑 포인트’로 이름을 알렸다. 앞바다를 막는 섬이 없으니 먼 바다에서 밀려온 파도가 크고 깨끗해 서핑에 안성맞춤이다. 이런 파도가 4월부터 10월까지 꾸준히 밀려와 서핑 시즌도 길다.",
  },
];

const LocationListContainer = () => {
  const { pathname } = useLocation();
  const menu = useSelector((state) => state.menu.menu);
  const locations = useSelector((state) => state.location.locations);

  const dispatch = useDispatch();
  const [selectedGlobalLocation, setSelectedGlobalLocation] = useState({});

  useEffect(() => {
    dispatch(setMenu(menuData));
  }, [dispatch]);

  useEffect(() => {
    let requestData;
    const selectedMenuItem = menu.find((item) => item.link === pathname);
    if (selectedMenuItem) {
      requestData = selectedMenuItem.name.substring(0, 2); // 한글명으로 요청
    }

    const selectedGlobalData = globalLocationData.find(
      (element) => element.title === requestData
    );
    setSelectedGlobalLocation(selectedGlobalData || {});

    getLocations(requestData)
      .then((response) => {
        dispatch(loadLocations(response.data.result.data.locationList));
      })
      .catch((error) => console.log(error));
  }, [dispatch, menu, pathname]);

  if (!locations) return;
  return (
    <>
      <GlobalLocation selectedGlobalLocation={selectedGlobalLocation} />
      <Box paddingY="1rem">
        <CardGrid>
          {locations.map((location, index) => (
            <CardWrapper>
              <WebCam
                latitude={location.latitude}
                longitude={location.longitude}
              />
              <LocationList location={location} />
            </CardWrapper>
          ))}
        </CardGrid>
      </Box>
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
`;

import { useEffect, useState } from "react";

const NaverMap = ({ center, zoom, locations }) => {
  const [map, setMap] = useState(null);
  const naver = window.naver;

  useEffect(() => {
    const init = () => {
      const mapDiv = document.getElementById("map");
      const initMap = new naver.maps.Map(mapDiv);
      initMap.setOptions("mapTypeControl", false); // 일반/위성
      initMap.setOptions("zoom", zoom);
      initMap.setOptions("scaleControl", false); // 우측 하단 scale 표시
      initMap.setOptions("mapDataControl", false); // 좌측 하단 Naver Corp. 표시
      initMap.setOptions("zoomControl", true);
      initMap.setOptions("zoomControlOptions", {
        position: naver.maps.Position.TOP_RIGHT,
      });

      setMap(initMap);
    };

    init();
  }, [naver.maps.Map, naver.maps.Position.TOP_RIGHT, zoom]);

  useEffect(() => {
    const createMarkers = (locations) => {
      const centerLatLng = new naver.maps.LatLng(
        center.latitude,
        center.longitude
      );
      map.setOptions("center", centerLatLng);

      // 새 배열을 생성할 필요가 없고, 각 위치에 대한 마커 생성에만 사용되기 때문에 map이 아닌 forEach를 사용
      locations.forEach((location) => {
        const point = new naver.maps.LatLng(
          location.latitude,
          location.longitude
        );
        const marker = new naver.maps.Marker({
          position: point,
          map: map,
          zIndex: 100,
          clickable: true,
        });

        const card = document.getElementById(
          location.latitude + `,` + location.longitude
        );

        marker.addListener("click", () => {
          // getElementsByClassName: DOM의 변경 사항을 실시간 반영하는 HTMLCollection을 반환
          // querySelectorAll: 정적 NodeList를 반환, Array.from()이나 스프레드 연산자를 사용하여 배열로 변환하지 않고 forEach() 실행이 가능
          const allCards = document.querySelectorAll(".location-card");
          allCards.forEach((card) => {
            card.classList.remove("active");
          });

          card.classList.add("active");
        });
      });
    };

    if (map) {
      createMarkers(locations);
    }
  }, [
    map,
    center,
    locations,
    naver.maps.LatLng,
    naver.maps.Marker,
    naver.maps.event,
  ]);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default NaverMap;

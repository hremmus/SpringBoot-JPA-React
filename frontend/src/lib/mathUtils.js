export const degreeToDirection = (degree) => {
  const directions = [
    { name: "N", transform: "rotate(180deg)" },
    { name: "NNE", transform: "rotate(202.5deg)" },
    { name: "NE", transform: "rotate(225deg)" },
    { name: "ENE", transform: "rotate(247.5deg)" },
    { name: "E", transform: "rotate(270deg)" },
    { name: "ESE", transform: "rotate(292.5deg)" },
    { name: "SE", transform: "rotate(315deg)" },
    { name: "SSE", transform: "rotate(337.5deg)" },
    { name: "S", transform: "rotate(0deg)" },
    { name: "SSW", transform: "rotate(22.5deg)" },
    { name: "SW", transform: "rotate(45deg)" },
    { name: "WSW", transform: "rotate(67.5deg)" },
    { name: "W", transform: "rotate(90deg)" },
    { name: "WNW", transform: "rotate(112.5deg)" },
    { name: "NW", transform: "rotate(135deg)" },
    { name: "NNW", transform: "rotate(157.5deg)" },
  ]; // 북, 북북동, 북동, 동북동, 동, 동남동, 남동, 남남동, 남, 남남서, 남서, 서남서, 서, 서북서, 북서, 북북서

  const index = Math.round(degree / 22.5) % 16;
  return {
    name: directions[index].name,
    transform: directions[index].transform,
  };
};

const toRadians = (degree) => {
  return (degree * Math.PI) / 180;
};

// haversine formula를 이용한 대원 거리 구하기
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // 두 점 사이의 직선 세그먼트 길이의 절반의 제곱
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  // 두 점 사이의 중심각
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // const c = 2 * Math.asin(a);

  const distance = R * c;
  return distance;
};

// 계층형 구조의 배열을 전부 꺼내어 한 배열에 담음
export const convertOneArray = (array) => {
  const newArray = [];
  const recursion = (array) => {
    for (let i = 0; i < array.length; i++) {
      array[i].childrenIds = [];
    }

    for (let i = 0; i < array.length; i++) {
      newArray.push(array[i]);

      if (array[i].children.length !== 0) {
        array[i].childrenIds = array[i].children.map((child) => child.id); // id만 꺼냄
        recursion(array[i].children);
      }
    }
  };

  recursion(array);
  return newArray;
};

// 부모 객체의 개수만큼 자식 객체의 depth에 담음
export const calcDepth = (array) => {
  const newArray = [...array]; // readonly로 depth 프로퍼티를 추가할 수 없음 => 얕은 복사
  for (let i = 0; i < newArray.length; i++) {
    newArray[i].depth = 0;
  }

  for (let i = 0; i < newArray.length; i++) {
    for (let j = i + 1; j < newArray.length; j++) {
      if (
        newArray[i].childrenIds.length !== 0 && // 최상위 댓글 제외
        newArray[i].childrenIds.includes(newArray[j].id) // JAVA의 contains
      ) {
        newArray[j].depth = newArray[i].depth + 1; // 부모 depth에 +1
      }
    }
  }
  return newArray;
};

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

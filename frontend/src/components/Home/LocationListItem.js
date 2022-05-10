import { Box, Chip } from "@material-ui/core";
import oc from "open-color";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LocationListItem = ({ url, image, name }) => {
  return (
    <Link to={url} state={name}>
      <LocationItem>
        <LocationImage src={image} alt="" />
        <LocationName
          label={name}
          size="small"
          variant="outlined"
          className="name"
        />
      </LocationItem>
    </Link>
  );
};

export default LocationListItem;

const LocationItem = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  margin: 8px;
  padding: 8px;
  border-radius: 18px;
  border: 1px solid ${oc.gray[2]};
  background: hsla(15, 14%, 95%, 0.35);
  position: relative; // 자식 요소 Chip의 위치 지정을 위해 쓰임
  overflow: hidden; // 자식 요소 img 확대(scale) 시 테두리를 벗어나지 않도록 함

  &:hover {
    .name {
      opacity: 1;
    }
  }
`;

const LocationName = styled(Chip)`
  position: absolute;
  top: 5%;
  left: 5%;
  opacity: 0;
`;

const LocationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
  opacity: 0.9;

  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.3);
    opacity: 0.6;
  }
`;

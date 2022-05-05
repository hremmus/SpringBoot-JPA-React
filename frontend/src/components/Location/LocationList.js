import oc from "open-color";
import styled from "styled-components";
import GradeChip from "./GradeChip";
import WebCam from "./WebCam";

const LocationList = ({ location }) => {
  return (
    <CardWrapper key={location.id}>
      <WebCam latitude={location.latitude} longitude={location.longitude} />
      <CardContent>
        <div className="align">
          <GradeChip grade="초급" />
          <div className="text">{location.local}</div>
        </div>
      </CardContent>
    </CardWrapper>
  );
};

export default LocationList;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 25% 10%;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem 0.5rem 1.25rem;
  height: 55px;
  background-color: ${oc.gray[1]};

  .align {
    display: flex;
    align-items: center;
  }

  .text {
    margin-left: 0.75rem;
    font-size: 17px;
    font-family: "NIXGONM-Vb";
    font-weight: 500;
  }
`;

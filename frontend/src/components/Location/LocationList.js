import { Box } from "@material-ui/core";
import { ReactComponent as CamOff } from "assets/svg/camera-off.svg";
import oc from "open-color";
import styled from "styled-components";
import GradeChip from "./GradeChip";

const LocationList = ({ location }) => {
  return (
    <CardWrapper key={location.id}>
      <Box
        display="flex"
        position="relative"
        height="170px"
        bgcolor={oc.gray[2]}
        justifyContent="center"
        alignItems="center"
        fontFamily="Kopub Dotum Light"
      >
        <CamOffStyled />
        <span>
          <b>준비중</b>입니다
        </span>
      </Box>
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

const CamOffStyled = styled(CamOff)`
  margin-right: 0.5rem;
  stroke: #3a3c42;
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

import { Box } from "@material-ui/core";
import { ReactComponent as CamOff } from "assets/svg/camera-off.svg";
import oc from "open-color";
import styled from "styled-components";

const WebCam = ({ webcam }) => {
  return (
    <>
      {webcam ? (
        <WebCamWrapper>
          <WebCamImage src={webcam.image} alt={webcam.name} />
          <WebCamLink
            href={webcam.source}
            target="_blank"
            rel="noopener noreferrer"
          >
            View WebCam
          </WebCamLink>
        </WebCamWrapper>
      ) : (
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
      )}
    </>
  );
};

export default WebCam;

const WebCamWrapper = styled.div`
  position: relative;
`;

const WebCamImage = styled.img`
  width: 100%;
  height: 170px;
  display: block;
  object-fit: cover;
`;

const WebCamLink = styled.a`
  position: absolute;
  bottom: 5%;
  right: 5%;
  font-family: "Goldplay";
  color: white;
  text-decoration: none;
`;

const CamOffStyled = styled(CamOff)`
  margin-right: 0.5rem;
  stroke: #3a3c42;
`;

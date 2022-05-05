import { Box } from "@material-ui/core";
import { ReactComponent as CamOff } from "assets/svg/camera-off.svg";
import oc from "open-color";
import { useEffect, useState } from "react";
import { getWebCams } from "services/ForecastService";
import styled from "styled-components";

const convert = ({ title, urls, images }) => {
  const name = title.replace(/'/g, "&apos;");
  return {
    name,
    source: urls.detail,
    image: images.current.preview,
  };
};

const WebCam = ({ latitude, longitude }) => {
  const [webcams, setWebcams] = useState([]);

  useEffect(() => {
    getWebCams(latitude, longitude)
      .then((response) => {
        const { webcams } = response.data;
        if (webcams.length > 0) {
          setWebcams(webcams.map(convert));
        }
      })
      .catch((error) => console.log(error));
  }, [latitude, longitude]);

  return (
    <>
      {webcams.length > 0 ? (
        webcams.map((webcam, index) => (
          <WebCamWrapper key={index}>
            <WebCamImage src={webcam.image} alt={webcam.name} />
            <WebCamLink
              href={webcam.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              View WebCam
            </WebCamLink>
          </WebCamWrapper>
        ))
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

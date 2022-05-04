import { Box, Chip, Grid, Typography } from "@material-ui/core";
import BackgroundJPG from "assets/img/main-background.jpg";
import WavePNG from "assets/img/wave-icon.png";
import YangyangPNG from "assets/img/yangyang.PNG";
import { media } from "lib/styleUtils";
import oc from "open-color";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  return (
    <>
      <Grid container>
        <Grid item sm={6} md={4} lg={5}>
          <Box height="65vh" paddingTop="2vh">
            <Typography variant="h1">
              <Box fontFamily="Berold Regular" letterSpacing="0.7rem">
                Ride <br /> the waves <br /> and <br /> Go with <br /> the flow
                of life.
              </Box>
            </Typography>
            <WaveIcon />
          </Box>
        </Grid>
        <Grid item sm={6} md={4} lg={7}>
          <Box height="65vh" padding="52vh 0 0 2vh">
            <Typography variant="h2">
              <Box
                fontFamily="Berold Regular"
                letterSpacing="0.7rem"
                textAlign="center"
              >
                The best wave of your life <br /> is still out there.
              </Box>
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12}>
          <Box padding="0 0 0 10rem">
            <Typography variant="h5">
              <Box fontFamily="Jost" color="#343a40" letterSpacing={7}>
                EXPLORE NOW ━
              </Box>
            </Typography>
            <Typography variant="subtitle1">
              <Box
                fontFamily="Kopub Dotum Light"
                color={`${oc.gray[7]}`}
                letterSpacing={6}
              >
                서핑 지역의 예보를 알려드려요.
              </Box>
            </Typography>
          </Box>
          <Box display="flex" margin="1vh 0 0 1vh">
            <Link to="/location/yangyang">
              <LocationItem>
                <LocationImage src={YangyangPNG} alt="" />
                <LocationName
                  label="양양"
                  size="small"
                  variant="outlined"
                  className="name"
                />
              </LocationItem>
            </Link>
            <LocationItem></LocationItem>
            <LocationItem></LocationItem>
            <LocationItem></LocationItem>
            <LocationItem></LocationItem>
            <LocationItem></LocationItem>
          </Box>
        </Grid>
        <WallpaperContainer>
          <WallpaperImage src={BackgroundJPG} alt="" />
        </WallpaperContainer>
      </Grid>
    </>
  );
};

export default Home;

const WaveIcon = styled.div`
  margin: 8.5rem 0 0 3rem;
  width: 16rem;
  height: 16rem;
  background: url(${WavePNG});
  background-size: 100%;
  background-repeat: repeat-x;
  z-index: -1;
`;

const WallpaperContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; // 배경이 다른 요소들의 뒤에 위치하도록
`;

const WallpaperImage = styled.img`
  position: absolute;
  top: 0;
  right: 12.5%;
  width: auto;
  height: 100%;
  opacity: 0.7;

  ${media.wide`
    width: 992px;
    right: 0;
  `}

  ${media.tablet`
    width: 100%;
    right: 0;
  `}
`;

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

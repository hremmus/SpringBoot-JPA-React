import { Box, Grid, Typography } from "@material-ui/core";
import GangneungPNG from "assets/img/gangneung.png";
import GoseongPNG from "assets/img/goseong.png";
import JejuPNG from "assets/img/jeju.png";
import BackgroundJPG from "assets/img/main-background.jpg";
import NamhaePNG from "assets/img/namhae.png";
import PohangPNG from "assets/img/pohang.png";
import WavePNG from "assets/img/wave-icon.png";
import YangyangPNG from "assets/img/yangyang.png";
import LocationListItem from "components/Home/LocationListItem";
import { media } from "lib/styleUtils";
import oc from "open-color";
import styled from "styled-components";

const LocationThumbnails = [
  { url: "/location/yangyang", image: YangyangPNG, name: "양양" },
  { url: "/location/jeju", image: JejuPNG, name: "제주" },
  { url: "/location/goseong", image: GoseongPNG, name: "고성" },
  { url: "/location/gangneung", image: GangneungPNG, name: "강릉" },
  { url: "/location/pohang", image: PohangPNG, name: "포항" },
  { url: "/location/namhae", image: NamhaePNG, name: "남해" },
];

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
            {LocationThumbnails.map((item, index) => (
              <LocationListItem
                key={index}
                url={item.url}
                image={item.image}
                name={item.name}
              />
            ))}
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

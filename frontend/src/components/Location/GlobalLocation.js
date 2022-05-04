import { Box, Typography } from "@material-ui/core";
import TestPNG from "assets/img/test.png";
import oc from "open-color";
import styled from "styled-components";

const GlobalLocation = ({ selectedGlobalLocation }) => {
  const { title, description1, description2 } = selectedGlobalLocation;

  return (
    <>
      <Box marginTop={2}>
        <Typography variant="subtitle1">
          <Box fontFamily="Jost" color="#01A0B0" letterSpacing={7}>
            LOCATION
          </Box>
        </Typography>
        <Typography variant="h5" display="inline">
          <Box
            fontFamily="MinSans-Regular"
            color={oc.gray[9]}
            fontWeight="600"
            letterSpacing={7}
            display="inline"
          >
            {title}
          </Box>
        </Typography>
        <Typography variant="body2" display="inline">
          <Box
            fontFamily="MinSans-Regular"
            color={oc.gray[8]}
            display="inline"
            letterSpacing={1}
          >
            {description1}
          </Box>
        </Typography>
        <Box marginY={1}>
          <Typography variant="body2">
            <Box
              fontFamily="MinSans-Regular"
              color={oc.gray[8]}
              display="inline"
              letterSpacing={1}
            >
              {description2}
            </Box>
          </Typography>
        </Box>
      </Box>

      <Box my={2}>
        <MapBox
          height="25em"
          border={1}
          borderRadius={5}
          borderColor="lightgray"
        />
      </Box>
    </>
  );
};

export default GlobalLocation;

const MapBox = styled(Box)`
  background-image: url(${TestPNG});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

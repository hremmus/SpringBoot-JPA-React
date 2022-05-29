import { Box, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

const GlobalLocation = ({ selectedGlobalLocation }) => {
  const { title, description1, description2 } = selectedGlobalLocation;

  return (
    <Box marginTop={2}>
      <Typography variant="subtitle1">
        <Box fontFamily="Jost" color="#01A0B0" letterSpacing={7}>
          LOCATION
        </Box>
      </Typography>
      <Typography variant="h5" display="inline">
        <Box
          fontFamily="Kopub Dotum Light"
          color={grey[900]}
          fontWeight="600"
          letterSpacing={7}
          display="inline"
        >
          {title}
        </Box>
      </Typography>
      <Typography component="div" variant="body2" display="inline">
        <Box
          fontFamily="Kopub Dotum Light"
          color={grey[800]}
          display="inline"
          letterSpacing={1}
        >
          {description1}
        </Box>
      </Typography>
      <Box marginY={1}>
        <Typography component="div" variant="body2">
          <Box
            fontFamily="Kopub Dotum Light"
            color={grey[800]}
            display="inline"
            letterSpacing={1}
          >
            {description2}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default GlobalLocation;

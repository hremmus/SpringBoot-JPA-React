import { Box, Typography } from "@material-ui/core";

const TitleAndDescription = ({ titleText, descriptionText }) => {
  return (
    <Box marginY={2}>
      <Typography variant="subtitle1">
        <Box fontFamily="Jost" color="#01A0B0" letterSpacing={7}>
          {titleText}
        </Box>
      </Typography>
      <Typography component="div" variant="body2">
        <Box fontFamily="Kopub dotum light">{descriptionText}</Box>
      </Typography>
    </Box>
  );
};

export default TitleAndDescription;

import { Box, Typography } from "@material-ui/core";

const PostHeader = () => {
  return (
    <Box marginTop={2}>
      <Typography variant="subtitle1">
        <Box fontFamily="Jost" color="#01A0B0" letterSpacing={7}>
          TALK
        </Box>
      </Typography>
      <Typography component="div" variant="body2">
        <Box fontFamily="Kopub dotum light">
          자유롭게 이야기를 나누어 보세요
        </Box>
      </Typography>
    </Box>
  );
};

export default PostHeader;

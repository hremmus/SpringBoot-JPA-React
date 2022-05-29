import { Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const WriteButton = ({ showWriteButton }) => {
  return (
    <>
      {showWriteButton && (
        <Box display="flex" justifyContent="right" marginBottom="0.25rem">
          <Button component={Link} to="/posts/write">
            글쓰기
          </Button>
        </Box>
      )}
    </>
  );
};

export default WriteButton;

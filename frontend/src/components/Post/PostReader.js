import { Box, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { SubInfo } from "./SubInfo";

const PostReader = ({ post, actionButtons, handleClick }) => {
  const { title, content, user, categoryName, createdDate, modifiedDate } =
    post;

  return (
    <>
      <Box
        margin="1.2rem 0 1rem 0"
        paddingBottom="0.5rem"
        borderBottom={`1px solid ${grey[200]}`}
      >
        <Typography variant="h5">
          [{categoryName}] {title}
        </Typography>
        <SubInfo
          nickname={user.nickname}
          createdDate={createdDate}
          modifiedDate={modifiedDate}
          post={post.id}
          handleClick={handleClick}
          hasMarginTop
        />
      </Box>
      {actionButtons}
      <Box
        minHeight="25vh"
        whiteSpace="pre-wrap"
        fontFamily="Kopub Dotum Light"
        color={grey[800]}
      >
        {content}
      </Box>
    </>
  );
};

export default PostReader;

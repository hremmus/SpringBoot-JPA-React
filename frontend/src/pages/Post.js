import { Grid } from "@material-ui/core";
import CategoryContainer from "containers/CategoryContainer";
import CommentWriteContainer from "containers/CommentWriteContainer";
import PostReadContainer from "containers/PostReadContainer";
import styled from "styled-components";

const PostReaderBlock = styled.div`
  width: 1300px;
  padding-top: 6rem;
  margin: 1rem auto;
`;

const Post = () => {
  return (
    <PostReaderBlock>
      <Grid container spacing={2}>
        <Grid item md={2} xs={12}>
          <CategoryContainer />
        </Grid>
        <Grid item md={10} xs={12}>
          <PostReadContainer />
          <CommentWriteContainer />
        </Grid>
      </Grid>
    </PostReaderBlock>
  );
};

export default Post;

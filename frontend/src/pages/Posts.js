import { Grid } from "@material-ui/core";
import CategoryContainer from "containers/CategoryContainer";
import PaginationContainer from "containers/PaginationContainer";
import PostListContainer from "containers/PostListContainer";
import styled from "styled-components";

const PostListBlock = styled.div`
  width: 1300px;
  padding-top: 6rem;
  margin: 1rem auto;
`;

const Posts = () => {
  return (
    <PostListBlock>
      <Grid container spacing={2}>
        <Grid item md={2}>
          <CategoryContainer />
        </Grid>
        <Grid item md={10} xs={12}>
          <PostListContainer />
          <PaginationContainer />
        </Grid>
      </Grid>
    </PostListBlock>
  );
};

export default Posts;

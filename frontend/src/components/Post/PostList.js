import { Grid } from "@material-ui/core";
import oc from "open-color";
import styled from "styled-components";

const PostListBlock = styled.div`
  width: 1300px;
  padding-top: 6rem;
  margin: 1rem auto;
`;

const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
`;

const PostItemBlock = styled.div`
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  /* 맨 위 포스트는 padding-top 주지 않음 */
  &:first-child {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${oc.gray[2]};
  }
  h1 {
    font-size: 1rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${oc.gray[6]};
    }
  }
`;

const PostItem = ({ post }) => {
  return (
    <PostItemBlock>
      <h1>{post.title}</h1>
      {post.nickname}, {post.createdDate}
    </PostItemBlock>
  );
};

const PostList = ({ posts }) => {
  return (
    <PostListBlock>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          category
        </Grid>
        <Grid item xs={10}>
          <WritePostButtonWrapper>새 글 작성</WritePostButtonWrapper>
          {posts && (
            <div>
              {posts.map((post) => (
                <PostItem post={post} key={post.id} />
              ))}
            </div>
          )}
        </Grid>
      </Grid>
    </PostListBlock>
  );
};

export default PostList;

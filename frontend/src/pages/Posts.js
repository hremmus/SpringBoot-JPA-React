import PaginationContainer from "containers/PaginationContainer";
import PostListContainer from "containers/PostListContainer";

const Posts = () => {
  return (
    <>
      <PostListContainer />
      <PaginationContainer />
    </>
  );
};

export default Posts;

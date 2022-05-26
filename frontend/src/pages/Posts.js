import PostHeader from "components/Post/PostHeader";
import PaginationContainer from "containers/PaginationContainer";
import PostListContainer from "containers/PostListContainer";
import useQueryParams from "lib/useQueryParams";

const Posts = () => {
  const { categoryId, userId, page } = useQueryParams();

  return (
    <>
      <PostHeader />
      <PostListContainer categoryId={categoryId} userId={userId} page={page} />
      <PaginationContainer
        categoryId={categoryId}
        userId={userId}
        page={page + 1}
      />
    </>
  );
};

export default Posts;

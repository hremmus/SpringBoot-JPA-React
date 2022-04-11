import PostList from "components/Post/PostList";
import WriteButton from "components/Post/WriteButton";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadPosts } from "redux/modules/posts";
import { getPosts } from "services/PostService";

const PostListContainer = () => {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page"), 10) || 0;
  const dispatch = useDispatch();

  const { posts, isLoggedIn } = useSelector((state) => ({
    posts: state.posts.posts,
    isLoggedIn: state.user.isLoggedIn,
  }));

  useEffect(() => {
    const categoryId = searchParams.get("categoryId") || null;
    getPosts({
      page: page,
      size: 20,
      categoryId: categoryId,
      userId: null,
    })
      .then((response) => {
        dispatch(loadPosts(response.data.result.data));
      })
      .catch((error) => console.log(error));
  }, [dispatch, searchParams, page]);

  return (
    <>
      <WriteButton showWriteButton={isLoggedIn} /> <PostList posts={posts} />
    </>
  );
};

export default PostListContainer;

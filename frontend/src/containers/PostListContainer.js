import PostList from "components/Post/PostList";
import WriteButton from "components/Post/WriteButton";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPosts, size } from "redux/modules/posts";
import { getPosts } from "services/PostService";

const PostListContainer = ({ categoryId, userId, page }) => {
  const dispatch = useDispatch();

  const { isLoggedIn, posts, categories } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    posts: state.posts.posts,
    categories: state.categories.categories || [],
  }));

  const fetchPosts = useCallback(() => {
    getPosts({
      page: page,
      size: size,
      categoryId: categoryId,
      userId: userId,
    })
      .then((response) => {
        dispatch(loadPosts(response.data.result.data));
      })
      .catch((error) => console.log(error));
  }, [dispatch, page, categoryId, userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <WriteButton showWriteButton={isLoggedIn} />
      <PostList posts={posts} size={size} categories={categories} />
    </>
  );
};

export default PostListContainer;

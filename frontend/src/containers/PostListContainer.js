import PostList from "components/Post/PostList";
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
    getPosts({
      page: page,
      size: 20,
      categoryId: null,
      userId: null,
    })
      .then((response) => {
        dispatch(loadPosts(response.data.result.data));
      })
      .catch((error) => console.log(error));
  }, [dispatch, page]);

  return <PostList posts={posts} showWriteButton={isLoggedIn} />;
};

export default PostListContainer;

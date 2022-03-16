import PostList from "components/Post/PostList";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPosts } from "redux/modules/post";
import { getPosts } from "services/PostService";

const PostListContainer = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  useEffect(() => {
    getPosts({
      page: 0,
      size: 20,
      categoryId: null,
      userId: null,
    })
      .then((response) => {
        dispatch(loadPosts(response.data.result.data.posts));
      })
      .catch((error) => console.log(error));
  }, [dispatch]);

  return <PostList posts={posts} />;
};

export default PostListContainer;

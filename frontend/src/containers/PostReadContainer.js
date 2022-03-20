import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { initialize, readPost } from "redux/modules/post";
import { getPost } from "services/PostService";
import PostReader from "./../components/Post/PostReader";

const PostReadContainer = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post } = useSelector((state) => ({
    post: state.post.post,
  }));
  useEffect(() => {
    getPost(postId)
      .then((response) => {
        dispatch(readPost(response.data.result.data));
      })
      .catch((error) => console.log(error));

    return () => dispatch(initialize());
  }, [dispatch, postId]);

  return <PostReader post={post} />;
};

export default PostReadContainer;

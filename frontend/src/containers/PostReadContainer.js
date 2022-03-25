import PostActionButtons from "components/Post/PostActionButtons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { readPost, setOriginalPost, unloadPost } from "redux/modules/post";
import { deletePost, getPost } from "services/PostService";
import PostReader from "./../components/Post/PostReader";

const PostReadContainer = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loggedInfo } = useSelector((state) => ({
    post: state.post.post,
    loggedInfo: state.user.loggedInfo,
  }));

  useEffect(() => {
    getPost(postId)
      .then((response) => {
        dispatch(readPost(response.data.result.data));
      })
      .catch((error) => console.log(error));

    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    navigate("/posts/write");
  };

  const onRemove = () => {
    deletePost(postId)
      .then((response) => {
        if (response.data.success) navigate("/posts");
      })
      .catch((error) => console.log(error));
  };

  if (!post) {
    return null;
  }

  return (
    <PostReader
      post={post}
      actionButtons={
        (loggedInfo && loggedInfo.id) === (post && post.user.id) && (
          <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
        )
      }
    />
  );
};

export default PostReadContainer;

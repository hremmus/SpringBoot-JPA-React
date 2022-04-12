import CommentList from "components/Post/CommentList";
import PostActionButtons from "components/Post/PostActionButtons";
import PostReader from "components/Post/PostReader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  loadComments,
  readPost,
  setOriginalPost,
  unloadPost,
} from "redux/modules/post";
import { getComments } from "services/CommentService";
import { deletePost, getPost } from "services/PostService";

const PostReadContainer = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loggedInfo, comments } = useSelector((state) => ({
    post: state.post.post,
    loggedInfo: state.user.loggedInfo,
    comments: state.post.comments,
  }));

  useEffect(() => {
    getPost(postId)
      .then((response) => {
        dispatch(readPost(response.data.result.data));
      })
      .catch((error) => console.log(error));

    getComments({ postId: postId })
      .then((response) => {
        dispatch(loadComments(response.data.result.data));
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

  if (!comments) {
    return null;
  }

  return (
    <>
      <PostReader
        post={post}
        actionButtons={
          (loggedInfo && loggedInfo.id) === (post && post.user.id) && (
            <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
          )
        }
      />
      <CommentList comments={comments} />
    </>
  );
};

export default PostReadContainer;

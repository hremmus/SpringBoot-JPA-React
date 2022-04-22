import CommentList from "components/Post/CommentList";
import PostActionButtons from "components/Post/PostActionButtons";
import PostReader from "components/Post/PostReader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadComments, unloadComment } from "redux/modules/comment";
import { readPost, setOriginalPost, unloadPost } from "redux/modules/post";
import { getComments } from "services/CommentService";
import { deletePost, getPost } from "services/PostService";

const PostReadContainer = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loggedInfo, comments, shownReplyInput, shownUpdateInput } =
    useSelector((state) => ({
      post: state.post.post,
      loggedInfo: state.user.loggedInfo,
      comments: state.comment.comments,
      shownReplyInput: state.comment.shownReplyInput,
      shownUpdateInput: state.comment.shownUpdateInput,
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
      dispatch(unloadComment());
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
      <CommentList
        postId={post.id}
        comments={comments}
        shownReplyInput={shownReplyInput}
        shownUpdateInput={shownUpdateInput}
        loggedInfo={loggedInfo}
      />
    </>
  );
};

export default PostReadContainer;

import CommentList from "components/Post/CommentList";
import PostActionButtons from "components/Post/PostActionButtons";
import PostReader from "components/Post/PostReader";
import UploadedImageList from "components/Post/UploadedImageList";
import { useCallback, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadComments, unloadComment } from "redux/modules/comment";
import { readPost, setOriginalPost, unloadPost } from "redux/modules/post";
import { size } from "redux/modules/posts";
import { getComments } from "services/CommentService";
import { deletePost, getPost } from "services/PostService";

const PostReadContainer = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    post,
    loggedInfo,
    isAdmin,
    comments,
    shownReplyInput,
    shownUpdateInput,
  } = useSelector(
    (state) => ({
      post: state.post.post,
      loggedInfo: state.user.loggedInfo,
      isAdmin: state.user.isAdmin,
      comments: state.comment.comments,
      shownReplyInput: state.comment.shownReplyInput,
      shownUpdateInput: state.comment.shownUpdateInput,
    }),
    shallowEqual
  );

  const fetchPost = useCallback(() => {
    getPost(postId)
      .then((response) => {
        dispatch(readPost(response.data.result.data));
      })
      .catch((error) => console.log(error));
  }, [dispatch, postId]);

  useEffect(() => {
    fetchPost();

    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, fetchPost]);

  const fetchComments = useCallback(() => {
    getComments({ postId: postId })
      .then((response) => {
        dispatch(loadComments(response.data.result.data));
      })
      .catch((error) => console.log(error));
  }, [dispatch, postId]);

  useEffect(() => {
    fetchComments();

    return () => {
      dispatch(unloadComment());
    };
  }, [dispatch, fetchComments]);

  const onEdit = useCallback(() => {
    dispatch(setOriginalPost(post));
    navigate("/posts/write");
  }, [dispatch, post, navigate]);

  const onRemove = useCallback(() => {
    deletePost(postId)
      .then((response) => {
        if (response.data.success) navigate("/posts");
      })
      .catch((error) => console.log(error));
  }, [postId, navigate]);

  const handleClick = useCallback(() => {
    navigate(`/posts?userId=${post.user?.id}&page=0&size=${size}`);
  }, [post, navigate]);

  if (!post || !comments) {
    return null;
  }

  return (
    <>
      <PostReader
        post={post}
        actionButtons={
          (loggedInfo?.id === post?.user.id || isAdmin) && (
            <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
          )
        }
        handleClick={handleClick}
      />
      {post.images && <UploadedImageList images={post.images} />}
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

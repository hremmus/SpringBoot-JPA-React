import CommentReplyWriter from "components/Post/CommentReplyWriter";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  changeInput,
  cleanWritedComment,
  loadComments,
} from "redux/modules/comment";
import {
  createComment,
  getComments,
  updateComment,
} from "services/CommentService";

const CommentReplyContainer = ({ parentId, parentNickname }) => {
  const { postId } = useParams();
  const dispatch = useDispatch();

  const id = useSelector((state) => state.comment.id);
  const content = useSelector(
    (state) => state.comment.reply.content || state.comment.content
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      dispatch(
        changeInput({
          input: "reply",
          key: name,
          value,
        })
      );
    },
    [dispatch]
  );

  const handleSubmit = useCallback(() => {
    if (!id) {
      createComment({ content, postId, parentId })
        .then((response) => {
          if (response.data.success) {
            // 답댓글 작성 시 서버에게 리스트 재요청
            getComments({ postId: postId })
              .then((response) => {
                dispatch(loadComments(response.data.result.data));
                dispatch(cleanWritedComment());
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    } else {
      updateComment({ id, content })
        .then((response) => {
          if (response.data.success) {
            // 댓글 수정 시 서버에게 리스트 재요청
            getComments({ postId: postId })
              .then((response) => {
                dispatch(loadComments(response.data.result.data));
                dispatch(cleanWritedComment());
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    }
  }, [dispatch, postId, id, parentId, content]);

  return (
    <CommentReplyWriter
      content={content}
      parentNickname={parentNickname}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default CommentReplyContainer;

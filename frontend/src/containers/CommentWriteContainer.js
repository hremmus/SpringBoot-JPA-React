import CommentWriter from "components/Post/CommentWriter";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { changeInput, setComment } from "redux/modules/comment";
import { createComment } from "services/CommentService";

const CommentWriteContainer = () => {
  const dispatch = useDispatch();
  const { postId } = useParams();
  const { content } = useSelector(({ comment }) => ({
    content: comment.common.content,
  }));

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      dispatch(
        changeInput({
          input: "common",
          key: name,
          value,
        })
      );
    },
    [dispatch]
  );

  const handleSubmit = useCallback(() => {
    createComment({ content, postId, parentId: null })
      .then((response) => {
        if (response.data.success) {
          // 답댓글이 아니면 기존 리스트에 추가
          const comment = response.data.result.data;
          comment.depth = 0;
          dispatch(setComment(comment));
        }
      })
      .catch((error) => console.log(error));
  }, [dispatch, content, postId]);

  return (
    <CommentWriter
      content={content}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default CommentWriteContainer;

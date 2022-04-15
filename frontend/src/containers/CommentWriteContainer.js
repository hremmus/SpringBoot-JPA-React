import CommentWriter from "components/Post/CommentWriter";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { changeInput, setComment } from "redux/modules/comment";
import { createComment } from "services/CommentService";

const CommentWriteContainer = () => {
  const dispatch = useDispatch();
  const { postId } = useParams();
  const { content } = useSelector(({ comment }) => ({
    content: comment.content,
  }));
  const parentId = null;

  const handleSubmit = (e) => {
    createComment({ content, postId, parentId })
      .then((response) => {
        if (response.data.success) {
          dispatch(setComment(response.data.result.data));
        }
      })
      .catch((error) => console.log(error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        key: name,
        value,
      })
    );
  };

  return (
    <CommentWriter
      content={content}
      postId={postId}
      parentId="1"
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default CommentWriteContainer;

import CommentWriter from "components/Post/CommentWriter";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CommentWriteContainer = () => {
  const { postId } = useParams();
  const { content } = useSelector(({ comment }) => ({
    content: comment.common.content,
  }));

  return <CommentWriter content={content} postId={postId} />;
};

export default CommentWriteContainer;

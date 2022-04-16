import CommentReplyWriter from "components/Post/CommentReplyWriter";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CommentReplyContainer = ({ parentId }) => {
  const { postId } = useParams();
  const { content } = useSelector(({ comment }) => ({
    content: comment.reply.content,
  }));

  return (
    <CommentReplyWriter content={content} postId={postId} parentId={parentId} />
  );
};

export default CommentReplyContainer;

import CommentReplyWriter from "components/Post/CommentReplyWriter";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CommentReplyContainer = ({ parentId, parentNickname }) => {
  const { postId } = useParams();
  const { id, content } = useSelector(({ comment }) => ({
    id: comment.id,
    content: comment.reply.content || comment.content,
  }));

  return (
    <CommentReplyWriter
      id={id}
      content={content}
      postId={postId}
      parentId={parentId}
      parentNickname={parentNickname}
    />
  );
};

export default CommentReplyContainer;

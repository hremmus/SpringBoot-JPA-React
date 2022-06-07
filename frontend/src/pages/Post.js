import CommentWriteContainer from "containers/CommentWriteContainer";
import PostReadContainer from "containers/PostReadContainer";

const Post = () => {
  return (
    <>
      <PostReadContainer />
      <CommentWriteContainer />
    </>
  );
};

export default Post;

import PostHeader from "components/Post/PostHeader";
import CommentWriteContainer from "containers/CommentWriteContainer";
import PostReadContainer from "containers/PostReadContainer";

const Post = () => {
  return (
    <>
      <PostHeader />
      <PostReadContainer />
      <CommentWriteContainer />
    </>
  );
};

export default Post;

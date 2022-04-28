import PostWriter from "components/Post/PostWriter";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialize } from "redux/modules/post";

const PostWriteContainer = () => {
  const dispatch = useDispatch();
  const { id, title, content, categoryId, images } = useSelector(
    ({ post }) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      categoryId: post.categoryId,
      images: post.images,
    })
  );

  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  return (
    <PostWriter
      id={id}
      title={title}
      content={content}
      categoryId={categoryId}
      images={images}
      dispatch={dispatch}
    />
  );
};

export default PostWriteContainer;

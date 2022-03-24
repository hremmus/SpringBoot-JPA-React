import PostWriter from "components/Post/PostWriter";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeInput, initialize } from "redux/modules/post";

const PostWriteContainer = () => {
  const dispatch = useDispatch();
  const { id, title, content, categoryId } = useSelector(({ post }) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    categoryId: post.categoryId,
  }));

  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

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
    <PostWriter
      id={id}
      title={title}
      content={content}
      categoryId={categoryId}
      handleChange={handleChange}
    />
  );
};

export default PostWriteContainer;

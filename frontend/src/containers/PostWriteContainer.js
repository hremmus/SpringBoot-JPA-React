import TitleAndDescription from "components/Common/TitleAndDescription";
import PostWriter from "components/Post/PostWriter";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { initialize } from "redux/modules/post";

const PostWriteContainer = () => {
  const dispatch = useDispatch();

  const {
    categories,
    selectedCategoryDepth,
    id,
    title,
    content,
    images,
    postError,
  } = useSelector(
    ({ categories, post }) => ({
      categories: categories.categories || [],
      selectedCategoryDepth: post.categoryDepth,
      id: post.id,
      title: post.title,
      content: post.content,
      images: post.images || [],
      postError: post.postError,
    }),
    shallowEqual
  );

  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  return (
    <>
      <TitleAndDescription
        titleText="TALK"
        descriptionText="자유롭게 이야기를 나누어 보세요"
      />
      <PostWriter
        categories={categories}
        selectedCategoryDepth={selectedCategoryDepth}
        id={id}
        title={title}
        content={content}
        images={images}
        postError={postError}
        dispatch={dispatch}
      />
    </>
  );
};

export default PostWriteContainer;

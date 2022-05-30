import PostWriter from "components/Post/PostWriter";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialize } from "redux/modules/post";

const PostWriteContainer = () => {
  const dispatch = useDispatch();
  const {
    categories,
    parentCategoryId,
    subCategoryId,
    id,
    title,
    content,
    categoryId,
    images,
  } = useSelector(({ categories, post }) => ({
    categories: categories.categories || [],
    parentCategoryId: post.parentCategoryId,
    subCategoryId: post.subCategoryId,
    id: post.id,
    title: post.title,
    content: post.content,
    categoryId: post.categoryId,
    images: post.images || [],
  }));

  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  return (
    <PostWriter
      categories={categories}
      parentCategoryId={parentCategoryId}
      subCategoryId={subCategoryId}
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

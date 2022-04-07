import { Link } from "react-router-dom";

const CategoryList = () => {
  return (
    <>
      <Link to={`/posts?&page=0&size=20`}>전체</Link>
      <Link to={`/posts?categoryId=1&page=0&size=20`}>카테1</Link>
      <Link to={`/posts?categoryId=2&page=0&size=20`}>카테2</Link>
      <Link to={`/posts?categoryId=3&page=0&size=20`}>카테3</Link>
    </>
  );
};

export default CategoryList;

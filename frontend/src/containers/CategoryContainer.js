import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCategories } from "redux/modules/categories";
import { getCategories } from "services/CategoryService";
import CategoryList from "./../components/Post/CategoryList";

const CategoryContainer = () => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => ({
    categories: state.categories.categories,
  }));

  useEffect(() => {
    getCategories()
      .then((response) => dispatch(loadCategories(response.data.result.data)))
      .catch((error) => console.log(error));
  }, [dispatch]);

  return <CategoryList categories={categories} />;
};

export default CategoryContainer;

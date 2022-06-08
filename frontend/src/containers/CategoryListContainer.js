import { Box, Button } from "@material-ui/core";
import CategoryList from "components/Admin/CategoryList";
import { calcDepth, convertOneArray } from "lib/mathUtils";
import InputWithLabel, { AlertModal } from "lib/styleUtils";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "redux/modules/categories";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "services/CategoryService";

const CategoryListContainer = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const categoryError = useSelector((state) => state.categories.categoryError);

  const [modal, setModal] = useState(false);
  const onConfirm = () => {
    document.getElementById("alert-modal").classList.add("hide");

    setTimeout(() => {
      setModal(false);
    }, 600);
  };

  const fetchPostCategories = useCallback(() => {
    getCategories()
      .then((response) => {
        setCategories(calcDepth(convertOneArray(response.data.result.data)));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchPostCategories();
  }, [fetchPostCategories]);

  const handleAdd = useCallback(
    (parentId, name) => {
      createCategory({
        name: name,
        parentId: parentId,
      })
        .then(() => {
          fetchPostCategories();
          setNewCategoryName("");
          setSubcategoryName("");
          setActiveCategory(null);
        })
        .catch((error) => {
          dispatch(
            setError({
              type: "생성",
              message: error.response.data.result.message,
            })
          );
          setModal(true);
          setNewCategoryName("");
          setSubcategoryName("");
        });
    },
    [dispatch, fetchPostCategories]
  );

  const handleDelete = useCallback(
    (id) => {
      deleteCategory(id)
        .then(() =>
          setCategories((prevCategories) => {
            return prevCategories.filter((category) => category.id !== id);
          })
        )
        .catch((error) => {
          dispatch(
            setError({
              type: "삭제",
              message: error.response.data.result.message,
            })
          );
          setModal(true);
        });
    },
    [dispatch]
  );

  return (
    <>
      <CategoryList
        categories={categories}
        activeCategory={activeCategory}
        subcategoryName={subcategoryName}
        setSubcategoryName={setSubcategoryName}
        handleActive={(id) => {
          setActiveCategory(id);
        }}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
      />
      <Box display="flex" alignItems="center">
        <InputWithLabel
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="카테고리 이름을 입력하세요."
        />
        <Button onClick={() => handleAdd(null, newCategoryName)}>생성</Button>
        <AlertModal
          visible={modal}
          title={`카테고리 ` + categoryError?.type + ` 오류`}
          description={categoryError?.message}
          onConfirm={onConfirm}
          isError
        />
      </Box>
    </>
  );
};

export default CategoryListContainer;

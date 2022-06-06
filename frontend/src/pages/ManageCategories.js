import TitleAndDescription from "components/Common/TitleAndDescription";
import CategoryListContainer from "containers/CategoryListContainer";

const ManageCategories = () => {
  return (
    <>
      <TitleAndDescription
        titleText="CATEGORY"
        descriptionText="게시판의 카테고리를 생성, 삭제할 수 있습니다"
      />
      <CategoryListContainer />
    </>
  );
};

export default ManageCategories;

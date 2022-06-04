import { Grid } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import SurfBoardPNG from "assets/img/surf-board.png";
import { Fragment, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { loadCategories } from "redux/modules/categories";
import { initialize, menuData, setMenu } from "redux/modules/menu";
import { size } from "redux/modules/posts";
import { getCategories } from "services/CategoryService";
import styled from "styled-components";

const addLinkToCategories = (categories, size) => {
  return categories.map((category) => ({
    ...category,
    link: `/posts?categoryId=${category.id}&page=0&size=${size}`,
    children: addLinkToCategories(category.children, size), // children category를 파라미터로 한 재귀 호출
  }));
};

const Category = ({ name, link, state, depth }) => {
  return (
    <>
      <CategoryListItem depth={depth}>
        <StyledLink to={link} state={state}>
          {name}
        </StyledLink>
      </CategoryListItem>
    </>
  );
};

const renderCategories = (categories, depth = 0) => {
  return categories.map((category, index) => (
    <Fragment key={`${category.id}-${index}`}>
      <Category {...category} depth={depth} />
      {category.children?.length > 0 &&
        renderCategories(category.children, depth + 1)}
    </Fragment>
  ));
};

const LeftSidebarContainer = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const visible = useSelector((state) => state.header.visible);
  const menu = useSelector((state) => state.menu.menu);

  const fetchPostCategories = useCallback(() => {
    getCategories()
      .then((response) => {
        const categories = response.data.result.data;
        dispatch(loadCategories(categories));

        const processedCategories = addLinkToCategories(categories, size);
        processedCategories.unshift({
          id: 0,
          name: "전체",
          children: [],
          link: `/posts?page=0&size=${size}`,
        });
        dispatch(setMenu(processedCategories));
      })
      .catch((error) => console.log(error));
  }, [dispatch]);

  useEffect(() => {
    if (pathname === "/") {
      dispatch(initialize());
    } else if (pathname.includes("/posts")) {
      fetchPostCategories();
    } else if (pathname.includes("/location")) {
      dispatch(setMenu(menuData.location));
    } else if (pathname.includes("/admin")) {
      dispatch(setMenu(menuData.admin));
    }
  }, [dispatch, pathname, fetchPostCategories]);

  if (!visible) return null;

  return (
    <LeftSidebar item xs={2}>
      <SurfBoardIcon />
      <CategoryList>{renderCategories(menu)}</CategoryList>
    </LeftSidebar>
  );
};

export default LeftSidebarContainer;

const SurfBoardIcon = styled.div`
  position: absolute;
  left: 5vh;
  width: 155px;
  height: 155px;
  background: url(${SurfBoardPNG});
  background-size: 100%;
  background-repeat: repeat-x;
  mask-image: linear-gradient(
    to bottom,
    rgba(255, 0, 0, 0),
    rgba(255, 0, 0, 1)
  );
  filter: invert(34%) sepia(18%) saturate(1683%) hue-rotate(137deg)
    brightness(94%) contrast(88%);
`;

const LeftSidebar = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 87px);
`;

const CategoryList = styled.ul`
  // 수직 중앙 정렬
  display: flex;
  flex-direction: column;
  justify-content: center;

  position: absolute;
  padding: 0;
  margin: 0;
  left: 11em;
  width: 200px;
  min-height: 155px;
  list-style: none;
  z-index: 2; // ul이 icon 위에 위치하도록
`;

const CategoryListItem = styled.li`
  // 수직 중앙 정렬
  display: flex;
  align-items: center;

  padding: 3.5px 0 3.5px 10px;
  font-size: 0.8rem;
  font-family: "Goldplay", "Kopub Dotum Light";
  letter-spacing: 0.165rem;
  text-transform: uppercase;

  padding-left: ${(props) => `${props.depth * 10}px`};
`;

const StyledLink = styled(Link)`
  color: ${grey[700]};
  text-decoration: none;
`;

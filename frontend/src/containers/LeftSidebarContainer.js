import { Grid } from "@material-ui/core";
import SurfBoardPNG from "assets/img/surf-board.png";
import oc from "open-color";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LeftSidebarContainer = () => {
  const visible = useSelector((state) => state.header.visible);
  const { menu } = useSelector(({ menu }) => ({
    menu: menu.menu,
  }));

  if (!visible) return null;

  return (
    <LeftSidebar item xs={2}>
      <SurfBoardIcon />
      <CategoryList>
        {menu.map((item, index) => (
          <CategoryListItem key={index}>
            <StyledLink to={item.link} state={item.state}>
              {item.name}
            </StyledLink>
          </CategoryListItem>
        ))}
      </CategoryList>
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
  color: ${oc.gray[6]};
  font-size: 0.8rem;
  font-family: "Goldplay", "Kopub Dotum Light";
  letter-spacing: 0.165rem;
  text-transform: uppercase;
`;

const StyledLink = styled(Link)`
  color: ${oc.gray[6]};
  text-decoration: none;
`;

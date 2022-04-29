import { Link } from "react-router-dom";
import styled from "styled-components";

const NavContainer = styled.div`
  width: 200px;
  margin-left: auto;
`;

const Ul = styled.ul`
  display: flex;
  width: 100%;
  padding: 0 7%;
  list-style: none;
  margin-left: auto;
`;

const Li = styled.li`
  padding: 0 0 4px 0;
  margin-right: 40px;
`;

const NavBar = () => {
  return (
    <NavContainer>
      <Ul>
        <Li>
          <Link to="/posts">talk</Link>
        </Li>
        <Li>test</Li>
      </Ul>
    </NavContainer>
  );
};

export default NavBar;

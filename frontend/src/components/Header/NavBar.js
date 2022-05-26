import { Link } from "react-router-dom";
import styled from "styled-components";

const NavBar = ({ menu }) => {
  return (
    <NavContainer>
      <Ul>
        {menu.length > 0 &&
          menu.map((m, index) => (
            <Li key={index}>
              <Link to={m.link} state={m.state}>
                {m.name}
              </Link>
            </Li>
          ))}
      </Ul>
    </NavContainer>
  );
};

export default NavBar;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 300px;
`;

const Ul = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  font-family: "Goldplay";
  text-transform: uppercase;
  letter-spacing: -0.075rem;
  list-style: none;
`;

const Li = styled.li`
  padding: 5px;
  color: #343a40;

  & a {
    text-decoration: none;

    :visited {
      color: #343a40;
    }
  }
`;

import { grey } from "@material-ui/core/colors";
import { media } from "lib/styleUtils";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Header = ({ children }) => {
  return (
    <Positioner>
      <Top>
        <HeaderContent>
          <LogoText to="/">Move in waves</LogoText>
          {children}
        </HeaderContent>
      </Top>
      <Border />
    </Positioner>
  );
};

export default Header;

// 상단 고정
const Positioner = styled.div`
  position: static;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 9999;
`;

const Top = styled.div`
  background: hsla(15, 14%, 95%, 0.35);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 0 1rem;

  ${media.wide`
    width: 992px;
  `}

  ${media.tablet`
    width: 100%;
  `}
`;

const LogoText = styled(Link)`
  min-width: 200px;
  padding-bottom: 5px;
  font-family: "Berold Regular";
  font-size: calc(1rem + 1vw);
  letter-spacing: 2px;
  color: ${grey[800]};
  text-decoration: none;
`;

const Border = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
`;

import { media } from "lib/styleUtils";
import oc from "open-color";
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
  display: flex;
  flex-direction: column;
  position: static;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 9999;
`;

const Top = styled.div`
  display: inline-block;
  height: auto;
  width: 100%;
  background: hsla(15, 14%, 95%, 0.35);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-right: 1rem;
  padding-left: 1rem;

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
  color: ${oc.gray[8]};
  text-decoration: none;
`;

const Border = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
`;

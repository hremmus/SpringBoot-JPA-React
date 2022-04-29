import LogoPNG from "assets/img/logo-icon.png";
import { media } from "lib/styleUtils";
import oc from "open-color";
import { Link } from "react-router-dom";
import styled from "styled-components";

// 상단 고정
const Positioner = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 9999;
`;

// Top
const Top = styled.div`
  display: inline-block;
  height: 78px;
  width: 100%;
  background: hsla(15, 14%, 95%, 0.35);
`;

// 헤더 내용
const HeaderContent = styled.div`
  height: 78px;
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

const LogoIcon = styled.div`
  margin: 0px 0px 0px 25px;
  margin-right: auto;
  width: 55px;
  height: 55px;
  background: url(${LogoPNG});
  background-size: 100%;
  background-repeat: repeat-x;
`;

const LogoText = styled(Link)`
  min-width: 200px;
  padding-bottom: 5px;
  font-size: 2rem;
  letter-spacing: 4px;
  color: ${oc.gray[8]};
  font-family: "Neuton";
  text-decoration: none;
`;

// 하단 테두리
const Border = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
`;

const Header = ({ children }) => {
  return (
    <Positioner>
      <Top>
        <HeaderContent>
          <LogoIcon />
          <LogoText to="/">vegeable</LogoText>
          {children}
        </HeaderContent>
      </Top>
      <Border />
    </Positioner>
  );
};

export default Header;

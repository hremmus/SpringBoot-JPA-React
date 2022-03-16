import Bg from "assets/img/green-top.png";
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
  width: 100%;
`;

// Top
const Top = styled.div`
  display: inline-block;
  height: 45px;
  width: 100%;
  background: url(${Bg});
  background-position: top bottom;
  background-repeat: repeat-x;
  background-size: 100% 100%;
`;

// 프로모션
const Promotion = styled.p`
  margin-top: 0;
  height: 40px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: 1.4px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 1px 1px 5px rgb(84 101 126 / 80%);
`;

// 배경, 중앙 정렬
const Background = styled.div`
  background: hsla(15, 14%, 95%, 0.85);
  display: flex;
  justify-content: center;
  height: auto;
`;

// 헤더 내용
const HeaderContent = styled.div`
  width: 1200px;
  height: 55px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 1rem;
  padding-left: 1rem;
  ${media.wide`
    width: 992px;
  `}

  ${media.tablet`
    width: 100%;
  `}
`;

// 로고
const Logo = styled(Link)`
  min-width: 200px;
  padding-bottom: 5px;
  font-size: 2rem;
  letter-spacing: 4px;
  color: ${oc.gray[8]};
  font-family: "Neuton";
  text-decoration: none;
`;

// 중간 여백
const Spacer = styled.div`
  flex-grow: 1;
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
        <Promotion>~ p r o m o t i o n ~</Promotion>
      </Top>
      <Background>
        <HeaderContent>
          <Logo to="/">vegeable🌱</Logo>
          <Spacer />
          {children}
        </HeaderContent>
      </Background>
      <Border />
    </Positioner>
  );
};

export default Header;

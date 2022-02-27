import oc from "open-color";
import { Link } from "react-router-dom";
import styled from "styled-components";

// 중앙 고정
const Positioner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// 너비, 높이, 테두리
const FormBox = styled.div`
  width: 500px;
  min-height: 720px;
  margin: 0 auto;
`;

// 헤더
const Header = styled.div`
  height: 100px;
  text-align: center;
`;

// 로고
const Logo = styled(Link)`
  padding-bottom: 5px;
  font-size: 3rem;
  letter-spacing: 4px;
  color: ${oc.green[9]};
  font-family: "Neuton";
  text-decoration: none;
`;

// 컨테이너
const Container = styled.div`
  margin: 0 15px;
  background-color: #fff;
  border: 1px solid #ddd;
`;

// 내용
const Content = styled.div`
  width: 400px;
  padding: 25px 15px;
  margin: 15px 30px 15px;
`;

const AuthWrapper = ({ children }) => (
  <Positioner>
    <FormBox>
      <Header>
        <Logo to="/">vegeable</Logo>
      </Header>
      <Container>
        <Content>{children}</Content>
      </Container>
    </FormBox>
  </Positioner>
);

export default AuthWrapper;

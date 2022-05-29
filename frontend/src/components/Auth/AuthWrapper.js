import { grey } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AuthWrapper = ({ children }) => (
  <Positioner>
    <FormBox>
      <Header>
        <Logo to="/">Move in waves</Logo>
      </Header>
      <Container>
        <Content>{children}</Content>
      </Container>
    </FormBox>
  </Positioner>
);

export default AuthWrapper;

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
  font-family: "Berold Regular";
  font-size: calc(1.8rem + 1vw);
  letter-spacing: 2px;
  color: ${grey[800]};
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

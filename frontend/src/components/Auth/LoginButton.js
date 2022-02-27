import oc from "open-color";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 1rem;
  padding-top: 0.8rem;
  padding-bottom: 0.4rem;
  height: 48px;

  background: ${oc.teal[6]};
  color: white;

  text-align: center;
  vertical-align: middle;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;
  user-select: none;
  transition: 0.2s all;

  &:hover {
    background: ${oc.teal[5]};
  }

  &:active {
    background: ${oc.teal[7]};
  }
`;

const LoginButton = ({ children, onClick }) => (
  <Wrapper onClick={onClick}>{children}</Wrapper>
);

export default LoginButton;

import { cyan } from "@material-ui/core/colors";
import styled from "styled-components";

const AuthButton = ({ children, onClick }) => (
  <Wrapper onClick={onClick}>{children}</Wrapper>
);

export default AuthButton;

const Wrapper = styled.div`
  margin-top: 1rem;
  padding-top: 0.8rem;
  padding-bottom: 0.4rem;
  height: 48px;

  text-align: center;
  vertical-align: middle;
  color: #343a40;
  font-family: "Kopub Dotum Light";
  font-size: 1rem;
  letter-spacing: 0.2rem;
  background: ${cyan[100]};

  cursor: pointer;
  user-select: none;
  transition: 0.2s all;

  &:hover {
    background: ${cyan[200]};
  }

  &:active {
    background: ${cyan[500]};
  }
`;

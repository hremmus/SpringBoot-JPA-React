import { red } from "@material-ui/core/colors";
import { transitions } from "lib/styleUtils";
import styled from "styled-components";

const ShakeText = ({ children }) => <Wrapper>{children}</Wrapper>;

export default ShakeText;

const Wrapper = styled.div`
  margin: 1rem 0 1rem 0;
  text-align: center;
  font-family: "Kopub Dotum Light";
  color: ${red[500]};
  animation: ${transitions.shake} 0.3s ease-in;
  animation-fill-mode: forwards;
`;

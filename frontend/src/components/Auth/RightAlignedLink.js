import { Link, StylesProvider } from "@material-ui/core";
import oc from "open-color";
import styled from "styled-components";

const Aligner = styled.div`
  margin-top: 1rem;
  text-align: right;
`;

const StyledLink = styled(Link)`
  color: ${oc.gray[6]};
  &:hover {
    color: ${oc.gray[7]};
  }
`;

const RightAlignedLink = () => {
  return (
    <StylesProvider injectFirst>
      <Aligner>
        <StyledLink href="/auth/join" underline="always">
          회원가입
        </StyledLink>
      </Aligner>
    </StylesProvider>
  );
};

export default RightAlignedLink;

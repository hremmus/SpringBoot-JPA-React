import { Link, StylesProvider } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import styled from "styled-components";

const RightAlignedLink = ({ href, children }) => {
  return (
    <StylesProvider injectFirst>
      <Aligner>
        <StyledLink href={href} underline="always">
          {children}
        </StyledLink>
      </Aligner>
    </StylesProvider>
  );
};

export default RightAlignedLink;

const Aligner = styled.div`
  margin-top: 1rem;
  text-align: right;
`;

const StyledLink = styled(Link)`
  font-family: "Kopub Dotum Light";
  color: ${grey[500]};

  &:hover {
    color: ${grey[600]};
  }
`;

import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";

const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const WriteButton = ({ showWriteButton }) => {
  return (
    <WritePostButtonWrapper>
      {showWriteButton && (
        <Button component={Link} to="/posts/write">
          글쓰기
        </Button>
      )}
    </WritePostButtonWrapper>
  );
};

export default WriteButton;

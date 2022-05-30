import { IconButton } from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";
import { ReactComponent as WriteIcon } from "assets/svg/edit.svg";
import InputWithLabel from "lib/styleUtils";
import styled from "styled-components";

const CommentWriter = ({ content, handleChange, handleSubmit }) => {
  return (
    <CommentWriteForm autoComplete="off">
      <InputWithLabel
        name="content"
        value={content}
        onChange={handleChange}
        label="댓글 작성하기"
        helperText="댓글은 자신을 나타내는 얼굴입니다."
        variant="outlined"
        color="primary"
        margin="normal"
        size="small"
      />
      <IconButton onClick={handleSubmit} size="medium">
        <WriteStyled />
      </IconButton>
    </CommentWriteForm>
  );
};

export default CommentWriter;

const CommentWriteForm = styled.form`
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
  padding-left: 0.5rem;

  .MuiTextField-root {
    width: 95%;
  }

  button {
    top: 9px;
    height: 45px;
  }
`;

const WriteStyled = styled(WriteIcon)`
  stroke: ${cyan[700]};
`;

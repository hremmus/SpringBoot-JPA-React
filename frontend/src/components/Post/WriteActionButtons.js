import { StyledButton } from "lib/styleUtils";
import styled from "styled-components";

const WriteActionButtonsBlock = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 3rem;
  button + button {
    margin-left: 0.5rem;
  }
`;

const WriteActionButtons = ({ handleSubmit, isEdit, onCancel }) => {
  return (
    <WriteActionButtonsBlock>
      <StyledButton onClick={handleSubmit} green="1">
        {isEdit ? `수정` : `쓰기`}
      </StyledButton>
      <StyledButton onClick={onCancel}>취소</StyledButton>
    </WriteActionButtonsBlock>
  );
};

export default WriteActionButtons;

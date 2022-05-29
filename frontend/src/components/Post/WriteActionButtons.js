import { ButtonForLettersToGoUp } from "lib/styleUtils";
import styled from "styled-components";

const WriteActionButtons = ({ handleSubmit, isEdit, onCancel }) => {
  return (
    <WriteActionButtonsBlock>
      <ButtonForLettersToGoUp onClick={handleSubmit} className="cyan">
        {isEdit ? "수정" : "쓰기"}
      </ButtonForLettersToGoUp>
      <ButtonForLettersToGoUp onClick={onCancel}>취소</ButtonForLettersToGoUp>
    </WriteActionButtonsBlock>
  );
};

export default WriteActionButtons;

const WriteActionButtonsBlock = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 1.5rem 0;
  padding: 0.5rem;

  button + button {
    margin: 0 1rem 0 1rem;
  }
`;

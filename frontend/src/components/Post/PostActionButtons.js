import { AskModal } from "lib/styleUtils";
import oc from "open-color";
import { useState } from "react";
import styled from "styled-components";

const PostActionButtonsBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: -1.9rem 0.2rem 2rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: ${oc.gray[6]};
  font-weight: bold;
  border: none;
  outline: none;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background: ${oc.gray[1]};
    color: ${oc.cyan[7]};
  }
  & + & {
    margin-left: 0.5rem;
  }
`;

const PostActionButtons = ({ onEdit, onRemove }) => {
  const [modal, setModal] = useState(false);

  const onConfirm = () => {
    setModal(false);
    onRemove();
  };

  const onCancel = () => {
    setModal(false);
  };

  return (
    <>
      <PostActionButtonsBlock>
        <ActionButton onClick={onEdit}>수정</ActionButton>
        <ActionButton
          onClick={() => {
            setModal(true);
          }}
        >
          삭제
        </ActionButton>
      </PostActionButtonsBlock>
      <AskModal
        visible={modal}
        title="게시글 삭제"
        description="게시글을 정말 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  );
};

export default PostActionButtons;

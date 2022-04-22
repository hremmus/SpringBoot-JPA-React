import { Button } from "@material-ui/core";
import { AskModal } from "lib/styleUtils";
import { useState } from "react";

const CommentActionButtons = ({ onEdit, onRemove }) => {
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
      <Button onClick={onEdit}>수정</Button>
      <Button
        onClick={() => {
          setModal(true);
        }}
      >
        삭제
      </Button>
      <AskModal
        visible={modal}
        title="댓글 삭제"
        description="댓글을 정말 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  );
};

export default CommentActionButtons;

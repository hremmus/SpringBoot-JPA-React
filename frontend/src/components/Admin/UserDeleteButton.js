import { Button } from "@material-ui/core";
import { cyan, red } from "@material-ui/core/colors";

import { ReactComponent as UserMinus } from "assets/svg/user-minus.svg";
import styled from "styled-components";

const UserDeleteButton = ({ onClick }) => {
  return (
    <ButtonStyled onClick={onClick} startIcon={<UserMinusIcon />}>
      삭제
    </ButtonStyled>
  );
};

export default UserDeleteButton;

const ButtonStyled = styled(Button)`
  &.MuiButton-root {
    color: ${red[400]};
    font-weight: 600;
  }

  &.MuiButton-root:hover {
    background-color: white;
  }
`;

const UserMinusIcon = styled(UserMinus)`
  fill: ${cyan[200]};
  color: ${red[400]};
`;

import { Chip } from "@material-ui/core";
import styled from "styled-components";

const GradeChip = ({ grade }) => {
  let borderColor;

  switch (grade) {
    case "초급":
      borderColor = "#ffcd1e";
      break;
    case "중급":
      borderColor = "#0bd674";
      break;
    case "상급":
      borderColor = "#f4496d";
      break;
    default:
      borderColor = "#e9ecf4";
  }

  return (
    <ChipStyled
      variant="outlined"
      size="small"
      label={grade}
      borderColor={borderColor}
    />
  );
};

export default GradeChip;

const ChipStyled = styled(Chip)`
  // &&: Material-UI의 고유 CSS보다 styled-component로 지정한 CSS가 우선으로 적용됨
  && {
    border: 2px solid ${(props) => props.borderColor};
    background-color: #fff;
    font-family: "NIXGONM-Vb";
    font-weight: 700;
  }
`;

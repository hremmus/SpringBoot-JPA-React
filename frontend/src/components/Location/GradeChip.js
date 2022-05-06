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
      $borderColor={borderColor}
      // $: camel case로 변수명을 작성하여 warning이 발생
      // => 접두사로 '$'를 붙여 해당 props를 DOM에 전달하지 않을 것임을 알림.
      //    props가 실제 HTML 속성에 영향을 주지 않고 styled-components 내에서만 쓰이도록 한다.
    />
  );
};

export default GradeChip;

const ChipStyled = styled(Chip)`
  // &&: Material-UI의 고유 CSS보다 styled-component로 지정한 CSS가 우선으로 적용됨
  && {
    border: 2px solid ${(props) => props.$borderColor};
    background-color: #fff;
    font-family: "NIXGONM-Vb";
    font-weight: 700;
  }
`;

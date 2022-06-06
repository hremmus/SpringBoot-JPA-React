import { TextField } from "@material-ui/core";
import { cyan, grey, red } from "@material-ui/core/colors";
import AlertIcon from "assets/img/alert.png";
import styled, { css, keyframes } from "styled-components";

// 미디어 쿼리 헬퍼: https://www.styled-components.com/docs/advanced#media-templates 참조
export const sizes = {
  wide: "1200px",
  desktop: "992px",
  tablet: "768px",
  phone: "376px",
};

export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

export const transitions = {
  shake: keyframes`
    0% {
      transform: translate(-30px);
    }
    25% {
      transform: translate(15px);
    }
    50% {
      transform: translate(-10px);
    }
    75% {
      transform: translate(5px);
    }
    100% {
      transform: translate(0px);
    }
  `,

  showModal: keyframes`
    0% {
      transform: scale(0);
    }
    60% {
      transform: scale(1.1);
    }
    80% {
      transform: scale(.95);
    }
    100% {
      transform: scale(1);
    }
  `,

  hideModal: keyframes`
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(0);
    }
  `,
};

export const VerticalAligner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const splitText = (text) => {
  return text.split("").map((char, index) => <span key={index}>{char}</span>);
};

export const ButtonForLettersToGoUp = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      <div>{splitText(children)}</div>
    </StyledButton>
  );
};

const StyledButton = styled.button`
  --background: #fff;
  --text: ${grey[700]};
  --font-size: 14px;
  --duration: 0.44s;
  --move-hover: -4px;
  --shadow: 0 2px 8px -1px rgba(18, 22, 33, 0.05);
  --shadow-hover: 0 4px 20px -2px rgba(18, 22, 33, 0.15);
  --font-shadow: var(--font-size);

  display: block;
  padding: 0.5rem 1rem;
  appearance: none;
  background: var(--background);
  font-family: "Kopub Dotum Light";
  font-size: var(--font-size);
  color: var(--text);
  letter-spacing: 2px;
  line-height: var(--font-size);
  border: none;
  border-radius: 14px;
  box-shadow: var(--shadow);
  transform: translateY(var(--y)) translateZ(0);
  transition: transform var(--duration) ease, box-shadow var(--duration) ease;

  div {
    display: flex;
    overflow: hidden;
    text-shadow: 0 var(--font-shadow) 0 var(--text);

    span {
      display: block;
      transform: translateY(var(--m)) translateZ(0);
      transition: transform var(--duration) ease;
      ${Array.from(
        { length: 11 },
        (_, i) => `
          &:nth-child(${i + 1}) {
            transition-delay: ${i / 10}s;
          }
        `
      ).join("")}
    }
  }

  &.cyan {
    --text: ${cyan[700]};
  }

  &.red {
    --text: ${red[700]};
  }

  &:hover {
    --y: var(--move-hover);
    --shadow: var(--shadow-hover);
    span {
      --m: calc(var(--font-size) * -1);
    }
  }
`;

export const InputWithLabel = ({ ...props }) => {
  return <StyledTextField {...props} />;
};

export default InputWithLabel;

const StyledTextField = styled(TextField)`
  width: 100%;

  && {
    margin: 10px 0;
  }

  label.Mui-focused {
    color: ${cyan[700]};
  }

  .Mui-focused.MuiOutlinedInput-root {
    fieldset {
      border-color: ${grey[200]};
    }
  }

  .MuiInput-underline:before {
    border-bottom: none;
  }

  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: 2px solid ${cyan[700]};
  }

  .MuiInput-underline:after {
    border-bottom: 2px solid ${grey[200]};
  }
`;

export const AskModal = ({
  visible,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;
  return (
    <Fullscreen>
      <AskModalBlock>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="buttons">
          <ButtonForLettersToGoUp onClick={onCancel}>
            {cancelText}
          </ButtonForLettersToGoUp>
          <ButtonForLettersToGoUp
            onClick={onConfirm}
            className={confirmText === "삭제" ? "red" : "cyan"}
          >
            {confirmText}
          </ButtonForLettersToGoUp>
        </div>
      </AskModalBlock>
    </Fullscreen>
  );
};

const Fullscreen = styled.div`
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AskModalBlock = styled.div`
  padding: 1.5rem;
  width: 15vw;
  font-family: "Kopub Dotum Light";
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.125);

  h2 {
    margin: 0.2rem 0 1.5rem 0;
    padding: 0.2rem;
  }

  p {
    margin: 0.5rem 0 1.5rem 0;
    padding: 0.2rem;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;

    // 두 번째 button에만 스타일이 적용됨
    button + button {
      margin-left: 0.5rem;
    }
  }
`;

export const ErrorModal = ({
  visible,
  title,
  description,
  confirmText = "확인",
  onConfirm,
}) => {
  if (!visible) return null;
  return (
    <Fullscreen>
      <ErrorModalBlock id="error-modal">
        <img src={AlertIcon} width="44" height="38" alt="alert" />
        <span className="title">{title}</span>
        <p>{description}</p>
        <div onClick={onConfirm} className="button">
          {confirmText}
        </div>
      </ErrorModalBlock>
    </Fullscreen>
  );
};

const ErrorModalBlock = styled.div`
  position: absolute;
  width: 13vw;
  height: 17vh;
  text-align: center;
  font-family: "Kopub Dotum Light";
  background: #fff;
  border-radius: 6px;
  box-shadow: 4px 8px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;

  animation: ${transitions.showModal} 0.7s ease-in-out;

  &.hide {
    animation: ${transitions.hideModal} 0.6s ease-in-out both;
  }

  img {
    margin-top: 24px;
  }

  .title {
    display: block;
    margin: 10px 0 5px 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  p {
    padding: 0 30px;
    font-size: 14px;
    font-weight: 300;
    line-height: 19px;
  }

  .button {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3vh;
    font-size: 14px;
    line-height: 40px;
    color: #fff;
    background: ${red[400]};
    cursor: pointer;
    transition: background 0.3s ease-in-out;

    &:hover {
      background: ${red[600]};
    }
  }
`;

import oc from "open-color";
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
};

export const VerticalAligner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

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
  width: 320px;
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.125);
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  p {
    margin-bottom: 3rem;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
`;

export const StyledButton = styled.button`
  height: 2rem;
  padding: 0.25rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  outline: none;
  cursor: pointer;
  color: white;
  background: ${oc.gray[7]};

  &:hover {
    background: ${oc.gray[5]};
  }
  &:active {
    background: ${oc.gray[8]};
  }

  & + & {
    margin-left: 0.5rem;
  }

  ${(props) =>
    props.green &&
    css`
      background: ${oc.green[6]};
      &:hover {
        background: ${oc.green[4]};
      }
      &:active {
        background: &{oc.green[7]};
      }
    `}
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
          <StyledButton onClick={onCancel}>{cancelText}</StyledButton>
          <StyledButton green="1" onClick={onConfirm}>
            {confirmText}
          </StyledButton>
        </div>
      </AskModalBlock>
    </Fullscreen>
  );
};

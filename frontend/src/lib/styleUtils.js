<<<<<<< Updated upstream
import { css } from "styled-components";
=======
import styled, { css, keyframes } from "styled-components";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes

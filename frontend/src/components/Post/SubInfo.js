import oc from "open-color";
import styled, { css } from "styled-components";

const SubInfoBlock = styled.div`
  ${(props) =>
    props.hasMarginTop &&
    css`
      margin-top: 1rem;
    `}
  color: ${oc.gray[6]};

  span + span:before {
    color: ${oc.gray[4]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: "\\B7"; /* · */
  }
`;

export const SubInfo = ({
  nickname,
  createdDate,
  modifiedDate,
  hasMarginTop,
}) => {
  return (
    <SubInfoBlock hasMarginTop={hasMarginTop}>
      <span>
        <b>{nickname}</b>
      </span>
      <span>{new Date(createdDate).toLocaleString()}</span>
      {modifiedDate > createdDate && (
        <span>(수정) {new Date(modifiedDate).toLocaleString()}</span>
      )}
    </SubInfoBlock>
  );
};

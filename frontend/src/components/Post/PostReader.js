import oc from "open-color";
import styled from "styled-components";
import { SubInfo } from "./SubInfo";

const PostReaderBlock = styled.div`
  width: 1200px;
  padding-top: 6rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0 auto; // 중앙 정렬
  margin-top: 0.5rem;
`;

const PostHead = styled.div`
  border-bottom: 1px solid ${oc.gray[2]};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  h1 {
    font-size: 2rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContent = styled.div`
  white-space: pre-wrap; // 줄바꿈 반영
  font-size: 1.3125rem;
  color: ${oc.gray[8]};
`;

const PostReader = ({ post, actionButtons }) => {
  const { title, content, user, categoryId, createdDate, modifiedDate } = post;
  return (
    <PostReaderBlock>
      <PostHead>
        <h1>
          [{categoryId}] {title}
        </h1>
        <SubInfo
          nickname={user.nickname}
          createdDate={createdDate}
          modifiedDate={modifiedDate}
          hasMarginTop
        />
      </PostHead>
      {actionButtons}
      <PostContent>{content}</PostContent>
    </PostReaderBlock>
  );
};

export default PostReader;

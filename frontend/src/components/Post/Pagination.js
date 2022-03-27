import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  padding: 0 1rem;
`;

const PageButton = styled(Link)`
  float: left;
  padding: 8px 16px;
  color: black;
  border: 1px solid #ddd;
  text-decoration: none;
  &[aria-current] {
    color: white;
    border: 1px solid #9dda91;
    background-color: #9dda91;
    cursor: default;
  }

  &:hover:not(&[aria-current]) {
    background-color: #ddd;
  }
`;

const Pagination = ({ page, totalPages, limit, hasNext }) => {
  const [currentPageArray, setCurrentPageArray] = useState([]);
  const [totalPageArray, setTotalPageArray] = useState([]);

  useEffect(() => {
    const slicedPageArray = sliceArrayByLimit(totalPages, limit);
    setTotalPageArray(slicedPageArray);
    setCurrentPageArray(slicedPageArray[0]);
  }, [totalPages, limit]);

  const sliceArrayByLimit = (totalPages, limit) => {
    const totalPageArray = Array(totalPages)
      .fill()
      .map((_, i) => i); // [0, 1, 2, 3, 4, 5, 6, 7]
    return Array(Math.ceil(totalPages / limit)) // ceil: 소수점 이하 올림 (ex) 6/5 => 2, 13/5 => 3
      .fill()
      .map(() => totalPageArray.splice(0, limit)); // splice: 0번째 요소부터 limit개를 제거(된 값이 담긴 배열이 반환) [[0, 1, 2, 3, 4], [5, 6, 7]]
  };

  useEffect(() => {
    // 현재 페이지가 단위를 넘어갈 때 (이전/다음) 해당 페이지 배열로 전환
    if (page % limit === 1) {
      // 1, 6, 11, 16, ...
      setCurrentPageArray(totalPageArray[Math.floor(page / limit)]); // floor: 소수점 이하 버림 (ex) 1/5 = 0, 6/5 = 1, 11/5 = 2, 16/5 = 3
    } else if (page % limit === 0) {
      // 5, 10, 15, 20, ...
      setCurrentPageArray(totalPageArray[Math.floor(page / limit) - 1]);
    }
  }, [page, limit, totalPageArray, setCurrentPageArray]);

  return (
    <PaginationWrapper>
      <ButtonWrapper>
        <PageButton
          to="/posts?page=0&size=20"
          onClick={(event) => page === 1 && event.preventDefault()}
        >
          &laquo;
        </PageButton>
        <PageButton
          to={`/posts?page=${page - 2}&size=20`}
          onClick={(event) => page === 1 && event.preventDefault()}
        >
          &lsaquo;
        </PageButton>
        {currentPageArray?.map((i) => (
          <PageButton
            key={i}
            to={`/posts?page=${i}&size=20`}
            aria-current={page === i + 1 ? "page" : null}
          >
            {i + 1}
          </PageButton>
        ))}
        <PageButton
          to={`/posts?page=${page}&size=20`}
          onClick={(event) => !hasNext && event.preventDefault()}
        >
          &rsaquo;
        </PageButton>
        <PageButton
          to={`/posts?page=${totalPages - 1}&size=20`}
          onClick={(event) => !hasNext && event.preventDefault()}
        >
          &raquo;
        </PageButton>
      </ButtonWrapper>
    </PaginationWrapper>
  );
};

export default Pagination;

import qs from "qs";
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

const buildLink = ({ categoryId, page, size }) => {
  const query = qs.stringify({ page, size });
  return categoryId
    ? `/posts?categoryId=${categoryId}&${query}`
    : `/posts?${query}`;
};

const Pagination = ({
  categoryId,
  page,
  size,
  totalPages,
  limit,
  hasNext,
  currentPageArray,
}) => {
  return (
    <PaginationWrapper>
      <ButtonWrapper>
        <PageButton
          to={buildLink({ categoryId, page: 0, size })}
          onClick={(event) => page === 1 && event.preventDefault()}
        >
          &laquo;
        </PageButton>
        <PageButton
          to={buildLink({ categoryId, page: page - 2, size })}
          onClick={(event) => page === 1 && event.preventDefault()}
        >
          &lsaquo;
        </PageButton>
        {currentPageArray?.map((i) => (
          <PageButton
            key={i}
            to={buildLink({ categoryId, page: i, size })}
            aria-current={page === i + 1 ? "page" : null}
          >
            {i + 1}
          </PageButton>
        ))}
        <PageButton
          to={buildLink({ categoryId, page: page, size })}
          onClick={(event) => !hasNext && event.preventDefault()}
        >
          &rsaquo;
        </PageButton>
        <PageButton
          to={buildLink({ categoryId, page: totalPages - 1, size })}
          onClick={(event) => !hasNext && event.preventDefault()}
        >
          &raquo;
        </PageButton>
      </ButtonWrapper>
    </PaginationWrapper>
  );
};

export default Pagination;

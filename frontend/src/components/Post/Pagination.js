import qs from "qs";
import { Link } from "react-router-dom";
import styled from "styled-components";

const buildLink = ({ categoryId, userId, page, size }) => {
  const query = qs.stringify({ page, size });

  if (categoryId) {
    return `/posts?categoryId=${categoryId}&${query}`;
  } else if (userId) {
    return `/posts?userId=${userId}&${query}`;
  } else {
    return `/posts?${query}`;
  }
};

const Pagination = ({
  categoryId,
  userId,
  page,
  size,
  totalPages,
  hasNext,
  currentPageArray,
}) => {
  return (
    <PaginationWrapper>
      <PageButton
        to={buildLink({ categoryId, userId, page: 0, size })}
        onClick={(event) => page === 1 && event.preventDefault()}
      >
        &laquo;
      </PageButton>
      <PageButton
        to={buildLink({ categoryId, userId, page: page - 2, size })}
        onClick={(event) => page === 1 && event.preventDefault()}
      >
        &lsaquo;
      </PageButton>
      {currentPageArray?.map((i) => (
        <PageButton
          key={i}
          to={buildLink({ categoryId, userId, page: i, size })}
          aria-current={page === i + 1 ? "page" : null}
        >
          {i + 1}
        </PageButton>
      ))}
      <PageButton
        to={buildLink({ categoryId, userId, page: page, size })}
        onClick={(event) => !hasNext && event.preventDefault()}
      >
        &rsaquo;
      </PageButton>
      <PageButton
        to={buildLink({ categoryId, userId, page: totalPages - 1, size })}
        onClick={(event) => !hasNext && event.preventDefault()}
      >
        &raquo;
      </PageButton>
    </PaginationWrapper>
  );
};

export default Pagination;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3.5rem 0;
  font-family: "goldplay";
`;

const PageButton = styled(Link)`
  padding: 8px 16px;
  color: black;
  text-decoration: none;

  &[aria-current] {
    color: #01a0b0;
    cursor: default;
  }

  &:hover:not(&[aria-current]) {
    color: #98e1e8;
  }
`;

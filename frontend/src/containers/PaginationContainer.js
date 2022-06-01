import Pagination from "components/Post/Pagination";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { limit, size } from "redux/modules/posts";

const PaginationContainer = ({ categoryId, userId, page }) => {
  const posts = useSelector((state) => state.posts.posts);
  const totalPages = useSelector((state) => state.posts.totalPages);
  const hasNext = useSelector((state) => state.posts.hasNext);

  const [currentPageArray, setCurrentPageArray] = useState([]);
  const [totalPageArray, setTotalPageArray] = useState([]);

  const sliceArrayByLimit = (totalPages, limit) => {
    const totalPageArray = Array(totalPages)
      .fill()
      .map((_, i) => i); // [0, 1, 2, 3, 4, 5, 6, 7]
    return Array(Math.ceil(totalPages / limit)) // ceil: 소수점 이하 올림 (ex) 6/5 => 2, 13/5 => 3
      .fill()
      .map(() => totalPageArray.splice(0, limit)); // splice: 0번째 요소부터 limit개를 제거(된 값이 담긴 배열이 반환) [[0, 1, 2, 3, 4], [5, 6, 7]]
  };

  useEffect(() => {
    const slicedPageArray = sliceArrayByLimit(totalPages, limit);
    setTotalPageArray(slicedPageArray);
    setCurrentPageArray(
      slicedPageArray.find((slicedPage) => slicedPage.includes(page - 1))
    );
  }, [totalPages, page]);

  useEffect(() => {
    // 현재 페이지가 단위를 넘어갈 때 (이전/다음) 해당 페이지 배열로 전환
    if (page % limit === 1) {
      // 1, 6, 11, 16, ...
      setCurrentPageArray(totalPageArray[Math.floor(page / limit)]); // floor: 소수점 이하 버림 (ex) 1/5 = 0, 6/5 = 1, 11/5 = 2, 16/5 = 3
    } else if (page % limit === 0) {
      // 5, 10, 15, 20, ...
      setCurrentPageArray(totalPageArray[Math.floor(page / limit) - 1]);
    }
  }, [page, totalPageArray, setCurrentPageArray]);

  return (
    posts.length !== 0 && (
      <Pagination
        categoryId={categoryId}
        userId={userId}
        page={page}
        size={size}
        totalPages={totalPages}
        limit={limit}
        hasNext={hasNext}
        currentPageArray={currentPageArray}
      />
    )
  );
};

export default PaginationContainer;

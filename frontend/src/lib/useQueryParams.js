import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const categoryIdParameter = searchParams.get("categoryId") || null;
    const userIdParameter = searchParams.get("userId") || null;
    const pageParameter = parseInt(searchParams.get("page"), 10) || 0;

    setCategoryId(categoryIdParameter);
    setUserId(userIdParameter);
    setPage(pageParameter);
  }, [searchParams]); // query string이 변경될 때마다 구문 분석하여 데이터를 업데이트 함

  return { categoryId, userId, page };
};

export default useQueryParams;

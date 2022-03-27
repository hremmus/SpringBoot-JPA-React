import Pagination from "components/Post/Pagination";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const PaginationContainer = () => {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page"), 10) + 1 || 1;

  const { posts, totalPages, hasNext } = useSelector(({ posts }) => ({
    posts: posts.posts,
    totalPages: posts.totalPages,
    hasNext: posts.hasNext,
  }));

  if (!posts) return null;

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      limit={5}
      hasNext={hasNext}
    />
  );
};

export default PaginationContainer;

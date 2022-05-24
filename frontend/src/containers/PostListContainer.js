import PostList from "components/Post/PostList";
import WriteButton from "components/Post/WriteButton";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { initialize, setMenu } from "redux/modules/menu";
import { loadPosts } from "redux/modules/posts";
import { getCategories } from "services/CategoryService";
import { getPosts } from "services/PostService";

const addLinkToCategories = (categories) => {
  return categories.map((category) => ({
    ...category,
    link: `/posts?categoryId=${category.id}&page=0&size=20`,
    children: addLinkToCategories(category.children), // children category를 파라미터로 한 재귀 호출
  }));
};

const PostListContainer = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page"), 10) || 0;
  const dispatch = useDispatch();

  const { posts, isLoggedIn } = useSelector((state) => ({
    posts: state.posts.posts,
    isLoggedIn: state.user.isLoggedIn,
  }));
  useEffect(() => {
    getCategories()
      .then((response) => {
        const categories = addLinkToCategories(response.data.result.data);
        categories.unshift({
          id: 0,
          name: "전체",
          children: [],
          link: "/posts?page=0&size=20",
        });
        dispatch(setMenu(categories));
      })
      .catch((error) => console.log(error));

    return () => {
      if (pathname !== "/posts") {
        dispatch(initialize());
      }
    };
  }, [dispatch, pathname]);

  useEffect(() => {
    const categoryId = searchParams.get("categoryId") || null;
    getPosts({
      page: page,
      size: 20,
      categoryId: categoryId,
      userId: null,
    })
      .then((response) => {
        dispatch(loadPosts(response.data.result.data));
      })
      .catch((error) => console.log(error));
  }, [dispatch, searchParams, page]);

  return (
    <>
      <WriteButton showWriteButton={isLoggedIn} /> <PostList posts={posts} />
    </>
  );
};

export default PostListContainer;

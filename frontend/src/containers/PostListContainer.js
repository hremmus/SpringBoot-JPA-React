import { Box } from "@material-ui/core";
import ShopBannerJPG from "assets/img/shop-banner.jpg";
import PostList from "components/Post/PostList";
import WriteButton from "components/Post/WriteButton";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPosts, size } from "redux/modules/posts";
import { getPosts } from "services/PostService";
import styled from "styled-components";

const PostListContainer = ({ categoryId, userId, page }) => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const posts = useSelector((state) => state.posts.posts);
  const categories = useSelector((state) => state.categories.categories || []);

  const fetchPosts = useCallback(() => {
    getPosts({
      page: page,
      size: size,
      categoryId: categoryId,
      userId: userId,
    })
      .then((response) => {
        dispatch(loadPosts(response.data.result.data));
      })
      .catch((error) => console.log(error));
  }, [dispatch, page, categoryId, userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <Box display="flex" justifyContent="center">
        <a
          href="https://www.surfcornerstore.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AdBanner src={ShopBannerJPG} alt="shop" />
        </a>
      </Box>
      <WriteButton showWriteButton={isLoggedIn} />
      <PostList posts={posts} size={size} categories={categories} />
    </>
  );
};

export default PostListContainer;

const AdBanner = styled.img`
  width: 500px;
  height: 180px;
`;

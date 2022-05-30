import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import styled from "styled-components";

const findParentCategory = (categories, parentCategoryId) => {
  for (const category of categories) {
    // 최상위 카테고리 중에서 부모 카테고리를 찾음
    if (category.id === parentCategoryId) {
      return category;
    }

    // 재귀 호출하여 하위 카테고리(들)로 내려가 부모 카테고리를 찾음
    if (category.children.length > 0) {
      const parentCategory = findParentCategory(
        category.children,
        parentCategoryId
      );
      if (parentCategory) {
        return parentCategory;
      }
    }
  }

  return categories.find((category) => category.id === parentCategoryId);
};

const Category = ({ category, size }) => {
  return (
    <CategoryBlock>
      <Link
        className="category"
        to={`/posts?categoryId=${category.id}&page=0&size=${size}`}
      >
        {category.name}
      </Link>
    </CategoryBlock>
  );
};

const PostItem = ({ post, category, size }) => {
  const createdDate = new Date(post.createdDate);
  const today = new Date();

  return (
    <TableRow>
      <TableCell className="postId" style={tdStyle} align="center">
        {post.id}
      </TableCell>
      <TableCell className="category" style={tdStyle} align="center">
        <Category category={category} size={size} />
      </TableCell>
      <TableCell style={tdStyle} align="left">
        <PostLink to={`/posts/${post.id}`}>{post.title}</PostLink>
      </TableCell>
      <TableCell className="writer" style={tdStyle} align="center">
        {post.nickname}
      </TableCell>
      <TableCell className="createdDate" style={tdStyle} align="center">
        {today.getDate() === createdDate.getDate() &&
        today.getMonth() === createdDate.getMonth() &&
        today.getFullYear() === createdDate.getFullYear()
          ? createdDate.toLocaleTimeString()
          : createdDate.toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
};

const PostList = ({ posts, size, categories }) => {
  return posts.length !== 0 ? (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow variant="head">
              <TableCell className="postId" align="center">
                글번호
              </TableCell>
              <TableCell className="category" align="center">
                카테고리
              </TableCell>
              <TableCell align="left">제목</TableCell>
              <TableCell className="writer" align="center">
                작성자
              </TableCell>
              <TableCell className="createdDate" align="center">
                작성일
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                category={findParentCategory(categories, post.categoryId) || {}}
                size={size}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <style jsx="true">{`
        .postId {
          width: 80px;
        }
        .category {
          width: 120px;
        }
        .writer {
          width: 150px;
        }
        .createdDate {
          width: 160px;
        }
      `}</style>
    </>
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      maxWidth="100"
      height="50vh"
      paddingTop="15vh"
      fontFamily="Kopub Dotum Light"
    >
      게시글이 존재하지 않습니다.
    </Box>
  );
};

export default PostList;

const tdStyle = {
  padding: "6px 16px 6px 16px",
};

const PostLink = styled(Link)`
  color: black;
  text-decoration: none;
`;

const CategoryBlock = styled.div`
  .category {
    display: inline-block;
    color: ${cyan[700]};

    &:hover {
      color: ${cyan[600]};
    }
    text-decoration: none;
  }
`;

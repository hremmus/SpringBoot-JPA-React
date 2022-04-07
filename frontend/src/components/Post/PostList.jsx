import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import oc from "open-color";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CategoryList from "./CategoryList";

const PostListBlock = styled.div`
  width: 1300px;
  padding-top: 6rem;
  margin: 1rem auto;
`;

const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

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
    color: ${oc.cyan[7]};
    &:hover {
      color: ${oc.cyan[6]};
    }
    text-decoration: none;
  }
`;

const Category = ({ categoryId }) => {
  return (
    <CategoryBlock>
      <Link
        className="category"
        to={`/posts?categoryId=${categoryId}&page=0&size=20`}
      >
        {
          {
            1: `카테1`,
            2: `카테2`,
            3: `카테3`,
          }[categoryId]
        }
      </Link>
    </CategoryBlock>
  );
};

const PostItem = ({ post }) => {
  const createdDate = new Date(post.createdDate);
  const today = new Date();
  const categoryId = post.categoryId;
  return (
    <TableRow>
      <TableCell className="postId" style={tdStyle} align="center">
        {post.id}
      </TableCell>
      <TableCell className="category" style={tdStyle} align="center">
        <Category categoryId={categoryId} />
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

const PostList = ({ posts, showWriteButton }) => {
  return (
    <>
      <PostListBlock>
        <Grid container spacing={2}>
          <Grid item md={2}>
            <CategoryList />
          </Grid>
          <Grid item md={10} xs={12}>
            <WritePostButtonWrapper>
              {showWriteButton && <Link to="/posts/write">글쓰기</Link>}
            </WritePostButtonWrapper>
            <TableContainer component={Paper}>
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
                    <PostItem key={post.id} post={post} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </PostListBlock>
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
  );
};

export default PostList;

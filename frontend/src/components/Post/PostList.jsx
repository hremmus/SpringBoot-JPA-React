import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from "@material-ui/core";
import oc from "open-color";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    backgroundColor: theme.palette.action.hover,
  },
}));

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

const PostList = ({ posts }) => {
  const classes = useStyles();

  return posts.length !== 0 ? (
    <div className={classes.root}>
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
              <PostItem key={post.id} post={post} />
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
    </div>
  ) : (
    <Container className={classes.root}>
      <Typography
        component="div"
        align="center"
        style={{ paddingTop: "15vh", height: "50vh" }}
      >
        게시글이 존재하지 않습니다.
      </Typography>
    </Container>
  );
};

export default PostList;

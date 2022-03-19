import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { VerticalAligner } from "lib/styleUtils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeInput, initializeForm } from "redux/modules/post";
import { createPost } from "services/PostService";

const PostWriteContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post } = useSelector(({ post }) => ({
    post: post.post,
  }));

  useEffect(() => {
    return () => {
      dispatch(initializeForm());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        key: name,
        value,
      })
    );
  };

  const handleSubmit = (e) => {
    createPost(post)
      .then((response) => {
        if (response.data.success) {
          navigate("/posts");
        }
      })
      .catch((error) => alert(error.response.data.result.message));
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: "6.5rem" }}>
      <VerticalAligner>
        <h1>글쓰기</h1>
        <FormControl margin="dense" style={{ width: "100px" }}>
          <InputLabel id="demo-simple-select-label">카테고리</InputLabel>
          <Select
            name="categoryId"
            labelId="demo-simple-select-label"
            label="카테고리"
            value={post.categoryId}
            onChange={handleChange}
          >
            <MenuItem value="1">자유</MenuItem>
            <MenuItem value="2">질문</MenuItem>
            <MenuItem value="3">레시피</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="title"
          label="제목"
          value={post.title}
          onChange={handleChange}
          variant="standard"
        />
        <TextField
          fullWidth
          name="content"
          label="내용"
          value={post.content}
          multiline
          minRows="20"
          onChange={handleChange}
          variant="standard"
        />
        <Button onClick={handleSubmit}>쓰기</Button>
      </VerticalAligner>
    </Container>
  );
};

export default PostWriteContainer;

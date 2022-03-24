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
import { useNavigate } from "react-router-dom";
import { createPost, updatePost } from "services/PostService";

const PostWriter = ({ handleChange, id, title, content, categoryId }) => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    if (id) {
      updatePost({ id, title, content, categoryId })
        .then((response) => {
          if (response.data.success) navigate(`/posts/${id}`);
        })
        .catch((error) => console.log(error));
      return;
    }

    createPost({ title, content, categoryId })
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
            value={categoryId}
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
          value={title}
          onChange={handleChange}
          variant="standard"
        />
        <TextField
          fullWidth
          name="content"
          label="내용"
          value={content}
          multiline
          minRows="20"
          onChange={handleChange}
          variant="standard"
        />
      </VerticalAligner>
      <Button onClick={handleSubmit}>{id ? `수정` : `쓰기`}</Button>
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Container>
  );
};

export default PostWriter;

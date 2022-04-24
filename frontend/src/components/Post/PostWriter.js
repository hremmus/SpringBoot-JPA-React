import {
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { VerticalAligner } from "lib/styleUtils";
import { useNavigate } from "react-router-dom";
import { createPost, updatePost } from "services/PostService";
import WriteActionButtons from "./WriteActionButtons";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
}));

const PostWriter = ({ handleChange, id, title, content, categoryId }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const formData = new FormData();

  const handleSubmit = (e) => {
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    // for (const keyValue of formData) console.log(keyValue);

    if (id) {
      updatePost({ id, title, content, categoryId })
        .then((response) => {
          if (response.data.success) navigate(`/posts/${id}`);
        })
        .catch((error) => console.log(error));
      return;
    }

    createPost(formData)
      .then((response) => {
        if (response.data.success) {
          navigate("/posts");
        }
      })
      .catch((error) => alert(error.response.data.result.message));
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    formData.append("images", image);
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
        <input
          accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
          name="images"
          id="icon-button-file"
          multiple
          type="file"
          onChange={handleImageChange}
          className={classes.input}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
      </VerticalAligner>
      <WriteActionButtons
        handleSubmit={handleSubmit}
        onCancel={() => {
          navigate(-1);
        }}
        isEdit={id}
      />
    </Container>
  );
};

export default PostWriter;

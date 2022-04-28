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
import { Clear, PhotoCamera } from "@material-ui/icons";
import { VerticalAligner } from "lib/styleUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeInput } from "redux/modules/post";
import { createPost, updatePost } from "services/PostService";
import WriteActionButtons from "./WriteActionButtons";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  imagePreviewContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
  },
  imagePreviewWrapper: {
    position: "relative", // deleteButton을 범위 내에 위치시킴
    flexBasis: "32.3%",
    maxWidth: "32.3%",
    border: "solid 2px lightgray",
    borderRadius: "5px",
    boxSizing: "border-box", // 크기에 테두리 포함
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),

    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    "&:hover": {
      "& $deleteButton": {
        opacity: 1,
        zIndex: 1,
      },
    },
  },
  deleteButton: {
    position: "absolute", // deleteButton을 상위 div에 고정
    top: 5,
    right: 5,
    // hover하기 전엔 뜨지 않음
    cursor: "pointer",
    opacity: 0,
    zIndex: 0,
    transition: "opacity 0.3s",
  },
}));

const PostWriter = ({ id, title, content, categoryId, images, dispatch }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const formData = new FormData();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loadedImages, setDeleteImage] = useState([...images]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

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
    e.preventDefault(); // refresh prevent

    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    // for (const keyValue of formData) console.log(keyValue);

    if (!id) {
      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          formData.append("images", image);
        });
      }

      createPost(formData)
        .then((response) => {
          if (response.data.success) {
            navigate("/posts");
          }
        })
        .catch((error) => alert(error.response.data.result.message));
    }

    if (id) {
      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          formData.append("addedImages", image);
        });
      }
      if (deletedImageIds.length > 0) {
        formData.append("deletedImages", deletedImageIds);
      }

      updatePost(id, formData)
        .then((response) => {
          if (response.data.success) navigate(`/posts/${id}`);
        })
        .catch((error) => console.log(error));
      return;
    }

    // URL.createObjectURL()을 통해 생성한 Blob URL을 브라우저가 더이상 메모리에 들고 있지 않아도 된다고 알림
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImagePreviews([]);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const updatedImages = Array.from(files);

    /*
     해당 메소드에서 URL.createObjectURL(image)과 formData.append("images", image)를 실행하고
     handleSubmit 호출 시, formData에 images 객체가 사라지는 문제가 발생
    => 폼 제출 시 images를 같이 append하는 것으로 변경, 컴포넌트 내에서만 사용할 배열을 생성하여 useState로 이미지 객체들을 관리
    */
    setSelectedImages((prevImages) => [...prevImages, ...updatedImages]);

    const updatedPreviews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews((previews) => [...previews, ...updatedPreviews]);
  };

  const deleteTempImage = (index) => {
    const tempFileList = [...selectedImages];
    tempFileList.splice(index, 1); // state, deleteCount
    setSelectedImages(tempFileList);

    const tempPreviewList = [...imagePreviews];
    tempPreviewList.splice(index, 1); // state, deleteCount
    setImagePreviews(tempPreviewList);
  };

  const deleteImage = (id) => {
    setDeletedImageIds((prevIds) => [...prevIds, id]);
    setDeleteImage(
      loadedImages.filter(
        (image) => image.id !== id // id가 일치하지 않는 원소들을 추출해서 새 배열을 만듦
      )
    );
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
        <div className={classes.imagePreviewContainer}>
          {imagePreviews &&
            imagePreviews.map((imageUrl, index) => (
              <div key={index} className={classes.imagePreviewWrapper}>
                <img src={imageUrl} alt="preview-img" />
                <div
                  className={classes.deleteButton}
                  onClick={() => {
                    deleteTempImage(index);
                  }}
                >
                  <Clear fontSize="large" color="error" />
                </div>
              </div>
            ))}
          {loadedImages &&
            loadedImages.map((loadedImage) => (
              <div key={loadedImage.id} className={classes.imagePreviewWrapper}>
                <img src={`/img/` + loadedImage.uniqueName} alt="preview-img" />
                <div
                  className={classes.deleteButton}
                  onClick={() => {
                    deleteImage(loadedImage.id);
                  }}
                >
                  <Clear fontSize="large" color="error" />
                </div>
              </div>
            ))}
        </div>
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

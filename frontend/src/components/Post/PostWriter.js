import {
  Box,
  ButtonBase,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { cyan, grey } from "@material-ui/core/colors";
import { Clear } from "@material-ui/icons";
import { ReactComponent as ImageIcon } from "assets/svg/image.svg";
import InputWithLabel, { AlertModal, VerticalAligner } from "lib/styleUtils";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeInput, setError } from "redux/modules/post";
import { createPost, updatePost } from "services/PostService";
import styled from "styled-components";
import WriteActionButtons from "./WriteActionButtons";

const PostWriter = ({
  categories,
  selectedCategoryDepth,
  id,
  title,
  content,
  images,
  postError,
  dispatch,
}) => {
  const navigate = useNavigate();
  const postState = useSelector((state) => state.post);
  const [depth, setDepth] = useState(0);

  const formData = new FormData();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loadedImages, setDeleteImage] = useState([...images]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const [modal, setModal] = useState(false);
  const onConfirm = () => {
    document.getElementById("alert-modal").classList.add("hide");

    setTimeout(() => {
      setModal(false);
    }, 600);
  };

  const RecursiveCategorySelect = ({ categories, depth, handleChange }) => {
    setDepth(depth);

    const selectedCategory = postState[`categoryId${depth}`];
    const selectedParentCategory = categories.find(
      (category) => category.id === selectedCategory
    );

    return (
      <>
        <Box margin="10px 15px 10px 0">
          <FormControl style={{ width: "100px" }}>
            <InputLabelStyled id={`select-label-${depth}`}>
              카테고리
            </InputLabelStyled>
            <SelectStyled
              name={`categoryId${depth}`}
              value={selectedCategory}
              defaultValue="" // 하위 카테고리 박스 생성 시 초기 값이 undefined => Material UI Warning 발생. 초기값을 ''로 설정해 주어야 함
              onChange={handleChange}
              label="카테고리"
              labelId={`select-label-${depth}`}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </SelectStyled>
          </FormControl>
        </Box>
        {selectedParentCategory?.children.length > 0 && (
          <RecursiveCategorySelect
            categories={selectedParentCategory.children}
            depth={depth + 1}
            handleChange={handleChange}
          />
        )}
      </>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        key: name,
        value,
      })
    );

    if (id) {
      // 수정 시 기존 카테고리보다 하위 depth의 값들을 모두 초기화해 주어야 수정된 값이 제대로 반영됨
      for (let i = depth + 1; i < selectedCategoryDepth; i++) {
        dispatch(changeInput({ key: `categoryId${i}`, value: "" }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // refresh prevent

    formData.append("title", title);
    formData.append("content", content);

    let selectedCategoryId = "";
    // 밑에서부터 선택된 값을 찾아 올라감
    for (let i = depth; i >= 0; i--) {
      const categoryId = postState[`categoryId${i}`];
      if (categoryId) {
        selectedCategoryId = categoryId;
        break;
      }
    }
    formData.append("categoryId", selectedCategoryId);
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
        .catch((error) => {
          dispatch(
            setError({
              type: "작성",
              message: error.response.data.result.message,
            })
          );
          setModal(true);
        });
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
        .catch((error) => {
          dispatch(
            setError({
              type: "수정",
              message: error.response.data.result.message,
            })
          );
          setModal(true);
        });
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
    <VerticalAligner>
      <Box width={1}>
        <Box
          display="flex"
          alignItems="center"
          margin="1.2rem 0 0.5rem 0"
          paddingBottom="0.5rem"
          borderBottom={`1px solid ${grey[200]}`}
        >
          <Typography variant="h5">글쓰기</Typography>
        </Box>
        <Box display="flex">
          <RecursiveCategorySelect
            categories={categories}
            depth={0}
            parentId={null}
            handleChange={handleChange}
          />
        </Box>
        <Box marginY="10px">
          <InputWithLabel
            fullWidth
            name="title"
            label="제목"
            value={title}
            onChange={handleChange}
            variant="standard"
          />
        </Box>
        <Box marginY="15px">
          <InputWithLabel
            fullWidth
            name="content"
            label="내용"
            value={content}
            multiline
            minRows="20"
            onChange={handleChange}
            variant="standard"
          />
        </Box>
        <HideInput
          accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
          name="images"
          id="icon-button-file"
          multiple
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="icon-button-file">
          <ButtonBase aria-label="upload picture" component="span">
            <ImageAttachmentStyled />
            <Typography variant="subtitle1" color="textPrimary">
              사진 첨부하기
            </Typography>
          </ButtonBase>
        </label>
        <Box display="block" marginY={2}>
          {selectedImages.map((image) => (
            <ImageNameBlock>{image.name}</ImageNameBlock>
          ))}
          {loadedImages.map((image) => (
            <ImageNameBlock>{image.originName}</ImageNameBlock>
          ))}
        </Box>
        <Box display="flex" justifyContent="center" flexWrap="wrap" marginY={2}>
          {imagePreviews.length > 0 &&
            imagePreviews.map((imageUrl, index) => (
              <>
                <ImagePreviewWrapper key={index}>
                  <img src={imageUrl} alt="preview-img" />
                  <DeleteButton
                    onClick={() => {
                      deleteTempImage(index);
                    }}
                  >
                    <Clear fontSize="large" color="error" />
                  </DeleteButton>
                </ImagePreviewWrapper>
              </>
            ))}
          {loadedImages.length > 0 &&
            loadedImages.map((loadedImage) => (
              <ImagePreviewWrapper key={loadedImage.id}>
                <img src={`/img/` + loadedImage.uniqueName} alt="preview-img" />
                <DeleteButton
                  onClick={() => {
                    deleteImage(loadedImage.id);
                  }}
                >
                  <Clear fontSize="large" color="error" />
                </DeleteButton>
              </ImagePreviewWrapper>
            ))}
        </Box>
        <WriteActionButtons
          handleSubmit={handleSubmit}
          onCancel={() => {
            navigate(-1);
          }}
          isEdit={id}
        />
      </Box>
      <AlertModal
        visible={modal}
        title={`게시글 ` + postError?.type + ` 오류`}
        description={postError?.message}
        onConfirm={onConfirm}
        isError
      />
    </VerticalAligner>
  );
};

export default PostWriter;

const InputLabelStyled = styled(InputLabel)`
  &.Mui-focused.MuiFormLabel-root {
    color: ${cyan[700]};
  }
`;

const SelectStyled = styled(Select)`
  &.MuiInput-underline:before {
    border-bottom: none;
  }

  &.MuiInput-underline:after {
    border-bottom: 2px solid ${cyan[700]};
  }

  &.MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: 2px solid ${cyan[700]};
  }
`;

const HideInput = styled.input`
  display: none;
`;

const ImageAttachmentStyled = styled(ImageIcon)`
  margin-right: 0.5rem;
  stroke: ${grey[700]};
`;

const ImageNameBlock = styled.div`
  margin: 0 8px 16px 0px;
  padding: 8px;
  border: 1px solid ${grey[300]};
  border-radius: 12px;
`;

const ImagePreviewWrapper = styled.div`
  position: relative; // DeleteButton을 범위 내에 위치시킴
  margin: 0 8px 16px 0;
  padding: 8px;
  flex-basis: 16.2%;
  border: solid 1px ${grey[300]};
  border-radius: 12px;
  box-sizing: border-box; // 크기에 테두리 포함

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    div {
      opacity: 1;
      z-index: 1;
    }
  }
`;

const DeleteButton = styled.div`
  position: absolute; // 상위 div에 고정
  top: 5px;
  right: 5px;
  cursor: pointer;
  opacity: 0; // hover하기 전엔 뜨지 않음
  z-index: 0;
  transition: opacity 0.3s;
`;

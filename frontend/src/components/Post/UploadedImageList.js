import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@material-ui/core";
import styled from "styled-components";

const UploadedImageList = ({ images }) => {
  return (
    <Box marginY={10}>
      <ImageList rowHeight={300} cols={6} gap={8}>
        {images &&
          images.map((image) => (
            <ImageListItemStyled key={image.id}>
              <input type="checkbox" id={image.id} />
              <label className="image-wrapper" for={image.id}>
                <img src={`/img/${image.uniqueName}`} alt={image.uniqueName} />
                <ImageListItemBar title={image.originName} position="bottom" />
              </label>
            </ImageListItemStyled>
          ))}
      </ImageList>
    </Box>
  );
};

export default UploadedImageList;

const ImageListItemStyled = styled(ImageListItem)`
  .MuiImageListItem-item {
    display: flex;
    align-items: center;
  }

  img {
    width: 100%;
  }

  input[type="checkbox"] {
    position: absolute;
    clip: rect(0, 0, 0, 0);

    
    &:checked + .image-wrapper {
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 100;
      overflow-x: hidden;
      overflow-y: auto;

      img {
        width: auto;
        max-width: 80%;
        max-height: 80%;
      }
    }
`;

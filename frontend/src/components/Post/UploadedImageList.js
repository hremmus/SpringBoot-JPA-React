import { ImageList, ImageListItem, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  imageList: {
    float: "left",
    top: "0",
    width: 800,
  },
  responsive: {
    width: "100%",
    maxWidth: "400px",
    height: "auto",
  },
}));

const UploadedImageList = ({ images }) => {
  const classes = useStyles();
  console.log(images);
  if (!images) return null;

  return (
    <div className={classes.root}>
      <ImageList rowHeight={400} className={classes.imageList} cols={3}>
        {images.map((image) => (
          <ImageListItem key={image.id} cols={1}>
            <img
              src={`/img/` + image.uniqueName}
              className={classes.responsive}
              alt={image.uniqueName}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default UploadedImageList;

import { IconButton, TextField, makeStyles } from "@material-ui/core";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      width: "100%",
      maxWidth: "115ch",
    },
  },
  button: {
    paddingRight: "10px",
    marginLeft: "10px",
    marginTop: "11px",
  },
}));

const CommentWriter = ({
  content,
  postId,
  parentId,
  handleChange,
  handleSubmit,
}) => {
  const classes = useStyles();

  return (
    <form className={classes.root} autoComplete="off">
      <TextField
        name="content"
        value={content}
        onChange={handleChange}
        id="outlined-helperText"
        label="댓글 작성하기"
        helperText="댓글은 자신을 나타내는 얼굴입니다."
        variant="outlined"
        margin="normal"
        size="small"
      />
      <IconButton
        onClick={handleSubmit}
        className={classes.button}
        size="medium"
        color="primary"
      >
        <CreateRoundedIcon />
      </IconButton>
    </form>
  );
};

export default CommentWriter;

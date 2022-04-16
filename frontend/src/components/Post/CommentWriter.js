import { IconButton, TextField, makeStyles } from "@material-ui/core";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import { useDispatch } from "react-redux";
import { changeInput, setComment } from "redux/modules/comment";
import { createComment } from "services/CommentService";

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

const CommentWriter = ({ content, postId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        input: "common",
        key: name,
        value,
      })
    );
  };

  const handleSubmit = (e) => {
    createComment({ content, postId, parentId: null })
      .then((response) => {
        if (response.data.success) {
          // 답댓글이 아니면 기존 리스트에 추가
          dispatch(setComment(response.data.result.data));
        }
      })
      .catch((error) => console.log(error));
  };

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

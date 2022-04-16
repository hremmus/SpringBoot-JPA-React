import { IconButton, TextField, makeStyles } from "@material-ui/core";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import { useDispatch } from "react-redux";
import {
  changeInput,
  cleanReplyComment,
  loadComments,
} from "redux/modules/comment";
import { createComment, getComments } from "services/CommentService";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      width: "100%",
      maxWidth: "105ch",
    },
  },
  center: {
    paddingLeft: "20px",
    textAlign: "center",
  },
  button: {
    paddingRight: "7px",
    marginLeft: "10px",
    marginTop: "11px",
  },
}));

const CommentReplyWriter = ({ content, postId, parentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    createComment({ content, postId, parentId })
      .then((response) => {
        if (response.data.success) {
          // 답댓글 작성 시 서버에게 리스트 재요청
          getComments({ postId: postId })
            .then((response) => {
              dispatch(loadComments(response.data.result.data));
              dispatch(cleanReplyComment());
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        input: "reply",
        key: name,
        value,
      })
    );
  };

  return (
    <div className={classes.center}>
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
    </div>
  );
};

export default CommentReplyWriter;

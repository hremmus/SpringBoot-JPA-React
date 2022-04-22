import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CommentReplyContainer from "containers/CommentReplyContainer";
import React from "react";
import { useDispatch } from "react-redux";
import {
  loadComments,
  setOriginalComment,
  toggleSwitch,
} from "redux/modules/comment";
import { deleteComment, getComments } from "services/CommentService";
import CommentActionButtons from "./CommentActionButtons";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    backgroundColor: theme.palette.action.hover,
    overflow: "clip", // scroll 시 subheader도 같이 넘어가도록
    display: "flow-root",
  },
  inline: {
    display: "inline",
  },
  vertical: {
    paddingTop: "8px",
  },
  nested: {
    paddingLeft: (props) =>
      props === 0 ? theme.spacing(2) : theme.spacing(props * 4 + 2),
  },
}));

const convertDate = (date) => {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const CommentItem = ({
  postId,
  comment,
  shownReplyInput,
  shownUpdateInput,
  loggedInfo,
  classes,
}) => {
  classes = useStyles(comment.depth);
  const dispatch = useDispatch();

  const onEdit = () => {
    dispatch(setOriginalComment(comment));
  };

  const onRemove = () => {
    const id = comment.id;
    deleteComment({ id })
      .then((response) => {
        if (response.data.success) {
          getComments({ postId: postId })
            .then((response) => {
              dispatch(loadComments(response.data.result.data));
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {comment.content !== null && comment.user !== null ? (
        <>
          <ListItem alignItems="flex-start" className={classes.nested}>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary={comment.content}
              onClick={() => {
                dispatch(toggleSwitch(comment.id));
              }}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {comment.user.nickname}
                  </Typography>
                  {" — "}
                  {comment.createdDate === comment.modifiedDate
                    ? convertDate(new Date(comment.createdDate))
                    : convertDate(new Date(comment.modifiedDate))}
                </React.Fragment>
              }
            />
            {(loggedInfo && loggedInfo.id) === comment.user.id && (
              <CommentActionButtons onEdit={onEdit} onRemove={onRemove} />
            )}
          </ListItem>
          <Divider variant="middle" component="div" />
          {shownReplyInput[comment.id] && (
            <CommentReplyContainer
              parentId={comment.id}
              parentNickname={comment.user.nickname}
            />
          )}
          {shownUpdateInput[comment.id] && <CommentReplyContainer />}
        </>
      ) : (
        <>
          <ListItem alignItems="flex-start" className={classes.nested}>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              className={classes.vertical}
              primary={
                <Typography
                  component="span"
                  variant="subtitle1"
                  display="block"
                  color="inherit"
                >
                  삭제된 댓글입니다.
                </Typography>
              }
            />
          </ListItem>
          <Divider variant="middle" component="div" />
        </>
      )}
    </>
  );
};

const CommentList = ({
  postId,
  comments,
  shownReplyInput,
  shownUpdateInput,
  loggedInfo,
}) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListSubheader style={{ backgroundColor: "transparent" }}>
        댓글 {comments.length}개
      </ListSubheader>
      {comments.map((comment) => {
        return (
          <CommentItem
            postId={postId}
            key={comment.id}
            comment={comment}
            shownReplyInput={shownReplyInput}
            shownUpdateInput={shownUpdateInput}
            loggedInfo={loggedInfo}
            classes={classes}
          />
        );
      })}
    </List>
  );
};

export default CommentList;

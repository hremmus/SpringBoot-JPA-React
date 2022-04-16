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
import { toggleSwitch } from "redux/modules/comment";

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
  nested: {
    paddingLeft: (props) =>
      props === 0 ? theme.spacing(2) : theme.spacing(props * 4 + 2),
  },
}));

const convertDate = (date) => {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const CommentItem = ({ comment, shownReplyInput, classes }) => {
  classes = useStyles(comment.depth);
  const dispatch = useDispatch();

  return (
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
      </ListItem>
      <Divider variant="middle" component="div" />
      {shownReplyInput[comment.id] && (
        <CommentReplyContainer parentId={comment.id} />
      )}
    </>
  );
};

const CommentList = ({ comments, shownReplyInput }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListSubheader style={{ backgroundColor: "transparent" }}>
        댓글 {comments.length}개
      </ListSubheader>
      {comments.map((comment) => {
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            shownReplyInput={shownReplyInput}
            classes={classes}
          />
        );
      })}
    </List>
  );
};

export default CommentList;

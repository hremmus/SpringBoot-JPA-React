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
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    backgroundColor: theme.palette.action.hover,
    overflow: "auto", // scroll 시 subheader도 같이 넘어가도록
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

const CommentItem = ({ comment, classes }) => {
  classes = useStyles(comment.depth);
  return (
    <>
      <ListItem alignItems="flex-start" className={classes.nested}>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText
          primary={comment.content}
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
    </>
  );
};

const CommentList = ({ comments }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListSubheader style={{ backgroundColor: "transparent" }}>
        댓글 {comments.length}개
      </ListSubheader>
      {comments.map((comment) => {
        return (
          <CommentItem key={comment.id} comment={comment} classes={classes} />
        );
      })}
    </List>
  );
};

export default CommentList;

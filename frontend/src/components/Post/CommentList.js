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
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
  nested: {
    paddingLeft: theme.spacing(6),
  },
}));

const convertDate = (date) => {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const CommentItem = ({ key, comment, classes }) => {
  return (
    <>
      <ListItem key={key} alignItems="flex-start">
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
      <Divider variant="inset" component="li" />
      {comment.children.map((child) => (
        <>
          <ListItem
            key={child.id}
            className={classes.nested}
            alignItems="flex-start"
          >
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary={child.content}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {child.user.nickname}
                  </Typography>
                  {" — "}
                  {child.createdDate === child.modifiedDate
                    ? convertDate(new Date(child.createdDate))
                    : convertDate(new Date(child.modifiedDate))}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      ))}
    </>
  );
};

const CommentList = ({ comments }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListSubheader>
        댓글 {document.getElementsByClassName("MuiListItem-root").length - 5}개
      </ListSubheader>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} classes={classes} />
      ))}
    </List>
  );
};

export default CommentList;

import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { ReactComponent as MessageCircle } from "assets/svg/message-circle.svg";
import CommentReplyContainer from "containers/CommentReplyContainer";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  loadComments,
  setOriginalComment,
  toggleSwitch,
} from "redux/modules/comment";
import { deleteComment, getComments } from "services/CommentService";
import styled from "styled-components";
import CommentActionButtons from "./CommentActionButtons";

const convertDate = (date) => {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const CommentItem = ({
  postId,
  comment,
  shownReplyInput,
  shownUpdateInput,
  loggedInfo,
}) => {
  const dispatch = useDispatch();
  const onEdit = useCallback(() => {
    dispatch(setOriginalComment(comment));
  }, [dispatch, comment]);

  const onRemove = useCallback(() => {
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
  }, [dispatch, comment.id, postId]);

  return (
    <>
      {comment.content !== null && comment.user !== null ? (
        <>
          <NestedListItem depth={comment.depth}>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary={comment.content}
              onClick={() => {
                dispatch(toggleSwitch(comment.id));
              }}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {comment.user.nickname}
                  </Typography>
                  {" — "}
                  {comment.createdDate === comment.modifiedDate
                    ? convertDate(new Date(comment.createdDate))
                    : convertDate(new Date(comment.modifiedDate))}
                </>
              }
            />
            {(loggedInfo && loggedInfo.id) === comment.user.id && (
              <CommentActionButtons onEdit={onEdit} onRemove={onRemove} />
            )}
          </NestedListItem>
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
          <NestedListItem depth={0}>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
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
          </NestedListItem>
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
  return (
    <ListStyled
      aria-labelledby="nested-list-subheader"
      subheader={
        <Box
          m={1}
          p={2}
          paddingY={2.5}
          display="flex"
          alignItems="center"
          fontSize="14px"
          fontFamily="Kopub Dotum Light"
          color={`${grey[900]}`}
          letterSpacing="1px"
          id="nested-list-subheader"
        >
          <MessageCircleStyled />
          댓글&nbsp; <b>{comments.length}</b>개
        </Box>
      }
    >
      {comments.map((comment) => {
        return (
          <CommentItem
            postId={postId}
            key={comment.id}
            comment={comment}
            shownReplyInput={shownReplyInput}
            shownUpdateInput={shownUpdateInput}
            loggedInfo={loggedInfo}
          />
        );
      })}
    </ListStyled>
  );
};

export default CommentList;

const ListStyled = styled(List)`
  background-color: hsla(185, 63%, 75%, 0.05);
`;

const NestedListItem = styled(ListItem)`
  && {
    padding-left: ${(props) =>
      props.depth === 0 ? "30px" : `${props.depth * 5 * 6 + 30}px`};
  }
`;

const MessageCircleStyled = styled(MessageCircle)`
  margin-right: 0.5rem;
  stroke: rgba(1, 160, 176, 0.25);
  fill: #fff;
`;

import CommentList from "components/Post/CommentList";
import PostActionButtons from "components/Post/PostActionButtons";
import PostReader from "components/Post/PostReader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadComments, unloadComment } from "redux/modules/comment";
import { readPost, setOriginalPost, unloadPost } from "redux/modules/post";
import { getComments } from "services/CommentService";
import { deletePost, getPost } from "services/PostService";

const PostReadContainer = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loggedInfo, comments } = useSelector((state) => ({
    post: state.post.post,
    loggedInfo: state.user.loggedInfo,
    comments: state.comment.comments,
  }));

  useEffect(() => {
    getPost(postId)
      .then((response) => {
        dispatch(readPost(response.data.result.data));
      })
      .catch((error) => console.log(error));

    getComments({ postId: postId })
      .then((response) => {
        dispatch(
          loadComments(calcDepth(convertOneArray(response.data.result.data)))
        );
      })
      .catch((error) => console.log(error));

    return () => {
      dispatch(unloadPost());
      dispatch(unloadComment());
    };
  }, [dispatch, postId]);

  // 계층형 구조의 배열을 전부 꺼내어 한 배열에 담음
  const convertOneArray = (array) => {
    const newArray = [];
    const recursion = (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i].childrenIds = [];
      }

      for (let i = 0; i < array.length; i++) {
        newArray.push(array[i]);

        if (array[i].children.length !== 0) {
          array[i].childrenIds = array[i].children.map((child) => child.id); // id만 꺼냄
          recursion(array[i].children);
        }
      }
    };

    recursion(array);
    return newArray;
  };

  // 부모 객체의 개수만큼 자식 객체의 depth에 담음
  const calcDepth = (array) => {
    const newArray = [...array]; // readonly로 depth 프로퍼티를 추가할 수 없음 => 얕은 복사
    for (let i = 0; i < newArray.length; i++) {
      newArray[i].depth = 0;
    }

    for (let i = 0; i < newArray.length; i++) {
      for (let j = i + 1; j < newArray.length; j++) {
        if (
          newArray[i].childrenIds.length !== 0 && // 최상위 댓글 제외
          newArray[i].childrenIds.includes(newArray[j].id) // JAVA의 contains
        ) {
          newArray[j].depth = newArray[i].depth + 1; // 부모 depth에 +1
        }
      }
    }
    return newArray;
  };

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    navigate("/posts/write");
  };

  const onRemove = () => {
    deletePost(postId)
      .then((response) => {
        if (response.data.success) navigate("/posts");
      })
      .catch((error) => console.log(error));
  };

  if (!post) {
    return null;
  }

  if (!comments) {
    return null;
  }

  return (
    <>
      <PostReader
        post={post}
        actionButtons={
          (loggedInfo && loggedInfo.id) === (post && post.user.id) && (
            <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
          )
        }
      />
      <CommentList comments={comments} />
    </>
  );
};

export default PostReadContainer;

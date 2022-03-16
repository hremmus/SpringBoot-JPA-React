import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";

const LOAD_POSTS = "post/LOAD_POSTS";

export const loadPosts = createAction(LOAD_POSTS, (posts) => posts);

const initialState = {
  posts: [],
};

const post = handleActions(
  {
    [LOAD_POSTS]: (state, { payload: posts }) =>
      produce(state, (draft) => {
        draft.posts = posts;
      }),
  },
  initialState
);

export default post;

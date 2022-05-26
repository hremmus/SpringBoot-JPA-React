import { createAction, handleActions } from "redux-actions";

const LOAD_POSTS = "post/LOAD_POSTS";

export const size = 20;
export const limit = 5;
export const loadPosts = createAction(LOAD_POSTS);

const initialState = {
  posts: [],
  totalPages: null,
  hasNext: null,
};

const posts = handleActions(
  {
    [LOAD_POSTS]: (state, { payload }) => ({
      ...state,
      posts: payload.posts,
      totalPages: payload.totalPages,
      hasNext: payload.hasNext,
    }),
  },
  initialState
);

export default posts;

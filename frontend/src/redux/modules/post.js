import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";

const INITIALIZE = "post/INITIALIZE";
const LOAD_POSTS = "post/LOAD_POSTS";
const CHANGE_INPUT = "post/CHANGE_INPUT";
const READ_POST = "post/READ_POST";

export const initialize = createAction(INITIALIZE);
export const loadPosts = createAction(LOAD_POSTS, (posts) => posts);
export const changeInput = createAction(CHANGE_INPUT, ({ key, value }) => ({
  key,
  value,
}));
export const readPost = createAction(READ_POST, (post) => post);

const initialState = {
  posts: [],
  post: { title: "", content: "", user: { nickname: "" }, categoryId: "" },
};

const post = handleActions(
  {
    [INITIALIZE]: () => initialState,
    [LOAD_POSTS]: (state, { payload: posts }) =>
      produce(state, (draft) => {
        draft.posts = posts;
      }),
    [CHANGE_INPUT]: (state, { payload: { key, value } }) =>
      produce(state, (draft) => {
        draft.post[key] = value;
      }),
    [READ_POST]: (state, { payload: post }) =>
      produce(state, (draft) => {
        draft.post = post;
      }),
  },
  initialState
);

export default post;

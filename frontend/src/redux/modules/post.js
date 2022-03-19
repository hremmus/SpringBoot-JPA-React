import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";

const INITIALIZE_FORM = "post/INITIALIZE_FORM";
const LOAD_POSTS = "post/LOAD_POSTS";
const CHANGE_INPUT = "post/CHANGE_INPUT";

export const initializeForm = createAction(INITIALIZE_FORM);
export const loadPosts = createAction(LOAD_POSTS, (posts) => posts);
export const changeInput = createAction(CHANGE_INPUT, ({ key, value }) => ({
  key,
  value,
}));

const initialState = {
  posts: [],
  post: {
    title: "",
    content: "",
    categoryId: "",
  },
};

const post = handleActions(
  {
    [INITIALIZE_FORM]: (state) => initialState,
    [LOAD_POSTS]: (state, { payload: posts }) =>
      produce(state, (draft) => {
        draft.posts = posts;
      }),
    [CHANGE_INPUT]: (state, { payload: { key, value } }) =>
      produce(state, (draft) => {
        draft.post[key] = value;
      }),
  },
  initialState
);

export default post;

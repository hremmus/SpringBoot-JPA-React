import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";

const INITIALIZE = "post/INITIALIZE";
const CHANGE_INPUT = "post/CHANGE_INPUT";
const READ_POST = "post/READ_POST";
const UNLOAD_POST = "post/UNLOAD_POST";
const SET_ORIGINAL_POST = "post/SET_ORIGINAL_POST";

export const initialize = createAction(INITIALIZE);
export const changeInput = createAction(CHANGE_INPUT, ({ key, value }) => ({
  key,
  value,
}));
export const readPost = createAction(READ_POST, (post) => post);
export const unloadPost = createAction(UNLOAD_POST);
export const setOriginalPost = createAction(SET_ORIGINAL_POST, (post) => post);

const initialState = {
  post: null,
  id: null,
  title: "",
  content: "",
  categoryId: "",
};

const post = handleActions(
  {
    [INITIALIZE]: () => initialState,
    [CHANGE_INPUT]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    [READ_POST]: (state, { payload: post }) =>
      produce(state, (draft) => {
        draft.post = post;
      }),
    [UNLOAD_POST]: (state) => ({ ...state, post: null }),
    [SET_ORIGINAL_POST]: (state, { payload: post }) => ({
      ...state,
      id: post.id,
      title: post.title,
      content: post.content,
      categoryId: post.categoryId,
    }),
  },
  initialState
);

export default post;

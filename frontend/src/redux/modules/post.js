import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";

const INITIALIZE = "post/INITIALIZE";
const CHANGE_INPUT = "post/CHANGE_INPUT";
const READ_POST = "post/READ_POST";
const UNLOAD_POST = "post/UNLOAD_POST";
const SET_ORIGINAL_POST = "post/SET_ORIGINAL_POST";
const SET_ERROR = "post/SET_ERROR";

export const initialize = createAction(INITIALIZE);
export const changeInput = createAction(CHANGE_INPUT, ({ key, value }) => ({
  key,
  value,
}));
export const readPost = createAction(READ_POST);
export const unloadPost = createAction(UNLOAD_POST);
export const setOriginalPost = createAction(SET_ORIGINAL_POST);
export const setError = createAction(SET_ERROR);

const initialState = {
  post: null,
  id: null,
  title: "",
  content: "",
  images: [],
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
    [SET_ORIGINAL_POST]: (state, { payload: post }) => {
      return {
        ...state,
        id: post.id,
        title: post.title,
        content: post.content,
        selectedCategoryDepth: post.categoryIds.length,
        ...post.categoryIds.reduce((acc, categoryId, index) => {
          return {
            ...acc,
            [`categoryId${index}`]: categoryId,
          };
        }, {}),
        categoryName: post.categoryName,
        images: post.images,
      };
    },
    [SET_ERROR]: (state, action) => ({
      ...state,
      postError: {
        type: action.payload?.type,
        message: action.payload?.message,
      },
    }),
  },
  initialState
);

export default post;

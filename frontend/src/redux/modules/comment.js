import { createAction, handleActions } from "redux-actions";

const LOAD_COMMENTS = "comment/LOAD_COMMENTS";
const CHANGE_INPUT = "comment/CHANGE_INPUT";
const SET_COMMENT = "comment/SET_COMMENT";
const UNLOAD_COMMENT = "comment/UNLOAD_COMMENT";

export const unloadComment = createAction(UNLOAD_COMMENT);
export const loadComments = createAction(LOAD_COMMENTS);
export const changeInput = createAction(CHANGE_INPUT, ({ key, value }) => ({
  key,
  value,
}));
export const setComment = createAction(SET_COMMENT);

const initialState = {
  comments: [],
  content: "",
};

const comment = handleActions(
  {
    [UNLOAD_COMMENT]: () => {},
    [LOAD_COMMENTS]: (state, action) => ({
      ...state,
      comments: action.payload,
    }),
    [CHANGE_INPUT]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    [SET_COMMENT]: (state, action) => ({
      comments: [...state.comments, action.payload],
      content: "",
    }),
  },
  initialState
);

export default comment;

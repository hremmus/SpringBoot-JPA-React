import { produce } from "immer";
import { calcDepth, convertOneArray } from "lib/mathUtils";
import { createAction, handleActions } from "redux-actions";

const LOAD_COMMENTS = "comment/LOAD_COMMENTS";
const CHANGE_INPUT = "comment/CHANGE_INPUT";
const SET_COMMENT = "comment/SET_COMMENT";
const UNLOAD_COMMENT = "comment/UNLOAD_COMMENT";
const TOGGLE_SWITCH = "comment/TOGGLE_SWITCH";
const CLEAN_WRITED_COMMENT = "comment/CLEAN_WRITED_COMMENT";
const SET_ORIGINAL_COMMENT = "comment/SET_ORIGINAL_COMMENT";

export const unloadComment = createAction(UNLOAD_COMMENT);
export const loadComments = createAction(LOAD_COMMENTS);
export const changeInput = createAction(
  CHANGE_INPUT,
  ({ input, key, value }) => ({
    input,
    key,
    value,
  })
);
export const setComment = createAction(SET_COMMENT);
export const toggleSwitch = createAction(TOGGLE_SWITCH, (id) => id);
export const cleanWritedComment = createAction(CLEAN_WRITED_COMMENT);
export const setOriginalComment = createAction(
  SET_ORIGINAL_COMMENT,
  (content) => content
);

const initialState = {
  comments: [],
  common: { content: "" },
  reply: { content: "" },
  id: null,
  content: "",
  parentId: null,
  shownReplyInput: {},
  shownUpdateInput: {},
};

const comment = handleActions(
  {
    [UNLOAD_COMMENT]: () => {},
    [LOAD_COMMENTS]: (state, action) => ({
      ...state,
      comments: calcDepth(convertOneArray(action.payload)),
    }),
    [CHANGE_INPUT]: (state, { payload: { input, key, value } }) =>
      produce(state, (draft) => {
        draft[input][key] = value;
      }),
    [SET_COMMENT]: (state, action) => ({
      ...state,
      comments: [...state.comments, action.payload],
      common: { content: "" },
    }),
    [TOGGLE_SWITCH]: (state, { payload: id }) => ({
      ...state,
      shownReplyInput: {
        [id]: !state.shownReplyInput[id], // 댓글을 클릭하면 해당 댓글의 id를 key, boolean 값을 value로 하는 값이 객체에 추가됨. 존재하는 key면 value만 변경됨(true <=> false)
      },
      reply: { content: "" },
      id: null,
      content: "",
      shownUpdateInput: {},
    }),
    [CLEAN_WRITED_COMMENT]: (state, action) => ({
      ...state,
      id: null,
      content: "",
      parentId: null,
      reply: { content: "" },
      shownReplyInput: {},
      shownUpdateInput: {},
    }),
    [SET_ORIGINAL_COMMENT]: (state, { payload: comment }) => ({
      ...state,
      id: comment.id,
      content: comment.content,
      shownUpdateInput: {
        [comment.id]: true,
      },
      reply: { content: "" },
      shownReplyInput: {},
    }),
  },
  initialState
);

export default comment;

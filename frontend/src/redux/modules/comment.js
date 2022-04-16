import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";

const LOAD_COMMENTS = "comment/LOAD_COMMENTS";
const CHANGE_INPUT = "comment/CHANGE_INPUT";
const SET_COMMENT = "comment/SET_COMMENT";
const UNLOAD_COMMENT = "comment/UNLOAD_COMMENT";
const TOGGLE_SWITCH = "comment/TOGGLE_SWITCH";
const CLEAN_REPLY_COMMENT = "comment/CLEAN_REPLY_COMMENT";

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
export const cleanReplyComment = createAction(CLEAN_REPLY_COMMENT);

const initialState = {
  comments: [],
  common: { content: "" },
  reply: { content: "" },
  parentId: null,
  shownReplyInput: {},
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
    }),
    [CLEAN_REPLY_COMMENT]: (state, action) => ({
      ...state,
      parentId: null,
      reply: { content: "" },
      shownReplyInput: {},
    }),
  },
  initialState
);

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

export default comment;

import produce from "immer";
import { createAction, handleActions } from "redux-actions";

const INITIALIZE_FORM = "auth/INITIALIZE_FORM";
const CHANGE_INPUT = "auth/CHANGE_INPUT";
const SET_ERROR = "auth/SET_ERROR";

export const initializeForm = createAction(INITIALIZE_FORM, (form) => form);
export const changeInput = createAction(
  CHANGE_INPUT,
  ({ form, key, value }) => ({
    form, // join, login
    key, // username, password, passwordConfirm, ...
    value, // 실제 바꾸려는 값
  })
);
export const setError = createAction(SET_ERROR);

const initialState = {
  join: {
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  },
  login: {
    email: "",
    password: "",
  },
  authError: null,
};

export default handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: { form, key, value } }) =>
      produce(state, (draft) => {
        draft[form][key] = value;
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form],
      authError: null,
    }),
    [SET_ERROR]: (state, { payload: message }) => ({
      ...state,
      authError: message,
    }),
  },
  initialState
);

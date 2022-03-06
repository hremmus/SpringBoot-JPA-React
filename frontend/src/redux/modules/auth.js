import { Map } from "immutable";
import { createAction, handleActions } from "redux-actions";

const CHANGE_INPUT = "auth/CHANGE_INPUT";
const SET_ERROR = "auth/SET_ERROR";

export const changeInput = createAction(CHANGE_INPUT);
export const setError = createAction(SET_ERROR);

const initialState = Map({
  join: Map({
    form: Map({
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
    }),
    error: null,
  }),
  login: Map({
    form: Map({
      email: "",
      password: "",
    }),
  }),
});

export default handleActions(
  {
    [CHANGE_INPUT]: (state, action) => {
      const { form, name, value } = action.payload;
      return state.setIn([form, "form", name], value);
    },
    [SET_ERROR]: (state, action) => {
      const { form, message } = action.payload;
      return state.setIn([form, "error"], message);
    },
  },
  initialState
);

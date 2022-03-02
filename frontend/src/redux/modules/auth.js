import { Map } from "immutable";
import { createAction, handleActions } from "redux-actions";

const CHANGE_INPUT = "auth/CHANGE_INPUT";

export const changeInput = createAction(CHANGE_INPUT);

const initialState = Map({
  join: Map({
    form: Map({
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
    }),
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
  },
  initialState
);

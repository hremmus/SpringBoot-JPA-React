import { createAction, handleActions } from "redux-actions";

const LOAD_USERS = "users/LOAD_USERS";
const SET_ERROR = "users/SET_ERROR";

export const loadUsers = createAction(LOAD_USERS);
export const setError = createAction(SET_ERROR);

const initialState = {
  users: [],
  usersError: null,
};

const users = handleActions(
  {
    [LOAD_USERS]: (state, action) => ({
      ...state,
      users: action.payload,
    }),
    [SET_ERROR]: (state, action) => ({
      ...state,
      usersError: {
        type: action.payload?.type,
        message: action.payload?.message,
      },
    }),
  },
  initialState
);

export default users;

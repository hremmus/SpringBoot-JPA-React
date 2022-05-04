import { createAction, handleActions } from "redux-actions";

const SET_MENU = "menu/SET_MENU";
const INITIALIZE = "menu/INITIALIZE";

export const setMenu = createAction(SET_MENU);
export const initialize = createAction(INITIALIZE);

const initialState = {
  menu: [
    { name: "talk", link: "/posts" },
    { name: "experience", link: "/" },
    { name: "test3", link: "/" },
  ],
};

const menu = handleActions(
  {
    [SET_MENU]: (state, action) => ({
      menu: action.payload,
    }),
    [INITIALIZE]: () => initialState,
  },
  initialState
);

export default menu;

import { createAction, handleActions } from "redux-actions";

export const menuData = [
  { name: "talk", link: "/posts" },
  { name: "forecast", link: "/location/yangyang", state: "양양" },
  { name: "shop", link: "/" },
];

export const locationMenuData = [
  { name: "양양 yangyang", link: "/location/yangyang", state: "양양" },
  { name: "제주 jeju", link: "/location/jeju", state: "제주" },
  { name: "고성 goseong", link: "/location/goseong", state: "고성" },
  { name: "강릉 gangneung", link: "/location/gangeung", state: "강릉" },
  { name: "포항 pohang", link: "/location/pohang", state: "포항" },
  { name: "남해 namhae", link: "/location/namhae", state: "남해" },
];

const SET_MENU = "menu/SET_MENU";
const INITIALIZE = "menu/INITIALIZE";

export const setMenu = createAction(SET_MENU);
export const initialize = createAction(INITIALIZE);

const initialState = {
  menu: menuData,
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

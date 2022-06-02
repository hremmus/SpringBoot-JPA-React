import { createAction, handleActions } from "redux-actions";

const SET_LOGGED_INFO = "user/SET_LOGGED_INFO"; // 로그인 정보 설정
const SET_ACCESS_TOKEN = "user/SET_ACCESS_TOKEN"; // 액세스 토큰 설정
const LOGOUT = "user/LOGOUT"; // 로그아웃

export const setLoggedInfo = createAction(SET_LOGGED_INFO); // loggedInfo
export const setAccessToken = createAction(SET_ACCESS_TOKEN); // accessToken
export const logout = createAction(LOGOUT); // logout

const initialState = {
  loggedInfo: {
    // 현재 로그인 중인 유저의 정보
    id: null,
    email: null,
    nickname: null,
  },
  accessToken: null,
  isLoggedIn: false, // 현재 로그인 중인지 알려 준다
};

export default handleActions(
  {
    [SET_LOGGED_INFO]: (state, { payload: loggedInfo }) => ({
      ...state,
      loggedInfo,
      isLoggedIn: true,
    }),
    [SET_ACCESS_TOKEN]: (state, { payload: accessToken }) => ({
      ...state,
      accessToken,
    }),
    [LOGOUT]: () => ({
      loggedInfo: {},
      accessToken: "",
      isLoggedIn: false,
    }),
  },
  initialState
);

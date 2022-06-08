import storage from "lib/storage";
import { createAction, handleActions } from "redux-actions";

const SET_LOGGED_INFO = "user/SET_LOGGED_INFO"; // 로그인 정보 설정
const SET_ACCESS_TOKEN = "user/SET_ACCESS_TOKEN"; // 액세스 토큰 설정
const LOGOUT = "user/LOGOUT"; // 로그아웃
const SET_ERROR = "user/SET_ERROR";

export const setLoggedInfo = createAction(SET_LOGGED_INFO); // loggedInfo
export const setAccessToken = createAction(SET_ACCESS_TOKEN); // accessToken
export const logout = createAction(LOGOUT); // logout
export const setError = createAction(SET_ERROR);

const initialState = {
  loggedInfo: {
    // 현재 로그인 중인 유저의 정보
    id: null,
    email: null,
    nickname: null,
  },
  accessToken: null,
  isAdmin: false,
  isLoggedIn: false, // 현재 로그인 중인지 알려 준다
  userError: null,
};

export default handleActions(
  {
    [SET_LOGGED_INFO]: (state, action) => {
      const updatedState = {
        ...state,
        loggedInfo: {
          id: action.payload.id ?? state.loggedInfo.id,
          email: action.payload.email ?? state.loggedInfo.email,
          nickname: action.payload.nickname ?? state.loggedInfo.nickname,
        },
        isAdmin: action.payload.roles?.includes("ROLE_ADMIN"),
        isLoggedIn: true,
      };

      storage.set("loggedInfo", updatedState.loggedInfo);
      return updatedState;
    },
    [SET_ACCESS_TOKEN]: (state, { payload: accessToken }) => ({
      ...state,
      accessToken,
    }),
    [LOGOUT]: () => ({
      loggedInfo: {},
      accessToken: "",
      isLoggedIn: false,
    }),
    [SET_ERROR]: (state, action) => ({
      ...state,
      userError: {
        type: action.payload?.type,
        message: action.payload?.message,
      },
    }),
  },
  initialState
);

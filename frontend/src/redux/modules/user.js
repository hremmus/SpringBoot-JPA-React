import { Map } from "immutable";
import { createAction, handleActions } from "redux-actions";

const SET_LOGGED_INFO = "user/SET_LOGGED_INFO"; // 로그인 정보 설정
const SET_VALIDATED = "user/SET_VALIDATED"; // validated 값 설정

export const setLoggedInfo = createAction(SET_LOGGED_INFO); // loggedInfo
export const setValidated = createAction(SET_VALIDATED); // validated

const initialState = Map({
  loggedInfo: Map({
    // 현재 로그인 중인 유저의 정보
    id: null,
    email: null,
    nickname: null,
  }),
  logged: false, // 현재 로그인 중인지 알려 준다
  validated: false, // 이 값은 현재 로그인 중인지 아닌지 한번 서버 측에 검증했음을 의미
});

export default handleActions(
  {
    [SET_LOGGED_INFO]: (state, action) =>
      state.set("loggedInfo", Map(action.payload)).set("logged", true),
    [SET_VALIDATED]: (state, action) => state.set("validated", action.payload),
  },
  initialState
);

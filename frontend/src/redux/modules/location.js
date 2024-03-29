import { createAction, handleActions } from "redux-actions";

const LOAD_LOCATIONS = "location/LOAD_LOCATIONS";
const SET_WEBCAM = "location/SET_WEBCAM";
const SET_GRADE = "location/SET_GRADE";

export const loadLocations = createAction(LOAD_LOCATIONS);
export const setWebcam = createAction(SET_WEBCAM, (id, webcam) => ({
  id,
  webcam,
}));
export const setGrade = createAction(SET_GRADE, (id, grade) => ({ id, grade }));

const initialState = {
  locations: [],
  webcams: {},
  grades: {}, // 변수 값 Location ID를 기반으로(개체의 고유 식별자=key가 됨) 서로 다른 지역에 대한 등급을 나타내는 'dynamic key'를 갖는 개체
};

const location = handleActions(
  {
    [LOAD_LOCATIONS]: (state, action) => ({
      locations: action.payload,
    }),
    [SET_WEBCAM]: (state, action) => {
      const { id, webcam } = action.payload;

      return {
        ...state,
        webcams: {
          ...state.webcams,
          [id]: webcam,
        },
      };
    },
    [SET_GRADE]: (state, action) => {
      const { id, grade } = action.payload;

      return {
        ...state,
        grades: {
          ...state.grades,
          [id]: grade,
        },
      };
    },
  },
  initialState
);

export default location;

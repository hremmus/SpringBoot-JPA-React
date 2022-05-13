import { createAction, handleActions } from "redux-actions";

const LOAD_LOCATIONS = "location/LOAD_LOCATIONS";
const SET_WEBCAM = "location/SET_WEBCAM";

export const loadLocations = createAction(LOAD_LOCATIONS);
export const setWebcam = createAction(SET_WEBCAM, (id, webcam) => ({
  id,
  webcam,
}));

const initialState = {
  locations: [],
};

const location = handleActions(
  {
    [LOAD_LOCATIONS]: (state, action) => ({
      locations: action.payload,
    }),
    [SET_WEBCAM]: (state, action) => {
      const { id, webcam } = action.payload;
      const updatedLocations = state.locations.map((location) => {
        // id 일치 여부로 해당하는 location을 찾음
        if (location.id === id) {
          // location 객체에 webcam 속성을 추가
          return { ...location, webcam };
        }
        return location;
      });

      return {
        locations: updatedLocations,
      };
    },
  },
  initialState
);

export default location;

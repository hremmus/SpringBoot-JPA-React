import { createAction, handleActions } from "redux-actions";

const LOAD_LOCATIONS = "location/LOAD_LOCATIONS";

export const loadLocations = createAction(LOAD_LOCATIONS);

const initialState = {
  locations: [],
};

const location = handleActions(
  {
    [LOAD_LOCATIONS]: (state, action) => ({
      ...state,
      locations: action.payload,
    }),
  },
  initialState
);

export default location;

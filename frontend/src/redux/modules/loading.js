import { createAction, handleActions } from "redux-actions";

const IS_LOADING = "loading/IS_LOADING";
const IS_LOADED = "loading/IS_LOADED";

export const isLoading = createAction(IS_LOADING);
export const isLoaded = createAction(IS_LOADED);

const initialState = {
  loading: false,
};

const loading = handleActions(
  {
    [IS_LOADING]: (state, action) => ({
      loading: true,
    }),
    [IS_LOADED]: (state, action) => ({
      loading: false,
    }),
  },
  initialState
);

export default loading;

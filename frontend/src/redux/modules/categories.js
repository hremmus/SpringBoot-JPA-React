import { createAction, handleActions } from "redux-actions";

const LOAD_CATEGORIES = "category/LOAD_CATEGORIES";
const SET_ERROR = "category/SET_ERROR";

export const loadCategories = createAction(LOAD_CATEGORIES);
export const setError = createAction(SET_ERROR);

const initialState = {
  categories: [],
  categoryError: null,
};

const categories = handleActions(
  {
    [LOAD_CATEGORIES]: (state, { payload }) => ({
      ...state,
      categories: payload,
    }),
    [SET_ERROR]: (state, action) => ({
      ...state,
      categoryError: {
        type: action.payload?.type,
        message: action.payload?.message,
      },
    }),
  },
  initialState
);

export default categories;

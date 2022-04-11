import { createAction, handleActions } from "redux-actions";

const LOAD_CATEGORIES = "category/LOAD_CATEGORIES";

export const loadCategories = createAction(LOAD_CATEGORIES);

const initialState = {
  categories: [],
};

const categories = handleActions(
  {
    [LOAD_CATEGORIES]: (state, { payload }) => ({
      ...state,
      categories: payload,
    }),
  },
  initialState
);

export default categories;

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import auth from "redux/modules/auth";
import categories from "redux/modules/categories";
import comment from "redux/modules/comment";
import forecast from "redux/modules/forecast";
import header from "redux/modules/header";
import loading from "redux/modules/loading";
import location from "redux/modules/location";
import menu from "redux/modules/menu";
import post from "redux/modules/post";
import posts from "redux/modules/posts";
import user from "redux/modules/user";

const rootReducer = combineReducers({
  header,
  auth,
  user,
  post,
  posts,
  categories,
  comment,
  location,
  loading,
  menu,
  forecast,
});

export const store = configureStore(
  {
    reducer: rootReducer,
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__
);

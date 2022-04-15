import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./auth";
import categories from "./categories";
import comment from "./comment";
import header from "./header";
import post from "./post";
import posts from "./posts";
import user from "./user";

const rootReducer = combineReducers({
  header,
  auth,
  user,
  post,
  posts,
  categories,
  comment,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

export default persistReducer(persistConfig, rootReducer);

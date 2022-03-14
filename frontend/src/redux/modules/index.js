import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./auth";
import header from "./header";
import user from "./user";

const rootReducer = combineReducers({
  header,
  auth,
  user,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

export default persistReducer(persistConfig, rootReducer);

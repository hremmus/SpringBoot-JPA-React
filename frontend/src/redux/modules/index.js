import { combineReducers } from "redux";
import auth from "./auth";
import header from "./header";
import user from "./user";

export default combineReducers({
  header,
  auth,
  user,
});

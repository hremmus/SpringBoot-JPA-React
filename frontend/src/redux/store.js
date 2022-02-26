import { configureStore } from "@reduxjs/toolkit";
import modules from "./modules";

export const store = configureStore(
  { reducer: modules },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__
);

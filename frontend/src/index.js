import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from "@material-ui/core";
import App from "App";
import "index.css";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "redux/store";
import reportWebVitals from "reportWebVitals";

const persistor = persistStore(store);
const theme = unstable_createMuiStrictModeTheme();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();

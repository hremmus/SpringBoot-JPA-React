import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from "@material-ui/core";
import App from "App";
import "index.css";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "redux/store";
import reportWebVitals from "reportWebVitals";

const theme = unstable_createMuiStrictModeTheme();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();

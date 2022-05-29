import { ThemeProvider, createTheme } from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";
import App from "App";
import Spinner from "components/Spinner";
import "index.css";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "redux/store";
import reportWebVitals from "reportWebVitals";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Kopub Dotum Light",
    },
    palette: {
      primary: cyan[100],
    },
  },
});

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Spinner />
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();

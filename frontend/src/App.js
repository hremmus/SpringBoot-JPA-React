import { Grid } from "@material-ui/core";
import NaverMap from "components/Location/NaverMap";
import HeaderContainer from "containers/HeaderContainer";
import LeftSidebarContainer from "containers/LeftSidebarContainer";
import storage from "lib/storage";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Locations from "pages/Locations";
import Post from "pages/Post";
import Posts from "pages/Posts";
import WritePost from "pages/WritePost";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { isLoaded, isLoading } from "redux/modules/loading";
import { logout, setAccessToken, setLoggedInfo } from "redux/modules/user";
import api from "services";
import { refreshToken } from "services/AuthService";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector(({ user }) => ({
    accessToken: user.accessToken,
  }));

  useEffect(() => {
    const loggedInfo = storage.get("loggedInfo");
    if (loggedInfo) dispatch(setLoggedInfo(loggedInfo));

    api.interceptors.request.use(
      (config) => {
        // 로딩 호출
        dispatch(isLoading());
        if (config.headers["Authorization"] === undefined)
          config.headers["Authorization"] = accessToken;
        return config;
      },
      (error) => {
        // 실패 시 로딩 종료
        dispatch(isLoaded());
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response) => {
        // 완료 시 로딩 종료
        dispatch(isLoaded());
        return response;
      },
      async (error) => {
        // 실패 시 로딩 종료
        dispatch(isLoaded());
        const {
          config,
          response: { status },
        } = error;
        const prevRequest = config;
        if (status === 401 && !prevRequest.sent) {
          prevRequest.sent = true;
          await refreshToken()
            .then((response) => {
              config.headers[
                "Authorization"
              ] = `${response.data.result.data.accessToken}`;
              dispatch(setAccessToken(response.data.result.data.accessToken));
            })
            .catch((error) => {
              console.log(error);
              storage.remove("loggedInfo");
              dispatch(logout());
              navigate("/auth/login?expired");
            });
          return api(prevRequest);
        }
        return Promise.reject(error);
      }
    );
  }, [dispatch, navigate, accessToken]);

  const isHomePage = window.location.pathname === "/";

  return (
    <>
      <HeaderContainer />
      <Grid container>
        <LeftSidebarContainer />
        <Grid item xs={10}>
          <Grid item xs={12} lg={isHomePage ? 12 : 10}>
            <Routes>
              <Route path="/auth/*" element={<Auth />} />
              <Route index element={<Home />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/write" element={<WritePost />} />
              <Route path="/posts/:postId" element={<Post />} />
              <Route path="/location/:global" element={<Locations />} />
              <Route path="/map" element={<NaverMap />} />
            </Routes>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default App;

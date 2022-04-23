import HeaderContainer from "containers/HeaderContainer";
import storage from "lib/storage";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Post from "pages/Post";
import Posts from "pages/Posts";
import WritePost from "pages/WritePost";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
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
    if (!loggedInfo) return;
    dispatch(setLoggedInfo(loggedInfo));

    api.interceptors.request.use(
      (config) => {
        if (config.headers["Authorization"] === undefined)
          config.headers["Authorization"] = accessToken;
        return config;
      },
      (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
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

  return (
    <div>
      <HeaderContainer />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/write" element={<WritePost />} />
        <Route path="/posts/:postId" element={<Post />} />
      </Routes>
    </div>
  );
}

export default App;

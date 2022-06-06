import { Grid } from "@material-ui/core";
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
import ManageCategories from "./pages/ManageCategories";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 로딩 상태 관리와 관련된 인터셉터 설정을 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // 로딩 호출
        dispatch(isLoading());
        return config;
      },
      (error) => {
        // 실패 시 로딩 종료
        dispatch(isLoaded());
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        // 완료 시 로딩 종료
        dispatch(isLoaded());
        return response;
      },
      async (error) => {
        // 실패 시 로딩 종료
        dispatch(isLoaded());
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const loggedInfo = useSelector((state) => state.user.loggedInfo);
  const storedLoggedInfo = storage.get("loggedInfo");
  const accessToken = useSelector((state) => state.user.accessToken);
  const storedAccessToken = storage.get("accessToken");

  useEffect(() => {
    if (
      (!loggedInfo?.id && storedLoggedInfo) ||
      (storedLoggedInfo && loggedInfo?.id !== storedLoggedInfo?.id)
    ) {
      dispatch(setLoggedInfo(storedLoggedInfo));
    }
  }, [dispatch, loggedInfo, storedLoggedInfo]);

  useEffect(() => {
    if (
      (!accessToken && storedAccessToken) ||
      (storedAccessToken && accessToken !== storedAccessToken)
    ) {
      dispatch(setAccessToken(storedAccessToken));
    }
  }, [dispatch, accessToken, storedAccessToken]);

  useEffect(() => {
    const requestInterceptors = api.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && accessToken)
          config.headers["Authorization"] = accessToken;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptors = api.interceptors.response.use(
      (response) => {
        return response;
      },
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
              const refreshToken = response.data.result.data.accessToken;
              config.headers["Authorization"] = refreshToken;
              storage.set("accessToken", refreshToken);
            })
            .catch((error) => {
              console.log(error);
              dispatch(logout());
              storage.remove("loggedInfo");
              storage.remove("accessToken");
              navigate("/auth/login?expired");
            });
          return api(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptors);
      api.interceptors.response.eject(responseInterceptors);
    };
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
              <Route path="/admin/categories" element={<ManageCategories />} />
            </Routes>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default App;

import { Grid } from "@material-ui/core";
import HeaderContainer from "containers/HeaderContainer";
import LeftSidebarContainer from "containers/LeftSidebarContainer";
import storage from "lib/storage";
import Auth from "pages/Auth";
import EditProfile from "pages/EditProfile";
import Home from "pages/Home";
import Locations from "pages/Locations";
import ManageUsers from "pages/ManageUsers";
import Post from "pages/Post";
import Posts from "pages/Posts";
import WritePost from "pages/WritePost";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { isLoaded, isLoading } from "redux/modules/loading";
import { setAccessToken, setLoggedInfo } from "redux/modules/user";
import api from "services";
import ManageCategories from "./pages/ManageCategories";

const App = () => {
  const dispatch = useDispatch();

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
  }, [dispatch]);

  const loggedInfo = useSelector((state) => state.user.loggedInfo);
  const accessToken = useSelector((state) => state.user.accessToken);

  useEffect(() => {
    const storedLoggedInfo = storage.get("loggedInfo");
    if (
      (!loggedInfo?.id && storedLoggedInfo) ||
      (storedLoggedInfo && loggedInfo?.id !== storedLoggedInfo?.id)
    ) {
      dispatch(setLoggedInfo(storedLoggedInfo));
    }
  }, [dispatch, loggedInfo]);

  useEffect(() => {
    const storedAccessToken = storage.get("accessToken");
    if (
      (!accessToken && storedAccessToken) ||
      (storedAccessToken && accessToken !== storedAccessToken)
    ) {
      dispatch(setAccessToken(storedAccessToken));
    }
  }, [dispatch, accessToken]);

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
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/mypage/profile" element={<EditProfile />} />
            </Routes>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default App;

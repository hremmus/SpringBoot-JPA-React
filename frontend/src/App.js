import HeaderContainer from "containers/HeaderContainer";
import storage from "lib/storage";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Posts from "pages/Posts";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { setLoggedInfo } from "redux/modules/user";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const initializeUserInfo = async () => {
      const loggedInfo = storage.get("loggedInfo"); // 로그인 정보를 로컬스토리지에서 가져옵니다.
      if (!loggedInfo) return; // 로그인 정보가 없다면 여기서 멈춥니다.

      dispatch(setLoggedInfo(loggedInfo));
    };
    initializeUserInfo();
  });

  return (
    <div>
      <HeaderContainer />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </div>
  );
}

export default App;

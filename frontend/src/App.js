import HeaderContainer from "containers/HeaderContainer";
import storage from "lib/storage";
import Auth from "pages/Auth";
import Home from "pages/Home";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";

function App() {
  useEffect(() => {
    const initializeUserInfo = async () => {
      const loggedInfo = storage.get("loggedInfo"); // 로그인 정보를 로컬스토리지에서 가져옵니다.
      if (!loggedInfo) return; // 로그인 정보가 없다면 여기서 멈춥니다.

      const { UserActions } = this.props;
      UserActions.setLoggedInfo(loggedInfo);
    };
    initializeUserInfo();
  });

  return (
    <div>
      <HeaderContainer />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/auth/*" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default connect(null, (dispatch) => ({
  UserActions: bindActionCreators(userActions, dispatch),
}))(App);

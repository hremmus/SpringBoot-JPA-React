import LoginButton from "components/Header/LoginButton";
import NavBar from "components/Header/NavBar";
import UserInfo from "components/Header/UserInfo";
import storage from "lib/storage";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuData } from "redux/modules/menu";
import { logout } from "redux/modules/user";
import { logoutUser } from "services/AuthService";
import Header from "../components/Header/Header";

const HeaderContainer = () => {
  const dispatch = useDispatch();
  const { visible, isLoggedIn, loggedInfo } = useSelector(
    ({ header, user }) => ({
      visible: header.visible,
      isLoggedIn: user.isLoggedIn,
      loggedInfo: user.loggedInfo,
    })
  );

  const handleLogout = useCallback(async () => {
    await logoutUser()
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    storage.remove("loggedInfo");
    dispatch(logout());
  }, [dispatch]);

  if (!visible) return null;

  return (
    <Header>
      <NavBar menu={menuData} />
      {isLoggedIn ? (
        <UserInfo loggedInfo={loggedInfo} handleLogout={handleLogout} />
      ) : (
        <LoginButton />
      )}
    </Header>
  );
};

export default HeaderContainer;

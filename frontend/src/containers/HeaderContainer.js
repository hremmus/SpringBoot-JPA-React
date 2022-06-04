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

  const visible = useSelector((state) => state.header.visible);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const loggedInfo = useSelector((state) => state.user.loggedInfo);
  const isAdmin = useSelector((state) => state.user.isAdmin);

  const handleLogout = useCallback(async () => {
    await logoutUser()
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    storage.remove("loggedInfo");
    storage.remove("accessToken");
    dispatch(logout());
  }, [dispatch]);

  if (!visible) return null;

  return (
    <Header>
      <NavBar menu={menuData.initial} />
      {isLoggedIn ? (
        <UserInfo
          loggedInfo={loggedInfo}
          isAdmin={isAdmin}
          handleLogout={handleLogout}
        />
      ) : (
        <LoginButton />
      )}
    </Header>
  );
};

export default HeaderContainer;

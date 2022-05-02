import LoginButton from "components/Header/LoginButton";
import NavBar from "components/Header/NavBar";
import UserInfo from "components/Header/UserInfo";
import storage from "lib/storage";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "redux/modules/user";
import { logoutUser } from "services/AuthService";
import Header from "../components/Header/Header";

const HeaderContainer = () => {
  const visible = useSelector((state) => state.header.visible);
  const { isLoggedIn, loggedInfo } = useSelector(({ user }) => ({
    isLoggedIn: user.isLoggedIn,
    loggedInfo: user.loggedInfo,
  }));
  const dispatch = useDispatch();

  if (!visible) return null;

  const handleLogout = () => {
    logoutUser()
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    storage.remove("loggedInfo");
    dispatch(logout());
  };

  return (
    <Header>
      <NavBar />
      {isLoggedIn ? (
        <UserInfo loggedInfo={loggedInfo} handleLogout={handleLogout} />
      ) : (
        <LoginButton />
      )}
    </Header>
  );
};

export default HeaderContainer;

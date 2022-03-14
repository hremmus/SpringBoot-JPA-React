import { Button } from "@material-ui/core";
import LoginButton from "components/Header/LoginButton";
import storage from "lib/storage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";
import { logoutUser } from "services/AuthService";
import Header from "../components/Header/Header";

const HeaderContainer = ({
  visible,
  children,
  isLoggedIn,
  loggedInfo,
  UserActions,
}) => {
  if (!visible) return null;

  const handleLogout = () => {
    logoutUser()
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    storage.remove("loggedInfo");
    UserActions.logout();
  };

  return (
    <Header children={children}>
      {isLoggedIn ? (
        <div>
          {loggedInfo.nickname}님
          <Button onClick={handleLogout} size="small">
            로그아웃
          </Button>
        </div>
      ) : (
        <LoginButton />
      )}
    </Header>
  );
};

const mapStateToProps = (state) => ({
  visible: state.header.visible,
  children: state.header.children,
  isLoggedIn: state.user.isLoggedIn,
  loggedInfo: state.user.loggedInfo,
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(userActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);

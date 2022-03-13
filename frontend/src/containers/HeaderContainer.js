import { Button } from "@material-ui/core";
import storage from "lib/storage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";
import { logoutUser } from "services/AuthService";
import Header from "../components/Header/Header";
import LoginButton from "../components/Header/LoginButton";

const HeaderContainer = ({ visible, children, user, UserActions }) => {
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
      {user.get("logged") ? (
        <div>
          {user.getIn(["loggedInfo", "nickname"])}님
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
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(userActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);

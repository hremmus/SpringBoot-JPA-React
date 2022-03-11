import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";
import Header from "../components/Header/Header";
import LoginButton from "../components/Header/LoginButton";

class HeaderContainer extends Component {
  render() {
    const { visible, children, user } = this.props;
    if (!visible) return null;
    return (
      <Header children={children}>
        {user.get("logged") ? (
          <div>
            {user.getIn(["loggedInfo", "nickname"])}님
            <Button size="small">로그아웃</Button>
          </div>
        ) : (
          <LoginButton />
        )}
      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  visible: state.header.visible,
  children: state.header.children,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(userActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);

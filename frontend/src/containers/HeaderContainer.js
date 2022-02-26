import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../components/Header/Header";
import LoginButton from "../components/Header/LoginButton";

class HeaderContainer extends Component {
  render() {
    const { visible, children } = this.props;
    if (!visible) return null;
    return (
      <Header children={children}>
        <LoginButton />
      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  visible: state.header.visible,
  children: state.header.children,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);

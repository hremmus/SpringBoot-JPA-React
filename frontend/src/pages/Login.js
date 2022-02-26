import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as headerActions from "redux/modules/header";

function Login({ HeaderActions }) {
  useEffect(() => {
    HeaderActions.setHeaderVisibility(false);
    return () => {
      HeaderActions.setHeaderVisibility(true);
    };
  }, [HeaderActions]);

  return <div>Login</div>;
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    HeaderActions: bindActionCreators(headerActions, dispatch),
  })
)(Login);

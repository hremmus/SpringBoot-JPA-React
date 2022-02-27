import AuthWrapper from "components/Auth/AuthWrapper";
import JoinContainer from "containers/JoinContainer";
import LoginContainer from "containers/LoginContainer";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as headerActions from "redux/modules/header";

function Auth({ HeaderActions }) {
  useEffect(() => {
    HeaderActions.setHeaderVisibility(false);
    return () => {
      HeaderActions.setHeaderVisibility(true);
    };
  }, [HeaderActions]);

  return (
    <AuthWrapper>
      <Routes>
        <Route path="login" element={<LoginContainer />} />
        <Route path="join" element={<JoinContainer />} />
      </Routes>
    </AuthWrapper>
  );
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    HeaderActions: bindActionCreators(headerActions, dispatch),
  })
)(Auth);

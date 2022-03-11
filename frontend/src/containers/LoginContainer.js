import axios from "axios";
import LoginButton from "components/Auth/AuthButton";
import AuthError from "components/Auth/AuthError";
import InputWithLabel from "components/Auth/InputWithLabel";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import * as userActions from "redux/modules/user";
import { loginUser } from "services/AuthService";

const LoginContainer = (props) => {
  const handleChange = (e) => {
    const { AuthActions } = props;
    const { name, value } = e.target;

    AuthActions.changeInput({
      name,
      value,
      form: "login",
    });
  };

  const navigate = useNavigate();
  const { email, password } = props.form.toJS();
  const { error } = props;

  const setError = (message) => {
    const { AuthActions } = props;
    AuthActions.setError({
      form: "login",
      message,
    });
  };

  const handleSubmit = (e) => {
    const { UserActions } = props;

    loginUser({ email, password })
      .then((response) => {
        if (response.data.success) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `${response.data.result.data.accessToken}`;
          UserActions.setLoggedInfo(response.data.result.data.user);
        }

        navigate("/");
      })
      .catch((error) => {
        setError(error.response.data.result.message);
      });
  };

  return (
    <div>
      <InputWithLabel
        name="email"
        label="이메일"
        variant="standard"
        value={email}
        onChange={handleChange}
      />
      <InputWithLabel
        type="password"
        name="password"
        label="비밀번호"
        autoComplete="current-password"
        variant="standard"
        value={password}
        onChange={handleChange}
      />
      {error && <AuthError>{error}</AuthError>}
      <LoginButton onClick={handleSubmit}>로그인</LoginButton>
      <RightAlignedLink href="/auth/join">회원가입</RightAlignedLink>
    </div>
  );
};

export default connect(
  (state) => ({
    form: state.auth.getIn(["login", "form"]),
    error: state.auth.getIn(["login", "error"]),
    result: state.auth.get("result"),
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
  })
)(LoginContainer);

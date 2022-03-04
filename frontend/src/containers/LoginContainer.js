import LoginButton from "components/Auth/AuthButton";
import InputWithLabel from "components/Auth/InputWithLabel";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ email, password }).then((response) => {
      if (response.status === 200) {
        navigate("/");
      }
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
      <LoginButton onClick={handleSubmit}>로그인</LoginButton>
      <RightAlignedLink href="/auth/join">회원가입</RightAlignedLink>
    </div>
  );
};

export default connect(
  (state) => ({
    form: state.auth.getIn(["login", "form"]),
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
  })
)(LoginContainer);

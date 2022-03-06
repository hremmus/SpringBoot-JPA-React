import AuthButton from "components/Auth/AuthButton";
import AuthError from "components/Auth/AuthError";
import InputWithLabel from "components/Auth/InputWithLabel";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import { joinUser } from "services/AuthService";

const JoinContainer = (props) => {
  const handleChange = (e) => {
    const { AuthActions } = props;
    const { name, value } = e.target;

    AuthActions.changeInput({
      name,
      value,
      form: "join",
    });
  };

  const navigate = useNavigate();
  const { email, password, passwordConfirm, nickname } = props.form.toJS();
  const { error } = props;

  const setError = (message) => {
    const { AuthActions } = props;
    AuthActions.setError({
      form: "join",
      message,
    });
  };

  const handleSubmit = (e) => {
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    joinUser({ email, password, nickname })
      .then((response) => {
        if (response.data.success) {
          navigate("/");
        }
      })
      .catch((error) => {
        setError(error.response.data.result.message);
      });
  };

  return (
    <div>
      <InputWithLabel
        required
        name="email"
        label="이메일"
        variant="outlined"
        size="small"
        value={email}
        onChange={handleChange}
      />
      <InputWithLabel
        required
        type="password"
        name="password"
        label="비밀번호"
        placeholder="영문, 숫자, 특수문자 조합으로 8~20자"
        variant="outlined"
        size="small"
        value={password}
        onChange={handleChange}
      />
      <InputWithLabel
        required
        type="password"
        name="passwordConfirm"
        label="비밀번호 확인"
        variant="outlined"
        size="small"
        value={passwordConfirm}
        onChange={handleChange}
      />
      <InputWithLabel
        required
        name="nickname"
        label="닉네임"
        placeholder="영문 또는 한글로 최대 10자까지 가능"
        variant="outlined"
        size="small"
        value={nickname}
        onChange={handleChange}
      />
      {error && <AuthError>{error}</AuthError>}
      <AuthButton onClick={handleSubmit}>회원가입</AuthButton>
      <RightAlignedLink href="/auth/login">돌아가기</RightAlignedLink>
    </div>
  );
};

export default connect(
  (state) => ({
    form: state.auth.getIn(["join", "form"]),
    error: state.auth.getIn(["join", "error"]),
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
  })
)(JoinContainer);

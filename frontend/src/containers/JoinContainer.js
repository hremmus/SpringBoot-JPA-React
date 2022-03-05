import AuthButton from "components/Auth/AuthButton";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    joinUser({ email, password, passwordConfirm, nickname }).then(
      (response) => {
        if (response.status === 201) {
          navigate("/");
        }
      }
    );
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
      <AuthButton onClick={handleSubmit}>회원가입</AuthButton>
      <RightAlignedLink href="/auth/login">돌아가기</RightAlignedLink>
    </div>
  );
};

export default connect(
  (state) => ({
    form: state.auth.getIn(["join", "form"]),
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
  })
)(JoinContainer);

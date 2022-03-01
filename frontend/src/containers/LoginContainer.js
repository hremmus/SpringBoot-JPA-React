import LoginButton from "components/Auth/AuthButton";
import InputWithLabel from "components/Auth/InputWithLabel";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import React, { Component } from "react";

export default class LoginContainer extends Component {
  render() {
    return (
      <div>
        <InputWithLabel name="email" label="이메일" variant="standard" />
        <InputWithLabel
          type="password"
          name="password"
          label="비밀번호"
          autoComplete="current-password"
          variant="standard"
        />
        <LoginButton>로그인</LoginButton>
        <RightAlignedLink href="/auth/join">회원가입</RightAlignedLink>
      </div>
    );
  }
}

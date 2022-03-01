import AuthButton from "components/Auth/AuthButton";
import InputWithLabel from "components/Auth/InputWithLabel";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import React from "react";

const JoinContainer = () => {
  return (
    <div>
      <InputWithLabel
        required
        name="email"
        label="이메일"
        variant="outlined"
        size="small"
      />
      <InputWithLabel
        required
        type="password"
        name="password"
        label="비밀번호"
        placeholder="영문, 숫자, 특수문자 조합으로 8~20자"
        variant="outlined"
        size="small"
      />
      <InputWithLabel
        required
        type="password"
        name="passwordConfirm"
        label="비밀번호 확인"
        variant="outlined"
        size="small"
      />
      <InputWithLabel
        required
        name="nickname"
        label="닉네임"
        placeholder="영문 또는 한글로 최대 10자까지 가능"
        variant="outlined"
        size="small"
      />
      <AuthButton>회원가입</AuthButton>
      <RightAlignedLink href="/auth/login">돌아가기</RightAlignedLink>
    </div>
  );
};

export default JoinContainer;

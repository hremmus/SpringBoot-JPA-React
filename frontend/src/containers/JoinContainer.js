import AuthButton from "components/Auth/AuthButton";
import AuthError from "components/Auth/AuthError";
import InputWithLabel from "components/Auth/InputWithLabel";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeInput, initializeForm, setError } from "redux/modules/auth";
import { joinUser } from "services/AuthService";

const JoinContainer = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, authError } = useSelector(({ auth }) => ({
    form: auth.join,
    authError: auth.authError,
  }));

  useEffect(() => {
    dispatch(initializeForm("join"));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        form: "join",
        key: name,
        value,
      })
    );
  };

  const handleSubmit = (e) => {
    if (form.password !== form.passwordConfirm) {
      dispatch(setError("비밀번호가 일치하지 않습니다."));
      return;
    }

    joinUser(form)
      .then((response) => {
        if (response.data.success) {
          navigate("/");
        }
      })
      .catch((error) => {
        dispatch(setError(error.response.data.result.message));
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
        value={form.email}
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
        value={form.password}
        onChange={handleChange}
      />
      <InputWithLabel
        required
        type="password"
        name="passwordConfirm"
        label="비밀번호 확인"
        variant="outlined"
        size="small"
        value={form.passwordConfirm}
        onChange={handleChange}
      />
      <InputWithLabel
        required
        name="nickname"
        label="닉네임"
        placeholder="영문 또는 한글로 최대 10자까지 가능"
        variant="outlined"
        size="small"
        value={form.nickname}
        onChange={handleChange}
      />
      {authError && <AuthError>{authError}</AuthError>}
      <AuthButton onClick={handleSubmit}>회원가입</AuthButton>
      <RightAlignedLink href="/auth/login">돌아가기</RightAlignedLink>
    </div>
  );
};

export default JoinContainer;

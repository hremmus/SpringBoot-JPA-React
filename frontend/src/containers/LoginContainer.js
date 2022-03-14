import axios from "axios";
import LoginButton from "components/Auth/AuthButton";
import AuthError from "components/Auth/AuthError";
import InputWithLabel from "components/Auth/InputWithLabel";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoggedInfo } from "redux/modules/user";
import { loginUser } from "services/AuthService";
import { changeInput, initializeForm, setError } from "./../redux/modules/auth";

const LoginContainer = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, authError } = useSelector(({ auth }) => ({
    form: auth.login,
    authError: auth.authError,
  }));

  useEffect(() => {
    dispatch(initializeForm("login"));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        form: "login",
        key: name,
        value,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginUser(form)
      .then((response) => {
        if (response.data.success) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `${response.data.result.data.accessToken}`;
          dispatch(setLoggedInfo(response.data.result.data.user));
        }

        navigate("/");
      })
      .catch((error) => {
        dispatch(setError(error.response.data.result.message));
      });
  };

  return (
    <div>
      <InputWithLabel
        name="email"
        label="이메일"
        variant="standard"
        value={form.email}
        onChange={handleChange}
      />
      <InputWithLabel
        type="password"
        name="password"
        label="비밀번호"
        autoComplete="current-password"
        variant="standard"
        value={form.password}
        onChange={handleChange}
      />
      {authError && <AuthError>{authError}</AuthError>}
      <LoginButton onClick={handleSubmit}>로그인</LoginButton>
      <RightAlignedLink href="/auth/join">회원가입</RightAlignedLink>
    </div>
  );
};

export default LoginContainer;

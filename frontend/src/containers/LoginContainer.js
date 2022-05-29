import axios from "axios";
import LoginButton from "components/Auth/AuthButton";
import AuthError from "components/Auth/AuthError";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import storage from "lib/storage";
import InputWithLabel from "lib/styleUtils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setError } from "redux/modules/auth";
import { setAccessToken } from "redux/modules/user";
import { loginUser } from "services/AuthService";
import { changeInput, initializeForm } from "./../redux/modules/auth";

const LoginContainer = (props) => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { form, authError } = useSelector(({ auth }) => ({
    form: auth.login,
    authError: auth.authError,
  }));

  useEffect(() => {
    dispatch(initializeForm("login"));

    /* Iterator 객체로 받은 keys를 꺼내어 querystring에 expired라는 key가 존재하는 지 찾음 */
    for (const keys of searchParams.keys()) {
      const param = keys;
      if (param === "expired")
        dispatch(
          setError("리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.")
        );
    }
  }, [dispatch, searchParams]);

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
          dispatch(setAccessToken(response.data.result.data.accessToken));
          storage.set("loggedInfo", response.data.result.data.user);
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

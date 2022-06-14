import LoginButton from "components/Auth/AuthButton";
import RightAlignedLink from "components/Auth/RightAlignedLink";
import ShakeText from "components/Common/ShakeText";
import storage from "lib/storage";
import InputWithLabel from "lib/styleUtils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setError } from "redux/modules/auth";
import { setAccessToken, setLoggedInfo } from "redux/modules/user";
import { loginUser } from "services/AuthService";
import { changeInput, initializeForm } from "./../redux/modules/auth";

const LoginContainer = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useSelector((state) => state.auth.login);
  const authError = useSelector((state) => state.auth.authError);

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
          const accessToken = response.data.result.data.accessToken;
          storage.set("accessToken", accessToken);
          dispatch(setAccessToken(accessToken));

          const loggedInfo = response.data.result.data.user;
          storage.set("loggedInfo", loggedInfo);
          dispatch(setLoggedInfo(loggedInfo));
        }

        navigate("/");
      })
      .catch((error) => {
        dispatch(setError(error.response.data.result.message));
      });
  };

  return (
    <>
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
      {authError && <ShakeText>{authError}</ShakeText>}
      <LoginButton onClick={handleSubmit}>로그인</LoginButton>
      <RightAlignedLink href="/auth/join">회원가입</RightAlignedLink>
    </>
  );
};

export default LoginContainer;

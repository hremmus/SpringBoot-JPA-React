import { Box, Button, FormControl, Grid } from "@material-ui/core";
import ShakeText from "components/Common/ShakeText";
import TitleAndDescription from "components/Common/TitleAndDescription";
import InputWithLabel, { AlertModal, AskModal } from "lib/styleUtils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoggedInfo } from "redux/modules/user";
import { updateUser, verifyPassword } from "services/UserService";

const UserUpdateContainer = () => {
  const dispatch = useDispatch();
  const loggedInfo = useSelector((state) => state.user.loggedInfo);

  const [isActive, setIsActive] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("........");

  const userError = useSelector((state) => state.user.userError);
  const [askModal, setAskModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    if (loggedInfo.nickname) {
      setNickname(loggedInfo.nickname);
    }
  }, [loggedInfo]);

  const onPasswordConfirm = () => {
    verifyPassword({
      password: passwordConfirm,
    })
      .then(() => {
        setIsActive(true);
        setAskModal(false);
      })
      .catch((error) => {
        dispatch(
          setError({
            type: "",
            message: error.response.data.result.message,
          })
        );
      });

    setPasswordConfirm("");
  };

  const handleClick = () => {
    updateUser({
      nickname: nickname,
      password: password === "........" ? null : password,
    })
      .then(() => {
        if (nickname !== loggedInfo.nickname) {
          dispatch(setLoggedInfo({ nickname: nickname }));
        }
        setSuccessModal(true);
      })
      .catch((error) => {
        dispatch(
          setError({
            type: "변경",
            message: error.response.data.result.message,
          })
        );
        setErrorModal(true);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "passwordConfirm") setPasswordConfirm(value);
    if (name === "nickname") setNickname(value);
    if (name === "password") setPassword(value);
  };

  const onConfirm = () => {
    setSuccessModal(false);
    setErrorModal(false);
  };

  const onCancel = () => {
    setAskModal(false);
    setPasswordConfirm("");
    dispatch(setError(""));
  };

  return (
    <>
      <Grid>
        <Grid xs={8} md={4} lg={2} item>
          <TitleAndDescription
            titleText="EDIT PROFILE"
            descriptionText="회원 정보를 변경할 수 있습니다"
          />
          <FormControl>
            <InputWithLabel
              value={loggedInfo.email}
              InputProps={{
                readOnly: true,
              }}
              label="이메일"
            />
            <InputWithLabel
              name="nickname"
              value={nickname}
              InputProps={{
                readOnly: !isActive,
              }}
              onChange={handleChange}
              label="닉네임"
            />
            <InputWithLabel
              type="password"
              name="password"
              value={password}
              InputProps={{
                readOnly: !isActive,
              }}
              onChange={handleChange}
              label="패스워드"
            />
          </FormControl>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => {
            if (isActive) {
              handleClick();
            } else {
              setAskModal(true);
            }
          }}
        >
          회원 정보 변경
        </Button>
      </Box>
      <AskModal
        visible={askModal}
        title="회원 정보 변경"
        description="개인정보 보호를 위해 패스워드 확인을 진행하고 있습니다."
        confirmText="확인"
        onConfirm={onPasswordConfirm}
        onCancel={onCancel}
        children={
          <>
            <InputWithLabel
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handleChange}
              label="패스워드를 입력해주세요."
              variant="outlined"
              margin="dense"
            />
            {userError && <ShakeText>{userError.message}</ShakeText>}
          </>
        }
      ></AskModal>
      <AlertModal
        visible={successModal}
        title="회원 정보 변경"
        description="성공적으로 변경되었습니다."
        onConfirm={onConfirm}
        isSuccess
      />
      <AlertModal
        visible={errorModal}
        title={`회원 정보 ` + userError?.type + ` 오류`}
        description={userError?.message}
        onConfirm={onConfirm}
        isError
      />
    </>
  );
};

export default UserUpdateContainer;

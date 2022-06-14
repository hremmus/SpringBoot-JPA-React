import UserList from "components/Admin/UserList";
import TitleAndDescription from "components/Common/TitleAndDescription";
import { AlertModal, AskModal } from "lib/styleUtils";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUsers, setError } from "redux/modules/users";
import { deleteUser, getUsers } from "services/UserService";

const UserListContainer = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.user.loggedInfo.isAdmin);
  const accessToken = useSelector((state) => state.user.accessToken);

  const users = useSelector((state) => state.users.users);
  const [checked, setChecked] = useState([]);
  const usersError = useSelector((state) => state.users.usersError);

  const fetchUsers = useCallback(() => {
    getUsers(
      {
        email: null,
        nickname: null,
      },
      accessToken
    )
      .then((response) => {
        dispatch(loadUsers(response.data.result.data));
      })
      .catch((error) => console.log(error));
  }, [dispatch, accessToken]);

  useEffect(() => {
    // useEffect 훅으로 사용자 인증이 요구되는 api를 호출하자, token이 제대로 전달되지 않는 현상이 나타남
    // => token을 의존성 배열에 포함, 조건부 실행
    if (accessToken) fetchUsers();
  }, [accessToken, fetchUsers]);

  const handleToggle = (id) => {
    setChecked(
      (
        prevChecked // 이전 배열 참조
      ) =>
        prevChecked.includes(id)
          ? prevChecked.filter((checkedId) => checkedId !== id) // 체크되어 있었으면 해제 (배열에서 제외)
          : [...prevChecked, id] // 체크되어 있지 않았으면 배열에 추가
    );
  };

  const handleDelete = async () => {
    try {
      const deletePromises = checked.map((id) => deleteUser(id));
      await Promise.all(deletePromises);

      fetchUsers();
      setChecked([]);
    } catch (error) {
      dispatch(
        setError({ type: "삭제", message: error.response.data.result.message })
      );
      setErrorModal(true);
    }
  };

  const [askModal, setAskModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const onConfirm = () => {
    document.getElementById("alert-modal").classList.add("hide");

    setTimeout(() => {
      setErrorModal(false);
    }, 600);
  };

  const onRemove = () => {
    if (checked.length > 0) {
      setAskModal(true);
    } else {
      dispatch(
        setError({
          type: "삭제",
          message: "삭제할 회원을 선택해주세요.",
        })
      );
      setErrorModal(true);
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <TitleAndDescription
        titleText="USER"
        descriptionText="회원 관리 페이지입니다"
      />
      <UserList
        users={users}
        checked={checked}
        onRemove={onRemove}
        handleToggle={handleToggle}
      />
      <AskModal
        visible={askModal}
        title="회원 삭제"
        description="회원을 정말 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={() => {
          handleDelete();
          setAskModal(false);
        }}
        onCancel={() => {
          setAskModal(false);
        }}
      />
      <AlertModal
        visible={errorModal}
        title={`회원 ` + usersError?.type + ` 오류`}
        description={usersError?.message}
        onConfirm={onConfirm}
        isError
      />
    </>
  );
};

export default UserListContainer;

import { Box } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import Settings from "@material-ui/icons/Settings";
import { ReactComponent as Logout } from "assets/svg/log-out.svg";
import { Link } from "react-router-dom";
import styled from "styled-components";

const UserInfo = ({ loggedInfo, isAdmin, handleLogout }) => {
  return (
    <>
      <Box display="flex" alignItems="center" fontFamily="Kopub Dotum Light">
        {loggedInfo.nickname}님 환영합니다!
        <Bar />
        <Link to={!isAdmin ? `/mypage/profile` : `/admin/users`}>
          <SettingsIcon />
        </Link>
        <LogoutIcon onClick={handleLogout} />
      </Box>
    </>
  );
};

export default UserInfo;

const SettingsIcon = styled(Settings)`
  margin: 0 8px 0 2px;
  vertical-align: middle;
  color: ${grey[800]};
`;

const LogoutIcon = styled(Logout)`
  width: 21px;
  height: 21px;
  margin: 0 12px 0 2px;
  vertical-align: middle;
`;

const Bar = styled.div`
  content: "";
  display: inline-block;
  margin: 0 4px 0 8px;
  width: 1px;
  height: 12px;
  background-color: #e5e5e5;
`;

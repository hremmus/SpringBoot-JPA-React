import {
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { CheckBoxStyled } from "lib/styleUtils";
import UserDeleteButton from "./UserDeleteButton";

const UserList = ({ users, checked, onRemove, handleToggle }) => {
  return (
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>
              <UserDeleteButton onClick={onRemove} />
            </TableCell>
            <TableCell>번호</TableCell>
            <TableCell>이메일</TableCell>
            <TableCell>닉네임</TableCell>
            <TableCell>가입일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((row) => {
            const labelId = `transfer-list-item-${row}-label`;
            return (
              <TableRow key={row.id}>
                <TableCell>
                  <ListItemIcon onClick={() => handleToggle(row.id)}>
                    <CheckBoxStyled
                      checked={checked.includes(row.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.email}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.nickname}
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(row.createdDate).toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;

import { Box, IconButton, InputAdornment, InputBase } from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";
import { Clear, Search } from "@material-ui/icons";
import styled from "styled-components";

const SearchInput = ({ keyword, handleChange, handleSubmit, handleClear }) => {
  const endAdornment = () => {
    if (keyword) {
      return (
        <InputAdornment position="end">
          <IconButtonStyled onClick={handleClear} aria-label="clear">
            <Clear />
          </IconButtonStyled>
        </InputAdornment>
      );
    }

    return "";
  };

  return (
    <Box
      p="1rem 2rem"
      display="flex"
      justifyContent="right"
      alignItems="center"
    >
      <InputBaseStyled
        component="input"
        value={keyword}
        onChange={handleChange}
        placeholder="이메일 또는 닉네임 검색"
        endAdornment={endAdornment()}
      />
      <IconButtonStyled
        type="button"
        onClick={handleSubmit}
        aria-label="search"
        className="search"
      >
        <Search />
      </IconButtonStyled>
    </Box>
  );
};

export default SearchInput;

const InputBaseStyled = styled(InputBase)`
  // clear 버튼을 input 내부 우측 중앙에 위치시킴
  .MuiInputAdornment-root {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  margin-left: 8px;
`;

const IconButtonStyled = styled(IconButton)`
  &.MuiButtonBase-root {
    margin-left: 4px;
    padding: 8px;

    &.search {
      color: ${cyan[200]};
    }
  }

  &.MuiIconButton-root:hover {
    background-color: white;
  }
`;

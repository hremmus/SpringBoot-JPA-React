import {
  ButtonBase,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { useRef, useState } from "react";
import styled, { css } from "styled-components";

export const SubInfo = ({
  nickname,
  createdDate,
  modifiedDate,
  handleClick,
  hasMarginTop,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleListKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <SubInfoBlock hasMarginTop={hasMarginTop}>
      <div>
        <ButtonBase
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Typography>{nickname}</Typography>
        </ButtonBase>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper variant="outlined">
                <ClickAwayListener onClickAway={handleClose}>
                  {/* Click-Away Listener is a utility component that listens for click events outside of its child.
                    This is useful for components like the Popper which should close when the user clicks anywhere else in the document. */}
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleClick} dense disableGutters>
                      작성글 보기
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <span>{new Date(createdDate).toLocaleString()}</span>
      {modifiedDate > createdDate && (
        <span>(수정) {new Date(modifiedDate).toLocaleString()}</span>
      )}
    </SubInfoBlock>
  );
};

const SubInfoBlock = styled.div`
  display: flex;
  ${(props) =>
    props.hasMarginTop &&
    css`
      margin-top: 0.5rem;
    `}
  color: ${grey[600]};
  font-family: "Kopub Dotum Light";

  div + span:before {
    color: ${grey[400]};
    padding: 0 0.25rem 0 0.25rem;
    content: "\\B7"; /* · */
  }

  span + span:before {
    color: ${grey[400]};
    padding: 0 0.25rem 0 0.25rem;
    content: "\\B7"; /* · */
  }
`;

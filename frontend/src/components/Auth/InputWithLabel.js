import { TextField } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import React from "react";

const StyledTextField = styled(TextField)({
  width: "100%",
  marginBottom: "1rem",
});

const InputWithLabel = ({ ...props }) => {
  return <StyledTextField {...props} />;
};

export default InputWithLabel;

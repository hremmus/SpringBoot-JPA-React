import { CircularProgress } from "@material-ui/core";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Spinner = () => {
  const { loading } = useSelector(({ loading }) => ({
    loading: loading.loading,
  }));

  return (
    <>
      {loading && (
        <SpinnerWrapper>
          <CircularProgress />
        </SpinnerWrapper>
      )}
    </>
  );
};

export default Spinner;

const SpinnerWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
`;

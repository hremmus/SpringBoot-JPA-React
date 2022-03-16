import { Link } from "react-router-dom";
import styled from "styled-components";

const ButtonBlock = styled.div`
  width: 125px;
  position: relative;
`;

const Button = styled(Link)`
  cursor: pointer;
  margin: auto;
  align-items: center;
  transition: 0.2s all;
`;

const LoginButton = () => (
  <ButtonBlock>
    <Button to="/auth/login">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22px"
        height="22px"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11 2C6.02944 2 2 6.02944 2 11C2 13.3231 2.88021 15.4407 4.32532 17.0374C5.25805 15.6619 6.58521 14.6209 8.10946 14.0356C6.94228 13.1574 6.1875 11.7606 6.1875 10.1875C6.1875 7.52963 8.34213 5.375 11 5.375C13.6579 5.375 15.8125 7.52963 15.8125 10.1875C15.8125 11.7606 15.0577 13.1575 13.8905 14.0356C15.4147 14.621 16.7419 15.662 17.6746 17.0375C19.1197 15.4408 20 13.3232 20 11C20 6.02944 15.9706 2 11 2ZM18.0256 18.8034C20.1589 16.8815 21.5 14.0974 21.5 11C21.5 5.20101 16.799 0.5 11 0.5C5.20101 0.5 0.5 5.20101 0.5 11C0.5 14.0928 1.83722 16.8734 3.96504 18.7949C3.97306 18.8025 3.98127 18.8099 3.98966 18.8171C5.84854 20.4853 8.30577 21.5 11 21.5C13.6987 21.5 16.1595 20.4819 18.0195 18.8089C18.0215 18.807 18.0236 18.8052 18.0256 18.8034ZM16.5616 18.0764C15.3687 16.1739 13.2728 15 10.9999 15C8.72705 15 6.63122 16.1738 5.43828 18.0763C6.96919 19.2812 8.90065 20 11 20C13.0993 20 15.0307 19.2813 16.5616 18.0764ZM11 13.5C12.8294 13.5 14.3125 12.0169 14.3125 10.1875C14.3125 8.35806 12.8294 6.875 11 6.875C9.17056 6.875 7.6875 8.35806 7.6875 10.1875C7.6875 12.0169 9.17056 13.5 11 13.5Z"
          fill="black"
        />
      </svg>
    </Button>
  </ButtonBlock>
);

export default LoginButton;

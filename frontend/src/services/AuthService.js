import axios from "axios";

const baseURL = "http://localhost:8080/api/auth";

export const loginUser = ({ email, password }) => {
  return axios.post(baseURL + "/signin/", {
    email,
    password,
  });
};

export const joinUser = ({ email, password, nickname }) => {
  return axios.post(baseURL + "/signup/", {
    email,
    password,
    nickname,
  });
};

import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export const loginUser = ({ email, password }) => {
  return axios.post(API_BASE_URL + "/signin/", {
    email,
    password,
  });
};

export const joinUser = ({ email, password, nickname }) => {
  return axios.post(API_BASE_URL + "/signup/", {
    email,
    password,
    nickname,
  });
};

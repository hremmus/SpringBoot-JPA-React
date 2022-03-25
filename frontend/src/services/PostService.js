import axios from "axios";

const baseURL = "http://localhost:8080/api/posts/";

export const getPosts = (condition) => {
  return axios.get(baseURL, { params: condition });
};

export const createPost = ({ title, content, categoryId }) => {
  return axios.post(baseURL, { title, content, categoryId });
};

export const getPost = (id) => {
  return axios.get(baseURL + `${id}`);
};

export const updatePost = ({ id, title, content, categoryId }) => {
  return axios.put(baseURL + `${id}`, { title, content, categoryId });
};

export const deletePost = (id) => {
  return axios.delete(baseURL + `${id}`);
};

import api from "services";

const baseURL = "/posts/";

export const getPosts = (condition) => {
  return api.get(baseURL, { params: condition });
};

export const createPost = ({ title, content, categoryId }) => {
  return api.post(baseURL, { title, content, categoryId });
};

export const getPost = (id) => {
  return api.get(baseURL + `${id}`);
};

export const updatePost = ({ id, title, content, categoryId }) => {
  return api.put(baseURL + `${id}`, { title, content, categoryId });
};

export const deletePost = (id) => {
  return api.delete(baseURL + `${id}`);
};

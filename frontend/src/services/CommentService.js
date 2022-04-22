import axios from "axios";

const baseURL = "http://localhost:8080/api/comments/";

export const getComments = (condition) => {
  return axios.get(baseURL, { params: condition });
};

export const createComment = ({ content, postId, parentId }) => {
  return axios.post(baseURL, { content, postId, parentId });
};

export const updateComment = ({ id, content }) => {
  return axios.patch(baseURL + `${id}`, { content });
};

export const deleteComment = ({ id }) => {
  return axios.delete(baseURL + `${id}`);
};
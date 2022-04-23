import api from "services";

const baseURL = "/comments/";

export const getComments = (condition) => {
  return api.get(baseURL, { params: condition });
};

export const createComment = ({ content, postId, parentId }) => {
  return api.post(baseURL, { content, postId, parentId });
};

export const updateComment = ({ id, content }) => {
  return api.patch(baseURL + `${id}`, { content });
};

export const deleteComment = ({ id }) => {
  return api.delete(baseURL + `${id}`);
};

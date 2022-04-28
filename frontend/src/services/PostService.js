import api from "services";

const baseURL = "/posts/";

export const getPosts = (condition) => {
  return api.get(baseURL, { params: condition });
};

export const createPost = (request) => {
  // HTTP Header의 Content-Type이 Application/json으로 되어 있지만 MultipartFile이 전송된다.
  return api.post(baseURL, request);
};

export const getPost = (id) => {
  return api.get(baseURL + `${id}`);
};

export const updatePost = (id, request) => {
  return api.put(baseURL + `${id}`, request);
};

export const deletePost = (id) => {
  return api.delete(baseURL + `${id}`);
};

import api from "services";

const baseURL = "/location";

export const getLocations = (global) => {
  return api.get(baseURL, { params: { global: global } });
};

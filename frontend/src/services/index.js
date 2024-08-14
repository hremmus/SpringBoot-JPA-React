import axios from "axios";
import storage from "lib/storage";
import { logout, setAccessToken } from "redux/modules/user";
import { store } from "redux/store";
import { refreshToken } from "./AuthService";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "Application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = store.getState().user.accessToken;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const {
      config,
      response: {
        status,
        data: { statusCode },
      },
    } = error;
    const prevRequest = config;
    if (status === 401 && statusCode === -1019 && !prevRequest.sent) {
      prevRequest.sent = true;
      return refreshToken() // axios 호출의 결과(비동기 작업 then 또는 catch)를 체인의 다음 단계로 전달하기 위해서는 return하여 Promise를 반환해야 함
        .then((response) => {
          const newAccessToken = response.data.result.data.accessToken;
          prevRequest.headers["Authorization"] = newAccessToken;
          storage.set("accessToken", newAccessToken);
          store.dispatch(setAccessToken(newAccessToken));

          return api(prevRequest);
        })
        .catch((error) => {
          store.dispatch(logout());
          storage.remove("loggedInfo");
          storage.remove("accessToken");

          // 반환된 Promise가 다음 단계로 연결될 때 에러를 던짐 => 체인의 다음, 즉 호출한 쪽의 catch 문에서 처리하게 함
          return Promise.reject(error);
        });
    }

    // JWT 에러를 제외한 나머지 던짐
    return Promise.reject(error);
  }
);

export default api;

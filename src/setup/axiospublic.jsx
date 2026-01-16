import axios from "axios";
import { toast } from "react-toastify";

// Set config defaults when creating the instance
const strapi = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_UR || "http://113.161.81.49:1338", // Dùng biến môi trường hoặc fallback URL
});

strapi.defaults.withCredentials = true;

// Add a request interceptor for strapi
strapi.interceptors.request.use(
  function (config) {
    // Chèn token vào header Authorization
    config.headers.Authorization = `Bearer 32abdfd590e17729478833ef0f4e2b7a5db026f6ba988bcecdb3ed6e4c60a404d540c6f88115a9ba50e66b8aba1f1b23b7441d6becb1a80b55d54bd68f718285b1e1728a124ec3614f03566b5e92423dc55fa81bb34b1808655d2baf2356f26caba88415c7e21b404460fc32571e89b9d4967bbe3591a3f7616df8b66c440548`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor for strapi
strapi.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    const status = (error && error.response && error.response.status) || 500;
    switch (status) {
      case 401:
        if (
          ![
            "/",
            "/login",
            "/register",
            "/about",
            "/verify-otp",
            "/projectcustomer",
          ].includes(window.location.pathname)
        ) {
          toast.error("Không xác thực người dùng. Vui lòng đăng nhập");
        }
        return error.response.data;
      case 403:
      case 400:
      case 404:
      case 409:
      case 422:
        return Promise.reject(error);
      default:
        return Promise.reject(error);
    }
  }
);

export default strapi;

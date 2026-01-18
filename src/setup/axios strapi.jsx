import axios from "axios";
import { toast } from "react-toastify";

// Set config defaults when creating the instance
const strapiInstance = axios.create({
  // baseURL: import.meta.env.VITE_STRAPI_URL || "http://113.161.81.49:1338",
  baseURL: import.meta.env.VITE_STRAPI_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

strapiInstance.defaults.withCredentials = true;

// Thêm interceptor cho các yêu cầu
strapiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for strapiInstance
strapiInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.error("Response error:", error); // Log lỗi chi tiết
    const status = (error && error.response && error.response.status) || 500;
    switch (status) {
      case 401:
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register" &&
          window.location.pathname !== "/about" &&
          window.location.pathname !== "/verify-otp" &&
          window.location.pathname !== "/projectcustomer"
        ) {
          toast.error("Không xác thực người dùng. Vui lòng đăng nhập");
        }
        break;
      case 403:
        toast.error("Bạn không có quyền truy cập.");
        break;
      case 400:
        //  toast.error('Yêu cầu không hợp lệ.');
        break;
      case 404:
        toast.error("Không tìm thấy tài nguyên.");
        break;
      case 409:
        toast.error("Xung đột dữ liệu.");
        break;
      case 422:
        toast.error("Dữ liệu không hợp lệ.");
        break;
      default:
        toast.error("Có lỗi xảy ra.");
        break;
    }
    return Promise.reject(error);
  }
);

export default strapiInstance;

// import axios from "axios";
// import { toast } from "react-toastify";

// // Set config defaults when creating the instance
// const strapiInstance = axios.create({
//   baseURL: import.meta.env.VITE_STRAPI_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// strapiInstance.defaults.withCredentials = true;

// // Thêm interceptor cho các yêu cầu
// strapiInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("jwt");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add a response interceptor for strapiInstance
// strapiInstance.interceptors.response.use(
//   function (response) {
//     return response.data;
//   },
//   function (error) {
//     console.error("Response error:", error); // Log lỗi chi tiết
//     const status = (error && error.response && error.response.status) || 500;
//     switch (status) {
//       case 401:
//         if (
//           window.location.pathname !== "/" &&
//           window.location.pathname !== "/login" &&
//           window.location.pathname !== "/register" &&
//           window.location.pathname !== "/about" &&
//           window.location.pathname !== "/verify-otp" &&
//           window.location.pathname !== "/projectcustomer"
//         ) {
//           toast.error("Không xác thực người dùng. Vui lòng đăng nhập");
//         }
//         break;
//       case 403:
//         toast.error("Bạn không có quyền truy cập.");
//         break;
//       case 400:
//         //  toast.error('Yêu cầu không hợp lệ.');
//         break;
//       case 404:
//         toast.error("Không tìm thấy tài nguyên.");
//         break;
//       case 409:
//         toast.error("Xung đột dữ liệu.");
//         break;
//       case 422:
//         toast.error("Dữ liệu không hợp lệ.");
//         break;
//       default:
//         toast.error("Có lỗi xảy ra.");
//         break;
//     }
//     return Promise.reject(error);
//   }
// );

// export default strapiInstance;



// import axios from "axios";
// import { toast } from "react-toastify";

// // Gom nhóm các đường dẫn public vào một chỗ để dễ bảo trì
// export const PUBLIC_PATHS = [
//   "/",
//   "/login",
//   "/register",
//   "/about",
//   "/verify-otp",
//   "/projectcustomer",
//   "/forgot-password",
//   "/reset-password",
// ];

// let isToastShown = false;

// const strapiInstance = axios.create({
//   baseURL: import.meta.env.VITE_STRAPI_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// /* ================= REQUEST INTERCEPTOR ================= */
// strapiInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("jwt");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ================= RESPONSE INTERCEPTOR ================= */
// strapiInstance.interceptors.response.use(
//   (response) => response?.data ?? response,
//   (error) => {
//     const status = error?.response?.status;
//     const currentPath = window.location.pathname;

//     // 1. Lỗi kết nối
//     if (!error.response) {
//       toast.error("Không thể kết nối server");
//       return Promise.reject(error);
//     }

//     // 2. Xử lý lỗi 401 (Hết hạn phiên làm việc)
//     if (status === 401) {
//       if (!PUBLIC_PATHS.includes(currentPath)) {
//         if (!isToastShown) {
//           toast.error("Phiên đăng nhập đã hết hạn");
//           isToastShown = true;
//         }

//         // Xóa dữ liệu cũ
//         localStorage.removeItem("jwt");
//         localStorage.removeItem("user");

//         // Chuyển hướng về login sau 800ms
//         setTimeout(() => {
//           isToastShown = false; // reset lại biến flag
//           window.location.href = "/login";
//         }, 800);
//       }
//       return Promise.reject(error);
//     }

//     // 3. Xử lý các lỗi khác bằng switch/case cho gọn
//     switch (status) {
//       case 403: toast.error("Bạn không có quyền truy cập"); break;
//       case 404: toast.error("Không tìm thấy tài nguyên"); break;
//       case 409: toast.error("Xung đột dữ liệu"); break;
//       case 422: toast.error("Dữ liệu không hợp lệ"); break;
//       default:
//         if (status >= 500) toast.error("Lỗi hệ thống (5xx)");
//     }

//     return Promise.reject(error);
//   }
// );

// export default strapiInstance;

import axios from "axios";
import { toast } from "react-toastify";

export const PUBLIC_PATHS = ["/", "/login", "/register", "/about", "/verify-otp", "/projectcustomer", "/forgot-password", "/reset-password"];

let isToastShown = false;

const strapiInstance = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

strapiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

strapiInstance.interceptors.response.use(
  (response) => response?.data ?? response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;

    if (!error.response) {
      toast.error("Không thể kết nối server");
      return Promise.reject(error);
    }

    if (status === 401 && !PUBLIC_PATHS.includes(currentPath)) {
      if (!isToastShown) {
        toast.error("Phiên đăng nhập đã hết hạn");
        isToastShown = true;
      }
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");

      setTimeout(() => {
        isToastShown = false;
        window.location.href = "/login";
      }, 800);
    }

    // Switch/case gọn gàng
    const errorMessages = {
      403: "Bạn không có quyền truy cập",
      404: "Không tìm thấy tài nguyên",
      409: "Xung đột dữ liệu",
      422: "Dữ liệu không hợp lệ",
    };
    if (errorMessages[status]) toast.error(errorMessages[status]);
    else if (status >= 500) toast.error("Lỗi hệ thống (5xx)");

    return Promise.reject(error);
  }
);

export default strapiInstance;
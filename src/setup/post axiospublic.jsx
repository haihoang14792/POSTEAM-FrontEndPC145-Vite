import axios from "axios";
import { toast } from "react-toastify";

// Thiết lập instance cho khách hàng (Cổng 1339)
const strapiv2 = axios.create({
  // Sử dụng biến môi trường bạn đã cung cấp: http://113.161.81.49:1339
  baseURL: import.meta.env.VITE_CUSTOMER_BACKEND_URL,
});

strapiv2.defaults.withCredentials = true;

// Add a request interceptor
strapiv2.interceptors.request.use(
  function (config) {
    // KHUYÊN DÙNG: Thay vì dán cứng Token, hãy lấy từ .env hoặc localStorage
    const token = import.meta.env.VITE_CUSTOMER_TOKEN;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
strapiv2.interceptors.response.use(
  function (response) {
    // Trả về dữ liệu gốc từ strapiv2 (thường là response.data)
    return response.data;
  },
  function (error) {
    const status = error?.response?.status || 500;

    // Chỉ hiển thị thông báo lỗi khi không ở các trang công khai
    const publicPages = ["/", "/login", "/register", "/about", "/verify-otp", "/projectcustomer"];

    if (status === 401 && !publicPages.includes(window.location.pathname)) {
      toast.error("Không xác thực người dùng. Vui lòng đăng nhập");
    }

    return Promise.reject(error);
  }
);

export default strapiv2;
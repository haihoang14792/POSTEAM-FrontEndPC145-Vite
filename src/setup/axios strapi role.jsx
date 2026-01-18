import axios from "axios";
import { toast } from "react-toastify";

// Set config defaults when creating the instance
const strapiv1Instance = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_URL,
});

// Bật gửi cookies nếu cần
strapiv1Instance.defaults.withCredentials = true;

// 🛠 Interceptor Request: Thêm token vào headers
strapiv1Instance.interceptors.request.use(
  function (config) {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // console.log("🟡 [DEBUG] User Info:", storedUser);

    if (storedUser && storedUser.token) {
      config.headers.Authorization = `Bearer ${storedUser.token}`;
      config.headers["Content-Type"] = "application/json";
      // console.log("✅ [DEBUG] Headers trước khi gửi:", config.headers);
    } else {
      //  console.warn("⚠ [WARNING] Không tìm thấy token trong localStorage!");
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 🛠 Interceptor Response: Xử lý lỗi API
strapiv1Instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    const status = error?.response?.status || 500;

    toast.dismiss(); // Xóa hết thông báo cũ trước khi hiển thị mới

    switch (status) {
      case 401:
        toast.error("🚫 Không xác thực người dùng. Vui lòng đăng nhập.");
        break;
      case 403:
        toast.error("⛔ Bạn không có quyền truy cập.");
        break;
      case 400:
        // toast.error("⚠️ Yêu cầu không hợp lệ.");
        break;
      case 404:
        toast.error("❌ Không tìm thấy tài nguyên.");
        break;
      case 409:
        toast.error("⚡ Xung đột dữ liệu.");
        break;
      case 422:
        toast.error("📌 Dữ liệu không hợp lệ.");
        break;
      default:
        toast.error("⚙️ Có lỗi xảy ra.");
        break;
    }

    return Promise.reject(error);
  }
);

export default strapiv1Instance;

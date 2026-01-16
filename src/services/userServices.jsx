import strapiInstance from "../setup/axios strapi";
import axios from "axios";

// const getUserAccount = async () => {
//   try {
//     const response = await strapiInstance.get("/api/users/me");
//     console.log("User data:", response.data);
//     return {
//       EC: 0,
//       DT: response,
//       EM: "Lấy thông tin người dùng thành công.",
//     };
//   } catch (error) {
//     return {
//       EC: 1,
//       DT: null,
//       EM: "Lỗi khi lấy thông tin người dùng.",
//     };
//   }
// };

// const getUserAccount = async () => {
//   try {
//     const response = await strapiInstance.get("/api/users/me");

//     // ⚠️ STRAPI v4: user nằm trực tiếp trong response.data
//     return {
//       EC: 0,
//       DT: response.data, // ✅ ĐÚNG
//       EM: "Lấy thông tin người dùng thành công.",
//     };
//   } catch (error) {
//     return {
//       EC: 1,
//       DT: null,
//       EM: "Lỗi khi lấy thông tin người dùng.",
//       status: error?.response?.status,
//     };
//   }
// };


const getUserAccount = async () => {
  try {
    const response = await strapiInstance.get("/api/users/me");
    // response là full Axios response (status, data, headers...)

    return {
      EC: 0,
      DT: response.data, // Strapi v4: user nằm trong data
      EM: "Lấy thông tin người dùng thành công.",
    };
  } catch (error) {
    const status = error.response?.status;

    // Chỉ coi là lỗi auth khi thực sự 401
    if (status === 401) {
      return {
        EC: 1,
        DT: null,
        EM: "Unauthorized",
        status: 401,
      };
    }

    // Các lỗi khác: network, 500, timeout...
    return {
      EC: 1,
      DT: null,
      EM: "Lỗi kết nối hoặc server",
      status: status || 0, // 0 = network error
    };
  }
};


// Hàm lấy danh sách người dùng từ API
const getUsers = async () => {
  try {
    const response = await strapiInstance.get("/api/dhgusers");
    console.log("Dữ liệu người dùng trả về:", response.data);

    // Nếu dữ liệu trả về là một mảng đơn giản, xử lý theo định dạng này
    if (Array.isArray(response.data)) {
      return response.data.map((user) => ({
        id: user.id,
        FullName: user.attributes ? user.attributes.FullName : "Không có tên",
        Position: user.attributes
          ? user.attributes.Position
          : "Không có vị trí",
      }));
    } else {
      // Xử lý trường hợp dữ liệu không phải là mảng
      console.error("Dữ liệu trả về không phải là mảng:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    return [];
  }
};

// const loginUser = async (email, password) => {
//     try {
//         const response = await strapiInstance.post('/api/auth/local', {
//             identifier: email,
//             password: password,
//         });

//         const token = response.jwt;
//         if (!token) {
//             throw new Error("Token is not provided in the response.");
//         }

//         localStorage.setItem('jwt', token);

//         // Kiểm tra xem response.user có tồn tại và có thuộc tính username không
//         const userData = response.user ? {
//             ...response.user,
//             jwt: token,
//             isAuthenticated: true
//         } : {
//             jwt: token,
//             isAuthenticated: true,
//             username: "unknown" // Hoặc giá trị mặc định khác
//         };

//         return {
//             EC: 0,
//             DT: userData,
//             EM: "Đăng nhập thành công.",
//         };
//     } catch (error) {
//         console.error("Lỗi khi đăng nhập:", error.message);
//         return {
//             EC: 1,
//             DT: null,
//             EM: error.response?.data?.message || "Lỗi khi đăng nhập.",
//         };
//     }
// };

const loginUser = async (email, password) => {
  try {
    const response = await strapiInstance.post("/api/auth/local", {
      identifier: email,
      password: password,
    });

    const token = response.jwt;
    if (!token) {
      throw new Error("Token is not provided in the response.");
    }

    localStorage.setItem("jwt", token);

    const userData = response.user
      ? {
        ...response.user,
        jwt: token,
        isAuthenticated: true,
      }
      : {
        jwt: token,
        isAuthenticated: true,
        username: "unknown",
      };

    return {
      EC: 0,
      DT: userData,
      EM: "Đăng nhập thành công.",
    };
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);

    let errorMessage = "Lỗi khi đăng nhập.";

    // Nếu có phản hồi từ Strapi
    const strapiError = error.response?.data?.error;
    if (strapiError?.message) {
      const msg = strapiError.message;

      if (msg === "Your account has been blocked by an administrator") {
        errorMessage = "Tài khoản chưa được xác thực.";
      } else if (
        msg.toLowerCase().includes("invalid identifier") ||
        msg.toLowerCase().includes("invalid credentials")
      ) {
        errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng.";
      } else {
        errorMessage = msg;
      }
    }

    return {
      EC: 1,
      DT: null,
      EM: errorMessage,
    };
  }
};

const logoutUser = () => {
  try {
    localStorage.removeItem("jwt"); // Xóa JWT từ localStorage
    return {
      EC: 0,
      EM: "Đăng xuất thành công.",
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Lỗi khi đăng xuất.",
    };
  }
};

const registerNewUser = async (email, username, password, fullName) => {
  try {
    const response = await strapiInstance.post("/api/auth/local/register", {
      username: username,
      email: email,
      password: password,
      Name: fullName,
    });

    return {
      data: response.data,
      EC: 0,
      EM: "Đăng ký thành công!",
    };
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    return {
      data: null,
      EC: 1,
      EM:
        error.response?.data?.error?.message ||
        "Có lỗi xảy ra trong quá trình đăng ký.",
    };
  }
};

const sendOtp = async (email) => {
  try {
    const response = await strapiInstance.post("/api/otp/generate", { email });
    return response.data; // Thêm return để lấy kết quả
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    throw error;
  }
};

const verifyOtp = async (email, otp) => {
  console.log("Gửi request OTP:", { email, otp });

  try {
    let response = await axios.post("/api/otp/validate", { email, otp });
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi xác thực OTP:", error);
    console.warn("⚠ Chi tiết lỗi:", error.response?.data);
    return error.response?.data || { error: "Lỗi không xác định" };
  }
};

const fetchUserRole = async () => {
  try {
    const response = await strapiInstance.get("/api/users/me?populate[role]=*");
    const role = response.data?.role;

    if (!role) {
      throw new Error("Role không tồn tại trong dữ liệu trả về");
    }

    return role; // Trả về toàn bộ đối tượng role
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
};

const forgotPassword = async (email) => {
  try {
    const response = await strapiInstance.post("/api/auth/forgot-password", {
      email: email.trim(), // chỉ cần email
    });

    console.log("Strapi response:", response.data);
    return { EC: 0, EM: "Email reset mật khẩu đã được gửi thành công!" };
  } catch (err) {
    console.error(
      "forgotPassword API error:",
      err.response?.data || err.message
    );
    return {
      EC: 1,
      EM: err.response?.data?.error?.message || "Lỗi khi gửi email reset",
    };
  }
};

// Reset mật khẩu
const resetPassword = async (code, password) => {
  try {
    const response = await strapiInstance.post("/api/auth/reset-password", {
      code,
      password,
      passwordConfirmation: password,
    });

    // Strapi trả về user object, không có jwt
    if (response.data?.user) {
      return { EC: 0, EM: "Đặt lại mật khẩu thành công!" };
    } else {
      return { EC: 0, EM: "Đặt lại mật khẩu thành công!" };
    }
  } catch (err) {
    console.error("resetPassword API error:", err);

    const apiMessage = err.response?.data?.error?.message;

    // Nếu API trả về "Incorrect code provided" => hiển thị "Code đã hết hạn"
    if (apiMessage === "Incorrect code provided") {
      return { EC: 1, EM: "Code đã hết hạn!" };
    }

    return {
      EC: 1,
      EM: apiMessage || "Token không hợp lệ hoặc đã hết hạn!",
    };
  }
};

export {
  loginUser,
  getUserAccount,
  logoutUser,
  registerNewUser,
  fetchUserRole,
  getUsers,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
};

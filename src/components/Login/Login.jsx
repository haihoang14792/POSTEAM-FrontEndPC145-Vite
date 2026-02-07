// import React, { useState, useContext, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { loginUser } from "../../services/userServices";
// import { UserContext } from "../../context/UserContext";

// import {
//   CButton,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
//   CSpinner,
// } from "@coreui/react";
// import CIcon from "@coreui/icons-react";
// import { cilLockLocked, cilUser } from "@coreui/icons";
// import "./Login.scss";

// const Login = () => {
//   const navigate = useNavigate();
//   const { user, loginContext } = useContext(UserContext);

//   const [valueLogin, setValueLogin] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // State lỗi chi tiết cho từng trường
//   const [errors, setErrors] = useState({
//     login: "",
//     password: ""
//   });

//   const validate = () => {
//     let isValid = true;
//     const newErrors = { login: "", password: "" };

//     if (!valueLogin.trim()) {
//       newErrors.login = "Vui lòng nhập email hoặc tên đăng nhập";
//       isValid = false;
//     }

//     if (!password.trim()) {
//       newErrors.password = "Vui lòng nhập mật khẩu";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault(); // Chặn reload form mặc định

//     if (!validate()) return;

//     setIsLoading(true);

//     try {
//       const response = await loginUser(valueLogin, password);

//       if (response?.EC === 0) {
//         const { jwt, ...userData } = response.DT;
//         if (!userData.username) {
//           toast.error("Dữ liệu tài khoản không hợp lệ.");
//           return;
//         }

//         const userDataContext = {
//           isAuthenticated: true,
//           token: jwt,
//           account: userData,
//         };

//         localStorage.setItem("jwt", jwt);
//         loginContext(userDataContext);
//         navigate("/dhg");
//         toast.success("Đăng nhập thành công!");
//       } else {
//         // Xử lý thông báo lỗi từ server trả về
//         const msg = response?.EM || "Đăng nhập thất bại.";
//         toast.error(msg);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("Lỗi kết nối server. Vui lòng thử lại sau.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.isAuthenticated) {
//       navigate("/dhg");
//     }
//   }, [user, navigate]);

//   return (
//     <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={10}>
//             <CRow className="g-0 card-wrapper shadow rounded overflow-hidden">
//               {/* Left: Login form */}
//               <CCol md={6} className="login-left-card p-5 bg-white">
//                 <h1 className="mb-3 text-primary">Đăng nhập</h1>
//                 <p className="text-body-secondary mb-4">
//                   Nhập thông tin tài khoản để truy cập hệ thống
//                 </p>

//                 <CForm onSubmit={handleLogin}>
//                   <div className="mb-3">
//                     <CInputGroup className={errors.login ? "is-invalid" : ""}>
//                       <CInputGroupText>
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput
//                         placeholder="Tên đăng nhập hoặc email"
//                         autoComplete="username"
//                         value={valueLogin}
//                         onChange={(e) => {
//                           setValueLogin(e.target.value);
//                           if (errors.login) setErrors({ ...errors, login: "" }); // Xóa lỗi khi gõ
//                         }}
//                         invalid={!!errors.login}
//                         disabled={isLoading}
//                       />
//                     </CInputGroup>
//                     {/* Hiển thị lỗi inline */}
//                     {errors.login && <div className="invalid-feedback d-block text-start">{errors.login}</div>}
//                   </div>

//                   <div className="mb-4">
//                     <CInputGroup className={errors.password ? "is-invalid" : ""}>
//                       <CInputGroupText>
//                         <CIcon icon={cilLockLocked} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="password"
//                         placeholder="Mật khẩu"
//                         autoComplete="current-password"
//                         value={password}
//                         onChange={(e) => {
//                           setPassword(e.target.value);
//                           if (errors.password) setErrors({ ...errors, password: "" });
//                         }}
//                         invalid={!!errors.password}
//                         disabled={isLoading}
//                       />
//                     </CInputGroup>
//                     {errors.password && <div className="invalid-feedback d-block text-start">{errors.password}</div>}
//                   </div>

//                   <CRow>
//                     <CCol xs={6}>
//                       <CButton
//                         type="submit"
//                         color="primary"
//                         className="px-4"
//                         disabled={isLoading}
//                       >
//                         {isLoading ? <CSpinner size="sm" variant="grow" aria-hidden="true" /> : "Đăng nhập"}
//                       </CButton>
//                     </CCol>
//                     <CCol xs={6} className="text-end">
//                       <CButton
//                         color="link"
//                         className="px-0 text-decoration-none"
//                         onClick={() => navigate("/forgot-password")}
//                         disabled={isLoading}
//                       >
//                         Quên mật khẩu?
//                       </CButton>
//                     </CCol>
//                   </CRow>
//                 </CForm>
//               </CCol>

//               {/* Right: Info panel */}
//               <CCol
//                 md={6}
//                 className="login-right-card text-white d-flex flex-column justify-content-center align-items-center text-center p-5"
//                 style={{ backgroundColor: '#3c4b64' }} // Màu nền CoreUI dark
//               >
//                 <h2 className="fw-bold">Hệ thống POS Team</h2>
//                 <p className="my-3">
//                   Quản lý kho vận, thiết bị và phần mềm chuyên nghiệp.
//                   Đăng ký ngay nếu bạn chưa có tài khoản.
//                 </p>
//                 <Link to="/register">
//                   <CButton color="light" className="mt-3 fw-semibold" active tabIndex={-1}>
//                     Đăng ký ngay
//                   </CButton>
//                 </Link>
//               </CCol>
//             </CRow>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userServices";
import { UserContext } from "../../context/UserContext";
import { CButton, CForm, CFormInput, CSpinner } from "@coreui/react";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const { user, loginContext } = useContext(UserContext);

  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ login: "", password: "" });

  const validate = () => {
    let isValid = true;
    const newErrors = { login: "", password: "" };
    if (!valueLogin.trim()) {
      newErrors.login = "Nhập email hoặc tên đăng nhập";
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Nhập mật khẩu";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const response = await loginUser(valueLogin, password);
      if (response?.EC === 0) {
        const { jwt, ...userData } = response.DT;
        const userDataContext = { isAuthenticated: true, token: jwt, account: userData };
        localStorage.setItem("jwt", jwt);
        loginContext(userDataContext);
        navigate("/dhg");
        toast.success("Chào mừng bạn trở lại!");
      } else {
        toast.error(response?.EM || "Đăng nhập thất bại.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAuthenticated) navigate("/dhg");
  }, [user, navigate]);

  return (
    <div className="modern-login-page">
      <div className="login-glass-card">
        <div className="login-header">
          <h1 className="brand-title">Đại Hoàng Gia</h1>
          <p className="welcome-text">Đăng nhập vào hệ thống POS Team</p>
        </div>

        <CForm className="modern-form" onSubmit={handleLogin}>
          <div className="input-wrapper">
            <label>Tài khoản</label>
            <CFormInput
              className={`apple-input ${errors.login ? "error" : ""}`}
              placeholder="Email hoặc Username"
              value={valueLogin}
              onChange={(e) => {
                setValueLogin(e.target.value);
                if (errors.login) setErrors({ ...errors, login: "" });
              }}
              disabled={isLoading}
            />
            {errors.login && <span className="error-msg">{errors.login}</span>}
          </div>

          <div className="input-wrapper">
            <div className="label-group">
              <label>Mật khẩu</label>
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
            <CFormInput
              type="password"
              className={`apple-input ${errors.password ? "error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              disabled={isLoading}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <CButton type="submit" className="btn-modern-submit" disabled={isLoading}>
            {isLoading ? <CSpinner size="sm" /> : "Tiếp tục"}
          </CButton>
        </CForm>

        <div className="login-footer">
          <span>Bạn mới sử dụng hệ thống? </span>
          <Link to="/register">Tạo tài khoản ngay</Link>
        </div>
      </div>

      {/* Background Decor */}
      <div className="bg-blur-circle circle-1"></div>
      <div className="bg-blur-circle circle-2"></div>
    </div>
  );
};

export default Login;
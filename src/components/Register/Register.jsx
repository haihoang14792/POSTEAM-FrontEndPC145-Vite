// import React, { useState, useEffect, useContext } from "react";
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
// import { cilLockLocked, cilUser, cilEnvelopeClosed } from "@coreui/icons";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { registerNewUser } from "../../services/userServices";
// import { UserContext } from "../../context/UserContext";
// import "../Login/Login.scss";

// const Register = () => {
//   const { user } = useContext(UserContext);
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user && user.isAuthenticated) {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const isValidInputs = () => {
//     if (!email) {
//       toast.error("Vui lòng nhập email");
//       return false;
//     }
//     const regx = /\S+@\S+\.\S+/;
//     if (!regx.test(email)) {
//       toast.error("Email không hợp lệ");
//       return false;
//     }
//     if (!password) {
//       toast.error("Vui lòng nhập mật khẩu");
//       return false;
//     }
//     if (password !== confirmPassword) {
//       toast.error("Mật khẩu không khớp");
//       return false;
//     }
//     return true;
//   };

//   const handleRegister = async () => {
//     if (!isValidInputs()) return;
//     setIsLoading(true);
//     try {
//       const serverData = await registerNewUser(
//         email,
//         username,
//         password,
//         fullName
//       );
//       if (+serverData.EC === 0) {
//         toast.success(
//           "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
//         );
//         navigate("/login");
//       } else {
//         toast.error(serverData.EM);
//       }
//     } catch (error) {
//       toast.error("Lỗi trong quá trình đăng ký.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={10}>
//             <CRow className="g-0 card-wrapper shadow rounded overflow-hidden">
//               {/* Left: Form */}
//               <CCol md={6} className="login-left-card">
//                 <h1>Đăng ký tài khoản</h1>
//                 <p className="text-body-secondary">
//                   Tạo tài khoản mới để sử dụng hệ thống
//                 </p>
//                 <CForm>
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilEnvelopeClosed} />
//                     </CInputGroupText>
//                     <CFormInput
//                       placeholder="Email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       autoComplete="email"
//                     />
//                   </CInputGroup>

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput
//                       placeholder="Tên đăng nhập"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       autoComplete="username"
//                     />
//                   </CInputGroup>

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput
//                       placeholder="Họ và tên"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       autoComplete="name"
//                     />
//                   </CInputGroup>

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="password"
//                       placeholder="Mật khẩu"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       autoComplete="new-password"
//                     />
//                   </CInputGroup>

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="password"
//                       placeholder="Nhập lại mật khẩu"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       autoComplete="new-password"
//                     />
//                   </CInputGroup>

//                   <div className="d-grid">
//                     <CButton
//                       color="success"
//                       onClick={handleRegister}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? <CSpinner size="sm" /> : "Tạo tài khoản"}
//                     </CButton>
//                   </div>

//                   <hr />
//                   <div className="text-center">
//                     <CButton color="link" onClick={() => navigate("/login")}>
//                       Đã có tài khoản? Đăng nhập
//                     </CButton>
//                   </div>
//                 </CForm>
//               </CCol>

//               {/* Right: Info panel */}
//               <CCol
//                 md={6}
//                 className="login-right-card text-white d-flex flex-column justify-content-center align-items-center text-center"
//               >
//                 <h2>Chào mừng bạn!</h2>
//                 <p>
//                   Tham gia ngay để quản lý hệ thống nhanh chóng và hiệu quả hơn.
//                 </p>
//                 <CButton
//                   color="light"
//                   className="mt-3"
//                   onClick={() => navigate("/login")}
//                 >
//                   Quay lại đăng nhập
//                 </CButton>
//               </CCol>
//             </CRow>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default Register;


import React, { useState, useEffect, useContext } from "react";
import { CButton, CForm, CFormInput, CSpinner } from "@coreui/react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerNewUser } from "../../services/userServices";
import { UserContext } from "../../context/UserContext";
import "./Register.scss"; // Tạo file riêng hoặc dùng chung với Login

const Register = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.isAuthenticated) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidInputs = () => {
    const { email, password, confirmPassword, username } = formData;
    if (!email || !username || !password) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc");
      return false;
    }
    const regx = /\S+@\S+\.\S+/;
    if (!regx.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValidInputs()) return;

    setIsLoading(true);
    try {
      const serverData = await registerNewUser(
        formData.email,
        formData.username,
        formData.password,
        formData.fullName
      );
      if (+serverData.EC === 0) {
        toast.success("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
        navigate("/login");
      } else {
        toast.error(serverData.EM);
      }
    } catch (error) {
      toast.error("Lỗi trong quá trình đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-register-page">
      <div className="register-glass-card">
        <div className="register-header">
          <h1 className="brand-title">Đại Hoàng Gia</h1>
          <p className="welcome-text">Bắt đầu quản lý hệ thống chuyên nghiệp</p>
        </div>

        <CForm className="modern-form" onSubmit={handleRegister}>
          <div className="input-row">
            <div className="input-wrapper">
              <label>Họ và tên</label>
              <CFormInput
                name="fullName"
                className="apple-input"
                placeholder="Nguyễn Văn A"
                onChange={handleChange}
              />
            </div>
            <div className="input-wrapper">
              <label>Tên đăng nhập *</label>
              <CFormInput
                name="username"
                className="apple-input"
                placeholder="username123"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-wrapper">
            <label>Email *</label>
            <CFormInput
              name="email"
              type="email"
              className="apple-input"
              placeholder="name@example.com"
              onChange={handleChange}
            />
          </div>

          <div className="input-row">
            <div className="input-wrapper">
              <label>Mật khẩu *</label>
              <CFormInput
                name="password"
                type="password"
                className="apple-input"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
            <div className="input-wrapper">
              <label>Xác nhận *</label>
              <CFormInput
                name="confirmPassword"
                type="password"
                className="apple-input"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
          </div>

          <CButton type="submit" className="btn-modern-submit" disabled={isLoading}>
            {isLoading ? <CSpinner size="sm" /> : "Tạo tài khoản DHG"}
          </CButton>
        </CForm>

        <div className="register-footer">
          <span>Đã có tài khoản? </span>
          <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>

      {/* Background Decor tương tự Login */}
      <div className="bg-blur-circle circle-1"></div>
      <div className="bg-blur-circle circle-2"></div>
    </div>
  );
};

export default Register;
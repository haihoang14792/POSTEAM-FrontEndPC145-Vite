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
// import {
//   registerNewUser,
//   sendOtp,
//   verifyOtp,
// } from "../../services/userServices";
// import { UserContext } from "../../context/UserContext";
// import "../Login/Login.scss"; // dùng lại Login.scss để đồng bộ UI

// const Register = () => {
//   const { user } = useContext(UserContext);
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showOtpInput, setShowOtpInput] = useState(false);
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
//       const serverData = await registerNewUser(email, username, password);
//       if (+serverData.EC === 0) {
//         toast.success("Đăng ký thành công, kiểm tra OTP!");
//         await sendOtp(email);
//         setShowOtpInput(true);
//       } else {
//         toast.error(serverData.EM);
//       }
//     } catch (error) {
//       toast.error("Lỗi trong quá trình đăng ký.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       toast.error("Vui lòng nhập mã OTP!");
//       return;
//     }
//     try {
//       const verifyResponse = await verifyOtp(email, otp);
//       if (+verifyResponse.EC === 0) {
//         toast.success("Xác thực thành công! Vui lòng đăng nhập.");
//         navigate("/login");
//       } else {
//         toast.error(verifyResponse.EM);
//       }
//     } catch (error) {
//       toast.error("Lỗi khi xác thực OTP.");
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

//                   {showOtpInput && (
//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>OTP</CInputGroupText>
//                       <CFormInput
//                         placeholder="Nhập mã OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                       />
//                     </CInputGroup>
//                   )}

//                   <div className="d-grid">
//                     {!showOtpInput ? (
//                       <CButton
//                         color="success"
//                         onClick={handleRegister}
//                         disabled={isLoading}
//                       >
//                         {isLoading ? <CSpinner size="sm" /> : "Tạo tài khoản"}
//                       </CButton>
//                     ) : (
//                       <CButton color="primary" onClick={handleVerifyOtp}>
//                         Xác thực OTP
//                       </CButton>
//                     )}
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
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser, cilEnvelopeClosed } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerNewUser } from "../../services/userServices";
import { UserContext } from "../../context/UserContext";
import "../Login/Login.scss";

const Register = () => {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isAuthenticated) {
      navigate("/");
    }
  }, [user, navigate]);

  const isValidInputs = () => {
    if (!email) {
      toast.error("Vui lòng nhập email");
      return false;
    }
    const regx = /\S+@\S+\.\S+/;
    if (!regx.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!isValidInputs()) return;
    setIsLoading(true);
    try {
      const serverData = await registerNewUser(
        email,
        username,
        password,
        fullName
      );
      if (+serverData.EC === 0) {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
        );
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
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10}>
            <CRow className="g-0 card-wrapper shadow rounded overflow-hidden">
              {/* Left: Form */}
              <CCol md={6} className="login-left-card">
                <h1>Đăng ký tài khoản</h1>
                <p className="text-body-secondary">
                  Tạo tài khoản mới để sử dụng hệ thống
                </p>
                <CForm>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Họ và tên"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton
                      color="success"
                      onClick={handleRegister}
                      disabled={isLoading}
                    >
                      {isLoading ? <CSpinner size="sm" /> : "Tạo tài khoản"}
                    </CButton>
                  </div>

                  <hr />
                  <div className="text-center">
                    <CButton color="link" onClick={() => navigate("/login")}>
                      Đã có tài khoản? Đăng nhập
                    </CButton>
                  </div>
                </CForm>
              </CCol>

              {/* Right: Info panel */}
              <CCol
                md={6}
                className="login-right-card text-white d-flex flex-column justify-content-center align-items-center text-center"
              >
                <h2>Chào mừng bạn!</h2>
                <p>
                  Tham gia ngay để quản lý hệ thống nhanh chóng và hiệu quả hơn.
                </p>
                <CButton
                  color="light"
                  className="mt-3"
                  onClick={() => navigate("/login")}
                >
                  Quay lại đăng nhập
                </CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;

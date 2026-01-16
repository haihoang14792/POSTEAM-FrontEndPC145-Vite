// import React, { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { resetPassword } from "../../services/userServices";
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CRow,
//   CSpinner,
// } from "@coreui/react";
// import "./Login.scss";

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("code"); // ⚠️ Strapi gửi param là "code", không phải "token"
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleReset = async () => {
//     if (!password.trim() || !confirmPassword.trim()) {
//       toast.error("Vui lòng nhập đầy đủ mật khẩu mới");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Mật khẩu nhập lại không khớp");
//       return;
//     }

//     if (!token) {
//       toast.error(
//         "Thiếu mã xác thực, vui lòng kiểm tra lại link reset mật khẩu."
//       );
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const res = await resetPassword(token, password);
//       if (res?.EC === 0) {
//         toast.success("Đặt lại mật khẩu thành công, vui lòng đăng nhập");
//         navigate("/login");
//       } else {
//         toast.error(res?.EM || "Token không hợp lệ hoặc hết hạn");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Lỗi hệ thống khi reset mật khẩu");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={6}>
//             <CCard className="p-4">
//               <CCardBody>
//                 <h1>Đặt lại mật khẩu</h1>
//                 <p className="text-body-secondary">Nhập mật khẩu mới của bạn</p>
//                 <CForm
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleReset();
//                   }}
//                 >
//                   <CFormInput
//                     type="password"
//                     placeholder="Mật khẩu mới"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     autoComplete="new-password"
//                     className="mb-3"
//                   />

//                   <CFormInput
//                     type="password"
//                     placeholder="Nhập lại mật khẩu mới"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     autoComplete="new-password"
//                     className="mb-3"
//                   />

//                   <CButton type="submit" color="primary" disabled={isLoading}>
//                     {isLoading ? <CSpinner size="sm" /> : "Đặt lại mật khẩu"}
//                   </CButton>
//                 </CForm>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/userServices";

import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CSpinner,
} from "@coreui/react";
import "./Login.scss";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("code"); // Strapi gửi param là "code"
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu mới");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }
    if (!token) {
      toast.error(
        "Thiếu mã xác thực, vui lòng kiểm tra lại link reset mật khẩu."
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(token, password);
      if (res?.EC === 0) {
        toast.success("Đặt lại mật khẩu thành công, vui lòng đăng nhập");
        navigate("/login");
      } else {
        toast.error(res?.EM || "Token không hợp lệ hoặc hết hạn");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi hệ thống khi reset mật khẩu");
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
              {/* Left: Reset Password Form */}
              <CCol md={6} className="login-left-card">
                <h1>Đặt lại mật khẩu</h1>
                <p className="text-body-secondary">Nhập mật khẩu mới của bạn</p>

                <CForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReset();
                  }}
                >
                  <CFormInput
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="mb-3"
                  />

                  <CFormInput
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="mb-3"
                  />

                  <CRow>
                    <CCol xs={6}>
                      <CButton
                        type="submit"
                        color="primary"
                        className="px-4"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CSpinner size="sm" />
                        ) : (
                          "Đặt lại mật khẩu"
                        )}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-end">
                      <Link to="/login">
                        <CButton color="link" className="px-0">
                          Quay lại đăng nhập
                        </CButton>
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCol>

              {/* Right: Info */}
              <CCol
                md={6}
                className="login-right-card text-white d-flex flex-column justify-content-center align-items-center text-center"
              >
                <h2>Quên mật khẩu?</h2>
                <p>
                  Nhập mật khẩu mới để bảo vệ tài khoản của bạn. Nếu gặp sự cố,
                  hãy liên hệ admin để được hỗ trợ.
                </p>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetPassword;

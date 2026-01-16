import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/userServices";

import {
  CButton,
  CCard,
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
import { cilEnvelopeClosed } from "@coreui/icons";
import "./Login.scss"; // dùng lại css của login để giữ giao diện đồng bộ

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Vui lòng nhập email của bạn");
      return;
    }
    setIsLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res?.EC === 0) {
        toast.success(res.EM || "Vui lòng kiểm tra email để đặt lại mật khẩu.");
        navigate("/login");
      } else {
        toast.error(res.EM || "Không thể gửi email reset mật khẩu.");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống, vui lòng thử lại sau.");
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
              {/* Left: Forgot Password form */}
              <CCol md={6} className="login-left-card">
                <h1>Quên mật khẩu</h1>
                <p className="text-body-secondary">
                  Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu
                </p>

                <CForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                  }}
                >
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Nhập email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={6}>
                      <CButton
                        type="submit"
                        color="primary"
                        className="px-4"
                        disabled={isLoading}
                      >
                        {isLoading ? <CSpinner size="sm" /> : "Gửi yêu cầu"}
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
                <h2>Bạn quên mật khẩu?</h2>
                <p>
                  Đừng lo, chúng tôi sẽ gửi hướng dẫn để bạn có thể đặt lại mật khẩu.
                </p>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ForgotPassword;

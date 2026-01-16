import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userServices";
import { UserContext } from "../../context/UserContext";

import {
  CButton,
  CCard,
  CCardBody,
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
import { cilLockLocked, cilUser } from "@coreui/icons";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const { user, loginContext } = useContext(UserContext);
  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [objValidInput, setObjValidInput] = useState({
    isValidValueLogin: true,
    isValidPassword: true,
  });

  const handleLogin = async () => {
    setObjValidInput({ isValidValueLogin: true, isValidPassword: true });

    if (!valueLogin.trim()) {
      setObjValidInput((prev) => ({ ...prev, isValidValueLogin: false }));
      toast.error("Vui lòng nhập email hoặc tên đăng nhập");
      return;
    }

    if (!password.trim()) {
      setObjValidInput((prev) => ({ ...prev, isValidPassword: false }));
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(valueLogin, password);

      if (response?.EC === 0) {
        const { jwt, ...userData } = response.DT;
        if (!userData.username) {
          toast.error("Thiếu tên đăng nhập.");
          return;
        }

        const userDataContext = {
          isAuthenticated: true,
          token: jwt,
          account: userData,
        };

        localStorage.setItem("jwt", jwt);
        loginContext(userDataContext);
        navigate("/dhg");
      } else {
        // Kiểm tra nội dung thông báo lỗi từ server
        const errorMessage = response?.EM?.toLowerCase();
        if (
          errorMessage?.includes("invalid") ||
          errorMessage?.includes("unauthorized")
        ) {
          toast.error("Thông tin đăng nhập không chính xác.");
        } else {
          toast.error(response?.EM || "Đăng nhập thất bại.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã xảy ra lỗi khi đăng nhập.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate("/dhg");
    }
  }, [user, navigate]);

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10}>
            <CRow className="g-0 card-wrapper shadow rounded overflow-hidden">
              {/* Left: Login form */}
              <CCol md={6} className="login-left-card">
                <h1>Đăng nhập hệ thống</h1>
                <p className="text-body-secondary">
                  Nhập thông tin tài khoản để truy cập
                </p>
                {/* <CForm onSubmit={(e) => e.preventDefault()}> */}
                <CForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Tên đăng nhập hoặc email"
                      autoComplete="username"
                      value={valueLogin}
                      onChange={(e) => setValueLogin(e.target.value)}
                      className={
                        objValidInput.isValidValueLogin ? "" : "is-invalid"
                      }
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Mật khẩu"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={
                        objValidInput.isValidPassword ? "" : "is-invalid"
                      }
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={6}>
                      {/* <CButton
                                                color="primary"
                                                className="px-4"
                                                onClick={handleLogin}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? <CSpinner size="sm" /> : "Đăng nhập"}
                                            </CButton> */}
                      <CButton
                        type="submit"
                        color="primary"
                        className="px-4"
                        disabled={isLoading}
                      >
                        {isLoading ? <CSpinner size="sm" /> : "Đăng nhập"}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-end">
                      <CButton
                        color="link"
                        className="px-0"
                        onClick={() => navigate("/forgot-password")}
                      >
                        Quên mật khẩu?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCol>

              {/* Right: Welcome or register info */}
              <CCol
                md={6}
                className="login-right-card text-white d-flex flex-column justify-content-center align-items-center text-center"
              >
                <h2>Chào mừng bạn trở lại!</h2>
                <p>
                  Hệ thống quản lý thiết bị & phần mềm dành cho nhà hàng và cửa
                  hàng tiện lợi.
                </p>
                <Link to="/register">
                  <CButton color="light" className="mt-3" active tabIndex={-1}>
                    Đăng ký ngay
                  </CButton>
                </Link>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;

import React from "react";
import NavHeader from "../components/Navigation/NavHeader";
import { AppFooter } from "../components/index";
import AppRoutes from "../routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserLayout.scss";
import { useNoColorMode } from "../context/NoColorModeContext"; // Import useNoColorMode

const UserLayout = () => {
  useNoColorMode(); // Sử dụng useNoColorMode để đảm bảo không có lỗi

  return (
    <div>
      <div className="app-header">
        <NavHeader />
      </div>
      <div className="app-container">
        <AppRoutes />
      </div>
      <AppFooter />
    </div>
  );
};

export default UserLayout;

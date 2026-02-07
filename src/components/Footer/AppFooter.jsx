import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import packageJson from '../../../package.json';
import "./AppFooter.scss"; // Tạo file SCSS riêng để đồng bộ

const version = import.meta.env.VITE_APP_VERSION || packageJson.version;

const AppFooter = () => {
  return (
    <footer className="apple-footer">
      <div className="footer-container">
        {/* Section 1: Brand & Social */}
        <div className="footer-top">
          <div className="brand-info">
            <span className="brand-name">Đại Hoàng Gia</span>
            <p className="brand-tagline">Công nghệ Toshiba cho tương lai bán lẻ.</p>
          </div>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Section 2: Contact Info */}
        <div className="footer-content">
          <div className="info-block">
            <h4>Địa chỉ văn phòng</h4>
            <p>2F, HALO Building, 677/7 Điện Biên Phủ, Phường Thạnh Mỹ Tây, TP. Hồ Chí Minh</p>
          </div>
          <div className="info-block">
            <h4>Kết nối với chúng tôi</h4>
            <p>Email: admin@toshibtec.com.vn</p>
            <p>Điện thoại: 1800 588810 (Phím 0)</p>
          </div>
          <div className="info-block version-block">
            <h4>Hệ thống</h4>
            <p>Phiên bản phần mềm: {version}</p>
            <p>© 2025 POSTEAM DHG</p>
          </div>
        </div>

        {/* Section 3: Legal Notes */}
        <div className="footer-bottom">
          <p>Copyright © 2025 Dai Hoang Gia Co., Ltd. Bảo lưu mọi quyền.</p>
          <div className="legal-links">
            <Link to="/policy">Chính sách bảo mật</Link>
            <Link to="/terms">Điều khoản sử dụng</Link>
            <Link to="/map">Sơ đồ trang web</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(AppFooter);
// import React, { useEffect, useRef, useState } from "react";
// import { NavLink, Link } from "react-router-dom";
// import { CContainer, CHeader, useColorModes } from "@coreui/react";
// import CIcon from "@coreui/icons-react";
// import { cilSun, cilMoon, cilContrast, cilMenu, cilX } from "@coreui/icons";
// import { NavDropdown } from "react-bootstrap";
// import logo from '../../logo.jpg';
// import AppHeaderDropdown from "./AppHeaderDropdown";
// import navigation from "../../_nav";
// import "./AppHeader.scss";

// const AppHeader = () => {
//   const headerRef = useRef();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const { colorMode, setColorMode } = useColorModes("coreui-free-react-admin-template-theme");

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 5);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const closeMobileMenu = () => setMobileMenuOpen(false);

//   const renderThemeIcon = () => {
//     if (colorMode === "dark") return <CIcon icon={cilMoon} />;
//     if (colorMode === "auto") return <CIcon icon={cilContrast} />;
//     return <CIcon icon={cilSun} />;
//   };

//   const renderNavItems = (items) =>
//     items.map((item, index) => {
//       if (item.items) {
//         return (
//           <NavDropdown
//             title={item.name}
//             id={`nav-drop-${index}`}
//             key={index}
//             className="apple-menu-item"
//           >
//             {item.items.map((subItem, subIndex) => (
//               <NavDropdown.Item
//                 as={Link}
//                 to={subItem.to}
//                 key={subIndex}
//                 className="apple-dropdown-item"
//                 onClick={closeMobileMenu}
//               >
//                 {subItem.icon && <span className="sub-icon-wrap">{subItem.icon}</span>}
//                 <span>{subItem.name}</span>
//               </NavDropdown.Item>
//             ))}
//           </NavDropdown>
//         );
//       }
//       return (
//         <NavLink
//           key={index}
//           to={item.to}
//           className={({ isActive }) => `apple-menu-item nav-link ${isActive ? "active" : ""}`}
//           onClick={closeMobileMenu}
//         >
//           {item.name}
//         </NavLink>
//       );
//     });

//   return (
//     <CHeader
//       position="sticky"
//       ref={headerRef}
//       className={`apple-header-master ${isScrolled ? "is-scrolled" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}
//     >
//       <CContainer fluid className="header-wrapper">
//         {/* Chỉ hiện trên Mobile */}
//         <div className="mobile-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//           <CIcon icon={mobileMenuOpen ? cilX : cilMenu} size="lg" />
//         </div>

//         {/* Logo */}
//         <NavLink to="/" className="apple-brand" onClick={closeMobileMenu}>
//           <img src={logo} className="logo-img" alt="DHG Logo" />
//           <span className="brand-name">POSTEAM</span>
//         </NavLink>

//         {/* Menu chính */}
//         <nav className={`apple-nav-group ${mobileMenuOpen ? "active-mobile" : ""}`}>
//           {renderNavItems(navigation)}
//         </nav>

//         {/* Hành động bên phải */}
//         <div className="apple-ctrl-group">
//           <div className="theme-btn" onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}>
//             {renderThemeIcon()}
//           </div>
//           <div className="divider-v" />
//           <AppHeaderDropdown />
//         </div>
//       </CContainer>
//     </CHeader>
//   );
// };

// export default React.memo(AppHeader);



import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { CContainer, CHeader, useColorModes } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSun, cilMoon, cilContrast, cilMenu, cilX } from "@coreui/icons";
import { NavDropdown } from "react-bootstrap";
import logo from '../../logo.jpg';
import AppHeaderDropdown from "./AppHeaderDropdown";
import navigation from "../../_nav";
import "./AppHeader.scss";

const AppHeader = () => {
  const headerRef = useRef();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { colorMode, setColorMode } = useColorModes("coreui-free-react-admin-template-theme");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const renderThemeIcon = () => {
    if (colorMode === "dark") return <CIcon icon={cilMoon} />;
    if (colorMode === "auto") return <CIcon icon={cilContrast} />;
    return <CIcon icon={cilSun} />;
  };

  const renderNavItems = (items) =>
    items.map((item, index) => {
      if (item.items) {
        return (
          <NavDropdown
            title={item.name}
            id={`nav-drop-${index}`}
            key={index}
            className="apple-menu-item"
          >
            {item.items.map((subItem, subIndex) => (
              <NavDropdown.Item
                as={Link}
                to={subItem.to}
                key={subIndex}
                className="apple-dropdown-item"
                onClick={closeMobileMenu}
              >
                {/* Bọc icon vào class sub-icon-wrap để fix kích thước */}
                {subItem.icon && <span className="sub-icon-wrap">{subItem.icon}</span>}
                <span>{subItem.name}</span>
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        );
      }
      return (
        <NavLink
          key={index}
          to={item.to}
          className={({ isActive }) => `apple-menu-item nav-link ${isActive ? "active" : ""}`}
          onClick={closeMobileMenu}
        >
          {item.name}
        </NavLink>
      );
    });

  return (
    <CHeader
      position="sticky"
      ref={headerRef}
      className={`apple-header-master tet-theme ${isScrolled ? "is-scrolled" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}
    >
      {/* Container chính (Logo + Menu + Ctrl) */}
      <CContainer fluid className="header-wrapper">
        <div className="mobile-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <CIcon icon={mobileMenuOpen ? cilX : cilMenu} size="lg" />
        </div>

        <NavLink to="/" className="apple-brand" onClick={closeMobileMenu}>
          <img src={logo} className="logo-img" alt="DHG Logo" />
          <span className="brand-name">POSTEAM</span>
        </NavLink>

        <nav className={`apple-nav-group ${mobileMenuOpen ? "active-mobile" : ""}`}>
          {renderNavItems(navigation)}
        </nav>

        <div className="apple-ctrl-group">
          <div className="theme-btn" onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}>
            {renderThemeIcon()}
          </div>
          <div className="divider-v" />
          <AppHeaderDropdown />
        </div>
      </CContainer>

      {/* Dòng chữ chạy nằm ở đáy của Header */}
      <div className="tet-marquee-bottom d-none d-lg-flex">
        <div className="tet-marquee-text">
          <span>Chúc Mừng Năm Mới 2026 - Vạn Sự Như Ý - An Khang Thịnh Vượng - Happy New Year 2026 - 祝您2026年新年快乐！🧧</span>
          <span>Chúc Mừng Năm Mới 2026 - Vạn Sự Như Ý - An Khang Thịnh Vượng - Happy New Year 2026 - 祝您2026年新年快乐！🧧</span>
          <span>Chúc Mừng Năm Mới 2026 - Vạn Sự Như Ý - An Khang Thịnh Vượng - Happy New Year 2026 - 祝您2026年新年快乐！🧧</span>
          <span>Chúc Mừng Năm Mới 2026 - Vạn Sự Như Ý - An Khang Thịnh Vượng - Happy New Year 2026 - 祝您2026年新年快乐！🧧</span>
          <span>Chúc Mừng Năm Mới 2026 - Vạn Sự Như Ý - An Khang Thịnh Vượng - Happy New Year 2026 - 祝您2026年新年快乐！🧧</span>

        </div>
      </div>
    </CHeader>
  );
};

export default React.memo(AppHeader);
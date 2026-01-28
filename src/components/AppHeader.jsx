// import React, { useEffect, useRef, useState } from 'react'
// import { NavLink, useLocation } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import {
//   CContainer,
//   CHeader,
//   CHeaderNav,
//   CHeaderToggler,
//   CNavLink,
//   CNavItem,
//   useColorModes,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilBell,
//   cilContrast,
//   cilEnvelopeOpen,
//   cilList,
//   cilMenu,
//   cilMoon,
//   cilSun,
// } from '@coreui/icons'

// import AppBreadcrumb from './AppBreadcrumb'
// import AppHeaderDropdown from './header/AppHeaderDropdown'
// import navigation from '../_nav'

// // Bootstrap Dropdown
// import Nav from 'react-bootstrap/Nav'
// import NavDropdown from 'react-bootstrap/NavDropdown'
// import './AppHeader.scss'

// const AppHeader = () => {
//   const headerRef = useRef()
//   const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
//   const dispatch = useDispatch()
//   const sidebarShow = useSelector((state) => state.sidebarShow)
//   const location = useLocation()

//   const [currentGroupName, setCurrentGroupName] = useState('Dashboard')
//   const [currentItemName, setCurrentItemName] = useState('')

//   // Shadow khi scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       if (headerRef.current) {
//         headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
//       }
//     }
//     document.addEventListener('scroll', handleScroll)
//     return () => document.removeEventListener('scroll', handleScroll)
//   }, [])

//   // Theme icon
//   const renderThemeIcon = () => {
//     if (colorMode === 'dark') return <CIcon icon={cilMoon} size="lg" />
//     if (colorMode === 'auto') return <CIcon icon={cilContrast} size="lg" />
//     return <CIcon icon={cilSun} size="lg" />
//   }

//   // Lấy group + item con theo route
//   const getBreadcrumbNameByPath = (pathname) => {
//     for (let group of navigation) {
//       if (group.items) {
//         for (let item of group.items) {
//           if (item.to === pathname) {
//             return { groupName: group.name, itemName: item.name }
//           }
//         }
//       } else if (group.to === pathname) {
//         return { groupName: group.name, itemName: '' }
//       }
//     }
//     return { groupName: 'Dashboard', itemName: '' }
//   }

//   // Update tên group và item khi route thay đổi
//   useEffect(() => {
//     const { groupName, itemName } = getBreadcrumbNameByPath(location.pathname)
//     setCurrentGroupName(groupName)
//     setCurrentItemName(itemName)
//   }, [location.pathname])

//   return (
//     <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//       <CContainer className="border-bottom px-4 d-flex align-items-center" fluid>
//         <CHeaderToggler
//           onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//           style={{ marginInlineStart: '-14px' }}
//         >
//           <CIcon icon={cilMenu} size="lg" />
//         </CHeaderToggler>

//         {/* Tên Group + Item + Breadcrumb */}
//         <div className="d-flex align-items-center flex-grow-1 ms-3">
//           <div className="fw-bold fs-5 text-primary me-2">{currentGroupName}</div>
//           {currentItemName && <div className="fs-6 text-secondary me-3">/ {currentItemName}</div>}
//           <AppBreadcrumb />
//         </div>

//         {/* Icon thông báo */}
//         <CHeaderNav className="ms-auto d-flex align-items-center">
//           <CNavItem>
//             <CNavLink href="#">
//               <CIcon icon={cilBell} size="lg" />
//             </CNavLink>
//           </CNavItem>
//           <CNavItem>
//             <CNavLink href="#">
//               <CIcon icon={cilList} size="lg" />
//             </CNavLink>
//           </CNavItem>
//           <CNavItem>
//             <CNavLink href="#">
//               <CIcon icon={cilEnvelopeOpen} size="lg" />
//             </CNavLink>
//           </CNavItem>

//           <li className="nav-item py-1">
//             <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//           </li>

//           {/* Theme Mode Dropdown */}
//           <Nav>
//             <NavDropdown
//               title={renderThemeIcon()}
//               id="theme-mode-dropdown"
//               align="end"
//               className="no-caret"
//             >
//               <NavDropdown.Item active={colorMode === 'light'} onClick={() => setColorMode('light')}>
//                 <CIcon className="me-2" icon={cilSun} size="lg" /> Light
//               </NavDropdown.Item>
//               <NavDropdown.Item active={colorMode === 'dark'} onClick={() => setColorMode('dark')}>
//                 <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
//               </NavDropdown.Item>
//               <NavDropdown.Item active={colorMode === 'auto'} onClick={() => setColorMode('auto')}>
//                 <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
//               </NavDropdown.Item>
//             </NavDropdown>
//           </Nav>

//           <li className="nav-item py-1">
//             <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//           </li>

//           {/* User Dropdown */}
//           <AppHeaderDropdown />
//         </CHeaderNav>
//       </CContainer>
//     </CHeader>
//   )
// }

// export default React.memo(AppHeader)


import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
  CInputGroup,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
  cilSearch,
} from '@coreui/icons'

import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdown from './header/AppHeaderDropdown'
import navigation from '../_nav'

// Bootstrap Dropdown
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import './AppHeader.scss'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const location = useLocation()

  const [currentGroupName, setCurrentGroupName] = useState('Dashboard')
  const [isScrolled, setIsScrolled] = useState(false)

  // Xử lý hiệu ứng scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(document.documentElement.scrollTop > 10)
    }
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  // Logic lấy tên Group (giữ nguyên logic của bạn)
  const getBreadcrumbNameByPath = (pathname) => {
    for (let group of navigation) {
      if (group.items) {
        for (let item of group.items) {
          if (item.to === pathname) {
            return { groupName: group.name }
          }
        }
      } else if (group.to === pathname) {
        return { groupName: group.name }
      }
    }
    return { groupName: 'Dashboard' }
  }

  useEffect(() => {
    const { groupName } = getBreadcrumbNameByPath(location.pathname)
    setCurrentGroupName(groupName)
  }, [location.pathname])

  const renderThemeIcon = () => {
    if (colorMode === 'dark') return <CIcon icon={cilMoon} size="lg" />
    if (colorMode === 'auto') return <CIcon icon={cilContrast} size="lg" />
    return <CIcon icon={cilSun} size="lg" />
  }

  return (
    <CHeader
      position="sticky"
      className={`mb-4 p-0 app-header-modern ${isScrolled ? 'header-scrolled' : ''}`}
      ref={headerRef}
    >
      <CContainer fluid className="d-flex align-items-center px-4 h-100">
        {/* 1. Toggle Sidebar */}
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
          className="text-secondary"
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        {/* 2. Tiêu đề & Breadcrumb */}
        <div className="d-none d-md-flex flex-column ms-3 justify-content-center">
          <div className="fw-bold text-dark" style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>
            {currentGroupName}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>
            <AppBreadcrumb />
          </div>
        </div>

        {/* 3. Thanh tìm kiếm (Global Search) */}
        <div className="d-none d-lg-block ms-auto me-4" style={{ width: '250px' }}>
          <CInputGroup>
            <span className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted z-1">
              <CIcon icon={cilSearch} size="sm" />
            </span>
            <CFormInput
              placeholder="Tìm kiếm..."
              className="header-search-input ps-5"
              style={{ fontSize: '0.9rem' }}
            />
          </CInputGroup>
        </div>

        {/* 4. Action Icons & User Area */}
        <CHeaderNav className={`ms-auto ms-lg-0 d-flex align-items-center`}>

          {/* Icons Group */}
          <div className="d-flex align-items-center gap-1">
            <div className="header-action-item" title="Thông báo">
              <CIcon icon={cilBell} size="lg" />
              <span className="notification-badge"></span>
            </div>
            <div className="header-action-item" title="Danh sách">
              <CIcon icon={cilList} size="lg" />
            </div>
            <div className="header-action-item" title="Tin nhắn">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
              <span className="notification-badge"></span>
            </div>
          </div>

          <div className="header-divider"></div>

          {/* Theme Switcher */}
          <Nav>
            <NavDropdown
              title={<div className="header-action-item">{renderThemeIcon()}</div>}
              id="theme-mode-dropdown"
              align="end"
              className="no-caret"
            >
              <NavDropdown.Item active={colorMode === 'light'} onClick={() => setColorMode('light')}>
                <CIcon className="me-2" icon={cilSun} /> Light
              </NavDropdown.Item>
              <NavDropdown.Item active={colorMode === 'dark'} onClick={() => setColorMode('dark')}>
                <CIcon className="me-2" icon={cilMoon} /> Dark
              </NavDropdown.Item>
              <NavDropdown.Item active={colorMode === 'auto'} onClick={() => setColorMode('auto')}>
                <CIcon className="me-2" icon={cilContrast} /> Auto
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="header-divider"></div>

          {/* User Profile */}
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default React.memo(AppHeader)
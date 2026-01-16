// import React, { useEffect, useRef } from 'react'
// import { NavLink } from 'react-router-dom'
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

// import { AppBreadcrumb } from './index'
// import { AppHeaderDropdown } from './header/index'

// // 👉 Import Bootstrap Dropdown
// import Nav from 'react-bootstrap/Nav'
// import NavDropdown from 'react-bootstrap/NavDropdown'
// import './AppHeader.scss';

// const AppHeader = () => {
//   const headerRef = useRef()
//   const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

//   const dispatch = useDispatch()
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   useEffect(() => {
//     document.addEventListener('scroll', () => {
//       if (headerRef.current) {
//         headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
//       }
//     })
//   }, [])

//   const renderThemeIcon = () => {
//     if (colorMode === 'dark') return <CIcon icon={cilMoon} size="lg" />
//     if (colorMode === 'auto') return <CIcon icon={cilContrast} size="lg" />
//     return <CIcon icon={cilSun} size="lg" />
//   }

//   return (
//     <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//       <CContainer className="border-bottom px-4" fluid>
//         <CHeaderToggler
//           onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//           style={{ marginInlineStart: '-14px' }}
//         >
//           <CIcon icon={cilMenu} size="lg" />
//         </CHeaderToggler>

//         <CHeaderNav className="d-none d-md-flex">
//           <CNavItem>
//             <CNavLink to="/dhg/dashboard" as={NavLink}>
//               Dashboard
//             </CNavLink>
//           </CNavItem>
//           <CNavItem>
//             <CNavLink href="#">Users</CNavLink>
//           </CNavItem>
//           <CNavItem>
//             <CNavLink href="#">Settings</CNavLink>
//           </CNavItem>
//         </CHeaderNav>

//         <CHeaderNav className="ms-auto">
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
//         </CHeaderNav>

//         <CHeaderNav>
//           <li className="nav-item py-1">
//             <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//           </li>

//           {/* Replace CDropdown with Bootstrap NavDropdown */}
//           <Nav>
//             <NavDropdown
//               title={renderThemeIcon()}
//               id="theme-mode-dropdown"
//               align="end"
//               className="no-caret"
//             >
//               <NavDropdown.Item
//                 active={colorMode === 'light'}
//                 onClick={() => setColorMode('light')}
//               >
//                 <CIcon className="me-2" icon={cilSun} size="lg" /> Light
//               </NavDropdown.Item>
//               <NavDropdown.Item
//                 active={colorMode === 'dark'}
//                 onClick={() => setColorMode('dark')}
//               >
//                 <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
//               </NavDropdown.Item>
//               <NavDropdown.Item
//                 active={colorMode === 'auto'}
//                 onClick={() => setColorMode('auto')}
//               >
//                 <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
//               </NavDropdown.Item>
//             </NavDropdown>
//           </Nav>

//           <li className="nav-item py-1">
//             <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//           </li>

//           <AppHeaderDropdown />
//         </CHeaderNav>
//       </CContainer>

//       {/* Breadcrumb nếu cần */}
//       {/* <CContainer className="px-4" fluid>
//         <AppBreadcrumb />
//       </CContainer> */}
//     </CHeader>
//   )
// }

// export default AppHeader


// import React, { useEffect, useRef } from 'react'
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

// // ✅ Import từ index
// import { AppBreadcrumb } from './index'
// import { AppHeaderDropdown } from './header/index'

// // Bootstrap dropdown
// import Nav from 'react-bootstrap/Nav'
// import NavDropdown from 'react-bootstrap/NavDropdown'
// import './AppHeader.scss'

// const AppHeader = () => {
//   const headerRef = useRef()
//   const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
//   const dispatch = useDispatch()
//   const sidebarShow = useSelector((state) => state.sidebarShow)
//   const location = useLocation()

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       if (headerRef.current) {
//         headerRef.current.classList.toggle('shadow-sm', window.scrollY > 0)
//         headerRef.current.style.transition = 'background 0.3s ease'
//         headerRef.current.style.background = window.scrollY > 0 ? 'rgba(255,255,255,0.95)' : 'transparent'
//       }
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const renderThemeIcon = () => {
//     if (colorMode === 'dark') return <CIcon icon={cilMoon} size="lg" />
//     if (colorMode === 'auto') return <CIcon icon={cilContrast} size="lg" />
//     return <CIcon icon={cilSun} size="lg" />
//   }

//   const actionIconStyle = {
//     transition: 'all 0.2s ease-in-out',
//     cursor: 'pointer',
//     color: '#555',
//   }

//   return (
//     <CHeader position="sticky" className="p-0" ref={headerRef}>
//       <CContainer fluid className="d-flex align-items-center justify-content-between px-4 py-2">
//         {/* Sidebar toggler */}
//         <CHeaderToggler onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}>
//           <CIcon icon={cilMenu} size="lg" />
//         </CHeaderToggler>

//         {/* Breadcrumb */}
//         <div className="d-flex align-items-center flex-grow-1 ms-3">
//           <AppBreadcrumb />
//         </div>

//         {/* Action icons */}
//         <CHeaderNav className="d-flex align-items-center gap-3">
//           {[cilBell, cilList, cilEnvelopeOpen].map((icon, idx) => (
//             <CNavItem key={idx}>
//               <CNavLink
//                 href="#"
//                 style={actionIconStyle}
//                 onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD700')}
//                 onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
//               >
//                 <CIcon icon={icon} size="lg" />
//               </CNavLink>
//             </CNavItem>
//           ))}

//           {/* Divider */}
//           <div className="vr h-100 mx-2 text-body text-opacity-50"></div>

//           {/* Theme mode dropdown */}
//           <Nav>
//             <NavDropdown
//               title={renderThemeIcon()}
//               id="theme-mode-dropdown"
//               align="end"
//               className="no-caret"
//             >
//               <NavDropdown.Item active={colorMode === 'light'} onClick={() => setColorMode('light')}>
//                 <CIcon className="me-2" icon={cilSun} /> Light
//               </NavDropdown.Item>
//               <NavDropdown.Item active={colorMode === 'dark'} onClick={() => setColorMode('dark')}>
//                 <CIcon className="me-2" icon={cilMoon} /> Dark
//               </NavDropdown.Item>
//               <NavDropdown.Item active={colorMode === 'auto'} onClick={() => setColorMode('auto')}>
//                 <CIcon className="me-2" icon={cilContrast} /> Auto
//               </NavDropdown.Item>
//             </NavDropdown>
//           </Nav>

//           {/* Divider */}
//           <div className="vr h-100 mx-2 text-body text-opacity-50"></div>

//           {/* User dropdown */}
//           <AppHeaderDropdown />
//         </CHeaderNav>
//       </CContainer>
//     </CHeader>
//   )
// }

// export default React.memo(AppHeader)


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

//   // Lấy tên group theo route
//   const getGroupNameByPath = (pathname) => {
//     for (let item of navigation) {
//       if (item.items) {
//         for (let sub of item.items) {
//           if (sub.to === pathname) return item.name
//         }
//       } else if (item.to === pathname) {
//         return item.name
//       }
//     }
//     return 'Dashboard'
//   }

//   // Update tên group khi route thay đổi
//   useEffect(() => {
//     const groupName = getGroupNameByPath(location.pathname)
//     setCurrentGroupName(groupName)
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

//         {/* Tên Group + Breadcrumb */}
//         <div className="d-flex align-items-center flex-grow-1 ms-3">
//           <div className="fw-bold fs-5 text-primary me-3">{currentGroupName}</div>
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
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
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
  const [currentItemName, setCurrentItemName] = useState('')

  // Shadow khi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    }
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  // Theme icon
  const renderThemeIcon = () => {
    if (colorMode === 'dark') return <CIcon icon={cilMoon} size="lg" />
    if (colorMode === 'auto') return <CIcon icon={cilContrast} size="lg" />
    return <CIcon icon={cilSun} size="lg" />
  }

  // Lấy group + item con theo route
  const getBreadcrumbNameByPath = (pathname) => {
    for (let group of navigation) {
      if (group.items) {
        for (let item of group.items) {
          if (item.to === pathname) {
            return { groupName: group.name, itemName: item.name }
          }
        }
      } else if (group.to === pathname) {
        return { groupName: group.name, itemName: '' }
      }
    }
    return { groupName: 'Dashboard', itemName: '' }
  }

  // Update tên group và item khi route thay đổi
  useEffect(() => {
    const { groupName, itemName } = getBreadcrumbNameByPath(location.pathname)
    setCurrentGroupName(groupName)
    setCurrentItemName(itemName)
  }, [location.pathname])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4 d-flex align-items-center" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        {/* Tên Group + Item + Breadcrumb */}
        <div className="d-flex align-items-center flex-grow-1 ms-3">
          <div className="fw-bold fs-5 text-primary me-2">{currentGroupName}</div>
          {currentItemName && <div className="fs-6 text-secondary me-3">/ {currentItemName}</div>}
          <AppBreadcrumb />
        </div>

        {/* Icon thông báo */}
        <CHeaderNav className="ms-auto d-flex align-items-center">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          {/* Theme Mode Dropdown */}
          <Nav>
            <NavDropdown
              title={renderThemeIcon()}
              id="theme-mode-dropdown"
              align="end"
              className="no-caret"
            >
              <NavDropdown.Item active={colorMode === 'light'} onClick={() => setColorMode('light')}>
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </NavDropdown.Item>
              <NavDropdown.Item active={colorMode === 'dark'} onClick={() => setColorMode('dark')}>
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </NavDropdown.Item>
              <NavDropdown.Item active={colorMode === 'auto'} onClick={() => setColorMode('auto')}>
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          {/* User Dropdown */}
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default React.memo(AppHeader)

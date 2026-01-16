// import React from 'react'
// import { NavLink } from 'react-router-dom'
// import PropTypes from 'prop-types'
// import { useDispatch } from 'react-redux'

// import SimpleBar from 'simplebar-react'
// import 'simplebar-react/dist/simplebar.min.css'

// import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

// export const AppSidebarNav = ({ items }) => {
//   const dispatch = useDispatch()

//   // Hàm xử lý click: ẩn sidebar
//   const handleNavItemClick = () => {
//     dispatch({ type: 'set', sidebarShow: false })
//   }

//   const navLink = (name, icon, badge, indent = false) => {
//     return (
//       <>
//         {icon
//           ? icon
//           : indent && (
//             <span className="nav-icon">
//               <span className="nav-icon-bullet"></span>
//             </span>
//           )}
//         {name && name}
//         {badge && (
//           <CBadge color={badge.color} className="ms-auto">
//             {badge.text}
//           </CBadge>
//         )}
//       </>
//     )
//   }

//   const navItem = (item, index, indent = false) => {
//     const { component, name, badge, icon, ...rest } = item
//     const Component = component
//     return (
//       <Component as="div" key={index}>
//         {rest.to || rest.href ? (
//           <CNavLink
//             // Thêm onClick để ẩn sidebar khi nhấp vào
//             onClick={handleNavItemClick}
//             {...(rest.to && { as: NavLink })}
//             {...rest}
//           >
//             {navLink(name, icon, badge, indent)}
//           </CNavLink>
//         ) : (
//           navLink(name, icon, badge, indent)
//         )}
//       </Component>
//     )
//   }

//   const navGroup = (item, index) => {
//     const { component, name, icon, items, to, ...rest } = item
//     const Component = component
//     return (
//       <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
//         {item.items?.map((item, index) =>
//           item.items ? navGroup(item, index) : navItem(item, index, true),
//         )}
//       </Component>
//     )
//   }

//   return (
//     <CSidebarNav as={SimpleBar}>
//       {items &&
//         items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
//     </CSidebarNav>
//   )
// }

// AppSidebarNav.propTypes = {
//   items: PropTypes.arrayOf(PropTypes.any).isRequired,
// }



// import React from 'react'
// import { NavLink, useLocation } from 'react-router-dom'
// import PropTypes from 'prop-types'
// import { useDispatch } from 'react-redux'

// import SimpleBar from 'simplebar-react'
// import 'simplebar-react/dist/simplebar.min.css'

// import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

// export const AppSidebarNav = ({ items }) => {
//   const dispatch = useDispatch()
//   const location = useLocation() // để highlight item active

//   // Ẩn sidebar khi nhấp
//   const handleNavItemClick = () => {
//     dispatch({ type: 'set', sidebarShow: false })
//   }

//   const isActive = (to) => {
//     if (!to) return false
//     return location.pathname === to
//   }

//   const navLink = (name, icon, badge, indent = false, to) => {
//     return (
//       <div
//         className={`d-flex align-items-center ${indent ? 'ms-3' : ''}`}
//         style={{
//           color: isActive(to) ? '#FFD700' : '#ffffff',
//           fontWeight: isActive(to) ? '600' : '500',
//           padding: '0.4rem 0.5rem',
//           borderRadius: '4px',
//           transition: '0.2s',
//         }}
//       >
//         {icon && <span className="me-2">{icon}</span>}
//         <span>{name}</span>
//         {badge && (
//           <CBadge color={badge.color} className="ms-auto">
//             {badge.text}
//           </CBadge>
//         )}
//       </div>
//     )
//   }

//   const navItem = (item, index, indent = false) => {
//     const { component, name, badge, icon, to, href, ...rest } = item
//     const Component = component

//     return (
//       <Component as="div" key={index}>
//         {to || href ? (
//           <CNavLink
//             {...(to && { as: NavLink, to })}
//             onClick={handleNavItemClick}
//             {...rest}
//           >
//             {navLink(name, icon, badge, indent, to)}
//           </CNavLink>
//         ) : (
//           navLink(name, icon, badge, indent, to)
//         )}
//       </Component>
//     )
//   }

//   const navGroup = (item, index) => {
//     const { component, name, icon, items, ...rest } = item
//     const Component = component

//     return (
//       <Component
//         key={index}
//         compact
//         as="div"
//         toggler={navLink(name, icon)}
//         {...rest}
//       >
//         {items.map((child, idx) =>
//           child.items ? navGroup(child, idx) : navItem(child, idx, true),
//         )}
//       </Component>
//     )
//   }

//   return (
//     <CSidebarNav
//       as={SimpleBar}
//       style={{ padding: '0.5rem 0' }}
//     >
//       {items && items.map((item, index) =>
//         item.items ? navGroup(item, index) : navItem(item, index),
//       )}
//     </CSidebarNav>
//   )
// }

// AppSidebarNav.propTypes = {
//   items: PropTypes.arrayOf(PropTypes.any).isRequired,
// }


import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const dispatch = useDispatch()
  const location = useLocation()

  const handleNavItemClick = () => {
    dispatch({ type: 'set', sidebarShow: false })
  }

  const isActive = (to) => {
    if (!to) return false
    return location.pathname === to
  }

  const navLink = (name, icon, badge, indent = false, to) => {
    const active = isActive(to)

    return (
      <div
        className={`d-flex align-items-center ${indent ? 'ms-3' : ''}`}
        style={{
          display: 'inline-flex', // chỉ vừa nội dung
          padding: '0.25rem 0.5rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: active ? 600 : 500,
          color: active ? '#FFD700' : '#ffffff',
          background: active ? 'rgba(255,215,0,0.15)' : 'transparent',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {icon && (
          <span
            className="me-2"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: active ? 'gold' : '#ffffff',
              transition: 'all 0.2s ease-in-out',
              filter: active ? 'drop-shadow(0 0 6px gold)' : 'none',
            }}
          >
            {icon}
          </span>
        )}
        <span>{name}</span>
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </div>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, to, href, ...rest } = item
    const Component = component

    return (
      <Component as="div" key={index}>
        {to || href ? (
          <CNavLink
            {...(to && { as: NavLink, to })}
            onClick={handleNavItemClick}
            {...rest}
          >
            {navLink(name, icon, badge, indent, to)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent, to)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, ...rest } = item
    const Component = component

    return (
      <Component
        key={index}
        compact
        as="div"
        toggler={navLink(name, icon)}
        {...rest}
        style={{ marginBottom: '0.25rem' }}
      >
        {items.map((child, idx) =>
          child.items ? navGroup(child, idx) : navItem(child, idx, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav
      as={SimpleBar}
      style={{ padding: '0.5rem 0' }}
    >
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}

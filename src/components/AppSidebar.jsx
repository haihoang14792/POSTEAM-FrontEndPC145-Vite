// import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'

// import {
//   CCloseButton,
//   CSidebar,
//   CSidebarBrand,
//   CSidebarFooter,
//   CSidebarHeader,
//   CSidebarToggler,
// } from '@coreui/react'


// import { AppSidebarNav } from './AppSidebarNav'


// // sidebar nav config
// import navigation from '../_nav'

// const AppSidebar = () => {
//   const dispatch = useDispatch()
//   const unfoldable = useSelector((state) => state.sidebarUnfoldable)
//   const sidebarShow = useSelector((state) => state.sidebarShow)




//   return (
//     <CSidebar
//       className="border-end"
//       colorScheme="dark"
//       position="fixed"
//       unfoldable={unfoldable}
//       visible={sidebarShow}
//       onVisibleChange={(visible) => {
//         dispatch({ type: 'set', sidebarShow: visible })
//       }}
//     >
//       <CSidebarHeader className="border-bottom">
//         <CSidebarBrand to="/">
//           <span className="sidebar-brand-full" style={{
//             color: 'yellow',
//             fontWeight: 'bold',
//             fontSize: '25px',
//             textDecoration: 'none',
//             display: 'inline-block'
//           }}>
//             TEAM POS DHG
//           </span>
//         </CSidebarBrand>
//         <CCloseButton
//           className="d-lg-none"
//           dark
//           onClick={() => dispatch({ type: 'set', sidebarShow: false })}
//         />
//       </CSidebarHeader>
//       <AppSidebarNav items={navigation} />
//       <CSidebarFooter className="border-top d-none d-lg-flex">
//         <CSidebarToggler
//           onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
//         />
//       </CSidebarFooter>
//     </CSidebar>
//   )
// }

// export default React.memo(AppSidebar)

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      style={{ backgroundColor: '#1e1e2f' }} // màu nền sidebar
    >
      <CSidebarHeader className="border-bottom" style={{ padding: '1rem' }}>
        <CSidebarBrand to="/">
          <span
            className="sidebar-brand-full"
            style={{
              color: '#FFD700', // vàng nổi bật
              fontWeight: 'bold',
              fontSize: '22px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            TEAM POS DHG
          </span>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Menu navigation */}
      <AppSidebarNav
        items={navigation}
        style={{
          color: '#ffffff',
          fontWeight: 500,
        }}
      />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
          }
          style={{ color: '#FFD700' }}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

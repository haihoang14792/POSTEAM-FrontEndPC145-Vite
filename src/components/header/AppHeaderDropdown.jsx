// import React, { useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import { CAvatar, CBadge, CDropdown, CDropdownDivider, CDropdownHeader, CDropdownItem, CDropdownMenu, CDropdownToggle, } from '@coreui/react'
// import { cilBell, cilCreditCard, cilCommentSquare, cilEnvelopeOpen, cilFile, cilLockLocked, cilSettings, cilTask, cilUser, } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import { logoutUser } from '../../services/userServices'
// import { UserContext } from '../../context/UserContext'
// import avatar10 from './../../assets/images/avatars/10.png'

// const AppHeaderDropdown = () => {
//   const navigate = useNavigate()
//   const { logoutContext } = useContext(UserContext)

//   // Các hàm xử lý sự kiện khác...
//   const handleUpdates = () => {
//     console.log('Updates clicked')
//   }

//   const handleMessages = () => {
//     console.log('Messages clicked')
//   }

//   const handleTasks = () => {
//     console.log('Tasks clicked')
//   }

//   const handleComments = () => {
//     console.log('Comments clicked')
//   }

//   const handleProfile = () => {
//     console.log('Profile clicked')
//   }

//   const handleSettings = () => {
//     console.log('Settings clicked')
//   }

//   const handlePayments = () => {
//     console.log('Payments clicked')
//   }

//   const handleProjects = () => {
//     console.log('Projects clicked')
//   }

//   // Hàm logout: xóa token và user khỏi localStorage, cập nhật context và chuyển hướng về /login.
//   const handleLogout = async () => {
//     try {
//       const data = await logoutUser() // Gọi API logout nếu có
//       // Xóa token và thông tin user khỏi localStorage
//       localStorage.removeItem('jwt')
//       localStorage.removeItem('user')
//       // Cập nhật context nếu cần
//       if (logoutContext) logoutContext()
//       if (data && +data.EC === 0) {
//         toast.success('Cảm ơn bạn đã sử dụng dịch vụ!')
//         navigate('/login') // Chuyển hướng về trang đăng nhập
//       } else {
//         toast.error(data.EM)
//       }
//     } catch (error) {
//       toast.error('Có lỗi xảy ra trong quá trình đăng xuất.')
//     }
//   }

//   return (
//     <CDropdown variant="nav-item">
//       <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
//         <CAvatar src={avatar10} size="md" />
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-0" placement="bottom-end">
//         <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
//         <CDropdownItem onClick={handleProfile}>
//           <CIcon icon={cilUser} className="me-2" />
//           Profile
//         </CDropdownItem>
//         <CDropdownItem onClick={handleSettings}>
//           <CIcon icon={cilSettings} className="me-2" />
//           Settings
//         </CDropdownItem>
//         <CDropdownDivider />
//         <CDropdownItem onClick={handleLogout}>
//           <CIcon icon={cilLockLocked} className="me-2" />
//           Logout
//         </CDropdownItem>
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// export default AppHeaderDropdown

import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { UserContext } from '../../context/UserContext'
import { logoutUser } from '../../services/userServices'
import avatar10 from './../../assets/images/avatars/10.png'
import './AppHeaderDropdown.scss';

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { logoutContext } = useContext(UserContext)

  const handleLogout = async () => {
    try {
      const data = await logoutUser()
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      if (logoutContext) logoutContext()
      if (data && +data.EC === 0) {
        toast.success('Cảm ơn bạn đã sử dụng dịch vụ!')
        navigate('/login')
      } else {
        toast.error(data.EM)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra trong quá trình đăng xuất.')
    }
  }

  const handleProfile = () => {
    console.log('Profile clicked')
  }

  const handleSettings = () => {
    console.log('Settings clicked')
  }

  return (
    <Nav>
      <NavDropdown
        title={
          <img
            src={avatar10}
            alt="avatar"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        }
        align="end"
        id="user-nav-dropdown"
        className="no-caret"
      >
        <NavDropdown.Header>Cài đặt</NavDropdown.Header>
        <NavDropdown.Item onClick={handleProfile}>Hồ sơ</NavDropdown.Item>
        <NavDropdown.Item onClick={handleSettings}>Cài đặt</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default AppHeaderDropdown

// import React, { useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import Nav from 'react-bootstrap/Nav'
// import NavDropdown from 'react-bootstrap/NavDropdown'
// import { UserContext } from '../../context/UserContext'
// import { logoutUser } from '../../services/userServices'
// import avatar10 from './../../assets/images/avatars/10.png'
// import './AppHeaderDropdown.scss';

// const AppHeaderDropdown = () => {
//   const navigate = useNavigate()
//   const { logoutContext } = useContext(UserContext)

//   const handleLogout = async () => {
//     try {
//       const data = await logoutUser()
//       localStorage.removeItem('jwt')
//       localStorage.removeItem('user')
//       if (logoutContext) logoutContext()
//       if (data && +data.EC === 0) {
//         toast.success('Cảm ơn bạn đã sử dụng dịch vụ!')
//         navigate('/login')
//       } else {
//         toast.error(data.EM)
//       }
//     } catch (error) {
//       toast.error('Có lỗi xảy ra trong quá trình đăng xuất.')
//     }
//   }

//   const handleProfile = () => {
//     console.log('Profile clicked')
//   }

//   const handleSettings = () => {
//     console.log('Settings clicked')
//   }

//   return (
//     <Nav>
//       <NavDropdown
//         title={
//           <img
//             src={avatar10}
//             alt="avatar"
//             style={{ width: '40px', height: '40px', borderRadius: '50%' }}
//           />
//         }
//         align="end"
//         id="user-nav-dropdown"
//         className="no-caret"
//       >
//         <NavDropdown.Header>Cài đặt</NavDropdown.Header>
//         <NavDropdown.Item onClick={handleProfile}>Hồ sơ</NavDropdown.Item>
//         <NavDropdown.Item onClick={handleSettings}>Cài đặt</NavDropdown.Item>
//         <NavDropdown.Divider />
//         <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
//       </NavDropdown>
//     </Nav>
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
import './AppHeaderDropdown.scss'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { logoutContext } = useContext(UserContext)

  const handleLogout = async () => {
    // ... logic giữ nguyên
    try {
      const data = await logoutUser()
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      if (logoutContext) logoutContext()
      if (data && +data.EC === 0) {
        toast.success('Hẹn gặp lại bạn!')
        navigate('/login')
      } else {
        toast.error(data.EM)
      }
    } catch (error) {
      toast.error('Lỗi đăng xuất.')
    }
  }

  // Style avatar
  const avatarStyle = {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff', // Viền trắng tạo độ tách biệt
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Đổ bóng nhẹ cho avatar
    cursor: 'pointer'
  }

  return (
    <Nav>
      <NavDropdown
        title={
          <img
            src={avatar10}
            alt="user-avatar"
            style={avatarStyle}
          />
        }
        align="end"
        id="user-nav-dropdown"
        className="no-caret"
      >
        <div className="px-3 py-2">
          <small className="text-muted fw-bold" style={{ fontSize: '0.75rem' }}>TÀI KHOẢN</small>
        </div>
        <NavDropdown.Item onClick={() => console.log('Profile')}>Hồ sơ cá nhân</NavDropdown.Item>
        <NavDropdown.Item onClick={() => console.log('Settings')}>Cài đặt hệ thống</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout} className="text-danger">
          Đăng xuất
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default AppHeaderDropdown
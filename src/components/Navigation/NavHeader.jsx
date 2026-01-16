import React, { useContext, useState } from 'react';
import './Nav.scss';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../logo.jpg';
import { logoutUser } from '../../services/userServices';
import { toast } from 'react-toastify';

const NavHeader = () => {
    const { user, logoutContext } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate(); // Thay thế useHistory bằng useNavigate

    const [showDingtalkDropdown, setShowDingtalkDropdown] = useState(false);
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            let data = await logoutUser(); // Clear cookie
            localStorage.removeItem('jwt'); // Clear local storage
            logoutContext(); // Clear user in context
            if (data && +data.EC === 0) {
                toast.success('Cảm ơn bạn...');
                navigate('/login'); // Sử dụng navigate để chuyển trang
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra trong quá trình đăng xuất.');
        }
    };

    if (user?.isAuthenticated || ['/', '/about', '/customer'].includes(location.pathname)) {
        return (
            <div className='nav-header'>
                <Navbar className="bg-header" expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to="/">
                            <img
                                src={logo}
                                className="logo-img d-inline-block align-top"
                                alt="React logo"
                            />
                            <span className='brand-name'>Đại Hoàng Gia</span>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <NavLink to="/" end className='nav-link'>Trang Chủ</NavLink>
                                <NavLink to="/customer" className='nav-link'>Khách Hàng</NavLink>
                                {user?.isAuthenticated && (
                                    <>
                                        {/* <NavDropdown
                                            title="Project"
                                            id="project-nav-dropdown"
                                            show={showProjectDropdown}
                                            onMouseEnter={() => setShowProjectDropdown(true)}
                                            onMouseLeave={() => setShowProjectDropdown(false)}
                                        >
                                            <NavDropdown.Item as={NavLink} to="/projects" className='nav-link'>Dự Án</NavDropdown.Item>
                                        </NavDropdown>
                                        <NavDropdown
                                            title="Dingtalk"
                                            id="basic-nav-dropdown"
                                            show={showDingtalkDropdown}
                                            onMouseEnter={() => setShowDingtalkDropdown(true)}
                                            onMouseLeave={() => setShowDingtalkDropdown(false)}
                                        >
                                            <NavDropdown.Item as={NavLink} to="/dingtalk" className='nav-link'>Dashboard</NavDropdown.Item>
                                            <NavDropdown.Item as={NavLink} to="/itemdhg" className='nav-link'>Sản Phẩm DHG</NavDropdown.Item>
                                        </NavDropdown> */}
                                    </>
                                )}
                                <NavLink to="/about" className='nav-link'>Liên Hệ</NavLink>
                            </Nav>
                            <Nav className="ml-auto">
                                {user?.isAuthenticated ? (
                                    <>
                                        <Nav.Item className="nav-link">Welcome {user.account.username}</Nav.Item>
                                        <NavDropdown title="Thông tin" id="basic-nav-dropdown">
                                            <NavDropdown.Item>Change Password</NavDropdown.Item>
                                            <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
                                        </NavDropdown>
                                        <Nav.Item>
                                            <NavLink to="/dhg" className="nav-link">
                                                DHG
                                            </NavLink>
                                        </Nav.Item>
                                    </>
                                ) : (
                                    <NavLink to="/login" className="nav-link">
                                        Đăng nhập
                                    </NavLink>
                                )}

                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
    return null;
};

export default NavHeader;

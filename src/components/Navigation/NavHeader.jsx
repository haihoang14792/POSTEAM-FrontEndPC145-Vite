import React, { useContext, useState, useEffect } from 'react';
import './Nav.scss';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../../logo.jpg';
import { logoutUser } from '../../services/userServices';
import { toast } from 'react-toastify';

const NavHeader = () => {
    const { user, logoutContext } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    // Hiệu ứng đổi màu nền khi cuộn chuột (giống Apple)
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            let data = await logoutUser();
            localStorage.removeItem('jwt');
            logoutContext();
            if (data && +data.EC === 0) {
                toast.success('Đã đăng xuất thành công');
                navigate('/login');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra.');
        }
    };

    // Chỉ hiển thị ở các trang public hoặc khi đã auth
    const publicPages = ['/', '/contact', '/customer', '/login', '/register', '/product'];
    if (user?.isAuthenticated || publicPages.includes(location.pathname)) {
        return (
            <div className={`nav-header-fixed ${scrolled ? 'is-scrolled' : ''}`}>
                <Navbar expand="lg" variant="dark" className="apple-navbar">
                    <Container>
                        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                            <img src={logo} className="logo-img" alt="DHG Logo" />
                            <span className='brand-name'>Đại Hoàng Gia</span>
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="apple-nav-toggle" />

                        <Navbar.Collapse id="apple-nav-toggle">
                            <Nav className="mx-auto main-nav">
                                <NavLink to="/" end className='nav-link-item'>Trang Chủ</NavLink>
                                <NavLink to="/customer" className='nav-link-item'>Khách Hàng</NavLink>
                                <NavLink to="/product" className='nav-link-item'>Sản Phẩm</NavLink>
                                <NavLink to="/contact" className='nav-link-item'>Liên Hệ</NavLink>
                            </Nav>

                            <Nav className="auth-nav">
                                {user?.isAuthenticated ? (
                                    <NavDropdown
                                        title={<span className="user-welcome">{user.account.Name}</span>}
                                        id="user-dropdown"
                                        align="end"
                                    >
                                        {/* Đưa Hệ thống DHG vào đây */}
                                        <NavDropdown.Item as={Link} to="/dhg" className="fw-bold text-primary">
                                            Hệ Thống Quản Trị DHG
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />

                                        <NavDropdown.Item>Đổi mật khẩu</NavDropdown.Item>
                                        <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                            Đăng xuất
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <NavLink to="/login" className="login-button">Đăng nhập</NavLink>
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
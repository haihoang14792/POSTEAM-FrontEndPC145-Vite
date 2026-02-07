import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';
import { useColorModes } from "@coreui/react";
import { toast } from 'react-toastify';

const Settings = () => {
    const [loading, setLoading] = useState(false);

    // 1. Quản lý Dark Mode (Đã đồng bộ với AppHeader)
    const { colorMode, setColorMode } = useColorModes(
        "coreui-free-react-admin-template-theme"
    );

    // 2. Quản lý Ngôn ngữ (Sử dụng localStorage để ghi nhớ lựa chọn)
    const [lang, setLang] = useState(localStorage.getItem('app_lang') || 'vi');

    const handleLangChange = (e) => {
        const newLang = e.target.value;
        setLang(newLang);
        localStorage.setItem('app_lang', newLang);
        // Tùy chọn: Reload trang để áp dụng ngôn ngữ cho toàn bộ hệ thống
        window.location.reload();
        toast.info(newLang === 'vi' ? 'Đã chuyển sang Tiếng Việt' : 'Switched to English');
    };

    // Dictionary đơn giản cho trang Settings
    const text = {
        vi: {
            titleUI: "Tùy chỉnh giao diện",
            darkMode: "Chế độ tối (Dark Mode)",
            darkModeSub: "Thay đổi giao diện để bảo vệ mắt vào ban đêm",
            language: "Ngôn ngữ",
            languageSub: "Chọn ngôn ngữ hiển thị của hệ thống",
            titleSecurity: "Bảo mật",
            changePass: "Đổi mật khẩu",
            currPass: "Mật khẩu hiện tại",
            newPass: "Mật khẩu mới",
            btnUpdate: "Cập nhật bảo mật"
        },
        en: {
            titleUI: "Interface Settings",
            darkMode: "Dark Mode",
            darkModeSub: "Change the interface to protect your eyes at night",
            language: "Language",
            languageSub: "Select the system display language",
            titleSecurity: "Security",
            changePass: "Change Password",
            currPass: "Current Password",
            newPass: "New Password",
            btnUpdate: "Update Security"
        }
    };

    const t = text[lang];

    return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white py-3 fw-bold">{t.titleUI}</Card.Header>
                <Card.Body>
                    {/* Dark Mode Switch */}
                    <Form.Group className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <div className="fw-bold">{t.darkMode}</div>
                            <small className="text-muted">{t.darkModeSub}</small>
                        </div>
                        <Form.Check
                            type="switch"
                            id="dark-mode-switch"
                            checked={colorMode === "dark"}
                            onChange={(e) => setColorMode(e.target.checked ? "dark" : "light")}
                        />
                    </Form.Group>
                    <hr />
                    {/* Language Select */}
                    <Form.Group className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="fw-bold">{t.language}</div>
                            <small className="text-muted">{t.languageSub}</small>
                        </div>
                        <Form.Select
                            style={{ width: '150px' }}
                            value={lang}
                            onChange={handleLangChange}
                        >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                        </Form.Select>
                    </Form.Group>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 text-danger border-top-danger">
                <Card.Header className="bg-white py-3 fw-bold">{t.titleSecurity}</Card.Header>
                <Card.Body>
                    <h6 className="text-dark">{t.changePass}</h6>
                    <Form.Group className="mb-3">
                        <Form.Control type="password" placeholder={t.currPass} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="password" placeholder={t.newPass} />
                    </Form.Group>
                    <Button variant="danger" disabled={loading}>{t.btnUpdate}</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Settings;
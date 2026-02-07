import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Card, Row, Col, ListGroup, Container } from 'react-bootstrap';

const Profile = () => {
    const { user } = useContext(UserContext);
    const info = user.account; // Dữ liệu từ UserContext

    // Lấy WEB_BASE từ env giống như trong UserCard
    const WEB_BASE = import.meta.env.VITE_WEB_BASE;

    // Tạo URL QR Code trỏ đến trang Card của chính user này
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${WEB_BASE}/card/${info.id}`;

    return (
        <Container className="mt-4">
            <Row>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body>
                            <div className="mb-3 d-flex justify-content-center">
                                <img
                                    src={qrCodeUrl} // Sử dụng link QR tạo tự động
                                    alt="User QR"
                                    className="img-fluid border p-2"
                                    style={{ width: '150px', borderRadius: '10px', backgroundColor: '#fff' }}
                                />
                            </div>
                            <h5 className="fw-bold">{info.Name || info.username}</h5>
                            <p className="text-muted mb-1">{info.Position}</p>
                            <span className={`badge ${info.Status === "Đang làm việc" ? 'bg-success' : 'bg-secondary'}`}>
                                {info.Status || 'N/A'}
                            </span>
                        </Card.Body>
                    </Card>
                    {/* Thêm chú thích nhỏ */}
                    <div className="text-center mt-2">
                        <small className="text-muted">Quét mã để xem danh thiếp điện tử</small>
                    </div>
                </Col>

                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white py-3 fw-bold border-bottom">
                            Thông tin nhân viên
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="py-3">
                                <span className="text-muted d-block small">Mã nhân viên (ID)</span>
                                <span className="fw-medium">{info.IDuser || 'N/A'}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="py-3">
                                <span className="text-muted d-block small">Email công việc</span>
                                <span className="fw-medium">{info.EmailDHG || info.email}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="py-3">
                                <span className="text-muted d-block small">Phòng ban / Bộ phận</span>
                                <span className="fw-medium">{info.Department || 'N/A'}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="py-3">
                                <span className="text-muted d-block small">Số điện thoại</span>
                                <span className="fw-medium">{info.Phone || 'Chưa cập nhật'}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="py-3">
                                <span className="text-muted d-block small">Ngày vào làm</span>
                                <span className="fw-medium">
                                    {info.startingdate ? new Date(info.startingdate).toLocaleDateString('vi-VN') : '---'}
                                </span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
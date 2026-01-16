import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { createNewJob } from "../../../services/storeServices";
import { getUsers } from "../../../services/userServices";
import "./ModalStore.scss";

const ModalStore = ({
    showModal,
    handleClose,
    handleAddJob,
    storeId,
    ticket,
}) => {
    const [newJob, setNewJob] = useState({
        StoreID: "",
        Ticket: "",
        ListJob: "",
        DescriptionJob: "",
        DateJob: "",
        DateEndJob: "",
        Note: "",
        Person: "",
    });

    const [users, setUsers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ===== Load user list =====
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await getUsers();
                // Kiểm tra cấu trúc dữ liệu trả về để set state đúng
                if (Array.isArray(userData)) {
                    setUsers(userData);
                } else if (userData.data && Array.isArray(userData.data)) {
                    setUsers(userData.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy users:", error);
            }
        };
        fetchUsers();
    }, []);

    // ===== Khi mở modal → Reset form và gán StoreID + Ticket =====
    useEffect(() => {
        if (showModal) {
            setNewJob({
                StoreID: storeId || "",
                Ticket: ticket || "",
                ListJob: "",
                DescriptionJob: "",
                DateJob: new Date().toISOString().split("T")[0], // Mặc định ngày hiện tại
                DateEndJob: "",
                Note: "",
                Person: "",
            });
        }
    }, [storeId, ticket, showModal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewJob((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!newJob.ListJob) {
            alert("Vui lòng nhập tên công việc!");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await createNewJob(newJob);
            handleAddJob(response);
            handleClose();
        } catch (error) {
            console.error("Lỗi khi tạo công việc:", error);
            alert("Có lỗi xảy ra khi tạo công việc.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            centered
            backdrop="static"
            size="lg" // Modal rộng hơn một chút
            className="modal-store-modern"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">
                    ✨ Thêm công việc mới
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-4">
                <Form>
                    {/* Thông tin readonly - Gom nhóm cho gọn */}
                    <div className="bg-light p-3 rounded-3 mb-4 border border-light">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2 mb-md-0">
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Mã phiếu (Ticket)</Form.Label>
                                    <div className="form-control-plaintext fw-bold text-primary">{newJob.Ticket || "---"}</div>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Cửa hàng (Store ID)</Form.Label>
                                    <div className="form-control-plaintext fw-bold text-dark">{newJob.StoreID || "---"}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Tên công việc <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ListJob"
                                    value={newJob.ListJob}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: Lắp đặt thiết bị POS, Kiểm tra dây mạng..."
                                    autoFocus
                                    className="input-modern"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Ngày bắt đầu</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="DateJob"
                                    value={newJob.DateJob}
                                    onChange={handleInputChange}
                                    className="input-modern"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Ngày kết thúc</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="DateEndJob"
                                    value={newJob.DateEndJob}
                                    onChange={handleInputChange}
                                    className="input-modern"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Mô tả chi tiết</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="DescriptionJob"
                                    value={newJob.DescriptionJob}
                                    onChange={handleInputChange}
                                    placeholder="Nhập mô tả chi tiết công việc..."
                                    className="input-modern"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Ghi chú thêm</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="Note"
                                    value={newJob.Note}
                                    onChange={handleInputChange}
                                    placeholder="Ghi chú (nếu có)"
                                    className="input-modern bg-light"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer className="border-0 pb-4 pt-2">
                <Button variant="light" onClick={handleClose} className="px-4 fw-bold text-secondary btn-cancel-modern">
                    Hủy bỏ
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 fw-bold btn-submit-modern"
                >
                    {isSubmitting ? "Đang lưu..." : "Thêm công việc"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalStore;
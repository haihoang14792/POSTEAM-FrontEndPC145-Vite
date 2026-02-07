import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { createNewJob } from "../../../services/storeServices";
// Đã xóa import getUsers vì không còn cần chọn Person
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
        // Đã xóa Person
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // ===== Khi mở modal → Reset form =====
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
                // Đã xóa Person
            });
            setErrorMsg("");
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
        // 1. Validate dữ liệu
        if (!newJob.ListJob) {
            setErrorMsg("Vui lòng nhập tên công việc!");
            return;
        }

        setIsSubmitting(true);
        setErrorMsg("");

        try {
            // 2. Chuẩn bị payload
            // Chỉ gửi các trường cần thiết, bỏ Person
            const payload = {
                StoreID: newJob.StoreID,
                ListJob: newJob.ListJob,
                DescriptionJob: newJob.DescriptionJob,
                DateJob: newJob.DateJob || null, // Strapi v5 thích null hơn rỗng cho ngày tháng
                Note: newJob.Note,
                StatusJob: false, // Mặc định false
                DateEndJob: newJob.DateEndJob,
                Ticket: newJob.Ticket,
            };

            // Nếu Backend có trường Ticket hoặc DateEndJob thì thêm vào payload tại đây
            // payload.Ticket = newJob.Ticket;
            // payload.DateEndJob = newJob.DateEndJob;

            const response = await createNewJob(payload);
            handleAddJob(response);
            handleClose();
        } catch (error) {
            console.error("Lỗi khi tạo công việc:", error);
            // Lấy thông báo lỗi chi tiết từ Strapi nếu có
            const message = error.response?.data?.error?.message || "Có lỗi xảy ra khi tạo công việc.";
            setErrorMsg(message);
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
            size="lg"
            className="modal-store-modern"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">
                    ✨ Thêm công việc mới
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-4">
                <Form>
                    {errorMsg && <Alert variant="danger" className="mb-3">{errorMsg}</Alert>}

                    {/* Thông tin Readonly */}
                    <div className="bg-light p-3 rounded-3 mb-4 border border-light">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2 mb-md-0">
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Mã phiếu</Form.Label>
                                    <div className="form-control-plaintext fw-bold text-primary">{newJob.Ticket || "---"}</div>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="text-muted small fw-bold text-uppercase">Cửa hàng</Form.Label>
                                    <div className="form-control-plaintext fw-bold text-dark">{newJob.StoreID || "---"}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Hàng 1: Tên công việc (Full width) */}
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Tên công việc <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ListJob"
                                    value={newJob.ListJob}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: Lắp đặt POS, Kiểm tra thiết bị..."
                                    autoFocus
                                    className="input-modern"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Hàng 2: Ngày thực hiện & Ngày kết thúc */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Ngày thực hiện</Form.Label>
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
                                <Form.Label className="fw-semibold text-muted">Ngày kết thúc (Dự kiến)</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="DateEndJob"
                                    value={newJob.DateEndJob}
                                    onChange={handleInputChange}
                                    className="input-modern"
                                    // Bật lại disabled nếu backend chưa hỗ trợ trường này
                                    title="Chức năng đang cập nhật backend"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Hàng 3: Mô tả */}
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
                                    className="input-modern"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Hàng 4: Ghi chú */}
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
import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    message,
    Row,
    Col,
} from "antd";
import {
    FileTextOutlined,
    CloseOutlined,
    PlusOutlined,
    UserOutlined,
    ShopOutlined,
    BarcodeOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { fetchListCustomer } from "../../../services/strapiServices";
import { createRecallDHGs } from "../../../services/jobServices";
import { fetchUsers } from "../../../services/abicoServices";
import "./CreateProjectTicketModal.scss";

const { Option } = Select;
const { TextArea } = Input;

const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const unique = Math.floor(Math.random() * 1000000);
    return `POSJOB${year}${unique}`;
};

const CreateProjectTicketModal = ({ open, onClose, reloadTickets }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filteredStores, setFilteredStores] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [users, setUsers] = useState([]);

    // Load Users
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchUsers();
                const data = Array.isArray(res) ? res : (res?.data || []);
                setUsers(data);
            } catch (err) {
                message.error("Không thể tải danh sách người dùng!");
            }
        };
        loadUsers();
    }, []);

    // Load Customers
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchListCustomer();
                const data = Array.isArray(res) ? res : (res?.data || []);
                setCustomerList(data);

                const uniqueCustomers = Array.from(
                    new Set(data.map((i) => i.Customer))
                ).map((c) => ({ label: c, value: c }));

                setCustomerOptions(uniqueCustomers);
            } catch {
                message.error("Không thể tải danh sách khách hàng!");
            }
        };
        fetchData();
    }, []);

    // Filter Store logic
    useEffect(() => {
        if (!open) return;

        if (!selectedCustomer) {
            setFilteredStores([]);
            form.setFieldsValue({ StoreID: undefined, Address: undefined });
            return;
        }

        const result = customerList.filter(
            (item) =>
                item.Customer === selectedCustomer &&
                item.Status === true
        );
        setFilteredStores(result);
    }, [selectedCustomer, customerList, form, open]);

    const handleStoreChange = (value) => {
        const store = filteredStores.find((s) => s.StoreID === value);
        form.setFieldsValue({
            StoreID: value,
            Address: store?.Address || "",
        });
    };

    const handleCreate = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // Vì Person là Text, ta giữ nguyên values từ form
            const payload = { ...values, Status: true };

            await createRecallDHGs(payload);
            await reloadTickets();

            message.success("Tạo phiếu thành công!");
            form.resetFields();
            onClose();
        } catch (err) {
            const errorMsg = err.response?.data?.error?.message || "Lỗi khi tạo phiếu!";
            message.error(`Lỗi: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
            className="custom-modal-style"
            destroyOnClose
            closeIcon={<CloseOutlined style={{ fontSize: '18px', color: '#6c757d' }} />}
        >
            <div className="modal-header-modern">
                <div className="header-icon">
                    <FileTextOutlined />
                </div>
                <div className="header-content">
                    <h3>Tạo Phiếu Dự Án Mới</h3>
                    <p>Nhập thông tin chi tiết để tạo phiếu công việc</p>
                </div>
            </div>

            <div className="modal-body-modern">
                <Form form={form} layout="vertical">
                    {/* SECTION 1: THÔNG TIN CHUNG */}
                    <div className="section-block">
                        <h6 className="section-title"><InfoCircleOutlined /> Thông tin phiếu</h6>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Mã Phiếu (Auto)" name="Ticket" initialValue={generateInvoiceNumber()}>
                                    <Input prefix={<BarcodeOutlined />} readOnly className="input-modern read-only" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Loại công việc"
                                    name="Detail"
                                    rules={[{ required: true, message: "Vui lòng chọn" }]}
                                >
                                    <Select placeholder="Chọn loại công việc" className="select-modern" dropdownClassName="select-dropdown-modern">
                                        <Option value="Cửa hàng mới">🆕 Cửa hàng mới</Option>
                                        <Option value="Kế hoạch triển khai">📅 Kế hoạch triển khai</Option>
                                        <Option value="Thu hồi cửa hàng">🔙 Thu hồi cửa hàng</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* SECTION 2: KHÁCH HÀNG */}
                    <div className="section-block">
                        <h6 className="section-title"><ShopOutlined /> Khách hàng & Cửa hàng</h6>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Khách hàng"
                                    name="Customer"
                                    rules={[{ required: true, message: "Chọn khách hàng" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Tìm khách hàng..."
                                        onChange={(v) => {
                                            setSelectedCustomer(v);
                                            form.setFieldsValue({ StoreID: undefined, Address: undefined });
                                        }}
                                        className="select-modern"
                                        dropdownClassName="select-dropdown-modern"
                                    >
                                        {customerOptions.map((c) => (
                                            <Option key={c.value} value={c.value}>{c.label}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Store ID"
                                    name="StoreID"
                                    rules={[{ required: true, message: "Chọn Store ID" }]}
                                >
                                    {filteredStores.length > 0 ? (
                                        <Select
                                            showSearch
                                            placeholder="Chọn Store ID"
                                            onChange={handleStoreChange}
                                            className="select-modern"
                                            dropdownClassName="select-dropdown-modern"
                                        >
                                            {filteredStores.map((s) => (
                                                <Option key={s.id} value={s.StoreID}>
                                                    {s.StoreID}
                                                </Option>
                                            ))}
                                        </Select>
                                    ) : (
                                        <Input placeholder="Nhập Store ID" className="input-modern" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Địa chỉ" name="Address">
                                    <Input placeholder="Địa chỉ cửa hàng" className="input-modern" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* SECTION 3: NHÂN SỰ & GHI CHÚ */}
                    <div className="section-block">
                        <h6 className="section-title"><UserOutlined /> Nhân sự & Ghi chú</h6>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Người phụ trách chính"
                                    name="Person"
                                    rules={[{ required: true, message: "Chọn người phụ trách" }]}
                                >
                                    <Select showSearch placeholder="Chọn nhân viên" className="select-modern" dropdownClassName="select-dropdown-modern">
                                        {users.map((u) => (
                                            // ✅ Vì Person là Text -> Gửi Name
                                            <Option key={u.id} value={u.Name || u.username}>
                                                {u.Name || u.username}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Người hỗ trợ" name="Person2nd">
                                    <Select showSearch placeholder="Chọn nhân viên (nếu có)" className="select-modern" dropdownClassName="select-dropdown-modern" allowClear>
                                        {users.map((u) => (
                                            // ✅ Vì Person2nd là Text -> Gửi Name
                                            <Option key={u.id} value={u.Name || u.username}>
                                                {u.Name || u.username}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Ghi chú" name="Note">
                                    <TextArea rows={2} placeholder="Ghi chú thêm..." className="input-modern" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    <div className="modal-footer-modern">
                        <Button onClick={onClose} className="btn-modern-cancel">
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleCreate}
                            loading={loading}
                            icon={<PlusOutlined />}
                            className="btn-modern-submit"
                        >
                            Tạo phiếu
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default CreateProjectTicketModal;
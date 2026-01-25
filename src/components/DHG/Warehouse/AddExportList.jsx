import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    message,
    Select,
    Row,
    Col,
    Card,
    Typography,
    Divider,
    Statistic,
    Tag,
    Button,
    Descriptions,
    Space,
    Avatar
} from "antd";
import {
    DropboxOutlined,
    BarcodeOutlined,
    UserOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    CloseOutlined,
    SaveOutlined,
    ExportOutlined
} from "@ant-design/icons";

import {
    createExportlists,
    fetchWarehouseDetails,
    updateWarehouseDetails,
    updateExportlists,
} from "../../../services/dhgServices";
import { fetchUsers } from "../../../services/abicoServices";
import "./AddExportList.scss";

const { Option } = Select;
const { Text, Title } = Typography;

const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const unique = Math.floor(Math.random() * 1000000);
    return `SPDHG${year}${unique}`;
};

const AddExportList = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [models, setModels] = useState([]);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [selectedModelInfo, setSelectedModelInfo] = useState(null); // State để lưu info hiển thị đẹp hơn
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        const loadUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await fetchUsers();
                setUsers(Array.isArray(res) ? res : res?.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingUsers(false);
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchWarehouseDetails();
                setProducts(Array.isArray(res) ? res : res?.data || []);
            } catch {
                message.error("Không tải được danh sách kho");
            }
        };
        fetchData();

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserName(parsed?.account?.Name || "");
        }
    }, []);

    useEffect(() => {
        if (!isModalOpen) return;

        form.resetFields();
        form.setFieldsValue({
            Ticket: generateInvoiceNumber(),
            NameCreate: userName,
        });
        setModels([]);
        setMaxQuantity(0);
        setSelectedModelInfo(null);
    }, [isModalOpen, userName, form]);

    /* ================= HANDLERS ================= */
    const handleProductChange = (productName) => {
        const productModels = products.filter(
            (p) => p.ProductName === productName
        );
        setModels(productModels);
        setMaxQuantity(0);
        setSelectedModelInfo(null);
        form.setFieldsValue({
            Model: undefined,
            BrandName: undefined,
            Type: undefined,
            DVT: undefined,
            totalexport: undefined,
            SerialNumber: "",
        });
    };

    const handleModelChange = (model) => {
        const selected = models.find((m) => m.Model === model);
        if (!selected) return;

        setMaxQuantity(selected.DHG || 0);
        setSelectedModelInfo(selected);

        form.setFieldsValue({
            BrandName: selected.BrandName,
            Type: selected.Type,
            DVT: selected.DVT,
            totalexport: undefined,
            SerialNumber: "",
            idModel: selected.documentId,
        });
    };

    const handleSubmit = async () => {
        try {
            setLoadingSubmit(true);
            await form.validateFields();

            const values = {
                ...form.getFieldsValue(),
                NameCreate: userName,
                Status: "Chờ duyệt",
            };

            if (values.totalexport > maxQuantity) {
                message.error(`Vượt quá số lượng tồn kho (${maxQuantity})`);
                return;
            }

            /* ===== 1. TẠO PHIẾU XUẤT ===== */
            const res = await createExportlists(values);
            const exportItem = res?.data || res;

            /* ===== 2. UPDATE KHO ===== */
            const warehouseRes = await fetchWarehouseDetails();
            const warehouseData = Array.isArray(warehouseRes) ? warehouseRes : warehouseRes?.data || [];
            const matched = warehouseData.find((w) => w.Model === values.Model);

            if (!matched) {
                message.warning("Không tìm thấy model trong kho để trừ tồn");
                return;
            }

            const soLuong = values.totalexport;
            const updatePayload = {
                DHG: (matched.DHG || 0) - soLuong,
                POS: values.TypeKho === "POS" ? (matched.POS || 0) + soLuong : matched.POS,
                POSHN: values.TypeKho === "POSHN" ? (matched.POSHN || 0) + soLuong : matched.POSHN,
            };

            await updateWarehouseDetails(matched.documentId, updatePayload);

            /* ===== 3. ĐÁNH DẤU CHECK ===== */
            await updateExportlists(exportItem.documentId, { Check: true });

            message.success("Xuất kho thành công!");
            form.resetFields();
            onCreated(exportItem);
            onCancel();
        } catch (e) {
            console.error(e);
            message.error("Có lỗi khi xuất kho");
        } finally {
            setLoadingSubmit(false);
        }
    };

    /* ================= UI ================= */
    return (
        <Modal
            open={isModalOpen}
            onCancel={onCancel}
            footer={null}
            width={800}
            centered
            className="add-export-list-modal"
            title={
                <div className="modal-title-wrapper">
                    <div className="icon-box">
                        <ExportOutlined />
                    </div>
                    <div>
                        <Title level={5} style={{ margin: 0 }}>Điều chuyển kho thiết bị</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>Tạo phiếu xuất kho hoặc mượn tạm</Text>
                    </div>
                </div>
            }
        >
            <Form form={form} layout="vertical" size="middle">

                {/* === SECTION 1: CHỌN SẢN PHẨM === */}
                <Card className="section-card" bordered={false}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="ProductName"
                                label="Sản phẩm"
                                rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
                            >
                                <Select showSearch placeholder="Chọn tên thiết bị" onChange={handleProductChange}>
                                    {[...new Set(products.map(p => p.ProductName))].map((name) => (
                                        <Option key={name} value={name}>{name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="Model"
                                label="Model"
                                rules={[{ required: true, message: "Vui lòng chọn Model" }]}
                            >
                                <Select
                                    placeholder="Chọn Model"
                                    disabled={!models.length}
                                    showSearch
                                    onChange={handleModelChange}
                                >
                                    {models.map((m) => (
                                        <Option key={m.id} value={m.Model}>{m.Model}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Ẩn các field input cũ đi, nhưng vẫn giữ trong Form để lấy value submit */}
                    <div style={{ display: 'none' }}>
                        <Form.Item name="BrandName"><Input /></Form.Item>
                        <Form.Item name="Type"><Input /></Form.Item>
                        <Form.Item name="DVT"><Input /></Form.Item>
                        <Form.Item name="Model"><Input /></Form.Item>
                        <Form.Item name="NameCreate"><Input /></Form.Item>
                        <Form.Item name="Ticket"><Input /></Form.Item>
                    </div>

                    {/* Hiển thị thông tin chi tiết bằng Descriptions */}
                    {selectedModelInfo && (
                        <div className="info-box">
                            <Descriptions column={4} size="small" layout="vertical">
                                <Descriptions.Item label="Hãng SX">
                                    <Tag color="blue">{selectedModelInfo.BrandName}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Loại">
                                    {selectedModelInfo.Type}
                                </Descriptions.Item>
                                <Descriptions.Item label="Đơn vị">
                                    {selectedModelInfo.DVT}
                                </Descriptions.Item>
                                <Descriptions.Item label="Tồn kho khả dụng">
                                    <span style={{
                                        color: maxQuantity > 0 ? '#3f8600' : '#cf1322',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                    }}>
                                        {maxQuantity}
                                    </span>
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    )}
                </Card>

                {/* === SECTION 2: CHI TIẾT XUẤT === */}
                <Card className="section-card mt-3" title="Chi tiết phiếu xuất" size="small">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="TypeKho"
                                label="Kho đích (Nơi nhận)"
                                rules={[{ required: true, message: "Chọn kho đích" }]}
                            >
                                <Select placeholder="Chọn kho...">
                                    <Option value="POS">POS (Hồ Chí Minh)</Option>
                                    <Option value="POSHN">POSHN (Hà Nội)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="TicketDHG"
                                label="Số phiếu xuất kho"
                                rules={[{ required: true, message: "Nhập mã phiếu mượn" }]}
                            >
                                <Input prefix={<FileTextOutlined style={{ color: '#bfbfbf' }} />} placeholder="VD: SPDHG..." />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="totalexport"
                                label="Số lượng xuất"
                                rules={[{ required: true, message: "Nhập số lượng" }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={maxQuantity}
                                    style={{ width: "100%" }}
                                    placeholder="VD: 1"
                                    status={maxQuantity === 0 ? "error" : ""}
                                />
                            </Form.Item>
                        </Col>
                        {/* <Col span={8}>
                            <Form.Item
                                name="NameExport"
                                label="Người nhận hàng"
                                rules={[{ required: true, message: "Chọn người nhận" }]}
                            >
                                <Select
                                    loading={loadingUsers}
                                    showSearch
                                    placeholder="Nhân viên..."
                                    optionFilterProp="children"
                                >
                                    {users.filter((u) => u.Exportlister).map((u) => (
                                        <Option key={u.id} value={u.Name}>{u.Name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col> */}

                        <Col span={24}>
                            <Form.Item
                                name="SerialNumber"
                                label="Danh sách Serial Number (Mỗi dòng 1 số)"
                                rules={[{ required: true, message: "Bắt buộc nhập Serial" }]}
                            >
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Quét mã vạch hoặc nhập thủ công..."
                                    style={{ fontFamily: 'monospace' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="NameExport"
                                label="Người mượn hàng"
                                rules={[{ required: true, message: "Chọn người nhận" }]}
                            >
                                <Select
                                    loading={loadingUsers}
                                    showSearch
                                    placeholder="Chọn nhân viên..."
                                    optionFilterProp="children"
                                >
                                    {users.filter((u) => u.Exportlister).map((u) => (
                                        <Option key={u.id} value={u.Name}>{u.Name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider style={{ margin: '12px 0' }} dashed />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#888' }}>
                        <Space>
                            <UserOutlined /> Tạo bởi: <b>{userName || "N/A"}</b>
                        </Space>
                        <Space>
                            <BarcodeOutlined /> Mã phiếu: <Tag>{form.getFieldValue("Ticket")}</Tag>
                        </Space>
                    </div>
                </Card>

                {/* === FOOTER BUTTONS === */}
                <div className="form-actions">
                    <Button icon={<CloseOutlined />} onClick={onCancel} style={{ marginRight: 8 }}>
                        Hủy bỏ
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loadingSubmit}
                        onClick={handleSubmit}
                        disabled={maxQuantity === 0}
                    >
                        Lưu phiếu xuất
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddExportList;
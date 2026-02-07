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
  Tag,
  Button,
  Descriptions,
  Space
} from "antd";
import {
  UndoOutlined, // Icon cho việc hoàn trả/trả kho
  BarcodeOutlined,
  UserOutlined,
  CloseOutlined,
  SaveOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";

import { fetchUsers } from "../../../services/abicoServices";
import {
  createExportlists,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  updateExportlists,
} from "../../../services/dhgServices";
import "./AddExportList.scss"; // Tận dụng lại file SCSS đã tối ưu ở bước trước

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
  const [selectedModelInfo, setSelectedModelInfo] = useState(null);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetchUsers();
        setUsers(Array.isArray(res) ? res : (res?.data || []));
      } catch (error) {
        console.error("Lỗi khi fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWarehouseDetails();
        setProducts(Array.isArray(response) ? response : (response.data || []));
      } catch (error) {
        message.error("Lỗi khi tải danh sách sản phẩm");
      }
    };
    fetchData();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.account?.Name || "");
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      form.setFieldsValue({
        Ticket: generateInvoiceNumber(),
        NameCreate: userName,
      });
      setSelectedModelInfo(null);
      setModels([]);
    }
  }, [isModalOpen, form, userName]);

  /* ================= HANDLERS ================= */
  const handleProductChange = (productName) => {
    const productModels = products.filter((p) => p.ProductName === productName);
    setModels(productModels);
    setSelectedModelInfo(null);
    form.setFieldsValue({
      Model: undefined,
      DVT: undefined,
      totalexport: undefined,
      BrandName: undefined,
      Type: undefined,
      SerialNumber: "",
      idModel: undefined
    });
  };

  const handleModelChange = (model) => {
    const selected = models.find((m) => m.Model === model);
    if (selected) {
      setSelectedModelInfo(selected);
      form.setFieldsValue({
        DVT: selected.DVT,
        Type: selected.Type,
        BrandName: selected.BrandName,
        totalexport: undefined,
        idModel: selected.id || selected.documentId,
      });
    }
  };

  const handleOk = async () => {
    try {
      setLoadingSubmit(true);
      await form.validateFields();

      // Lấy toàn bộ giá trị từ form
      const formValues = form.getFieldsValue();

      // 1. Tách idModel ra khỏi payload (loại bỏ nó)
      // Các trường khác như BrandName, Type, DVT nếu có trong schema thì giữ lại,
      // nếu không cũng cần loại bỏ. Giả sử schema exportlist chỉ cần lưu thông tin cơ bản.
      const { idModel, ...payload } = formValues;

      // 2. Chuẩn bị dữ liệu gửi đi
      const finalPayload = {
        ...payload,
        NameCreate: userName,
        Ticket: payload.Ticket || generateInvoiceNumber(),
        Status: "Chờ duyệt",
        // Đảm bảo gửi đúng các trường có trong schema.json của exportlist
      };

      // --- TẠO PHIẾU ---
      const response = await createExportlists(finalPayload);
      const exportItem = response.data || response;

      // --- CẬP NHẬT KHO ---
      // Dùng tên Model từ form để tìm trong kho (thay vì idModel từ form để an toàn hơn)
      const warehouseList = await fetchWarehouseDetails();
      const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);

      // Tìm lại model trong kho để cộng số lượng
      const matched = warehouseData.find((w) => w.Model === finalPayload.Model);

      if (matched) {
        const {
          POS = 0,
          POSHN = 0,
          totalNTK = 0,
          inventoryCK = 0,
        } = matched; // Strapi v5 có thể cần matched.attributes nếu fetch kiểu cũ, nhưng v5 thường trả phẳng

        const soLuong = finalPayload.totalexport;

        // Logic cộng dồn
        const updatePayload = {
          POS: finalPayload.TypeKho === "POS" ? (POS || 0) + soLuong : POS,
          POSHN: finalPayload.TypeKho === "POSHN" ? (POSHN || 0) + soLuong : POSHN,
          totalNTK: (totalNTK || 0) + soLuong,
          inventoryCK: (inventoryCK || 0) + soLuong,
        };

        // Dùng documentId nếu có (ưu tiên cho Strapi v5), fallback về id
        const warehouseId = matched.documentId || matched.id;
        await updateWarehouseDetails(warehouseId, updatePayload);
      } else {
        message.warning("Không tìm thấy Model trong kho để cập nhật tồn.");
      }

      // --- UPDATE STATUS ---
      // Dùng documentId của exportItem vừa tạo
      const exportId = exportItem.documentId || exportItem.id;
      await updateExportlists(exportId, { Check: true });

      message.success("Trả kho POS/POSHN thành công!");
      form.resetFields();
      onCreated(exportItem);
      onCancel();
    } catch (error) {
      console.error("Lỗi:", error);
      // Hiển thị lỗi chi tiết từ Strapi nếu có
      if (error.response && error.response.data && error.response.data.error) {
        message.error(`Lỗi API: ${error.response.data.error.message}`);
      } else {
        message.error("Có lỗi xảy ra khi xử lý.");
      }
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
      className="add-export-list-modal" // Dùng chung class với file trước để ăn CSS
      title={
        <div className="modal-title-wrapper">
          <div className="icon-box" style={{ background: '#f6ffed' }}>
            <UndoOutlined style={{ color: '#52c41a' }} />
          </div>
          <div>
            <Title level={5} style={{ margin: 0 }}>Trả kho POS / POSHN</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>Nhập thiết bị trả về kho</Text>
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
                  {[...new Set(products.map(p => p.ProductName))].map((name, idx) => (
                    <Option key={idx} value={name}>{name}</Option>
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

          {/* Ẩn input để giữ logic submit */}
          <div style={{ display: 'none' }}>
            <Form.Item name="BrandName"><Input /></Form.Item>
            <Form.Item name="Type"><Input /></Form.Item>
            <Form.Item name="DVT"><Input /></Form.Item>
            <Form.Item name="Model"><Input /></Form.Item>
            <Form.Item name="NameCreate"><Input /></Form.Item>
            <Form.Item name="Ticket"><Input /></Form.Item>
          </div>

          {/* Hiển thị thông tin (Readonly) */}
          {selectedModelInfo && (
            <div className="info-box">
              <Descriptions column={3} size="small" layout="vertical">
                <Descriptions.Item label="Hãng SX">
                  <Tag color="blue">{selectedModelInfo.BrandName}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Loại">
                  {selectedModelInfo.Type}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn vị tính">
                  {selectedModelInfo.DVT}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Card>

        {/* === SECTION 2: CHI TIẾT TRẢ === */}
        <Card className="section-card mt-3" title="Chi tiết trả kho" size="small">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="TypeKho"
                label="Kho nhận (Trả về)"
                rules={[{ required: true, message: "Chọn kho nhận" }]}
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
                label="Số lượng trả"
                rules={[{ required: true, message: "Nhập số lượng" }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Nhập số lượng"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="SerialNumber"
                label="Danh sách Serial Number trả về"
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
                label="Người nhận hàng"
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
              <SafetyCertificateOutlined /> Mã hệ thống: <Tag>{form.getFieldValue("Ticket")}</Tag>
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
            onClick={handleOk}
            style={{ background: '#52c41a', borderColor: '#52c41a' }} // Màu xanh lá cho hành động Trả/Nhập
          >
            Hoàn tất trả kho
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddExportList;
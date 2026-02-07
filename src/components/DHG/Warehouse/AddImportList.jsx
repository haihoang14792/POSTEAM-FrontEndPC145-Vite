import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  notification,
  Descriptions,
  InputNumber,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Space,
  Tag
} from "antd";
import {
  ImportOutlined,
  UserOutlined,
  GoldOutlined,
  SaveOutlined,
  CloseOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import {
  createImportlists,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  updateImportlists,
} from "../../../services/dhgServices";
import dayjs from "dayjs";
import "./AddExportList.scss";

const { Option } = Select;
const { Text, Title } = Typography;

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `SPCDHG${year}${unique}`;
};

const AddImportList = ({ open, onClose, onConfirmSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);

  const [models, setModels] = useState([]);
  const [selectedModelInfo, setSelectedModelInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.account?.Name || "");
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const loadWarehouse = async () => {
      try {
        const res = await fetchWarehouseDetails();
        const data = Array.isArray(res) ? res : (res.data || []);
        setWarehouseList(data);
      } catch (error) {
        console.error("Lỗi khi tải kho:", error);
      }
    };
    if (open) {
      loadWarehouse();
      form.resetFields();
      setModels([]);
      setSelectedModelInfo(null);
      form.setFieldsValue({
        Ticket: generateInvoiceNumber(),
        NameImport: userName
      });
    }
  }, [open, form, userName]);

  const generateSerialNumbers = () => {
    const serialNumber = form.getFieldValue("serialNumber");
    if (serialNumber && serialNumber.trim()) return;

    const quantity = Number(form.getFieldValue("totalimport")) || 0;
    if (quantity <= 0) {
      message.warning("Vui lòng nhập số lượng trước khi tạo serial!");
      return;
    }

    const dateCode = dayjs().format("YYMM");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const serials = Array.from({ length: quantity }, () => {
      let randomPart = "";
      for (let i = 0; i < 5; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `DHG${dateCode}${randomPart}`;
    });

    form.setFieldsValue({ serialNumber: serials.join(", ") });
  };

  const handleProductChange = (productName) => {
    const productModels = warehouseList.filter((p) => p.ProductName === productName);
    setModels(productModels);
    setSelectedModelInfo(null);
    form.setFieldsValue({
      Model: undefined,
      BrandName: undefined,
      DVT: undefined,
      Type: undefined,
      serialNumber: "",
      totalimport: undefined
    });
  };

  const handleModelChange = (model) => {
    const selected = models.find((m) => m.Model === model);
    if (selected) {
      setSelectedModelInfo(selected);
      form.setFieldsValue({
        BrandName: selected.BrandName,
        DVT: selected.DVT,
        Type: selected.Type,
      });
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const matchedItem = warehouseList.find((item) => item.Model === values.Model);

      if (!matchedItem) {
        message.error("Model trong kho không khớp.");
        return;
      }

      const ticket = values.Ticket || generateInvoiceNumber();
      const importData = {
        ProductName: values.ProductName || matchedItem.ProductName,
        BrandName: values.BrandName || matchedItem.BrandName,
        Type: values.Type || matchedItem.Type,
        SerialNumber: values.serialNumber || "N/A",
        Ticket: ticket,
        NameImport: userName,
        totalimport: Number(values.totalimport) || 0,
        DVT: values.DVT || matchedItem.DVT,
        Model: values.Model || matchedItem.Model,
        TypeKho: "DHG",
        Check: true, // 🔥 Thêm luôn Check: true ở đây để tránh phải gọi update lần 2
      };

      // 1. Tạo phiếu nhập
      const createdImport = await createImportlists(importData);
      const importItem = createdImport.data || createdImport;

      // 🔥 SỬA QUAN TRỌNG: Ưu tiên lấy documentId cho Strapi v5
      const importId = importItem.documentId || importItem.id;

      // Nếu API create chưa set được Check: true (do logic backend), ta mới gọi update
      // Nhưng dùng ID chuẩn (documentId)
      if (importId && !importData.Check) {
        await updateImportlists(importId, { Check: true });
      }

      // 2. Cập nhật kho
      const kho = importData.TypeKho;
      const qty = importData.totalimport;
      const currentQty = matchedItem[kho] || 0;
      const currentNTK = matchedItem.totalNTK || 0;
      const currentCK = matchedItem.inventoryCK || 0;

      // 🔥 SỬA QUAN TRỌNG: Lấy ID kho chuẩn (documentId)
      const warehouseId = matchedItem.documentId || matchedItem.id;

      await updateWarehouseDetails(warehouseId, {
        [kho]: currentQty + qty,
        totalNTK: currentNTK + qty,
        inventoryCK: currentCK + qty,
      });

      notification.success({
        message: "Nhập kho thành công",
        description: `Đã nhập ${qty} ${importData.Model} vào kho DHG.`,
      });

      onConfirmSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      // Hiển thị chi tiết lỗi nếu có
      if (error.response?.data?.error?.message) {
        message.error(`Lỗi: ${error.response.data.error.message}`);
      } else {
        message.error("Có lỗi xảy ra khi nhập kho.");
      }
    } finally {
      setLoading(false);
    }
  };

  const productNameOptions = [...new Set(warehouseList.map((p) => p.ProductName))];

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={900}
      centered
      className="add-export-list-modal medium-size-modal"
      title={
        <div className="modal-title-wrapper">
          <div className="icon-box" style={{ background: '#e6f7ff', width: 40, height: 40 }}>
            <ImportOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Nhập kho thiết bị (DHG)</Title>
            <Text type="secondary">Tạo phiếu nhập mới vào kho tổng</Text>
          </div>
        </div>
      }
    >
      <Form form={form} layout="vertical" size="middle">

        <Card className="section-card" bordered={false}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="ProductName"
                label="Sản phẩm"
                rules={[{ required: true, message: "Chọn sản phẩm" }]}
              >
                <Select showSearch placeholder="Chọn tên thiết bị..." onChange={handleProductChange} style={{ width: '100%' }}>
                  {productNameOptions.map((name, idx) => (
                    <Option key={idx} value={name}>{name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Model"
                label="Model"
                rules={[{ required: true, message: "Chọn Model" }]}
              >
                <Select
                  placeholder="Chọn Model..."
                  disabled={!models.length}
                  showSearch
                  onChange={handleModelChange}
                  style={{ width: '100%' }}
                >
                  {models.map((m) => (
                    <Option key={m.id} value={m.Model}>{m.Model}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'none' }}>
            <Form.Item name="BrandName"><Input /></Form.Item>
            <Form.Item name="Type"><Input /></Form.Item>
            <Form.Item name="DVT"><Input /></Form.Item>
            <Form.Item name="Ticket"><Input /></Form.Item>
            <Form.Item name="NameImport"><Input /></Form.Item>
          </div>

          {selectedModelInfo && (
            <div className="info-box" style={{ padding: '16px 20px' }}>
              <Descriptions column={4} layout="vertical">
                <Descriptions.Item label="Hãng">
                  <Tag color="cyan" style={{ fontSize: 14, padding: '4px 10px' }}>{selectedModelInfo.BrandName}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Loại" contentStyle={{ fontWeight: 600 }}>
                  {selectedModelInfo.Type}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn vị" contentStyle={{ fontWeight: 600 }}>
                  {selectedModelInfo.DVT}
                </Descriptions.Item>
                <Descriptions.Item label="Tồn kho hiện tại">
                  <span style={{ color: '#1890ff', fontSize: 18, fontWeight: 'bold' }}>{selectedModelInfo.DHG || 0}</span>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Card>

        <Card className="section-card mt-3" title="Thông tin nhập hàng" style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="totalimport"
                label="Số lượng nhập"
                rules={[{ required: true, message: "Nhập SL" }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="VD: 10"
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                <Form.Item
                  name="serialNumber"
                  label="Danh sách Serial Number"
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="Nhập thủ công hoặc tạo tự động"
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>
                <Button
                  type="dashed"
                  icon={<ReloadOutlined />}
                  onClick={generateSerialNumbers}
                  style={{ height: 32 }}
                >
                  Tạo Auto
                </Button>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                * Nhấn "Tạo Auto" để hệ thống tự sinh mã Serial duy nhất.
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#666' }}>
            <Space size={8}>
              <UserOutlined /> Người nhập: <b>{userName || "N/A"}</b>
            </Space>
            <Space size={8}>
              <GoldOutlined /> Mã phiếu: <Tag color="blue" style={{ fontSize: 13 }}>{form.getFieldValue("Ticket")}</Tag>
            </Space>
          </div>
        </Card>

        <div className="form-actions" style={{ marginTop: 24, paddingTop: 16 }}>
          <Button
            size="middle"
            icon={<CloseOutlined />}
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            style={{ marginRight: 12, height: 40, padding: '0 24px' }}
          >
            Hủy
          </Button>
          <Button
            size="middle"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleOk}
            style={{ height: 40, padding: '0 24px', fontSize: 14 }}
          >
            Xác nhận nhập kho
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddImportList;
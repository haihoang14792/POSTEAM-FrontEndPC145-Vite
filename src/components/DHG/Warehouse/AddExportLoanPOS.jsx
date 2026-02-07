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
  Card,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  FileTextOutlined,
  ShopOutlined,
  CloseOutlined,
  SaveOutlined,
  UserOutlined,
  InfoCircleOutlined,
  BarcodeOutlined,
  TagsOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { createExportLoanTicket } from "../../../services/dhgServices";
import { fetchListCustomer } from "../../../services/storeServices";
import "./AddExportLoanPOS.scss";

const { Option } = Select;
const { Title, Text } = Typography;

function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `PXDHG${year}${unique}`;
}

const AddExportLoanPOS = ({ open, onClose, reloadTickets }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filteredStores, setFilteredStores] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  // Lấy thông tin user từ localStorage
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // useEffect(() => {
  //   if (open) {
  //     form.setFieldsValue({
  //       Votes: generateInvoiceNumber(),
  //       Person: account.Name,
  //       Status: "Đang tạo phiếu",
  //     });
  //   }
  // }, [open, form, account.Name]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchListCustomer();
        // Xử lý dữ liệu trả về tùy theo phiên bản Strapi
        const data = Array.isArray(res) ? res : res.data || [];
        setCustomerList(data);

        // Lấy danh sách Customer duy nhất
        const uniqueCustomers = Array.from(
          new Set(data.map((item) => item.Customer))
        ).map((customer) => ({
          label: customer,
          value: customer,
        }));

        setCustomerOptions(uniqueCustomers);
      } catch (error) {
        message.error("Không thể tải danh sách cửa hàng!");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCustomer || selectedCustomer === "Khác") {
      setFilteredStores([]);
      form.setFieldsValue({ Store: undefined, DeliveryAddress: undefined });
      return;
    }
    const result = customerList.filter(
      (item) => item.Customer === selectedCustomer && item.Status
    );
    setFilteredStores(result);
  }, [selectedCustomer, customerList, form]);

  const handleStoreChange = (value) => {
    form.setFieldsValue({ Store: value });
    const selectedStore = filteredStores.find(
      (store) => store.StoreID === value
    );
    if (selectedStore) {
      form.setFieldsValue({ DeliveryAddress: selectedStore.Address });
    } else {
      form.setFieldsValue({ DeliveryAddress: undefined });
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await createExportLoanTicket(values);
      if (reloadTickets) await reloadTickets();

      // Nếu service của bạn chưa có thông báo, hãy bật dòng dưới:
      // message.success("🎉 Tạo phiếu thành công!");
      message.success("🎉 Tạo phiếu thành công!");

      onClose();
      form.resetFields();
    } catch (error) {
      // Lỗi validation hoặc lỗi API đã được xử lý ở service/form
      if (!error.errorFields) {
        message.error("❌ Lỗi khi tạo phiếu!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Header Title Animation
  const modalTitle = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: "flex", alignItems: "center", gap: 12, overflow: "hidden" }}
    >
      <div
        style={{
          backgroundColor: "#e6f7ff",
          padding: 8,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <FileTextOutlined style={{ fontSize: 20, color: "#1890ff" }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <Title
          level={5}
          style={{
            margin: 0,
            color: "#1f1f1f",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Tạo Phiếu Dịch Vụ
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Nhập thông tin xuất/mượn
        </Text>
      </div>
    </motion.div>
  );

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onClose}
      width={800}
      centered
      destroyOnClose
      style={{ top: 20, maxWidth: "100vw", paddingBottom: 0 }}
      // --- PHẦN QUAN TRỌNG ĐỂ FIX TRÀN MÀN HÌNH ---
      styles={{
        body: {
          maxHeight: "calc(100vh - 220px)",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px",
        }
      }}
      // ---------------------------------------------
      className="add-export-loan-modal"
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleCreate}
            loading={loading}
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
          >
            Tạo Phiếu
          </Button>
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            Votes: generateInvoiceNumber(),
            Person: account.Name,
            Status: "Đang tạo phiếu",
          }}
          size="middle"
          requiredMark="optional"
        >
          {/* --- SECTION 1: THÔNG TIN CƠ BẢN --- */}
          <Card
            bordered={false}
            className="shadow-sm"
            style={{ marginBottom: 16, background: "#fff" }}
            styles={{ body: { padding: 0 } }}
          >
            <Row gutter={[16, 0]}>
              {/* xs=24: Mobile 1 cột | sm=12: Tablet 2 cột */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mã Số Phiếu"
                  name="Votes"
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<BarcodeOutlined style={{ color: "#bfbfbf" }} />}
                    readOnly
                    variant="filled"
                    style={{ fontWeight: "bold", width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Ticket Dingtalk"
                  name="Ticket"
                  rules={[{ required: true, message: "Nhập mã Ticket!" }]}
                >
                  <Input
                    prefix={<TagsOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="VD: #123456"
                    allowClear
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* --- SECTION 2: KHÁCH HÀNG (Box nền xám nhẹ) --- */}
          <Card
            type="inner"
            title={
              <Space>
                <ShopOutlined /> <span style={{ fontSize: 14 }}>Khách Hàng & Địa Điểm</span>
              </Space>
            }
            style={{
              marginBottom: 16,
              backgroundColor: "#f9f9f9",
              border: "1px solid #f0f0f0",
            }}
            styles={{
              header: {
                borderBottom: "1px solid #e8e8e8",
                minHeight: 40,
                padding: "0 12px"
              },
              body: {
                padding: "16px 12px"
              }
            }}
          >
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Khách Hàng"
                  name="Customer"
                  rules={[{ required: true, message: "Chọn khách hàng!" }]}
                >
                  <Select
                    placeholder="Chọn khách hàng"
                    showSearch
                    allowClear
                    onChange={(value) => {
                      setSelectedCustomer(value);
                      form.setFieldsValue({ Store: undefined, DeliveryAddress: undefined });
                    }}
                    optionFilterProp="children"
                    style={{ width: "100%" }}
                  >
                    {customerOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Cửa Hàng"
                  name="Store"
                  rules={[{ required: true, message: "Chọn cửa hàng!" }]}
                >
                  {filteredStores.length > 0 ? (
                    <Select
                      placeholder="Chọn cửa hàng"
                      showSearch
                      allowClear
                      onChange={handleStoreChange}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      style={{ width: "100%" }}
                    >
                      {filteredStores.map((store) => (
                        <Option key={store.id} value={store.StoreID}>{store.StoreID}</Option>
                      ))}
                    </Select>
                  ) : (
                    <Input placeholder="Nhập thủ công..." style={{ width: "100%" }} />
                  )}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Địa Chỉ" name="DeliveryAddress">
                  <Input
                    prefix={<EnvironmentOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Địa chỉ giao hàng..."
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* --- SECTION 3: THÔNG TIN KHÁC --- */}
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Người Tạo" name="Person">
                <Input
                  prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                  readOnly
                  variant="borderless"
                  style={{ paddingLeft: 0, color: "#1890ff", width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Trạng Thái" name="Status">
                <Input
                  prefix={<InfoCircleOutlined style={{ color: "#bfbfbf" }} />}
                  readOnly
                  variant="borderless"
                  style={{ paddingLeft: 0, color: "#faad14", width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item label="Ghi Chú" name="Note">
                <Input.TextArea
                  placeholder="Ghi chú thêm..."
                  rows={2}
                  maxLength={500}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </motion.div>
    </Modal>
  );
};

export default AddExportLoanPOS;
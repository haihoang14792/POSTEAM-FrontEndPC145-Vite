


import React from 'react';
import { Modal, Form, Input, message, Select, Row, Col, Divider } from 'antd';
import {
  PlusCircleOutlined,
  BarcodeOutlined,
  TagOutlined,
  AppstoreAddOutlined,
  NumberOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { createWarehouseDetails } from '../../../services/dhgServices';
import './AddProductModal.scss';

const { Option } = Select;

const AddProductModal = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Gán mặc định các trường tồn kho = 0 theo logic của bạn
      const payload = {
        ...values,
        inventoryDK: 0,
        totalNTK: 0,
        totalXTK: 0,
        inventoryCK: 0,
        DHG: 0,
        POS: 0,
        POSHN: 0,
      };

      const response = await createWarehouseDetails(payload);

      // Kiểm tra phản hồi (tùy vào cấu trúc API thực tế trả về)
      if (response) {
        message.success("Tạo sản phẩm mới thành công!");
        form.resetFields();
        onCreated(response.data || response); // Fallback nếu data nằm trực tiếp hoặc trong .data
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi tạo sản phẩm!");
    }
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <PlusCircleOutlined className="icon-header" />
          <span className="title-text">Thêm Sản Phẩm Mới</span>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu sản phẩm"
      cancelText="Hủy bỏ"
      width={700}
      centered
      className="add-product-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="form-content"
      >
        <div className="form-section-title">Thông tin cơ bản</div>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Tên sản phẩm"
              name="ProductName"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
              <Input
                prefix={<ExperimentOutlined />}
                placeholder="Ví dụ: Máy in nhiệt Epson TM-T82III"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Model (Mã sản phẩm)"
              name="Model"
              rules={[{ required: true, message: 'Vui lòng nhập Model!' }]}
            >
              <Input
                prefix={<BarcodeOutlined />}
                placeholder="Ví dụ: EPSON-T82III"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Thương hiệu"
              name="BrandName"
              rules={[{ required: true, message: 'Vui lòng nhập thương hiệu!' }]}
            >
              <Input
                prefix={<TagOutlined />}
                placeholder="Ví dụ: Epson, Dell, HP..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '10px 0 24px' }} />

        <div className="form-section-title">Phân loại & Đơn vị</div>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Loại thiết bị"
              name="Type"
              rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
            >
              <Select
                placeholder="Chọn loại"
                suffixIcon={<AppstoreAddOutlined />}
                allowClear
              >
                <Option value="Thiết bị">Thiết bị</Option>
                <Option value="Phụ kiện">Phụ kiện</Option>
                <Option value="Linh kiện">Linh kiện</Option>
                <Option value="Vật tư">Vật tư</Option>
                <Option value="Phần mềm">Phần mềm</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Đơn vị tính"
              name="DVT"
              rules={[{ required: true, message: 'Vui lòng chọn đơn vị tính!' }]}
            >
              <Select
                placeholder="Chọn đơn vị"
                suffixIcon={<NumberOutlined />}
              >
                <Option value="Cái">Cái</Option>
                <Option value="Bộ">Bộ</Option>
                <Option value="Chiếc">Chiếc</Option>
                <Option value="Thùng">Thùng</Option>
                <Option value="Cuộn">Cuộn</Option>
                <Option value="Hộp">Hộp</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
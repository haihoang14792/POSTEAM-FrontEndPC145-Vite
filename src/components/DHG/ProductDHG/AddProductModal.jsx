import React from 'react';
import { Modal, Form, Input, message, Select, Descriptions } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { createWarehouseDetails } from '../../../services/dhgServices';
import './AddProductModal.scss';

const { Option } = Select;

const AddProductModal = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Gán các trường tồn kho = 0
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
      message.success("Tạo sản phẩm thành công!");
      form.resetFields();
      onCreated(response.data);
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi tạo sản phẩm!");
    }
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <PlusCircleOutlined className="icon" />
          <span className="title">Thêm Sản Phẩm</span>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      width={700}
      className="add-product-modal"
    >
      <Form form={form} layout="vertical">
        <Descriptions bordered column={2} size="small">
          
          <Descriptions.Item label="Tên sản phẩm">
            <Form.Item
              name="ProductName"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              noStyle
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Model">
            <Form.Item
              name="Model"
              rules={[{ required: true, message: 'Vui lòng nhập model!' }]}
              noStyle
            >
              <Input placeholder="Nhập model" />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Thương hiệu">
            <Form.Item
              name="BrandName"
              rules={[{ required: true, message: 'Vui lòng nhập thương hiệu!' }]}
              noStyle
            >
              <Input placeholder="Nhập thương hiệu" />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Đơn vị tính">
            <Form.Item
              name="DVT"
              rules={[{ required: true, message: 'Chọn đơn vị tính!' }]}
              noStyle
            >
              <Select placeholder="Chọn đơn vị tính">
                <Option value="Cái">Cái</Option>
                <Option value="Bộ">Bộ</Option>
                <Option value="Cuộn">Cuộn</Option>
                <Option value="Chiếc">Chiếc</Option>
                <Option value="Thùng">Thùng</Option>
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Loại sản phẩm">
            <Form.Item
              name="Type"
              rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
              noStyle
            >
              <Select
                placeholder="Chọn loại sản phẩm"
                style={{ width: 170 }}
              >
                <Option value="Thiết bị">Thiết bị</Option>
                <Option value="Phụ kiện">Phụ kiện</Option>
                <Option value="Linh kiện">Linh kiện</Option>
                <Option value="Vật tư">Vật tư</Option>
                <Option value="Phần mềm">Phần mềm</Option>
              </Select>
            </Form.Item>
          </Descriptions.Item>
          
        </Descriptions>
      </Form>
    </Modal>
  );
};

export default AddProductModal;


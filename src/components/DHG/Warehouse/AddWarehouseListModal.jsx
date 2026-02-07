import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { createWarehouse } from '../../../services/dhgServices';
import './AddWarehouseListModal.scss';

const AddWarehouseListModal = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await createWarehouse(values);
            message.success("Tạo kho thành công!");
            form.resetFields();
            onCreated(response.data);
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo kho");
            console.error(error);
        }
    };

    return (
        <Modal
            title={
                <div className="modal-header">
                    <PlusCircleOutlined className="icon" />
                    <span className="title">Thêm Kho</span>
                </div>
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Hủy"
            className="add-warehouse-modal"
            bodyClassName="modal-body"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên Kho"
                    name="NameKho"
                    rules={[{ required: true, message: 'Vui lòng nhập tên kho!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập tên kho" className="input" />
                </Form.Item>
                <Form.Item
                    label="Mô tả kho"
                    name="DescriptionKho"
                    rules={[{ message: 'Vui lòng nhập mô tả!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập mô tả" className="input" />
                </Form.Item>
                <Form.Item
                    label="Kiểu kho"
                    name="TypeKho"
                    rules={[
                        { required: true, message: 'Vui lòng nhập kiểu kho!' }
                    ]}
                    className="form-item"
                >
                    <Input placeholder="Kiểu kho" className="input" />
                </Form.Item>
                <Form.Item
                    label="Địa chỉ"
                    name="Address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập địa chỉ" className="input" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddWarehouseListModal;

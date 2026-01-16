import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { createSupplier } from '../../../services/dhgServices';
import './AddSupplierModal.scss';

const AddSupplierModal = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await createSupplier(values);
            message.success("Tạo nhà cung cấp thành công!");
            form.resetFields();
            onCreated(response.data);
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo nhà cung cấp");
            console.error(error);
        }
    };

    return (
        <Modal
            title={
                <div className="modal-header">
                    <PlusCircleOutlined className="icon" />
                    <span className="title">Thêm Nhà Cung Cấp</span>
                </div>
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Hủy"
            className="add-supplier-modal"
            bodyClassName="modal-body"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên Nhà Cung Cấp"
                    name="NameNCC"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập tên nhà cung cấp" className="input" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="Phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập số điện thoại" className="input" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                    className="form-item"
                >
                    <Input placeholder="Nhập email" className="input" />
                </Form.Item>
                <Form.Item
                    label="Sản phẩm"
                    name="Product"
                    rules={[{ required: true, message: 'Vui lòng nhập sản phẩm!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập sản phẩm" className="input" />
                </Form.Item>
                <Form.Item
                    label="Người liên hệ"
                    name="NameContact"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người liên hệ!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập tên người liên hệ" className="input" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSupplierModal;

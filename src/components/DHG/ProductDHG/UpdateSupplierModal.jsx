


import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { updateSupplier } from '../../../services/dhgServices';
import './UpdateSupplierModal.scss';

const UpdateSupplierModal = ({ isModalOpen, onCancel, supplierData, onUpdated = () => { } }) => {
    const [form] = Form.useForm();

    // Khi mở modal, set giá trị mặc định từ supplierData
    useEffect(() => {
        if (supplierData) {
            // Strapi v5: Dữ liệu đã phẳng, không cần .attributes
            form.setFieldsValue({
                NameNCC: supplierData.NameNCC,
                Phone: supplierData.Phone,
                Email: supplierData.Email,
                Product: supplierData.Product,
                NameContact: supplierData.NameContact,
            });
        }
    }, [supplierData, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // Strapi v5: Ưu tiên dùng documentId nếu có, nếu không thì dùng id
            const updateId = supplierData.documentId || supplierData.id;

            // Gọi API cập nhật
            const response = await updateSupplier(updateId, values);

            // Strapi v5: Response trả về thường nằm trong property 'data' hoặc trả về trực tiếp tùy config axios
            const updatedRecord = response.data || response;

            message.success("Cập nhật nhà cung cấp thành công!");
            form.resetFields();

            // Gửi dữ liệu mới về component cha để cập nhật danh sách
            onUpdated(updatedRecord);
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật nhà cung cấp");
            console.error(error);
        }
    };

    return (
        <Modal
            title={
                <div className="modal-header">
                    <EditOutlined className="icon" />
                    <span className="title">Cập nhật Nhà Cung Cấp</span>
                </div>
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Cập nhật"
            cancelText="Hủy"
            className="update-supplier-modal"
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

export default UpdateSupplierModal;
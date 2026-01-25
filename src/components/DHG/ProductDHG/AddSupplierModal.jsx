

import React from 'react';
import { Modal, Form, Input, message, Row, Col, Divider } from 'antd';
import { PlusCircleOutlined, UserOutlined, PhoneOutlined, MailOutlined, ShopOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { createSupplier } from '../../../services/dhgServices';
import './AddSupplierModal.scss';

const AddSupplierModal = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // Gọi API tạo mới
            const response = await createSupplier(values);

            message.success("Tạo nhà cung cấp thành công!");
            form.resetFields();

            // Trả dữ liệu về component cha để cập nhật list ngay lập tức
            if (response && response.data) {
                onCreated(response.data);
            } else {
                // Fallback nếu API trả về cấu trúc khác
                onCreated(values);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo nhà cung cấp");
            console.error(error);
        }
    };

    return (
        <Modal
            title={
                <div className="modal-header">
                    <PlusCircleOutlined className="icon-header" />
                    <span className="title-text">Thêm Nhà Cung Cấp Mới</span>
                </div>
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Lưu lại"
            cancelText="Hủy bỏ"
            className="add-supplier-modal"
            width={700} // Tăng chiều rộng để chia cột đẹp hơn
            centered
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{}}
            >
                <div className="form-section-title">Thông tin chung</div>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên Nhà Cung Cấp"
                            name="NameNCC"
                            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }]}
                        >
                            <Input prefix={<ShopOutlined />} placeholder="Ví dụ: Công ty TNHH ABC" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Sản phẩm cung cấp"
                            name="Product"
                            rules={[{ required: true, message: 'Vui lòng nhập sản phẩm!' }]}
                        >
                            <Input prefix={<AppstoreAddOutlined />} placeholder="Ví dụ: Văn phòng phẩm, Máy tính..." />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ margin: '10px 0 20px' }} />

                <div className="form-section-title">Thông tin liên hệ</div>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Người liên hệ"
                            name="NameContact"
                            rules={[{ required: true, message: 'Vui lòng nhập tên người liên hệ!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Họ và tên người liên hệ" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="Phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="0901xxxxxx" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label="Email"
                            name="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="contact@example.com" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AddSupplierModal;
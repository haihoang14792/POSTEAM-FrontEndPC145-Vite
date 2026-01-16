import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
// Giả sử bạn có một hàm service cập nhật warehouse, tương tự như createSupplier.
import { updateWarehouse } from '../../../services/dhgServices';
import './UpdateWarehouseListModal.scss';

const UpdateWarehouseListModal = ({ isModalOpen, onCancel, warehouseData, onUpdated = () => { } }) => {
    const [form] = Form.useForm();

    // Khi mở modal, set giá trị mặc định từ warehouseData
    useEffect(() => {
        if (warehouseData) {
            form.setFieldsValue({
                NameKho: warehouseData.attributes.NameKho,
                DescriptionKho: warehouseData.attributes.DescriptionKho,
                TypeKho: warehouseData.attributes.TypeKho,
                Address: warehouseData.attributes.Address,
            });
        }
    }, [warehouseData, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // Gọi API cập nhật với ID của warehouse và giá trị mới
            const response = await updateWarehouse(warehouseData.id, values);
            message.success("Cập nhật tên kho thành công!");
            form.resetFields();
            onUpdated(response.data);
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật tên kho");
            console.error(error);
        }
    };

    return (
        <Modal
            title={
                <div className="modal-header">
                    <EditOutlined className="icon" />
                    <span className="title">Cập nhật tên kho</span>
                </div>
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Cập nhật"
            cancelText="Hủy"
            className="update-warehouse-modal"
            bodyClassName="modal-body"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên Nhà Cung Cấp"
                    name="NameKho"
                    rules={[{ required: true, message: 'Vui lòng nhập tên kho!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập tên kho" className="input" />
                </Form.Item>
                <Form.Item
                    label="Mô tả kho"
                    name="DescriptionKho"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả kho!' }]}
                    className="form-item"
                >
                    <Input placeholder="Nhập mô tả kho" className="input" />
                </Form.Item>
                <Form.Item
                    label="Kiểu kho"
                    name="TypeKho"
                    rules={[
                        { required: true, message: 'Vui lòng nhập kiểu kho!' },
                    ]}
                    className="form-item"
                >
                    <Input placeholder="Nhập kiểu kho" className="input" />
                </Form.Item>
                <Form.Item
                    label="Address"
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

export default UpdateWarehouseListModal;

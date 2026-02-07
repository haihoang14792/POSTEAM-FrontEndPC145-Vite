import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { updateWarehouse } from '../../../services/dhgServices';
import './UpdateWarehouseListModal.scss';

const UpdateWarehouseListModal = ({ isModalOpen, onCancel, warehouseData, onUpdated = () => { } }) => {
    const [form] = Form.useForm();

    // Khi mở modal, set giá trị mặc định từ warehouseData
    useEffect(() => {
        if (warehouseData) {
            // Sửa: Strapi v5 dữ liệu phẳng, không còn .attributes
            form.setFieldsValue({
                NameKho: warehouseData.NameKho,
                DescriptionKho: warehouseData.DescriptionKho,
                TypeKho: warehouseData.TypeKho,
                Address: warehouseData.Address,
            });
        }
    }, [warehouseData, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // Strapi v5: Nên ưu tiên dùng documentId nếu có, hoặc id
            const updateId = warehouseData.documentId || warehouseData.id;

            // Gọi API cập nhật
            const response = await updateWarehouse(updateId, values);

            // Strapi v5: response thường là object đã update hoặc nằm trong data
            const updatedRecord = response.data || response;

            message.success("Cập nhật tên kho thành công!");
            form.resetFields();
            onUpdated(updatedRecord);
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
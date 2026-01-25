

import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, InputNumber, Button, notification, Input, Descriptions, Tag } from 'antd';
import { updateSupplierDetail } from '../../../services/dhgServices';
import Draggable from 'react-draggable';

const UpdateProductSupplierDetail = ({ open, onClose, invoice, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const nodeRef = useRef(null);

  // Khi modal mở, set giá trị form từ invoice
  useEffect(() => {
    if (invoice) {
      // Sửa: bỏ .attributes
      form.setFieldsValue({
        productName: invoice.ProductName,
        warranty: invoice.Warranty,
        status: invoice.Status,
      });
    }
  }, [invoice, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = { Warranty: values.warranty };

      // Strapi v5: Ưu tiên dùng documentId để update, fallback về id
      const updateId = invoice.documentId || invoice.id;

      await updateSupplierDetail(updateId, payload);

      // Sửa: update trực tiếp vào object phẳng, không cần lồng attributes
      onUpdateSuccess({
        ...invoice,
        Warranty: values.warranty
      });

      notification.success({
        message: 'Cập nhật thành công',
        // Sửa: bỏ .attributes
        description: `Sản phẩm ${invoice.ProductName} đã được cập nhật.`,
      });
      onClose();
    } catch (error) {
      notification.error({
        message: 'Cập nhật thất bại',
        description: 'Có lỗi khi cập nhật phiếu.',
      });
    }
  };

  // Sửa: bỏ .attributes
  const isEditable = invoice?.Status !== 'Đã nhập kho';

  return (
    <Modal
      title={
        <div
          style={{ cursor: 'move' }}
          onMouseDown={() => setDisabled(false)}
          onMouseUp={() => setDisabled(true)}
        >
          Cập nhật phiếu nhập hàng
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} disabled={!isEditable}>
          Lưu
        </Button>,
      ]}
      modalRender={(modal) => (
        <Draggable nodeRef={nodeRef} disabled={disabled}>
          <div ref={nodeRef} style={{ width: '100%' }}>
            {modal}
          </div>
        </Draggable>
      )}
    >
      <Form form={form} layout="vertical">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Tên sản phẩm">
            <Form.Item name="productName" noStyle>
              <Input disabled />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={isEditable ? 'orange' : 'green'}>
              {/* Sửa: bỏ .attributes */}
              {invoice?.Status || ''}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Số tháng bảo hành">
            <Form.Item
              name="warranty"
              noStyle
              rules={[{ required: true, message: 'Vui lòng nhập số tháng bảo hành' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} disabled={!isEditable} />
            </Form.Item>
          </Descriptions.Item>

          {/* Nếu còn các thông tin khác muốn hiển thị thì thêm tương tự ở đây */}
        </Descriptions>
      </Form>
    </Modal>
  );
};

export default UpdateProductSupplierDetail;
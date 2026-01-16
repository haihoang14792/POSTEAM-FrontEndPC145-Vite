// import React, { useEffect, useState, useRef } from 'react';
// import { Modal, Form, InputNumber, Button, Row, Col, notification, Input } from 'antd';
// import { updateSupplierDetail } from '../../../services/dhgServices';
// import Draggable from 'react-draggable';;

// const UpdateProductSupplierDetail = ({ open, onClose, invoice, onUpdateSuccess }) => {
//     const [form] = Form.useForm();
//     const [disabled, setDisabled] = useState(true);
//     const nodeRef = useRef(null); // Tạo ref mới


//     // Khi modal mở, set giá trị form từ invoice
//     useEffect(() => {
//         if (invoice) {
//             form.setFieldsValue({
//                 productName: invoice.attributes.ProductName,
//                 warranty: invoice.attributes.Warranty,
//             });
//         }
//     }, [invoice, form]);


//     const handleSave = async () => {
//         try {
//             const values = await form.validateFields();
//             const payload = { Warranty: values.warranty };
//             const updatedInvoice = await updateSupplierDetail(invoice.id, payload);

//             onUpdateSuccess({ ...invoice, attributes: { ...invoice.attributes, Warranty: values.warranty } });

//             notification.success({
//                 message: 'Cập nhật thành công',
//                 description: `Sản phẩm ${invoice.attributes.ProductName} đã được cập nhật.`,
//             });
//             onClose();
//         } catch (error) {
//             notification.error({
//                 message: 'Cập nhật thất bại',
//                 description: 'Có lỗi khi cập nhật phiếu.',
//             });
//         }
//     };

//     const isEditable = invoice?.attributes?.Status !== 'Đã nhập kho';

//     return (
//         <Modal
//             title={
//                 <div
//                     style={{ cursor: 'move' }}
//                     onMouseDown={() => setDisabled(false)}
//                     onMouseUp={() => setDisabled(false)}
//                 >
//                     Cập nhật phiếu nhập hàng
//                 </div>
//             }
//             open={open}
//             onCancel={onClose}
//             width={800}
//             footer={[
//                 <Button key="cancel" onClick={onClose}>Hủy</Button>,
//                 <Button key="save" type="primary" onClick={handleSave}>Lưu</Button>,
//             ]}
//             modalRender={(modal) => (
//                 <Draggable nodeRef={nodeRef} disabled={disabled}>
//                     <div ref={nodeRef} style={{ width: '100%' }}>
//                         {modal}
//                     </div>
//                 </Draggable>
//             )}
//         >
//             <Form form={form} layout="vertical" >
//                 <Row gutter={16}>
//                     <Col span={12}>
//                         <Form.Item
//                             name="productName"
//                             label="Tên sản phẩm"
//                             rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
//                         >
//                             <Input style={{ width: '100%' }} disabled />
//                         </Form.Item>
//                     </Col>
//                     <Col span={8}>
//                         <Form.Item
//                             name="warranty"
//                             label="Số tháng"
//                             rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
//                         >
//                             <InputNumber style={{ width: '100%' }} disabled={!isEditable} />
//                         </Form.Item>
//                     </Col>
//                 </Row>
//             </Form>
//         </Modal>
//     );
// };

// export default UpdateProductSupplierDetail;

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
      form.setFieldsValue({
        productName: invoice.attributes.ProductName,
        warranty: invoice.attributes.Warranty,
        status: invoice.attributes.Status,
      });
    }
  }, [invoice, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = { Warranty: values.warranty };
      const updatedInvoice = await updateSupplierDetail(invoice.id, payload);

      onUpdateSuccess({ ...invoice, attributes: { ...invoice.attributes, Warranty: values.warranty } });

      notification.success({
        message: 'Cập nhật thành công',
        description: `Sản phẩm ${invoice.attributes.ProductName} đã được cập nhật.`,
      });
      onClose();
    } catch (error) {
      notification.error({
        message: 'Cập nhật thất bại',
        description: 'Có lỗi khi cập nhật phiếu.',
      });
    }
  };

  const isEditable = invoice?.attributes?.Status !== 'Đã nhập kho';

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
              {invoice?.attributes?.Status || ''}
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

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, notification, Descriptions } from 'antd';
import { fetchListSupplier, updateSupplierForm } from '../../../services/dhgServices';
import { fetchListCustomer } from "../../../services/strapiServices";
import Draggable from 'react-draggable';
import dayjs from 'dayjs';

const { Option } = Select;

const UpdatePurchaseOrderModal = ({ open, onClose, invoice, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const nodeRef = useRef(null);
    const [customersData, setCustomersData] = useState([]); // ✅ Lưu toàn bộ khách hàng
  const [filteredStoreIDs, setFilteredStoreIDs] = useState([]); // ✅ StoreID theo customer

  // Format tiền
  const currencyFormatter = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);

  //const currencyParser = (value) => value.replace(/[₫,\s]/g, '');
const currencyParser = (value) => (value ? value.replace(/[₫,\s]/g, '') : '');

  const onFormValuesChange = useCallback((_, allValues) => {
  const quantity = Number(allValues.quantity || 0);
  const unitPrice = Number(allValues.unitPrice || 0);
  const vatRate = Number(allValues.vatRate || 0); // lấy từ form
  const totalAmount = quantity * unitPrice;
  const vat = Math.round(totalAmount * (vatRate / 100));
  const amountSupplier = totalAmount + vat;
  form.setFieldsValue({ totalAmount, vat, amountSupplier });
}, [form]);

  useEffect(() => {
    if (open) {
      fetchListSupplier()
        .then((data) => setSuppliers(data?.data || []))
        .catch(() => notification.error({ message: 'Lỗi tải nhà cung cấp' }));
              // ✅ Lấy danh sách khách hàng + StoreID
      fetchListCustomer()
        .then(data => setCustomersData(data?.data || []))
        .catch(() => notification.error({ message: 'Lỗi tải khách hàng' }));
    }
  }, [open]);

  // ✅ Hàm lọc storeID theo customer
  const handleCustomerChange = useCallback((customerName) => {
    if (customerName) {
      const storeList = customersData
        .filter(c => c.attributes.Customer === customerName)
        .map(c => c.attributes.StoreID);
      setFilteredStoreIDs(storeList);
      form.setFieldsValue({ storeID: undefined });
    } else {
      setFilteredStoreIDs([]);
      form.setFieldsValue({ storeID: undefined });
    }
  }, [customersData, form]);


  useEffect(() => {
    if (invoice) {
      form.setFieldsValue({
        productName: invoice?.attributes?.ProductName || '',
        model: invoice?.attributes?.Model || '',
        invoiceNumber: invoice?.attributes?.InvoiceNumber || '',
        invoiceDate: invoice?.attributes?.InvoiceDate ? dayjs(invoice.attributes.InvoiceDate) : null,
        supplierName: invoice?.attributes?.NameNCC || '',
        note: invoice?.attributes?.Note || '',
        shippingAddress: invoice?.attributes?.ShippingAddress || '',
        serialNumber: invoice?.attributes?.SerialNumber || '',
        quantity: invoice?.attributes?.Qty || 0,
        unitPrice: invoice?.attributes?.UnitPrice || 0,
        vat: invoice?.attributes?.Vat || 0,
        totalAmount: invoice?.attributes?.TotalAmount || 0,
        amountSupplier: invoice?.attributes?.AmountSupplier || 0,
        status: invoice?.attributes?.Status || '',
        brandName : invoice?.attributes?.BrandName || '',
        type : invoice?.attributes?.Type || '',
        vatRate : invoice?.attributes?.VatRate || '',
          customer: invoice?.attributes?.Customer || '',
  storeID: invoice?.attributes?.StoreID || '',
      });
          if (invoice?.attributes?.Customer) {
      handleCustomerChange(invoice.attributes.Customer);
    }
    }
  }, [invoice, form , handleCustomerChange]);

  const isEditable = invoice?.attributes?.Status !== 'Đã nhận hàng';

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ProductName: values.productName,
        Model: values.model,
        InvoiceNumber: values.invoiceNumber,
        InvoiceDate: values.invoiceDate ? values.invoiceDate.format('YYYY-MM-DD') : null,
        NameNCC: values.supplierName,
        Note: values.note,
        ShippingAddress: values.shippingAddress,
        SerialNumber: values.serialNumber,
        Qty: values.quantity,
        UnitPrice: values.unitPrice,
        Vat: values.vat,
        TotalAmount: values.totalAmount,
        AmountSupplier: values.amountSupplier,
        Status: values.status,
        VatRate: values.vatRate,
        Customer: values.customer,
StoreID: values.storeID,
      };
      await updateSupplierForm(invoice.id, payload);
      notification.success({
        message: 'Cập nhật thành công',
        description: `Phiếu ${invoice.attributes.Ticket} đã được cập nhật.`,
      });
      onUpdateSuccess();
    } catch (error) {
      notification.error({ message: 'Lỗi khi cập nhật phiếu' });
      console.error(error);
    }
  };

// Hàm tính chiều rộng dropdown theo dữ liệu
const getDropdownWidth = (options) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '14px Arial';
  let maxWidth = 0;
  options.forEach(opt => {
    const metrics = context.measureText(opt.label || '');
    if (metrics.width > maxWidth) {
      maxWidth = metrics.width;
    }
  });
  return maxWidth + 40; // padding + scroll
};

  // const generateSerialNumbers = () => {
  //   const serialNumber = form.getFieldValue('serialNumber');
  //   if (serialNumber && serialNumber.trim()) return; // Đã có serial thì không tạo

  //   const quantity = form.getFieldValue('quantity') || 0;
  //   if (quantity <= 0) return; // Không tạo nếu chưa nhập số lượng
  //   const today = dayjs().format('YYYYMMDD');
  //   const serials = [];
  //   for (let i = 0; i < quantity; i++) {
  //     const randomNum = Math.floor(1000 + Math.random() * 9000);
  //     serials.push(`DHG${today}${randomNum}${i}`);
  //   }
  //   form.setFieldsValue({ serialNumber: serials.join(', ') });
  // };

  const generateSerialNumbers = () => {
  const serialNumber = form.getFieldValue('serialNumber');
  if (serialNumber && serialNumber.trim()) return; // Đã có serial thì không tạo

  const quantity = Number(form.getFieldValue('quantity')) || 0;
  if (quantity <= 0) return; // Không tạo nếu chưa nhập số lượng

  const dateCode = dayjs().format('YYMM'); // 2501 cho 2025-01

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const serials = Array.from({ length: quantity }, () => {
    let randomPart = '';
    for (let i = 0; i < 5; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `DHG${dateCode}${randomPart}`;
  });

  form.setFieldsValue({ serialNumber: serials.join(', ') });
};



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
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="save" type="primary" onClick={handleSave} >Lưu</Button>,
      ]}
      modalRender={(modal) => (
        <Draggable nodeRef={nodeRef} disabled={disabled}>
          <div ref={nodeRef} style={{ width: '100%' }}>
            {modal}
          </div>
        </Draggable>
      )}
    >
       {invoice?.attributes && (
      <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
        <Descriptions bordered column={2} size="small">

   <Descriptions.Item label="Khách hàng">
            <Form.Item
              name="customer"
              noStyle
              rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
            >
              <Select
                placeholder="Chọn khách hàng"
                showSearch
                allowClear
                onChange={handleCustomerChange} // ✅ gọi hàm lọc StoreID
                dropdownStyle={{
                  minWidth: getDropdownWidth(
                    [...new Set(customersData.map(p => p.attributes.Customer))]
                      .map(name => ({ label: name }))
                  ),
                }}
              >
                {[...new Set(customersData.map(p => p.attributes.Customer))].map(name => (
                  <Option key={name} value={name}>{name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          {/* ✅ StoreID */}
          <Descriptions.Item label="StoreID">
            <Form.Item
              name="storeID"
              noStyle
              rules={[{ message: 'Vui lòng chọn cửa hàng' }]}
            >
              <Select
                placeholder="Chọn cửa hàng"
                disabled={!filteredStoreIDs.length}
                showSearch
                allowClear
                dropdownStyle={{
                  minWidth: getDropdownWidth(filteredStoreIDs.map(m => ({ label: m }))),
                }}
              >
                {filteredStoreIDs.map(storeID => (
                  <Option key={storeID} value={storeID}>{storeID}</Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

<Descriptions.Item label="Tên sản phẩm">
  {invoice?.attributes?.ProductName || ''}
</Descriptions.Item>
          <Descriptions.Item label="Model">
            <Form.Item name="model" noStyle >
              {invoice?.attributes?.Model || ''}
            </Form.Item>
          </Descriptions.Item>

                <Descriptions.Item label="Thương hiệu">
            <Form.Item name="brandName" noStyle >
              {invoice?.attributes?.BrandName || ''}
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="Loại sản phẩm">
            <Form.Item name="type" noStyle >
             {invoice?.attributes?.Type || ''}
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Số hóa đơn">
            <Form.Item name="invoiceNumber" noStyle>
              <Input  />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày hóa đơn">
            <Form.Item name="invoiceDate" noStyle>
              <DatePicker format="DD-MM-YYYY"  style={{ width: '100%' }} />
            </Form.Item>
          </Descriptions.Item>

    <Descriptions.Item label="Thuế (%)">
  <Form.Item
    name="vatRate"
    noStyle
    initialValue={10} // mặc định 10%
  >
    <Select
      style={{ width: '100%' }}
      onChange={(value) => {
        // Lấy số lượng và đơn giá hiện tại
        const quantity = Number(form.getFieldValue('quantity') || 0);
        const unitPrice = Number(form.getFieldValue('unitPrice') || 0);
        const totalAmount = quantity * unitPrice;
        const vat = Math.round(totalAmount * (value / 100));
        const amountSupplier = totalAmount + vat;
        form.setFieldsValue({ vat, amountSupplier });
      }}
      // disabled={!isEditable}
    >
      <Select.Option value={0}>0%</Select.Option>
      <Select.Option value={8}>8%</Select.Option>
      <Select.Option value={10}>10%</Select.Option>
    </Select>
  </Form.Item>
</Descriptions.Item>

          <Descriptions.Item label="Số lượng">
            <Form.Item name="quantity" noStyle rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
              <InputNumber min={0} disabled={!isEditable} style={{ width: '100%' }} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Đơn giá">
            <Form.Item name="unitPrice" noStyle rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}>
              <InputNumber min={1000} disabled={!isEditable} style={{ width: '100%' }} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Giá chưa VAT">
            <Form.Item name="totalAmount" noStyle>
              <InputNumber disabled style={{ width: '100%' }} formatter={currencyFormatter} parser={currencyParser} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="VAT">
            <Form.Item name="vat" noStyle>
              <InputNumber disabled style={{ width: '100%' }} formatter={currencyFormatter} parser={currencyParser} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Tổng cộng">
            <Form.Item name="amountSupplier" noStyle>
              <InputNumber disabled style={{ width: '100%' }} formatter={currencyFormatter} parser={currencyParser} />
            </Form.Item>
          </Descriptions.Item>

             <Descriptions.Item label="Tên nhà cung cấp" span={2}>
            <Form.Item name="supplierName" noStyle rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}>
              <Select placeholder="Chọn nhà cung cấp" disabled={!isEditable} showSearch allowClear>
                {suppliers.length ? (
                  suppliers
                    .filter(s => s.attributes?.NameNCC)
                    .map(s => (
                      <Option key={s.id} value={s.attributes.NameNCC}>
                        {s.attributes.NameNCC}
                      </Option>
                    ))
                ) : (
                  <Option disabled value="">
                    Không có dữ liệu nhà cung cấp
                  </Option>
                )}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
            <Form.Item name="shippingAddress" noStyle>
              <Input disabled={!isEditable} />
            </Form.Item>
          </Descriptions.Item>

            <Descriptions.Item label="Số Serial" span={2}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Form.Item name="serialNumber" noStyle style={{ flex: 1, marginBottom: 0 }}>
      <Input.TextArea rows={3} disabled={!isEditable} style={{ width: '100%' }} />
    </Form.Item>
    <Button
      type="dashed"
      onClick={generateSerialNumbers}
      disabled={!isEditable || !!form.getFieldValue('serialNumber')}
      style={{ marginLeft: 8, height: 32 }}
    >
      Tạo Serial
    </Button>
  </div>
</Descriptions.Item>

    <Descriptions.Item label="Ghi chú" span={2}>
            <Form.Item name="note" noStyle>
              <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
          </Descriptions.Item>

        </Descriptions>
      </Form>
        )}
    </Modal>
  );
};

export default UpdatePurchaseOrderModal;

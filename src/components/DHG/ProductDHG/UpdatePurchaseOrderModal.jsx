// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, notification, Descriptions } from 'antd';
// import { fetchListSupplier, updateSupplierForm } from '../../../services/dhgServices';
// import { fetchListCustomer } from "../../../services/strapiServices";
// import Draggable from 'react-draggable';
// import dayjs from 'dayjs';

// const { Option } = Select;

// const UpdatePurchaseOrderModal = ({ open, onClose, invoice, onUpdateSuccess }) => {
//   const [form] = Form.useForm();
//   const [disabled, setDisabled] = useState(true);
//   const [suppliers, setSuppliers] = useState([]);
//   const nodeRef = useRef(null);
//   const [customersData, setCustomersData] = useState([]); // ✅ Lưu toàn bộ khách hàng
//   const [filteredStoreIDs, setFilteredStoreIDs] = useState([]); // ✅ StoreID theo customer

//   // Format tiền
//   const currencyFormatter = (value) =>
//     new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//       maximumFractionDigits: 0,
//     }).format(value);

//   //const currencyParser = (value) => value.replace(/[₫,\s]/g, '');
//   const currencyParser = (value) => (value ? value.replace(/[₫,\s]/g, '') : '');

//   const onFormValuesChange = useCallback((_, allValues) => {
//     const quantity = Number(allValues.quantity || 0);
//     const unitPrice = Number(allValues.unitPrice || 0);
//     const vatRate = Number(allValues.vatRate || 0); // lấy từ form
//     const totalAmount = quantity * unitPrice;
//     const vat = Math.round(totalAmount * (vatRate / 100));
//     const amountSupplier = totalAmount + vat;
//     form.setFieldsValue({ totalAmount, vat, amountSupplier });
//   }, [form]);

//   useEffect(() => {
//     if (open) {
//       fetchListSupplier()
//         // Strapi v5: response phẳng
//         .then((res) => {
//           const data = Array.isArray(res) ? res : (res?.data || []);
//           setSuppliers(data);
//         })
//         .catch(() => notification.error({ message: 'Lỗi tải nhà cung cấp' }));

//       // ✅ Lấy danh sách khách hàng + StoreID
//       fetchListCustomer()
//         .then(res => {
//           const data = Array.isArray(res) ? res : (res?.data || []);
//           setCustomersData(data);
//         })
//         .catch(() => notification.error({ message: 'Lỗi tải khách hàng' }));
//     }
//   }, [open]);

//   // ✅ Hàm lọc storeID theo customer
//   const handleCustomerChange = useCallback((customerName) => {
//     if (customerName) {
//       // Sửa: bỏ .attributes
//       const storeList = customersData
//         .filter(c => c.Customer === customerName)
//         .map(c => c.StoreID);
//       setFilteredStoreIDs(storeList);
//       form.setFieldsValue({ storeID: undefined });
//     } else {
//       setFilteredStoreIDs([]);
//       form.setFieldsValue({ storeID: undefined });
//     }
//   }, [customersData, form]);


//   useEffect(() => {
//     if (invoice) {
//       // Sửa: bỏ .attributes
//       form.setFieldsValue({
//         productName: invoice.ProductName || '',
//         model: invoice.Model || '',
//         invoiceNumber: invoice.InvoiceNumber || '',
//         invoiceDate: invoice.InvoiceDate ? dayjs(invoice.InvoiceDate) : null,
//         supplierName: invoice.NameNCC || '',
//         note: invoice.Note || '',
//         shippingAddress: invoice.ShippingAddress || '',
//         serialNumber: invoice.SerialNumber || '',
//         quantity: invoice.Qty || 0,
//         unitPrice: invoice.UnitPrice || 0,
//         vat: invoice.Vat || 0,
//         totalAmount: invoice.TotalAmount || 0,
//         amountSupplier: invoice.AmountSupplier || 0,
//         status: invoice.Status || '',
//         brandName: invoice.BrandName || '',
//         type: invoice.Type || '',
//         vatRate: invoice.VatRate || '',
//         customer: invoice.Customer || '',
//         storeID: invoice.StoreID || '',
//       });
//       // Sửa: bỏ .attributes
//       if (invoice.Customer) {
//         handleCustomerChange(invoice.Customer);
//       }
//     }
//   }, [invoice, form, handleCustomerChange]);

//   // Sửa: bỏ .attributes
//   const isEditable = invoice?.Status !== 'Đã nhận hàng';

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const payload = {
//         ProductName: values.productName,
//         Model: values.model,
//         InvoiceNumber: values.invoiceNumber,
//         InvoiceDate: values.invoiceDate ? values.invoiceDate.format('YYYY-MM-DD') : null,
//         NameNCC: values.supplierName,
//         Note: values.note,
//         ShippingAddress: values.shippingAddress,
//         SerialNumber: values.serialNumber,
//         Qty: values.quantity,
//         UnitPrice: values.unitPrice,
//         Vat: values.vat,
//         TotalAmount: values.totalAmount,
//         AmountSupplier: values.amountSupplier,
//         Status: values.status,
//         VatRate: values.vatRate,
//         Customer: values.customer,
//         StoreID: values.storeID,
//       };

//       // Sửa: dùng id hoặc documentId
//       await updateSupplierForm(invoice.id || invoice.documentId, payload);

//       notification.success({
//         message: 'Cập nhật thành công',
//         // Sửa: bỏ .attributes
//         description: `Phiếu ${invoice.Ticket} đã được cập nhật.`,
//       });
//       onUpdateSuccess();
//     } catch (error) {
//       notification.error({ message: 'Lỗi khi cập nhật phiếu' });
//       console.error(error);
//     }
//   };

//   // Hàm tính chiều rộng dropdown theo dữ liệu
//   const getDropdownWidth = (options) => {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     context.font = '14px Arial';
//     let maxWidth = 0;
//     options.forEach(opt => {
//       const metrics = context.measureText(opt.label || '');
//       if (metrics.width > maxWidth) {
//         maxWidth = metrics.width;
//       }
//     });
//     return maxWidth + 40; // padding + scroll
//   };

//   const generateSerialNumbers = () => {
//     const serialNumber = form.getFieldValue('serialNumber');
//     if (serialNumber && serialNumber.trim()) return; // Đã có serial thì không tạo

//     const quantity = Number(form.getFieldValue('quantity')) || 0;
//     if (quantity <= 0) return; // Không tạo nếu chưa nhập số lượng

//     const dateCode = dayjs().format('YYMM'); // 2501 cho 2025-01

//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

//     const serials = Array.from({ length: quantity }, () => {
//       let randomPart = '';
//       for (let i = 0; i < 5; i++) {
//         randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
//       }
//       return `DHG${dateCode}${randomPart}`;
//     });

//     form.setFieldsValue({ serialNumber: serials.join(', ') });
//   };



//   return (
//     <Modal
//       title={
//         <div
//           style={{ cursor: 'move' }}
//           onMouseDown={() => setDisabled(false)}
//           onMouseUp={() => setDisabled(true)}
//         >
//           Cập nhật phiếu nhập hàng
//         </div>
//       }
//       open={open}
//       onCancel={onClose}
//       width={900}
//       footer={[
//         <Button key="cancel" onClick={onClose}>Hủy</Button>,
//         <Button key="save" type="primary" onClick={handleSave} >Lưu</Button>,
//       ]}
//       modalRender={(modal) => (
//         <Draggable nodeRef={nodeRef} disabled={disabled}>
//           <div ref={nodeRef} style={{ width: '100%' }}>
//             {modal}
//           </div>
//         </Draggable>
//       )}
//     >
//       {/* Sửa: kiểm tra invoice thay vì invoice.attributes */}
//       {invoice && (
//         <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
//           <Descriptions bordered column={2} size="small">

//             <Descriptions.Item label="Khách hàng">
//               <Form.Item
//                 name="customer"
//                 noStyle
//                 rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
//               >
//                 <Select
//                   placeholder="Chọn khách hàng"
//                   showSearch
//                   allowClear
//                   onChange={handleCustomerChange} // ✅ gọi hàm lọc StoreID
//                   dropdownStyle={{
//                     minWidth: getDropdownWidth(
//                       // Sửa: bỏ .attributes
//                       [...new Set(customersData.map(p => p.Customer))]
//                         .map(name => ({ label: name }))
//                     ),
//                   }}
//                 >
//                   {/* Sửa: bỏ .attributes */}
//                   {[...new Set(customersData.map(p => p.Customer))].map(name => (
//                     <Option key={name} value={name}>{name}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Descriptions.Item>

//             {/* ✅ StoreID */}
//             <Descriptions.Item label="StoreID">
//               <Form.Item
//                 name="storeID"
//                 noStyle
//                 rules={[{ message: 'Vui lòng chọn cửa hàng' }]}
//               >
//                 <Select
//                   placeholder="Chọn cửa hàng"
//                   disabled={!filteredStoreIDs.length}
//                   showSearch
//                   allowClear
//                   dropdownStyle={{
//                     minWidth: getDropdownWidth(filteredStoreIDs.map(m => ({ label: m }))),
//                   }}
//                 >
//                   {filteredStoreIDs.map(storeID => (
//                     <Option key={storeID} value={storeID}>{storeID}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Tên sản phẩm">
//               {/* Sửa: bỏ .attributes */}
//               {invoice?.ProductName || ''}
//             </Descriptions.Item>
//             <Descriptions.Item label="Model">
//               <Form.Item name="model" noStyle >
//                 {/* Sửa: bỏ .attributes */}
//                 {invoice?.Model || ''}
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Thương hiệu">
//               <Form.Item name="brandName" noStyle >
//                 {/* Sửa: bỏ .attributes */}
//                 {invoice?.BrandName || ''}
//               </Form.Item>
//             </Descriptions.Item>
//             <Descriptions.Item label="Loại sản phẩm">
//               <Form.Item name="type" noStyle >
//                 {/* Sửa: bỏ .attributes */}
//                 {invoice?.Type || ''}
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Số hóa đơn">
//               <Form.Item name="invoiceNumber" noStyle>
//                 <Input />
//               </Form.Item>
//             </Descriptions.Item>
//             <Descriptions.Item label="Ngày hóa đơn">
//               <Form.Item name="invoiceDate" noStyle>
//                 <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Thuế (%)">
//               <Form.Item
//                 name="vatRate"
//                 noStyle
//                 initialValue={10} // mặc định 10%
//               >
//                 <Select
//                   style={{ width: '100%' }}
//                   onChange={(value) => {
//                     // Lấy số lượng và đơn giá hiện tại
//                     const quantity = Number(form.getFieldValue('quantity') || 0);
//                     const unitPrice = Number(form.getFieldValue('unitPrice') || 0);
//                     const totalAmount = quantity * unitPrice;
//                     const vat = Math.round(totalAmount * (value / 100));
//                     const amountSupplier = totalAmount + vat;
//                     form.setFieldsValue({ vat, amountSupplier });
//                   }}
//                 // disabled={!isEditable}
//                 >
//                   <Select.Option value={0}>0%</Select.Option>
//                   <Select.Option value={8}>8%</Select.Option>
//                   <Select.Option value={10}>10%</Select.Option>
//                 </Select>
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Số lượng">
//               <Form.Item name="quantity" noStyle rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
//                 <InputNumber min={0} disabled={!isEditable} style={{ width: '100%' }} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Đơn giá">
//               <Form.Item name="unitPrice" noStyle rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}>
//                 <InputNumber min={1000} disabled={!isEditable} style={{ width: '100%' }} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Giá chưa VAT">
//               <Form.Item name="totalAmount" noStyle>
//                 <InputNumber disabled style={{ width: '100%' }} formatter={currencyFormatter} parser={currencyParser} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="VAT">
//               <Form.Item name="vat" noStyle>
//                 <InputNumber disabled style={{ width: '100%' }} formatter={currencyFormatter} parser={currencyParser} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Tổng cộng">
//               <Form.Item name="amountSupplier" noStyle>
//                 <InputNumber disabled style={{ width: '100%' }} formatter={currencyFormatter} parser={currencyParser} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Tên nhà cung cấp" span={2}>
//               <Form.Item name="supplierName" noStyle rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}>
//                 <Select placeholder="Chọn nhà cung cấp" disabled={!isEditable} showSearch allowClear>
//                   {suppliers.length ? (
//                     suppliers
//                       // Sửa: bỏ .attributes
//                       .filter(s => s.NameNCC)
//                       .map(s => (
//                         <Option key={s.id} value={s.NameNCC}>
//                           {s.NameNCC}
//                         </Option>
//                       ))
//                   ) : (
//                     <Option disabled value="">
//                       Không có dữ liệu nhà cung cấp
//                     </Option>
//                   )}
//                 </Select>
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
//               <Form.Item name="shippingAddress" noStyle>
//                 <Input disabled={!isEditable} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="Số Serial" span={2}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <Form.Item name="serialNumber" noStyle style={{ flex: 1, marginBottom: 0 }}>
//                   <Input.TextArea rows={3} disabled={!isEditable} style={{ width: '100%' }} />
//                 </Form.Item>
//                 <Button
//                   type="dashed"
//                   onClick={generateSerialNumbers}
//                   disabled={!isEditable || !!form.getFieldValue('serialNumber')}
//                   style={{ marginLeft: 8, height: 32 }}
//                 >
//                   Tạo Serial
//                 </Button>
//               </div>
//             </Descriptions.Item>

//             <Descriptions.Item label="Ghi chú" span={2}>
//               <Form.Item name="note" noStyle>
//                 <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
//               </Form.Item>
//             </Descriptions.Item>

//           </Descriptions>
//         </Form>
//       )}
//     </Modal>
//   );
// };

// export default UpdatePurchaseOrderModal;


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

  const currencyParser = (value) => (value ? value.replace(/[^\d]/g, '') : '');

  // Tự động tính toán khi thay đổi số lượng, đơn giá, thuế
  const onFormValuesChange = useCallback((_, allValues) => {
    const quantity = Number(allValues.quantity || 0);
    const unitPrice = Number(allValues.unitPrice || 0);
    const vatRate = Number(allValues.vatRate || 0);

    const totalAmount = quantity * unitPrice; // Giá chưa VAT
    const vat = Math.round(totalAmount * (vatRate / 100)); // Tiền VAT
    const amountSupplier = totalAmount + vat; // Tổng cộng (có VAT)

    form.setFieldsValue({ totalAmount, vat, amountSupplier });
  }, [form]);

  useEffect(() => {
    if (open) {
      // Tải danh sách nhà cung cấp
      fetchListSupplier()
        .then((res) => {
          const data = Array.isArray(res) ? res : (res?.data || []);
          setSuppliers(data);
        })
        .catch(() => notification.error({ message: 'Lỗi tải nhà cung cấp' }));

      // Tải danh sách khách hàng & StoreID
      fetchListCustomer()
        .then(res => {
          const data = Array.isArray(res) ? res : (res?.data || []);
          setCustomersData(data);
        })
        .catch(() => notification.error({ message: 'Lỗi tải khách hàng' }));
    }
  }, [open]);

  // Lọc StoreID theo Customer
  const handleCustomerChange = useCallback((customerName) => {
    if (customerName) {
      const storeList = customersData
        .filter(c => c.Customer === customerName)
        .map(c => c.StoreID)
        .filter(Boolean); // Loại bỏ giá trị null/undefined
      setFilteredStoreIDs([...new Set(storeList)]); // Unique StoreID
      form.setFieldsValue({ storeID: undefined });
    } else {
      setFilteredStoreIDs([]);
      form.setFieldsValue({ storeID: undefined });
    }
  }, [customersData, form]);

  // Đổ dữ liệu vào form khi mở modal
  useEffect(() => {
    if (invoice) {
      form.setFieldsValue({
        productName: invoice.ProductName || '',
        model: invoice.Model || '',
        invoiceNumber: invoice.InvoiceNumber || '',
        invoiceDate: invoice.InvoiceDate ? dayjs(invoice.InvoiceDate) : null,
        supplierName: invoice.NameNCC || '',
        note: invoice.Note || '',
        shippingAddress: invoice.ShippingAddress || '',
        serialNumber: invoice.SerialNumber || '',
        quantity: invoice.Qty || 0,
        unitPrice: invoice.UnitPrice || 0,
        vat: invoice.Vat || 0,
        totalAmount: invoice.TotalAmount || 0,
        amountSupplier: invoice.AmountSupplier || 0,
        status: invoice.Status || '',
        brandName: invoice.BrandName || '',
        type: invoice.Type || '',
        vatRate: invoice.VatRate ?? 10, // Mặc định 10 nếu null
        customer: invoice.Customer || '',
        storeID: invoice.StoreID || '',
        currency: invoice.Currency || 'VND', // Thêm trường Currency
      });

      if (invoice.Customer) {
        // Cần tìm storeID tương ứng với khách hàng hiện tại để fill dropdown
        const storeList = customersData
          .filter(c => c.Customer === invoice.Customer)
          .map(c => c.StoreID)
          .filter(Boolean);
        setFilteredStoreIDs([...new Set(storeList)]);
      }
    }
  }, [invoice, form, customersData]);

  const isEditable = invoice?.Status !== 'Đã nhận hàng' && invoice?.Status !== 'Hủy phiếu';

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
        BrandName: values.brandName,
        Type: values.type,
        Currency: values.currency, // Lưu loại tiền
      };

      await updateSupplierForm(invoice.id || invoice.documentId, payload);

      notification.success({
        message: 'Cập nhật thành công',
        description: `Phiếu ${invoice.Ticket} đã được cập nhật.`,
      });
      onUpdateSuccess();
    } catch (error) {
      notification.error({ message: 'Lỗi khi cập nhật phiếu' });
      console.error(error);
    }
  };

  // Tính toán chiều rộng dropdown
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
    return maxWidth + 40;
  };

  // Tạo Serial Number tự động
  const generateSerialNumbers = () => {
    const serialNumber = form.getFieldValue('serialNumber');
    if (serialNumber && serialNumber.trim()) return;

    const quantity = Number(form.getFieldValue('quantity')) || 0;
    if (quantity <= 0) {
      notification.warning({ message: 'Vui lòng nhập số lượng trước' });
      return;
    }

    const dateCode = dayjs().format('YYMM');
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
      width={950}
      centered
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="save" type="primary" onClick={handleSave} disabled={!isEditable && invoice?.Status !== 'Chờ nhập kho'}>
          Lưu thay đổi
        </Button>,
      ]}
      modalRender={(modal) => (
        <Draggable nodeRef={nodeRef} disabled={disabled} bounds="parent">
          <div ref={nodeRef} style={{ width: '100%' }}>
            {modal}
          </div>
        </Draggable>
      )}
    >
      {invoice && (
        <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
          <Descriptions bordered column={2} size="small" labelStyle={{ width: '150px', fontWeight: 500 }}>

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
                  disabled={!isEditable}
                  onChange={handleCustomerChange}
                  dropdownStyle={{
                    minWidth: getDropdownWidth([...new Set(customersData.map(p => p.Customer))].map(name => ({ label: name }))),
                  }}
                >
                  {[...new Set(customersData.map(p => p.Customer))].map(name => (
                    <Option key={name} value={name}>{name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="StoreID">
              <Form.Item
                name="storeID"
                noStyle
                rules={[{ message: 'Vui lòng chọn cửa hàng' }]}
              >
                <Select
                  placeholder="Chọn cửa hàng"
                  disabled={!isEditable || !filteredStoreIDs.length}
                  showSearch
                  allowClear
                >
                  {filteredStoreIDs.map(storeID => (
                    <Option key={storeID} value={storeID}>{storeID}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Tên sản phẩm">
              <Form.Item name="productName" noStyle rules={[{ required: true, message: 'Nhập tên SP' }]}>
                <Input disabled={!isEditable} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Model">
              <Form.Item name="model" noStyle>
                <Input disabled={!isEditable} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Thương hiệu">
              <Form.Item name="brandName" noStyle>
                <Input disabled={!isEditable} placeholder="Dell, HP..." />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Loại sản phẩm">
              <Form.Item name="type" noStyle>
                <Select disabled={!isEditable}>
                  <Option value="Thiết bị">Thiết bị</Option>
                  <Option value="Vật tư">Vật tư</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Số hóa đơn">
              <Form.Item name="invoiceNumber" noStyle>
                <Input disabled={!isEditable} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày hóa đơn">
              <Form.Item name="invoiceDate" noStyle>
                <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} disabled={!isEditable} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Loại tiền">
              <Form.Item name="currency" noStyle>
                <Select disabled={!isEditable}>
                  <Option value="VND">VND</Option>
                  <Option value="USD">USD</Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Thuế VAT (%)">
              <Form.Item name="vatRate" noStyle>
                <Select style={{ width: '100%' }} disabled={!isEditable}>
                  <Select.Option value={0}>0%</Select.Option>
                  <Select.Option value={5}>5%</Select.Option>
                  <Select.Option value={8}>8%</Select.Option>
                  <Select.Option value={10}>10%</Select.Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Số lượng">
              <Form.Item name="quantity" noStyle rules={[{ required: true, message: 'Nhập SL' }]}>
                <InputNumber min={0} disabled={!isEditable} style={{ width: '100%' }} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Đơn giá">
              <Form.Item name="unitPrice" noStyle rules={[{ required: true, message: 'Nhập đơn giá' }]}>
                <InputNumber
                  min={0}
                  disabled={!isEditable}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Giá chưa VAT">
              <Form.Item name="totalAmount" noStyle>
                <InputNumber disabled style={{ width: '100%', color: '#000' }} formatter={currencyFormatter} parser={currencyParser} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Tiền VAT">
              <Form.Item name="vat" noStyle>
                <InputNumber disabled style={{ width: '100%', color: '#000' }} formatter={currencyFormatter} parser={currencyParser} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Tổng cộng (có VAT)" span={2}>
              <Form.Item name="amountSupplier" noStyle>
                <InputNumber
                  disabled
                  style={{ width: '100%', color: '#fa541c', fontWeight: 'bold' }}
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Nhà cung cấp" span={2}>
              <Form.Item name="supplierName" noStyle rules={[{ required: true, message: 'Vui lòng chọn NCC' }]}>
                <Select placeholder="Chọn nhà cung cấp" disabled={!isEditable} showSearch allowClear>
                  {suppliers.length ? (
                    suppliers
                      .filter(s => s.NameNCC)
                      .map(s => (
                        <Option key={s.id || s.documentId} value={s.NameNCC}>
                          {s.NameNCC}
                        </Option>
                      ))
                  ) : (
                    <Option disabled value="">Không có dữ liệu</Option>
                  )}
                </Select>
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
              <Form.Item name="shippingAddress" noStyle>
                <Input.TextArea rows={2} disabled={!isEditable} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="Serial Number" span={2}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Form.Item name="serialNumber" noStyle style={{ flex: 1 }}>
                  <Input.TextArea
                    rows={3}
                    disabled={!isEditable}
                    placeholder="Nhập serial, cách nhau bởi dấu phẩy"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Button
                  type="dashed"
                  onClick={generateSerialNumbers}
                  disabled={!isEditable}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Tạo Serial
                </Button>
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="Ghi chú" span={2}>
              <Form.Item name="note" noStyle>
                <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
              </Form.Item>
            </Descriptions.Item>

          </Descriptions>
        </Form>
      )}
    </Modal>
  );
};

export default UpdatePurchaseOrderModal;
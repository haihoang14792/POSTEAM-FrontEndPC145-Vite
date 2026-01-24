// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   message,
//   notification,
//   Descriptions,
//   InputNumber,
//   Button
// } from "antd";
// import { PlusCircleOutlined } from '@ant-design/icons';
// import {
//   createImportlists,
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
//   updateImportlists,
// } from "../../../services/dhgServices";
// import dayjs from "dayjs";

// const { Option } = Select;

// // Hàm sinh Ticket (giữ nguyên)
// const generateInvoiceNumber = () => {
//   const year = new Date().getFullYear();
//   const unique = Math.floor(Math.random() * 1000000);
//   return `SPCDHG${year}${unique}`;
// };

// // Tính chiều rộng dropdown theo dữ liệu (giống AddExportList)
// const getDropdownWidth = (options) => {
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   context.font = "14px Arial";
//   let maxWidth = 0;
//   options.forEach((opt) => {
//     const metrics = context.measureText(opt.label || "");
//     if (metrics.width > maxWidth) maxWidth = metrics.width;
//   });
//   return maxWidth + 40; // padding + scrollbar
// };


// const AddImportList = ({ open, onClose, onConfirmSuccess }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [warehouseList, setWarehouseList] = useState([]);

//   // state phục vụ giao diện giống AddExportList
//   const [models, setModels] = useState([]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserName(parsedUser?.account?.Name || "");
//       } catch (error) {
//         console.error("Error parsing user from localStorage:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//   const loadWarehouse = async () => {
//     try {
//       const res = await fetchWarehouseDetails();
//       setWarehouseList(res.data || []);
//     } catch (error) {
//       console.error("Lỗi khi tải kho:", error);
//     }
//   };
//   if (open) {
//     loadWarehouse();
//     // reset toàn bộ form mỗi khi mở modal
//     form.resetFields();
//     setModels([]);
//   }
// }, [open, form]);


// const generateSerialNumbers = () => {
//   const serialNumber = form.getFieldValue("serialNumber");
//   if (serialNumber && serialNumber.trim()) return; // đã có thì không tạo

//   const quantity = Number(form.getFieldValue("totalimport")) || 0;
//   if (quantity <= 0) {
//     message.warning("Vui lòng nhập số lượng trước khi tạo serial!");
//     return;
//   }

//   const dateCode = dayjs().format("YYMM"); // ví dụ: 2508 cho 2025-08
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//   const serials = Array.from({ length: quantity }, () => {
//     let randomPart = "";
//     for (let i = 0; i < 5; i++) {
//       randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return `DHG${dateCode}${randomPart}`;
//   });

//   form.setFieldsValue({ serialNumber: serials.join(", ") });
// };



//   // === HANDLERS CHO UI GIỐNG AddExportList ===
//   const handleProductChange = (productName) => {
//     const productModels = warehouseList.filter(
//       (p) => p.attributes.ProductName === productName
//     );
//     setModels(productModels);
//     // reset các field phụ thuộc Model
//     form.setFieldsValue({
//       Model: undefined,
//       BrandName: undefined,
//       DVT: undefined,
//       Type: undefined,
//     });
//   };

//   const handleModelChange = (model) => {
//     const selected = models.find((m) => m.attributes.Model === model);
//     if (selected) {
//       form.setFieldsValue({
//         BrandName: selected.attributes.BrandName,
//         DVT: selected.attributes.DVT,
//         Type: selected.attributes.Type,
//       });
//     } else {
//       form.setFieldsValue({
//         BrandName: undefined,
//         DVT: undefined,
//         Type: undefined,
//       });
//     }
//   };

//   // === LOGIC NHẬP KHO: GIỮ NGUYÊN CHỨC NĂNG ===
//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();

//       // Tìm item kho theo Model (giống trước đây)
//       const matchedItem = warehouseList.find(
//         (item) => item.attributes.Model === values.Model
//       );

//       if (!matchedItem) {
//         message.error("Model trong kho không khớp. Vui lòng kiểm tra lại.");
//         return;
//       }

//       // Sinh Ticket (giữ nguyên)
//       const ticket = generateInvoiceNumber();

//       // Tạo dữ liệu nhập kho (giữ nguyên)
//       const importData = {
//         ProductName: values.ProductName || matchedItem.attributes.ProductName,
//         BrandName: values.BrandName || matchedItem.attributes.BrandName,
//         Type: values.Type || matchedItem.attributes.Type,
//        // SerialNumber: values.SerialNumber || "N/A",
//          SerialNumber: values.serialNumber || "N/A",   // <-- sửa ở đây
//         Ticket: ticket,
//         NameImport: userName,
//         totalimport: Number(values.totalimport) || 0,
//         DVT: values.DVT || matchedItem.attributes.DVT,
//         Model: values.Model || matchedItem.attributes.Model,
//         TypeKho: "DHG",
//       };

//       setLoading(true);

//       // 1) Tạo bản ghi nhập kho + set Check = true (giữ nguyên)
//       const createdImport = await createImportlists(importData);
//       const importId = createdImport?.data?.id;
//       if (importId) {
//         await updateImportlists(importId, { Check: true });
//       }

//       message.success(
//         `Sản phẩm ${importData.ProductName} đã nhập kho với Ticket ${ticket}.`
//       );

//       // 2) Cập nhật số lượng kho (giữ nguyên)
//       const kho = importData.TypeKho; // DHG
//       const qty = importData.totalimport;
//       const currentQty = matchedItem.attributes[kho] || 0;
//       const currentNTK = matchedItem.attributes.totalNTK || 0;
//       const currentCK = matchedItem.attributes.inventoryCK || 0;

//       await updateWarehouseDetails(matchedItem.id, {
//         [kho]: currentQty + qty,
//         totalNTK: currentNTK + qty,
//         inventoryCK: currentCK + qty,
//       });

//       notification.success({
//         message: "Nhập kho thành công",
//         description: `Sản phẩm ${importData.ProductName} đã được thêm vào kho DHG.`,
//       });

//       onConfirmSuccess?.();
//       onClose();
//     } catch (error) {
//       console.error("Lỗi nhập kho:", error);
//       message.error("Có lỗi xảy ra khi nhập kho.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tập giá trị duy nhất cho dropdown "Tên sản phẩm"
//   const productNameOptions = [
//     ...new Set(warehouseList.map((p) => p.attributes.ProductName)),
//   ];

//   return (

//     <Modal
//       //title="Nhập kho DHG (Thủ công)"
//          title={
//          <div className="modal-header">
//            <PlusCircleOutlined className="icon" />
//            <span className="title">Nhập kho DHG</span>
//         </div>
//       }
//       open={open}
//       onOk={handleOk}
//     //   onCancel={onClose}
//       onCancel={() => {
//     form.resetFields();
//     onClose();
//   }}
//       okText="Xác nhận"
//       cancelText="Hủy"
//       confirmLoading={loading}
//       width={800}
//     >
//       <Form form={form} layout="vertical">
//         {/* Giao diện 5 trường giống AddExportList */}
//         <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
//           <Descriptions.Item label="Tên sản phẩm">
//             <Form.Item
//               name="ProductName"
//               rules={[{ required: true, message: "Chọn sản phẩm!" }]}
//               noStyle
//             >
//               <Select
//                 showSearch
//                 allowClear
//                 style={{ width: 220 }}
//                 onChange={handleProductChange}
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     productNameOptions.map((name) => ({ label: name }))
//                   ),
//                 }}
//               >
//                 {productNameOptions.map((name, idx) => (
//                   <Option key={idx} value={name}>
//                     {name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Model">
//             <Form.Item
//               name="Model"
//               rules={[{ required: true, message: "Chọn model!" }]}
//               noStyle
//             >
//               <Select
//                 showSearch
//                 allowClear
//                 disabled={!models.length}
//                 style={{ width: 220 }}
//                 onChange={handleModelChange}
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     models.map((m) => ({ label: m.attributes.Model }))
//                   ),
//                 }}
//               >
//                 {models.map((m) => (
//                   <Option key={m.id} value={m.attributes.Model}>
//                     {m.attributes.Model}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Thương hiệu">
//             <Form.Item name="BrandName" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="ĐVT">
//             <Form.Item name="DVT" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Loại">
//             <Form.Item name="Type" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//               <Descriptions.Item label="Số lượng nhập">
//             <Form.Item name="totalimport" rules={[{ required: true, message: 'Nhập số lượng!' }]} noStyle>
//               <InputNumber min={1}  style={{ width: '100%' }} />
//             </Form.Item>
//           </Descriptions.Item>

//         <Descriptions.Item label="Serial Number" span={2}>
//   <div style={{ display: "flex", alignItems: "center" }}>
//     <Form.Item
//       name="serialNumber"
//       noStyle
//       style={{ flex: 1, marginBottom: 0 }}
//     >
//       <Input.TextArea
//         rows={3}
//         placeholder="Nhập hoặc tạo tự động"
//         style={{ width: "100%" }}
//       />
//     </Form.Item>
//     <Button
//       type="dashed"
//       onClick={generateSerialNumbers}
//       disabled={!!form.getFieldValue("serialNumber")}
//       style={{ marginLeft: 8, height: 32 }}
//     >
//       Tạo Serial
//     </Button>
//   </div>
// </Descriptions.Item>
//         </Descriptions>
//       </Form>
//     </Modal>
//   );
// };

// export default AddImportList;


// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   message,
//   notification,
//   Descriptions,
//   InputNumber,
//   Button
// } from "antd";
// import { PlusCircleOutlined } from '@ant-design/icons';
// import {
//   createImportlists,
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
//   updateImportlists,
// } from "../../../services/dhgServices";
// import dayjs from "dayjs";

// const { Option } = Select;

// // Hàm sinh Ticket (giữ nguyên)
// const generateInvoiceNumber = () => {
//   const year = new Date().getFullYear();
//   const unique = Math.floor(Math.random() * 1000000);
//   return `SPCDHG${year}${unique}`;
// };

// // Tính chiều rộng dropdown theo dữ liệu (giống AddExportList)
// const getDropdownWidth = (options) => {
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   context.font = "14px Arial";
//   let maxWidth = 0;
//   options.forEach((opt) => {
//     const metrics = context.measureText(opt.label || "");
//     if (metrics.width > maxWidth) maxWidth = metrics.width;
//   });
//   return maxWidth + 40; // padding + scrollbar
// };


// const AddImportList = ({ open, onClose, onConfirmSuccess }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [warehouseList, setWarehouseList] = useState([]);

//   // state phục vụ giao diện giống AddExportList
//   const [models, setModels] = useState([]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserName(parsedUser?.account?.Name || "");
//       } catch (error) {
//         console.error("Error parsing user from localStorage:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const loadWarehouse = async () => {
//       try {
//         const res = await fetchWarehouseDetails();
//         // Strapi v5: response.data là mảng phẳng hoặc response là mảng
//         const data = Array.isArray(res) ? res : (res.data || []);
//         setWarehouseList(data);
//       } catch (error) {
//         console.error("Lỗi khi tải kho:", error);
//       }
//     };
//     if (open) {
//       loadWarehouse();
//       // reset toàn bộ form mỗi khi mở modal
//       form.resetFields();
//       setModels([]);
//     }
//   }, [open, form]);


//   const generateSerialNumbers = () => {
//     const serialNumber = form.getFieldValue("serialNumber");
//     if (serialNumber && serialNumber.trim()) return; // đã có thì không tạo

//     const quantity = Number(form.getFieldValue("totalimport")) || 0;
//     if (quantity <= 0) {
//       message.warning("Vui lòng nhập số lượng trước khi tạo serial!");
//       return;
//     }

//     const dateCode = dayjs().format("YYMM"); // ví dụ: 2508 cho 2025-08
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//     const serials = Array.from({ length: quantity }, () => {
//       let randomPart = "";
//       for (let i = 0; i < 5; i++) {
//         randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
//       }
//       return `DHG${dateCode}${randomPart}`;
//     });

//     form.setFieldsValue({ serialNumber: serials.join(", ") });
//   };



//   // === HANDLERS CHO UI GIỐNG AddExportList ===
//   const handleProductChange = (productName) => {
//     // Sửa: bỏ .attributes
//     const productModels = warehouseList.filter(
//       (p) => p.ProductName === productName
//     );
//     setModels(productModels);
//     // reset các field phụ thuộc Model
//     form.setFieldsValue({
//       Model: undefined,
//       BrandName: undefined,
//       DVT: undefined,
//       Type: undefined,
//     });
//   };

//   const handleModelChange = (model) => {
//     // Sửa: bỏ .attributes
//     const selected = models.find((m) => m.Model === model);
//     if (selected) {
//       form.setFieldsValue({
//         BrandName: selected.BrandName, // Sửa: bỏ .attributes
//         DVT: selected.DVT,             // Sửa: bỏ .attributes
//         Type: selected.Type,           // Sửa: bỏ .attributes
//       });
//     } else {
//       form.setFieldsValue({
//         BrandName: undefined,
//         DVT: undefined,
//         Type: undefined,
//       });
//     }
//   };

//   // === LOGIC NHẬP KHO: GIỮ NGUYÊN CHỨC NĂNG ===
//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();

//       // Tìm item kho theo Model
//       // Sửa: bỏ .attributes
//       const matchedItem = warehouseList.find(
//         (item) => item.Model === values.Model
//       );

//       if (!matchedItem) {
//         message.error("Model trong kho không khớp. Vui lòng kiểm tra lại.");
//         return;
//       }

//       // Sinh Ticket (giữ nguyên)
//       const ticket = generateInvoiceNumber();

//       // Tạo dữ liệu nhập kho
//       const importData = {
//         // Sửa: bỏ .attributes, dùng trực tiếp matchedItem
//         ProductName: values.ProductName || matchedItem.ProductName,
//         BrandName: values.BrandName || matchedItem.BrandName,
//         Type: values.Type || matchedItem.Type,
//         SerialNumber: values.serialNumber || "N/A",
//         Ticket: ticket,
//         NameImport: userName,
//         totalimport: Number(values.totalimport) || 0,
//         DVT: values.DVT || matchedItem.DVT,
//         Model: values.Model || matchedItem.Model,
//         TypeKho: "DHG",
//       };

//       setLoading(true);

//       // 1) Tạo bản ghi nhập kho + set Check = true
//       const createdImport = await createImportlists(importData);
//       // Strapi v5: response có thể là { data: {...} } hoặc object trực tiếp
//       const importItem = createdImport.data || createdImport;
//       const importId = importItem.id || importItem.documentId; // Lấy ID

//       if (importId) {
//         await updateImportlists(importId, { Check: true });
//       }

//       message.success(
//         `Sản phẩm ${importData.ProductName} đã nhập kho với Ticket ${ticket}.`
//       );

//       // 2) Cập nhật số lượng kho
//       const kho = importData.TypeKho; // DHG
//       const qty = importData.totalimport;
//       // Sửa: bỏ .attributes
//       const currentQty = matchedItem[kho] || 0;
//       const currentNTK = matchedItem.totalNTK || 0;
//       const currentCK = matchedItem.inventoryCK || 0;

//       // Update bằng ID của item trong kho
//       await updateWarehouseDetails(matchedItem.id || matchedItem.documentId, {
//         [kho]: currentQty + qty,
//         totalNTK: currentNTK + qty,
//         inventoryCK: currentCK + qty,
//       });

//       notification.success({
//         message: "Nhập kho thành công",
//         description: `Sản phẩm ${importData.ProductName} đã được thêm vào kho DHG.`,
//       });

//       onConfirmSuccess?.();
//       onClose();
//     } catch (error) {
//       console.error("Lỗi nhập kho:", error);
//       message.error("Có lỗi xảy ra khi nhập kho.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tập giá trị duy nhất cho dropdown "Tên sản phẩm"
//   // Sửa: bỏ .attributes
//   const productNameOptions = [
//     ...new Set(warehouseList.map((p) => p.ProductName)),
//   ];

//   return (

//     <Modal
//       //title="Nhập kho DHG (Thủ công)"
//       title={
//         <div className="modal-header">
//           <PlusCircleOutlined className="icon" />
//           <span className="title">Nhập kho DHG</span>
//         </div>
//       }
//       open={open}
//       onOk={handleOk}
//       //   onCancel={onClose}
//       onCancel={() => {
//         form.resetFields();
//         onClose();
//       }}
//       okText="Xác nhận"
//       cancelText="Hủy"
//       confirmLoading={loading}
//       width={800}
//     >
//       <Form form={form} layout="vertical">
//         {/* Giao diện 5 trường giống AddExportList */}
//         <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
//           <Descriptions.Item label="Tên sản phẩm">
//             <Form.Item
//               name="ProductName"
//               rules={[{ required: true, message: "Chọn sản phẩm!" }]}
//               noStyle
//             >
//               <Select
//                 showSearch
//                 allowClear
//                 style={{ width: 220 }}
//                 onChange={handleProductChange}
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     productNameOptions.map((name) => ({ label: name }))
//                   ),
//                 }}
//               >
//                 {productNameOptions.map((name, idx) => (
//                   <Option key={idx} value={name}>
//                     {name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Model">
//             <Form.Item
//               name="Model"
//               rules={[{ required: true, message: "Chọn model!" }]}
//               noStyle
//             >
//               <Select
//                 showSearch
//                 allowClear
//                 disabled={!models.length}
//                 style={{ width: 220 }}
//                 onChange={handleModelChange}
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     models.map((m) => ({ label: m.Model })) // Sửa: bỏ .attributes
//                   ),
//                 }}
//               >
//                 {models.map((m) => (
//                   // Sửa: bỏ .attributes
//                   <Option key={m.id} value={m.Model}>
//                     {m.Model}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Thương hiệu">
//             <Form.Item name="BrandName" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="ĐVT">
//             <Form.Item name="DVT" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Loại">
//             <Form.Item name="Type" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Số lượng nhập">
//             <Form.Item name="totalimport" rules={[{ required: true, message: 'Nhập số lượng!' }]} noStyle>
//               <InputNumber min={1} style={{ width: '100%' }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Serial Number" span={2}>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <Form.Item
//                 name="serialNumber"
//                 noStyle
//                 style={{ flex: 1, marginBottom: 0 }}
//               >
//                 <Input.TextArea
//                   rows={3}
//                   placeholder="Nhập hoặc tạo tự động"
//                   style={{ width: "100%" }}
//                 />
//               </Form.Item>
//               <Button
//                 type="dashed"
//                 onClick={generateSerialNumbers}
//                 disabled={!!form.getFieldValue("serialNumber")}
//                 style={{ marginLeft: 8, height: 32 }}
//               >
//                 Tạo Serial
//               </Button>
//             </div>
//           </Descriptions.Item>
//         </Descriptions>
//       </Form>
//     </Modal>
//   );
// };

// export default AddImportList;


// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   message,
//   notification,
//   Descriptions,
//   InputNumber,
//   Button,
//   Row,
//   Col,
//   Card,
//   Typography,
//   Divider,
//   Space,
//   Tag
// } from "antd";
// import {
//   ImportOutlined, // Icon nhập kho
//   PlusCircleOutlined,
//   BarcodeOutlined,
//   SaveOutlined,
//   CloseOutlined,
//   ReloadOutlined,
//   UserOutlined,
//   GoldOutlined
// } from '@ant-design/icons';
// import {
//   createImportlists,
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
//   updateImportlists,
// } from "../../../services/dhgServices";
// import dayjs from "dayjs";
// // Import file SCSS chung (hoặc import file AddExportList.scss nếu bạn để chung)
// import "./AddExportList.scss";

// const { Option } = Select;
// const { Text, Title } = Typography;

// const generateInvoiceNumber = () => {
//   const year = new Date().getFullYear();
//   const unique = Math.floor(Math.random() * 1000000);
//   return `SPCDHG${year}${unique}`;
// };

// const AddImportList = ({ open, onClose, onConfirmSuccess }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [warehouseList, setWarehouseList] = useState([]);

//   // State cho UI
//   const [models, setModels] = useState([]);
//   const [selectedModelInfo, setSelectedModelInfo] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserName(parsedUser?.account?.Name || "");
//       } catch (error) {
//         console.error("Error parsing user from localStorage:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const loadWarehouse = async () => {
//       try {
//         const res = await fetchWarehouseDetails();
//         const data = Array.isArray(res) ? res : (res.data || []);
//         setWarehouseList(data);
//       } catch (error) {
//         console.error("Lỗi khi tải kho:", error);
//       }
//     };
//     if (open) {
//       loadWarehouse();
//       form.resetFields();
//       setModels([]);
//       setSelectedModelInfo(null);

//       // Set giá trị mặc định
//       form.setFieldsValue({
//         Ticket: generateInvoiceNumber(),
//         NameImport: userName
//       });
//     }
//   }, [open, form, userName]);


//   const generateSerialNumbers = () => {
//     const serialNumber = form.getFieldValue("serialNumber");
//     if (serialNumber && serialNumber.trim()) return;

//     const quantity = Number(form.getFieldValue("totalimport")) || 0;
//     if (quantity <= 0) {
//       message.warning("Vui lòng nhập số lượng trước khi tạo serial!");
//       return;
//     }

//     const dateCode = dayjs().format("YYMM");
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//     const serials = Array.from({ length: quantity }, () => {
//       let randomPart = "";
//       for (let i = 0; i < 5; i++) {
//         randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
//       }
//       return `DHG${dateCode}${randomPart}`;
//     });

//     form.setFieldsValue({ serialNumber: serials.join(", ") });
//   };

//   const handleProductChange = (productName) => {
//     const productModels = warehouseList.filter(
//       (p) => p.ProductName === productName
//     );
//     setModels(productModels);
//     setSelectedModelInfo(null);
//     form.setFieldsValue({
//       Model: undefined,
//       BrandName: undefined,
//       DVT: undefined,
//       Type: undefined,
//       serialNumber: "",
//       totalimport: undefined
//     });
//   };

//   const handleModelChange = (model) => {
//     const selected = models.find((m) => m.Model === model);
//     if (selected) {
//       setSelectedModelInfo(selected);
//       form.setFieldsValue({
//         BrandName: selected.BrandName,
//         DVT: selected.DVT,
//         Type: selected.Type,
//       });
//     }
//   };

//   const handleOk = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();

//       const matchedItem = warehouseList.find(
//         (item) => item.Model === values.Model
//       );

//       if (!matchedItem) {
//         message.error("Model trong kho không khớp.");
//         return;
//       }

//       const ticket = values.Ticket || generateInvoiceNumber();

//       const importData = {
//         ProductName: values.ProductName || matchedItem.ProductName,
//         BrandName: values.BrandName || matchedItem.BrandName,
//         Type: values.Type || matchedItem.Type,
//         SerialNumber: values.serialNumber || "N/A",
//         Ticket: ticket,
//         NameImport: userName,
//         totalimport: Number(values.totalimport) || 0,
//         DVT: values.DVT || matchedItem.DVT,
//         Model: values.Model || matchedItem.Model,
//         TypeKho: "DHG", // Mặc định nhập vào kho DHG
//       };

//       // 1) Tạo bản ghi nhập kho
//       const createdImport = await createImportlists(importData);
//       const importItem = createdImport.data || createdImport;
//       const importId = importItem.id || importItem.documentId;

//       if (importId) {
//         await updateImportlists(importId, { Check: true });
//       }

//       // 2) Cập nhật số lượng kho
//       const kho = importData.TypeKho; // DHG
//       const qty = importData.totalimport;
//       const currentQty = matchedItem[kho] || 0;
//       const currentNTK = matchedItem.totalNTK || 0;
//       const currentCK = matchedItem.inventoryCK || 0;

//       await updateWarehouseDetails(matchedItem.id || matchedItem.documentId, {
//         [kho]: currentQty + qty,
//         totalNTK: currentNTK + qty,
//         inventoryCK: currentCK + qty,
//       });

//       notification.success({
//         message: "Nhập kho thành công",
//         description: `Đã nhập ${qty} ${importData.Model} vào kho DHG.`,
//       });

//       onConfirmSuccess?.();
//       onClose();
//     } catch (error) {
//       console.error("Lỗi nhập kho:", error);
//       message.error("Có lỗi xảy ra khi nhập kho.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const productNameOptions = [
//     ...new Set(warehouseList.map((p) => p.ProductName)),
//   ];

//   return (
//     <Modal
//       open={open}
//       onCancel={() => {
//         form.resetFields();
//         onClose();
//       }}
//       footer={null}
//       width={720}
//       centered
//       // Tận dụng class của AddExportList để lấy style Compact
//       className="add-export-list-modal"
//       style={{ top: 20 }}
//       title={
//         <div className="modal-title-wrapper">
//           <div className="icon-box" style={{ background: '#e6f7ff' }}>
//             <ImportOutlined style={{ color: '#1890ff' }} />
//           </div>
//           <div>
//             <Title level={5} style={{ margin: 0 }}>Nhập kho thiết bị (DHG)</Title>
//             <Text type="secondary" style={{ fontSize: 12 }}>Nhập mới thiết bị vào kho tổng</Text>
//           </div>
//         </div>
//       }
//     >
//       <Form form={form} layout="vertical" size="small">

//         {/* SECTION 1: THÔNG TIN SẢN PHẨM */}
//         <Card className="section-card" bordered={false}>
//           <Row gutter={12}>
//             <Col span={12}>
//               <Form.Item
//                 name="ProductName"
//                 label="Sản phẩm"
//                 rules={[{ required: true, message: "Chọn sản phẩm" }]}
//               >
//                 <Select showSearch placeholder="Chọn tên thiết bị..." onChange={handleProductChange}>
//                   {productNameOptions.map((name, idx) => (
//                     <Option key={idx} value={name}>{name}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="Model"
//                 label="Model"
//                 rules={[{ required: true, message: "Chọn Model" }]}
//               >
//                 <Select
//                   placeholder="Chọn Model..."
//                   disabled={!models.length}
//                   showSearch
//                   onChange={handleModelChange}
//                 >
//                   {models.map((m) => (
//                     <Option key={m.id} value={m.Model}>{m.Model}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* Input ẩn để submit form */}
//           <div style={{ display: 'none' }}>
//             <Form.Item name="BrandName"><Input /></Form.Item>
//             <Form.Item name="Type"><Input /></Form.Item>
//             <Form.Item name="DVT"><Input /></Form.Item>
//             <Form.Item name="Ticket"><Input /></Form.Item>
//             <Form.Item name="NameImport"><Input /></Form.Item>
//           </div>

//           {/* Info box hiển thị chi tiết Model */}
//           {selectedModelInfo && (
//             <div className="info-box">
//               <Descriptions column={4} size="small" layout="vertical">
//                 <Descriptions.Item label="Hãng">
//                   <Tag color="cyan" style={{ margin: 0 }}>{selectedModelInfo.BrandName}</Tag>
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Loại">
//                   {selectedModelInfo.Type}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Đơn vị">
//                   {selectedModelInfo.DVT}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Tồn kho hiện tại">
//                   <b style={{ color: '#1890ff' }}>{selectedModelInfo.DHG || 0}</b>
//                 </Descriptions.Item>
//               </Descriptions>
//             </div>
//           )}
//         </Card>

//         {/* SECTION 2: CHI TIẾT NHẬP */}
//         <Card className="section-card mt-2" title="Thông tin nhập hàng" size="small">
//           <Row gutter={12}>
//             <Col span={8}>
//               <Form.Item
//                 name="totalimport"
//                 label="Số lượng nhập"
//                 rules={[{ required: true, message: "Nhập SL" }]}
//               >
//                 <InputNumber
//                   min={1}
//                   style={{ width: "100%" }}
//                   placeholder="VD: 10"
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={16}>
//               <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
//                 <Form.Item
//                   name="serialNumber"
//                   label="Danh sách Serial Number"
//                   style={{ flex: 1, marginBottom: 8 }}
//                 >
//                   <Input.TextArea
//                     rows={1}
//                     placeholder="Nhập thủ công hoặc tạo tự động"
//                     style={{ fontFamily: 'monospace' }}
//                   />
//                 </Form.Item>
//                 <Button
//                   type="dashed"
//                   icon={<ReloadOutlined />}
//                   onClick={generateSerialNumbers}
//                   style={{ marginBottom: 8 }}
//                   title="Tự động sinh Serial theo quy tắc"
//                 >
//                   Tạo Auto
//                 </Button>
//               </div>
//               <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic', marginTop: -4 }}>
//                 * Nhấn "Tạo Auto" để hệ thống tự sinh mã Serial duy nhất.
//               </div>
//             </Col>
//           </Row>

//           <Divider style={{ margin: '12px 0' }} dashed />

//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#888' }}>
//             <Space size={4}>
//               <UserOutlined /> Người nhập: <b>{userName || "N/A"}</b>
//             </Space>
//             <Space size={4}>
//               <GoldOutlined /> Mã phiếu: <Tag color="blue" style={{ margin: 0 }}>{form.getFieldValue("Ticket")}</Tag>
//             </Space>
//           </div>
//         </Card>

//         {/* FOOTER ACTIONS */}
//         <div className="form-actions">
//           <Button
//             size="small"
//             icon={<CloseOutlined />}
//             onClick={() => {
//               form.resetFields();
//               onClose();
//             }}
//             style={{ marginRight: 8 }}
//           >
//             Hủy
//           </Button>
//           <Button
//             size="small"
//             type="primary"
//             icon={<SaveOutlined />}
//             loading={loading}
//             onClick={handleOk}
//           >
//             Xác nhận nhập kho
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default AddImportList;


import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  notification,
  Descriptions,
  InputNumber,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Space,
  Tag
} from "antd";
import {
  ImportOutlined,
  UserOutlined,
  BarcodeOutlined,
  SaveOutlined,
  CloseOutlined,
  ReloadOutlined,
  GoldOutlined
} from '@ant-design/icons';
import {
  createImportlists,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  updateImportlists,
} from "../../../services/dhgServices";
import dayjs from "dayjs";
import "./AddExportList.scss"; // Vẫn dùng file này nhưng sẽ chỉnh CSS bên dưới

const { Option } = Select;
const { Text, Title } = Typography;

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `SPCDHG${year}${unique}`;
};

const AddImportList = ({ open, onClose, onConfirmSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);

  const [models, setModels] = useState([]);
  const [selectedModelInfo, setSelectedModelInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.account?.Name || "");
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const loadWarehouse = async () => {
      try {
        const res = await fetchWarehouseDetails();
        const data = Array.isArray(res) ? res : (res.data || []);
        setWarehouseList(data);
      } catch (error) {
        console.error("Lỗi khi tải kho:", error);
      }
    };
    if (open) {
      loadWarehouse();
      form.resetFields();
      setModels([]);
      setSelectedModelInfo(null);
      form.setFieldsValue({
        Ticket: generateInvoiceNumber(),
        NameImport: userName
      });
    }
  }, [open, form, userName]);

  const generateSerialNumbers = () => {
    const serialNumber = form.getFieldValue("serialNumber");
    if (serialNumber && serialNumber.trim()) return;

    const quantity = Number(form.getFieldValue("totalimport")) || 0;
    if (quantity <= 0) {
      message.warning("Vui lòng nhập số lượng trước khi tạo serial!");
      return;
    }

    const dateCode = dayjs().format("YYMM");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const serials = Array.from({ length: quantity }, () => {
      let randomPart = "";
      for (let i = 0; i < 5; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `DHG${dateCode}${randomPart}`;
    });

    form.setFieldsValue({ serialNumber: serials.join(", ") });
  };

  const handleProductChange = (productName) => {
    const productModels = warehouseList.filter((p) => p.ProductName === productName);
    setModels(productModels);
    setSelectedModelInfo(null);
    form.setFieldsValue({
      Model: undefined,
      BrandName: undefined,
      DVT: undefined,
      Type: undefined,
      serialNumber: "",
      totalimport: undefined
    });
  };

  const handleModelChange = (model) => {
    const selected = models.find((m) => m.Model === model);
    if (selected) {
      setSelectedModelInfo(selected);
      form.setFieldsValue({
        BrandName: selected.BrandName,
        DVT: selected.DVT,
        Type: selected.Type,
      });
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const matchedItem = warehouseList.find((item) => item.Model === values.Model);

      if (!matchedItem) {
        message.error("Model trong kho không khớp.");
        return;
      }

      const ticket = values.Ticket || generateInvoiceNumber();
      const importData = {
        ProductName: values.ProductName || matchedItem.ProductName,
        BrandName: values.BrandName || matchedItem.BrandName,
        Type: values.Type || matchedItem.Type,
        SerialNumber: values.serialNumber || "N/A",
        Ticket: ticket,
        NameImport: userName,
        totalimport: Number(values.totalimport) || 0,
        DVT: values.DVT || matchedItem.DVT,
        Model: values.Model || matchedItem.Model,
        TypeKho: "DHG",
      };

      const createdImport = await createImportlists(importData);
      const importItem = createdImport.data || createdImport;
      const importId = importItem.id || importItem.documentId;

      if (importId) await updateImportlists(importId, { Check: true });

      const kho = importData.TypeKho;
      const qty = importData.totalimport;
      const currentQty = matchedItem[kho] || 0;
      const currentNTK = matchedItem.totalNTK || 0;
      const currentCK = matchedItem.inventoryCK || 0;

      await updateWarehouseDetails(matchedItem.id || matchedItem.documentId, {
        [kho]: currentQty + qty,
        totalNTK: currentNTK + qty,
        inventoryCK: currentCK + qty,
      });

      notification.success({
        message: "Nhập kho thành công",
        description: `Đã nhập ${qty} ${importData.Model} vào kho DHG.`,
      });

      onConfirmSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      message.error("Có lỗi xảy ra khi nhập kho.");
    } finally {
      setLoading(false);
    }
  };

  const productNameOptions = [...new Set(warehouseList.map((p) => p.ProductName))];

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={900} // Tăng chiều rộng lên 900
      centered
      className="add-export-list-modal medium-size-modal" // Thêm class medium-size-modal
      title={
        <div className="modal-title-wrapper">
          <div className="icon-box" style={{ background: '#e6f7ff', width: 40, height: 40 }}>
            <ImportOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Nhập kho thiết bị (DHG)</Title>
            <Text type="secondary">Tạo phiếu nhập mới vào kho tổng</Text>
          </div>
        </div>
      }
    >
      {/* Bỏ size="small" để về mặc định (trung bình) */}
      <Form form={form} layout="vertical" size="middle">

        <Card className="section-card" bordered={false}>
          <Row gutter={24}> {/* Tăng khoảng cách cột */}
            <Col span={12}>
              <Form.Item
                name="ProductName"
                label="Sản phẩm"
                rules={[{ required: true, message: "Chọn sản phẩm" }]}
              >
                <Select showSearch placeholder="Chọn tên thiết bị..." onChange={handleProductChange} style={{ width: '100%' }}>
                  {productNameOptions.map((name, idx) => (
                    <Option key={idx} value={name}>{name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Model"
                label="Model"
                rules={[{ required: true, message: "Chọn Model" }]}
              >
                <Select
                  placeholder="Chọn Model..."
                  disabled={!models.length}
                  showSearch
                  onChange={handleModelChange}
                  style={{ width: '100%' }}
                >
                  {models.map((m) => (
                    <Option key={m.id} value={m.Model}>{m.Model}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'none' }}>
            <Form.Item name="BrandName"><Input /></Form.Item>
            <Form.Item name="Type"><Input /></Form.Item>
            <Form.Item name="DVT"><Input /></Form.Item>
            <Form.Item name="Ticket"><Input /></Form.Item>
            <Form.Item name="NameImport"><Input /></Form.Item>
          </div>

          {selectedModelInfo && (
            <div className="info-box" style={{ padding: '16px 20px' }}> {/* Tăng padding info box */}
              <Descriptions column={4} layout="vertical">
                <Descriptions.Item label="Hãng">
                  <Tag color="cyan" style={{ fontSize: 14, padding: '4px 10px' }}>{selectedModelInfo.BrandName}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Loại" contentStyle={{ fontWeight: 600 }}>
                  {selectedModelInfo.Type}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn vị" contentStyle={{ fontWeight: 600 }}>
                  {selectedModelInfo.DVT}
                </Descriptions.Item>
                <Descriptions.Item label="Tồn kho hiện tại">
                  <span style={{ color: '#1890ff', fontSize: 18, fontWeight: 'bold' }}>{selectedModelInfo.DHG || 0}</span>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Card>

        <Card className="section-card mt-3" title="Thông tin nhập hàng" style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="totalimport"
                label="Số lượng nhập"
                rules={[{ required: true, message: "Nhập SL" }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="VD: 10"
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                <Form.Item
                  name="serialNumber"
                  label="Danh sách Serial Number"
                  style={{ flex: 1, marginBottom: 0 }} // Reset margin bottom vì dùng flex
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="Nhập thủ công hoặc tạo tự động"
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>
                <Button
                  type="dashed"
                  icon={<ReloadOutlined />}
                  onClick={generateSerialNumbers}
                  style={{ height: 32 }} // Chiều cao chuẩn
                >
                  Tạo Auto
                </Button>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                * Nhấn "Tạo Auto" để hệ thống tự sinh mã Serial duy nhất.
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#666' }}>
            <Space size={8}>
              <UserOutlined /> Người nhập: <b>{userName || "N/A"}</b>
            </Space>
            <Space size={8}>
              <GoldOutlined /> Mã phiếu: <Tag color="blue" style={{ fontSize: 13 }}>{form.getFieldValue("Ticket")}</Tag>
            </Space>
          </div>
        </Card>

        <div className="form-actions" style={{ marginTop: 24, paddingTop: 16 }}>
          <Button
            size="middle"
            icon={<CloseOutlined />}
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            style={{ marginRight: 12, height: 40, padding: '0 24px' }}
          >
            Hủy
          </Button>
          <Button
            size="middle"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleOk}
            style={{ height: 40, padding: '0 24px', fontSize: 14 }}
          >
            Xác nhận nhập kho
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddImportList;
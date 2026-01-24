// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Select,
//   Descriptions,
//   Tag,
// } from "antd";
// import { PlusCircleOutlined } from "@ant-design/icons";
// import { fetchUsers } from "../../../services/abicoServices";
// import {
//   createExportlists,
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
//   updateExportlists,
// } from "../../../services/dhgServices";

// const { Option } = Select;

// const generateInvoiceNumber = () => {
//   const year = new Date().getFullYear();
//   const unique = Math.floor(Math.random() * 1000000);
//   return `SPDHG${year}${unique}`;
// };

// // Hàm tính chiều rộng dropdown theo dữ liệu
// const getDropdownWidth = (options) => {
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   context.font = "14px Arial";
//   let maxWidth = 0;
//   options.forEach((opt) => {
//     const metrics = context.measureText(opt.label || "");
//     if (metrics.width > maxWidth) {
//       maxWidth = metrics.width;
//     }
//   });
//   return maxWidth + 40; // cộng padding + scroll
// };

// const AddExportList = ({ isModalOpen, onCancel, onCreated = () => {} }) => {
//   const [form] = Form.useForm();
//   const [products, setProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [brandnames, setBrandnames] = useState([]);
//   const [userName, setUserName] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);

//   useEffect(() => {
//     const loadUsers = async () => {
//       setLoadingUsers(true);
//       try {
//         const res = await fetchUsers();
//         if (res) setUsers(res);
//       } catch (error) {
//         console.error("Lỗi khi fetch users:", error);
//       } finally {
//         setLoadingUsers(false);
//       }
//     };
//     loadUsers();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetchWarehouseDetails();
//         setProducts(response.data);
//       } catch (error) {
//         message.error("Lỗi khi tải danh sách sản phẩm");
//       }
//     };
//     fetchData();

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
//     if (isModalOpen) {
//       form.resetFields();
//       form.setFieldsValue({
//         Ticket: generateInvoiceNumber(),
//         NameCreate: userName,
//       });
//     }
//   }, [isModalOpen, form, userName]);

//   const handleProductChange = (productName) => {
//     const productModels = products.filter(
//       (p) => p.attributes.ProductName === productName
//     );
//     setModels(productModels);
//     setBrandnames([]);
//     form.setFieldsValue({
//       Model: undefined,
//       DVT: undefined,
//       totalexport: undefined,
//       BrandName: undefined,
//       Type: undefined,
//     });
//   };

//   const handleModelChange = (model) => {
//     const selected = models.find((m) => m.attributes.Model === model);

//     if (selected) {
//       form.setFieldsValue({
//         DVT: selected.attributes.DVT,
//         Type: selected.attributes.Type,
//         BrandName: undefined,
//         totalexport: undefined,
//         SerialNumber: "",
//         idModel: selected.id,
//       });

//       const relatedBrands = products
//         .filter((p) => p.attributes.Model === model)
//         .map((p) => ({
//           id: p.id,
//           attributes: { BrandName: p.attributes.BrandName },
//         }));

//       setBrandnames(relatedBrands);
//       if (relatedBrands.length) {
//         form.setFieldsValue({
//           BrandName: relatedBrands[0].attributes.BrandName,
//         });
//       }
//     }
//   };

//   const handleOk = async () => {
//     try {
//       await form.validateFields();

//       const values = {
//         ...form.getFieldsValue(),
//         NameCreate: userName,
//         Ticket: form.getFieldValue("Ticket") || generateInvoiceNumber(),
//         TicketDHG: form.getFieldValue("TicketDHG"),
//         Status: "Chờ duyệt",
//       };

//       if (!values.SerialNumber || values.SerialNumber.length === 0) {
//         message.error("Vui lòng nhập số serial!");
//         return;
//       }

//       // Tạo phiếu trả kho POS/POSHN
//       const response = await createExportlists(values);
//       const exportItem = response.data;

//       // Lấy thông tin kho
//       const warehouseList = await fetchWarehouseDetails();
//       const matched = warehouseList.data.find(
//         (w) => w.attributes.Model === values.Model
//       );

//       if (matched) {
//         const {
//           POS = 0,
//           POSHN = 0,
//           totalNTK = 0,
//           inventoryCK = 0,
//         } = matched.attributes;

//         const soLuong = values.totalexport;

//         // ✅ Cập nhật POS/POSHN + nhập kỳ + tồn cuối kỳ
//         const updatePayload = {
//           POS: values.TypeKho === "POS" ? POS + soLuong : POS,
//           POSHN: values.TypeKho === "POSHN" ? POSHN + soLuong : POSHN,
//           totalNTK: totalNTK + soLuong, // nhập trong kỳ
//           inventoryCK: inventoryCK + soLuong, // tồn cuối kỳ
//         };

//         await updateWarehouseDetails(matched.id, updatePayload);
//       } else {
//         message.warning("Không tìm thấy Model tương ứng trong kho.");
//       }

//       // Đánh dấu Check = true
//       await updateExportlists(exportItem.id, { Check: true });

//       message.success("Trả kho POS/POSHN thành công!");
//       form.resetFields();
//       onCreated(exportItem);
//     } catch (error) {
//       console.error("Lỗi khi trả kho POS/POSHN:", error);
//       message.error("Có lỗi xảy ra khi trả kho POS/POSHN.");
//     }
//   };

//   return (
//     <Modal
//       title={
//         <div className="modal-header">
//           <PlusCircleOutlined className="icon" />
//           <span className="title">Trả kho POS</span>
//         </div>
//       }
//       open={isModalOpen}
//       onOk={handleOk}
//       onCancel={onCancel}
//       okText="Lưu"
//       cancelText="Hủy"
//       width={800}
//       className="add-exportlist-modal"
//     >
//       <Form form={form} layout="vertical">
//         <Descriptions bordered column={2} size="small">
//           <Descriptions.Item label="Tên sản phẩm">
//             <Form.Item
//               name="ProductName"
//               rules={[{ required: true, message: "Chọn sản phẩm!" }]}
//               noStyle
//             >
//               <Select
//                 onChange={handleProductChange}
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     [
//                       ...new Set(products.map((p) => p.attributes.ProductName)),
//                     ].map((name) => ({ label: name }))
//                   ),
//                 }}
//                 style={{ width: 200 }}
//               >
//                 {[
//                   ...new Set(products.map((p) => p.attributes.ProductName)),
//                 ].map((name, index) => (
//                   <Option key={index} value={name}>
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
//                 onChange={handleModelChange}
//                 disabled={!models.length}
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     models.map((m) => ({ label: m.attributes.Model }))
//                   ),
//                 }}
//                 style={{ width: 200 }}
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

//           <Descriptions.Item label="Kho">
//             <Form.Item
//               name="TypeKho"
//               rules={[{ required: true, message: "Chọn kho!" }]}
//               noStyle
//             >
//               <Select
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth([
//                     { label: "POS" },
//                     { label: "POSHN" },
//                   ]),
//                 }}
//               >
//                 <Option value="POS">POS</Option>
//                 <Option value="POSHN">POSHN</Option>
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Ticket">
//             <Form.Item
//               name="TicketDHG"
//               rules={[{ message: "Nhập phiếu mượn DHG!" }]}
//               noStyle
//             >
//               <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Số lượng trả">
//             <Form.Item
//               name="totalexport"
//               rules={[{ required: true, message: "Nhập số lượng!" }]}
//               noStyle
//             >
//               <InputNumber min={1} style={{ width: "100%" }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Serial trả" span={2}>
//             <Form.Item
//               name="SerialNumber"
//               rules={[{ required: true, message: "Nhập serial!" }]}
//               noStyle
//             >
//               <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Người nhận hàng">
//             <Form.Item
//               name="NameExport"
//               rules={[{ required: true, message: "Chọn tên!" }]}
//               noStyle
//             >
//               <Select
//                 loading={loadingUsers}
//                 showSearch
//                 allowClear
//                 style={{ width: 200 }}
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     users
//                       .filter((u) => u.Exportlister === true)
//                       .map((u) => ({ label: u.Name }))
//                   ),
//                 }}
//               >
//                 {users
//                   .filter((u) => u.Exportlister === true)
//                   .map((u) => (
//                     <Option key={u.id} value={u.Name}>
//                       {u.Name}
//                     </Option>
//                   ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Người tạo phiếu">
//             <Form.Item name="NameCreate" initialValue={userName} noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Số phiếu">
//             <Form.Item
//               name="Ticket"
//               initialValue={generateInvoiceNumber()}
//               noStyle
//             >
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Trạng thái">
//             <Tag color="orange">Chờ duyệt</Tag>
//           </Descriptions.Item>
//         </Descriptions>
//       </Form>
//     </Modal>
//   );
// };

// export default AddExportList;


// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Select,
//   Descriptions,
//   Tag,
// } from "antd";
// import { PlusCircleOutlined } from "@ant-design/icons";
// import { fetchUsers } from "../../../services/abicoServices";
// import {
//   createExportlists,
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
//   updateExportlists,
// } from "../../../services/dhgServices";
// import "./AddExportList.scss"; // Giữ lại CSS nếu cần

// const { Option } = Select;

// const generateInvoiceNumber = () => {
//   const year = new Date().getFullYear();
//   const unique = Math.floor(Math.random() * 1000000);
//   return `SPDHG${year}${unique}`;
// };

// // Hàm tính chiều rộng dropdown theo dữ liệu
// const getDropdownWidth = (options) => {
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   context.font = "14px Arial";
//   let maxWidth = 0;
//   options.forEach((opt) => {
//     const metrics = context.measureText(opt.label || "");
//     if (metrics.width > maxWidth) {
//       maxWidth = metrics.width;
//     }
//   });
//   return maxWidth + 40; // cộng padding + scroll
// };

// const AddExportList = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
//   const [form] = Form.useForm();
//   const [products, setProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [brandnames, setBrandnames] = useState([]);
//   const [userName, setUserName] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);

//   useEffect(() => {
//     const loadUsers = async () => {
//       setLoadingUsers(true);
//       try {
//         const res = await fetchUsers();
//         // Strapi v5: user-permissions thường trả mảng trực tiếp
//         const data = Array.isArray(res) ? res : (res?.data || []);
//         setUsers(data);
//       } catch (error) {
//         console.error("Lỗi khi fetch users:", error);
//       } finally {
//         setLoadingUsers(false);
//       }
//     };
//     loadUsers();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetchWarehouseDetails();
//         // Strapi v5: response.data là mảng phẳng
//         const data = Array.isArray(response) ? response : (response.data || []);
//         setProducts(data);
//       } catch (error) {
//         message.error("Lỗi khi tải danh sách sản phẩm");
//       }
//     };
//     fetchData();

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
//     if (isModalOpen) {
//       form.resetFields();
//       form.setFieldsValue({
//         Ticket: generateInvoiceNumber(),
//         NameCreate: userName,
//       });
//     }
//   }, [isModalOpen, form, userName]);

//   const handleProductChange = (productName) => {
//     // Sửa: bỏ .attributes
//     const productModels = products.filter(
//       (p) => p.ProductName === productName
//     );
//     setModels(productModels);
//     setBrandnames([]);
//     form.setFieldsValue({
//       Model: undefined,
//       DVT: undefined,
//       totalexport: undefined,
//       BrandName: undefined,
//       Type: undefined,
//     });
//   };

//   const handleModelChange = (model) => {
//     // Sửa: bỏ .attributes
//     const selected = models.find((m) => m.Model === model);

//     if (selected) {
//       form.setFieldsValue({
//         DVT: selected.DVT,       // Sửa: bỏ .attributes
//         Type: selected.Type,     // Sửa: bỏ .attributes
//         BrandName: undefined,
//         totalexport: undefined,
//         SerialNumber: "",
//         idModel: selected.id || selected.documentId, // Sửa: lấy id
//       });

//       // Sửa: bỏ .attributes
//       const relatedBrands = products
//         .filter((p) => p.Model === model)
//         .map((p) => ({
//           id: p.id,
//           BrandName: p.BrandName,
//         }));

//       setBrandnames(relatedBrands);
//       if (relatedBrands.length) {
//         form.setFieldsValue({
//           BrandName: relatedBrands[0].BrandName,
//         });
//       }
//     }
//   };

//   const handleOk = async () => {
//     try {
//       await form.validateFields();

//       const values = {
//         ...form.getFieldsValue(),
//         NameCreate: userName,
//         Ticket: form.getFieldValue("Ticket") || generateInvoiceNumber(),
//         TicketDHG: form.getFieldValue("TicketDHG"),
//         Status: "Chờ duyệt",
//       };

//       if (!values.SerialNumber || values.SerialNumber.length === 0) {
//         message.error("Vui lòng nhập số serial!");
//         return;
//       }

//       // Tạo phiếu trả kho POS/POSHN
//       const response = await createExportlists(values);
//       // Strapi v5: response có thể là object trực tiếp hoặc { data: ... }
//       const exportItem = response.data || response;

//       // Lấy thông tin kho
//       const warehouseList = await fetchWarehouseDetails();
//       const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);

//       // Sửa: bỏ .attributes
//       const matched = warehouseData.find(
//         (w) => w.Model === values.Model
//       );

//       if (matched) {
//         // Sửa: bỏ .attributes
//         const {
//           POS = 0,
//           POSHN = 0,
//           totalNTK = 0,
//           inventoryCK = 0,
//         } = matched;

//         const soLuong = values.totalexport;

//         // ✅ Cập nhật POS/POSHN + nhập kỳ + tồn cuối kỳ
//         const updatePayload = {
//           POS: values.TypeKho === "POS" ? POS + soLuong : POS,
//           POSHN: values.TypeKho === "POSHN" ? POSHN + soLuong : POSHN,
//           totalNTK: totalNTK + soLuong, // nhập trong kỳ
//           inventoryCK: inventoryCK + soLuong, // tồn cuối kỳ
//         };

//         // Strapi v5: Update dùng id hoặc documentId
//         await updateWarehouseDetails(matched.id || matched.documentId, updatePayload);
//       } else {
//         message.warning("Không tìm thấy Model tương ứng trong kho.");
//       }

//       // Đánh dấu Check = true
//       await updateExportlists(exportItem.id || exportItem.documentId, { Check: true });

//       message.success("Trả kho POS/POSHN thành công!");
//       form.resetFields();
//       onCreated(exportItem);
//     } catch (error) {
//       console.error("Lỗi khi trả kho POS/POSHN:", error);
//       message.error("Có lỗi xảy ra khi trả kho POS/POSHN.");
//     }
//   };

//   return (
//     <Modal
//       title={
//         <div className="modal-header">
//           <PlusCircleOutlined className="icon" />
//           <span className="title">Trả kho POS</span>
//         </div>
//       }
//       open={isModalOpen}
//       onOk={handleOk}
//       onCancel={onCancel}
//       okText="Lưu"
//       cancelText="Hủy"
//       width={800}
//       className="add-exportlist-modal"
//     >
//       <Form form={form} layout="vertical">
//         <Descriptions bordered column={2} size="small">
//           <Descriptions.Item label="Tên sản phẩm">
//             <Form.Item
//               name="ProductName"
//               rules={[{ required: true, message: "Chọn sản phẩm!" }]}
//               noStyle
//             >
//               <Select
//                 onChange={handleProductChange}
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     // Sửa: bỏ .attributes
//                     [
//                       ...new Set(products.map((p) => p.ProductName)),
//                     ].map((name) => ({ label: name }))
//                   ),
//                 }}
//                 style={{ width: 200 }}
//               >
//                 {[
//                   ...new Set(products.map((p) => p.ProductName)), // Sửa: bỏ .attributes
//                 ].map((name, index) => (
//                   <Option key={index} value={name}>
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
//                 onChange={handleModelChange}
//                 disabled={!models.length}
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     models.map((m) => ({ label: m.Model })) // Sửa: bỏ .attributes
//                   ),
//                 }}
//                 style={{ width: 200 }}
//               >
//                 {models.map((m) => (
//                   <Option key={m.id} value={m.Model}> {/* Sửa: bỏ .attributes */}
//                     {m.Model} {/* Sửa: bỏ .attributes */}
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

//           <Descriptions.Item label="Kho">
//             <Form.Item
//               name="TypeKho"
//               rules={[{ required: true, message: "Chọn kho!" }]}
//               noStyle
//             >
//               <Select
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth([
//                     { label: "POS" },
//                     { label: "POSHN" },
//                   ]),
//                 }}
//               >
//                 <Option value="POS">POS</Option>
//                 <Option value="POSHN">POSHN</Option>
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Ticket">
//             <Form.Item
//               name="TicketDHG"
//               rules={[{ message: "Nhập phiếu mượn DHG!" }]}
//               noStyle
//             >
//               <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Số lượng trả">
//             <Form.Item
//               name="totalexport"
//               rules={[{ required: true, message: "Nhập số lượng!" }]}
//               noStyle
//             >
//               <InputNumber min={1} style={{ width: "100%" }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Serial trả" span={2}>
//             <Form.Item
//               name="SerialNumber"
//               rules={[{ required: true, message: "Nhập serial!" }]}
//               noStyle
//             >
//               <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Người nhận hàng">
//             <Form.Item
//               name="NameExport"
//               rules={[{ required: true, message: "Chọn tên!" }]}
//               noStyle
//             >
//               <Select
//                 loading={loadingUsers}
//                 showSearch
//                 allowClear
//                 style={{ width: 200 }}
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     users
//                       .filter((u) => u.Exportlister === true) // Sửa: bỏ .attributes
//                       .map((u) => ({ label: u.Name })) // Sửa: bỏ .attributes
//                   ),
//                 }}
//               >
//                 {users
//                   .filter((u) => u.Exportlister === true) // Sửa: bỏ .attributes
//                   .map((u) => (
//                     <Option key={u.id} value={u.Name}> {/* Sửa: bỏ .attributes */}
//                       {u.Name} {/* Sửa: bỏ .attributes */}
//                     </Option>
//                   ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Người tạo phiếu">
//             <Form.Item name="NameCreate" initialValue={userName} noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Số phiếu">
//             <Form.Item
//               name="Ticket"
//               initialValue={generateInvoiceNumber()}
//               noStyle
//             >
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Trạng thái">
//             <Tag color="orange">Chờ duyệt</Tag>
//           </Descriptions.Item>
//         </Descriptions>
//       </Form>
//     </Modal>
//   );
// };

// export default AddExportList;



import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Tag,
  Button,
  Descriptions,
  Space
} from "antd";
import {
  UndoOutlined, // Icon cho việc hoàn trả/trả kho
  BarcodeOutlined,
  UserOutlined,
  CloseOutlined,
  SaveOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";

import { fetchUsers } from "../../../services/abicoServices";
import {
  createExportlists,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  updateExportlists,
} from "../../../services/dhgServices";
import "./AddExportList.scss"; // Tận dụng lại file SCSS đã tối ưu ở bước trước

const { Option } = Select;
const { Text, Title } = Typography;

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `SPDHG${year}${unique}`;
};

const AddExportList = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModelInfo, setSelectedModelInfo] = useState(null);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetchUsers();
        setUsers(Array.isArray(res) ? res : (res?.data || []));
      } catch (error) {
        console.error("Lỗi khi fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWarehouseDetails();
        setProducts(Array.isArray(response) ? response : (response.data || []));
      } catch (error) {
        message.error("Lỗi khi tải danh sách sản phẩm");
      }
    };
    fetchData();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.account?.Name || "");
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      form.setFieldsValue({
        Ticket: generateInvoiceNumber(),
        NameCreate: userName,
      });
      setSelectedModelInfo(null);
      setModels([]);
    }
  }, [isModalOpen, form, userName]);

  /* ================= HANDLERS ================= */
  const handleProductChange = (productName) => {
    const productModels = products.filter((p) => p.ProductName === productName);
    setModels(productModels);
    setSelectedModelInfo(null);
    form.setFieldsValue({
      Model: undefined,
      DVT: undefined,
      totalexport: undefined,
      BrandName: undefined,
      Type: undefined,
      SerialNumber: "",
      idModel: undefined
    });
  };

  const handleModelChange = (model) => {
    const selected = models.find((m) => m.Model === model);
    if (selected) {
      setSelectedModelInfo(selected);
      form.setFieldsValue({
        DVT: selected.DVT,
        Type: selected.Type,
        BrandName: selected.BrandName,
        totalexport: undefined,
        idModel: selected.id || selected.documentId,
      });
    }
  };

  const handleOk = async () => {
    try {
      setLoadingSubmit(true);
      await form.validateFields();

      const values = {
        ...form.getFieldsValue(),
        NameCreate: userName,
        Ticket: form.getFieldValue("Ticket") || generateInvoiceNumber(),
        Status: "Chờ duyệt",
      };

      // 1. Tạo phiếu (ExportList nhưng bản chất là phiếu Trả)
      const response = await createExportlists(values);
      const exportItem = response.data || response;

      // 2. Cập nhật kho (CỘNG THÊM SỐ LƯỢNG)
      const warehouseList = await fetchWarehouseDetails();
      const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);
      const matched = warehouseData.find((w) => w.Model === values.Model);

      if (matched) {
        const {
          POS = 0,
          POSHN = 0,
          totalNTK = 0,
          inventoryCK = 0,
        } = matched;

        const soLuong = values.totalexport;

        // Logic cộng dồn
        const updatePayload = {
          POS: values.TypeKho === "POS" ? POS + soLuong : POS,
          POSHN: values.TypeKho === "POSHN" ? POSHN + soLuong : POSHN,
          totalNTK: totalNTK + soLuong, // Nhập trong kỳ tăng
          inventoryCK: inventoryCK + soLuong, // Tồn cuối kỳ tăng
        };

        await updateWarehouseDetails(matched.id || matched.documentId, updatePayload);
      } else {
        message.warning("Không tìm thấy Model trong kho để cập nhật tồn.");
      }

      // 3. Đánh dấu đã xử lý
      await updateExportlists(exportItem.id || exportItem.documentId, { Check: true });

      message.success("Trả kho POS/POSHN thành công!");
      form.resetFields();
      onCreated(exportItem);
      onCancel();
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Có lỗi xảy ra khi xử lý.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Modal
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      className="add-export-list-modal" // Dùng chung class với file trước để ăn CSS
      title={
        <div className="modal-title-wrapper">
          <div className="icon-box" style={{ background: '#f6ffed' }}>
            <UndoOutlined style={{ color: '#52c41a' }} />
          </div>
          <div>
            <Title level={5} style={{ margin: 0 }}>Trả kho POS / POSHN</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>Nhập thiết bị trả về kho</Text>
          </div>
        </div>
      }
    >
      <Form form={form} layout="vertical" size="middle">

        {/* === SECTION 1: CHỌN SẢN PHẨM === */}
        <Card className="section-card" bordered={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ProductName"
                label="Sản phẩm"
                rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
              >
                <Select showSearch placeholder="Chọn tên thiết bị" onChange={handleProductChange}>
                  {[...new Set(products.map(p => p.ProductName))].map((name, idx) => (
                    <Option key={idx} value={name}>{name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Model"
                label="Model"
                rules={[{ required: true, message: "Vui lòng chọn Model" }]}
              >
                <Select
                  placeholder="Chọn Model"
                  disabled={!models.length}
                  showSearch
                  onChange={handleModelChange}
                >
                  {models.map((m) => (
                    <Option key={m.id} value={m.Model}>{m.Model}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Ẩn input để giữ logic submit */}
          <div style={{ display: 'none' }}>
            <Form.Item name="BrandName"><Input /></Form.Item>
            <Form.Item name="Type"><Input /></Form.Item>
            <Form.Item name="DVT"><Input /></Form.Item>
            <Form.Item name="idModel"><Input /></Form.Item>
            <Form.Item name="NameCreate"><Input /></Form.Item>
            <Form.Item name="Ticket"><Input /></Form.Item>
          </div>

          {/* Hiển thị thông tin (Readonly) */}
          {selectedModelInfo && (
            <div className="info-box">
              <Descriptions column={3} size="small" layout="vertical">
                <Descriptions.Item label="Hãng SX">
                  <Tag color="blue">{selectedModelInfo.BrandName}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Loại">
                  {selectedModelInfo.Type}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn vị tính">
                  {selectedModelInfo.DVT}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Card>

        {/* === SECTION 2: CHI TIẾT TRẢ === */}
        <Card className="section-card mt-3" title="Chi tiết trả kho" size="small">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="TypeKho"
                label="Kho nhận (Trả về)"
                rules={[{ required: true, message: "Chọn kho nhận" }]}
              >
                <Select placeholder="Chọn kho...">
                  <Option value="POS">POS (Hồ Chí Minh)</Option>
                  <Option value="POSHN">POSHN (Hà Nội)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="TicketDHG"
                label="Số phiếu xuất kho"
                rules={[{ required: true, message: "Nhập mã phiếu mượn" }]}
              >
                <Input prefix={<FileTextOutlined style={{ color: '#bfbfbf' }} />} placeholder="VD: SPDHG..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalexport"
                label="Số lượng trả"
                rules={[{ required: true, message: "Nhập số lượng" }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Nhập số lượng"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="SerialNumber"
                label="Danh sách Serial Number trả về"
                rules={[{ required: true, message: "Bắt buộc nhập Serial" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Quét mã vạch hoặc nhập thủ công..."
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="NameExport"
                label="Người nhận hàng"
                rules={[{ required: true, message: "Chọn người nhận" }]}
              >
                <Select
                  loading={loadingUsers}
                  showSearch
                  placeholder="Chọn nhân viên..."
                  optionFilterProp="children"
                >
                  {users.filter((u) => u.Exportlister).map((u) => (
                    <Option key={u.id} value={u.Name}>{u.Name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} dashed />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#888' }}>
            <Space>
              <UserOutlined /> Tạo bởi: <b>{userName || "N/A"}</b>
            </Space>
            <Space>
              <SafetyCertificateOutlined /> Mã hệ thống: <Tag>{form.getFieldValue("Ticket")}</Tag>
            </Space>
          </div>
        </Card>

        {/* === FOOTER BUTTONS === */}
        <div className="form-actions">
          <Button icon={<CloseOutlined />} onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loadingSubmit}
            onClick={handleOk}
            style={{ background: '#52c41a', borderColor: '#52c41a' }} // Màu xanh lá cho hành động Trả/Nhập
          >
            Hoàn tất trả kho
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddExportList;
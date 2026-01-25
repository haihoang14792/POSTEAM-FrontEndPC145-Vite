// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   notification,
//   Descriptions,
// } from "antd";
// import { FileTextOutlined } from "@ant-design/icons";
// import {
//   fetchListSupplier,
//   createSupplierForm,
//   fetchWarehouseDetails,
// } from "../../../services/dhgServices";
// import { fetchUsers } from "../../../services/abicoServices";
// import { fetchListCustomer } from "../../../services/strapiServices";

// const { Option } = Select;

// // Hàm tạo số phiếu
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
//   return maxWidth + 40; // padding + scroll
// };

// const CreatePurchaseOrderModal = ({ visible, onCancel, onCreate }) => {
//   const [form] = Form.useForm();
//   const [suppliers, setSuppliers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [brandnames, setBrandNames] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [userName, setUserName] = useState("");
//   const [customersData, setCustomersData] = useState([]); // ✅ Lưu toàn bộ khách hàng
//   const [filteredStoreIDs, setFilteredStoreIDs] = useState([]); // ✅ StoreID theo customer
//   const [users, setUsers] = useState([]);
//   const [units, setUnits] = useState([]);

//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const res = await fetchUsers();
//         // Strapi v5: user-permissions thường trả mảng trực tiếp
//         const data = Array.isArray(res) ? res : (res?.data || []);
//         // Lọc ra những user có Purchaseer === true
//         const purchaseUsers = data.filter((u) => u.Purchaseer === true);
//         setUsers(purchaseUsers);
//       } catch (error) {
//         console.error("Lỗi khi fetch users:", error);
//       }
//     };

//     loadUsers();
//   }, []);

//   useEffect(() => {
//     if (visible) {
//       fetchListSupplier()
//         // Strapi v5: response có thể là mảng trực tiếp hoặc { data: [...] }
//         .then((res) => {
//           const data = Array.isArray(res) ? res : (res?.data || []);
//           setSuppliers(data);
//         })
//         .catch(() => notification.error({ message: "Lỗi tải nhà cung cấp" }));

//       fetchWarehouseDetails()
//         .then((res) => {
//           const data = Array.isArray(res) ? res : (res?.data || []);
//           setProducts(data);
//         })
//         .catch(() => notification.error({ message: "Lỗi tải sản phẩm" }));

//       // ✅ Lấy danh sách khách hàng + StoreID
//       fetchListCustomer()
//         .then((res) => {
//           const data = Array.isArray(res) ? res : (res?.data || []);
//           setCustomersData(data);
//         })
//         .catch(() => notification.error({ message: "Lỗi tải khách hàng" }));

//       // Lấy user từ localStorage
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         try {
//           const parsedUser = JSON.parse(storedUser);
//           setUserName(parsedUser?.account?.Name || "");
//         } catch {
//           setUserName("");
//         }
//       }

//       // Reset form và set giá trị mặc định
//       form.resetFields();
//       form.setFieldsValue({
//         ticket: generateInvoiceNumber(),
//         currency: "VNĐ",
//         // unit: "Cái",
//         quantity: 0,
//         unitPrice: 0,
//         totalAmount: 0,
//         vat: 0,
//         amountSupplier: 0,
//         shippingAddress: "677/7 Điện Biên Phủ, Phường Thạnh Mỹ Tây, Tp.HCM",
//         //purchaseUser: "Đinh Huy Hùng",
//         Status: "Chưa nhận hàng",
//         NameCreate: userName,
//       });
//     }
//   }, [visible, form, userName]);

//   // Cập nhật Models, BrandNames, Types khi chọn ProductName và Model
//   const handleProductChange = (productName) => {
//     // Sửa: bỏ .attributes
//     const filteredProducts = products.filter(
//       (p) => p.ProductName === productName
//     );
//     const uniqueModels = [
//       // Sửa: bỏ .attributes
//       ...new Set(filteredProducts.map((p) => p.Model)),
//     ];
//     setModels(uniqueModels);
//     setBrandNames([]);
//     setTypes([]);
//     form.setFieldsValue({
//       model: undefined,
//       brandname: undefined,
//       type: undefined,
//     });
//   };

//   const handleModelChange = (model) => {
//     // Sửa: bỏ .attributes
//     const filteredProducts = products.filter(
//       (p) => p.Model === model
//     );

//     if (filteredProducts.length === 0) return;

//     // Lấy giá trị duy nhất của Brand, Type, DVT
//     // Sửa: bỏ .attributes toàn bộ
//     const uniqueBrands = [
//       ...new Set(filteredProducts.map((p) => p.BrandName)),
//     ];
//     const uniqueTypes = [
//       ...new Set(filteredProducts.map((p) => p.Type)),
//     ];
//     const uniqueUnits = [
//       ...new Set(filteredProducts.map((p) => p.DVT)),
//     ];

//     setBrandNames(uniqueBrands);
//     setTypes(uniqueTypes);
//     setUnits(uniqueUnits); // ✅ mới

//     form.setFieldsValue({
//       brandname: uniqueBrands.length === 1 ? uniqueBrands[0] : undefined,
//       type: uniqueTypes.length === 1 ? uniqueTypes[0] : undefined,
//       unit: uniqueUnits.length === 1 ? uniqueUnits[0] : undefined, // ✅ mới
//     });
//   };

//   // ✅ Khi chọn Customer -> Lọc StoreID
//   const handleCustomerChange = (customerName) => {
//     if (customerName) {
//       // Sửa: bỏ .attributes
//       const storeList = customersData
//         .filter((c) => c.Customer === customerName)
//         .map((c) => c.StoreID);
//       setFilteredStoreIDs(storeList);
//       form.setFieldsValue({ storeID: undefined }); // reset storeID khi đổi customer
//     } else {
//       setFilteredStoreIDs([]);
//       form.setFieldsValue({ storeID: undefined });
//     }
//   };

//   // Tính toán tiền tự động
//   const onFormValuesChange = (_, allValues) => {
//     const quantity = Number(allValues.quantity || 0);
//     const unitPrice = Number(allValues.unitPrice || 0);
//     const totalAmount = quantity * unitPrice;
//     const vatRate = Number(allValues.selectedVat || 10);
//     const vat = Math.round(totalAmount * (vatRate / 100));
//     const amountSupplier = totalAmount + vat;
//     form.setFieldsValue({ totalAmount, vat, amountSupplier });
//   };

//   const currencyFormatter = (value) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//       maximumFractionDigits: 0,
//     }).format(value);

//   const currencyParser = (value) => value.replace(/[₫\s,.]/g, "");

//   const handleCreate = async (values) => {
//     const payload = {
//       ProductName: values.productName,
//       Model: values.model,
//       BrandName: values.brandname,
//       Type: values.type,
//       NameNCC: values.supplierName,
//       Purchuser: values.purchaseUser,
//       ShippingAddress: values.shippingAddress,
//       Note: values.note,
//       Ticket: values.ticket,
//       NameCreate: values.NameCreate,
//       Status: values.Status,
//       Currency: values.currency,
//       DVT: values.unit,
//       Qty: values.quantity,
//       UnitPrice: values.unitPrice,
//       TotalAmount: values.totalAmount,
//       VatRate: values.selectedVat,
//       Vat: values.vat,
//       AmountSupplier: values.amountSupplier,
//       Customer: values.customer,
//       StoreID: values.storeID,
//     };
//     try {
//       const result = await createSupplierForm(payload);
//       notification.success({
//         message: "Cập nhật thành công",
//         description: `Phiếu ${values.ticket} đã được cập nhật.`,
//       });
//       form.resetFields();
//       onCreate(values);
//     } catch (error) {
//       notification.error({ message: "Lỗi khi tạo phiếu" });
//     }
//   };

//   return (
//     <Modal
//       title={
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <FileTextOutlined style={{ fontSize: 20, marginRight: 8 }} />
//           <span>Tạo phiếu nhập</span>
//         </div>
//       }
//       open={visible}
//       onCancel={onCancel}
//       onOk={() => {
//         form
//           .validateFields()
//           .then((values) => handleCreate(values))
//           .catch((info) => console.log("Validate Failed:", info));
//       }}
//       width={800}
//       okText="Tạo"
//       cancelText="Hủy"
//     >
//       <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
//         <Descriptions bordered column={2} size="small">
//           <Descriptions.Item label="Số phiếu">
//             <Form.Item name="ticket" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Người tạo phiếu">
//             <Form.Item name="NameCreate" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Tình trạng">
//             <Form.Item name="Status" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>
//           <Descriptions.Item label="Người đề nghị">
//             <Form.Item
//               name="purchaseUser"
//               noStyle
//               rules={[
//                 { required: true, message: "Vui lòng chọn người đề nghị" },
//               ]}
//             >
//               <Select
//                 showSearch
//                 placeholder="Chọn người đề nghị"
//                 dropdownStyle={{ minWidth: 190 }}
//                 getPopupContainer={(trigger) => document.body}
//                 filterOption={(input, option) =>
//                   (option?.children ?? "")
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 }
//                 allowClear
//               >
//                 {users.map((user) => (
//                   <Option key={user.id} value={user.Name}>
//                     {user.Name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Khách hàng">
//             <Form.Item
//               name="customer"
//               noStyle
//               rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
//             >
//               <Select
//                 placeholder="Chọn khách hàng"
//                 showSearch
//                 allowClear
//                 onChange={handleCustomerChange} // ✅ gọi hàm lọc StoreID
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     [
//                       // Sửa: bỏ .attributes
//                       ...new Set(
//                         customersData.map((p) => p.Customer)
//                       ),
//                     ].map((name) => ({ label: name }))
//                   ),
//                 }}
//               >
//                 {[
//                   // Sửa: bỏ .attributes
//                   ...new Set(customersData.map((p) => p.Customer)),
//                 ].map((name) => (
//                   <Option key={name} value={name}>
//                     {name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           {/* ✅ StoreID */}
//           <Descriptions.Item label="StoreID">
//             <Form.Item
//               name="storeID"
//               noStyle
//               rules={[{ message: "Vui lòng chọn cửa hàng" }]}
//             >
//               <Select
//                 placeholder="Chọn cửa hàng"
//                 disabled={!filteredStoreIDs.length}
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     filteredStoreIDs.map((m) => ({ label: m }))
//                   ),
//                 }}
//               >
//                 {filteredStoreIDs.map((storeID) => (
//                   <Option key={storeID} value={storeID}>
//                     {storeID}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Tên sản phẩm">
//             <Form.Item
//               name="productName"
//               noStyle
//               rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
//             >
//               <Select
//                 placeholder="Chọn sản phẩm"
//                 onChange={handleProductChange}
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(
//                     [
//                       // Sửa: bỏ .attributes
//                       ...new Set(products.map((p) => p.ProductName)),
//                     ].map((name) => ({ label: name }))
//                   ),
//                 }}
//               >
//                 {[
//                   // Sửa: bỏ .attributes
//                   ...new Set(products.map((p) => p.ProductName)),
//                 ].map((name) => (
//                   <Option key={name} value={name}>
//                     {name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Model">
//             <Form.Item
//               name="model"
//               noStyle
//               rules={[{ required: true, message: "Vui lòng chọn model" }]}
//             >
//               <Select
//                 placeholder="Chọn model"
//                 disabled={!models.length}
//                 onChange={handleModelChange}
//                 showSearch
//                 allowClear
//                 dropdownStyle={{
//                   minWidth: getDropdownWidth(models.map((m) => ({ label: m }))),
//                 }}
//               >
//                 {models.map((model) => (
//                   <Option key={model} value={model}>
//                     {model}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Thương hiệu">
//             <Form.Item
//               name="brandname"
//               noStyle
//               rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
//             >
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>
//           <Descriptions.Item label="Loại sản phẩm">
//             <Form.Item
//               name="type"
//               noStyle
//               rules={[
//                 { required: true, message: "Vui lòng chọn loại sản phẩm" },
//               ]}
//             >
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Loại tiền">
//             <Form.Item name="currency" noStyle>
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="ĐVT">
//             <Form.Item
//               name="unit"
//               noStyle
//               rules={[{ required: true, message: "Vui lòng chọn loại ĐVT" }]}
//             >
//               <Input readOnly />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Thuế (%)">
//             <Form.Item
//               name="selectedVat"
//               noStyle
//               initialValue={10} // mặc định 10%
//             >
//               <Select
//                 style={{ width: "100%" }}
//                 onChange={(value) => {
//                   // Lấy số lượng và đơn giá hiện tại
//                   const quantity = Number(form.getFieldValue("quantity") || 0);
//                   const unitPrice = Number(
//                     form.getFieldValue("unitPrice") || 0
//                   );
//                   const totalAmount = quantity * unitPrice;
//                   const vat = Math.round(totalAmount * (value / 100));
//                   const amountSupplier = totalAmount + vat;
//                   form.setFieldsValue({ vat, amountSupplier });
//                 }}
//               >
//                 <Select.Option value={0}>0%</Select.Option>
//                 <Select.Option value={8}>8%</Select.Option>
//                 <Select.Option value={10}>10%</Select.Option>
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Số lượng">
//             <Form.Item
//               name="quantity"
//               noStyle
//               rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
//             >
//               <InputNumber min={0} style={{ width: "100%" }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Đơn giá">
//             <Form.Item
//               name="unitPrice"
//               noStyle
//               rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
//             >
//               <InputNumber min={0} style={{ width: "100%" }} />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Giá chưa VAT">
//             <Form.Item name="totalAmount" noStyle>
//               <InputNumber
//                 readOnly
//                 style={{ width: "100%" }}
//                 formatter={currencyFormatter}
//                 parser={currencyParser}
//               />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="VAT">
//             <Form.Item name="vat" noStyle>
//               <InputNumber
//                 readOnly
//                 style={{ width: "100%" }}
//                 formatter={currencyFormatter}
//                 parser={currencyParser}
//               />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Tổng cộng" span={2}>
//             <Form.Item name="amountSupplier" noStyle>
//               <InputNumber
//                 readOnly
//                 style={{ width: "100%" }}
//                 formatter={currencyFormatter}
//                 parser={currencyParser}
//               />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Tên nhà cung cấp" span={2}>
//             <Form.Item
//               name="supplierName"
//               noStyle
//               rules={[
//                 { required: true, message: "Vui lòng chọn nhà cung cấp" },
//               ]}
//             >
//               <Select
//                 placeholder="Chọn nhà cung cấp"
//                 showSearch
//                 allowClear
//                 dropdownStyle={{ minWidth: 500 }}
//                 getPopupContainer={(trigger) => document.body}
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().includes(input.toLowerCase())
//                 }
//               >
//                 {suppliers.length > 0 ? (
//                   suppliers
//                     // Sửa: bỏ .attributes
//                     .filter((supplier) => supplier.NameNCC)
//                     .map((supplier) => (
//                       <Option
//                         key={supplier.id}
//                         value={supplier.NameNCC} // Sửa: bỏ .attributes
//                       >
//                         {supplier.NameNCC} {/* Sửa: bỏ .attributes */}
//                       </Option>
//                     ))
//                 ) : (
//                   <Option disabled value="">
//                     Không có dữ liệu nhà cung cấp
//                   </Option>
//                 )}
//               </Select>
//             </Form.Item>
//           </Descriptions.Item>
//           <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
//             <Form.Item
//               name="shippingAddress"
//               noStyle
//               rules={[
//                 { required: true, message: "Vui lòng nhập địa chỉ nhận hàng" },
//               ]}
//             >
//               <Input placeholder="Nhập địa chỉ nhận hàng" />
//             </Form.Item>
//           </Descriptions.Item>

//           <Descriptions.Item label="Ghi chú" span={2}>
//             <Form.Item name="note" noStyle>
//               <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
//             </Form.Item>
//           </Descriptions.Item>
//         </Descriptions>
//       </Form>
//     </Modal>
//   );
// };

// export default CreatePurchaseOrderModal;



// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   notification,
//   Row,
//   Col,
//   Divider,
//   DatePicker
// } from "antd";
// import {
//   FileAddOutlined,
//   BarcodeOutlined,
//   ShopOutlined,
//   UserOutlined,
//   DollarOutlined,
//   EnvironmentOutlined,
//   AppstoreAddOutlined
// } from "@ant-design/icons";
// import {
//   fetchListSupplier,
//   createSupplierForm,
//   fetchWarehouseDetails,
// } from "../../../services/dhgServices";
// import { fetchUsers } from "../../../services/abicoServices";
// import { fetchListCustomer } from "../../../services/strapiServices";
// import "./CreatePurchaseOrderModal.scss";

// const { Option } = Select;

// // Hàm tạo số phiếu
// const generateInvoiceNumber = () => {
//   const year = new Date().getFullYear();
//   const unique = Math.floor(Math.random() * 1000000);
//   return `SPDHG${year}${unique}`;
// };

// const CreatePurchaseOrderModal = ({ visible, onCancel, onCreate }) => {
//   const [form] = Form.useForm();
//   const [suppliers, setSuppliers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [models, setModels] = useState([]);
//   const [brandnames, setBrandNames] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [userName, setUserName] = useState("");
//   const [customersData, setCustomersData] = useState([]);
//   const [filteredStoreIDs, setFilteredStoreIDs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [units, setUnits] = useState([]);

//   // --- LOGIC LOAD DATA GIỮ NGUYÊN ---
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const res = await fetchUsers();
//         const data = Array.isArray(res) ? res : (res?.data || []);
//         const purchaseUsers = data.filter((u) => u.Purchaseer === true);
//         setUsers(purchaseUsers);
//       } catch (error) {
//         console.error("Lỗi khi fetch users:", error);
//       }
//     };
//     loadUsers();
//   }, []);

//   useEffect(() => {
//     if (visible) {
//       // Load Suppliers
//       fetchListSupplier()
//         .then((res) => {
//           const data = Array.isArray(res) ? res : (res?.data || []);
//           setSuppliers(data);
//         })
//         .catch(() => notification.error({ message: "Lỗi tải nhà cung cấp" }));

//       // Load Products
//       fetchWarehouseDetails()
//         .then((res) => {
//           const data = Array.isArray(res) ? res : (res?.data || []);
//           setProducts(data);
//         })
//         .catch(() => notification.error({ message: "Lỗi tải sản phẩm" }));

//       // Load Customers
//       fetchListCustomer()
//         .then((res) => {
//           const data = Array.isArray(res) ? res : (res?.data || []);
//           setCustomersData(data);
//         })
//         .catch(() => notification.error({ message: "Lỗi tải khách hàng" }));

//       // Get User info
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         try {
//           const parsedUser = JSON.parse(storedUser);
//           setUserName(parsedUser?.account?.Name || "");
//         } catch {
//           setUserName("");
//         }
//       }

//       // Reset form
//       form.resetFields();
//       form.setFieldsValue({
//         ticket: generateInvoiceNumber(),
//         currency: "VNĐ",
//         quantity: 0,
//         unitPrice: 0,
//         totalAmount: 0,
//         vat: 0,
//         amountSupplier: 0,
//         shippingAddress: "677/7 Điện Biên Phủ, Phường Thạnh Mỹ Tây, Tp.HCM",
//         Status: "Chưa nhận hàng",
//         NameCreate: userName || "Admin", // Fallback nếu chưa load kịp userName
//         selectedVat: 10
//       });
//     }
//   }, [visible, form, userName]);

//   // --- HANDLERS GIỮ NGUYÊN ---
//   const handleProductChange = (productName) => {
//     const filteredProducts = products.filter((p) => p.ProductName === productName);
//     const uniqueModels = [...new Set(filteredProducts.map((p) => p.Model))];
//     setModels(uniqueModels);
//     setBrandNames([]);
//     setTypes([]);
//     form.setFieldsValue({
//       model: undefined,
//       brandname: undefined,
//       type: undefined,
//     });
//   };

//   const handleModelChange = (model) => {
//     const filteredProducts = products.filter((p) => p.Model === model);
//     if (filteredProducts.length === 0) return;

//     const uniqueBrands = [...new Set(filteredProducts.map((p) => p.BrandName))];
//     const uniqueTypes = [...new Set(filteredProducts.map((p) => p.Type))];
//     const uniqueUnits = [...new Set(filteredProducts.map((p) => p.DVT))];

//     setBrandNames(uniqueBrands);
//     setTypes(uniqueTypes);
//     setUnits(uniqueUnits);

//     form.setFieldsValue({
//       brandname: uniqueBrands.length === 1 ? uniqueBrands[0] : undefined,
//       type: uniqueTypes.length === 1 ? uniqueTypes[0] : undefined,
//       unit: uniqueUnits.length === 1 ? uniqueUnits[0] : undefined,
//     });
//   };

//   const handleCustomerChange = (customerName) => {
//     if (customerName) {
//       const storeList = customersData
//         .filter((c) => c.Customer === customerName)
//         .map((c) => c.StoreID);
//       setFilteredStoreIDs(storeList);
//       form.setFieldsValue({ storeID: undefined });
//     } else {
//       setFilteredStoreIDs([]);
//       form.setFieldsValue({ storeID: undefined });
//     }
//   };

//   const onFormValuesChange = (_, allValues) => {
//     const quantity = Number(allValues.quantity || 0);
//     const unitPrice = Number(allValues.unitPrice || 0);
//     const totalAmount = quantity * unitPrice;
//     const vatRate = Number(allValues.selectedVat ?? 10);
//     const vat = Math.round(totalAmount * (vatRate / 100));
//     const amountSupplier = totalAmount + vat;
//     form.setFieldsValue({ totalAmount, vat, amountSupplier });
//   };

//   const currencyFormatter = (value) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//       maximumFractionDigits: 0,
//     }).format(value);

//   const currencyParser = (value) => value.replace(/[₫\s,.]/g, "");

//   const handleCreate = async (values) => {
//     const payload = {
//       ProductName: values.productName,
//       Model: values.model,
//       BrandName: values.brandname,
//       Type: values.type,
//       NameNCC: values.supplierName,
//       Purchuser: values.purchaseUser,
//       ShippingAddress: values.shippingAddress,
//       Note: values.note,
//       Ticket: values.ticket,
//       NameCreate: values.NameCreate,
//       Status: values.Status,
//       Currency: values.currency,
//       DVT: values.unit,
//       Qty: values.quantity,
//       UnitPrice: values.unitPrice,
//       TotalAmount: values.totalAmount,
//       VatRate: values.selectedVat,
//       Vat: values.vat,
//       AmountSupplier: values.amountSupplier,
//       Customer: values.customer,
//       StoreID: values.storeID,
//     };
//     try {
//       await createSupplierForm(payload);
//       notification.success({
//         message: "Tạo phiếu thành công",
//         description: `Phiếu ${values.ticket} đã được khởi tạo.`,
//       });
//       form.resetFields();
//       onCreate(values);
//     } catch (error) {
//       notification.error({ message: "Lỗi khi tạo phiếu", description: error.message });
//     }
//   };

//   return (
//     <Modal
//       title={
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <FileAddOutlined />
//           <span>Tạo Phiếu Nhập Hàng Mới</span>
//         </div>
//       }
//       open={visible}
//       onCancel={onCancel}
//       onOk={() => form.submit()}
//       width={900}
//       okText="Lưu phiếu"
//       cancelText="Hủy bỏ"
//       className="create-purchase-order-modal"
//       centered
//     >
//       <Form form={form} layout="vertical" onFinish={handleCreate} onValuesChange={onFormValuesChange}>
//         {/* --- SECTION 1: THÔNG TIN SẢN PHẨM --- */}
//         <div className="section-title">Thông tin sản phẩm</div>
//         <Row gutter={16}>
//           <Col span={8}>
//             <Form.Item name="ticket" label="Số phiếu">
//               <Input prefix={<BarcodeOutlined style={{ color: '#bfbfbf' }} />} readOnly />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item name="NameCreate" label="Người tạo">
//               <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} readOnly />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item name="Status" label="Trạng thái">
//               <Input readOnly style={{ color: '#1890ff', fontWeight: 500 }} />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="productName"
//               label="Tên sản phẩm"
//               rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
//             >
//               <Select
//                 placeholder="Chọn sản phẩm"
//                 onChange={handleProductChange}
//                 showSearch
//                 allowClear
//                 prefix={<AppstoreAddOutlined />}
//               >
//                 {[...new Set(products.map((p) => p.ProductName))].map((name) => (
//                   <Option key={name} value={name}>{name}</Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="model"
//               label="Model"
//               rules={[{ required: true, message: "Vui lòng chọn model" }]}
//             >
//               <Select
//                 placeholder="Chọn model"
//                 disabled={!models.length}
//                 onChange={handleModelChange}
//                 showSearch
//                 allowClear
//               >
//                 {models.map((model) => (
//                   <Option key={model} value={model}>{model}</Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={8}>
//             <Form.Item name="brandname" label="Thương hiệu">
//               <Input readOnly />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item name="type" label="Loại sản phẩm">
//               <Input readOnly />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item name="unit" label="Đơn vị tính">
//               <Input readOnly />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Divider style={{ margin: '12px 0 24px' }} />

//         {/* --- SECTION 2: TÀI CHÍNH --- */}
//         <div className="section-title">Thông tin tài chính</div>
//         <Row gutter={16}>
//           <Col span={6}>
//             <Form.Item
//               name="quantity"
//               label="Số lượng"
//               rules={[{ required: true, message: "Nhập SL" }]}
//             >
//               <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item
//               name="unitPrice"
//               label="Đơn giá"
//               rules={[{ required: true, message: "Nhập giá" }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: "100%" }}
//                 formatter={currencyFormatter}
//                 parser={currencyParser}
//                 placeholder="0"
//                 prefix={<DollarOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item name="selectedVat" label="Thuế VAT">
//               <Select>
//                 <Option value={0}>0%</Option>
//                 <Option value={8}>8%</Option>
//                 <Option value={10}>10%</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item name="vat" label="Tiền thuế">
//               <InputNumber
//                 readOnly
//                 style={{ width: "100%" }}
//                 formatter={currencyFormatter}
//                 parser={currencyParser}
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item label="Thành tiền (Chưa VAT)" name="totalAmount">
//               <InputNumber
//                 readOnly
//                 style={{ width: "100%" }}
//                 formatter={currencyFormatter}
//                 parser={currencyParser}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item label="Tổng cộng (Gồm VAT)" name="amountSupplier" className="total-amount-field">
//               <InputNumber
//                 readOnly
//                 style={{ width: "100%" }}
//                 formatter={currencyFormatter}
//                 parser={currencyParser}
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Divider style={{ margin: '12px 0 24px' }} />

//         {/* --- SECTION 3: ĐỐI TÁC & LOGISTIC --- */}
//         <div className="section-title">Đối tác & Giao nhận</div>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="supplierName"
//               label="Nhà cung cấp"
//               rules={[{ required: true, message: "Chọn NCC" }]}
//             >
//               <Select
//                 placeholder="Chọn nhà cung cấp"
//                 showSearch
//                 allowClear
//                 filterOption={(input, option) =>
//                   (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
//                 }
//               >
//                 {suppliers.filter((s) => s.NameNCC).map((s) => (
//                   <Option key={s.id} value={s.NameNCC}>{s.NameNCC}</Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="purchaseUser"
//               label="Người đề nghị"
//               rules={[{ required: true, message: "Chọn người đề nghị" }]}
//             >
//               <Select
//                 placeholder="Chọn nhân viên"
//                 showSearch
//                 allowClear
//                 filterOption={(input, option) =>
//                   (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
//                 }
//               >
//                 {users.map((u) => (
//                   <Option key={u.id} value={u.Name}>{u.Name}</Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="customer"
//               label="Khách hàng"
//               rules={[{ required: true, message: "Chọn khách hàng" }]}
//             >
//               <Select
//                 placeholder="Chọn khách hàng"
//                 showSearch
//                 allowClear
//                 onChange={handleCustomerChange}
//               >
//                 {[...new Set(customersData.map((p) => p.Customer))].map((name) => (
//                   <Option key={name} value={name}>{name}</Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="storeID"
//               label="Mã cửa hàng (Store ID)"
//               rules={[{ message: "Chọn cửa hàng" }]}
//             >
//               <Select
//                 placeholder="Chọn Store ID"
//                 disabled={!filteredStoreIDs.length}
//                 showSearch
//                 allowClear
//               >
//                 {filteredStoreIDs.map((id) => (
//                   <Option key={id} value={id}>{id}</Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item
//           name="shippingAddress"
//           label="Địa chỉ giao hàng"
//           rules={[{ required: true, message: "Nhập địa chỉ" }]}
//         >
//           <Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập địa chỉ nhận hàng" />
//         </Form.Item>

//         <Form.Item name="note" label="Ghi chú">
//           <Input.TextArea rows={2} placeholder="Nhập ghi chú bổ sung (nếu có)" />
//         </Form.Item>

//         {/* Hidden field để lưu Currency nếu cần submit */}
//         <Form.Item name="currency" noStyle hidden>
//           <Input />
//         </Form.Item>

//       </Form>
//     </Modal>
//   );
// };

// export default CreatePurchaseOrderModal;




import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
  Row,
  Col,
  Divider,
} from "antd";
import {
  FileAddOutlined,
  BarcodeOutlined,
  UserOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  AppstoreAddOutlined,
  TagOutlined,
  DeploymentUnitOutlined,
  NumberOutlined
} from "@ant-design/icons";
import {
  fetchListSupplier,
  createSupplierForm,
  fetchWarehouseDetails,
} from "../../../services/dhgServices";
import { fetchUsers } from "../../../services/abicoServices";
import { fetchListCustomer } from "../../../services/strapiServices";
import "./CreatePurchaseOrderModal.scss";

const { Option } = Select;

// Hàm tạo số phiếu
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `SPDHG${year}${unique}`;
};

const CreatePurchaseOrderModal = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [models, setModels] = useState([]);
  const [brandnames, setBrandNames] = useState([]);
  const [types, setTypes] = useState([]);
  const [userName, setUserName] = useState("");
  const [customersData, setCustomersData] = useState([]);
  const [filteredStoreIDs, setFilteredStoreIDs] = useState([]);
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);

  // --- STATE MỚI: Kiểm soát hiển thị chi tiết ---
  const [showProductDetails, setShowProductDetails] = useState(false);

  // --- LOGIC LOAD DATA ---
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsers();
        const data = Array.isArray(res) ? res : (res?.data || []);
        const purchaseUsers = data.filter((u) => u.Purchaseer === true);
        setUsers(purchaseUsers);
      } catch (error) {
        console.error("Lỗi khi fetch users:", error);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (visible) {
      // Load Suppliers
      fetchListSupplier()
        .then((res) => {
          const data = Array.isArray(res) ? res : (res?.data || []);
          setSuppliers(data);
        })
        .catch(() => notification.error({ message: "Lỗi tải nhà cung cấp" }));

      // Load Products
      fetchWarehouseDetails()
        .then((res) => {
          const data = Array.isArray(res) ? res : (res?.data || []);
          setProducts(data);
        })
        .catch(() => notification.error({ message: "Lỗi tải sản phẩm" }));

      // Load Customers
      fetchListCustomer()
        .then((res) => {
          const data = Array.isArray(res) ? res : (res?.data || []);
          setCustomersData(data);
        })
        .catch(() => notification.error({ message: "Lỗi tải khách hàng" }));

      // Get User info
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser?.account?.Name || "");
        } catch {
          setUserName("");
        }
      }

      // Reset form & State
      setShowProductDetails(false); // Ẩn chi tiết khi mở modal
      form.resetFields();
      form.setFieldsValue({
        ticket: generateInvoiceNumber(),
        currency: "VNĐ",
        quantity: 0,
        unitPrice: 0,
        totalAmount: 0,
        vat: 0,
        amountSupplier: 0,
        shippingAddress: "677/7 Điện Biên Phủ, Phường Thạnh Mỹ Tây, Tp.HCM",
        Status: "Chưa nhận hàng",
        NameCreate: userName || "Admin",
        selectedVat: 10
      });
    }
  }, [visible, form, userName]);

  // --- HANDLERS ---
  const handleProductChange = (productName) => {
    const filteredProducts = products.filter((p) => p.ProductName === productName);
    const uniqueModels = [...new Set(filteredProducts.map((p) => p.Model))];
    setModels(uniqueModels);
    setBrandNames([]);
    setTypes([]);

    // Khi đổi sản phẩm cha -> Reset Model và Ẩn chi tiết
    setShowProductDetails(false);
    form.setFieldsValue({
      model: undefined,
      brandname: undefined,
      type: undefined,
      unit: undefined // Reset unit
    });
  };

  const handleModelChange = (model) => {
    // Nếu người dùng xóa Model (clear input)
    if (!model) {
      setShowProductDetails(false);
      form.setFieldsValue({
        brandname: undefined,
        type: undefined,
        unit: undefined,
      });
      return;
    }

    const filteredProducts = products.filter((p) => p.Model === model);
    if (filteredProducts.length === 0) return;

    const uniqueBrands = [...new Set(filteredProducts.map((p) => p.BrandName))];
    const uniqueTypes = [...new Set(filteredProducts.map((p) => p.Type))];
    const uniqueUnits = [...new Set(filteredProducts.map((p) => p.DVT))];

    setBrandNames(uniqueBrands);
    setTypes(uniqueTypes);
    setUnits(uniqueUnits);

    // Set giá trị và Hiện chi tiết
    form.setFieldsValue({
      brandname: uniqueBrands.length === 1 ? uniqueBrands[0] : undefined,
      type: uniqueTypes.length === 1 ? uniqueTypes[0] : undefined,
      unit: uniqueUnits.length === 1 ? uniqueUnits[0] : undefined,
    });
    setShowProductDetails(true);
  };

  const handleCustomerChange = (customerName) => {
    if (customerName) {
      const storeList = customersData
        .filter((c) => c.Customer === customerName)
        .map((c) => c.StoreID);
      setFilteredStoreIDs(storeList);
      form.setFieldsValue({ storeID: undefined });
    } else {
      setFilteredStoreIDs([]);
      form.setFieldsValue({ storeID: undefined });
    }
  };

  // Tính toán tiền tự động (Đã xử lý làm tròn số học cho VNĐ)
  const onFormValuesChange = (_, allValues) => {
    // 1. Ép kiểu về số (đề phòng InputNumber trả về string hoặc null)
    const quantity = Number(allValues.quantity) || 0;
    const unitPrice = Number(allValues.unitPrice) || 0;
    const vatRate = Number(allValues.selectedVat) ?? 10;

    // 2. Tính Thành tiền (Giá chưa VAT)
    // VNĐ không có số lẻ, nên làm tròn ngay kết quả nhân
    const totalAmount = Math.round(quantity * unitPrice);

    // 3. Tính tiền thuế VAT
    // Công thức: (Thành tiền * Thuế) / 100
    // Sử dụng Math.round để làm tròn số tiền thuế về số nguyên gần nhất
    const vat = Math.round((totalAmount * vatRate) / 100);

    // 4. Tính Tổng cộng
    // Tổng = Thành tiền + Thuế (Cả 2 số này đều đã là số nguyên nên cộng sẽ không bị lệch)
    const amountSupplier = totalAmount + vat;

    // 5. Cập nhật lại vào Form
    form.setFieldsValue({
      totalAmount: totalAmount,
      vat: vat,
      amountSupplier: amountSupplier
    });
  };

  const currencyFormatter = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const currencyParser = (value) => value.replace(/[₫\s,.]/g, "");

  const handleCreate = async (values) => {
    const payload = {
      ProductName: values.productName,
      Model: values.model,
      BrandName: values.brandname,
      Type: values.type,
      NameNCC: values.supplierName,
      Purchuser: values.purchaseUser,
      ShippingAddress: values.shippingAddress,
      Note: values.note,
      Ticket: values.ticket,
      NameCreate: values.NameCreate,
      Status: values.Status,
      Currency: values.currency,
      DVT: values.unit,
      Qty: values.quantity,
      UnitPrice: values.unitPrice,
      TotalAmount: values.totalAmount,
      VatRate: values.selectedVat,
      Vat: values.vat,
      AmountSupplier: values.amountSupplier,
      Customer: values.customer,
      StoreID: values.storeID,
    };
    try {
      await createSupplierForm(payload);
      notification.success({
        message: "Tạo phiếu thành công",
        description: `Phiếu ${values.ticket} đã được khởi tạo.`,
      });
      form.resetFields();
      onCreate(values);
    } catch (error) {
      notification.error({ message: "Lỗi khi tạo phiếu", description: error.message });
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileAddOutlined />
          <span>Tạo Phiếu Nhập Hàng Mới</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={900}
      okText="Lưu phiếu"
      cancelText="Hủy bỏ"
      className="create-purchase-order-modal"
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleCreate} onValuesChange={onFormValuesChange}>

        {/* --- SECTION 1: THÔNG TIN SẢN PHẨM --- */}
        <div className="section-title">Thông tin sản phẩm</div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="ticket" label="Số phiếu">
              <Input prefix={<BarcodeOutlined style={{ color: '#bfbfbf' }} />} readOnly />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="NameCreate" label="Người tạo">
              <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} readOnly />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="Status" label="Trạng thái">
              <Input readOnly className="status-input" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
            >
              <Select
                placeholder="Chọn sản phẩm"
                onChange={handleProductChange}
                showSearch
                allowClear
                prefix={<AppstoreAddOutlined />}
              >
                {[...new Set(products.map((p) => p.ProductName))].map((name) => (
                  <Option key={name} value={name}>{name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="model"
              label="Model"
              rules={[{ required: true, message: "Vui lòng chọn model" }]}
            >
              <Select
                placeholder="Chọn model"
                disabled={!models.length}
                onChange={handleModelChange}
                showSearch
                allowClear
              >
                {models.map((model) => (
                  <Option key={model} value={model}>{model}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* --- KHU VỰC HIỂN THỊ CHI TIẾT (CHỈ HIỆN KHI CÓ MODEL) --- */}
        {showProductDetails && (
          <div className="product-details-container">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="brandname" label="Thương hiệu">
                  <Input prefix={<TagOutlined style={{ color: '#bfbfbf' }} />} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="type" label="Loại sản phẩm">
                  <Input prefix={<DeploymentUnitOutlined style={{ color: '#bfbfbf' }} />} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="unit" label="Đơn vị tính">
                  <Input prefix={<NumberOutlined style={{ color: '#bfbfbf' }} />} readOnly />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}

        <Divider style={{ margin: '12px 0 24px' }} />

        {/* --- SECTION 2: TÀI CHÍNH --- */}
        <div className="section-title">Thông tin tài chính</div>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: "Nhập SL" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="unitPrice"
              label="Đơn giá"
              rules={[{ required: true, message: "Nhập giá" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={currencyFormatter}
                parser={currencyParser}
                placeholder="0"
                prefix={<DollarOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="selectedVat" label="Thuế VAT">
              <Select>
                <Option value={0}>0%</Option>
                <Option value={8}>8%</Option>
                <Option value={10}>10%</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="vat" label="Tiền thuế">
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Thành tiền (Chưa VAT)" name="totalAmount">
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tổng cộng (Gồm VAT)" name="amountSupplier" className="total-amount-field">
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0 24px' }} />

        {/* --- SECTION 3: ĐỐI TÁC & LOGISTIC --- */}
        <div className="section-title">Đối tác & Giao nhận</div>
        <Row gutter={16}>

          {/* <Form.Item
              name="supplierName"
              label="Nhà cung cấp"
              rules={[{ required: true, message: "Chọn NCC" }]}
            >
              <Select
                placeholder="Chọn nhà cung cấp"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                }
              >
                {suppliers.filter((s) => s.NameNCC).map((s) => (
                  <Option key={s.id} value={s.NameNCC}>{s.NameNCC}</Option>
                ))}
              </Select>
            </Form.Item> */}
          <Col xs={24} md={12}>
            <Form.Item
              name="supplierName"
              label="Nhà cung cấp"
              rules={[{ required: true, message: "Chọn NCC" }]}
            >
              <Select
                placeholder="Chọn nhà cung cấp"
                showSearch
                allowClear
                // 1. Tự động mở rộng menu theo tên dài nhất
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ maxWidth: 600, minWidth: 300 }}

                // 2. Chỉ định prop dùng để hiển thị và filter
                optionLabelProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              >
                {suppliers
                  .filter((s) => s.NameNCC)
                  .map((s) => (
                    <Option
                      key={s.id}
                      value={s.NameNCC}
                      label={s.NameNCC} // Prop này sẽ hiện trong ô input khi chọn
                    >
                      {/* Hiển thị trong menu xổ xuống */}
                      <div style={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        lineHeight: '1.5',
                        padding: '4px 0'
                      }}>
                        {s.NameNCC}
                      </div>
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="purchaseUser"
              label="Người đề nghị"
              rules={[{ required: true, message: "Chọn người đề nghị" }]}
            >
              <Select
                placeholder="Chọn nhân viên"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                }
              >
                {users.map((u) => (
                  <Option key={u.id} value={u.Name}>{u.Name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customer"
              label="Khách hàng"
              rules={[{ required: true, message: "Chọn khách hàng" }]}
            >
              <Select
                placeholder="Chọn khách hàng"
                showSearch
                allowClear
                onChange={handleCustomerChange}
              >
                {[...new Set(customersData.map((p) => p.Customer))].map((name) => (
                  <Option key={name} value={name}>{name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="storeID"
              label="Mã cửa hàng (Store ID)"
              rules={[{ message: "Chọn cửa hàng" }]}
            >
              <Select
                placeholder="Chọn Store ID"
                disabled={!filteredStoreIDs.length}
                showSearch
                allowClear
              >
                {filteredStoreIDs.map((id) => (
                  <Option key={id} value={id}>{id}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="shippingAddress"
          label="Địa chỉ giao hàng"
          rules={[{ required: true, message: "Nhập địa chỉ" }]}
        >
          <Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập địa chỉ nhận hàng" />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={2} placeholder="Nhập ghi chú bổ sung (nếu có)" />
        </Form.Item>

        {/* Hidden field */}
        <Form.Item name="currency" noStyle hidden><Input /></Form.Item>

      </Form>
    </Modal>
  );
};

export default CreatePurchaseOrderModal;
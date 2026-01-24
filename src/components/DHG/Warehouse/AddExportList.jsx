// import React, { useState, useEffect } from "react";
// import {
//     Modal,
//     Form,
//     Input,
//     InputNumber,
//     message,
//     Select,
//     Descriptions,
//     Tag,
// } from "antd";
// import { PlusCircleOutlined } from "@ant-design/icons";
// import {
//     createExportlists,
//     fetchWarehouseDetails,
//     updateWarehouseDetails,
//     updateExportlists,
// } from "../../../services/dhgServices";
// import { fetchUsers } from "../../../services/abicoServices";
// import "./AddExportList.scss";

// const { Option } = Select;

// const generateInvoiceNumber = () => {
//     const year = new Date().getFullYear();
//     const unique = Math.floor(Math.random() * 1000000);
//     return `SPDHG${year}${unique}`;
// };

// // Hàm tính chiều rộng dropdown theo dữ liệu
// const getDropdownWidth = (options) => {
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     context.font = "14px Arial";
//     let maxWidth = 0;
//     options.forEach((opt) => {
//         const metrics = context.measureText(opt.label || "");
//         if (metrics.width > maxWidth) {
//             maxWidth = metrics.width;
//         }
//     });
//     return maxWidth + 40; // cộng padding + scroll
// };

// const AddExportList = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
//     const [form] = Form.useForm();
//     const [products, setProducts] = useState([]);
//     const [models, setModels] = useState([]);
//     const [brandnames, setBrandnames] = useState([]);
//     const [maxQuantity, setMaxQuantity] = useState(0);
//     const [warning, setWarning] = useState("");
//     const [userName, setUserName] = useState("");
//     const [users, setUsers] = useState([]);
//     const [loadingUsers, setLoadingUsers] = useState(false);

//     useEffect(() => {
//         const loadUsers = async () => {
//             setLoadingUsers(true);
//             try {
//                 const res = await fetchUsers();
//                 // Strapi v5: nếu res là mảng thì dùng luôn, nếu là { data: [] } thì lấy data
//                 const userData = Array.isArray(res) ? res : (res?.data || []);
//                 if (userData) setUsers(userData);
//             } catch (error) {
//                 console.error("Lỗi khi fetch users:", error);
//             } finally {
//                 setLoadingUsers(false);
//             }
//         };
//         loadUsers();
//     }, []);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetchWarehouseDetails();
//                 // Strapi v5: response.data thường là mảng phẳng
//                 const data = Array.isArray(response) ? response : (response.data || []);
//                 setProducts(data);
//             } catch (error) {
//                 message.error("Lỗi khi tải danh sách sản phẩm");
//             }
//         };
//         fetchData();

//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             try {
//                 const parsedUser = JSON.parse(storedUser);
//                 setUserName(parsedUser?.account?.Name || "");
//             } catch (error) {
//                 console.error("Error parsing user from localStorage:", error);
//             }
//         }
//     }, []);

//     useEffect(() => {
//         if (isModalOpen) {
//             form.resetFields();
//             form.setFieldsValue({
//                 Ticket: generateInvoiceNumber(),
//                 NameCreate: userName,
//             });
//             setMaxQuantity(0);
//             setWarning("");
//         }
//     }, [isModalOpen, form, userName]);

//     const handleProductChange = (productName) => {
//         // Sửa: bỏ .attributes
//         const productModels = products.filter(
//             (p) => p.ProductName === productName
//         );
//         setModels(productModels);
//         setBrandnames([]);
//         form.setFieldsValue({
//             Model: undefined,
//             DVT: undefined,
//             totalexport: undefined,
//             BrandName: undefined,
//             Type: undefined,
//         });
//         setWarning("");
//     };

//     const handleModelChange = (model) => {
//         // Sửa: bỏ .attributes
//         const selected = models.find((m) => m.Model === model);

//         if (selected) {
//             form.setFieldsValue({
//                 DVT: selected.DVT, // Sửa: bỏ .attributes
//                 Type: selected.Type, // Sửa: bỏ .attributes
//                 BrandName: undefined,
//                 totalexport: undefined,
//                 SerialNumber: "",
//                 idModel: selected.id || selected.documentId, // Sửa: lấy id hoặc documentId
//             });

//             setMaxQuantity(selected.DHG); // Sửa: bỏ .attributes
//             setWarning(
//                 selected.DHG === 0 ? "Sản phẩm này không có trong kho!" : ""
//             );

//             // Sửa: bỏ .attributes
//             const relatedBrands = products
//                 .filter((p) => p.Model === model)
//                 .map((p) => ({
//                     id: p.id,
//                     BrandName: p.BrandName,
//                 }));

//             setBrandnames(relatedBrands);
//             if (relatedBrands.length) {
//                 form.setFieldsValue({
//                     BrandName: relatedBrands[0].BrandName,
//                 });
//             }
//         }
//     };

//     const handleOk = async () => {
//         try {
//             await form.validateFields();

//             const values = {
//                 ...form.getFieldsValue(),
//                 NameCreate: userName,
//                 Ticket: form.getFieldValue("Ticket") || generateInvoiceNumber(),
//                 TicketDHG: form.getFieldValue("TicketDHG"),
//                 Status: "Chờ duyệt",
//             };

//             if (!values.SerialNumber || values.SerialNumber.length === 0) {
//                 message.error("Vui lòng nhập số serial!");
//                 return;
//             }

//             if (values.totalexport > maxQuantity) {
//                 message.error(`Số lượng vượt quá tồn kho hiện tại (${maxQuantity})`);
//                 return;
//             }

//             const response = await createExportlists(values);
//             // Strapi v5: response có thể là object trực tiếp hoặc { data: ... }
//             const exportItem = response.data || response;

//             const warehouseList = await fetchWarehouseDetails();
//             const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);

//             // Sửa: bỏ .attributes
//             const matched = warehouseData.find(
//                 (w) => w.Model === values.Model
//             );

//             if (matched) {
//                 // Sửa: bỏ .attributes
//                 const { DHG = 0, POS = 0, POSHN = 0 } = matched;
//                 const soLuong = values.totalexport;

//                 const updatePayload = {
//                     DHG: DHG - soLuong,
//                     POS: values.TypeKho === "POS" ? POS + soLuong : POS,
//                     POSHN: values.TypeKho === "POSHN" ? POSHN + soLuong : POSHN,
//                 };

//                 // Strapi v5: Update thường dùng documentId nếu API public, hoặc id. Check matched.id
//                 await updateWarehouseDetails(matched.documentId || matched.id, updatePayload);
//             } else {
//                 message.warning("Không tìm thấy Model tương ứng trong kho.");
//             }

//             await updateExportlists(exportItem.documentId || exportItem.id, { Check: true });

//             message.success("Xuất thiết bị và cập nhật kho thành công!");
//             form.resetFields();
//             onCreated(exportItem);
//         } catch (error) {
//             console.error("Lỗi khi điều hàng:", error);
//             message.error("Có lỗi xảy ra khi điều hàng.");
//         }
//     };

//     return (
//         <Modal
//             title={
//                 <div className="modal-header">
//                     <PlusCircleOutlined className="icon" />
//                     <span className="title">Điều hàng kho DHG</span>
//                 </div>
//             }
//             open={isModalOpen}
//             onOk={handleOk}
//             onCancel={onCancel}
//             okText="Lưu"
//             cancelText="Hủy"
//             width={800}
//             className="add-exportlist-modal"
//         >
//             <Form form={form} layout="vertical">
//                 <Descriptions bordered column={2} size="small">
//                     <Descriptions.Item label="Tên sản phẩm">
//                         <Form.Item
//                             name="ProductName"
//                             rules={[{ required: true, message: "Chọn sản phẩm!" }]}
//                             noStyle
//                         >
//                             <Select
//                                 onChange={handleProductChange}
//                                 showSearch
//                                 allowClear
//                                 dropdownStyle={{
//                                     minWidth: getDropdownWidth(
//                                         [
//                                             ...new Set(products.map((p) => p.ProductName)), // Sửa: bỏ .attributes
//                                         ].map((name) => ({ label: name }))
//                                     ),
//                                 }}
//                                 style={{ width: 200 }}
//                             >
//                                 {[
//                                     ...new Set(products.map((p) => p.ProductName)), // Sửa: bỏ .attributes
//                                 ].map((name, index) => (
//                                     <Option key={index} value={name}>
//                                         {name}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Model">
//                         <Form.Item
//                             name="Model"
//                             rules={[{ required: true, message: "Chọn model!" }]}
//                             noStyle
//                         >
//                             <Select
//                                 onChange={handleModelChange}
//                                 disabled={!models.length}
//                                 showSearch
//                                 allowClear
//                                 dropdownStyle={{
//                                     minWidth: getDropdownWidth(
//                                         models.map((m) => ({ label: m.Model })) // Sửa: bỏ .attributes
//                                     ),
//                                 }}
//                                 style={{ width: 200 }}
//                             >
//                                 {models.map((m) => (
//                                     <Option key={m.id} value={m.Model}> {/* Sửa: bỏ .attributes */}
//                                         {m.Model} {/* Sửa: bỏ .attributes */}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Thương hiệu">
//                         <Form.Item name="BrandName" noStyle>
//                             <Input readOnly />
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="ĐVT">
//                         <Form.Item name="DVT" noStyle>
//                             <Input readOnly />
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Loại">
//                         <Form.Item name="Type" noStyle>
//                             <Input readOnly />
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Kho">
//                         <Form.Item
//                             name="TypeKho"
//                             rules={[{ required: true, message: "Chọn kho!" }]}
//                             noStyle
//                         >
//                             <Select
//                                 showSearch
//                                 allowClear
//                                 dropdownStyle={{
//                                     minWidth: getDropdownWidth([
//                                         { label: "POS" },
//                                         { label: "POSHN" },
//                                     ]),
//                                 }}
//                                 style={{ width: 120 }}
//                             >
//                                 <Option value="POS">POS</Option>
//                                 <Option value="POSHN">POSHN</Option>
//                             </Select>
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Ticket">
//                         <Form.Item
//                             name="TicketDHG"
//                             rules={[{ message: "Nhập phiếu mượn DHG!" }]}
//                             noStyle
//                         >
//                             <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Số lượng mượn">
//                         <Form.Item
//                             name="totalexport"
//                             rules={[{ required: true, message: "Nhập số lượng!" }]}
//                             noStyle
//                         >
//                             <InputNumber
//                                 min={1}
//                                 max={maxQuantity}
//                                 style={{ width: "100%" }}
//                                 placeholder={`Tối đa: ${maxQuantity}`}
//                             />
//                         </Form.Item>
//                         <div style={{ color: maxQuantity === 0 ? "red" : "green" }}>
//                             Tồn kho: {maxQuantity}
//                         </div>
//                         {warning && <div style={{ color: "red" }}>{warning}</div>}
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Serial mượn" span={2}>
//                         <Form.Item
//                             name="SerialNumber"
//                             rules={[{ required: true, message: "Nhập serial!" }]}
//                             noStyle
//                         >
//                             <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
//                         </Form.Item>
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Người mượn hàng">
//                         <Form.Item
//                             name="NameExport"
//                             rules={[{ required: true, message: "Chọn tên!" }]}
//                             noStyle
//                         >
//                             <Select
//                                 loading={loadingUsers}
//                                 showSearch
//                                 allowClear
//                                 style={{ width: 200 }}
//                                 dropdownStyle={{
//                                     minWidth: getDropdownWidth(
//                                         users
//                                             .filter((u) => u.Exportlister === true) // Sửa: bỏ .attributes
//                                             .map((u) => ({ label: u.Name })) // Sửa: bỏ .attributes
//                                     ),
//                                 }}
//                             >
//                                 {users
//                                     .filter((u) => u.Exportlister === true) // Sửa: bỏ .attributes
//                                     .map((u) => (
//                                         <Option key={u.id} value={u.Name}> {/* Sửa: bỏ .attributes */}
//                                             {u.Name} {/* Sửa: bỏ .attributes */}
//                                         </Option>
//                                     ))}
//                             </Select>
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Người tạo phiếu">
//                         <Form.Item name="NameCreate" initialValue={userName} noStyle>
//                             <Input readOnly />
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Số phiếu">
//                         <Form.Item
//                             name="Ticket"
//                             initialValue={generateInvoiceNumber()}
//                             noStyle
//                         >
//                             <Input readOnly />
//                         </Form.Item>
//                     </Descriptions.Item>

//                     <Descriptions.Item label="Trạng thái">
//                         <Tag color="orange">Chờ duyệt</Tag>
//                     </Descriptions.Item>
//                 </Descriptions>
//             </Form>
//         </Modal>
//     );
// };

// export default AddExportList;

// import React, { useState, useEffect } from "react";
// import {
//     Modal,
//     Form,
//     Input,
//     InputNumber,
//     message,
//     Select,
//     Row,
//     Col,
//     Card,
//     Typography,
//     Divider,
//     Statistic,
//     Tag,
//     Button,
// } from "antd";
// import {
//     DropboxOutlined,
//     BarcodeOutlined,
//     UserOutlined,
//     FileTextOutlined,
//     CheckCircleOutlined,
//     WarningOutlined,
//     CloseOutlined,
//     SaveOutlined,
// } from "@ant-design/icons";

// import {
//     createExportlists,
//     fetchWarehouseDetails,
//     updateWarehouseDetails,
//     updateExportlists,
// } from "../../../services/dhgServices";
// import { fetchUsers } from "../../../services/abicoServices";
// import "./AddExportList.scss";

// const { Option } = Select;
// const { Text, Title } = Typography;

// const generateInvoiceNumber = () => {
//     const year = new Date().getFullYear();
//     const unique = Math.floor(Math.random() * 1000000);
//     return `SPDHG${year}${unique}`;
// };

// const AddExportList = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
//     const [form] = Form.useForm();
//     const [products, setProducts] = useState([]);
//     const [models, setModels] = useState([]);
//     const [maxQuantity, setMaxQuantity] = useState(0);
//     const [warning, setWarning] = useState("");
//     const [users, setUsers] = useState([]);
//     const [userName, setUserName] = useState("");
//     const [loadingUsers, setLoadingUsers] = useState(false);
//     const [loadingSubmit, setLoadingSubmit] = useState(false);

//     /* ================= FETCH DATA ================= */
//     useEffect(() => {
//         const loadUsers = async () => {
//             setLoadingUsers(true);
//             try {
//                 const res = await fetchUsers();
//                 setUsers(Array.isArray(res) ? res : res?.data || []);
//             } catch (e) {
//                 console.error(e);
//             } finally {
//                 setLoadingUsers(false);
//             }
//         };
//         loadUsers();
//     }, []);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await fetchWarehouseDetails();
//                 setProducts(Array.isArray(res) ? res : res?.data || []);
//             } catch {
//                 message.error("Không tải được danh sách kho");
//             }
//         };
//         fetchData();

//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             const parsed = JSON.parse(storedUser);
//             setUserName(parsed?.account?.Name || "");
//         }
//     }, []);

//     useEffect(() => {
//         if (!isModalOpen) return;

//         form.resetFields();
//         form.setFieldsValue({
//             Ticket: generateInvoiceNumber(),
//             NameCreate: userName,
//         });
//         setModels([]);
//         setMaxQuantity(0);
//         setWarning("");
//     }, [isModalOpen, userName, form]);

//     /* ================= HANDLERS ================= */
//     const handleProductChange = (productName) => {
//         const productModels = products.filter(
//             (p) => p.ProductName === productName
//         );
//         setModels(productModels);
//         setMaxQuantity(0);
//         setWarning("");
//         form.setFieldsValue({
//             Model: undefined,
//             BrandName: undefined,
//             Type: undefined,
//             DVT: undefined,
//             totalexport: undefined,
//             SerialNumber: "",
//         });
//     };

//     const handleModelChange = (model) => {
//         const selected = models.find((m) => m.Model === model);
//         if (!selected) return;

//         setMaxQuantity(selected.DHG || 0);
//         setWarning(selected.DHG === 0 ? "Hết hàng trong kho!" : "");

//         form.setFieldsValue({
//             BrandName: selected.BrandName,
//             Type: selected.Type,
//             DVT: selected.DVT,
//             totalexport: undefined,
//             SerialNumber: "",
//             idModel: selected.id || selected.documentId,
//         });
//     };

//     const handleSubmit = async () => {
//         try {
//             setLoadingSubmit(true);
//             await form.validateFields();

//             const values = {
//                 ...form.getFieldsValue(),
//                 NameCreate: userName,
//                 Status: "Chờ duyệt",
//             };

//             if (values.totalexport > maxQuantity) {
//                 message.error(`Vượt tồn kho (${maxQuantity})`);
//                 return;
//             }

//             /* ===== 1. TẠO PHIẾU XUẤT ===== */
//             const res = await createExportlists(values);
//             const exportItem = res?.data || res;

//             /* ===== 2. UPDATE KHO (LOGIC CŨ) ===== */
//             const warehouseRes = await fetchWarehouseDetails();
//             const warehouseData = Array.isArray(warehouseRes)
//                 ? warehouseRes
//                 : warehouseRes?.data || [];

//             const matched = warehouseData.find(
//                 (w) => w.Model === values.Model
//             );

//             if (!matched) {
//                 message.warning("Không tìm thấy model trong kho");
//                 return;
//             }

//             const soLuong = values.totalexport;
//             const updatePayload = {
//                 DHG: (matched.DHG || 0) - soLuong,
//                 POS:
//                     values.TypeKho === "POS"
//                         ? (matched.POS || 0) + soLuong
//                         : matched.POS,
//                 POSHN:
//                     values.TypeKho === "POSHN"
//                         ? (matched.POSHN || 0) + soLuong
//                         : matched.POSHN,
//             };

//             await updateWarehouseDetails(
//                 matched.documentId || matched.id,
//                 updatePayload
//             );

//             /* ===== 3. ĐÁNH DẤU CHECK = TRUE ===== */
//             await updateExportlists(
//                 exportItem.documentId || exportItem.id,
//                 { Check: true }
//             );

//             message.success("Xuất kho thành công!");
//             form.resetFields();
//             onCreated(exportItem);
//             onCancel();
//         } catch (e) {
//             console.error(e);
//             message.error("Có lỗi khi xuất kho");
//         } finally {
//             setLoadingSubmit(false);
//         }
//     };

//     /* ================= UI ================= */
//     return (
//         <Modal
//             open={isModalOpen}
//             onCancel={onCancel}
//             footer={null}
//             width={900}
//             centered
//             className="add-export-list-modal"
//             title={
//                 <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//                     <DropboxOutlined style={{ fontSize: 20, color: "#1890ff" }} />
//                     <div>
//                         <Title level={5} style={{ margin: 0 }}>
//                             Điều chuyển kho DHG
//                         </Title>
//                         <Text type="secondary" style={{ fontSize: 12 }}>
//                             Xuất kho / mượn tạm
//                         </Text>
//                     </div>
//                 </div>
//             }
//         >
//             <Form form={form} layout="vertical">
//                 <Card title={<><BarcodeOutlined /> Thông tin thiết bị</>}>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="ProductName"
//                                 label="Sản phẩm"
//                                 rules={[{ required: true }]}
//                             >
//                                 <Select showSearch onChange={handleProductChange}>
//                                     {[...new Set(products.map(p => p.ProductName))].map(
//                                         (name) => (
//                                             <Option key={name} value={name}>
//                                                 {name}
//                                             </Option>
//                                         )
//                                     )}
//                                 </Select>
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="Model"
//                                 label="Model"
//                                 rules={[{ required: true }]}
//                             >
//                                 <Select
//                                     disabled={!models.length}
//                                     showSearch
//                                     onChange={handleModelChange}
//                                 >
//                                     {models.map((m) => (
//                                         <Option key={m.id} value={m.Model}>
//                                             {m.Model}
//                                         </Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}><Form.Item name="BrandName" label="Hãng"><Input readOnly /></Form.Item></Col>
//                         <Col span={8}><Form.Item name="Type" label="Loại"><Input readOnly /></Form.Item></Col>
//                         <Col span={8}><Form.Item name="DVT" label="ĐVT"><Input readOnly /></Form.Item></Col>
//                     </Row>
//                 </Card>

//                 <Row gutter={16} style={{ marginTop: 16 }}>
//                     <Col span={16}>
//                         <Card title="Chi tiết">
//                             <Form.Item name="TypeKho" label="Kho đích" rules={[{ required: true }]}>
//                                 <Select>
//                                     <Option value="POS">POS</Option>
//                                     <Option value="POSHN">POSHN</Option>
//                                 </Select>
//                             </Form.Item>
//                             <Form.Item
//                                 name="totalexport"
//                                 label="Số lượng"
//                                 rules={[{ required: true }]}
//                                 help={warning}
//                             >
//                                 <InputNumber min={1} max={maxQuantity} style={{ width: "100%" }} />
//                             </Form.Item>
//                             <Form.Item name="SerialNumber" label="Serial" rules={[{ required: true }]}>
//                                 <Input.TextArea rows={2} />
//                             </Form.Item>
//                         </Card>
//                     </Col>

//                     <Col span={8}>
//                         <Card>
//                             <Statistic
//                                 title="Tồn kho"
//                                 value={maxQuantity}
//                                 valueStyle={{
//                                     color: maxQuantity > 0 ? "#3f8600" : "#cf1322",
//                                 }}
//                                 prefix={
//                                     maxQuantity > 0 ? (
//                                         <CheckCircleOutlined />
//                                     ) : (
//                                         <WarningOutlined />
//                                     )
//                                 }
//                             />
//                             <Divider />
//                             <Form.Item name="NameExport" label="Người nhận" rules={[{ required: true }]}>
//                                 <Select loading={loadingUsers}>
//                                     {users
//                                         .filter((u) => u.Exportlister)
//                                         .map((u) => (
//                                             <Option key={u.id} value={u.Name}>
//                                                 {u.Name}
//                                             </Option>
//                                         ))}
//                                 </Select>
//                             </Form.Item>
//                             <Form.Item name="NameCreate" label="Người tạo">
//                                 <Input readOnly />
//                             </Form.Item>
//                             <Form.Item name="Ticket" label="Mã phiếu">
//                                 <Input readOnly />
//                             </Form.Item>
//                             <Tag color="orange">Chờ duyệt</Tag>
//                         </Card>
//                     </Col>
//                 </Row>

//                 <Divider />
//                 <div style={{ textAlign: "right" }}>
//                     <Button icon={<CloseOutlined />} onClick={onCancel}>
//                         Hủy
//                     </Button>
//                     <Button
//                         type="primary"
//                         icon={<SaveOutlined />}
//                         loading={loadingSubmit}
//                         onClick={handleSubmit}
//                         style={{ marginLeft: 8 }}
//                     >
//                         Lưu phiếu
//                     </Button>
//                 </div>
//             </Form>
//         </Modal>
//     );
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
    Statistic,
    Tag,
    Button,
    Descriptions,
    Space,
    Avatar
} from "antd";
import {
    DropboxOutlined,
    BarcodeOutlined,
    UserOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    CloseOutlined,
    SaveOutlined,
    ExportOutlined
} from "@ant-design/icons";

import {
    createExportlists,
    fetchWarehouseDetails,
    updateWarehouseDetails,
    updateExportlists,
} from "../../../services/dhgServices";
import { fetchUsers } from "../../../services/abicoServices";
import "./AddExportList.scss";

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
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [selectedModelInfo, setSelectedModelInfo] = useState(null); // State để lưu info hiển thị đẹp hơn
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        const loadUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await fetchUsers();
                setUsers(Array.isArray(res) ? res : res?.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingUsers(false);
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchWarehouseDetails();
                setProducts(Array.isArray(res) ? res : res?.data || []);
            } catch {
                message.error("Không tải được danh sách kho");
            }
        };
        fetchData();

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserName(parsed?.account?.Name || "");
        }
    }, []);

    useEffect(() => {
        if (!isModalOpen) return;

        form.resetFields();
        form.setFieldsValue({
            Ticket: generateInvoiceNumber(),
            NameCreate: userName,
        });
        setModels([]);
        setMaxQuantity(0);
        setSelectedModelInfo(null);
    }, [isModalOpen, userName, form]);

    /* ================= HANDLERS ================= */
    const handleProductChange = (productName) => {
        const productModels = products.filter(
            (p) => p.ProductName === productName
        );
        setModels(productModels);
        setMaxQuantity(0);
        setSelectedModelInfo(null);
        form.setFieldsValue({
            Model: undefined,
            BrandName: undefined,
            Type: undefined,
            DVT: undefined,
            totalexport: undefined,
            SerialNumber: "",
        });
    };

    const handleModelChange = (model) => {
        const selected = models.find((m) => m.Model === model);
        if (!selected) return;

        setMaxQuantity(selected.DHG || 0);
        setSelectedModelInfo(selected);

        form.setFieldsValue({
            BrandName: selected.BrandName,
            Type: selected.Type,
            DVT: selected.DVT,
            totalexport: undefined,
            SerialNumber: "",
            idModel: selected.id || selected.documentId,
        });
    };

    const handleSubmit = async () => {
        try {
            setLoadingSubmit(true);
            await form.validateFields();

            const values = {
                ...form.getFieldsValue(),
                NameCreate: userName,
                Status: "Chờ duyệt",
            };

            if (values.totalexport > maxQuantity) {
                message.error(`Vượt quá số lượng tồn kho (${maxQuantity})`);
                return;
            }

            /* ===== 1. TẠO PHIẾU XUẤT ===== */
            const res = await createExportlists(values);
            const exportItem = res?.data || res;

            /* ===== 2. UPDATE KHO ===== */
            const warehouseRes = await fetchWarehouseDetails();
            const warehouseData = Array.isArray(warehouseRes) ? warehouseRes : warehouseRes?.data || [];
            const matched = warehouseData.find((w) => w.Model === values.Model);

            if (!matched) {
                message.warning("Không tìm thấy model trong kho để trừ tồn");
                return;
            }

            const soLuong = values.totalexport;
            const updatePayload = {
                DHG: (matched.DHG || 0) - soLuong,
                POS: values.TypeKho === "POS" ? (matched.POS || 0) + soLuong : matched.POS,
                POSHN: values.TypeKho === "POSHN" ? (matched.POSHN || 0) + soLuong : matched.POSHN,
            };

            await updateWarehouseDetails(matched.documentId || matched.id, updatePayload);

            /* ===== 3. ĐÁNH DẤU CHECK ===== */
            await updateExportlists(exportItem.documentId || exportItem.id, { Check: true });

            message.success("Xuất kho thành công!");
            form.resetFields();
            onCreated(exportItem);
            onCancel();
        } catch (e) {
            console.error(e);
            message.error("Có lỗi khi xuất kho");
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
            className="add-export-list-modal"
            title={
                <div className="modal-title-wrapper">
                    <div className="icon-box">
                        <ExportOutlined />
                    </div>
                    <div>
                        <Title level={5} style={{ margin: 0 }}>Điều chuyển kho thiết bị</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>Tạo phiếu xuất kho hoặc mượn tạm</Text>
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
                                    {[...new Set(products.map(p => p.ProductName))].map((name) => (
                                        <Option key={name} value={name}>{name}</Option>
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

                    {/* Ẩn các field input cũ đi, nhưng vẫn giữ trong Form để lấy value submit */}
                    <div style={{ display: 'none' }}>
                        <Form.Item name="BrandName"><Input /></Form.Item>
                        <Form.Item name="Type"><Input /></Form.Item>
                        <Form.Item name="DVT"><Input /></Form.Item>
                        <Form.Item name="idModel"><Input /></Form.Item>
                        <Form.Item name="NameCreate"><Input /></Form.Item>
                        <Form.Item name="Ticket"><Input /></Form.Item>
                    </div>

                    {/* Hiển thị thông tin chi tiết bằng Descriptions */}
                    {selectedModelInfo && (
                        <div className="info-box">
                            <Descriptions column={4} size="small" layout="vertical">
                                <Descriptions.Item label="Hãng SX">
                                    <Tag color="blue">{selectedModelInfo.BrandName}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Loại">
                                    {selectedModelInfo.Type}
                                </Descriptions.Item>
                                <Descriptions.Item label="Đơn vị">
                                    {selectedModelInfo.DVT}
                                </Descriptions.Item>
                                <Descriptions.Item label="Tồn kho khả dụng">
                                    <span style={{
                                        color: maxQuantity > 0 ? '#3f8600' : '#cf1322',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                    }}>
                                        {maxQuantity}
                                    </span>
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    )}
                </Card>

                {/* === SECTION 2: CHI TIẾT XUẤT === */}
                <Card className="section-card mt-3" title="Chi tiết phiếu xuất" size="small">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="TypeKho"
                                label="Kho đích (Nơi nhận)"
                                rules={[{ required: true, message: "Chọn kho đích" }]}
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
                                label="Số lượng xuất"
                                rules={[{ required: true, message: "Nhập số lượng" }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={maxQuantity}
                                    style={{ width: "100%" }}
                                    placeholder="VD: 1"
                                    status={maxQuantity === 0 ? "error" : ""}
                                />
                            </Form.Item>
                        </Col>
                        {/* <Col span={8}>
                            <Form.Item
                                name="NameExport"
                                label="Người nhận hàng"
                                rules={[{ required: true, message: "Chọn người nhận" }]}
                            >
                                <Select
                                    loading={loadingUsers}
                                    showSearch
                                    placeholder="Nhân viên..."
                                    optionFilterProp="children"
                                >
                                    {users.filter((u) => u.Exportlister).map((u) => (
                                        <Option key={u.id} value={u.Name}>{u.Name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col> */}

                        <Col span={24}>
                            <Form.Item
                                name="SerialNumber"
                                label="Danh sách Serial Number (Mỗi dòng 1 số)"
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
                                label="Người mượn hàng"
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
                            <BarcodeOutlined /> Mã phiếu: <Tag>{form.getFieldValue("Ticket")}</Tag>
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
                        onClick={handleSubmit}
                        disabled={maxQuantity === 0}
                    >
                        Lưu phiếu xuất
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddExportList;
// import React, { useEffect, useState, useMemo } from "react";
// import { fetchListSupplierDetail } from "../../../services/dhgServices";
// import * as XLSX from "xlsx";
// import { FaFileExcel, FaSearch, FaEdit, FaCheck } from "react-icons/fa";
// import {
//   Tag,
//   Button,
//   notification,
//   Modal,
//   Form,
//   Input,
//   Select,
//   Table,
//   Space,
//   Descriptions,
// } from "antd";
// import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
// import UpdateProductSupplierDetail from "./UpdateProductSupplierDetail";
// import ConfirmImportModal from "./ConfirmImportModal";
// import "./ProductSupplierDetail.scss";

// const { Option } = Select;

// const ProductSupplierDetail = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

//   const [form] = Form.useForm();
//   const [filteredInvoices, setFilteredInvoices] = useState([]);

//   useEffect(() => {
//     loadInvoices();
//   }, []);

//   const loadInvoices = async () => {
//     try {
//       const invoicesData = await fetchListSupplierDetail();
//       // Strapi v5: response có thể là mảng trực tiếp hoặc { data: [...] }
//       const data = Array.isArray(invoicesData) ? invoicesData : (invoicesData.data || []);

//       // Sửa: bỏ .attributes trong sort
//       const sortedData = data.sort(
//         (a, b) =>
//           new Date(b.createdAt) - new Date(a.createdAt)
//       );

//       setInvoices(sortedData);
//       setFilteredInvoices(sortedData); // ban đầu hiển thị toàn bộ
//       setLoading(false);
//     } catch (err) {
//       setError(err);
//       notification.error({
//         message: "Lỗi tải dữ liệu!",
//         description: err.message,
//       });
//       setLoading(false);
//     }
//   };

//   const handleExport = () => {
//     if (invoices.length === 0) {
//       notification.warning({ message: "Không có dữ liệu để xuất!" });
//       return;
//     }
//     const ws = XLSX.utils.json_to_sheet(
//       invoices.map((invoice) => ({
//         // Sửa: bỏ .attributes
//         "Tên sản phẩm": invoice.ProductName,
//         SerialNumber: invoice.SerialNumber,
//         "Ngày hóa đơn": invoice.InvoiceDate,
//         "Số tháng bảo hành": invoice.Warranty,
//         "Trạng thái": invoice.Status,
//         Ticket: invoice.Ticket,
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Invoices");
//     XLSX.writeFile(wb, "Invoices_List.xlsx");
//   };

//   const handleUpdateSuccess = (updatedInvoice) => {
//     setInvoices((prevInvoices) =>
//       prevInvoices.map((inv) =>
//         inv.id === updatedInvoice.id ? updatedInvoice : inv
//       )
//     );

//     setFilteredInvoices((prevFiltered) =>
//       prevFiltered.map((inv) =>
//         inv.id === updatedInvoice.id ? updatedInvoice : inv
//       )
//     );

//     if (selectedProduct && selectedProduct.id === updatedInvoice.id) {
//       setSelectedProduct(updatedInvoice);
//     }

//     setIsUpdateModalOpen(false);
//   };

//   const handleCloseConfirm = () => {
//     setIsConfirmModalOpen(false);
//   };

//   const handleSuccessConfirm = async () => {
//     await loadInvoices();
//     setIsConfirmModalOpen(false);
//     notification.success({ message: "Xác nhận nhập kho thành công!" });
//   };

//   const handleSearch = (values) => {
//     let results = [...invoices];

//     if (values.status && values.status !== "Tất cả") {
//       // Sửa: bỏ .attributes
//       results = results.filter((t) => t?.Status === values.status);
//     }
//     if (values.searchText) {
//       const searchLower = values.searchText.toLowerCase();
//       results = results.filter(
//         (t) =>
//           // Sửa: bỏ .attributes
//           t?.SerialNumber?.toLowerCase().includes(searchLower) ||
//           t?.Model?.toLowerCase().includes(searchLower)
//       );
//     }

//     setFilteredInvoices(results);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setFilteredInvoices(invoices);
//   };


//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   });

//   const columns = [
//     {
//       title: "STT",
//       key: "stt",
//       align: "center",
//       width: 60,
//       render: (_, __, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//     },
//     {
//       title: "Tên sản phẩm",
//       dataIndex: "ProductName", // Sửa: bỏ ["attributes", ...]
//       width: 180,
//       ellipsis: true,
//     },
//     {
//       title: "Model",
//       dataIndex: "Model", // Sửa: bỏ ["attributes", ...]
//       width: 150,
//       ellipsis: true,
//     },
//     {
//       title: "SerialNumber",
//       dataIndex: "SerialNumber", // Sửa: bỏ ["attributes", ...]
//       width: 250,
//       render: (text) => (
//         <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
//           {text}
//         </div>
//       ),
//     },
//     {
//       title: "Ngày hóa đơn",
//       dataIndex: "InvoiceDate", // Sửa: bỏ ["attributes", ...]
//       width: 120,
//       render: (date) => new Date(date).toLocaleDateString("vi-VN"),
//     },
//     {
//       title: "Bảo hành (tháng)",
//       dataIndex: "Warranty", // Sửa: bỏ ["attributes", ...]
//       width: 100,
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "Status", // Sửa: bỏ ["attributes", ...]
//       width: 130,
//       render: (status) => {
//         const isImported = status === "Đã nhập kho";
//         return (
//           <Tag
//             color={isImported ? "green" : "gold"}
//             icon={
//               isImported ? <CheckCircleOutlined /> : <ClockCircleOutlined />
//             }
//           >
//             {status}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "Ticket",
//       dataIndex: "Ticket", // Sửa: bỏ ["attributes", ...]
//       width: 150,
//       ellipsis: true,
//     },
//     {
//       title: "Chi tiết",
//       width: 120,
//       render: (_, record) => (
//         <Space>
//           <Button
//             size="small"
//             onClick={() => {
//               setSelectedProduct(record);
//               setIsDetailModalOpen(true);
//             }}
//           >
//             Chi tiết
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div className="purchase-order-container">
//       {/* Form lọc */}
//       <Form
//         form={form}
//         layout="inline"
//         onFinish={handleSearch}
//         style={{ marginBottom: 20, flexWrap: "wrap" }}
//       >
//         <Form.Item name="status">
//           <Select
//             placeholder="-- Trạng thái --"
//             style={{ width: 160 }}
//             allowClear
//           >
//             {[
//               ...new Set(
//                 invoices
//                   .map((i) => i?.Status) // Sửa: bỏ .attributes
//                   .filter((status) => status)
//               ), // bỏ null/undefined
//             ].map((status) => (
//               <Select.Option key={status} value={status}>
//                 {status}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item name="searchText">
//           <Input placeholder="Serial / Model" style={{ width: 200 }} />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" icon={<FaSearch />}>
//             Tìm kiếm
//           </Button>
//         </Form.Item>
//         <Form.Item>
//           <Button onClick={resetFilters}>Reset</Button>
//         </Form.Item>
//         <Form.Item>
//           <Button onClick={handleExport} icon={<FaFileExcel />}>
//             Xuất Excel
//           </Button>
//         </Form.Item>
//       </Form>

//       {/* Bảng */}
//       <Table
//         columns={columns}
//         dataSource={filteredInvoices}
//         rowKey="id"
//         pagination={{
//           ...pagination,
//           onChange: (page, pageSize) => {
//             setPagination({ current: page, pageSize });
//           },
//         }}
//         scroll={{ x: 1300 }} // cuộn ngang nếu bảng rộng hơn
//       />

//       {/* Modal chi tiết */}
//       <Modal
//         open={isDetailModalOpen}
//         title="Chi tiết sản phẩm"
//         onCancel={() => setIsDetailModalOpen(false)}
//         footer={null}
//         width={800}
//       >
//         {selectedProduct && (
//           <>
//             <Descriptions bordered column={2} size="small">
//               <Descriptions.Item label="Tên sản phẩm">
//                 {selectedProduct.ProductName} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Model">
//                 {selectedProduct.Model} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Thương hiệu">
//                 {selectedProduct.BrandName} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số lượng">
//                 {selectedProduct.Qty} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="SerialNumber" span={2}>
//                 {selectedProduct.SerialNumber} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Ngày hóa đơn">
//                 {new Date(
//                   selectedProduct.InvoiceDate // Sửa: bỏ .attributes
//                 ).toLocaleDateString("vi-VN")}
//               </Descriptions.Item>
//               <Descriptions.Item label="Bảo hành">
//                 {selectedProduct.Warranty} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Kiểu sản phẩm">
//                 {selectedProduct.Type} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số phiếu">
//                 {selectedProduct.Ticket} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Trạng thái">
//                 <Tag color="green">{selectedProduct.Status}</Tag> {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//             </Descriptions>

//             {selectedProduct.Status !== "Đã nhập kho" && ( // Sửa: bỏ .attributes
//               <div style={{ marginTop: 16 }}>
//                 <Button
//                   type="primary"
//                   onClick={() => {
//                     setIsUpdateModalOpen(true);
//                     setIsDetailModalOpen(false);
//                   }}
//                   icon={<FaEdit />}
//                 >
//                   Cập nhật
//                 </Button>
//                 {selectedProduct.Warranty && ( // Sửa: bỏ .attributes
//                   <Button
//                     style={{ marginLeft: 8 }}
//                     onClick={() => {
//                       setIsConfirmModalOpen(true);
//                       setIsDetailModalOpen(false);
//                     }}
//                     icon={<FaCheck />}
//                   >
//                     Nhập Kho ĐHG
//                   </Button>
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </Modal>

//       {/* Modal cập nhật */}
//       {isUpdateModalOpen && selectedProduct && (
//         <UpdateProductSupplierDetail
//           open={isUpdateModalOpen}
//           onClose={() => setIsUpdateModalOpen(false)}
//           invoice={selectedProduct}
//           onUpdateSuccess={handleUpdateSuccess}
//         />
//       )}

//       {/* Modal xác nhận nhập kho */}
//       {isConfirmModalOpen && selectedProduct && (
//         <ConfirmImportModal
//           open={isConfirmModalOpen}
//           onClose={handleCloseConfirm}
//           product={selectedProduct}
//           onConfirmSuccess={handleSuccessConfirm}
//           setSelectedProduct={setSelectedProduct}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductSupplierDetail;


// import React, { useEffect, useState, useMemo } from "react";
// import { fetchListSupplierDetail } from "../../../services/dhgServices";
// import * as XLSX from "xlsx";
// import {
//   FaFileExcel,
//   FaSearch,
//   FaEdit,
//   FaCheck,
//   FaEye
// } from "react-icons/fa";
// import {
//   Tag,
//   Button,
//   notification,
//   Modal,
//   Form,
//   Input,
//   Select,
//   Table,
//   Space,
//   Descriptions,
//   Card,
//   Row,
//   Col,
//   Statistic,
//   Divider,
//   Typography,
//   Tooltip
// } from "antd";
// import {
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   FilterOutlined,
//   SyncOutlined,
//   InboxOutlined,
//   BarcodeOutlined
// } from "@ant-design/icons";
// import UpdateProductSupplierDetail from "./UpdateProductSupplierDetail";
// import ConfirmImportModal from "./ConfirmImportModal";
// import "./ProductSupplierDetail.scss";

// const { Option } = Select;
// const { Title, Text } = Typography;

// const ProductSupplierDetail = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

//   const [form] = Form.useForm();
//   const [filteredInvoices, setFilteredInvoices] = useState([]);

//   // --- LOGIC LOAD DATA ---
//   useEffect(() => {
//     loadInvoices();
//   }, []);

//   const loadInvoices = async () => {
//     setLoading(true);
//     try {
//       const invoicesData = await fetchListSupplierDetail();
//       const data = Array.isArray(invoicesData) ? invoicesData : (invoicesData.data || []);
//       const sortedData = data.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );

//       setInvoices(sortedData);
//       setFilteredInvoices(sortedData);
//       setLoading(false);
//     } catch (err) {
//       setError(err);
//       notification.error({
//         message: "Lỗi tải dữ liệu!",
//         description: err.message,
//       });
//       setLoading(false);
//     }
//   };

//   // --- STATS LOGIC ---
//   const getStatusCount = (status) => filteredInvoices.filter((i) => i.Status === status).length;

//   const statsList = [
//     { key: "Chờ nhập kho", label: "Chờ nhập", color: "#fa8c16", icon: <ClockCircleOutlined /> },
//     { key: "Đã nhập kho", label: "Đã nhập", color: "#52c41a", icon: <CheckCircleOutlined /> },
//   ];

//   // --- HANDLERS ---
//   const handleExport = () => {
//     if (filteredInvoices.length === 0) {
//       notification.warning({ message: "Không có dữ liệu để xuất!" });
//       return;
//     }
//     const ws = XLSX.utils.json_to_sheet(
//       filteredInvoices.map((invoice) => ({
//         "Tên sản phẩm": invoice.ProductName,
//         "Serial Number": invoice.SerialNumber,
//         "Ngày hóa đơn": invoice.InvoiceDate,
//         "Bảo hành (tháng)": invoice.Warranty,
//         "Trạng thái": invoice.Status,
//         "Ticket": invoice.Ticket,
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "DanhSachChiTiet");
//     XLSX.writeFile(wb, "Danh_Sach_Chi_Tiet_Nhap.xlsx");
//   };

//   const handleUpdateSuccess = (updatedInvoice) => {
//     // Logic update state giữ nguyên
//     const updateList = (list) => list.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv);
//     setInvoices(prev => updateList(prev));
//     setFilteredInvoices(prev => updateList(prev));

//     if (selectedProduct && selectedProduct.id === updatedInvoice.id) {
//       setSelectedProduct(updatedInvoice);
//     }
//     setIsUpdateModalOpen(false);
//   };

//   const handleSuccessConfirm = async () => {
//     await loadInvoices();
//     setIsConfirmModalOpen(false);
//     notification.success({ message: "Xác nhận nhập kho thành công!" });
//   };

//   const handleSearch = (values) => {
//     let results = [...invoices];
//     if (values.status) {
//       results = results.filter((t) => t?.Status === values.status);
//     }
//     if (values.searchText) {
//       const searchLower = values.searchText.toLowerCase();
//       results = results.filter(
//         (t) =>
//           t?.SerialNumber?.toLowerCase().includes(searchLower) ||
//           t?.Model?.toLowerCase().includes(searchLower) ||
//           t?.ProductName?.toLowerCase().includes(searchLower) ||
//           t?.Ticket?.toLowerCase().includes(searchLower)
//       );
//     }
//     setFilteredInvoices(results);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setFilteredInvoices(invoices);
//   };

//   // --- TABLE COLUMNS ---
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

//   const columns = [
//     {
//       title: "STT",
//       align: "center",
//       width: 50,
//       render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
//     },
//     {
//       title: "Thông tin Sản phẩm",
//       dataIndex: "ProductName",
//       width: 220,
//       render: (text, record) => (
//         <div>
//           <div style={{ fontWeight: 500, color: '#262626' }}>{text}</div>
//           <div style={{ fontSize: 12, color: '#8c8c8c' }}>Model: {record.Model}</div>
//         </div>
//       )
//     },
//     {
//       title: "Serial Number",
//       dataIndex: "SerialNumber",
//       width: 180,
//       render: (text) => text ? <span className="cell-serial">{text}</span> : <span style={{ color: '#d9d9d9' }}>N/A</span>,
//     },
//     {
//       title: "Ticket",
//       dataIndex: "Ticket",
//       width: 120,
//       render: (text) => <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>
//     },
//     {
//       title: "Ngày hóa đơn",
//       dataIndex: "InvoiceDate",
//       width: 110,
//       align: 'center',
//       render: (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "--",
//     },
//     {
//       title: "BH",
//       dataIndex: "Warranty",
//       width: 60,
//       align: 'center',
//       render: (val) => val ? `${val}th` : '--'
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "Status",
//       width: 120,
//       align: 'center',
//       render: (status) => {
//         const isImported = status === "Đã nhập kho";
//         return (
//           <Tag color={isImported ? "success" : "warning"} style={{ minWidth: 90, textAlign: 'center' }}>
//             {isImported ? "Đã nhập" : "Chờ nhập"}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "",
//       width: 50,
//       fixed: 'right',
//       render: (_, record) => (
//         <Tooltip title="Xem chi tiết">
//           <Button
//             type="text"
//             icon={<FaEye style={{ color: '#1890ff' }} />}
//             onClick={() => {
//               setSelectedProduct(record);
//               setIsDetailModalOpen(true);
//             }}
//           />
//         </Tooltip>
//       ),
//     },
//   ];

//   if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error.message}</div>;

//   return (
//     <div className="product-supplier-detail-container">

//       {/* --- 1. HEADER CARD (TITLE + STATS) --- */}
//       <div className="header-card">
//         <Row justify="space-between" align="middle" gutter={[16, 16]}>
//           <Col xs={24} md={10}>
//             <h2 className="page-title">Chi Tiết Nhập Hàng</h2>
//             <Text type="secondary">Quản lý Serial Number và trạng thái nhập kho chi tiết</Text>
//           </Col>
//           <Col xs={24} md={14}>
//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24 }}>
//               {statsList.map(s => (
//                 <Statistic
//                   key={s.key}
//                   title={<span>{s.icon} {s.label}</span>}
//                   value={getStatusCount(s.key)}
//                   valueStyle={{ color: s.color }}
//                 />
//               ))}
//               <Divider type="vertical" style={{ height: 40 }} />
//               <Statistic
//                 title={<span><BarcodeOutlined /> Tổng số</span>}
//                 value={filteredInvoices.length}
//                 valueStyle={{ fontWeight: 700 }}
//               />
//             </div>
//           </Col>
//         </Row>
//       </div>

//       {/* --- 2. MAIN CARD (FILTER + TABLE) --- */}
//       <div className="main-card">
//         <Form form={form} layout="vertical" onFinish={handleSearch} className="filter-section">
//           <Row gutter={16} align="bottom">
//             <Col xs={24} sm={12} md={6} lg={6}>
//               <Form.Item name="searchText" label="Tìm kiếm">
//                 <Input prefix={<FaSearch className="site-form-item-icon" />} placeholder="Serial, Model, Ticket..." allowClear />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={6} lg={4}>
//               <Form.Item name="status" label="Trạng thái">
//                 <Select placeholder="Tất cả" allowClear>
//                   {["Chờ nhập kho", "Đã nhập kho"].map(s => (
//                     <Option key={s} value={s}>{s}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} lg={8} style={{ marginBottom: 12 }}>
//               <Space>
//                 <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>Lọc</Button>
//                 <Button icon={<SyncOutlined />} onClick={resetFilters}>Reset</Button>
//                 <Button className="btn-export" icon={<FaFileExcel />} onClick={handleExport}>Xuất Excel</Button>
//               </Space>
//             </Col>
//           </Row>
//         </Form>

//         <Table
//           columns={columns}
//           dataSource={filteredInvoices}
//           rowKey="id"
//           loading={loading}
//           pagination={{
//             ...pagination,
//             total: filteredInvoices.length,
//             showTotal: (total) => `Tổng ${total} bản ghi`,
//             onChange: (curr, size) => setPagination({ current: curr, pageSize: size })
//           }}
//           scroll={{ x: 1100 }}
//           onRow={(record) => ({
//             onClick: () => { setSelectedProduct(record); setIsDetailModalOpen(true); },
//             style: { cursor: 'pointer' }
//           })}
//         />
//       </div>

//       {/* --- MODALS --- */}

//       {/* Modal Chi tiết */}
//       <Modal
//         open={isDetailModalOpen}
//         title={
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <FaEye style={{ color: '#1890ff' }} />
//             <span>Thông tin chi tiết thiết bị</span>
//           </div>
//         }
//         onCancel={() => setIsDetailModalOpen(false)}
//         footer={null}
//         width={700}
//         centered
//         className="product-detail-modal" // Class custom mới
//       >
//         {selectedProduct && (
//           <div className="detail-content-wrapper">

//             {/* 1. Header Thông tin chính */}
//             <div className="product-header-section">
//               <h3 className="product-name">{selectedProduct.ProductName}</h3>
//               <div className="product-meta">
//                 <Tag color="geekblue" style={{ marginRight: 8 }}>{selectedProduct.BrandName}</Tag>
//                 <span className="model-text">Model: <b>{selectedProduct.Model}</b></span>
//               </div>
//             </div>

//             {/* 2. Box Serial Number (Điểm nhấn) */}
//             <div className="serial-section">
//               <div className="serial-label">Serial Number (S/N)</div>
//               <div className="serial-value">
//                 {selectedProduct.SerialNumber || "Chưa cập nhật"}
//               </div>
//             </div>

//             <Divider style={{ margin: '20px 0' }} />

//             {/* 3. Grid thông tin chi tiết */}
//             <Row gutter={[24, 24]}>
//               <Col span={12}>
//                 <div className="detail-item">
//                   <span className="label">Trạng thái</span>
//                   <div className="value">
//                     <Tag
//                       color={selectedProduct.Status === "Đã nhập kho" ? "success" : "warning"}
//                       style={{ fontSize: 13, padding: '4px 10px' }}
//                     >
//                       {selectedProduct.Status === "Đã nhập kho" ?
//                         <><CheckCircleOutlined /> Đã nhập kho</> :
//                         <><ClockCircleOutlined /> Chờ nhập kho</>
//                       }
//                     </Tag>
//                   </div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="detail-item">
//                   <span className="label">Mã phiếu (Ticket)</span>
//                   <div className="value ticket-text">{selectedProduct.Ticket}</div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="detail-item">
//                   <span className="label">Ngày hóa đơn</span>
//                   <div className="value">
//                     {selectedProduct.InvoiceDate ? new Date(selectedProduct.InvoiceDate).toLocaleDateString("vi-VN") : "--"}
//                   </div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="detail-item">
//                   <span className="label">Thời hạn bảo hành</span>
//                   <div className="value">
//                     {selectedProduct.Warranty ? <b style={{ color: '#fa8c16' }}>{selectedProduct.Warranty} tháng</b> : "--"}
//                   </div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="detail-item">
//                   <span className="label">Loại thiết bị</span>
//                   <div className="value">{selectedProduct.Type}</div>
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="detail-item">
//                   <span className="label">Số lượng nhập</span>
//                   <div className="value">{selectedProduct.Qty}</div>
//                 </div>
//               </Col>
//             </Row>

//             {/* 4. Actions Footer */}
//             <div className="detail-actions">
//               {selectedProduct.Status !== "Đã nhập kho" && (
//                 <>
//                   <Button
//                     className="btn-update"
//                     icon={<FaEdit />}
//                     onClick={() => { setIsUpdateModalOpen(true); setIsDetailModalOpen(false); }}
//                   >
//                     Cập nhật thông tin
//                   </Button>

//                   {selectedProduct.Warranty && (
//                     <Button
//                       type="primary"
//                       className="btn-confirm"
//                       icon={<FaCheck />}
//                       onClick={() => { setIsConfirmModalOpen(true); setIsDetailModalOpen(false); }}
//                     >
//                       Xác nhận Nhập Kho
//                     </Button>
//                   )}
//                 </>
//               )}
//               <Button onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Modal Cập nhật */}
//       {isUpdateModalOpen && selectedProduct && (
//         <UpdateProductSupplierDetail
//           open={isUpdateModalOpen}
//           onClose={() => setIsUpdateModalOpen(false)}
//           invoice={selectedProduct}
//           onUpdateSuccess={handleUpdateSuccess}
//         />
//       )}

//       {/* Modal Xác nhận */}
//       {isConfirmModalOpen && selectedProduct && (
//         <ConfirmImportModal
//           open={isConfirmModalOpen}
//           onClose={() => setIsConfirmModalOpen(false)}
//           product={selectedProduct}
//           onConfirmSuccess={handleSuccessConfirm}
//           setSelectedProduct={setSelectedProduct}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductSupplierDetail;


import React, { useEffect, useState } from "react";
import { fetchListSupplierDetail } from "../../../services/dhgServices";
import * as XLSX from "xlsx";
import {
  FaFileExcel,
  FaSearch,
  FaEdit,
  FaCheck,
  FaEye
} from "react-icons/fa";
import {
  Tag,
  Button,
  notification,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Space,
  Descriptions,
  Card,
  Row,
  Col,
  Statistic,
  Divider,
  Typography,
  Tooltip,
  message
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  SyncOutlined,
  InboxOutlined,
  BarcodeOutlined,
  CopyOutlined
} from "@ant-design/icons";
import UpdateProductSupplierDetail from "./UpdateProductSupplierDetail";
import ConfirmImportModal from "./ConfirmImportModal";
import "./ProductSupplierDetail.scss";

const { Option } = Select;
const { Text } = Typography;

const ProductSupplierDetail = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // State mới cho UX
  const [actionLoading, setActionLoading] = useState(false);

  const [form] = Form.useForm();
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  // --- 1. LOGIC LOAD DATA ---
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const invoicesData = await fetchListSupplierDetail();
      const data = Array.isArray(invoicesData) ? invoicesData : (invoicesData.data || []);
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setInvoices(sortedData);
      setFilteredInvoices(sortedData);
      setLoading(false);
    } catch (err) {
      setError(err);
      notification.error({
        message: "Lỗi tải dữ liệu!",
        description: err.message,
      });
      setLoading(false);
    }
  };

  // --- 2. STATS & UTILS ---
  const getStatusCount = (status) => filteredInvoices.filter((i) => i.Status === status).length;

  const statsList = [
    { key: "Chờ nhập kho", label: "Chờ nhập", color: "#fa8c16", icon: <ClockCircleOutlined /> },
    { key: "Đã nhập kho", label: "Đã nhập", color: "#52c41a", icon: <CheckCircleOutlined /> },
  ];

  const handleCopySerial = (serial) => {
    if (!serial) return;
    navigator.clipboard.writeText(serial);
    message.success("Đã copy Serial Number!");
  };

  // --- 3. HANDLERS ---
  const handleExport = () => {
    if (filteredInvoices.length === 0) {
      notification.warning({ message: "Không có dữ liệu để xuất!" });
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      filteredInvoices.map((invoice) => ({
        "Tên sản phẩm": invoice.ProductName,
        "Serial Number": invoice.SerialNumber,
        "Ngày hóa đơn": invoice.InvoiceDate,
        "Bảo hành (tháng)": invoice.Warranty,
        "Trạng thái": invoice.Status,
        "Ticket": invoice.Ticket,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachChiTiet");
    XLSX.writeFile(wb, "Danh_Sach_Chi_Tiet_Nhap.xlsx");
  };

  const handleUpdateSuccess = (updatedInvoice) => {
    const updateList = (list) => list.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv);
    setInvoices(prev => updateList(prev));
    setFilteredInvoices(prev => updateList(prev));

    if (selectedProduct && selectedProduct.id === updatedInvoice.id) {
      setSelectedProduct(updatedInvoice);
    }
    setIsUpdateModalOpen(false);
  };

  const handleSuccessConfirm = async () => {
    await loadInvoices();
    setIsConfirmModalOpen(false);
    notification.success({ message: "Xác nhận nhập kho thành công!" });
  };

  const handleSearch = (values) => {
    let results = [...invoices];
    if (values.status) {
      results = results.filter((t) => t?.Status === values.status);
    }
    if (values.searchText) {
      const searchLower = values.searchText.toLowerCase();
      results = results.filter(
        (t) =>
          t?.SerialNumber?.toLowerCase().includes(searchLower) ||
          t?.Model?.toLowerCase().includes(searchLower) ||
          t?.ProductName?.toLowerCase().includes(searchLower) ||
          t?.Ticket?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredInvoices(results);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredInvoices(invoices);
  };

  // --- 4. TABLE COLUMNS ---
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns = [
    {
      title: "STT",
      align: "center",
      width: 50,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Thông tin Sản phẩm",
      dataIndex: "ProductName",
      width: 250,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, color: '#262626', marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>Model: <span style={{ color: '#595959' }}>{record.Model}</span></div>
        </div>
      )
    },
    {
      title: "Serial Number",
      dataIndex: "SerialNumber",
      width: 180,
      render: (text) => text ? <span className="cell-serial">{text}</span> : <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>Chưa có</span>,
    },
    {
      title: "Ticket",
      dataIndex: "Ticket",
      width: 130,
      render: (text) => <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>
    },
    {
      title: "Ngày hóa đơn",
      dataIndex: "InvoiceDate",
      width: 110,
      align: 'center',
      render: (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "--",
    },
    {
      title: "BH",
      dataIndex: "Warranty",
      width: 70,
      align: 'center',
      render: (val) => val ? `${val}th` : '--'
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      width: 120,
      align: 'center',
      render: (status) => {
        const isImported = status === "Đã nhập kho";
        return (
          <Tag color={isImported ? "success" : "warning"} style={{ minWidth: 90, textAlign: 'center', borderRadius: 10 }}>
            {isImported ? "Đã nhập" : "Chờ nhập"}
          </Tag>
        );
      },
    },
    {
      title: "",
      width: 50,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<FaEye style={{ color: '#1890ff' }} />}
            onClick={() => {
              setSelectedProduct(record);
              setIsDetailModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error.message}</div>;

  return (
    <div className="product-supplier-detail-container">

      {/* --- HEADER DASHBOARD --- */}
      <div className="header-card">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <h2 className="page-title">Chi Tiết Nhập Hàng</h2>
            <Text type="secondary">Quản lý Serial Number và kích hoạt bảo hành</Text>
          </Col>
          <Col xs={24} md={14}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
              {statsList.map(s => (
                <Statistic
                  key={s.key}
                  title={<span>{s.icon} {s.label}</span>}
                  value={getStatusCount(s.key)}
                  valueStyle={{ color: s.color }}
                />
              ))}
              <Divider type="vertical" style={{ height: 40, top: 0 }} />
              <Statistic
                title={<span><BarcodeOutlined /> Tổng số</span>}
                value={filteredInvoices.length}
                valueStyle={{ fontWeight: 700 }}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="main-card">
        <Form form={form} layout="vertical" onFinish={handleSearch} className="filter-section">
          <Row gutter={16} align="bottom">
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="searchText" label="Tìm kiếm">
                <Input prefix={<FaSearch className="site-form-item-icon" />} placeholder="Serial, Model, Ticket..." allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Tất cả" allowClear>
                  {["Chờ nhập kho", "Đã nhập kho"].map(s => (
                    <Option key={s} value={s}>{s}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={8} style={{ marginBottom: 12 }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>Lọc</Button>
                <Button icon={<SyncOutlined />} onClick={resetFilters}>Reset</Button>
                <Button className="btn-export" icon={<FaFileExcel />} onClick={handleExport}>Xuất Excel</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Table
          columns={columns}
          dataSource={filteredInvoices}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            total: filteredInvoices.length,
            showTotal: (total) => `Tổng ${total} thiết bị`,
            onChange: (curr, size) => setPagination({ current: curr, pageSize: size })
          }}
          scroll={{ x: 1100 }}
          onRow={(record) => ({
            onClick: () => { setSelectedProduct(record); setIsDetailModalOpen(true); },
            style: { cursor: 'pointer' }
          })}
        />
      </div>

      {/* --- MODAL CHI TIẾT CAO CẤP --- */}
      <Modal
        open={isDetailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaEye style={{ color: '#1890ff' }} />
            <span>Thông tin chi tiết thiết bị</span>
          </div>
        }
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={700}
        centered
        className="product-detail-modal"
      >
        {selectedProduct && (
          <div className="detail-content-wrapper">

            {/* Header thông tin chính */}
            <div className="product-header-section">
              <h3 className="product-name">{selectedProduct.ProductName}</h3>
              <div className="product-meta">
                <Tag color="geekblue" style={{ marginRight: 8 }}>{selectedProduct.BrandName}</Tag>
                <span className="model-text">Model: <b>{selectedProduct.Model}</b></span>
              </div>
            </div>

            {/* Box Serial Number với nút Copy */}
            <div className="serial-section">
              <div className="serial-label">Serial Number (S/N)</div>
              <div className="serial-value-row">
                <span className="serial-text">
                  {selectedProduct.SerialNumber || "Chưa cập nhật"}
                </span>
                {selectedProduct.SerialNumber && (
                  <Tooltip title="Sao chép">
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      className="btn-copy-serial"
                      onClick={() => handleCopySerial(selectedProduct.SerialNumber)}
                    />
                  </Tooltip>
                )}
              </div>
            </div>

            <Divider style={{ margin: '20px 0' }} />

            {/* Grid thông tin chi tiết */}
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <div className="detail-item">
                  <span className="label">Trạng thái</span>
                  <div className="value">
                    <Tag
                      color={selectedProduct.Status === "Đã nhập kho" ? "success" : "warning"}
                      style={{ fontSize: 13, padding: '4px 10px', borderRadius: 4 }}
                    >
                      {selectedProduct.Status === "Đã nhập kho" ?
                        <><CheckCircleOutlined /> Đã nhập kho</> :
                        <><ClockCircleOutlined /> Chờ nhập kho</>
                      }
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="detail-item">
                  <span className="label">Mã phiếu (Ticket)</span>
                  <div className="value ticket-text">{selectedProduct.Ticket}</div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="detail-item">
                  <span className="label">Ngày hóa đơn</span>
                  <div className="value">
                    {selectedProduct.InvoiceDate ? new Date(selectedProduct.InvoiceDate).toLocaleDateString("vi-VN") : "--"}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="detail-item">
                  <span className="label">Thời hạn bảo hành</span>
                  <div className="value">
                    {selectedProduct.Warranty ? <b style={{ color: '#fa8c16' }}>{selectedProduct.Warranty} tháng</b> : "--"}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="detail-item">
                  <span className="label">Loại thiết bị</span>
                  <div className="value">{selectedProduct.Type}</div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="detail-item">
                  <span className="label">Số lượng nhập</span>
                  <div className="value"><b>{selectedProduct.Qty}</b> <small style={{ color: '#8c8c8c' }}>(Thiết bị)</small></div>
                </div>
              </Col>
            </Row>

            {/* Actions Footer */}
            <div className="detail-actions">
              {selectedProduct.Status !== "Đã nhập kho" && (
                <>
                  <Button
                    className="btn-update"
                    icon={<FaEdit />}
                    onClick={() => { setIsUpdateModalOpen(true); setIsDetailModalOpen(false); }}
                  >
                    Cập nhật
                  </Button>

                  {selectedProduct.Warranty && (
                    <Button
                      type="primary"
                      className="btn-confirm"
                      icon={<FaCheck />}
                      onClick={() => { setIsConfirmModalOpen(true); setIsDetailModalOpen(false); }}
                    >
                      Xác nhận Nhập Kho
                    </Button>
                  )}
                </>
              )}
              <Button onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Cập nhật */}
      {isUpdateModalOpen && selectedProduct && (
        <UpdateProductSupplierDetail
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          invoice={selectedProduct}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Modal Xác nhận */}
      {isConfirmModalOpen && selectedProduct && (
        <ConfirmImportModal
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          product={selectedProduct}
          onConfirmSuccess={handleSuccessConfirm}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </div>
  );
};

export default ProductSupplierDetail;
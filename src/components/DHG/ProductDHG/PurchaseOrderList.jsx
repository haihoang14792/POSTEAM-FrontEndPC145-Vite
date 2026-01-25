// // import React, { useEffect, useState } from "react";
// // import {
// //   Table,
// //   Tag,
// //   Button,
// //   Input,
// //   Modal,
// //   Descriptions,
// //   message,
// //   Form,
// //   Select,
// //   Row,
// //   Col,
// //   notification,
// //   Space,
// // } from "antd";
// // import {
// //   SearchOutlined,
// //   PlusOutlined,
// //   EditOutlined,
// //   CheckOutlined,
// //   FileExcelOutlined,
// //   ExclamationCircleOutlined,
// //   CloseOutlined,
// //   InboxOutlined,
// //   WarningTwoTone,
// // } from "@ant-design/icons";
// // import * as XLSX from "xlsx";
// // import {
// //   fetchListPurchaseOder,
// //   updateSupplierForm,
// //   sendSupplierDetail,
// // } from "../../../services/dhgServices";
// // import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";
// // import UpdatePurchaseOrderModal from "./UpdatePurchaseOrderModal";
// // import "./PurchaseOrderList.scss";

// // const { confirm } = Modal;
// // const { Option } = Select;

// // const statusIconMap = {
// //   "Chưa nhận hàng": <InboxOutlined style={{ color: "#1890ff" }} />,
// //   "Đã nhận hàng": <CheckOutlined style={{ color: "green" }} />,
// //   "Hủy phiếu": <CloseOutlined style={{ color: "red" }} />,
// // };

// // const PurchaseOrderList = () => {
// //   const [invoices, setInvoices] = useState([]);
// //   const [filteredInvoices, setFilteredInvoices] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedInvoice, setSelectedInvoice] = useState(null);
// //   const [createModalVisible, setCreateModalVisible] = useState(false);
// //   const [updateModalVisible, setUpdateModalVisible] = useState(false);
// //   const [userName, setUserName] = useState("");
// //   const [purchase, setPurchase] = useState("");
// //   const [admin, setAdmin] = useState("");
// //   const [form] = Form.useForm();
// //   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

// //   // Load invoices
// //   const loadInvoices = async () => {
// //     setLoading(true);
// //     try {
// //       const invoicesData = await fetchListPurchaseOder();
// //       // Sắp xếp giảm dần theo createdAt (mới nhất đầu)
// //       const sortedData = invoicesData.data.sort(
// //         (a, b) =>
// //           new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
// //       );
// //       setInvoices(sortedData);
// //       setFilteredInvoices(sortedData); // hoặc filteredInvoices tùy state bạn dùng
// //     } catch (error) {
// //       // Nếu muốn bạn có thể khai báo state error rồi setError(error)
// //       // Hoặc dùng message lỗi trực tiếp
// //       message.error("Lỗi tải danh sách phiếu");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     // Load user info
// //     const storedUser = localStorage.getItem("user");
// //     if (storedUser) {
// //       try {
// //         const parsedUser = JSON.parse(storedUser);
// //         setUserName(parsedUser?.account?.Name || "");
// //         setPurchase(parsedUser?.account?.Purchase || "");
// //         setAdmin(parsedUser?.account?.Admin || "");
// //       } catch {
// //         // ignore error
// //       }
// //     }
// //     loadInvoices();
// //   }, []);

// //   // Filter form submit
// //   const onFinish = (values) => {
// //     let filtered = [...invoices];
// //     if (values.status) {
// //       filtered = filtered.filter(
// //         (inv) => inv.attributes.Status === values.status
// //       );
// //     }
// //     if (values.customer) {
// //       filtered = filtered.filter(
// //         (inv) => inv.attributes.Customer === values.customer
// //       );
// //     }
// //     if (values.storeID) {
// //       filtered = filtered.filter(
// //         (inv) => inv.attributes.StoreID === values.storeID
// //       );
// //     }
// //     if (values.purchuser) {
// //       filtered = filtered.filter(
// //         (inv) => inv.attributes.Purchuser === values.purchuser
// //       );
// //     }
// //     if (values.searchText) {
// //       const search = values.searchText.toLowerCase();
// //       filtered = filtered.filter(
// //         (inv) =>
// //           inv.attributes.Model?.toLowerCase().includes(search) ||
// //           inv.attributes.ProductName?.toLowerCase().includes(search)
// //       );
// //     }
// //     setFilteredInvoices(filtered);
// //     setSelectedInvoice(null);
// //   };

// //   // Reset filter
// //   const onReset = () => {
// //     form.resetFields();
// //     setFilteredInvoices(invoices);
// //     setSelectedInvoice(null);
// //   };

// //   // Export Excel
// //   const handleExportExcel = () => {
// //     const ws = XLSX.utils.json_to_sheet(
// //       filteredInvoices.map((invoice) => ({
// //         "Số phiếu": invoice.attributes.Ticket,
// //         "Nhà cung cấp": invoice.attributes.NameNCC,
// //         "Sản phẩm": invoice.attributes.ProductName,
// //         Model: invoice.attributes.Model,
// //         "Ngày nhập": invoice.attributes.Date,
// //         "Số lượng": invoice.attributes.Qty,
// //         "Tổng tiền": invoice.attributes.TotalAmount,
// //         "Trạng thái": invoice.attributes.Status,
// //       }))
// //     );
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "Invoices");
// //     XLSX.writeFile(wb, "Invoices_List.xlsx");
// //   };

// //   // Thống kê trạng thái
// //   const statusCounts = Object.values(
// //     filteredInvoices.reduce((acc, item) => {
// //       const status = item.attributes.Status || "Chưa xác định";
// //       if (!acc[status]) {
// //         acc[status] = {
// //           label: status,
// //           count: 0,
// //           icon: statusIconMap[status] || null,
// //         };
// //       }
// //       acc[status].count++;
// //       return acc;
// //     }, {})
// //   );

// //   // Xác nhận phiếu
// //   const handleConfirmInvoice = async (invoice) => {
// //     try {
// //       await updateSupplierForm(invoice.id, { Status: "Đã nhận hàng" });
// //       message.success(`Xác nhận phiếu ${invoice.attributes.Ticket} thành công`);

// //       const invoicesData = await fetchListPurchaseOder();
// //       const sortedData = invoicesData.data.sort(
// //         (a, b) =>
// //           new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
// //       );
// //       setInvoices(sortedData);
// //       setFilteredInvoices(sortedData);

// //       const updatedInvoice = sortedData.find((i) => i.id === invoice.id);
// //       if (updatedInvoice) {
// //         setSelectedInvoice(updatedInvoice);
// //       }
// //     } catch {
// //       message.error("Xác nhận thất bại");
// //     }
// //   };

// //   const showConfirmDialog = (invoice) => {
// //     confirm({
// //       title: "Xác nhận phiếu này?",
// //       icon: <ExclamationCircleOutlined />,
// //       content: 'Bạn có chắc chắn muốn xác nhận phiếu này là "Đã nhận hàng"?',
// //       okText: "Đồng ý",
// //       cancelText: "Trở về",
// //       onOk() {
// //         handleConfirmInvoice(invoice);
// //       },
// //     });
// //   };

// //   // Hủy phiếu
// //   const handleDeleteInvoice = async (invoice) => {
// //     try {
// //       await updateSupplierForm(invoice.id, { Status: "Hủy phiếu" });
// //       message.success(`Hủy phiếu ${invoice.attributes.Ticket} thành công`);
// //       await loadInvoices();
// //       setSelectedInvoice(null);
// //     } catch {
// //       message.error("Hủy phiếu thất bại");
// //     }
// //   };

// //   const showDeleteDialog = (invoice) => {
// //     confirm({
// //       title: "Hủy phiếu này?",
// //       icon: <ExclamationCircleOutlined />,
// //       content: 'Bạn có chắc chắn muốn hủy phiếu này là "Hủy phiếu"?',
// //       okText: "Đồng ý",
// //       cancelText: "Trở về",
// //       onOk() {
// //         handleDeleteInvoice(invoice);
// //       },
// //     });
// //   };

// //   // Trả nhà cung cấp
// //   const handleReturnInvoiceSP = async (invoice) => {
// //     try {
// //       await updateSupplierForm(invoice.id, { Status: "Trả NCC" });
// //       message.success(
// //         `Trả nhà cung cấp ${invoice.attributes.Ticket} thành công`
// //       );
// //       await loadInvoices();
// //       setSelectedInvoice(null);
// //     } catch {
// //       message.error("Trả nhà cung cấp thất bại");
// //     }
// //   };

// //   const showReturnDialogSP = (invoice) => {
// //     confirm({
// //       title: "Trả nhà cung cấp sản phẩm này?",
// //       icon: <ExclamationCircleOutlined />,
// //       content: 'Bạn có chắc chắn muốn trả sản phẩm này là "Trả NCC?',
// //       okText: "Đồng ý",
// //       cancelText: "Trở về",
// //       onOk() {
// //         handleReturnInvoiceSP(invoice);
// //       },
// //     });
// //   };

// //   // Gửi sản phẩm vào chi tiết
// //   const handleSendProductData = async (invoice) => {
// //     if (invoice.attributes.isProductSent) {
// //       notification.warning({
// //         message: "Sản phẩm đã gửi",
// //         description: "Sản phẩm này đã được gửi trước đó.",
// //       });
// //       return;
// //     }
// //     try {
// //       const dataToSend = {
// //         data: {
// //           ProductName: invoice.attributes.ProductName,
// //           Model: invoice.attributes.Model,
// //           BrandName: invoice.attributes.BrandName,
// //           Type: invoice.attributes.Type,
// //           SerialNumber: invoice.attributes.SerialNumber,
// //           InvoiceDate: invoice.attributes.InvoiceDate,
// //           Ticket: invoice.attributes.Ticket,
// //           Status: "Chờ nhập kho",
// //           Qty: invoice.attributes.Qty,
// //           DVT: invoice.attributes.DVT,
// //         },
// //       };
// //       await sendSupplierDetail(dataToSend);
// //       await updateSupplierForm(invoice.id, { isProductSent: true });
// //       message.success("Gửi dữ liệu thành công");

// //       // Load lại danh sách và giữ modal mở
// //       const invoicesData = await fetchListPurchaseOder();
// //       const sortedData = invoicesData.data.sort(
// //         (a, b) =>
// //           new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
// //       );
// //       setInvoices(sortedData);
// //       setFilteredInvoices(sortedData);

// //       const updatedInvoice = sortedData.find((i) => i.id === invoice.id);
// //       if (updatedInvoice) {
// //         setSelectedInvoice(updatedInvoice);
// //       }
// //     } catch {
// //       notification.error({
// //         message: "Gửi dữ liệu thất bại",
// //         description: "Có lỗi khi gửi dữ liệu sản phẩm.",
// //       });
// //     }
// //   };

// //   const showProductDialog = (invoice) => {
// //     confirm({
// //       title: "Gửi sản phẩm vào chi tiết?",
// //       icon: <ExclamationCircleOutlined />,
// //       content: "Bạn có muốn gửi sản phẩm này vào chi tiết sản phẩm không?",
// //       okText: "Đồng ý",
// //       cancelText: "Trở về",
// //       onOk() {
// //         handleSendProductData(invoice);
// //       },
// //     });
// //   };

// //   const [pagination, setPagination] = useState({
// //     current: 1,
// //     pageSize: 10,
// //   });
// //   const columns = [
// //     {
// //       title: "STT",
// //       align: "center",
// //       render: (_, __, index) =>
// //         (pagination.current - 1) * pagination.pageSize + index + 1,
// //       width: 60,
// //     },
// //     {
// //       title: "Số phiếu",
// //       dataIndex: ["attributes", "Ticket"],
// //     },
// //     {
// //       title: "Sản phẩm",
// //       dataIndex: ["attributes", "ProductName"],
// //     },
// //     {
// //       title: "Model",
// //       dataIndex: ["attributes", "Model"],
// //     },
// //     {
// //       title: "Người đề nghị",
// //       dataIndex: ["attributes", "Purchuser"],
// //     },
// //     {
// //       title: "Ngày đề nghị",
// //       dataIndex: ["attributes", "createdAt"],
// //       render: (date) =>
// //         date ? new Date(date).toLocaleDateString("vi-VN") : "",
// //     },
// //     {
// //       title: "Số lượng",
// //       dataIndex: ["attributes", "Qty"],
// //       align: "center",
// //     },
// //     ...(purchase === true
// //       ? [
// //           {
// //             title: "Tổng cộng",
// //             dataIndex: ["attributes", "AmountSupplier"],
// //             render: (value) => (value != null ? value.toLocaleString() : ""),
// //             align: "right",
// //           },
// //         ]
// //       : []),

// //     {
// //       title: "Trạng thái",
// //       dataIndex: ["attributes", "Status"],
// //       align: "center",
// //       render: (status) => {
// //         let color = "default";
// //         if (status === "Đã nhận hàng") color = "green";
// //         else if (status === "Hủy phiếu") color = "red";
// //         else if (status === "Chưa nhận hàng") color = "blue";
// //         else if (status === "Trả NCC") color = "orange";
// //         return <Tag color={color}>{status}</Tag>;
// //       },
// //     },
// //     {
// //       title: "Chi tiết",
// //       width: 120,
// //       render: (_, record) => (
// //         <Space>
// //           <Button
// //             size="small"
// //             onClick={() => {
// //               setSelectedInvoice(record);
// //               setIsDetailModalOpen(true);
// //             }}
// //           >
// //             Chi tiết
// //           </Button>
// //         </Space>
// //       ),
// //     },
// //   ];

// //   return (
// //     <div className="purchase-order-list-container" style={{ padding: 20 }}>
// //       <Form
// //         form={form}
// //         layout="inline"
// //         onFinish={onFinish}
// //         style={{ marginBottom: 20 }}
// //       >
// //         {/* Hàng 1 */}
// //         <div
// //           style={{
// //             display: "flex",
// //             flexWrap: "wrap",
// //             gap: "12px",
// //             width: "100%",
// //             marginBottom: "16px",
// //           }}
// //         >
// //           <Form.Item name="status" label="Trạng thái">
// //             <Select
// //               style={{ width: 160 }}
// //               allowClear
// //               placeholder="Chọn trạng thái"
// //             >
// //               {[...new Set(invoices.map((inv) => inv.attributes.Status))].map(
// //                 (status) => (
// //                   <Option key={status} value={status}>
// //                     {status}
// //                   </Option>
// //                 )
// //               )}
// //             </Select>
// //           </Form.Item>

// //           <Form.Item name="customer" label="Khách hàng">
// //             <Select
// //               style={{ width: 160 }}
// //               allowClear
// //               showSearch
// //               placeholder="Chọn khách hàng"
// //               optionFilterProp="children"
// //             >
// //               {[...new Set(invoices.map((inv) => inv.attributes.Customer))].map(
// //                 (customer) => (
// //                   <Option key={customer} value={customer}>
// //                     {customer}
// //                   </Option>
// //                 )
// //               )}
// //             </Select>
// //           </Form.Item>

// //           <Form.Item name="storeID" label="StoreID">
// //             <Select
// //               style={{ width: 160 }}
// //               allowClear
// //               showSearch
// //               placeholder="Chọn storeID"
// //               optionFilterProp="children"
// //             >
// //               {[...new Set(invoices.map((inv) => inv.attributes.StoreID))].map(
// //                 (storeID) => (
// //                   <Option key={storeID} value={storeID}>
// //                     {storeID}
// //                   </Option>
// //                 )
// //               )}
// //             </Select>
// //           </Form.Item>
// //         </div>

// //         {/* Hàng 2 */}
// //         <div
// //           style={{
// //             display: "flex",
// //             flexWrap: "wrap",
// //             gap: "12px",
// //             width: "100%",
// //           }}
// //         >
// //           <Form.Item name="searchText" label="Tìm kiếm">
// //             <Input
// //               placeholder="Model hoặc tên sản phẩm"
// //               style={{ width: 200 }}
// //             />
// //           </Form.Item>
// //           <Form.Item name="purchuser" label="Người đề nghị">
// //             <Select
// //               style={{ width: 200 }}
// //               allowClear
// //               placeholder="Chọn người đề nghị"
// //             >
// //               {[
// //                 ...new Set(invoices.map((inv) => inv.attributes.Purchuser)),
// //               ].map((purchuser) => (
// //                 <Option key={purchuser} value={purchuser}>
// //                   {purchuser}
// //                 </Option>
// //               ))}
// //             </Select>
// //           </Form.Item>
// //           <Form.Item>
// //             <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
// //               Tìm kiếm
// //             </Button>
// //           </Form.Item>

// //           <Form.Item>
// //             <Button onClick={onReset}>Reset</Button>
// //           </Form.Item>
// //           {purchase === true && (
// //             <Form.Item>
// //               <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
// //                 Xuất Excel
// //               </Button>
// //             </Form.Item>
// //           )}
// //           {purchase === true && (
// //             <Form.Item>
// //               <Button
// //                 type="primary"
// //                 icon={<PlusOutlined />}
// //                 onClick={() => setCreateModalVisible(true)}
// //               >
// //                 Tạo phiếu nhập
// //               </Button>
// //             </Form.Item>
// //           )}
// //         </div>
// //       </Form>

// //       {/* Status summary */}
// //       <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
// //         {statusCounts.map(({ label, count, icon }) => (
// //           <Col key={label}>
// //             <div
// //               style={{
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: 6,
// //                 fontWeight: 500,
// //               }}
// //             >
// //               {icon}
// //               <span>{label}:</span>
// //               <span style={{ fontWeight: "bold" }}>{count}</span>
// //             </div>
// //           </Col>
// //         ))}
// //       </Row>

// //       {/* Table danh sách */}
// //       <Table
// //         rowKey="id"
// //         loading={loading}
// //         columns={columns}
// //         dataSource={filteredInvoices}
// //         onRow={(record) => ({
// //           onClick: () => setSelectedInvoice(record),
// //         })}
// //         scroll={{ x: 1000 }}
// //         pagination={{
// //           current: pagination.current,
// //           pageSize: pagination.pageSize,
// //           showSizeChanger: true,
// //           pageSizeOptions: ["10", "20", "50"],
// //         }}
// //         onChange={(pag) => setPagination(pag)}
// //       />

// //       {/* Modal chi tiết */}
// //       <Modal
// //         title="Chi tiết phiếu nhập"
// //         open={isDetailModalOpen} //xài hàng này do chi tiết
// //         onCancel={() => setIsDetailModalOpen(false)}
// //         // visible={!!selectedInvoice}
// //         //onCancel={() => setSelectedInvoice(null)}
// //         footer={null}
// //         width={750}
// //       >
// //         {selectedInvoice && (
// //           <>
// //             <Descriptions bordered column={2} size="small">
// //               <Descriptions.Item label="Số phiếu">
// //                 {selectedInvoice.attributes.Ticket}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Người tạo phiếu">
// //                 {selectedInvoice.attributes.NameCreate}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Tình trạng">
// //                 <Tag
// //                   color={
// //                     selectedInvoice.attributes.Status === "Đã nhận hàng"
// //                       ? "green"
// //                       : selectedInvoice.attributes.Status === "Hủy phiếu"
// //                       ? "red"
// //                       : "blue"
// //                   }
// //                 >
// //                   {selectedInvoice.attributes.Status}
// //                 </Tag>
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Người đề nghị">
// //                 {selectedInvoice.attributes.Purchuser}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Khách hàng">
// //                 {selectedInvoice.attributes.Customer}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="StoreID">
// //                 {selectedInvoice.attributes.StoreID}
// //               </Descriptions.Item>

// //               <Descriptions.Item label="Tên sản phẩm">
// //                 {selectedInvoice.attributes.ProductName}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Model">
// //                 {selectedInvoice.attributes.Model}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Thương hiệu">
// //                 {selectedInvoice.attributes.BrandName}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Loại sản phẩm">
// //                 {selectedInvoice.attributes.Type}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Số hóa đơn">
// //                 {selectedInvoice.attributes.InvoiceNumber}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Ngày hóa đơn">
// //                 {selectedInvoice.attributes.InvoiceDate
// //                   ? new Date(
// //                       selectedInvoice.attributes.InvoiceDate
// //                     ).toLocaleDateString("vi-VN")
// //                   : ""}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Loại tiền">
// //                 {selectedInvoice.attributes.Currency}
// //               </Descriptions.Item>

// //               <Descriptions.Item label="Ngày lập phiếu">
// //                 {new Date(
// //                   selectedInvoice.attributes.createdAt
// //                 ).toLocaleDateString("vi-VN")}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Thuế (%)">
// //                 {selectedInvoice?.attributes?.VatRate != null
// //                   ? `${selectedInvoice.attributes.VatRate}%`
// //                   : " "}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Số lượng">
// //                 {selectedInvoice.attributes.Qty}
// //               </Descriptions.Item>
// //               {purchase === true && (
// //                 <>
// //                   <Descriptions.Item label="Đơn giá">
// //                     {selectedInvoice.attributes.UnitPrice?.toLocaleString()}
// //                   </Descriptions.Item>
// //                   <Descriptions.Item label="Giá chưa VAT">
// //                     {selectedInvoice.attributes.TotalAmount?.toLocaleString()}
// //                   </Descriptions.Item>
// //                   <Descriptions.Item label="VAT">
// //                     {selectedInvoice.attributes.Vat?.toLocaleString()}
// //                   </Descriptions.Item>
// //                   <Descriptions.Item label="Tổng cộng">
// //                     {selectedInvoice.attributes.AmountSupplier?.toLocaleString()}
// //                   </Descriptions.Item>
// //                 </>
// //               )}
// //               <Descriptions.Item label="Nhà cung cấp" span={2}>
// //                 {selectedInvoice.attributes.NameNCC}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="SerialNumber" span={2}>
// //                 <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
// //                   {selectedInvoice.attributes.SerialNumber}
// //                 </div>
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
// //                 {selectedInvoice.attributes.ShippingAddress}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Ghi chú" span={2}>
// //                 {selectedInvoice.attributes.Note}
// //               </Descriptions.Item>
// //             </Descriptions>

// //             {/* Các nút thao tác */}
// //             <div
// //               style={{
// //                 marginTop: 16,
// //                 display: "flex",
// //                 gap: 10,
// //                 flexWrap: "wrap",
// //               }}
// //             >
// //               {(userName === selectedInvoice.attributes.NameCreate ||
// //                 admin === true) && (
// //                 <>
// //                   <Button
// //                     type="primary"
// //                     icon={<EditOutlined />}
// //                     onClick={() => setUpdateModalVisible(true)}
// //                   >
// //                     Cập nhật
// //                   </Button>

// //                   {selectedInvoice.attributes.Status !== "Đã nhận hàng" &&
// //                     selectedInvoice.attributes.Status !== "Trả NCC" &&
// //                     (selectedInvoice.attributes.Type === "Vật tư" ||
// //                       selectedInvoice.attributes.SerialNumber) && (
// //                       <Button
// //                         icon={<CheckOutlined />}
// //                         onClick={() => showConfirmDialog(selectedInvoice)}
// //                       >
// //                         Xác nhận
// //                       </Button>
// //                     )}

// //                   {selectedInvoice.attributes.Status !== "Đã nhận hàng" &&
// //                     selectedInvoice.attributes.Status !== "Trả NCC" && (
// //                       <Button
// //                         danger
// //                         icon={<CloseOutlined />}
// //                         onClick={() => showDeleteDialog(selectedInvoice)}
// //                       >
// //                         Hủy phiếu
// //                       </Button>
// //                     )}
// //                   {selectedInvoice.attributes.Status === "Đã nhận hàng" && (
// //                     <Button
// //                       danger
// //                       icon={<WarningTwoTone />}
// //                       onClick={() => showReturnDialogSP(selectedInvoice)}
// //                     >
// //                       Trả NCC
// //                     </Button>
// //                   )}

// //                   {selectedInvoice.attributes.InvoiceDate &&
// //                     selectedInvoice.attributes.Status === "Đã nhận hàng" &&
// //                     !selectedInvoice.attributes.isProductSent &&
// //                     (selectedInvoice.attributes.Type === "Vật tư" ||
// //                       selectedInvoice.attributes.SerialNumber) && (
// //                       <Button
// //                         icon={<InboxOutlined />}
// //                         onClick={() => showProductDialog(selectedInvoice)}
// //                       >
// //                         Gửi sản phẩm
// //                       </Button>
// //                     )}
// //                 </>
// //               )}
// //             </div>
// //           </>
// //         )}
// //       </Modal>

// //       {/* Modal tạo phiếu */}
// //       <CreatePurchaseOrderModal
// //         visible={createModalVisible}
// //         onCancel={() => setCreateModalVisible(false)}
// //         onCreate={() => {
// //           setCreateModalVisible(false);
// //           loadInvoices();
// //         }}
// //       />

// //       {/* Modal cập nhật phiếu */}
// //       <UpdatePurchaseOrderModal
// //         open={updateModalVisible}
// //         onClose={() => setUpdateModalVisible(false)}
// //         invoice={selectedInvoice}
// //         onUpdateSuccess={() => {
// //           setUpdateModalVisible(false);
// //           loadInvoices();
// //           setIsDetailModalOpen(false);
// //         }}
// //       />
// //     </div>
// //   );
// // };

// // export default PurchaseOrderList;


// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Tag,
//   Button,
//   Input,
//   Modal,
//   Descriptions,
//   message,
//   Form,
//   Select,
//   Row,
//   Col,
//   notification,
//   Space,
// } from "antd";
// import {
//   SearchOutlined,
//   PlusOutlined,
//   EditOutlined,
//   CheckOutlined,
//   FileExcelOutlined,
//   ExclamationCircleOutlined,
//   CloseOutlined,
//   InboxOutlined,
//   WarningTwoTone,
// } from "@ant-design/icons";
// import * as XLSX from "xlsx";
// import {
//   fetchListPurchaseOder,
//   updateSupplierForm,
//   sendSupplierDetail,
// } from "../../../services/dhgServices";
// import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";
// import UpdatePurchaseOrderModal from "./UpdatePurchaseOrderModal";
// import "./PurchaseOrderList.scss";

// const { confirm } = Modal;
// const { Option } = Select;

// const statusIconMap = {
//   "Chưa nhận hàng": <InboxOutlined style={{ color: "#1890ff" }} />,
//   "Đã nhận hàng": <CheckOutlined style={{ color: "green" }} />,
//   "Hủy phiếu": <CloseOutlined style={{ color: "red" }} />,
// };

// const PurchaseOrderList = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [createModalVisible, setCreateModalVisible] = useState(false);
//   const [updateModalVisible, setUpdateModalVisible] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [purchase, setPurchase] = useState("");
//   const [admin, setAdmin] = useState("");
//   const [form] = Form.useForm();
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

//   // Load invoices
//   const loadInvoices = async () => {
//     setLoading(true);
//     try {
//       const invoicesData = await fetchListPurchaseOder();
//       // Strapi v5: response có thể là mảng trực tiếp hoặc { data: [...] }
//       const data = Array.isArray(invoicesData) ? invoicesData : (invoicesData.data || []);

//       // Sửa: bỏ .attributes trong sort
//       const sortedData = data.sort(
//         (a, b) =>
//           new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setInvoices(sortedData);
//       setFilteredInvoices(sortedData);
//     } catch (error) {
//       message.error("Lỗi tải danh sách phiếu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Load user info
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserName(parsedUser?.account?.Name || "");
//         setPurchase(parsedUser?.account?.Purchase || "");
//         setAdmin(parsedUser?.account?.Admin || "");
//       } catch {
//         // ignore error
//       }
//     }
//     loadInvoices();
//   }, []);

//   // Filter form submit
//   const onFinish = (values) => {
//     let filtered = [...invoices];
//     if (values.status) {
//       // Sửa: bỏ .attributes
//       filtered = filtered.filter(
//         (inv) => inv.Status === values.status
//       );
//     }
//     if (values.customer) {
//       // Sửa: bỏ .attributes
//       filtered = filtered.filter(
//         (inv) => inv.Customer === values.customer
//       );
//     }
//     if (values.storeID) {
//       // Sửa: bỏ .attributes
//       filtered = filtered.filter(
//         (inv) => inv.StoreID === values.storeID
//       );
//     }
//     if (values.purchuser) {
//       // Sửa: bỏ .attributes
//       filtered = filtered.filter(
//         (inv) => inv.Purchuser === values.purchuser
//       );
//     }
//     if (values.searchText) {
//       const search = values.searchText.toLowerCase();
//       filtered = filtered.filter(
//         (inv) =>
//           // Sửa: bỏ .attributes
//           inv.Model?.toLowerCase().includes(search) ||
//           inv.ProductName?.toLowerCase().includes(search)
//       );
//     }
//     setFilteredInvoices(filtered);
//     setSelectedInvoice(null);
//   };

//   // Reset filter
//   const onReset = () => {
//     form.resetFields();
//     setFilteredInvoices(invoices);
//     setSelectedInvoice(null);
//   };

//   // Export Excel
//   const handleExportExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       filteredInvoices.map((invoice) => ({
//         // Sửa: bỏ .attributes
//         "Số phiếu": invoice.Ticket,
//         "Nhà cung cấp": invoice.NameNCC,
//         "Sản phẩm": invoice.ProductName,
//         Model: invoice.Model,
//         "Ngày nhập": invoice.Date,
//         "Số lượng": invoice.Qty,
//         "Tổng tiền": invoice.TotalAmount,
//         "Trạng thái": invoice.Status,
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Invoices");
//     XLSX.writeFile(wb, "Invoices_List.xlsx");
//   };

//   // Thống kê trạng thái
//   const statusCounts = Object.values(
//     filteredInvoices.reduce((acc, item) => {
//       // Sửa: bỏ .attributes
//       const status = item.Status || "Chưa xác định";
//       if (!acc[status]) {
//         acc[status] = {
//           label: status,
//           count: 0,
//           icon: statusIconMap[status] || null,
//         };
//       }
//       acc[status].count++;
//       return acc;
//     }, {})
//   );

//   // Xác nhận phiếu
//   const handleConfirmInvoice = async (invoice) => {
//     try {
//       // Sửa: dùng id hoặc documentId
//       await updateSupplierForm(invoice.id || invoice.documentId, { Status: "Đã nhận hàng" });
//       message.success(`Xác nhận phiếu ${invoice.Ticket} thành công`); // Sửa: bỏ .attributes

//       const invoicesData = await fetchListPurchaseOder();
//       // Strapi v5: response phẳng
//       const data = Array.isArray(invoicesData) ? invoicesData : (invoicesData.data || []);
//       const sortedData = data.sort(
//         (a, b) =>
//           new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setInvoices(sortedData);
//       setFilteredInvoices(sortedData);

//       const updatedInvoice = sortedData.find((i) => i.id === invoice.id);
//       if (updatedInvoice) {
//         setSelectedInvoice(updatedInvoice);
//       }
//     } catch {
//       message.error("Xác nhận thất bại");
//     }
//   };

//   const showConfirmDialog = (invoice) => {
//     confirm({
//       title: "Xác nhận phiếu này?",
//       icon: <ExclamationCircleOutlined />,
//       content: 'Bạn có chắc chắn muốn xác nhận phiếu này là "Đã nhận hàng"?',
//       okText: "Đồng ý",
//       cancelText: "Trở về",
//       onOk() {
//         handleConfirmInvoice(invoice);
//       },
//     });
//   };

//   // Hủy phiếu
//   const handleDeleteInvoice = async (invoice) => {
//     try {
//       // Sửa: dùng id hoặc documentId
//       await updateSupplierForm(invoice.id || invoice.documentId, { Status: "Hủy phiếu" });
//       message.success(`Hủy phiếu ${invoice.Ticket} thành công`); // Sửa: bỏ .attributes
//       await loadInvoices();
//       setSelectedInvoice(null);
//     } catch {
//       message.error("Hủy phiếu thất bại");
//     }
//   };

//   const showDeleteDialog = (invoice) => {
//     confirm({
//       title: "Hủy phiếu này?",
//       icon: <ExclamationCircleOutlined />,
//       content: 'Bạn có chắc chắn muốn hủy phiếu này là "Hủy phiếu"?',
//       okText: "Đồng ý",
//       cancelText: "Trở về",
//       onOk() {
//         handleDeleteInvoice(invoice);
//       },
//     });
//   };

//   // Trả nhà cung cấp
//   const handleReturnInvoiceSP = async (invoice) => {
//     try {
//       // Sửa: dùng id hoặc documentId
//       await updateSupplierForm(invoice.id || invoice.documentId, { Status: "Trả NCC" });
//       message.success(
//         `Trả nhà cung cấp ${invoice.Ticket} thành công` // Sửa: bỏ .attributes
//       );
//       await loadInvoices();
//       setSelectedInvoice(null);
//     } catch {
//       message.error("Trả nhà cung cấp thất bại");
//     }
//   };

//   const showReturnDialogSP = (invoice) => {
//     confirm({
//       title: "Trả nhà cung cấp sản phẩm này?",
//       icon: <ExclamationCircleOutlined />,
//       content: 'Bạn có chắc chắn muốn trả sản phẩm này là "Trả NCC?',
//       okText: "Đồng ý",
//       cancelText: "Trở về",
//       onOk() {
//         handleReturnInvoiceSP(invoice);
//       },
//     });
//   };

//   // Gửi sản phẩm vào chi tiết
//   const handleSendProductData = async (invoice) => {
//     // Sửa: bỏ .attributes
//     if (invoice.isProductSent) {
//       notification.warning({
//         message: "Sản phẩm đã gửi",
//         description: "Sản phẩm này đã được gửi trước đó.",
//       });
//       return;
//     }
//     try {
//       // Sửa: bỏ .attributes
//       const dataToSend = {
//         data: {
//           ProductName: invoice.ProductName,
//           Model: invoice.Model,
//           BrandName: invoice.BrandName,
//           Type: invoice.Type,
//           SerialNumber: invoice.SerialNumber,
//           InvoiceDate: invoice.InvoiceDate,
//           Ticket: invoice.Ticket,
//           Status: "Chờ nhập kho",
//           Qty: invoice.Qty,
//           DVT: invoice.DVT,
//         },
//       };
//       await sendSupplierDetail(dataToSend);
//       // Sửa: dùng id hoặc documentId
//       await updateSupplierForm(invoice.id || invoice.documentId, { isProductSent: true });
//       message.success("Gửi dữ liệu thành công");

//       // Load lại danh sách và giữ modal mở
//       const invoicesData = await fetchListPurchaseOder();
//       // Strapi v5: response phẳng
//       const data = Array.isArray(invoicesData) ? invoicesData : (invoicesData.data || []);
//       const sortedData = data.sort(
//         (a, b) =>
//           new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setInvoices(sortedData);
//       setFilteredInvoices(sortedData);

//       const updatedInvoice = sortedData.find((i) => i.id === invoice.id);
//       if (updatedInvoice) {
//         setSelectedInvoice(updatedInvoice);
//       }
//     } catch {
//       notification.error({
//         message: "Gửi dữ liệu thất bại",
//         description: "Có lỗi khi gửi dữ liệu sản phẩm.",
//       });
//     }
//   };

//   const showProductDialog = (invoice) => {
//     confirm({
//       title: "Gửi sản phẩm vào chi tiết?",
//       icon: <ExclamationCircleOutlined />,
//       content: "Bạn có muốn gửi sản phẩm này vào chi tiết sản phẩm không?",
//       okText: "Đồng ý",
//       cancelText: "Trở về",
//       onOk() {
//         handleSendProductData(invoice);
//       },
//     });
//   };

//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   });
//   const columns = [
//     {
//       title: "STT",
//       align: "center",
//       render: (_, __, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//       width: 60,
//     },
//     {
//       title: "Số phiếu",
//       dataIndex: "Ticket", // Sửa: bỏ ["attributes", ...]
//     },
//     {
//       title: "Sản phẩm",
//       dataIndex: "ProductName", // Sửa: bỏ ["attributes", ...]
//     },
//     {
//       title: "Model",
//       dataIndex: "Model", // Sửa: bỏ ["attributes", ...]
//     },
//     {
//       title: "Người đề nghị",
//       dataIndex: "Purchuser", // Sửa: bỏ ["attributes", ...]
//     },
//     {
//       title: "Ngày đề nghị",
//       dataIndex: "createdAt", // Sửa: bỏ ["attributes", ...]
//       render: (date) =>
//         date ? new Date(date).toLocaleDateString("vi-VN") : "",
//     },
//     {
//       title: "Số lượng",
//       dataIndex: "Qty", // Sửa: bỏ ["attributes", ...]
//       align: "center",
//     },
//     ...(purchase === true
//       ? [
//         {
//           title: "Tổng cộng",
//           dataIndex: "AmountSupplier", // Sửa: bỏ ["attributes", ...]
//           render: (value) => (value != null ? value.toLocaleString() : ""),
//           align: "right",
//         },
//       ]
//       : []),

//     {
//       title: "Trạng thái",
//       dataIndex: "Status", // Sửa: bỏ ["attributes", ...]
//       align: "center",
//       render: (status) => {
//         let color = "default";
//         if (status === "Đã nhận hàng") color = "green";
//         else if (status === "Hủy phiếu") color = "red";
//         else if (status === "Chưa nhận hàng") color = "blue";
//         else if (status === "Trả NCC") color = "orange";
//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "Chi tiết",
//       width: 120,
//       render: (_, record) => (
//         <Space>
//           <Button
//             size="small"
//             onClick={() => {
//               setSelectedInvoice(record);
//               setIsDetailModalOpen(true);
//             }}
//           >
//             Chi tiết
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="purchase-order-list-container" style={{ padding: 20 }}>
//       <Form
//         form={form}
//         layout="inline"
//         onFinish={onFinish}
//         style={{ marginBottom: 20 }}
//       >
//         {/* Hàng 1 */}
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "12px",
//             width: "100%",
//             marginBottom: "16px",
//           }}
//         >
//           <Form.Item name="status" label="Trạng thái">
//             <Select
//               style={{ width: 160 }}
//               allowClear
//               placeholder="Chọn trạng thái"
//             >
//               {[...new Set(invoices.map((inv) => inv.Status))].map( // Sửa: bỏ .attributes
//                 (status) => (
//                   <Option key={status} value={status}>
//                     {status}
//                   </Option>
//                 )
//               )}
//             </Select>
//           </Form.Item>

//           <Form.Item name="customer" label="Khách hàng">
//             <Select
//               style={{ width: 160 }}
//               allowClear
//               showSearch
//               placeholder="Chọn khách hàng"
//               optionFilterProp="children"
//             >
//               {[...new Set(invoices.map((inv) => inv.Customer))].map( // Sửa: bỏ .attributes
//                 (customer) => (
//                   <Option key={customer} value={customer}>
//                     {customer}
//                   </Option>
//                 )
//               )}
//             </Select>
//           </Form.Item>

//           <Form.Item name="storeID" label="StoreID">
//             <Select
//               style={{ width: 160 }}
//               allowClear
//               showSearch
//               placeholder="Chọn storeID"
//               optionFilterProp="children"
//             >
//               {[...new Set(invoices.map((inv) => inv.StoreID))].map( // Sửa: bỏ .attributes
//                 (storeID) => (
//                   <Option key={storeID} value={storeID}>
//                     {storeID}
//                   </Option>
//                 )
//               )}
//             </Select>
//           </Form.Item>
//         </div>

//         {/* Hàng 2 */}
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "12px",
//             width: "100%",
//           }}
//         >
//           <Form.Item name="searchText" label="Tìm kiếm">
//             <Input
//               placeholder="Model hoặc tên sản phẩm"
//               style={{ width: 200 }}
//             />
//           </Form.Item>
//           <Form.Item name="purchuser" label="Người đề nghị">
//             <Select
//               style={{ width: 200 }}
//               allowClear
//               placeholder="Chọn người đề nghị"
//             >
//               {[
//                 ...new Set(invoices.map((inv) => inv.Purchuser)), // Sửa: bỏ .attributes
//               ].map((purchuser) => (
//                 <Option key={purchuser} value={purchuser}>
//                   {purchuser}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
//               Tìm kiếm
//             </Button>
//           </Form.Item>

//           <Form.Item>
//             <Button onClick={onReset}>Reset</Button>
//           </Form.Item>
//           {purchase === true && (
//             <Form.Item>
//               <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
//                 Xuất Excel
//               </Button>
//             </Form.Item>
//           )}
//           {purchase === true && (
//             <Form.Item>
//               <Button
//                 type="primary"
//                 icon={<PlusOutlined />}
//                 onClick={() => setCreateModalVisible(true)}
//               >
//                 Tạo phiếu nhập
//               </Button>
//             </Form.Item>
//           )}
//         </div>
//       </Form>

//       {/* Status summary */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
//         {statusCounts.map(({ label, count, icon }) => (
//           <Col key={label}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 fontWeight: 500,
//               }}
//             >
//               {icon}
//               <span>{label}:</span>
//               <span style={{ fontWeight: "bold" }}>{count}</span>
//             </div>
//           </Col>
//         ))}
//       </Row>

//       {/* Table danh sách */}
//       <Table
//         rowKey="id"
//         loading={loading}
//         columns={columns}
//         dataSource={filteredInvoices}
//         onRow={(record) => ({
//           onClick: () => setSelectedInvoice(record),
//         })}
//         scroll={{ x: 1000 }}
//         pagination={{
//           current: pagination.current,
//           pageSize: pagination.pageSize,
//           showSizeChanger: true,
//           pageSizeOptions: ["10", "20", "50"],
//         }}
//         onChange={(pag) => setPagination(pag)}
//       />

//       {/* Modal chi tiết */}
//       <Modal
//         title="Chi tiết phiếu nhập"
//         open={isDetailModalOpen}
//         onCancel={() => setIsDetailModalOpen(false)}
//         footer={null}
//         width={750}
//       >
//         {selectedInvoice && (
//           <>
//             <Descriptions bordered column={2} size="small">
//               {/* Sửa: bỏ .attributes trong toàn bộ descriptions */}
//               <Descriptions.Item label="Số phiếu">
//                 {selectedInvoice.Ticket}
//               </Descriptions.Item>
//               <Descriptions.Item label="Người tạo phiếu">
//                 {selectedInvoice.NameCreate}
//               </Descriptions.Item>
//               <Descriptions.Item label="Tình trạng">
//                 <Tag
//                   color={
//                     selectedInvoice.Status === "Đã nhận hàng"
//                       ? "green"
//                       : selectedInvoice.Status === "Hủy phiếu"
//                         ? "red"
//                         : "blue"
//                   }
//                 >
//                   {selectedInvoice.Status}
//                 </Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label="Người đề nghị">
//                 {selectedInvoice.Purchuser}
//               </Descriptions.Item>
//               <Descriptions.Item label="Khách hàng">
//                 {selectedInvoice.Customer}
//               </Descriptions.Item>
//               <Descriptions.Item label="StoreID">
//                 {selectedInvoice.StoreID}
//               </Descriptions.Item>

//               <Descriptions.Item label="Tên sản phẩm">
//                 {selectedInvoice.ProductName}
//               </Descriptions.Item>
//               <Descriptions.Item label="Model">
//                 {selectedInvoice.Model}
//               </Descriptions.Item>
//               <Descriptions.Item label="Thương hiệu">
//                 {selectedInvoice.BrandName}
//               </Descriptions.Item>
//               <Descriptions.Item label="Loại sản phẩm">
//                 {selectedInvoice.Type}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số hóa đơn">
//                 {selectedInvoice.InvoiceNumber}
//               </Descriptions.Item>
//               <Descriptions.Item label="Ngày hóa đơn">
//                 {selectedInvoice.InvoiceDate
//                   ? new Date(
//                     selectedInvoice.InvoiceDate
//                   ).toLocaleDateString("vi-VN")
//                   : ""}
//               </Descriptions.Item>
//               <Descriptions.Item label="Loại tiền">
//                 {selectedInvoice.Currency}
//               </Descriptions.Item>

//               <Descriptions.Item label="Ngày lập phiếu">
//                 {new Date(
//                   selectedInvoice.createdAt
//                 ).toLocaleDateString("vi-VN")}
//               </Descriptions.Item>
//               <Descriptions.Item label="Thuế (%)">
//                 {selectedInvoice?.VatRate != null
//                   ? `${selectedInvoice.VatRate}%`
//                   : " "}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số lượng">
//                 {selectedInvoice.Qty}
//               </Descriptions.Item>
//               {purchase === true && (
//                 <>
//                   <Descriptions.Item label="Đơn giá">
//                     {selectedInvoice.UnitPrice?.toLocaleString()}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Giá chưa VAT">
//                     {selectedInvoice.TotalAmount?.toLocaleString()}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="VAT">
//                     {selectedInvoice.Vat?.toLocaleString()}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Tổng cộng">
//                     {selectedInvoice.AmountSupplier?.toLocaleString()}
//                   </Descriptions.Item>
//                 </>
//               )}
//               <Descriptions.Item label="Nhà cung cấp" span={2}>
//                 {selectedInvoice.NameNCC}
//               </Descriptions.Item>
//               <Descriptions.Item label="SerialNumber" span={2}>
//                 <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
//                   {selectedInvoice.SerialNumber}
//                 </div>
//               </Descriptions.Item>
//               <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
//                 {selectedInvoice.ShippingAddress}
//               </Descriptions.Item>
//               <Descriptions.Item label="Ghi chú" span={2}>
//                 {selectedInvoice.Note}
//               </Descriptions.Item>
//             </Descriptions>

//             {/* Các nút thao tác */}
//             <div
//               style={{
//                 marginTop: 16,
//                 display: "flex",
//                 gap: 10,
//                 flexWrap: "wrap",
//               }}
//             >
//               {(userName === selectedInvoice.NameCreate || // Sửa: bỏ .attributes
//                 admin === true) && (
//                   <>
//                     <Button
//                       type="primary"
//                       icon={<EditOutlined />}
//                       onClick={() => setUpdateModalVisible(true)}
//                     >
//                       Cập nhật
//                     </Button>

//                     {selectedInvoice.Status !== "Đã nhận hàng" &&
//                       selectedInvoice.Status !== "Trả NCC" &&
//                       (selectedInvoice.Type === "Vật tư" ||
//                         selectedInvoice.SerialNumber) && (
//                         <Button
//                           icon={<CheckOutlined />}
//                           onClick={() => showConfirmDialog(selectedInvoice)}
//                         >
//                           Xác nhận
//                         </Button>
//                       )}

//                     {selectedInvoice.Status !== "Đã nhận hàng" &&
//                       selectedInvoice.Status !== "Trả NCC" && (
//                         <Button
//                           danger
//                           icon={<CloseOutlined />}
//                           onClick={() => showDeleteDialog(selectedInvoice)}
//                         >
//                           Hủy phiếu
//                         </Button>
//                       )}
//                     {selectedInvoice.Status === "Đã nhận hàng" && (
//                       <Button
//                         danger
//                         icon={<WarningTwoTone />}
//                         onClick={() => showReturnDialogSP(selectedInvoice)}
//                       >
//                         Trả NCC
//                       </Button>
//                     )}

//                     {selectedInvoice.InvoiceDate &&
//                       selectedInvoice.Status === "Đã nhận hàng" &&
//                       !selectedInvoice.isProductSent &&
//                       (selectedInvoice.Type === "Vật tư" ||
//                         selectedInvoice.SerialNumber) && (
//                         <Button
//                           icon={<InboxOutlined />}
//                           onClick={() => showProductDialog(selectedInvoice)}
//                         >
//                           Gửi sản phẩm
//                         </Button>
//                       )}
//                   </>
//                 )}
//             </div>
//           </>
//         )}
//       </Modal>

//       {/* Modal tạo phiếu */}
//       <CreatePurchaseOrderModal
//         visible={createModalVisible}
//         onCancel={() => setCreateModalVisible(false)}
//         onCreate={() => {
//           setCreateModalVisible(false);
//           loadInvoices();
//         }}
//       />

//       {/* Modal cập nhật phiếu */}
//       <UpdatePurchaseOrderModal
//         open={updateModalVisible}
//         onClose={() => setUpdateModalVisible(false)}
//         invoice={selectedInvoice}
//         onUpdateSuccess={() => {
//           setUpdateModalVisible(false);
//           loadInvoices();
//           setIsDetailModalOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default PurchaseOrderList;


// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Tag,
//   Button,
//   Input,
//   Modal,
//   Descriptions,
//   message,
//   Form,
//   Select,
//   Row,
//   Col,
//   notification,
//   Space,
//   Card,
//   Tooltip,
//   Typography,
//   Statistic,
//   Divider,
// } from "antd";
// import {
//   SearchOutlined,
//   PlusOutlined,
//   EditOutlined,
//   CheckOutlined,
//   FileExcelOutlined,
//   ExclamationCircleOutlined,
//   CloseOutlined,
//   InboxOutlined,
//   WarningTwoTone,
//   SyncOutlined,
//   EyeOutlined,
//   FilterOutlined,
//   CheckCircleTwoTone,
//   CloseCircleTwoTone,
//   ClockCircleTwoTone,
//   CarTwoTone,
// } from "@ant-design/icons";
// import * as XLSX from "xlsx";
// import {
//   fetchListPurchaseOder,
//   updateSupplierForm,
//   sendSupplierDetail,
// } from "../../../services/dhgServices";
// import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";
// import UpdatePurchaseOrderModal from "./UpdatePurchaseOrderModal";
// import "./PurchaseOrderList.scss";

// const { confirm } = Modal;
// const { Option } = Select;
// const { Title, Text } = Typography;

// const PurchaseOrderList = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [createModalVisible, setCreateModalVisible] = useState(false);
//   const [updateModalVisible, setUpdateModalVisible] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [purchase, setPurchase] = useState("");
//   const [admin, setAdmin] = useState("");
//   const [form] = Form.useForm();
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

//   // --- 1. CONFIG & UTILS ---

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserName(parsedUser?.account?.Name || "");
//         setPurchase(parsedUser?.account?.Purchase || "");
//         setAdmin(parsedUser?.account?.Admin || "");
//       } catch {
//         // ignore error
//       }
//     }
//     loadInvoices();
//   }, []);

//   const loadInvoices = async () => {
//     setLoading(true);
//     try {
//       const invoicesData = await fetchListPurchaseOder();
//       const data = Array.isArray(invoicesData) ? invoicesData : invoicesData.data || [];

//       const sortedData = data.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setInvoices(sortedData);
//       setFilteredInvoices(sortedData);
//     } catch (error) {
//       message.error("Lỗi tải danh sách phiếu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusCount = (status) =>
//     filteredInvoices.filter((inv) => inv.Status === status).length;

//   const statusSummaryList = [
//     {
//       key: "Chưa nhận hàng",
//       label: "Chưa nhận",
//       color: "#1890ff",
//       icon: <ClockCircleTwoTone twoToneColor="#1890ff" />,
//     },
//     {
//       key: "Đã nhận hàng",
//       label: "Đã nhận",
//       color: "#52c41a",
//       icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
//     },
//     {
//       key: "Hủy phiếu",
//       label: "Đã hủy",
//       color: "#ff4d4f",
//       icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" />,
//     },
//     {
//       key: "Trả NCC",
//       label: "Trả NCC",
//       color: "#fa8c16",
//       icon: <CarTwoTone twoToneColor="#fa8c16" />,
//     },
//   ];

//   // --- 2. HANDLERS ---

//   const onFinish = (values) => {
//     let filtered = [...invoices];
//     if (values.status) {
//       filtered = filtered.filter((inv) => inv.Status === values.status);
//     }
//     if (values.customer) {
//       filtered = filtered.filter((inv) => inv.Customer === values.customer);
//     }
//     if (values.purchuser) {
//       filtered = filtered.filter((inv) => inv.Purchuser === values.purchuser);
//     }
//     if (values.searchText) {
//       const search = values.searchText.toLowerCase();
//       filtered = filtered.filter(
//         (inv) =>
//           inv.Model?.toLowerCase().includes(search) ||
//           inv.ProductName?.toLowerCase().includes(search) ||
//           inv.Ticket?.toLowerCase().includes(search)
//       );
//     }
//     setFilteredInvoices(filtered);
//     setSelectedInvoice(null);
//   };

//   const onReset = () => {
//     form.resetFields();
//     setFilteredInvoices(invoices);
//     setSelectedInvoice(null);
//   };

//   const handleExportExcel = () => {
//     if (filteredInvoices.length === 0) {
//       message.warning("Không có dữ liệu để xuất");
//       return;
//     }
//     const ws = XLSX.utils.json_to_sheet(
//       filteredInvoices.map((invoice) => ({
//         "Số phiếu": invoice.Ticket,
//         "Nhà cung cấp": invoice.NameNCC,
//         "Sản phẩm": invoice.ProductName,
//         Model: invoice.Model,
//         "Ngày nhập": invoice.Date,
//         "Số lượng": invoice.Qty,
//         "Tổng tiền": invoice.TotalAmount,
//         "Trạng thái": invoice.Status,
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Invoices");
//     XLSX.writeFile(wb, "Danh_Sach_Phieu_Nhap.xlsx");
//   };

//   const handleConfirmInvoice = async (invoice) => {
//     try {
//       await updateSupplierForm(invoice.id || invoice.documentId, {
//         Status: "Đã nhận hàng",
//       });
//       message.success(`Xác nhận phiếu ${invoice.Ticket} thành công`);
//       loadInvoices();
//       setIsDetailModalOpen(false);
//     } catch {
//       message.error("Xác nhận thất bại");
//     }
//   };

//   const handleDeleteInvoice = async (invoice) => {
//     try {
//       await updateSupplierForm(invoice.id || invoice.documentId, {
//         Status: "Hủy phiếu",
//       });
//       message.success(`Hủy phiếu ${invoice.Ticket} thành công`);
//       loadInvoices();
//       setIsDetailModalOpen(false);
//     } catch {
//       message.error("Hủy phiếu thất bại");
//     }
//   };

//   const handleReturnInvoiceSP = async (invoice) => {
//     try {
//       await updateSupplierForm(invoice.id || invoice.documentId, {
//         Status: "Trả NCC",
//       });
//       message.success(`Trả nhà cung cấp ${invoice.Ticket} thành công`);
//       loadInvoices();
//       setIsDetailModalOpen(false);
//     } catch {
//       message.error("Trả nhà cung cấp thất bại");
//     }
//   };

//   const handleSendProductData = async (invoice) => {
//     if (invoice.isProductSent) {
//       notification.warning({
//         message: "Sản phẩm đã gửi",
//         description: "Sản phẩm này đã được gửi trước đó.",
//       });
//       return;
//     }
//     try {
//       const dataToSend = {
//         data: {
//           ProductName: invoice.ProductName,
//           Model: invoice.Model,
//           BrandName: invoice.BrandName,
//           Type: invoice.Type,
//           SerialNumber: invoice.SerialNumber,
//           InvoiceDate: invoice.InvoiceDate,
//           Ticket: invoice.Ticket,
//           Status: "Chờ nhập kho",
//           Qty: invoice.Qty,
//           DVT: invoice.DVT,
//         },
//       };
//       await sendSupplierDetail(dataToSend);
//       await updateSupplierForm(invoice.id || invoice.documentId, {
//         isProductSent: true,
//       });
//       message.success("Gửi dữ liệu vào chi tiết thành công");
//       loadInvoices();
//     } catch {
//       notification.error({ message: "Gửi dữ liệu thất bại" });
//     }
//   };

//   const showConfirmDialog = (invoice) => {
//     confirm({
//       title: "Xác nhận đã nhận hàng?",
//       icon: <CheckOutlined style={{ color: "green" }} />,
//       content: `Bạn có chắc chắn muốn xác nhận phiếu ${invoice.Ticket} là "Đã nhận hàng"?`,
//       okText: "Đồng ý",
//       cancelText: "Hủy",
//       onOk: () => handleConfirmInvoice(invoice),
//     });
//   };

//   const showDeleteDialog = (invoice) => {
//     confirm({
//       title: "Hủy phiếu này?",
//       icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
//       content: `Thao tác này sẽ chuyển trạng thái phiếu ${invoice.Ticket} sang "Hủy phiếu".`,
//       okText: "Hủy phiếu",
//       okType: "danger",
//       cancelText: "Thoát",
//       onOk: () => handleDeleteInvoice(invoice),
//     });
//   };

//   const showReturnDialogSP = (invoice) => {
//     confirm({
//       title: "Trả hàng cho NCC?",
//       icon: <WarningTwoTone twoToneColor="#fa8c16" />,
//       content: `Bạn muốn trả sản phẩm phiếu ${invoice.Ticket} lại cho Nhà Cung Cấp?`,
//       okText: "Đồng ý trả",
//       cancelText: "Thoát",
//       onOk: () => handleReturnInvoiceSP(invoice),
//     });
//   };

//   const showProductDialog = (invoice) => {
//     confirm({
//       title: "Đồng bộ dữ liệu?",
//       icon: <InboxOutlined style={{ color: "#1890ff" }} />,
//       content: "Gửi thông tin sản phẩm này vào danh sách chi tiết kho?",
//       okText: "Gửi ngay",
//       cancelText: "Thoát",
//       onOk: () => handleSendProductData(invoice),
//     });
//   };

//   // --- 3. TABLE CONFIG ---
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

//   const columns = [
//     {
//       title: "STT",
//       align: "center",
//       render: (_, __, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//       width: 50,
//     },
//     {
//       title: "Số phiếu",
//       dataIndex: "Ticket",
//       width: 130,
//       render: (text) => <b style={{ color: "#1890ff" }}>{text}</b>,
//     },
//     {
//       title: "Sản phẩm / Model",
//       dataIndex: "ProductName",
//       width: 250,
//       render: (text, record) => (
//         <div>
//           <div style={{ fontWeight: 500 }}>{text}</div>
//           <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.Model}</div>
//         </div>
//       ),
//     },
//     {
//       title: "Người đề nghị",
//       dataIndex: "Purchuser",
//       width: 150,
//     },
//     {
//       title: "Ngày tạo",
//       dataIndex: "createdAt",
//       width: 110,
//       align: "center",
//       render: (date) =>
//         date ? new Date(date).toLocaleDateString("vi-VN") : "",
//     },
//     {
//       title: "SL",
//       dataIndex: "Qty",
//       align: "center",
//       width: 60,
//       render: (val) => <b>{val}</b>,
//     },
//     ...(purchase === true
//       ? [
//         {
//           title: "Tổng tiền",
//           dataIndex: "AmountSupplier",
//           align: "right",
//           width: 130,
//           render: (value) => (
//             <span style={{ color: "#fa541c", fontWeight: 600 }}>
//               {value != null ? value.toLocaleString() : "0"}
//             </span>
//           ),
//         },
//       ]
//       : []),
//     {
//       title: "Trạng thái",
//       dataIndex: "Status",
//       align: "center",
//       width: 140,
//       render: (status) => {
//         let color = "default";
//         if (status === "Đã nhận hàng") color = "green";
//         else if (status === "Hủy phiếu") color = "red";
//         else if (status === "Chưa nhận hàng") color = "processing";
//         else if (status === "Trả NCC") color = "orange";
//         return (
//           <Tag color={color} style={{ minWidth: 100, textAlign: "center" }}>
//             {status}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "",
//       width: 50,
//       fixed: "right",
//       render: (_, record) => (
//         <Tooltip title="Xem chi tiết">
//           <Button
//             type="text"
//             icon={<EyeOutlined style={{ color: "#1890ff" }} />}
//             onClick={() => {
//               setSelectedInvoice(record);
//               setIsDetailModalOpen(true);
//             }}
//           />
//         </Tooltip>
//       ),
//     },
//   ];

//   return (
//     <div className="purchase-order-list-container">
//       {/* --- HEADER CARD: TITLE & STATS --- */}
//       <Card bordered={false} className="header-card shadow-sm">
//         <Row justify="space-between" align="middle" gutter={[16, 16]}>
//           {/* Left: Title */}
//           <Col xs={24} md={6} lg={6}>
//             <Title level={4} style={{ margin: 0, color: "#001529" }}>
//               Quản Lý Phiếu Nhập
//             </Title>
//             <Text type="secondary">Theo dõi trạng thái và tồn kho</Text>
//           </Col>

//           {/* Right: Statistics & Action Button */}
//           <Col xs={24} md={18} lg={18}>
//             <Space
//               size="large"
//               wrap
//               style={{ display: "flex", justifyContent: "flex-end", alignItems: 'center' }}
//             >
//               {statusSummaryList.map((s) => (
//                 <Statistic
//                   key={s.key}
//                   title={
//                     <span style={{ fontSize: 13, color: "#8c8c8c" }}>
//                       {s.icon} <span style={{ marginLeft: 4 }}>{s.label}</span>
//                     </span>
//                   }
//                   value={getStatusCount(s.key)}
//                   valueStyle={{
//                     color: s.color,
//                     fontSize: "20px",
//                     fontWeight: "bold",
//                   }}
//                 />
//               ))}

//               <Divider
//                 type="vertical"
//                 style={{ height: "32px", backgroundColor: "#d9d9d9" }}
//               />

//               <Statistic
//                 title={
//                   <span style={{ fontSize: 13, fontWeight: 600 }}>
//                     TỔNG PHIẾU
//                   </span>
//                 }
//                 value={filteredInvoices.length}
//                 valueStyle={{
//                   fontSize: "20px",
//                   fontWeight: "bold",
//                   color: "#262626",
//                 }}
//               />

//               {/* Nút Tạo Phiếu Mới nằm tại đây */}
//               {purchase === true && (
//                 <div style={{ marginLeft: 16 }}>
//                   <Button
//                     type="primary"
//                     icon={<PlusOutlined />}
//                     onClick={() => setCreateModalVisible(true)}
//                     style={{ borderRadius: 6, height: 40 }}
//                   >
//                     Tạo phiếu mới
//                   </Button>
//                 </div>
//               )}
//             </Space>
//           </Col>
//         </Row>
//       </Card>

//       {/* --- MAIN CARD: FILTER & TABLE --- */}
//       <div className="main-card">
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           className="filter-section"
//         >
//           <Row gutter={16} align="bottom">
//             <Col xs={24} sm={12} md={6} lg={5}>
//               <Form.Item name="searchText" label="Tìm kiếm">
//                 <Input
//                   prefix={<SearchOutlined />}
//                   placeholder="Model, Tên SP..."
//                   allowClear
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={6} lg={4}>
//               <Form.Item name="status" label="Trạng thái">
//                 <Select placeholder="Tất cả" allowClear>
//                   {[...new Set(invoices.map((inv) => inv.Status))].map((s) => (
//                     <Option key={s} value={s}>
//                       {s}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={6} lg={4}>
//               <Form.Item name="customer" label="Khách hàng">
//                 <Select
//                   placeholder="Chọn khách"
//                   showSearch
//                   allowClear
//                   optionFilterProp="children"
//                 >
//                   {[...new Set(invoices.map((inv) => inv.Customer))].map(
//                     (c) => (
//                       <Option key={c} value={c}>
//                         {c}
//                       </Option>
//                     )
//                   )}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={6} lg={4}>
//               <Form.Item name="purchuser" label="Người đề nghị">
//                 <Select placeholder="Chọn người" allowClear>
//                   {[...new Set(invoices.map((inv) => inv.Purchuser))].map(
//                     (u) => (
//                       <Option key={u} value={u}>
//                         {u}
//                       </Option>
//                     )
//                   )}
//                 </Select>
//               </Form.Item>
//             </Col>

//             {/* SỬA LỖI: Điều chỉnh marginBottom về 16px để khớp với các Form.Item bên cạnh */}
//             <Col xs={24} lg={7} style={{ marginBottom: 12 }}>
//               <Space>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   icon={<FilterOutlined />}
//                 >
//                   Lọc
//                 </Button>
//                 <Button icon={<SyncOutlined />} onClick={onReset}>
//                   Reset
//                 </Button>
//                 {purchase === true && (
//                   <Button
//                     className="btn-export"
//                     icon={<FileExcelOutlined />}
//                     onClick={handleExportExcel}
//                   >
//                     Xuất Excel
//                   </Button>
//                 )}
//               </Space>
//             </Col>
//           </Row>
//         </Form>
//         <Table
//           rowKey="id"
//           loading={loading}
//           columns={columns}
//           dataSource={filteredInvoices}
//           scroll={{ x: 1100 }}
//           pagination={{
//             ...pagination,
//             total: filteredInvoices.length,
//             showTotal: (total) => `Tổng ${total} bản ghi`,
//             onChange: (current, pageSize) =>
//               setPagination({ current, pageSize }),
//           }}
//           onRow={(record) => ({
//             onClick: () => {
//               setSelectedInvoice(record);
//               setIsDetailModalOpen(true);
//             },
//             style: { cursor: "pointer" },
//           })}
//         />
//       </div>

//       {/* --- MODALS --- */}
//       <Modal
//         title={
//           <span style={{ fontSize: 18 }}>
//             Thông tin phiếu:{" "}
//             <b style={{ color: "#1890ff" }}>{selectedInvoice?.Ticket}</b>
//           </span>
//         }
//         open={isDetailModalOpen}
//         onCancel={() => setIsDetailModalOpen(false)}
//         footer={null}
//         width={750}
//         centered
//       >
//         {selectedInvoice && (
//           <>
//             <Descriptions
//               bordered
//               column={2}
//               size="small"
//               labelStyle={{ fontWeight: 600, width: 140 }}
//             >
//               <Descriptions.Item label="Trạng thái">
//                 <Tag
//                   color={
//                     selectedInvoice.Status === "Đã nhận hàng"
//                       ? "green"
//                       : selectedInvoice.Status === "Hủy phiếu"
//                         ? "red"
//                         : selectedInvoice.Status === "Trả NCC"
//                           ? "orange"
//                           : "blue"
//                   }
//                 >
//                   {selectedInvoice.Status}
//                 </Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label="Người tạo">
//                 {selectedInvoice.NameCreate}
//               </Descriptions.Item>
//               <Descriptions.Item label="Khách hàng">
//                 {selectedInvoice.Customer}
//               </Descriptions.Item>
//               <Descriptions.Item label="Người đề nghị">
//                 {selectedInvoice.Purchuser}
//               </Descriptions.Item>

//               <Descriptions.Item label="Sản phẩm" span={2}>
//                 <b>{selectedInvoice.ProductName}</b>
//               </Descriptions.Item>
//               <Descriptions.Item label="Model">
//                 {selectedInvoice.Model}
//               </Descriptions.Item>
//               <Descriptions.Item label="Thương hiệu">
//                 {selectedInvoice.BrandName}
//               </Descriptions.Item>

//               <Descriptions.Item label="Serial Number" span={2}>
//                 <div
//                   style={{
//                     wordBreak: "break-all",
//                     fontFamily: "monospace",
//                     background: "#f5f5f5",
//                     padding: "4px 8px",
//                     borderRadius: 4,
//                   }}
//                 >
//                   {selectedInvoice.SerialNumber || "N/A"}
//                 </div>
//               </Descriptions.Item>

//               <Descriptions.Item label="Số lượng">
//                 {selectedInvoice.Qty}
//               </Descriptions.Item>
//               <Descriptions.Item label="ĐVT">
//                 {selectedInvoice.DVT || "--"}
//               </Descriptions.Item>

//               {purchase === true && (
//                 <>
//                   <Descriptions.Item label="Đơn giá">
//                     {selectedInvoice.UnitPrice?.toLocaleString()}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Tổng tiền">
//                     {selectedInvoice.AmountSupplier?.toLocaleString()}
//                   </Descriptions.Item>
//                 </>
//               )}

//               <Descriptions.Item label="Ghi chú" span={2}>
//                 {selectedInvoice.Note || "Không có ghi chú"}
//               </Descriptions.Item>
//             </Descriptions>

//             <div
//               style={{
//                 marginTop: 20,
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 10,
//                 flexWrap: "wrap",
//                 borderTop: "1px solid #f0f0f0",
//                 paddingTop: 15,
//               }}
//             >
//               {(userName === selectedInvoice.NameCreate || admin === true) && (
//                 <>
//                   <Button
//                     icon={<EditOutlined />}
//                     onClick={() => setUpdateModalVisible(true)}
//                   >
//                     Cập nhật
//                   </Button>

//                   {selectedInvoice.Status !== "Đã nhận hàng" &&
//                     selectedInvoice.Status !== "Trả NCC" &&
//                     selectedInvoice.Status !== "Hủy phiếu" && (
//                       <Button
//                         type="primary"
//                         icon={<CheckOutlined />}
//                         onClick={() => showConfirmDialog(selectedInvoice)}
//                       >
//                         Xác nhận
//                       </Button>
//                     )}

//                   {selectedInvoice.Status === "Đã nhận hàng" &&
//                     !selectedInvoice.isProductSent && (
//                       <Button
//                         type="primary"
//                         style={{ background: "#722ed1", borderColor: "#722ed1" }}
//                         icon={<InboxOutlined />}
//                         onClick={() => showProductDialog(selectedInvoice)}
//                       >
//                         Đồng bộ kho
//                       </Button>
//                     )}

//                   {selectedInvoice.Status === "Đã nhận hàng" && (
//                     <Button
//                       danger
//                       icon={<WarningTwoTone twoToneColor="#f5222d" />}
//                       onClick={() => showReturnDialogSP(selectedInvoice)}
//                     >
//                       Trả NCC
//                     </Button>
//                   )}

//                   {selectedInvoice.Status !== "Đã nhận hàng" &&
//                     selectedInvoice.Status !== "Trả NCC" &&
//                     selectedInvoice.Status !== "Hủy phiếu" && (
//                       <Button
//                         danger
//                         type="dashed"
//                         icon={<CloseOutlined />}
//                         onClick={() => showDeleteDialog(selectedInvoice)}
//                       >
//                         Hủy phiếu
//                       </Button>
//                     )}
//                 </>
//               )}
//               <Button onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
//             </div>
//           </>
//         )}
//       </Modal>

//       <CreatePurchaseOrderModal
//         visible={createModalVisible}
//         onCancel={() => setCreateModalVisible(false)}
//         onCreate={() => {
//           setCreateModalVisible(false);
//           loadInvoices();
//         }}
//       />

//       <UpdatePurchaseOrderModal
//         open={updateModalVisible}
//         onClose={() => setUpdateModalVisible(false)}
//         invoice={selectedInvoice}
//         onUpdateSuccess={() => {
//           setUpdateModalVisible(false);
//           loadInvoices();
//           setIsDetailModalOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default PurchaseOrderList;

import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Modal,
  Descriptions,
  message,
  Form,
  Select,
  Row,
  Col,
  notification,
  Space,
  Card,
  Tooltip,
  Typography,
  Statistic,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  FileExcelOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  InboxOutlined,
  WarningTwoTone,
  SyncOutlined,
  EyeOutlined,
  FilterOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ClockCircleTwoTone,
  CarTwoTone,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  fetchListPurchaseOder,
  updateSupplierForm,
  sendSupplierDetail,
} from "../../../services/dhgServices";
import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";
import UpdatePurchaseOrderModal from "./UpdatePurchaseOrderModal";
import "./PurchaseOrderList.scss";

const { confirm } = Modal;
const { Option } = Select;
const { Title, Text } = Typography;

const PurchaseOrderList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [purchase, setPurchase] = useState("");
  const [admin, setAdmin] = useState("");
  const [form] = Form.useForm();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // --- 1. CONFIG & UTILS ---

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.account?.Name || "");
        setPurchase(parsedUser?.account?.Purchase || "");
        setAdmin(parsedUser?.account?.Admin || "");
      } catch {
        // ignore error
      }
    }
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const invoicesData = await fetchListPurchaseOder();
      const data = Array.isArray(invoicesData) ? invoicesData : invoicesData.data || [];

      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setInvoices(sortedData);
      setFilteredInvoices(sortedData);
    } catch (error) {
      message.error("Lỗi tải danh sách phiếu");
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status) =>
    filteredInvoices.filter((inv) => inv.Status === status).length;

  const statusSummaryList = [
    {
      key: "Chưa nhận hàng",
      label: "Chưa nhận",
      color: "#1890ff",
      icon: <ClockCircleTwoTone twoToneColor="#1890ff" />,
    },
    {
      key: "Đã nhận hàng",
      label: "Đã nhận",
      color: "#52c41a",
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
    },
    {
      key: "Hủy phiếu",
      label: "Đã hủy",
      color: "#ff4d4f",
      icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" />,
    },
    {
      key: "Trả NCC",
      label: "Trả NCC",
      color: "#fa8c16",
      icon: <CarTwoTone twoToneColor="#fa8c16" />,
    },
  ];

  // --- 2. HANDLERS ---

  const onFinish = (values) => {
    let filtered = [...invoices];
    if (values.status) {
      filtered = filtered.filter((inv) => inv.Status === values.status);
    }
    if (values.customer) {
      filtered = filtered.filter((inv) => inv.Customer === values.customer);
    }
    if (values.storeID) {
      filtered = filtered.filter((inv) => inv.StoreID === values.storeID);
    }
    if (values.purchuser) {
      filtered = filtered.filter((inv) => inv.Purchuser === values.purchuser);
    }
    if (values.searchText) {
      const search = values.searchText.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.Model?.toLowerCase().includes(search) ||
          inv.ProductName?.toLowerCase().includes(search) ||
          inv.Ticket?.toLowerCase().includes(search)
      );
    }
    setFilteredInvoices(filtered);
    setSelectedInvoice(null);
  };

  const onReset = () => {
    form.resetFields();
    setFilteredInvoices(invoices);
    setSelectedInvoice(null);
  };

  const handleExportExcel = () => {
    if (filteredInvoices.length === 0) {
      message.warning("Không có dữ liệu để xuất");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      filteredInvoices.map((invoice) => ({
        "Số phiếu": invoice.Ticket,
        "Nhà cung cấp": invoice.NameNCC,
        "Sản phẩm": invoice.ProductName,
        Model: invoice.Model,
        "Ngày nhập": invoice.Date, // Lưu ý: kiểm tra lại trường Date trong API
        "Số lượng": invoice.Qty,
        "Tổng tiền": invoice.TotalAmount,
        "Trạng thái": invoice.Status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, "Danh_Sach_Phieu_Nhap.xlsx");
  };

  const handleConfirmInvoice = async (invoice) => {
    try {
      await updateSupplierForm(invoice.id || invoice.documentId, {
        Status: "Đã nhận hàng",
      });
      message.success(`Xác nhận phiếu ${invoice.Ticket} thành công`);
      loadInvoices();
      setIsDetailModalOpen(false);
    } catch {
      message.error("Xác nhận thất bại");
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    try {
      await updateSupplierForm(invoice.id || invoice.documentId, {
        Status: "Hủy phiếu",
      });
      message.success(`Hủy phiếu ${invoice.Ticket} thành công`);
      loadInvoices();
      setIsDetailModalOpen(false);
    } catch {
      message.error("Hủy phiếu thất bại");
    }
  };

  const handleReturnInvoiceSP = async (invoice) => {
    try {
      await updateSupplierForm(invoice.id || invoice.documentId, {
        Status: "Trả NCC",
      });
      message.success(`Trả nhà cung cấp ${invoice.Ticket} thành công`);
      loadInvoices();
      setIsDetailModalOpen(false);
    } catch {
      message.error("Trả nhà cung cấp thất bại");
    }
  };

  const handleSendProductData = async (invoice) => {
    if (invoice.isProductSent) {
      notification.warning({
        message: "Sản phẩm đã gửi",
        description: "Sản phẩm này đã được gửi trước đó.",
      });
      return;
    }
    try {
      const dataToSend = {
        data: {
          ProductName: invoice.ProductName,
          Model: invoice.Model,
          BrandName: invoice.BrandName,
          Type: invoice.Type,
          SerialNumber: invoice.SerialNumber,
          InvoiceDate: invoice.InvoiceDate,
          Ticket: invoice.Ticket,
          Status: "Chờ nhập kho",
          Qty: invoice.Qty,
          DVT: invoice.DVT,
        },
      };
      await sendSupplierDetail(dataToSend);
      await updateSupplierForm(invoice.id || invoice.documentId, {
        isProductSent: true,
      });
      message.success("Gửi dữ liệu vào chi tiết thành công");
      loadInvoices();
    } catch {
      notification.error({ message: "Gửi dữ liệu thất bại" });
    }
  };

  const showConfirmDialog = (invoice) => {
    confirm({
      title: "Xác nhận đã nhận hàng?",
      icon: <CheckOutlined style={{ color: "green" }} />,
      content: `Bạn có chắc chắn muốn xác nhận phiếu ${invoice.Ticket} là "Đã nhận hàng"?`,
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => handleConfirmInvoice(invoice),
    });
  };

  const showDeleteDialog = (invoice) => {
    confirm({
      title: "Hủy phiếu này?",
      icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
      content: `Thao tác này sẽ chuyển trạng thái phiếu ${invoice.Ticket} sang "Hủy phiếu".`,
      okText: "Hủy phiếu",
      okType: "danger",
      cancelText: "Thoát",
      onOk: () => handleDeleteInvoice(invoice),
    });
  };

  const showReturnDialogSP = (invoice) => {
    confirm({
      title: "Trả hàng cho NCC?",
      icon: <WarningTwoTone twoToneColor="#fa8c16" />,
      content: `Bạn muốn trả sản phẩm phiếu ${invoice.Ticket} lại cho Nhà Cung Cấp?`,
      okText: "Đồng ý trả",
      cancelText: "Thoát",
      onOk: () => handleReturnInvoiceSP(invoice),
    });
  };

  const showProductDialog = (invoice) => {
    confirm({
      title: "Đồng bộ dữ liệu?",
      icon: <InboxOutlined style={{ color: "#1890ff" }} />,
      content: "Gửi thông tin sản phẩm này vào danh sách chi tiết kho?",
      okText: "Gửi ngay",
      cancelText: "Thoát",
      onOk: () => handleSendProductData(invoice),
    });
  };

  // --- 3. TABLE CONFIG ---
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns = [
    {
      title: "STT",
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 50,
    },
    {
      title: "Số phiếu",
      dataIndex: "Ticket",
      width: 130,
      render: (text) => <b style={{ color: "#1890ff" }}>{text}</b>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "ProductName",
      width: 200,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Model",
      dataIndex: "Model",
      width: 150,
      render: (text) => <span style={{ color: "#595959" }}>{text}</span>,
    },
    {
      title: "Người đề nghị",
      dataIndex: "Purchuser",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 110,
      align: "center",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "SL",
      dataIndex: "Qty",
      align: "center",
      width: 60,
      render: (val) => <b>{val}</b>,
    },
    ...(purchase === true
      ? [
        {
          title: "Tổng tiền",
          dataIndex: "AmountSupplier",
          align: "right",
          width: 130,
          render: (value) => (
            <span style={{ color: "#fa541c", fontWeight: 600 }}>
              {value != null ? value.toLocaleString() : "0"}
            </span>
          ),
        },
      ]
      : []),
    {
      title: "Trạng thái",
      dataIndex: "Status",
      align: "center",
      width: 140,
      render: (status) => {
        let color = "default";
        if (status === "Đã nhận hàng") color = "green";
        else if (status === "Hủy phiếu") color = "red";
        else if (status === "Chưa nhận hàng") color = "processing";
        else if (status === "Trả NCC") color = "orange";
        return (
          <Tag color={color} style={{ minWidth: 100, textAlign: "center" }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "",
      width: 50,
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#1890ff" }} />}
            onClick={() => {
              setSelectedInvoice(record);
              setIsDetailModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="purchase-order-list-container">
      {/* --- HEADER CARD: TITLE & STATS --- */}
      <Card bordered={false} className="header-card shadow-sm">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          {/* Left: Title */}
          <Col xs={24} md={6} lg={6}>
            <Title level={4} style={{ margin: 0, color: "#001529" }}>
              Quản Lý Phiếu Nhập
            </Title>
            <Text type="secondary">Theo dõi trạng thái và tồn kho</Text>
          </Col>

          {/* Right: Statistics & Action Button */}
          <Col xs={24} md={18} lg={18}>
            <Space
              size="large"
              wrap
              style={{ display: "flex", justifyContent: "flex-end", alignItems: 'center' }}
            >
              {statusSummaryList.map((s) => (
                <Statistic
                  key={s.key}
                  title={
                    <span style={{ fontSize: 13, color: "#8c8c8c" }}>
                      {s.icon} <span style={{ marginLeft: 4 }}>{s.label}</span>
                    </span>
                  }
                  value={getStatusCount(s.key)}
                  valueStyle={{
                    color: s.color,
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                />
              ))}

              <Divider
                type="vertical"
                style={{ height: "32px", backgroundColor: "#d9d9d9" }}
              />

              <Statistic
                title={
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    TỔNG PHIẾU
                  </span>
                }
                value={filteredInvoices.length}
                valueStyle={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#262626",
                }}
              />

              {/* Nút Tạo Phiếu Mới nằm tại đây */}
              {purchase === true && (
                <div style={{ marginLeft: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateModalVisible(true)}
                    style={{ borderRadius: 6, height: 40 }}
                  >
                    Tạo phiếu mới
                  </Button>
                </div>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* --- MAIN CARD: FILTER & TABLE --- */}
      <div className="main-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="filter-section"
        >
          <Row gutter={16} align="bottom">
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="searchText" label="Tìm kiếm">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Model, Tên SP..."
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Tất cả" allowClear>
                  {[...new Set(invoices.map((inv) => inv.Status))].map((s) => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="customer" label="Khách hàng">
                <Select
                  placeholder="Chọn khách"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                >
                  {[...new Set(invoices.map((inv) => inv.Customer))].map(
                    (c) => (
                      <Option key={c} value={c}>
                        {c}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
            {/* Thêm lại bộ lọc StoreID */}
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="storeID" label="StoreID">
                <Select
                  placeholder="Chọn StoreID"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                >
                  {[...new Set(invoices.map((inv) => inv.StoreID))].map(
                    (s) => (
                      <Option key={s} value={s}>
                        {s}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="purchuser" label="Người đề nghị">
                <Select placeholder="Chọn người" allowClear>
                  {[...new Set(invoices.map((inv) => inv.Purchuser))].map(
                    (u) => (
                      <Option key={u} value={u}>
                        {u}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} lg={4} style={{ marginBottom: 12 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<FilterOutlined />}
                >
                  Lọc
                </Button>
                <Button icon={<SyncOutlined />} onClick={onReset}>
                  Reset
                </Button>
                {purchase === true && (
                  <Button
                    className="btn-export"
                    icon={<FileExcelOutlined />}
                    onClick={handleExportExcel}
                  >
                    Excel
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filteredInvoices}
          scroll={{ x: 1200 }}
          pagination={{
            ...pagination,
            total: filteredInvoices.length,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            onChange: (current, pageSize) =>
              setPagination({ current, pageSize }),
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedInvoice(record);
              setIsDetailModalOpen(true);
            },
            style: { cursor: "pointer" },
          })}
        />
      </div>

      {/* --- MODALS --- */}
      <Modal
        title={
          <span style={{ fontSize: 18 }}>
            Thông tin phiếu:{" "}
            <b style={{ color: "#1890ff" }}>{selectedInvoice?.Ticket}</b>
          </span>
        }
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={750}
        centered
      >
        {selectedInvoice && (
          <>
            <Descriptions
              bordered
              column={2}
              size="small"
              labelStyle={{ fontWeight: 600, width: 140 }}
            >
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedInvoice.Status === "Đã nhận hàng"
                      ? "green"
                      : selectedInvoice.Status === "Hủy phiếu"
                        ? "red"
                        : selectedInvoice.Status === "Trả NCC"
                          ? "orange"
                          : "blue"
                  }
                >
                  {selectedInvoice.Status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">
                {selectedInvoice.NameCreate}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedInvoice.Customer}
              </Descriptions.Item>
              <Descriptions.Item label="Người đề nghị">
                {selectedInvoice.Purchuser}
              </Descriptions.Item>
              {/* Thêm lại StoreID */}
              <Descriptions.Item label="StoreID">
                {selectedInvoice.StoreID}
              </Descriptions.Item>

              <Descriptions.Item label="Sản phẩm" span={1}>
                <b>{selectedInvoice.ProductName}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Model">
                {selectedInvoice.Model}
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">
                {selectedInvoice.BrandName}
              </Descriptions.Item>
              {/* Thêm lại Loại sản phẩm */}
              <Descriptions.Item label="Loại sản phẩm">
                {selectedInvoice.Type}
              </Descriptions.Item>

              {/* Thêm lại Số/Ngày hóa đơn */}
              <Descriptions.Item label="Số hóa đơn">
                {selectedInvoice.InvoiceNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hóa đơn">
                {selectedInvoice.InvoiceDate
                  ? new Date(selectedInvoice.InvoiceDate).toLocaleDateString("vi-VN")
                  : ""}
              </Descriptions.Item>
              {/* Thêm lại Loại tiền */}
              <Descriptions.Item label="Loại tiền">
                {selectedInvoice.Currency}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày lập phiếu">
                {new Date(selectedInvoice.createdAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              {/* Thêm lại Thuế */}
              <Descriptions.Item label="Thuế (%)">
                {selectedInvoice?.VatRate != null
                  ? `${selectedInvoice.VatRate}%`
                  : " "}
              </Descriptions.Item>

              <Descriptions.Item label="Serial Number" span={2}>
                <div
                  style={{
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    background: "#f5f5f5",
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}
                >
                  {selectedInvoice.SerialNumber || "N/A"}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Số lượng">
                {selectedInvoice.Qty}
              </Descriptions.Item>
              <Descriptions.Item label="ĐVT">
                {selectedInvoice.DVT || "--"}
              </Descriptions.Item>

              {purchase === true && (
                <>
                  <Descriptions.Item label="Đơn giá">
                    {selectedInvoice.UnitPrice?.toLocaleString()}
                  </Descriptions.Item>
                  {/* Thêm lại Giá chưa VAT và VAT */}
                  <Descriptions.Item label="Giá chưa VAT">
                    {selectedInvoice.TotalAmount?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="VAT">
                    {selectedInvoice.Vat?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền">
                    {selectedInvoice.AmountSupplier?.toLocaleString()}
                  </Descriptions.Item>
                </>
              )}

              <Descriptions.Item label="Nhà cung cấp" span={2}>
                {selectedInvoice.NameNCC}
              </Descriptions.Item>
              {/* Thêm lại Địa chỉ nhận hàng */}
              <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
                {selectedInvoice.ShippingAddress}
              </Descriptions.Item>

              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedInvoice.Note || "Không có ghi chú"}
              </Descriptions.Item>
            </Descriptions>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexWrap: "wrap",
                borderTop: "1px solid #f0f0f0",
                paddingTop: 15,
              }}
            >
              {(userName === selectedInvoice.NameCreate || admin === true) && (
                <>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setUpdateModalVisible(true)}
                  >
                    Cập nhật
                  </Button>

                  {selectedInvoice.Status !== "Đã nhận hàng" &&
                    selectedInvoice.Status !== "Trả NCC" &&
                    selectedInvoice.Status !== "Hủy phiếu" && (
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => showConfirmDialog(selectedInvoice)}
                      >
                        Xác nhận
                      </Button>
                    )}

                  {selectedInvoice.Status === "Đã nhận hàng" &&
                    !selectedInvoice.isProductSent && (
                      <Button
                        type="primary"
                        style={{ background: "#722ed1", borderColor: "#722ed1" }}
                        icon={<InboxOutlined />}
                        onClick={() => showProductDialog(selectedInvoice)}
                      >
                        Đồng bộ kho
                      </Button>
                    )}

                  {selectedInvoice.Status === "Đã nhận hàng" && (
                    <Button
                      danger
                      icon={<WarningTwoTone twoToneColor="#f5222d" />}
                      onClick={() => showReturnDialogSP(selectedInvoice)}
                    >
                      Trả NCC
                    </Button>
                  )}

                  {selectedInvoice.Status !== "Đã nhận hàng" &&
                    selectedInvoice.Status !== "Trả NCC" &&
                    selectedInvoice.Status !== "Hủy phiếu" && (
                      <Button
                        danger
                        type="dashed"
                        icon={<CloseOutlined />}
                        onClick={() => showDeleteDialog(selectedInvoice)}
                      >
                        Hủy phiếu
                      </Button>
                    )}
                </>
              )}
              <Button onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
            </div>
          </>
        )}
      </Modal>

      <CreatePurchaseOrderModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onCreate={() => {
          setCreateModalVisible(false);
          loadInvoices();
        }}
      />

      <UpdatePurchaseOrderModal
        open={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        invoice={selectedInvoice}
        onUpdateSuccess={() => {
          setUpdateModalVisible(false);
          loadInvoices();
          setIsDetailModalOpen(false);
        }}
      />
    </div>
  );
};

export default PurchaseOrderList;
// import React, { useEffect, useState } from "react";
// import {
//   fetchExportlists,
//   fetchExportLoanTicket,
//   fetchExportLoanPOS,
//   fetchExportLoans,
// } from "../../../services/dhgServices";
// import {
//   Button,
//   Table,
//   message,
//   Row,
//   Col,
//   Tag,
//   Form,
//   Select,
//   Input,
//   DatePicker,
//   Modal,
//   Descriptions,
// } from "antd";
// import {
//   CheckCircleTwoTone,
//   ClockCircleTwoTone,
//   ExclamationCircleOutlined,
//   FileTextTwoTone,
//   CalculatorTwoTone,
//   WarningTwoTone,
//   CheckSquareTwoTone,
//   SearchOutlined,
//   InteractionTwoTone,
//   EditTwoTone,
//   ReconciliationTwoTone,
// } from "@ant-design/icons";
// import AddExportLoanPOS from "./AddExportLoanPOS";
// import TicketExportLoanModal from "./TicketExportLoanModal";
// import "./ExportLoanPOS.scss";
// import * as XLSX from "xlsx";

// const ExportLoanPOS = () => {
//   const [devices, setDevices] = useState([]);
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
//   const [ticketModal, setTicketModal] = useState({
//     selectedTicket: null,
//     isOpen: false,
//   });
//   const [filteredStatus, setFilteredStatus] = useState(null);
//   const [serialNumberOptions, setSerialNumberOptions] = useState([]);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [exportLoans, setExportLoans] = useState([]);

//   const [form] = Form.useForm();
//   const [filteredTickets, setFilteredTickets] = useState([]);
//   const [isFiltered, setIsFiltered] = useState(false);
//   const [detailModal, setDetailModal] = useState({
//     isOpen: false,
//     selectedTicket: null,
//   });

//   const displayTickets = isFiltered ? filteredTickets : tickets;
//   const [lastSearchValues, setLastSearchValues] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       await loadTickets();
//       await fetchDevices();
//       await loadExportLoans();
//     };
//     loadData();
//   }, []);

//   useEffect(() => {
//     if (isFiltered && lastSearchValues) {
//       handleSearch(lastSearchValues);
//     } else {
//       setFilteredTickets(tickets);
//     }
//   }, [tickets]);


//   const loadTickets = async () => {
//     setLoading(true);
//     try {
//       const response = await fetchExportLoanTicket();

//       const ticketsArray = Array.isArray(response.data)
//         ? response.data
//         : response;

//       if (!ticketsArray || !Array.isArray(ticketsArray)) {
//         // Fallback an toàn nếu API trả về { data: [] }
//         if (response?.data && Array.isArray(response?.data)) {
//           // Đã xử lý ở trên
//         } else {
//           throw new Error("API không trả về danh sách phiếu hợp lệ");
//         }
//       }

//       const finalArray = Array.isArray(ticketsArray) ? ticketsArray : (response.data || []);

//       // Sửa: bỏ .attributes
//       const sortedTickets = finalArray.sort(
//         (a, b) =>
//           new Date(b.createdAt) - new Date(a.createdAt)
//       );

//       setTickets(sortedTickets);

//       if (isFiltered) {
//         const values = form.getFieldsValue();
//         handleSearch(values);
//       }
//     } catch (error) {
//       message.error("Lỗi khi tải danh sách phiếu!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadExportLoans = async () => {
//     try {
//       const response = await fetchExportLoans();
//       const exportLoansArray = Array.isArray(response.data)
//         ? response.data
//         : (response || []); // Strapi v5 có thể trả mảng trực tiếp
//       setExportLoans(exportLoansArray);
//     } catch (error) {
//       message.error("Lỗi khi tải danh sách thiết bị con!");
//     }
//   };

//   const fetchDevices = async () => {
//     try {
//       const response = await fetchExportlists();
//       const devicesArray = Array.isArray(response.data) ? response.data : (response || []);
//       setDevices(devicesArray);

//       // Sửa: bỏ .attributes
//       const options = devicesArray.map((device) => ({
//         value: device.SerialNumber,
//         label: device.SerialNumber,
//         ...device,
//       }));
//       setSerialNumberOptions(options);
//     } catch (error) {
//       message.error("Lỗi khi tải danh sách thiết bị!");
//     }
//   };

//   const handleExport = async () => {
//     if (!selectedRowKeys || selectedRowKeys.length === 0) {
//       message.warning("Vui lòng chọn ít nhất một phiếu để xuất!");
//       return;
//     }

//     const selectedTickets = tickets.filter((ticket) =>
//       selectedRowKeys.includes(ticket.id)
//     );

//     if (selectedTickets.length === 0) {
//       message.warning("Không có phiếu hợp lệ để xuất!");
//       return;
//     }

//     message.loading("Đang tải dữ liệu thiết bị...");

//     const exportData = [];

//     for (const ticket of selectedTickets) {
//       try {
//         // Sửa: bỏ .attributes
//         const responseData = await fetchExportLoanPOS(ticket.Votes);

//         // Sửa: bỏ .attributes
//         responseData.forEach((device) => {
//           exportData.push({
//             "Mã phiếu xuất": ticket.Votes,
//             "Ticket Dingtalk": ticket.Ticket,
//             "Khách hàng": ticket.Customer,
//             "Cửa hàng": ticket.Store,
//             "Người mượn": ticket.Person,
//             "Người xuất hóa đơn": ticket.PersonInvoice,
//             "Số hóa đơn": ticket.InvoiceNumber,
//             "Trạng thái": ticket.Status,
//             "Ngày tạo": new Date(ticket.createdAt).toLocaleString(),
//             "Sản phẩm": device.ProductName,
//             Model: device.Model,
//             "Serial Number": device.SerialNumber,
//             "Số lượng": device.totalexport,
//           });
//         });
//       } catch (error) {
//         console.error(
//           `Lỗi lấy thiết bị cho phiếu ${ticket.Votes}:`, // Sửa: bỏ .attributes
//           error
//         );
//         exportData.push({
//           "Mã phiếu xuất": ticket.Votes, // Sửa: bỏ .attributes
//           "Ticket Dingtalk": ticket.Ticket,
//           "Khách hàng": ticket.Customer,
//           "Cửa hàng": ticket.Store,
//           "Người mượn": ticket.Person,
//           "Người xuất hóa đơn": ticket.PersonInvoice,
//           "Số hóa đơn": ticket.InvoiceNumber,
//           "Trạng thái": ticket.Status,
//           "Ngày tạo": new Date(ticket.createdAt).toLocaleString(),
//           "Sản phẩm": "Lỗi tải thiết bị",
//           Model: "",
//           "Serial Number": "",
//           "Số lượng": "",
//         });
//       }
//     }

//     message.destroy();
//     message.success("Xuất dữ liệu thành công!");

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "ExportTickets");
//     XLSX.writeFile(wb, "Export_Tickets_List.xlsx");
//   };

//   const toggleFilter = (status) => {
//     setFilteredStatus(filteredStatus === status ? null : status);
//   };

//   const getStatusCount = (status) => {
//     // Sửa: bỏ .attributes
//     return tickets.filter((ticket) => ticket.Status === status).length;
//   };

//   const statusList = [
//     { label: "Đang tạo phiếu", icon: <EditTwoTone />, color: "#1890FF" },
//     { label: "Đang chờ duyệt", icon: <ClockCircleTwoTone />, color: "#FAAD14" },
//     { label: "Duyệt", icon: <CheckCircleTwoTone />, color: "#52C41A" },
//     { label: "Đã giao", icon: <WarningTwoTone />, color: "#1890FF" },
//     { label: "Xác nhận", icon: <CheckSquareTwoTone />, color: "#52C41A" },
//     { label: "Chờ xuất hóa đơn", icon: <FileTextTwoTone />, color: "#FF9999" },
//     { label: "Đã xuất hóa đơn", icon: <CalculatorTwoTone />, color: "#52C41A" },
//     { label: "Trả kho", icon: <InteractionTwoTone />, color: "#f00c2aff" },
//     { label: "Bảo hành", icon: <ReconciliationTwoTone />, color: "#e8f00cff" },
//   ];

//   const renderStatusTag = (status) => {
//     let color, icon;
//     switch (status) {
//       case "Đang tạo phiếu":
//         color = "#1890FF";
//         icon = <EditTwoTone />;
//         break;
//       case "Đang chờ duyệt":
//         color = "#FAAD14";
//         icon = <ClockCircleTwoTone />;
//         break;
//       case "Duyệt":
//         color = "#52C41A";
//         icon = <CheckCircleTwoTone />;
//         break;
//       case "Đã giao":
//         color = "#1890FF";
//         icon = <WarningTwoTone />;
//         break;
//       case "Xác nhận":
//         color = "#52C41A";
//         icon = <CheckSquareTwoTone />;
//         break;
//       case "Chờ xuất hóa đơn":
//         color = "#FF9999";
//         icon = <FileTextTwoTone />;
//         break;
//       case "Đã xuất hóa đơn":
//         color = "#52C41A";
//         icon = <CalculatorTwoTone />;
//         break;
//       case "Trả kho":
//         color = "#f00c2aff";
//         icon = <InteractionTwoTone />;
//         break;
//       case "Bảo hành":
//         color = "#e8f00cff";
//         icon = <ReconciliationTwoTone />;
//         break;
//       default:
//         color = "gray";
//         icon = null;
//     }
//     return (
//       <Tag
//         color={color}
//         style={{
//           fontSize: "14px",
//           padding: "5px 10px",
//           display: "flex",
//           alignItems: "center",
//           gap: "5px",
//         }}
//       >
//         {icon} {status}
//       </Tag>
//     );
//   };

//   const renderNotification = (createdAt, status) => {
//     const createdTime = new Date(createdAt);
//     const now = new Date();
//     const diffInHours = (now - createdTime) / (1000 * 60 * 60);

//     if (status === "Đang chờ duyệt" && diffInHours > 24) {
//       return (
//         <Tag color="orange">
//           <ExclamationCircleOutlined /> Phiếu chưa duyệt
//         </Tag>
//       );
//     }
//     if (status === "Đang tạo phiếu" && diffInHours > 2) {
//       return (
//         <Tag color="red">
//           <ExclamationCircleOutlined /> Phiếu cần hoàn tất
//         </Tag>
//       );
//     }
//     if (status === "Đã giao" && diffInHours > 12) {
//       return (
//         <Tag color="red">
//           <ExclamationCircleOutlined /> Chưa có biên bản bàn giao
//         </Tag>
//       );
//     }
//     if (status === "Xác nhận" && diffInHours > 24) {
//       return (
//         <Tag color="purple">
//           <ExclamationCircleOutlined /> Chưa bàn giao cho SaleAdmin
//         </Tag>
//       );
//     }
//     return null;
//   };


//   const handleSearch = (values) => {
//     setLastSearchValues(values);
//     let results = [...tickets];

//     if (values.model || values.dateRange || values.searchText) {
//       let filteredChildren = [...exportLoans];

//       if (values.model) {
//         // Sửa: bỏ .attributes
//         filteredChildren = filteredChildren.filter((c) =>
//           c.Model?.toLowerCase().includes(values.model.toLowerCase())
//         );
//       }

//       if (values.dateRange && values.dateRange.length === 2) {
//         const [start, end] = values.dateRange;
//         filteredChildren = filteredChildren.filter((c) => {
//           // Sửa: bỏ .attributes
//           const created = new Date(c.createdAt);
//           return (
//             created >= start.startOf("day").toDate() &&
//             created <= end.endOf("day").toDate()
//           );
//         });
//       }

//       if (values.searchText) {
//         filteredChildren = filteredChildren.filter(
//           (c) =>
//             // Sửa: bỏ .attributes
//             c.SerialNumber?.toLowerCase().includes(
//               values.searchText.toLowerCase()
//             ) ||
//             c.ProductName?.toLowerCase().includes(
//               values.searchText.toLowerCase()
//             )
//         );
//       }

//       // Lấy danh sách Votes từ con (Sửa: bỏ .attributes)
//       const validVotes = [
//         ...new Set(filteredChildren.map((c) => c.Votes)),
//       ];
//       // Sửa: bỏ .attributes
//       results = results.filter((ticket) =>
//         validVotes.includes(ticket.Votes)
//       );
//     }

//     if (values.Status) {
//       // Sửa: bỏ .attributes
//       results = results.filter((t) => t?.Status === values.Status);
//     }
//     if (values.Customer) {
//       // Sửa: bỏ .attributes
//       results = results.filter(
//         (t) => t?.Customer === values.Customer
//       );
//     }
//     if (values.Store) {
//       // Sửa: bỏ .attributes
//       results = results.filter((t) => t?.Store === values.Store);
//     }

//     setFilteredTickets(results);
//     setIsFiltered(true);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setFilteredTickets([]);
//     setIsFiltered(false);
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
//       render: (_, __, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//       width: 70,
//     },
//     {
//       title: "Số Phiếu",
//       dataIndex: "Votes", // Sửa: bỏ ["attributes", ...]
//       key: "Votes",
//       width: 160,
//     },
//     {
//       title: "Cửa Hàng",
//       dataIndex: "Store", // Sửa: bỏ ["attributes", ...]
//       key: "Store",
//       width: 160,
//     },
//     {
//       title: "Người Mượn",
//       dataIndex: "Person", // Sửa: bỏ ["attributes", ...]
//       key: "Person",
//       width: 150,
//     },

//     {
//       title: "Trạng Thái",
//       dataIndex: "Status", // Sửa: bỏ ["attributes", ...]
//       key: "Status",
//       width: 180,
//       render: renderStatusTag,
//     },
//     {
//       title: "Thông báo",
//       key: "Notification",
//       width: 180,
//       render: (_, record) =>
//         renderNotification(
//           record.createdAt, // Sửa: bỏ .attributes
//           record.Status     // Sửa: bỏ .attributes
//         ),
//     },
//     {
//       title: "Ngày Tạo",
//       dataIndex: "createdAt", // Sửa: bỏ ["attributes", ...]
//       key: "createdAt",
//       width: 170,
//       render: (text) => {
//         const date = new Date(text);
//         return `${date.getDate().toString().padStart(2, "0")}-${(
//           date.getMonth() + 1
//         )
//           .toString()
//           .padStart(2, "0")}-${date.getFullYear()} ${date
//             .getHours()
//             .toString()
//             .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
//       },
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       width: 100,
//       render: (_, record) => (
//         <Button
//           type="link"
//           onClick={() =>
//             setTicketModal({ selectedTicket: record, isOpen: true })
//           }
//         >
//           📋 Sản phẩm
//         </Button>
//       ),
//     },
//   ];

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   return (
//     <div className="Device-container">
//       <Form
//         form={form}
//         layout="inline"
//         onFinish={handleSearch}
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
//           <Form.Item name="Status" label="Trạng thái">
//             <Select
//               placeholder="-- Trạng thái --"
//               style={{ width: 160 }}
//               allowClear
//             >
//               {[...new Set(tickets.map((i) => i.Status))].map( // Sửa: bỏ .attributes
//                 (status) => (
//                   <Select.Option key={status} value={status}>
//                     {status}
//                   </Select.Option>
//                 )
//               )}
//             </Select>
//           </Form.Item>

//           <Form.Item name="Customer" label="Khách hàng">
//             <Select
//               placeholder="-- Khách Hàng --"
//               style={{ width: 160 }}
//               allowClear
//             >
//               {[...new Set(tickets.map((i) => i.Customer))].map( // Sửa: bỏ .attributes
//                 (customer) => (
//                   <Select.Option key={customer} value={customer}>
//                     {customer}
//                   </Select.Option>
//                 )
//               )}
//             </Select>
//           </Form.Item>

//           <Form.Item name="Store" label="Cửa hàng">
//             <Select
//               placeholder="Cửa Hàng"
//               style={{ width: 180 }}
//               allowClear
//               showSearch
//               optionFilterProp="children"
//               filterOption={(input, option) =>
//                 option?.children?.toLowerCase().includes(input.toLowerCase())
//               }
//             >
//               {[...new Set(tickets.map((i) => i.Store))] // Sửa: bỏ .attributes
//                 .filter(Boolean)
//                 .sort((a, b) =>
//                   a.localeCompare(b, "vi", { sensitivity: "base" })
//                 )
//                 .map((store) => (
//                   <Select.Option key={store} value={store}>
//                     {store}
//                   </Select.Option>
//                 ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="searchText" label="Số phiếu / Ticket">
//             <Input placeholder="Số Phiếu / Ticket" style={{ width: 200 }} />
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
//           <Form.Item name="model" label="Model">
//             <Select
//               placeholder="-- Model --"
//               style={{ width: 180 }}
//               allowClear
//               showSearch
//               optionFilterProp="children"
//               filterOption={(input, option) =>
//                 option?.children?.toLowerCase().includes(input.toLowerCase())
//               }
//             >
//               {[...new Set(exportLoans.map((i) => i.Model))] // Sửa: bỏ .attributes
//                 .filter(Boolean)
//                 .sort((a, b) =>
//                   a.localeCompare(b, "vi", { sensitivity: "base" })
//                 )
//                 .map((model) => (
//                   <Select.Option key={model} value={model}>
//                     {model}
//                   </Select.Option>
//                 ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="dateRange" label="Ngày">
//             <DatePicker.RangePicker format="DD-MM-YYYY" />
//           </Form.Item>

//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: "12px",
//               width: "100%",
//             }}
//           >
//             <Button
//               type="primary"
//               htmlType="submit"
//               icon={<SearchOutlined />}
//               style={{ marginRight: 10 }}
//             >
//               Tìm kiếm
//             </Button>
//             <Form.Item>
//               <Button onClick={resetFilters}>🧹 Reset</Button>
//             </Form.Item>
//             <Form.Item>
//               <Button type="dashed" onClick={handleExport}>
//                 📤 Export Excel
//               </Button>
//             </Form.Item>
//             {account.WritePOS === true && (
//               <Button
//                 type="primary"
//                 onClick={() => setIsCreateTicketModalOpen(true)}
//                 style={{ marginLeft: 10 }}
//               >
//                 ➕ Tạo Phiếu
//               </Button>
//             )}
//           </div>
//         </div>
//       </Form>

//       <Row
//         gutter={[12, 12]}
//         style={{ marginBottom: 20 }}
//         className="status-summary"
//       >
//         {statusList.map(({ label, icon, color }) => (
//           <Col key={label}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <span style={{ fontSize: 18 }}>{icon}</span>
//               <span style={{ fontWeight: 500 }}>{label}:</span>
//               <span style={{ fontWeight: "bold", color }}>
//                 {getStatusCount(label)}
//               </span>
//             </div>
//           </Col>
//         ))}
//       </Row>

//       {/* Bảng danh sách phiếu */}
//       <Table
//         rowSelection={{
//           selectedRowKeys,
//           onChange: setSelectedRowKeys,
//         }}
//         locale={{ emptyText: "Không có dữ liệu phù hợp với tìm kiếm" }}
//         dataSource={displayTickets}
//         rowKey={(record) => record.id}
//         loading={loading}
//         style={{ marginTop: 20 }}
//         scroll={{ x: "max-content" }}
//         rowClassName={(record) =>
//           selectedTicket && selectedTicket.id === record.id
//             ? "selected-row"
//             : ""
//         }
//         columns={columns}
//         pagination={{
//           ...pagination,
//           onChange: (page, pageSize) => {
//             setPagination({ current: page, pageSize });
//           },
//         }}
//         onRow={(record) => ({
//           onClick: () => {
//             setSelectedTicket(record);
//           },
//           onDoubleClick: () => {
//             setDetailModal({ selectedTicket: record, isOpen: true });
//           },
//         })}
//       />
//       <Modal
//         open={detailModal.isOpen}
//         onCancel={() => setDetailModal({ isOpen: false, selectedTicket: null })}
//         footer={null}
//         width={800}
//       >
//         {selectedTicket && (
//           <>
//             <Descriptions
//               title="Thông tin phiếu"
//               bordered
//               column={2}
//               size="small"
//             >
//               <Descriptions.Item label="Số phiếu">
//                 {selectedTicket.Votes} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Trạng thái">
//                 {renderStatusTag(selectedTicket.Status)} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Khách hàng">
//                 {selectedTicket.Customer} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Cửa hàng">
//                 {selectedTicket.Store} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Ngày tạo">
//                 {new Date(selectedTicket.createdAt).toLocaleString()} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số thiết bị">
//                 {
//                   exportLoans.filter(
//                     (e) =>
//                       e.Votes === selectedTicket.Votes // Sửa: bỏ .attributes
//                   ).length
//                 }
//               </Descriptions.Item>
//               <Descriptions.Item label="Người Nhận HĐ">
//                 {selectedTicket.PersonInvoice} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số Hóa Đơn">
//                 {selectedTicket.InvoiceNumber} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//             </Descriptions>

//             <h5 style={{ marginTop: 20 }}>Danh sách thiết bị</h5>
//             <Table
//               size="small"
//               rowKey="id"
//               pagination={false}
//               dataSource={exportLoans.filter(
//                 (e) => e.Votes === selectedTicket.Votes // Sửa: bỏ .attributes
//               )}
//               columns={[
//                 {
//                   title: "Tên sản phẩm",
//                   dataIndex: "ProductName", // Sửa: bỏ ["attributes", ...]
//                   key: "product",
//                 },
//                 {
//                   title: "Model",
//                   dataIndex: "Model", // Sửa: bỏ ["attributes", ...]
//                   key: "model",
//                 },
//                 {
//                   title: "Serial",
//                   dataIndex: "SerialNumber", // Sửa: bỏ ["attributes", ...]
//                   key: "serial",
//                 },
//                 {
//                   title: "Ngày xuất",
//                   dataIndex: "createdAt", // Sửa: bỏ ["attributes", ...]
//                   key: "date",
//                   render: (date) => new Date(date).toLocaleDateString(),
//                 },
//               ]}
//             />
//           </>
//         )}
//       </Modal>

//       <AddExportLoanPOS
//         open={isCreateTicketModalOpen}
//         onClose={() => setIsCreateTicketModalOpen(false)}
//         reloadTickets={loadTickets}
//       />

//       {ticketModal.isOpen && ticketModal.selectedTicket && (
//         <TicketExportLoanModal
//           isOpen={ticketModal.isOpen}
//           onClose={() => setTicketModal({ ...ticketModal, isOpen: false })}
//           ticket={ticketModal.selectedTicket}
//           fetchDevices={fetchDevices}
//           fetchTickets={fetchExportLoanTicket}
//           serialNumberOptions={serialNumberOptions}
//           reloadTickets={loadTickets}
//           modalWidth="90%"
//           modalBodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
//         />
//       )}
//     </div>
//   );
// };

// export default ExportLoanPOS;

import React, { useEffect, useState } from "react";
import {
  fetchExportlists,
  fetchExportLoanTicket,
  fetchExportLoanPOS,
  fetchExportLoans,
} from "../../../services/dhgServices";
import {
  Button,
  Table,
  message,
  Row,
  Col,
  Tag,
  Form,
  Select,
  Input,
  DatePicker,
  Modal,
  Descriptions,
  Card,
  Space,
  Tooltip,
  Divider,
  Typography,
  Statistic
} from "antd";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  ExclamationCircleOutlined,
  FileTextTwoTone,
  CalculatorTwoTone,
  WarningTwoTone,
  CheckSquareTwoTone,
  SearchOutlined,
  InteractionTwoTone,
  EditTwoTone,
  ReconciliationTwoTone,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  FilterOutlined
} from "@ant-design/icons";
import AddExportLoanPOS from "./AddExportLoanPOS";
import TicketExportLoanModal from "./TicketExportLoanModal";
import "./ExportLoanPOS.scss";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ExportLoanPOS = () => {
  // --- STATE MANAGEMENT ---
  const [devices, setDevices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [ticketModal, setTicketModal] = useState({
    selectedTicket: null,
    isOpen: false,
  });
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [serialNumberOptions, setSerialNumberOptions] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [exportLoans, setExportLoans] = useState([]);
  const [form] = Form.useForm();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    selectedTicket: null,
  });
  const [lastSearchValues, setLastSearchValues] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const displayTickets = isFiltered ? filteredTickets : tickets;
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // --- EFFECTS ---
  useEffect(() => {
    const loadData = async () => {
      await loadTickets();
      await fetchDevices();
      await loadExportLoans();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isFiltered && lastSearchValues) {
      handleSearch(lastSearchValues);
    } else {
      setFilteredTickets(tickets);
    }
  }, [tickets]);

  // --- API CALLS ---
  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetchExportLoanTicket();
      const ticketsArray = Array.isArray(response.data) ? response.data : response;

      if (!ticketsArray || !Array.isArray(ticketsArray)) {
        if (response?.data && Array.isArray(response?.data)) {
          // handled above
        } else {
          throw new Error("API không trả về danh sách phiếu hợp lệ");
        }
      }

      const finalArray = Array.isArray(ticketsArray) ? ticketsArray : (response.data || []);
      const sortedTickets = finalArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTickets(sortedTickets);
      if (isFiltered) {
        const values = form.getFieldsValue();
        handleSearch(values);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách phiếu!");
    } finally {
      setLoading(false);
    }
  };

  const loadExportLoans = async () => {
    try {
      const response = await fetchExportLoans();
      const exportLoansArray = Array.isArray(response.data) ? response.data : (response || []);
      setExportLoans(exportLoansArray);
    } catch (error) {
      message.error("Lỗi khi tải danh sách thiết bị con!");
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetchExportlists();
      const devicesArray = Array.isArray(response.data) ? response.data : (response || []);
      setDevices(devicesArray);
      const options = devicesArray.map((device) => ({
        value: device.SerialNumber,
        label: device.SerialNumber,
        ...device,
      }));
      setSerialNumberOptions(options);
    } catch (error) {
      message.error("Lỗi khi tải danh sách thiết bị!");
    }
  };

  // --- HANDLERS ---
  const handleExport = async () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một phiếu để xuất!");
      return;
    }

    const selectedTickets = tickets.filter((ticket) =>
      selectedRowKeys.includes(ticket.id)
    );

    message.loading("Đang tải dữ liệu thiết bị...", 0); // 0 to keep open

    const exportData = [];
    for (const ticket of selectedTickets) {
      try {
        const responseData = await fetchExportLoanPOS(ticket.Votes);
        if (responseData && responseData.length > 0) {
          responseData.forEach((device) => {
            exportData.push(formatExportItem(ticket, device));
          });
        } else {
          // Trường hợp phiếu không có thiết bị hoặc lỗi lấy detail nhưng có phiếu
          exportData.push(formatExportItem(ticket, null));
        }
      } catch (error) {
        console.error(`Lỗi lấy thiết bị cho phiếu ${ticket.Votes}:`, error);
        exportData.push(formatExportItem(ticket, null));
      }
    }

    message.destroy();
    message.success("Xuất dữ liệu thành công!");

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExportTickets");
    XLSX.writeFile(wb, `Danh_sach_phieu_muon_${dayjs().format("DDMMYYYY")}.xlsx`);
  };

  const formatExportItem = (ticket, device) => ({
    "Mã phiếu xuất": ticket.Votes,
    "Ticket Dingtalk": ticket.Ticket,
    "Khách hàng": ticket.Customer,
    "Cửa hàng": ticket.Store,
    "Người mượn": ticket.Person,
    "Người xuất hóa đơn": ticket.PersonInvoice,
    "Số hóa đơn": ticket.InvoiceNumber,
    "Trạng thái": ticket.Status,
    "Ngày tạo": dayjs(ticket.createdAt).format("DD/MM/YYYY HH:mm"),
    "Sản phẩm": device ? device.ProductName : "Không có dữ liệu",
    "Model": device ? device.Model : "",
    "Serial Number": device ? device.SerialNumber : "",
    "Số lượng": device ? device.totalexport : "",
  });

  const handleSearch = (values) => {
    setLastSearchValues(values);
    let results = [...tickets];

    if (values.model || (values.dateRange && values.dateRange.length === 2) || values.searchText) {
      let filteredChildren = [...exportLoans];

      if (values.model) {
        filteredChildren = filteredChildren.filter((c) =>
          c.Model?.toLowerCase().includes(values.model.toLowerCase())
        );
      }

      if (values.dateRange && values.dateRange.length === 2) {
        const [start, end] = values.dateRange;
        filteredChildren = filteredChildren.filter((c) => {
          const created = dayjs(c.createdAt);
          return created.isAfter(start.startOf('day')) && created.isBefore(end.endOf('day'));
        });
      }

      if (values.searchText) {
        filteredChildren = filteredChildren.filter(
          (c) =>
            c.SerialNumber?.toLowerCase().includes(values.searchText.toLowerCase()) ||
            c.ProductName?.toLowerCase().includes(values.searchText.toLowerCase())
        );
      }

      // Nếu chỉ search text trên ticket (Votes, Store...) mà ko tìm thấy trong children thì cũng nên tìm trong ticket gốc
      // Tuy nhiên logic cũ đang ưu tiên filter theo children để lấy Votes. Giữ nguyên logic cũ.
      const validVotes = [...new Set(filteredChildren.map((c) => c.Votes))];

      // Mở rộng tìm kiếm searchText trên chính Ticket luôn
      if (values.searchText) {
        const searchLower = values.searchText.toLowerCase();
        const ticketMatches = tickets.filter(t =>
          t.Votes?.toLowerCase().includes(searchLower) ||
          t.Ticket?.toLowerCase().includes(searchLower)
        ).map(t => t.Votes);
        validVotes.push(...ticketMatches);
      }

      results = results.filter((ticket) => validVotes.includes(ticket.Votes));
    }

    if (values.Status) {
      results = results.filter((t) => t?.Status === values.Status);
    }
    if (values.Customer) {
      results = results.filter((t) => t?.Customer === values.Customer);
    }
    if (values.Store) {
      results = results.filter((t) => t?.Store === values.Store);
    }

    setFilteredTickets(results);
    setIsFiltered(true);
    setPagination({ ...pagination, current: 1 }); // Reset về trang 1 khi search
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredTickets([]);
    setIsFiltered(false);
    setLastSearchValues(null);
  };

  // --- HELPERS ---
  const getStatusCount = (status) => tickets.filter((ticket) => ticket.Status === status).length;

  const renderStatusTag = (status) => {
    const config = {
      "Đang tạo phiếu": { color: "blue", icon: <EditTwoTone /> },
      "Đang chờ duyệt": { color: "warning", icon: <ClockCircleTwoTone twoToneColor="#faad14" /> },
      "Duyệt": { color: "success", icon: <CheckCircleTwoTone twoToneColor="#52c41a" /> },
      "Đã giao": { color: "processing", icon: <WarningTwoTone /> },
      "Xác nhận": { color: "success", icon: <CheckSquareTwoTone twoToneColor="#52c41a" /> },
      "Chờ xuất hóa đơn": { color: "error", icon: <FileTextTwoTone twoToneColor="#ff4d4f" /> },
      "Đã xuất hóa đơn": { color: "success", icon: <CalculatorTwoTone twoToneColor="#52c41a" /> },
      "Trả kho": { color: "magenta", icon: <InteractionTwoTone twoToneColor="#eb2f96" /> },
      "Bảo hành": { color: "purple", icon: <ReconciliationTwoTone twoToneColor="#722ed1" /> },
    };

    const item = config[status] || { color: "default", icon: null };
    return <Tag color={item.color} icon={item.icon}>{status}</Tag>;
  };

  const renderNotification = (createdAt, status) => {
    const createdTime = dayjs(createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdTime, 'hour');

    if (status === "Đang chờ duyệt" && diffInHours > 24)
      return <Tag color="orange" icon={<ExclamationCircleOutlined />}>Delay duyệt</Tag>;
    if (status === "Đang tạo phiếu" && diffInHours > 2)
      return <Tag color="red" icon={<ExclamationCircleOutlined />}>Chưa hoàn tất</Tag>;
    if (status === "Đã giao" && diffInHours > 12)
      return <Tag color="red" icon={<ExclamationCircleOutlined />}>Thiếu BBBG</Tag>;
    if (status === "Xác nhận" && diffInHours > 24)
      return <Tag color="purple" icon={<ExclamationCircleOutlined />}>Chưa giao SA</Tag>;
    return null;
  };

  // --- COLUMNS ---
  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Thông tin phiếu",
      key: "Info",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1890ff' }}>{record.Votes}</Text>
          {record.Ticket && <Text type="secondary" style={{ fontSize: '12px' }}>Ticket: {record.Ticket}</Text>}
        </Space>
      )
    },
    {
      title: "Khách hàng / Cửa hàng",
      key: "CustomerStore",
      width: 220,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.Customer}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.Store}</Text>
        </Space>
      )
    },
    {
      title: "Người mượn",
      dataIndex: "Person",
      key: "Person",
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      width: 160,
      render: renderStatusTag,
    },
    {
      title: "Cảnh báo",
      key: "Notification",
      width: 140,
      render: (_, record) => renderNotification(record.createdAt, record.Status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (text) => <Text type="secondary">{dayjs(text).format("DD/MM/YYYY HH:mm")}</Text>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: '#1890ff', fontSize: '16px' }} />}
            onClick={() => setDetailModal({ selectedTicket: record, isOpen: true })}
          />
        </Tooltip>
        // Note: Nút Edit sản phẩm đã được thay thế bằng double click hoặc logic khác nếu cần
      ),
    },
  ];

  // List trạng thái để hiển thị summary
  const statusSummaryList = [
    { label: "Chờ duyệt", key: "Đang chờ duyệt", color: "#faad14" },
    { label: "Đã giao", key: "Đã giao", color: "#1890ff" },
    { label: "Chờ xuất HĐ", key: "Chờ xuất hóa đơn", color: "#ff4d4f" },
  ];

  return (
    <div className="export-loan-pos-container">
      {/* --- HEADER SUMMARY --- */}
      <Card bordered={false} className="mb-3 shadow-sm header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>Quản lý Phiếu mượn POS</Title>
            <Text type="secondary">Quản lý các phiếu xuất, mượn và trạng thái thiết bị</Text>
          </Col>
          <Col>
            <Space size="large">
              {statusSummaryList.map(s => (
                <Statistic
                  key={s.key}
                  title={s.label}
                  value={getStatusCount(s.key)}
                  valueStyle={{ color: s.color, fontSize: '18px', fontWeight: 'bold' }}
                  prefix={renderStatusTag(s.key)?.props?.icon}
                />
              ))}
              <Divider type="vertical" style={{ height: '40px' }} />
              <Statistic
                title="Tổng phiếu"
                value={tickets.length}
                valueStyle={{ fontSize: '18px', fontWeight: 'bold' }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* --- MAIN CONTENT --- */}
      <Card bordered={false} className="shadow-sm body-card">
        {/* Filter Section */}
        <Form form={form} layout="vertical" onFinish={handleSearch} className="filter-form">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="searchText" label="Tìm kiếm">
                <Input placeholder="Số phiếu, Ticket..." prefix={<SearchOutlined className="text-muted" />} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="Status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" allowClear>
                  {[...new Set(tickets.map((i) => i.Status))].map(status => (
                    <Select.Option key={status} value={status}>{status}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="Store" label="Cửa hàng">
                <Select
                  placeholder="Chọn cửa hàng"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                >
                  {[...new Set(tickets.map((i) => i.Store))].filter(Boolean).sort().map(store => (
                    <Select.Option key={store} value={store}>{store}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="dateRange" label="Khoảng thời gian">
                <DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Form.Item label=" ">
                <Space wrap>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                  <Button icon={<ReloadOutlined />} onClick={resetFilters}>Làm mới</Button>
                  <Button icon={<ExportOutlined />} onClick={handleExport}>Excel</Button>
                  {account.WritePOS && (
                    <Button type="primary" className="btn-success" icon={<PlusOutlined />} onClick={() => setIsCreateTicketModalOpen(true)}>
                      Tạo mới
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider style={{ margin: '12px 0' }} />

        {/* Data Table */}
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={displayTickets}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} phiếu`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
          scroll={{ x: 1200 }}
          onRow={(record) => ({
            onClick: () => setSelectedTicket(record),
            onDoubleClick: () => setDetailModal({ selectedTicket: record, isOpen: true }),
            className: "cursor-pointer hover-row"
          })}
          rowClassName={(record) => selectedTicket?.id === record.id ? "ant-table-row-selected" : ""}
          size="middle"
        />
      </Card>

      {/* --- MODALS --- */}

      {/* Detail Modal */}
      <Modal
        title={<Space><FileTextTwoTone /> Chi tiết phiếu: {detailModal.selectedTicket?.Votes}</Space>}
        open={detailModal.isOpen}
        onCancel={() => setDetailModal({ isOpen: false, selectedTicket: null })}
        footer={[
          <Button key="close" onClick={() => setDetailModal({ isOpen: false, selectedTicket: null })}>Đóng</Button>,
          <Button key="edit" type="primary" onClick={() => {
            setTicketModal({ selectedTicket: detailModal.selectedTicket, isOpen: true });
            setDetailModal({ isOpen: false, selectedTicket: null });
          }}>Cập nhật sản phẩm</Button>
        ]}
        width={900}
      >
        {detailModal.selectedTicket && (
          <>
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} size="small">
              <Descriptions.Item label="Trạng thái">{renderStatusTag(detailModal.selectedTicket.Status)}</Descriptions.Item>
              <Descriptions.Item label="Khách hàng">{detailModal.selectedTicket.Customer}</Descriptions.Item>
              <Descriptions.Item label="Cửa hàng">{detailModal.selectedTicket.Store}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{dayjs(detailModal.selectedTicket.createdAt).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
              <Descriptions.Item label="Người nhận HĐ">{detailModal.selectedTicket.PersonInvoice || '-'}</Descriptions.Item>
              <Descriptions.Item label="Số hóa đơn">{detailModal.selectedTicket.InvoiceNumber || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" plain>Danh sách thiết bị</Divider>

            <Table
              size="small"
              rowKey="id"
              pagination={false}
              bordered
              dataSource={exportLoans.filter(e => e.Votes === detailModal.selectedTicket.Votes)}
              columns={[
                { title: "Tên sản phẩm", dataIndex: "ProductName" },
                { title: "Model", dataIndex: "Model" },
                { title: "Serial Number", dataIndex: "SerialNumber", render: (t) => <Text copyable>{t}</Text> },
                { title: "Số lượng", dataIndex: "totalexport", align: 'center', width: 100 },
              ]}
            />
          </>
        )}
      </Modal>

      <AddExportLoanPOS
        open={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        reloadTickets={loadTickets}
      />

      {ticketModal.isOpen && ticketModal.selectedTicket && (
        <TicketExportLoanModal
          isOpen={ticketModal.isOpen}
          onClose={() => setTicketModal({ ...ticketModal, isOpen: false })}
          ticket={ticketModal.selectedTicket}
          fetchDevices={fetchDevices}
          fetchTickets={fetchExportLoanTicket}
          serialNumberOptions={serialNumberOptions}
          reloadTickets={loadTickets}
          modalWidth="90%"
          modalBodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
        />
      )}
    </div>
  );
};

export default ExportLoanPOS;
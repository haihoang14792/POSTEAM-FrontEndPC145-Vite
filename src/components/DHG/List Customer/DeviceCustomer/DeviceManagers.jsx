// import React, { useEffect, useState } from "react";
// import {
//   fetchDevicemanager,
//   fetchTicket,
//   deleteTicketById,
//   fetchDeviceDetailHandoverPOS,
// } from "../../../../services/storeServices";
// import {
//   Button,
//   Table,
//   message,
//   Card,
//   Row,
//   Col,
//   Tag,
//   Form,
//   Select,
//   Input,
//   Modal,
//   Tooltip,
//   Badge,
// } from "antd";
// import {
//   CheckCircleOutlined,
//   SyncOutlined,
//   ClockCircleOutlined,
//   ExclamationCircleOutlined,
//   SearchOutlined,
//   FileDoneOutlined,
//   FilterOutlined,
//   UserOutlined,
//   ShopOutlined,
//   BarcodeOutlined,
//   FileTextOutlined,
//   ReloadOutlined,
//   PlusOutlined,
//   DeleteOutlined,
//   EyeOutlined,
// } from "@ant-design/icons";
// import CreateTicketModal from "./CreateTicketModal";
// import TicketModal from "./TicketModal";
// import "./DeviceManagers.scss";
// import ReactPaginate from "react-paginate";

// const DeviceManagers = () => {
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
//   const [searchResults, setSearchResults] = useState(null);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [form] = Form.useForm();

//   // Responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);

//     const loadData = async () => {
//       await loadTickets();
//       await fetchDevices();
//     };
//     loadData();

//     const interval = setInterval(() => {
//       if (document.visibilityState === "visible") {
//         loadTickets();
//       }
//     }, 60000);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       clearInterval(interval);
//     };
//   }, []);

//   const [currentPage, setCurrentPage] = useState(0);
//   const pageSize = 20;

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//     // Scroll to top on mobile when page changes
//     if (isMobile) {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleDeleteSelected = () => {
//     Modal.confirm({
//       title: "Xác nhận xóa",
//       content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} phiếu đã chọn không?`,
//       cancelText: "Hủy",
//       okText: "Xóa",
//       okButtonProps: { danger: true },
//       centered: true,
//       onOk: async () => {
//         try {
//           for (const id of selectedRowKeys) {
//             await deleteTicketById(id);
//           }
//           message.success("Đã xóa phiếu thành công!");
//           setSelectedRowKeys([]);
//           loadTickets();
//         } catch (error) {
//           message.error("Lỗi khi xóa phiếu!");
//         }
//       },
//     });
//   };

//   const loadTickets = async () => {
//     setLoading(true);
//     try {
//       const response = await fetchTicket();
//       const ticketsArray = Array.isArray(response.data)
//         ? response.data
//         : response;

//       const finalArray = Array.isArray(ticketsArray) ? ticketsArray : (response.data || []);

//       const sortedTickets = finalArray.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setTickets(sortedTickets);
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   const fetchDevices = async () => {
//     try {
//       // Gọi hàm service vừa sửa
//       const devicesData = await fetchDevicemanager();

//       // Vì service đã xử lý trả về mảng, ở đây ta lấy trực tiếp
//       // (Dòng này an toàn, kể cả service trả về [] thì code vẫn chạy tốt)
//       const data = Array.isArray(devicesData) ? devicesData : [];

//       setDevices(data);
//       const options = data.map((device) => ({
//         value: device.SerialNumber,
//         label: device.SerialNumber,
//         ...device,
//       }));
//       setSerialNumberOptions(options);
//     } catch (error) {
//       // message.error("Lỗi khi tải danh sách thiết bị!");
//     }
//   };

//   const getStatusCount = (status) => {
//     return tickets.filter((ticket) => ticket.Status === status).length;
//   };

//   const statusList = [
//     { label: "Đang tạo phiếu", icon: <SyncOutlined spin />, color: "#1890FF" },
//     { label: "Đang chờ duyệt", icon: <ClockCircleOutlined />, color: "#FAAD14" },
//     { label: "Đã duyệt", icon: <CheckCircleOutlined />, color: "#52C41A" },
//     { label: "Đã nhận phiếu", icon: <FileDoneOutlined />, color: "#FF4D4F" }, // Đổi màu đỏ cho nổi
//   ];

//   const renderStatusTag = (status) => {
//     let color, icon;
//     switch (status) {
//       case "Đang tạo phiếu":
//         color = "blue";
//         icon = <SyncOutlined spin />;
//         break;
//       case "Đang chờ duyệt":
//         color = "orange";
//         icon = <ClockCircleOutlined />;
//         break;
//       case "Đã duyệt":
//         color = "success";
//         icon = <CheckCircleOutlined />;
//         break;
//       case "Đã nhận phiếu":
//         color = "magenta";
//         icon = <FileDoneOutlined />;
//         break;
//       default:
//         color = "default";
//         icon = null;
//     }
//     return (
//       <Tag color={color} style={{ minWidth: 110, textAlign: 'center' }}>
//         {icon} {status}
//       </Tag>
//     );
//   };

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   const selectedTickets = tickets.filter((t) => selectedRowKeys.includes(t.id));

//   const canDelete =
//     account?.Leader === true &&
//     selectedTickets.every((ticket) => ticket?.Status === "Đang tạo phiếu");

//   const renderNotification = (createdAt, status) => {
//     const createdTime = new Date(createdAt);
//     const now = new Date();
//     const diffInHours = (now - createdTime) / (1000 * 60 * 60);

//     if (status === "Đang chờ duyệt" && diffInHours > 24) {
//       return (
//         <Tooltip title="Đã quá 24h chưa duyệt">
//           <Badge status="warning" text={<span style={{ color: '#faad14' }}>Quá hạn duyệt</span>} />
//         </Tooltip>
//       );
//     }
//     if (status === "Đang tạo phiếu" && diffInHours > 2) {
//       return (
//         <Tooltip title="Đã quá 2h chưa hoàn tất">
//           <Badge status="error" text={<span style={{ color: '#ff4d4f' }}>Cần xử lý</span>} />
//         </Tooltip>
//       );
//     }
//     return null;
//   };

//   const searchBySerial = async (serial) => {
//     try {
//       const response = await fetchDeviceDetailHandoverPOS(serial);
//       const handoverRes = response?.data || [];
//       if (handoverRes.length > 0) {
//         return handoverRes.map((item) => item);
//       } else {
//         message.warning("Không tìm thấy Serial trong bàn giao POS!");
//         return [];
//       }
//     } catch (error) {
//       message.error("Lỗi khi tìm kiếm Serial!");
//       return [];
//     }
//   };

//   const handleSearch = async (values) => {
//     setLoading(true);
//     let results = [...tickets];

//     if (values.status) {
//       results = results.filter((t) => t?.Status === values.status);
//     }
//     if (values.serialNumber) {
//       const deviceDetails = await searchBySerial(values.serialNumber);
//       if (deviceDetails.length > 0) {
//         const votesSet = new Set(deviceDetails.map((d) => d.Votes));
//         results = results.filter((t) => votesSet.has(t?.Votes));
//       } else {
//         results = [];
//       }
//     }
//     if (values.Customer) {
//       results = results.filter((t) => t?.Customer === values.Customer);
//     }
//     if (values.Store) {
//       results = results.filter((t) => t?.Store === values.Store);
//     }
//     if (values.searchText) {
//       const lowerSearch = values.searchText.toLowerCase();
//       results = results.filter(
//         (t) =>
//           t?.Votes?.toLowerCase().includes(lowerSearch) ||
//           t?.TenderName?.toLowerCase().includes(lowerSearch)
//       );
//     }

//     setSearchResults(results);
//     setCurrentPage(0);
//     setLoading(false);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setSearchResults(null);
//     setFilteredStatus(null);
//     setCurrentPage(0);
//   };

//   const getDisplayedTickets = () => {
//     let data = [...tickets];
//     if (filteredStatus) {
//       data = data.filter((t) => t?.Status === filteredStatus);
//     }
//     if (searchResults) {
//       const searchIds = new Set(searchResults.map((t) => t.id));
//       data = data.filter((t) => searchIds.has(t.id));
//     }
//     return data.filter((t) => t);
//   };

//   const filteredTickets = getDisplayedTickets();
//   const totalPages = Math.ceil(filteredTickets.length / pageSize);
//   const paginatedTickets = filteredTickets.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );

//   const customerList = [...new Set(filteredTickets.map((t) => t.Customer))];
//   const storeList = [...new Set(filteredTickets.map((t) => t.Store))];

//   return (
//     <div className="Device-container">

//       {/* --- CÔNG CỤ TRÊN CÙNG --- */}
//       <div className="top-actions">
//         <div className="action-buttons">
//           {account.WritePOS === true && (
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => setIsCreateTicketModalOpen(true)}
//               className="btn-create"
//             >
//               Tạo Phiếu
//             </Button>
//           )}
//           {canDelete && (
//             <Button
//               type="primary"
//               danger
//               icon={<DeleteOutlined />}
//               onClick={handleDeleteSelected}
//               disabled={selectedRowKeys.length === 0}
//             >
//               Xóa ({selectedRowKeys.length})
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* --- BỘ LỌC TÌM KIẾM --- */}
//       <Card
//         className="filter-card shadow-sm"
//         bordered={false}
//         title={
//           <div className="card-title">
//             <FilterOutlined /> <span>BỘ LỌC TÌM KIẾM</span>
//           </div>
//         }
//       >
//         <Form form={form} layout="vertical" onFinish={handleSearch}>
//           <Row gutter={[16, 0]}>
//             {/* Hàng 1 */}
//             <Col xs={24} sm={12} md={6} lg={6}>
//               <Form.Item name="status" label="Trạng thái">
//                 <Select placeholder="Chọn trạng thái" allowClear>
//                   {["Đang tạo phiếu", "Đang chờ duyệt", "Đã duyệt", "Đã nhận phiếu"].map((s) => (
//                     <Select.Option key={s} value={s}>{s}</Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12} md={6} lg={6}>
//               <Form.Item name="Customer" label="Khách hàng">
//                 <Select placeholder="Chọn khách hàng" allowClear showSearch>
//                   {customerList.map((c) => (
//                     <Select.Option key={c} value={c}>{c}</Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12} md={6} lg={6}>
//               <Form.Item name="Store" label="Cửa hàng">
//                 <Select placeholder="Chọn cửa hàng" allowClear showSearch>
//                   {storeList.sort().map((s) => (
//                     <Select.Option key={s} value={s}>{s}</Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12} md={6} lg={6}>
//               <Form.Item name="serialNumber" label="Serial Number">
//                 <Input prefix={<BarcodeOutlined className="text-muted" />} placeholder="Nhập Serial..." allowClear />
//               </Form.Item>
//             </Col>

//             {/* Hàng 2: Text search & Buttons */}
//             <Col xs={24} sm={12} md={12} lg={12}>
//               <Form.Item name="searchText" label="Mã Phiếu / Dự án">
//                 <Input prefix={<FileTextOutlined className="text-muted" />} placeholder="Nhập số phiếu..." allowClear />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12} md={12} lg={12} className="filter-actions">
//               <div className="btn-group">
//                 <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
//                   Tìm kiếm
//                 </Button>
//                 <Button icon={<ReloadOutlined />} onClick={resetFilters}>
//                   Reset
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//         </Form>
//       </Card>

//       {/* --- THỐNG KÊ TRẠNG THÁI --- */}
//       <div className="status-summary-container">
//         {statusList.map(({ label, icon, color }) => (
//           <Tag key={label} color="default" className="status-summary-tag">
//             <span style={{ color: color, fontSize: 16, marginRight: 5 }}>{icon}</span>
//             <span>{label}: <strong>{getStatusCount(label)}</strong></span>
//           </Tag>
//         ))}
//       </div>

//       {/* --- DANH SÁCH (TABLE / CARD LIST) --- */}
//       {!isMobile ? (
//         <Card bordered={false} className="shadow-sm table-card" bodyStyle={{ padding: 0 }}>
//           <Table
//             rowSelection={{
//               selectedRowKeys,
//               onChange: setSelectedRowKeys,
//             }}
//             dataSource={paginatedTickets}
//             rowKey="id"
//             loading={loading}
//             pagination={false}
//             scroll={{ x: 1200 }}
//             onRow={(record) => ({
//               onClick: () => setSelectedTicket(record),
//               onDoubleClick: () => setTicketModal({ selectedTicket: record, isOpen: true }),
//             })}
//             columns={[
//               {
//                 title: "Số Phiếu",
//                 dataIndex: "Votes",
//                 key: "Votes",
//                 width: 150,
//                 fixed: 'left',
//                 render: text => <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>
//               },
//               {
//                 title: "Ticket",
//                 dataIndex: "Ticket",
//                 key: "Ticket",
//                 width: 120,
//               },
//               {
//                 title: "Khách Hàng",
//                 dataIndex: "Customer",
//                 key: "Customer",
//                 ellipsis: true,
//               },
//               {
//                 title: "Cửa Hàng",
//                 dataIndex: "Store",
//                 key: "Store",
//                 width: 100,
//                 align: 'center',
//                 render: text => <strong>{text}</strong>
//               },
//               {
//                 title: "Người Tạo",
//                 dataIndex: "Person",
//                 key: "Person",
//                 width: 150,
//                 ellipsis: true,
//               },
//               {
//                 title: "Trạng Thái",
//                 dataIndex: "Status",
//                 key: "Status",
//                 width: 150,
//                 align: 'center',
//                 render: renderStatusTag,
//               },
//               {
//                 title: "Thông báo",
//                 key: "Notification",
//                 width: 120,
//                 align: 'center',
//                 render: (_, record) => renderNotification(record.createdAt, record.Status),
//               },
//               {
//                 title: "Ngày Tạo",
//                 dataIndex: "createdAt",
//                 key: "createdAt",
//                 width: 160,
//                 align: 'center',
//                 render: (text) => {
//                   const date = new Date(text);
//                   return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
//                 },
//               },
//               {
//                 title: "Xem",
//                 key: "action",
//                 width: 60,
//                 fixed: 'right',
//                 align: 'center',
//                 render: (_, record) => (
//                   <Button
//                     type="text"
//                     icon={<EyeOutlined style={{ color: '#1890ff' }} />}
//                     onClick={() => setTicketModal({ selectedTicket: record, isOpen: true })}
//                   />
//                 )
//               }
//             ]}
//           />
//         </Card>
//       ) : (
//         /* MOBILE VIEW - CARD LIST */
//         <div className="mobile-ticket-list">
//           {paginatedTickets.map((ticket) => (
//             <Card
//               key={ticket.id}
//               className="ticket-card-mobile shadow-sm"
//               bordered={false}
//               onClick={() => setTicketModal({ selectedTicket: ticket, isOpen: true })}
//             >
//               <div className="card-header-mobile">
//                 <span className="ticket-code">{ticket.Votes}</span>
//                 {renderStatusTag(ticket.Status)}
//               </div>
//               <div className="card-body-mobile">
//                 <p><UserOutlined /> <strong>KH:</strong> {ticket.Customer}</p>
//                 <p><ShopOutlined /> <strong>CH:</strong> {ticket.Store}</p>
//                 <p><FileTextOutlined /> <strong>Ticket:</strong> {ticket.Ticket}</p>
//                 <p className="date"><ClockCircleOutlined /> {new Date(ticket.createdAt).toLocaleString('vi-VN')}</p>
//               </div>
//               {renderNotification(ticket.createdAt, ticket.Status) && (
//                 <div className="card-footer-mobile">
//                   {renderNotification(ticket.createdAt, ticket.Status)}
//                 </div>
//               )}
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* PAGINATION */}
//       {totalPages > 1 && (
//         <div className="pagination-container">
//           <ReactPaginate
//             previousLabel="<"
//             nextLabel=">"
//             pageCount={totalPages}
//             onPageChange={handlePageClick}
//             containerClassName="pagination"
//             pageClassName="page-item"
//             pageLinkClassName="page-link"
//             previousClassName="page-item"
//             previousLinkClassName="page-link"
//             nextClassName="page-item"
//             nextLinkClassName="page-link"
//             breakLabel="..."
//             breakClassName="page-item"
//             breakLinkClassName="page-link"
//             activeClassName="active"
//             forcePage={currentPage} // Đồng bộ trang hiện tại
//           />
//         </div>
//       )}

//       <CreateTicketModal
//         open={isCreateTicketModalOpen}
//         onClose={() => setIsCreateTicketModalOpen(false)}
//         reloadTickets={loadTickets}
//       />

//       {ticketModal.isOpen && ticketModal.selectedTicket && (
//         <TicketModal
//           isOpen={ticketModal.isOpen}
//           onClose={() => setTicketModal({ ...ticketModal, isOpen: false })}
//           ticket={ticketModal.selectedTicket}
//           fetchDevices={fetchDevices}
//           fetchTickets={fetchTicket}
//           serialNumberOptions={serialNumberOptions}
//           reloadTickets={loadTickets}
//           modalWidth="90%"
//           modalBodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
//         />
//       )}
//     </div>
//   );
// };

// export default DeviceManagers;

import React, { useEffect, useState } from "react";
import {
  fetchDevicemanager,
  fetchTicket,
  deleteTicketById,
  fetchDeviceDetailHandoverPOS,
} from "../../../../services/storeServices";
import {
  Button,
  Table,
  message,
  Card,
  Row,
  Col,
  Tag,
  Form,
  Select,
  Input,
  Modal,
  Tooltip,
  Badge,
  Statistic,
  List,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FileDoneOutlined,
  FilterOutlined,
  UserOutlined,
  ShopOutlined,
  BarcodeOutlined,
  FileTextOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import CreateTicketModal from "./CreateTicketModal";
import TicketModal from "./TicketModal";
import "./DeviceManagers.scss";

// Component con hiển thị thẻ thống kê
const StatCard = ({ title, value, icon, color, loading }) => (
  <Card bordered={false} className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <Statistic
      title={<span style={{ color: "#8c8c8c", fontWeight: 500 }}>{title}</span>}
      value={value}
      loading={loading}
      valueStyle={{ color: color, fontWeight: "bold" }}
      prefix={<span style={{ marginRight: 8, fontSize: 20 }}>{icon}</span>}
    />
  </Card>
);

const DeviceManagers = () => {
  const [devices, setDevices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [ticketModal, setTicketModal] = useState({
    selectedTicket: null,
    isOpen: false,
  });

  // Filter & Selection states
  const [serialNumberOptions, setSerialNumberOptions] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    const loadData = async () => {
      await loadTickets();
      await fetchDevices();
    };
    loadData();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadTickets();
      }
    }, 60000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  const handleDeleteSelected = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} phiếu đã chọn không?`,
      cancelText: "Hủy",
      okText: "Xóa",
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          for (const id of selectedRowKeys) {
            await deleteTicketById(id);
          }
          message.success("Đã xóa phiếu thành công!");
          setSelectedRowKeys([]);
          loadTickets();
        } catch (error) {
          message.error("Lỗi khi xóa phiếu!");
        }
      },
    });
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetchTicket();
      const ticketsArray = Array.isArray(response.data) ? response.data : (response || []);
      const finalArray = Array.isArray(ticketsArray) ? ticketsArray : [];

      const sortedTickets = finalArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTickets(sortedTickets);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách phiếu.");
    }
    setLoading(false);
  };

  const fetchDevices = async () => {
    try {
      const devicesData = await fetchDevicemanager();
      const data = Array.isArray(devicesData) ? devicesData : [];
      setDevices(data);
      const options = data.map((device) => ({
        value: device.SerialNumber,
        label: device.SerialNumber,
        ...device,
      }));
      setSerialNumberOptions(options);
    } catch (error) {
      console.error("Lỗi tải thiết bị:", error);
    }
  };

  const getStatusCount = (status) => {
    return tickets.filter((ticket) => ticket.Status === status).length;
  };

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // Logic kiểm tra quyền xóa
  const selectedTickets = tickets.filter((t) => selectedRowKeys.includes(t.id));
  const canDelete =
    account?.Leader === true &&
    selectedTickets.length > 0 &&
    selectedTickets.every((ticket) => ticket?.Status === "Đang tạo phiếu");

  // Logic Search
  const searchBySerial = async (serial) => {
    try {
      const response = await fetchDeviceDetailHandoverPOS(serial);
      const handoverRes = response?.data || [];
      if (handoverRes.length > 0) {
        return handoverRes.map((item) => item);
      } else {
        message.warning("Không tìm thấy Serial trong bàn giao POS!");
        return [];
      }
    } catch (error) {
      message.error("Lỗi khi tìm kiếm Serial!");
      return [];
    }
  };

  const handleSearch = async (values) => {
    setLoading(true);
    let results = [...tickets];

    if (values.status) {
      results = results.filter((t) => t?.Status === values.status);
    }
    if (values.serialNumber) {
      const deviceDetails = await searchBySerial(values.serialNumber);
      if (deviceDetails.length > 0) {
        const votesSet = new Set(deviceDetails.map((d) => d.Votes));
        results = results.filter((t) => votesSet.has(t?.Votes));
      } else {
        results = [];
      }
    }
    if (values.Customer) {
      results = results.filter((t) => t?.Customer === values.Customer);
    }
    if (values.Store) {
      results = results.filter((t) => t?.Store === values.Store);
    }
    if (values.searchText) {
      const lowerSearch = values.searchText.toLowerCase();
      results = results.filter(
        (t) =>
          t?.Votes?.toLowerCase().includes(lowerSearch) ||
          t?.Ticket?.toLowerCase().includes(lowerSearch)
      );
    }

    setSearchResults(results);
    setLoading(false);
  };

  const resetFilters = () => {
    form.resetFields();
    setSearchResults(null);
  };

  // Dữ liệu hiển thị cuối cùng
  const displayedData = searchResults || tickets;
  const customerList = [...new Set(tickets.map((t) => t.Customer))].sort();
  const storeList = [...new Set(tickets.map((t) => t.Store))].sort();

  // --- Render Helpers ---
  const renderStatusTag = (status) => {
    let color = "default";
    let icon = null;
    switch (status) {
      case "Đang tạo phiếu": color = "blue"; icon = <SyncOutlined spin />; break;
      case "Đang chờ duyệt": color = "orange"; icon = <ClockCircleOutlined />; break;
      case "Đã duyệt": color = "success"; icon = <CheckCircleOutlined />; break;
      case "Đã nhận phiếu": color = "purple"; icon = <FileDoneOutlined />; break;
      default: break;
    }
    return <Tag icon={icon} color={color}>{status}</Tag>;
  };

  const renderNotification = (createdAt, status) => {
    const createdTime = new Date(createdAt);
    const diffInHours = (new Date() - createdTime) / (1000 * 60 * 60);

    if (status === "Đang chờ duyệt" && diffInHours > 24) {
      return <Tooltip title="Quá 24h chưa duyệt"><Badge status="warning" /></Tooltip>;
    }
    if (status === "Đang tạo phiếu" && diffInHours > 2) {
      return <Tooltip title="Quá 2h chưa hoàn tất"><Badge status="error" /></Tooltip>;
    }
    return null;
  };

  const columns = [
    {
      title: "Mã Phiếu",
      dataIndex: "Votes",
      key: "Votes",
      fixed: 'left',
      width: 140,
      render: (text, record) => (
        <span style={{ fontWeight: 600, color: '#1890ff', cursor: 'pointer' }}>
          {text} {renderNotification(record.createdAt, record.Status)}
        </span>
      )
    },
    { title: "Ticket", dataIndex: "Ticket", key: "Ticket", width: 120 },
    { title: "Khách Hàng", dataIndex: "Customer", key: "Customer", width: 150, ellipsis: true },
    { title: "Cửa Hàng", dataIndex: "Store", key: "Store", width: 100, align: 'center' },
    { title: "Người Tạo", dataIndex: "Person", key: "Person", width: 140, ellipsis: true },
    {
      title: "Trạng Thái",
      dataIndex: "Status",
      key: "Status",
      width: 150,
      align: 'center',
      render: renderStatusTag
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      align: 'right',
      render: (text) => new Date(text).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    {
      title: "Hành động",
      key: "action",
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined style={{ color: "#1890ff" }} />}
          onClick={(e) => { e.stopPropagation(); setTicketModal({ selectedTicket: record, isOpen: true }); }}
        />
      )
    }
  ];

  return (
    <div className="device-managers-container">
      {/* 1. Header Title & Stats */}
      <div className="header-section">
        <Typography.Title level={3} style={{ marginBottom: 20, color: '#001529' }}>
          <AppstoreOutlined /> Quản Lý Phiếu Thiết Bị
        </Typography.Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Đang tạo phiếu" value={getStatusCount("Đang tạo phiếu")} icon={<SyncOutlined spin />} color="#1890ff" loading={loading} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Đang chờ duyệt" value={getStatusCount("Đang chờ duyệt")} icon={<ClockCircleOutlined />} color="#faad14" loading={loading} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Đã duyệt" value={getStatusCount("Đã duyệt")} icon={<CheckCircleOutlined />} color="#52c41a" loading={loading} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Đã nhận phiếu" value={getStatusCount("Đã nhận phiếu")} icon={<FileDoneOutlined />} color="#722ed1" loading={loading} />
          </Col>
        </Row>
      </div>

      {/* 2. Filter & Actions */}
      <Card bordered={false} className="filter-card" style={{ marginTop: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div className="title-filter"><FilterOutlined /> Bộ lọc tìm kiếm</div>
          <div className="action-buttons">
            {canDelete && (
              <Button danger type="primary" icon={<DeleteOutlined />} onClick={handleDeleteSelected}>
                Xóa ({selectedRowKeys.length})
              </Button>
            )}
            {account.WritePOS && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateTicketModalOpen(true)}>
                Tạo Phiếu Mới
              </Button>
            )}
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={6} lg={5}>
              <Form.Item name="status">
                <Select placeholder="Trạng thái" allowClear>
                  {["Đang tạo phiếu", "Đang chờ duyệt", "Đã duyệt", "Đã nhận phiếu"].map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={5}>
              <Form.Item name="Customer">
                <Select placeholder="Khách hàng" allowClear showSearch>
                  {customerList.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={5}>
              <Form.Item name="Store">
                <Select placeholder="Cửa hàng" allowClear showSearch>
                  {storeList.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={5}>
              <Form.Item name="searchText">
                <Input prefix={<FileTextOutlined />} placeholder="Mã phiếu / Ticket" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4} style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} block loading={loading}>Tìm</Button>
              <Button icon={<ReloadOutlined />} onClick={resetFilters} />
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 3. Table Data */}
      <div style={{ marginTop: 16 }}>
        {!isMobile ? (
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            columns={columns}
            dataSource={displayedData}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `Tổng ${total} phiếu`
            }}
            scroll={{ x: 1200 }}
            className="custom-table"
            onRow={(record) => ({
              onDoubleClick: () => setTicketModal({ selectedTicket: record, isOpen: true }),
            })}
          />
        ) : (
          <List
            pagination={{ pageSize: 10, align: 'center' }}
            dataSource={displayedData}
            renderItem={(item) => (
              <Card
                className="mobile-card-item"
                onClick={() => setTicketModal({ selectedTicket: item, isOpen: true })}
                style={{ marginBottom: 12, borderRadius: 8, borderLeft: item.Status === 'Đang tạo phiếu' ? '4px solid #1890ff' : '4px solid #ccc' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{item.Votes}</span>
                  {renderStatusTag(item.Status)}
                </div>
                <div className="card-row"><UserOutlined /> {item.Customer}</div>
                <div className="card-row"><ShopOutlined /> {item.Store}</div>
                <div className="card-row"><BarcodeOutlined /> Ticket: {item.Ticket}</div>
                <div className="card-row date"><ClockCircleOutlined /> {new Date(item.createdAt).toLocaleString('vi-VN')}</div>
              </Card>
            )}
          />
        )}
      </div>

      {/* Modals */}
      <CreateTicketModal
        open={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        reloadTickets={loadTickets}
      />

      {ticketModal.isOpen && ticketModal.selectedTicket && (
        <TicketModal
          isOpen={ticketModal.isOpen}
          onClose={() => setTicketModal({ ...ticketModal, isOpen: false })}
          ticket={ticketModal.selectedTicket}
          fetchDevices={fetchDevices}
          fetchTickets={fetchTicket}
          serialNumberOptions={serialNumberOptions}
          reloadTickets={loadTickets}
        />
      )}
    </div>
  );
};

export default DeviceManagers;
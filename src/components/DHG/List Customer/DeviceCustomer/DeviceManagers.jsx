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
//   Statistic,
//   List,
//   Typography,
// } from "antd";
// import {
//   CheckCircleOutlined,
//   SyncOutlined,
//   ClockCircleOutlined,
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
//   AppstoreOutlined,
// } from "@ant-design/icons";
// import CreateTicketModal from "./CreateTicketModal";
// import TicketModal from "./TicketModal";
// import "./DeviceManagers.scss";

// // Component con hiển thị thẻ thống kê
// const StatCard = ({ title, value, icon, color, loading }) => (
//   <Card bordered={false} className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
//     <Statistic
//       title={<span style={{ color: "#8c8c8c", fontWeight: 500 }}>{title}</span>}
//       value={value}
//       loading={loading}
//       valueStyle={{ color: color, fontWeight: "bold" }}
//       prefix={<span style={{ marginRight: 8, fontSize: 20 }}>{icon}</span>}
//     />
//   </Card>
// );

// const DeviceManagers = () => {
//   const [devices, setDevices] = useState([]);
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Modal states
//   const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
//   const [ticketModal, setTicketModal] = useState({
//     selectedTicket: null,
//     isOpen: false,
//   });

//   // Filter & Selection states
//   const [serialNumberOptions, setSerialNumberOptions] = useState([]);
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
//       const ticketsArray = Array.isArray(response.data) ? response.data : (response || []);
//       const finalArray = Array.isArray(ticketsArray) ? ticketsArray : [];

//       const sortedTickets = finalArray.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setTickets(sortedTickets);
//     } catch (error) {
//       console.error(error);
//       message.error("Không thể tải danh sách phiếu.");
//     }
//     setLoading(false);
//   };

//   const fetchDevices = async () => {
//     try {
//       const devicesData = await fetchDevicemanager();
//       const data = Array.isArray(devicesData) ? devicesData : [];
//       setDevices(data);
//       const options = data.map((device) => ({
//         value: device.SerialNumber,
//         label: device.SerialNumber,
//         ...device,
//       }));
//       setSerialNumberOptions(options);
//     } catch (error) {
//       console.error("Lỗi tải thiết bị:", error);
//     }
//   };

//   const getStatusCount = (status) => {
//     return tickets.filter((ticket) => ticket.Status === status).length;
//   };

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   // Logic kiểm tra quyền xóa
//   const selectedTickets = tickets.filter((t) => selectedRowKeys.includes(t.id));
//   const canDelete =
//     account?.Leader === true &&
//     selectedTickets.length > 0 &&
//     selectedTickets.every((ticket) => ticket?.Status === "Đang tạo phiếu");

//   // Logic Search
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
//           t?.Ticket?.toLowerCase().includes(lowerSearch)
//       );
//     }

//     setSearchResults(results);
//     setLoading(false);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setSearchResults(null);
//   };

//   // Dữ liệu hiển thị cuối cùng
//   const displayedData = searchResults || tickets;
//   const customerList = [...new Set(tickets.map((t) => t.Customer))].sort();
//   const storeList = [...new Set(tickets.map((t) => t.Store))].sort();

//   // --- Render Helpers ---
//   const renderStatusTag = (status) => {
//     let color = "default";
//     let icon = null;
//     switch (status) {
//       case "Đang tạo phiếu": color = "blue"; icon = <SyncOutlined spin />; break;
//       case "Đang chờ duyệt": color = "orange"; icon = <ClockCircleOutlined />; break;
//       case "Đã duyệt": color = "success"; icon = <CheckCircleOutlined />; break;
//       case "Đã nhận phiếu": color = "purple"; icon = <FileDoneOutlined />; break;
//       default: break;
//     }
//     return <Tag icon={icon} color={color}>{status}</Tag>;
//   };

//   const renderNotification = (createdAt, status) => {
//     const createdTime = new Date(createdAt);
//     const diffInHours = (new Date() - createdTime) / (1000 * 60 * 60);

//     if (status === "Đang chờ duyệt" && diffInHours > 24) {
//       return <Tooltip title="Quá 24h chưa duyệt"><Badge status="warning" /></Tooltip>;
//     }
//     if (status === "Đang tạo phiếu" && diffInHours > 2) {
//       return <Tooltip title="Quá 2h chưa hoàn tất"><Badge status="error" /></Tooltip>;
//     }
//     return null;
//   };

//   const columns = [
//     {
//       title: "Mã Phiếu",
//       dataIndex: "Votes",
//       key: "Votes",
//       fixed: 'left',
//       width: 140,
//       render: (text, record) => (
//         <span style={{ fontWeight: 600, color: '#1890ff', cursor: 'pointer' }}>
//           {text} {renderNotification(record.createdAt, record.Status)}
//         </span>
//       )
//     },
//     { title: "Ticket", dataIndex: "Ticket", key: "Ticket", width: 120 },
//     { title: "Khách Hàng", dataIndex: "Customer", key: "Customer", width: 150, ellipsis: true },
//     { title: "Cửa Hàng", dataIndex: "Store", key: "Store", width: 100, align: 'center' },
//     { title: "Người Tạo", dataIndex: "Person", key: "Person", width: 140, ellipsis: true },
//     {
//       title: "Trạng Thái",
//       dataIndex: "Status",
//       key: "Status",
//       width: 150,
//       align: 'center',
//       render: renderStatusTag
//     },
//     {
//       title: "Ngày Tạo",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       width: 160,
//       align: 'right',
//       render: (text) => new Date(text).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       width: 80,
//       fixed: 'right',
//       align: 'center',
//       render: (_, record) => (
//         <Button
//           type="text"
//           icon={<EyeOutlined style={{ color: "#1890ff" }} />}
//           onClick={(e) => { e.stopPropagation(); setTicketModal({ selectedTicket: record, isOpen: true }); }}
//         />
//       )
//     }
//   ];

//   return (
//     <div className="device-managers-container">
//       {/* 1. Header Title & Stats */}
//       <div className="header-section">
//         <Typography.Title level={3} style={{ marginBottom: 20, color: '#001529' }}>
//           <AppstoreOutlined /> Quản Lý Phiếu Thiết Bị
//         </Typography.Title>

//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={12} md={6}>
//             <StatCard title="Đang tạo phiếu" value={getStatusCount("Đang tạo phiếu")} icon={<SyncOutlined spin />} color="#1890ff" loading={loading} />
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <StatCard title="Đang chờ duyệt" value={getStatusCount("Đang chờ duyệt")} icon={<ClockCircleOutlined />} color="#faad14" loading={loading} />
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <StatCard title="Đã duyệt" value={getStatusCount("Đã duyệt")} icon={<CheckCircleOutlined />} color="#52c41a" loading={loading} />
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <StatCard title="Đã nhận phiếu" value={getStatusCount("Đã nhận phiếu")} icon={<FileDoneOutlined />} color="#722ed1" loading={loading} />
//           </Col>
//         </Row>
//       </div>

//       {/* 2. Filter & Actions */}
//       <Card bordered={false} className="filter-card" style={{ marginTop: 16, borderRadius: 8 }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
//           <div className="title-filter"><FilterOutlined /> Bộ lọc tìm kiếm</div>
//           <div className="action-buttons">
//             {canDelete && (
//               <Button danger type="primary" icon={<DeleteOutlined />} onClick={handleDeleteSelected}>
//                 Xóa ({selectedRowKeys.length})
//               </Button>
//             )}
//             {account.WritePOS && (
//               <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateTicketModalOpen(true)}>
//                 Tạo Phiếu Mới
//               </Button>
//             )}
//           </div>
//         </div>

//         <Form form={form} layout="vertical" onFinish={handleSearch}>
//           <Row gutter={[16, 0]}>
//             <Col xs={24} sm={12} md={6} lg={5}>
//               <Form.Item name="status">
//                 <Select placeholder="Trạng thái" allowClear>
//                   {["Đang tạo phiếu", "Đang chờ duyệt", "Đã duyệt", "Đã nhận phiếu"].map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={6} lg={5}>
//               <Form.Item name="Customer">
//                 <Select placeholder="Khách hàng" allowClear showSearch>
//                   {customerList.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={6} lg={5}>
//               <Form.Item name="Store">
//                 <Select placeholder="Cửa hàng" allowClear showSearch>
//                   {storeList.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={6} lg={5}>
//               <Form.Item name="searchText">
//                 <Input prefix={<FileTextOutlined />} placeholder="Mã phiếu / Ticket" />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={24} md={24} lg={4} style={{ display: 'flex', gap: 8 }}>
//               <Button type="primary" htmlType="submit" icon={<SearchOutlined />} block loading={loading}>Tìm</Button>
//               <Button icon={<ReloadOutlined />} onClick={resetFilters} />
//             </Col>
//           </Row>
//         </Form>
//       </Card>

//       {/* 3. Table Data */}
//       <div style={{ marginTop: 16 }}>
//         {!isMobile ? (
//           <Table
//             rowSelection={{
//               selectedRowKeys,
//               onChange: setSelectedRowKeys,
//             }}
//             columns={columns}
//             dataSource={displayedData}
//             rowKey="id"
//             loading={loading}
//             pagination={{
//               pageSize: 10,
//               showSizeChanger: true,
//               pageSizeOptions: ['10', '20', '50'],
//               showTotal: (total) => `Tổng ${total} phiếu`
//             }}
//             scroll={{ x: 1200 }}
//             className="custom-table"
//             onRow={(record) => ({
//               onDoubleClick: () => setTicketModal({ selectedTicket: record, isOpen: true }),
//             })}
//           />
//         ) : (
//           <List
//             pagination={{ pageSize: 10, align: 'center' }}
//             dataSource={displayedData}
//             renderItem={(item) => (
//               <Card
//                 className="mobile-card-item"
//                 onClick={() => setTicketModal({ selectedTicket: item, isOpen: true })}
//                 style={{ marginBottom: 12, borderRadius: 8, borderLeft: item.Status === 'Đang tạo phiếu' ? '4px solid #1890ff' : '4px solid #ccc' }}
//               >
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                   <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{item.Votes}</span>
//                   {renderStatusTag(item.Status)}
//                 </div>
//                 <div className="card-row"><UserOutlined /> {item.Customer}</div>
//                 <div className="card-row"><ShopOutlined /> {item.Store}</div>
//                 <div className="card-row"><BarcodeOutlined /> Ticket: {item.Ticket}</div>
//                 <div className="card-row date"><ClockCircleOutlined /> {new Date(item.createdAt).toLocaleString('vi-VN')}</div>
//               </Card>
//             )}
//           />
//         )}
//       </div>

//       {/* Modals */}
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
  Descriptions,
  Space,
  Tooltip,
  Divider,
  Typography,
  Statistic,
  Popconfirm
} from "antd";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  ExclamationCircleOutlined,
  FileTextTwoTone,
  CheckSquareTwoTone,
  SearchOutlined,
  EditTwoTone,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  BarcodeOutlined,
  UserOutlined,
  ShopOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import CreateTicketModal from "./CreateTicketModal";
import TicketModal from "./TicketModal";
import "./DeviceManagers.scss";

const { Title, Text } = Typography;

const DeviceManagers = () => {
  // --- STATE MANAGEMENT ---
  const [devices, setDevices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [ticketModal, setTicketModal] = useState({
    selectedTicket: null,
    isOpen: false,
  });
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    selectedTicket: null,
    devices: [] // Danh sách thiết bị trong modal chi tiết
  });

  // Filter & Selection states
  const [serialNumberOptions, setSerialNumberOptions] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // Kết quả tìm kiếm
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // Dòng đang chọn (highlight)

  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // User info
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // Dữ liệu hiển thị (ưu tiên kết quả tìm kiếm nếu có)
  const displayedData = searchResults || tickets;

  // --- EFFECTS ---
  useEffect(() => {
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

    return () => clearInterval(interval);
  }, []);

  // --- API CALLS ---
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

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) return;

    // Logic kiểm tra quyền (chỉ Leader xóa phiếu đang tạo)
    const selectedItems = tickets.filter((t) => selectedRowKeys.includes(t.id));
    const isInvalid = selectedItems.some(t => t.Status !== "Đang tạo phiếu");

    if (!account?.Leader && isInvalid) {
      message.error("Chỉ có thể xóa phiếu ở trạng thái 'Đang tạo phiếu'!");
      return;
    }

    setLoading(true);
    try {
      for (const id of selectedRowKeys) {
        await deleteTicketById(id);
      }
      message.success(`Đã xóa ${selectedRowKeys.length} phiếu thành công!`);
      setSelectedRowKeys([]);
      await loadTickets();
    } catch (error) {
      message.error("Lỗi khi xóa phiếu!");
    } finally {
      setLoading(false);
    }
  };

  // --- SEARCH HANDLERS ---
  const searchBySerial = async (serial) => {
    try {
      const response = await fetchDeviceDetailHandoverPOS(serial);
      const handoverRes = response?.data || [];
      return handoverRes.length > 0 ? handoverRes : [];
    } catch (error) {
      return [];
    }
  };

  const handleSearch = async (values) => {
    setLoading(true);
    let results = [...tickets];

    if (values.status) {
      results = results.filter((t) => t?.Status === values.status);
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

    // Tìm kiếm đặc biệt theo Serial (Async)
    if (values.serialNumber) {
      const deviceDetails = await searchBySerial(values.serialNumber);
      if (deviceDetails.length > 0) {
        const votesSet = new Set(deviceDetails.map((d) => d.Votes));
        results = results.filter((t) => votesSet.has(t?.Votes));
      } else {
        results = []; // Không tìm thấy serial nào khớp
      }
    }

    setSearchResults(results);
    setLoading(false);
    setPagination({ ...pagination, current: 1 });
  };

  const resetFilters = () => {
    form.resetFields();
    setSearchResults(null);
  };

  // --- UI HELPERS ---
  const getStatusCount = (status) => tickets.filter((ticket) => ticket.Status === status).length;

  const renderStatusTag = (status) => {
    const config = {
      "Đang tạo phiếu": { color: "blue", icon: <EditTwoTone /> },
      "Đang chờ duyệt": { color: "warning", icon: <ClockCircleTwoTone twoToneColor="#faad14" /> },
      "Đã duyệt": { color: "success", icon: <CheckCircleTwoTone twoToneColor="#52c41a" /> },
      "Đã nhận phiếu": { color: "purple", icon: <CheckSquareTwoTone twoToneColor="#722ed1" /> },
    };
    const item = config[status] || { color: "default", icon: null };
    return <Tag color={item.color} icon={item.icon}>{status}</Tag>;
  };

  const renderNotification = (createdAt, status) => {
    const diffInHours = dayjs().diff(dayjs(createdAt), 'hour');
    if (status === "Đang chờ duyệt" && diffInHours > 24) {
      return <Tag color="orange" icon={<ExclamationCircleOutlined />}>Delay duyệt</Tag>;
    }
    if (status === "Đang tạo phiếu" && diffInHours > 2) {
      return <Tag color="red" icon={<ExclamationCircleOutlined />}>Chưa hoàn tất</Tag>;
    }
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
      title: "Mã phiếu",
      key: "Info",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1890ff' }}>{record.Votes}</Text>
          {/* Notification Tags if any */}
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
      title: "Ticket / Người tạo",
      key: "TicketPerson",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.Ticket && <Text><BarcodeOutlined /> {record.Ticket}</Text>}
          <Text type="secondary"><UserOutlined /> {record.Person}</Text>
        </Space>
      )
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
            onClick={(e) => {
              e.stopPropagation();
              setDetailModal({ selectedTicket: record, isOpen: true });
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const statusSummaryList = [
    { label: "Đang tạo", key: "Đang tạo phiếu", color: "#1890ff" },
    { label: "Chờ duyệt", key: "Đang chờ duyệt", color: "#faad14" },
    { label: "Đã duyệt", key: "Đã duyệt", color: "#52c41a" },
    { label: "Hoàn tất", key: "Đã nhận phiếu", color: "#722ed1" },
  ];

  const canDelete = account?.Leader === true && selectedRowKeys.length > 0;

  return (
    <div className="device-managers-container">
      {/* --- HEADER SUMMARY --- */}
      <Card bordered={false} className="mb-3 shadow-sm header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>Quản Lý Phiếu Thiết Bị</Title>
            <Text type="secondary">Quản lý bàn giao, thu hồi và trạng thái phiếu</Text>
          </Col>
          <Col>
            <Space size="large" wrap>
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
                <Input placeholder="Mã phiếu, Ticket..." prefix={<SearchOutlined className="text-muted" />} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" allowClear>
                  {["Đang tạo phiếu", "Đang chờ duyệt", "Đã duyệt", "Đã nhận phiếu"].map(s => (
                    <Select.Option key={s} value={s}>{s}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="Customer" label="Khách hàng">
                <Select placeholder="Khách hàng" allowClear showSearch optionFilterProp="children">
                  {[...new Set(tickets.map(t => t.Customer))].filter(Boolean).sort().map(c => (
                    <Select.Option key={c} value={c}>{c}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="Store" label="Cửa hàng">
                <Select placeholder="Cửa hàng" allowClear showSearch optionFilterProp="children">
                  {[...new Set(tickets.map(t => t.Store))].filter(Boolean).sort().map(s => (
                    <Select.Option key={s} value={s}>{s}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="serialNumber" label="Serial Number">
                <Input prefix={<BarcodeOutlined className="text-muted" />} placeholder="Tìm theo Serial" allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={4} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Form.Item label=" ">
                <Space wrap>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                  <Button icon={<ReloadOutlined />} onClick={resetFilters}>Làm mới</Button>

                  {canDelete && (
                    <Popconfirm
                      title="Xóa phiếu"
                      description={`Bạn có chắc muốn xóa ${selectedRowKeys.length} phiếu này?`}
                      onConfirm={handleDeleteSelected}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                  )}

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
          dataSource={displayedData}
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

      {/* Detail Modal (Quick View) */}
      <Modal
        title={<Space><FileTextTwoTone /> Chi tiết phiếu: {detailModal.selectedTicket?.Votes}</Space>}
        open={detailModal.isOpen}
        onCancel={() => setDetailModal({ isOpen: false, selectedTicket: null })}
        footer={[
          <Button key="close" onClick={() => setDetailModal({ isOpen: false, selectedTicket: null })}>Đóng</Button>,
          <Button key="edit" type="primary" onClick={() => {
            setTicketModal({ selectedTicket: detailModal.selectedTicket, isOpen: true });
            setDetailModal({ isOpen: false, selectedTicket: null });
          }}>
            Xem / Cập nhật chi tiết
          </Button>
        ]}
        width={800}
      >
        {detailModal.selectedTicket && (
          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} size="small">
            <Descriptions.Item label="Mã phiếu">{detailModal.selectedTicket.Votes}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{renderStatusTag(detailModal.selectedTicket.Status)}</Descriptions.Item>
            <Descriptions.Item label="Khách hàng">{detailModal.selectedTicket.Customer}</Descriptions.Item>
            <Descriptions.Item label="Cửa hàng">{detailModal.selectedTicket.Store}</Descriptions.Item>
            <Descriptions.Item label="Người tạo">{detailModal.selectedTicket.Person}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{dayjs(detailModal.selectedTicket.createdAt).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
            <Descriptions.Item label="Ticket">{detailModal.selectedTicket.Ticket || '---'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Create Modal */}
      <CreateTicketModal
        open={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        reloadTickets={loadTickets}
      />

      {/* Edit/Action Modal */}
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
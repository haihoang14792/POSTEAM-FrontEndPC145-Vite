// import React, { useState, useEffect } from "react";
// import { UserOutlined, SettingOutlined } from "@ant-design/icons";
// import {
//   Avatar,
//   Tag,
//   Spin,
//   message,
//   Tooltip,
//   Input,
//   Modal,
//   Button,
//   Checkbox,
//   Table,
//   Space,
// } from "antd";
// import { fetchUsers, updateUser } from "../../../services/abicoServices";

// // 🟢 Mapping quyền trong DB -> Nhãn hiển thị
// const systemPermissions = {
//   Exportlist: "Quản lý xuất kho",
//   Purchase: "Quản lý nhập hàng",
//   Invoice: "Quản lý hóa đơn",
//   ReadPOS: "Truy cập trang",
//   WritePOS: "Tạo phiếu",
//   Exportlister: "Người mượn hàng",
//   Purchaseer: "Người mua hàng",
//   Invoiceer: "Người xuất hóa đơn",
//   Leader: "Leader",
//   Warehouse: "Quản lý kho",
//   Devicelist: "Quản lý thiết bị",
//   Receivelist: "Người nhận phiếu",
//   ReadWarehouse: "Truy cập kho",
//   Receivelistkho: "Người nhận phiếu",
//   Projecter: "Người quản lý dự án"
// };

// // 🟢 Gom quyền theo nhóm hiển thị
// const permissionGroups = {
//   "Kho hàng": ["Exportlist", "Warehouse", "ReadWarehouse", "Receivelistkho"],
//   "Nhập hàng": ["Purchase", "Purchaseer", "Exportlister"],
//   "Hóa đơn": ["Invoice", "Invoiceer"],
//   "Thiết bị": ["Devicelist", "Receivelist"],
//   "Trang POS": ["ReadPOS", "WritePOS", "Projecter"],
//   "Tổ chức": ["Leader"],
// };

// const UserPermissions = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userPermissions, setUserPermissions] = useState({});

//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const data = await fetchUsers();
//         setUsers(data);
//       } catch (error) {
//         console.error("Lỗi loadUsers:", error);
//         message.error("Không thể tải danh sách người dùng");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUsers();
//   }, []);

//   const filteredUsers = users.filter(
//     (user) =>
//       user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openPermissionModal = (user) => {
//     setSelectedUser(user);

//     // Lấy quyền từ user sang object { Exportlist, Purchase, Invoice }
//     setUserPermissions({
//       Exportlist: user.Exportlist ?? false,
//       Purchase: user.Purchase ?? false,
//       Invoice: user.Invoice ?? false,
//       ReadPOS: user.ReadPOS ?? false,
//       WritePOS: user.WritePOS ?? false,
//       Exportlister: user.Exportlister ?? false,
//       Purchaseer: user.Purchaseer ?? false,
//       Invoiceer: user.Invoiceer ?? false,
//       Leader: user.Leader ?? false,
//       Warehouse: user.Warehouse ?? false,
//       Devicelist: user.Devicelist ?? false,
//       Receivelist: user.Receivelist ?? false,
//       ReadWarehouse: user.ReadWarehouse ?? false,
//       Receivelistkho: user.Receivelistkho ?? false,
//       Projecter: user.Projecter ?? false,
//     });
//     setIsModalOpen(true);
//   };

//   const confirmPermissionChange = async () => {
//     try {
//       await updateUser(selectedUser.id, userPermissions); // Gửi object {Exportlist, Purchase, Invoice}

//       message.success("Cập nhật quyền thành công");

//       // Update lại danh sách users local
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === selectedUser.id ? { ...u, ...userPermissions } : u
//         )
//       );
//     } catch (error) {
//       console.error("❌ Lỗi update permission:", error);
//       message.error("Cập nhật quyền thất bại");
//     }
//     setIsModalOpen(false);
//   };

//   const columns = [
//     {
//       title: "Người dùng",
//       dataIndex: "Name",
//       key: "name",
//       render: (_, user) => (
//         <Space>
//           <Avatar
//             size={40}
//             icon={<UserOutlined />}
//             src={user.qr_code_url?.split(",")[0]}
//           />
//           <div>
//             <div className="font-semibold">{user.Name || user.username}</div>
//             <div className="text-gray-500 text-sm">{user.email}</div>
//           </div>
//         </Space>
//       ),
//     },
//     {
//       title: "Vị trí",
//       dataIndex: "Position",
//       key: "position",
//       render: (pos) =>
//         pos ? (
//           <Tag color="blue" className="rounded-full">
//             {pos}
//           </Tag>
//         ) : (
//           "-"
//         ),
//     },
//     {
//       title: "Phòng ban",
//       dataIndex: "Department",
//       key: "department",
//       render: (dep) =>
//         dep ? (
//           <Tag color="green" className="rounded-full">
//             {dep}
//           </Tag>
//         ) : (
//           "-"
//         ),
//     },
//     {
//       title: "Phân quyền",
//       key: "action",
//       align: "center",
//       render: (_, user) => (
//         <Tooltip title="Phân quyền">
//           <Button
//             shape="circle"
//             icon={<SettingOutlined />}
//             onClick={() => openPermissionModal(user)}
//           />
//         </Tooltip>
//       ),
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spin size="large" tip="Đang tải danh sách người dùng..." />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Quản lý quyền người dùng</h1>
//           <Input.Search
//             placeholder="Tìm kiếm theo tên, username hoặc email"
//             allowClear
//             style={{ width: 300 }}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <Table
//           columns={columns}
//           dataSource={filteredUsers}
//           rowKey="id"
//           bordered
//           pagination={{ pageSize: 8 }}
//         />
//       </div>
//       <Modal
//         title={`Phân quyền cho ${selectedUser?.Name || selectedUser?.username}`}
//         open={isModalOpen}
//         onOk={confirmPermissionChange}
//         onCancel={() => setIsModalOpen(false)}
//         okText="Xác nhận"
//         cancelText="Hủy"
//         width={800}
//       >
//         <div className="grid grid-cols-2 gap-4">
//           {Object.entries(permissionGroups).map(([groupName, keys]) => (
//             <div key={groupName} className="border p-3 rounded-md">
//               {/* Checkbox cha: chọn toàn bộ group */}
//               <Checkbox
//                 indeterminate={
//                   keys.some((k) => userPermissions[k]) &&
//                   !keys.every((k) => userPermissions[k])
//                 }
//                 checked={keys.every((k) => userPermissions[k])}
//                 onChange={(e) => {
//                   const checked = e.target.checked;
//                   const updated = {};
//                   keys.forEach((k) => {
//                     updated[k] = checked;
//                   });
//                   setUserPermissions((prev) => ({ ...prev, ...updated }));
//                 }}
//               >
//                 <b>{groupName}</b>
//               </Checkbox>

//               {/* Checkbox con */}
//               <div className="ml-4 mt-2 flex flex-col gap-1">
//                 {keys.map((key) => (
//                   <Checkbox
//                     key={key}
//                     checked={userPermissions[key]}
//                     onChange={(e) =>
//                       setUserPermissions((prev) => ({
//                         ...prev,
//                         [key]: e.target.checked,
//                       }))
//                     }
//                   >
//                     {systemPermissions[key]}
//                   </Checkbox>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default UserPermissions;



// import React, { useState, useEffect } from "react";
// import {
//   UserOutlined,
//   SettingOutlined,
//   SearchOutlined,
//   ReloadOutlined,
//   SafetyCertificateOutlined,
//   CheckCircleOutlined,
//   ShopOutlined,
//   ShoppingCartOutlined,
//   FileTextOutlined,
//   LaptopOutlined,
//   DesktopOutlined,
//   TeamOutlined,
//   SaveOutlined,
// } from "@ant-design/icons";
// import {
//   Avatar,
//   Tag,
//   Spin,
//   message,
//   Input,
//   Drawer,
//   Button,
//   Table,
//   Space,
//   Switch,
//   Card,
//   Typography,
//   Badge,
//   Tooltip,
// } from "antd";
// import { fetchUsers, updateUser } from "../../../services/abicoServices";
// import "./UserPermissions.scss"; // Import file SCSS

// const { Title, Text } = Typography;

// // Configuration: Icon & Màu sắc cho từng nhóm quyền
// const GROUP_CONFIG = {
//   "Kho hàng": { icon: <ShopOutlined />, color: "#1890ff" }, // Xanh dương
//   "Nhập hàng": { icon: <ShoppingCartOutlined />, color: "#52c41a" }, // Xanh lá
//   "Hóa đơn": { icon: <FileTextOutlined />, color: "#faad14" }, // Vàng cam
//   "Thiết bị": { icon: <LaptopOutlined />, color: "#722ed1" }, // Tím
//   "Trang POS": { icon: <DesktopOutlined />, color: "#f5222d" }, // Đỏ
//   "Tổ chức": { icon: <TeamOutlined />, color: "#13c2c2" }, // Cyan
// };

// const SYSTEM_PERMISSIONS = {
//   Exportlist: "Quản lý xuất kho",
//   Purchase: "Quản lý nhập hàng",
//   Invoice: "Quản lý hóa đơn",
//   ReadPOS: "Truy cập trang POS",
//   WritePOS: "Tạo phiếu POS",
//   Exportlister: "Người mượn hàng",
//   Purchaseer: "Người mua hàng",
//   Invoiceer: "Người xuất hóa đơn",
//   Leader: "Lãnh đạo (Leader)",
//   Warehouse: "Quản lý kho",
//   Devicelist: "Quản lý thiết bị",
//   Receivelist: "Người nhận phiếu thiết bị",
//   ReadWarehouse: "Truy cập kho",
//   Receivelistkho: "Người nhận phiếu kho",
//   Projecter: "Quản lý dự án",
// };

// const PERMISSION_GROUPS = {
//   "Kho hàng": ["Warehouse", "Exportlist", "ReadWarehouse", "Receivelistkho"],
//   "Nhập hàng": ["Purchase", "Purchaseer", "Exportlister"],
//   "Hóa đơn": ["Invoice", "Invoiceer"],
//   "Thiết bị": ["Devicelist", "Receivelist"],
//   "Trang POS": ["ReadPOS", "WritePOS", "Projecter"],
//   "Tổ chức": ["Leader"],
// };

// const UserPermissions = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userPermissions, setUserPermissions] = useState({});
//   const [saving, setSaving] = useState(false);

//   // Load Data
//   const loadUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchUsers();
//       // Sắp xếp theo tên
//       const sorted = data.sort((a, b) => (a.Name || "").localeCompare(b.Name || ""));
//       setUsers(sorted);
//     } catch (error) {
//       console.error("Error loading users:", error);
//       message.error("Không thể tải danh sách nhân sự.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   // Filter Logic
//   const filteredUsers = users.filter(
//     (user) =>
//       user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Actions
//   const handleOpenDrawer = (user) => {
//     setSelectedUser(user);
//     const perms = {};
//     Object.keys(SYSTEM_PERMISSIONS).forEach((key) => {
//       perms[key] = user[key] || false;
//     });
//     setUserPermissions(perms);
//     setDrawerVisible(true);
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await updateUser(selectedUser.id, userPermissions);
//       message.success("Cập nhật quyền hạn thành công!");

//       // Update local state UI
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === selectedUser.id ? { ...u, ...userPermissions } : u
//         )
//       );
//       setDrawerVisible(false);
//     } catch (error) {
//       console.error("Save error:", error);
//       message.error("Lỗi khi lưu dữ liệu.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const togglePermission = (key, checked) => {
//     setUserPermissions((prev) => ({ ...prev, [key]: checked }));
//   };

//   const toggleGroup = (groupKeys, checked) => {
//     const updates = {};
//     groupKeys.forEach((k) => (updates[k] = checked));
//     setUserPermissions((prev) => ({ ...prev, ...updates }));
//   };

//   // UI Components
//   const columns = [
//     {
//       title: "NHÂN SỰ",
//       dataIndex: "Name",
//       key: "name",
//       width: "35%",
//       render: (_, user) => (
//         <div className="user-cell">
//           <Avatar
//             size={44}
//             src={user.qr_code_url?.split(",")[0]}
//             icon={<UserOutlined />}
//             className="user-avatar"
//           />
//           <div className="user-info">
//             <Text strong className="user-name">{user.Name || user.username}</Text>
//             <Text type="secondary" className="user-email">{user.email}</Text>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "CHỨC VỤ / PHÒNG BAN",
//       dataIndex: "Position",
//       key: "info",
//       width: "30%",
//       render: (_, user) => (
//         <div className="info-cell">
//           {user.Position && <Tag color="blue">{user.Position}</Tag>}
//           {user.Department && <Tag color="cyan">{user.Department}</Tag>}
//           {!user.Position && !user.Department && <span className="text-muted">-</span>}
//         </div>
//       ),
//     },
//     {
//       title: "TRẠNG THÁI QUYỀN",
//       key: "status",
//       width: "20%",
//       render: (_, user) => {
//         const count = Object.keys(SYSTEM_PERMISSIONS).filter(k => user[k]).length;
//         return count > 0 ? (
//           <Badge status="success" text={<span className="status-text active">Đã cấp {count} quyền</span>} />
//         ) : (
//           <Badge status="default" text={<span className="status-text inactive">Chưa có quyền</span>} />
//         );
//       }
//     },
//     {
//       title: "",
//       key: "action",
//       width: "15%",
//       align: "right",
//       render: (_, user) => (
//         <Button
//           type="text"
//           className="action-btn"
//           icon={<SettingOutlined />}
//           onClick={() => handleOpenDrawer(user)}
//         >
//           Cấu hình
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div className="user-permissions-container">
//       {/* Header Section */}
//       <div className="page-header">
//         <div className="header-title">
//           <SafetyCertificateOutlined className="header-icon" />
//           <div>
//             <Title level={3}>Phân Quyền Hệ Thống</Title>
//             <Text type="secondary">Quản lý vai trò và quyền truy cập của nhân sự</Text>
//           </div>
//         </div>
//         <div className="header-actions">
//           <Input
//             prefix={<SearchOutlined />}
//             placeholder="Tìm kiếm nhân viên..."
//             className="search-input"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             allowClear
//           />
//           <Button icon={<ReloadOutlined />} onClick={loadUsers} loading={loading}>
//             Làm mới
//           </Button>
//         </div>
//       </div>

//       {/* Main Table */}
//       <div className="table-wrapper">
//         <Table
//           columns={columns}
//           dataSource={filteredUsers}
//           rowKey="id"
//           loading={loading}
//           pagination={{ pageSize: 8, showSizeChanger: false }}
//           className="custom-table"
//         />
//       </div>

//       {/* Permission Drawer */}
//       <Drawer
//         title={
//           <div className="drawer-header-content">
//             <Avatar size={50} src={selectedUser?.qr_code_url?.split(",")[0]} icon={<UserOutlined />} />
//             <div>
//               <div className="drawer-user-name">{selectedUser?.Name || selectedUser?.username}</div>
//               <div className="drawer-user-email">{selectedUser?.email}</div>
//             </div>
//           </div>
//         }
//         width={700}
//         open={drawerVisible}
//         onClose={() => setDrawerVisible(false)}
//         className="permission-drawer"
//         footer={
//           <div className="drawer-footer">
//             <Button onClick={() => setDrawerVisible(false)} className="btn-cancel">Hủy bỏ</Button>
//             <Button type="primary" onClick={handleSave} loading={saving} icon={<SaveOutlined />} className="btn-save">
//               Lưu thay đổi
//             </Button>
//           </div>
//         }
//       >
//         <div className="permission-groups-grid">
//           {Object.entries(PERMISSION_GROUPS).map(([groupName, keys]) => {
//             const allChecked = keys.every((k) => userPermissions[k]);
//             const config = GROUP_CONFIG[groupName];

//             return (
//               <div key={groupName} className="permission-card">
//                 <div className="card-header" style={{ borderLeftColor: config.color }}>
//                   <div className="group-title">
//                     <span className="group-icon" style={{ color: config.color }}>{config.icon}</span>
//                     <span>{groupName}</span>
//                   </div>
//                   <Switch
//                     size="small"
//                     checked={allChecked}
//                     onChange={(checked) => toggleGroup(keys, checked)}
//                     className="group-switch"
//                   />
//                 </div>
//                 <div className="card-body">
//                   {keys.map((key) => (
//                     <div
//                       key={key}
//                       className={`permission-item ${userPermissions[key] ? "active" : ""}`}
//                       onClick={() => togglePermission(key, !userPermissions[key])}
//                     >
//                       <span className="perm-label">{SYSTEM_PERMISSIONS[key]}</span>
//                       <Switch
//                         size="small"
//                         checked={userPermissions[key]}
//                         onChange={(checked) => togglePermission(key, checked)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </Drawer>
//     </div>
//   );
// };

// export default UserPermissions;





// import React, { useState, useEffect } from "react";
// import {
//   UserOutlined,
//   SettingOutlined,
//   SearchOutlined,
//   ReloadOutlined,
//   SafetyCertificateOutlined,
//   ShopOutlined,
//   ShoppingCartOutlined,
//   FileTextOutlined,
//   LaptopOutlined,
//   DesktopOutlined,
//   TeamOutlined,
//   SaveOutlined
// } from "@ant-design/icons";

// import {
//   Avatar,
//   Tag,
//   message,
//   Input,
//   Drawer,
//   Button,
//   Table,
//   Switch,
//   Typography,
//   Badge
// } from "antd";

// import { fetchUsers, updateUser } from "../../../services/abicoServices";
// import "./UserPermissions.scss";

// const { Title, Text } = Typography;

// const GROUP_CONFIG = {
//   "Kho hàng": { icon: <ShopOutlined />, color: "#1890ff" },
//   "Nhập hàng": { icon: <ShoppingCartOutlined />, color: "#52c41a" },
//   "Hóa đơn": { icon: <FileTextOutlined />, color: "#faad14" },
//   "Thiết bị": { icon: <LaptopOutlined />, color: "#722ed1" },
//   "Trang POS": { icon: <DesktopOutlined />, color: "#f5222d" },
//   "Tổ chức": { icon: <TeamOutlined />, color: "#13c2c2" }
// };

// const SYSTEM_PERMISSIONS = {
//   Warehouse: "Quản lý kho",
//   Exportlist: "Quản lý xuất kho",
//   ReadWarehouse: "Truy cập kho",
//   Receivelistkho: "Người nhận phiếu kho",
//   Purchase: "Quản lý nhập hàng",
//   Purchaseer: "Người mua hàng",
//   Exportlister: "Người mượn hàng",
//   Invoice: "Quản lý hóa đơn",
//   Invoiceer: "Người xuất hóa đơn",
//   Devicelist: "Quản lý thiết bị",
//   Receivelist: "Người nhận phiếu thiết bị",
//   ReadPOS: "Truy cập POS",
//   WritePOS: "Tạo phiếu POS",
//   Projecter: "Quản lý dự án",
//   Leader: "Lãnh đạo"
// };

// const PERMISSION_GROUPS = {
//   "Kho hàng": ["Warehouse", "Exportlist", "ReadWarehouse", "Receivelistkho"],
//   "Nhập hàng": ["Purchase", "Purchaseer", "Exportlister"],
//   "Hóa đơn": ["Invoice", "Invoiceer"],
//   "Thiết bị": ["Devicelist", "Receivelist"],
//   "Trang POS": ["ReadPOS", "WritePOS", "Projecter"],
//   "Tổ chức": ["Leader"]
// };

// export default function UserPermissions() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [drawer, setDrawer] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [perms, setPerms] = useState({});
//   const [search, setSearch] = useState("");
//   const [saving, setSaving] = useState(false);

//   const load = async () => {
//     setLoading(true);
//     const data = await fetchUsers();
//     setUsers(data.sort((a, b) => (a.Name || "").localeCompare(b.Name || "")));
//     setLoading(false);
//   };

//   useEffect(() => { load() }, []);

//   const open = u => {
//     setSelected(u);
//     const p = {};
//     Object.keys(SYSTEM_PERMISSIONS).forEach(k => p[k] = u[k] || false);
//     setPerms(p);
//     setDrawer(true);
//   };

//   const save = async () => {
//     setSaving(true);
//     await updateUser(selected.id, perms);
//     message.success("Đã lưu");
//     load();
//     setDrawer(false);
//     setSaving(false);
//   };

//   const columns = [
//     {
//       title: "NHÂN SỰ",
//       render: u => (
//         <div className="user-cell">
//           <Avatar icon={<UserOutlined />} />
//           <div>
//             <Text strong>{u.Name || u.username}</Text><br />
//             <Text type="secondary">{u.email}</Text>
//           </div>
//         </div>
//       )
//     },
//     {
//       title: "PHÒNG BAN",
//       render: u => (
//         <div className="info-cell">
//           {u.Position && <Tag color="blue">{u.Position}</Tag>}
//           {u.Department && <Tag color="cyan">{u.Department}</Tag>}
//         </div>
//       )
//     },
//     {
//       title: "QUYỀN",
//       render: u => {
//         const c = Object.keys(SYSTEM_PERMISSIONS).filter(k => u[k]).length;
//         return <Badge status={c ? "success" : "default"} text={c ? `${c} quyền` : "Chưa có"} />
//       }
//     },
//     {
//       render: u => (
//         <Button type="text" icon={<SettingOutlined />} onClick={() => open(u)}>
//           Cấu hình
//         </Button>
//       )
//     }
//   ];

//   return (
//     <div className="user-permissions-container">

//       <div className="page-header">
//         <div className="header-title">
//           <SafetyCertificateOutlined className="header-icon" />
//           <div>
//             <Title level={4}>Phân quyền hệ thống</Title>
//             <Text type="secondary">Quản lý quyền nhân sự</Text>
//           </div>
//         </div>

//         <Input
//           prefix={<SearchOutlined />}
//           placeholder="Tìm nhân viên"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           style={{ maxWidth: 260 }}
//         />

//         <Button icon={<ReloadOutlined />} onClick={load} />
//       </div>

//       <div className="table-wrapper">
//         <Table
//           rowKey="id"
//           loading={loading}
//           columns={columns}
//           dataSource={users.filter(u => (u.Name || "").toLowerCase().includes(search.toLowerCase()))}
//           pagination={{ pageSize: 8 }}
//           className="custom-table"
//         />
//       </div>

//       <Drawer
//         open={drawer}
//         width={720}
//         onClose={() => setDrawer(false)}
//         className="permission-drawer"
//         footer={
//           <div className="drawer-footer">
//             <Button onClick={() => setDrawer(false)}>Hủy</Button>
//             <Button type="primary" loading={saving} icon={<SaveOutlined />} onClick={save}>
//               Lưu
//             </Button>
//           </div>
//         }
//         title={selected?.Name}
//       >
//         <div className="permission-groups-grid">
//           {Object.entries(PERMISSION_GROUPS).map(([g, keys]) => {
//             const cfg = GROUP_CONFIG[g];
//             return (
//               <div key={g} className="permission-card">
//                 <div className="card-header" style={{ borderLeftColor: cfg.color }}>
//                   <div className="group-title">{cfg.icon}{g}</div>
//                   <Switch
//                     size="small"
//                     checked={keys.every(k => perms[k])}
//                     onChange={v => {
//                       const o = {};
//                       keys.forEach(k => o[k] = v);
//                       setPerms(p => ({ ...p, ...o }))
//                     }}
//                   />
//                 </div>

//                 <div className="card-body">
//                   {keys.map(k => (
//                     <div
//                       key={k}
//                       className={`permission-item ${perms[k] ? "active" : ""}`}
//                       onClick={() => setPerms(p => ({ ...p, [k]: !p[k] }))}
//                     >
//                       <span className="perm-label">{SYSTEM_PERMISSIONS[k]}</span>
//                       <Switch size="small" checked={perms[k]} />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </Drawer>

//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  SettingOutlined,
  SearchOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  LaptopOutlined,
  DesktopOutlined,
  TeamOutlined,
  SaveOutlined
} from "@ant-design/icons";

import {
  Avatar,
  Tag,
  message,
  Input,
  Drawer,
  Button,
  Table,
  Switch,
  Typography,
  Badge,
  Tooltip
} from "antd";

import { fetchUsers, updateUser } from "../../../services/abicoServices";
import "./UserPermissions.scss";

const { Title, Text } = Typography;

const GROUP_CONFIG = {
  "Kho hàng": { icon: <ShopOutlined />, color: "#1890ff" },
  "Nhập hàng": { icon: <ShoppingCartOutlined />, color: "#52c41a" },
  "Hóa đơn": { icon: <FileTextOutlined />, color: "#faad14" },
  "Thiết bị": { icon: <LaptopOutlined />, color: "#722ed1" },
  "Trang POS": { icon: <DesktopOutlined />, color: "#f5222d" },
  "Tổ chức": { icon: <TeamOutlined />, color: "#13c2c2" }
};

const SYSTEM_PERMISSIONS = {
  Warehouse: "Quản lý kho",
  Exportlist: "Quản lý xuất kho",
  ReadWarehouse: "Truy cập kho",
  Receivelistkho: "Người nhận phiếu kho",
  Purchase: "Quản lý nhập hàng",
  Purchaseer: "Người mua hàng",
  Exportlister: "Người mượn hàng",
  Invoice: "Quản lý hóa đơn",
  Invoiceer: "Người xuất hóa đơn",
  Devicelist: "Quản lý thiết bị",
  Receivelist: "Người nhận phiếu thiết bị",
  ReadPOS: "Truy cập POS",
  WritePOS: "Tạo phiếu POS",
  Projecter: "Quản lý dự án",
  Leader: "Lãnh đạo"
};

const PERMISSION_GROUPS = {
  "Kho hàng": ["Warehouse", "Exportlist", "ReadWarehouse", "Receivelistkho"],
  "Nhập hàng": ["Purchase", "Purchaseer", "Exportlister"],
  "Hóa đơn": ["Invoice", "Invoiceer"],
  "Thiết bị": ["Devicelist", "Receivelist"],
  "Trang POS": ["ReadPOS", "WritePOS", "Projecter"],
  "Tổ chức": ["Leader"]
};

const UserPermissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(null);
  const [perms, setPerms] = useState({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data.sort((a, b) => (a.Name || "").localeCompare(b.Name || "")));
    } catch (error) {
      message.error("Không thể tải danh sách nhân sự");
    }
    setLoading(false);
  };

  useEffect(() => { load() }, []);

  const open = u => {
    setSelected(u);
    const p = {};
    Object.keys(SYSTEM_PERMISSIONS).forEach(k => p[k] = u[k] || false);
    setPerms(p);
    setDrawer(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateUser(selected.id, perms);
      message.success("Cập nhật quyền thành công");
      load();
      setDrawer(false);
    } catch (error) {
      message.error("Lỗi khi lưu dữ liệu");
    }
    setSaving(false);
  };

  const columns = [
    {
      title: "NHÂN SỰ",
      dataIndex: "Name",
      key: "Name",
      render: (_, u) => (
        <div className="user-cell">
          <Avatar size={40} icon={<UserOutlined />} src={u.avatar} />
          <div className="user-info">
            <Text strong className="user-name">{u.Name || u.username}</Text>
            <Text type="secondary" className="user-email">{u.email}</Text>
          </div>
        </div>
      )
    },
    {
      title: "VAI TRÒ & PHÒNG BAN",
      key: "info",
      render: (_, u) => (
        <div className="info-cell">
          {u.Position ? <Tag color="blue">{u.Position}</Tag> : <Text type="secondary" style={{ fontSize: 12 }}>Chưa cập nhật chức vụ</Text>}
          {u.Department && <Tag color="cyan" style={{ marginTop: 4 }}>{u.Department}</Tag>}
        </div>
      )
    },
    {
      title: "TRẠNG THÁI QUYỀN",
      key: "status",
      render: (_, u) => {
        const c = Object.keys(SYSTEM_PERMISSIONS).filter(k => u[k]).length;
        return (
          <Badge
            status={c ? "success" : "default"}
            text={<span style={{ color: c ? '#52c41a' : '#bfbfbf' }}>{c ? `Đang có ${c} quyền` : "Chưa cấp quyền"}</span>}
          />
        );
      }
    },
    {
      title: "",
      key: "action",
      align: "right",
      render: (_, u) => (
        <Button className="action-btn" icon={<SettingOutlined />} onClick={() => open(u)}>
          Cấu hình
        </Button>
      )
    }
  ];

  return (
    <div className="user-permissions-container">
      {/* HEADER ĐƯỢC LÀM LẠI GỌN GÀNG */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-box">
            <SafetyCertificateOutlined />
          </div>
          <div className="header-titles">
            <Title level={4}>Phân quyền hệ thống</Title>
            <Text type="secondary">Quản lý và phân cấp quyền hạn nhân sự</Text>
          </div>
        </div>

        <div className="header-right">
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Tìm theo tên nhân viên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            allowClear
          />
          <Tooltip title="Làm mới dữ liệu">
            <Button className="refresh-btn" icon={<ReloadOutlined />} onClick={load} loading={loading} />
          </Tooltip>
        </div>
      </div>

      <div className="table-wrapper">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={users.filter(u => (u.Name || "").toLowerCase().includes(search.toLowerCase()))}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          className="custom-table"
        />
      </div>

      <Drawer
        open={drawer}
        width={720}
        onClose={() => setDrawer(false)}
        className="permission-drawer"
        title={
          <div className="drawer-header-custom">
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginRight: 12 }} />
            <div>
              <div style={{ fontWeight: 700 }}>{selected?.Name}</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c' }}>{selected?.email}</div>
            </div>
          </div>
        }
        footer={
          <div className="drawer-footer">
            <Button onClick={() => setDrawer(false)} style={{ marginRight: 8 }}>Hủy bỏ</Button>
            <Button type="primary" loading={saving} icon={<SaveOutlined />} onClick={save}>
              Lưu thay đổi
            </Button>
          </div>
        }
      >
        <div className="permission-groups-grid">
          {Object.entries(PERMISSION_GROUPS).map(([g, keys]) => {
            const cfg = GROUP_CONFIG[g];
            const allChecked = keys.every(k => perms[k]);
            return (
              <div key={g} className="permission-card">
                <div className="card-header" style={{ borderLeftColor: cfg.color }}>
                  <div className="group-title" style={{ color: cfg.color }}>
                    {cfg.icon} <span>{g}</span>
                  </div>
                  <Switch
                    size="small"
                    checked={allChecked}
                    onChange={v => {
                      const o = {};
                      keys.forEach(k => o[k] = v);
                      setPerms(p => ({ ...p, ...o }))
                    }}
                  />
                </div>

                <div className="card-body">
                  {keys.map(k => (
                    <div
                      key={k}
                      className={`permission-item ${perms[k] ? "active" : ""}`}
                      onClick={() => setPerms(p => ({ ...p, [k]: !p[k] }))}
                    >
                      <span className="perm-label">{SYSTEM_PERMISSIONS[k]}</span>
                      <Switch size="small" checked={perms[k]} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Drawer>
    </div>
  );
}

export default UserPermissions;
// import React, { useState, useEffect } from "react";
// import { UserOutlined, SettingOutlined, PlusOutlined } from "@ant-design/icons";
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
//   Select,
//   Table,
//   Space,
// } from "antd";
// import { fetchUsers, updateUser } from "../../../services/abicoServices";

// const permissionGroups = {
//   "Khách hàng": ["Thêm KH", "Xóa KH", "Cập nhật KH"],
//   "Sản phẩm": ["Thêm SP", "Xóa SP", "Liên thông", "Cập nhật SP"],
//   "Nhập hàng": ["Cập nhật phiếu", "Xem lịch sử"],
//   "Nhà cung cấp": ["Thêm NCC", "Xóa NCC", "Thanh toán NCC"],
//   "Hóa đơn": ["Liên thông", "Xóa hóa đơn"],
//   "Phiếu chi": ["Xóa phiếu chi", "Danh sách phiếu chi"],
// };

// const UserPermissions = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [selectedRole, setSelectedRole] = useState(null);

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
//     setUserPermissions(user.permissions || []);
//     setIsModalOpen(true);
//   };

//   const togglePermission = (perm) => {
//     setUserPermissions((prev) =>
//       prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
//     );
//   };

//   const confirmPermissionChange = async () => {
//     try {
//       await updateUser(selectedUser.id, { permissions: userPermissions });
//       message.success("Cập nhật quyền thành công");

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === selectedUser.id ? { ...u, permissions: userPermissions } : u
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

//       {/* Modal phân quyền */}
//       <Modal
//         title={`Phân quyền cho ${selectedUser?.Name || selectedUser?.username}`}
//         open={isModalOpen}
//         onOk={confirmPermissionChange}
//         onCancel={() => setIsModalOpen(false)}
//         okText="Xác nhận"
//         cancelText="Hủy"
//         width={900}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <Select
//             placeholder="Chọn quyền mẫu"
//             value={selectedRole}
//             onChange={setSelectedRole}
//             style={{ width: 250 }}
//             options={[
//               { label: "Nhân viên bán hàng", value: "sale" },
//               { label: "Quản lý cửa hàng", value: "manager" },
//             ]}
//           />
//           <Button type="primary" icon={<PlusOutlined />}>
//             Thêm quyền mẫu
//           </Button>
//         </div>

//         <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
//           {Object.entries(permissionGroups).map(([group, perms]) => (
//             <div key={group} className="border rounded-lg p-3">
//               <h3 className="font-semibold mb-2">{group}</h3>
//               {perms.map((perm) => (
//                 <Checkbox
//                   key={perm}
//                   checked={userPermissions.includes(perm)}
//                   onChange={() => togglePermission(perm)}
//                 >
//                   {perm}
//                 </Checkbox>
//               ))}
//             </div>
//           ))}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default UserPermissions;

import React, { useState, useEffect } from "react";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Avatar,
  Tag,
  Spin,
  message,
  Tooltip,
  Input,
  Modal,
  Button,
  Checkbox,
  Table,
  Space,
} from "antd";
import { fetchUsers, updateUser } from "../../../services/abicoServices";

// 🟢 Mapping quyền trong DB -> Nhãn hiển thị
const systemPermissions = {
  Exportlist: "Quản lý xuất kho",
  Purchase: "Quản lý nhập hàng",
  Invoice: "Quản lý hóa đơn",
  ReadPOS: "Truy cập trang",
  WritePOS: "Tạo phiếu",
  Exportlister: "Người mượn hàng",
  Purchaseer: "Người mua hàng",
  Invoiceer: "Người xuất hóa đơn",
  Leader: "Leader",
  Warehouse: "Quản lý kho",
  Devicelist: "Quản lý thiết bị",
  Receivelist: "Người nhận phiếu",
  ReadWarehouse: "Truy cập kho",
  Receivelistkho: "Người nhận phiếu",
  Projecter: "Người quản lý dự án"
};

// 🟢 Gom quyền theo nhóm hiển thị
const permissionGroups = {
  "Kho hàng": ["Exportlist", "Warehouse", "ReadWarehouse", "Receivelistkho"],
  "Nhập hàng": ["Purchase", "Purchaseer", "Exportlister"],
  "Hóa đơn": ["Invoice", "Invoiceer"],
  "Thiết bị": ["Devicelist", "Receivelist"],
  "Trang POS": ["ReadPOS", "WritePOS", "Projecter"],
  "Tổ chức": ["Leader"],
};

const UserPermissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Lỗi loadUsers:", error);
        message.error("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPermissionModal = (user) => {
    setSelectedUser(user);

    // Lấy quyền từ user sang object { Exportlist, Purchase, Invoice }
    setUserPermissions({
      Exportlist: user.Exportlist ?? false,
      Purchase: user.Purchase ?? false,
      Invoice: user.Invoice ?? false,
      ReadPOS: user.ReadPOS ?? false,
      WritePOS: user.WritePOS ?? false,
      Exportlister: user.Exportlister ?? false,
      Purchaseer: user.Purchaseer ?? false,
      Invoiceer: user.Invoiceer ?? false,
      Leader: user.Leader ?? false,
      Warehouse: user.Warehouse ?? false,
      Devicelist: user.Devicelist ?? false,
      Receivelist: user.Receivelist ?? false,
      ReadWarehouse: user.ReadWarehouse ?? false,
      Receivelistkho: user.Receivelistkho ?? false,
      Projecter: user.Projecter ?? false,
    });
    setIsModalOpen(true);
  };

  const confirmPermissionChange = async () => {
    try {
      await updateUser(selectedUser.id, userPermissions); // Gửi object {Exportlist, Purchase, Invoice}

      message.success("Cập nhật quyền thành công");

      // Update lại danh sách users local
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...userPermissions } : u
        )
      );
    } catch (error) {
      console.error("❌ Lỗi update permission:", error);
      message.error("Cập nhật quyền thất bại");
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "Name",
      key: "name",
      render: (_, user) => (
        <Space>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={user.qr_code_url?.split(",")[0]}
          />
          <div>
            <div className="font-semibold">{user.Name || user.username}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "Position",
      key: "position",
      render: (pos) =>
        pos ? (
          <Tag color="blue" className="rounded-full">
            {pos}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Phòng ban",
      dataIndex: "Department",
      key: "department",
      render: (dep) =>
        dep ? (
          <Tag color="green" className="rounded-full">
            {dep}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Phân quyền",
      key: "action",
      align: "center",
      render: (_, user) => (
        <Tooltip title="Phân quyền">
          <Button
            shape="circle"
            icon={<SettingOutlined />}
            onClick={() => openPermissionModal(user)}
          />
        </Tooltip>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Đang tải danh sách người dùng..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý quyền người dùng</h1>
          <Input.Search
            placeholder="Tìm kiếm theo tên, username hoặc email"
            allowClear
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          bordered
          pagination={{ pageSize: 8 }}
        />
      </div>
      <Modal
        title={`Phân quyền cho ${selectedUser?.Name || selectedUser?.username}`}
        open={isModalOpen}
        onOk={confirmPermissionChange}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        width={800}
      >
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(permissionGroups).map(([groupName, keys]) => (
            <div key={groupName} className="border p-3 rounded-md">
              {/* Checkbox cha: chọn toàn bộ group */}
              <Checkbox
                indeterminate={
                  keys.some((k) => userPermissions[k]) &&
                  !keys.every((k) => userPermissions[k])
                }
                checked={keys.every((k) => userPermissions[k])}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const updated = {};
                  keys.forEach((k) => {
                    updated[k] = checked;
                  });
                  setUserPermissions((prev) => ({ ...prev, ...updated }));
                }}
              >
                <b>{groupName}</b>
              </Checkbox>

              {/* Checkbox con */}
              <div className="ml-4 mt-2 flex flex-col gap-1">
                {keys.map((key) => (
                  <Checkbox
                    key={key}
                    checked={userPermissions[key]}
                    onChange={(e) =>
                      setUserPermissions((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                  >
                    {systemPermissions[key]}
                  </Checkbox>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default UserPermissions;

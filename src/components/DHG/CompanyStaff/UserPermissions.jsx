

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
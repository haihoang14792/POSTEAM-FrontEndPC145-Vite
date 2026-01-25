



import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Input,
    Tag,
    Typography,
    Avatar,
    Tooltip,
    message
} from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    TeamOutlined,
    UserOutlined,
    QrcodeOutlined,
    LinkOutlined
} from "@ant-design/icons";
import { fetchUsers } from "../../../services/abicoServices";
import "./UserManagement.scss";

const { Title, Text } = Typography;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    // Xử lý tìm kiếm real-time
    useEffect(() => {
        if (!users.length) return;

        const lowerSearch = searchText.toLowerCase();
        const results = users.filter(user =>
            (user.username || "").toLowerCase().includes(lowerSearch) ||
            (user.email || "").toLowerCase().includes(lowerSearch) ||
            (user.Name || "").toLowerCase().includes(lowerSearch)
        );
        setFilteredUsers(results);
    }, [searchText, users]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchUsers();
            let data = [];

            if (Array.isArray(response)) {
                data = response;
            } else if (response && Array.isArray(response.data)) {
                data = response.data;
            }

            // Sắp xếp theo tên
            data.sort((a, b) => (a.Name || "").localeCompare(b.Name || ""));

            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            message.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "NGƯỜI DÙNG",
            key: "user",
            width: 280,
            render: (_, record) => (
                <div className="user-cell">
                    <Avatar
                        size={42}
                        icon={<UserOutlined />}
                        src={record.avatar}
                        className="user-avatar"
                    />
                    <div className="user-info">
                        <Text strong className="user-name">{record.Name || "Chưa cập nhật tên"}</Text>
                        <div className="user-sub">
                            <Text type="secondary">{record.email}</Text>
                        </div>
                        <div className="user-username">@{record.username}</div>
                    </div>
                </div>
            )
        },
        {
            title: "CHỨC VỤ & PHÒNG BAN",
            key: "role",
            width: 220,
            render: (_, record) => (
                <div className="info-cell">
                    {record.Position ?
                        <Tag color="blue" className="mb-1">{record.Position}</Tag> :
                        <Text type="secondary" style={{ fontSize: 12 }}>N/A</Text>
                    }
                    {record.Department && <Tag color="cyan">{record.Department}</Tag>}
                </div>
            )
        },
        {
            title: "TRẠNG THÁI",
            key: "status",
            width: 150,
            render: (_, record) => (
                <div className="status-cell">
                    <div className="mb-1">
                        {record.confirmed ?
                            <Tag color="success" icon={<i className="dot" />}>Đã xác thực</Tag> :
                            <Tag color="warning">Chưa xác thực</Tag>
                        }
                    </div>
                    <div>
                        {record.blocked ?
                            <Tag color="error">Đã khóa</Tag> :
                            <Tag color="processing">Hoạt động</Tag>
                        }
                    </div>
                </div>
            )
        },
        {
            title: "QR CODES",
            dataIndex: "qr_code_url",
            key: "qr_code_url",
            width: 200,
            render: (text) => {
                if (!text) return <Text type="secondary" style={{ fontSize: 12 }}>Chưa có QR</Text>;
                const links = text.split(',').map(link => link.trim()).filter(Boolean);

                return (
                    <div className="qr-links">
                        {links.map((link, index) => (
                            <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="qr-link-item"
                            >
                                <QrcodeOutlined /> Link {index + 1} <LinkOutlined style={{ fontSize: 10, marginLeft: 2 }} />
                            </a>
                        ))}
                    </div>
                );
            },
        }
    ];

    return (
        <div className="user-management-container">
            {/* HEADER DASHBOARD */}
            <div className="page-header">
                <div className="header-left">
                    <div className="header-icon-box">
                        <TeamOutlined />
                    </div>
                    <div className="header-titles">
                        <Title level={4}>Quản lý người dùng</Title>
                        <Text type="secondary">Danh sách tài khoản và thông tin chi tiết</Text>
                    </div>
                </div>

                <div className="header-right">
                    <Input
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Tìm theo tên, email, username..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className="search-input"
                        allowClear
                    />
                    <Tooltip title="Làm mới dữ liệu">
                        <Button
                            className="refresh-btn"
                            icon={<ReloadOutlined />}
                            onClick={loadUsers}
                            loading={loading}
                        />
                    </Tooltip>
                </div>
            </div>

            {/* TABLE */}
            <div className="table-wrapper">
                <Table
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    dataSource={filteredUsers}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} người dùng`
                    }}
                    className="custom-table"
                />
            </div>
        </div>
    );
};

export default UserManagement;
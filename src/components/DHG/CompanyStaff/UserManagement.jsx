import { useEffect, useState } from "react";
import { Table, Button, Switch, Input, Tag } from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchUsers } from "../../../services/abicoServices";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchUsers();
            console.log("API Response:", response); // Debug response

            if (Array.isArray(response)) {
                setUsers(response);
            } else if (response && Array.isArray(response.data)) {
                setUsers(response.data); // Nếu API bọc dữ liệu trong `data`
            } else {
                console.warn("Dữ liệu API không hợp lệ:", response);
                setUsers([]);
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = (id, blocked) => {
        setUsers(users.map(user => user.id === id ? { ...user, blocked: !blocked } : user));
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        (user.Name && user.Name.toLowerCase().includes(searchText.toLowerCase()))
    );

    const columns = [
        {
            title: "Tên",
            dataIndex: "Name", // <- Lưu ý "Name" có đúng không?
            key: "Name",
            render: text => text || "N/A",
        }
        ,

        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Chức vụ",
            dataIndex: "Position",
            key: "Position",
            render: text => text || "N/A",
        },
        {
            title: "Phòng ban",
            dataIndex: "Department",
            key: "Department",
            render: text => text || "N/A",
        },
        {
            title: "Xác thực",
            dataIndex: "confirmed",
            key: "confirmed",
            render: confirmed => confirmed ? <Tag color="green">Đã xác thực</Tag> : <Tag color="red">Chưa xác thực</Tag>,
        },
        {
            title: "Trạng thái",
            dataIndex: "blocked",
            key: "blocked",
            render: confirmed => confirmed ? <Tag color="red">Bị khóa</Tag> : <Tag color="green">Hoạt động</Tag>,
        },
        // {
        //     title: "QRCode",
        //     dataIndex: "qr_code_url",
        //     key: "qr_code_url",
        //     render: (text) =>
        //         text ? (
        //             <a href={text} target="_blank" rel="noopener noreferrer">
        //                 Link
        //             </a>
        //         ) : (
        //             "Không có"
        //         ),
        // },
        {
            title: "QRCode",
            dataIndex: "qr_code_url",
            key: "qr_code_url",
            render: (text) => {
                if (!text) return "Không có";

                const links = text.split(',').map(link => link.trim());

                return (
                    <div>
                        {links.map((link, index) => (
                            <div key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                    Link {index + 1}
                                </a>
                            </div>
                        ))}
                    </div>
                );
            },
        },

        // {
        //     title: "Hành động",
        //     key: "action",
        //     render: (text, record) => (
        //         <Button type="primary" icon={<EditOutlined />} onClick={() => console.log("Edit", record)}>Sửa</Button>
        //     ),
        // },
    ];

    return (
        <div>
            <Input
                placeholder="Tìm kiếm người dùng..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: 300 }}
            />
            <Table
                dataSource={filteredUsers}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default UserManagement;

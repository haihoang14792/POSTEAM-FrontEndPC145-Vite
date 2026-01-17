import React, { useEffect, useState } from "react";
import { fetchProjectPlantDHGs } from "../../../services/jobServices";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Spin,
    Empty,
    Row,
    Col,
    Card,
    Typography,
    Tag
} from "antd";
import {
    PlusOutlined,
    ShopOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    UserOutlined
} from "@ant-design/icons";
import CreateProjectTicketModal from "./CreateProjectTicketModal";
import "./Project.scss";

const { Title, Text } = Typography;

const Project = () => {
    const [projectDHGs, setprojectDHGs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchProjectPlantDHGs();
            // Strapi v5: response có thể là mảng trực tiếp hoặc { data: [...] }
            const data = Array.isArray(res) ? res : (res?.data || []);

            // Sắp xếp theo ID giảm dần (mới nhất lên đầu)
            setprojectDHGs(data.sort((a, b) => b.id - a.id));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Sửa: bỏ .attributes
    const activeList = projectDHGs.filter(
        item => item.Status === true
    );

    // Sửa: bỏ .attributes
    const completedList = projectDHGs.filter(
        item => item.Status === false
    );

    if (loading) {
        return (
            <div className="recall-loading">
                <Spin size="large" />
            </div>
        );
    }

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const account = userData?.account || {};

    return (
        <div className="recall-container">
            {/* ===== HEADER ===== */}
            <div className="recall-header">
                <div>
                    <Title level={3}>📦 Kế hoạch làm việc</Title>
                    <Text type="secondary">
                        Đang hoạt động: {activeList.length} | Hoàn thành:{" "}
                        {completedList.length}
                    </Text>
                </div>
                {account.Leader === true && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setOpenCreateModal(true)}
                    >
                        Tạo phiếu
                    </Button>
                )}
            </div>

            {/* ===== ĐANG HOẠT ĐỘNG ===== */}
            <div className="recall-section">
                <h3 className="section-title active">
                    🟡 Đang hoạt động ({activeList.length})
                </h3>

                {activeList.length === 0 ? (
                    <Empty description="Không có phiếu đang hoạt động" />
                ) : (
                    <Row gutter={[16, 16]}>
                        {activeList.map(item => (
                            <Col xs={24} sm={12} lg={8} key={item.id}>
                                <Card
                                    hoverable
                                    className="recall-card active"
                                    onClick={() =>
                                        navigate(
                                            // Sửa: bỏ .attributes
                                            `/dhg/store/${item.Ticket}`,
                                            {
                                                state: {
                                                    storeId: item.StoreID, // ✅ mã cửa hàng
                                                    ticket: item.Ticket   // ✅ số phiếu
                                                }
                                            }
                                        )
                                    }
                                >
                                    <div className="card-header">
                                        <Title level={5}>
                                            <ShopOutlined />{" "}
                                            {item.Customer} {/* Sửa: bỏ .attributes */}
                                        </Title>
                                        <Tag color="gold">Đang hoạt động</Tag>
                                    </div>

                                    <Text strong>
                                        Store ID: {item.StoreID} {/* Sửa: bỏ .attributes */}
                                    </Text>

                                    <div className="recall-row">
                                        <EnvironmentOutlined />
                                        <span>
                                            {item.Address} {/* Sửa: bỏ .attributes */}
                                        </span>
                                    </div>

                                    <div className="recall-row">
                                        <FileTextOutlined />
                                        <span>{item.Detail}</span> {/* Sửa: bỏ .attributes */}
                                    </div>
                                    <div className="recall-row">
                                        <UserOutlined />
                                        <span>
                                            Người phụ trách:{" "}
                                            {item.Person || "Chưa phân công"} {/* Sửa: bỏ .attributes */}
                                        </span>
                                    </div>
                                    <div className="recall-row">
                                        <UserOutlined />
                                        <span>
                                            Người phụ trách 2:{" "}
                                            {item.Person2nd || "Chưa phân công"} {/* Sửa: bỏ .attributes */}
                                        </span>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* ===== ĐÃ HOÀN THÀNH ===== */}
            <div className="recall-section">
                <h3 className="section-title done">
                    ✅ Đã hoàn thành ({completedList.length})
                </h3>

                {completedList.length === 0 ? (
                    <Empty description="Chưa có phiếu hoàn thành" />
                ) : (
                    <Row gutter={[16, 16]}>
                        {completedList.map(item => (
                            <Col xs={24} sm={12} lg={8} key={item.id}>
                                <Card
                                    className="recall-card done"
                                    onClick={() =>
                                        navigate(
                                            // Sửa: bỏ .attributes
                                            `/dhg/store/${item.Ticket}`,
                                            {
                                                state: {
                                                    storeId: item.StoreID, // ✅ mã cửa hàng
                                                    ticket: item.Ticket   // ✅ số phiếu
                                                }
                                            }
                                        )
                                    }
                                >
                                    <div className="card-header">
                                        <Title level={5}>
                                            <ShopOutlined />{" "}
                                            {item.Customer} {/* Sửa: bỏ .attributes */}
                                        </Title>
                                        <Tag color="green">Hoàn thành</Tag>
                                    </div>

                                    <Text strong>
                                        Store ID: {item.StoreID} {/* Sửa: bỏ .attributes */}
                                    </Text>

                                    <div className="recall-row">
                                        <EnvironmentOutlined />
                                        <span>
                                            {item.Address} {/* Sửa: bỏ .attributes */}
                                        </span>
                                    </div>

                                    <div className="recall-row">
                                        <FileTextOutlined />
                                        <span>{item.Detail}</span> {/* Sửa: bỏ .attributes */}
                                    </div>
                                    <div className="recall-row">
                                        <UserOutlined />
                                        <span>
                                            Người phụ trách:{" "}
                                            {item.Person || "Chưa phân công"} {/* Sửa: bỏ .attributes */}
                                        </span>
                                    </div>
                                    <div className="recall-row">
                                        <UserOutlined />
                                        <span>
                                            Người phụ trách 2:{" "}
                                            {item.Person2nd || "Chưa phân công"} {/* Sửa: bỏ .attributes */}
                                        </span>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* ===== MODAL ===== */}
            <CreateProjectTicketModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                reloadTickets={loadData}
            />
        </div>
    );
};

export default Project;
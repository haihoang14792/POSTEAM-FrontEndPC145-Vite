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
            setprojectDHGs(res.data.sort((a, b) => b.id - a.id));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const activeList = projectDHGs.filter(
        item => item.attributes.Status === true
    );

    const completedList = projectDHGs.filter(
        item => item.attributes.Status === false
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
                                            `/dhg/store/${item.attributes.Ticket}`,
                                            {
                                                state: {
                                                    storeId: item.attributes.StoreID, // ✅ mã cửa hàng
                                                    ticket: item.attributes.Ticket   // ✅ số phiếu
                                                }
                                            }
                                        )
                                    }
                                >
                                    <div className="card-header">
                                        <Title level={5}>
                                            <ShopOutlined />{" "}
                                            {item.attributes.Customer}
                                        </Title>
                                        <Tag color="gold">Đang hoạt động</Tag>
                                    </div>

                                    <Text strong>
                                        Store ID: {item.attributes.StoreID}
                                    </Text>

                                    <div className="recall-row">
                                        <EnvironmentOutlined />
                                        <span>
                                            {item.attributes.Address}
                                        </span>
                                    </div>

                                    <div className="recall-row">
                                        <FileTextOutlined />
                                        <span>{item.attributes.Detail}</span>
                                    </div>
                                    <div className="recall-row">
                                        <UserOutlined />
                                        <span>
                                            Người phụ trách:{" "}
                                            {item.attributes.Person || "Chưa phân công"}
                                        </span>
                                    </div>
                                    <div className="recall-row">
                                        <UserOutlined />
                                        <span>
                                            Người phụ trách 2:{" "}
                                            {item.attributes.Person2nd || "Chưa phân công"}
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
                                            `/dhg/store/${item.attributes.Ticket}`,
                                            {
                                                state: {
                                                    storeId: item.attributes.StoreID, // ✅ mã cửa hàng
                                                    ticket: item.attributes.Ticket   // ✅ số phiếu
                                                }
                                            }
                                        )
                                    }
                                >
                                    <div className="card-header">
                                        <Title level={5}>
                                            <ShopOutlined />{" "}
                                            {item.attributes.Customer}
                                        </Title>
                                        <Tag color="green">Hoàn thành</Tag>
                                    </div>

                                    <Text strong>
                                        Store ID: {item.attributes.StoreID}
                                    </Text>

                                    <div className="recall-row">
                                        <EnvironmentOutlined />
                                        <span>
                                            {item.attributes.Address}
                                        </span>
                                    </div>

                                    <div className="recall-row">
                                        <FileTextOutlined />
                                        <span>{item.attributes.Detail}</span>
                                    </div>
                                    <div className="recall-row">
                                        <UserOutlined />
                                        <span>
                                            Người phụ trách:{" "}
                                            {item.attributes.Person || "Chưa phân công"}
                                        </span>
                                    </div>
                                    <div className="recall-row">
                                        <UserOutlined />
                                        <span>
                                            Người phụ trách 2:{" "}
                                            {item.attributes.Person2nd || "Chưa phân công"}
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

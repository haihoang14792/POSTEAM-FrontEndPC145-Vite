import React, { useEffect, useState } from "react";
import { fetchImportlists } from "../../../services/dhgServices";
import * as XLSX from "xlsx";
import {
  Table,
  Tag,
  Button,
  Input,
  Modal,
  Descriptions,
  message,
  Form,
  Select,
  Row,
  Col,
  Card,
  Space,
  Tooltip,
  Statistic,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  EyeOutlined,
  AppstoreOutlined,
  BarcodeOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./ImportList.scss";
import AddImportList from "./AddImportList";
import ReturnSupplierModal from "./ReturnSupplierModal";

const { Option } = Select;

const ImportList = () => {
  const [importlist, setImportlist] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  // Modal states
  const [detailModal, setDetailModal] = useState({ visible: false, record: null });
  const [openReturnModal, setOpenReturnModal] = useState({ visible: false, record: null });
  const [openAddModal, setOpenAddModal] = useState(false);

  // User info
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  const loadImportlist = async () => {
    setLoading(true);
    try {
      const res = await fetchImportlists();
      const data = Array.isArray(res) ? res : res.data || [];
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setImportlist(sortedData);
      setFilteredList(sortedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhập kho:", error);
      message.error("Không thể tải danh sách nhập kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImportlist();
  }, []);

  const handleSearch = (values) => {
    let results = [...importlist];
    if (values.BrandName) {
      results = results.filter((t) => t?.BrandName === values.BrandName);
    }
    if (values.Type) {
      results = results.filter((t) => t?.Type === values.Type);
    }
    if (values.searchText) {
      const text = values.searchText.toLowerCase();
      results = results.filter(
        (t) =>
          t?.Model?.toLowerCase().includes(text) ||
          t?.ProductName?.toLowerCase().includes(text)
      );
    }
    setFilteredList(results);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredList(importlist);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredList.map((item) => ({
        "Tên sản phẩm": item.ProductName,
        Model: item.Model,
        ĐVT: item.DVT,
        "Số lượng": item.totalimport,
        Kho: item.TypeKho,
        Ticket: item.Ticket,
        "Số serial": item.SerialNumber,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ImportList");
    XLSX.writeFile(wb, "ImportList.xlsx");
  };

  // Tính toán thống kê
  const uniqueBrands = [...new Set(filteredList.map((i) => i.BrandName))].filter(Boolean);
  const totalItems = filteredList.reduce((acc, curr) => acc + (curr.totalimport || 0), 0);

  const modelCounts = Object.entries(
    filteredList.reduce((acc, item) => {
      const model = item?.BrandName || "Khác";
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {})
  ).map(([label, count]) => ({ label, count }));

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Thông tin thiết bị",
      key: "info",
      render: (_, record) => (
        <div className="product-info-cell">
          <div className="product-name">{record.ProductName}</div>
          <div className="product-model">
            <Tag color="cyan">{record.BrandName}</Tag>
            <span className="model-text">{record.Model}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "totalimport",
      key: "totalimport",
      align: "center",
      width: 100,
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>,
    },
    {
      title: "Kho & Loại",
      key: "warehouse",
      width: 180,
      render: (_, record) => (
        <div className="warehouse-cell">
          <div><HomeOutlined /> {record.TypeKho}</div>
          <Tag color="blue" style={{ marginTop: 4 }}>{record.Type}</Tag>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      align: "center",
      width: 120,
      render: (status) => (
        <Tag color={status === "Trả NCC" ? "error" : "success"}>
          {status || "Đã nhập"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      width: 60,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => setDetailModal({ visible: true, record })}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <div className="importlist-page">
      {/* --- HEADER --- */}
      <div className="page-header">
        <div className="header-title">
          <h2>Quản Lý Nhập Kho</h2>
          <p>Theo dõi và quản lý lịch sử nhập kho thiết bị</p>
        </div>
        <div className="header-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setOpenAddModal(true)}
          >
            Nhập kho mới
          </Button>
        </div>
      </div>

      {/* --- STATS & FILTERS --- */}
      <Row gutter={[16, 16]} className="stats-filter-section">
        {/* Statistics Cards */}
        <Col xs={24} md={6}>
          <Card bordered={false} className="stat-card total-card">
            <Statistic
              title="Tổng số lượng nhập"
              value={totalItems}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card bordered={false} className="filter-card">
            <Form
              form={form}
              layout="inline"
              onFinish={handleSearch}
              className="filter-form"
            >
              <Form.Item name="BrandName" style={{ width: 200, marginBottom: 10 }}>
                <Select placeholder="Thương hiệu" allowClear showSearch>
                  {uniqueBrands.map(b => <Option key={b} value={b}>{b}</Option>)}
                </Select>
              </Form.Item>

              <Form.Item name="Type" style={{ width: 180, marginBottom: 10 }}>
                <Select placeholder="Loại thiết bị" allowClear>
                  {[...new Set(importlist.map(i => i.Type).filter(Boolean))].map(t =>
                    <Option key={t} value={t}>{t}</Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item name="searchText" style={{ width: 250, marginBottom: 10 }}>
                <Input prefix={<SearchOutlined />} placeholder="Tìm theo Tên SP, Model..." />
              </Form.Item>

              <div className="filter-actions" style={{ marginBottom: 10 }}>
                <Button type="primary" htmlType="submit">Tìm kiếm</Button>
                <Button onClick={resetFilters} icon={<ReloadOutlined />} />
                <Button onClick={handleExport} icon={<FileExcelOutlined />} className="btn-excel">Excel</Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* --- QUICK BRAND STATS --- */}
      {modelCounts.length > 0 && (
        <div className="brand-quick-stats">
          <span className="label">Thống kê nhanh:</span>
          <div className="tags-scroll">
            {modelCounts.map(({ label, count }) => (
              <Tag key={label} color="geekblue">
                {label}: <b>{count}</b>
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* --- TABLE --- */}
      <div className="table-container">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredList}
          loading={loading}
          pagination={{
            ...pagination,
            showTotal: (total) => `Tổng ${total} phiếu`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
          onRow={(record) => ({
            onDoubleClick: () => setDetailModal({ visible: true, record }),
            className: "clickable-row"
          })}
          size="middle"
        />
      </div>

      {/* --- MODALS --- */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarcodeOutlined /> <span>Chi tiết phiếu nhập</span>
          </div>
        }
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={null}
        width={700}
        centered
      >
        {detailModal.record && (
          <>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" layout="vertical">
              <Descriptions.Item label="Tên sản phẩm">{detailModal.record.ProductName}</Descriptions.Item>
              <Descriptions.Item label="Model">{detailModal.record.Model}</Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">{detailModal.record.BrandName}</Descriptions.Item>
              <Descriptions.Item label="ĐVT">{detailModal.record.DVT}</Descriptions.Item>
              <Descriptions.Item label="Kho lưu trữ">{detailModal.record.TypeKho}</Descriptions.Item>
              <Descriptions.Item label="Mã Ticket">{detailModal.record.Ticket}</Descriptions.Item>
              <Descriptions.Item label="Số lượng nhập">
                <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{detailModal.record.totalimport}</span>
              </Descriptions.Item>
              <Descriptions.Item label="SL Trả NCC">
                <span style={{ color: '#ff4d4f' }}>{detailModal.record.totalimportNCC || 0}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Serial Number" span={2}>
                <div className="serial-box">
                  {detailModal.record.SerialNumber || "Không có S/N"}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {detailModal.record.Note || "-"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={() => setDetailModal({ visible: false, record: null })}>Đóng</Button>
              {detailModal.record?.Status === null && account?.Purchase === true && (
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    setOpenReturnModal({ visible: true, record: detailModal.record });
                    setDetailModal({ visible: false, record: null });
                  }}
                >
                  Trả NCC
                </Button>
              )}
            </div>
          </>
        )}
      </Modal>

      <AddImportList
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onConfirmSuccess={loadImportlist}
        destroyOnClose
      />

      <ReturnSupplierModal
        open={openReturnModal.visible}
        record={openReturnModal.record}
        onClose={() => setOpenReturnModal({ visible: false, record: null })}
        onConfirmSuccess={loadImportlist}
      />
    </div>
  );
};

export default ImportList;
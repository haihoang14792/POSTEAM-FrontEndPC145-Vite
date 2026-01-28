import React, { useEffect, useState } from "react";
import {
  fetchExportlists,
  updateExportlistsData,
  fetchWarehouseDetails,
  updateWarehouseDetails,
} from "../../../services/dhgServices";
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
  Checkbox,
  Card,
  Statistic,
  Space,
  Tooltip,
  Divider,
  Typography,
  Row,
  Col
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  CodeSandboxOutlined,
  UserOutlined,
  ReloadOutlined,
  EyeOutlined,
  BarcodeOutlined,
  ExportOutlined,
  ImportOutlined
} from "@ant-design/icons";
import AddExportList from "./AddExportList";
import AddExportListW from "./AddExportListW";
import UpdateExportList from "./UpdateExportList";
import "./ExportList.scss";

const { Option } = Select;
const { Title, Text } = Typography;

const ExportList = () => {
  const [exportlist, setExportList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const [detailModal, setDetailModal] = useState({
    visible: false,
    record: null,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddModalOpenW, setIsAddModalOpenW] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);

  // Load danh sách xuất kho
  const loadExportList = async () => {
    setLoading(true);
    try {
      const res = await fetchExportlists();
      const data = Array.isArray(res) ? res : (res.data || []);
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setExportList(sortedData);
      setFilteredList(sortedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách xuất kho:", error);
      message.error("Không thể tải danh sách xuất kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExportList();
  }, []);

  // Tìm kiếm / lọc
  const handleSearch = (values) => {
    let results = [...exportlist];

    if (values.TypeKho) {
      results = results.filter((t) => t?.TypeKho === values.TypeKho);
    }
    if (values.Status) {
      results = results.filter((t) => t?.Status === values.Status);
    }
    if (values.NameExport) {
      results = results.filter((t) => t?.NameExport === values.NameExport);
    }
    if (values.searchText) {
      const text = values.searchText.toLowerCase();
      results = results.filter(
        (t) =>
          t?.Model?.toLowerCase().includes(text) ||
          t?.ProductName?.toLowerCase().includes(text) ||
          t?.SerialNumber?.toLowerCase().includes(text) ||
          t?.SerialNumberLoan?.toLowerCase().includes(text) ||
          t?.SerialNumberDHG?.toLowerCase().includes(text)
      );
    }
    if (values.searchTextTicket) {
      const text = values.searchTextTicket.toLowerCase();
      results = results.filter(
        (t) =>
          t?.Ticket?.toLowerCase().includes(text) ||
          t?.TicketDHG?.toLowerCase().includes(text)
      );
    }

    setFilteredList(results);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredList(exportlist);
  };

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredList.map((item) => ({
        "Tên sản phẩm": item.ProductName,
        Model: item.Model,
        ĐVT: item.DVT,
        "Số lượng": item.totalexport,
        Kho: item.TypeKho,
        Ticket: item.Ticket,
        "Serial mượn": item.SerialNumber,
        "Số lượng xuất": item.totalexportLoan,
        "Serial xuất": item.SerialNumberLoan,
        "Trạng thái": item.Status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExportList");
    XLSX.writeFile(wb, "ExportList.xlsx");
  };

  // --- Logic Xử lý (Complete, Approve, Return) ---

  const handleConfirmComplete = async (record) => {
    // 🔥 SỬA: Lấy documentId (Strapi v5) hoặc id (fallback)
    const recordId = record.documentId || record.id;

    Modal.confirm({
      title: "Xác nhận hoàn thành phiếu",
      content: "Bạn có muốn xác nhận phiếu này đã hoàn thành không?",
      okText: "Xác nhận",
      cancelText: "Trở về",
      onOk: async () => {
        try {
          // 🔥 SỬA: Dùng recordId thay vì record.id
          await updateExportlistsData(recordId, {
            Status: "Hoàn thành phiếu",
          });
          const updated = exportlist.map((item) =>
            (item.documentId === recordId || item.id === recordId) ? { ...item, Status: "Hoàn thành phiếu" } : item
          );
          setExportList(updated);
          setFilteredList(updated);

          // Cập nhật lại record trong modal nếu đang mở
          if (detailModal.record && (detailModal.record.documentId === recordId || detailModal.record.id === recordId)) {
            setDetailModal(prev => ({ ...prev, record: { ...prev.record, Status: "Hoàn thành phiếu" } }));
          }

          message.success("Cập nhật trạng thái thành công!");
        } catch (error) {
          console.error(error);
          message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
      },
    });
  };

  const handleConfirmApprove = async (record) => {
    // 🔥 SỬA: Lấy documentId
    const recordId = record.documentId || record.id;

    Modal.confirm({
      title: "Xác nhận duyệt phiếu",
      content: "Duyệt phiếu và chuyển trạng thái sang 'Đang mượn'?",
      okText: "Duyệt phiếu",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // 🔥 SỬA: Dùng recordId
          await updateExportlistsData(recordId, { Status: "Đang mượn" });
          const updated = exportlist.map((item) =>
            (item.documentId === recordId || item.id === recordId) ? { ...item, Status: "Đang mượn" } : item
          );
          setExportList(updated);
          setFilteredList(updated);

          // Cập nhật modal
          if (detailModal.record && (detailModal.record.documentId === recordId || detailModal.record.id === recordId)) {
            setDetailModal(prev => ({ ...prev, record: { ...prev.record, Status: "Đang mượn" } }));
          }

          message.success("Phiếu đã được duyệt thành công!");
        } catch (error) {
          console.error(error);
          message.error("Có lỗi xảy ra khi duyệt phiếu!");
        }
      },
    });
  };

  const handleReturnDHG = async (record) => {
    const Type = record.Type;
    const totalExport = record.totalexport || 0;
    // 🔥 SỬA: Lấy documentId cho ExportList
    const recordId = record.documentId || record.id;

    if (totalExport === 0) return message.warning("Không có sản phẩm nào để trả!");

    // --- TRƯỜNG HỢP 1: VẬT TƯ ---
    if (Type === "Vật tư") {
      let quantityToReturn = 0;
      Modal.confirm({
        title: "Trả kho Vật tư",
        content: (
          <Input
            type="number"
            min={1}
            max={totalExport}
            placeholder={`Nhập số lượng trả (tối đa ${totalExport})`}
            onChange={(e) => { quantityToReturn = Number(e.target.value); }}
          />
        ),
        onOk: async () => {
          if (!quantityToReturn || quantityToReturn <= 0 || quantityToReturn > totalExport) {
            return message.warning("Số lượng trả không hợp lệ!");
          }
          try {
            const warehouseList = await fetchWarehouseDetails();
            const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);
            const matched = warehouseData.find((w) => w.Model === record.Model);

            if (!matched) return message.error("Không tìm thấy sản phẩm trong kho!");

            // 🔥 SỬA: Lấy documentId cho Warehouse
            const warehouseId = matched.documentId || matched.id;

            const updatePayload = {
              DHG: (matched.DHG || 0) + quantityToReturn,
              POS: record.TypeKho === "POS" ? (matched.POS || 0) - quantityToReturn : matched.POS,
              POSHN: record.TypeKho === "POSHN" ? (matched.POSHN || 0) - quantityToReturn : matched.POSHN,
            };

            // Cập nhật kho
            await updateWarehouseDetails(warehouseId, updatePayload);

            // Cập nhật phiếu xuất
            await updateExportlistsData(recordId, {
              totalexport: totalExport - quantityToReturn,
              totalexportDHG: (record.totalexportDHG || 0) + quantityToReturn,
            });

            // Update UI
            const updated = exportlist.map((item) =>
              (item.documentId === recordId || item.id === recordId)
                ? {
                  ...item,
                  totalexport: totalExport - quantityToReturn,
                  totalexportDHG: (item.totalexportDHG || 0) + quantityToReturn,
                }
                : item
            );
            setExportList(updated);
            setFilteredList(updated);

            // Cập nhật Modal
            if (detailModal.record && (detailModal.record.documentId === recordId || detailModal.record.id === recordId)) {
              setDetailModal(prev => ({
                ...prev,
                record: {
                  ...prev.record,
                  totalexport: totalExport - quantityToReturn,
                  totalexportDHG: (prev.record.totalexportDHG || 0) + quantityToReturn,
                }
              }));
            }

            message.success("Trả kho Vật tư thành công!");
          } catch (err) {
            console.error(err);
            message.error("Có lỗi xảy ra khi trả kho Vật tư!");
          }
        },
      });
      return;
    }

    // --- TRƯỜNG HỢP 2: THIẾT BỊ (CÓ SERIAL) ---
    const serialBorrowedList = (record.SerialNumber || "").split(",").map((s) => s.trim()).filter((s) => s !== "");
    if (!serialBorrowedList.length) return message.warning("Không có serial nào để trả!");

    let selectedReturnSerials = [];
    Modal.confirm({
      title: "Chọn serial trả kho DHG",
      width: 500,
      content: (
        <div style={{ maxHeight: 300, overflowY: "auto", marginTop: 10, border: '1px solid #f0f0f0', padding: 10, borderRadius: 6 }}>
          {serialBorrowedList.map((serial) => (
            <div key={serial} style={{ marginBottom: 4 }}>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) selectedReturnSerials.push(serial);
                  else selectedReturnSerials = selectedReturnSerials.filter((s) => s !== serial);
                }}
              >
                {serial}
              </Checkbox>
            </div>
          ))}
        </div>
      ),
      onOk: async () => {
        if (!selectedReturnSerials.length) return message.warning("Vui lòng chọn serial để trả!");
        try {
          const warehouseList = await fetchWarehouseDetails();
          const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);
          const matched = warehouseData.find((w) => w.Model === record.Model);
          if (!matched) return message.error("Không tìm thấy sản phẩm trong kho!");

          // 🔥 SỬA: Lấy documentId cho Warehouse
          const warehouseId = matched.documentId || matched.id;

          const soLuongTra = selectedReturnSerials.length;
          const updatePayload = {
            DHG: (matched.DHG || 0) + soLuongTra,
            POS: record.TypeKho === "POS" ? (matched.POS || 0) - soLuongTra : matched.POS,
            POSHN: record.TypeKho === "POSHN" ? (matched.POSHN || 0) - soLuongTra : matched.POSHN,
          };

          await updateWarehouseDetails(warehouseId, updatePayload);

          const newSerialNumber = serialBorrowedList.filter((s) => !selectedReturnSerials.includes(s)).join(", ");
          const currentSerialDHG = record.SerialNumberDHG ? record.SerialNumberDHG.split("\n").filter((s) => s) : [];
          const updatedSerialDHG = [...currentSerialDHG, ...selectedReturnSerials].join("\n");

          await updateExportlistsData(recordId, {
            totalexport: totalExport - soLuongTra,
            totalexportDHG: (record.totalexportDHG || 0) + soLuongTra,
            SerialNumber: newSerialNumber,
            SerialNumberDHG: updatedSerialDHG,
          });

          const updated = exportlist.map((item) =>
            (item.documentId === recordId || item.id === recordId)
              ? {
                ...item,
                totalexport: totalExport - soLuongTra,
                totalexportDHG: (item.totalexportDHG || 0) + soLuongTra,
                SerialNumber: newSerialNumber,
                SerialNumberDHG: updatedSerialDHG,
              }
              : item
          );
          setExportList(updated);
          setFilteredList(updated);

          // Cập nhật Modal
          if (detailModal.record && (detailModal.record.documentId === recordId || detailModal.record.id === recordId)) {
            setDetailModal(prev => ({
              ...prev,
              record: {
                ...prev.record,
                totalexport: totalExport - soLuongTra,
                totalexportDHG: (prev.record.totalexportDHG || 0) + soLuongTra,
                SerialNumber: newSerialNumber,
                SerialNumberDHG: updatedSerialDHG,
              }
            }));
          }

          message.success("Trả kho DHG thành công!");
        } catch (err) {
          console.error(err);
          message.error("Có lỗi xảy ra khi trả kho DHG!");
        }
      },
    });
  };

  const handleUpdate = (record) => {
    setUpdatedData(record);
    setIsUpdateModalOpen(true);
  };

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // --- THỐNG KÊ DATA ---
  const stats = {
    total: filteredList.length,
    borrowing: filteredList.filter((i) => i.Status === "Đang mượn").length,
    completed: filteredList.filter((i) => i.Status === "Hoàn thành phiếu").length,
    pending: filteredList.filter((i) => i.Status === "Chờ duyệt").length,
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    {
      title: "STT",
      align: "center",
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Thông tin Sản Phẩm",
      key: "productInfo",
      width: 250,
      render: (_, record) => (
        <div className="product-cell">
          <div className="product-name">{record.ProductName}</div>
          <div className="product-model">
            <Tag color="cyan">{record.BrandName || "N/A"}</Tag>
            <span>{record.Model}</span>
          </div>
        </div>
      )
    },
    {
      title: "Người mượn",
      dataIndex: "NameExport",
      width: 150,
      render: (text) => <span style={{ fontWeight: 500 }}><UserOutlined /> {text}</span>
    },
    {
      title: "Ticket",
      key: "ticket",
      width: 140,
      render: (_, record) => (
        <div className="ticket-cell">
          {record.Ticket && <Tag color="blue">{record.Ticket}</Tag>}
          {record.TicketDHG && <Tag color="purple" style={{ marginTop: 4 }}>{record.TicketDHG}</Tag>}
        </div>
      )
    },
    {
      title: "Số lượng",
      children: [
        { title: "Mượn", dataIndex: "totalexport", key: "totalexport", align: "center", width: 70, render: val => <b style={{ color: '#1890ff' }}>{val}</b> },
        { title: "Xuất", dataIndex: "totalexportLoan", key: "totalexportLoan", align: "center", width: 70 },
        { title: "Đã trả", dataIndex: "totalexportDHG", key: "totalexportDHG", align: "center", width: 70, render: val => <span style={{ color: '#52c41a' }}>{val}</span> },
      ]
    },
    {
      title: "Kho",
      dataIndex: "TypeKho",
      align: "center",
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      align: "center",
      width: 140,
      render: (status) => {
        let color = "default";
        let icon = null;
        if (status === "Hoàn thành phiếu") { color = "success"; icon = <CheckCircleOutlined />; }
        else if (status === "Đang mượn") { color = "processing"; icon = <ClockCircleOutlined />; }
        else if (status === "Chờ duyệt") { color = "warning"; icon = <SyncOutlined spin />; }
        return <Tag icon={icon} color={color}>{status}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button type="text" icon={<EyeOutlined />} onClick={() => setDetailModal({ visible: true, record })} />
        </Tooltip>
      )
    }
  ];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <div className="export-list-page">

      {/* --- HEADER & STATS --- */}
      <Card bordered={false} className="header-card shadow-sm">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="header-title-box">
              <Title level={4} style={{ margin: 0, color: '#001529' }}>Quản Lý Phiếu Xuất</Title>
              <Text type="secondary" style={{ fontSize: '13px' }}>Theo dõi bàn giao, thu hồi và bảo hành</Text>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <div className="header-stats-actions">
              <Space size="large" split={<Divider type="vertical" style={{ height: 32 }} />}>
                <Statistic
                  title="Chờ duyệt"
                  value={stats.pending}
                  valueStyle={{ color: '#faad14', fontSize: '16px', fontWeight: 600 }}
                  prefix={<SyncOutlined spin />}
                />
                <Statistic
                  title="Đang mượn"
                  value={stats.borrowing}
                  valueStyle={{ color: '#1890ff', fontSize: '16px', fontWeight: 600 }}
                  prefix={<ClockCircleOutlined />}
                />
                <Statistic
                  title="Hoàn thành"
                  value={stats.completed}
                  valueStyle={{ color: '#52c41a', fontSize: '16px', fontWeight: 600 }}
                  prefix={<CheckCircleOutlined />}
                />
                <Statistic
                  title="Tổng phiếu"
                  value={stats.total}
                  valueStyle={{ fontSize: '18px', fontWeight: 'bold' }}
                />
              </Space>

              <Space size="small" className="action-buttons-group">
                {account?.Exportlist === true && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                    Tạo Phiếu
                  </Button>
                )}
                {account?.WritePOS === true && (
                  <Button className="btn-warranty" icon={<CodeSandboxOutlined />} onClick={() => setIsAddModalOpenW(true)}>
                    Bảo Hành
                  </Button>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* --- MAIN CONTENT --- */}
      <Card bordered={false} className="main-content-card shadow-sm">
        {/* Filter */}
        <Form form={form} layout="inline" onFinish={handleSearch} className="filter-form">
          <Form.Item name="TypeKho">
            <Select placeholder="Kho" style={{ width: 100 }} allowClear>
              {[...new Set(exportlist.map((i) => i.TypeKho))].map(k => <Option key={k} value={k}>{k}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="Status">
            <Select placeholder="Trạng thái" style={{ width: 140 }} allowClear>
              {[...new Set(exportlist.map((i) => i.Status))].map(s => <Option key={s} value={s}>{s}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="NameExport">
            <Select placeholder="Người mượn" style={{ width: 140 }} allowClear showSearch>
              {[...new Set(exportlist.map((i) => i.NameExport))].map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="searchText">
            <Input prefix={<SearchOutlined />} placeholder="Tên SP / Model / Serial" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="searchTextTicket">
            <Input prefix={<BarcodeOutlined />} placeholder="Ticket / Số phiếu" style={{ width: 140 }} />
          </Form.Item>

          <div className="filter-actions-right">
            <Space>
              <Button type="primary" ghost htmlType="submit" icon={<SearchOutlined />}>Tìm</Button>
              <Tooltip title="Reset bộ lọc"><Button icon={<ReloadOutlined />} onClick={resetFilters} /></Tooltip>
              <Tooltip title="Xuất Excel"><Button icon={<FileExcelOutlined />} onClick={handleExportExcel} className="btn-excel" /></Tooltip>
            </Space>
          </div>
        </Form>

        {/* Table */}
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
          scroll={{ x: 1200 }}
          className="export-table"
          onRow={(record) => ({
            onDoubleClick: () => setDetailModal({ visible: true, record }),
          })}
          size="middle"
        />
      </Card>

      {/* --- MODAL CHI TIẾT (Đã Redesign) --- */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#e6f7ff', padding: 8, borderRadius: '50%', color: '#1890ff' }}>
              <FileDoneOutlined style={{ fontSize: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#262626' }}>Chi Tiết Phiếu Xuất</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c' }}>Mã quản lý: {detailModal.record?.Ticket || "N/A"}</div>
            </div>
          </div>
        }
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={null}
        width={850}
        className="modern-detail-modal"
        centered
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
          },
        }}
      >
        {detailModal.record && (
          <div className="detail-modal-content">
            {/* Phần thông tin chính - Chia 2 cột */}
            <div className="info-section">
              <Row gutter={[24, 24]}>
                {/* Cột trái: Thông tin sản phẩm */}
                <Col span={12}>
                  <Card title="📦 Thông tin sản phẩm" size="small" bordered={false} className="info-card bg-gray">
                    <div className="info-row">
                      <span className="label">Sản phẩm:</span>
                      <span className="value highlight">{detailModal.record.ProductName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Model:</span>
                      <span className="value code">{detailModal.record.Model}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Thương hiệu:</span>
                      <span className="value">{detailModal.record.BrandName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Kho xuất:</span>
                      <Tag color="cyan">{detailModal.record.TypeKho}</Tag>
                    </div>
                    <div className="info-row">
                      <span className="label">Kiểu thiết bị:</span>
                      <Tag color="red">{detailModal.record.TypeDevice}</Tag>
                    </div>
                  </Card>
                </Col>

                {/* Cột phải: Thông tin phiếu */}
                <Col span={12}>
                  <Card title="📄 Thông tin giao dịch" size="small" bordered={false} className="info-card bg-gray">
                    <div className="info-row">
                      <span className="label">Trạng thái:</span>
                      <Tag color={detailModal.record.Status === 'Hoàn thành phiếu' ? 'green' : detailModal.record.Status === 'Đang mượn' ? 'blue' : 'orange'}>
                        {detailModal.record.Status}
                      </Tag>
                    </div>
                    <div className="info-row">
                      <span className="label">Ngày tạo:</span>
                      <span className="value">{new Date(detailModal.record.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Người mượn:</span>
                      <span className="value" style={{ fontWeight: 600 }}> <UserOutlined /> {detailModal.record.NameExport}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Người tạo:</span>
                      <span className="value">{detailModal.record.NameCreate}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Ticket DHG:</span>
                      <span className="value">{detailModal.record.TicketDHG || "---"}</span>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Phần Số lượng & Serial */}
            <div className="serial-section">
              <Row gutter={24} style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <Statistic
                    title="Số lượng Mượn"
                    value={detailModal.record.totalexport}
                    valueStyle={{ color: '#1890ff', fontWeight: 700 }}
                    prefix={<ExportOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Đã Xuất"
                    value={detailModal.record.totalexportLoan}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Đã Trả lại"
                    value={detailModal.record.totalexportDHG}
                    valueStyle={{ color: '#52c41a', fontWeight: 700 }}
                    prefix={<ImportOutlined />}
                  />
                </Col>
              </Row>

              <div className="serial-block">
                <Text strong>Danh sách Serial Mượn:</Text>
                <div className="serial-box main-serial">
                  {detailModal.record.SerialNumber || "Không có serial"}
                </div>
              </div>
              {detailModal.record.SerialNumberLoan && (
                <div className="serial-block">
                  <Text strong>Danh sách Serial Xuất:</Text>
                  <div className="serial-box main-serial">
                    {detailModal.record.SerialNumberLoan || "Không có serial"}
                  </div>
                </div>)}

              {detailModal.record.SerialNumberDHG && (
                <div className="serial-block" style={{ marginTop: 12 }}>
                  <Text strong>Danh sách Serial Đã Trả:</Text>
                  <div className="serial-box return-serial">
                    {detailModal.record.SerialNumberDHG}
                  </div>
                </div>
              )}

              {detailModal.record.Note && (
                <div className="note-block" style={{ marginTop: 12 }}>
                  <Text type="secondary" italic>Ghi chú: {detailModal.record.Note}</Text>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="modal-actions-footer">
              {account?.Exportlist === true && (
                <Button icon={<EditOutlined />} onClick={() => handleUpdate(detailModal.record)}>
                  Cập nhật
                </Button>
              )}
              {detailModal.record.Status === "Chờ duyệt" && detailModal.record.TypeDevice &&
                (account?.Leader === true || account?.Exportlist === true) && (
                  <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleConfirmApprove(detailModal.record)}>
                    Duyệt phiếu
                  </Button>
                )}
              {detailModal.record.totalexport !== 0 && detailModal.record.Status === "Đang mượn" && account?.Exportlist === true && (
                <Button className="btn-return" onClick={() => handleReturnDHG(detailModal.record)}>
                  <SyncOutlined /> Trả kho DHG
                </Button>
              )}
              {detailModal.record.totalexport === 0 && detailModal.record.Status === "Đang mượn" && account?.Exportlist === true && (
                <Button type="primary" danger icon={<CheckOutlined />} onClick={() => handleConfirmComplete(detailModal.record)}>
                  Hoàn thành
                </Button>
              )}
              <Button onClick={() => setDetailModal({ visible: false, record: null })}>Đóng</Button>
            </div>
          </div>
        )}
      </Modal>

      <AddExportList
        isModalOpen={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onCreated={(newData) => {
          setExportList(prev => [newData, ...prev]);
          setFilteredList(prev => [newData, ...prev]);
          setIsAddModalOpen(false);
        }}
      />
      <AddExportListW
        isModalOpen={isAddModalOpenW}
        onCancel={() => setIsAddModalOpenW(false)}
        onCreated={(newData) => {
          setExportList(prev => [newData, ...prev]);
          setFilteredList(prev => [newData, ...prev]);
          setIsAddModalOpenW(false);
        }}
      />
      <UpdateExportList
        isModalOpen={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        updatedData={updatedData}
        onUpdated={(updatedExport) => {
          const updated = exportlist.map(item => item.id === updatedExport.id ? updatedExport : item);
          setExportList(updated);
          setFilteredList(updated);
          if (detailModal.visible && detailModal.record?.id === updatedExport.id) {
            setDetailModal({ ...detailModal, record: updatedExport });
          }
          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
};

export default ExportList;
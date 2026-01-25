import React, { useEffect, useState } from "react";
import {
  fetchExportlists,
  fetchExportLoanTicket,
  fetchExportLoanPOS,
  fetchExportLoans,
} from "../../../services/dhgServices";
import {
  Button,
  Table,
  message,
  Row,
  Col,
  Tag,
  Form,
  Select,
  Input,
  DatePicker,
  Modal,
  Descriptions,
  Card,
  Space,
  Tooltip,
  Divider,
  Typography,
  Statistic
} from "antd";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  ExclamationCircleOutlined,
  FileTextTwoTone,
  CalculatorTwoTone,
  WarningTwoTone,
  CheckSquareTwoTone,
  SearchOutlined,
  InteractionTwoTone,
  EditTwoTone,
  ReconciliationTwoTone,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  FilterOutlined
} from "@ant-design/icons";
import AddExportLoanPOS from "./AddExportLoanPOS";
import TicketExportLoanModal from "./TicketExportLoanModal";
import "./ExportLoanPOS.scss";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ExportLoanPOS = () => {
  // --- STATE MANAGEMENT ---
  const [devices, setDevices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [ticketModal, setTicketModal] = useState({
    selectedTicket: null,
    isOpen: false,
  });
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [serialNumberOptions, setSerialNumberOptions] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [exportLoans, setExportLoans] = useState([]);
  const [form] = Form.useForm();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    selectedTicket: null,
  });
  const [lastSearchValues, setLastSearchValues] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const displayTickets = isFiltered ? filteredTickets : tickets;
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // --- EFFECTS ---
  useEffect(() => {
    const loadData = async () => {
      await loadTickets();
      await fetchDevices();
      await loadExportLoans();
    };
    loadData();
  }, []);

  // [CẬP NHẬT] Thêm exportLoans vào dependency để cập nhật bộ lọc khi chi tiết thay đổi
  useEffect(() => {
    if (isFiltered && lastSearchValues) {
      handleSearch(lastSearchValues);
    } else {
      setFilteredTickets(tickets);
    }
  }, [tickets, exportLoans]);

  // --- API CALLS ---
  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetchExportLoanTicket();
      const ticketsArray = Array.isArray(response.data) ? response.data : response;

      if (!ticketsArray || !Array.isArray(ticketsArray)) {
        if (response?.data && Array.isArray(response?.data)) {
          // handled above
        } else {
          throw new Error("API không trả về danh sách phiếu hợp lệ");
        }
      }

      const finalArray = Array.isArray(ticketsArray) ? ticketsArray : (response.data || []);
      const sortedTickets = finalArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTickets(sortedTickets);
      if (isFiltered) {
        const values = form.getFieldsValue();
        handleSearch(values);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách phiếu!");
    } finally {
      setLoading(false);
    }
  };

  const loadExportLoans = async () => {
    try {
      const response = await fetchExportLoans();
      const exportLoansArray = Array.isArray(response.data) ? response.data : (response || []);
      setExportLoans(exportLoansArray);
    } catch (error) {
      message.error("Lỗi khi tải danh sách thiết bị con!");
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetchExportlists();
      const devicesArray = Array.isArray(response.data) ? response.data : (response || []);
      setDevices(devicesArray);
      const options = devicesArray.map((device) => ({
        value: device.SerialNumber,
        label: device.SerialNumber,
        ...device,
      }));
      setSerialNumberOptions(options);
    } catch (error) {
      message.error("Lỗi khi tải danh sách thiết bị!");
    }
  };

  // [THÊM MỚI] Hàm làm mới toàn bộ dữ liệu khi đóng Modal
  const handleRefreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadTickets(),      // Load lại phiếu
        loadExportLoans(),  // Load lại chi tiết thiết bị trong phiếu (để search chính xác)
        fetchDevices()      // Load lại kho (để cập nhật tồn kho)
      ]);
    } catch (error) {
      console.error("Lỗi làm mới dữ liệu:", error);
      message.error("Không thể làm mới dữ liệu đầy đủ.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleExport = async () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một phiếu để xuất!");
      return;
    }

    const selectedTickets = tickets.filter((ticket) =>
      selectedRowKeys.includes(ticket.id)
    );

    message.loading("Đang tải dữ liệu thiết bị...", 0);

    const exportData = [];
    for (const ticket of selectedTickets) {
      try {
        const responseData = await fetchExportLoanPOS(ticket.Votes);
        if (responseData && responseData.length > 0) {
          responseData.forEach((device) => {
            exportData.push(formatExportItem(ticket, device));
          });
        } else {
          exportData.push(formatExportItem(ticket, null));
        }
      } catch (error) {
        console.error(`Lỗi lấy thiết bị cho phiếu ${ticket.Votes}:`, error);
        exportData.push(formatExportItem(ticket, null));
      }
    }

    message.destroy();
    message.success("Xuất dữ liệu thành công!");

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExportTickets");
    XLSX.writeFile(wb, `Danh_sach_phieu_muon_${dayjs().format("DDMMYYYY")}.xlsx`);
  };

  const formatExportItem = (ticket, device) => ({
    "Mã phiếu xuất": ticket.Votes,
    "Ticket Dingtalk": ticket.Ticket,
    "Khách hàng": ticket.Customer,
    "Cửa hàng": ticket.Store,
    "Người mượn": ticket.Person,
    "Người xuất hóa đơn": ticket.PersonInvoice,
    "Số hóa đơn": ticket.InvoiceNumber,
    "Trạng thái": ticket.Status,
    "Ngày tạo": dayjs(ticket.createdAt).format("DD/MM/YYYY HH:mm"),
    "Sản phẩm": device ? device.ProductName : "Không có dữ liệu",
    "Model": device ? device.Model : "",
    "Serial Number": device ? device.SerialNumber : "",
    "Số lượng": device ? device.totalexport : "",
  });

  const handleSearch = (values) => {
    setLastSearchValues(values);
    let results = [...tickets];

    if (values.model || (values.dateRange && values.dateRange.length === 2) || values.searchText) {
      let filteredChildren = [...exportLoans];

      if (values.model) {
        filteredChildren = filteredChildren.filter((c) =>
          c.Model?.toLowerCase().includes(values.model.toLowerCase())
        );
      }

      if (values.dateRange && values.dateRange.length === 2) {
        const [start, end] = values.dateRange;
        filteredChildren = filteredChildren.filter((c) => {
          const created = dayjs(c.createdAt);
          return created.isAfter(start.startOf('day')) && created.isBefore(end.endOf('day'));
        });
      }

      if (values.searchText) {
        filteredChildren = filteredChildren.filter(
          (c) =>
            c.SerialNumber?.toLowerCase().includes(values.searchText.toLowerCase()) ||
            c.ProductName?.toLowerCase().includes(values.searchText.toLowerCase())
        );
      }

      const validVotes = [...new Set(filteredChildren.map((c) => c.Votes))];

      if (values.searchText) {
        const searchLower = values.searchText.toLowerCase();
        const ticketMatches = tickets.filter(t =>
          t.Votes?.toLowerCase().includes(searchLower) ||
          t.Ticket?.toLowerCase().includes(searchLower)
        ).map(t => t.Votes);
        validVotes.push(...ticketMatches);
      }

      results = results.filter((ticket) => validVotes.includes(ticket.Votes));
    }

    if (values.Status) {
      results = results.filter((t) => t?.Status === values.Status);
    }
    if (values.Customer) {
      results = results.filter((t) => t?.Customer === values.Customer);
    }
    if (values.Store) {
      results = results.filter((t) => t?.Store === values.Store);
    }

    setFilteredTickets(results);
    setIsFiltered(true);
    setPagination({ ...pagination, current: 1 });
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredTickets([]);
    setIsFiltered(false);
    setLastSearchValues(null);
  };

  // --- HELPERS ---
  const getStatusCount = (status) => tickets.filter((ticket) => ticket.Status === status).length;

  const renderStatusTag = (status) => {
    const config = {
      "Đang tạo phiếu": { color: "blue", icon: <EditTwoTone /> },
      "Đang chờ duyệt": { color: "warning", icon: <ClockCircleTwoTone twoToneColor="#faad14" /> },
      "Duyệt": { color: "success", icon: <CheckCircleTwoTone twoToneColor="#52c41a" /> },
      "Đã giao": { color: "processing", icon: <WarningTwoTone /> },
      "Xác nhận": { color: "success", icon: <CheckSquareTwoTone twoToneColor="#52c41a" /> },
      "Chờ xuất hóa đơn": { color: "error", icon: <FileTextTwoTone twoToneColor="#ff4d4f" /> },
      "Đã xuất hóa đơn": { color: "success", icon: <CalculatorTwoTone twoToneColor="#52c41a" /> },
      "Trả kho": { color: "magenta", icon: <InteractionTwoTone twoToneColor="#eb2f96" /> },
      "Bảo hành": { color: "purple", icon: <ReconciliationTwoTone twoToneColor="#722ed1" /> },
    };

    const item = config[status] || { color: "default", icon: null };
    return <Tag color={item.color} icon={item.icon}>{status}</Tag>;
  };

  const renderNotification = (createdAt, status) => {
    const createdTime = dayjs(createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdTime, 'hour');

    if (status === "Đang chờ duyệt" && diffInHours > 24)
      return <Tag color="orange" icon={<ExclamationCircleOutlined />}>Delay duyệt</Tag>;
    if (status === "Đang tạo phiếu" && diffInHours > 2)
      return <Tag color="red" icon={<ExclamationCircleOutlined />}>Chưa hoàn tất</Tag>;
    if (status === "Đã giao" && diffInHours > 12)
      return <Tag color="red" icon={<ExclamationCircleOutlined />}>Thiếu BBBG</Tag>;
    if (status === "Xác nhận" && diffInHours > 24)
      return <Tag color="purple" icon={<ExclamationCircleOutlined />}>Chưa giao SA</Tag>;
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
      title: "Thông tin phiếu",
      key: "Info",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1890ff' }}>{record.Votes}</Text>
          {record.Ticket && <Text type="secondary" style={{ fontSize: '12px' }}>Ticket: {record.Ticket}</Text>}
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
      title: "Người mượn",
      dataIndex: "Person",
      key: "Person",
      width: 140,
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
            onClick={() => setDetailModal({ selectedTicket: record, isOpen: true })}
          />
        </Tooltip>
      ),
    },
  ];

  const statusSummaryList = [
    { label: "Chờ duyệt", key: "Đang chờ duyệt", color: "#faad14" },
    { label: "Đã giao", key: "Đã giao", color: "#1890ff" },
    { label: "Chờ xuất HĐ", key: "Chờ xuất hóa đơn", color: "#ff4d4f" },
  ];

  return (
    <div className="export-loan-pos-container">
      {/* --- HEADER SUMMARY --- */}
      <Card bordered={false} className="mb-3 shadow-sm header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>Quản lý Phiếu mượn POS</Title>
            <Text type="secondary">Quản lý các phiếu xuất, mượn và trạng thái thiết bị</Text>
          </Col>
          <Col>
            <Space size="large">
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
                <Input placeholder="Số phiếu, Ticket..." prefix={<SearchOutlined className="text-muted" />} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="Status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" allowClear>
                  {[...new Set(tickets.map((i) => i.Status))].map(status => (
                    <Select.Option key={status} value={status}>{status}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="Store" label="Cửa hàng">
                <Select
                  placeholder="Chọn cửa hàng"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                >
                  {[...new Set(tickets.map((i) => i.Store))].filter(Boolean).sort().map(store => (
                    <Select.Option key={store} value={store}>{store}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="dateRange" label="Khoảng thời gian">
                <DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Form.Item label=" ">
                <Space wrap>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                  <Button icon={<ReloadOutlined />} onClick={resetFilters}>Làm mới</Button>
                  <Button icon={<ExportOutlined />} onClick={handleExport}>Excel</Button>
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
          dataSource={displayTickets}
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

      {/* Detail Modal */}
      <Modal
        title={<Space><FileTextTwoTone /> Chi tiết phiếu: {detailModal.selectedTicket?.Votes}</Space>}
        open={detailModal.isOpen}
        onCancel={() => setDetailModal({ isOpen: false, selectedTicket: null })}
        footer={[
          <Button key="close" onClick={() => setDetailModal({ isOpen: false, selectedTicket: null })}>Đóng</Button>,
          <Button key="edit" type="primary" onClick={() => {
            setTicketModal({ selectedTicket: detailModal.selectedTicket, isOpen: true });
            setDetailModal({ isOpen: false, selectedTicket: null });
          }}>Cập nhật sản phẩm</Button>
        ]}
        width={900}
      >
        {detailModal.selectedTicket && (
          <>
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} size="small">
              <Descriptions.Item label="Trạng thái">{renderStatusTag(detailModal.selectedTicket.Status)}</Descriptions.Item>
              <Descriptions.Item label="Khách hàng">{detailModal.selectedTicket.Customer}</Descriptions.Item>
              <Descriptions.Item label="Cửa hàng">{detailModal.selectedTicket.Store}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{dayjs(detailModal.selectedTicket.createdAt).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
              <Descriptions.Item label="Người nhận HĐ">{detailModal.selectedTicket.PersonInvoice || '-'}</Descriptions.Item>
              <Descriptions.Item label="Số hóa đơn">{detailModal.selectedTicket.InvoiceNumber || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" plain>Danh sách thiết bị</Divider>

            <Table
              size="small"
              rowKey="id"
              pagination={false}
              bordered
              dataSource={exportLoans.filter(e => e.Votes === detailModal.selectedTicket.Votes)}
              columns={[
                { title: "Tên sản phẩm", dataIndex: "ProductName" },
                { title: "Model", dataIndex: "Model" },
                { title: "Serial Number", dataIndex: "SerialNumber", render: (t) => <Text copyable>{t}</Text> },
                { title: "Số lượng", dataIndex: "totalexport", align: 'center', width: 100 },
              ]}
            />
          </>
        )}
      </Modal>

      <AddExportLoanPOS
        open={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        reloadTickets={loadTickets}
      />

      {ticketModal.isOpen && ticketModal.selectedTicket && (
        <TicketExportLoanModal
          isOpen={ticketModal.isOpen}
          onClose={() => setTicketModal({ ...ticketModal, isOpen: false })}
          ticket={ticketModal.selectedTicket}
          fetchDevices={fetchDevices}
          fetchTickets={fetchExportLoanTicket}
          serialNumberOptions={serialNumberOptions}
          // [CẬP NHẬT] Truyền hàm refresh data đầy đủ
          reloadTickets={handleRefreshData}
          modalWidth="90%"
          modalBodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
        />
      )}
    </div>
  );
};

export default ExportLoanPOS;
import React, { useEffect, useState } from "react";
import {
  fetchDevicemanager,
  fetchTicket,
  deleteTicketById,
  fetchDeviceDetailHandoverPOS,
} from "../../../../services/storeServices";
import {
  Button,
  Table,
  message,
  Card,
  Row,
  Col,
  Tag,
  Form,
  Select,
  Input,
  Modal,
} from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import CreateTicketModal from "./CreateTicketModal";
import TicketModal from "./TicketModal";
import "./DeviceManagers.scss";
import ReactPaginate from "react-paginate";

const DeviceManagers = () => {
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
  const [searchResults, setSearchResults] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await loadTickets();
      await fetchDevices();
    };
    loadData();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadTickets(); // tự động cập nhật danh sách phiếu
      }
    }, 60000); // 60 giây

    return () => clearInterval(interval); // cleanup interval khi unmount
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDeleteSelected = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} phiếu đã chọn không?`,
      cancelText: "Hủy",
      okText: "Xóa",
      onOk: async () => {
        try {
          for (const id of selectedRowKeys) {
            await deleteTicketById(id);
          }
          message.success("Đã xóa phiếu thành công!");
          setSelectedRowKeys([]);
          loadTickets();
        } catch (error) {
          message.error("Lỗi khi xóa phiếu!");
        }
      },
    });
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetchTicket();
      const ticketsArray = Array.isArray(response.data)
        ? response.data
        : response;
      if (!ticketsArray || !Array.isArray(ticketsArray)) {
        throw new Error("API không trả về danh sách phiếu hợp lệ");
      }
      const sortedTickets = ticketsArray.sort(
        (a, b) =>
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
      );
      setTickets(sortedTickets);
    } catch (error) {
      message.error("Lỗi khi tải danh sách phiếu!");
    }
    setLoading(false);
  };
  const fetchDevices = async () => {
    try {
      const devicesData = await fetchDevicemanager();
      setDevices(devicesData);
      const options = devicesData.map((device) => ({
        value: device.attributes.SerialNumber,
        label: device.attributes.SerialNumber,
        ...device.attributes,
      }));
      setSerialNumberOptions(options);
    } catch (error) {
      message.error("Lỗi khi tải danh sách thiết bị!");
    }
  };

  const handleRowClick = (record) => {
    setTicketModal({ selectedTicket: record, isOpen: true });
  };

  const toggleFilter = (status) => {
    setFilteredStatus(filteredStatus === status ? null : status);
    setCurrentPage(0); // reset về trang đầu khi filter
  };

  const getStatusCount = (status) => {
    return tickets.filter((ticket) => ticket.attributes.Status === status)
      .length;
  };

  const statusList = [
    { label: "Đang tạo phiếu", icon: <SyncOutlined spin />, color: "#1890FF" },
    {
      label: "Đang chờ duyệt",
      icon: <ClockCircleOutlined />,
      color: "#FAAD14",
    },
    { label: "Đã duyệt", icon: <CheckCircleOutlined />, color: "#52C41A" },
    { label: "Đã nhận phiếu", icon: <FileDoneOutlined />, color: "#FF9999" },
  ];

  const renderStatusTag = (status) => {
    let color, icon;
    switch (status) {
      case "Đang tạo phiếu":
        color = "#1890FF";
        icon = <SyncOutlined spin />;
        break;
      case "Đang chờ duyệt":
        color = "#FAAD14";
        icon = <ClockCircleOutlined />;
        break;
      case "Đã duyệt":
        color = "#52C41A";
        icon = <CheckCircleOutlined />;
        break;
      case "Đã nhận phiếu":
        color = "#FF9999";
        icon = <CheckCircleOutlined />;
        break;
      default:
        color = "gray";
        icon = null;
    }
    return (
      <Tag
        color={color}
        style={{
          fontSize: "14px",
          padding: "5px 10px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {icon} {status}
      </Tag>
    );
  };

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  const selectedTickets = tickets.filter((t) => selectedRowKeys.includes(t.id));

  const canDelete =
    account?.Leader === true &&
    selectedTickets.every(
      (ticket) => ticket?.attributes?.Status === "Đang tạo phiếu"
    );

  const renderNotification = (createdAt, status) => {
    const createdTime = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now - createdTime) / (1000 * 60 * 60);

    if (status === "Đang chờ duyệt" && diffInHours > 24) {
      return (
        <Tag color="orange">
          <ExclamationCircleOutlined /> Phiếu chưa duyệt
        </Tag>
      );
    }
    if (status === "Đang tạo phiếu" && diffInHours > 2) {
      return (
        <Tag color="red">
          <ExclamationCircleOutlined /> Phiếu cần hoàn tất
        </Tag>
      );
    }
    return null;
  };

  const searchBySerial = async (serial) => {
    try {
      const response = await fetchDeviceDetailHandoverPOS(serial);
      // console.log("📡 API Response raw:", response);

      // Strapi trả về { data: [...], meta: {...} }
      const handoverRes = response?.data || [];

      //console.log("📦 handoverRes:", handoverRes);

      if (handoverRes.length > 0) {
        return handoverRes.map((item) => item.attributes);
      } else {
        message.warning("Không tìm thấy Serial trong bàn giao POS!");
        return [];
      }
    } catch (error) {
      //console.error(error);
      message.error("Lỗi khi tìm kiếm Serial!");
      return [];
    }
  };

  const isMobile = window.innerWidth <= 768;

  const [form] = Form.useForm();
  // const [filteredTickets, setFilteredTickets] = useState([]);

  const handleSearch = async (values) => {
    let results = [...tickets];

    if (values.status) {
      results = results.filter((t) => t?.attributes?.Status === values.status);
    }
    if (values.serialNumber) {
      const deviceDetails = await searchBySerial(values.serialNumber);

      if (deviceDetails.length > 0) {
        const votesSet = new Set(deviceDetails.map((d) => d.Votes));
        results = results.filter((t) => votesSet.has(t?.attributes?.Votes));
      } else {
        results = [];
      }
    }

    if (values.Customer) {
      results = results.filter(
        (t) => t?.attributes?.Customer === values.Customer
      );
    }

    if (values.Store) {
      results = results.filter((t) => t?.attributes?.Store === values.Store);
    }

    if (values.searchText) {
      results = results.filter(
        (t) =>
          t?.attributes?.Votes?.toLowerCase().includes(
            values.searchText.toLowerCase()
          ) ||
          t?.attributes?.TenderName?.toLowerCase().includes(
            values.searchText.toLowerCase()
          )
      );
    }

    setSearchResults(results);
    setCurrentPage(0); // reset về trang đầu
  };

  const resetFilters = () => {
    form.resetFields();
    setSearchResults(null);
    setFilteredStatus(null); // để bỏ lọc theo trạng thái
    setCurrentPage(0);
  };

  const getDisplayedTickets = () => {
    let data = [...tickets];

    if (filteredStatus) {
      data = data.filter((t) => t?.attributes?.Status === filteredStatus);
    }

    if (searchResults) {
      const searchIds = new Set(searchResults.map((t) => t.id));
      data = data.filter((t) => searchIds.has(t.id));
    }

    return data.filter((t) => t && t.attributes);
  };

  const filteredTickets = getDisplayedTickets();
  const totalPages = Math.ceil(filteredTickets.length / pageSize);
  const paginatedTickets = filteredTickets.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const customerList = [
    ...new Set(filteredTickets.map((t) => t.attributes.Customer)),
  ];
  const storeList = [
    ...new Set(filteredTickets.map((t) => t.attributes.Store)),
  ];

  return (
    <div className="Device-container">
      {/* <h1>Phiếu Thiết Bị Khách Hàng</h1> */}
      {account.WritePOS === true && (
        <Button
          type="primary"
          onClick={() => setIsCreateTicketModalOpen(true)}
          className="button-spacing"
        >
          ➕ Tạo Phiếu
        </Button>
      )}
      {canDelete && (
        <Button
          type="danger"
          onClick={handleDeleteSelected}
          disabled={selectedRowKeys.length === 0}
          className="button-spacing"
        >
          🗑️ Xóa Phiếu
        </Button>
      )}

      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20, flexWrap: "wrap" }}
      >
        <Form.Item name="status">
          <Select
            placeholder="-- Trạng thái --"
            style={{ width: 180 }}
            allowClear
          >
            {["Đang tạo phiếu", "Đang chờ duyệt", "Đã duyệt"].map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="Customer">
          <Select placeholder="Khách Hàng" style={{ width: 180 }} allowClear>
            {customerList.map((Customer) => (
              <Select.Option key={Customer} value={Customer}>
                {Customer}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item name="Store">
          <Select placeholder="Cửa Hàng" style={{ width: 180 }} allowClear>
            {storeList.map((store) => (
              <Select.Option key={store} value={store}>
                {store}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}
        <Form.Item name="Store">
          <Select
            placeholder="Cửa Hàng"
            style={{ width: 180 }}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {storeList
              .sort((a, b) => a.localeCompare(b)) // 👉 Sắp xếp A-Z
              .map((store) => (
                <Select.Option key={store} value={store}>
                  {store}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="serialNumber">
          <Input placeholder="Nhập Serial" style={{ width: 200 }} />
        </Form.Item>

        <Form.Item name="searchText">
          <Input placeholder="Số Phiếu" style={{ width: 200 }} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SearchOutlined />}
          style={{ marginRight: 10 }}
        >
          Tìm kiếm
        </Button>

        <Form.Item>
          <Button onClick={resetFilters}>🧹 Reset</Button>
        </Form.Item>

        {/* <Form.Item>
    <Button type="dashed" onClick={handleExport}>📤 Export Excel</Button>
  </Form.Item> */}
      </Form>

      <Row
        gutter={[12, 12]}
        style={{ marginBottom: 20 }}
        className="status-summary"
      >
        {statusList.map(({ label, icon, color }) => (
          <Col key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontWeight: 500 }}>{label}:</span>
              <span style={{ fontWeight: "bold", color }}>
                {getStatusCount(label)}
              </span>
            </div>
          </Col>
        ))}
      </Row>

      {/* Bảng danh sách phiếu */}
      {!isMobile && (
        <>
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            locale={{ emptyText: "Không có dữ liệu phù hợp với tìm kiếm" }}
            dataSource={paginatedTickets}
            rowKey="id"
            loading={loading}
            style={{ marginTop: 20 }}
            pagination={false} // 👈 Tắt phân trang mặc định
            scroll={{ x: "max-content" }}
            rowClassName={(record) =>
              selectedTicket && selectedTicket.id === record.id
                ? "selected-row"
                : ""
            }
            columns={[
              {
                title: "Số Phiếu",
                dataIndex: ["attributes", "Votes"],
                key: "Votes",
              },
              {
                title: "Ticket",
                dataIndex: ["attributes", "Ticket"],
                key: "Ticket",
              },
              {
                title: "Khách Hàng",
                dataIndex: ["attributes", "Customer"],
                key: "Customer",
              },
              {
                title: "Cửa Hàng",
                dataIndex: ["attributes", "Store"],
                key: "Store",
              },
              {
                title: "Người Tạo",
                dataIndex: ["attributes", "Person"],
                key: "Person",
              },
              {
                title: "Trạng Thái",
                dataIndex: ["attributes", "Status"],
                key: "Status",
                render: renderStatusTag,
              },
              {
                title: "Thông báo",
                key: "Notification",
                render: (_, record) =>
                  renderNotification(
                    record.attributes.createdAt,
                    record.attributes.Status
                  ),
              },
              {
                title: "Ngày Tạo",
                dataIndex: ["attributes", "createdAt"],
                key: "createdAt",
                render: (text) => {
                  const date = new Date(text);
                  return `${date.getDate().toString().padStart(2, "0")}-${(
                    date.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}-${date.getFullYear()} ${date
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`;
                },
              },
            ]}
            // onRow={(record) => ({
            //     onClick: () => setTicketModal({ selectedTicket: record, isOpen: true }),
            onRow={(record) => ({
              // Sự kiện click bình thường chỉ chọn hàng (hoặc bạn có thể thêm xử lý chọn hàng tùy ý)
              onClick: () => {
                setSelectedTicket(record); //nếu bạn muốn lưu trạng thái chọn
              },
              // Double click mới mở TicketModal
              onDoubleClick: () => {
                setTicketModal({ selectedTicket: record, isOpen: true });
              },
            })}
          />
          <ReactPaginate
            previousLabel="< Trước"
            nextLabel="Tiếp >"
            pageCount={totalPages}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center mt-3"
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </>
      )}

      {/* Mobile: hiển thị danh sách dạng card */}
      {isMobile && (
        <div className="mobile-ticket-list" style={{ marginTop: 20 }}>
          {paginatedTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket-item"
              onClick={() =>
                setTicketModal({ selectedTicket: ticket, isOpen: true })
              }
            >
              <div className="ticket-field">
                <span>Mã Phiếu:</span> {ticket.attributes.Ticket}
              </div>
              <div className="ticket-field">
                <span>Khách Hàng:</span> {ticket.attributes.Customer}
              </div>
              <div className="ticket-field">
                <span>Cửa Hàng:</span> {ticket.attributes.Store}
              </div>
              <div className="ticket-field">
                <span>Trạng Thái:</span> {ticket.attributes.Status}
              </div>
            </div>
          ))}

          <ReactPaginate
            previousLabel="< Trước"
            nextLabel="Tiếp >"
            pageCount={totalPages}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center"
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </div>
      )}

      <CreateTicketModal
        open={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        reloadTickets={loadTickets}
      />

      {ticketModal.isOpen && ticketModal.selectedTicket && (
        <TicketModal
          isOpen={ticketModal.isOpen}
          onClose={() => setTicketModal({ ...ticketModal, isOpen: false })}
          ticket={ticketModal.selectedTicket}
          fetchDevices={fetchDevices}
          fetchTickets={fetchTicket}
          serialNumberOptions={serialNumberOptions}
          reloadTickets={loadTickets}
          modalWidth="90%"
          modalBodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
        />
      )}
    </div>
  );
};

export default DeviceManagers;

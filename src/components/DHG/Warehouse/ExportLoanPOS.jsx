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
} from "@ant-design/icons";
import AddExportLoanPOS from "./AddExportLoanPOS";
import TicketExportLoanModal from "./TicketExportLoanModal";
import "./ExportLoanPOS.scss";
import * as XLSX from "xlsx";

const ExportLoanPOS = () => {
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

  // const displayTickets = filteredTickets.length ? filteredTickets : tickets;

  const displayTickets = isFiltered ? filteredTickets : tickets;
  const [lastSearchValues, setLastSearchValues] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await loadTickets();
      await fetchDevices();
      await loadExportLoans();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isFiltered && lastSearchValues) {
      handleSearch(lastSearchValues);
    } else {
      setFilteredTickets(tickets);
    }
  }, [tickets]);

  //Cách 1
  // const loadTickets = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetchExportLoanTicket();
  //     const ticketsArray = Array.isArray(response.data)
  //       ? response.data
  //       : response;
  //     if (!ticketsArray || !Array.isArray(ticketsArray)) {
  //       throw new Error("API không trả về danh sách phiếu hợp lệ");
  //     }
  //     const sortedTickets = ticketsArray.sort(
  //       (a, b) =>
  //         new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
  //     );
  //     setTickets(sortedTickets);
  //   } catch (error) {
  //     message.error("Lỗi khi tải danh sách phiếu!");
  //   }
  //   setLoading(false);
  // };

  // Cách 2
  // const loadTickets = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetchExportLoanTicket();
  //     const ticketsArray = Array.isArray(response.data)
  //       ? response.data
  //       : response;
  //     if (!ticketsArray || !Array.isArray(ticketsArray)) {
  //       throw new Error("API không trả về danh sách phiếu hợp lệ");
  //     }
  //     const sortedTickets = ticketsArray.sort(
  //       (a, b) =>
  //         new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
  //     );

  //     // Cập nhật tickets
  //     setTickets(sortedTickets);

  //     // Nếu đang áp dụng bộ lọc, cập nhật filteredTickets
  //     if (isFiltered) {
  //       const values = form.getFieldsValue();
  //       handleSearch(values); // Tái áp dụng bộ lọc với dữ liệu mới
  //     }
  //   } catch (error) {
  //     message.error("Lỗi khi tải danh sách phiếu!");
  //   }
  //   setLoading(false);
  // };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetchExportLoanTicket();

      const ticketsArray = Array.isArray(response.data)
        ? response.data
        : response;

      if (!ticketsArray || !Array.isArray(ticketsArray)) {
        throw new Error("API không trả về danh sách phiếu hợp lệ");
      }

      // Sắp xếp theo createdAt (mới nhất lên đầu)
      const sortedTickets = ticketsArray.sort(
        (a, b) =>
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
      );

      // Cập nhật tickets
      setTickets(sortedTickets);

      // Nếu đang áp dụng bộ lọc thì tái áp dụng filter trên dữ liệu mới
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
      const exportLoansArray = Array.isArray(response.data)
        ? response.data
        : [];
      setExportLoans(exportLoansArray);
    } catch (error) {
      message.error("Lỗi khi tải danh sách thiết bị con!");
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetchExportlists();
      //console.log("Dữ liệu từ API fetchExportlists:", response); // Debug dữ liệu

      const devicesArray = Array.isArray(response.data) ? response.data : [];
      setDevices(devicesArray);

      const options = devicesArray.map((device) => ({
        value: device.attributes.SerialNumber,
        label: device.attributes.SerialNumber,
        ...device.attributes,
      }));
      setSerialNumberOptions(options);
    } catch (error) {
      // console.error("Lỗi khi tải danh sách thiết bị:", error);
      message.error("Lỗi khi tải danh sách thiết bị!");
    }
  };

  const handleExport = async () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một phiếu để xuất!");
      return;
    }

    const selectedTickets = tickets.filter((ticket) =>
      selectedRowKeys.includes(ticket.id)
    );

    if (selectedTickets.length === 0) {
      message.warning("Không có phiếu hợp lệ để xuất!");
      return;
    }

    message.loading("Đang tải dữ liệu thiết bị...");

    const exportData = [];

    for (const ticket of selectedTickets) {
      try {
        const responseData = await fetchExportLoanPOS(ticket.attributes.Votes);

        // duyệt từng thiết bị con và tạo 1 dòng riêng
        responseData.forEach((device) => {
          exportData.push({
            "Mã phiếu xuất": ticket.attributes.Votes,
            "Ticket Dingtalk": ticket.attributes.Ticket,
            "Khách hàng": ticket.attributes.Customer,
            "Cửa hàng": ticket.attributes.Store,
            "Người mượn": ticket.attributes.Person,
            "Người xuất hóa đơn": ticket.attributes.PersonInvoice,
            "Số hóa đơn": ticket.attributes.InvoiceNumber,
            "Trạng thái": ticket.attributes.Status,
            "Ngày tạo": new Date(ticket.attributes.createdAt).toLocaleString(),
            "Sản phẩm": device.attributes.ProductName,
            Model: device.attributes.Model,
            "Serial Number": device.attributes.SerialNumber,
            "Số lượng": device.attributes.totalexport,
          });
        });
      } catch (error) {
        console.error(
          `Lỗi lấy thiết bị cho phiếu ${ticket.attributes.Votes}:`,
          error
        );
        exportData.push({
          "Mã phiếu xuất": ticket.attributes.Votes,
          "Ticket Dingtalk": ticket.attributes.Ticket,
          "Khách hàng": ticket.attributes.Customer,
          "Cửa hàng": ticket.attributes.Store,
          "Người mượn": ticket.attributes.Person,
          "Người xuất hóa đơn": ticket.attributes.PersonInvoice,
          "Số hóa đơn": ticket.attributes.InvoiceNumber,
          "Trạng thái": ticket.attributes.Status,
          "Ngày tạo": new Date(ticket.attributes.createdAt).toLocaleString(),
          "Sản phẩm": "Lỗi tải thiết bị",
          Model: "",
          "Serial Number": "",
          "Số lượng": "",
        });
      }
    }

    message.destroy();
    message.success("Xuất dữ liệu thành công!");

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExportTickets");
    XLSX.writeFile(wb, "Export_Tickets_List.xlsx");
  };

  const toggleFilter = (status) => {
    setFilteredStatus(filteredStatus === status ? null : status);
  };

  const getStatusCount = (status) => {
    return tickets.filter((ticket) => ticket.attributes.Status === status)
      .length;
  };

  const statusList = [
    { label: "Đang tạo phiếu", icon: <EditTwoTone />, color: "#1890FF" },
    { label: "Đang chờ duyệt", icon: <ClockCircleTwoTone />, color: "#FAAD14" },
    { label: "Duyệt", icon: <CheckCircleTwoTone />, color: "#52C41A" },
    { label: "Đã giao", icon: <WarningTwoTone />, color: "#1890FF" },
    { label: "Xác nhận", icon: <CheckSquareTwoTone />, color: "#52C41A" },
    { label: "Chờ xuất hóa đơn", icon: <FileTextTwoTone />, color: "#FF9999" },
    { label: "Đã xuất hóa đơn", icon: <CalculatorTwoTone />, color: "#52C41A" },
    { label: "Trả kho", icon: <InteractionTwoTone />, color: "#f00c2aff" },
    { label: "Bảo hành", icon: <ReconciliationTwoTone />, color: "#e8f00cff" },
  ];

  const renderStatusTag = (status) => {
    let color, icon;
    switch (status) {
      case "Đang tạo phiếu":
        color = "#1890FF";
        icon = <EditTwoTone />;
        break;
      case "Đang chờ duyệt":
        color = "#FAAD14";
        icon = <ClockCircleTwoTone />;
        break;
      case "Duyệt":
        color = "#52C41A";
        icon = <CheckCircleTwoTone />;
        break;
      case "Đã giao":
        color = "#1890FF";
        icon = <WarningTwoTone />;
        break;
      case "Xác nhận":
        color = "#52C41A";
        icon = <CheckSquareTwoTone />;
        break;
      case "Chờ xuất hóa đơn":
        color = "#FF9999";
        icon = <FileTextTwoTone />;
        break;
      case "Đã xuất hóa đơn":
        color = "#52C41A";
        icon = <CalculatorTwoTone />;
        break;
      case "Trả kho":
        color = "#f00c2aff";
        icon = <InteractionTwoTone />;
        break;
      case "Bảo hành":
        color = "#e8f00cff";
        icon = <ReconciliationTwoTone />;
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
    if (status === "Đã giao" && diffInHours > 12) {
      return (
        <Tag color="red">
          <ExclamationCircleOutlined /> Chưa có biên bản bàn giao
        </Tag>
      );
    }
    if (status === "Xác nhận" && diffInHours > 24) {
      return (
        <Tag color="purple">
          <ExclamationCircleOutlined /> Chưa bàn giao cho SaleAdmin
        </Tag>
      );
    }
    return null;
  };

  // const handleSearch = (values) => {
  //   let results = [...tickets];

  //   // Nếu có filter model / date / searchText trên phiếu con
  //   if (values.model || values.dateRange || values.searchText) {
  //     let filteredChildren = [...exportLoans];

  //     if (values.model) {
  //       filteredChildren = filteredChildren.filter((c) =>
  //         c.attributes.Model?.toLowerCase().includes(values.model.toLowerCase())
  //       );
  //     }

  //     if (values.dateRange && values.dateRange.length === 2) {
  //       const [start, end] = values.dateRange;
  //       filteredChildren = filteredChildren.filter((c) => {
  //         const created = new Date(c.attributes.createdAt);
  //         return (
  //           created >= start.startOf("day").toDate() &&
  //           created <= end.endOf("day").toDate()
  //         );
  //       });
  //     }

  //     if (values.searchText) {
  //       filteredChildren = filteredChildren.filter(
  //         (c) =>
  //           c.attributes.SerialNumber?.toLowerCase().includes(
  //             values.searchText.toLowerCase()
  //           ) ||
  //           c.attributes.ProductName?.toLowerCase().includes(
  //             values.searchText.toLowerCase()
  //           )
  //       );
  //     }

  //     // lấy danh sách Votes từ con
  //     const validVotes = [
  //       ...new Set(filteredChildren.map((c) => c.attributes.Votes)),
  //     ];
  //     results = results.filter((ticket) =>
  //       validVotes.includes(ticket.attributes.Votes)
  //     );
  //   }

  //   // filter thêm các field của phiếu cha (Status, Customer, Store)
  //   if (values.Status) {
  //     results = results.filter((t) => t?.attributes?.Status === values.Status);
  //   }
  //   if (values.Customer) {
  //     results = results.filter(
  //       (t) => t?.attributes?.Customer === values.Customer
  //     );
  //   }
  //   if (values.Store) {
  //     results = results.filter((t) => t?.attributes?.Store === values.Store);
  //   }

  //   setFilteredTickets(results);
  //   setIsFiltered(true);
  // };

  const handleSearch = (values) => {
    setLastSearchValues(values);
    let results = [...tickets];

    // Nếu có filter model / date / searchText trên phiếu con
    if (values.model || values.dateRange || values.searchText) {
      let filteredChildren = [...exportLoans];

      if (values.model) {
        filteredChildren = filteredChildren.filter((c) =>
          c.attributes.Model?.toLowerCase().includes(values.model.toLowerCase())
        );
      }

      if (values.dateRange && values.dateRange.length === 2) {
        const [start, end] = values.dateRange;
        filteredChildren = filteredChildren.filter((c) => {
          const created = new Date(c.attributes.createdAt);
          return (
            created >= start.startOf("day").toDate() &&
            created <= end.endOf("day").toDate()
          );
        });
      }

      if (values.searchText) {
        filteredChildren = filteredChildren.filter(
          (c) =>
            c.attributes.SerialNumber?.toLowerCase().includes(
              values.searchText.toLowerCase()
            ) ||
            c.attributes.ProductName?.toLowerCase().includes(
              values.searchText.toLowerCase()
            )
        );
      }

      // Lấy danh sách Votes từ con
      const validVotes = [
        ...new Set(filteredChildren.map((c) => c.attributes.Votes)),
      ];
      results = results.filter((ticket) =>
        validVotes.includes(ticket.attributes.Votes)
      );
    }

    // Filter thêm các field của phiếu cha (Status, Customer, Store)
    if (values.Status) {
      results = results.filter((t) => t?.attributes?.Status === values.Status);
    }
    if (values.Customer) {
      results = results.filter(
        (t) => t?.attributes?.Customer === values.Customer
      );
    }
    if (values.Store) {
      results = results.filter((t) => t?.attributes?.Store === values.Store);
    }

    setFilteredTickets(results);
    setIsFiltered(true);
  };

  // const resetFilters = () => {
  //   form.resetFields();
  //   setFilteredTickets(tickets);
  // };

  const resetFilters = () => {
    form.resetFields();
    setFilteredTickets([]);
    setIsFiltered(false);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 70,
    },
    {
      title: "Số Phiếu",
      dataIndex: ["attributes", "Votes"],
      key: "Votes",
      width: 160, // Đặt chiều rộng cụ thể
    },
    // {
    //   title: "Ticket",
    //   dataIndex: ["attributes", "Ticket"],
    //   key: "Ticket",
    //   width: 160,
    // },
    // {
    //   title: "Khách Hàng",
    //   dataIndex: ["attributes", "Customer"],
    //   key: "Customer",
    //   width: 150,
    // },
    {
      title: "Cửa Hàng",
      dataIndex: ["attributes", "Store"],
      key: "Store",
      width: 160,
    },
    {
      title: "Người Mượn",
      dataIndex: ["attributes", "Person"],
      key: "Person",
      width: 150,
    },

    {
      title: "Trạng Thái",
      dataIndex: ["attributes", "Status"],
      key: "Status",
      width: 180,
      render: renderStatusTag,
    },
    // {
    //   title: "Ghi chú",
    //   dataIndex: ["attributes", "Note"],
    //   key: "Note",
    //   width: 180,
    // },
    {
      title: "Thông báo",
      key: "Notification",
      width: 180,
      render: (_, record) =>
        renderNotification(
          record.attributes.createdAt,
          record.attributes.Status
        ),
    },
    // {
    //   title: "Người Nhận HĐ",
    //   dataIndex: ["attributes", "PersonInvoice"],
    //   key: "PersonInvoice",
    //   width: 150,
    // },
    // {
    //   title: "Số Hóa Đơn",
    //   dataIndex: ["attributes", "InvoiceNumber"],
    //   key: "InvoiceNumber",
    //   width: 150,
    // },
    // {
    //   title: "Số thiết bị",
    //   key: "deviceCount",
    //   width: 120,
    //   render: (_, record) =>
    //     exportLoans.filter(
    //       (e) => e.attributes.Votes === record.attributes.Votes
    //     ).length,
    // },
    {
      title: "Ngày Tạo",
      dataIndex: ["attributes", "createdAt"],
      key: "createdAt",
      width: 170,
      render: (text) => {
        const date = new Date(text);
        return `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getFullYear()} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() =>
            //setDetailModal({ selectedTicket: record, isOpen: true })
            setTicketModal({ selectedTicket: record, isOpen: true })
          }
        >
          📋 Sản phẩm
        </Button>
      ),
    },
  ];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <div className="Device-container">
      {/* <h1>Phiếu Xuất Kho</h1> */}
      {/* <Button type="primary" onClick={() => setIsCreateTicketModalOpen(true)}>➕ Tạo Phiếu</Button> */}
      {/* <Button type="primary" style={{ marginLeft: 10 }} onClick={handleExport}>
                📤 Xuất Excel
            </Button> */}

      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20 }}
      >
        {/* Hàng 1 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            width: "100%",
            marginBottom: "16px",
          }}
        >
          <Form.Item name="Status" label="Trạng thái">
            <Select
              placeholder="-- Trạng thái --"
              style={{ width: 160 }}
              allowClear
            >
              {[...new Set(tickets.map((i) => i.attributes.Status))].map(
                (status) => (
                  <Select.Option key={status} value={status}>
                    {status}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item name="Customer" label="Khách hàng">
            <Select
              placeholder="-- Khách Hàng --"
              style={{ width: 160 }}
              allowClear
            >
              {[...new Set(tickets.map((i) => i.attributes.Customer))].map(
                (customer) => (
                  <Select.Option key={customer} value={customer}>
                    {customer}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item name="Store" label="Cửa hàng">
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
              {[...new Set(tickets.map((i) => i.attributes.Store))]
                .filter(Boolean) // lọc bỏ null / undefined / ""
                .sort((a, b) =>
                  a.localeCompare(b, "vi", { sensitivity: "base" })
                ) // sắp xếp a-z theo tiếng Việt
                .map((store) => (
                  <Select.Option key={store} value={store}>
                    {store}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="searchText" label="Số phiếu / Ticket">
            <Input placeholder="Số Phiếu / Ticket" style={{ width: 200 }} />
          </Form.Item>
        </div>

        {/* Hàng 2 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            width: "100%",
          }}
        >
          {/* <Form.Item name="model" label="Model">
  <Input placeholder="Model" style={{ width: 160 }} />
</Form.Item> */}
          <Form.Item name="model" label="Model">
            <Select
              placeholder="-- Model --"
              style={{ width: 180 }}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {[...new Set(exportLoans.map((i) => i.attributes.Model))]
                .filter(Boolean) // bỏ giá trị null/undefined/""
                .sort((a, b) =>
                  a.localeCompare(b, "vi", { sensitivity: "base" })
                ) // sắp xếp a-z
                .map((model) => (
                  <Select.Option key={model} value={model}>
                    {model}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="dateRange" label="Ngày">
            <DatePicker.RangePicker format="DD-MM-YYYY" />
          </Form.Item>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              width: "100%",
            }}
          >
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
            <Form.Item>
              <Button type="dashed" onClick={handleExport}>
                📤 Export Excel
              </Button>
            </Form.Item>
            {account.WritePOS === true && (
              <Button
                type="primary"
                onClick={() => setIsCreateTicketModalOpen(true)}
                style={{ marginLeft: 10 }}
              >
                ➕ Tạo Phiếu
              </Button>
            )}
          </div>
        </div>
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
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        // dataSource={filteredStatus ? tickets.filter(ticket => ticket.attributes.Status === filteredStatus) : tickets}
        locale={{ emptyText: "Không có dữ liệu phù hợp với tìm kiếm" }}
        dataSource={displayTickets}
        rowKey={(record) => record.id}
        // rowKey="id"
        loading={loading}
        style={{ marginTop: 20 }}
        scroll={{ x: "max-content" }}
        rowClassName={(record) =>
          selectedTicket && selectedTicket.id === record.id
            ? "selected-row"
            : ""
        }
        columns={columns}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        // onRow={(record) => ({
        //     onClick: () => setTicketModal({ selectedTicket: record, isOpen: true }),
        onRow={(record) => ({
          // Sự kiện click bình thường chỉ chọn hàng (hoặc bạn có thể thêm xử lý chọn hàng tùy ý)
          onClick: () => {
            setSelectedTicket(record); //nếu bạn muốn lưu trạng thái chọn
          },
          // Double click mới mở TicketExportLoanModal
          onDoubleClick: () => {
            //setTicketModal({ selectedTicket: record, isOpen: true });
            setDetailModal({ selectedTicket: record, isOpen: true });
          },
        })}
      />
      <Modal
        open={detailModal.isOpen}
        onCancel={() => setDetailModal({ isOpen: false, selectedTicket: null })}
        footer={null}
        width={800}
      >
        {selectedTicket && (
          <>
            <Descriptions
              title="Thông tin phiếu"
              bordered
              column={2}
              size="small"
            >
              <Descriptions.Item label="Số phiếu">
                {selectedTicket.attributes.Votes}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {renderStatusTag(selectedTicket.attributes.Status)}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedTicket.attributes.Customer}
              </Descriptions.Item>
              <Descriptions.Item label="Cửa hàng">
                {selectedTicket.attributes.Store}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedTicket.attributes.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Số thiết bị">
                {
                  exportLoans.filter(
                    (e) =>
                      e.attributes.Votes === selectedTicket.attributes.Votes
                  ).length
                }
              </Descriptions.Item>
              <Descriptions.Item label="Người Nhận HĐ">
                {selectedTicket.attributes.PersonInvoice}
              </Descriptions.Item>
              <Descriptions.Item label="Số Hóa Đơn">
                {selectedTicket.attributes.InvoiceNumber}
              </Descriptions.Item>
            </Descriptions>

            <h5 style={{ marginTop: 20 }}>Danh sách thiết bị</h5>
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={exportLoans.filter(
                (e) => e.attributes.Votes === selectedTicket.attributes.Votes
              )}
              columns={[
                {
                  title: "Tên sản phẩm",
                  dataIndex: ["attributes", "ProductName"],
                  key: "product",
                },
                {
                  title: "Model",
                  dataIndex: ["attributes", "Model"],
                  key: "model",
                },
                {
                  title: "Serial",
                  dataIndex: ["attributes", "SerialNumber"],
                  key: "serial",
                },
                {
                  title: "Ngày xuất",
                  dataIndex: ["attributes", "createdAt"],
                  key: "date",
                  render: (date) => new Date(date).toLocaleDateString(),
                },
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
          reloadTickets={loadTickets}
          modalWidth="90%"
          modalBodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
        />
      )}
    </div>
  );
};

export default ExportLoanPOS;

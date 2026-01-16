import React, { useEffect, useState } from "react";
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
  notification,
  Space,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  FileExcelOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  InboxOutlined,
  WarningTwoTone,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  fetchListPurchaseOder,
  updateSupplierForm,
  sendSupplierDetail,
} from "../../../services/dhgServices";
import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";
import UpdatePurchaseOrderModal from "./UpdatePurchaseOrderModal";
import "./PurchaseOrderList.scss";

const { confirm } = Modal;
const { Option } = Select;

const statusIconMap = {
  "Chưa nhận hàng": <InboxOutlined style={{ color: "#1890ff" }} />,
  "Đã nhận hàng": <CheckOutlined style={{ color: "green" }} />,
  "Hủy phiếu": <CloseOutlined style={{ color: "red" }} />,
};

const PurchaseOrderList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [purchase, setPurchase] = useState("");
  const [admin, setAdmin] = useState("");
  const [form] = Form.useForm();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Load invoices
  const loadInvoices = async () => {
    setLoading(true);
    try {
      const invoicesData = await fetchListPurchaseOder();
      // Sắp xếp giảm dần theo createdAt (mới nhất đầu)
      const sortedData = invoicesData.data.sort(
        (a, b) =>
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
      );
      setInvoices(sortedData);
      setFilteredInvoices(sortedData); // hoặc filteredInvoices tùy state bạn dùng
    } catch (error) {
      // Nếu muốn bạn có thể khai báo state error rồi setError(error)
      // Hoặc dùng message lỗi trực tiếp
      message.error("Lỗi tải danh sách phiếu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load user info
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.account?.Name || "");
        setPurchase(parsedUser?.account?.Purchase || "");
        setAdmin(parsedUser?.account?.Admin || "");
      } catch {
        // ignore error
      }
    }
    loadInvoices();
  }, []);

  // Filter form submit
  const onFinish = (values) => {
    let filtered = [...invoices];
    if (values.status) {
      filtered = filtered.filter(
        (inv) => inv.attributes.Status === values.status
      );
    }
    if (values.customer) {
      filtered = filtered.filter(
        (inv) => inv.attributes.Customer === values.customer
      );
    }
    if (values.storeID) {
      filtered = filtered.filter(
        (inv) => inv.attributes.StoreID === values.storeID
      );
    }
    if (values.purchuser) {
      filtered = filtered.filter(
        (inv) => inv.attributes.Purchuser === values.purchuser
      );
    }
    if (values.searchText) {
      const search = values.searchText.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.attributes.Model?.toLowerCase().includes(search) ||
          inv.attributes.ProductName?.toLowerCase().includes(search)
      );
    }
    setFilteredInvoices(filtered);
    setSelectedInvoice(null);
  };

  // Reset filter
  const onReset = () => {
    form.resetFields();
    setFilteredInvoices(invoices);
    setSelectedInvoice(null);
  };

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredInvoices.map((invoice) => ({
        "Số phiếu": invoice.attributes.Ticket,
        "Nhà cung cấp": invoice.attributes.NameNCC,
        "Sản phẩm": invoice.attributes.ProductName,
        Model: invoice.attributes.Model,
        "Ngày nhập": invoice.attributes.Date,
        "Số lượng": invoice.attributes.Qty,
        "Tổng tiền": invoice.attributes.TotalAmount,
        "Trạng thái": invoice.attributes.Status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, "Invoices_List.xlsx");
  };

  // Thống kê trạng thái
  const statusCounts = Object.values(
    filteredInvoices.reduce((acc, item) => {
      const status = item.attributes.Status || "Chưa xác định";
      if (!acc[status]) {
        acc[status] = {
          label: status,
          count: 0,
          icon: statusIconMap[status] || null,
        };
      }
      acc[status].count++;
      return acc;
    }, {})
  );

  // Xác nhận phiếu
  // const handleConfirmInvoice = async (invoice) => {
  //   try {
  //     await updateSupplierForm(invoice.id, { Status: 'Đã nhận hàng' });
  //     message.success(`Xác nhận phiếu ${invoice.attributes.Ticket} thành công`);
  //     await loadInvoices();
  //    // setSelectedInvoice(null);
  //   } catch {
  //     message.error('Xác nhận thất bại');
  //   }
  // };

  const handleConfirmInvoice = async (invoice) => {
    try {
      await updateSupplierForm(invoice.id, { Status: "Đã nhận hàng" });
      message.success(`Xác nhận phiếu ${invoice.attributes.Ticket} thành công`);

      const invoicesData = await fetchListPurchaseOder();
      const sortedData = invoicesData.data.sort(
        (a, b) =>
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
      );
      setInvoices(sortedData);
      setFilteredInvoices(sortedData);

      const updatedInvoice = sortedData.find((i) => i.id === invoice.id);
      if (updatedInvoice) {
        setSelectedInvoice(updatedInvoice);
      }
    } catch {
      message.error("Xác nhận thất bại");
    }
  };

  const showConfirmDialog = (invoice) => {
    confirm({
      title: "Xác nhận phiếu này?",
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xác nhận phiếu này là "Đã nhận hàng"?',
      okText: "Đồng ý",
      cancelText: "Trở về",
      onOk() {
        handleConfirmInvoice(invoice);
      },
    });
  };

  // Hủy phiếu
  const handleDeleteInvoice = async (invoice) => {
    try {
      await updateSupplierForm(invoice.id, { Status: "Hủy phiếu" });
      message.success(`Hủy phiếu ${invoice.attributes.Ticket} thành công`);
      await loadInvoices();
      setSelectedInvoice(null);
    } catch {
      message.error("Hủy phiếu thất bại");
    }
  };

  const showDeleteDialog = (invoice) => {
    confirm({
      title: "Hủy phiếu này?",
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy phiếu này là "Hủy phiếu"?',
      okText: "Đồng ý",
      cancelText: "Trở về",
      onOk() {
        handleDeleteInvoice(invoice);
      },
    });
  };

  // Trả nhà cung cấp
  const handleReturnInvoiceSP = async (invoice) => {
    try {
      await updateSupplierForm(invoice.id, { Status: "Trả NCC" });
      message.success(
        `Trả nhà cung cấp ${invoice.attributes.Ticket} thành công`
      );
      await loadInvoices();
      setSelectedInvoice(null);
    } catch {
      message.error("Trả nhà cung cấp thất bại");
    }
  };

  const showReturnDialogSP = (invoice) => {
    confirm({
      title: "Trả nhà cung cấp sản phẩm này?",
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn trả sản phẩm này là "Trả NCC?',
      okText: "Đồng ý",
      cancelText: "Trở về",
      onOk() {
        handleReturnInvoiceSP(invoice);
      },
    });
  };

  // Gửi sản phẩm vào chi tiết
  // const handleSendProductData = async (invoice) => {
  //   if (invoice.attributes.isProductSent) {
  //     notification.warning({
  //       message: 'Sản phẩm đã gửi',
  //       description: 'Sản phẩm này đã được gửi trước đó.',
  //     });
  //     return;
  //   }
  //   try {
  //     const dataToSend = {
  //       data: {
  //         ProductName: invoice.attributes.ProductName,
  //         Model: invoice.attributes.Model,
  //         BrandName: invoice.attributes.BrandName,
  //         Type: invoice.attributes.Type,
  //         SerialNumber: invoice.attributes.SerialNumber,
  //         InvoiceDate: invoice.attributes.InvoiceDate,
  //         Ticket: invoice.attributes.Ticket,
  //         Status: 'Chờ nhập kho',
  //         Qty: invoice.attributes.Qty,
  //       },
  //     };
  //     await sendSupplierDetail(dataToSend);
  //     await updateSupplierForm(invoice.id, { isProductSent: true });
  //     message.success('Gửi dữ liệu thành công');
  //     await loadInvoices();
  //     setSelectedInvoice(null);
  //   } catch {
  //     notification.error({
  //       message: 'Gửi dữ liệu thất bại',
  //       description: 'Có lỗi khi gửi dữ liệu sản phẩm.',
  //     });
  //   }
  // };
  const handleSendProductData = async (invoice) => {
    if (invoice.attributes.isProductSent) {
      notification.warning({
        message: "Sản phẩm đã gửi",
        description: "Sản phẩm này đã được gửi trước đó.",
      });
      return;
    }
    try {
      const dataToSend = {
        data: {
          ProductName: invoice.attributes.ProductName,
          Model: invoice.attributes.Model,
          BrandName: invoice.attributes.BrandName,
          Type: invoice.attributes.Type,
          SerialNumber: invoice.attributes.SerialNumber,
          InvoiceDate: invoice.attributes.InvoiceDate,
          Ticket: invoice.attributes.Ticket,
          Status: "Chờ nhập kho",
          Qty: invoice.attributes.Qty,
          DVT: invoice.attributes.DVT,
        },
      };
      await sendSupplierDetail(dataToSend);
      await updateSupplierForm(invoice.id, { isProductSent: true });
      message.success("Gửi dữ liệu thành công");

      // Load lại danh sách và giữ modal mở
      const invoicesData = await fetchListPurchaseOder();
      const sortedData = invoicesData.data.sort(
        (a, b) =>
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
      );
      setInvoices(sortedData);
      setFilteredInvoices(sortedData);

      const updatedInvoice = sortedData.find((i) => i.id === invoice.id);
      if (updatedInvoice) {
        setSelectedInvoice(updatedInvoice);
      }
    } catch {
      notification.error({
        message: "Gửi dữ liệu thất bại",
        description: "Có lỗi khi gửi dữ liệu sản phẩm.",
      });
    }
  };

  const showProductDialog = (invoice) => {
    confirm({
      title: "Gửi sản phẩm vào chi tiết?",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có muốn gửi sản phẩm này vào chi tiết sản phẩm không?",
      okText: "Đồng ý",
      cancelText: "Trở về",
      onOk() {
        handleSendProductData(invoice);
      },
    });
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const columns = [
    {
      title: "STT",
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Số phiếu",
      dataIndex: ["attributes", "Ticket"],
    },
    {
      title: "Sản phẩm",
      dataIndex: ["attributes", "ProductName"],
    },
    {
      title: "Model",
      dataIndex: ["attributes", "Model"],
    },
    {
      title: "Người đề nghị",
      dataIndex: ["attributes", "Purchuser"],
    },
    {
      title: "Ngày đề nghị",
      dataIndex: ["attributes", "createdAt"],
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Số lượng",
      dataIndex: ["attributes", "Qty"],
      align: "center",
    },
    ...(purchase === true
      ? [
          {
            title: "Tổng cộng",
            dataIndex: ["attributes", "AmountSupplier"],
            render: (value) => (value != null ? value.toLocaleString() : ""),
            align: "right",
          },
        ]
      : []),

    {
      title: "Trạng thái",
      dataIndex: ["attributes", "Status"],
      align: "center",
      render: (status) => {
        let color = "default";
        if (status === "Đã nhận hàng") color = "green";
        else if (status === "Hủy phiếu") color = "red";
        else if (status === "Chưa nhận hàng") color = "blue";
        else if (status === "Trả NCC") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Chi tiết",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelectedInvoice(record);
              setIsDetailModalOpen(true);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="purchase-order-list-container" style={{ padding: 20 }}>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
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
          <Form.Item name="status" label="Trạng thái">
            <Select
              style={{ width: 160 }}
              allowClear
              placeholder="Chọn trạng thái"
            >
              {[...new Set(invoices.map((inv) => inv.attributes.Status))].map(
                (status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item name="customer" label="Khách hàng">
            <Select
              style={{ width: 160 }}
              allowClear
              showSearch
              placeholder="Chọn khách hàng"
              optionFilterProp="children"
            >
              {[...new Set(invoices.map((inv) => inv.attributes.Customer))].map(
                (customer) => (
                  <Option key={customer} value={customer}>
                    {customer}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>

          <Form.Item name="storeID" label="StoreID">
            <Select
              style={{ width: 160 }}
              allowClear
              showSearch
              placeholder="Chọn storeID"
              optionFilterProp="children"
            >
              {[...new Set(invoices.map((inv) => inv.attributes.StoreID))].map(
                (storeID) => (
                  <Option key={storeID} value={storeID}>
                    {storeID}
                  </Option>
                )
              )}
            </Select>
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
          <Form.Item name="searchText" label="Tìm kiếm">
            <Input
              placeholder="Model hoặc tên sản phẩm"
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="purchuser" label="Người đề nghị">
            <Select
              style={{ width: 200 }}
              allowClear
              placeholder="Chọn người đề nghị"
            >
              {[
                ...new Set(invoices.map((inv) => inv.attributes.Purchuser)),
              ].map((purchuser) => (
                <Option key={purchuser} value={purchuser}>
                  {purchuser}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          </Form.Item>

          <Form.Item>
            <Button onClick={onReset}>Reset</Button>
          </Form.Item>
          {purchase === true && (
            <Form.Item>
              <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                Xuất Excel
              </Button>
            </Form.Item>
          )}
          {purchase === true && (
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                Tạo phiếu nhập
              </Button>
            </Form.Item>
          )}
        </div>
      </Form>

      {/* Status summary */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {statusCounts.map(({ label, count, icon }) => (
          <Col key={label}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 500,
              }}
            >
              {icon}
              <span>{label}:</span>
              <span style={{ fontWeight: "bold" }}>{count}</span>
            </div>
          </Col>
        ))}
      </Row>

      {/* Table danh sách */}
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filteredInvoices}
        onRow={(record) => ({
          onClick: () => setSelectedInvoice(record),
        })}
        scroll={{ x: 1000 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={(pag) => setPagination(pag)}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết phiếu nhập"
        open={isDetailModalOpen} //xài hàng này do chi tiết
        onCancel={() => setIsDetailModalOpen(false)}
        // visible={!!selectedInvoice}
        //onCancel={() => setSelectedInvoice(null)}
        footer={null}
        width={750}
      >
        {selectedInvoice && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Số phiếu">
                {selectedInvoice.attributes.Ticket}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo phiếu">
                {selectedInvoice.attributes.NameCreate}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                <Tag
                  color={
                    selectedInvoice.attributes.Status === "Đã nhận hàng"
                      ? "green"
                      : selectedInvoice.attributes.Status === "Hủy phiếu"
                      ? "red"
                      : "blue"
                  }
                >
                  {selectedInvoice.attributes.Status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Người đề nghị">
                {selectedInvoice.attributes.Purchuser}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedInvoice.attributes.Customer}
              </Descriptions.Item>
              <Descriptions.Item label="StoreID">
                {selectedInvoice.attributes.StoreID}
              </Descriptions.Item>

              <Descriptions.Item label="Tên sản phẩm">
                {selectedInvoice.attributes.ProductName}
              </Descriptions.Item>
              <Descriptions.Item label="Model">
                {selectedInvoice.attributes.Model}
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">
                {selectedInvoice.attributes.BrandName}
              </Descriptions.Item>
              <Descriptions.Item label="Loại sản phẩm">
                {selectedInvoice.attributes.Type}
              </Descriptions.Item>
              <Descriptions.Item label="Số hóa đơn">
                {selectedInvoice.attributes.InvoiceNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hóa đơn">
                {selectedInvoice.attributes.InvoiceDate
                  ? new Date(
                      selectedInvoice.attributes.InvoiceDate
                    ).toLocaleDateString("vi-VN")
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Loại tiền">
                {selectedInvoice.attributes.Currency}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày lập phiếu">
                {new Date(
                  selectedInvoice.attributes.createdAt
                ).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Thuế (%)">
                {selectedInvoice?.attributes?.VatRate != null
                  ? `${selectedInvoice.attributes.VatRate}%`
                  : " "}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {selectedInvoice.attributes.Qty}
              </Descriptions.Item>
              {purchase === true && (
                <>
                  <Descriptions.Item label="Đơn giá">
                    {selectedInvoice.attributes.UnitPrice?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá chưa VAT">
                    {selectedInvoice.attributes.TotalAmount?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="VAT">
                    {selectedInvoice.attributes.Vat?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng cộng">
                    {selectedInvoice.attributes.AmountSupplier?.toLocaleString()}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Nhà cung cấp" span={2}>
                {selectedInvoice.attributes.NameNCC}
              </Descriptions.Item>
              <Descriptions.Item label="SerialNumber" span={2}>
                <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                  {selectedInvoice.attributes.SerialNumber}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
                {selectedInvoice.attributes.ShippingAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedInvoice.attributes.Note}
              </Descriptions.Item>
            </Descriptions>

            {/* Các nút thao tác */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {(userName === selectedInvoice.attributes.NameCreate ||
                admin === true) && (
                <>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setUpdateModalVisible(true)}
                  >
                    Cập nhật
                  </Button>

                  {selectedInvoice.attributes.Status !== "Đã nhận hàng" &&
                    selectedInvoice.attributes.Status !== "Trả NCC" &&
                    (selectedInvoice.attributes.Type === "Vật tư" ||
                      selectedInvoice.attributes.SerialNumber) && (
                      <Button
                        icon={<CheckOutlined />}
                        onClick={() => showConfirmDialog(selectedInvoice)}
                      >
                        Xác nhận
                      </Button>
                    )}

                  {selectedInvoice.attributes.Status !== "Đã nhận hàng" &&
                    selectedInvoice.attributes.Status !== "Trả NCC" && (
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => showDeleteDialog(selectedInvoice)}
                      >
                        Hủy phiếu
                      </Button>
                    )}
                  {selectedInvoice.attributes.Status === "Đã nhận hàng" && (
                    <Button
                      danger
                      icon={<WarningTwoTone />}
                      onClick={() => showReturnDialogSP(selectedInvoice)}
                    >
                      Trả NCC
                    </Button>
                  )}

                  {selectedInvoice.attributes.InvoiceDate &&
                    selectedInvoice.attributes.Status === "Đã nhận hàng" &&
                    !selectedInvoice.attributes.isProductSent &&
                    (selectedInvoice.attributes.Type === "Vật tư" ||
                      selectedInvoice.attributes.SerialNumber) && (
                      <Button
                        icon={<InboxOutlined />}
                        onClick={() => showProductDialog(selectedInvoice)}
                      >
                        Gửi sản phẩm
                      </Button>
                    )}
                </>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* Modal tạo phiếu */}
      <CreatePurchaseOrderModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onCreate={() => {
          setCreateModalVisible(false);
          loadInvoices();
        }}
      />

      {/* Modal cập nhật phiếu */}
      <UpdatePurchaseOrderModal
        open={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        invoice={selectedInvoice}
        onUpdateSuccess={() => {
          setUpdateModalVisible(false);
          loadInvoices();
          setIsDetailModalOpen(false);
        }}
      />
    </div>
  );
};

export default PurchaseOrderList;

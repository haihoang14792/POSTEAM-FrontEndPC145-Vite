import React, { useEffect, useState, useMemo } from "react";
import { fetchListSupplierDetail } from "../../../services/dhgServices";
import * as XLSX from "xlsx";
import { FaFileExcel, FaSearch, FaEdit, FaCheck } from "react-icons/fa";
import {
  Tag,
  Button,
  notification,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Space,
  Descriptions,
} from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import UpdateProductSupplierDetail from "./UpdateProductSupplierDetail";
import ConfirmImportModal from "./ConfirmImportModal";
import "./ProductSupplierDetail.scss";

const { Option } = Select;

const ProductSupplierDetail = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const invoicesData = await fetchListSupplierDetail();
      setInvoices(invoicesData.data);
      const sortedData = invoicesData.data.sort(
        (a, b) =>
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
      );
      setInvoices(sortedData);
      setFilteredInvoices(invoicesData.data); // ban đầu hiển thị toàn bộ
      setLoading(false);
    } catch (err) {
      setError(err);
      notification.error({
        message: "Lỗi tải dữ liệu!",
        description: err.message,
      });
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (invoices.length === 0) {
      notification.warning({ message: "Không có dữ liệu để xuất!" });
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      invoices.map((invoice) => ({
        "Tên sản phẩm": invoice.attributes.ProductName,
        SerialNumber: invoice.attributes.SerialNumber,
        "Ngày hóa đơn": invoice.attributes.InvoiceDate,
        "Số tháng bảo hành": invoice.attributes.Warranty,
        "Trạng thái": invoice.attributes.Status,
        Ticket: invoice.attributes.Ticket,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, "Invoices_List.xlsx");
  };

  const handleUpdateSuccess = (updatedInvoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((inv) =>
        inv.id === updatedInvoice.id ? updatedInvoice : inv
      )
    );

    setFilteredInvoices((prevFiltered) =>
      prevFiltered.map((inv) =>
        inv.id === updatedInvoice.id ? updatedInvoice : inv
      )
    );

    if (selectedProduct && selectedProduct.id === updatedInvoice.id) {
      setSelectedProduct(updatedInvoice);
    }

    setIsUpdateModalOpen(false);
  };

  const handleCloseConfirm = () => {
    setIsConfirmModalOpen(false);
  };

  const handleSuccessConfirm = async () => {
    await loadInvoices();
    setIsConfirmModalOpen(false);
    notification.success({ message: "Xác nhận nhập kho thành công!" });
  };

  const handleSearch = (values) => {
    let results = [...invoices];

    if (values.status && values.status !== "Tất cả") {
      results = results.filter((t) => t?.attributes?.Status === values.status);
    }
    if (values.searchText) {
      const searchLower = values.searchText.toLowerCase();
      results = results.filter(
        (t) =>
          t?.attributes?.SerialNumber?.toLowerCase().includes(searchLower) ||
          t?.attributes?.Model?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredInvoices(results);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredInvoices(invoices);
  };

  //   const filteredInvoices = useMemo(() => {
  //     return invoices.filter((invoice) => {
  //       const name =
  //         invoice.attributes.SerialNumber?.toLowerCase().trim() || "";
  //       const search = searchTerm.trim().toLowerCase();
  //       return (
  //         name.includes(search) &&
  //         (activeTab === "Tất cả" ||
  //           invoice.attributes.Status === activeTab)
  //       );
  //     });
  //   }, [invoices, searchTerm, activeTab]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: 60,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: ["attributes", "ProductName"],
      width: 180,
      ellipsis: true,
    },
    {
      title: "Model",
      dataIndex: ["attributes", "Model"],
      width: 150,
      ellipsis: true,
    },
    {
      title: "SerialNumber",
      dataIndex: ["attributes", "SerialNumber"],
      width: 250,
      render: (text) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Ngày hóa đơn",
      dataIndex: ["attributes", "InvoiceDate"],
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Bảo hành (tháng)",
      dataIndex: ["attributes", "Warranty"],
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: ["attributes", "Status"],
      width: 130,
      render: (status) => {
        const isImported = status === "Đã nhập kho";
        return (
          <Tag
            color={isImported ? "green" : "gold"}
            icon={
              isImported ? <CheckCircleOutlined /> : <ClockCircleOutlined />
            }
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Ticket",
      dataIndex: ["attributes", "Ticket"],
      width: 150,
      ellipsis: true,
    },
    {
      title: "Chi tiết",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelectedProduct(record);
              setIsDetailModalOpen(true);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="purchase-order-container">
      {/* Form lọc */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20, flexWrap: "wrap" }}
      >
        <Form.Item name="status">
          <Select
            placeholder="-- Trạng thái --"
            style={{ width: 160 }}
            allowClear
          >
            {[
              ...new Set(
                invoices
                  .map((i) => i?.attributes?.Status)
                  .filter((status) => status)
              ), // bỏ null/undefined
            ].map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="searchText">
          <Input placeholder="Serial / Model" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<FaSearch />}>
            Tìm kiếm
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={resetFilters}>Reset</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleExport} icon={<FaFileExcel />}>
            Xuất Excel
          </Button>
        </Form.Item>
      </Form>

      {/* Bảng */}
      {/* <Table
        columns={columns}
        dataSource={filteredInvoices}
        rowKey="id"
        pagination={{
    ...pagination,
    onChange: (page, pageSize) => {
      setPagination({ current: page, pageSize });
    },
  }}
      /> */}
      <Table
        columns={columns}
        dataSource={filteredInvoices}
        rowKey="id"
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        scroll={{ x: 1300 }} // cuộn ngang nếu bảng rộng hơn
      />

      {/* Modal chi tiết */}
      <Modal
        open={isDetailModalOpen}
        title="Chi tiết sản phẩm"
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedProduct && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tên sản phẩm">
                {selectedProduct.attributes.ProductName}
              </Descriptions.Item>
              <Descriptions.Item label="Model">
                {selectedProduct.attributes.Model}
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">
                {selectedProduct.attributes.BrandName}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {selectedProduct.attributes.Qty}
              </Descriptions.Item>
              <Descriptions.Item label="SerialNumber" span={2}>
                {selectedProduct.attributes.SerialNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hóa đơn">
                {new Date(
                  selectedProduct.attributes.InvoiceDate
                ).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Bảo hành">
                {selectedProduct.attributes.Warranty}
              </Descriptions.Item>
              <Descriptions.Item label="Kiểu sản phẩm">
                {selectedProduct.attributes.Type}
              </Descriptions.Item>
              <Descriptions.Item label="Số phiếu">
                {selectedProduct.attributes.Ticket}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color="green">{selectedProduct.attributes.Status}</Tag>
              </Descriptions.Item>
            </Descriptions>

            {selectedProduct.attributes.Status !== "Đã nhập kho" && (
              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsUpdateModalOpen(true);
                    setIsDetailModalOpen(false);
                  }}
                  icon={<FaEdit />}
                >
                  Cập nhật
                </Button>
                {selectedProduct.attributes.Warranty && (
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      setIsConfirmModalOpen(true);
                      setIsDetailModalOpen(false);
                    }}
                    icon={<FaCheck />}
                  >
                    Nhập Kho ĐHG
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Modal cập nhật */}
      {isUpdateModalOpen && selectedProduct && (
        <UpdateProductSupplierDetail
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          invoice={selectedProduct}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Modal xác nhận nhập kho */}
      {isConfirmModalOpen && selectedProduct && (
        <ConfirmImportModal
          open={isConfirmModalOpen}
          onClose={handleCloseConfirm}
          product={selectedProduct}
          onConfirmSuccess={handleSuccessConfirm}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </div>
  );
};

export default ProductSupplierDetail;

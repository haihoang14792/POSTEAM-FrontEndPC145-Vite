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
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import "./ImportList.scss";
import AddImportList from "./AddImportList";
import ReturnSupplierModal from "./ReturnSupplierModal";

const ImportList = () => {
  const [importlist, setImportlist] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [detailModal, setDetailModal] = useState({
    visible: false,
    record: null,
  });
  const [openReturnModal, setOpenReturnModal] = useState({
    visible: false,
    record: null,
  });

  // state cho modal nhập mới
  const [openAddModal, setOpenAddModal] = useState(false);

  const loadImportlist = async () => {
    try {
      const res = await fetchImportlists();
      const sortedData = res.data.sort(
        (a, b) =>
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
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
    if (values.Type) {
      results = results.filter((t) => t?.attributes?.Type === values.Type);
    }
    if (values.TypeKho) {
      results = results.filter(
        (t) => t?.attributes?.TypeKho === values.TypeKho
      );
    }
    if (values.BrandName) {
      results = results.filter(
        (t) => t?.attributes?.BrandName === values.BrandName
      );
    }
    if (values.searchText) {
      results = results.filter(
        (t) =>
          t?.attributes?.Model?.toLowerCase().includes(
            values.searchText.toLowerCase()
          ) ||
          t?.attributes?.ProductName?.toLowerCase().includes(
            values.searchText.toLowerCase()
          )
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
        "Tên sản phẩm": item.attributes.ProductName,
        Model: item.attributes.Model,
        ĐVT: item.attributes.DVT,
        "Số lượng": item.attributes.totalimport,
        Kho: item.attributes.TypeKho,
        Ticket: item.attributes.Ticket,
        "Số serial": item.attributes.SerialNumber,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ImportList");
    XLSX.writeFile(wb, "ImportList.xlsx");
  };

  const modelCounts = Object.values(
    filteredList.reduce((acc, item) => {
      const model = item?.attributes?.BrandName || "Chưa xác định";
      if (!acc[model]) {
        acc[model] = { label: model, count: 0 };
      }
      acc[model].count += 1;
      return acc;
    }, {})
  );

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
      title: "Tên sản phẩm",
      dataIndex: ["attributes", "ProductName"],
      key: "ProductName",
    },
    {
      title: "Thương hiệu",
      dataIndex: ["attributes", "BrandName"],
      key: "BrandName",
    },
    {
      title: "Model",
      dataIndex: ["attributes", "Model"],
      key: "Model",
    },
    {
      title: "Số lượng",
      dataIndex: ["attributes", "totalimport"],
      key: "totalimport",
      align: "center",
    },
    {
      title: "Số lượng trả NCC",
      dataIndex: ["attributes", "totalimportNCC"],
      key: "totalimportNCC",
      align: "center",
    },
    {
      title: "Kho",
      dataIndex: ["attributes", "TypeKho"],
      key: "TypeKho",
      align: "center",
    },
    {
      title: "Loại thiết bị",
      dataIndex: ["attributes", "Type"],
      key: "Type",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: ["attributes", "Status"],
      align: "center",
      render: (status) => (
        <Tag color={status === "Trả NCC" ? "red" : "orange"}>{status}</Tag>
      ),
    },
  ];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <div className="importlist-container">
      {/* Form tìm kiếm */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20, flexWrap: "wrap" }}
      >
        {/* <Form.Item name="TypeKho">
          <Select placeholder="-- Kho --" style={{ width: 180 }} allowClear>
            {[...new Set(importlist.map((i) => i.attributes.TypeKho))].map((kho) => (
              <Select.Option key={kho} value={kho}>
                {kho}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}

        <Form.Item name="BrandName">
          <Select
            placeholder="-- Thương hiệu --"
            style={{ width: 180 }}
            allowClear
          >
            {[...new Set(importlist.map((i) => i.attributes.BrandName))].map(
              (brand) => (
                <Select.Option key={brand} value={brand}>
                  {brand}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item name="Type">
          <Select
            placeholder="--Loại thiết bị--"
            style={{ width: 180 }}
            allowClear
          >
            {[...new Set(importlist.map((i) => i.attributes.Type))].map(
              (type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item name="searchText">
          <Input placeholder="Tên SP / Model" style={{ width: 200 }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            style={{ marginRight: 10 }}
          >
            Tìm kiếm
          </Button>
        </Form.Item>

        <Form.Item>
          <Button onClick={resetFilters}>🧹 Reset</Button>
        </Form.Item>

        <Form.Item>
          <Button type="dashed" onClick={handleExport}>
            📤 Export Excel
          </Button>
        </Form.Item>

        {/* Nút thêm nhập kho DHG */}
        <Form.Item>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenAddModal(true)}
          >
            Nhập kho DHG
          </Button>
        </Form.Item>
      </Form>

      {/* Thanh thống kê */}
      <Row
        gutter={[12, 12]}
        style={{ marginBottom: 20 }}
        className="status-summary"
      >
        {modelCounts.map(({ label, count }) => (
          <Col key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 500 }}>{label}:</span>
              <span style={{ fontWeight: "bold" }}>{count}</span>
            </div>
          </Col>
        ))}
      </Row>

      {/* Bảng */}
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={filteredList}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        onRow={(record) => ({
          onClick: () => setDetailModal({ visible: true, record }),
        })}
      />

      {/* Modal chi tiết */}
      {/* <Modal
        title="Chi tiết sản phẩm"
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={null}
        width={700}
      > */}
      <Modal
        title="Chi tiết sản phẩm"
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={[
          <Button
            key="cancel"
            onClick={() => setDetailModal({ visible: false, record: null })}
          >
            Đóng
          </Button>,

          detailModal.record?.attributes?.Status === null &&
            account?.Purchase === true && (
              <Button
                key="return"
                type="primary"
                danger
                onClick={() => {
                  setOpenReturnModal({
                    visible: true,
                    record: detailModal.record,
                  });
                  setDetailModal({ visible: false, record: null });
                }}
              >
                Trả NCC
              </Button>
            ),
        ]}
        width={700}
      >
        {detailModal.record && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Tên sản phẩm">
              {detailModal.record.attributes.ProductName}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              {detailModal.record.attributes.Model}
            </Descriptions.Item>
            <Descriptions.Item label="Thương hiệu">
              {detailModal.record.attributes.BrandName}
            </Descriptions.Item>
            <Descriptions.Item label="ĐVT">
              {detailModal.record.attributes.DVT}
            </Descriptions.Item>
            <Descriptions.Item label="Kho">
              {detailModal.record.attributes.TypeKho}
            </Descriptions.Item>
            <Descriptions.Item label="Số phiếu">
              {detailModal.record.attributes.Ticket}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng">
              {detailModal.record.attributes.totalimport}
            </Descriptions.Item>
            <Descriptions.Item label="Loại thiết bị">
              <Tag color="blue">
                {detailModal.record.attributes.Type || "Chưa xác định"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng trả NCC">
              {detailModal.record.attributes.totalimportNCC}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  detailModal.record.attributes.Status === "Trả NCC"
                    ? "red"
                    : "orange"
                }
              >
                {detailModal.record.attributes.Status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Serial Number" span={2}>
              <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                {detailModal.record.attributes.SerialNumber}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>
              <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                {detailModal.record.attributes.Note}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal nhập mới */}
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

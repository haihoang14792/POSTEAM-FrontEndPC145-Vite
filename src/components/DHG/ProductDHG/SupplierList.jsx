import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Descriptions,
  notification,
  Space,
} from "antd";
import { FaFileExcel, FaSearch, FaEdit, FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import { fetchListSupplier } from "../../../services/dhgServices";
import AddSupplierModal from "./AddSupplierModal";
import UpdateSupplierModal from "./UpdateSupplierModal";
import "./SupplierList.scss";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await fetchListSupplier();
      setSuppliers(data.data);
      setFilteredSuppliers(data.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      notification.error({
        message: "Lỗi tải dữ liệu",
        description: err.message,
      });
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (filteredSuppliers.length === 0) {
      notification.warning({ message: "Không có dữ liệu để xuất!" });
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      filteredSuppliers.map((s) => ({
        "Tên NCC": s.attributes.NameNCC,
        "Số điện thoại": s.attributes.Phone,
        Email: s.attributes.Email,
        "Sản phẩm": s.attributes.Product,
        "Người liên hệ": s.attributes.NameContact,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, "Suppliers_List.xlsx");
  };

  const onSearch = (values) => {
    const searchText = values.searchText?.toLowerCase().trim() || "";
    const filtered = suppliers.filter((s) =>
      s.attributes.NameNCC?.toLowerCase().includes(searchText)
    );
    setFilteredSuppliers(filtered);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredSuppliers(suppliers);
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
      title: "Tên NCC",
      dataIndex: ["attributes", "NameNCC"],
      key: "name",
      width: 350,
      ellipsis: true,
    },
    {
      title: "Sản phẩm",
      dataIndex: ["attributes", "Product"],
      key: "product",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Người liên hệ",
      dataIndex: ["attributes", "NameContact"],
      key: "contact",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelectedSupplier(record);
              setIsDetailModalOpen(true);
            }}
          >
            Chi tiết
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setSelectedSupplier(record);
              setIsUpdateModalOpen(true);
            }}
          >
            <FaEdit /> Cập nhật
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="supplier-list-container">
      <Form
        form={form}
        layout="inline"
        onFinish={onSearch}
        style={{ marginBottom: 16, flexWrap: "wrap" }}
      >
        <Form.Item name="searchText">
          <Input placeholder="Tìm kiếm nhà cung cấp" allowClear />
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
        <Form.Item>
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
            <FaPlus /> Thêm NCC
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={filteredSuppliers}
        rowKey="id"
        scroll={{ x: 1050 }}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết nhà cung cấp"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedSupplier && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Tên NCC">
              {selectedSupplier.attributes.NameNCC}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedSupplier.attributes.Phone}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedSupplier.attributes.Email}
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm">
              {selectedSupplier.attributes.Product}
            </Descriptions.Item>
            <Descriptions.Item label="Người liên hệ">
              {selectedSupplier.attributes.NameContact}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal thêm NCC */}
      {isAddModalOpen && (
        <AddSupplierModal
          isModalOpen={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onCreated={(newSupplier) => {
            setSuppliers((prev) => [...prev, newSupplier]);
            setFilteredSuppliers((prev) => [...prev, newSupplier]);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* Modal cập nhật NCC */}
      {isUpdateModalOpen && selectedSupplier && (
        <UpdateSupplierModal
          isModalOpen={isUpdateModalOpen}
          onCancel={() => setIsUpdateModalOpen(false)}
          supplierData={selectedSupplier}
          onUpdated={(updatedSupplier) => {
            setSuppliers((prev) =>
              prev.map((s) =>
                s.id === updatedSupplier.id ? updatedSupplier : s
              )
            );
            setFilteredSuppliers((prev) =>
              prev.map((s) =>
                s.id === updatedSupplier.id ? updatedSupplier : s
              )
            );
            setSelectedSupplier(updatedSupplier);
            setIsUpdateModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SupplierList;

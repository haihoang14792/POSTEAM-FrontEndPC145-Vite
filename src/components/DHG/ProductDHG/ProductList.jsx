

import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Descriptions,
  notification,
  Tag,
  Tooltip,
} from "antd";
import {
  FaFileExcel,
  FaSearch,
  FaEdit,
  FaPlus,
  FaEye,
  FaSyncAlt,
  FaBoxOpen
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { fetchWarehouseDetails } from "../../../services/dhgServices";
import AddProductModal from "./AddProductModal";
// import UpdateProductModal from "./UpdateProductModal"; 
import "./ProductList.scss";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchWarehouseDetails();
      const data = Array.isArray(res) ? res : (res.data || []);

      setProducts(data);
      setFilteredProducts(data);
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
    if (filteredProducts.length === 0) {
      notification.warning({ message: "Không có dữ liệu để xuất!" });
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      filteredProducts.map((p) => ({
        "Tên sản phẩm": p.ProductName,
        "Model": p.Model,
        "Thương hiệu": p.BrandName,
        "Đơn vị tính": p.DVT,
        "Tồn đầu kỳ": p.inventoryDK,
        "Kiểu thiết bị": p.Type,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Danh_Sach_San_Pham.xlsx");
  };

  const onSearch = (values) => {
    const searchText = values.searchText?.toLowerCase().trim() || "";
    const filtered = products.filter(
      (p) =>
        p.Model?.toLowerCase().includes(searchText) ||
        p.ProductName?.toLowerCase().includes(searchText) ||
        p.BrandName?.toLowerCase().includes(searchText)
    );
    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredProducts(products);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100']
  });

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Model",
      dataIndex: "Model",
      key: "model",
      width: 140,
      render: (text) => <span className="cell-model">{text}</span>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "ProductName",
      key: "productName",
      width: 250,
      render: (text) => <span style={{ fontWeight: 500, color: '#262626' }}>{text}</span>
    },
    {
      title: "Thương hiệu",
      dataIndex: "BrandName",
      key: "brand",
      width: 140,
    },
    {
      title: "Loại thiết bị",
      dataIndex: "Type",
      key: "type",
      width: 140,
      render: (type) => {
        let color = 'default';
        if (type === 'Máy in') color = 'blue';
        if (type === 'Máy quét') color = 'cyan';
        if (type === 'PC' || type === 'Laptop') color = 'purple';
        return <Tag color={color}>{type || 'Khác'}</Tag>;
      }
    },
    {
      title: "ĐVT",
      dataIndex: "DVT",
      key: "dvt",
      align: "center",
      width: 80,
    },
    {
      title: "Tồn kho",
      dataIndex: "inventoryDK",
      key: "inventoryDK",
      width: 120,
      align: "right",
      render: (val) => (
        <span className={`cell-inventory ${val > 0 ? 'in-stock' : 'low-stock'}`}>
          {val ? val.toLocaleString() : 0}
        </span>
      )
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <div className="action-buttons">
          <Tooltip title="Xem chi tiết">
            <Button
              className="btn-icon btn-detail"
              size="small"
              icon={<FaEye />}
              onClick={() => {
                setSelectedProduct(record);
                setIsDetailModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Cập nhật thông tin">
            <Button
              className="btn-icon btn-edit"
              size="small"
              icon={<FaEdit />}
              onClick={() => {
                setSelectedProduct(record);
                setIsUpdateModalOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (error) return <div style={{ padding: 20, color: 'red' }}>Lỗi: {error.message}</div>;

  return (
    <div className="product-list-container">
      {/* HEADER PAGE */}
      <div className="page-header">
        <h2 className="page-title">
          <FaBoxOpen style={{ color: '#1890ff' }} /> Danh Sách Sản Phẩm
        </h2>
        <div className="header-actions">
          <Button
            className="btn-action btn-export"
            icon={<FaFileExcel />}
            onClick={handleExport}
          >
            Xuất Excel
          </Button>
          <Button
            type="primary"
            className="btn-action btn-add"
            icon={<FaPlus />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="table-card">
        {/* Search Form */}
        <Form
          form={form}
          layout="inline"
          onFinish={onSearch}
          className="search-form"
        >
          <Form.Item name="searchText">
            <Input
              className="search-input"
              placeholder="Tìm theo Tên, Model hoặc Thương hiệu..."
              prefix={<FaSearch />}
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Form.Item>
          <Form.Item>
            <Button icon={<FaSyncAlt />} onClick={resetFilters}>
              Làm mới
            </Button>
          </Form.Item>
        </Form>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1100 }}
          bordered
          size="middle"
          pagination={{
            ...pagination,
            total: filteredProducts.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
            },
          }}
        />
      </div>

      {/* Modal chi tiết */}
      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Chi tiết sản phẩm</span>}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
        ]}
        width={800}
        centered
      >
        {selectedProduct && (
          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} labelStyle={{ width: '160px', fontWeight: '600' }}>
            <Descriptions.Item label="Tên sản phẩm">
              {selectedProduct.ProductName}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              <Tag color="geekblue">{selectedProduct.Model}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thương hiệu">
              {selectedProduct.BrandName}
            </Descriptions.Item>
            <Descriptions.Item label="Kiểu thiết bị">
              {selectedProduct.Type}
            </Descriptions.Item>
            <Descriptions.Item label="Đơn vị tính">
              {selectedProduct.DVT}
            </Descriptions.Item>
            <Descriptions.Item label="Tồn đầu kỳ">
              <b style={{ color: '#faad14' }}>{selectedProduct.inventoryDK}</b>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal thêm sản phẩm */}
      {isAddModalOpen && (
        <AddProductModal
          isModalOpen={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onCreated={(newProduct) => {
            setProducts((prev) => [newProduct, ...prev]); // Thêm vào đầu danh sách
            setFilteredProducts((prev) => [newProduct, ...prev]);
            setIsAddModalOpen(false);
            notification.success({ message: 'Thêm mới thành công!' });
          }}
        />
      )}

      {/* Modal Update (khi nào bạn làm xong UpdateProductModal thì bỏ comment) */}
      {/* {isUpdateModalOpen && selectedProduct && (
        <UpdateProductModal
          isModalOpen={isUpdateModalOpen}
          onCancel={() => setIsUpdateModalOpen(false)}
          productData={selectedProduct}
          onUpdated={(updatedProduct) => {
             // Logic update state...
             setIsUpdateModalOpen(false);
          }}
        />
      )} 
      */}
    </div>
  );
};

export default ProductList;
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
import { FaFileExcel, FaSearch, FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";
import { fetchWarehouseDetails } from "../../../services/dhgServices";
import AddProductModal from "./AddProductModal";
//import UpdateProductModal from "./UpdateProductModal"; // giả sử bạn có modal cập nhật
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
    try {
      const data = await fetchWarehouseDetails();
      setProducts(data.data);
      setFilteredProducts(data.data);
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
        "Tên sản phẩm": p.attributes.ProductName,
        Model: p.attributes.Model,
        "Thương hiệu": p.attributes.BrandName,
        "Đơn vị tính": p.attributes.DVT,
        "Tồn đầu kỳ": p.attributes.inventoryDK,
        "Kiểu thiết bị": p.attributes.Type,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Products_List.xlsx");
  };

  const onSearch = (values) => {
    const searchText = values.searchText?.toLowerCase().trim() || "";
    const filtered = products.filter(
      (p) =>
        p.attributes.Model?.toLowerCase().includes(searchText) ||
        p.attributes.ProductName?.toLowerCase().includes(searchText)
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
      key: "productName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Model",
      dataIndex: ["attributes", "Model"],
      key: "model",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Thương hiệu",
      dataIndex: ["attributes", "BrandName"],
      key: "brand",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Đơn vị tính",
      dataIndex: ["attributes", "DVT"],
      key: "dvt",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Tồn đầu kỳ",
      dataIndex: ["attributes", "inventoryDK"],
      key: "inventoryDK",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Kiểu thiết bị",
      dataIndex: ["attributes", "Type"],
      key: "type",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: 140,
      fixed: "right",
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
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setSelectedProduct(record);
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
    <div className="product-list-container">
      {/* <h2>Danh mục sản phẩm</h2> */}
      <Form
        form={form}
        layout="inline"
        onFinish={onSearch}
        style={{ marginBottom: 16, flexWrap: "wrap" }}
      >
        <Form.Item name="searchText">
          <Input placeholder="Tìm Model hoặc Tên sản phẩm" allowClear />
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
          <Button onClick={handleExport} icon={<FaFileExcel />} type="default">
            Xuất Excel
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
            Thêm sản phẩm
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        scroll={{ x: 1050 }} // tổng width cột + dư chút cho scrollbar
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết sản phẩm"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedProduct && (
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
            <Descriptions.Item label="Đơn vị tính">
              {selectedProduct.attributes.DVT}
            </Descriptions.Item>
            <Descriptions.Item label="Tồn đầu kỳ">
              {selectedProduct.attributes.inventoryDK}
            </Descriptions.Item>
            <Descriptions.Item label="Kiểu thiết bị">
              {selectedProduct.attributes.Type}
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
            setProducts((prev) => [...prev, newProduct]);
            setFilteredProducts((prev) => [...prev, newProduct]);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* Modal cập nhật sản phẩm */}
      {/* {isUpdateModalOpen && selectedProduct && (
        <UpdateProductModal
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          product={selectedProduct}
          onUpdateSuccess={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            setFilteredProducts((prev) =>
              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            setSelectedProduct(updatedProduct);
            setIsUpdateModalOpen(false);
          }}
        />
      )} */}
    </div>
  );
};

export default ProductList;

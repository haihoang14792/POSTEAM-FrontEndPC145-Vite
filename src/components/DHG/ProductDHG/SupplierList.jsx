// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Form,
//   Input,
//   Button,
//   Modal,
//   Descriptions,
//   notification,
//   Space,
// } from "antd";
// import { FaFileExcel, FaSearch, FaEdit, FaPlus } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { fetchListSupplier } from "../../../services/dhgServices";
// import AddSupplierModal from "./AddSupplierModal";
// import UpdateSupplierModal from "./UpdateSupplierModal";
// import "./SupplierList.scss";

// const SupplierList = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

//   const [form] = Form.useForm();

//   useEffect(() => {
//     loadSuppliers();
//   }, []);

//   const loadSuppliers = async () => {
//     try {
//       const data = await fetchListSupplier();
//       // Strapi v5: response có thể là mảng trực tiếp hoặc { data: [...] }
//       const suppliersData = Array.isArray(data) ? data : (data.data || []);

//       setSuppliers(suppliersData);
//       setFilteredSuppliers(suppliersData);
//       setLoading(false);
//     } catch (err) {
//       setError(err);
//       notification.error({
//         message: "Lỗi tải dữ liệu",
//         description: err.message,
//       });
//       setLoading(false);
//     }
//   };

//   const handleExport = () => {
//     if (filteredSuppliers.length === 0) {
//       notification.warning({ message: "Không có dữ liệu để xuất!" });
//       return;
//     }
//     const ws = XLSX.utils.json_to_sheet(
//       filteredSuppliers.map((s) => ({
//         // Sửa: bỏ .attributes
//         "Tên NCC": s.NameNCC,
//         "Số điện thoại": s.Phone,
//         Email: s.Email,
//         "Sản phẩm": s.Product,
//         "Người liên hệ": s.NameContact,
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
//     XLSX.writeFile(wb, "Suppliers_List.xlsx");
//   };

//   const onSearch = (values) => {
//     const searchText = values.searchText?.toLowerCase().trim() || "";
//     const filtered = suppliers.filter((s) =>
//       // Sửa: bỏ .attributes
//       s.NameNCC?.toLowerCase().includes(searchText)
//     );
//     setFilteredSuppliers(filtered);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setFilteredSuppliers(suppliers);
//   };

//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   });

//   const columns = [
//     {
//       title: "STT",
//       key: "stt",
//       align: "center",
//       render: (_, __, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//       width: 70,
//     },
//     {
//       title: "Tên NCC",
//       dataIndex: "NameNCC", // Sửa: bỏ ["attributes", ...]
//       key: "name",
//       width: 350,
//       ellipsis: true,
//     },
//     {
//       title: "Sản phẩm",
//       dataIndex: "Product", // Sửa: bỏ ["attributes", ...]
//       key: "product",
//       width: 200,
//       ellipsis: true,
//     },
//     {
//       title: "Người liên hệ",
//       dataIndex: "NameContact", // Sửa: bỏ ["attributes", ...]
//       key: "contact",
//       width: 150,
//       ellipsis: true,
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       width: 160,
//       fixed: "right",
//       render: (_, record) => (
//         <Space>
//           <Button
//             size="small"
//             onClick={() => {
//               setSelectedSupplier(record);
//               setIsDetailModalOpen(true);
//             }}
//           >
//             Chi tiết
//           </Button>
//           <Button
//             size="small"
//             type="primary"
//             onClick={() => {
//               setSelectedSupplier(record);
//               setIsUpdateModalOpen(true);
//             }}
//           >
//             <FaEdit /> Cập nhật
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div className="supplier-list-container">
//       <Form
//         form={form}
//         layout="inline"
//         onFinish={onSearch}
//         style={{ marginBottom: 16, flexWrap: "wrap" }}
//       >
//         <Form.Item name="searchText">
//           <Input placeholder="Tìm kiếm nhà cung cấp" allowClear />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" icon={<FaSearch />}>
//             Tìm kiếm
//           </Button>
//         </Form.Item>
//         <Form.Item>
//           <Button onClick={resetFilters}>Reset</Button>
//         </Form.Item>
//         <Form.Item>
//           <Button onClick={handleExport} icon={<FaFileExcel />}>
//             Xuất Excel
//           </Button>
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
//             <FaPlus /> Thêm NCC
//           </Button>
//         </Form.Item>
//       </Form>

//       <Table
//         columns={columns}
//         dataSource={filteredSuppliers}
//         rowKey="id"
//         scroll={{ x: 1050 }}
//         pagination={{
//           ...pagination,
//           onChange: (page, pageSize) => {
//             setPagination({ current: page, pageSize });
//           },
//         }}
//       />

//       {/* Modal chi tiết */}
//       <Modal
//         title="Chi tiết nhà cung cấp"
//         open={isDetailModalOpen}
//         onCancel={() => setIsDetailModalOpen(false)}
//         footer={null}
//         width={700}
//       >
//         {selectedSupplier && (
//           <Descriptions bordered column={2} size="small">
//             <Descriptions.Item label="Tên NCC">
//               {selectedSupplier.NameNCC} {/* Sửa: bỏ .attributes */}
//             </Descriptions.Item>
//             <Descriptions.Item label="Số điện thoại">
//               {selectedSupplier.Phone} {/* Sửa: bỏ .attributes */}
//             </Descriptions.Item>
//             <Descriptions.Item label="Email">
//               {selectedSupplier.Email} {/* Sửa: bỏ .attributes */}
//             </Descriptions.Item>
//             <Descriptions.Item label="Sản phẩm">
//               {selectedSupplier.Product} {/* Sửa: bỏ .attributes */}
//             </Descriptions.Item>
//             <Descriptions.Item label="Người liên hệ">
//               {selectedSupplier.NameContact} {/* Sửa: bỏ .attributes */}
//             </Descriptions.Item>
//           </Descriptions>
//         )}
//       </Modal>

//       {/* Modal thêm NCC */}
//       {isAddModalOpen && (
//         <AddSupplierModal
//           isModalOpen={isAddModalOpen}
//           onCancel={() => setIsAddModalOpen(false)}
//           onCreated={(newSupplier) => {
//             setSuppliers((prev) => [...prev, newSupplier]);
//             setFilteredSuppliers((prev) => [...prev, newSupplier]);
//             setIsAddModalOpen(false);
//           }}
//         />
//       )}

//       {/* Modal cập nhật NCC */}
//       {isUpdateModalOpen && selectedSupplier && (
//         <UpdateSupplierModal
//           isModalOpen={isUpdateModalOpen}
//           onCancel={() => setIsUpdateModalOpen(false)}
//           supplierData={selectedSupplier}
//           onUpdated={(updatedSupplier) => {
//             setSuppliers((prev) =>
//               prev.map((s) =>
//                 s.id === updatedSupplier.id ? updatedSupplier : s
//               )
//             );
//             setFilteredSuppliers((prev) =>
//               prev.map((s) =>
//                 s.id === updatedSupplier.id ? updatedSupplier : s
//               )
//             );
//             setSelectedSupplier(updatedSupplier);
//             setIsUpdateModalOpen(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default SupplierList;


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
  Card,
  Row,
  Col,
  Tooltip
} from "antd";
import { FaFileExcel, FaSearch, FaEdit, FaPlus, FaEye, FaSyncAlt } from "react-icons/fa";
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
    setLoading(true);
    try {
      const data = await fetchListSupplier();
      const suppliersData = Array.isArray(data) ? data : (data.data || []);

      setSuppliers(suppliersData);
      setFilteredSuppliers(suppliersData);
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
        "Tên NCC": s.NameNCC,
        "Số điện thoại": s.Phone,
        Email: s.Email,
        "Sản phẩm": s.Product,
        "Người liên hệ": s.NameContact,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, "Danh_Sach_Nha_Cung_Cap.xlsx");
  };

  const onSearch = (values) => {
    const searchText = values.searchText?.toLowerCase().trim() || "";
    const filtered = suppliers.filter((s) =>
      s.NameNCC?.toLowerCase().includes(searchText) ||
      s.NameContact?.toLowerCase().includes(searchText) // Tìm thêm theo tên người liên hệ
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
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50']
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
      title: "Tên Nhà Cung Cấp",
      dataIndex: "NameNCC",
      key: "name",
      width: 300,
      render: (text) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>,
    },
    {
      title: "Sản phẩm cung cấp",
      dataIndex: "Product",
      key: "product",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Người liên hệ",
      dataIndex: "NameContact",
      key: "contact",
      width: 180,
    },
    {
      title: "Liên hệ",
      key: "contact_info",
      width: 200,
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>Email: {record.Email || '--'}</div>
          <div>SĐT: {record.Phone || '--'}</div>
        </div>
      )
    },
    {
      title: "Hành động",
      key: "action",
      width: 140,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <div className="action-buttons">
          <Tooltip title="Xem chi tiết">
            <Button
              className="btn-detail"
              size="small"
              icon={<FaEye />}
              onClick={() => {
                setSelectedSupplier(record);
                setIsDetailModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Cập nhật">
            <Button
              type="primary"
              size="small"
              icon={<FaEdit />}
              onClick={() => {
                setSelectedSupplier(record);
                setIsUpdateModalOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error.message}</div>;

  return (
    <div className="supplier-list-container">
      {/* HEADER PAGE */}
      <div className="page-header">
        <h2 className="page-title">Quản lý Nhà Cung Cấp</h2>
        <div className="header-actions">
          <Button
            className="btn-export"
            icon={<FaFileExcel />}
            onClick={handleExport}
          >
            Xuất Excel
          </Button>
          <Button
            type="primary"
            className="btn-add"
            icon={<FaPlus />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Thêm mới
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
          <Form.Item name="searchText" style={{ width: 300 }}>
            <Input
              prefix={<FaSearch style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm theo tên NCC hoặc người liên hệ..."
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
          dataSource={filteredSuppliers}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          bordered
          size="middle"
          pagination={{
            ...pagination,
            total: filteredSuppliers.length,
            showTotal: (total) => `Tổng số ${total} bản ghi`,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
            },
          }}
        />
      </div>

      {/* Modal chi tiết */}
      <Modal
        title={<span style={{ fontSize: 18 }}>Thông tin nhà cung cấp</span>}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={700}
        centered
      >
        {selectedSupplier && (
          <Descriptions bordered column={1} labelStyle={{ width: '180px', fontWeight: 'bold' }}>
            <Descriptions.Item label="Tên NCC">
              {selectedSupplier.NameNCC}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedSupplier.Phone}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedSupplier.Email}
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm cung cấp">
              {selectedSupplier.Product}
            </Descriptions.Item>
            <Descriptions.Item label="Người liên hệ">
              {selectedSupplier.NameContact}
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
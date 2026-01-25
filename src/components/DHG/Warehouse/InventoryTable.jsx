// import React, { useState, useEffect } from "react";
// import {
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
// } from "../../../services/dhgServices";
// import * as XLSX from "xlsx";
// import { FaFileExcel } from "react-icons/fa";
// import { Input, Button, Form } from "antd";
// import {
//   SearchOutlined,
//   ReloadOutlined,
//   SyncOutlined,
// } from "@ant-design/icons";
// import "./InventoryTable.scss";
// import ConfirmCloseInventory from "./ConfirmCloseInventory";

// const InventoryTable = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();

//   const today = new Date();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const warehouseResponse = await fetchWarehouseDetails();
//       // Strapi v5: response.data là mảng phẳng hoặc response là mảng
//       const warehouseData = Array.isArray(warehouseResponse) ? warehouseResponse : (warehouseResponse.data || []);

//       setData(warehouseData);
//       setFilteredData(warehouseData);
//     } catch (error) {
//       console.error("Lỗi khi tải dữ liệu:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [currentMonth, currentYear]);

//   // --- Tìm kiếm / lọc ---
//   const handleSearch = (values) => {
//     let results = [...data];
//     if (values.searchText) {
//       const keyword = values.searchText.toLowerCase();
//       results = results.filter(
//         (item) =>
//           // Sửa: bỏ .attributes
//           item.ProductName?.toLowerCase().includes(keyword) ||
//           item.Model?.toLowerCase().includes(keyword)
//       );
//     }
//     setFilteredData(results);
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredData.map((item) => ({
//         // Sửa: bỏ .attributes
//         "Tên Sản Phẩm": item.ProductName,
//         Model: item.Model,
//         ĐVT: item.DVT,
//         "Tồn Đầu Kỳ": item.inventoryDK,
//         "Nhập Trong Kỳ": item.totalNTK,
//         "Xuất Trong Kỳ": item.totalXTK,
//         "Tồn Cuối Kỳ": item.inventoryCK,
//         "Kho DHG": item.DHG,
//         "Kho POS": item.POS,
//         "Kho POSHN": item.POSHN,
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
//     XLSX.writeFile(workbook, `Inventory_${currentMonth}_${currentYear}.xlsx`);
//   };

//   const handleChotKho = async () => {
//     try {
//       const currentMonthKey = Number(currentYear * 100 + currentMonth);

//       const alreadyClosed = data.some(
//         // Sửa: bỏ .attributes
//         (item) => Number(item.closedMonth) === currentMonthKey
//       );

//       if (alreadyClosed) {
//         alert("⚠️ Một số dòng kho đã được chốt trong tháng này!");
//         return;
//       }

//       setShowConfirmModal(false);

//       // Xuất Excel trước khi chốt
//       const worksheet = XLSX.utils.json_to_sheet(
//         data.map((item) => ({
//           // Sửa: bỏ .attributes
//           "Tên Sản Phẩm": item.ProductName,
//           Model: item.Model,
//           ĐVT: item.DVT,
//           "Tồn Đầu Kỳ": item.inventoryDK,
//           "Nhập Trong Kỳ": item.totalNTK,
//           "Xuất Trong Kỳ": item.totalXTK,
//           "Tồn Cuối Kỳ": item.inventoryCK,
//           "Kho DHG": item.DHG,
//           "Kho POS": item.POS,
//           "Kho POSHN": item.POSHN,
//         }))
//       );
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Before");
//       XLSX.writeFile(
//         workbook,
//         `Inventory_Before_CK_${currentMonth}_${currentYear}.xlsx`
//       );

//       for (const item of data) {
//         // Sửa: dùng id hoặc documentId, bỏ .attributes
//         await updateWarehouseDetails(item.id || item.documentId, {
//           inventoryDK: item.inventoryCK,
//           inventoryCK: item.inventoryCK,
//           totalNTK: 0,
//           totalXTK: 0,
//           closedMonth: currentMonthKey,
//         });
//       }

//       await loadData();

//       alert("✅ Đã chốt kho POS thành công!");
//     } catch (error) {
//       console.error("❌ Lỗi khi chốt kho POS:", error);
//       alert("Có lỗi khi chốt kho POS.");
//     }
//   };

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   return (
//     <>
//       <div className="inventory-table-container p-4">
//         {/* Thanh công cụ */}
//         <div
//           className="mb-4 flex items-center flex-wrap"
//           style={{ alignItems: "center", gap: "8px" }}
//         >
//           {/* Form tìm kiếm */}
//           <Form
//             form={form}
//             layout="inline"
//             onFinish={handleSearch}
//             className="flex items-center"
//             style={{ marginBottom: 0 }}
//           >
//             <Form.Item name="searchText" className="mb-0">
//               <Input
//                 placeholder="🔍 Tìm theo tên SP hoặc Model"
//                 allowClear
//                 style={{ width: 250, height: 32 }}
//               />
//             </Form.Item>
//             <Form.Item className="mb-0">
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 icon={<SearchOutlined />}
//                 style={{ height: 32 }}
//               >
//                 Tìm kiếm
//               </Button>
//             </Form.Item>
//           </Form>

//           {/* Nhóm nút Excel + Làm mới + Chốt Kho POS */}
//           <div className="flex items-center" style={{ gap: "8px" }}>
//             <Button
//               type="default"
//               icon={<SyncOutlined />}
//               loading={loading}
//               style={{ height: 32 }}
//               onClick={loadData}
//             >
//               Load data
//             </Button>
//             {account.Warehouse === true && (
//               <Button
//                 type="primary"
//                 style={{
//                   backgroundColor: "#f97316",
//                   border: "none",
//                   height: 32,
//                 }}
//                 onClick={() => setShowConfirmModal(true)}
//               >
//                 Chốt Kho POS
//               </Button>
//             )}
//             {account.Warehouse === true && (
//               <Button
//                 type="primary"
//                 icon={<FaFileExcel />}
//                 style={{
//                   backgroundColor: "#22c55e",
//                   border: "none",
//                   height: 32,
//                 }}
//                 onClick={exportToExcel}
//               >
//                 Xuất Excel
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Bảng tồn kho */}
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">STT</th>
//               <th className="border p-2">Tên Sản Phẩm</th>
//               <th className="border p-2">Model</th>
//               <th className="border p-2">ĐVT</th>
//               <th className="border p-2">Tồn Đầu Kỳ</th>
//               <th className="border p-2">Nhập Trong Kỳ</th>
//               <th className="border p-2">Xuất Trong Kỳ</th>
//               <th className="border p-2">Tồn Cuối Kỳ</th>
//               <th className="border p-2">Kho DHG</th>
//               <th className="border p-2">Kho POS</th>
//               <th className="border p-2">Kho POSHN</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((item, index) => (
//               <tr key={item.id} className="text-center border">
//                 <td className="border p-2">{index + 1}</td>
//                 <td className="border p-2">{item.ProductName}</td> {/* Sửa: bỏ .attributes */}
//                 <td className="border p-2">{item.Model}</td> {/* Sửa: bỏ .attributes */}
//                 <td className="border p-2">{item.DVT}</td> {/* Sửa: bỏ .attributes */}
//                 <td className="border p-2">{item.inventoryDK}</td> {/* Sửa: bỏ .attributes */}
//                 <td className="border p-2">{item.totalNTK}</td> {/* Sửa: bỏ .attributes */}
//                 <td className="border p-2 font-bold text-orange-600">
//                   {item.totalXTK} {/* Sửa: bỏ .attributes */}
//                 </td>
//                 <td className="border p-2 font-bold text-green-600">
//                   {item.inventoryCK} {/* Sửa: bỏ .attributes */}
//                 </td>
//                 <td className="border p-2 font-bold text-blue-600">
//                   {item.DHG} {/* Sửa: bỏ .attributes */}
//                 </td>
//                 <td className="border p-2 font-bold text-red-600">
//                   {item.POS} {/* Sửa: bỏ .attributes */}
//                 </td>
//                 <td className="border p-2 font-bold text-purple-600">
//                   {item.POSHN} {/* Sửa: bỏ .attributes */}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {showConfirmModal && (
//         <ConfirmCloseInventory
//           onConfirm={handleChotKho}
//           onCancel={() => setShowConfirmModal(false)}
//         />
//       )}
//     </>
//   );
// };

// export default InventoryTable;


// import React, { useState, useEffect } from "react";
// import {
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
// } from "../../../services/dhgServices";
// import * as XLSX from "xlsx";
// import {
//   SearchOutlined,
//   ReloadOutlined,
//   FileExcelOutlined,
//   LockOutlined,
//   ShopOutlined
// } from "@ant-design/icons";
// import {
//   Input,
//   Button,
//   Table,
//   Typography,
//   Tooltip,
//   Tag,
//   message
// } from "antd";
// import ConfirmCloseInventory from "./ConfirmCloseInventory";
// import "./InventoryTable.scss";

// const { Title, Text } = Typography;

// const InventoryTable = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");

//   const today = new Date();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const warehouseResponse = await fetchWarehouseDetails();
//       // Strapi v5 handling
//       const warehouseData = Array.isArray(warehouseResponse) ? warehouseResponse : (warehouseResponse.data || []);

//       setData(warehouseData);
//       setFilteredData(warehouseData);

//       // Re-apply search if exists
//       if (searchText) {
//         const keyword = searchText.toLowerCase();
//         const results = warehouseData.filter(
//           (item) =>
//             item.ProductName?.toLowerCase().includes(keyword) ||
//             item.Model?.toLowerCase().includes(keyword)
//         );
//         setFilteredData(results);
//       }
//     } catch (error) {
//       console.error("Lỗi khi tải dữ liệu:", error);
//       message.error("Không thể tải dữ liệu kho");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentMonth, currentYear]);

//   // --- Tìm kiếm ---
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchText(value);

//     if (!value) {
//       setFilteredData(data);
//       return;
//     }

//     const keyword = value.toLowerCase();
//     const results = data.filter(
//       (item) =>
//         item.ProductName?.toLowerCase().includes(keyword) ||
//         item.Model?.toLowerCase().includes(keyword)
//     );
//     setFilteredData(results);
//   };

//   const exportToExcel = () => {
//     if (filteredData.length === 0) {
//       message.warning("Không có dữ liệu để xuất");
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredData.map((item) => ({
//         "Tên Sản Phẩm": item.ProductName,
//         Model: item.Model,
//         "ĐVT": item.DVT,
//         "Tồn Đầu Kỳ": item.inventoryDK,
//         "Nhập Trong Kỳ": item.totalNTK,
//         "Xuất Trong Kỳ": item.totalXTK,
//         "Tồn Cuối Kỳ": item.inventoryCK,
//         "Kho DHG": item.DHG,
//         "Kho POS": item.POS,
//         "Kho POSHN": item.POSHN,
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
//     XLSX.writeFile(workbook, `Inventory_${currentMonth}_${currentYear}.xlsx`);
//     message.success("Xuất Excel thành công");
//   };

//   const handleChotKho = async () => {
//     try {
//       const currentMonthKey = Number(currentYear * 100 + currentMonth);
//       const alreadyClosed = data.some(
//         (item) => Number(item.closedMonth) === currentMonthKey
//       );

//       if (alreadyClosed) {
//         message.warning("Một số dòng kho đã được chốt trong tháng này!");
//         return;
//       }

//       setShowConfirmModal(false);
//       setLoading(true);

//       // Export backup before closing
//       const worksheet = XLSX.utils.json_to_sheet(
//         data.map((item) => ({
//           "Tên Sản Phẩm": item.ProductName,
//           Model: item.Model,
//           "ĐVT": item.DVT,
//           "Tồn Đầu Kỳ": item.inventoryDK,
//           "Nhập Trong Kỳ": item.totalNTK,
//           "Xuất Trong Kỳ": item.totalXTK,
//           "Tồn Cuối Kỳ": item.inventoryCK,
//           "Kho DHG": item.DHG,
//           "Kho POS": item.POS,
//           "Kho POSHN": item.POSHN,
//         }))
//       );
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Before");
//       XLSX.writeFile(
//         workbook,
//         `Inventory_Before_CK_${currentMonth}_${currentYear}.xlsx`
//       );

//       // Update logic
//       const updates = data.map(item =>
//         updateWarehouseDetails(item.id || item.documentId, {
//           inventoryDK: item.inventoryCK,
//           inventoryCK: item.inventoryCK,
//           totalNTK: 0,
//           totalXTK: 0,
//           closedMonth: currentMonthKey,
//         })
//       );

//       await Promise.all(updates);
//       await loadData();
//       message.success("Đã chốt kho POS thành công!");

//     } catch (error) {
//       console.error("Lỗi khi chốt kho POS:", error);
//       message.error("Có lỗi xảy ra khi chốt kho");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   // --- Cấu hình cột cho Antd Table ---
//   const columns = [
//     {
//       title: 'STT',
//       key: 'index',
//       width: 60,
//       align: 'center',
//       render: (_, __, index) => index + 1,
//     },
//     {
//       title: 'Sản Phẩm',
//       dataIndex: 'ProductName',
//       key: 'ProductName',
//       width: 250,
//       render: (text) => <Text strong>{text}</Text>
//     },
//     {
//       title: 'Model',
//       dataIndex: 'Model',
//       key: 'Model',
//       width: 150,
//     },
//     {
//       title: 'ĐVT',
//       dataIndex: 'DVT',
//       key: 'DVT',
//       width: 80,
//       align: 'center',
//       render: (text) => <Tag>{text}</Tag>
//     },
//     {
//       title: 'Tồn Đầu',
//       dataIndex: 'inventoryDK',
//       key: 'inventoryDK',
//       align: 'right',
//       width: 100,
//     },
//     {
//       title: 'Nhập',
//       dataIndex: 'totalNTK',
//       key: 'totalNTK',
//       align: 'right',
//       width: 100,
//       className: 'col-import'
//     },
//     {
//       title: 'Xuất',
//       dataIndex: 'totalXTK',
//       key: 'totalXTK',
//       align: 'right',
//       width: 100,
//       className: 'col-export',
//       render: (val) => <span className="text-orange">{val}</span>
//     },
//     {
//       title: 'Tồn Cuối',
//       dataIndex: 'inventoryCK',
//       key: 'inventoryCK',
//       align: 'right',
//       width: 100,
//       render: (val) => <span className="text-green font-bold">{val}</span>
//     },
//     {
//       title: 'Kho DHG',
//       dataIndex: 'DHG',
//       key: 'DHG',
//       align: 'right',
//       width: 100,
//       render: (val) => <span className="text-blue">{val}</span>
//     },
//     {
//       title: 'Kho POS',
//       dataIndex: 'POS',
//       key: 'POS',
//       align: 'right',
//       width: 100,
//       render: (val) => <span className="text-red">{val}</span>
//     },
//     {
//       title: 'Kho POSHN',
//       dataIndex: 'POSHN',
//       key: 'POSHN',
//       align: 'right',
//       width: 100,
//       render: (val) => <span className="text-purple">{val}</span>
//     },
//   ];

//   return (
//     <div className="inventory-table-container">
//       {/* HEADER DASHBOARD */}
//       <div className="page-header">
//         <div className="header-left">
//           <div className="header-icon-box">
//             <ShopOutlined />
//           </div>
//           <div className="header-titles">
//             <Title level={4}>Quản lý Tồn Kho</Title>
//             <Text type="secondary">Theo dõi nhập xuất tồn chi tiết theo thời gian thực</Text>
//           </div>
//         </div>

//         <div className="header-right">
//           <Input
//             prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
//             placeholder="Tìm tên SP hoặc Model..."
//             value={searchText}
//             onChange={handleSearch}
//             className="search-input"
//             allowClear
//           />

//           <div className="action-buttons">
//             <Tooltip title="Tải lại dữ liệu">
//               <Button
//                 icon={<ReloadOutlined />}
//                 onClick={loadData}
//                 loading={loading}
//                 className="btn-icon"
//               />
//             </Tooltip>

//             {account.Warehouse === true && (
//               <>
//                 <Tooltip title="Xuất báo cáo Excel">
//                   <Button
//                     type="primary"
//                     icon={<FileExcelOutlined />}
//                     onClick={exportToExcel}
//                     className="btn-excel"
//                     style={{ backgroundColor: '#217346', borderColor: '#217346' }}
//                   >
//                     Xuất Excel
//                   </Button>
//                 </Tooltip>

//                 <Tooltip title="Chốt số liệu tồn kho tháng này">
//                   <Button
//                     type="primary"
//                     danger
//                     icon={<LockOutlined />}
//                     onClick={() => setShowConfirmModal(true)}
//                     className="btn-lock"
//                   >
//                     Chốt Kho
//                   </Button>
//                 </Tooltip>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* TABLE CONTENT */}
//       <div className="table-wrapper">
//         <Table
//           rowKey={(record) => record.id || record.documentId}
//           loading={loading}
//           columns={columns}
//           dataSource={filteredData}
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             showTotal: (total) => `Tổng ${total} sản phẩm`
//           }}
//           className="custom-table"
//           scroll={{ x: 1200 }}
//           bordered
//           size="middle"
//         />
//       </div>

//       {showConfirmModal && (
//         <ConfirmCloseInventory
//           onConfirm={handleChotKho}
//           onCancel={() => setShowConfirmModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default InventoryTable;




import React, { useState, useEffect } from "react";
import {
  fetchWarehouseDetails,
  updateWarehouseDetails,
} from "../../../services/dhgServices";
import * as XLSX from "xlsx";
import {
  SearchOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  LockOutlined,
  ShopOutlined
} from "@ant-design/icons";
import {
  Input,
  Button,
  Table,
  Typography,
  Tooltip,
  Tag,
  message
} from "antd";
import ConfirmCloseInventory from "./ConfirmCloseInventory";
import "./InventoryTable.scss";

const { Title, Text } = Typography;

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Quản lý phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20, // Mặc định hiển thị 20 dòng
  });

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const loadData = async () => {
    try {
      setLoading(true);
      const warehouseResponse = await fetchWarehouseDetails();
      // Strapi v5 handling: check data structure
      const warehouseData = Array.isArray(warehouseResponse) ? warehouseResponse : (warehouseResponse.data || []);

      // Sắp xếp dữ liệu (ví dụ theo tên sản phẩm)
      const sortedData = warehouseData.sort((a, b) => a.ProductName?.localeCompare(b.ProductName));

      setData(sortedData);
      setFilteredData(sortedData);

      // Reset về trang 1 khi load lại data
      setPagination(prev => ({ ...prev, current: 1 }));

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error("Không thể tải dữ liệu kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);

  // --- Xử lý Tìm kiếm ---
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Reset về trang 1 khi bắt đầu tìm kiếm
    setPagination(prev => ({ ...prev, current: 1 }));

    if (!value) {
      setFilteredData(data);
      return;
    }

    const keyword = value.toLowerCase();
    const results = data.filter(
      (item) =>
        item.ProductName?.toLowerCase().includes(keyword) ||
        item.Model?.toLowerCase().includes(keyword)
    );
    setFilteredData(results);
  };

  // --- Xử lý thay đổi bảng (Phân trang) ---
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      message.warning("Không có dữ liệu để xuất");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Tên Sản Phẩm": item.ProductName,
        Model: item.Model,
        "ĐVT": item.DVT,
        "Tồn Đầu Kỳ": item.inventoryDK,
        "Nhập Trong Kỳ": item.totalNTK,
        "Xuất Trong Kỳ": item.totalXTK,
        "Tồn Cuối Kỳ": item.inventoryCK,
        "Kho DHG": item.DHG,
        "Kho POS": item.POS,
        "Kho POSHN": item.POSHN,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, `Inventory_${currentMonth}_${currentYear}.xlsx`);
    message.success("Xuất Excel thành công");
  };

  const handleChotKho = async () => {
    try {
      const currentMonthKey = Number(currentYear * 100 + currentMonth);
      const alreadyClosed = data.some(
        (item) => Number(item.closedMonth) === currentMonthKey
      );

      if (alreadyClosed) {
        message.warning("Một số dòng kho đã được chốt trong tháng này!");
        return;
      }

      setShowConfirmModal(false);
      setLoading(true);

      // Export backup before closing
      const worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          "Tên Sản Phẩm": item.ProductName,
          Model: item.Model,
          "ĐVT": item.DVT,
          "Tồn Đầu Kỳ": item.inventoryDK,
          "Nhập Trong Kỳ": item.totalNTK,
          "Xuất Trong Kỳ": item.totalXTK,
          "Tồn Cuối Kỳ": item.inventoryCK,
          "Kho DHG": item.DHG,
          "Kho POS": item.POS,
          "Kho POSHN": item.POSHN,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Before");
      XLSX.writeFile(
        workbook,
        `Inventory_Before_CK_${currentMonth}_${currentYear}.xlsx`
      );

      // Update logic
      const updates = data.map(item =>
        updateWarehouseDetails(item.id || item.documentId, {
          inventoryDK: item.inventoryCK,
          inventoryCK: item.inventoryCK,
          totalNTK: 0,
          totalXTK: 0,
          closedMonth: currentMonthKey,
        })
      );

      await Promise.all(updates);
      await loadData();
      message.success("Đã chốt kho POS thành công!");

    } catch (error) {
      console.error("Lỗi khi chốt kho POS:", error);
      message.error("Có lỗi xảy ra khi chốt kho");
    } finally {
      setLoading(false);
    }
  };

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // --- Cấu hình cột ---
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Sản Phẩm',
      dataIndex: 'ProductName',
      key: 'ProductName',
      width: 250,
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => (a.ProductName || "").localeCompare(b.ProductName || ""),
    },
    {
      title: 'Model',
      dataIndex: 'Model',
      key: 'Model',
      width: 150,
      sorter: (a, b) => (a.Model || "").localeCompare(b.Model || ""),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 80,
      align: 'center',
      render: (text) => <Tag>{text}</Tag>
    },
    {
      title: 'Tồn Đầu',
      dataIndex: 'inventoryDK',
      key: 'inventoryDK',
      align: 'right',
      width: 100,
    },
    {
      title: 'Nhập',
      dataIndex: 'totalNTK',
      key: 'totalNTK',
      align: 'right',
      width: 100,
      className: 'col-import'
    },
    {
      title: 'Xuất',
      dataIndex: 'totalXTK',
      key: 'totalXTK',
      align: 'right',
      width: 100,
      className: 'col-export',
      render: (val) => <span className="text-orange">{val}</span>
    },
    {
      title: 'Tồn Cuối',
      dataIndex: 'inventoryCK',
      key: 'inventoryCK',
      align: 'right',
      width: 100,
      sorter: (a, b) => a.inventoryCK - b.inventoryCK,
      render: (val) => <span className="text-green font-bold">{val}</span>
    },
    {
      title: 'Kho DHG',
      dataIndex: 'DHG',
      key: 'DHG',
      align: 'right',
      width: 100,
      render: (val) => <span className="text-blue">{val}</span>
    },
    {
      title: 'Kho POS',
      dataIndex: 'POS',
      key: 'POS',
      align: 'right',
      width: 100,
      render: (val) => <span className="text-red">{val}</span>
    },
    {
      title: 'Kho POSHN',
      dataIndex: 'POSHN',
      key: 'POSHN',
      align: 'right',
      width: 100,
      render: (val) => <span className="text-purple">{val}</span>
    },
  ];

  return (
    <div className="inventory-table-container">
      {/* HEADER DASHBOARD */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-box">
            <ShopOutlined />
          </div>
          <div className="header-titles">
            <Title level={4}>Quản lý Tồn Kho</Title>
            <Text type="secondary">Theo dõi nhập xuất tồn chi tiết theo thời gian thực</Text>
          </div>
        </div>

        <div className="header-right">
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Tìm tên SP hoặc Model..."
            value={searchText}
            onChange={handleSearch}
            className="search-input"
            allowClear
          />

          <div className="action-buttons">
            <Tooltip title="Tải lại dữ liệu">
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
                className="btn-icon"
              />
            </Tooltip>

            {account.Warehouse === true && (
              <>
                <Tooltip title="Xuất báo cáo Excel">
                  <Button
                    type="primary"
                    icon={<FileExcelOutlined />}
                    onClick={exportToExcel}
                    className="btn-excel"
                    style={{ backgroundColor: '#217346', borderColor: '#217346' }}
                  >
                    Excel
                  </Button>
                </Tooltip>

                <Tooltip title="Chốt số liệu tồn kho tháng này">
                  <Button
                    type="primary"
                    danger
                    icon={<LockOutlined />}
                    onClick={() => setShowConfirmModal(true)}
                    className="btn-lock"
                  >
                    Chốt Kho
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="table-wrapper">
        <Table
          rowKey={(record) => record.id || record.documentId || Math.random()} // Đảm bảo key duy nhất
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          // CẤU HÌNH PHÂN TRANG CHI TIẾT
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'], // Các tùy chọn số dòng
            showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} sản phẩm`,
            locale: { items_per_page: "/ trang" }
          }}
          onChange={handleTableChange} // Hàm bắt sự kiện thay đổi phân trang
          className="custom-table"
          scroll={{ x: 1200 }}
          bordered
          size="middle"
        />
      </div>

      {showConfirmModal && (
        <ConfirmCloseInventory
          onConfirm={handleChotKho}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default InventoryTable;
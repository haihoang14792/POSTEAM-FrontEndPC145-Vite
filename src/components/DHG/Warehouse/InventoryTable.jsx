// import React, { useState, useEffect } from "react";
// import {
//     fetchWarehouseDetails,
//     updateWarehouseDetails,
// } from '../../../services/dhgServices';
// import * as XLSX from 'xlsx';
// import { FaFileExcel } from 'react-icons/fa';
// import { Input, Button, Form } from "antd";
// import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
// import './InventoryTable.scss';
// import ConfirmCloseInventory from './ConfirmCloseInventory';

// const InventoryTable = () => {
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [showConfirmModal, setShowConfirmModal] = useState(false);
//     const [form] = Form.useForm();

//     const today = new Date();
//     const currentMonth = today.getMonth() + 1;
//     const currentYear = today.getFullYear();

//     const loadData = async () => {
//         try {
//             const warehouseResponse = await fetchWarehouseDetails();
//             setData(warehouseResponse.data);
//             setFilteredData(warehouseResponse.data);
//         } catch (error) {
//             console.error("Lỗi khi tải dữ liệu:", error);
//         }
//     };

//     useEffect(() => {
//         loadData();
//         const interval = setInterval(() => loadData(), 30000);
//         return () => clearInterval(interval);
//     }, [currentMonth, currentYear]);

//     // --- Tìm kiếm / lọc ---
//     const handleSearch = (values) => {
//         let results = [...data];
//         if (values.searchText) {
//             const keyword = values.searchText.toLowerCase();
//             results = results.filter((item) =>
//                 item.attributes.ProductName?.toLowerCase().includes(keyword) ||
//                 item.attributes.Model?.toLowerCase().includes(keyword)
//             );
//         }
//         setFilteredData(results);
//     };

//     const resetFilters = () => {
//         form.resetFields();
//         setFilteredData(data);
//     };

//     const exportToExcel = () => {
//         const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
//             "Tên Sản Phẩm": item.attributes.ProductName,
//             "Model": item.attributes.Model,
//             "ĐVT": item.attributes.DVT,
//             "Tồn Đầu Kỳ": item.attributes.inventoryDK,
//             "Nhập Trong Kỳ": item.attributes.totalNTK,
//             "Xuất Trong Kỳ": item.attributes.totalXTK,
//             "Tồn Cuối Kỳ": item.attributes.inventoryCK,
//             "Kho DHG": item.attributes.DHG,
//             "Kho POS": item.attributes.POS,
//             "Kho POSHN": item.attributes.POSHN
//         })));
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
//         XLSX.writeFile(workbook, `Inventory_${currentMonth}_${currentYear}.xlsx`);
//     };

//     const handleChotKho = async () => {
//         try {
//             const currentMonthKey = Number(currentYear * 100 + currentMonth);

//             const alreadyClosed = data.some(item =>
//                 Number(item.attributes.closedMonth) === currentMonthKey
//             );

//             if (alreadyClosed) {
//                 alert("⚠️ Một số dòng kho đã được chốt trong tháng này!");
//                 return;
//             }

//             setShowConfirmModal(false);

//             // Xuất Excel trước khi chốt
//             const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
//                 "Tên Sản Phẩm": item.attributes.ProductName,
//                 "Model": item.attributes.Model,
//                 "ĐVT": item.attributes.DVT,
//                 "Tồn Đầu Kỳ": item.attributes.inventoryDK,
//                 "Nhập Trong Kỳ": item.attributes.totalNTK,
//                 "Xuất Trong Kỳ": item.attributes.totalXTK,
//                 "Tồn Cuối Kỳ": item.attributes.inventoryCK,
//                 "Kho DHG": item.attributes.DHG,
//                 "Kho POS": item.attributes.POS,
//                 "Kho POSHN": item.attributes.POSHN
//             })));
//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Before");
//             XLSX.writeFile(workbook, `Inventory_Before_CK_${currentMonth}_${currentYear}.xlsx`);

//             for (const item of data) {
//                 await updateWarehouseDetails(item.id, {
//                     inventoryDK: item.attributes.inventoryCK,
//                     inventoryCK: item.attributes.inventoryCK,
//                     totalNTK: 0,
//                     totalXTK: 0,
//                     closedMonth: currentMonthKey,
//                 });
//             }

//             await loadData();

//             alert("✅ Đã chốt kho POS thành công!");
//         } catch (error) {
//             console.error("❌ Lỗi khi chốt kho POS:", error);
//             alert("Có lỗi khi chốt kho POS.");
//         }
//     };

//     return (
//         <>
//             <div className="inventory-table-container p-4">
//                 {/* Thanh công cụ */}
// <div className="mb-4 flex items-center flex-wrap" style={{ alignItems: "center", gap: "8px" }}>
//   {/* Form tìm kiếm */}
//   <Form
//     form={form}
//     layout="inline"
//     onFinish={handleSearch}
//     className="flex items-center"
//     style={{ marginBottom: 0 }}
//   >
//     <Form.Item name="searchText" className="mb-0">
//       <Input
//         placeholder="🔍 Tìm theo tên SP hoặc Model"
//         allowClear
//         style={{ width: 250, height: 32 }}
//       />
//     </Form.Item>
//     <Form.Item className="mb-0">
//       <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ height: 32 }}>
//         Tìm kiếm
//       </Button>
//     </Form.Item>
//     <Form.Item className="mb-0">
//       <Button onClick={resetFilters} icon={<ReloadOutlined />} style={{ height: 32 }}>
//         Reset
//       </Button>
//     </Form.Item>
//   </Form>

//   {/* Nhóm nút Excel + Chốt Kho POS */}
//   <div className="flex items-center" style={{ gap: "8px" }}>
//     <Button
//       type="primary"
//       icon={<FaFileExcel />}
//       style={{ backgroundColor: "#22c55e", border: "none", height: 32 }}
//       onClick={exportToExcel}
//     >
//       Xuất Excel
//     </Button>

//     <Button
//       type="primary"
//       style={{ backgroundColor: "#f97316", border: "none", height: 32 }}
//       onClick={() => setShowConfirmModal(true)}
//     >
//       Chốt Kho POS
//     </Button>
//   </div>
// </div>

//                 {/* Bảng tồn kho */}
//                 <table className="w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="border p-2">STT</th>
//                             <th className="border p-2">Tên Sản Phẩm</th>
//                             <th className="border p-2">Model</th>
//                             <th className="border p-2">ĐVT</th>
//                             <th className="border p-2">Tồn Đầu Kỳ</th>
//                             <th className="border p-2">Nhập Trong Kỳ</th>
//                             <th className="border p-2">Xuất Trong Kỳ</th>
//                             <th className="border p-2">Tồn Cuối Kỳ</th>
//                             <th className="border p-2">Kho DHG</th>
//                             <th className="border p-2">Kho POS</th>
//                             <th className="border p-2">Kho POSHN</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredData.map((item, index) => (
//                             <tr key={item.id} className="text-center border">
//                                 <td className="border p-2">{index + 1}</td>
//                                 <td className="border p-2">{item.attributes.ProductName}</td>
//                                 <td className="border p-2">{item.attributes.Model}</td>
//                                 <td className="border p-2">{item.attributes.DVT}</td>
//                                 <td className="border p-2">{item.attributes.inventoryDK}</td>
//                                 <td className="border p-2">{item.attributes.totalNTK}</td>
//                                 <td className="border p-2 font-bold text-orange-600">{item.attributes.totalXTK}</td>
//                                 <td className="border p-2 font-bold text-green-600">{item.attributes.inventoryCK}</td>
//                                 <td className="border p-2 font-bold text-blue-600">{item.attributes.DHG}</td>
//                                 <td className="border p-2 font-bold text-red-600">{item.attributes.POS}</td>
//                                 <td className="border p-2 font-bold text-purple-600">{item.attributes.POSHN}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//             {showConfirmModal && (
//                 <ConfirmCloseInventory
//                     onConfirm={handleChotKho}
//                     onCancel={() => setShowConfirmModal(false)}
//                 />
//             )}
//         </>
//     );
// };

// export default InventoryTable;

import React, { useState, useEffect } from "react";
import {
  fetchWarehouseDetails,
  updateWarehouseDetails,
} from "../../../services/dhgServices";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";
import { Input, Button, Form } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import "./InventoryTable.scss";
import ConfirmCloseInventory from "./ConfirmCloseInventory";

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const loadData = async () => {
    try {
      setLoading(true);
      const warehouseResponse = await fetchWarehouseDetails();
      setData(warehouseResponse.data);
      setFilteredData(warehouseResponse.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentMonth, currentYear]);

  // --- Tìm kiếm / lọc ---
  const handleSearch = (values) => {
    let results = [...data];
    if (values.searchText) {
      const keyword = values.searchText.toLowerCase();
      results = results.filter(
        (item) =>
          item.attributes.ProductName?.toLowerCase().includes(keyword) ||
          item.attributes.Model?.toLowerCase().includes(keyword)
      );
    }
    setFilteredData(results);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Tên Sản Phẩm": item.attributes.ProductName,
        Model: item.attributes.Model,
        ĐVT: item.attributes.DVT,
        "Tồn Đầu Kỳ": item.attributes.inventoryDK,
        "Nhập Trong Kỳ": item.attributes.totalNTK,
        "Xuất Trong Kỳ": item.attributes.totalXTK,
        "Tồn Cuối Kỳ": item.attributes.inventoryCK,
        "Kho DHG": item.attributes.DHG,
        "Kho POS": item.attributes.POS,
        "Kho POSHN": item.attributes.POSHN,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, `Inventory_${currentMonth}_${currentYear}.xlsx`);
  };

  const handleChotKho = async () => {
    try {
      const currentMonthKey = Number(currentYear * 100 + currentMonth);

      const alreadyClosed = data.some(
        (item) => Number(item.attributes.closedMonth) === currentMonthKey
      );

      if (alreadyClosed) {
        alert("⚠️ Một số dòng kho đã được chốt trong tháng này!");
        return;
      }

      setShowConfirmModal(false);

      // Xuất Excel trước khi chốt
      const worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          "Tên Sản Phẩm": item.attributes.ProductName,
          Model: item.attributes.Model,
          ĐVT: item.attributes.DVT,
          "Tồn Đầu Kỳ": item.attributes.inventoryDK,
          "Nhập Trong Kỳ": item.attributes.totalNTK,
          "Xuất Trong Kỳ": item.attributes.totalXTK,
          "Tồn Cuối Kỳ": item.attributes.inventoryCK,
          "Kho DHG": item.attributes.DHG,
          "Kho POS": item.attributes.POS,
          "Kho POSHN": item.attributes.POSHN,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Before");
      XLSX.writeFile(
        workbook,
        `Inventory_Before_CK_${currentMonth}_${currentYear}.xlsx`
      );

      for (const item of data) {
        await updateWarehouseDetails(item.id, {
          inventoryDK: item.attributes.inventoryCK,
          inventoryCK: item.attributes.inventoryCK,
          totalNTK: 0,
          totalXTK: 0,
          closedMonth: currentMonthKey,
        });
      }

      await loadData();

      alert("✅ Đã chốt kho POS thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi chốt kho POS:", error);
      alert("Có lỗi khi chốt kho POS.");
    }
  };

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <>
      <div className="inventory-table-container p-4">
        {/* Thanh công cụ */}
        <div
          className="mb-4 flex items-center flex-wrap"
          style={{ alignItems: "center", gap: "8px" }}
        >
          {/* Form tìm kiếm */}
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            className="flex items-center"
            style={{ marginBottom: 0 }}
          >
            <Form.Item name="searchText" className="mb-0">
              <Input
                placeholder="🔍 Tìm theo tên SP hoặc Model"
                allowClear
                style={{ width: 250, height: 32 }}
              />
            </Form.Item>
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                style={{ height: 32 }}
              >
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>

          {/* Nhóm nút Excel + Làm mới + Chốt Kho POS */}
          <div className="flex items-center" style={{ gap: "8px" }}>
            <Button
              type="default"
              icon={<SyncOutlined />}
              loading={loading}
              style={{ height: 32 }}
              onClick={loadData}
            >
              Load data
            </Button>
            {account.Warehouse === true && (
              <Button
                type="primary"
                style={{
                  backgroundColor: "#f97316",
                  border: "none",
                  height: 32,
                }}
                onClick={() => setShowConfirmModal(true)}
              >
                Chốt Kho POS
              </Button>
            )}
            {account.Warehouse === true && (
              <Button
                type="primary"
                icon={<FaFileExcel />}
                style={{
                  backgroundColor: "#22c55e",
                  border: "none",
                  height: 32,
                }}
                onClick={exportToExcel}
              >
                Xuất Excel
              </Button>
            )}
          </div>
        </div>

        {/* Bảng tồn kho */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">STT</th>
              <th className="border p-2">Tên Sản Phẩm</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">ĐVT</th>
              <th className="border p-2">Tồn Đầu Kỳ</th>
              <th className="border p-2">Nhập Trong Kỳ</th>
              <th className="border p-2">Xuất Trong Kỳ</th>
              <th className="border p-2">Tồn Cuối Kỳ</th>
              <th className="border p-2">Kho DHG</th>
              <th className="border p-2">Kho POS</th>
              <th className="border p-2">Kho POSHN</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} className="text-center border">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.attributes.ProductName}</td>
                <td className="border p-2">{item.attributes.Model}</td>
                <td className="border p-2">{item.attributes.DVT}</td>
                <td className="border p-2">{item.attributes.inventoryDK}</td>
                <td className="border p-2">{item.attributes.totalNTK}</td>
                <td className="border p-2 font-bold text-orange-600">
                  {item.attributes.totalXTK}
                </td>
                <td className="border p-2 font-bold text-green-600">
                  {item.attributes.inventoryCK}
                </td>
                <td className="border p-2 font-bold text-blue-600">
                  {item.attributes.DHG}
                </td>
                <td className="border p-2 font-bold text-red-600">
                  {item.attributes.POS}
                </td>
                <td className="border p-2 font-bold text-purple-600">
                  {item.attributes.POSHN}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showConfirmModal && (
        <ConfirmCloseInventory
          onConfirm={handleChotKho}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default InventoryTable;

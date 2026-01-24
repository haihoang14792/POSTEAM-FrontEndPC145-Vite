// import React, { useEffect, useState } from "react";
// import {
//   fetchExportlists,
//   updateExportlistsData,
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
// } from "../../../services/dhgServices";
// import * as XLSX from "xlsx";
// import {
//   Table,
//   Tag,
//   Button,
//   Input,
//   Modal,
//   Descriptions,
//   message,
//   Form,
//   Select,
//   Row,
//   Col,
//   Checkbox,
// } from "antd";
// import {
//   SearchOutlined,
//   PlusOutlined,
//   EditOutlined,
//   CheckOutlined,
//   FileExcelOutlined,
//   CheckCircleOutlined,
//   SyncOutlined,
//   ClockCircleOutlined,
//   FileDoneOutlined,
//   SafetyCertificateOutlined,
//   ContainerOutlined,
//   BookOutlined,
// } from "@ant-design/icons";
// import AddExportList from "./AddExportList";
// import AddExportListW from "./AddExportListW";
// import UpdateExportList from "./UpdateExportList";
// import "./ExportList.scss";

// const ExportList = () => {
//   const [exportlist, setExportList] = useState([]);
//   const [filteredList, setFilteredList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form] = Form.useForm();

//   const [detailModal, setDetailModal] = useState({
//     visible: false,
//     record: null,
//   });
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isAddModalOpenW, setIsAddModalOpenW] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [updatedData, setUpdatedData] = useState(null);

//   // Load danh sách xuất kho
//   useEffect(() => {
//     const loadExportList = async () => {
//       try {
//         const res = await fetchExportlists();
//         // Strapi v5: response có thể là mảng trực tiếp hoặc { data: [...] }
//         const data = Array.isArray(res) ? res : (res.data || []);

//         // Sửa: bỏ .attributes
//         const sortedData = data.sort(
//           (a, b) =>
//             new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setExportList(sortedData);
//         setFilteredList(sortedData);
//       } catch (error) {
//         console.error("Lỗi khi tải danh sách xuất kho:", error);
//         message.error("Không thể tải danh sách xuất kho");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadExportList();
//   }, []);

//   // Tìm kiếm / lọc
//   const handleSearch = (values) => {
//     let results = [...exportlist];

//     if (values.TypeKho) {
//       // Sửa: bỏ .attributes
//       results = results.filter(
//         (t) => t?.TypeKho === values.TypeKho
//       );
//     }
//     // if (values.BrandName) {
//     //   results = results.filter((t) => t?.BrandName === values.BrandName);
//     // }
//     if (values.Status) {
//       // Sửa: bỏ .attributes
//       results = results.filter((t) => t?.Status === values.Status);
//     }
//     if (values.NameExport) {
//       // Sửa: bỏ .attributes
//       results = results.filter(
//         (t) => t?.NameExport === values.NameExport
//       );
//     }
//     if (values.searchText) {
//       results = results.filter(
//         (t) =>
//           // Sửa: bỏ .attributes
//           t?.Model?.toLowerCase().includes(
//             values.searchText.toLowerCase()
//           ) ||
//           t?.ProductName?.toLowerCase().includes(
//             values.searchText.toLowerCase()
//           ) ||
//           t?.SerialNumber?.toLowerCase().includes(
//             values.searchText.toLowerCase()
//           ) ||
//           t?.SerialNumberLoan?.toLowerCase().includes(
//             values.searchText.toLowerCase()
//           ) ||
//           t?.SerialNumberDHG?.toLowerCase().includes(
//             values.searchText.toLowerCase()
//           )
//       );
//     }
//     if (values.searchTextTicket) {
//       results = results.filter(
//         (t) =>
//           // Sửa: bỏ .attributes
//           t?.Ticket?.toLowerCase().includes(
//             values.searchTextTicket.toLowerCase()
//           ) ||
//           t?.TicketDHG?.toLowerCase().includes(
//             values.searchTextTicket.toLowerCase()
//           )
//       );
//     }

//     setFilteredList(results);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setFilteredList(exportlist);
//   };

//   // Export Excel
//   const handleExportExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       filteredList.map((item) => ({
//         // Sửa: bỏ .attributes
//         "Tên sản phẩm": item.ProductName,
//         Model: item.Model,
//         ĐVT: item.DVT,
//         "Số lượng": item.totalexport,
//         Kho: item.TypeKho,
//         Ticket: item.Ticket,
//         "Serial mượn": item.SerialNumber,
//         "Số lượng xuất": item.totalexportLoan,
//         "Serial xuất": item.SerialNumberLoan,
//         "Trạng thái": item.Status,
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "ExportList");
//     XLSX.writeFile(wb, "ExportList.xlsx");
//   };

//   // Xác nhận hoàn thành phiếu
//   const handleConfirmComplete = async (record) => {
//     Modal.confirm({
//       title: "Xác nhận hoàn thành phiếu",
//       content: "Bạn có muốn xác nhận phiếu này đã hoàn thành không?",
//       okText: "Xác nhận",
//       cancelText: "Trở về",
//       onOk: async () => {
//         try {
//           await updateExportlistsData(record.id, {
//             Status: "Hoàn thành phiếu",
//           });
//           const updated = exportlist.map((item) =>
//             item.id === record.id
//               ? {
//                 ...item,
//                 // Sửa: bỏ .attributes, merge trực tiếp
//                 Status: "Hoàn thành phiếu",
//               }
//               : item
//           );
//           setExportList(updated);
//           setFilteredList(updated);
//           message.success("Cập nhật trạng thái thành công!");
//         } catch (error) {
//           console.error("Lỗi khi cập nhật trạng thái:", error);
//           message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
//         }
//       },
//     });
//   };

//   // Xác nhận duyệt phiếu
//   const handleConfirmApprove = async (record) => {
//     Modal.confirm({
//       title: "Xác nhận duyệt phiếu",
//       content:
//         "Bạn có muốn duyệt phiếu này và chuyển sang trạng thái 'Đang mượn' không?",
//       okText: "Duyệt phiếu",
//       cancelText: "Trở về",
//       onOk: async () => {
//         try {
//           await updateExportlistsData(record.id, { Status: "Đang mượn" });
//           const updated = exportlist.map((item) =>
//             item.id === record.id
//               ? {
//                 ...item,
//                 // Sửa: bỏ .attributes
//                 Status: "Đang mượn",
//               }
//               : item
//           );
//           setExportList(updated);
//           setFilteredList(updated);

//           // cập nhật lại record trong modal chi tiết
//           setDetailModal({
//             ...detailModal,
//             record: {
//               ...record,
//               // Sửa: bỏ .attributes
//               Status: "Đang mượn",
//             },
//           });

//           message.success("Phiếu đã được duyệt thành công!");
//         } catch (error) {
//           console.error("Lỗi khi duyệt phiếu:", error);
//           message.error("Có lỗi xảy ra khi duyệt phiếu!");
//         }
//       },
//     });
//   };

//   // Trả kho DHG trực tiếp trong ExportList
//   const handleReturnDHG = async (record) => {
//     // Sửa: bỏ .attributes
//     const Type = record.Type;
//     const totalExport = record.totalexport || 0;

//     if (totalExport === 0) {
//       message.warning("Không có sản phẩm nào để trả!");
//       return;
//     }

//     // --- Trường hợp Vật tư: nhập số lượng ---
//     if (Type === "Vật tư") {
//       let quantityToReturn = 0;

//       Modal.confirm({
//         title: "Trả kho Vật tư",
//         content: (
//           <Input
//             type="number"
//             min={1}
//             max={totalExport}
//             placeholder={`Nhập số lượng trả (tối đa ${totalExport})`}
//             onChange={(e) => {
//               quantityToReturn = Number(e.target.value);
//             }}
//           />
//         ),
//         okText: "Xác nhận",
//         cancelText: "Hủy",
//         onOk: async () => {
//           if (
//             !quantityToReturn ||
//             quantityToReturn <= 0 ||
//             quantityToReturn > totalExport
//           ) {
//             message.warning("Số lượng trả không hợp lệ!");
//             return;
//           }

//           try {
//             // Cập nhật kho
//             const warehouseList = await fetchWarehouseDetails();
//             // Sửa: xử lý response phẳng
//             const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);
//             const matched = warehouseData.find(
//               (w) => w.Model === record.Model
//             );
//             if (!matched)
//               return message.error("Không tìm thấy sản phẩm trong kho!");

//             // Sửa: bỏ .attributes, dùng trực tiếp matched
//             const attrs = matched;
//             const updatePayload = {
//               DHG: (attrs.DHG || 0) + quantityToReturn,
//               POS:
//                 record.TypeKho === "POS"
//                   ? (attrs.POS || 0) - quantityToReturn
//                   : attrs.POS,
//               POSHN:
//                 record.TypeKho === "POSHN"
//                   ? (attrs.POSHN || 0) - quantityToReturn
//                   : attrs.POSHN,
//             };
//             // Sửa: dùng id hoặc documentId
//             await updateWarehouseDetails(matched.id || matched.documentId, updatePayload);

//             // Cập nhật phiếu
//             await updateExportlistsData(record.id, {
//               totalexport: totalExport - quantityToReturn,
//               totalexportDHG:
//                 (record.totalexportDHG || 0) + quantityToReturn,
//             });

//             // Cập nhật state local
//             const updated = exportlist.map((item) =>
//               item.id === record.id
//                 ? {
//                   ...item,
//                   // Sửa: bỏ .attributes, merge trực tiếp
//                   totalexport: totalExport - quantityToReturn,
//                   totalexportDHG:
//                     (item.totalexportDHG || 0) +
//                     quantityToReturn,
//                 }
//                 : item
//             );
//             setExportList(updated);
//             setFilteredList(updated);

//             message.success("Trả kho Vật tư thành công!");
//           } catch (err) {
//             console.error(err);
//             message.error("Có lỗi xảy ra khi trả kho Vật tư!");
//           }
//         },
//       });
//       return; // dừng hàm tại đây để không chạy logic serial
//     }

//     // --- Trường hợp bình thường: chọn serial ---
//     // Sửa: bỏ .attributes
//     const serialBorrowedList = (record.SerialNumber || "")
//       .split(",")
//       .map((s) => s.trim())
//       .filter((s) => s !== "");

//     if (!serialBorrowedList.length) {
//       message.warning("Không có serial nào để trả!");
//       return;
//     }

//     let selectedReturnSerials = [];
//     Modal.confirm({
//       title: "Chọn serial trả kho DHG",
//       content: (
//         <div style={{ maxHeight: 300, overflowY: "auto" }}>
//           {serialBorrowedList.map((serial) => (
//             <div key={serial} style={{ marginBottom: 4 }}>
//               <Checkbox
//                 onChange={(e) => {
//                   if (e.target.checked) {
//                     selectedReturnSerials.push(serial);
//                   } else {
//                     selectedReturnSerials = selectedReturnSerials.filter(
//                       (s) => s !== serial
//                     );
//                   }
//                 }}
//               >
//                 {serial}
//               </Checkbox>
//             </div>
//           ))}
//         </div>
//       ),
//       okText: "Xác nhận",
//       cancelText: "Hủy",
//       onOk: async () => {
//         if (!selectedReturnSerials.length) {
//           message.warning("Vui lòng chọn serial để trả!");
//           return;
//         }

//         try {
//           // Cập nhật kho
//           const warehouseList = await fetchWarehouseDetails();
//           const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);
//           const matched = warehouseData.find(
//             (w) => w.Model === record.Model
//           );
//           if (!matched)
//             return message.error("Không tìm thấy sản phẩm trong kho!");

//           const attrs = matched;
//           const soLuongTra = selectedReturnSerials.length;

//           const updatePayload = {
//             DHG: (attrs.DHG || 0) + soLuongTra,
//             POS:
//               record.TypeKho === "POS"
//                 ? (attrs.POS || 0) - soLuongTra
//                 : attrs.POS,
//             POSHN:
//               record.TypeKho === "POSHN"
//                 ? (attrs.POSHN || 0) - soLuongTra
//                 : attrs.POSHN,
//           };
//           await updateWarehouseDetails(matched.id || matched.documentId, updatePayload);

//           // Cập nhật phiếu
//           const newSerialNumber = serialBorrowedList
//             .filter((s) => !selectedReturnSerials.includes(s))
//             .join(", ");
//           // Sửa: bỏ .attributes
//           const currentSerialDHG = record.SerialNumberDHG
//             ? record.SerialNumberDHG.split("\n").filter((s) => s)
//             : [];
//           const updatedSerialDHG = [
//             ...currentSerialDHG,
//             ...selectedReturnSerials,
//           ].join("\n");

//           await updateExportlistsData(record.id, {
//             totalexport: totalExport - soLuongTra,
//             totalexportDHG:
//               (record.totalexportDHG || 0) + soLuongTra,
//             SerialNumber: newSerialNumber,
//             SerialNumberDHG: updatedSerialDHG,
//           });

//           // Cập nhật state local
//           const updated = exportlist.map((item) =>
//             item.id === record.id
//               ? {
//                 ...item,
//                 // Sửa: bỏ .attributes, merge trực tiếp
//                 totalexport: totalExport - soLuongTra,
//                 totalexportDHG:
//                   (item.totalexportDHG || 0) + soLuongTra,
//                 SerialNumber: newSerialNumber,
//                 SerialNumberDHG: updatedSerialDHG,
//               }
//               : item
//           );
//           setExportList(updated);
//           setFilteredList(updated);
//           message.success("Trả kho DHG thành công!");
//         } catch (err) {
//           console.error(err);
//           message.error("Có lỗi xảy ra khi trả kho DHG!");
//         }
//       },
//     });
//   };

//   // Tạo mảng đếm theo Model
//   const statusIconMap = {
//     "Đang mượn": <ClockCircleOutlined style={{ color: "orange" }} />,
//     "Hoàn thành phiếu": <CheckCircleOutlined style={{ color: "green" }} />,
//   };

//   const statusCounts = Object.values(
//     filteredList.reduce((acc, item) => {
//       // Sửa: bỏ .attributes
//       const status = item?.Status || "Chưa xác định";
//       if (!acc[status]) {
//         acc[status] = {
//           label: status,
//           count: 0,
//           icon: statusIconMap[status] || null,
//         };
//       }
//       acc[status].count += 1;
//       return acc;
//     }, {})
//   );

//   // Mở modal cập nhật
//   const handleUpdate = (record) => {
//     setUpdatedData(record);
//     setIsUpdateModalOpen(true);
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
//       title: "Tên sản phẩm",
//       dataIndex: "ProductName", // Sửa: bỏ ["attributes", ...]
//       width: 220,
//     },
//     {
//       title: "Model",
//       dataIndex: "Model", // Sửa: bỏ ["attributes", ...]
//       width: 220,
//     },
//     {
//       title: "Người mượn",
//       dataIndex: "NameExport", // Sửa: bỏ ["attributes", ...]
//       width: 200,
//     },
//     {
//       title: "TicketDHG",
//       dataIndex: "TicketDHG", // Sửa: bỏ ["attributes", ...]
//       width: 150,
//     },
//     {
//       title: "SL mượn",
//       dataIndex: "totalexport", // Sửa: bỏ ["attributes", ...]
//       align: "center",
//       width: 100,
//     },
//     {
//       title: "SL xuất",
//       dataIndex: "totalexportLoan", // Sửa: bỏ ["attributes", ...]
//       align: "center",
//       width: 100,
//     },
//     {
//       title: "SL trả",
//       dataIndex: "totalexportDHG", // Sửa: bỏ ["attributes", ...]
//       align: "center",
//       width: 100,
//     },
//     {
//       title: "Kho",
//       dataIndex: "TypeKho", // Sửa: bỏ ["attributes", ...]
//       align: "center",
//       width: 100,
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "Status", // Sửa: bỏ ["attributes", ...]
//       align: "center",
//       render: (status) => (
//         <Tag color={status === "Hoàn thành phiếu" ? "green" : "orange"}>
//           {status}
//         </Tag>
//       ),
//     },
//   ];

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   return (
//     <div className="exportlist-container">
//       {/* <h1>Phiếu Mượn Kho DHG</h1> */}
//       {account?.Exportlist === true && (
//         <Button
//           type="primary"
//           onClick={() => setIsAddModalOpen(true)}
//           style={{ marginBottom: 16 }}
//         >
//           ➕ Tạo Phiếu Xuất
//         </Button>
//       )}
//       {account?.WritePOS === true && (
//         <Button
//           type="primary"
//           onClick={() => setIsAddModalOpenW(true)}
//           style={{ marginBottom: 16, marginLeft: 10 }}
//         >
//           ➕ Tạo Trả Kho / Bảo Hành
//         </Button>
//       )}
//       {/* Form lọc */}
//       <Form
//         form={form}
//         layout="inline"
//         onFinish={handleSearch}
//         style={{ marginBottom: 20, flexWrap: "wrap" }}
//       >
//         <Form.Item name="TypeKho">
//           <Select placeholder="-- Kho --" style={{ width: 160 }} allowClear>
//             {[...new Set(exportlist.map((i) => i.TypeKho))].map( // Sửa: bỏ .attributes
//               (kho) => (
//                 <Select.Option key={kho} value={kho}>
//                   {kho}
//                 </Select.Option>
//               )
//             )}
//           </Select>
//         </Form.Item>

//         <Form.Item name="Status">
//           <Select
//             placeholder="-- Trạng thái --"
//             style={{ width: 160 }}
//             allowClear
//           >
//             {[...new Set(exportlist.map((i) => i.Status))].map( // Sửa: bỏ .attributes
//               (status) => (
//                 <Select.Option key={status} value={status}>
//                   {status}
//                 </Select.Option>
//               )
//             )}
//           </Select>
//         </Form.Item>
//         <Form.Item name="NameExport">
//           <Select
//             placeholder="--Người mượn--"
//             style={{ width: 160 }}
//             allowClear
//           >
//             {[...new Set(exportlist.map((i) => i.NameExport))].map( // Sửa: bỏ .attributes
//               (namexport) => (
//                 <Select.Option key={namexport} value={namexport}>
//                   {namexport}
//                 </Select.Option>
//               )
//             )}
//           </Select>
//         </Form.Item>

//         <Form.Item name="searchText">
//           <Input placeholder="SP / Model / SN" style={{ width: 200 }} />
//         </Form.Item>
//         <Form.Item name="searchTextTicket">
//           <Input placeholder="Số phiếu / Ticket" style={{ width: 200 }} />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
//             Tìm kiếm
//           </Button>
//         </Form.Item>

//         <Form.Item>
//           <Button onClick={resetFilters}>🧹 Reset</Button>
//         </Form.Item>

//         <Form.Item>
//           <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
//             Xuất Excel
//           </Button>
//         </Form.Item>
//       </Form>

//       <Row
//         gutter={[12, 12]}
//         style={{ marginBottom: 20 }}
//         className="status-summary"
//       >
//         {statusCounts.map(({ label, count, icon }) => (
//           <Col key={label}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               {icon}
//               <span style={{ fontWeight: 500 }}>{label}:</span>
//               <span style={{ fontWeight: "bold" }}>{count}</span>
//             </div>
//           </Col>
//         ))}
//       </Row>

//       {/* Bảng */}
//       <Table
//         rowKey={(record) => record.id}
//         columns={columns}
//         dataSource={filteredList}
//         loading={loading}
//         pagination={{
//           ...pagination,
//           onChange: (page, pageSize) => {
//             setPagination({ current: page, pageSize });
//           },
//         }}
//         scroll={{ x: 1200 }} // 👈 Khóa chiều rộng bảng
//         //  tableLayout="fixed" // 👈 Giữ cố định layout
//         onRow={(record) => ({
//           onClick: () => setDetailModal({ visible: true, record }),
//         })}
//       />

//       {/* Modal chi tiết */}
//       <Modal
//         title="Chi tiết phiếu mượn kho"
//         open={detailModal.visible}
//         onCancel={() => setDetailModal({ visible: false, record: null })}
//         footer={null}
//         width={750}
//       >
//         {detailModal.record && (
//           <>
//             <Descriptions bordered column={2} size="small">
//               <Descriptions.Item label="Tên sản phẩm">
//                 {detailModal.record.ProductName} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Model">
//                 {detailModal.record.Model} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Thương hiệu">
//                 {detailModal.record.BrandName} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="ĐVT">
//                 {detailModal.record.DVT} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Kho">
//                 {detailModal.record.TypeKho} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số phiếu">
//                 {detailModal.record.Ticket} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="TicketDHG">
//                 {detailModal.record.TicketDHG} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số lượng mượn">
//                 {detailModal.record.totalexport} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số lượng xuất">
//                 {detailModal.record.totalexportLoan} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số trả DHG" span={2}>
//                 {detailModal.record.totalexportDHG} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Serial mượn" span={2}>
//                 <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
//                   {detailModal.record.SerialNumber} {/* Sửa: bỏ .attributes */}
//                 </div>
//               </Descriptions.Item>
//               <Descriptions.Item label="Serial xuất" span={2}>
//                 <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
//                   {detailModal.record.SerialNumberLoan} {/* Sửa: bỏ .attributes */}
//                 </div>
//               </Descriptions.Item>
//               <Descriptions.Item label="Serial trả DHG" span={2}>
//                 <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
//                   {detailModal.record.SerialNumberDHG} {/* Sửa: bỏ .attributes */}
//                 </div>
//               </Descriptions.Item>
//               <Descriptions.Item label="Người mượn hàng">
//                 {detailModal.record.NameExport} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Ngày mượn hàng">
//                 {new Date(
//                   detailModal.record.createdAt // Sửa: bỏ .attributes
//                 ).toLocaleDateString("vi-VN")}
//               </Descriptions.Item>
//               <Descriptions.Item label="Ghi chú" span={2}>
//                 {detailModal.record.Note} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Người tạo phiếu">
//                 {detailModal.record.NameCreate} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//               <Descriptions.Item label="Trạng thái">
//                 <Tag
//                   color={
//                     detailModal.record.Status === "Hoàn thành phiếu" // Sửa: bỏ .attributes
//                       ? "green"
//                       : "orange"
//                   }
//                 >
//                   {detailModal.record.Status} {/* Sửa: bỏ .attributes */}
//                 </Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label="Thông tin">
//                 {detailModal.record.TypeDevice} {/* Sửa: bỏ .attributes */}
//               </Descriptions.Item>
//             </Descriptions>

//             <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
//               {account?.Exportlist === true && (
//                 <Button
//                   type="primary"
//                   icon={<EditOutlined />}
//                   onClick={() => handleUpdate(detailModal.record)}
//                 >
//                   Cập nhật sản phẩm
//                 </Button>
//               )}
//               {detailModal.record.Status === "Chờ duyệt" &&
//                 detailModal.record.TypeDevice && // Sửa: bỏ .attributes
//                 (account?.Leader === true || account?.Exportlist === true) && (
//                   <Button
//                     type="primary"
//                     icon={<CheckCircleOutlined />}
//                     onClick={() => handleConfirmApprove(detailModal.record)}
//                   >
//                     Duyệt phiếu
//                   </Button>
//                 )}
//               {detailModal.record.totalexport !== 0 && // Sửa: bỏ .attributes
//                 detailModal.record.Status === "Đang mượn" && // Sửa: bỏ .attributes
//                 account?.Exportlist === true && (
//                   <Button
//                     type="default"
//                     onClick={() => handleReturnDHG(detailModal.record)}
//                   >
//                     Trả kho DHG
//                   </Button>
//                 )}
//               {detailModal.record.totalexport === 0 && // Sửa: bỏ .attributes
//                 detailModal.record.Status === "Đang mượn" && // Sửa: bỏ .attributes
//                 account?.Exportlist === true && (
//                   <Button
//                     type="primary"
//                     danger
//                     icon={<CheckOutlined />}
//                     onClick={() => handleConfirmComplete(detailModal.record)}
//                   >
//                     Xác nhận hoàn thành
//                   </Button>
//                 )}
//             </div>
//           </>
//         )}
//       </Modal>

//       {/* Modal thêm */}
//       <AddExportList
//         isModalOpen={isAddModalOpen}
//         onCancel={() => setIsAddModalOpen(false)}
//         onCreated={(newExportListData) => {
//           setExportList((prev) => [newExportListData, ...prev]);
//           setFilteredList((prev) => [newExportListData, ...prev]);
//           setIsAddModalOpen(false);
//         }}
//       />

//       <AddExportListW
//         isModalOpen={isAddModalOpenW}
//         onCancel={() => setIsAddModalOpenW(false)}
//         onCreated={(newExportListData) => {
//           setExportList((prev) => [newExportListData, ...prev]);
//           setFilteredList((prev) => [newExportListData, ...prev]);
//           setIsAddModalOpenW(false);
//         }}
//       />

//       {/* Modal cập nhật */}
//       <UpdateExportList
//         isModalOpen={isUpdateModalOpen}
//         onCancel={() => setIsUpdateModalOpen(false)}
//         updatedData={updatedData}
//         onUpdated={(updatedExport) => {
//           const updated = exportlist.map((item) =>
//             item.id === updatedExport.id ? updatedExport : item
//           );
//           setExportList(updated);
//           setFilteredList(updated);

//           // 🔥 Cập nhật lại record trong modal chi tiết nếu đang mở
//           if (
//             detailModal.visible &&
//             detailModal.record?.id === updatedExport.id
//           ) {
//             setDetailModal({
//               ...detailModal,
//               record: updatedExport,
//             });
//           }

//           setIsUpdateModalOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default ExportList;



// import React, { useEffect, useState } from "react";
// import {
//   fetchExportlists,
//   updateExportlistsData,
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
// } from "../../../services/dhgServices";
// import * as XLSX from "xlsx";
// import {
//   Table,
//   Tag,
//   Button,
//   Input,
//   Modal,
//   Descriptions,
//   message,
//   Form,
//   Select,
//   Checkbox,
//   Card,
//   Statistic,
//   Space,
//   Tooltip,
//   Divider,
//   Typography, // <--- Thêm Typography
//   Row,
//   Col
// } from "antd";
// import {
//   SearchOutlined,
//   PlusOutlined,
//   EditOutlined,
//   CheckOutlined,
//   FileExcelOutlined,
//   CheckCircleOutlined,
//   SyncOutlined,
//   ClockCircleOutlined,
//   FileDoneOutlined,
//   CodeSandboxOutlined,
//   UserOutlined,
//   ReloadOutlined,
//   EyeOutlined,
//   RollbackOutlined,
//   BarcodeOutlined
// } from "@ant-design/icons";
// import AddExportList from "./AddExportList";
// import AddExportListW from "./AddExportListW";
// import UpdateExportList from "./UpdateExportList";
// import "./ExportList.scss";

// const { Option } = Select;
// const { Title, Text } = Typography; // <--- Destructuring Title, Text

// const ExportList = () => {
//   // ... (Giữ nguyên toàn bộ logic state, useEffect, handle functions cũ của bạn ở đây) ...
//   const [exportlist, setExportList] = useState([]);
//   const [filteredList, setFilteredList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form] = Form.useForm();
//   // ... các state modal ...
//   const [detailModal, setDetailModal] = useState({ visible: false, record: null });
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isAddModalOpenW, setIsAddModalOpenW] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [updatedData, setUpdatedData] = useState(null);
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   // Logic load dữ liệu cũ...
//   const loadExportList = async () => {
//     setLoading(true);
//     try {
//       const res = await fetchExportlists();
//       const data = Array.isArray(res) ? res : res.data || [];
//       const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       setExportList(sortedData);
//       setFilteredList(sortedData);
//     } catch (error) {
//       message.error("Không thể tải danh sách xuất kho");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadExportList(); }, []);

//   // ... Các hàm handleSearch, handleConfirm, columns giữ nguyên ...
//   // Để code ngắn gọn, tôi giả định bạn giữ nguyên logic xử lý ở trên

//   // --- THỐNG KÊ ---
//   const stats = {
//     total: filteredList.length,
//     borrowing: filteredList.filter((i) => i.Status === "Đang mượn").length,
//     completed: filteredList.filter((i) => i.Status === "Hoàn thành phiếu").length,
//     pending: filteredList.filter((i) => i.Status === "Chờ duyệt").length,
//   };

//   // Định nghĩa các cột (Columns) - Giữ nguyên như phiên bản trước
//   const columns = [
//     {
//       title: "STT",
//       key: "stt",
//       align: "center",
//       width: 60,
//       render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
//     },
//     {
//       title: "Thông tin Sản Phẩm",
//       key: "productInfo",
//       width: 250,
//       render: (_, record) => (
//         <div className="product-cell">
//           <div className="product-name">{record.ProductName}</div>
//           <div className="product-model">
//             <Tag color="cyan">{record.BrandName || "N/A"}</Tag>
//             <span>{record.Model}</span>
//           </div>
//         </div>
//       )
//     },
//     {
//       title: "Người mượn",
//       dataIndex: "NameExport",
//       width: 150,
//       render: (text) => <span style={{ fontWeight: 500 }}><UserOutlined /> {text}</span>
//     },
//     {
//       title: "Ticket",
//       key: "ticket",
//       width: 140,
//       render: (_, record) => (
//         <div className="ticket-cell">
//           {record.Ticket && <div><Tag color="blue">{record.Ticket}</Tag></div>}
//           {record.TicketDHG && <div style={{ marginTop: 4 }}><Tag color="purple">{record.TicketDHG}</Tag></div>}
//         </div>
//       )
//     },
//     {
//       title: "Số lượng",
//       children: [
//         { title: "Mượn", dataIndex: "totalexport", key: "totalexport", align: "center", width: 70, render: val => <b style={{ color: '#1890ff' }}>{val}</b> },
//         { title: "Xuất", dataIndex: "totalexportLoan", key: "totalexportLoan", align: "center", width: 70 },
//         { title: "Đã trả", dataIndex: "totalexportDHG", key: "totalexportDHG", align: "center", width: 70, render: val => <span style={{ color: '#52c41a' }}>{val}</span> },
//       ]
//     },
//     {
//       title: "Kho",
//       dataIndex: "TypeKho",
//       align: "center",
//       width: 80,
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "Status",
//       align: "center",
//       width: 140,
//       render: (status) => {
//         let color = "default";
//         let icon = null;
//         if (status === "Hoàn thành phiếu") { color = "success"; icon = <CheckCircleOutlined />; }
//         else if (status === "Đang mượn") { color = "processing"; icon = <ClockCircleOutlined />; }
//         else if (status === "Chờ duyệt") { color = "warning"; icon = <SyncOutlined spin />; }

//         return <Tag icon={icon} color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "",
//       key: "action",
//       width: 50,
//       align: 'center',
//       render: (_, record) => (
//         <Tooltip title="Xem chi tiết">
//           <Button type="text" icon={<EyeOutlined />} onClick={() => setDetailModal({ visible: true, record })} />
//         </Tooltip>
//       )
//     }
//   ];

//   // Logic filter handleSearch giữ nguyên...
//   const handleSearch = (values) => {
//     let results = [...exportlist];
//     if (values.TypeKho) results = results.filter((t) => t?.TypeKho === values.TypeKho);
//     if (values.Status) results = results.filter((t) => t?.Status === values.Status);
//     if (values.NameExport) results = results.filter((t) => t?.NameExport === values.NameExport);
//     if (values.searchText) {
//       const text = values.searchText.toLowerCase();
//       results = results.filter(t =>
//         t?.Model?.toLowerCase().includes(text) ||
//         t?.ProductName?.toLowerCase().includes(text) ||
//         t?.SerialNumber?.toLowerCase().includes(text)
//       );
//     }
//     if (values.searchTextTicket) {
//       const text = values.searchTextTicket.toLowerCase();
//       results = results.filter(t => t?.Ticket?.toLowerCase().includes(text) || t?.TicketDHG?.toLowerCase().includes(text));
//     }
//     setFilteredList(results);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setFilteredList(exportlist);
//   };

//   const handleExportExcel = () => {
//     // Logic export excel giữ nguyên
//     const ws = XLSX.utils.json_to_sheet(filteredList.map((item) => ({ ...item }))); // (Simplified for brevity)
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "ExportList");
//     XLSX.writeFile(wb, "ExportList.xlsx");
//   };

//   return (
//     <div className="export-list-page">

//       {/* --- NEW COMPACT HEADER CARD --- */}
//       <Card bordered={false} className="header-card shadow-sm">
//         <Row justify="space-between" align="middle" gutter={[16, 16]}>
//           <Col xs={24} md={8}>
//             <div className="header-title-box">
//               <Title level={4} style={{ margin: 0, color: '#001529' }}>Quản Lý Phiếu Xuất</Title>
//               <Text type="secondary" style={{ fontSize: '13px' }}>Theo dõi bàn giao, thu hồi và bảo hành</Text>
//             </div>
//           </Col>

//           <Col xs={24} md={16}>
//             <div className="header-stats-actions">
//               <Space size="large" split={<Divider type="vertical" style={{ height: 32 }} />}>
//                 {/* Các chỉ số thống kê */}
//                 <Statistic
//                   title="Chờ duyệt"
//                   value={stats.pending}
//                   valueStyle={{ color: '#faad14', fontSize: '16px', fontWeight: 600 }}
//                   prefix={<SyncOutlined spin />}
//                 />
//                 <Statistic
//                   title="Đang mượn"
//                   value={stats.borrowing}
//                   valueStyle={{ color: '#1890ff', fontSize: '16px', fontWeight: 600 }}
//                   prefix={<ClockCircleOutlined />}
//                 />
//                 <Statistic
//                   title="Hoàn thành"
//                   value={stats.completed}
//                   valueStyle={{ color: '#52c41a', fontSize: '16px', fontWeight: 600 }}
//                   prefix={<CheckCircleOutlined />}
//                 />
//                 <Statistic
//                   title="Tổng phiếu"
//                   value={stats.total}
//                   valueStyle={{ fontSize: '18px', fontWeight: 'bold' }}
//                 />
//               </Space>

//               {/* Các nút chức năng đưa vào đây luôn hoặc tách ra tùy ý.
//                     Ở đây tôi để các nút Action cạnh thống kê cho gọn */}
//               <Space size="small" className="action-buttons-group">
//                 {account?.Exportlist === true && (
//                   <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
//                     Tạo Phiếu
//                   </Button>
//                 )}
//                 {account?.WritePOS === true && (
//                   <Button className="btn-warranty" icon={<CodeSandboxOutlined />} onClick={() => setIsAddModalOpenW(true)}>
//                     Bảo Hành
//                   </Button>
//                 )}
//               </Space>
//             </div>
//           </Col>
//         </Row>
//       </Card>

//       {/* --- MAIN CONTENT (FILTER & TABLE) --- */}
//       <Card bordered={false} className="main-content-card shadow-sm">
//         {/* Filter Form */}
//         <Form form={form} layout="inline" onFinish={handleSearch} className="filter-form">
//           <Form.Item name="TypeKho">
//             <Select placeholder="Kho" style={{ width: 100 }} allowClear>
//               {[...new Set(exportlist.map((i) => i.TypeKho))].map(k => <Option key={k} value={k}>{k}</Option>)}
//             </Select>
//           </Form.Item>
//           <Form.Item name="Status">
//             <Select placeholder="Trạng thái" style={{ width: 140 }} allowClear>
//               {[...new Set(exportlist.map((i) => i.Status))].map(s => <Option key={s} value={s}>{s}</Option>)}
//             </Select>
//           </Form.Item>
//           <Form.Item name="NameExport">
//             <Select placeholder="Người mượn" style={{ width: 140 }} allowClear showSearch>
//               {[...new Set(exportlist.map((i) => i.NameExport))].map(n => <Option key={n} value={n}>{n}</Option>)}
//             </Select>
//           </Form.Item>
//           <Form.Item name="searchText">
//             <Input prefix={<SearchOutlined />} placeholder="Tên SP / Model / Serial" style={{ width: 180 }} />
//           </Form.Item>
//           <Form.Item name="searchTextTicket">
//             <Input prefix={<BarcodeOutlined />} placeholder="Ticket / Số phiếu" style={{ width: 140 }} />
//           </Form.Item>

//           <div className="filter-actions-right">
//             <Space>
//               <Button type="primary" ghost htmlType="submit" icon={<SearchOutlined />}>Tìm</Button>
//               <Tooltip title="Reset bộ lọc">
//                 <Button icon={<ReloadOutlined />} onClick={resetFilters} />
//               </Tooltip>
//               <Tooltip title="Xuất Excel">
//                 <Button icon={<FileExcelOutlined />} onClick={handleExportExcel} className="btn-excel" />
//               </Tooltip>
//             </Space>
//           </div>
//         </Form>

//         {/* Table */}
//         <Table
//           rowKey="id"
//           columns={columns}
//           dataSource={filteredList}
//           loading={loading}
//           pagination={{
//             ...pagination,
//             showTotal: (total) => `Tổng ${total} phiếu`,
//             onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
//           }}
//           scroll={{ x: 1200 }}
//           className="export-table"
//           onRow={(record) => ({
//             onDoubleClick: () => setDetailModal({ visible: true, record }),
//           })}
//           size="middle"
//         />
//       </Card>

//       {/* --- MODALS (Detail, Add, Update...) --- */}
//       {/* Giữ nguyên code Modal của bạn ở phần này, chỉ cần thay đổi giao diện DetailModal nếu muốn đẹp hơn như tôi đã gợi ý ở response trước */}

//       <Modal
//         title={<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><FileDoneOutlined /> Chi tiết phiếu xuất</div>}
//         open={detailModal.visible}
//         onCancel={() => setDetailModal({ visible: false, record: null })}
//         footer={null}
//         width={800}
//       >
//         {/* Nội dung modal chi tiết giữ nguyên hoặc dùng lại thiết kế ở response trước */}
//         {detailModal.record && (
//           <div>
//             <Descriptions bordered column={2} size="small">
//               {/* ... Các field description ... */}
//               <Descriptions.Item label="Tên sản phẩm">{detailModal.record.ProductName}</Descriptions.Item>
//               <Descriptions.Item label="Model">{detailModal.record.Model}</Descriptions.Item>
//               <Descriptions.Item label="Trạng thái">
//                 <Tag color={detailModal.record.Status === 'Hoàn thành phiếu' ? 'green' : 'orange'}>
//                   {detailModal.record.Status}
//                 </Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label="Serial Mượn" span={2}>
//                 <div style={{ background: '#f5f5f5', padding: 5, borderRadius: 4, fontFamily: 'monospace' }}>
//                   {detailModal.record.SerialNumber}
//                 </div>
//               </Descriptions.Item>
//               {/* ... Thêm các field khác tùy ý ... */}
//             </Descriptions>

//             {/* Nút bấm footer modal */}
//             <div style={{ marginTop: 20, display: "flex", justifyContent: 'flex-end', gap: 8 }}>
//               {/* ... Logic nút bấm duyệt/trả/hoàn thành giữ nguyên ... */}
//               <Button onClick={() => setDetailModal({ visible: false, record: null })}>Đóng</Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       <AddExportList
//         isModalOpen={isAddModalOpen}
//         onCancel={() => setIsAddModalOpen(false)}
//         onCreated={(newData) => {
//           setExportList(prev => [newData, ...prev]);
//           setFilteredList(prev => [newData, ...prev]);
//           setIsAddModalOpen(false);
//         }}
//       />
//       <AddExportListW
//         isModalOpen={isAddModalOpenW}
//         onCancel={() => setIsAddModalOpenW(false)}
//         onCreated={(newData) => {
//           setExportList(prev => [newData, ...prev]);
//           setFilteredList(prev => [newData, ...prev]);
//           setIsAddModalOpenW(false);
//         }}
//       />
//       <UpdateExportList
//         isModalOpen={isUpdateModalOpen}
//         onCancel={() => setIsUpdateModalOpen(false)}
//         updatedData={updatedData}
//         onUpdated={(updatedExport) => {
//           const updated = exportlist.map(item => item.id === updatedExport.id ? updatedExport : item);
//           setExportList(updated);
//           setFilteredList(updated);
//           setIsUpdateModalOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default ExportList;




import React, { useEffect, useState } from "react";
import {
  fetchExportlists,
  updateExportlistsData,
  fetchWarehouseDetails,
  updateWarehouseDetails,
} from "../../../services/dhgServices";
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
  Checkbox,
  Card,
  Statistic,
  Space,
  Tooltip,
  Divider,
  Typography,
  Row,
  Col
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  CodeSandboxOutlined,
  UserOutlined,
  ReloadOutlined,
  EyeOutlined,
  BarcodeOutlined
} from "@ant-design/icons";
import AddExportList from "./AddExportList";
import AddExportListW from "./AddExportListW";
import UpdateExportList from "./UpdateExportList";
import "./ExportList.scss";

const { Option } = Select;
const { Title, Text } = Typography;

const ExportList = () => {
  const [exportlist, setExportList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const [detailModal, setDetailModal] = useState({
    visible: false,
    record: null,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddModalOpenW, setIsAddModalOpenW] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);

  // Load danh sách xuất kho
  const loadExportList = async () => {
    setLoading(true);
    try {
      const res = await fetchExportlists();
      const data = Array.isArray(res) ? res : (res.data || []);
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setExportList(sortedData);
      setFilteredList(sortedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách xuất kho:", error);
      message.error("Không thể tải danh sách xuất kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExportList();
  }, []);

  // Tìm kiếm / lọc
  const handleSearch = (values) => {
    let results = [...exportlist];

    if (values.TypeKho) {
      results = results.filter((t) => t?.TypeKho === values.TypeKho);
    }
    if (values.Status) {
      results = results.filter((t) => t?.Status === values.Status);
    }
    if (values.NameExport) {
      results = results.filter((t) => t?.NameExport === values.NameExport);
    }
    if (values.searchText) {
      const text = values.searchText.toLowerCase();
      results = results.filter(
        (t) =>
          t?.Model?.toLowerCase().includes(text) ||
          t?.ProductName?.toLowerCase().includes(text) ||
          t?.SerialNumber?.toLowerCase().includes(text) ||
          t?.SerialNumberLoan?.toLowerCase().includes(text) ||
          t?.SerialNumberDHG?.toLowerCase().includes(text)
      );
    }
    if (values.searchTextTicket) {
      const text = values.searchTextTicket.toLowerCase();
      results = results.filter(
        (t) =>
          t?.Ticket?.toLowerCase().includes(text) ||
          t?.TicketDHG?.toLowerCase().includes(text)
      );
    }

    setFilteredList(results);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredList(exportlist);
  };

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredList.map((item) => ({
        "Tên sản phẩm": item.ProductName,
        Model: item.Model,
        ĐVT: item.DVT,
        "Số lượng": item.totalexport,
        Kho: item.TypeKho,
        Ticket: item.Ticket,
        "Serial mượn": item.SerialNumber,
        "Số lượng xuất": item.totalexportLoan,
        "Serial xuất": item.SerialNumberLoan,
        "Trạng thái": item.Status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExportList");
    XLSX.writeFile(wb, "ExportList.xlsx");
  };

  // --- Logic Xử lý (Complete, Approve, Return) giữ nguyên ---
  const handleConfirmComplete = async (record) => {
    Modal.confirm({
      title: "Xác nhận hoàn thành phiếu",
      content: "Bạn có muốn xác nhận phiếu này đã hoàn thành không?",
      okText: "Xác nhận",
      cancelText: "Trở về",
      onOk: async () => {
        try {
          await updateExportlistsData(record.id, {
            Status: "Hoàn thành phiếu",
          });
          const updated = exportlist.map((item) =>
            item.id === record.id ? { ...item, Status: "Hoàn thành phiếu" } : item
          );
          setExportList(updated);
          setFilteredList(updated);
          message.success("Cập nhật trạng thái thành công!");
        } catch (error) {
          message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
      },
    });
  };

  const handleConfirmApprove = async (record) => {
    Modal.confirm({
      title: "Xác nhận duyệt phiếu",
      content: "Duyệt phiếu và chuyển trạng thái sang 'Đang mượn'?",
      okText: "Duyệt phiếu",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await updateExportlistsData(record.id, { Status: "Đang mượn" });
          const updated = exportlist.map((item) =>
            item.id === record.id ? { ...item, Status: "Đang mượn" } : item
          );
          setExportList(updated);
          setFilteredList(updated);
          setDetailModal({ ...detailModal, record: { ...record, Status: "Đang mượn" } });
          message.success("Phiếu đã được duyệt thành công!");
        } catch (error) {
          message.error("Có lỗi xảy ra khi duyệt phiếu!");
        }
      },
    });
  };

  const handleReturnDHG = async (record) => {
    const Type = record.Type;
    const totalExport = record.totalexport || 0;

    if (totalExport === 0) return message.warning("Không có sản phẩm nào để trả!");

    if (Type === "Vật tư") {
      let quantityToReturn = 0;
      Modal.confirm({
        title: "Trả kho Vật tư",
        content: (
          <Input
            type="number"
            min={1}
            max={totalExport}
            placeholder={`Nhập số lượng trả (tối đa ${totalExport})`}
            onChange={(e) => { quantityToReturn = Number(e.target.value); }}
          />
        ),
        onOk: async () => {
          if (!quantityToReturn || quantityToReturn <= 0 || quantityToReturn > totalExport) {
            return message.warning("Số lượng trả không hợp lệ!");
          }
          try {
            const warehouseList = await fetchWarehouseDetails();
            const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);
            const matched = warehouseData.find((w) => w.Model === record.Model);
            if (!matched) return message.error("Không tìm thấy sản phẩm trong kho!");

            const updatePayload = {
              DHG: (matched.DHG || 0) + quantityToReturn,
              POS: record.TypeKho === "POS" ? (matched.POS || 0) - quantityToReturn : matched.POS,
              POSHN: record.TypeKho === "POSHN" ? (matched.POSHN || 0) - quantityToReturn : matched.POSHN,
            };
            await updateWarehouseDetails(matched.id || matched.documentId, updatePayload);
            await updateExportlistsData(record.id, {
              totalexport: totalExport - quantityToReturn,
              totalexportDHG: (record.totalexportDHG || 0) + quantityToReturn,
            });

            const updated = exportlist.map((item) =>
              item.id === record.id
                ? {
                  ...item,
                  totalexport: totalExport - quantityToReturn,
                  totalexportDHG: (item.totalexportDHG || 0) + quantityToReturn,
                }
                : item
            );
            setExportList(updated);
            setFilteredList(updated);
            message.success("Trả kho Vật tư thành công!");
          } catch (err) {
            message.error("Có lỗi xảy ra khi trả kho Vật tư!");
          }
        },
      });
      return;
    }

    // Trường hợp có Serial
    const serialBorrowedList = (record.SerialNumber || "").split(",").map((s) => s.trim()).filter((s) => s !== "");
    if (!serialBorrowedList.length) return message.warning("Không có serial nào để trả!");

    let selectedReturnSerials = [];
    Modal.confirm({
      title: "Chọn serial trả kho DHG",
      width: 500,
      content: (
        <div style={{ maxHeight: 300, overflowY: "auto", marginTop: 10, border: '1px solid #f0f0f0', padding: 10, borderRadius: 6 }}>
          {serialBorrowedList.map((serial) => (
            <div key={serial} style={{ marginBottom: 4 }}>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) selectedReturnSerials.push(serial);
                  else selectedReturnSerials = selectedReturnSerials.filter((s) => s !== serial);
                }}
              >
                {serial}
              </Checkbox>
            </div>
          ))}
        </div>
      ),
      onOk: async () => {
        if (!selectedReturnSerials.length) return message.warning("Vui lòng chọn serial để trả!");
        try {
          const warehouseList = await fetchWarehouseDetails();
          const warehouseData = Array.isArray(warehouseList) ? warehouseList : (warehouseList.data || []);
          const matched = warehouseData.find((w) => w.Model === record.Model);
          if (!matched) return message.error("Không tìm thấy sản phẩm trong kho!");

          const soLuongTra = selectedReturnSerials.length;
          const updatePayload = {
            DHG: (matched.DHG || 0) + soLuongTra,
            POS: record.TypeKho === "POS" ? (matched.POS || 0) - soLuongTra : matched.POS,
            POSHN: record.TypeKho === "POSHN" ? (matched.POSHN || 0) - soLuongTra : matched.POSHN,
          };
          await updateWarehouseDetails(matched.id || matched.documentId, updatePayload);

          const newSerialNumber = serialBorrowedList.filter((s) => !selectedReturnSerials.includes(s)).join(", ");
          const currentSerialDHG = record.SerialNumberDHG ? record.SerialNumberDHG.split("\n").filter((s) => s) : [];
          const updatedSerialDHG = [...currentSerialDHG, ...selectedReturnSerials].join("\n");

          await updateExportlistsData(record.id, {
            totalexport: totalExport - soLuongTra,
            totalexportDHG: (record.totalexportDHG || 0) + soLuongTra,
            SerialNumber: newSerialNumber,
            SerialNumberDHG: updatedSerialDHG,
          });

          const updated = exportlist.map((item) =>
            item.id === record.id
              ? {
                ...item,
                totalexport: totalExport - soLuongTra,
                totalexportDHG: (item.totalexportDHG || 0) + soLuongTra,
                SerialNumber: newSerialNumber,
                SerialNumberDHG: updatedSerialDHG,
              }
              : item
          );
          setExportList(updated);
          setFilteredList(updated);
          message.success("Trả kho DHG thành công!");
        } catch (err) {
          message.error("Có lỗi xảy ra khi trả kho DHG!");
        }
      },
    });
  };

  const handleUpdate = (record) => {
    setUpdatedData(record);
    setIsUpdateModalOpen(true);
  };

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // --- THỐNG KÊ DATA ---
  const stats = {
    total: filteredList.length,
    borrowing: filteredList.filter((i) => i.Status === "Đang mượn").length,
    completed: filteredList.filter((i) => i.Status === "Hoàn thành phiếu").length,
    pending: filteredList.filter((i) => i.Status === "Chờ duyệt").length,
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    {
      title: "STT",
      align: "center",
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Thông tin Sản Phẩm",
      key: "productInfo",
      width: 250,
      render: (_, record) => (
        <div className="product-cell">
          <div className="product-name">{record.ProductName}</div>
          <div className="product-model">
            <Tag color="cyan">{record.BrandName || "N/A"}</Tag>
            <span>{record.Model}</span>
          </div>
        </div>
      )
    },
    {
      title: "Người mượn",
      dataIndex: "NameExport",
      width: 150,
      render: (text) => <span style={{ fontWeight: 500 }}><UserOutlined /> {text}</span>
    },
    {
      title: "Ticket",
      key: "ticket",
      width: 140,
      render: (_, record) => (
        <div className="ticket-cell">
          {record.Ticket && <Tag color="blue">{record.Ticket}</Tag>}
          {record.TicketDHG && <Tag color="purple" style={{ marginTop: 4 }}>{record.TicketDHG}</Tag>}
        </div>
      )
    },
    {
      title: "Số lượng",
      children: [
        { title: "Mượn", dataIndex: "totalexport", key: "totalexport", align: "center", width: 70, render: val => <b style={{ color: '#1890ff' }}>{val}</b> },
        { title: "Xuất", dataIndex: "totalexportLoan", key: "totalexportLoan", align: "center", width: 70 },
        { title: "Đã trả", dataIndex: "totalexportDHG", key: "totalexportDHG", align: "center", width: 70, render: val => <span style={{ color: '#52c41a' }}>{val}</span> },
      ]
    },
    {
      title: "Kho",
      dataIndex: "TypeKho",
      align: "center",
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      align: "center",
      width: 140,
      render: (status) => {
        let color = "default";
        let icon = null;
        if (status === "Hoàn thành phiếu") { color = "success"; icon = <CheckCircleOutlined />; }
        else if (status === "Đang mượn") { color = "processing"; icon = <ClockCircleOutlined />; }
        else if (status === "Chờ duyệt") { color = "warning"; icon = <SyncOutlined spin />; }
        return <Tag icon={icon} color={color}>{status}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button type="text" icon={<EyeOutlined />} onClick={() => setDetailModal({ visible: true, record })} />
        </Tooltip>
      )
    }
  ];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <div className="export-list-page">

      {/* --- HEADER & STATS --- */}
      <Card bordered={false} className="header-card shadow-sm">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="header-title-box">
              <Title level={4} style={{ margin: 0, color: '#001529' }}>Quản Lý Phiếu Xuất</Title>
              <Text type="secondary" style={{ fontSize: '13px' }}>Theo dõi bàn giao, thu hồi và bảo hành</Text>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <div className="header-stats-actions">
              <Space size="large" split={<Divider type="vertical" style={{ height: 32 }} />}>
                <Statistic
                  title="Chờ duyệt"
                  value={stats.pending}
                  valueStyle={{ color: '#faad14', fontSize: '16px', fontWeight: 600 }}
                  prefix={<SyncOutlined spin />}
                />
                <Statistic
                  title="Đang mượn"
                  value={stats.borrowing}
                  valueStyle={{ color: '#1890ff', fontSize: '16px', fontWeight: 600 }}
                  prefix={<ClockCircleOutlined />}
                />
                <Statistic
                  title="Hoàn thành"
                  value={stats.completed}
                  valueStyle={{ color: '#52c41a', fontSize: '16px', fontWeight: 600 }}
                  prefix={<CheckCircleOutlined />}
                />
                <Statistic
                  title="Tổng phiếu"
                  value={stats.total}
                  valueStyle={{ fontSize: '18px', fontWeight: 'bold' }}
                />
              </Space>

              <Space size="small" className="action-buttons-group">
                {account?.Exportlist === true && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                    Tạo Phiếu
                  </Button>
                )}
                {account?.WritePOS === true && (
                  <Button className="btn-warranty" icon={<CodeSandboxOutlined />} onClick={() => setIsAddModalOpenW(true)}>
                    Bảo Hành
                  </Button>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* --- MAIN CONTENT --- */}
      <Card bordered={false} className="main-content-card shadow-sm">
        {/* Filter */}
        <Form form={form} layout="inline" onFinish={handleSearch} className="filter-form">
          <Form.Item name="TypeKho">
            <Select placeholder="Kho" style={{ width: 100 }} allowClear>
              {[...new Set(exportlist.map((i) => i.TypeKho))].map(k => <Option key={k} value={k}>{k}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="Status">
            <Select placeholder="Trạng thái" style={{ width: 140 }} allowClear>
              {[...new Set(exportlist.map((i) => i.Status))].map(s => <Option key={s} value={s}>{s}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="NameExport">
            <Select placeholder="Người mượn" style={{ width: 140 }} allowClear showSearch>
              {[...new Set(exportlist.map((i) => i.NameExport))].map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="searchText">
            <Input prefix={<SearchOutlined />} placeholder="Tên SP / Model / Serial" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="searchTextTicket">
            <Input prefix={<BarcodeOutlined />} placeholder="Ticket / Số phiếu" style={{ width: 140 }} />
          </Form.Item>

          <div className="filter-actions-right">
            <Space>
              <Button type="primary" ghost htmlType="submit" icon={<SearchOutlined />}>Tìm</Button>
              <Tooltip title="Reset bộ lọc"><Button icon={<ReloadOutlined />} onClick={resetFilters} /></Tooltip>
              <Tooltip title="Xuất Excel"><Button icon={<FileExcelOutlined />} onClick={handleExportExcel} className="btn-excel" /></Tooltip>
            </Space>
          </div>
        </Form>

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredList}
          loading={loading}
          pagination={{
            ...pagination,
            showTotal: (total) => `Tổng ${total} phiếu`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
          scroll={{ x: 1200 }}
          className="export-table"
          onRow={(record) => ({
            onDoubleClick: () => setDetailModal({ visible: true, record }),
          })}
          size="middle"
        />
      </Card>

      {/* --- MODALS --- */}
      <Modal
        title={<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><FileDoneOutlined /> Chi tiết phiếu xuất</div>}
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={null}
        width={800}
      >
        {detailModal.record && (
          <div className="detail-modal-content">
            <Descriptions bordered column={2} size="small" labelStyle={{ width: '140px', fontWeight: 500 }}>
              <Descriptions.Item label="Tên sản phẩm" span={2}><b style={{ fontSize: 15 }}>{detailModal.record.ProductName}</b></Descriptions.Item>
              <Descriptions.Item label="Model">{detailModal.record.Model}</Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">{detailModal.record.BrandName}</Descriptions.Item>
              <Descriptions.Item label="ĐVT">{detailModal.record.DVT}</Descriptions.Item>
              <Descriptions.Item label="Kho">{detailModal.record.TypeKho}</Descriptions.Item>
              <Descriptions.Item label="Số phiếu"><Tag>{detailModal.record.Ticket}</Tag></Descriptions.Item>
              <Descriptions.Item label="TicketDHG"><Tag>{detailModal.record.TicketDHG}</Tag></Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag color={detailModal.record.Status === 'Hoàn thành phiếu' ? 'green' : 'orange'}>
                  {detailModal.record.Status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày mượn">{new Date(detailModal.record.createdAt).toLocaleDateString("vi-VN")}</Descriptions.Item>
              <Descriptions.Item label="Người mượn">{detailModal.record.NameExport}</Descriptions.Item>
              <Descriptions.Item label="Người tạo">{detailModal.record.NameCreate}</Descriptions.Item>

              <Descriptions.Item label="Số lượng Mượn" ><b style={{ color: '#1890ff' }}>{detailModal.record.totalexport}</b></Descriptions.Item>
              <Descriptions.Item label="Đã Trả DHG"><b style={{ color: '#52c41a' }}>{detailModal.record.totalexportDHG}</b></Descriptions.Item>

              <Descriptions.Item label="Serial Mượn" span={2}>
                <div className="serial-box">{detailModal.record.SerialNumber}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Serial Trả" span={2}>
                <div className="serial-box">{detailModal.record.SerialNumberDHG}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>{detailModal.record.Note}</Descriptions.Item>
            </Descriptions>

            <div className="modal-actions-footer">
              <Space>
                {account?.Exportlist === true && (
                  <Button icon={<EditOutlined />} onClick={() => handleUpdate(detailModal.record)}>
                    Cập nhật
                  </Button>
                )}
                {detailModal.record.Status === "Chờ duyệt" && detailModal.record.TypeDevice &&
                  (account?.Leader === true || account?.Exportlist === true) && (
                    <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleConfirmApprove(detailModal.record)}>
                      Duyệt phiếu
                    </Button>
                  )}
                {detailModal.record.totalexport !== 0 && detailModal.record.Status === "Đang mượn" && account?.Exportlist === true && (
                  <Button type="default" onClick={() => handleReturnDHG(detailModal.record)}>
                    Trả kho DHG
                  </Button>
                )}
                {detailModal.record.totalexport === 0 && detailModal.record.Status === "Đang mượn" && account?.Exportlist === true && (
                  <Button type="primary" danger icon={<CheckOutlined />} onClick={() => handleConfirmComplete(detailModal.record)}>
                    Xác nhận hoàn thành
                  </Button>
                )}
                <Button onClick={() => setDetailModal({ visible: false, record: null })}>Đóng</Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      <AddExportList
        isModalOpen={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onCreated={(newData) => {
          setExportList(prev => [newData, ...prev]);
          setFilteredList(prev => [newData, ...prev]);
          setIsAddModalOpen(false);
        }}
      />
      <AddExportListW
        isModalOpen={isAddModalOpenW}
        onCancel={() => setIsAddModalOpenW(false)}
        onCreated={(newData) => {
          setExportList(prev => [newData, ...prev]);
          setFilteredList(prev => [newData, ...prev]);
          setIsAddModalOpenW(false);
        }}
      />
      <UpdateExportList
        isModalOpen={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        updatedData={updatedData}
        onUpdated={(updatedExport) => {
          const updated = exportlist.map(item => item.id === updatedExport.id ? updatedExport : item);
          setExportList(updated);
          setFilteredList(updated);
          if (detailModal.visible && detailModal.record?.id === updatedExport.id) {
            setDetailModal({ ...detailModal, record: updatedExport });
          }
          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
};

export default ExportList;
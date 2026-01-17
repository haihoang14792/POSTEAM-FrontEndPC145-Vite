// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Input,
//   Modal,
//   Descriptions,
//   Row,
//   Col,
//   message,
//   Form,
//   Tag,
//   Upload,
//   Card,
//   Tooltip,
// } from "antd";
// import {
//   SearchOutlined,
//   UploadOutlined,
//   ReloadOutlined,
//   DownloadOutlined,
//   FilterOutlined,
//   BarcodeOutlined,
//   DesktopOutlined,
//   UserOutlined,
//   ShopOutlined,
//   QrcodeOutlined, // Icon cho Model
//   EyeOutlined,
// } from "@ant-design/icons";
// import * as XLSX from "xlsx";
// import {
//   fetchDeviceAll,
//   createDeviceAll,
//   updateDeviceBySTT,
//   fetchDevicesByPage,
// } from "../../../../services/storeServices";
// import "./DeviceList.scss";

// const DeviceList = () => {
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();

//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });

//   const [searchParams, setSearchParams] = useState({});

//   const [detailModal, setDetailModal] = useState({
//     visible: false,
//     record: null,
//   });

//   useEffect(() => {
//     loadDevices(pagination.current, pagination.pageSize, searchParams);
//   }, [pagination.current, pagination.pageSize, searchParams]);

//   const loadDevices = async (page, pageSize, filters) => {
//     try {
//       setLoading(true);
//       const res = await fetchDevicesByPage(page, pageSize, filters);
//       const data = Array.isArray(res) ? res : res?.data || [];
//       const total = res?.meta?.pagination?.total || 0;

//       setDevices(data);
//       setPagination((prev) => ({
//         ...prev,
//         current: page,
//         pageSize: pageSize,
//         total: total,
//       }));
//     } catch (err) {
//       console.error(err);
//       message.error("Không thể tải danh sách thiết bị");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (values) => {
//     setPagination((prev) => ({ ...prev, current: 1 }));
//     const cleanFilters = {};
//     Object.keys(values).forEach((key) => {
//       if (values[key]) {
//         cleanFilters[key] = values[key];
//       }
//     });
//     setSearchParams(cleanFilters);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setPagination((prev) => ({ ...prev, current: 1 }));
//     setSearchParams({});
//   };

//   const handleTableChange = (newPagination) => {
//     setPagination((prev) => ({
//       ...prev,
//       current: newPagination.current,
//       pageSize: newPagination.pageSize,
//     }));
//   };

//   // --- GIỮ NGUYÊN LOGIC IMPORT/UPDATE/EXPORT NHƯ CŨ ---
//   const handleImport = (file) => {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       if (jsonData.length === 0) {
//         message.warning("Tệp không có dữ liệu!");
//         return;
//       }

//       Modal.confirm({
//         title: `Xác nhận nhập ${jsonData.length} thiết bị?`,
//         content: "Quá trình này có thể mất vài phút nếu số lượng lớn.",
//         onOk: async () => {
//           try {
//             setLoading(true);
//             const batchSize = 50;
//             const total = jsonData.length;
//             for (let i = 0; i < total; i += batchSize) {
//               const batch = jsonData.slice(i, i + batchSize);
//               await Promise.all(batch.map((device) => createDeviceAll(device)));
//             }
//             message.success(`Import thành công ${total} thiết bị!`);
//             setPagination(prev => ({ ...prev, current: 1 }));
//             loadDevices(1, pagination.pageSize, searchParams);
//           } catch (err) {
//             console.error(err);
//             message.error("Có lỗi xảy ra trong quá trình import!");
//           } finally {
//             setLoading(false);
//           }
//         },
//       });
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleUpdate = (file) => {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       if (jsonData.length === 0) {
//         message.warning("Tệp không có dữ liệu!");
//         return;
//       }

//       Modal.confirm({
//         title: `Xác nhận cập nhật ${jsonData.length} thiết bị?`,
//         onOk: async () => {
//           try {
//             setLoading(true);
//             const deviceList = await fetchDeviceAll();
//             const flatDeviceList = Array.isArray(deviceList) ? deviceList : (deviceList.data || []);
//             const batchSize = 50;
//             for (let i = 0; i < jsonData.length; i += batchSize) {
//               const batch = jsonData.slice(i, i + batchSize);
//               await Promise.all(batch.map((device) => updateDeviceBySTT(device.STT, device, flatDeviceList)));
//             }
//             message.success("Cập nhật thành công!");
//             loadDevices(pagination.current, pagination.pageSize, searchParams);
//           } catch (err) {
//             console.error(err);
//             message.error("Lỗi khi cập nhật thiết bị!");
//           } finally {
//             setLoading(false);
//           }
//         },
//       });
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleExport = async () => {
//     try {
//       setLoading(true);
//       message.loading("Đang tải dữ liệu...", 0);
//       const res = await fetchDeviceAll();
//       const allData = Array.isArray(res) ? res : (res.data || []);

//       if (allData.length === 0) {
//         message.destroy();
//         message.warning("Không có dữ liệu để xuất!");
//         setLoading(false);
//         return;
//       }

//       const ws = XLSX.utils.json_to_sheet(
//         allData.map((device) => ({
//           STT: device.id,
//           Customer: device.Customer,
//           DeliveryDate: device.DeliveryDate,
//           DeviceName: device.DeviceName,
//           BrandName: device.BrandName,
//           Model: device.Model,
//           SerialNumber: device.SerialNumber,
//           Store: device.Store,
//           Location: device.Location,
//           Status: device.Status,
//           Note: device.Note || "",
//           CreatedAt: device.createdAt,
//           UpdatedAt: device.updatedAt,
//         }))
//       );
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Devices");
//       XLSX.writeFile(wb, "Device_List_Full.xlsx");
//       message.destroy();
//       message.success("Xuất Excel thành công!");
//     } catch (error) {
//       console.error(error);
//       message.destroy();
//       message.error("Lỗi khi xuất Excel");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // --------------------------------------------------------

//   const statusCounts = Object.values(
//     devices.reduce((acc, item) => {
//       const status = item.Status || "Chưa xác định";
//       if (!acc[status]) acc[status] = { label: status, count: 0 };
//       acc[status].count += 1;
//       return acc;
//     }, {})
//   );

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return isNaN(date.getTime())
//       ? ""
//       : `${date.getDate().toString().padStart(2, "0")}/${(
//         date.getMonth() + 1
//       ).toString().padStart(2, "0")}/${date.getFullYear()}`;
//   };

//   const columns = [
//     {
//       title: "STT",
//       key: "stt",
//       align: "center",
//       render: (_, __, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//       width: 80,
//       fixed: 'left', // Cố định cột STT
//     },
//     {
//       title: "Ngày giao",
//       dataIndex: "DeliveryDate",
//       key: "DeliveryDate",
//       render: formatDate,
//       width: 140,
//       sorter: (a, b) => new Date(a.DeliveryDate) - new Date(b.DeliveryDate),
//     },
//     {
//       title: "Tên thiết bị",
//       dataIndex: "DeviceName",
//       key: "DeviceName",
//       ellipsis: true,
//       render: (text) => <span style={{ fontWeight: 150, color: '#1890ff' }}>{text}</span>
//     },
//     {
//       title: "Model",
//       dataIndex: "Model",
//       key: "Model",
//       width: 250
//     },
//     {
//       title: "Serial Number",
//       dataIndex: "SerialNumber",
//       key: "SerialNumber",
//       width: 400,
//       render: text => <Tag color="default" style={{ fontFamily: 'monospace' }}>{text}</Tag>
//     },
//     {
//       title: "Khách hàng",
//       dataIndex: "Customer",
//       key: "Customer",
//       ellipsis: true
//     },
//     {
//       title: "Cửa hàng",
//       dataIndex: "Store",
//       key: "Store",
//       width: 140,
//       align: 'center',
//       render: text => <strong>{text}</strong>
//     },
//     {
//       title: "Vị trí",
//       dataIndex: "Location",
//       key: "Location",
//       ellipsis: true
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "Status",
//       key: "Status",
//       align: "center",
//       width: 140,
//       render: (status) => {
//         let color = "green";
//         if (status === "Không sử dụng") color = "gold";
//         else if (status === "Không có thiết bị") color = "volcano";
//         else if (status === "Hư hỏng") color = "red";

//         return <Tag color={color} style={{ minWidth: 80 }}>{status}</Tag>;
//       },
//     },
//     {
//       title: "Hành động",
//       key: "detail",
//       align: "center",
//       width: 80,
//       fixed: 'right',
//       render: (_, record) => (
//         <Tooltip title="Xem chi tiết">
//           <Button
//             type="text"
//             shape="circle"
//             icon={<EyeOutlined style={{ color: '#1890ff', fontSize: '18px' }} />}
//             onClick={() => setDetailModal({ visible: true, record })}
//           />
//         </Tooltip>
//       ),
//     },
//   ];

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   return (
//     <div className="device-list-container" style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>

//       {/* --- PHẦN BỘ LỌC TÌM KIẾM --- */}
//       <Card
//         bordered={false}
//         className="shadow-sm"
//         style={{ marginBottom: 20, borderRadius: '8px' }}
//         title={
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1890ff' }}>
//             <FilterOutlined />
//             <span style={{ fontWeight: 600 }}>BỘ LỌC TÌM KIẾM</span>
//           </div>
//         }
//       >
//         <Form form={form} layout="vertical" onFinish={handleSearch}>
//           <Row gutter={[24, 16]}>
//             {/* Hàng 1: Serial, Tên thiết bị, Model */}
//             <Col xs={24} sm={12} md={8} lg={8}>
//               <Form.Item name="SerialNumber" label="Serial Number" style={{ marginBottom: 0 }}>
//                 <Input
//                   prefix={<BarcodeOutlined style={{ color: '#bfbfbf' }} />}
//                   placeholder="Nhập S/N..."
//                   allowClear
//                 />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12} md={8} lg={8}>
//               <Form.Item name="DeviceName" label="Tên thiết bị" style={{ marginBottom: 0 }}>
//                 <Input
//                   prefix={<DesktopOutlined style={{ color: '#bfbfbf' }} />}
//                   placeholder="Nhập tên..."
//                   allowClear
//                 />
//               </Form.Item>
//             </Col>

//             {/* 👇 CỘT MODEL MỚI THÊM VÀO */}
//             <Col xs={24} sm={12} md={8} lg={8}>
//               <Form.Item name="Model" label="Model" style={{ marginBottom: 0 }}>
//                 <Input
//                   prefix={<QrcodeOutlined style={{ color: '#bfbfbf' }} />}
//                   placeholder="Nhập Model..."
//                   allowClear
//                 />
//               </Form.Item>
//             </Col>

//             {/* Hàng 2: Khách hàng, Cửa hàng */}
//             <Col xs={24} sm={12} md={8} lg={8}>
//               <Form.Item name="Customer" label="Khách hàng" style={{ marginBottom: 0 }}>
//                 <Input
//                   prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
//                   placeholder="Ví dụ: Family Mart..."
//                   allowClear
//                 />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12} md={8} lg={8}>
//               <Form.Item name="Store" label="Cửa hàng" style={{ marginBottom: 0 }}>
//                 <Input
//                   prefix={<ShopOutlined style={{ color: '#bfbfbf' }} />}
//                   placeholder="Mã hoặc tên cửa hàng..."
//                   allowClear
//                 />
//               </Form.Item>
//             </Col>

//             {/* Nút tìm kiếm nằm ở ô cuối cùng */}
//             <Col xs={24} sm={12} md={8} lg={8} style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 icon={<SearchOutlined />}
//                 style={{ flex: 1, backgroundColor: '#1890ff', borderColor: '#1890ff' }}
//                 loading={loading}
//               >
//                 Tìm kiếm
//               </Button>
//               <Button
//                 icon={<ReloadOutlined />}
//                 onClick={resetFilters}
//                 style={{ flex: 0.5 }}
//               >
//                 Reset
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Card>

//       {/* --- PHẦN THÔNG TIN & CÔNG CỤ --- */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
//         {/* Thống kê nhanh */}
//         <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//           {statusCounts.map(({ label, count }) => (
//             <Tag key={label} color="blue" style={{ fontSize: '13px', padding: '4px 10px', borderRadius: '4px' }}>
//               {label}: <strong>{count}</strong>
//             </Tag>
//           ))}
//         </div>

//         {/* Nút chức năng Import/Export */}
//         {account.Devicelist === true && (
//           <div style={{ display: 'flex', gap: '10px' }}>
//             <Upload
//               beforeUpload={() => false}
//               showUploadList={false}
//               onChange={({ file }) => handleImport(file)}
//             >
//               <Button icon={<UploadOutlined />} type="dashed">Import</Button>
//             </Upload>

//             <Upload
//               beforeUpload={() => false}
//               showUploadList={false}
//               onChange={({ file }) => handleUpdate(file)}
//             >
//               <Button type="default">Update</Button>
//             </Upload>

//             <Button
//               type="primary"
//               ghost
//               icon={<DownloadOutlined />}
//               onClick={handleExport}
//             >
//               Xuất Excel
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* --- BẢNG DỮ LIỆU --- */}
//       <Card bordered={false} className="shadow-sm" style={{ borderRadius: '8px' }} bodyStyle={{ padding: '12px' }}>
//         <Table
//           rowKey={(record) => record.id || record.documentId}
//           columns={columns}
//           dataSource={devices}
//           loading={loading}
//           size="middle"
//           pagination={{
//             current: pagination.current,
//             pageSize: pagination.pageSize,
//             total: pagination.total,
//             showSizeChanger: true,
//             pageSizeOptions: ['10', '20', '50', '100'],
//             showTotal: (total, range) => <span style={{ color: '#8c8c8c' }}>Hiển thị {range[0]}-{range[1]} của {total} thiết bị</span>,
//           }}
//           onChange={handleTableChange}
//           scroll={{ x: 1100 }} // Cho phép cuộn ngang trên mobile
//         />
//       </Card>

//       <Modal
//         title={<span style={{ color: '#1890ff', fontSize: 18 }}><DesktopOutlined /> Chi tiết thiết bị</span>}
//         open={detailModal.visible}
//         onCancel={() => setDetailModal({ visible: false, record: null })}
//         footer={[
//           <Button key="close" onClick={() => setDetailModal({ visible: false, record: null })}>
//             Đóng
//           </Button>
//         ]}
//         width={750}
//         centered
//       >
//         {detailModal.record && (
//           <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} size="middle">
//             <Descriptions.Item label="Tên thiết bị" labelStyle={{ fontWeight: 600 }}>{detailModal.record.DeviceName}</Descriptions.Item>
//             <Descriptions.Item label="Model" labelStyle={{ fontWeight: 600 }}>{detailModal.record.Model}</Descriptions.Item>
//             <Descriptions.Item label="Serial Number" labelStyle={{ fontWeight: 600 }}>
//               <Tag color="geekblue">{detailModal.record.SerialNumber}</Tag>
//             </Descriptions.Item>
//             <Descriptions.Item label="Khách hàng" labelStyle={{ fontWeight: 600 }}>{detailModal.record.Customer}</Descriptions.Item>
//             <Descriptions.Item label="Cửa hàng" labelStyle={{ fontWeight: 600 }}>{detailModal.record.Store}</Descriptions.Item>
//             <Descriptions.Item label="Vị trí" labelStyle={{ fontWeight: 600 }}>{detailModal.record.Location}</Descriptions.Item>
//             <Descriptions.Item label="Trạng thái" labelStyle={{ fontWeight: 600 }}>
//               <Tag color="blue">{detailModal.record.Status}</Tag>
//             </Descriptions.Item>
//             <Descriptions.Item label="Ngày giao" labelStyle={{ fontWeight: 600 }}>{formatDate(detailModal.record.DeliveryDate)}</Descriptions.Item>
//             <Descriptions.Item label="Ghi chú" span={2} labelStyle={{ fontWeight: 600 }}>
//               {detailModal.record.Note || <span style={{ color: '#ccc' }}>(Không có)</span>}
//             </Descriptions.Item>
//           </Descriptions>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default DeviceList;

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Descriptions,
  Row,
  Col,
  message,
  Form,
  Tag,
  Upload,
  Card,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  UploadOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  BarcodeOutlined,
  DesktopOutlined,
  UserOutlined,
  ShopOutlined,
  QrcodeOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  fetchDeviceAll,
  createDeviceAll,
  updateDeviceBySTT,
  fetchDevicesByPage,
} from "../../../../services/storeServices";
import "./DeviceList.scss";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchParams, setSearchParams] = useState({});
  const [detailModal, setDetailModal] = useState({
    visible: false,
    record: null,
  });

  // State để kiểm tra kích thước màn hình (cho Modal)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadDevices(pagination.current, pagination.pageSize, searchParams);
  }, [pagination.current, pagination.pageSize, searchParams]);

  const loadDevices = async (page, pageSize, filters) => {
    try {
      setLoading(true);
      const res = await fetchDevicesByPage(page, pageSize, filters);
      const data = Array.isArray(res) ? res : res?.data || [];
      const total = res?.meta?.pagination?.total || 0;

      setDevices(data);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: total,
      }));
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách thiết bị");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    const cleanFilters = {};
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        cleanFilters[key] = values[key];
      }
    });
    setSearchParams(cleanFilters);
  };

  const resetFilters = () => {
    form.resetFields();
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearchParams({});
  };

  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  // --- LOGIC IMPORT/UPDATE/EXPORT ---
  const handleImport = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        message.warning("Tệp không có dữ liệu!");
        return;
      }

      Modal.confirm({
        title: `Xác nhận nhập ${jsonData.length} thiết bị?`,
        content: "Quá trình này có thể mất vài phút nếu số lượng lớn.",
        centered: true, // Căn giữa modal
        onOk: async () => {
          try {
            setLoading(true);
            const batchSize = 50;
            const total = jsonData.length;
            for (let i = 0; i < total; i += batchSize) {
              const batch = jsonData.slice(i, i + batchSize);
              await Promise.all(batch.map((device) => createDeviceAll(device)));
            }
            message.success(`Import thành công ${total} thiết bị!`);
            setPagination((prev) => ({ ...prev, current: 1 }));
            loadDevices(1, pagination.pageSize, searchParams);
          } catch (err) {
            console.error(err);
            message.error("Có lỗi xảy ra trong quá trình import!");
          } finally {
            setLoading(false);
          }
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpdate = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        message.warning("Tệp không có dữ liệu!");
        return;
      }

      Modal.confirm({
        title: `Xác nhận cập nhật ${jsonData.length} thiết bị?`,
        centered: true,
        onOk: async () => {
          try {
            setLoading(true);
            const deviceList = await fetchDeviceAll();
            const flatDeviceList = Array.isArray(deviceList) ? deviceList : (deviceList.data || []);
            const batchSize = 50;
            for (let i = 0; i < jsonData.length; i += batchSize) {
              const batch = jsonData.slice(i, i + batchSize);
              await Promise.all(batch.map((device) => updateDeviceBySTT(device.STT, device, flatDeviceList)));
            }
            message.success("Cập nhật thành công!");
            loadDevices(pagination.current, pagination.pageSize, searchParams);
          } catch (err) {
            console.error(err);
            message.error("Lỗi khi cập nhật thiết bị!");
          } finally {
            setLoading(false);
          }
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      message.loading("Đang tải dữ liệu...", 0);
      const res = await fetchDeviceAll();
      const allData = Array.isArray(res) ? res : (res.data || []);

      if (allData.length === 0) {
        message.destroy();
        message.warning("Không có dữ liệu để xuất!");
        setLoading(false);
        return;
      }

      const ws = XLSX.utils.json_to_sheet(
        allData.map((device) => ({
          STT: device.id,
          Customer: device.Customer,
          DeliveryDate: device.DeliveryDate,
          DeviceName: device.DeviceName,
          BrandName: device.BrandName,
          Model: device.Model,
          SerialNumber: device.SerialNumber,
          Store: device.Store,
          Location: device.Location,
          Status: device.Status,
          Note: device.Note || "",
          CreatedAt: device.createdAt,
          UpdatedAt: device.updatedAt,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Devices");
      XLSX.writeFile(wb, "Device_List_Full.xlsx");
      message.destroy();
      message.success("Xuất Excel thành công!");
    } catch (error) {
      console.error(error);
      message.destroy();
      message.error("Lỗi khi xuất Excel");
    } finally {
      setLoading(false);
    }
  };

  // --- HELPERS ---
  const statusCounts = Object.values(
    devices.reduce((acc, item) => {
      const status = item.Status || "Chưa xác định";
      if (!acc[status]) acc[status] = { label: status, count: 0 };
      acc[status].count += 1;
      return acc;
    }, {})
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      ).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
      fixed: "left",
    },
    {
      title: "Ngày giao",
      dataIndex: "DeliveryDate",
      key: "DeliveryDate",
      render: formatDate,
      width: 110,
      sorter: (a, b) => new Date(a.DeliveryDate) - new Date(b.DeliveryDate),
    },
    {
      title: "Tên thiết bị",
      dataIndex: "DeviceName",
      key: "DeviceName",
      ellipsis: true,
      render: (text) => <span style={{ fontWeight: 500, color: "#1890ff" }}>{text}</span>,
    },
    { title: "Model", dataIndex: "Model", key: "Model", width: 120 },
    {
      title: "Serial Number",
      dataIndex: "SerialNumber",
      key: "SerialNumber",
      width: 150,
      render: (text) => <Tag color="default" style={{ fontFamily: "monospace" }}>{text}</Tag>,
    },
    { title: "Khách hàng", dataIndex: "Customer", key: "Customer", ellipsis: true },
    {
      title: "Cửa hàng",
      dataIndex: "Store",
      key: "Store",
      width: 100,
      align: "center",
      render: (text) => <strong>{text}</strong>,
    },
    { title: "Vị trí", dataIndex: "Location", key: "Location", ellipsis: true },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      align: "center",
      width: 140,
      render: (status) => {
        let color = "green";
        if (status === "Không sử dụng") color = "gold";
        else if (status === "Không có thiết bị") color = "volcano";
        else if (status === "Hư hỏng") color = "red";
        return <Tag color={color} style={{ minWidth: 80 }}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "detail",
      align: "center",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            shape="circle"
            icon={<EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />}
            onClick={() => setDetailModal({ visible: true, record })}
          />
        </Tooltip>
      ),
    },
  ];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <div className="device-list-container">
      {/* --- BỘ LỌC TÌM KIẾM --- */}
      <Card
        bordered={false}
        className="shadow-sm"
        style={{ marginBottom: 16, borderRadius: "8px" }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1890ff", fontSize: isMobile ? '16px' : '18px' }}>
            <FilterOutlined />
            <span style={{ fontWeight: 600 }}>BỘ LỌC TÌM KIẾM</span>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[16, 12]}>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item name="SerialNumber" label="Serial Number" style={{ marginBottom: 0 }}>
                <Input prefix={<BarcodeOutlined style={{ color: "#bfbfbf" }} />} placeholder="Nhập S/N..." allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item name="DeviceName" label="Tên thiết bị" style={{ marginBottom: 0 }}>
                <Input prefix={<DesktopOutlined style={{ color: "#bfbfbf" }} />} placeholder="Nhập tên..." allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item name="Model" label="Model" style={{ marginBottom: 0 }}>
                <Input prefix={<QrcodeOutlined style={{ color: "#bfbfbf" }} />} placeholder="Nhập Model..." allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item name="Customer" label="Khách hàng" style={{ marginBottom: 0 }}>
                <Input prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} placeholder="Ví dụ: Family Mart..." allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item name="Store" label="Cửa hàng" style={{ marginBottom: 0 }}>
                <Input prefix={<ShopOutlined style={{ color: "#bfbfbf" }} />} placeholder="Mã hoặc tên..." allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8} className="search-buttons-col" style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                style={{ flex: 1, backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                loading={loading}
              >
                Tìm kiếm
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetFilters} style={{ flex: 0.5 }}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* --- CÔNG CỤ & THỐNG KÊ (Responsive Flex) --- */}
      <div className="action-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10 }}>
        {/* Thống kê nhanh */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {statusCounts.map(({ label, count }) => (
            <Tag key={label} color="blue" style={{ fontSize: "13px", padding: "4px 10px", borderRadius: "4px" }}>
              {label}: <strong>{count}</strong>
            </Tag>
          ))}
        </div>

        {/* Nút chức năng Import/Export */}
        {account.Devicelist === true && (
          <div className="action-group" style={{ display: "flex", gap: "10px" }}>
            <Upload beforeUpload={() => false} showUploadList={false} onChange={({ file }) => handleImport(file)}>
              <Button icon={<UploadOutlined />} type="dashed">Import</Button>
            </Upload>

            <Upload beforeUpload={() => false} showUploadList={false} onChange={({ file }) => handleUpdate(file)}>
              <Button type="default">Update</Button>
            </Upload>

            <Button type="primary" ghost icon={<DownloadOutlined />} onClick={handleExport}>
              Xuất Excel
            </Button>
          </div>
        )}
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <Card bordered={false} className="shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }} bodyStyle={{ padding: "0" }}>
        <Table
          rowKey={(record) => record.id || record.documentId}
          columns={columns}
          dataSource={devices}
          loading={loading}
          size={isMobile ? "small" : "middle"} // Mobile thì dùng bảng nhỏ
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => (
              isMobile ?
                `${range[0]}-${range[1]}/${total}` :
                <span style={{ color: "#8c8c8c" }}>Hiển thị {range[0]}-{range[1]} của {total} thiết bị</span>
            ),
            simple: isMobile, // Dạng phân trang đơn giản cho mobile
          }}
          onChange={handleTableChange}
          scroll={{ x: 1100 }} // Kích hoạt cuộn ngang bắt buộc
        />
      </Card>

      <Modal
        title={<span style={{ color: "#1890ff", fontSize: 18 }}><DesktopOutlined /> Chi tiết thiết bị</span>}
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={[
          <Button key="close" onClick={() => setDetailModal({ visible: false, record: null })}>Đóng</Button>
        ]}
        width={750}
        style={{ maxWidth: '100%', top: 20, paddingBottom: 0 }} // Responsive Modal width
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }} // Scroll nội dung modal nếu quá dài
        centered
      >
        {detailModal.record && (
          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} size="small" layout={isMobile ? 'vertical' : 'horizontal'}>
            <Descriptions.Item label="Tên thiết bị" labelStyle={{ fontWeight: 600 }}>{detailModal.record.DeviceName}</Descriptions.Item>
            <Descriptions.Item label="Model" labelStyle={{ fontWeight: 600 }}>{detailModal.record.Model}</Descriptions.Item>
            <Descriptions.Item label="Serial Number" labelStyle={{ fontWeight: 600 }}>
              <Tag color="geekblue">{detailModal.record.SerialNumber}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng" labelStyle={{ fontWeight: 600 }}>{detailModal.record.Customer}</Descriptions.Item>
            <Descriptions.Item label="Cửa hàng" labelStyle={{ fontWeight: 600 }}>{detailModal.record.Store}</Descriptions.Item>
            <Descriptions.Item label="Vị trí" labelStyle={{ fontWeight: 600 }}>{detailModal.record.Location}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái" labelStyle={{ fontWeight: 600 }}>
              <Tag color="blue">{detailModal.record.Status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày giao" labelStyle={{ fontWeight: 600 }}>{formatDate(detailModal.record.DeliveryDate)}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2} labelStyle={{ fontWeight: 600 }}>
              {detailModal.record.Note || <span style={{ color: "#ccc" }}>(Không có)</span>}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DeviceList;
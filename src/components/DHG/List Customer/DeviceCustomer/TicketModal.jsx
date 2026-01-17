// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Button,
//   Input,
//   Table,
//   message,
//   AutoComplete,
//   Select,
//   DatePicker,
//   Popconfirm,
//   Tooltip,
// } from "antd";
// import {
//   createDevicesDetailHandover,
//   updateDevicesDetailHandover,
//   createDevicesDetailRetrieve,
//   updateDevicesDetailRetrieve,
//   fetchDeviceDetailHandover,
//   fetchDeviceDetailRetrieve,
//   deleteDeviceDetailHandover,
//   deleteDeviceDetailRetrieve,
//   updateTicketStatus,
//   updateDeviceBySerial,
// } from "../../../../services/storeServices";
// import PrintTicketModal from "./PrintTicketModal";
// import PrintLabelModalRetrieve from "./PrintLabelModalRetrieve";
// import PrintLabelModalHandover from "./PrintLabelModalHandover";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   CloseOutlined,
//   CheckOutlined,
//   RollbackOutlined,
//   SaveOutlined,
//   CheckCircleOutlined,
//   FileDoneOutlined,
//   PrinterOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";

// const TicketModal = ({
//   isOpen,
//   onClose,
//   ticket,
//   fetchDevices,
//   fetchTickets,
//   reloadTickets,
//   serialNumberOptions = [],
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [handoverDevicesData, setHandoverDevicesData] = useState([]);
//   const [retrieveDevicesData, setRetrieveDevicesData] = useState([]);
//   const [newHandoverDevices, setNewHandoverDevices] = useState([]);
//   const [newRetrieveDevices, setNewRetrieveDevices] = useState([]);
//   const [editingRowId, setEditingRowId] = useState(null);
//   const [printVisible, setPrintVisible] = useState(false);
//   const [isPrintModalOpenH, setIsPrintModalOpenH] = useState(false);
//   const [isPrintModalOpenR, setIsPrintModalOpenR] = useState(false);
//   const [selectedDevice, setSelectedDevice] = useState(null);

//   useEffect(() => {
//     if (isOpen && ticket?.attributes?.Votes) {
//       console.log("Ticket value:", ticket.attributes.Votes);
//       fetchDeviceDetailHandover(ticket.attributes.Votes)
//         .then((responseData) => {
//           console.log("Response Handover API:", responseData);
//           const devices =
//             responseData && responseData.data
//               ? responseData.data.map((item) => ({
//                 id: item.id,
//                 ...item.attributes,
//               }))
//               : Array.isArray(responseData)
//                 ? responseData.map((item) => ({
//                   id: item.id,
//                   ...item.attributes,
//                 }))
//                 : [];
//           console.log("Mapped handover devices:", devices);
//           setHandoverDevicesData(devices);
//         })
//         .catch((error) => {
//           console.error("Lỗi tải thiết bị bàn giao:", error);
//           message.error("Lỗi tải thiết bị bàn giao.");
//         });

//       fetchDeviceDetailRetrieve(ticket.attributes.Votes)
//         .then((responseData) => {
//           console.log("Response Retrieve API:", responseData);
//           const devices =
//             responseData && responseData.data
//               ? responseData.data.map((item) => ({
//                 id: item.id,
//                 ...item.attributes,
//               }))
//               : Array.isArray(responseData)
//                 ? responseData.map((item) => ({
//                   id: item.id,
//                   ...item.attributes,
//                 }))
//                 : [];
//           console.log("Mapped retrieve devices:", devices);
//           setRetrieveDevicesData(devices);
//         })
//         .catch((error) => {
//           console.error("Lỗi tải thiết bị thu hồi:", error);
//           message.error("Lỗi tải thiết bị thu hồi.");
//         });
//     }
//   }, [isOpen, ticket?.attributes?.Votes]);

//   useEffect(() => {
//     if (!isOpen) {
//       setHandoverDevicesData([]);
//       setRetrieveDevicesData([]);
//       setNewHandoverDevices([]);
//       setNewRetrieveDevices([]);
//       setEditingRowId(null);
//     }
//   }, [isOpen]);

//   const combinedHandoverData = [...handoverDevicesData, ...newHandoverDevices];
//   const combinedRetrieveData = [...retrieveDevicesData, ...newRetrieveDevices];

//   const statusOptions = [
//     { value: "Đang sử dụng", label: "Đang sử dụng" }
//   ];

//   const devicestatusOptions = [
//     { value: "Thiết bị mới", label: "Thiết bị mới" },
//     { value: "Thiết bị cũ", label: "Thiết bị cũ" }
//   ];
//   const devicesoldtatusOptions = [
//     { value: "Hỏng", label: "Hỏng" },
//     { value: "Hết hạn sử dụng", label: "Hết hạn sử dụng" },
//     { value: "Đóng cửa", label: "Đóng cửa" }
//   ];

//   const handleAddRow = (type) => {
//     if (!ticket) {
//       message.error("Vui lòng chọn phiếu trước khi thêm thiết bị!");
//       return;
//     }
//     const newDevice = {
//       id: Date.now(),
//       Customer: ticket.attributes.Customer || "",
//       DeliveryDate: "",
//       DeviceName: "",
//       BrandName: "",
//       Model: "",
//       SerialNumber: "",
//       // Store: ticket.attributes.Store,
//       Store:
//         type === "handover"
//           ? ticket.attributes.Store // 👉 handover: lấy mặc định
//           : undefined, // 👉 retrieve: để trống, ép chọn lại
//       Location: "",
//       Status: type === "handover" ? "Đang sử dụng" : "Thu hồi",
//       DeviceStatus: "",
//       Note: "",
//       Votes: ticket.attributes.Votes,
//       StoreRecall: ticket.attributes.Store,
//       isNew: true,
//       Type: type === "handover" ? "Bàn giao" : "Thu hồi",
//     };
//     if (type === "handover") {
//       setNewHandoverDevices((prev) => [...prev, newDevice]);
//     } else if (type === "retrieve") {
//       setNewRetrieveDevices((prev) => [...prev, newDevice]);
//     }
//   };

//   const handleInputChange = (id, field, value, type) => {
//     if (type === "handover") {
//       setNewHandoverDevices((prev) =>
//         prev.map((device) =>
//           device.id === id ? { ...device, [field]: value } : device
//         )
//       );
//     } else if (type === "retrieve") {
//       setNewRetrieveDevices((prev) =>
//         prev.map((device) =>
//           device.id === id ? { ...device, [field]: value } : device
//         )
//       );
//     }
//   };

//   const handleSavedInputChange = (id, field, value, type) => {
//     if (type === "handover") {
//       setHandoverDevicesData((prev) =>
//         prev.map((device) =>
//           device.id === id ? { ...device, [field]: value } : device
//         )
//       );
//     } else if (type === "retrieve") {
//       setRetrieveDevicesData((prev) =>
//         prev.map((device) =>
//           device.id === id ? { ...device, [field]: value } : device
//         )
//       );
//     }
//   };

//   const handleSerialNumberChange = (value, record, type) => {
//     const selectedDevice = serialNumberOptions.find(
//       (option) => option.value === value
//     );
//     const updateFunction =
//       type === "handover"
//         ? editingRowId === record.id
//           ? handleSavedInputChange
//           : setNewHandoverDevices
//         : editingRowId === record.id
//           ? handleSavedInputChange
//           : setNewRetrieveDevices;

//     if (editingRowId === record.id || record.isNew === false) {
//       if (type === "handover") {
//         setHandoverDevicesData((prev) =>
//           prev.map((device) =>
//             device.id === record.id
//               ? {
//                 ...device,
//                 SerialNumber: value,
//                 DeviceName: selectedDevice ? selectedDevice.DeviceName : "",
//                 BrandName: selectedDevice ? selectedDevice.BrandName : "",
//                 Model: selectedDevice ? selectedDevice.Model : "",
//                 DeliveryDate: selectedDevice
//                   ? selectedDevice.DeliveryDate
//                   : ticket?.attributes?.Date || "",
//                 Location: selectedDevice ? selectedDevice.Location : "",
//                 // Status: selectedDevice
//                 //   ? selectedDevice.Status
//                 //   : "Đang sử dụng",
//                 Status: "Đang sử dụng",

//                 Note: selectedDevice ? selectedDevice.Note : "",
//               }
//               : device
//           )
//         );
//       } else {
//         setRetrieveDevicesData((prev) =>
//           prev.map((device) =>
//             device.id === record.id
//               ? {
//                 ...device,
//                 SerialNumber: value,
//                 DeviceName: selectedDevice ? selectedDevice.DeviceName : "",
//                 BrandName: selectedDevice ? selectedDevice.BrandName : "",
//                 Model: selectedDevice ? selectedDevice.Model : "",
//                 DeliveryDate: selectedDevice
//                   ? selectedDevice.DeliveryDate
//                   : ticket?.attributes?.Date || "",
//                 Location: selectedDevice ? selectedDevice.Location : "",
//                 Status: "Thu hồi",
//                 Note: selectedDevice ? selectedDevice.Note : "",
//               }
//               : device
//           )
//         );
//       }
//     } else {
//       updateFunction((prev) =>
//         prev.map((device) =>
//           device.id === record.id
//             ? {
//               ...device,
//               SerialNumber: value,
//               DeviceName: selectedDevice ? selectedDevice.DeviceName : "",
//               BrandName: selectedDevice ? selectedDevice.BrandName : "",
//               Model: selectedDevice ? selectedDevice.Model : "",
//               DeliveryDate: selectedDevice
//                 ? selectedDevice.DeliveryDate
//                 : ticket?.attributes?.Date || "",
//               Location: selectedDevice ? selectedDevice.Location : "",
//               Status: type === "handover" ? "Đang sử dụng" : "Thu hồi",
//               Note: selectedDevice ? selectedDevice.Note : "",
//             }
//             : device
//         )
//       );
//     }
//   };

//   const handleDeleteRow = (id, type) => {
//     if (type === "handover") {
//       setNewHandoverDevices((prev) =>
//         prev.filter((device) => device.id !== id)
//       );
//     } else if (type === "retrieve") {
//       setNewRetrieveDevices((prev) =>
//         prev.filter((device) => device.id !== id)
//       );
//     }
//   };

//   const handleUpdateRow = async (id, type) => {
//     let device;
//     if (type === "handover") {
//       device = handoverDevicesData.find((d) => d.id === id);
//     } else {
//       device = retrieveDevicesData.find((d) => d.id === id);
//     }

//     if (!device) {
//       message.warning("Thiết bị không hợp lệ để cập nhật.");
//       return;
//     }

//     try {
//       setLoading(true);

//       if (type === "handover") {
//         await updateDevicesDetailHandover(device.id, {
//           ...device,
//           Status: device.Status || "Đang sử dụng",
//         });
//       } else {
//         await updateDevicesDetailRetrieve(device.id, {
//           ...device,
//           Status: "Thu hồi",
//         });
//       }

//       message.success("Cập nhật thiết bị thành công!");
//       setEditingRowId(null);

//       fetchDevices();
//       fetchTickets();
//     } catch (error) {
//       console.error("Lỗi khi cập nhật thiết bị:", error);
//       message.error("Lỗi khi cập nhật thiết bị.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm lưu thiết bị
//   const handleSaveNewDevices = async () => {
//     setLoading(true);
//     try {
//       const newDevices = [...newHandoverDevices, ...newRetrieveDevices];
//       const requiredFields = [
//         "Customer",
//         "DeliveryDate",
//         "DeviceName",
//         "BrandName",
//         "Model",
//         "SerialNumber",
//         "Store",
//         "Location",
//         "Status",
//         "DeviceStatus",
//       ];

//       // Kiểm tra dữ liệu bắt buộc
//       for (const device of newDevices) {
//         for (const field of requiredFields) {
//           if (!device[field] || device[field].toString().trim() === "") {
//             message.warning(
//               `Vui lòng điền đầy đủ trường "${field}" cho tất cả các hàng (ngoại trừ "Ghi Chú").`
//             );
//             return false; // ❌ báo không thành công
//           }
//         }
//       }

//       // Lưu thiết bị bàn giao
//       const handoverPromises = newHandoverDevices
//         .filter((device) => device.SerialNumber)
//         .map((device) => {
//           const deviceData = {
//             ...device,
//             Votes: ticket.attributes.Votes,
//             Customer: ticket.attributes.Customer,
//             Store: ticket.attributes.Store,
//             Status: device.Status || "Đang sử dụng",
//           };
//           console.log("Payload handover deviceData:", deviceData);
//           return createDevicesDetailHandover(deviceData);
//         });

//       // Lưu thiết bị thu hồi
//       const retrievePromises = newRetrieveDevices
//         .filter((device) => device.SerialNumber)
//         .map((device) => {
//           const deviceData = {
//             ...device,
//             Votes: ticket.attributes.Votes,
//             Customer: ticket.attributes.Customer,
//             Status: "Thu hồi",
//           };
//           console.log("Payload retrieve deviceData:", deviceData);
//           return createDevicesDetailRetrieve(deviceData);
//         });

//       await Promise.all([...handoverPromises, ...retrievePromises]);
//       onClose();
//       message.success("Lưu thiết bị thành công!");
//       fetchDevices();
//       fetchTickets();
//       return true; // ✅ báo thành công
//     } catch (error) {
//       console.error("Lỗi khi lưu thiết bị:", error);
//       message.error("Lỗi khi lưu thiết bị.");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm gửi phiếu (xác nhận phiếu)
//   const handleConfirmTicket = async () => {
//     try {
//       setLoading(true);

//       // Trước tiên phải lưu thiết bị
//       const isSaved = await handleSaveNewDevices();
//       if (!isSaved) {
//         return; // ❌ Nếu lưu lỗi → không chuyển trạng thái
//       }

//       // Nếu lưu OK → update trạng thái phiếu
//       await updateTicketStatus(ticket.id, "Đang chờ duyệt");
//       message.success("Phiếu đã chuyển sang trạng thái 'Đang chờ duyệt'!");

//       if (reloadTickets) {
//         console.log("🔄 Gọi reloadTickets()...");
//         await reloadTickets();
//       }

//       onClose();
//     } catch (error) {
//       console.error("Lỗi khi cập nhật trạng thái phiếu:", error);
//       message.error("Có lỗi xảy ra khi xác nhận phiếu.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //--------------------------------------------------------------------------------
//   const handleDeleteSavedRow = async (id, type) => {
//     try {
//       setLoading(true);
//       if (type === "handover") {
//         await deleteDeviceDetailHandover(id);
//         setHandoverDevicesData((prev) =>
//           prev.filter((device) => device.id !== id)
//         );
//       } else if (type === "retrieve") {
//         await deleteDeviceDetailRetrieve(id);
//         setRetrieveDevicesData((prev) =>
//           prev.filter((device) => device.id !== id)
//         );
//       }
//       message.success("Đã xóa thiết bị thành công!");
//     } catch (error) {
//       console.error("Lỗi khi xóa thiết bị đã lưu:", error);
//       message.error("Lỗi khi xóa thiết bị đã lưu.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveTicket = async () => {
//     try {
//       setLoading(true);

//       const savedDevices = [...handoverDevicesData, ...retrieveDevicesData];

//       if (savedDevices.length === 0) {
//         message.warning("Không có thiết bị đã lưu để duyệt.");
//         setLoading(false);
//         return;
//       }

//       const updatePromises = savedDevices.map((device) => {
//         if (device.isNew) {
//           console.warn(
//             `Bỏ qua thiết bị mới (chưa lưu): ${device.SerialNumber}`
//           );
//           return Promise.resolve(null);
//         }

//         const updatedData = {
//           ...device,
//           DeliveryDate: device.DeliveryDate || null,
//           // Status:
//           //   device.Type === "Bàn giao"
//           //     ? device.Status || "Đang sử dụng"
//           //     : "Thu hồi",
//           Status: device.Status,
//           Note: device.Note
//         };

//         return updateDeviceBySerial(device.SerialNumber, updatedData);
//       });

//       await Promise.all(updatePromises);

//       await updateTicketStatus(ticket.id, "Đã duyệt");

//       message.success("Duyệt phiếu thành công!");
//       if (reloadTickets) {
//         console.log("🔄 Gọi reloadTickets()...");
//         await reloadTickets();
//       }

//       fetchDevices();
//       onClose();
//     } catch (error) {
//       console.error("Lỗi duyệt phiếu:", error);
//       message.error("Lỗi duyệt phiếu.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReturnTicket = async () => {
//     try {
//       setLoading(true);
//       await updateTicketStatus(ticket.id, "Đang tạo phiếu");
//       message.success("Phiếu đã được trả về trạng thái 'Đang tạo phiếu'!");
//       if (reloadTickets) {
//         console.log("🔄 Gọi reloadTickets()...");
//         await reloadTickets();
//       }
//       onClose();
//     } catch (error) {
//       message.error("Lỗi khi trả phiếu!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmAdminTicket = async () => {
//     try {
//       setLoading(true);
//       await updateTicketStatus(ticket.id, "Đã nhận phiếu");
//       message.success("Phiếu đã được trả về trạng thái 'Đã nhận phiếu'!");
//       if (reloadTickets) {
//         console.log("🔄 Gọi reloadTickets()...");
//         await reloadTickets();
//       }
//       onClose();
//     } catch (error) {
//       message.error("Lỗi khi trả phiếu!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const locationOptions = [
//     "POS01",
//     "POS02",
//     "POS03",
//     "POS04",
//     "POS05",
//     "POS06",
//     "Server",
//     "RACK",
//     "KD01",
//     "KD02",
//     "KP01",
//     "KP02",
//     "KP03",
//     "KP04",
//     "KP05",
//     "AP01",
//     "AP02",
//     "WIFI01",
//     "WIFI02",
//     "Handy01",
//     "Handy02",
//     "Handy03",
//     "Handy04",
//     "Handy05",
//     "Handy06",
//     "Handy07",
//     "Handy08",
//   ];
//   const storeOptions = ["DHG", "FMV", "Kohnan", "Sukiya", "Colowide"];
//   const deviceOptions = [
//     { value: "POS", label: "POS" },
//     { value: "Drawer", label: "Drawer" },
//     { value: "Scanner", label: "Scanner" },
//     { value: "Printer", label: "Printer" },
//     { value: "Keyboard", label: "Keyboard" },
//     { value: "Handy", label: "Handy" },
//     { value: "Switch", label: "Switch" },
//     { value: "Monitor", label: "Monitor" },
//     { value: "UPS", label: "UPS" },
//     { value: "WIFI", label: "WIFI" },
//     { value: "Mouse", label: "Mouse" },
//     { value: "Server", label: "Server" },
//     { value: "Hard Drive", label: "Hard Drive" },
//     { value: "PCC", label: "PCC" },
//     { value: "Laptop", label: "Laptop" },
//     { value: "PDA", label: "PDA" },
//     { value: "KD", label: "KD" },
//     { value: "KP", label: "KP" },
//     { value: "Cisco", label: "Cisco" },
//     { value: "Router", label: "Router" },
//     { value: "AP", label: "AP" },
//     { value: "Firewall", label: "Firewall" },
//     { value: "POE", label: "POE" },
//     { value: "Rack", label: "Rack" },
//     { value: "Arm", label: "Arm" },
//     { value: "Giá treo gỗ", label: "Giá treo gỗ" },
//     { value: "Ổ điện", label: "Ổ điện" },
//   ];

//   const brandOptions = [
//     { value: "Toshiba", label: "Toshiba" },
//     { value: "Maken", label: "Maken" },
//     { value: "Aida", label: "Aida" },
//     { value: "Datalogic", label: "Datalogic" },
//     { value: "Dell", label: "Dell" },
//     { value: "VSP", label: "VSP" },
//     { value: "Tplink", label: "Tplink" },
//     { value: "Ares", label: "Ares" },
//     { value: "Brother", label: "Brother" },
//     { value: "Canon", label: "Canon" },
//     { value: "Cisco", label: "Cisco" },
//   ];

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   return (
//     <Modal
//       title="Chi Tiết Phiếu"
//       open={isOpen}
//       onCancel={onClose}
//       getContainer={document.body}
//       footer={[
//         <Button key="cancel" icon={<CloseOutlined />} onClick={onClose}>
//           Đóng
//         </Button>,
//         account.Leader === true &&
//         ticket?.attributes?.Status === "Đang chờ duyệt" && (
//           <Button
//             key="return"
//             type="default"
//             danger
//             icon={<RollbackOutlined />}
//             onClick={handleReturnTicket}
//           >
//             Trả Phiếu
//           </Button>
//         ),
//         account.Leader === true &&
//         ticket?.attributes?.Status === "Đang chờ duyệt" && (
//           <Button
//             key="approve"
//             type="primary"
//             icon={<CheckOutlined />}
//             onClick={handleApproveTicket}
//             style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
//           >
//             Duyệt Phiếu
//           </Button>
//         ),
//         ticket?.attributes?.Status === "Đang tạo phiếu" &&
//         ticket?.attributes?.Person === account?.Name && (
//           <Button
//             key="saveNew"
//             type="default"
//             icon={<SaveOutlined />}
//             onClick={handleSaveNewDevices}
//           >
//             Lưu
//           </Button>
//         ),
//         ticket?.attributes?.Status === "Đang tạo phiếu" &&
//         ticket?.attributes?.Person === account?.Name && (
//           <Button
//             key="confirm"
//             type="primary"
//             icon={<FileDoneOutlined />}
//             onClick={handleConfirmTicket}
//             style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
//           >
//             Gửi Phiếu
//           </Button>
//         ),
//         account.Receivelist === true &&
//         ticket?.attributes?.Status === "Đã duyệt" && (
//           <Button
//             key="confirm"
//             type="primary"
//             icon={<CheckCircleOutlined />}
//             onClick={handleConfirmAdminTicket}
//             style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
//           >
//             Nhận Phiếu
//           </Button>
//         ),
//         ticket?.attributes?.Status === "Đang chờ duyệt" &&
//         ticket?.attributes?.Person === account?.Name &&
//         (
//           <Button
//             key="print"
//             type="primary"
//             onClick={() => setPrintVisible(true)}
//           >
//             In Phiếu
//           </Button>
//         ),
//       ]}
//       width="75vw"
//       style={{ maxWidth: "1200px" }}
//     >
//       <h3>Thiết Bị Bàn Giao</h3>
//       <Table
//         dataSource={combinedHandoverData}
//         rowKey="id"
//         pagination={false}
//         columns={[
//           {
//             title: "Khách Hàng",
//             dataIndex: "Customer",
//             key: "Customer",
//             width: 150,
//             render: (_, record) =>
//               record.isNew ? (
//                 <Input
//                   value={record.Customer}
//                   style={{ width: "100%" }}
//                   onChange={(e) =>
//                     handleInputChange(
//                       record.id,
//                       "Customer",
//                       e.target.value,
//                       "handover"
//                     )
//                   }
//                   placeholder="Nhập khách hàng"
//                 />
//               ) : (
//                 <span>{record.Customer || "-"}</span>
//               ),
//           },
//           {
//             title: "Số Serial",
//             dataIndex: "SerialNumber",
//             key: "SerialNumber",
//             width: 240,
//             render: (_, record) => {
//               const selectedSerials = combinedHandoverData
//                 .filter((device) => device.id !== record.id)
//                 .map((device) => device.SerialNumber);

//               const filteredOptions = serialNumberOptions.filter(
//                 (option) =>
//                   option.Store === "DHG" &&
//                   option.label &&
//                   !selectedSerials.includes(option.value)
//               );

//               if (record.isNew || editingRowId === record.id) {
//                 return (
//                   <div style={{ position: "relative" }}>
//                     <AutoComplete
//                       options={filteredOptions}
//                       style={{ width: "100%", height: "32px" }}
//                       onChange={(value) =>
//                         handleSerialNumberChange(value, record, "handover")
//                       }
//                       value={record.SerialNumber || ""}
//                       placeholder="Nhập số serial"
//                       filterOption={(inputValue, option) => {
//                         const label = option?.label || "";
//                         return label
//                           .toUpperCase()
//                           .includes(inputValue?.toUpperCase() || "");
//                       }}
//                     />
//                     {!record.SerialNumber && (
//                       <span
//                         style={{
//                           position: "absolute",
//                           bottom: "-18px",
//                           left: 0,
//                           color: "red",
//                           fontSize: "12px",
//                         }}
//                       >
//                         * Vui lòng nhập số serial
//                       </span>
//                     )}
//                   </div>
//                 );
//               }
//               return <span>{record.SerialNumber || "-"}</span>;
//             },
//           },
//           {
//             title: "Ngày Giao",
//             dataIndex: "DeliveryDate",
//             key: "DeliveryDate",
//             width: 150,
//             render: (_, record) => {
//               const dateValue = record.DeliveryDate
//                 ? dayjs(record.DeliveryDate, "YYYY-MM-DD")
//                 : null;

//               const handleChange = (date) => {
//                 const formattedDate = date ? date.format("YYYY-MM-DD") : "";
//                 const handler = record.isNew
//                   ? handleInputChange
//                   : handleSavedInputChange;
//                 handler(record.id, "DeliveryDate", formattedDate, "handover");
//               };

//               if (record.isNew || editingRowId === record.id) {
//                 return (
//                   <Tooltip
//                     title={
//                       record.DeliveryDate
//                         ? `Ngày gốc: ${dayjs(record.DeliveryDate).format(
//                           "DD-MM-YYYY"
//                         )}`
//                         : "Chưa có"
//                     }
//                   >
//                     <DatePicker
//                       value={dateValue}
//                       onChange={handleChange}
//                       format="DD-MM-YYYY"
//                       placeholder="Chọn ngày giao"
//                       size="small"
//                       style={{ width: "100%" }}
//                       disabledDate={(current) =>
//                         current &&
//                         current < dayjs().subtract(1, "month").startOf("day")
//                       }
//                     />
//                   </Tooltip>
//                 );
//               }
//               return (
//                 <span>
//                   {record.DeliveryDate
//                     ? dayjs(record.DeliveryDate).format("DD-MM-YYYY")
//                     : "-"}
//                 </span>
//               );
//             },
//           },
//           {
//             title: "Tên Thiết Bị",
//             dataIndex: "DeviceName",
//             key: "DeviceName",
//             width: 180,
//             render: (_, record) =>
//               record.isNew || editingRowId === record.id ? (
//                 <Select
//                   showSearch
//                   value={record.DeviceName || undefined}
//                   style={{ width: "100%" }}
//                   onChange={(value) => {
//                     if (record.isNew) {
//                       handleInputChange(
//                         record.id,
//                         "DeviceName",
//                         value,
//                         "handover"
//                       );
//                     } else {
//                       handleSavedInputChange(
//                         record.id,
//                         "DeviceName",
//                         value,
//                         "handover"
//                       );
//                     }
//                   }}
//                   options={deviceOptions}
//                   placeholder="Chọn thiết bị"
//                   filterOption={(input, option) =>
//                     (option?.label ?? "")
//                       .toLowerCase()
//                       .includes(input.toLowerCase())
//                   }
//                 />
//               ) : (
//                 <span>{record.DeviceName || "-"}</span>
//               ),
//           },
//           {
//             title: "Thương Hiệu",
//             dataIndex: "BrandName",
//             key: "BrandName",
//             width: 150,
//             render: (_, record) => <span>{record.BrandName || "-"}</span>,
//           },
//           {
//             title: "Model",
//             dataIndex: "Model",
//             key: "Model",
//             width: 220,
//             render: (_, record) => <span>{record.Model || "-"}</span>,
//           },
//           {
//             title: "Cửa Hàng",
//             dataIndex: "Store",
//             key: "Store",
//             width: 150,
//             render: (_, record) => <span>{record.Store || "-"}</span>,
//           },
//           {
//             title: "Vị Trí",
//             dataIndex: "Location",
//             key: "Location",
//             width: 150,
//             render: (_, record) =>
//               record.isNew || editingRowId === record.id ? (
//                 <Select
//                   style={{ width: "100%" }}
//                   value={record.Location || null}
//                   onChange={(value) => {
//                     const handler = record.isNew
//                       ? handleInputChange
//                       : handleSavedInputChange;
//                     handler(record.id, "Location", value, "handover");
//                   }}
//                   options={locationOptions.map((loc) => ({
//                     value: loc,
//                     label: loc,
//                   }))}
//                   placeholder="Chọn vị trí"
//                 />
//               ) : (
//                 <span>{record.Location || "-"}</span>
//               ),
//           },
//           {
//             title: "Trạng Thái",
//             dataIndex: "Status",
//             key: "Status",
//             width: 150,
//             render: (_, record) =>
//               record.isNew || editingRowId === record.id ? (
//                 <Select
//                   style={{ width: "100%" }}
//                   value={record.Status || "Đang sử dụng"}
//                   onChange={(value) => {
//                     const handler = record.isNew
//                       ? handleInputChange
//                       : handleSavedInputChange;
//                     handler(record.id, "Status", value, "handover");
//                   }}
//                   options={statusOptions}
//                   placeholder="Chọn trạng thái"
//                 />
//               ) : (
//                 <span>{record.Status || "Đang sử dụng"}</span>
//               ),
//           },
//           {
//             title: "Tình trạng",
//             dataIndex: "DeviceStatus",
//             key: "DeviceStatus",
//             width: 150,
//             render: (_, record) =>
//               record.isNew || editingRowId === record.id ? (
//                 <Select
//                   style={{ width: "100%" }}
//                   value={record.DeviceStatus}
//                   onChange={(value) => {
//                     const handler = record.isNew
//                       ? handleInputChange
//                       : handleSavedInputChange;
//                     handler(record.id, "DeviceStatus", value, "handover");
//                   }}
//                   options={devicestatusOptions}
//                   placeholder="Chọn trạng thái"
//                 />
//               ) : (
//                 <span>{record.DeviceStatus}</span>
//               ),
//           },
//           {
//             title: "Ghi Chú",
//             dataIndex: "Note",
//             key: "Note",
//             width: 200,
//             render: (_, record) =>
//               record.isNew || editingRowId === record.id ? (
//                 <Input
//                   value={record.Note || ""}
//                   onChange={(e) => {
//                     const handler = record.isNew
//                       ? handleInputChange
//                       : handleSavedInputChange;
//                     handler(record.id, "Note", e.target.value, "handover");
//                   }}
//                   style={{ width: "100%" }}
//                   placeholder="Nhập ghi chú"
//                 />
//               ) : (
//                 <span>{record.Note || "-"}</span>
//               ),
//           },
//           {
//             title: "Số Phiếu",
//             dataIndex: "Votes",
//             key: "Votes",
//             width: 180,
//             render: (_, record) => <span>{record.Votes || "-"}</span>,
//           },
//           {
//             title: "Hành động",
//             key: "action",
//             render: (_, record) => {
//               const isCreator = ticket?.attributes?.Person === account?.Name;
//               const isPending = ticket?.attributes?.Status === "Đang tạo phiếu";
//               const canDelete = isCreator && isPending;

//               if (record.isNew) {
//                 return canDelete ? (
//                   <Popconfirm
//                     title="Bạn có chắc muốn xóa dữ liệu hàng này?"
//                     onConfirm={() => handleDeleteRow(record.id, "handover")}
//                     okText="Có"
//                     cancelText="Không"
//                   >
//                     <Button type="danger" icon={<DeleteOutlined />} />
//                   </Popconfirm>
//                 ) : null;
//               } else {
//                 if (editingRowId === record.id) {
//                   return (
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         gap: "5px",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {ticket?.attributes?.Status === "Đang tạo phiếu" && (
//                         <Button
//                           type="primary"
//                           onClick={() => handleUpdateRow(record.id, "handover")}
//                         >
//                           Lưu
//                         </Button>
//                       )}
//                       <Button onClick={() => setEditingRowId(null)}>Hủy</Button>
//                     </div>
//                   );
//                 } else {
//                   return (
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         gap: "5px",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Button
//                         type="default"
//                         icon={<EditOutlined style={{ color: "#1890ff" }} />}
//                         onClick={() => setEditingRowId(record.id)}
//                       />
//                       {canDelete && (
//                         <Popconfirm
//                           title="Bạn có chắc muốn xóa dữ liệu hàng này?"
//                           onConfirm={() =>
//                             handleDeleteSavedRow(record.id, "handover")
//                           }
//                           okText="Có"
//                           cancelText="Không"
//                         >
//                           <Button type="danger" icon={<DeleteOutlined />} />
//                         </Popconfirm>
//                       )}
//                       <Button
//                         type="primary"
//                         icon={<PrinterOutlined />}
//                         onClick={() => {
//                           console.log("Record:", record);
//                           setSelectedDevice(record);
//                           setIsPrintModalOpenH(true);
//                         }}
//                       >
//                         In Nhãn
//                       </Button>
//                     </div>
//                   );
//                 }
//               }
//             },
//             width: 120,
//           },
//         ]}
//         scroll={{ x: "max-content" }}
//       />
//       {ticket?.attributes?.Status === "Đang tạo phiếu" &&
//         ticket?.attributes?.Person === account?.Name && (
//           <Button
//             type="dashed"
//             onClick={() => handleAddRow("handover")}
//             style={{ marginTop: 10, marginLeft: 10 }}
//           >
//             ➕ Thêm Hàng (Bàn giao)
//           </Button>
//         )}

//       <h3 style={{ marginTop: 20 }}>Thiết Bị Thu Hồi</h3>
//       <Table
//         dataSource={combinedRetrieveData}
//         rowKey="id"
//         pagination={false}
//         columns={[
//           {
//             title: "Khách Hàng",
//             dataIndex: "Customer",
//             key: "Customer",
//             width: 150,
//             render: (_, record) =>
//               record.isNew ? (
//                 <Input
//                   value={record.Customer}
//                   style={{ width: "100%" }}
//                   onChange={(e) =>
//                     handleInputChange(
//                       record.id,
//                       "Customer",
//                       e.target.value,
//                       "retrieve"
//                     )
//                   }
//                 />
//               ) : (
//                 <span>{record.Customer || "-"}</span>
//               ),
//           },
//           {
//             title: "Số Serial",
//             dataIndex: "SerialNumber",
//             key: "SerialNumber",
//             width: 240,
//             render: (_, record) => {
//               const selectedSerials = combinedRetrieveData
//                 .filter((device) => device.id !== record.id)
//                 .map((device) => device.SerialNumber);

//               const filteredOptions = serialNumberOptions.filter(
//                 (option) =>
//                   option.Store === ticket?.attributes?.Store &&
//                   option.label &&
//                   !selectedSerials.includes(option.value)
//               );

//               const isEditing = editingRowId === record.id;

//               return record.isNew || isEditing ? (
//                 <div style={{ position: "relative" }}>
//                   <AutoComplete
//                     options={filteredOptions}
//                     style={{ width: "100%" }}
//                     onChange={(value) =>
//                       handleSerialNumberChange(value, record, "retrieve")
//                     }
//                     value={record.SerialNumber || ""}
//                     placeholder="Nhập số serial"
//                     filterOption={(inputValue, option) => {
//                       const label = option?.label || "";
//                       return label
//                         .toUpperCase()
//                         .includes(inputValue?.toUpperCase() || "");
//                     }}
//                   />
//                   {!record.SerialNumber && (
//                     <span
//                       style={{
//                         position: "absolute",
//                         bottom: "-18px",
//                         left: 0,
//                         color: "red",
//                         fontSize: "12px",
//                       }}
//                     >
//                       * Vui lòng nhập số serial
//                     </span>
//                   )}
//                 </div>
//               ) : (
//                 <span>{record.SerialNumber || "-"}</span>
//               );
//             },
//           },
//           {
//             title: "Ngày Giao",
//             dataIndex: "DeliveryDate",
//             key: "DeliveryDate",
//             width: 150,
//             render: (_, record) => <span>{record.DeliveryDate || "-"}</span>,
//           },
//           {
//             title: "Tên Thiết Bị",
//             dataIndex: "DeviceName",
//             key: "DeviceName",
//             width: 180,
//             render: (_, record) => <span>{record.DeviceName || "-"}</span>,
//           },
//           {
//             title: "Thương Hiệu",
//             dataIndex: "BrandName",
//             key: "BrandName",
//             width: 150,
//             render: (_, record) => <span>{record.BrandName || "-"}</span>,
//           },
//           {
//             title: "Model",
//             dataIndex: "Model",
//             key: "Model",
//             width: 220,
//             render: (_, record) => <span>{record.Model || "-"}</span>,
//           },
//           {
//             title: "Cửa Hàng",
//             dataIndex: "StoreRecall",
//             key: "StoreRecall",
//             width: 150,
//             render: (_, record) => <span>{record.StoreRecall || "-"}</span>,
//           },
//           {
//             title: "Vị Trí",
//             dataIndex: "Location",
//             key: "Location",
//             width: 150,
//             render: (_, record) => <span>{record.Location || "-"}</span>,
//           },
//           {
//             title: "Trạng Thái",
//             dataIndex: "Status",
//             key: "Status",
//             width: 150,
//             render: () => <span>Thu hồi</span>,
//           },
//           {
//             title: "Tình trạng",
//             dataIndex: "DeviceStatus",
//             key: "DeviceStatus",
//             width: 170,
//             render: (_, record) =>
//               record.isNew || editingRowId === record.id ? (
//                 <Select
//                   style={{ width: "100%" }}
//                   value={record.DeviceStatus}
//                   onChange={(value) => {
//                     const handler = record.isNew
//                       ? handleInputChange
//                       : handleSavedInputChange;
//                     handler(record.id, "DeviceStatus", value, "retrieve");
//                   }}
//                   options={devicesoldtatusOptions}
//                   placeholder="Chọn trạng thái"
//                 />
//               ) : (
//                 <span>{record.DeviceStatus}</span>
//               ),
//           },
//           {
//             title: "Ghi Chú",
//             dataIndex: "Note",
//             key: "Note",
//             width: 200,
//             render: (_, record) =>
//               record.isNew || editingRowId === record.id ? (
//                 <Input
//                   value={record.Note || ""}
//                   onChange={(e) => {
//                     const handler = record.isNew
//                       ? handleInputChange
//                       : handleSavedInputChange;
//                     handler(record.id, "Note", e.target.value, "retrieve");
//                   }}
//                   style={{ width: "100%" }}
//                   placeholder="Nhập ghi chú"
//                 />
//               ) : (
//                 <span>{record.Note || "-"}</span>
//               ),
//           },
//           {
//             title: "Số Phiếu",
//             dataIndex: "Votes",
//             key: "Votes",
//             width: 180,
//             render: (_, record) => <span>{record.Votes || "-"}</span>,
//           },

//           {
//             title: "Vị trí nhận",
//             dataIndex: "Store",
//             key: "Store",
//             width: 150,
//             render: (_, record) => {
//               if (record.isNew) {
//                 // 👉 Row mới: Select trống, user phải chọn
//                 return (
//                   <Select
//                     style={{ width: "100%" }}
//                     value={undefined}
//                     onChange={(value) =>
//                       handleInputChange(record.id, "Store", value, "retrieve")
//                     }
//                     options={storeOptions.map((loc) => ({
//                       value: loc,
//                       label: loc,
//                     }))}
//                     placeholder="Chọn vị trí"
//                   />
//                 );
//               }

//               if (editingRowId === record.id) {
//                 // 👉 Row đang edit: cho phép đổi giá trị
//                 return (
//                   <Select
//                     style={{ width: "100%" }}
//                     value={record.Store}
//                     onChange={(value) =>
//                       handleSavedInputChange(
//                         record.id,
//                         "Store",
//                         value,
//                         "retrieve"
//                       )
//                     }
//                     options={storeOptions.map((loc) => ({
//                       value: loc,
//                       label: loc,
//                     }))}
//                   />
//                 );
//               }

//               // 👉 Row bình thường: chỉ text
//               return <span>{record.Store || "-"}</span>;
//             },
//           },
//           {
//             title: "Hành động",
//             key: "action",
//             render: (_, record) => {
//               const isCreator = ticket?.attributes?.Person === account?.Name;
//               const isPending = ticket?.attributes?.Status === "Đang tạo phiếu";
//               const canDelete = isCreator && isPending;

//               if (record.isNew) {
//                 return canDelete ? (
//                   <Popconfirm
//                     title="Bạn có chắc muốn xóa dữ liệu hàng này?"
//                     onConfirm={() => handleDeleteRow(record.id, "retrieve")}
//                     okText="Có"
//                     cancelText="Không"
//                   >
//                     <Button type="danger" icon={<DeleteOutlined />} />
//                   </Popconfirm>
//                 ) : null;
//               } else {
//                 if (editingRowId === record.id) {
//                   return (
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         gap: "5px",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {ticket?.attributes?.Status === "Đang tạo phiếu" && (
//                         <Button
//                           type="primary"
//                           onClick={() => handleUpdateRow(record.id, "retrieve")}
//                         >
//                           Lưu
//                         </Button>
//                       )}
//                       <Button onClick={() => setEditingRowId(null)}>Hủy</Button>
//                     </div>
//                   );
//                 } else {
//                   return (
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         gap: "5px",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Button
//                         type="default"
//                         icon={<EditOutlined style={{ color: "#1890ff" }} />}
//                         onClick={() => setEditingRowId(record.id)}
//                       />
//                       {canDelete && (
//                         <Popconfirm
//                           title="Bạn có chắc muốn xóa dữ liệu hàng này?"
//                           onConfirm={() =>
//                             handleDeleteSavedRow(record.id, "retrieve")
//                           }
//                           okText="Có"
//                           cancelText="Không"
//                         >
//                           <Button type="danger" icon={<DeleteOutlined />} />
//                         </Popconfirm>
//                       )}
//                       <Button
//                         type="primary"
//                         icon={<PrinterOutlined />}
//                         onClick={() => {
//                           console.log("Record:", record);
//                           setSelectedDevice(record);
//                           setIsPrintModalOpenR(true);
//                         }}
//                       >
//                         In Nhãn
//                       </Button>
//                     </div>
//                   );
//                 }
//               }
//             },
//             width: 120,
//           },
//         ]}
//         scroll={{ x: "max-content" }}
//       />
//       {ticket?.attributes?.Status === "Đang tạo phiếu" &&
//         ticket?.attributes?.Person === account?.Name && (
//           <Button
//             type="dashed"
//             onClick={() => handleAddRow("retrieve")}
//             style={{ marginTop: 10, marginLeft: 10 }}
//           >
//             ➕ Thêm Hàng (Thu hồi)
//           </Button>
//         )}
//       <PrintTicketModal
//         isOpen={printVisible}
//         onClose={() => setPrintVisible(false)}
//         ticket={ticket || { attributes: {} }}
//         handoverDevices={handoverDevicesData || []}
//         retrieveDevices={retrieveDevicesData || []}
//         autoPrint={true}
//       />
//       <PrintLabelModalRetrieve
//         visible={isPrintModalOpenR}
//         onClose={() => setIsPrintModalOpenR(false)}
//         deviceData={selectedDevice}
//       />
//       <PrintLabelModalHandover
//         visible={isPrintModalOpenH}
//         onClose={() => setIsPrintModalOpenH(false)}
//         deviceData={selectedDevice}
//       />
//     </Modal>
//   );
// };

// export default TicketModal;


import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Table,
  message,
  AutoComplete,
  Select,
  DatePicker,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  createDevicesDetailHandover,
  updateDevicesDetailHandover,
  createDevicesDetailRetrieve,
  updateDevicesDetailRetrieve,
  fetchDeviceDetailHandover,
  fetchDeviceDetailRetrieve,
  deleteDeviceDetailHandover,
  deleteDeviceDetailRetrieve,
  updateTicketStatus,
  updateDeviceBySerial,
} from "../../../../services/storeServices";
import PrintTicketModal from "./PrintTicketModal";
import PrintLabelModalRetrieve from "./PrintLabelModalRetrieve";
import PrintLabelModalHandover from "./PrintLabelModalHandover";
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckOutlined,
  RollbackOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const TicketModal = ({
  isOpen,
  onClose,
  ticket,
  fetchDevices,
  fetchTickets,
  reloadTickets,
  serialNumberOptions = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [handoverDevicesData, setHandoverDevicesData] = useState([]);
  const [retrieveDevicesData, setRetrieveDevicesData] = useState([]);
  const [newHandoverDevices, setNewHandoverDevices] = useState([]);
  const [newRetrieveDevices, setNewRetrieveDevices] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [printVisible, setPrintVisible] = useState(false);
  const [isPrintModalOpenH, setIsPrintModalOpenH] = useState(false);
  const [isPrintModalOpenR, setIsPrintModalOpenR] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    // Sửa: bỏ .attributes
    if (isOpen && ticket?.Votes) {
      console.log("Ticket value:", ticket.Votes);
      fetchDeviceDetailHandover(ticket.Votes)
        .then((responseData) => {
          // Strapi v5: responseData thường là mảng trực tiếp hoặc trong data
          const data = Array.isArray(responseData) ? responseData : (responseData.data || []);
          const devices = data.map((item) => ({
            ...item, // Sửa: bỏ .attributes, spread trực tiếp item
            id: item.id || item.documentId // fallback id
          }));

          console.log("Mapped handover devices:", devices);
          setHandoverDevicesData(devices);
        })
        .catch((error) => {
          console.error("Lỗi tải thiết bị bàn giao:", error);
          message.error("Lỗi tải thiết bị bàn giao.");
        });

      fetchDeviceDetailRetrieve(ticket.Votes)
        .then((responseData) => {
          const data = Array.isArray(responseData) ? responseData : (responseData.data || []);
          const devices = data.map((item) => ({
            ...item, // Sửa: bỏ .attributes
            id: item.id || item.documentId
          }));

          console.log("Mapped retrieve devices:", devices);
          setRetrieveDevicesData(devices);
        })
        .catch((error) => {
          console.error("Lỗi tải thiết bị thu hồi:", error);
          message.error("Lỗi tải thiết bị thu hồi.");
        });
    }
  }, [isOpen, ticket?.Votes]); // Sửa dependency

  useEffect(() => {
    if (!isOpen) {
      setHandoverDevicesData([]);
      setRetrieveDevicesData([]);
      setNewHandoverDevices([]);
      setNewRetrieveDevices([]);
      setEditingRowId(null);
    }
  }, [isOpen]);

  const combinedHandoverData = [...handoverDevicesData, ...newHandoverDevices];
  const combinedRetrieveData = [...retrieveDevicesData, ...newRetrieveDevices];

  const statusOptions = [
    { value: "Đang sử dụng", label: "Đang sử dụng" }
  ];

  const devicestatusOptions = [
    { value: "Thiết bị mới", label: "Thiết bị mới" },
    { value: "Thiết bị cũ", label: "Thiết bị cũ" }
  ];
  const devicesoldtatusOptions = [
    { value: "Hỏng", label: "Hỏng" },
    { value: "Hết hạn sử dụng", label: "Hết hạn sử dụng" },
    { value: "Đóng cửa", label: "Đóng cửa" }
  ];

  const handleAddRow = (type) => {
    if (!ticket) {
      message.error("Vui lòng chọn phiếu trước khi thêm thiết bị!");
      return;
    }
    const newDevice = {
      id: Date.now(),
      Customer: ticket.Customer || "", // Sửa: bỏ .attributes
      DeliveryDate: "",
      DeviceName: "",
      BrandName: "",
      Model: "",
      SerialNumber: "",
      Store:
        type === "handover"
          ? ticket.Store // Sửa: bỏ .attributes
          : undefined,
      Location: "",
      Status: type === "handover" ? "Đang sử dụng" : "Thu hồi",
      DeviceStatus: "",
      Note: "",
      Votes: ticket.Votes, // Sửa: bỏ .attributes
      StoreRecall: ticket.Store, // Sửa: bỏ .attributes
      isNew: true,
      Type: type === "handover" ? "Bàn giao" : "Thu hồi",
    };
    if (type === "handover") {
      setNewHandoverDevices((prev) => [...prev, newDevice]);
    } else if (type === "retrieve") {
      setNewRetrieveDevices((prev) => [...prev, newDevice]);
    }
  };

  const handleInputChange = (id, field, value, type) => {
    if (type === "handover") {
      setNewHandoverDevices((prev) =>
        prev.map((device) =>
          device.id === id ? { ...device, [field]: value } : device
        )
      );
    } else if (type === "retrieve") {
      setNewRetrieveDevices((prev) =>
        prev.map((device) =>
          device.id === id ? { ...device, [field]: value } : device
        )
      );
    }
  };

  const handleSavedInputChange = (id, field, value, type) => {
    if (type === "handover") {
      setHandoverDevicesData((prev) =>
        prev.map((device) =>
          device.id === id ? { ...device, [field]: value } : device
        )
      );
    } else if (type === "retrieve") {
      setRetrieveDevicesData((prev) =>
        prev.map((device) =>
          device.id === id ? { ...device, [field]: value } : device
        )
      );
    }
  };

  const handleSerialNumberChange = (value, record, type) => {
    const selectedDevice = serialNumberOptions.find(
      (option) => option.value === value
    );
    const updateFunction =
      type === "handover"
        ? editingRowId === record.id
          ? handleSavedInputChange
          : setNewHandoverDevices
        : editingRowId === record.id
          ? handleSavedInputChange
          : setNewRetrieveDevices;

    if (editingRowId === record.id || record.isNew === false) {
      if (type === "handover") {
        setHandoverDevicesData((prev) =>
          prev.map((device) =>
            device.id === record.id
              ? {
                ...device,
                SerialNumber: value,
                DeviceName: selectedDevice ? selectedDevice.DeviceName : "",
                BrandName: selectedDevice ? selectedDevice.BrandName : "",
                Model: selectedDevice ? selectedDevice.Model : "",
                DeliveryDate: selectedDevice
                  ? selectedDevice.DeliveryDate
                  : ticket?.Date || "", // Sửa: bỏ .attributes
                Location: selectedDevice ? selectedDevice.Location : "",
                Status: "Đang sử dụng",
                Note: selectedDevice ? selectedDevice.Note : "",
              }
              : device
          )
        );
      } else {
        setRetrieveDevicesData((prev) =>
          prev.map((device) =>
            device.id === record.id
              ? {
                ...device,
                SerialNumber: value,
                DeviceName: selectedDevice ? selectedDevice.DeviceName : "",
                BrandName: selectedDevice ? selectedDevice.BrandName : "",
                Model: selectedDevice ? selectedDevice.Model : "",
                DeliveryDate: selectedDevice
                  ? selectedDevice.DeliveryDate
                  : ticket?.Date || "", // Sửa: bỏ .attributes
                Location: selectedDevice ? selectedDevice.Location : "",
                Status: "Thu hồi",
                Note: selectedDevice ? selectedDevice.Note : "",
              }
              : device
          )
        );
      }
    } else {
      updateFunction((prev) =>
        prev.map((device) =>
          device.id === record.id
            ? {
              ...device,
              SerialNumber: value,
              DeviceName: selectedDevice ? selectedDevice.DeviceName : "",
              BrandName: selectedDevice ? selectedDevice.BrandName : "",
              Model: selectedDevice ? selectedDevice.Model : "",
              DeliveryDate: selectedDevice
                ? selectedDevice.DeliveryDate
                : ticket?.Date || "", // Sửa: bỏ .attributes
              Location: selectedDevice ? selectedDevice.Location : "",
              Status: type === "handover" ? "Đang sử dụng" : "Thu hồi",
              Note: selectedDevice ? selectedDevice.Note : "",
            }
            : device
        )
      );
    }
  };

  const handleDeleteRow = (id, type) => {
    if (type === "handover") {
      setNewHandoverDevices((prev) =>
        prev.filter((device) => device.id !== id)
      );
    } else if (type === "retrieve") {
      setNewRetrieveDevices((prev) =>
        prev.filter((device) => device.id !== id)
      );
    }
  };

  const handleUpdateRow = async (id, type) => {
    let device;
    if (type === "handover") {
      device = handoverDevicesData.find((d) => d.id === id);
    } else {
      device = retrieveDevicesData.find((d) => d.id === id);
    }

    if (!device) {
      message.warning("Thiết bị không hợp lệ để cập nhật.");
      return;
    }

    try {
      setLoading(true);

      if (type === "handover") {
        await updateDevicesDetailHandover(device.id, {
          ...device, // Sửa: không cần .attributes vì device đã phẳng
          Status: device.Status || "Đang sử dụng",
        });
      } else {
        await updateDevicesDetailRetrieve(device.id, {
          ...device,
          Status: "Thu hồi",
        });
      }

      message.success("Cập nhật thiết bị thành công!");
      setEditingRowId(null);

      fetchDevices();
      fetchTickets();
    } catch (error) {
      console.error("Lỗi khi cập nhật thiết bị:", error);
      message.error("Lỗi khi cập nhật thiết bị.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lưu thiết bị
  const handleSaveNewDevices = async () => {
    setLoading(true);
    try {
      const newDevices = [...newHandoverDevices, ...newRetrieveDevices];
      const requiredFields = [
        "Customer",
        "DeliveryDate",
        "DeviceName",
        "BrandName",
        "Model",
        "SerialNumber",
        "Store",
        "Location",
        "Status",
        "DeviceStatus",
      ];

      // Kiểm tra dữ liệu bắt buộc
      for (const device of newDevices) {
        for (const field of requiredFields) {
          if (!device[field] || device[field].toString().trim() === "") {
            message.warning(
              `Vui lòng điền đầy đủ trường "${field}" cho tất cả các hàng (ngoại trừ "Ghi Chú").`
            );
            return false; // ❌ báo không thành công
          }
        }
      }

      // Lưu thiết bị bàn giao
      const handoverPromises = newHandoverDevices
        .filter((device) => device.SerialNumber)
        .map((device) => {
          const deviceData = {
            ...device,
            Votes: ticket.Votes, // Sửa: bỏ .attributes
            Customer: ticket.Customer, // Sửa: bỏ .attributes
            Store: ticket.Store, // Sửa: bỏ .attributes
            Status: device.Status || "Đang sử dụng",
          };
          console.log("Payload handover deviceData:", deviceData);
          return createDevicesDetailHandover(deviceData);
        });

      // Lưu thiết bị thu hồi
      const retrievePromises = newRetrieveDevices
        .filter((device) => device.SerialNumber)
        .map((device) => {
          const deviceData = {
            ...device,
            Votes: ticket.Votes, // Sửa: bỏ .attributes
            Customer: ticket.Customer, // Sửa: bỏ .attributes
            Status: "Thu hồi",
          };
          console.log("Payload retrieve deviceData:", deviceData);
          return createDevicesDetailRetrieve(deviceData);
        });

      await Promise.all([...handoverPromises, ...retrievePromises]);
      onClose();
      message.success("Lưu thiết bị thành công!");
      fetchDevices();
      fetchTickets();
      return true; // ✅ báo thành công
    } catch (error) {
      console.error("Lỗi khi lưu thiết bị:", error);
      message.error("Lỗi khi lưu thiết bị.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hàm gửi phiếu (xác nhận phiếu)
  const handleConfirmTicket = async () => {
    try {
      setLoading(true);

      // Trước tiên phải lưu thiết bị
      const isSaved = await handleSaveNewDevices();
      if (!isSaved) {
        return; // ❌ Nếu lưu lỗi → không chuyển trạng thái
      }

      // Nếu lưu OK → update trạng thái phiếu
      await updateTicketStatus(ticket.id, "Đang chờ duyệt");
      message.success("Phiếu đã chuyển sang trạng thái 'Đang chờ duyệt'!");

      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }

      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái phiếu:", error);
      message.error("Có lỗi xảy ra khi xác nhận phiếu.");
    } finally {
      setLoading(false);
    }
  };

  //--------------------------------------------------------------------------------
  const handleDeleteSavedRow = async (id, type) => {
    try {
      setLoading(true);
      if (type === "handover") {
        await deleteDeviceDetailHandover(id);
        setHandoverDevicesData((prev) =>
          prev.filter((device) => device.id !== id)
        );
      } else if (type === "retrieve") {
        await deleteDeviceDetailRetrieve(id);
        setRetrieveDevicesData((prev) =>
          prev.filter((device) => device.id !== id)
        );
      }
      message.success("Đã xóa thiết bị thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa thiết bị đã lưu:", error);
      message.error("Lỗi khi xóa thiết bị đã lưu.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTicket = async () => {
    try {
      setLoading(true);

      const savedDevices = [...handoverDevicesData, ...retrieveDevicesData];

      if (savedDevices.length === 0) {
        message.warning("Không có thiết bị đã lưu để duyệt.");
        setLoading(false);
        return;
      }

      const updatePromises = savedDevices.map((device) => {
        if (device.isNew) {
          console.warn(
            `Bỏ qua thiết bị mới (chưa lưu): ${device.SerialNumber}`
          );
          return Promise.resolve(null);
        }

        const updatedData = {
          ...device, // Sửa: đã phẳng, không cần .attributes
          DeliveryDate: device.DeliveryDate || null,
          Status: device.Status,
          Note: device.Note
        };

        return updateDeviceBySerial(device.SerialNumber, updatedData);
      });

      await Promise.all(updatePromises);

      await updateTicketStatus(ticket.id, "Đã duyệt");

      message.success("Duyệt phiếu thành công!");
      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }

      fetchDevices();
      onClose();
    } catch (error) {
      console.error("Lỗi duyệt phiếu:", error);
      message.error("Lỗi duyệt phiếu.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnTicket = async () => {
    try {
      setLoading(true);
      await updateTicketStatus(ticket.id, "Đang tạo phiếu");
      message.success("Phiếu đã được trả về trạng thái 'Đang tạo phiếu'!");
      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }
      onClose();
    } catch (error) {
      message.error("Lỗi khi trả phiếu!");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdminTicket = async () => {
    try {
      setLoading(true);
      await updateTicketStatus(ticket.id, "Đã nhận phiếu");
      message.success("Phiếu đã được trả về trạng thái 'Đã nhận phiếu'!");
      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }
      onClose();
    } catch (error) {
      message.error("Lỗi khi trả phiếu!");
    } finally {
      setLoading(false);
    }
  };

  const locationOptions = [
    "POS01",
    "POS02",
    "POS03",
    "POS04",
    "POS05",
    "POS06",
    "Server",
    "RACK",
    "KD01",
    "KD02",
    "KP01",
    "KP02",
    "KP03",
    "KP04",
    "KP05",
    "AP01",
    "AP02",
    "WIFI01",
    "WIFI02",
    "Handy01",
    "Handy02",
    "Handy03",
    "Handy04",
    "Handy05",
    "Handy06",
    "Handy07",
    "Handy08",
  ];
  const storeOptions = ["DHG", "FMV", "Kohnan", "Sukiya", "Colowide"];
  const deviceOptions = [
    { value: "POS", label: "POS" },
    { value: "Drawer", label: "Drawer" },
    { value: "Scanner", label: "Scanner" },
    { value: "Printer", label: "Printer" },
    { value: "Keyboard", label: "Keyboard" },
    { value: "Handy", label: "Handy" },
    { value: "Switch", label: "Switch" },
    { value: "Monitor", label: "Monitor" },
    { value: "UPS", label: "UPS" },
    { value: "WIFI", label: "WIFI" },
    { value: "Mouse", label: "Mouse" },
    { value: "Server", label: "Server" },
    { value: "Hard Drive", label: "Hard Drive" },
    { value: "PCC", label: "PCC" },
    { value: "Laptop", label: "Laptop" },
    { value: "PDA", label: "PDA" },
    { value: "KD", label: "KD" },
    { value: "KP", label: "KP" },
    { value: "Cisco", label: "Cisco" },
    { value: "Router", label: "Router" },
    { value: "AP", label: "AP" },
    { value: "Firewall", label: "Firewall" },
    { value: "POE", label: "POE" },
    { value: "Rack", label: "Rack" },
    { value: "Arm", label: "Arm" },
    { value: "Giá treo gỗ", label: "Giá treo gỗ" },
    { value: "Ổ điện", label: "Ổ điện" },
  ];

  const brandOptions = [
    { value: "Toshiba", label: "Toshiba" },
    { value: "Maken", label: "Maken" },
    { value: "Aida", label: "Aida" },
    { value: "Datalogic", label: "Datalogic" },
    { value: "Dell", label: "Dell" },
    { value: "VSP", label: "VSP" },
    { value: "Tplink", label: "Tplink" },
    { value: "Ares", label: "Ares" },
    { value: "Brother", label: "Brother" },
    { value: "Canon", label: "Canon" },
    { value: "Cisco", label: "Cisco" },
  ];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <Modal
      title="Chi Tiết Phiếu"
      open={isOpen}
      onCancel={onClose}
      getContainer={document.body}
      footer={[
        <Button key="cancel" icon={<CloseOutlined />} onClick={onClose}>
          Đóng
        </Button>,
        account.Leader === true &&
        ticket?.Status === "Đang chờ duyệt" && ( // Sửa: bỏ .attributes
          <Button
            key="return"
            type="default"
            danger
            icon={<RollbackOutlined />}
            onClick={handleReturnTicket}
          >
            Trả Phiếu
          </Button>
        ),
        account.Leader === true &&
        ticket?.Status === "Đang chờ duyệt" && ( // Sửa: bỏ .attributes
          <Button
            key="approve"
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleApproveTicket}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Duyệt Phiếu
          </Button>
        ),
        ticket?.Status === "Đang tạo phiếu" && // Sửa: bỏ .attributes
        ticket?.Person === account?.Name && ( // Sửa: bỏ .attributes
          <Button
            key="saveNew"
            type="default"
            icon={<SaveOutlined />}
            onClick={handleSaveNewDevices}
          >
            Lưu
          </Button>
        ),
        ticket?.Status === "Đang tạo phiếu" && // Sửa: bỏ .attributes
        ticket?.Person === account?.Name && ( // Sửa: bỏ .attributes
          <Button
            key="confirm"
            type="primary"
            icon={<FileDoneOutlined />}
            onClick={handleConfirmTicket}
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
          >
            Gửi Phiếu
          </Button>
        ),
        account.Receivelist === true &&
        ticket?.Status === "Đã duyệt" && ( // Sửa: bỏ .attributes
          <Button
            key="confirm"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleConfirmAdminTicket}
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
          >
            Nhận Phiếu
          </Button>
        ),
        ticket?.Status === "Đang chờ duyệt" && // Sửa: bỏ .attributes
        ticket?.Person === account?.Name && // Sửa: bỏ .attributes
        (
          <Button
            key="print"
            type="primary"
            onClick={() => setPrintVisible(true)}
          >
            In Phiếu
          </Button>
        ),
      ]}
      width="75vw"
      style={{ maxWidth: "1200px" }}
    >
      <h3>Thiết Bị Bàn Giao</h3>
      <Table
        dataSource={combinedHandoverData}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: "Khách Hàng",
            dataIndex: "Customer",
            key: "Customer",
            width: 150,
            render: (_, record) =>
              record.isNew ? (
                <Input
                  value={record.Customer}
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    handleInputChange(
                      record.id,
                      "Customer",
                      e.target.value,
                      "handover"
                    )
                  }
                  placeholder="Nhập khách hàng"
                />
              ) : (
                <span>{record.Customer || "-"}</span>
              ),
          },
          {
            title: "Số Serial",
            dataIndex: "SerialNumber",
            key: "SerialNumber",
            width: 240,
            render: (_, record) => {
              const selectedSerials = combinedHandoverData
                .filter((device) => device.id !== record.id)
                .map((device) => device.SerialNumber);

              const filteredOptions = serialNumberOptions.filter(
                (option) =>
                  option.Store === "DHG" &&
                  option.label &&
                  !selectedSerials.includes(option.value)
              );

              if (record.isNew || editingRowId === record.id) {
                return (
                  <div style={{ position: "relative" }}>
                    <AutoComplete
                      options={filteredOptions}
                      style={{ width: "100%", height: "32px" }}
                      onChange={(value) =>
                        handleSerialNumberChange(value, record, "handover")
                      }
                      value={record.SerialNumber || ""}
                      placeholder="Nhập số serial"
                      filterOption={(inputValue, option) => {
                        const label = option?.label || "";
                        return label
                          .toUpperCase()
                          .includes(inputValue?.toUpperCase() || "");
                      }}
                    />
                    {!record.SerialNumber && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-18px",
                          left: 0,
                          color: "red",
                          fontSize: "12px",
                        }}
                      >
                        * Vui lòng nhập số serial
                      </span>
                    )}
                  </div>
                );
              }
              return <span>{record.SerialNumber || "-"}</span>;
            },
          },
          {
            title: "Ngày Giao",
            dataIndex: "DeliveryDate",
            key: "DeliveryDate",
            width: 150,
            render: (_, record) => {
              const dateValue = record.DeliveryDate
                ? dayjs(record.DeliveryDate, "YYYY-MM-DD")
                : null;

              const handleChange = (date) => {
                const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                const handler = record.isNew
                  ? handleInputChange
                  : handleSavedInputChange;
                handler(record.id, "DeliveryDate", formattedDate, "handover");
              };

              if (record.isNew || editingRowId === record.id) {
                return (
                  <Tooltip
                    title={
                      record.DeliveryDate
                        ? `Ngày gốc: ${dayjs(record.DeliveryDate).format(
                          "DD-MM-YYYY"
                        )}`
                        : "Chưa có"
                    }
                  >
                    <DatePicker
                      value={dateValue}
                      onChange={handleChange}
                      format="DD-MM-YYYY"
                      placeholder="Chọn ngày giao"
                      size="small"
                      style={{ width: "100%" }}
                      disabledDate={(current) =>
                        current &&
                        current < dayjs().subtract(1, "month").startOf("day")
                      }
                    />
                  </Tooltip>
                );
              }
              return (
                <span>
                  {record.DeliveryDate
                    ? dayjs(record.DeliveryDate).format("DD-MM-YYYY")
                    : "-"}
                </span>
              );
            },
          },
          {
            title: "Tên Thiết Bị",
            dataIndex: "DeviceName",
            key: "DeviceName",
            width: 180,
            render: (_, record) =>
              record.isNew || editingRowId === record.id ? (
                <Select
                  showSearch
                  value={record.DeviceName || undefined}
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    if (record.isNew) {
                      handleInputChange(
                        record.id,
                        "DeviceName",
                        value,
                        "handover"
                      );
                    } else {
                      handleSavedInputChange(
                        record.id,
                        "DeviceName",
                        value,
                        "handover"
                      );
                    }
                  }}
                  options={deviceOptions}
                  placeholder="Chọn thiết bị"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              ) : (
                <span>{record.DeviceName || "-"}</span>
              ),
          },
          {
            title: "Thương Hiệu",
            dataIndex: "BrandName",
            key: "BrandName",
            width: 150,
            render: (_, record) => <span>{record.BrandName || "-"}</span>,
          },
          {
            title: "Model",
            dataIndex: "Model",
            key: "Model",
            width: 220,
            render: (_, record) => <span>{record.Model || "-"}</span>,
          },
          {
            title: "Cửa Hàng",
            dataIndex: "Store",
            key: "Store",
            width: 150,
            render: (_, record) => <span>{record.Store || "-"}</span>,
          },
          {
            title: "Vị Trí",
            dataIndex: "Location",
            key: "Location",
            width: 150,
            render: (_, record) =>
              record.isNew || editingRowId === record.id ? (
                <Select
                  style={{ width: "100%" }}
                  value={record.Location || null}
                  onChange={(value) => {
                    const handler = record.isNew
                      ? handleInputChange
                      : handleSavedInputChange;
                    handler(record.id, "Location", value, "handover");
                  }}
                  options={locationOptions.map((loc) => ({
                    value: loc,
                    label: loc,
                  }))}
                  placeholder="Chọn vị trí"
                />
              ) : (
                <span>{record.Location || "-"}</span>
              ),
          },
          {
            title: "Trạng Thái",
            dataIndex: "Status",
            key: "Status",
            width: 150,
            render: (_, record) =>
              record.isNew || editingRowId === record.id ? (
                <Select
                  style={{ width: "100%" }}
                  value={record.Status || "Đang sử dụng"}
                  onChange={(value) => {
                    const handler = record.isNew
                      ? handleInputChange
                      : handleSavedInputChange;
                    handler(record.id, "Status", value, "handover");
                  }}
                  options={statusOptions}
                  placeholder="Chọn trạng thái"
                />
              ) : (
                <span>{record.Status || "Đang sử dụng"}</span>
              ),
          },
          {
            title: "Tình trạng",
            dataIndex: "DeviceStatus",
            key: "DeviceStatus",
            width: 150,
            render: (_, record) =>
              record.isNew || editingRowId === record.id ? (
                <Select
                  style={{ width: "100%" }}
                  value={record.DeviceStatus}
                  onChange={(value) => {
                    const handler = record.isNew
                      ? handleInputChange
                      : handleSavedInputChange;
                    handler(record.id, "DeviceStatus", value, "handover");
                  }}
                  options={devicestatusOptions}
                  placeholder="Chọn trạng thái"
                />
              ) : (
                <span>{record.DeviceStatus}</span>
              ),
          },
          {
            title: "Ghi Chú",
            dataIndex: "Note",
            key: "Note",
            width: 200,
            render: (_, record) =>
              record.isNew || editingRowId === record.id ? (
                <Input
                  value={record.Note || ""}
                  onChange={(e) => {
                    const handler = record.isNew
                      ? handleInputChange
                      : handleSavedInputChange;
                    handler(record.id, "Note", e.target.value, "handover");
                  }}
                  style={{ width: "100%" }}
                  placeholder="Nhập ghi chú"
                />
              ) : (
                <span>{record.Note || "-"}</span>
              ),
          },
          {
            title: "Số Phiếu",
            dataIndex: "Votes",
            key: "Votes",
            width: 180,
            render: (_, record) => <span>{record.Votes || "-"}</span>,
          },
          {
            title: "Hành động",
            key: "action",
            render: (_, record) => {
              const isCreator = ticket?.Person === account?.Name; // Sửa: bỏ .attributes
              const isPending = ticket?.Status === "Đang tạo phiếu"; // Sửa: bỏ .attributes
              const canDelete = isCreator && isPending;

              if (record.isNew) {
                return canDelete ? (
                  <Popconfirm
                    title="Bạn có chắc muốn xóa dữ liệu hàng này?"
                    onConfirm={() => handleDeleteRow(record.id, "handover")}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button type="danger" icon={<DeleteOutlined />} />
                  </Popconfirm>
                ) : null;
              } else {
                if (editingRowId === record.id) {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      {ticket?.Status === "Đang tạo phiếu" && ( // Sửa: bỏ .attributes
                        <Button
                          type="primary"
                          onClick={() => handleUpdateRow(record.id, "handover")}
                        >
                          Lưu
                        </Button>
                      )}
                      <Button onClick={() => setEditingRowId(null)}>Hủy</Button>
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        type="default"
                        icon={<EditOutlined style={{ color: "#1890ff" }} />}
                        onClick={() => setEditingRowId(record.id)}
                      />
                      {canDelete && (
                        <Popconfirm
                          title="Bạn có chắc muốn xóa dữ liệu hàng này?"
                          onConfirm={() =>
                            handleDeleteSavedRow(record.id, "handover")
                          }
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button type="danger" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      )}
                      <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={() => {
                          console.log("Record:", record);
                          setSelectedDevice(record);
                          setIsPrintModalOpenH(true);
                        }}
                      >
                        In Nhãn
                      </Button>
                    </div>
                  );
                }
              }
            },
            width: 120,
          },
        ]}
        scroll={{ x: "max-content" }}
      />
      {ticket?.Status === "Đang tạo phiếu" && // Sửa: bỏ .attributes
        ticket?.Person === account?.Name && ( // Sửa: bỏ .attributes
          <Button
            type="dashed"
            onClick={() => handleAddRow("handover")}
            style={{ marginTop: 10, marginLeft: 10 }}
          >
            ➕ Thêm Hàng (Bàn giao)
          </Button>
        )}

      <h3 style={{ marginTop: 20 }}>Thiết Bị Thu Hồi</h3>
      <Table
        dataSource={combinedRetrieveData}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: "Khách Hàng",
            dataIndex: "Customer",
            key: "Customer",
            width: 150,
            render: (_, record) =>
              record.isNew ? (
                <Input
                  value={record.Customer}
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    handleInputChange(
                      record.id,
                      "Customer",
                      e.target.value,
                      "retrieve"
                    )
                  }
                />
              ) : (
                <span>{record.Customer || "-"}</span>
              ),
          },
          {
            title: "Số Serial",
            dataIndex: "SerialNumber",
            key: "SerialNumber",
            width: 240,
            render: (_, record) => {
              const selectedSerials = combinedRetrieveData
                .filter((device) => device.id !== record.id)
                .map((device) => device.SerialNumber);

              const filteredOptions = serialNumberOptions.filter(
                (option) =>
                  option.Store === ticket?.Store && // Sửa: bỏ .attributes
                  option.label &&
                  !selectedSerials.includes(option.value)
              );

              const isEditing = editingRowId === record.id;

              return record.isNew || isEditing ? (
                <div style={{ position: "relative" }}>
                  <AutoComplete
                    options={filteredOptions}
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      handleSerialNumberChange(value, record, "retrieve")
                    }
                    value={record.SerialNumber || ""}
                    placeholder="Nhập số serial"
                    filterOption={(inputValue, option) => {
                      const label = option?.label || "";
                      return label
                        .toUpperCase()
                        .includes(inputValue?.toUpperCase() || "");
                    }}
                  />
                  {!record.SerialNumber && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-18px",
                        left: 0,
                        color: "red",
                        fontSize: "12px",
                      }}
                    >
                      * Vui lòng nhập số serial
                    </span>
                  )}
                </div>
              ) : (
                <span>{record.SerialNumber || "-"}</span>
              );
            },
          },
          {
            title: "Ngày Giao",
            dataIndex: "DeliveryDate",
            key: "DeliveryDate",
            width: 150,
            render: (_, record) => <span>{record.DeliveryDate || "-"}</span>,
          },
          {
            title: "Tên Thiết Bị",
            dataIndex: "DeviceName",
            key: "DeviceName",
            width: 180,
            render: (_, record) => <span>{record.DeviceName || "-"}</span>,
          },
          {
            title: "Thương Hiệu",
            dataIndex: "BrandName",
            key: "BrandName",
            width: 150,
            render: (_, record) => <span>{record.BrandName || "-"}</span>,
          },
          {
            title: "Model",
            dataIndex: "Model",
            key: "Model",
            width: 220,
            render: (_, record) => <span>{record.Model || "-"}</span>,
          },
          {
            title: "Cửa Hàng",
            dataIndex: "StoreRecall",
            key: "StoreRecall",
            width: 150,
            render: (_, record) => <span>{record.StoreRecall || "-"}</span>,
          },
          {
            title: "Vị Trí",
            dataIndex: "Location",
            key: "Location",
            width: 150,
            render: (_, record) => <span>{record.Location || "-"}</span>,
          },
          {
            title: "Trạng Thái",
            dataIndex: "Status",
            key: "Status",
            width: 150,
            render: () => <span>Thu hồi</span>,
          },
          {
            title: "Tình trạng",
            dataIndex: "DeviceStatus",
            key: "DeviceStatus",
            width: 170,
            render: (_, record) =>
              record.isNew || editingRowId === record.id ? (
                <Select
                  style={{ width: "100%" }}
                  value={record.DeviceStatus}
                  onChange={(value) => {
                    const handler = record.isNew
                      ? handleInputChange
                      : handleSavedInputChange;
                    handler(record.id, "DeviceStatus", value, "retrieve");
                  }}
                  options={devicesoldtatusOptions}
                  placeholder="Chọn trạng thái"
                />
              ) : (
                <span>{record.DeviceStatus}</span>
              ),
          },
          {
            title: "Ghi Chú",
            dataIndex: "Note",
            key: "Note",
            width: 200,
            render: (_, record) =>
              record.isNew || editingRowId === record.id ? (
                <Input
                  value={record.Note || ""}
                  onChange={(e) => {
                    const handler = record.isNew
                      ? handleInputChange
                      : handleSavedInputChange;
                    handler(record.id, "Note", e.target.value, "retrieve");
                  }}
                  style={{ width: "100%" }}
                  placeholder="Nhập ghi chú"
                />
              ) : (
                <span>{record.Note || "-"}</span>
              ),
          },
          {
            title: "Số Phiếu",
            dataIndex: "Votes",
            key: "Votes",
            width: 180,
            render: (_, record) => <span>{record.Votes || "-"}</span>,
          },

          {
            title: "Vị trí nhận",
            dataIndex: "Store",
            key: "Store",
            width: 150,
            render: (_, record) => {
              if (record.isNew) {
                // 👉 Row mới: Select trống, user phải chọn
                return (
                  <Select
                    style={{ width: "100%" }}
                    value={undefined}
                    onChange={(value) =>
                      handleInputChange(record.id, "Store", value, "retrieve")
                    }
                    options={storeOptions.map((loc) => ({
                      value: loc,
                      label: loc,
                    }))}
                    placeholder="Chọn vị trí"
                  />
                );
              }

              if (editingRowId === record.id) {
                // 👉 Row đang edit: cho phép đổi giá trị
                return (
                  <Select
                    style={{ width: "100%" }}
                    value={record.Store}
                    onChange={(value) =>
                      handleSavedInputChange(
                        record.id,
                        "Store",
                        value,
                        "retrieve"
                      )
                    }
                    options={storeOptions.map((loc) => ({
                      value: loc,
                      label: loc,
                    }))}
                  />
                );
              }

              // 👉 Row bình thường: chỉ text
              return <span>{record.Store || "-"}</span>;
            },
          },
          {
            title: "Hành động",
            key: "action",
            render: (_, record) => {
              const isCreator = ticket?.Person === account?.Name; // Sửa: bỏ .attributes
              const isPending = ticket?.Status === "Đang tạo phiếu"; // Sửa: bỏ .attributes
              const canDelete = isCreator && isPending;

              if (record.isNew) {
                return canDelete ? (
                  <Popconfirm
                    title="Bạn có chắc muốn xóa dữ liệu hàng này?"
                    onConfirm={() => handleDeleteRow(record.id, "retrieve")}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button type="danger" icon={<DeleteOutlined />} />
                  </Popconfirm>
                ) : null;
              } else {
                if (editingRowId === record.id) {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      {ticket?.Status === "Đang tạo phiếu" && ( // Sửa: bỏ .attributes
                        <Button
                          type="primary"
                          onClick={() => handleUpdateRow(record.id, "retrieve")}
                        >
                          Lưu
                        </Button>
                      )}
                      <Button onClick={() => setEditingRowId(null)}>Hủy</Button>
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        type="default"
                        icon={<EditOutlined style={{ color: "#1890ff" }} />}
                        onClick={() => setEditingRowId(record.id)}
                      />
                      {canDelete && (
                        <Popconfirm
                          title="Bạn có chắc muốn xóa dữ liệu hàng này?"
                          onConfirm={() =>
                            handleDeleteSavedRow(record.id, "retrieve")
                          }
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button type="danger" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      )}
                      <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={() => {
                          console.log("Record:", record);
                          setSelectedDevice(record);
                          setIsPrintModalOpenR(true);
                        }}
                      >
                        In Nhãn
                      </Button>
                    </div>
                  );
                }
              }
            },
            width: 120,
          },
        ]}
        scroll={{ x: "max-content" }}
      />
      {ticket?.Status === "Đang tạo phiếu" && // Sửa: bỏ .attributes
        ticket?.Person === account?.Name && ( // Sửa: bỏ .attributes
          <Button
            type="dashed"
            onClick={() => handleAddRow("retrieve")}
            style={{ marginTop: 10, marginLeft: 10 }}
          >
            ➕ Thêm Hàng (Thu hồi)
          </Button>
        )}
      <PrintTicketModal
        isOpen={printVisible}
        onClose={() => setPrintVisible(false)}
        ticket={ticket || {}} // Sửa: bỏ attributes rỗng
        handoverDevices={handoverDevicesData || []}
        retrieveDevices={retrieveDevicesData || []}
        autoPrint={true}
      />
      <PrintLabelModalRetrieve
        visible={isPrintModalOpenR}
        onClose={() => setIsPrintModalOpenR(false)}
        deviceData={selectedDevice}
      />
      <PrintLabelModalHandover
        visible={isPrintModalOpenH}
        onClose={() => setIsPrintModalOpenH(false)}
        deviceData={selectedDevice}
      />
    </Modal>
  );
};

export default TicketModal;
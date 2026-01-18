import React, { useState, useEffect, useMemo } from "react";
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
  Tabs,
  Tag,
  Space,
  Card,
  Typography,
} from "antd";
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
  PlusOutlined,
  ExportOutlined,
  ImportOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";

// --- Services ---
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
  fetchDeviceListRetrieve, // API Thu Hồi
  fetchDeviceListHandover, // API Bàn Giao
} from "../../../../services/storeServices";

// --- Components ---
import PrintTicketModal from "./PrintTicketModal";
import PrintLabelModalRetrieve from "./PrintLabelModalRetrieve";
import PrintLabelModalHandover from "./PrintLabelModalHandover";

const { TabPane } = Tabs;
const { Text } = Typography;

const TicketModal = ({
  isOpen,
  onClose,
  ticket,
  fetchTickets,
  reloadTickets,
}) => {
  const [loading, setLoading] = useState(false);

  // --- Data hiển thị trên bảng ---
  const [handoverDevicesData, setHandoverDevicesData] = useState([]);
  const [retrieveDevicesData, setRetrieveDevicesData] = useState([]);

  // --- Data mới thêm vào ---
  const [newHandoverDevices, setNewHandoverDevices] = useState([]);
  const [newRetrieveDevices, setNewRetrieveDevices] = useState([]);

  // --- UI State ---
  const [editingRowId, setEditingRowId] = useState(null);
  const [printVisible, setPrintVisible] = useState(false);
  const [isPrintModalOpenH, setIsPrintModalOpenH] = useState(false);
  const [isPrintModalOpenR, setIsPrintModalOpenR] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  // --- INVENTORY SOURCES ---
  const [handoverInventory, setHandoverInventory] = useState([]); // Kho DHG
  const [storeInventory, setStoreInventory] = useState([]);       // Kho Cửa hàng

  // --- HÀM XỬ LÝ DATA ---
  const processDevicesToOptions = (devices, defaultStore) => {
    if (!Array.isArray(devices)) return [];

    const uniqueMap = new Map();

    devices.forEach((item) => {
      const attr = item.attributes || item;

      if (attr && attr.SerialNumber) {
        const deviceName = attr.DeviceName || "Không tên";
        const serial = attr.SerialNumber;

        if (!uniqueMap.has(serial)) {
          uniqueMap.set(serial, {
            value: serial,
            label: `${deviceName} - ${serial}`,
            ...attr,
            DeviceName: deviceName,
            Store: attr.Store || defaultStore,
          });
        }
      }
    });

    return Array.from(uniqueMap.values());
  };

  // --- 1. Fetch Data Chi Tiết Phiếu ---
  useEffect(() => {
    if (isOpen && ticket?.Votes) {
      // 1.1 Fetch Chi Tiết Bàn Giao
      fetchDeviceDetailHandover(ticket.Votes)
        .then((res) => {
          const data = Array.isArray(res) ? res : res.data || [];
          setHandoverDevicesData(data.map(i => ({
            ...(i.attributes || i),
            id: i.documentId || i.id
          })));
        })
        .catch(() => message.error("Lỗi tải thiết bị bàn giao."));

      // 1.2 Fetch Chi Tiết Thu Hồi
      fetchDeviceDetailRetrieve(ticket.Votes)
        .then((res) => {
          const data = Array.isArray(res) ? res : res.data || [];
          setRetrieveDevicesData(data.map(i => ({
            ...(i.attributes || i),
            id: i.documentId || i.id
          })));
        })
        .catch(() => message.error("Lỗi tải thiết bị thu hồi."));
    }
  }, [isOpen, ticket?.Votes]);

  // --- 2. Fetch Kho Bàn Giao (DHG) ---
  useEffect(() => {
    if (isOpen) {
      const loadHandoverInventory = async () => {
        try {
          const devices = await fetchDeviceListHandover();
          const options = processDevicesToOptions(devices, "DHG");
          setHandoverInventory(options);
        } catch (error) {
          console.error("Lỗi lấy kho DHG:", error);
        }
      };
      loadHandoverInventory();
    }
  }, [isOpen]);

  // --- 3. Fetch Kho Cửa Hàng (Thu Hồi) ---
  useEffect(() => {
    if (isOpen && ticket?.Store) {
      const loadStoreInventory = async () => {
        try {
          const devices = await fetchDeviceListRetrieve(ticket.Store);
          const options = processDevicesToOptions(devices, ticket.Store);

          const availableDevices = options.filter(d =>
            !d.Status ||
            d.Status === "Đang sử dụng" ||
            d.Status === "Thiết bị cũ" ||
            d.Status === "Thiết bị mới"
          );

          setStoreInventory(availableDevices);
        } catch (error) {
          console.error("Lỗi lấy tồn kho cửa hàng:", error);
        }
      };
      loadStoreInventory();
    }
  }, [isOpen, ticket?.Store]);

  // --- Reset State ---
  useEffect(() => {
    if (!isOpen) {
      setHandoverDevicesData([]);
      setRetrieveDevicesData([]);
      setNewHandoverDevices([]);
      setNewRetrieveDevices([]);
      setEditingRowId(null);
      setActiveTab("1");
      setStoreInventory([]);
      setHandoverInventory([]);
    }
  }, [isOpen]);

  const combinedHandoverData = [...handoverDevicesData, ...newHandoverDevices];
  const combinedRetrieveData = [...retrieveDevicesData, ...newRetrieveDevices];

  // --- Options ---
  const locationOptions = ["POS01", "POS02", "POS03", "POS04", "POS05", "Server", "KHO", "Quầy", "Bếp", "WIFI01", "WIFI02", "AP01", "RACK", "Manager"];
  const storeOptions = ["DHG", "FMV", "Kohnan", "Sukiya", "Colowide"];
  const deviceOptions = [
    { value: "POS", label: "POS" }, { value: "Printer", label: "Printer" },
    { value: "Scanner", label: "Scanner" }, { value: "Monitor", label: "Monitor" },
    { value: "PC", label: "PC" }, { value: "Laptop", label: "Laptop" },
    { value: "Handy", label: "Handy" }, { value: "Tablet", label: "Tablet" },
    { value: "Server", label: "Server" }, { value: "UPS", label: "UPS" }
  ];
  const devicestatusOptions = [{ value: "Thiết bị mới", label: "Thiết bị mới" }, { value: "Thiết bị cũ", label: "Thiết bị cũ" }];
  const devicesoldtatusOptions = [{ value: "Hỏng", label: "Hỏng" }, { value: "Hết hạn sử dụng", label: "Hết hạn sử dụng" }, { value: "Đóng cửa", label: "Đóng cửa" }];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // --- Handlers ---
  const handleAddRow = (type) => {
    if (!ticket) return message.error("Vui lòng chọn phiếu!");
    const newDevice = {
      id: Date.now(),
      Customer: ticket.Customer || "",
      DeliveryDate: ticket.Date || "",
      DeviceName: "",
      SerialNumber: "",
      // Nếu là Handover -> Lấy Store phiếu. Nếu Retrieve -> Để RỖNG (undefined)
      Store: type === "handover" ? ticket.Store : undefined,
      Location: "",
      Status: type === "handover" ? "Đang sử dụng" : "Thu hồi",
      DeviceStatus: "",
      Note: "",
      Votes: ticket.Votes,
      StoreRecall: ticket.Store,
      isNew: true,
      Type: type === "handover" ? "Bàn giao" : "Thu hồi",
    };
    if (type === "handover") setNewHandoverDevices(prev => [...prev, newDevice]);
    else setNewRetrieveDevices(prev => [...prev, newDevice]);
  };

  const handleInputChange = (id, field, value, type) => {
    const updater = type === "handover" ? setNewHandoverDevices : setNewRetrieveDevices;
    updater(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSavedInputChange = (id, field, value, type) => {
    const updater = type === "handover" ? setHandoverDevicesData : setRetrieveDevicesData;
    updater(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // --- SỬA LOGIC Ở ĐÂY: Store luôn undefined khi chọn serial ở tab Thu Hồi ---
  const handleSerialNumberChange = (value, record, type) => {
    const sourceOptions = type === "handover" ? handoverInventory : storeInventory;
    const selectedInfo = sourceOptions.find(op => op.value === value);

    const updateLogic = (prev) => prev.map(d => {
      if (d.id !== record.id) return d;
      return {
        ...d,
        SerialNumber: value,
        DeviceName: selectedInfo?.DeviceName || d.DeviceName,
        BrandName: selectedInfo?.BrandName || "",
        Model: selectedInfo?.Model || d.Model,
        DeliveryDate: selectedInfo?.DeliveryDate || (ticket?.Date || ""),
        Location: selectedInfo?.Location || d.Location,
        Note: selectedInfo?.Note || "",
        Status: type === "handover" ? "Đang sử dụng" : "Thu hồi",

        // --- QUAN TRỌNG: ---
        // Bàn giao: Store = ticket.Store
        // Thu hồi: Store = undefined (Để người dùng tự chọn)
        Store: type === "retrieve" ? undefined : ticket.Store,
      };
    });

    if (type === "handover") {
      if (record.isNew) setNewHandoverDevices(updateLogic);
      else setHandoverDevicesData(updateLogic);
    } else {
      if (record.isNew) setNewRetrieveDevices(updateLogic);
      else setRetrieveDevicesData(updateLogic);
    }
  };

  const handleDeleteRow = (id, type) => {
    if (type === "handover") setNewHandoverDevices(prev => prev.filter(d => d.id !== id));
    else setNewRetrieveDevices(prev => prev.filter(d => d.id !== id));
  };

  const handleDeleteSavedRow = async (id, type) => {
    try {
      setLoading(true);
      if (type === "handover") {
        await deleteDeviceDetailHandover(id);
        setHandoverDevicesData(prev => prev.filter(d => d.id !== id));
      } else {
        await deleteDeviceDetailRetrieve(id);
        setRetrieveDevicesData(prev => prev.filter(d => d.id !== id));
      }
      message.success("Đã xóa!");
    } catch { message.error("Lỗi xóa!"); } finally { setLoading(false); }
  };

  const handleUpdateRow = async (id, type) => {
    let device = type === "handover" ? handoverDevicesData.find(d => d.id === id) : retrieveDevicesData.find(d => d.id === id);

    if (!device) return;

    try {
      setLoading(true);
      const { id: _, ...payload } = device;

      if (type === "handover") {
        await updateDevicesDetailHandover(device.id, { ...payload, Status: "Đang sử dụng" });
      } else {
        await updateDevicesDetailRetrieve(device.id, { ...payload, Status: "Thu hồi" });
      }

      message.success("Cập nhật xong!");
      setEditingRowId(null);
      if (fetchTickets) fetchTickets();
    } catch (error) {
      console.error("Lỗi update:", error);
      message.error("Lỗi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewDevices = async (shouldClose = true) => {
    if (newHandoverDevices.length === 0 && newRetrieveDevices.length === 0) {
      return true;
    }

    setLoading(true);
    try {
      const allNew = [...newHandoverDevices, ...newRetrieveDevices];
      for (const d of allNew) {
        if (!d.SerialNumber) {
          message.warning("Vui lòng nhập Serial Number cho các dòng mới");
          setLoading(false);
          return false;
        }
        // Validate Store cho Thu Hồi
        if (d.Type !== "Bàn giao" && !d.Store) {
          message.warning("Vui lòng chọn Store (Kho/Cửa hàng) cho thiết bị thu hồi!");
          setLoading(false);
          return false;
        }
      }

      const promisesH = newHandoverDevices.map(d => createDevicesDetailHandover({ ...d, Status: "Đang sử dụng" }));
      const promisesR = newRetrieveDevices.map(d => createDevicesDetailRetrieve({ ...d, Status: "Thu hồi" }));

      await Promise.all([...promisesH, ...promisesR]);

      message.success("Lưu thiết bị thành công!");
      setNewHandoverDevices([]);
      setNewRetrieveDevices([]);

      if (fetchTickets) fetchTickets();
      if (shouldClose) onClose();

      return true;
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi lưu thiết bị!");
      return false;
    } finally {
      if (shouldClose) setLoading(false);
    }
  };

  const handleConfirmTicket = async () => {
    setLoading(true);
    const saveSuccess = await handleSaveNewDevices(false);

    if (!saveSuccess) {
      setLoading(false);
      return;
    }

    try {
      const ticketId = ticket.documentId || ticket.id;
      if (!ticketId) {
        message.error("Lỗi ID phiếu!");
        return;
      }

      await updateTicketStatus(ticketId, "Đang chờ duyệt");
      message.success("Đã gửi phiếu thành công!");

      if (reloadTickets) await reloadTickets();
      onClose();
    } catch (error) {
      console.error("Lỗi gửi phiếu:", error);
      message.error("Lỗi khi cập nhật trạng thái phiếu!");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTicket = async () => {
    try {
      setLoading(true);
      const saved = [...handoverDevicesData, ...retrieveDevicesData];

      if (!saved.length) {
        message.warning("Phiếu trống!");
        setLoading(false);
        return;
      }

      let successCount = 0;
      const key = 'updatable';
      message.loading({ content: 'Đang xử lý thiết bị 0/' + saved.length, key });

      for (let i = 0; i < saved.length; i++) {
        const d = saved[i];
        try {
          message.loading({ content: `Đang xử lý thiết bị ${i + 1}/${saved.length}...`, key });

          await updateDeviceBySerial(d.SerialNumber, {
            ...d,
            DeliveryDate: d.DeliveryDate || null,
            Status: d.Status,
            Note: d.Note
          });
          successCount++;
        } catch (err) {
          console.error(`Lỗi update serial: ${d.SerialNumber}`, err);
        }
      }

      if (successCount === saved.length) {
        const ticketId = ticket.documentId || ticket.id;
        await updateTicketStatus(ticketId, "Đã duyệt");

        message.success({ content: "Duyệt phiếu thành công!", key, duration: 2 });
        if (reloadTickets) await reloadTickets();
        onClose();
      } else {
        message.warning({ content: `Hoàn thành ${successCount}/${saved.length}. Có lỗi xảy ra!`, key, duration: 3 });
      }

    } catch (error) {
      console.error("Lỗi duyệt phiếu:", error);
      message.error("Lỗi hệ thống khi duyệt phiếu!");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnTicket = async () => {
    try {
      setLoading(true);
      const ticketId = ticket.documentId || ticket.id;
      await updateTicketStatus(ticketId, "Đang tạo phiếu");
      message.success("Đã trả phiếu!");
      if (reloadTickets) await reloadTickets();
      onClose();
    } catch {
      message.error("Lỗi trả phiếu!");
    } finally { setLoading(false); }
  };

  const handleConfirmAdminTicket = async () => {
    try {
      setLoading(true);
      const ticketId = ticket.documentId || ticket.id;
      await updateTicketStatus(ticketId, "Đã nhận phiếu");
      message.success("Đã nhận!");
      if (reloadTickets) await reloadTickets();
      onClose();
    } catch {
      message.error("Lỗi nhận phiếu!");
    } finally { setLoading(false); }
  };

  // --- Render Table Columns ---
  const getColumns = (type) => {
    const isHandover = type === "handover";
    const currentData = isHandover ? combinedHandoverData : combinedRetrieveData;
    const commonStyle = { width: "100%" };

    return [
      {
        title: "Khách Hàng", dataIndex: "Customer", width: 150,
        render: (_, r) => r.isNew ? <Input value={r.Customer} onChange={e => handleInputChange(r.id, "Customer", e.target.value, type)} /> : <Text strong>{r.Customer}</Text>
      },
      {
        title: "Số Serial", dataIndex: "SerialNumber", width: 220,
        render: (_, r) => {
          const selectedSerials = currentData.filter(d => d.id !== r.id).map(d => d.SerialNumber);

          let source = isHandover ? handoverInventory : storeInventory;
          if (!source) source = [];

          const filteredOptions = source.filter(op => !selectedSerials.includes(op.value));

          if (r.isNew || editingRowId === r.id) {
            return (
              <AutoComplete
                options={filteredOptions}
                style={commonStyle}
                value={r.SerialNumber || ""}
                onChange={(val) => handleSerialNumberChange(val, r, type)}
                placeholder={isHandover ? "Tìm trong kho DHG" : "Tìm tại cửa hàng"}
                filterOption={(inputValue, option) => {
                  if (!option || !option.label) return false;
                  return String(option.label).toUpperCase().includes(inputValue.toUpperCase());
                }}
                status={!r.SerialNumber ? "error" : ""}
                onFocus={() => { }}
              />
            );
          }
          return <Tag color="blue">{r.SerialNumber}</Tag>;
        },
      },
      {
        title: "Thiết Bị", dataIndex: "DeviceName", width: 180,
        render: (_, r) => r.isNew || editingRowId === r.id ? <Select showSearch value={r.DeviceName} style={commonStyle} options={deviceOptions} onChange={(v) => r.isNew ? handleInputChange(r.id, "DeviceName", v, type) : handleSavedInputChange(r.id, "DeviceName", v, type)} /> : r.DeviceName
      },
      { title: "Model", dataIndex: "Model", width: 150, render: (_, r) => <Text type="secondary">{r.Model}</Text> },
      {
        title: "Vị Trí", dataIndex: "Location", width: 140,
        render: (_, r) => r.isNew || editingRowId === r.id ? <Select style={commonStyle} value={r.Location} options={locationOptions.map(l => ({ label: l, value: l }))} onChange={(v) => r.isNew ? handleInputChange(r.id, "Location", v, type) : handleSavedInputChange(r.id, "Location", v, type)} /> : <Tag color="cyan">{r.Location}</Tag>
      },
      {
        title: "Tình Trạng", dataIndex: "DeviceStatus", width: 150,
        render: (_, r) => r.isNew || editingRowId === r.id ? <Select style={commonStyle} value={r.DeviceStatus} options={isHandover ? devicestatusOptions : devicesoldtatusOptions} onChange={(v) => r.isNew ? handleInputChange(r.id, "DeviceStatus", v, type) : handleSavedInputChange(r.id, "DeviceStatus", v, type)} /> : <Tag color={r.DeviceStatus === "Hỏng" ? "red" : "green"}>{r.DeviceStatus}</Tag>
      },
      {
        title: "Ngày Giao", dataIndex: "DeliveryDate", width: 140,
        render: (_, r) => {
          const d = r.DeliveryDate ? dayjs(r.DeliveryDate) : null;
          if (r.isNew || editingRowId === r.id) return <DatePicker value={d} format="DD-MM-YYYY" style={commonStyle} onChange={(date) => { const v = date ? date.format("YYYY-MM-DD") : ""; r.isNew ? handleInputChange(r.id, "DeliveryDate", v, type) : handleSavedInputChange(r.id, "DeliveryDate", v, type) }} />;
          return d ? d.format("DD-MM-YYYY") : "-";
        }
      },
      {
        title: "Ghi Chú", dataIndex: "Note", width: 180,
        render: (_, r) => r.isNew || editingRowId === r.id ? <Input value={r.Note} onChange={(e) => r.isNew ? handleInputChange(r.id, "Note", e.target.value, type) : handleSavedInputChange(r.id, "Note", e.target.value, type)} /> : r.Note
      },
      {
        title: "Store", dataIndex: "Store", width: 120,
        render: (_, r) => {
          // Bàn giao (!isHandover): Hiển thị Select và buộc chọn (mặc định rỗng)
          if (!isHandover && (r.isNew || editingRowId === r.id)) {
            return (
              <Select
                style={commonStyle}
                value={r.Store}
                options={storeOptions.map(s => ({ label: s, value: s }))}
                onChange={(v) => r.isNew ? handleInputChange(r.id, "Store", v, type) : handleSavedInputChange(r.id, "Store", v, type)}
                placeholder="Chọn kho" // Placeholder quan trọng để user biết cần chọn
                status={!r.Store ? "warning" : ""} // Viền vàng nếu chưa chọn
              />
            );
          }
          return r.Store || r.StoreRecall;
        }
      },
      {
        title: "Thao tác", fixed: "right", width: 110,
        render: (_, r) => {
          const canEdit = ticket?.Person === account?.Name && ticket?.Status === "Đang tạo phiếu";
          if (r.isNew) return <Popconfirm title="Xóa dòng?" onConfirm={() => handleDeleteRow(r.id, type)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>;
          if (editingRowId === r.id) return <Space size="small"><Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleUpdateRow(r.id, type)} /><Button size="small" icon={<CloseOutlined />} onClick={() => setEditingRowId(null)} /></Space>;
          return <Space size="small">
            {canEdit && <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => setEditingRowId(r.id)} />}
            {canEdit && <Popconfirm title="Xóa?" onConfirm={() => handleDeleteSavedRow(r.id, type)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>}
            <Tooltip title="In Nhãn"><Button type="text" icon={<PrinterOutlined />} onClick={() => { setSelectedDevice(r); type === "handover" ? setIsPrintModalOpenH(true) : setIsPrintModalOpenR(true); }} /></Tooltip>
          </Space>;
        }
      }
    ];
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ top: 20 }}
      closable={false}
      styles={{ content: { padding: 0, borderRadius: 8 } }}
    >
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #001529 0%, #0050b3 100%)", padding: "16px 24px", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FileDoneOutlined style={{ fontSize: 20 }} />
          <span style={{ fontSize: 18, fontWeight: 600 }}>Chi Tiết Phiếu: {ticket?.Votes}</span>
        </div>
        <CloseOutlined onClick={onClose} style={{ cursor: "pointer", fontSize: 18 }} />
      </div>

      {/* Body */}
      <div style={{ padding: "16px 24px", minHeight: "60vh", background: "#f5f7fa" }}>
        <Card size="small" bordered={false} style={{ marginBottom: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <Space split={<div style={{ width: 1, height: 16, background: '#e8e8e8' }} />}>
            <Text strong><InfoCircleOutlined /> Người tạo: <Text type="secondary">{ticket?.Person}</Text></Text>
            <Text strong>Cửa hàng: <Text type="secondary">{ticket?.Store}</Text></Text>
            <Text strong>Trạng thái: <Tag color={ticket?.Status === 'Đã duyệt' ? 'green' : 'blue'}>{ticket?.Status}</Tag></Text>
          </Space>
        </Card>

        <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={[
              {
                key: "1",
                label: <span><ExportOutlined /> Bàn Giao Thiết Bị</span>,
                children: (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Table
                      dataSource={combinedHandoverData}
                      rowKey="id"
                      columns={getColumns("handover")}
                      pagination={false}
                      size="middle"
                      bordered
                      scroll={{ x: 1300, y: 400 }}
                    />
                    {ticket?.Status === "Đang tạo phiếu" && ticket?.Person === account?.Name && (
                      <Button
                        type="dashed"
                        block
                        onClick={() => handleAddRow("handover")}
                        style={{ marginTop: 12, borderColor: "#1890ff", color: "#1890ff" }}
                        icon={<PlusOutlined />}
                      >
                        Thêm thiết bị bàn giao
                      </Button>
                    )}
                  </motion.div>
                ),
              },
              {
                key: "2",
                label: <span><ImportOutlined /> Thu Hồi Thiết Bị</span>,
                children: (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Table
                      dataSource={combinedRetrieveData}
                      rowKey="id"
                      columns={getColumns("retrieve")}
                      pagination={false}
                      size="middle"
                      bordered
                      scroll={{ x: 1300, y: 400 }}
                    />
                    {ticket?.Status === "Đang tạo phiếu" && ticket?.Person === account?.Name && (
                      <Button
                        type="dashed"
                        block
                        onClick={() => handleAddRow("retrieve")}
                        style={{ marginTop: 12, borderColor: "#ff4d4f", color: "#ff4d4f" }}
                        icon={<PlusOutlined />}
                      >
                        Thêm thiết bị thu hồi
                      </Button>
                    )}
                  </motion.div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end", gap: 12, background: "#fff", borderRadius: "0 0 8px 8px" }}>
        <Button key="cancel" onClick={onClose}>Đóng</Button>

        {ticket?.Status === "Đang chờ duyệt" && ticket?.Person === account?.Name && (
          <Button key="print" icon={<PrinterOutlined />} onClick={() => setPrintVisible(true)}>In Phiếu</Button>
        )}

        {account.Leader && ticket?.Status === "Đang chờ duyệt" && (
          <>
            <Button danger icon={<RollbackOutlined />} onClick={handleReturnTicket}>Trả Phiếu</Button>
            <Button type="primary" style={{ background: "#52c41a", borderColor: "#52c41a" }} icon={<CheckOutlined />} onClick={handleApproveTicket}>Duyệt Phiếu</Button>
          </>
        )}

        {account.Receivelist && ticket?.Status === "Đã duyệt" && (
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleConfirmAdminTicket}>Nhận Phiếu</Button>
        )}

        {ticket?.Status === "Đang tạo phiếu" && ticket?.Person === account?.Name && (
          <>
            <Button icon={<SaveOutlined />} onClick={handleSaveNewDevices} loading={loading}>Lưu Nháp</Button>
            <Button type="primary" icon={<FileDoneOutlined />} onClick={handleConfirmTicket} loading={loading}>Gửi Phiếu</Button>
          </>
        )}
      </div>

      {/* Modals In */}
      <PrintTicketModal
        isOpen={printVisible}
        onClose={() => setPrintVisible(false)}
        ticket={ticket || {}}
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
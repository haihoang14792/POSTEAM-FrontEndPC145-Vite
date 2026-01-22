import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Button,
  Input,
  Table,
  message,
  Select,
  Popconfirm,
  InputNumber,
  Spin,
  Tag,
  Descriptions,
  Space,
  Card,
  Tooltip,
  Typography
} from "antd";
import {
  createExportLoanPOS,
  fetchExportLoanPOS,
  deleteExportLoanPOS,
  updateExportLoanTicket,
  fetchExportlists,
  updateExportLoanPOS,
  updateExportlistsSerial,
  updateExportLoanTicketPersonInvoice,
  createImportDeviceServices,
  updateExportLoanTicketInvoice,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  updateExportLoanTicketv1,
} from "../../../services/dhgServices";
import PrintTicketExportLoan from "./PrintTicketExportLoan";
import ExportInvoiceModal from "./ExportInvoiceModal";
import dayjs from "dayjs";
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  SafetyCertificateOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  FileAddOutlined,
  CalculatorOutlined,
  ExportOutlined,
  CheckSquareOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  PlusOutlined,
  RollbackOutlined,
  ToolOutlined,
  CopyOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const TicketExportLoanModal = ({
  isOpen,
  onClose,
  ticket,
  fetchDevices,
  fetchTickets,
  reloadTickets,
  serialNumberOptions = [],
}) => {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [exportLoanData, setExportLoanData] = useState([]);
  const [newExportLoans, setNewExportLoans] = useState([]);
  const [exportList, setExportList] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [printVisible, setPrintVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // --- LOGIC 1: CHUẨN HÓA DỮ LIỆU TICKET ---
  // Tự động xử lý dù ticket có nằm trong attributes hay không
  const ticketData = useMemo(() => {
    if (!ticket) return {};
    return ticket.attributes ? { id: ticket.id, ...ticket.attributes } : ticket;
  }, [ticket]);

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch (status) {
      case "Duyệt": return "success";
      case "Đã giao": return "cyan";
      case "Đang chờ duyệt": return "processing";
      case "Trả kho": return "purple";
      case "Đang tạo phiếu": return "warning";
      case "Hủy": return "error";
      case "Xác nhận": return "geekblue";
      default: return "default";
    }
  };

  // --- EFFECTS ---

  // 1. Load danh sách kho và làm phẳng dữ liệu (Flatten)
  useEffect(() => {
    fetchExportlists().then((response) => {
      const rawData = Array.isArray(response) ? response : (response.data || []);
      // Flatten dữ liệu để dễ truy xuất
      const flattenedData = rawData.map(item => ({
        id: item.id,
        documentId: item.documentId, // Quan trọng cho Strapi v5
        ...(item.attributes || item)
      }));
      setExportList(flattenedData);
    });
  }, []);

  // 2. Load chi tiết phiếu (Danh sách thiết bị đã thêm)
  useEffect(() => {
    if (isOpen && ticketData?.Votes) {
      fetchExportLoanPOS(ticketData.Votes)
        .then((responseData) => {
          const rawData = Array.isArray(responseData) ? responseData : (responseData.data || []);
          const devices = rawData.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            ...(item.attributes || item)
          }));
          setExportLoanData(devices);
        })
        .catch((error) => {
          console.error("Lỗi tải thiết bị bàn giao:", error);
          message.error("Lỗi tải thiết bị bàn giao.");
        });
    }
  }, [isOpen, ticketData?.Votes]);

  // 3. Reset form khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setExportLoanData([]);
      setNewExportLoans([]);
      setEditingRowId(null);
    }
  }, [isOpen]);

  const combinedExportLoanData = [...exportLoanData, ...newExportLoans];

  // --- HANDLERS (XỬ LÝ SỰ KIỆN) ---

  const handleAddRow = (type) => {
    if (!ticketData?.Votes) {
      message.error("Phiếu không hợp lệ hoặc thiếu mã phiếu (Votes)!");
      return;
    }

    const newDevice = {
      id: Date.now(),
      ProductName: ticketData.ProductName || "",
      Model: "",
      BrandName: "",
      DVT: "",
      TypeKho: "",
      totalexport: 1,
      SerialNumber: "",
      Ticket: ticketData.Ticket,
      Votes: ticketData.Votes,
      NameExportLoan: account?.Name || "",
      Status: "Mới",
      Note: "",
      Type: "",
      isNew: true,
    };

    if (type === "exportloan") {
      setNewExportLoans((prev) => [...prev, newDevice]);
    }
  };

  const handleDeleteRow = (id, type) => {
    if (type === "exportloan") {
      setNewExportLoans((prev) => prev.filter((device) => device.id !== id));
    }
  };

  // --- LOGIC 2: LƯU VÀ TRỪ KHO (QUAN TRỌNG) ---
  const handleSaveAndUpdateExportlists = async () => {
    try {
      const newDevices = [...newExportLoans];

      // Validate dữ liệu
      const invalidDevices = newDevices.filter(
        (device) =>
          device.Type !== "Vật tư" &&
          (!device.SerialNumber ||
            (Array.isArray(device.SerialNumber) && device.SerialNumber.length === 0) ||
            (typeof device.SerialNumber === "string" && device.SerialNumber.trim() === ""))
      );

      if (invalidDevices.length > 0) {
        const names = invalidDevices.map((d) => `${d.ProductName} - ${d.Model}`).join(", ");
        message.error(`Các thiết bị sau chưa nhập SerialNumber: ${names}`);
        throw new Error("Thiếu SerialNumber");
      }

      // Bước 1: Lưu thiết bị vào bảng ExportLoanPOS
      await handleSaveNewDevices();

      // Bước 2: Trừ kho (Cập nhật ExportList)
      for (const device of newDevices) {
        // Tìm thiết bị trong kho khớp thông tin
        const matchingExportItems = exportList.filter(
          (item) =>
            item.ProductName === device.ProductName &&
            item.Model === device.Model &&
            item.TypeKho === device.TypeKho &&
            item.Status === "Đang mượn"
        );

        if (matchingExportItems.length === 0) {
          console.warn("Không tìm thấy thiết bị trong kho để trừ:", device);
          continue;
        }

        for (const exportListItem of matchingExportItems) {
          // Ưu tiên dùng documentId
          const exportListId = exportListItem.documentId || exportListItem.id;

          const oldSerialArray = (exportListItem.SerialNumber || "").split(",").map((sn) => sn.trim()).filter(Boolean);

          // Lấy serial từ dòng mới thêm
          const deviceSerials = Array.isArray(device.SerialNumber)
            ? device.SerialNumber
            : (device.SerialNumber || "").split(",").map((sn) => sn.trim()).filter(Boolean);

          // Tìm giao điểm (serial cần xuất nằm trong lô này)
          const usedSerials = deviceSerials.filter((sn) => oldSerialArray.includes(sn));

          if (usedSerials.length === 0) continue;

          // Tính toán lại Serial
          const newSerialArray = oldSerialArray.filter((sn) => !usedSerials.includes(sn));
          const newSerialString = newSerialArray.join(",");

          const oldSerialLoanArray = (exportListItem.SerialNumberLoan || "").split(",").map((sn) => sn.trim()).filter(Boolean);
          const newSerialLoanArray = Array.from(new Set([...oldSerialLoanArray, ...usedSerials]));
          const newSerialLoanString = newSerialLoanArray.join(",");

          // Tính toán lại Số lượng
          const oldQuantity = Number(exportListItem.totalexport) || 0;
          const newTotalExport = Math.max(0, oldQuantity - usedSerials.length);

          const oldLoanQuantity = Number(exportListItem.totalexportLoan) || 0;
          const newTotalExportLoan = oldLoanQuantity + usedSerials.length;

          // Gọi API cập nhật
          await updateExportlistsSerial(
            exportListId,
            newSerialString,
            newSerialLoanString,
            newTotalExport,
            newTotalExportLoan
          );

          // Cập nhật state local để UI phản hồi ngay
          setExportList((prev) =>
            prev.map((item) =>
              (item.documentId === exportListId || item.id === exportListId)
                ? {
                  ...item,
                  SerialNumber: newSerialString,
                  SerialNumberLoan: newSerialLoanString,
                  totalexport: newTotalExport,
                  totalexportLoan: newTotalExportLoan
                }
                : item
            )
          );
        }
      }
      message.success("Lưu thiết bị thành công và đã cập nhật trừ kho!");
    } catch (error) {
      console.error("Lỗi khi lưu và cập nhật:", error);
      message.error("Đã có lỗi xảy ra khi lưu và cập nhật.");
      throw error;
    }
  };


  const handleSaveAndUpdateExportlistsv4 = async () => {
    try {
      const newDevices = [...newExportLoans];

      // ✅ Bước 1: Kiểm tra toàn bộ trước khi xử lý
      const invalidDevices = newDevices.filter(
        (device) =>
          device.Type !== "Vật tư" && // Chỉ check thiết bị
          (!device.SerialNumber ||
            (Array.isArray(device.SerialNumber) &&
              device.SerialNumber.length === 0) ||
            (typeof device.SerialNumber === "string" &&
              device.SerialNumber.trim() === ""))
      );

      if (invalidDevices.length > 0) {
        const names = invalidDevices
          .map((d) => `${d.ProductName} - ${d.Model}`)
          .join(", ");
        message.error(`Các thiết bị sau chưa nhập SerialNumber: ${names}`);
        throw new Error("Thiếu SerialNumber"); // ❌ Dừng toàn bộ
      }

      // ✅ Bước 2: Nếu tất cả ok thì mới lưu
      await handleSaveNewDevices();

      // ✅ Bước 3: Bắt đầu cập nhật exportlists
      for (const device of newDevices) {
        const matchingExportItems = exportList.filter(
          (item) =>
            item.attributes.ProductName === device.ProductName &&
            item.attributes.Model === device.Model &&
            item.attributes.TypeKho === device.TypeKho &&
            item.attributes.Status === "Đang mượn"
        );

        for (const exportListItem of matchingExportItems) {
          const exportListId = exportListItem.id;

          // --- Lấy Serial cũ ---
          const oldSerialArray = (exportListItem.attributes.SerialNumber || "")
            .split(",")
            .map((sn) => sn.trim())
            .filter(Boolean);

          // --- Serial từ phiếu xuất ---
          const deviceSerials = Array.isArray(device.SerialNumber)
            ? device.SerialNumber
            : (device.SerialNumber || "")
              .split(",")
              .map((sn) => sn.trim())
              .filter(Boolean);

          // --- Xác định Serial nào được xuất ---
          const usedSerials = deviceSerials.filter((sn) =>
            oldSerialArray.includes(sn)
          );
          if (usedSerials.length === 0) continue;

          // --- Serial còn lại ---
          const newSerialArray = oldSerialArray.filter(
            (sn) => !usedSerials.includes(sn)
          );
          const newSerialString = newSerialArray.join(",");

          // --- SerialLoan ---
          const oldSerialLoanArray = (
            exportListItem.attributes.SerialNumberLoan || ""
          )
            .split(",")
            .map((sn) => sn.trim())
            .filter(Boolean);
          const newSerialLoanArray = Array.from(
            new Set([...oldSerialLoanArray, ...usedSerials])
          );
          const newSerialLoanString = newSerialLoanArray.join(",");

          // --- Số lượng ---
          const oldQuantity = exportListItem.attributes.totalexport ?? 0;
          const newTotalExport = Math.max(0, oldQuantity - usedSerials.length);

          const oldLoanQuantity =
            exportListItem.attributes.totalexportLoan ?? 0;
          const newTotalExportLoan = oldLoanQuantity + usedSerials.length;

          // --- Update API ---
          await updateExportlistsSerial(
            exportListId,
            newSerialString,
            newSerialLoanString,
            newTotalExport,
            newTotalExportLoan
          );

          // --- Update state ---
          setExportList((prev) =>
            prev.map((item) =>
              item.id === exportListId
                ? {
                  ...item,
                  attributes: {
                    ...item.attributes,
                    SerialNumber: newSerialString,
                    SerialNumberLoan: newSerialLoanString,
                    totalexport: newTotalExport,
                    totalexportLoan: newTotalExportLoan,
                  },
                }
                : item
            )
          );
        }
      }

      message.success(
        "Lưu thiết bị thành công và đã cập nhật exportlists (Serial + Số lượng)!"
      );
    } catch (error) {
      console.error("Lỗi khi lưu thiết bị và cập nhật exportlists:", error);
      message.error("Đã có lỗi xảy ra khi lưu và cập nhật.");
      throw error; // ❗ Quan trọng: để nút 'Gửi phiếu' biết dừng
    }
  };


  const handleSaveNewDevices = async () => {
    setLoading(true);
    try {
      const newDevices = [...newExportLoans];
      // Danh sách các trường bắt buộc (SerialNumber chỉ bắt buộc nếu không phải Vật tư)
      const requiredFields = [
        "ProductName",
        "Model",
        "BrandName",
        "TypeKho",
        "totalexport",
      ];

      // Kiểm tra từng thiết bị mới
      for (const device of newDevices) {
        for (const field of requiredFields) {
          if (!device[field] || device[field].toString().trim() === "") {
            message.warning(`Vui lòng điền đầy đủ trường cho tất cả các hàng.`);
            setLoading(false);
            return;
          }
        }

        // Nếu không phải vật tư thì SerialNumber bắt buộc
        if (
          device.Type !== "Vật tư" &&
          (!device.SerialNumber || device.SerialNumber.toString().trim() === "")
        ) {
          message.warning(
            `SerialNumber là bắt buộc cho các thiết bị không phải vật tư.`
          );
          setLoading(false);
          return;
        }
      }

      // Nếu validation thành công, tiếp tục gọi API lưu cho từng nhóm
      const exportloanPromises = newExportLoans
        .filter((device) => device.Type === "Vật tư" || device.SerialNumber) // Vật tư không cần SerialNumber
        .map((device) => {
          const deviceData = {
            ...device,
            SerialNumber:
              device.Type === "Vật tư"
                ? ""
                : Array.isArray(device.SerialNumber)
                  ? device.SerialNumber.join(",").trim()
                  : device.SerialNumber,

            // [FIX STRAPI V5]: Truy cập trực tiếp field, bỏ .attributes
            // (Thêm fallback check attributes phòng trường hợp dữ liệu cũ còn cache)
            Votes: ticket.Votes || ticket.attributes?.Votes || "",
            Ticket: ticket.Ticket || ticket.attributes?.Ticket || "",

            Status: device.Status || "Đang chờ duyệt",
          };

          console.log("Payload exportloan deviceData:", deviceData);
          // Hàm createExportLoanPOS trong service đã bao bọc { data: ... } nên ở đây truyền flat object là đúng
          return createExportLoanPOS(deviceData);
        });

      await Promise.all(exportloanPromises);

      message.success("Lưu thiết bị thành công!");
      onClose();
      fetchDevices();
      fetchTickets();
    } catch (error) {
      console.error("Lỗi khi lưu thiết bị:", error);
      message.error("Lỗi khi lưu thiết bị.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSavedRow = async (documentId, type) => {
    try {
      setLoading(true);
      if (type === "exportloan") {
        // [FIX STRAPI V5]: Gọi API xóa với documentId
        await deleteExportLoanPOS(documentId);

        // [FIX STRAPI V5]: Cập nhật state UI
        // Lọc bỏ phần tử có documentId (hoặc id) trùng với documentId vừa xóa
        setExportLoanData((prev) =>
          prev.filter((device) => {
            const currentId = device.documentId || device.id;
            return currentId !== documentId;
          })
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



  // --- LOGIC XỬ LÝ PHIẾU ---

  const handleApproveTicketAndUpdateDevices = async () => {
    try {
      await handleApproveTicket();
      const savedDevices = [...exportLoanData];
      if (savedDevices.length === 0) return;
      await Promise.all(savedDevices.map((device) => updateExportLoanPOS(device.documentId || device.id, "Duyệt")));
      await updateWarehouseFromDevices(savedDevices);
      message.success("✅ Thiết bị và kho đã được cập nhật!");
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi cập nhật.");
    }
  };


  const updateWarehouseFromDevices = async (devices) => {
    try {
      const warehouseResponse = await fetchWarehouseDetails();
      const warehouseList = Array.isArray(warehouseResponse) ? warehouseResponse : (warehouseResponse.data || []);

      const flatWarehouse = warehouseList.map(item => ({
        id: item.id,
        documentId: item.documentId,
        ...(item.attributes || item)
      }));

      for (const device of devices) {
        if (!device || !device.Model) continue;
        const kho = flatWarehouse.find((k) => k.Model === device.Model);
        if (!kho) continue;

        const id = kho.documentId || kho.id;

        let updatedPOS = Number(kho.POS) || 0;
        let updatedPOSHN = Number(kho.POSHN) || 0;
        let totalXTK = Number(kho.totalXTK) || 0;

        if (device.TypeKho === "POS") updatedPOS -= device.totalexport || 0;
        else if (device.TypeKho === "POSHN") updatedPOSHN -= device.totalexport || 0;

        totalXTK += device.totalexport || 0;
        const inventoryCK = (Number(kho.inventoryDK) || 0) + (Number(kho.totalNTK) || 0) - totalXTK;

        await updateWarehouseDetails(id, { POS: updatedPOS, POSHN: updatedPOSHN, totalXTK, inventoryCK });
      }
    } catch (error) {
      console.error("Lỗi cập nhật kho:", error);
    }
  };

  const handleImportDeviceServicesTicket = async () => {
    try {
      if (!exportLoanData || exportLoanData.length === 0) {
        message.warning("Không có thiết bị để xuất!");
        return;
      }

      // 1. Tạo lịch sử thiết bị trước
      for (const device of exportLoanData) {
        if (device.TypeDevice === "QLTB") continue;

        const serialNumbers = device.SerialNumber.includes(",")
          ? device.SerialNumber.split(",").map(s => s.trim())
          : [device.SerialNumber];

        for (const serial of serialNumbers) {
          await createImportDeviceServices({
            Model: device.Model,
            BrandName: device.BrandName,
            SerialNumber: serial,
            Store: "DHG",
          });
        }
      }

      // 2. Sau khi thành công → cập nhật trạng thái phiếu
      const ticketId = ticketData?.documentId || ticketData?.id;
      await updateExportLoanTicket(ticketId, "Đã giao");

      message.success("✅ Xuất thiết bị & cập nhật phiếu thành công!");

      if (reloadTickets) await reloadTickets();
      onClose();
    } catch (error) {
      console.error("Lỗi xuất thiết bị:", error);
      message.error("Lỗi khi xuất thiết bị. Phiếu CHƯA được chuyển trạng thái.");
    }
  };


  const handleApproveTicket = async () => {
    try {
      setLoading(true);

      if (!exportLoanData || exportLoanData.length === 0) {
        message.warning("Không có thiết bị đã lưu để duyệt.");
        return;
      }

      const ticketId = ticketData?.documentId || ticketData?.id;

      await updateExportLoanTicketv1(ticketId, {
        Status: "Duyệt",
        PersonApprove: account.Name,
      });

      message.success(`✅ Phiếu được duyệt bởi: ${account.Name}`);

      if (reloadTickets) await reloadTickets();
      fetchDevices();
      onClose();
    } catch (error) {
      console.error("Lỗi duyệt phiếu:", error);
      message.error("Lỗi duyệt phiếu.");
    } finally {
      setLoading(false);
    }
  };



  const handleConfirmTicket = async () => {
    try {
      setLoading(true);
      const isSupplies = newExportLoans.some((device) => device.Type === "Vật tư");

      if (isSupplies) await handleSaveAndUpdateExportlistsForSupplies();
      else await handleSaveAndUpdateExportlists();

      await updateExportLoanTicket(ticketData.documentId || ticketData.id, "Đang chờ duyệt");
      message.success("Phiếu đã lưu và chuyển sang trạng thái 'Đang chờ duyệt'!");

      if (reloadTickets) await reloadTickets();
      onClose();
    } catch (error) {
      // Error handled in sub-functions
    } finally {
      setLoading(false);
    }
  };


  const handleSaveAndUpdateExportlistsForSupplies = async () => {
    try {
      await handleSaveNewDevices(); // Bước 1: Lưu thiết bị cũ

      const newSupplies = [...newExportLoans];
      for (const supply of newSupplies) {
        if (supply.Type !== "Vật tư") continue;

        let remainingQuantity = supply.totalexport;

        // [FIX for V5]: Truy cập trực tiếp các trường, không qua .attributes
        let sortedExportItems = exportList
          .filter(
            (item) =>
              item.ProductName === supply.ProductName &&
              item.Model === supply.Model &&
              item.TypeKho === supply.TypeKho &&
              item.Status === "Đang mượn"
          )
          .sort(
            (a, b) =>
              new Date(a.createdAt) - new Date(b.createdAt)
          );

        for (const exportListItem of sortedExportItems) {
          if (remainingQuantity <= 0) break;

          // [FIX for V5]: Sử dụng documentId để gọi API update thay vì id
          // Lưu ý: Đảm bảo API lấy danh sách (fetchExportlists) đã populate field 'documentId'
          const exportListId = exportListItem.documentId || exportListItem.id;

          // [FIX for V5]: Lấy dữ liệu trực tiếp
          let oldQuantity = exportListItem.totalexport ?? 0;
          let oldLoanQuantity = exportListItem.totalexportLoan ?? 0;

          let usedQuantity = Math.min(remainingQuantity, oldQuantity);
          let newTotalExport = oldQuantity - usedQuantity;
          let newTotalExportLoan = oldLoanQuantity + usedQuantity;
          remainingQuantity -= usedQuantity;

          // Gọi API update (Payload service của bạn đã đúng chuẩn { data: ... })
          await updateExportlistsSerial(
            exportListId,
            "", // Không cần serial number
            "", // Không cần serial number loan
            newTotalExport,
            newTotalExportLoan
          );

          // [FIX for V5]: Cập nhật state theo cấu trúc phẳng
          setExportList((prev) =>
            prev.map((item) => {
              // So sánh documentId (hoặc id nếu chưa có documentId)
              const itemId = item.documentId || item.id;
              return itemId === exportListId
                ? {
                  ...item,
                  totalexport: newTotalExport,
                  totalexportLoan: newTotalExportLoan,
                  // Không cần lồng vào attributes nữa
                }
                : item;
            })
          );
        }
      }

      message.success("Lưu vật tư thành công và đã cập nhật exportlists!");
    } catch (error) {
      console.error("Lỗi khi lưu vật tư và cập nhật exportlists:", error);
      message.error("Đã có lỗi xảy ra khi lưu vật tư.");
    }
  };


  const handleExportTicket = async () => {
    await updateExportLoanTicketInvoice(ticketData.documentId || ticketData.id, "Đã xuất hóa đơn", invoiceNumber);
    message.success("Cập nhật hóa đơn thành công");
    if (reloadTickets) await reloadTickets();
    onClose();
  }

  const handleHandoverTicket = async () => {
    try {
      setLoading(true);
      console.log("📌 Account:", account); // Kiểm tra giá trị account
      if (!account?.Name) {
        throw new Error("Không tìm thấy thông tin tài khoản.");
      }

      // [FIX CHO STRAPI V5]: Ưu tiên sử dụng documentId
      // Nếu API get ticket của bạn chưa trả về documentId phẳng, hãy kiểm tra lại service fetch.
      const ticketId = ticket.documentId || ticket.id;

      // Cập nhật trạng thái phiếu
      await updateExportLoanTicket(ticketId, "Chờ xuất hóa đơn");
      message.success("Phiếu đã chuyển sang trạng thái 'Chờ xuất hóa đơn'!");

      // Cập nhật người xuất hóa đơn
      console.log(`🔄 Gửi API cập nhật người xuất hóa đơn: ${account.Name}`);
      await updateExportLoanTicketPersonInvoice(ticketId, account.Name);
      message.success(`Người xuất hóa đơn: ${account.Name}`);

      // Cập nhật danh sách phiếu ngay sau khi xác nhận
      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }

      // Đóng modal sau khi cập nhật
      onClose();
    } catch (error) {
      console.error("⛔ Lỗi khi cập nhật trạng thái phiếu:", error);
      message.error("Có lỗi xảy ra khi xác nhận phiếu.");
    } finally {
      setLoading(false);
    }
  };


  const handleReturnTicket = async () => {
    try {
      setLoading(true);

      // [FIX STRAPI V5]: Sử dụng documentId để cập nhật trạng thái
      // Fallback về ticket.id nếu chưa có documentId
      const ticketId = ticket.documentId || ticket.id;

      await updateExportLoanTicket(ticketId, "Đang tạo phiếu");

      message.success("Phiếu đã được trả về trạng thái 'Đang tạo phiếu'!");

      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets(); // Load lại danh sách phiếu
      }

      onClose(); // Đóng modal sau khi cập nhật
    } catch (error) {
      console.error("Lỗi trả phiếu:", error);
      message.error("Lỗi khi trả phiếu!");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTicketcallback = async () => {
    try {
      setLoading(true);

      const savedDevices = [...exportLoanData];

      if (savedDevices.length === 0) {
        message.warning("Không có thiết bị đã lưu để trả.");
        setLoading(false);
        return;
      }

      // [FIX STRAPI V5]: Sử dụng documentId để cập nhật
      // Fallback về id nếu chưa có documentId (đề phòng)
      const ticketId = ticket.documentId || ticket.id;

      await updateExportLoanTicket(ticketId, "Đang chờ duyệt");

      message.success("Trả phiếu thành công!");

      // Cập nhật danh sách phiếu ngay sau khi duyệt
      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }

      fetchDevices(); // Cập nhật danh sách thiết bị
      onClose();
    } catch (error) {
      console.error("Lỗi trả phiếu:", error);
      message.error("Lỗi trả phiếu.");
    } finally {
      setLoading(false);
    }
  };


  const updateWarehouseFromDevicescallback = async (devices) => {
    try {
      const warehouseResponse = await fetchWarehouseDetails();
      const warehouseList = warehouseResponse.data; // Dữ liệu Strapi v5 thường nằm trong .data và đã được làm phẳng

      for (const device of devices) {
        if (!device) {
          console.warn("Thiết bị không hợp lệ:", device);
          continue;
        }

        const { Model, TypeKho, totalexport } = device;

        if (!Model) {
          console.warn("Thiết bị thiếu Model:", device);
          continue;
        }

        // [FIX STRAPI V5]: Tìm kiếm trực tiếp, bỏ .attributes
        const kho = warehouseList.find((k) => k.Model === Model);

        if (!kho) {
          console.warn(`❌ Không tìm thấy kho cho Model: ${Model}`);
          continue;
        }

        // [FIX STRAPI V5]: Lấy documentId để update
        const id = kho.documentId || kho.id;

        // [FIX STRAPI V5]: Lấy giá trị trực tiếp từ object kho
        let updatedPOS = kho.POS || 0;
        let updatedPOSHN = kho.POSHN || 0;
        let totalXTK = kho.totalXTK || 0;
        let inventoryDK = kho.inventoryDK || 0;
        let totalNTK = kho.totalNTK || 0;

        // Xử lý logic cộng/trừ số lượng
        // (Giả định logic: Hoàn kho nghĩa là trả lại vào POS, và giảm tổng số đã Xuất Trong Kỳ)
        if (TypeKho === "POS") {
          updatedPOS += totalexport || 0;
        } else if (TypeKho === "POSHN") {
          updatedPOSHN += totalexport || 0;
        }

        totalXTK -= totalexport || 0;

        // Tính tồn cuối kỳ
        const inventoryCK = inventoryDK + totalNTK - totalXTK;

        // Gọi API cập nhật
        await updateWarehouseDetails(id, {
          POS: updatedPOS,
          POSHN: updatedPOSHN,
          totalXTK,
          inventoryCK,
        });

        console.log(`↩️ Đã hoàn kho Model ${Model}: +${totalexport}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi hoàn kho:", error);
    }
  };

  const handleReturnLeaderTicket = async () => {
    try {
      await handleApproveTicketcallback(); // 1. Duyệt phiếu

      const savedDevices = [...exportLoanData]; // 2. Dữ liệu từ phiếu
      if (savedDevices.length === 0) return;

      // 3. Cập nhật trạng thái thiết bị
      await Promise.all(
        savedDevices.map((device) => {
          // [FIX STRAPI V5]: Ưu tiên sử dụng documentId để gọi API update
          const deviceId = device.documentId || device.id;
          return updateExportLoanPOS(deviceId, "Đang chờ duyệt");
        })
      );

      // 4. Cập nhật kho theo danh sách thiết bị
      // Lưu ý: Đảm bảo hàm này xử lý được dữ liệu dạng phẳng (flat structure) của v5
      await updateWarehouseFromDevicescallback(savedDevices);

      message.success("↩️ Đã hoàn thiết bị và cập nhật kho!");
    } catch (error) {
      console.error("❌ Lỗi khi trả phiếu và hoàn kho:", error);
      message.error("Có lỗi xảy ra khi hoàn kho.");
    }
  };


  const handleSaveBasedOnType = async () => {
    const isSupplies = newExportLoans.some(d => d.Type === "Vật tư");
    if (isSupplies) await handleSaveAndUpdateExportlistsForSupplies();
    else await handleSaveAndUpdateExportlists();
  }

  const handleReturnDevice = async (record) => {
    try {
      // 1. [FIX STRAPI V5] Lọc ra tất cả exportListItem (Dữ liệu phẳng, không còn .attributes)
      const matchingExportItems = exportList.filter(
        (item) =>
          item.ProductName === record.ProductName &&
          item.Model === record.Model &&
          item.TypeKho === record.TypeKho &&
          item.Status === "Đang mượn"
      );

      if (matchingExportItems.length === 0) {
        message.warning(
          "Không tìm thấy bản ghi kho tương ứng để trả thiết bị!"
        );
        return;
      }

      // 2. Lấy danh sách serial mà người dùng muốn trả (từ record)
      let deviceSerials = [];
      if (Array.isArray(record.SerialNumber)) {
        deviceSerials = record.SerialNumber;
      } else if (typeof record.SerialNumber === "string") {
        deviceSerials = record.SerialNumber.split(",")
          .map((sn) => sn.trim())
          .filter(Boolean);
      }

      // 3. Với mỗi exportListItem khớp, chuyển serial từ SerialNumberLoan -> SerialNumber
      for (const exportListItem of matchingExportItems) {
        // [FIX STRAPI V5]: Sử dụng documentId để update, fallback về id nếu cần
        const exportListId = exportListItem.documentId || exportListItem.id;

        // [FIX STRAPI V5]: Lấy dữ liệu trực tiếp từ object phẳng
        const oldSerialString = exportListItem.SerialNumber || "";
        const oldSerialArray = oldSerialString
          .split(",")
          .map((sn) => sn.trim())
          .filter(Boolean);

        // Lấy SerialNumberLoan (đã mượn)
        const oldLoanString = exportListItem.SerialNumberLoan || "";
        const oldLoanArray = oldLoanString
          .split(",")
          .map((sn) => sn.trim())
          .filter(Boolean);

        // Xác định serial nào thực sự thuộc exportListItem này và đang nằm trong Loan
        const usedSerials = deviceSerials.filter((sn) =>
          oldLoanArray.includes(sn)
        );
        if (usedSerials.length === 0) {
          // Không có serial nào của exportListItem này cần trả => bỏ qua
          continue;
        }

        // 4. Bỏ các serial trả khỏi Loan
        const newLoanArray = oldLoanArray.filter(
          (sn) => !usedSerials.includes(sn)
        );
        const newLoanString = newLoanArray.join(",");

        // 5. Thêm serial trả về SerialNumber gốc
        const newSerialArray = Array.from(
          new Set([...oldSerialArray, ...usedSerials])
        );
        const newSerialString = newSerialArray.join(",");

        // 6. Cập nhật số lượng ([FIX STRAPI V5]: Lấy trực tiếp)
        const oldQuantity = exportListItem.totalexport ?? 0;
        const oldLoanQuantity = exportListItem.totalexportLoan ?? 0;
        const returnedCount = usedSerials.length;

        // Tăng lại totalexport theo số serial trả
        const newTotalExport = oldQuantity + returnedCount;

        // Giảm totalexportLoan
        let newTotalExportLoan = oldLoanQuantity - returnedCount;
        if (newTotalExportLoan < 0) {
          newTotalExportLoan = 0; // tránh âm
        }

        // 7. Gọi API updateExportlistsSerial
        // Lưu ý: Đảm bảo service này gọi endpoint /api/exportlists/:documentId
        await updateExportlistsSerial(
          exportListId,
          newSerialString, // SerialNumber
          newLoanString, // SerialNumberLoan
          newTotalExport, // totalexport
          newTotalExportLoan // totalexportLoan
        );

        // 8. [FIX STRAPI V5] Cập nhật state exportList (Cấu trúc phẳng)
        setExportList((prev) =>
          prev.map((item) => {
            const itemId = item.documentId || item.id;
            if (itemId === exportListId) {
              return {
                ...item,
                SerialNumber: newSerialString,
                SerialNumberLoan: newLoanString,
                totalexport: newTotalExport,
                totalexportLoan: newTotalExportLoan,
                // Không lồng vào attributes nữa
              };
            }
            return item;
          })
        );
      }

      // 9. Thông báo trả thành công
      message.success("Trả thiết bị thành công!");

      // 10. Xóa dòng record vừa trả
      // [FIX STRAPI V5]: Sử dụng documentId cho hàm xóa (nếu hàm xóa hỗ trợ v5)
      const recordIdToDelete = record.documentId || record.id;
      handleDeleteSavedRow(recordIdToDelete, "exportloan");

    } catch (error) {
      console.error("Lỗi khi trả thiết bị:", error);
      message.error("Đã có lỗi xảy ra khi trả thiết bị.");
    }
  };


  const handleConfirmWarranty = async () => {
    try {
      setLoading(true);
      await updateExportLoanTicket(ticket.id, "Bảo hành");
      message.success("Phiếu đã được trả về trạng thái 'Bảo hành'!");

      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets(); // Load lại danh sách phiếu
      }

      onClose(); // Đóng modal sau khi cập nhật
    } catch (error) {
      message.error("Lỗi khi trả phiếu!");
    } finally {
      setLoading(false);
    }
  };



  // --- LOGIC CHANGE INPUT ---
  const handleProductChange = (id, value) => {
    const matchedProducts = exportList.filter((item) => item.ProductName === value);
    const availableModels = [...new Set(matchedProducts.map((item) => item.Model))];
    setNewExportLoans((prev) => prev.map((device) =>
      device.id === id ? { ...device, ProductName: value, availableModels, Model: undefined, TypeKho: undefined } : device
    ));
  };

  const handleModelChange = (id, model) => {
    const selectedItem = exportList.find((item) => item.Model === model);
    setNewExportLoans((prev) => prev.map((item) =>
      item.id === id ? {
        ...item,
        Model: model,
        DVT: selectedItem?.DVT,
        BrandName: selectedItem?.BrandName,
        Type: selectedItem?.Type
      } : item
    ));
  };

  const getAvailableWarehouses = (productName, model) => {
    const matchingRecords = exportList.filter((item) => item.ProductName === productName && item.Model === model && item.totalexport > 0);
    return [...new Set(matchingRecords.map((item) => item.TypeKho))].map((typeKho) => ({ value: typeKho, label: typeKho }));
  };

  const handleWarehouseChange = (id, selectedWarehouse) => {
    setNewExportLoans((prev) => prev.map((item) => item.id === id ? { ...item, TypeKho: selectedWarehouse } : item));
  };

  const handleSerialChange = (id, value) => {
    setNewExportLoans((prev) => prev.map((item) => item.id === id ? { ...item, SerialNumber: value } : item));
  };

  const handleTotalExportChange = (id, value) => {
    setNewExportLoans((prev) => prev.map((device) => device.id === id ? { ...device, totalexport: value } : device));
  };

  // --- COLUMNS CONFIGURATION ---
  const columns = [
    // {
    //   title: "Tên Thiết Bị",
    //   dataIndex: "ProductName",
    //   key: "ProductName",
    //   width: 250,
    //   render: (_, record) => record.isNew ? (
    //     <Select
    //       showSearch
    //       value={record.ProductName || undefined}
    //       style={{ width: "100%" }}
    //       placeholder="Chọn thiết bị"
    //       onChange={(value) => handleProductChange(record.id, value)}
    //       options={Array.from(new Set(exportList.filter(item => item.Status === "Đang mượn").map(item => item.ProductName)))
    //         .sort().map(name => ({ value: name, label: name }))}
    //       filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
    //     />
    //   ) : <span style={{ fontWeight: 600, color: '#1890ff' }}>{record.ProductName}</span>,
    // },
    // {
    //   title: "Model",
    //   dataIndex: "Model",
    //   key: "Model",
    //   width: 200,
    //   render: (_, record) => record.isNew ? (
    //     <Select
    //       showSearch
    //       value={record.Model || undefined}
    //       style={{ width: "100%" }}
    //       placeholder="Model"
    //       onChange={(value) => handleModelChange(record.id, value)}
    //       options={(record.availableModels || []).map(model => ({ value: model, label: model }))}
    //     />
    //   ) : <span>{record.Model}</span>,
    // },
    {
      title: "Tên Thiết Bị",
      dataIndex: "ProductName",
      key: "ProductName",
      width: 250,
      render: (_, record) => record.isNew ? (
        <Select
          showSearch
          value={record.ProductName || undefined}
          style={{ width: "100%" }}
          placeholder="Chọn thiết bị"
          onChange={(value) => handleProductChange(record.id, value)}
          options={Array.from(new Set(exportList.filter(item => item.Status === "Đang mượn").map(item => item.ProductName)))
            .sort().map(name => ({ value: name, label: name }))}
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
        />
      ) : <span style={{ fontWeight: 600, color: '#1890ff' }}>{record.ProductName}</span>,
    },
    {
      title: "Model",
      dataIndex: "Model",
      key: "Model",
      width: 200,
      render: (_, record) => record.isNew ? (
        <Select
          showSearch
          value={record.Model || undefined}
          style={{ width: "100%" }}
          placeholder="Model"
          onChange={(value) => handleModelChange(record.id, value)}
          // --- BẮT ĐẦU SỬA ĐỔI TẠI ĐÂY ---
          options={(record.availableModels || [])
            .filter((model) => {
              // 1. Lấy danh sách tất cả các Model đang có trong bảng (cả cũ và mới)
              // 2. Loại trừ dòng hiện tại (record.id) để không tự ẩn chính nó khi đang chọn lại
              const usedModels = combinedExportLoanData
                .filter((r) => r.id !== record.id)
                .map((r) => r.Model)
                .filter(Boolean); // Lọc bỏ giá trị rỗng/null

              // 3. Chỉ trả về những model CHƯA có trong danh sách usedModels
              return !usedModels.includes(model);
            })
            .map((model) => ({ value: model, label: model }))
          }
        // --- KẾT THÚC SỬA ĐỔI ---
        />
      ) : <span>{record.Model}</span>,
    },
    {
      title: "Thông tin khác",
      key: "info",
      width: 170,
      render: (_, record) => (
        <div style={{ fontSize: 14, color: '#666' }}>
          <div>Thương hiệu: <span style={{ color: '#000' }}>{record.BrandName || "-"}</span></div>
          <div>Loại: <span style={{ color: '#000' }}>{record.Type || "-"}</span></div>
          <div>ĐVT: <span style={{ color: '#000' }}>{record.DVT || "-"}</span></div>
        </div>
      )
    },
    {
      title: "Kho",
      dataIndex: "TypeKho",
      key: "TypeKho",
      width: 120,
      align: 'center',
      render: (_, record) => record.isNew ? (
        <Select
          value={record.TypeKho || undefined}
          style={{ width: "100%" }}
          onChange={(value) => handleWarehouseChange(record.id, value)}
          options={record.ProductName && record.Model ? getAvailableWarehouses(record.ProductName, record.Model) : []}
          placeholder="Chọn kho"
        />
      ) : <Tag color="geekblue">{record.TypeKho}</Tag>,
    },
    {
      title: "Số lượng",
      dataIndex: "totalexport",
      key: "totalexport",
      width: 100,
      align: 'center',
      render: (_, record) => {
        if (!record.isNew) return <b>{record.totalexport}</b>;

        const matchedItems = exportList.filter(item => item.ProductName === record.ProductName && item.Model === record.Model && item.TypeKho === record.TypeKho && item.Status === "Đang mượn");
        const maxQuantityFromData = matchedItems.reduce((total, item) => total + (item.totalexport || 0), 0);
        const usedQuantityInTable = combinedExportLoanData
          .filter(r => r.id !== record.id && r.ProductName === record.ProductName && r.Model === record.Model && r.TypeKho === record.TypeKho)
          .reduce((sum, r) => sum + (Number(r.totalexport) || 0), 0);
        const remaining = maxQuantityFromData - usedQuantityInTable;

        return (
          <Tooltip title={`Tồn kho khả dụng: ${remaining}`} placement="top">
            <InputNumber
              min={1}
              max={remaining}
              value={record.totalexport}
              onChange={(value) => {
                const currentSNCount = Array.isArray(record.SerialNumber) ? record.SerialNumber.length : (record.SerialNumber || "").split(",").filter(Boolean).length;
                if (record.Type !== "Vật tư" && value < currentSNCount) {
                  message.error(`Đã chọn ${currentSNCount} serial, không thể giảm.`); return;
                }
                handleTotalExportChange(record.id, value);
              }}
              style={{ width: "100%" }}
              status={remaining === 0 ? "error" : ""}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Serial Number",
      dataIndex: "SerialNumber",
      key: "SerialNumber",
      width: 230,
      render: (_, record) => {
        if (!record.isNew) {
          const serials = Array.isArray(record.SerialNumber) ? record.SerialNumber : (record.SerialNumber || "").split(",");
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {serials.map((s, i) => s && <Tag key={i} style={{ marginRight: 0 }}>{s}</Tag>)}
            </div>
          );
        }

        const productName = record.ProductName;
        const model = record.Model;
        const warehouse = record.TypeKho;
        // Sử dụng exportList đã được Flatten
        const sources = exportList.filter(item => item.ProductName === productName && item.Model === model && item.TypeKho === warehouse && item.Status === "Đang mượn");

        const allSerialString = sources.reduce((acc, curr) => {
          const serial = curr.SerialNumber || "";
          return acc ? `${acc},${serial}` : serial;
        }, "");

        let serialList = allSerialString ? allSerialString.split(",").map(sn => sn.trim()).filter(sn => sn.length > 0) : [];
        const selectedSerialsInTable = combinedExportLoanData.filter(r => r.id !== record.id).flatMap(r => Array.isArray(r.SerialNumber) ? r.SerialNumber : (r.SerialNumber || "").split(",").map(sn => sn.trim()).filter(sn => sn));
        const currentSerials = Array.isArray(record.SerialNumber) ? record.SerialNumber : (record.SerialNumber || "").split(",").map(sn => sn.trim()).filter(Boolean);
        const availableSerials = serialList.filter(sn => !selectedSerialsInTable.includes(sn) || currentSerials.includes(sn));

        let currentValue = record.SerialNumber;
        if (Array.isArray(currentValue) && currentValue.length === 0) currentValue = undefined;
        else if (typeof currentValue === "string" && !currentValue.trim()) currentValue = undefined;

        return (
          <Select
            mode="multiple"
            placeholder="Chọn Serial"
            style={{ width: "100%", minWidth: 200 }}
            status={record.Type !== "Vật tư" && Array.isArray(currentValue) && currentValue.length !== Number(record.totalexport) ? "error" : ""}
            value={currentValue}
            onChange={(value) => {
              if (record.Type !== "Vật tư" && value.length > (Number(record.totalexport) || 0)) {
                message.error(`Chỉ được chọn tối đa ${record.totalexport} serial.`); return;
              }
              handleSerialChange(record.id, value);
            }}
            options={availableSerials.map(sn => ({ value: sn, label: sn }))}
          />
        );
      }
    },
    {
      title: "Trạng Thái",
      dataIndex: "Status",
      key: "Status",
      width: 140,
      align: 'center',
      render: (status) => <Tag color={getStatusColor(status || "Mới")}>{status || "Mới"}</Tag>
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        // Dùng ticketData
        const isCreator = ticketData?.Person === account?.Name;
        const isPending = ticketData?.Status === "Đang tạo phiếu";
        const canDelete = isCreator && isPending;

        return (
          <Space>
            {record.isNew && canDelete ? (
              <Popconfirm title="Xóa dòng này?" onConfirm={() => handleDeleteRow(record.id, "exportloan")}>
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ) : (
              <>
                {canDelete && !record.id && (
                  <Popconfirm title="Xóa thiết bị đã lưu?" onConfirm={() => handleDeleteSavedRow(record, "exportloan")}>
                    <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} /></Tooltip>
                  </Popconfirm>
                )}
                {ticketData?.Status === "Đang tạo phiếu" && record.id && !record.isNew && (
                  <Popconfirm title="Trả thiết bị về kho?" onConfirm={() => handleReturnDevice(record)}>
                    <Tooltip title="Trả thiết bị"><Button type="text" style={{ color: '#faad14' }} icon={<RollbackOutlined />} /></Tooltip>
                  </Popconfirm>
                )}
              </>
            )}
          </Space>
        );
      },
    },
  ];

  // --- RENDER FOOTER ---
  const renderFooterButtons = () => {
    const btns = [
      <Button key="cancel" icon={<CloseOutlined />} onClick={onClose}>Đóng</Button>
    ];

    const status = ticketData?.Status;
    const person = ticketData?.Person;

    const leftBtns = [];
    if (account.Leader && status === "Đang chờ duyệt") {
      leftBtns.push(<Button key="return" danger icon={<UndoOutlined />} onClick={handleReturnTicket}>Trả Phiếu</Button>);
    }
    if (account.Leader && (status === "Duyệt" || status === "Đã giao")) {
      leftBtns.push(<Button key="cancelApprove" danger type="dashed" icon={<MinusCircleOutlined />} onClick={handleReturnLeaderTicket}>Hủy duyệt</Button>);
    }

    const rightBtns = [];

    if (status === "Đang tạo phiếu" && person === account?.Name) {
      rightBtns.push(<Button key="save" icon={<SaveOutlined />} onClick={handleSaveBasedOnType}>Lưu nháp</Button>);
      rightBtns.push(<Button key="send" type="primary" icon={<FileAddOutlined />} onClick={handleConfirmTicket}>Gửi phiếu</Button>);
    }

    if (account.Exportlist && status === "Đang chờ duyệt") {
      rightBtns.push(<Button key="approve" type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} icon={<CheckCircleOutlined />} loading={loading} onClick={handleApproveTicketAndUpdateDevices}>Duyệt Phiếu</Button>);
    }

    if ((status === "Duyệt" || status === "Đã giao") && person === account?.Name) {
      rightBtns.push(<Button key="print" icon={<PrinterOutlined />} onClick={() => setPrintVisible(true)}>In Phiếu</Button>);
    }
    if (status === "Duyệt" && person === account?.Name) {
      rightBtns.push(<Button key="export" type="primary" danger icon={<ExportOutlined />} onClick={handleImportDeviceServicesTicket}>Xuất Phiếu</Button>);
    }

    if (account.Receivelistkho && status === "Đã giao") {
      rightBtns.push(<Button key="confirmAdmin" type="primary" icon={<CheckSquareOutlined />} onClick={() => updateExportLoanTicket(ticketData.documentId || ticketData.id, "Xác nhận").then(() => { reloadTickets(); onClose(); })}>Xác nhận</Button>);
    }
    if (account.Leader && status === "Xác nhận") {
      rightBtns.push(<Button key="warranty" style={{ background: '#faad14', borderColor: '#faad14', color: '#fff' }} icon={<ToolOutlined />} onClick={handleConfirmWarranty}>Bảo hành</Button>);
    }

    if (status === "Xác nhận" && account.Invoiceer) {
      rightBtns.push(<Button key="complete" type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} icon={<SafetyCertificateOutlined />} onClick={handleHandoverTicket}>Hoàn thành</Button>);
    }
    if (status === "Chờ xuất hóa đơn" && account.Invoiceer) {
      rightBtns.push(<Button key="issueInvoice" type="primary" style={{ background: '#f5222d', borderColor: '#f5222d' }} icon={<CalculatorOutlined />} onClick={() => setIsModalVisible(true)}>Xuất hóa đơn</Button>);
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Space>{leftBtns}</Space>
        <Space>{btns}{rightBtns}</Space>
      </div>
    );
  };

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileAddOutlined style={{ color: '#1890ff', fontSize: 20 }} />
              <span style={{ fontSize: 18, fontWeight: 600, color: '#001529' }}>Chi Tiết Phiếu Mượn Thiết Bị</span>
            </div>
            {ticketData?.Status && <Tag color={getStatusColor(ticketData.Status)} style={{ fontSize: 14, padding: '4px 10px' }}>{ticketData.Status}</Tag>}
          </div>
        }
        open={isOpen}
        onCancel={onClose}
        width={1300}
        footer={renderFooterButtons()}
        style={{ top: 20 }}
      >
        <Spin spinning={loading} tip="Đang xử lý dữ liệu...">
          {ticketData?.Votes && (
            <Card
              size="small"
              style={{ marginBottom: 16, background: '#f0f5ff', borderColor: '#d6e4ff' }}
              bordered={true}
            >
              <Descriptions column={{ xxl: 4, xl: 4, lg: 2, md: 2, sm: 1, xs: 1 }} size="small" labelStyle={{ fontWeight: 'bold' }}>
                <Descriptions.Item label="Mã phiếu">
                  <Space>
                    <Tag color="blue" style={{ fontSize: '14px', fontWeight: 'bold' }}>{ticketData.Votes}</Tag>
                    <Tooltip title="Sao chép mã phiếu">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined style={{ color: '#1890ff' }} />}
                        onClick={() => {
                          navigator.clipboard.writeText(ticketData.Votes);
                          message.success("Đã sao chép mã phiếu!");
                        }}
                      />
                    </Tooltip>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Người tạo">{ticketData.Person}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {ticketData.createdAt ? dayjs(ticketData.createdAt).format("DD/MM/YYYY HH:mm") : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái"><Tag color={getStatusColor(ticketData.Status)}>{ticketData.Status}</Tag></Descriptions.Item>
                <Descriptions.Item label="Ghi chú" span={2}>{ticketData.Note || "Không có"}</Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#1890ff',
              borderLeft: '4px solid #1890ff',
              paddingLeft: 10
            }}>
              Danh sách thiết bị
            </div>

            {ticketData?.Status === "Đang tạo phiếu" && ticketData?.Person === account?.Name && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddRow("exportloan")}>
                Thêm thiết bị
              </Button>
            )}
          </div>

          <Table
            bordered
            dataSource={combinedExportLoanData}
            rowKey="id"
            columns={columns}
            pagination={false}
            scroll={{ x: 1200, y: 500 }}
            size="middle"
            rowClassName={(record) => record.isNew ? 'bg-new-row' : ''}
          />

          <PrintTicketExportLoan
            isOpen={printVisible}
            onClose={() => setPrintVisible(false)}
            ticket={ticketData || {}}
            handoverDevices={exportLoanData || []}
            autoPrint={true}
          />
          <ExportInvoiceModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onConfirm={handleExportTicket}
            ticketId={ticketData?.id}
            invoiceNumber={invoiceNumber}
            setInvoiceNumber={setInvoiceNumber}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default TicketExportLoanModal;
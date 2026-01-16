import Draggable from "react-draggable";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Table,
  message,
  Select,
  Popconfirm,
  InputNumber,
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
import PrintTicketExportLoan from "./PrintTicketExportLoan"; // Import modal con
import ExportInvoiceModal from "./ExportInvoiceModal";
import { Spin } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  SafetyCertificateTwoTone,
  MinusCircleTwoTone,
  SaveTwoTone,
  FileAddTwoTone,
  CalculatorTwoTone,
  WarningTwoTone,
  CheckSquareTwoTone,
  LeftSquareTwoTone,
  LeftCircleTwoTone,
  ReconciliationTwoTone,
  CheckCircleTwoTone,
  PrinterTwoTone,
} from "@ant-design/icons"; // PrinterOutlined

const TicketExportLoanModal = ({
  isOpen,
  onClose,
  ticket,
  fetchDevices,
  fetchTickets,
  reloadTickets,
  serialNumberOptions = [],
}) => {
  const [disabled, setDisabled] = useState(false); // Điều khiển việc kéo modal
  const [loading, setLoading] = useState(false);

  //const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Dữ liệu đã lưu từ API
  const [exportLoanData, setExportLoanData] = useState([]);

  // Dữ liệu mới thêm vào (chưa lưu)
  const [newExportLoans, setNewExportLoans] = useState([]);

  const [exportList, setExportList] = useState([]); // Danh sách thiết bị từ API fetchExportlists

  // State quản lý dòng đang được chỉnh sửa (cho các dòng đã lưu)
  const [editingRowId, setEditingRowId] = useState(null);

  const [printVisible, setPrintVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    fetchExportlists().then((response) => {
      setExportList(response.data); // Lưu danh sách thiết bị vào state
    });
  }, []);

  // Khi modal mở và có ticket, fetch dữ liệu từ API
  useEffect(() => {
    if (isOpen && ticket?.attributes?.Votes) {
      console.log("Ticket value:", ticket.attributes.Votes);
      // Fetch bàn giao
      fetchExportLoanPOS(ticket.attributes.Votes)
        .then((responseData) => {
          console.log("Response Handover API:", responseData);
          const devices =
            responseData && responseData.data
              ? responseData.data.map((item) => ({
                id: item.id,
                ...item.attributes,
              }))
              : Array.isArray(responseData)
                ? responseData.map((item) => ({
                  id: item.id,
                  ...item.attributes,
                }))
                : [];
          console.log("Mapped exportloan devices:", devices);
          setExportLoanData(devices);
        })
        .catch((error) => {
          console.error("Lỗi tải thiết bị bàn giao:", error);
          message.error("Lỗi tải thiết bị bàn giao.");
        });
    }
  }, [isOpen, ticket?.attributes?.Votes]);

  // Reset state khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setExportLoanData([]);
      setNewExportLoans([]);
      setEditingRowId(null);
    }
  }, [isOpen]);

  // Kết hợp dữ liệu hiển thị
  const combinedExportLoanData = [...exportLoanData, ...newExportLoans];

  // Hàm thêm dòng mới
  const handleAddRow = (type) => {
    if (!ticket) {
      message.error("Vui lòng chọn phiếu trước khi thêm thiết bị!");
      return;
    }

    // Lấy trực tiếp tên từ account
    const newDevice = {
      id: Date.now(), // id tạm thời
      ProductName: ticket.attributes.ProductName || "",
      Model: "",
      BrandName: "",
      DVT: "",
      TypeKho: "",
      totalexport: "",
      SerialNumber: "",
      Ticket: ticket.attributes.Ticket,
      Votes: ticket.attributes.Votes,
      NameExportLoan: account?.Name || "", // GÁN TRỰC TIẾP TỪ account
      Status: "",
      Note: "",
      Type: "",
      isNew: true,
    };

    if (type === "exportloan") {
      setNewExportLoans((prev) => [...prev, newDevice]);
    }
  };

  // Hàm cập nhật giá trị cho dòng mới (dành cho new rows)
  const handleInputChange = (id, field, value, type) => {
    if (type === "exportloan") {
      setNewExportLoans((prev) =>
        prev.map((device) =>
          device.id === id ? { ...device, [field]: value } : device
        )
      );
    }
  };

  // Hàm xóa dòng mới (chỉ áp dụng cho new rows)
  const handleDeleteRow = (id, type) => {
    if (type === "exportloan") {
      setNewExportLoans((prev) => prev.filter((device) => device.id !== id));
    }
  };

  // Hàm cập nhật một dòng đã lưu (sửa saved row)
  const handleUpdateRow = async (id, type) => {
    let device;
    if (type === "exportloan") {
      device = exportLoanData.find((d) => d.id === id);
    }
    if (!device || !device.SerialNumber) {
      message.warning("Thiết bị không hợp lệ để cập nhật.");
      return;
    }
    try {
      setLoading(true);
      // Giả sử updateDeviceBySerial cập nhật dựa trên SerialNumber
      //  await updateDeviceBySerial(device.SerialNumber, device, [device]);
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

  const handleSaveAndUpdateExportlists = async () => {
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
            Votes: ticket.attributes?.Votes || "",
            Ticket: ticket.attributes?.Ticket || "",
            Status: device.Status || "Đang chờ duyệt",
          };
          console.log("Payload exportloan deviceData:", deviceData);
          return createExportLoanPOS(deviceData);
        });

      await Promise.all([...exportloanPromises]);
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

  const handleDeleteSavedRow = async (id, type) => {
    try {
      setLoading(true);
      if (type === "exportloan") {
        await deleteExportLoanPOS(id);
        // Cập nhật state của dữ liệu đã lưu cho bàn giao
        setExportLoanData((prev) => prev.filter((device) => device.id !== id));
      }
      message.success("Đã xóa thiết bị thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa thiết bị đã lưu:", error);
      message.error("Lỗi khi xóa thiết bị đã lưu.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTicketAndUpdateDevices = async () => {
    try {
      await handleApproveTicket(); // 1. Duyệt phiếu

      const savedDevices = [...exportLoanData]; // 2. Dữ liệu từ phiếu
      if (savedDevices.length === 0) return;

      // 3. Cập nhật trạng thái thiết bị
      await Promise.all(
        savedDevices.map((device) => updateExportLoanPOS(device.id, "Duyệt"))
      );

      // 4. Cập nhật kho theo danh sách thiết bị
      await updateWarehouseFromDevices(savedDevices);

      message.success("✅ Thiết bị và kho đã được cập nhật!");
    } catch (error) {
      console.error("❌ Lỗi khi duyệt phiếu và cập nhật kho:", error);
      message.error("Đã có lỗi xảy ra khi cập nhật.");
    }
  };

  const updateWarehouseFromDevices = async (devices) => {
    try {
      const warehouseResponse = await fetchWarehouseDetails();
      const warehouseList = warehouseResponse.data;

      for (const device of devices) {
        if (!device) {
          console.warn("Thiết bị không hợp lệ:", device);
          continue;
        }

        const { Model, TypeKho, totalexport, Type } = device;

        if (!Model) {
          console.warn("Thiết bị thiếu Model:", device);
          continue;
        }

        // Tìm kho theo Model
        const kho = warehouseList.find((k) => k.attributes.Model === Model);
        if (!kho) {
          console.warn(`❌ Không tìm thấy kho cho Model: ${Model}`);
          continue;
        }

        const id = kho.id;
        const attributes = kho.attributes;

        // if (Type === "Vật tư") {
        //     console.log(`📦 Bỏ qua hoặc xử lý riêng vật tư: ${Model}`);
        //     continue;
        // }

        let updatedPOS = attributes.POS || 0;
        let updatedPOSHN = attributes.POSHN || 0;
        let totalXTK = attributes.totalXTK || 0;

        if (TypeKho === "POS") {
          updatedPOS -= totalexport || 0;
        } else if (TypeKho === "POSHN") {
          updatedPOSHN -= totalexport || 0;
        }

        totalXTK += totalexport || 0;

        const inventoryCK =
          (attributes.inventoryDK || 0) + (attributes.totalNTK || 0) - totalXTK;

        await updateWarehouseDetails(id, {
          POS: updatedPOS,
          POSHN: updatedPOSHN,
          totalXTK,
          inventoryCK,
        });

        console.log(`✅ Đã cập nhật kho cho Model ${Model}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật kho:", error);
    }
  };

  //-----------------------------------------------------------------------------------------------------------

  const handleImportDeviceServicesTicket = async () => {
    // Cập nhật trạng thái phiếu
    await updateExportLoanTicket(ticket.id, "Đã giao");
    message.success("Phiếu đã chuyển sang trạng thái 'Đã giao'!");

    if (!exportLoanData || exportLoanData.length === 0) {
      message.warning("Không có thiết bị để xuất!");
      return;
    }

    // Cập nhật danh sách phiếu ngay sau khi xác nhận
    if (reloadTickets) {
      await reloadTickets();
    }

    try {
      // Gửi từng thiết bị lên API để nhập vào kho (trừ "Vật tư")
      for (const device of exportLoanData) {
        // Bỏ qua nếu là vật tư
        // if (device.Type === "Vật tư") continue;
        if (device.TypeDevice === "QLTB") continue;

        const serialNumbers = device.SerialNumber.includes(",")
          ? device.SerialNumber.split(",").map((s) => s.trim())
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

      message.success("Xuất thiết bị thành công!");
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Lỗi xuất thiết bị:", error);
      message.error("Lỗi khi xuất thiết bị.");
    }
  };

  const handleApproveTicket = async () => {
    try {
      setLoading(true);

      const savedDevices = [...exportLoanData];

      if (savedDevices.length === 0) {
        message.warning("Không có thiết bị đã lưu để duyệt.");
        setLoading(false);
        return;
      }

      //await updateExportLoanTicket(ticket.id, "Duyệt");

      // message.success("Duyệt phiếu thành công!");

      await updateExportLoanTicketv1(ticket.id, {
        Status: "Duyệt",
        PersonApprove: account.Name,
      });

      message.success(`✅ Phiếu được duyệt bởi: ${account.Name}`);
      // Cập nhật danh sách phiếu ngay sau khi duyệt
      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }

      fetchDevices(); // Cập nhật danh sách thiết bị
      onClose();
    } catch (error) {
      console.error("Lỗi duyệt phiếu:", error);
      message.error("Lỗi duyệt phiếu.");
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

      await updateExportLoanTicket(ticket.id, "Đang chờ duyệt");

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

  const handleApproveReturnWarehouse = async () => {
    try {
      setLoading(true);

      const savedDevices = [...exportLoanData];

      if (savedDevices.length === 0) {
        message.warning("Không có thiết bị đã lưu để trả.");
        setLoading(false);
        return;
      }

      await updateExportLoanTicket(ticket.id, "Trả kho");

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

  const handleConfirmTicket = async () => {
    try {
      setLoading(true);

      // Xác định loại xử lý dựa vào Type
      const isSupplies = newExportLoans.some(
        (device) => device.Type === "Vật tư"
      );

      if (isSupplies) {
        await handleSaveAndUpdateExportlistsForSupplies();
      } else {
        await handleSaveAndUpdateExportlists();
      }

      // Sau khi lưu thành công, cập nhật trạng thái phiếu
      await updateExportLoanTicket(ticket.id, "Đang chờ duyệt");
      message.success(
        "Phiếu đã lưu và chuyển sang trạng thái 'Đang chờ duyệt'!"
      );

      // Cập nhật danh sách phiếu ngay sau khi xác nhận
      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }

      // Đóng modal sau khi cập nhật
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái phiếu:", error);
      message.error("Có lỗi xảy ra khi xác nhận phiếu.");
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
        let sortedExportItems = exportList
          .filter(
            (item) =>
              item.attributes.ProductName === supply.ProductName &&
              item.attributes.Model === supply.Model &&
              item.attributes.TypeKho === supply.TypeKho &&
              item.attributes.Status === "Đang mượn"
          )
          .sort(
            (a, b) =>
              new Date(a.attributes.createdAt) -
              new Date(b.attributes.createdAt)
          );

        for (const exportListItem of sortedExportItems) {
          if (remainingQuantity <= 0) break;

          const exportListId = exportListItem.id;
          let oldQuantity = exportListItem.attributes.totalexport ?? 0;
          let oldLoanQuantity = exportListItem.attributes.totalexportLoan ?? 0;

          let usedQuantity = Math.min(remainingQuantity, oldQuantity);
          let newTotalExport = oldQuantity - usedQuantity;
          let newTotalExportLoan = oldLoanQuantity + usedQuantity;
          remainingQuantity -= usedQuantity;

          await updateExportlistsSerial(
            exportListId,
            "", // Không cần serial number
            "", // Không cần serial number loan
            newTotalExport,
            newTotalExportLoan
          );

          setExportList((prev) =>
            prev.map((item) =>
              item.id === exportListId
                ? {
                  ...item,
                  attributes: {
                    ...item.attributes,
                    totalexport: newTotalExport,
                    totalexportLoan: newTotalExportLoan,
                  },
                }
                : item
            )
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
    try {
      if (!invoiceNumber.trim()) {
        message.warning("Vui lòng nhập số hóa đơn!");
        return;
      }

      setLoading(true);

      // Gọi API mới updateExportLoanTicketInvoice
      await updateExportLoanTicketInvoice(
        ticket.id,
        "Đã xuất hóa đơn",
        invoiceNumber
      );

      message.success("Phiếu đã chuyển sang trạng thái 'Đã xuất hóa đơn'!");

      // Cập nhật danh sách phiếu ngay sau khi xác nhận
      if (reloadTickets) {
        console.log("🔄 Gọi reloadTickets()...");
        await reloadTickets();
      }

      // Đóng modal sau khi cập nhật
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái phiếu:", error);
      message.error("Có lỗi xảy ra khi xác nhận phiếu.");
    } finally {
      setLoading(false);
    }
  };

  const handleHandoverTicket = async () => {
    try {
      setLoading(true);
      console.log("📌 Account:", account); // Kiểm tra giá trị account
      if (!account?.Name) {
        throw new Error("Không tìm thấy thông tin tài khoản.");
      }

      // Cập nhật trạng thái phiếu
      await updateExportLoanTicket(ticket.id, "Chờ xuất hóa đơn");
      message.success("Phiếu đã chuyển sang trạng thái 'Chờ xuất hóa đơn'!");

      // Cập nhật người xuất hóa đơn
      console.log(`🔄 Gửi API cập nhật người xuất hóa đơn: ${account.Name}`);
      await updateExportLoanTicketPersonInvoice(ticket.id, account.Name);
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

  //   const handleHandoverTicket = async () => {
  //   try {
  //     setLoading(true);
  //     console.log("📌 Account:", account);
  //     if (!account?.Name) {
  //       throw new Error("Không tìm thấy thông tin tài khoản.");
  //     }

  //     // Cập nhật trạng thái phiếu
  //     await updateExportLoanTicket(ticket.id, "Chờ xuất hóa đơn");
  //     message.success("Phiếu đã chuyển sang trạng thái 'Chờ xuất hóa đơn'!");

  //     // Cập nhật người xuất hóa đơn
  //     console.log(`🔄 Gửi API cập nhật người xuất hóa đơn: ${account.Name}`);
  //     await updateExportLoanTicketPersonInvoice(ticket.id, account.Name);
  //     message.success(`Người xuất hóa đơn: ${account.Name}`);

  //     // Cập nhật danh sách phiếu ngay sau khi xác nhận
  //     if (reloadTickets) {
  //       console.log("🔄 Gọi reloadTickets()...");
  //       await reloadTickets(); // Đảm bảo chờ reloadTickets hoàn tất
  //     }

  //     // Đóng modal sau khi tất cả tác vụ hoàn tất
  //     onClose();
  //   } catch (error) {
  //     console.error("⛔ Lỗi khi cập nhật trạng thái phiếu:", error);
  //     message.error("Có lỗi xảy ra khi xác nhận phiếu.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleReturnTicket = async () => {
    try {
      setLoading(true);
      await updateExportLoanTicket(ticket.id, "Đang tạo phiếu");
      message.success("Phiếu đã được trả về trạng thái 'Đang tạo phiếu'!");

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

  //---------------------------------------------------------------------------------------------------------------------
  const handleConfirmAdminTicket = async () => {
    try {
      setLoading(true);
      await updateExportLoanTicket(ticket.id, "Xác nhận");
      message.success("Phiếu đã được trả về trạng thái 'Xác nhận'!");

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

  const handleReturnLeaderTicket = async () => {
    try {
      await handleApproveTicketcallback(); // 1. Duyệt phiếu

      const savedDevices = [...exportLoanData]; // 2. Dữ liệu từ phiếu
      if (savedDevices.length === 0) return;

      // 3. Cập nhật trạng thái thiết bị
      await Promise.all(
        savedDevices.map((device) =>
          updateExportLoanPOS(device.id, "Đang chờ duyệt")
        )
      );

      // 4. Cập nhật kho theo danh sách thiết bị
      await updateWarehouseFromDevicescallback(savedDevices);

      message.success("↩️ Đã hoàn thiết bị và cập nhật kho!");
    } catch (error) {
      console.error("❌ Lỗi khi trả phiếu và hoàn kho:", error);
      message.error("Có lỗi xảy ra khi hoàn kho.");
    }
  };

  const handleReturnWarehouse = async () => {
    try {
      await handleApproveReturnWarehouse(); // 1. Duyệt phiếu

      const savedDevices = [...exportLoanData]; // 2. Dữ liệu từ phiếu
      if (savedDevices.length === 0) return;

      // 3. Cập nhật trạng thái thiết bị
      await Promise.all(
        savedDevices.map((device) => updateExportLoanPOS(device.id, "Trả kho"))
      );

      // 4. Cập nhật kho theo danh sách thiết bị
      await updateWarehouseFromDevicescallback(savedDevices);

      message.success("↩️ Đã hoàn thiết bị và cập nhật kho!");
    } catch (error) {
      console.error("❌ Lỗi khi trả phiếu và hoàn kho:", error);
      message.error("Có lỗi xảy ra khi hoàn kho.");
    }
  };

  const updateWarehouseFromDevicescallback = async (devices) => {
    try {
      const warehouseResponse = await fetchWarehouseDetails();
      const warehouseList = warehouseResponse.data;

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

        const kho = warehouseList.find((k) => k.attributes.Model === Model);
        if (!kho) {
          console.warn(`❌ Không tìm thấy kho cho Model: ${Model}`);
          continue;
        }

        const id = kho.id;
        const attributes = kho.attributes;

        let updatedPOS = attributes.POS || 0;
        let updatedPOSHN = attributes.POSHN || 0;
        let totalXTK = attributes.totalXTK || 0;

        if (TypeKho === "POS") {
          updatedPOS += totalexport || 0;
        } else if (TypeKho === "POSHN") {
          updatedPOSHN += totalexport || 0;
        }

        totalXTK -= totalexport || 0;

        const inventoryCK =
          (attributes.inventoryDK || 0) + (attributes.totalNTK || 0) - totalXTK;

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

  //------------------------------------------------------------------------------------------------------
  const handleProductChange = (id, value) => {
    // Lọc ra các sản phẩm có cùng tên dựa trên giá trị mới
    const matchedProducts = exportList.filter(
      (item) => item.attributes.ProductName === value
    );

    // Lấy danh sách Model duy nhất
    const availableModels = [
      ...new Set(matchedProducts.map((item) => item.attributes.Model)),
    ];

    // Cập nhật lại device có id tương ứng
    setNewExportLoans((prev) =>
      prev.map((device) => {
        if (device.id === id) {
          return {
            ...device,
            ProductName: value,
            availableModels, // cập nhật danh sách model có sẵn cho device này
            // Nếu device đã có Model không còn trong availableModels, có thể reset về undefined
            Model: availableModels.includes(device.Model)
              ? device.Model
              : undefined,
          };
        }
        return device;
      })
    );
  };

  const handleModelChange = (id, model) => {
    // Tìm thông tin DVT từ exportList dựa trên model đã chọn
    const selectedItem = exportList.find(
      (item) => item.attributes.Model === model
    );
    const dvt = selectedItem ? selectedItem.attributes.DVT : "";
    const brandName = selectedItem ? selectedItem.attributes.BrandName : "";
    const types = selectedItem ? selectedItem.attributes.Type : "";

    // Cập nhật cho dòng mới
    setNewExportLoans((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            Model: model,
            DVT: dvt,
            BrandName: brandName,
            Type: types,
          }
          : item
      )
    );

    // Nếu dòng đã lưu cũng cần cập nhật:
    setExportLoanData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            Model: model,
            DVT: dvt,
            BrandName: brandName,
            Type: types,
          }
          : item
      )
    );
  };

  const getAvailableWarehouses = (productName, model) => {
    // Lọc các record phù hợp với productName, model và có số lượng tồn > 0
    const matchingRecords = exportList.filter(
      (item) =>
        item.attributes.ProductName === productName &&
        item.attributes.Model === model &&
        item.attributes.totalexport > 0
    );

    // Lấy danh sách kho duy nhất
    const distinctWarehouses = Array.from(
      new Set(matchingRecords.map((item) => item.attributes.TypeKho))
    );

    return distinctWarehouses.map((typeKho) => ({
      value: typeKho,
      label: typeKho,
    }));
  };
  const handleWarehouseChange = (id, selectedWarehouse) => {
    setNewExportLoans((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, TypeKho: selectedWarehouse } : item
      )
    );
  };

  const handleSerialChange = (id, value) => {
    // Nếu mode là multiple thì value là mảng, nếu không thì là string.
    // Cập nhật state của newExportLoans (hoặc exportLoanData nếu dùng cho dòng đã lưu)
    setNewExportLoans((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, SerialNumber: value } : item
      )
    );
  };

  const handleTotalExportChange = (id, value) => {
    setNewExportLoans((prev) =>
      prev.map((device) => {
        if (device.id === id) {
          return { ...device, totalexport: value };
        }
        return device;
      })
    );
  };

  const handleReturnDevice = async (record) => {
    try {
      // 1. Lọc ra tất cả exportListItem có cùng ProductName, Model, TypeKho và Status = "Đang mượn"
      const matchingExportItems = exportList.filter(
        (item) =>
          item.attributes.ProductName === record.ProductName &&
          item.attributes.Model === record.Model &&
          item.attributes.TypeKho === record.TypeKho &&
          item.attributes.Status === "Đang mượn"
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
        const exportListId = exportListItem.id;

        // Lấy SerialNumber gốc
        const oldSerialString = exportListItem.attributes.SerialNumber || "";
        const oldSerialArray = oldSerialString
          .split(",")
          .map((sn) => sn.trim())
          .filter(Boolean);

        // Lấy SerialNumberLoan (đã mượn)
        const oldLoanString = exportListItem.attributes.SerialNumberLoan || "";
        const oldLoanArray = oldLoanString
          .split(",")
          .map((sn) => sn.trim())
          .filter(Boolean);

        // Xác định serial nào thực sự thuộc exportListItem này và đang nằm trong Loan
        // (phần giao nhau giữa deviceSerials và oldLoanArray)
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

        // 6. Cập nhật số lượng
        const oldQuantity = exportListItem.attributes.totalexport ?? 0;
        const oldLoanQuantity = exportListItem.attributes.totalexportLoan ?? 0;
        const returnedCount = usedSerials.length;

        // Tăng lại totalexport theo số serial trả
        const newTotalExport = oldQuantity + returnedCount;

        // Giảm totalexportLoan
        let newTotalExportLoan = oldLoanQuantity - returnedCount;
        if (newTotalExportLoan < 0) {
          newTotalExportLoan = 0; // tránh âm
        }

        // 7. Gọi API updateExportlistsSerial (nếu có) để cập nhật server
        await updateExportlistsSerial(
          exportListId,
          newSerialString, // SerialNumber
          newLoanString, // SerialNumberLoan
          newTotalExport, // totalexport
          newTotalExportLoan // totalexportLoan
        );

        // 8. Cập nhật state exportList để UI hiển thị ngay
        setExportList((prev) =>
          prev.map((item) => {
            if (item.id === exportListId) {
              return {
                ...item,
                attributes: {
                  ...item.attributes,
                  SerialNumber: newSerialString,
                  SerialNumberLoan: newLoanString,
                  totalexport: newTotalExport,
                  totalexportLoan: newTotalExportLoan,
                },
              };
            }
            return item;
          })
        );
      }

      // 9. Thông báo trả thành công
      message.success("Trả thiết bị thành công!");

      // 10. (Tuỳ chọn) Xóa dòng record vừa trả
      //    Nếu bạn muốn xóa hẳn row này khỏi bảng hiển thị.
      //    handleDeleteSavedRow là hàm bạn dùng cho nút Xoá.
      handleDeleteSavedRow(record.id, "exportloan");
    } catch (error) {
      console.error("Lỗi khi trả thiết bị:", error);
      message.error("Đã có lỗi xảy ra khi trả thiết bị.");
    }
  };

  //------------------------------------------------------------------------------------------------

  const handleSaveBasedOnType = async () => {
    try {
      // Kiểm tra xem có vật tư trong danh sách không
      const isSupplies = newExportLoans.some(
        (device) => device.Type === "Vật tư"
      );

      if (isSupplies) {
        await handleSaveAndUpdateExportlistsForSupplies();
      } else {
        await handleSaveAndUpdateExportlists();
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu theo loại thiết bị/vật tư:", error);
      message.error("Có lỗi xảy ra khi lưu.");
    }
  };

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <>
      <Modal
        // title={
        //   <div
        //     style={{ cursor: "move" }} // Đặt chiều rộng đúng cách
        //     onMouseOver={() => setDisabled(false)}
        //     onMouseOut={() => setDisabled(true)}
        //   >
        //     Chi Tiết Phiếu
        //   </div>
        // }
        title="Chi Tiết Phiếu"
        open={isOpen}
        onCancel={onClose}
        getContainer={document.body} // Đảm bảo Modal "portal" ra ngoài
        footer={[
          <Button key="cancel" icon={<CloseOutlined />} onClick={onClose}>
            Đóng
          </Button>,
          account.Leader === true &&
          ticket?.attributes?.Status === "Đang chờ duyệt" && (
            <Button
              key="return"
              type="default"
              danger
              icon={<LeftSquareTwoTone />}
              onClick={handleReturnTicket}
            >
              Trả Phiếu
            </Button>
          ),
          account.Exportlist === true &&
          ticket?.attributes?.Status === "Đang chờ duyệt" && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleTwoTone />}
              onClick={handleApproveTicketAndUpdateDevices}
              loading={loading} // ✅ hiện spinner khi loading = true
              disabled={loading} // ✅ không cho click lại khi đang xử lý
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            >
              {loading ? "Đang xử lý..." : "Duyệt Phiếu"}{" "}
              {/* ✅ thay đổi text theo trạng thái */}
            </Button>
          ),
          ticket?.attributes?.Status === "Đang tạo phiếu" &&
          ticket?.attributes?.Person === account?.Name && (
            <Button
              key="saveNew"
              type="default"
              icon={<SaveTwoTone />}
              onClick={handleSaveBasedOnType} // gọi hàm bọc
            >
              Lưu
            </Button>
          ),
          ticket?.attributes?.Status === "Đang tạo phiếu" &&
          ticket?.attributes?.Person === account?.Name && (
            <Button
              key="sendvotes"
              type="primary"
              icon={<FileAddTwoTone />}
              onClick={handleConfirmTicket}
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Gửi phiếu
            </Button>
          ),
          (ticket?.attributes?.Status === "Duyệt" ||
            ticket?.attributes?.Status === "Đã giao") &&
          ticket?.attributes?.Person === account?.Name && (
            <Button
              key="print"
              type="primary"
              icon={<PrinterTwoTone />}
              onClick={() => setPrintVisible(true)}
              style={{ backgroundColor: "#b65959ff", borderColor: "#9b59b6" }}
            >
              In Phiếu
            </Button>
          ),
          ticket?.attributes?.Status === "Duyệt" &&
          ticket?.attributes?.Person === account?.Name && (
            <Button
              key="exportvotes"
              type="primary"
              icon={<WarningTwoTone />}
              onClick={handleImportDeviceServicesTicket}
              style={{
                backgroundColor: "#ee0909ff",
                borderColor: "#ee0909ff",
              }}
            >
              Xuất Phiếu
            </Button>
          ),
          account.Receivelistkho === true &&
          ticket?.attributes?.Status === "Đã giao" && (
            <Button
              key="confirm"
              type="primary"
              icon={<CheckSquareTwoTone />}
              onClick={handleConfirmAdminTicket}
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Xác nhận
            </Button>
          ),
          account.Leader === true && (ticket?.attributes?.Status === "Duyệt" ||
            ticket?.attributes?.Status === "Đã giao") && (
            <Button
              key="deleapproval"
              type="primary"
              icon={<MinusCircleTwoTone />}
              onClick={handleReturnLeaderTicket}
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Hủy duyệt
            </Button>
          ),
          account.Leader === true &&
          ticket?.attributes?.Status === "Xác nhận" && (
            <Button
              key="guarantee"
              type="primary"
              icon={<ReconciliationTwoTone />}
              onClick={handleConfirmWarranty}
              style={{
                backgroundColor: "#e8f00cff",
                borderColor: "#e8f00cff",
              }}
            >
              Bảo hành
            </Button>
          ),
          ticket?.attributes?.Status === "Xác nhận" &&
          account.Invoiceer === true && (
            <Button
              key="complete"
              type="primary"
              icon={<SafetyCertificateTwoTone />}
              onClick={handleHandoverTicket} // Gọi hàm bọc
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            >
              Hoàn thành
            </Button>
          ),
          ticket?.attributes?.Status === "Chờ xuất hóa đơn" &&
          account.Invoiceer === true && (
            <Button
              key="issueinvoice"
              type="primary"
              icon={<CalculatorTwoTone />}
              onClick={() => setIsModalVisible(true)} // Mở modal nhập InvoiceNumber
              style={{ backgroundColor: "#DD0000", borderColor: "#DD0000" }}
            >
              Xuất hóa đơn
            </Button>
          ),
        ]}
        width="100vw"
      // style={{ maxWidth: "1200px" }} // Giới hạn tối đa
      // modalRender={(modal) => (
      //   // <Draggable disabled={disabled}>
      //   //   <div style={{ width: "100%" }}>{modal}</div>
      //   // </Draggable>
      //   <div style={{ width: "100%" }}>{modal}</div>
      // )}
      >
        <Spin spinning={loading} tip="Đang xử lý dữ liệu...">
          <h3>Thiết Bị Mượn Từ POS</h3>
          <Table
            dataSource={combinedExportLoanData}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: "Tên Thiết Bị",
                dataIndex: "ProductName",
                key: "ProductName",
                width: 220,
                render: (_, record) =>
                  record.isNew ? (
                    <Select
                      showSearch
                      value={record.ProductName || undefined}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleProductChange(record.id, value)
                      }
                      options={Array.from(
                        new Set(
                          exportList
                            .filter(
                              (item) => item.attributes.Status === "Đang mượn"
                            )
                            .map((item) => item.attributes.ProductName)
                        )
                      )
                        .sort((a, b) => a.localeCompare(b)) // Sắp xếp A-Z
                        .map((productName) => ({
                          value: productName,
                          label: productName,
                        }))}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  ) : (
                    <span>{record.ProductName || "-"}</span>
                  ),
              },
              {
                title: "Model",
                dataIndex: "Model",
                key: "Model",
                width: 200,
                render: (_, record) =>
                  record.isNew ? (
                    <Select
                      showSearch
                      value={record.Model || undefined}
                      style={{ width: "100%" }}
                      onChange={(value) => handleModelChange(record.id, value)}
                      options={(record.availableModels || [])
                        .slice() // tránh mutate array gốc
                        .sort((a, b) => a.localeCompare(b)) // sắp xếp A-Z
                        .map((model) => ({
                          value: model,
                          label: model,
                        }))}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  ) : (
                    <span>{record.Model || "-"}</span>
                  ),
              },
              {
                title: "Thương Hiệu",
                dataIndex: "BrandName",
                key: "BrandName",
                width: 150,
                render: (_, record) =>
                  record.isNew ? (
                    <Input
                      value={record.BrandName || ""}
                      style={{ width: "100%" }}
                      disabled
                    />
                  ) : (
                    <span>{record.BrandName || "-"}</span>
                  ),
              },
              {
                title: "Kiểu sản phẩm",
                dataIndex: "Type",
                key: "Type",
                width: 150,
                render: (_, record) =>
                  record.isNew ? (
                    <Input
                      value={record.Type || ""}
                      style={{ width: "100%" }}
                      disabled
                    />
                  ) : (
                    <span>{record.Type || "-"}</span>
                  ),
              },
              {
                title: "Đvt",
                dataIndex: "DVT",
                key: "DVT",
                width: 80,
                render: (_, record) =>
                  record.isNew ? (
                    <Input
                      value={record.DVT || ""}
                      style={{ width: "100%", textAlign: "center" }}
                      disabled
                    />
                  ) : (
                    <span style={{ display: "block", textAlign: "center" }}>
                      {record.DVT || "-"}
                    </span>
                  ),
              },
              {
                title: "Kho",
                dataIndex: "TypeKho",
                key: "TypeKho",
                width: 100,
                render: (_, record) => {
                  const availableWarehouses =
                    record.ProductName && record.Model
                      ? getAvailableWarehouses(record.ProductName, record.Model)
                      : [];

                  return record.isNew ? (
                    <Select
                      value={record.TypeKho || undefined}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleWarehouseChange(record.id, value)
                      }
                      options={availableWarehouses}
                      placeholder="Chọn kho"
                    />
                  ) : (
                    <span>{record.TypeKho || "-"}</span>
                  );
                },
              },
              {
                title: "Số lượng",
                dataIndex: "totalexport",
                key: "totalexport",
                width: 100,
                render: (_, record) => {
                  const productName =
                    record.ProductName || record.attributes?.ProductName;
                  const model = record.Model || record.attributes?.Model;
                  const warehouse =
                    record.TypeKho || record.attributes?.TypeKho;

                  // Tìm tất cả item khớp điều kiện
                  const matchedItems = exportList.filter(
                    (item) =>
                      item.attributes.ProductName === productName &&
                      item.attributes.Model === model &&
                      item.attributes.TypeKho === warehouse &&
                      item.attributes.Status === "Đang mượn"
                  );

                  // Số lượng tối đa từ dữ liệu gốc
                  const maxQuantityFromData = matchedItems.reduce(
                    (total, item) => total + (item.attributes.totalexport || 0),
                    0
                  );

                  // Tổng số lượng đã chọn ở các hàng khác trong bảng (trừ record hiện tại)
                  const usedQuantityInTable = combinedExportLoanData
                    .filter(
                      (r) =>
                        r.id !== record.id &&
                        (r.ProductName || r.attributes?.ProductName) ===
                        productName &&
                        (r.Model || r.attributes?.Model) === model &&
                        (r.TypeKho || r.attributes?.TypeKho) === warehouse
                    )
                    .reduce((sum, r) => sum + (Number(r.totalexport) || 0), 0);

                  // Số lượng tối đa còn lại cho record này
                  const remainingMaxQuantity =
                    maxQuantityFromData - usedQuantityInTable;

                  return record.isNew ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <InputNumber
                        min={1}
                        max={remainingMaxQuantity}
                        value={record.totalexport}
                        onChange={(value) => {
                          const currentSNCount = Array.isArray(
                            record.SerialNumber
                          )
                            ? record.SerialNumber.length
                            : (record.SerialNumber || "")
                              .split(",")
                              .filter((sn) => sn).length;

                          if (
                            record.Type !== "Vật tư" &&
                            value < currentSNCount
                          ) {
                            message.error(
                              `Bạn đã chọn ${currentSNCount} serial, không thể giảm xuống ${value}.`
                            );
                            return; // không cập nhật
                          }

                          handleTotalExportChange(record.id, value);
                        }}
                        style={{ width: "70px" }}
                      />
                      {remainingMaxQuantity > 0 && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginLeft: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Tối đa: {remainingMaxQuantity}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>{record.totalexport || 0}</span>
                  );
                },
              },
              {
                title: "SerialNumber",
                dataIndex: "SerialNumber",
                key: "SerialNumber",
                width: 200,
                render: (_, record) => {
                  // Lấy thông tin ProductName, Model và TypeKho từ record (hoặc attributes)
                  const productName =
                    record.ProductName || record.attributes?.ProductName;
                  const model = record.Model || record.attributes?.Model;
                  const warehouse =
                    record.TypeKho || record.attributes?.TypeKho;

                  // Tìm nguồn dữ liệu dựa trên ProductName, Model, TypeKho và Status
                  const sources = exportList.filter(
                    (item) =>
                      item.attributes.ProductName === productName &&
                      item.attributes.Model === model &&
                      item.attributes.TypeKho === warehouse &&
                      item.attributes.Status === "Đang mượn"
                  );

                  // Gom tất cả SerialNumber thành 1 list
                  const allSerialString = sources.reduce((acc, curr) => {
                    const serial = curr.attributes.SerialNumber || "";
                    return acc ? `${acc},${serial}` : serial;
                  }, "");

                  let serialList = allSerialString
                    ? allSerialString
                      .split(",")
                      .map((sn) => sn.trim())
                      .filter((sn) => sn.length > 0)
                    : [];

                  // Lấy tất cả serial đã được chọn ở record khác
                  const selectedSerialsInTable = combinedExportLoanData
                    .filter((r) => r.id !== record.id) // các record khác
                    .flatMap((r) =>
                      Array.isArray(r.SerialNumber)
                        ? r.SerialNumber
                        : (r.SerialNumber || "")
                          .split(",")
                          .map((sn) => sn.trim())
                          .filter((sn) => sn)
                    );

                  // Lấy serial hiện tại của record
                  const currentSerials = Array.isArray(record.SerialNumber)
                    ? record.SerialNumber
                    : (record.SerialNumber || "")
                      .split(",")
                      .map((sn) => sn.trim())
                      .filter((sn) => sn);

                  // Lọc: bỏ serial đã chọn ở record khác, giữ lại serial của record hiện tại
                  const availableSerials = serialList.filter(
                    (sn) =>
                      !selectedSerialsInTable.includes(sn) ||
                      currentSerials.includes(sn)
                  );

                  let currentValue = record.SerialNumber;
                  if (
                    Array.isArray(currentValue) &&
                    currentValue.length === 0
                  ) {
                    currentValue = undefined;
                  } else if (
                    typeof currentValue === "string" &&
                    !currentValue.trim()
                  ) {
                    currentValue = undefined;
                  }

                  // 👉 Nếu record.isNew thì cho chọn Select, ngược lại hiển thị text
                  if (record.isNew) {
                    return (
                      <Select
                        mode="multiple"
                        placeholder="Chọn Serial Number"
                        style={{
                          width: "100%",
                          border:
                            record.Type !== "Vật tư" &&
                              Array.isArray(currentValue) &&
                              currentValue.length !== Number(record.totalexport)
                              ? "1px solid red"
                              : undefined,
                        }}
                        value={currentValue}
                        onChange={(value) => {
                          const limit = Number(record.totalexport) || 0;

                          if (
                            record.Type !== "Vật tư" &&
                            value.length > limit
                          ) {
                            message.error(
                              `Chỉ được chọn tối đa ${limit} serial.`
                            );
                            return;
                          }

                          handleSerialChange(record.id, value);
                        }}
                        options={availableSerials.map((sn) => ({
                          value: sn,
                          label: sn,
                          disabled:
                            record.Type !== "Vật tư" &&
                            Array.isArray(currentValue) &&
                            currentValue.length >= Number(record.totalexport) &&
                            !currentValue.includes(sn),
                        }))}
                      />
                    );
                  } else {
                    // Hiển thị text khi đã lưu
                    return (
                      <span>
                        {Array.isArray(currentSerials)
                          ? currentSerials.join(", ")
                          : currentSerials || "-"}
                      </span>
                    );
                  }
                },
              },
              {
                title: "Số Phiếu",
                dataIndex: "Votes",
                key: "Votes",
                width: 185,
                render: (_, record) =>
                  record.isNew ? (
                    <Input
                      value={record.Votes || ""}
                      style={{ width: "100%" }}
                      disabled
                    />
                  ) : (
                    <span>{record.Votes || "-"}</span>
                  ),
              },
              {
                title: "Ticket",
                dataIndex: "Ticket",
                key: "Ticket",
                width: 150,
                render: (_, record) =>
                  record.isNew ? (
                    <Input
                      value={record.Ticket || ""}
                      style={{ width: "100%" }}
                      disabled
                    />
                  ) : (
                    <span>{record.Ticket || "-"}</span>
                  ),
              },
              {
                title: "Người mượn",
                dataIndex: "NameExportLoan",
                key: "NameExportLoan",
                width: 200,
                render: (_, record) =>
                  record.isNew ? (
                    <Input
                      value={record.NameExportLoan || ""}
                      style={{ width: "100%" }}
                      disabled
                    />
                  ) : (
                    <span>{record.NameExportLoan || "-"}</span>
                  ),
              },
              {
                title: "Trạng Thái",
                dataIndex: "Status",
                key: "Status",
                width: 160,
                render: (_, record) =>
                  record.isNew ? (
                    <Input
                      value={record.Status || "Đang chờ duyệt"}
                      disabled
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <span>{record.Status || "Đang chờ duyệt"}</span>
                  ),
              },
              {
                title: "Hành động",
                key: "action",
                render: (_, record) => {
                  const isCreator =
                    ticket?.attributes?.Person === account?.Name; // Kiểm tra user có phải người tạo phiếu không
                  const isPending =
                    ticket?.attributes?.Status === "Đang tạo phiếu"; // Kiểm tra trạng thái phiếu
                  const canDelete = isCreator && isPending; // Chỉ cho phép xóa nếu là người tạo + phiếu đang "Đang tạo phiếu"

                  if (record.isNew) {
                    return canDelete ? (
                      <Popconfirm
                        title="Bạn có chắc muốn xóa dữ liệu hàng này?"
                        onConfirm={() =>
                          handleDeleteRow(record.id, "exportloan")
                        }
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
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() =>
                              handleUpdateRow(record.id, "exportloan")
                            }
                          />
                          <Button onClick={() => setEditingRowId(null)}>
                            Hủy
                          </Button>
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
                          {canDelete && !record.id && (
                            <Popconfirm
                              title="Bạn có chắc muốn xóa dữ liệu hàng này?"
                              onConfirm={() =>
                                handleDeleteSavedRow(record.id, "exportloan")
                              }
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button type="danger" icon={<DeleteOutlined />} />
                            </Popconfirm>
                          )}
                          {/* Nút Trả thiết bị (chỉ hiển thị nếu hàng đã lưu) */}
                          {ticket?.attributes?.Status === "Đang tạo phiếu" &&
                            record.id && (
                              <Popconfirm
                                title="Bạn có chắc muốn trả toàn bộ thiết bị của hàng này?"
                                onConfirm={() => handleReturnDevice(record)}
                                okText="Có"
                                cancelText="Không"
                              >
                                <Button
                                  type="default"
                                  icon={<LeftCircleTwoTone />}
                                >
                                  Trả thiết bị
                                </Button>
                              </Popconfirm>
                            )}
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
          {ticket?.attributes?.Status === "Đang tạo phiếu" &&
            ticket?.attributes?.Person === account?.Name && (
              <Button
                type="dashed"
                onClick={() => handleAddRow("exportloan")}
                style={{ marginTop: 10, marginLeft: 10 }}
              >
                ➕ Thêm Hàng (Thiết bị mượn)
              </Button>
            )}
          <PrintTicketExportLoan
            isOpen={printVisible}
            onClose={() => setPrintVisible(false)}
            ticket={ticket || { attributes: {} }}
            handoverDevices={exportLoanData || []}
            autoPrint={true} // Kích hoạt in ngay lập tức
          />
          <ExportInvoiceModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onConfirm={handleExportTicket}
            ticketId={ticket.id}
            invoiceNumber={invoiceNumber}
            setInvoiceNumber={setInvoiceNumber}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default TicketExportLoanModal;

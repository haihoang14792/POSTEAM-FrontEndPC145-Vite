
import strapiv1Instance from "../setup/axios strapi role";
import { message } from "antd";

// =================================================================
// 🚚 SUPPLIER SERVICES (Nhà cung cấp & Phiếu nhập)
// =================================================================

export const fetchListSupplier = async () => {
  // Lấy hết danh sách cho dropdown
  return await strapiv1Instance.get("/api/suppliers?populate=*&pagination[pageSize]=1000");
};

export const fetchListPurchaseOder = async () => {
  // Lưu ý: Endpoint của bạn là supplier-froms (có thể do typo ở backend), tôi giữ nguyên
  return await strapiv1Instance.get("/api/supplier-froms?populate=*&pagination[pageSize]=2000&sort[0]=createdAt:desc");
};

export const createSupplierForm = async (payload) => {
  const response = await strapiv1Instance.post("/api/supplier-froms", {
    data: payload,
  });
  return response.data;
};

export const updateSupplierForm = async (id, payload) => {
  const response = await strapiv1Instance.put(`/api/supplier-froms/${id}`, {
    data: payload,
  });
  return response.data;
};

export const createSupplier = async (supplierData) => {
  const response = await strapiv1Instance.post("/api/suppliers", {
    data: supplierData,
  });
  return response.data;
};

export const updateSupplier = async (supplierId, supplierData) => {
  const response = await strapiv1Instance.put(`/api/suppliers/${supplierId}`, {
    data: supplierData,
  });
  return response.data;
};

export const fetchListSupplierDetail = async () => {
  return await strapiv1Instance.get("/api/supplier-details?populate=*&pagination[pageSize]=2000&sort[0]=createdAt:desc");
};

export const updateSupplierDetail = async (id, payload) => {
  const response = await strapiv1Instance.put(`/api/supplier-details/${id}`, {
    data: payload,
  });
  return response.data;
};

export const sendSupplierDetail = async (data) => {
  // Giả sử data gửi lên đã có cấu trúc { data: ... } hoặc endpoint custom xử lý riêng
  const response = await strapiv1Instance.post("/api/supplier-details", data);
  return response.data;
};

// =================================================================
// 🏭 WAREHOUSE SERVICES (Kho & Import/Export)
// =================================================================

export const fetchListWarehouse = async () => {
  return await strapiv1Instance.get("/api/warehouselists?populate=*&pagination[pageSize]=100");
};

export const createWarehouse = async (warehouseData) => {
  const response = await strapiv1Instance.post("/api/warehouselists", {
    data: warehouseData,
  });
  return response.data;
};

export const updateWarehouse = async (warehouseId, warehouseData) => {
  const response = await strapiv1Instance.put(`/api/warehouselists/${warehouseId}`, {
    data: warehouseData,
  });
  return response.data;
};

export const fetchWarehouseDetails = async () => {
  return await strapiv1Instance.get("/api/warehousedetails?populate=*&pagination[pageSize]=2000");
};

export const updateWarehouseDetails = async (id, updatedData) => {
  const response = await strapiv1Instance.put(`/api/warehousedetails/${id}`, {
    data: updatedData,
  });
  return response.data;
};

export const createWarehouseDetails = async (updatedData) => {
  const response = await strapiv1Instance.post("/api/warehousedetails", {
    data: updatedData,
  });
  return response.data;
};

// --- IMPORT LISTS ---
export const fetchImportlists = async () => {
  return await strapiv1Instance.get("/api/importlists?populate=*&pagination[pageSize]=1000");
};

export const createImportlists = async (importData) => {
  const response = await strapiv1Instance.post("/api/importlists", {
    data: importData,
  });
  return response; // Trả về toàn bộ response để component lấy .data hoặc .id
};

export const updateImportlists = async (id, updatedData) => {
  const response = await strapiv1Instance.put(`/api/importlists/${id}`, {
    data: updatedData
  });
  return response.data;
};

export const returnToSupplier = async (id, { quantity, note, totalimport }) => {
  const response = await strapiv1Instance.put(`/api/importlists/${id}`, {
    data: {
      Status: "Trả NCC",
      Note: note || "",
      totalimportNCC: quantity,
      totalimport: totalimport - quantity,
    },
  });
  return response.data;
};

// --- EXPORT LISTS ---
export const fetchExportlists = async () => {
  return await strapiv1Instance.get("/api/exportlists?populate=*&pagination[pageSize]=2000");
};

export const createExportlists = async (exportData) => {
  const response = await strapiv1Instance.post("/api/exportlists", {
    data: exportData,
  });
  return response.data;
};

export const updateExportlistsData = async (id, updatedData) => {
  const response = await strapiv1Instance.put(`/api/exportlists/${id}`, {
    data: updatedData,
  });
  return response.data;
};

// Alias cũ để tương thích code cũ
export const updateExportlists = updateExportlistsData;

export const updateExportlistsSerial = async (exportListId, newSerialString, newSerialLoanString, newTotalExport, newTotalExportLoan) => {
  const response = await strapiv1Instance.put(`/api/exportlists/${exportListId}`, {
    data: {
      SerialNumber: newSerialString,
      SerialNumberLoan: newSerialLoanString,
      totalexport: newTotalExport,
      totalexportLoan: newTotalExportLoan,
    },
  });
  return response.data;
};

// --- EXPORT LOANS ---
export const fetchExportLoans = async () => {
  return await strapiv1Instance.get("/api/exportloans?populate=*&pagination[pageSize]=1000");
};

export const updateExportLoans = async (id, updatedData) => {
  const response = await strapiv1Instance.put(`/api/exportloans/${id}`, {
    data: updatedData
  });
  return response.data;
};

// ... Các hàm ExportLoanTicket, DeviceServices giữ nguyên logic nhưng thêm populate=* vào GET và bọc data vào POST/PUT tương tự trên.

// 🎫 EXPORT LOAN TICKET SERVICES (Phiếu Mượn/Xuất Kho)
// =================================================================

// Lấy danh sách phiếu Export Loan Ticket
export const fetchExportLoanTicket = async () => {
  try {
    // Strapi v5: Thêm populate=* và pagination lớn
    const response = await strapiv1Instance.get("/api/exportloantickets?populate=*&pagination[pageSize]=1000&sort[0]=createdAt:desc");
    return response.data; // Trả về mảng dữ liệu
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return null; // Trả về null để UI xử lý ẩn/hiện
    }
    return null;
  }
};

// Tạo phiếu Export Loan Ticket mới
export const createExportLoanTicket = async (ticketData) => {
  try {
    // Strapi v5: Payload phải bọc trong { data: ... }
    const response = await strapiv1Instance.post("/api/exportloantickets", {
      data: ticketData,
    });
    message.success("🎉 Tạo phiếu thành công!");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo phiếu:", error);
    message.error("Lỗi khi tạo phiếu! Kiểm tra lại dữ liệu.");
    throw error;
  }
};

// Cập nhật trạng thái Ticket (Status)
export const updateExportLoanTicket = async (ticketId, newStatus) => {
  try {
    const payload = { Status: newStatus };
    const response = await strapiv1Instance.put(
      `/api/exportloantickets/${ticketId}`,
      { data: payload }
    );
    console.log(`Ticket ${ticketId} đã cập nhật Status: ${newStatus}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
    throw error;
  }
};

// Cập nhật Ticket kèm số hóa đơn (InvoiceNumber)
export const updateExportLoanTicketInvoice = async (ticketId, newStatus, invoiceNumber = null) => {
  try {
    const payload = { Status: newStatus };
    if (invoiceNumber) {
      payload.InvoiceNumber = invoiceNumber;
    }

    const response = await strapiv1Instance.put(
      `/api/exportloantickets/${ticketId}`,
      { data: payload }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
    throw error;
  }
};

// Cập nhật người xuất hóa đơn (PersonInvoice)
export const updateExportLoanTicketPersonInvoice = async (ticketId, newPersonInvoice) => {
  try {
    const response = await strapiv1Instance.put(
      `/api/exportloantickets/${ticketId}`,
      {
        data: { PersonInvoice: newPersonInvoice },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
    throw error;
  }
};

// Cập nhật Ticket tổng quát (truyền object updates)
export const updateExportLoanTicketv1 = async (ticketId, updates) => {
  try {
    const response = await strapiv1Instance.put(
      `/api/exportloantickets/${ticketId}`,
      { data: updates }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
    throw error;
  }
};

// Lấy Ticket POS theo ID phiếu (Votes)
export const fetchExportLoanTicketPOS = async (ticketId) => {
  // Strapi v5 filter: filters[Field][$eq]=Value
  const response = await strapiv1Instance.get(
    `/api/exportloantickets?filters[Votes][$eq]=${ticketId}&populate=*`
  );
  return response.data;
};

// =================================================================
// 🛍️ EXPORT LOAN POS SERVICES (Chi tiết thiết bị mượn/xuất)
// =================================================================

// Tạo mới Export Loan POS (Chi tiết thiết bị)
export const createExportLoanPOS = async (deviceData) => {
  try {
    // Chuẩn hóa payload cho Strapi v5
    const payload = {
      data: {
        ProductName: deviceData.ProductName,
        Model: deviceData.Model,
        BrandName: deviceData.BrandName,
        DVT: deviceData.DVT,
        TypeKho: deviceData.TypeKho,
        totalexport: Number(deviceData.totalexport),
        SerialNumber: deviceData.SerialNumber,
        Votes: deviceData.Votes, // Liên kết với Ticket ID
        Ticket: deviceData.Ticket,
        NameExportLoan: deviceData.NameExportLoan,
        Status: deviceData.Status,
        Type: deviceData.Type,
      },
    };

    const response = await strapiv1Instance.post("/api/exportloans", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo ExportLoanPOS:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy danh sách thiết bị theo Ticket ID (Votes)
export const fetchExportLoanPOS = async (ticketId) => {
  const response = await strapiv1Instance.get(
    `/api/exportloans?filters[Votes][$eq]=${ticketId}&populate=*&pagination[pageSize]=500`
  );
  return response.data;
};

// Cập nhật trạng thái thiết bị POS
export const updateExportLoanPOS = async (loanId, newStatus) => {
  try {
    const response = await strapiv1Instance.put(
      `/api/exportloans/${loanId}`,
      {
        data: { Status: newStatus }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ExportLoanPOS ${loanId}:`, error);
    throw error;
  }
};

// Xóa thiết bị POS
export const deleteExportLoanPOS = async (id) => {
  try {
    // Delete trong Strapi v5 vẫn dùng ID (hoặc DocumentId)
    const response = await strapiv1Instance.delete(`/api/exportloans/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa ExportLoanPOS:", error);
    throw error;
  }
};

// =================================================================
// 🔧 DEVICE SERVICES (Dịch vụ thiết bị)
// =================================================================

export const createImportDeviceServices = async (data) => {
  try {
    const response = await strapiv1Instance.post("/api/device-services", {
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi createImportDeviceServices:", error);
    return null;
  }
};
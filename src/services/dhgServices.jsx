//import strapiInstance from "../setup/axios strapi";
import strapiv1Instance from "../setup/axios strapi role";
import { message } from "antd";

const fetchListSupplier = async () => {
  try {
    const response = await strapiv1Instance.get("/api/suppliers");
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const fetchListPurchaseOder = async () => {
  try {
    const response = await strapiv1Instance.get("/api/supplier-froms");
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const createSupplierForm = async (payload) => {
  try {
    const response = await strapiv1Instance.post("/api/supplier-froms", {
      data: payload,
    });
    return response.data;
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const updateSupplierForm = async (id, payload) => {
  try {
    const response = await strapiv1Instance.put(`/api/supplier-froms/${id}`, {
      data: payload,
    });
    return response.data;
  } catch (error) {
    //  console.error('Error updating supplier form:', error);
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const createSupplier = async (supplierData) => {
  try {
    // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
    const response = await strapiv1Instance.post("/api/suppliers", {
      data: supplierData,
    });
    return response; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(
      "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi tạo nhà cung cấp"
    );
  }
};

const updateSupplier = async (supplierId, supplierData) => {
  try {
    // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
    const response = await strapiv1Instance.put(
      `/api/suppliers/${supplierId}`,
      { data: supplierData }
    );
    return response; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(
      "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi cập nhật nhà cung cấp"
    );
  }
};

const fetchListWarehouse = async () => {
  try {
    const response = await strapiv1Instance.get("/api/warehouselists");
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const createWarehouse = async (warehouseData) => {
  try {
    // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
    const response = await strapiv1Instance.post("/api/warehouselists", {
      data: warehouseData,
    });
    return response; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(
      "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi tạo nhà cung cấp"
    );
  }
};

const updateWarehouse = async (warehouseId, warehouseData) => {
  try {
    // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
    const response = await strapiv1Instance.put(
      `/api/warehouselists/${warehouseId}`,
      { data: warehouseData }
    );
    return response; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(
      "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi cập nhật nhà cung cấp"
    );
  }
};

const fetchListSupplierDetail = async () => {
  try {
    const response = await strapiv1Instance.get("/api/supplier-details");
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const updateSupplierDetail = async (id, payload) => {
  try {
    const response = await strapiv1Instance.put(`/api/supplier-details/${id}`, {
      data: payload,
    });
    return response.data;
  } catch (error) {
    //  console.error('Error updating supplier form:', error);
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const sendSupplierDetail = async (data) => {
  try {
    const response = await strapiv1Instance.post("/api/supplier-details", data);
    return response; // Trả về dữ liệu cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const fetchWarehouseDetails = async () => {
  try {
    const response = await strapiv1Instance.get("/api/warehousedetails");
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const updateWarehouseDetails = async (id, updatedData) => {
  try {
    await strapiv1Instance.put(`/api/warehousedetails/${id}`, {
      data: updatedData,
    });
    console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`);
  } catch (error) {
    console.error("Lỗi cập nhật dữ liệu kho:", error.message);
  }
};

const createWarehouseDetails = async (updatedData) => {
  try {
    // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
    const response = await strapiv1Instance.post("/api/warehousedetails", {
      data: updatedData,
    });
    return response; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(
      "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi tạo nhà cung cấp"
    );
  }
};

const fetchImportlists = async () => {
  try {
    const response = await strapiv1Instance.get("/api/importlists");
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const updateImportlists = async (id, updatedData) => {
  try {
    await strapiv1Instance.put(`/api/importlists/${id}`, { data: updatedData });
    console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`);
  } catch (error) {
    console.error("Lỗi cập nhật dữ liệu:", error.message);
  }
};

// API trả hàng về Nhà Cung Cấp
// API trả hàng về Nhà Cung Cấp
const returnToSupplier = async (id, { quantity, note, totalimport }) => {
  try {
    await strapiv1Instance.put(`/api/importlists/${id}`, {
      data: {
        Status: "Trả NCC",
        Note: note || "",
        totalimportNCC: quantity,
        totalimport: totalimport - quantity, // trừ số lượng còn lại trong kho
      },
    });
    console.log(`Đã trả NCC thành công cho ID: ${id}`);
  } catch (error) {
    console.error("Lỗi khi trả NCC:", error.message);
  }
};

const createImportlists = async (importData) => {
  try {
    // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
    const response = await strapiv1Instance.post("/api/importlists", {
      data: importData,
    });
    return response; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(
      "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi nhập kho"
    );
  }
};

const fetchExportlists = async () => {
  try {
    const response = await strapiv1Instance.get("/api/exportlists");
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const createExportlists = async (exportData) => {
  try {
    // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
    const response = await strapiv1Instance.post("/api/exportlists", {
      data: exportData,
    });
    return response; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(
      "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi nhập kho"
    );
  }
};

const updateExportlists = async (id, updatedData) => {
  try {
    await strapiv1Instance.put(`/api/exportlists/${id}`, { data: updatedData });
    console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`);
  } catch (error) {
    console.error("Lỗi cập nhật dữ liệu:", error.message);
  }
};

const fetchExportLoans = async () => {
  try {
    const response = await strapiv1Instance.get("/api/exportloans");
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error("Bạn Không Đủ Quyền Truy Cập");
  }
};

const updateExportLoans = async (id, updatedData) => {
  try {
    await strapiv1Instance.put(`/api/exportloans/${id}`, { data: updatedData });
    console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`);
  } catch (error) {
    console.error("Lỗi cập nhật dữ liệu:", error.message);
  }
};

const fetchExportLoanTicket = async () => {
  try {
    const response = await strapiv1Instance.get("/api/exportloantickets");
    //console.log("📢 API Response:", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        // message.destroy(); // Xóa tất cả thông báo cũ
        // message.warning("🚫 Bạn không có quyền xem danh sách phiếu!");
        return null;
      }
    }
    // message.destroy(); // Xóa thông báo cũ trước khi hiển thị lỗi mới
    // console.error("❌ Lỗi khi gọi API fetchTicket:", error);
    // message.error("Lỗi khi tải danh sách phiếu!");
    return null;
  }
};

const createExportLoanTicket = async (ticketData) => {
  try {
    const response = await strapiv1Instance.post("/api/exportloantickets", {
      data: ticketData,
    });
    message.success("🎉 Tạo phiếu thành công!");
    return response.data;
  } catch (error) {
    // console.error("Lỗi khi tạo phiếu:", error);
    message.error("Lỗi khi tạo phiếu! Kiểm tra lại dữ liệu hoặc API.");
    throw error;
  }
};
const createExportLoanPOS = async (deviceData) => {
  try {
    const payload = {
      data: {
        ProductName: deviceData.ProductName,
        Model: deviceData.Model,
        BrandName: deviceData.BrandName,
        DVT: deviceData.DVT,
        TypeKho: deviceData.TypeKho,
        totalexport: Number(deviceData.totalexport), // Ép kiểu nếu cần
        SerialNumber: deviceData.SerialNumber,
        Votes: deviceData.Votes,
        Ticket: deviceData.Ticket,
        NameExportLoan: deviceData.NameExportLoan,
        Status: deviceData.Status,
        Type: deviceData.Type,
      },
    };

    console.log("Payload gửi đi Nam:", payload);
    const response = await strapiv1Instance.post("/api/exportloans", payload);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating ExportLoanPOS:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchExportLoanTicketPOS = async (ticketId) => {
  const response = await strapiv1Instance.get(
    `/api/exportloantickets?filters[Votes][$eq]=${ticketId}`
  );
  return response.data;
};

const fetchExportLoanPOS = async (ticketId) => {
  const response = await strapiv1Instance.get(
    `/api/exportloans?filters[Votes][$eq]=${ticketId}`
  );
  return response.data;
};

const deleteExportLoanPOS = async (id) => {
  try {
    const response = await strapiv1Instance.delete(`/api/exportloans/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting export loan:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const updateExportLoanTicket = async (ticketId, newStatus) => {
  try {
    const payload = {
      Status: newStatus,
    };
    const response = await strapiv1Instance.put(
      `/api/exportloantickets/${ticketId}`,
      { data: payload }
    );
    console.log(`Ticket ${ticketId} đã được cập nhật với Status: ${newStatus}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
    throw error;
  }
};

const updateExportLoanTicketInvoice = async (
  ticketId,
  newStatus,
  invoiceNumber = null
) => {
  try {
    const payload = {
      Status: newStatus,
    };

    // Nếu có InvoiceNumber thì thêm vào payload
    if (invoiceNumber) {
      payload.InvoiceNumber = invoiceNumber;
    }

    const response = await strapiv1Instance.put(
      `/api/exportloantickets/${ticketId}`,
      { data: payload }
    );
    console.log(
      `Ticket ${ticketId} đã được cập nhật với Status: ${newStatus}, InvoiceNumber: ${invoiceNumber}`
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
    throw error;
  }
};

const updateExportLoanTicketPersonInvoice = async (
  ticketId,
  newPersonInvoice
) => {
  try {
    console.log(
      `📌 Bắt đầu cập nhật Ticket ${ticketId} với người nhận hóa đơn: ${newPersonInvoice}`
    );

    const response = await strapiv1Instance.put(
      `/api/exportloantickets/${ticketId}`,
      {
        data: { PersonInvoice: newPersonInvoice },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `⛔ Lỗi cập nhật ticket ${ticketId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

const updateExportLoanTicketv1 = async (ticketId, updates) => {
  try {
    console.log(`📌 Đang cập nhật Ticket ${ticketId} với payload:`, updates);

    const response = await strapiv1Instance.put(
      `/api/exportloantickets/${ticketId}`,
      { data: updates }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `⛔ Lỗi cập nhật ticket ${ticketId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

const updateExportLoanPOS = async (ticketId, newStatus) => {
  try {
    const payload = {
      Status: newStatus,
    };
    const response = await strapiv1Instance.put(
      `/api/exportloans/${ticketId}`,
      { data: payload }
    );
    console.log(`Ticket ${ticketId} đã được cập nhật với Status: ${newStatus}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
    throw error;
  }
};

const updateExportlistsSerial = async (
  exportListId,
  newSerialString,
  newSerialLoanString,
  newTotalExport,
  newTotalExportLoan
) => {
  try {
    const response = await strapiv1Instance.put(
      `/api/exportlists/${exportListId}`,
      {
        data: {
          SerialNumber: newSerialString,
          SerialNumberLoan: newSerialLoanString,
          totalexport: newTotalExport,
          totalexportLoan: newTotalExportLoan,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật exportlists id=${exportListId}:`, error);
    throw error;
  }
};

const updateExportlistsData = async (id, updatedData) => {
  try {
    const response = await strapiv1Instance.put(`/api/exportlists/${id}`, {
      data: updatedData,
    });
    console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`, response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi cập nhật dữ liệu:", error.message);
    throw error; // Ném lỗi để handle bên ngoài
  }
};

const createImportDeviceServices = async (data) => {
  try {
    console.log("Dữ liệu gửi lên API device-services:", data); // Debug dữ liệu gửi

    const response = await strapiv1Instance.post("/api/device-services", {
      data: data,
    });

    console.log("Phản hồi từ API device-services:", response.data);
    return response.data;
  } catch (error) {
    console.error("createImportDeviceServices lỗi:", error);
    return null;
  }
};

export {
  fetchListSupplier,
  fetchListPurchaseOder,
  createSupplierForm,
  updateSupplierForm,
  createSupplier,
  updateSupplier,
  fetchListWarehouse,
  createWarehouse,
  updateWarehouse,
  fetchListSupplierDetail,
  updateSupplierDetail,
  sendSupplierDetail,
  fetchWarehouseDetails,
  fetchImportlists,
  fetchExportlists,
  fetchExportLoans,
  updateWarehouseDetails,
  updateImportlists,
  updateExportlists,
  updateExportLoans,
  createImportlists,
  createExportlists,
  fetchExportLoanTicket,
  createExportLoanTicket,
  createExportLoanPOS,
  fetchExportLoanPOS,
  deleteExportLoanPOS,
  updateExportLoanTicket,
  updateExportLoanPOS,
  updateExportlistsSerial,
  updateExportlistsData,
  createWarehouseDetails,
  updateExportLoanTicketPersonInvoice,
  createImportDeviceServices,
  updateExportLoanTicketInvoice,
  fetchExportLoanTicketPOS,
  updateExportLoanTicketv1,
  returnToSupplier,
};

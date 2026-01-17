// //import strapiInstance from "../setup/axios strapi";
// import strapiv1Instance from "../setup/axios strapi role";
// import { message } from "antd";

// const fetchListSupplier = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/suppliers");
//     return response; // Trả dữ liệu về cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const fetchListPurchaseOder = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/supplier-froms");
//     return response; // Trả dữ liệu về cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const createSupplierForm = async (payload) => {
//   try {
//     const response = await strapiv1Instance.post("/api/supplier-froms", {
//       data: payload,
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const updateSupplierForm = async (id, payload) => {
//   try {
//     const response = await strapiv1Instance.put(`/api/supplier-froms/${id}`, {
//       data: payload,
//     });
//     return response.data;
//   } catch (error) {
//     //  console.error('Error updating supplier form:', error);
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const createSupplier = async (supplierData) => {
//   try {
//     // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
//     const response = await strapiv1Instance.post("/api/suppliers", {
//       data: supplierData,
//     });
//     return response; // Trả về dữ liệu nếu thành công
//   } catch (error) {
//     throw new Error(
//       "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi tạo nhà cung cấp"
//     );
//   }
// };

// const updateSupplier = async (supplierId, supplierData) => {
//   try {
//     // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
//     const response = await strapiv1Instance.put(
//       `/api/suppliers/${supplierId}`,
//       { data: supplierData }
//     );
//     return response; // Trả về dữ liệu nếu thành công
//   } catch (error) {
//     throw new Error(
//       "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi cập nhật nhà cung cấp"
//     );
//   }
// };

// const fetchListWarehouse = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/warehouselists");
//     return response; // Trả dữ liệu về cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const createWarehouse = async (warehouseData) => {
//   try {
//     // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
//     const response = await strapiv1Instance.post("/api/warehouselists", {
//       data: warehouseData,
//     });
//     return response; // Trả về dữ liệu nếu thành công
//   } catch (error) {
//     throw new Error(
//       "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi tạo nhà cung cấp"
//     );
//   }
// };

// const updateWarehouse = async (warehouseId, warehouseData) => {
//   try {
//     // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
//     const response = await strapiv1Instance.put(
//       `/api/warehouselists/${warehouseId}`,
//       { data: warehouseData }
//     );
//     return response; // Trả về dữ liệu nếu thành công
//   } catch (error) {
//     throw new Error(
//       "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi cập nhật nhà cung cấp"
//     );
//   }
// };

// const fetchListSupplierDetail = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/supplier-details");
//     return response; // Trả dữ liệu về cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const updateSupplierDetail = async (id, payload) => {
//   try {
//     const response = await strapiv1Instance.put(`/api/supplier-details/${id}`, {
//       data: payload,
//     });
//     return response.data;
//   } catch (error) {
//     //  console.error('Error updating supplier form:', error);
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const sendSupplierDetail = async (data) => {
//   try {
//     const response = await strapiv1Instance.post("/api/supplier-details", data);
//     return response; // Trả về dữ liệu cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const fetchWarehouseDetails = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/warehousedetails");
//     return response; // Trả dữ liệu về cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const updateWarehouseDetails = async (id, updatedData) => {
//   try {
//     await strapiv1Instance.put(`/api/warehousedetails/${id}`, {
//       data: updatedData,
//     });
//     console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`);
//   } catch (error) {
//     console.error("Lỗi cập nhật dữ liệu kho:", error.message);
//   }
// };

// const createWarehouseDetails = async (updatedData) => {
//   try {
//     // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
//     const response = await strapiv1Instance.post("/api/warehousedetails", {
//       data: updatedData,
//     });
//     return response; // Trả về dữ liệu nếu thành công
//   } catch (error) {
//     throw new Error(
//       "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi tạo nhà cung cấp"
//     );
//   }
// };

// const fetchImportlists = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/importlists");
//     return response; // Trả dữ liệu về cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const updateImportlists = async (id, updatedData) => {
//   try {
//     await strapiv1Instance.put(`/api/importlists/${id}`, { data: updatedData });
//     console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`);
//   } catch (error) {
//     console.error("Lỗi cập nhật dữ liệu:", error.message);
//   }
// };

// // API trả hàng về Nhà Cung Cấp
// // API trả hàng về Nhà Cung Cấp
// const returnToSupplier = async (id, { quantity, note, totalimport }) => {
//   try {
//     await strapiv1Instance.put(`/api/importlists/${id}`, {
//       data: {
//         Status: "Trả NCC",
//         Note: note || "",
//         totalimportNCC: quantity,
//         totalimport: totalimport - quantity, // trừ số lượng còn lại trong kho
//       },
//     });
//     console.log(`Đã trả NCC thành công cho ID: ${id}`);
//   } catch (error) {
//     console.error("Lỗi khi trả NCC:", error.message);
//   }
// };

// const createImportlists = async (importData) => {
//   try {
//     // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
//     const response = await strapiv1Instance.post("/api/importlists", {
//       data: importData,
//     });
//     return response; // Trả về dữ liệu nếu thành công
//   } catch (error) {
//     throw new Error(
//       "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi nhập kho"
//     );
//   }
// };

// const fetchExportlists = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/exportlists");
//     return response; // Trả dữ liệu về cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const createExportlists = async (exportData) => {
//   try {
//     // Gói dữ liệu trong key "data" theo định dạng mà Strapi yêu cầu
//     const response = await strapiv1Instance.post("/api/exportlists", {
//       data: exportData,
//     });
//     return response; // Trả về dữ liệu nếu thành công
//   } catch (error) {
//     throw new Error(
//       "Bạn không đủ quyền truy cập hoặc có lỗi xảy ra khi nhập kho"
//     );
//   }
// };

// const updateExportlists = async (id, updatedData) => {
//   try {
//     await strapiv1Instance.put(`/api/exportlists/${id}`, { data: updatedData });
//     console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`);
//   } catch (error) {
//     console.error("Lỗi cập nhật dữ liệu:", error.message);
//   }
// };

// const fetchExportLoans = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/exportloans");
//     return response; // Trả dữ liệu về cho các hàm gọi
//   } catch (error) {
//     throw new Error("Bạn Không Đủ Quyền Truy Cập");
//   }
// };

// const updateExportLoans = async (id, updatedData) => {
//   try {
//     await strapiv1Instance.put(`/api/exportloans/${id}`, { data: updatedData });
//     console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`);
//   } catch (error) {
//     console.error("Lỗi cập nhật dữ liệu:", error.message);
//   }
// };

// const fetchExportLoanTicket = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/exportloantickets");
//     //console.log("📢 API Response:", response);
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       if (error.response.status === 403) {
//         // message.destroy(); // Xóa tất cả thông báo cũ
//         // message.warning("🚫 Bạn không có quyền xem danh sách phiếu!");
//         return null;
//       }
//     }
//     // message.destroy(); // Xóa thông báo cũ trước khi hiển thị lỗi mới
//     // console.error("❌ Lỗi khi gọi API fetchTicket:", error);
//     // message.error("Lỗi khi tải danh sách phiếu!");
//     return null;
//   }
// };

// const createExportLoanTicket = async (ticketData) => {
//   try {
//     const response = await strapiv1Instance.post("/api/exportloantickets", {
//       data: ticketData,
//     });
//     message.success("🎉 Tạo phiếu thành công!");
//     return response.data;
//   } catch (error) {
//     // console.error("Lỗi khi tạo phiếu:", error);
//     message.error("Lỗi khi tạo phiếu! Kiểm tra lại dữ liệu hoặc API.");
//     throw error;
//   }
// };
// const createExportLoanPOS = async (deviceData) => {
//   try {
//     const payload = {
//       data: {
//         ProductName: deviceData.ProductName,
//         Model: deviceData.Model,
//         BrandName: deviceData.BrandName,
//         DVT: deviceData.DVT,
//         TypeKho: deviceData.TypeKho,
//         totalexport: Number(deviceData.totalexport), // Ép kiểu nếu cần
//         SerialNumber: deviceData.SerialNumber,
//         Votes: deviceData.Votes,
//         Ticket: deviceData.Ticket,
//         NameExportLoan: deviceData.NameExportLoan,
//         Status: deviceData.Status,
//         Type: deviceData.Type,
//       },
//     };

//     console.log("Payload gửi đi Nam:", payload);
//     const response = await strapiv1Instance.post("/api/exportloans", payload);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error creating ExportLoanPOS:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const fetchExportLoanTicketPOS = async (ticketId) => {
//   const response = await strapiv1Instance.get(
//     `/api/exportloantickets?filters[Votes][$eq]=${ticketId}`
//   );
//   return response.data;
// };

// const fetchExportLoanPOS = async (ticketId) => {
//   const response = await strapiv1Instance.get(
//     `/api/exportloans?filters[Votes][$eq]=${ticketId}`
//   );
//   return response.data;
// };

// const deleteExportLoanPOS = async (id) => {
//   try {
//     const response = await strapiv1Instance.delete(`/api/exportloans/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error deleting export loan:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const updateExportLoanTicket = async (ticketId, newStatus) => {
//   try {
//     const payload = {
//       Status: newStatus,
//     };
//     const response = await strapiv1Instance.put(
//       `/api/exportloantickets/${ticketId}`,
//       { data: payload }
//     );
//     console.log(`Ticket ${ticketId} đã được cập nhật với Status: ${newStatus}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
//     throw error;
//   }
// };

// const updateExportLoanTicketInvoice = async (
//   ticketId,
//   newStatus,
//   invoiceNumber = null
// ) => {
//   try {
//     const payload = {
//       Status: newStatus,
//     };

//     // Nếu có InvoiceNumber thì thêm vào payload
//     if (invoiceNumber) {
//       payload.InvoiceNumber = invoiceNumber;
//     }

//     const response = await strapiv1Instance.put(
//       `/api/exportloantickets/${ticketId}`,
//       { data: payload }
//     );
//     console.log(
//       `Ticket ${ticketId} đã được cập nhật với Status: ${newStatus}, InvoiceNumber: ${invoiceNumber}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
//     throw error;
//   }
// };

// const updateExportLoanTicketPersonInvoice = async (
//   ticketId,
//   newPersonInvoice
// ) => {
//   try {
//     console.log(
//       `📌 Bắt đầu cập nhật Ticket ${ticketId} với người nhận hóa đơn: ${newPersonInvoice}`
//     );

//     const response = await strapiv1Instance.put(
//       `/api/exportloantickets/${ticketId}`,
//       {
//         data: { PersonInvoice: newPersonInvoice },
//       }
//     );

//     console.log("✅ API Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       `⛔ Lỗi cập nhật ticket ${ticketId}:`,
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const updateExportLoanTicketv1 = async (ticketId, updates) => {
//   try {
//     console.log(`📌 Đang cập nhật Ticket ${ticketId} với payload:`, updates);

//     const response = await strapiv1Instance.put(
//       `/api/exportloantickets/${ticketId}`,
//       { data: updates }
//     );

//     console.log("✅ API Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       `⛔ Lỗi cập nhật ticket ${ticketId}:`,
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const updateExportLoanPOS = async (ticketId, newStatus) => {
//   try {
//     const payload = {
//       Status: newStatus,
//     };
//     const response = await strapiv1Instance.put(
//       `/api/exportloans/${ticketId}`,
//       { data: payload }
//     );
//     console.log(`Ticket ${ticketId} đã được cập nhật với Status: ${newStatus}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
//     throw error;
//   }
// };

// const updateExportlistsSerial = async (
//   exportListId,
//   newSerialString,
//   newSerialLoanString,
//   newTotalExport,
//   newTotalExportLoan
// ) => {
//   try {
//     const response = await strapiv1Instance.put(
//       `/api/exportlists/${exportListId}`,
//       {
//         data: {
//           SerialNumber: newSerialString,
//           SerialNumberLoan: newSerialLoanString,
//           totalexport: newTotalExport,
//           totalexportLoan: newTotalExportLoan,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi cập nhật exportlists id=${exportListId}:`, error);
//     throw error;
//   }
// };

// const updateExportlistsData = async (id, updatedData) => {
//   try {
//     const response = await strapiv1Instance.put(`/api/exportlists/${id}`, {
//       data: updatedData,
//     });
//     console.log(`Cập nhật dữ liệu kho thành công cho ID: ${id}`, response.data);
//     return response.data; // Trả về dữ liệu từ API
//   } catch (error) {
//     console.error("Lỗi cập nhật dữ liệu:", error.message);
//     throw error; // Ném lỗi để handle bên ngoài
//   }
// };

// const createImportDeviceServices = async (data) => {
//   try {
//     console.log("Dữ liệu gửi lên API device-services:", data); // Debug dữ liệu gửi

//     const response = await strapiv1Instance.post("/api/device-services", {
//       data: data,
//     });

//     console.log("Phản hồi từ API device-services:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("createImportDeviceServices lỗi:", error);
//     return null;
//   }
// };

// export {
//   fetchListSupplier,
//   fetchListPurchaseOder,
//   createSupplierForm,
//   updateSupplierForm,
//   createSupplier,
//   updateSupplier,
//   fetchListWarehouse,
//   createWarehouse,
//   updateWarehouse,
//   fetchListSupplierDetail,
//   updateSupplierDetail,
//   sendSupplierDetail,
//   fetchWarehouseDetails,
//   fetchImportlists,
//   fetchExportlists,
//   fetchExportLoans,
//   updateWarehouseDetails,
//   updateImportlists,
//   updateExportlists,
//   updateExportLoans,
//   createImportlists,
//   createExportlists,
//   fetchExportLoanTicket,
//   createExportLoanTicket,
//   createExportLoanPOS,
//   fetchExportLoanPOS,
//   deleteExportLoanPOS,
//   updateExportLoanTicket,
//   updateExportLoanPOS,
//   updateExportlistsSerial,
//   updateExportlistsData,
//   createWarehouseDetails,
//   updateExportLoanTicketPersonInvoice,
//   createImportDeviceServices,
//   updateExportLoanTicketInvoice,
//   fetchExportLoanTicketPOS,
//   updateExportLoanTicketv1,
//   returnToSupplier,
// };


import strapiv1Instance from "../setup/axios strapi role";

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
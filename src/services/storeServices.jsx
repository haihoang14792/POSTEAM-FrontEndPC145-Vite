import strapiv1Instance from "../setup/axios strapi role";
import { message } from "antd";

// =================================================================
// 🏪 JOB / STORE SERVICES
// =================================================================

const createNewJob = async (jobData) => {
  try {
    const response = await strapiv1Instance.post(
      "/api/stores",
      {
        data: jobData, // Strapi v5 yêu cầu bọc trong 'data'
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


// =================================================================
// 📱 DEVICE SERVICES (Quản lý thiết bị chung)
// =================================================================

const deleteDevices = async (deviceIds) => {
  try {
    const deletePromises = deviceIds.map((id) =>
      strapiv1Instance.delete(`/api/device-customers/${id}`)
    );
    const responses = await Promise.all(deletePromises);
    return responses.map((response) => response.data);
  } catch (error) {
    console.error("Error deleting devices:", error);
    throw error;
  }
};

const fetchDeviceAll = async () => {
  // Strapi v5: populate=* và pageSize lớn
  const response = await strapiv1Instance.get(
    "/api/device-services?populate=*&pagination[pageSize]=9000"
  );
  return response.data;
};


const fetchDevicesByPage = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");
    params.append("pagination[page]", page);
    params.append("pagination[pageSize]", pageSize);
    params.append("sort[0]", "updatedAt:desc");

    // Lặp qua object filters để tạo query string cho từng trường
    // Ví dụ: filters = { SerialNumber: '123', Customer: 'Family' }
    // Kết quả: filters[SerialNumber][$containsi]=123 & filters[Customer][$containsi]=Family
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        // Dùng $containsi để tìm kiếm gần đúng và không phân biệt hoa thường
        params.append(`filters[${key}][$containsi]`, filters[key].trim());
      }
    });

    const response = await strapiv1Instance.get(
      `/api/device-services?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error("Lỗi fetchDevicesByPage:", error);
    throw error;
  }
};

const fetchDeviceExcludeDHG = async () => {
  const response = await strapiv1Instance.get(
    "/api/device-services?populate=*&pagination[pageSize]=2000&filters[Store][$ne]=DHG"
  );
  return response.data;
};

// const fetchDevicemanager = async () => {
//   try {
//     const response = await strapiv1Instance.get(
//       "/api/device-services?populate=*&pagination[pageSize]=2000"
//     );

//     // Xử lý linh hoạt response từ interceptor
//     const data = Array.isArray(response)
//       ? response
//       : (response?.data || []);

//     if (Array.isArray(data)) {
//       return data;
//     } else {
//       console.error("Lỗi API: data không đúng định dạng:", response);
//       throw new Error("Dữ liệu API không đúng định dạng");
//     }
//   } catch (error) {
//     console.error("fetchDevicemanager lỗi:", error);
//     return [];
//   }
// };

// src/services/storeServices.jsx

const fetchDevicemanager = async (page = 1, pageSize = 4000) => {
  try {
    const params = new URLSearchParams();
    // 1. Lấy hết dữ liệu liên quan
    params.append("populate", "*");

    // 2. Cấu hình phân trang (mặc định lấy 2000 dòng để đủ cho dropdown)
    params.append("pagination[page]", page);
    params.append("pagination[pageSize]", pageSize);

    // 3. Sắp xếp: Mới nhất lên đầu (Quan trọng cho trải nghiệm người dùng)
    params.append("sort[0]", "updatedAt:desc");

    const response = await strapiv1Instance.get(
      `/api/device-services?${params.toString()}`
    );

    // Xử lý linh hoạt dữ liệu trả về từ Strapi v5
    // Đảm bảo luôn trả về một MẢNG (Array) để không bị lỗi .map() bên giao diện
    const rawData = response?.data || response;
    const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    return data;
  } catch (error) {
    console.error("fetchDevicemanager lỗi:", error);
    return []; // Luôn trả về mảng rỗng nếu lỗi để app không bị crash
  }
};

const fetchDevices = async () => {
  try {
    const response = await strapiv1Instance.get(
      `/api/device-services?populate=*&pagination[pageSize]=2000`
    );
    // Trả về mảng dữ liệu
    return Array.isArray(response) ? response : (response?.data || []);
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};

const fetchDeviceList = async (storeID) => {
  const response = await strapiv1Instance.get(
    `/api/device-services?filters[Store][$eq]=${storeID}&populate=*`
  );
  return response.data;
};

// Kohnans Device List
const fetchDeviceListv1 = async (storeID) => {
  const response = await strapiv1Instance.get(
    `/api/device-kohnans?filters[Location][$eq]=${storeID}&populate=*`
  );
  return response.data;
};

const fetchDeviceListHandover = async () => {
  try {
    // 1. filters[Store][$eq]=DHG: Chỉ lấy thiết bị thuộc kho DHG
    // 2. pagination[limit]=9000: Lấy hết danh sách
    // 3. populate=*: Lấy full thông tin
    const response = await strapiv1Instance.get(
      `/api/device-services?filters[Store][$eq]=DHG&pagination[limit]=9000&populate=*`
    );

    // Xử lý dữ liệu trả về an toàn
    const rawData = response?.data || response;
    const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    return data;
  } catch (error) {
    console.error("fetchDeviceListHandover lỗi:", error);
    return [];
  }
};

const fetchDeviceListRetrieve = async (storeID) => {
  try {
    if (!storeID) return []; // Nếu không có tên cửa hàng thì không gọi API

    // Encode tên cửa hàng để tránh lỗi nếu có ký tự đặc biệt hoặc dấu cách
    const encodedStore = encodeURIComponent(storeID);

    // 1. filters[Store][$eq]: Lọc chính xác cửa hàng (Backend xử lý)
    // 2. pagination[limit]=9000: Lấy hết danh sách (tránh bị cắt ở 25 dòng)
    // 3. populate=*: Lấy full thông tin
    const response = await strapiv1Instance.get(
      `/api/device-services?filters[Store][$eq]=${encodedStore}&pagination[limit]=9000&populate=*`
    );

    // Xử lý dữ liệu trả về để đảm bảo luôn nhận được một Mảng (Array)
    const rawData = response?.data || response;
    const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);

    return data;
  } catch (error) {
    console.error(`Lỗi khi tải thiết bị của cửa hàng ${storeID}:`, error);
    return []; // Trả về mảng rỗng để không làm crash giao diện
  }
};


// =================================================================
// 🛠 IMPORT / UPDATE DEVICE LOGIC (Xử lý Excel)
// =================================================================

const createDeviceAll = async (deviceData) => {
  try {
    // Chuẩn hóa key
    const normalizeKey = (key) => key.trim().replace(/\s+/g, "").toLowerCase();
    const normalizedData = {};
    Object.keys(deviceData).forEach((key) => {
      normalizedData[normalizeKey(key)] = deviceData[key];
    });

    const excelSerialToDate = (serial) => {
      if (typeof serial === "number") {
        return new Date((serial - 25569) * 86400 * 1000)
          .toISOString()
          .split("T")[0];
      }
      return serial;
    };

    const formatDate = (inputDate) => {
      if (typeof inputDate === "string" && inputDate.includes("/")) {
        const parts = inputDate.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
        }
      }
      return excelSerialToDate(inputDate);
    };
    const mappedDevice = {
      Customer: normalizedData["customer"] || "Không xác định",
      DeliveryDate: formatDate(normalizedData["deliverydate"]) || null,
      DeviceName: normalizedData["devicename"] || "Không xác định",
      BrandName: normalizedData["brandname"] || "Không xác định",
      Model: normalizedData["model"] || "-",
      SerialNumber: normalizedData["serialnumber"]
        ? String(normalizedData["serialnumber"]).trim()
        : "",
      Store: normalizedData["store"]
        ? String(normalizedData["store"]).trim()
        : "Không xác định",
      Location: normalizedData["location"] || "Không xác định",
      Status: normalizedData["status"] || "Không xác định",
      Note: normalizedData["note"] || "",

      // 👇 BẮT BUỘC PHẢI THÊM DÒNG NÀY (Để Web hiển thị được)
      publishedAt: new Date().toISOString(),
    };

    const response = await strapiv1Instance.post("/api/device-services", {
      data: mappedDevice,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi API:", error.response?.data || error.message);
    throw error;
  }
};

const updateDeviceBySTT = async (stt, deviceData, devices) => {
  try {
    const normalizeKey = (key) => key.trim().replace(/\s+/g, "").toLowerCase();
    const normalizedData = {};
    Object.keys(deviceData).forEach((key) => {
      normalizedData[normalizeKey(key)] = deviceData[key];
    });

    const formatDate = (inputDate) => {
      if (!inputDate) return null;
      if (inputDate instanceof Date) return inputDate.toISOString().split("T")[0];
      if (typeof inputDate === "number") {
        const excelStartDate = new Date(1899, 11, 30);
        return new Date(excelStartDate.getTime() + inputDate * 86400000)
          .toISOString()
          .split("T")[0];
      }
      if (typeof inputDate === "string") {
        const trimmed = inputDate.trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
        if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) return trimmed.replace(/\//g, "-");
        const parts = trimmed.split("/");
        if (parts.length === 3 && parts[2].length === 4) {
          return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
        }
      }
      return null;
    };

    const formattedDate = formatDate(normalizedData["deliverydate"]);

    // Tìm thiết bị theo STT trong mảng devices đã fetch trước đó
    const deviceToUpdate = devices.find((d, index) => index + 1 === stt);
    if (!deviceToUpdate) {
      console.warn(`Device with STT ${stt} not found.`);
      return null;
    }

    // Strapi v5: Dùng ID hoặc documentId
    const deviceId = deviceToUpdate.documentId || deviceToUpdate.id;

    // Strapi v5: Dữ liệu phẳng, không cần .attributes (nếu devices truyền vào đã phẳng)
    // Nếu devices chưa phẳng, cần check
    const currentDeliveryDate = deviceToUpdate.DeliveryDate || deviceToUpdate.attributes?.DeliveryDate;

    const mappedDevice = {
      Customer: normalizedData["customer"] ? String(normalizedData["customer"]).trim() : "",
      DeliveryDate: formattedDate || currentDeliveryDate,
      DeviceName: normalizedData["devicename"] ? String(normalizedData["devicename"]).trim() : "",
      BrandName: normalizedData["brandname"] ? String(normalizedData["brandname"]).trim() : "",
      Model: normalizedData["model"] ? String(normalizedData["model"]).trim() : "",
      SerialNumber: normalizedData["serialnumber"] ? String(normalizedData["serialnumber"]).trim() : "",
      Store: normalizedData["store"] ? String(normalizedData["store"]).trim() : "",
      Location: normalizedData["location"] ? String(normalizedData["location"]).trim() : "",
      Status: normalizedData["status"] && normalizedData["status"].trim() ? String(normalizedData["status"]).trim() : "Không xác định",
      Note: normalizedData["note"] ? String(normalizedData["note"]).trim() : "",
    };

    const response = await strapiv1Instance.put(
      `/api/device-services/${deviceId}`,
      { data: mappedDevice }
    );

    return response.data;
  } catch (error) {
    console.error(`Error updating device with STT ${stt}:`, error);
    throw error;
  }
};

// const updateDeviceBySerial = async (serial, deviceData) => {
//   try {
//     const trimmedSerial = serial.trim();
//     // console.log("Serial sau khi trim:", trimmedSerial);

//     const formatDate = (inputDate) => {
//       if (!inputDate) return null;
//       if (typeof inputDate === "string") {
//         if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) return inputDate;
//         const parts = inputDate.split("/");
//         if (parts.length === 3) {
//           const [day, month, year] = parts;
//           return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
//         }
//       }
//       if (typeof inputDate === "number") {
//         const excelStartDate = new Date(1899, 11, 30);
//         return new Date(excelStartDate.getTime() + inputDate * 86400000)
//           .toISOString()
//           .split("T")[0];
//       }
//       return null;
//     };

//     // Tìm kiếm thiết bị theo Serial
//     let filterQuery = `/api/device-services?filters[SerialNumber][$eq]=${encodeURIComponent(trimmedSerial)}&populate=*`;
//     let getResponse = await strapiv1Instance.get(filterQuery);

//     // Xử lý response phẳng hoặc lồng data
//     let devices = Array.isArray(getResponse) ? getResponse : (getResponse?.data || []);

//     if (!devices || devices.length === 0) {
//       console.warn(`Không tìm thấy thiết bị với $eq cho Serial: ${trimmedSerial}. Thử với $containsi.`);
//       filterQuery = `/api/device-services?filters[SerialNumber][$containsi]=${encodeURIComponent(trimmedSerial)}&populate=*`;
//       getResponse = await strapiv1Instance.get(filterQuery);
//       devices = Array.isArray(getResponse) ? getResponse : (getResponse?.data || []);

//       if (!devices || devices.length === 0) {
//         console.warn(`Không tìm thấy thiết bị trong device-services với số Serial: ${trimmedSerial}`);
//         return null;
//       }
//     }

//     const deviceToUpdate = devices[0];
//     const deviceId = deviceToUpdate.documentId || deviceToUpdate.id;
//     // console.log(`Đã tìm thấy record với id ${deviceId} cho Serial ${trimmedSerial}`);

//     const newFormattedDate = formatDate(deviceData["DeliveryDate"]);

//     const mappedDevice = {
//       Customer: deviceData["Customer"] || "",
//       DeliveryDate: newFormattedDate,
//       DeviceName: deviceData["DeviceName"] || "",
//       Store: deviceData["Store"] || "Unknown",
//       Location: deviceData["Location"] || "Unknown",
//       Status: deviceData["Status"] || "Unknown",
//       Note: deviceData["Note"] || "",
//     };

//     const updateResponse = await strapiv1Instance.put(
//       `/api/device-services/${deviceId}`,
//       { data: mappedDevice }
//     );

//     // console.log(`✅ Cập nhật thành công: Serial ${trimmedSerial} (id: ${deviceId}).`);
//     return updateResponse.data;
//   } catch (error) {
//     console.error(`❌ Lỗi cập nhật thiết bị với Serial ${serial}:`, error);
//     throw error;
//   }
// };

const updateDeviceBySerial = async (serial, deviceData) => {
  try {
    if (!serial) throw new Error("Serial number bị trống"); // Validate đầu vào

    const trimmedSerial = String(serial).trim(); // Ép kiểu chuỗi cho chắc chắn

    // Hàm format date (Giữ nguyên logic của bạn)
    const formatDate = (inputDate) => {
      if (!inputDate) return null;
      if (typeof inputDate === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) return inputDate;
        const parts = inputDate.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
        }
      }
      if (typeof inputDate === "number") {
        const excelStartDate = new Date(1899, 11, 30);
        return new Date(excelStartDate.getTime() + inputDate * 86400000)
          .toISOString()
          .split("T")[0];
      }
      return null;
    };

    // --- BƯỚC 1: TÌM THIẾT BỊ ---
    // Ưu tiên tìm chính xác ($eq)
    let filterQuery = `/api/device-services?filters[SerialNumber][$eq]=${encodeURIComponent(trimmedSerial)}`;
    let getResponse = await strapiv1Instance.get(filterQuery);

    // Xử lý response đa dạng của Strapi (v4/v5/array/object)
    let devices = [];
    if (Array.isArray(getResponse)) {
      devices = getResponse;
    } else if (Array.isArray(getResponse?.data)) {
      devices = getResponse.data;
    }

    // Nếu không thấy, thử tìm gần đúng ($containsi) -> Fallback an toàn
    if (devices.length === 0) {
      // console.warn(`Thử tìm $containsi cho serial: ${trimmedSerial}`);
      filterQuery = `/api/device-services?filters[SerialNumber][$containsi]=${encodeURIComponent(trimmedSerial)}`;
      getResponse = await strapiv1Instance.get(filterQuery);

      if (Array.isArray(getResponse)) devices = getResponse;
      else if (Array.isArray(getResponse?.data)) devices = getResponse.data;

      if (devices.length === 0) {
        console.error(`❌ Không tìm thấy thiết bị nào có Serial: ${trimmedSerial}`);
        return null; // Trả về null để bên ngoài biết là không update được
      }
    }

    // --- BƯỚC 2: CẬP NHẬT ---
    // Lấy phần tử đầu tiên tìm thấy
    const deviceToUpdate = devices[0];

    // QUAN TRỌNG: Strapi v5 bắt buộc dùng documentId cho PUT
    // Kiểm tra kỹ cấu trúc object trả về để lấy ID đúng
    const targetId = deviceToUpdate.documentId || deviceToUpdate.id;

    if (!targetId) {
      console.error("❌ Dữ liệu thiết bị lỗi, không tìm thấy documentId/id");
      return null;
    }

    const newFormattedDate = formatDate(deviceData["DeliveryDate"]);

    const mappedDevice = {
      Customer: deviceData["Customer"] || "",
      DeliveryDate: newFormattedDate,
      DeviceName: deviceData["DeviceName"] || "",
      Store: deviceData["Store"] || "Unknown",
      Location: deviceData["Location"] || "Unknown",
      Status: deviceData["Status"] || "Unknown",
      Note: deviceData["Note"] || "",
    };

    // Gọi API Update
    const updateResponse = await strapiv1Instance.put(
      `/api/device-services/${targetId}`,
      { data: mappedDevice }
    );

    return updateResponse.data;

  } catch (error) {
    // Log lỗi chi tiết để dễ debug
    console.error(`❌ Lỗi updateDeviceBySerial (${serial}):`, error?.response?.data || error.message);
    throw error; // Ném lỗi ra để vòng lặp bên ngoài bắt được (tăng failCount)
  }
};

const updateDeviceDetailHandover = async (deviceId, deviceData) => {
  try {
    const formatDate = (inputDate) => {
      if (!inputDate) return null;
      if (typeof inputDate === "string") {
        const parts = inputDate.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
      }
      if (typeof inputDate === "number") {
        const excelStartDate = new Date(1899, 11, 30);
        const convertedDate = new Date(
          excelStartDate.getTime() + inputDate * 86400000
        );
        return convertedDate.toISOString().split("T")[0];
      }
      return null;
    };

    const formattedDate = formatDate(deviceData["DeliveryDate"]);

    const mappedDevice = {
      Customer: deviceData["Customer"] || "",
      DeliveryDate: formattedDate,
      // Lưu ý: nếu key của DeviceName trong deviceData là "DeviceName" thay vì "Device Name", hãy điều chỉnh lại cho phù hợp
      DeviceName: deviceData["Device Name"] || deviceData["DeviceName"] || "",
      BrandName: deviceData["BrandName"] || "",
      Model: deviceData["Model"] || "",
      SerialNumber: deviceData["Serial Number"]
        ? String(deviceData["Serial Number"])
        : deviceData["SerialNumber"] || "",
      Store: deviceData["Store"] || "Unknown",
      Location: deviceData["Location"] || "Unknown",
      Status: deviceData["Status"] || "Unknown",
      Note: deviceData["Note"] || "",
    };

    const response = await strapiv1Instance.put(
      `/api/device-services/${deviceId}`,
      { data: mappedDevice }
    );
    console.log(`Thiết bị ${deviceId} đã được cập nhật thành công.`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật thiết bị có id: ${deviceId}`, error);
    throw error;
  }
};

const updateDeviceDetailRetrieve = async (deviceId, deviceData) => {
  try {
    const formatDate = (inputDate) => {
      if (!inputDate) return null;
      if (typeof inputDate === "string") {
        const parts = inputDate.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
      }
      if (typeof inputDate === "number") {
        const excelStartDate = new Date(1899, 11, 30);
        const convertedDate = new Date(
          excelStartDate.getTime() + inputDate * 86400000
        );
        return convertedDate.toISOString().split("T")[0];
      }
      return null;
    };

    const formattedDate = formatDate(deviceData["DeliveryDate"]);

    const mappedDevice = {
      Customer: deviceData["Customer"] || "",
      DeliveryDate: formattedDate,
      // Lưu ý: nếu key của DeviceName trong deviceData là "DeviceName" thay vì "Device Name", hãy điều chỉnh lại cho phù hợp
      DeviceName: deviceData["Device Name"] || deviceData["DeviceName"] || "",
      BrandName: deviceData["BrandName"] || "",
      Model: deviceData["Model"] || "",
      SerialNumber: deviceData["Serial Number"]
        ? String(deviceData["Serial Number"])
        : deviceData["SerialNumber"] || "",
      Store: deviceData["Store"] || "Unknown",
      Location: deviceData["Location"] || "Unknown",
      Status: deviceData["Status"] || "Unknown",
      Note: deviceData["Note"] || "",
    };

    const response = await strapiv1Instance.put(
      `/api/device-services/${deviceId}`,
      { data: mappedDevice }
    );
    console.log(`Thiết bị ${deviceId} đã được cập nhật thành công.`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật thiết bị có id: ${deviceId}`, error);
    throw error;
  }
};

// =================================================================
// 🎫 TICKETS / FORMS (Phiếu yêu cầu)
// =================================================================

const fetchTicket = async () => {
  try {
    // sort mới nhất lên đầu
    const response = await strapiv1Instance.get("/api/devices-forms?populate=*&pagination[pageSize]=1000&sort[0]=createdAt:desc");
    return Array.isArray(response) ? response : (response?.data || []);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return null;
    }
    return null;
  }
};

const createTicket = async (ticketData) => {
  try {
    const response = await strapiv1Instance.post("/api/devices-forms", {
      data: ticketData,
    });
    message.success("🎉 Tạo phiếu thành công!");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateTicketStatus = async (ticketId, newStatus) => {
  try {
    const payload = { Status: newStatus };
    const response = await strapiv1Instance.put(
      `/api/devices-forms/${ticketId}`,
      { data: payload }
    );
    console.log(`Ticket ${ticketId} đã được cập nhật với Status: ${newStatus}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
    throw error;
  }
};

const deleteTicketById = async (id) => {
  try {
    const response = await strapiv1Instance.delete(`/api/devices-forms/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi xóa phiếu với ID ${id}:`, error);
    throw error;
  }
};

// =================================================================
// 📋 HANDOVER & RETRIEVE (Bàn giao & Thu hồi)
// =================================================================

const createDevicesDetailHandover = async (deviceData) => {
  try {
    const response = await strapiv1Instance.post(
      "/api/device-detail-handovers",
      {
        data: {
          Customer: deviceData.Customer,
          DeliveryDate: deviceData.DeliveryDate,
          DeviceName: deviceData.DeviceName,
          BrandName: deviceData.BrandName,
          Model: deviceData.Model,
          SerialNumber: deviceData.SerialNumber,
          Store: deviceData.Store,
          Location: deviceData.Location,
          Status: deviceData.Status,
          Note: deviceData.Note,
          Votes: deviceData.Votes,
          DeviceStatus: deviceData.DeviceStatus,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating handover:", error.response?.data || error.message);
    throw error;
  }
};

const updateDevicesDetailHandover = async (id, deviceData) => {
  try {
    const response = await strapiv1Instance.put(
      `/api/device-detail-handovers/${id}`,
      {
        data: {
          Customer: deviceData.Customer,
          DeliveryDate: deviceData.DeliveryDate,
          DeviceName: deviceData.DeviceName,
          BrandName: deviceData.BrandName,
          Model: deviceData.Model,
          SerialNumber: deviceData.SerialNumber,
          Store: deviceData.Store,
          Location: deviceData.Location,
          Status: deviceData.Status,
          Note: deviceData.Note,
          Votes: deviceData.Votes,
          DeviceStatus: deviceData.DeviceStatus,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating handover:", error);
    throw error;
  }
};

const createDevicesDetailRetrieve = async (deviceData) => {
  try {
    const response = await strapiv1Instance.post(
      "/api/device-detail-retrieves",
      {
        data: {
          Customer: deviceData.Customer,
          DeliveryDate: deviceData.DeliveryDate,
          DeviceName: deviceData.DeviceName,
          BrandName: deviceData.BrandName,
          Model: deviceData.Model,
          SerialNumber: deviceData.SerialNumber,
          Store: deviceData.Store,
          Location: deviceData.Location,
          Status: deviceData.Status,
          Note: deviceData.Note,
          Votes: deviceData.Votes,
          StoreRecall: deviceData.StoreRecall,
          DeviceStatus: deviceData.DeviceStatus,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating retrieve:", error);
    throw error;
  }
};

const updateDevicesDetailRetrieve = async (id, deviceData) => {
  try {
    const response = await strapiv1Instance.put(
      `/api/device-detail-retrieves/${id}`,
      {
        data: {
          Customer: deviceData.Customer,
          DeliveryDate: deviceData.DeliveryDate,
          DeviceName: deviceData.DeviceName,
          BrandName: deviceData.BrandName,
          Model: deviceData.Model,
          SerialNumber: deviceData.SerialNumber,
          Store: deviceData.Store,
          Location: deviceData.Location,
          Status: deviceData.Status,
          Note: deviceData.Note,
          Votes: deviceData.Votes,
          DeviceStatus: deviceData.Votes,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating retrieve:", error);
    throw error;
  }
};

const fetchDeviceDetailHandover = async (ticketId) => {
  const response = await strapiv1Instance.get(
    `/api/device-detail-handovers?filters[Votes][$eq]=${ticketId}&populate=*`
  );
  return response.data;
};

const fetchDeviceDetailRetrieve = async (ticketId) => {
  const response = await strapiv1Instance.get(
    `/api/device-detail-retrieves?filters[Votes][$eq]=${ticketId}&populate=*`
  );
  return response.data;
};

const fetchDeviceDetailHandoverPOS = async (serial) => {
  try {
    const response = await strapiv1Instance.get(
      `/api/device-detail-handovers?filters[SerialNumber][$eq]=${serial}&populate=*`
    );
    return response;
  } catch (error) {
    return null;
  }
};

const fetchDeviceDetailRetrievePOS = async (serial) => {
  try {
    const response = await strapiv1Instance.get(
      `/api/device-detail-retrieves?filters[SerialNumber][$eq]=${serial}&populate=*`
    );
    return response;
  } catch (error) {
    return null;
  }
};

const fetchHandoverByModel = async (model) => {
  try {
    const response = await strapiv1Instance.get(
      `/api/device-detail-handovers?filters[Model][$eq]=${model}&populate=*`
    );
    return response;
  } catch (error) {
    return null;
  }
};

const fetchRetrieveByModel = async (model) => {
  try {
    const response = await strapiv1Instance.get(
      `/api/device-detail-retrieves?filters[Model][$eq]=${model}&populate=*`
    );
    return response;
  } catch (error) {
    return null;
  }
};

const deleteDeviceDetailHandover = async (id) => {
  try {
    const response = await strapiv1Instance.delete(
      `/api/device-detail-handovers/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting handover:", error);
    throw error;
  }
};

const deleteDeviceDetailRetrieve = async (id) => {
  try {
    const response = await strapiv1Instance.delete(
      `/api/device-detail-retrieves/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting retrieve:", error);
    throw error;
  }
};

// =================================================================
// 👤 CUSTOMER LIST SERVICES
// =================================================================

const createCustomerList = async (jobData) => {
  try {
    const response = await strapiv1Instance.post("/api/customerlists", {
      data: {
        Customer: jobData.Customer || "Family Mart",
        StoreID: jobData.StoreID || "001",
        Address: jobData.Address || "No Address Provided",
        Phone: jobData.Phone || null,
        Open: jobData.Open || new Date().toISOString().split("T")[0],
        Close: jobData.Close || null,
        Status: jobData.Status !== undefined ? jobData.Status : true,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// =================================================================
// 📤 EXPORT
// =================================================================


const fetchListCustomerPage = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const params = {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort': 'StoreID:asc',
    };

    if (filters.Customer) {
      params['filters[Customer][$eq]'] = filters.Customer;
    }
    if (filters.Status) {
      params['filters[Status][$eq]'] = filters.Status === 'Mở';
    }
    if (filters.searchText) {
      params['filters[$or][0][StoreID][$containsi]'] = filters.searchText;
      params['filters[$or][1][Address][$containsi]'] = filters.searchText;
    }

    // axiospublic tự return data, nên ở đây response chính là {data: [], meta: {}}
    const response = await strapiv1Instance.get('/api/customerlists', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchAllCustomersForExport = async (filters = {}) => {
  try {
    const params = {
      'pagination[pageSize]': 6000, // Lấy con số tối đa theo cấu hình backend
      'sort': 'StoreID:asc',
    };

    // Vẫn giữ lại bộ lọc nếu người dùng đang search trên giao diện
    if (filters.Customer) params['filters[Customer][$eq]'] = filters.Customer;
    if (filters.Status) params['filters[Status][$eq]'] = filters.Status === 'Mở';
    if (filters.searchText) {
      params['filters[$or][0][StoreID][$containsi]'] = filters.searchText;
      params['filters[$or][1][Address][$containsi]'] = filters.searchText;
    }

    const response = await strapiv1Instance.get('/api/customerlists', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchListCustomer = async () => {
  try {
    const response = await strapiv1Instance.get('/api/customerlists');
    return response; // Trả dữ liệu về cho các hàm gọi
  } catch (error) {
    throw new Error('Error fetching project customers');
  }
};

const createNewStore = async (storeData) => {
  try {
    const response = await strapiv1Instance.post('/api/customerlists', {
      data: {
        Customer: storeData.Customer,
        StoreID: storeData.StoreID,
        Address: storeData.Address,
        AddressOFF: storeData.AddressOFF, // Trường mới
        Status: storeData.Status === 'Mở',
        Open: storeData.Open,
        Area: storeData.Area,             // Trường mới
        CompanyName: storeData.CompanyName // Trường mới
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export {
  createNewJob,
  deleteDevices,
  fetchDeviceAll,
  fetchDeviceList,
  fetchDeviceListv1,
  createCustomerList,
  createDeviceAll,
  fetchDevices,
  updateDeviceBySTT,
  updateDeviceBySerial,
  fetchDevicemanager,
  createTicket,
  fetchDeviceDetailHandover,
  createDevicesDetailHandover,
  updateDevicesDetailHandover,
  fetchDeviceDetailRetrieve,
  updateDevicesDetailRetrieve,
  createDevicesDetailRetrieve,
  updateDeviceDetailHandover, // Có thể dùng lại updateDevicesDetailHandover nếu logic giống nhau
  updateDeviceDetailRetrieve, // Có thể dùng lại updateDevicesDetailRetrieve nếu logic giống nhau
  deleteDeviceDetailHandover,
  deleteDeviceDetailRetrieve,
  updateTicketStatus,
  fetchTicket,
  deleteTicketById,
  fetchDeviceDetailHandoverPOS,
  fetchDeviceDetailRetrievePOS,
  fetchHandoverByModel,
  fetchRetrieveByModel,
  fetchDeviceExcludeDHG,
  fetchDevicesByPage,
  fetchDeviceListHandover,
  fetchDeviceListRetrieve,
  fetchListCustomerPage,
  fetchListCustomer,
  fetchAllCustomersForExport,
  createNewStore
};
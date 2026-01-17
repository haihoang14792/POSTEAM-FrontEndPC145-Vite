// //import strapiInstance from "../setup/axios strapi";
// import strapiv1Instance from "../setup/axios strapi role";
// import { message } from "antd";

// const createNewJob = async (jobData) => {
//   try {
//     const response = await strapiv1Instance.post(
//       "/api/stores?populate=users_permissions_users",
//       {
//         data: jobData, // Đóng gói dữ liệu trong thuộc tính 'data'
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// const deleteJobs = async (jobId) => {
//   try {
//     const response = await strapiv1Instance.delete(`/api/stores/${jobId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting job:", error);
//     throw error;
//   }
// };

// const deleteDevices = async (deviceIds) => {
//   try {
//     // Xóa từng thiết bị một
//     const deletePromises = deviceIds.map((id) =>
//       strapiv1Instance.delete(`/api/device-customers/${id}`)
//     );
//     const responses = await Promise.all(deletePromises);
//     return responses.map((response) => response.data);
//   } catch (error) {
//     console.error("Error deleting devices:", error);
//     throw error;
//   }
// };

// const fetchDeviceAll = async () => {
//   const response = await strapiv1Instance.get(
//     "/api/device-services?pagination[limit]=9000"
//   );
//   return response.data;
// };

// const fetchDeviceExcludeDHG = async () => {
//   const response = await strapiv1Instance.get(
//     "/api/device-services?pagination[limit]=9000&filters[Store][$ne]=DHG"
//   );
//   return response.data;
// };


// // const fetchDeviceAll = async () => {
// //     try {
// //         const response = await strapiv1Instance.get('/api/device-services');
// //         return response; // Trả dữ liệu về cho các hàm gọi
// //     } catch (error) {
// //         throw new Error('Error fetching project customers');
// //     }
// // };

// const fetchDevicemanager = async () => {
//   try {
//     const response = await strapiv1Instance.get(
//       "/api/device-services?pagination[limit]=9000"
//     );

//     // console.log("Raw API Response:", response.data); // Kiểm tra dữ liệu thực tế

//     // Sửa chỗ này: kiểm tra response.data thay vì response.data.data
//     if (Array.isArray(response.data)) {
//       // console.log("Dữ liệu API hợp lệ:", response.data);
//       return response.data;
//     } else {
//       console.error(
//         "Lỗi API: response.data không đúng định dạng:",
//         response.data
//       );
//       throw new Error("Dữ liệu API không đúng định dạng");
//     }
//   } catch (error) {
//     console.error("fetchDevicemanager lỗi:", error);
//     return []; // Trả về mảng rỗng để tránh lỗi
//   }
// };

// const createDeviceAll = async (deviceData) => {
//   try {
//     // Chuẩn hóa key để tránh lỗi khoảng trắng hoặc khác format
//     const normalizeKey = (key) => key.trim().replace(/\s+/g, "").toLowerCase();
//     const normalizedData = {};
//     Object.keys(deviceData).forEach((key) => {
//       normalizedData[normalizeKey(key)] = deviceData[key];
//     });

//     // Hàm chuyển đổi ngày từ Excel serial hoặc dạng chuỗi dd/MM/yyyy
//     const excelSerialToDate = (serial) => {
//       if (typeof serial === "number") {
//         return new Date((serial - 25569) * 86400 * 1000)
//           .toISOString()
//           .split("T")[0];
//       }
//       return serial;
//     };

//     const formatDate = (inputDate) => {
//       if (typeof inputDate === "string" && inputDate.includes("/")) {
//         const parts = inputDate.split("/");
//         if (parts.length === 3) {
//           return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
//             2,
//             "0"
//           )}`;
//         }
//       }
//       return excelSerialToDate(inputDate);
//     };

//     // Định nghĩa key tương ứng với API
//     const mappedDevice = {
//       Customer: normalizedData["customer"] || "Không xác định",
//       DeliveryDate: formatDate(normalizedData["deliverydate"]) || null,
//       DeviceName: normalizedData["devicename"] || "Không xác định",
//       BrandName: normalizedData["brandname"] || "Không xác định",
//       Model: normalizedData["model"] || "-",
//       SerialNumber: normalizedData["serialnumber"]
//         ? String(normalizedData["serialnumber"]).trim()
//         : "",
//       Store: normalizedData["store"]
//         ? String(normalizedData["store"]).trim()
//         : "Không xác định",
//       Location: normalizedData["location"] || "Không xác định",
//       Status: normalizedData["status"] || "Không xác định",
//       Note: normalizedData["note"] || "",
//     };

//     // 🛠 Log kiểm tra dữ liệu đầu vào và sau khi map
//     console.log("Dữ liệu đầu vào từ Excel:", deviceData);
//     console.log("Các key có sẵn:", Object.keys(deviceData));
//     console.log("Dữ liệu sau khi map:", mappedDevice);

//     // Gửi API tạo thiết bị
//     const response = await strapiv1Instance.post("/api/device-services", {
//       data: mappedDevice,
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Lỗi API:", error.response?.data || error.message);
//     throw error;
//   }
// };

// const updateDeviceBySTT = async (stt, deviceData, devices) => {
//   try {
//     // Chuẩn hóa key để tránh lỗi đọc sai từ Excel
//     const normalizeKey = (key) => key.trim().replace(/\s+/g, "").toLowerCase();
//     const normalizedData = {};
//     Object.keys(deviceData).forEach((key) => {
//       normalizedData[normalizeKey(key)] = deviceData[key];
//     });

//     // Xử lý ngày tháng
//     // const formatDate = (inputDate) => {
//     //     if (!inputDate) return null;

//     //     if (typeof inputDate === 'string') {
//     //         const parts = inputDate.split('/');
//     //         if (parts.length === 3) {
//     //             return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
//     //         }
//     //     }

//     //     if (typeof inputDate === 'number') {
//     //         const excelStartDate = new Date(1899, 11, 30);
//     //         const convertedDate = new Date(excelStartDate.getTime() + inputDate * 86400000);
//     //         return convertedDate.toISOString().split('T')[0];
//     //     }

//     //     return null;
//     // };

//     const formatDate = (inputDate) => {
//       if (!inputDate) return null;

//       // Nếu là Date object
//       if (inputDate instanceof Date) {
//         return inputDate.toISOString().split("T")[0];
//       }

//       // Nếu là số (Excel date serial)
//       if (typeof inputDate === "number") {
//         const excelStartDate = new Date(1899, 11, 30);
//         const convertedDate = new Date(
//           excelStartDate.getTime() + inputDate * 86400000
//         );
//         return convertedDate.toISOString().split("T")[0];
//       }

//       // Nếu là string
//       if (typeof inputDate === "string") {
//         const trimmed = inputDate.trim();

//         // yyyy-mm-dd
//         if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
//           return trimmed;
//         }

//         // yyyy/mm/dd
//         if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) {
//           return trimmed.replace(/\//g, "-"); // đổi dấu / thành -
//         }

//         // dd/mm/yyyy
//         const parts = trimmed.split("/");
//         if (parts.length === 3 && parts[2].length === 4) {
//           return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
//             2,
//             "0"
//           )}`;
//         }
//       }

//       return null;
//     };

//     const formattedDate = formatDate(normalizedData["deliverydate"]);

//     // Tìm thiết bị theo STT
//     const deviceToUpdate = devices.find((d, index) => index + 1 === stt);
//     if (!deviceToUpdate) {
//       console.warn(`Device with STT ${stt} not found.`);
//       return null;
//     }

//     const deviceId = deviceToUpdate.id;

//     // Đảm bảo không có dữ liệu nào bị rỗng nếu tồn tại trong Excel
//     const mappedDevice = {
//       Customer: normalizedData["customer"]
//         ? String(normalizedData["customer"]).trim()
//         : "",
//       //  DeliveryDate: formattedDate,
//       DeliveryDate: formattedDate || deviceToUpdate.attributes.DeliveryDate,
//       DeviceName: normalizedData["devicename"]
//         ? String(normalizedData["devicename"]).trim()
//         : "",
//       BrandName: normalizedData["brandname"]
//         ? String(normalizedData["brandname"]).trim()
//         : "",
//       Model: normalizedData["model"]
//         ? String(normalizedData["model"]).trim()
//         : "",
//       SerialNumber: normalizedData["serialnumber"]
//         ? String(normalizedData["serialnumber"]).trim()
//         : "",
//       Store: normalizedData["store"]
//         ? String(normalizedData["store"]).trim()
//         : "",
//       Location: normalizedData["location"]
//         ? String(normalizedData["location"]).trim()
//         : "",
//       Status:
//         normalizedData["status"] && normalizedData["status"].trim()
//           ? String(normalizedData["status"]).trim()
//           : "Không xác định",
//       Note: normalizedData["note"] ? String(normalizedData["note"]).trim() : "",
//     };

//     // 🛠 Log kiểm tra dữ liệu trước khi cập nhật
//     // console.log(`STT: ${stt}, Dữ liệu chuẩn bị update:`, mappedDevice);

//     const response = await strapiv1Instance.put(
//       `/api/device-services/${deviceId}`,
//       { data: mappedDevice }
//     );

//     //  console.log(`Successfully updated device ${deviceId}.`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating device with STT ${stt}:`, error);
//     throw error;
//   }
// };

// const updateDeviceBySerial = async (serial, deviceData) => {
//   try {
//     const trimmedSerial = serial.trim();
//     console.log("Serial sau khi trim:", trimmedSerial);

//     const formatDate = (inputDate) => {
//       if (!inputDate) return null;

//       if (typeof inputDate === "string") {
//         if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
//           return inputDate; // Đã đúng format, không cần chuyển đổi
//         }
//         const parts = inputDate.split("/");
//         if (parts.length === 3) {
//           const [day, month, year] = parts;
//           return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
//         }
//       }

//       if (typeof inputDate === "number") {
//         const excelStartDate = new Date(1899, 11, 30);
//         const convertedDate = new Date(
//           excelStartDate.getTime() + inputDate * 86400000
//         );
//         return convertedDate.toISOString().split("T")[0];
//       }

//       return null;
//     };

//     let filterQuery = `/api/device-services?filters[SerialNumber][$eq]=${encodeURIComponent(
//       trimmedSerial
//     )}`;
//     let getResponse = await strapiv1Instance.get(filterQuery);
//     console.log("Kết quả GET với $eq:", getResponse.data);

//     let devices = getResponse.data;

//     if (getResponse.data && Array.isArray(getResponse.data.data)) {
//       devices = getResponse.data.data;
//     }

//     if (!Array.isArray(devices) || devices.length === 0) {
//       console.warn(
//         `Không tìm thấy thiết bị với $eq cho Serial: ${trimmedSerial}. Thử với $containsi.`
//       );
//       filterQuery = `/api/device-services?filters[SerialNumber][$containsi]=${encodeURIComponent(
//         trimmedSerial
//       )}`;
//       getResponse = await strapiv1Instance.get(filterQuery);
//       console.log("Kết quả GET với $containsi:", getResponse.data);

//       devices = getResponse.data;

//       if (getResponse.data && Array.isArray(getResponse.data.data)) {
//         devices = getResponse.data.data;
//       }

//       if (!Array.isArray(devices) || devices.length === 0) {
//         console.warn(
//           `Không tìm thấy thiết bị trong device-services với số Serial: ${trimmedSerial}`
//         );
//         return null;
//       }
//     }

//     const deviceToUpdate = devices[0];
//     const deviceId = deviceToUpdate.id;
//     console.log(
//       `Đã tìm thấy record với id ${deviceId} cho Serial ${trimmedSerial}`
//     );

//     // Chuyển đổi DeliveryDate mới
//     const newFormattedDate = formatDate(deviceData["DeliveryDate"]);

//     const mappedDevice = {
//       Customer: deviceData["Customer"] || "",
//       DeliveryDate: newFormattedDate, // Luôn cập nhật nếu có giá trị hợp lệ
//       DeviceName: deviceData["DeviceName"] || "",
//       Store: deviceData["Store"] || "Unknown",
//       Location: deviceData["Location"] || "Unknown",
//       Status: deviceData["Status"] || "Unknown", // ✅ Status lấy từ dữ liệu mới
//       Note: deviceData["Note"] || "",
//     };

//     console.log("Dữ liệu gửi đi:", mappedDevice);

//     const updateResponse = await strapiv1Instance.put(
//       `/api/device-services/${deviceId}`,
//       { data: mappedDevice },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     console.log(
//       `✅ Cập nhật thành công: Serial ${trimmedSerial} (id: ${deviceId}).`
//     );
//     return updateResponse.data;
//   } catch (error) {
//     console.error(`❌ Lỗi cập nhật thiết bị với Serial ${serial}:`, error);
//     throw error;
//   }
// };

// const updateTicketStatus = async (ticketId, newStatus) => {
//   try {
//     const payload = {
//       Status: newStatus,
//     };
//     const response = await strapiv1Instance.put(
//       `/api/devices-forms/${ticketId}`,
//       { data: payload }
//     );
//     console.log(`Ticket ${ticketId} đã được cập nhật với Status: ${newStatus}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi cập nhật ticket ${ticketId}:`, error);
//     throw error;
//   }
// };

// //--------------------------------------------------------------------------------------------------

// const fetchDeviceList = async (storeID) => {
//   const response = await strapiv1Instance.get(
//     `/api/device-services?filters[Store][$eq]=${storeID}`
//   );
//   return response.data;
// };

// const fetchDevices = async () => {
//   try {
//     const response = await strapiv1Instance.get(
//       `/api/device-services?pagination[limit]=9000`
//     );
//     return response.data.data; // Trả về danh sách thiết bị
//   } catch (error) {
//     console.error("❌ Lỗi khi lấy dữ liệu:", error);
//     return []; // Trả về mảng rỗng nếu lỗi
//   }
// };

// const createCustomerList = async (jobData) => {
//   try {
//     const response = await strapiv1Instance.post("/api/customerlists", {
//       data: {
//         Customer: jobData.Customer || "Family Mart",
//         StoreID: jobData.StoreID || "001",
//         Address: jobData.Address || "No Address Provided",
//         Phone: jobData.Phone || null, // Giá trị Phone có thể là null
//         Open: jobData.Open || new Date().toISOString().split("T")[0], // Ngày mở cửa định dạng YYYY-MM-DD
//         Close: jobData.Close || null, // Giá trị Close có thể là null
//         Status: jobData.Status !== undefined ? jobData.Status : true, // Trạng thái mặc định là true
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error creating customer:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const fetchDeviceListv1 = async (storeID) => {
//   const response = await strapiv1Instance.get(
//     `/api/device-kohnans?filters[Location][$eq]=${storeID}`
//   );
//   return response.data;
// };

// // const fetchTickets = async () => {
// //     try {
// //         const response = await strapiv1Instance.get('/api/devices-forms');
// //         console.log("Response từ API:", response); // Kiểm tra toàn bộ response
// //         return response.data?.data || []; // Kiểm tra `data` có tồn tại không
// //     } catch (error) {
// //         console.error("Lỗi khi lấy danh sách phiếu:", error);
// //         return [];
// //     }
// // };

// const createTicket = async (ticketData) => {
//   try {
//     const response = await strapiv1Instance.post("/api/devices-forms", {
//       data: ticketData,
//     });
//     message.success("🎉 Tạo phiếu thành công!");
//     return response.data;
//   } catch (error) {
//     // console.error("Lỗi khi tạo phiếu:", error);
//     // message.error("Lỗi khi tạo phiếu! Kiểm tra lại dữ liệu hoặc API.");
//     throw error;
//   }
// };

// const createDevicesDetailHandover = async (deviceData) => {
//   try {
//     const response = await strapiv1Instance.post(
//       "/api/device-detail-handovers",
//       {
//         data: {
//           Customer: deviceData.Customer,
//           DeliveryDate: deviceData.DeliveryDate,
//           DeviceName: deviceData.DeviceName,
//           BrandName: deviceData.BrandName,
//           Model: deviceData.Model,
//           SerialNumber: deviceData.SerialNumber,
//           Store: deviceData.Store,
//           Location: deviceData.Location,
//           Status: deviceData.Status,
//           Note: deviceData.Note,
//           Votes: deviceData.Votes,
//           DeviceStatus: deviceData.DeviceStatus,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error creating customer:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const updateDevicesDetailHandover = async (id, deviceData) => {
//   try {
//     const response = await strapiv1Instance.put(
//       `/api/device-detail-handovers/${id}`,
//       {
//         data: {
//           Customer: deviceData.Customer,
//           DeliveryDate: deviceData.DeliveryDate,
//           DeviceName: deviceData.DeviceName,
//           BrandName: deviceData.BrandName,
//           Model: deviceData.Model,
//           SerialNumber: deviceData.SerialNumber,
//           Store: deviceData.Store,
//           Location: deviceData.Location,
//           Status: deviceData.Status,
//           Note: deviceData.Note,
//           Votes: deviceData.Votes,
//           DeviceStatus: deviceData.DeviceStatus,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error updating handover device:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const createDevicesDetailRetrieve = async (deviceData) => {
//   try {
//     const response = await strapiv1Instance.post(
//       "/api/device-detail-retrieves",
//       {
//         data: {
//           Customer: deviceData.Customer,
//           DeliveryDate: deviceData.DeliveryDate,
//           DeviceName: deviceData.DeviceName,
//           BrandName: deviceData.BrandName,
//           Model: deviceData.Model,
//           SerialNumber: deviceData.SerialNumber,
//           Store: deviceData.Store,
//           Location: deviceData.Location,
//           Status: deviceData.Status,
//           Note: deviceData.Note,
//           Votes: deviceData.Votes,
//           StoreRecall: deviceData.StoreRecall,
//           DeviceStatus: deviceData.DeviceStatus,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error creating customer:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const updateDevicesDetailRetrieve = async (id, deviceData) => {
//   try {
//     const response = await strapiv1Instance.put(
//       `/api/device-detail-retrieves/${id}`,
//       {
//         data: {
//           Customer: deviceData.Customer,
//           DeliveryDate: deviceData.DeliveryDate,
//           DeviceName: deviceData.DeviceName,
//           BrandName: deviceData.BrandName,
//           Model: deviceData.Model,
//           SerialNumber: deviceData.SerialNumber,
//           Store: deviceData.Store,
//           Location: deviceData.Location,
//           Status: deviceData.Status,
//           Note: deviceData.Note,
//           Votes: deviceData.Votes,
//           DeviceStatus: deviceData.Votes,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error updating retrieves device:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const fetchDeviceDetailHandover = async (ticketId) => {
//   const response = await strapiv1Instance.get(
//     `/api/device-detail-handovers?filters[Votes][$eq]=${ticketId}`
//   );
//   return response.data;
// };

// const fetchDeviceDetailRetrieve = async (ticketId) => {
//   const response = await strapiv1Instance.get(
//     `/api/device-detail-retrieves?filters[Votes][$eq]=${ticketId}`
//   );
//   return response.data;
// };

// const fetchDeviceDetailHandoverPOS = async (serial) => {
//   try {
//     const response = await strapiv1Instance.get(
//       `/api/device-detail-handovers?filters[SerialNumber][$eq]=${serial}`
//     );
//     // console.log("📡 API Response raw:", response);
//     return response; // hoặc return response.data nếu muốn
//   } catch (error) {
//     // console.error("Error in fetchDeviceDetailHandoverPOS:", error);
//     return null;
//   }
// };

// const updateDeviceDetailHandover = async (deviceId, deviceData) => {
//   try {
//     const formatDate = (inputDate) => {
//       if (!inputDate) return null;
//       if (typeof inputDate === "string") {
//         const parts = inputDate.split("/");
//         if (parts.length === 3) {
//           const [day, month, year] = parts;
//           return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
//         }
//       }
//       if (typeof inputDate === "number") {
//         const excelStartDate = new Date(1899, 11, 30);
//         const convertedDate = new Date(
//           excelStartDate.getTime() + inputDate * 86400000
//         );
//         return convertedDate.toISOString().split("T")[0];
//       }
//       return null;
//     };

//     const formattedDate = formatDate(deviceData["DeliveryDate"]);

//     const mappedDevice = {
//       Customer: deviceData["Customer"] || "",
//       DeliveryDate: formattedDate,
//       // Lưu ý: nếu key của DeviceName trong deviceData là "DeviceName" thay vì "Device Name", hãy điều chỉnh lại cho phù hợp
//       DeviceName: deviceData["Device Name"] || deviceData["DeviceName"] || "",
//       BrandName: deviceData["BrandName"] || "",
//       Model: deviceData["Model"] || "",
//       SerialNumber: deviceData["Serial Number"]
//         ? String(deviceData["Serial Number"])
//         : deviceData["SerialNumber"] || "",
//       Store: deviceData["Store"] || "Unknown",
//       Location: deviceData["Location"] || "Unknown",
//       Status: deviceData["Status"] || "Unknown",
//       Note: deviceData["Note"] || "",
//     };

//     const response = await strapiv1Instance.put(
//       `/api/device-services/${deviceId}`,
//       { data: mappedDevice }
//     );
//     console.log(`Thiết bị ${deviceId} đã được cập nhật thành công.`);
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi khi cập nhật thiết bị có id: ${deviceId}`, error);
//     throw error;
//   }
// };

// const updateDeviceDetailRetrieve = async (deviceId, deviceData) => {
//   try {
//     const formatDate = (inputDate) => {
//       if (!inputDate) return null;
//       if (typeof inputDate === "string") {
//         const parts = inputDate.split("/");
//         if (parts.length === 3) {
//           const [day, month, year] = parts;
//           return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
//         }
//       }
//       if (typeof inputDate === "number") {
//         const excelStartDate = new Date(1899, 11, 30);
//         const convertedDate = new Date(
//           excelStartDate.getTime() + inputDate * 86400000
//         );
//         return convertedDate.toISOString().split("T")[0];
//       }
//       return null;
//     };

//     const formattedDate = formatDate(deviceData["DeliveryDate"]);

//     const mappedDevice = {
//       Customer: deviceData["Customer"] || "",
//       DeliveryDate: formattedDate,
//       // Lưu ý: nếu key của DeviceName trong deviceData là "DeviceName" thay vì "Device Name", hãy điều chỉnh lại cho phù hợp
//       DeviceName: deviceData["Device Name"] || deviceData["DeviceName"] || "",
//       BrandName: deviceData["BrandName"] || "",
//       Model: deviceData["Model"] || "",
//       SerialNumber: deviceData["Serial Number"]
//         ? String(deviceData["Serial Number"])
//         : deviceData["SerialNumber"] || "",
//       Store: deviceData["Store"] || "Unknown",
//       Location: deviceData["Location"] || "Unknown",
//       Status: deviceData["Status"] || "Unknown",
//       Note: deviceData["Note"] || "",
//     };

//     const response = await strapiv1Instance.put(
//       `/api/device-services/${deviceId}`,
//       { data: mappedDevice }
//     );
//     console.log(`Thiết bị ${deviceId} đã được cập nhật thành công.`);
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi khi cập nhật thiết bị có id: ${deviceId}`, error);
//     throw error;
//   }
// };

// const deleteDeviceDetailHandover = async (id) => {
//   try {
//     const response = await strapiv1Instance.delete(
//       `/api/device-detail-handovers/${id}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error deleting handover device:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const deleteDeviceDetailRetrieve = async (id) => {
//   try {
//     const response = await strapiv1Instance.delete(
//       `/api/device-detail-retrieves/${id}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error deleting retrieve device:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const fetchTicket = async () => {
//   try {
//     const response = await strapiv1Instance.get("/api/devices-forms");
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

// const deleteTicketById = async (id) => {
//   try {
//     const response = await strapiv1Instance.delete(`/api/devices-forms/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Lỗi khi xóa phiếu với ID ${id}:`, error);
//     throw error; // để hàm gọi bên ngoài biết lỗi
//   }
// };

// export {
//   createNewJob,
//   deleteJobs,
//   deleteDevices,
//   fetchDeviceAll,
//   fetchDeviceList,
//   fetchDeviceListv1,
//   createCustomerList,
//   createDeviceAll,
//   fetchDevices,
//   updateDeviceBySTT,
//   updateDeviceBySerial,
//   fetchDevicemanager,
//   // fetchTickets,
//   createTicket,
//   fetchDeviceDetailHandover,
//   createDevicesDetailHandover,
//   updateDevicesDetailHandover,
//   fetchDeviceDetailRetrieve,
//   updateDevicesDetailRetrieve,
//   createDevicesDetailRetrieve,
//   updateDeviceDetailHandover,
//   updateDeviceDetailRetrieve,
//   deleteDeviceDetailHandover,
//   deleteDeviceDetailRetrieve,
//   updateTicketStatus,
//   fetchTicket,
//   deleteTicketById,
//   fetchDeviceDetailHandoverPOS,
//   fetchDeviceExcludeDHG,
// };


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

// const fetchDevicesByPage = async (page = 1, pageSize = 10, filters = {}) => {
//   try {
//     const params = new URLSearchParams();
//     // 1. Lấy dữ liệu đầy đủ các trường
//     params.append("populate", "*");

//     // 2. Tham số phân trang của Strapi
//     params.append("pagination[page]", page);
//     params.append("pagination[pageSize]", pageSize);

//     // 3. Sắp xếp mới nhất lên đầu (Tùy chọn)
//     params.append("sort[0]", "updatedAt:desc");

//     // 4. Xử lý bộ lọc (Search)
//     if (filters.filterField && filters.searchTerm) {
//       // Syntax Strapi: filters[Field][$containsi]=value
//       params.append(`filters[${filters.filterField}][$containsi]`, filters.searchTerm);
//     }

//     // 5. Gọi API
//     // Lưu ý: strapiv1Instance đã có interceptor trả về response.data (body json)
//     const response = await strapiv1Instance.get(`/api/device-services?${params.toString()}`);

//     // Strapi trả về: { data: [...], meta: { pagination: { total: 100, ... } } }
//     return response;
//   } catch (error) {
//     console.error("Lỗi fetchDevicesByPage:", error);
//     throw error;
//   }
// };


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

const fetchDevicemanager = async () => {
  try {
    const response = await strapiv1Instance.get(
      "/api/device-services?populate=*&pagination[pageSize]=2000"
    );

    // Xử lý linh hoạt response từ interceptor
    const data = Array.isArray(response)
      ? response
      : (response?.data || []);

    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Lỗi API: data không đúng định dạng:", response);
      throw new Error("Dữ liệu API không đúng định dạng");
    }
  } catch (error) {
    console.error("fetchDevicemanager lỗi:", error);
    return [];
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
    };

    // console.log("Dữ liệu sau khi map:", mappedDevice);

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

const updateDeviceBySerial = async (serial, deviceData) => {
  try {
    const trimmedSerial = serial.trim();
    // console.log("Serial sau khi trim:", trimmedSerial);

    const formatDate = (inputDate) => {
      if (!inputDate) return null;
      if (typeof inputDate === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) return inputDate;
        const parts = inputDate.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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

    // Tìm kiếm thiết bị theo Serial
    let filterQuery = `/api/device-services?filters[SerialNumber][$eq]=${encodeURIComponent(trimmedSerial)}&populate=*`;
    let getResponse = await strapiv1Instance.get(filterQuery);

    // Xử lý response phẳng hoặc lồng data
    let devices = Array.isArray(getResponse) ? getResponse : (getResponse?.data || []);

    if (!devices || devices.length === 0) {
      console.warn(`Không tìm thấy thiết bị với $eq cho Serial: ${trimmedSerial}. Thử với $containsi.`);
      filterQuery = `/api/device-services?filters[SerialNumber][$containsi]=${encodeURIComponent(trimmedSerial)}&populate=*`;
      getResponse = await strapiv1Instance.get(filterQuery);
      devices = Array.isArray(getResponse) ? getResponse : (getResponse?.data || []);

      if (!devices || devices.length === 0) {
        console.warn(`Không tìm thấy thiết bị trong device-services với số Serial: ${trimmedSerial}`);
        return null;
      }
    }

    const deviceToUpdate = devices[0];
    const deviceId = deviceToUpdate.documentId || deviceToUpdate.id;
    // console.log(`Đã tìm thấy record với id ${deviceId} cho Serial ${trimmedSerial}`);

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

    const updateResponse = await strapiv1Instance.put(
      `/api/device-services/${deviceId}`,
      { data: mappedDevice }
    );

    // console.log(`✅ Cập nhật thành công: Serial ${trimmedSerial} (id: ${deviceId}).`);
    return updateResponse.data;
  } catch (error) {
    console.error(`❌ Lỗi cập nhật thiết bị với Serial ${serial}:`, error);
    throw error;
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
  fetchDeviceExcludeDHG,
  fetchDevicesByPage
};
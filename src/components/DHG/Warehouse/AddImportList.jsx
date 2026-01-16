// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   message,
//   notification,
// } from "antd";
// import {
//   createImportlists,
//   fetchWarehouseDetails,
//   updateWarehouseDetails,
//   updateImportlists,
// } from "../../../services/dhgServices";

// const { Option } = Select;

// // Hàm sinh Ticket
// const generateInvoiceNumber = () => {
//   const year = new Date().getFullYear();
//   const unique = Math.floor(Math.random() * 1000000);
//   return `SPCDHG${year}${unique}`;
// };

// const AddImportList = ({ open, onClose, onConfirmSuccess }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [warehouseList, setWarehouseList] = useState([]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUserName(parsedUser?.account?.Name || "");
//       } catch (error) {
//         console.error("Error parsing user from localStorage:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const loadWarehouse = async () => {
//       try {
//         const res = await fetchWarehouseDetails();
//         setWarehouseList(res.data || []);
//       } catch (error) {
//         console.error("Lỗi khi tải kho:", error);
//       }
//     };
//     if (open) loadWarehouse();
//   }, [open]);

//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       const matchedItem = warehouseList.find(
//         (item) => item.attributes.Model === values.Model
//       );

//       if (!matchedItem) {
//         message.error("Model trong kho không khớp. Vui lòng kiểm tra lại.");
//         return;
//       }

//       // Sinh Ticket
//       const ticket = generateInvoiceNumber();

//       // Tạo dữ liệu nhập kho
//       const importData = {
//         ProductName: matchedItem.attributes.ProductName,
//         BrandName: matchedItem.attributes.BrandName,
//         Type: matchedItem.attributes.Type,
//         SerialNumber: values.SerialNumber || "N/A",
//         Ticket: ticket,
//         NameImport: userName,
//         totalimport: Number(values.totalimport) || 0,
//         DVT: matchedItem.attributes.DVT,
//         Model: matchedItem.attributes.Model,
//         TypeKho: "DHG",
//       };

//       setLoading(true);

//       // Tạo bản ghi nhập kho
//       const createdImport = await createImportlists(importData);
//       const importId = createdImport?.data?.id;
//       if (importId) {
//         await updateImportlists(importId, { Check: true });
//       }

//       message.success(
//         `Sản phẩm ${importData.ProductName} đã nhập kho với Ticket ${ticket}.`
//       );

//       // Cập nhật số lượng kho
//       const kho = importData.TypeKho;
//       const qty = importData.totalimport;
//       const currentQty = matchedItem.attributes[kho] || 0;
//       const currentNTK = matchedItem.attributes.totalNTK || 0;
//       const currentCK = matchedItem.attributes.inventoryCK || 0;

//       await updateWarehouseDetails(matchedItem.id, {
//         [kho]: currentQty + qty,
//         totalNTK: currentNTK + qty,
//         inventoryCK: currentCK + qty,
//       });

//       notification.success({
//         message: "Nhập kho thành công",
//         description: `Sản phẩm ${importData.ProductName} đã được thêm vào kho DHG.`,
//       });

//       onConfirmSuccess?.();
//       onClose();
//     } catch (error) {
//       console.error("Lỗi nhập kho:", error);
//       message.error("Có lỗi xảy ra khi nhập kho.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title="Nhập kho DHG (Thủ công)"
//       open={open}
//       onOk={handleOk}
//       onCancel={onClose}
//       okText="Xác nhận"
//       cancelText="Hủy"
//       confirmLoading={loading}
//       width={600}
//     >
//       <Form form={form} layout="vertical">
//         {/* Chọn Model từ kho */}
//         <Form.Item
//           label="Model"
//           name="Model"
//           rules={[{ required: true, message: "Vui lòng chọn Model" }]}
//         >
//           <Select placeholder="Chọn model từ kho">
//             {warehouseList.map((item) => (
//               <Option key={item.id} value={item.attributes.Model}>
//                 {item.attributes.Model} - {item.attributes.ProductName}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         {/* Người dùng chỉ nhập số lượng và Serial */}
//         <Form.Item
//           label="Số lượng nhập"
//           name="totalimport"
//           rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
//         >
//           <Input type="number" min={1} />
//         </Form.Item>

//         <Form.Item label="Serial Number" name="SerialNumber">
//           <Input.TextArea
//             rows={3}
//             placeholder="Nhập serial, cách nhau bằng dấu xuống dòng"
//           />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default AddImportList;


import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  notification,
  Descriptions,
  InputNumber,
  Button
} from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  createImportlists,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  updateImportlists,
} from "../../../services/dhgServices";
import dayjs from "dayjs";

const { Option } = Select;

// Hàm sinh Ticket (giữ nguyên)
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `SPCDHG${year}${unique}`;
};

// Tính chiều rộng dropdown theo dữ liệu (giống AddExportList)
const getDropdownWidth = (options) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "14px Arial";
  let maxWidth = 0;
  options.forEach((opt) => {
    const metrics = context.measureText(opt.label || "");
    if (metrics.width > maxWidth) maxWidth = metrics.width;
  });
  return maxWidth + 40; // padding + scrollbar
};


const AddImportList = ({ open, onClose, onConfirmSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);

  // state phục vụ giao diện giống AddExportList
  const [models, setModels] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser?.account?.Name || "");
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

//   useEffect(() => {
//     const loadWarehouse = async () => {
//       try {
//         const res = await fetchWarehouseDetails();
//         setWarehouseList(res.data || []);
//       } catch (error) {
//         console.error("Lỗi khi tải kho:", error);
//       }
//     };
//     if (open) {
//       loadWarehouse();
//       // reset UI 5 trường mỗi lần mở modal
//       form.setFieldsValue({
//         ProductName: undefined,
//         Model: undefined,
//         BrandName: undefined,
//         DVT: undefined,
//         Type: undefined,
//       });
//       setModels([]);
//     }
//   }, [open, form]);



  useEffect(() => {
  const loadWarehouse = async () => {
    try {
      const res = await fetchWarehouseDetails();
      setWarehouseList(res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải kho:", error);
    }
  };
  if (open) {
    loadWarehouse();
    // reset toàn bộ form mỗi khi mở modal
    form.resetFields();
    setModels([]);
  }
}, [open, form]);


const generateSerialNumbers = () => {
  const serialNumber = form.getFieldValue("serialNumber");
  if (serialNumber && serialNumber.trim()) return; // đã có thì không tạo

  const quantity = Number(form.getFieldValue("totalimport")) || 0;
  if (quantity <= 0) {
    message.warning("Vui lòng nhập số lượng trước khi tạo serial!");
    return;
  }

  const dateCode = dayjs().format("YYMM"); // ví dụ: 2508 cho 2025-08
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const serials = Array.from({ length: quantity }, () => {
    let randomPart = "";
    for (let i = 0; i < 5; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `DHG${dateCode}${randomPart}`;
  });

  form.setFieldsValue({ serialNumber: serials.join(", ") });
};



  // === HANDLERS CHO UI GIỐNG AddExportList ===
  const handleProductChange = (productName) => {
    const productModels = warehouseList.filter(
      (p) => p.attributes.ProductName === productName
    );
    setModels(productModels);
    // reset các field phụ thuộc Model
    form.setFieldsValue({
      Model: undefined,
      BrandName: undefined,
      DVT: undefined,
      Type: undefined,
    });
  };

  const handleModelChange = (model) => {
    const selected = models.find((m) => m.attributes.Model === model);
    if (selected) {
      form.setFieldsValue({
        BrandName: selected.attributes.BrandName,
        DVT: selected.attributes.DVT,
        Type: selected.attributes.Type,
      });
    } else {
      form.setFieldsValue({
        BrandName: undefined,
        DVT: undefined,
        Type: undefined,
      });
    }
  };

  // === LOGIC NHẬP KHO: GIỮ NGUYÊN CHỨC NĂNG ===
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Tìm item kho theo Model (giống trước đây)
      const matchedItem = warehouseList.find(
        (item) => item.attributes.Model === values.Model
      );

      if (!matchedItem) {
        message.error("Model trong kho không khớp. Vui lòng kiểm tra lại.");
        return;
      }

      // Sinh Ticket (giữ nguyên)
      const ticket = generateInvoiceNumber();

      // Tạo dữ liệu nhập kho (giữ nguyên)
      const importData = {
        ProductName: values.ProductName || matchedItem.attributes.ProductName,
        BrandName: values.BrandName || matchedItem.attributes.BrandName,
        Type: values.Type || matchedItem.attributes.Type,
       // SerialNumber: values.SerialNumber || "N/A",
         SerialNumber: values.serialNumber || "N/A",   // <-- sửa ở đây
        Ticket: ticket,
        NameImport: userName,
        totalimport: Number(values.totalimport) || 0,
        DVT: values.DVT || matchedItem.attributes.DVT,
        Model: values.Model || matchedItem.attributes.Model,
        TypeKho: "DHG",
      };

      setLoading(true);

      // 1) Tạo bản ghi nhập kho + set Check = true (giữ nguyên)
      const createdImport = await createImportlists(importData);
      const importId = createdImport?.data?.id;
      if (importId) {
        await updateImportlists(importId, { Check: true });
      }

      message.success(
        `Sản phẩm ${importData.ProductName} đã nhập kho với Ticket ${ticket}.`
      );

      // 2) Cập nhật số lượng kho (giữ nguyên)
      const kho = importData.TypeKho; // DHG
      const qty = importData.totalimport;
      const currentQty = matchedItem.attributes[kho] || 0;
      const currentNTK = matchedItem.attributes.totalNTK || 0;
      const currentCK = matchedItem.attributes.inventoryCK || 0;

      await updateWarehouseDetails(matchedItem.id, {
        [kho]: currentQty + qty,
        totalNTK: currentNTK + qty,
        inventoryCK: currentCK + qty,
      });

      notification.success({
        message: "Nhập kho thành công",
        description: `Sản phẩm ${importData.ProductName} đã được thêm vào kho DHG.`,
      });

      onConfirmSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      message.error("Có lỗi xảy ra khi nhập kho.");
    } finally {
      setLoading(false);
    }
  };

  // Tập giá trị duy nhất cho dropdown "Tên sản phẩm"
  const productNameOptions = [
    ...new Set(warehouseList.map((p) => p.attributes.ProductName)),
  ];

  return (

//  <Modal
//       title={
//         <div className="modal-header">
//           <PlusCircleOutlined className="icon" />
//           <span className="title">Điều hàng kho DHG</span>
//         </div>
//       }
//       open={isModalOpen}
//       onOk={handleOk}
//       onCancel={onCancel}
//       okText="Lưu"
//       cancelText="Hủy"
//       width={800}
//       className="add-exportlist-modal"
//     ></Modal>

    <Modal
      //title="Nhập kho DHG (Thủ công)"
         title={
         <div className="modal-header">
           <PlusCircleOutlined className="icon" />
           <span className="title">Nhập kho DHG</span>
        </div>
      }
      open={open}
      onOk={handleOk}
    //   onCancel={onClose}
      onCancel={() => {
    form.resetFields();
    onClose();
  }}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical">
        {/* Giao diện 5 trường giống AddExportList */}
        <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
          <Descriptions.Item label="Tên sản phẩm">
            <Form.Item
              name="ProductName"
              rules={[{ required: true, message: "Chọn sản phẩm!" }]}
              noStyle
            >
              <Select
                showSearch
                allowClear
                style={{ width: 220 }}
                onChange={handleProductChange}
                dropdownStyle={{
                  minWidth: getDropdownWidth(
                    productNameOptions.map((name) => ({ label: name }))
                  ),
                }}
              >
                {productNameOptions.map((name, idx) => (
                  <Option key={idx} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Model">
            <Form.Item
              name="Model"
              rules={[{ required: true, message: "Chọn model!" }]}
              noStyle
            >
              <Select
                showSearch
                allowClear
                disabled={!models.length}
                style={{ width: 220 }}
                onChange={handleModelChange}
                dropdownStyle={{
                  minWidth: getDropdownWidth(
                    models.map((m) => ({ label: m.attributes.Model }))
                  ),
                }}
              >
                {models.map((m) => (
                  <Option key={m.id} value={m.attributes.Model}>
                    {m.attributes.Model}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Thương hiệu">
            <Form.Item name="BrandName" noStyle>
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="ĐVT">
            <Form.Item name="DVT" noStyle>
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Loại">
            <Form.Item name="Type" noStyle>
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

              <Descriptions.Item label="Số lượng nhập">
            <Form.Item name="totalimport" rules={[{ required: true, message: 'Nhập số lượng!' }]} noStyle>
              <InputNumber min={1}  style={{ width: '100%' }} />
            </Form.Item>
          </Descriptions.Item>

        <Descriptions.Item label="Serial Number" span={2}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <Form.Item
      name="serialNumber"
      noStyle
      style={{ flex: 1, marginBottom: 0 }}
    >
      <Input.TextArea
        rows={3}
        placeholder="Nhập hoặc tạo tự động"
        style={{ width: "100%" }}
      />
    </Form.Item>
    <Button
      type="dashed"
      onClick={generateSerialNumbers}
      disabled={!!form.getFieldValue("serialNumber")}
      style={{ marginLeft: 8, height: 32 }}
    >
      Tạo Serial
    </Button>
  </div>
</Descriptions.Item>
        </Descriptions>
      </Form>
    </Modal>
  );
};

export default AddImportList;

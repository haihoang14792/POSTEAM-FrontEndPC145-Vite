// import React, { useState } from "react";
// import { Modal, Form, InputNumber, Input, Button, message } from "antd";
// import {
//   returnToSupplier,
//   updateWarehouseDetails,
// } from "../../../services/dhgServices";

// const ReturnSupplierModal = ({
//   open,
//   record,
//   warehouseList,
//   onClose,
//   onConfirmSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();

//       // 1) Kiểm tra số lượng trả <= totalimport
//       const totalImport = record?.attributes?.totalimport || 0;
//       if (values.Quantity > totalImport) {
//         message.error("Số lượng trả không được lớn hơn số lượng đã nhập");
//         return;
//       }

//       // 2) Tìm item trong Warehouse theo Model
//       const matchedItem = warehouseList.find(
//         (item) => item.attributes.Model === record?.attributes?.Model
//       );

//       if (!matchedItem) {
//         message.error("Không tìm thấy sản phẩm trong kho theo Model này");
//         return;
//       }

//       setLoading(true);

//       // 3) Cập nhật Importlists (status, note, totalimportNCC, trừ totalimport)
//       await returnToSupplier(record.id, {
//         quantity: values.Quantity,
//         note: values.Reason,
//         totalimport: totalImport,
//       });

//       // 4) Trừ số lượng trong Warehouse
//       const kho = record?.attributes?.TypeKho || "DHG"; // lấy từ phiếu hoặc mặc định DHG
//       const qty = values.Quantity;

//       const currentQty = matchedItem.attributes[kho] || 0;
//       const currentNTK = matchedItem.attributes.totalNTK || 0;
//       const currentCK = matchedItem.attributes.inventoryCK || 0;

//       await updateWarehouseDetails(matchedItem.id, {
//         [kho]: currentQty - qty,
//         totalNTK: currentNTK - qty,
//         inventoryCK: currentCK - qty,
//       });

//       message.success("Đã trả hàng NCC và cập nhật kho thành công");
//       onConfirmSuccess?.();
//       onClose();
//     } catch (error) {
//       console.error("Lỗi trả NCC:", error);
//       message.error("Không thể trả hàng NCC");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title={`Trả NCC - ${record?.attributes?.ProductName || ""}`}
//       open={open}
//       onCancel={onClose}
//       footer={[
//         <Button key="cancel" onClick={onClose}>
//           Hủy
//         </Button>,
//         <Button
//           key="ok"
//           type="primary"
//           danger
//           loading={loading}
//           onClick={handleOk}
//         >
//           Xác nhận trả
//         </Button>,
//       ]}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           name="Quantity"
//           label="Số lượng trả"
//           rules={[{ required: true, message: "Nhập số lượng trả" }]}
//         >
//           <InputNumber min={1} style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item name="Reason" label="Lý do trả">
//           <Input.TextArea rows={3} />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default ReturnSupplierModal;

import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Input, Button, message } from "antd";
import {
  fetchWarehouseDetails,
  returnToSupplier,
  updateWarehouseDetails,
} from "../../../services/dhgServices";

const ReturnSupplierModal = ({ open, record, onClose, onConfirmSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [warehouseList, setWarehouseList] = useState([]);

  // Load danh sách kho khi mở modal
  useEffect(() => {
    if (open) {
      const loadWarehouse = async () => {
        try {
          const res = await fetchWarehouseDetails();
          setWarehouseList(res.data || []);
        } catch (error) {
          console.error("Lỗi load kho:", error);
          message.error("Không thể tải dữ liệu kho");
        }
      };
      loadWarehouse();
    } else {
      form.resetFields();
      setWarehouseList([]);
    }
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // 1) Kiểm tra số lượng trả <= totalimport
      const totalImport = record?.attributes?.totalimport || 0;
      if (values.Quantity > totalImport) {
        message.error("Số lượng trả không được lớn hơn số lượng đã nhập");
        return;
      }

      // 2) Tìm item trong Warehouse theo Model
      const matchedItem = warehouseList.find(
        (item) => item.attributes.Model === record?.attributes?.Model
      );

      if (!matchedItem) {
        message.error("Không tìm thấy sản phẩm trong kho theo Model này");
        return;
      }

      setLoading(true);

      // 3) Cập nhật Importlists (status, note, totalimportNCC, trừ totalimport)
      await returnToSupplier(record.id, {
        quantity: values.Quantity,
        note: values.Reason,
        totalimport: totalImport,
      });

      // 4) Trừ số lượng trong Warehouse
      const kho = record?.attributes?.TypeKho || "DHG"; // lấy từ phiếu hoặc mặc định DHG
      const qty = values.Quantity;

      const currentQty = matchedItem.attributes[kho] || 0;
      const currentNTK = matchedItem.attributes.totalNTK || 0;
      const currentCK = matchedItem.attributes.inventoryCK || 0;

      await updateWarehouseDetails(matchedItem.id, {
        [kho]: currentQty - qty,
        totalNTK: currentNTK - qty,
        inventoryCK: currentCK - qty,
      });

      message.success("Đã trả hàng NCC và cập nhật kho thành công");
      onConfirmSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi trả NCC:", error);
      message.error("Không thể trả hàng NCC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Trả NCC - ${record?.attributes?.ProductName || ""}`}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="ok"
          type="primary"
          danger
          loading={loading}
          onClick={handleOk}
        >
          Xác nhận trả
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="Quantity"
          label="Số lượng trả"
          rules={[{ required: true, message: "Nhập số lượng trả" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="Reason" label="Lý do trả">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReturnSupplierModal;

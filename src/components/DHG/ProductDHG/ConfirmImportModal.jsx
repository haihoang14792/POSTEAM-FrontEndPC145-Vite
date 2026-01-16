import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  notification,
  Descriptions,
  Button,
} from "antd";
import {
  createImportlists,
  updateSupplierDetail,
  fetchListSupplierDetail,
  updateWarehouseDetails,
  fetchWarehouseDetails,
  updateImportlists,
} from "../../../services/dhgServices";

const { Option } = Select;

const ConfirmImportModal = ({
  open,
  onClose,
  product,
  onConfirmSuccess,
  setSelectedProduct,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

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

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ProductName: product.attributes?.ProductName || "",
        totalImport: 1,
        DVT: product.attributes?.DVT || "Cái",
        Model: product.attributes?.Model || "",
        BrandName: product.attributes?.BrandName || "",
        Type: product.attributes?.Type || "",
        SerialNumber: Array.isArray(product.attributes?.SerialNumber)
          ? product.attributes.SerialNumber.join("\n")
          : product.attributes?.SerialNumber || "",
      });
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const handleConfirmInvoice = async (invoice) => {
    if (!invoice) return;
    try {
      await updateSupplierDetail(invoice.id, { Status: "Đã nhập kho" });

      const updatedData = await fetchListSupplierDetail();
      const updatedProduct = updatedData.data?.find(
        (item) => item.id === invoice.id
      );
      setSelectedProduct(updatedProduct);

      notification.success({
        message: "Xác nhận thành công",
        description: `Sản phẩm ${invoice.attributes.ProductName} đã được xác nhận.`,
      });
    } catch (error) {
      console.error("Lỗi khi xác nhận phiếu:", error);
      notification.error({
        message: "Xác nhận thất bại",
        description: "Đã có lỗi xảy ra khi xác nhận phiếu.",
      });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!product) {
        message.warning("Sản phẩm không hợp lệ.");
        return;
      }

      // Kiểm tra model có tồn tại trong kho không
      const warehouseList = await fetchWarehouseDetails();
      const matchedItem = warehouseList.data.find(
        (item) => item.attributes.Model === values.Model
      );

      if (!matchedItem) {
        message.error("Model trong kho không khớp. Vui lòng kiểm tra lại.");
        return;
      }

      // Tạo dữ liệu nhập kho
      const importData = {
        ProductName: product.attributes?.ProductName,
        BrandName: product.attributes?.BrandName,
        Type: product.attributes?.Type,
        SerialNumber: product.attributes?.SerialNumber || "N/A",
        Ticket: product.attributes?.Ticket || "N/A",
        NameImport: userName,
        totalimport: product.attributes?.Qty || 0,
        DVT: product.attributes?.DVT,
        Model: product.attributes?.Model,
        TypeKho: "DHG",
      };

      setLoading(true);

      // Tạo bản ghi nhập kho
      const createdImport = await createImportlists(importData);
      const importId = createdImport?.data?.id;
      if (importId) {
        await updateImportlists(importId, { Check: true });
      }

      message.success(`Sản phẩm ${importData.ProductName} đã nhập kho.`);

      // Cập nhật số lượng kho
      const kho = importData.TypeKho;
      const qty = importData.totalimport;
      const currentQty = matchedItem.attributes[kho] || 0;
      const currentNTK = matchedItem.attributes.totalNTK || 0;
      const currentCK = matchedItem.attributes.inventoryCK || 0;

      await updateWarehouseDetails(matchedItem.id, {
        [kho]: currentQty + qty,
        totalNTK: currentNTK + qty,
        inventoryCK: currentCK + qty,
      });

      // Cập nhật phiếu
      await handleConfirmInvoice(product);

      // Callback và đóng modal
      onConfirmSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      message.error("Có lỗi xảy ra khi nhập kho.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Xác nhận nhập kho"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={loading}
      width={800}
    >
      {product ? (
        <Form form={form} layout="vertical">
          <Descriptions
            bordered
            column={2}
            size="small"
            labelStyle={{ width: 150 }}
            contentStyle={{ whiteSpace: "normal" }}
          >
            <Descriptions.Item label="Tên sản phẩm" span={1}>
              <span>{product.attributes?.ProductName}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Đơn vị tính (DVT)" span={1}>
              <span>{product.attributes?.DVT}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Model" span={1}>
              <span>{product.attributes?.Model}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Thương hiệu" span={1}>
              <span>{product.attributes?.BrandName}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Kiểu Sản Phẩm" span={1}>
              <span>{product.attributes?.Type}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Số lượng" span={1}>
              <span>{product.attributes?.Qty}</span>
            </Descriptions.Item>

            {/* <Descriptions.Item label="Serial Number" span={1}>
                            <span>{product.attributes?.SerialNumber || 'N/A'}</span>
                        </Descriptions.Item> */}

            <Descriptions.Item label="Ticket" span={1}>
              <span>{product.attributes?.Ticket || "N/A"}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Người nhập" span={1}>
              <span>{userName || "Không xác định"}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Serial Number" span={2}>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div
                  style={{
                    flex: 1,
                    maxHeight: "80px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    padding: "4px 8px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                  }}
                >
                  {Array.isArray(product.attributes?.SerialNumber)
                    ? product.attributes.SerialNumber.join("\n")
                    : product.attributes?.SerialNumber || "N/A"}
                </div>
                <Button
                  type="dashed"
                  onClick={() => {
                    const serialText = Array.isArray(
                      product.attributes?.SerialNumber
                    )
                      ? product.attributes.SerialNumber.join("\n")
                      : product.attributes?.SerialNumber || "";
                    if (serialText) {
                      navigator.clipboard.writeText(serialText);
                      message.success("Đã sao chép Serial Number");
                    }
                  }}
                  style={{ marginLeft: 8, height: 32 }}
                >
                  Sao chép
                </Button>
              </div>
            </Descriptions.Item>
          </Descriptions>
          
          <Form.Item name="Model" style={{ display: "none" }}>
            <Input />
          </Form.Item>
        </Form>
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          Không có sản phẩm được chọn.
        </p>
      )}
    </Modal>
  );
};

export default ConfirmImportModal;

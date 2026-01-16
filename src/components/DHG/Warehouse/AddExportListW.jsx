import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Descriptions,
  Tag,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { fetchUsers } from "../../../services/abicoServices";
import {
  createExportlists,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  updateExportlists,
} from "../../../services/dhgServices";

const { Option } = Select;

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `SPDHG${year}${unique}`;
};

// Hàm tính chiều rộng dropdown theo dữ liệu
const getDropdownWidth = (options) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "14px Arial";
  let maxWidth = 0;
  options.forEach((opt) => {
    const metrics = context.measureText(opt.label || "");
    if (metrics.width > maxWidth) {
      maxWidth = metrics.width;
    }
  });
  return maxWidth + 40; // cộng padding + scroll
};

const AddExportList = ({ isModalOpen, onCancel, onCreated = () => {} }) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [models, setModels] = useState([]);
  const [brandnames, setBrandnames] = useState([]);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetchUsers();
        if (res) setUsers(res);
      } catch (error) {
        console.error("Lỗi khi fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWarehouseDetails();
        setProducts(response.data);
      } catch (error) {
        message.error("Lỗi khi tải danh sách sản phẩm");
      }
    };
    fetchData();

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
    if (isModalOpen) {
      form.resetFields();
      form.setFieldsValue({
        Ticket: generateInvoiceNumber(),
        NameCreate: userName,
      });
    }
  }, [isModalOpen, form, userName]);

  const handleProductChange = (productName) => {
    const productModels = products.filter(
      (p) => p.attributes.ProductName === productName
    );
    setModels(productModels);
    setBrandnames([]);
    form.setFieldsValue({
      Model: undefined,
      DVT: undefined,
      totalexport: undefined,
      BrandName: undefined,
      Type: undefined,
    });
  };

  const handleModelChange = (model) => {
    const selected = models.find((m) => m.attributes.Model === model);

    if (selected) {
      form.setFieldsValue({
        DVT: selected.attributes.DVT,
        Type: selected.attributes.Type,
        BrandName: undefined,
        totalexport: undefined,
        SerialNumber: "",
        idModel: selected.id,
      });

      const relatedBrands = products
        .filter((p) => p.attributes.Model === model)
        .map((p) => ({
          id: p.id,
          attributes: { BrandName: p.attributes.BrandName },
        }));

      setBrandnames(relatedBrands);
      if (relatedBrands.length) {
        form.setFieldsValue({
          BrandName: relatedBrands[0].attributes.BrandName,
        });
      }
    }
  };

  const handleOk = async () => {
    try {
      await form.validateFields();

      const values = {
        ...form.getFieldsValue(),
        NameCreate: userName,
        Ticket: form.getFieldValue("Ticket") || generateInvoiceNumber(),
        TicketDHG: form.getFieldValue("TicketDHG"),
        Status: "Chờ duyệt",
      };

      if (!values.SerialNumber || values.SerialNumber.length === 0) {
        message.error("Vui lòng nhập số serial!");
        return;
      }

      // Tạo phiếu trả kho POS/POSHN
      const response = await createExportlists(values);
      const exportItem = response.data;

      // Lấy thông tin kho
      const warehouseList = await fetchWarehouseDetails();
      const matched = warehouseList.data.find(
        (w) => w.attributes.Model === values.Model
      );

      if (matched) {
        const {
          POS = 0,
          POSHN = 0,
          totalNTK = 0,
          inventoryCK = 0,
        } = matched.attributes;

        const soLuong = values.totalexport;

        // ✅ Cập nhật POS/POSHN + nhập kỳ + tồn cuối kỳ
        const updatePayload = {
          POS: values.TypeKho === "POS" ? POS + soLuong : POS,
          POSHN: values.TypeKho === "POSHN" ? POSHN + soLuong : POSHN,
          totalNTK: totalNTK + soLuong, // nhập trong kỳ
          inventoryCK: inventoryCK + soLuong, // tồn cuối kỳ
        };

        await updateWarehouseDetails(matched.id, updatePayload);
      } else {
        message.warning("Không tìm thấy Model tương ứng trong kho.");
      }

      // Đánh dấu Check = true
      await updateExportlists(exportItem.id, { Check: true });

      message.success("Trả kho POS/POSHN thành công!");
      form.resetFields();
      onCreated(exportItem);
    } catch (error) {
      console.error("Lỗi khi trả kho POS/POSHN:", error);
      message.error("Có lỗi xảy ra khi trả kho POS/POSHN.");
    }
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <PlusCircleOutlined className="icon" />
          <span className="title">Trả kho POS</span>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      width={800}
      className="add-exportlist-modal"
    >
      <Form form={form} layout="vertical">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Tên sản phẩm">
            <Form.Item
              name="ProductName"
              rules={[{ required: true, message: "Chọn sản phẩm!" }]}
              noStyle
            >
              <Select
                onChange={handleProductChange}
                showSearch
                allowClear
                dropdownStyle={{
                  minWidth: getDropdownWidth(
                    [
                      ...new Set(products.map((p) => p.attributes.ProductName)),
                    ].map((name) => ({ label: name }))
                  ),
                }}
                style={{ width: 200 }}
              >
                {[
                  ...new Set(products.map((p) => p.attributes.ProductName)),
                ].map((name, index) => (
                  <Option key={index} value={name}>
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
                onChange={handleModelChange}
                disabled={!models.length}
                showSearch
                allowClear
                dropdownStyle={{
                  minWidth: getDropdownWidth(
                    models.map((m) => ({ label: m.attributes.Model }))
                  ),
                }}
                style={{ width: 200 }}
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

          <Descriptions.Item label="Kho">
            <Form.Item
              name="TypeKho"
              rules={[{ required: true, message: "Chọn kho!" }]}
              noStyle
            >
              <Select
                showSearch
                allowClear
                dropdownStyle={{
                  minWidth: getDropdownWidth([
                    { label: "POS" },
                    { label: "POSHN" },
                  ]),
                }}
              >
                <Option value="POS">POS</Option>
                <Option value="POSHN">POSHN</Option>
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Ticket">
            <Form.Item
              name="TicketDHG"
              rules={[{ message: "Nhập phiếu mượn DHG!" }]}
              noStyle
            >
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng trả">
            <Form.Item
              name="totalexport"
              rules={[{ required: true, message: "Nhập số lượng!" }]}
              noStyle
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Serial trả" span={2}>
            <Form.Item
              name="SerialNumber"
              rules={[{ required: true, message: "Nhập serial!" }]}
              noStyle
            >
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Người nhận hàng">
            <Form.Item
              name="NameExport"
              rules={[{ required: true, message: "Chọn tên!" }]}
              noStyle
            >
              <Select
                loading={loadingUsers}
                showSearch
                allowClear
                style={{ width: 200 }}
                dropdownStyle={{
                  minWidth: getDropdownWidth(
                    users
                      .filter((u) => u.Exportlister === true)
                      .map((u) => ({ label: u.Name }))
                  ),
                }}
              >
                {users
                  .filter((u) => u.Exportlister === true)
                  .map((u) => (
                    <Option key={u.id} value={u.Name}>
                      {u.Name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Người tạo phiếu">
            <Form.Item name="NameCreate" initialValue={userName} noStyle>
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Số phiếu">
            <Form.Item
              name="Ticket"
              initialValue={generateInvoiceNumber()}
              noStyle
            >
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color="orange">Chờ duyệt</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Form>
    </Modal>
  );
};

export default AddExportList;

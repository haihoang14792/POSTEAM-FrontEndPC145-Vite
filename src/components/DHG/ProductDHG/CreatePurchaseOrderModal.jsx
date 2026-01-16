import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
  Descriptions,
} from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import {
  fetchListSupplier,
  createSupplierForm,
  fetchWarehouseDetails,
} from "../../../services/dhgServices";
import { fetchUsers } from "../../../services/abicoServices";
import { fetchListCustomer } from "../../../services/strapiServices";

const { Option } = Select;

// Hàm tạo số phiếu
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
  return maxWidth + 40; // padding + scroll
};

const CreatePurchaseOrderModal = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [models, setModels] = useState([]);
  const [brandnames, setBrandNames] = useState([]);
  const [types, setTypes] = useState([]);
  const [userName, setUserName] = useState("");
  const [customersData, setCustomersData] = useState([]); // ✅ Lưu toàn bộ khách hàng
  const [filteredStoreIDs, setFilteredStoreIDs] = useState([]); // ✅ StoreID theo customer
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsers();
        // Lọc ra những user có Purchaseer === true
        const purchaseUsers = res.filter((u) => u.Purchaseer === true);
        setUsers(purchaseUsers);
      } catch (error) {
        console.error("Lỗi khi fetch users:", error);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (visible) {
      fetchListSupplier()
        .then((data) => setSuppliers(data?.data || []))
        .catch(() => notification.error({ message: "Lỗi tải nhà cung cấp" }));

      fetchWarehouseDetails()
        .then((data) => setProducts(data?.data || []))
        .catch(() => notification.error({ message: "Lỗi tải sản phẩm" }));

      // ✅ Lấy danh sách khách hàng + StoreID
      fetchListCustomer()
        .then((data) => setCustomersData(data?.data || []))
        .catch(() => notification.error({ message: "Lỗi tải khách hàng" }));

      // Lấy user từ localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser?.account?.Name || "");
        } catch {
          setUserName("");
        }
      }

      // Reset form và set giá trị mặc định
      form.resetFields();
      form.setFieldsValue({
        ticket: generateInvoiceNumber(),
        currency: "VNĐ",
        // unit: "Cái",
        quantity: 0,
        unitPrice: 0,
        totalAmount: 0,
        vat: 0,
        amountSupplier: 0,
        shippingAddress: "677/7 Điện Biên Phủ, Phường Thạnh Mỹ Tây, Tp.HCM",
        //purchaseUser: "Đinh Huy Hùng",
        Status: "Chưa nhận hàng",
        NameCreate: userName,
      });
    }
  }, [visible, form, userName]);

  // Cập nhật Models, BrandNames, Types khi chọn ProductName và Model
  const handleProductChange = (productName) => {
    const filteredProducts = products.filter(
      (p) => p.attributes.ProductName === productName
    );
    const uniqueModels = [
      ...new Set(filteredProducts.map((p) => p.attributes.Model)),
    ];
    setModels(uniqueModels);
    setBrandNames([]);
    setTypes([]);
    form.setFieldsValue({
      model: undefined,
      brandname: undefined,
      type: undefined,
    });
  };

  // const handleModelChange = (model) => {
  //   const filteredProducts = products.filter(
  //     (p) => p.attributes.Model === model
  //   );
  //   const uniqueBrands = [
  //     ...new Set(filteredProducts.map((p) => p.attributes.BrandName)),
  //   ];
  //   const uniqueTypes = [
  //     ...new Set(filteredProducts.map((p) => p.attributes.Type)),
  //   ];
  //   setBrandNames(uniqueBrands);
  //   setTypes(uniqueTypes);
  //   form.setFieldsValue({
  //     brandname: uniqueBrands.length === 1 ? uniqueBrands[0] : undefined,
  //     type: uniqueTypes.length === 1 ? uniqueTypes[0] : undefined,
  //   });
  // };

  const handleModelChange = (model) => {
    const filteredProducts = products.filter(
      (p) => p.attributes.Model === model
    );

    if (filteredProducts.length === 0) return;

    // Lấy giá trị duy nhất của Brand, Type, DVT
    const uniqueBrands = [
      ...new Set(filteredProducts.map((p) => p.attributes.BrandName)),
    ];
    const uniqueTypes = [
      ...new Set(filteredProducts.map((p) => p.attributes.Type)),
    ];
    const uniqueUnits = [
      ...new Set(filteredProducts.map((p) => p.attributes.DVT)),
    ];

    setBrandNames(uniqueBrands);
    setTypes(uniqueTypes);
    setUnits(uniqueUnits); // ✅ mới

    form.setFieldsValue({
      brandname: uniqueBrands.length === 1 ? uniqueBrands[0] : undefined,
      type: uniqueTypes.length === 1 ? uniqueTypes[0] : undefined,
      unit: uniqueUnits.length === 1 ? uniqueUnits[0] : undefined, // ✅ mới
    });
  };

  // ✅ Khi chọn Customer -> Lọc StoreID
  const handleCustomerChange = (customerName) => {
    if (customerName) {
      const storeList = customersData
        .filter((c) => c.attributes.Customer === customerName)
        .map((c) => c.attributes.StoreID);
      setFilteredStoreIDs(storeList);
      form.setFieldsValue({ storeID: undefined }); // reset storeID khi đổi customer
    } else {
      setFilteredStoreIDs([]);
      form.setFieldsValue({ storeID: undefined });
    }
  };

  // Tính toán tiền tự động
  const onFormValuesChange = (_, allValues) => {
    const quantity = Number(allValues.quantity || 0);
    const unitPrice = Number(allValues.unitPrice || 0);
    const totalAmount = quantity * unitPrice;
    const vatRate = Number(allValues.selectedVat || 10);
    const vat = Math.round(totalAmount * (vatRate / 100));
    const amountSupplier = totalAmount + vat;
    form.setFieldsValue({ totalAmount, vat, amountSupplier });
  };

  const currencyFormatter = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const currencyParser = (value) => value.replace(/[₫\s,.]/g, "");

  const handleCreate = async (values) => {
    const payload = {
      ProductName: values.productName,
      Model: values.model,
      BrandName: values.brandname,
      Type: values.type,
      NameNCC: values.supplierName,
      Purchuser: values.purchaseUser,
      ShippingAddress: values.shippingAddress,
      Note: values.note,
      Ticket: values.ticket,
      NameCreate: values.NameCreate,
      Status: values.Status,
      Currency: values.currency,
      DVT: values.unit,
      Qty: values.quantity,
      UnitPrice: values.unitPrice,
      TotalAmount: values.totalAmount,
      VatRate: values.selectedVat,
      Vat: values.vat,
      AmountSupplier: values.amountSupplier,
      Customer: values.customer,
      StoreID: values.storeID,
    };
    try {
      const result = await createSupplierForm(payload);
      notification.success({
        message: "Cập nhật thành công",
        description: `Phiếu ${values.ticket} đã được cập nhật.`,
      });
      form.resetFields();
      onCreate(values);
    } catch (error) {
      notification.error({ message: "Lỗi khi tạo phiếu" });
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <FileTextOutlined style={{ fontSize: 20, marginRight: 8 }} />
          <span>Tạo phiếu nhập</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => handleCreate(values))
          .catch((info) => console.log("Validate Failed:", info));
      }}
      width={800}
      okText="Tạo"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Số phiếu">
            <Form.Item name="ticket" noStyle>
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Người tạo phiếu">
            <Form.Item name="NameCreate" noStyle>
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Tình trạng">
            <Form.Item name="Status" noStyle>
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="Người đề nghị">
            <Form.Item
              name="purchaseUser"
              noStyle
              rules={[
                { required: true, message: "Vui lòng chọn người đề nghị" },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn người đề nghị"
                dropdownStyle={{ minWidth: 190 }}
                getPopupContainer={(trigger) => document.body}
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.Name}>
                    {user.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Khách hàng">
            <Form.Item
              name="customer"
              noStyle
              rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
            >
              <Select
                placeholder="Chọn khách hàng"
                showSearch
                allowClear
                onChange={handleCustomerChange} // ✅ gọi hàm lọc StoreID
                dropdownStyle={{
                  minWidth: getDropdownWidth(
                    [
                      ...new Set(
                        customersData.map((p) => p.attributes.Customer)
                      ),
                    ].map((name) => ({ label: name }))
                  ),
                }}
              >
                {[
                  ...new Set(customersData.map((p) => p.attributes.Customer)),
                ].map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          {/* ✅ StoreID */}
          <Descriptions.Item label="StoreID">
            <Form.Item
              name="storeID"
              noStyle
              rules={[{ message: "Vui lòng chọn cửa hàng" }]}
            >
              <Select
                placeholder="Chọn cửa hàng"
                disabled={!filteredStoreIDs.length}
                showSearch
                allowClear
                dropdownStyle={{
                  minWidth: getDropdownWidth(
                    filteredStoreIDs.map((m) => ({ label: m }))
                  ),
                }}
              >
                {filteredStoreIDs.map((storeID) => (
                  <Option key={storeID} value={storeID}>
                    {storeID}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Tên sản phẩm">
            <Form.Item
              name="productName"
              noStyle
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
            >
              <Select
                placeholder="Chọn sản phẩm"
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
              >
                {[
                  ...new Set(products.map((p) => p.attributes.ProductName)),
                ].map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Model">
            <Form.Item
              name="model"
              noStyle
              rules={[{ required: true, message: "Vui lòng chọn model" }]}
            >
              <Select
                placeholder="Chọn model"
                disabled={!models.length}
                onChange={handleModelChange}
                showSearch
                allowClear
                dropdownStyle={{
                  minWidth: getDropdownWidth(models.map((m) => ({ label: m }))),
                }}
              >
                {models.map((model) => (
                  <Option key={model} value={model}>
                    {model}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Thương hiệu">
            <Form.Item
              name="brandname"
              noStyle
              rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
            >
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="Loại sản phẩm">
            <Form.Item
              name="type"
              noStyle
              rules={[
                { required: true, message: "Vui lòng chọn loại sản phẩm" },
              ]}
            >
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Loại tiền">
            <Form.Item name="currency" noStyle>
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="ĐVT">
            <Form.Item
              name="unit"
              noStyle
              rules={[{ required: true, message: "Vui lòng chọn loại ĐVT" }]}
            >
              <Input readOnly />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Thuế (%)">
            <Form.Item
              name="selectedVat"
              noStyle
              initialValue={10} // mặc định 10%
            >
              <Select
                style={{ width: "100%" }}
                onChange={(value) => {
                  // Lấy số lượng và đơn giá hiện tại
                  const quantity = Number(form.getFieldValue("quantity") || 0);
                  const unitPrice = Number(
                    form.getFieldValue("unitPrice") || 0
                  );
                  const totalAmount = quantity * unitPrice;
                  const vat = Math.round(totalAmount * (value / 100));
                  const amountSupplier = totalAmount + vat;
                  form.setFieldsValue({ vat, amountSupplier });
                }}
              >
                <Select.Option value={0}>0%</Select.Option>
                <Select.Option value={8}>8%</Select.Option>
                <Select.Option value={10}>10%</Select.Option>
              </Select>
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng">
            <Form.Item
              name="quantity"
              noStyle
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Đơn giá">
            <Form.Item
              name="unitPrice"
              noStyle
              rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Giá chưa VAT">
            <Form.Item name="totalAmount" noStyle>
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="VAT">
            <Form.Item name="vat" noStyle>
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Tổng cộng" span={2}>
            <Form.Item name="amountSupplier" noStyle>
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={currencyFormatter}
                parser={currencyParser}
              />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Tên nhà cung cấp" span={2}>
            <Form.Item
              name="supplierName"
              noStyle
              rules={[
                { required: true, message: "Vui lòng chọn nhà cung cấp" },
              ]}
            >
              <Select
                placeholder="Chọn nhà cung cấp"
                showSearch
                allowClear
                dropdownStyle={{ minWidth: 500 }}
                getPopupContainer={(trigger) => document.body}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {suppliers.length > 0 ? (
                  suppliers
                    .filter((supplier) => supplier.attributes?.NameNCC)
                    .map((supplier) => (
                      <Option
                        key={supplier.id}
                        value={supplier.attributes.NameNCC}
                      >
                        {supplier.attributes.NameNCC}
                      </Option>
                    ))
                ) : (
                  <Option disabled value="">
                    Không có dữ liệu nhà cung cấp
                  </Option>
                )}
              </Select>
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ nhận hàng" span={2}>
            <Form.Item
              name="shippingAddress"
              noStyle
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ nhận hàng" },
              ]}
            >
              <Input placeholder="Nhập địa chỉ nhận hàng" />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú" span={2}>
            <Form.Item name="note" noStyle>
              <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
          </Descriptions.Item>
        </Descriptions>
      </Form>
    </Modal>
  );
};

export default CreatePurchaseOrderModal;

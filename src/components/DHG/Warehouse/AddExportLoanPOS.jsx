import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message, Descriptions, Tag, Space } from "antd";
import { FileTextOutlined, ShopOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { createExportLoanTicket } from '../../../services/dhgServices';
import { fetchListCustomer } from "../../../services/strapiServices";

const { Option } = Select;

function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `PXDHG${year}${unique}`;
}


// Hàm tính chiều rộng dropdown theo dữ liệu
const getDropdownWidth = (options) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '14px Arial';
  let maxWidth = 0;
  options.forEach(opt => {
    const metrics = context.measureText(opt.label || '');
    if (metrics.width > maxWidth) {
      maxWidth = metrics.width;
    }
  });
  return maxWidth + 40;
};

const AddExportLoanPOS = ({ open, onClose, reloadTickets }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filteredStores, setFilteredStores] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);


  useEffect(() => {
    if (open) {
      form.setFieldsValue({ Votes: generateInvoiceNumber() });
    }
  }, [open]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetchListCustomer();
      const data = res.data || [];

      setCustomerList(data);

      // Lấy danh sách Customer duy nhất
      const uniqueCustomers = Array.from(
        new Set(data.map(item => item.attributes.Customer))
      ).map(customer => ({
        label: customer,
        value: customer,
      }));

      setCustomerOptions(uniqueCustomers);
    } catch (error) {
      message.error("Không thể tải danh sách cửa hàng!");
    }
  };
  fetchData();
}, []);



  useEffect(() => {
    if (!selectedCustomer || selectedCustomer === "Khác") {
      setFilteredStores([]);
      form.setFieldsValue({ Store: undefined, DeliveryAddress: undefined });
      return;
    }
    const result = customerList.filter(
      (item) => item.attributes.Customer === selectedCustomer && item.attributes.Status
    );
    setFilteredStores(result);
  }, [selectedCustomer, customerList, form]);

  const handleStoreChange = (value) => {
    form.setFieldsValue({ Store: value });
    const selectedStore = filteredStores.find((store) => store.attributes.StoreID === value);
    if (selectedStore) {
      form.setFieldsValue({ DeliveryAddress: selectedStore.attributes.Address });
    } else {
      form.setFieldsValue({ DeliveryAddress: undefined });
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await createExportLoanTicket(values);
      await reloadTickets();
      message.success("🎉 Tạo phiếu thành công!");
      onClose();
      form.resetFields();
    } catch (error) {
      message.error("❌ Lỗi khi tạo phiếu!");
    } finally {
      setLoading(false);
    }
  };

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};


  return (
    <Modal
      title={
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <FileTextOutlined style={{ fontSize: 22, color: "#1677ff" }} />
          <span>Tạo Phiếu Dịch Vụ</span>
        </motion.div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={750}
      getContainer={document.body}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ textAlign: "center", marginBottom: 15 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4102/4102584.png"
            alt="Ticket Illustration"
            width={80}
            style={{ opacity: 0.9 }}
          />
        </div>

        <Form form={form} layout="vertical">
          {/* Hàng 1: Số Phiếu + Ticket Dingtalk */}
         <Descriptions bordered column={1} size="small" labelStyle={{ width: 150 }}contentStyle={{ width: 400 }} >
  <Descriptions.Item label="📝 Số Phiếu">
    <Form.Item name="Votes" noStyle rules={[{ required: true }]}>
      <Input readOnly style={{ width: 200 }}  />
    </Form.Item>
  </Descriptions.Item>

  <Descriptions.Item label="📝 Ticket Dingtalk">
    <Form.Item name="Ticket" noStyle rules={[{ required: true }]}>
      <Input placeholder="Nhập ticket"  style={{ width: 200 }} />
    </Form.Item>
  </Descriptions.Item>


           {/* Các trường còn lại */}
  {/* <Descriptions bordered column={1} size="small" style={{ marginBottom: 12 }}> */}
  <Descriptions.Item label={<><ShopOutlined /> Khách Hàng</>} >
      <Form.Item name="Customer" noStyle rules={[{ required: true }]}>
  <Select
    placeholder="Chọn khách hàng"
    showSearch
    optionFilterProp="children"
    onChange={(value) => {
      setSelectedCustomer(value);
      form.setFieldsValue({ Store: undefined, DeliveryAddress: undefined });
    }}
    style={{ width: 200 }} 
    dropdownStyle={{ minWidth: getDropdownWidth(customerOptions) }}
  >
    {customerOptions.map(opt => (
      <Option key={opt.value} value={opt.value}>{opt.label}</Option>
    ))}
  </Select>
</Form.Item>
  </Descriptions.Item>

 <Descriptions.Item label="🏬 Cửa Hàng">
  <Form.Item
    name="Store"
    noStyle
    rules={[{ required: true, message: "Vui lòng chọn hoặc nhập cửa hàng!" }]}
  >
    {filteredStores.length > 0 ? (
      <Select
        placeholder="Chọn cửa hàng"
        showSearch
        optionFilterProp="children"
        onChange={handleStoreChange}
        filterOption={(input, option) =>
          option?.value.toLowerCase().includes(input.toLowerCase())
        }
         style={{ width: 200 }} 
        dropdownStyle={{
          minWidth: getDropdownWidth(
            filteredStores.map(store => ({ label: store.attributes.StoreID }))
          )
        }}
      >
        {filteredStores.map((store) => (
          <Option key={store.id} value={store.attributes.StoreID}>
            {store.attributes.StoreID}
          </Option>
        ))}
      </Select>
    ) : (
      <Input placeholder="Nhập cửa hàng"   style={{ width: 200 }} />
    )}
  </Form.Item>
</Descriptions.Item>


  <Descriptions.Item label="🛣️ Địa Chỉ">
               <Form.Item name="DeliveryAddress" noStyle>
                 <Input placeholder="Nhập địa chỉ" />
               </Form.Item>
             </Descriptions.Item>

    <Descriptions.Item label="📝 Ghi Chú">
    <Form.Item name="Note" noStyle >
      <Input placeholder="Nhập ghi chú" />
    </Form.Item>
  </Descriptions.Item>

</Descriptions>

{/* Hàng 2: Người Tạo + Trạng Thái */}
<Descriptions bordered column={2} size="small">
  <Descriptions.Item label="👤 Người Tạo">
    <Form.Item name="Person" initialValue={account.Name} noStyle>
      <Input readOnly />
    </Form.Item>
  </Descriptions.Item>


  <Descriptions.Item label="📌 Trạng Thái">
    <Form.Item name="Status" initialValue="Đang tạo phiếu" noStyle>
      <Input readOnly />
    </Form.Item>
  </Descriptions.Item>

</Descriptions>
          <Space style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <Button icon={<CloseOutlined />} onClick={onClose}>Hủy</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              loading={loading}
            >
              {loading ? "Đang tạo..." : "Tạo Phiếu"}
            </Button>
          </Space>
        </Form>
      </motion.div>
    </Modal>
  );
};

export default AddExportLoanPOS;
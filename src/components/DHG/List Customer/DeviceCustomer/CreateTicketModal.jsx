// import React, { useState, useEffect } from "react";
// import { Modal, Form, Input, Select, Button, message, Descriptions, Space } from "antd";
// import { FileTextOutlined, ShopOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
// import { motion } from "framer-motion";
// import { createTicket } from "../../../../services/storeServices";
// import { fetchListCustomer } from "../../../../services/strapiServices";

// const { Option } = Select;

// // Hàm tạo số phiếu
// function generateInvoiceNumber() {
//   const year = new Date().getFullYear();
//   const unique = Math.floor(Math.random() * 1000000);
//   return `QLTB${year}${unique}`;
// }

// // Hàm tính chiều rộng dropdown theo dữ liệu
// const getDropdownWidth = (options) => {
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   context.font = "14px Arial";
//   let maxWidth = 0;
//   options.forEach((opt) => {
//     const metrics = context.measureText(opt.label || "");
//     if (metrics.width > maxWidth) {
//       maxWidth = metrics.width;
//     }
//   });
//   return maxWidth + 40;
// };

// const CreateTicketModal = ({ open, onClose, reloadTickets }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [customerList, setCustomerList] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [filteredStores, setFilteredStores] = useState([]);
//   const [customerOptions, setCustomerOptions] = useState([]);

//   // Gán số phiếu khi modal mở
//   useEffect(() => {
//     if (open) {
//       form.setFieldsValue({ Votes: generateInvoiceNumber() });
//     }
//   }, [open]);

//   // Lấy danh sách khách hàng
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetchListCustomer();
//         const data = res.data || [];
//         setCustomerList(data);

//         // Lấy danh sách Customer duy nhất
//         const uniqueCustomers = Array.from(
//           new Set(data.map((item) => item.attributes.Customer))
//         ).map((customer) => ({
//           label: customer,
//           value: customer,
//         }));

//         setCustomerOptions(uniqueCustomers);
//       } catch (error) {
//         message.error("Không thể tải danh sách cửa hàng!");
//       }
//     };
//     fetchData();
//   }, []);

//   // Lọc store theo customer
//   useEffect(() => {
//     if (!selectedCustomer || selectedCustomer === "Khác") {
//       setFilteredStores([]);
//       form.setFieldsValue({ Store: undefined, Address: undefined });
//       return;
//     }
//     const result = customerList.filter(
//       (item) =>
//         item.attributes.Customer === selectedCustomer && item.attributes.Status
//     );
//     setFilteredStores(result);
//   }, [selectedCustomer, customerList, form]);

//   // Khi chọn store
//   const handleStoreChange = (value) => {
//     form.setFieldsValue({ Store: value });
//     const selectedStore = filteredStores.find(
//       (store) => store.attributes.StoreID === value
//     );
//     if (selectedStore) {
//       form.setFieldsValue({ Address: selectedStore.attributes.Address });
//     } else {
//       form.setFieldsValue({ Address: undefined });
//     }
//   };

//   // Tạo phiếu
//   const handleCreate = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       await createTicket(values);
//       await reloadTickets();
//       message.success("🎉 Tạo phiếu thành công!");
//       onClose();
//       form.resetFields();
//     } catch (error) {
//       message.error("❌ Lỗi khi tạo phiếu!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const userData = JSON.parse(localStorage.getItem("user")) || {};
//   const account = userData?.account || {};

//   return (
//     <Modal
//       title={
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           style={{ display: "flex", alignItems: "center", gap: 10 }}
//         >
//           <FileTextOutlined style={{ fontSize: 22, color: "#1677ff" }} />
//           <span>Tạo Phiếu Thiết Bị</span>
//         </motion.div>
//       }
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       width={750}
//       getContainer={document.body}
//     >
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         <div style={{ textAlign: "center", marginBottom: 15 }}>
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/4102/4102584.png"
//             alt="Ticket Illustration"
//             width={80}
//             style={{ opacity: 0.9 }}
//           />
//         </div>

//         <Form form={form} layout="vertical">
//           <Descriptions
//             bordered
//             column={1}
//             size="small"
//             labelStyle={{ width: 150 }}
//             contentStyle={{ width: 400 }}
//           >
//             <Descriptions.Item label="📝 Số Phiếu">
//               <Form.Item name="Votes" noStyle rules={[{ required: true }]}>
//                 <Input readOnly style={{ width: 200 }} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="📝 Ticket Dingtalk">
//               <Form.Item name="Ticket" noStyle rules={[{ required: true }]}>
//                 <Input placeholder="Nhập ticket" style={{ width: 200 }} />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label={<><ShopOutlined /> Khách Hàng</>}>
//               <Form.Item name="Customer" noStyle rules={[{ required: true }]}>
//                 <Select
//                   placeholder="Chọn khách hàng"
//                   showSearch
//                   optionFilterProp="children"
//                   onChange={(value) => {
//                     setSelectedCustomer(value);
//                     form.setFieldsValue({ Store: undefined, Address: undefined });
//                   }}
//                   style={{ width: 200 }}
//                   dropdownStyle={{
//                     minWidth: getDropdownWidth(customerOptions),
//                   }}
//                 >
//                   {customerOptions.map((opt) => (
//                     <Option key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="🏬 Cửa Hàng">
//               <Form.Item
//                 name="Store"
//                 noStyle
//                 rules={[
//                   { required: true, message: "Vui lòng chọn hoặc nhập cửa hàng!" },
//                 ]}
//               >
//                 {filteredStores.length > 0 ? (
//                   <Select
//                     placeholder="Chọn cửa hàng"
//                     showSearch
//                     optionFilterProp="children"
//                     onChange={handleStoreChange}
//                    style={{ width: 200 }}
//                     filterOption={(input, option) =>
//                       option?.value.toLowerCase().includes(input.toLowerCase())
//                     }
//                     dropdownStyle={{
//                       minWidth: getDropdownWidth(
//                         filteredStores.map((s) => ({ label: s.attributes.StoreID }))
//                       ),
//                     }}
//                   >
//                     {filteredStores.map((store) => (
//                       <Option key={store.id} value={store.attributes.StoreID}>
//                         {store.attributes.StoreID}
//                       </Option>
//                     ))}
//                   </Select>
//                 ) : (
//                   <Input placeholder="Nhập cửa hàng"/>
//                 )}
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="🛣️ Địa Chỉ">
//               <Form.Item name="Address" noStyle>
//                 <Input placeholder="Nhập địa chỉ" />
//               </Form.Item>
//             </Descriptions.Item>
//           </Descriptions>

//           {/* Người tạo + Trạng thái */}
//           <Descriptions bordered column={2} size="small" style={{ marginTop: 12 }}>
//             <Descriptions.Item label="👤 Người Tạo">
//               <Form.Item name="Person" initialValue={account.Name} noStyle>
//                 <Input readOnly />
//               </Form.Item>
//             </Descriptions.Item>

//             <Descriptions.Item label="📌 Trạng Thái">
//               <Form.Item name="Status" initialValue="Đang tạo phiếu" noStyle>
//                 <Input readOnly />
//               </Form.Item>
//             </Descriptions.Item>
//           </Descriptions>

//           <Space
//             style={{
//               width: "100%",
//               display: "flex",
//               justifyContent: "flex-end",
//               marginTop: 10,
//             }}
//           >
//             <Button icon={<CloseOutlined />} onClick={onClose}>
//               Hủy
//             </Button>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={handleCreate}
//               loading={loading}
//             >
//               {loading ? "Đang tạo..." : "Tạo Phiếu"}
//             </Button>
//           </Space>
//         </Form>
//       </motion.div>
//     </Modal>
//   );
// };

// export default CreateTicketModal;


import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message, Descriptions, Space } from "antd";
import { FileTextOutlined, ShopOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { createTicket } from "../../../../services/storeServices";
import { fetchListCustomer } from "../../../../services/strapiServices";

const { Option } = Select;

// Hàm tạo số phiếu
function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const unique = Math.floor(Math.random() * 1000000);
  return `QLTB${year}${unique}`;
}

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
  return maxWidth + 40;
};

const CreateTicketModal = ({ open, onClose, reloadTickets }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filteredStores, setFilteredStores] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  // Gán số phiếu khi modal mở
  useEffect(() => {
    if (open) {
      form.setFieldsValue({ Votes: generateInvoiceNumber() });
    }
  }, [open]);

  // Lấy danh sách khách hàng
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchListCustomer();
        // Strapi v5 trả về mảng trực tiếp hoặc trong data
        const data = Array.isArray(res) ? res : (res.data || []);
        setCustomerList(data);

        // Lấy danh sách Customer duy nhất (Sửa: bỏ .attributes)
        const uniqueCustomers = Array.from(
          new Set(data.map((item) => item.Customer))
        ).map((customer) => ({
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

  // Lọc store theo customer
  useEffect(() => {
    if (!selectedCustomer || selectedCustomer === "Khác") {
      setFilteredStores([]);
      form.setFieldsValue({ Store: undefined, Address: undefined });
      return;
    }
    // Sửa: bỏ .attributes
    const result = customerList.filter(
      (item) =>
        item.Customer === selectedCustomer && item.Status // Giả sử Status true là active
    );
    setFilteredStores(result);
  }, [selectedCustomer, customerList, form]);

  // Khi chọn store
  const handleStoreChange = (value) => {
    form.setFieldsValue({ Store: value });
    // Sửa: bỏ .attributes
    const selectedStore = filteredStores.find(
      (store) => store.StoreID === value
    );
    if (selectedStore) {
      form.setFieldsValue({ Address: selectedStore.Address }); // Sửa: bỏ .attributes
    } else {
      form.setFieldsValue({ Address: undefined });
    }
  };

  // Tạo phiếu
  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await createTicket(values);
      await reloadTickets();
      message.success("🎉 Tạo phiếu thành công!");
      onClose();
      form.resetFields();
    } catch (error) {
      console.error(error);
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
          <span>Tạo Phiếu Thiết Bị</span>
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
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ width: 150 }}
            contentStyle={{ width: 400 }}
          >
            <Descriptions.Item label="📝 Số Phiếu">
              <Form.Item name="Votes" noStyle rules={[{ required: true }]}>
                <Input readOnly style={{ width: 200 }} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="📝 Ticket Dingtalk">
              <Form.Item name="Ticket" noStyle rules={[{ required: true }]}>
                <Input placeholder="Nhập ticket" style={{ width: 200 }} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label={<><ShopOutlined /> Khách Hàng</>}>
              <Form.Item name="Customer" noStyle rules={[{ required: true }]}>
                <Select
                  placeholder="Chọn khách hàng"
                  showSearch
                  optionFilterProp="children"
                  onChange={(value) => {
                    setSelectedCustomer(value);
                    form.setFieldsValue({ Store: undefined, Address: undefined });
                  }}
                  style={{ width: 200 }}
                  dropdownStyle={{
                    minWidth: getDropdownWidth(customerOptions),
                  }}
                >
                  {customerOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="🏬 Cửa Hàng">
              <Form.Item
                name="Store"
                noStyle
                rules={[
                  { required: true, message: "Vui lòng chọn hoặc nhập cửa hàng!" },
                ]}
              >
                {filteredStores.length > 0 ? (
                  <Select
                    placeholder="Chọn cửa hàng"
                    showSearch
                    optionFilterProp="children"
                    onChange={handleStoreChange}
                    style={{ width: 200 }}
                    filterOption={(input, option) =>
                      option?.value.toLowerCase().includes(input.toLowerCase())
                    }
                    dropdownStyle={{
                      minWidth: getDropdownWidth(
                        // Sửa: bỏ .attributes
                        filteredStores.map((s) => ({ label: s.StoreID }))
                      ),
                    }}
                  >
                    {filteredStores.map((store) => (
                      // Sửa: bỏ .attributes
                      <Option key={store.id} value={store.StoreID}>
                        {store.StoreID}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input placeholder="Nhập cửa hàng" />
                )}
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="🛣️ Địa Chỉ">
              <Form.Item name="Address" noStyle>
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>

          {/* Người tạo + Trạng thái */}
          <Descriptions bordered column={2} size="small" style={{ marginTop: 12 }}>
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

          <Space
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <Button icon={<CloseOutlined />} onClick={onClose}>
              Hủy
            </Button>
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

export default CreateTicketModal;
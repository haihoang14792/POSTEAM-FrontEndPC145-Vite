// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, message, Select, InputNumber, Row, Col } from 'antd';
// import { PlusCircleOutlined } from '@ant-design/icons';
// import { createExportlists, fetchWarehouseDetails, updateWarehouseDetails, updateExportlists, fetchImportlists } from '../../../services/dhgServices';
// import './AddExportList.scss';

// const { Option } = Select;

// const generateInvoiceNumber = () => {
//     const year = new Date().getFullYear();
//     const unique = Math.floor(Math.random() * 1000000);
//     return `SPDHG${year}${unique}`;
// };

// const AddExportList = ({ isModalOpen, onCancel, onCreated = () => { } }) => {
//     const [form] = Form.useForm();
//     const [products, setProducts] = useState([]);
//     const [models, setModels] = useState([]);
//     const [brandnames, setBrandnames] = useState([]);
//     const [maxQuantity, setMaxQuantity] = useState(0);
//     const [warning, setWarning] = useState("");
//     const [userName, setUserName] = useState("");
//     const [serialList, setSerialList] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetchWarehouseDetails();
//                 setProducts(response.data);
//             } catch (error) {
//                 message.error("Lỗi khi tải danh sách sản phẩm");
//             }
//         };
//         fetchData();

//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             try {
//                 const parsedUser = JSON.parse(storedUser);
//                 setUserName(parsedUser?.account?.Name || "");
//             } catch (error) {
//                 console.error('Error parsing user from localStorage:', error);
//             }
//         }
//     }, []);

//     useEffect(() => {
//         if (isModalOpen) {
//             form.resetFields(); // reset toàn bộ form nếu muốn
//             form.setFieldsValue({ Ticket: generateInvoiceNumber(), NameCreate: userName });
//             setMaxQuantity(0);
//             setWarning("");
//         }
//     }, [isModalOpen]);

//     const handleProductChange = (productName) => {
//         const productModels = products.filter(p => p.attributes.ProductName === productName);
//         setModels(productModels);
//         setBrandnames([]); // Reset danh sách thương hiệu khi đổi sản phẩm
//         form.setFieldsValue({ Model: undefined, DVT: undefined, totalexport: undefined, BrandName: undefined, Type: undefined });
//         setWarning("");
//     };

//     // Trong handleModelChange:
//     const handleModelChange = (model) => {
//         const selected = models.find(m => m.attributes.Model === model);

//         if (selected) {
//             form.setFieldsValue({
//                 DVT: selected.attributes.DVT,
//                 Type: selected.attributes.Type,
//                 BrandName: undefined,
//                 totalexport: undefined,
//                 SerialNumber: "",
//                 idModel: selected.id // ✅ lưu lại ID của model trong kho
//             });

//             setMaxQuantity(selected.attributes.DHG);
//             setWarning(selected.attributes.DHG === 0 ? "Sản phẩm này không có trong kho!" : "");

//             const relatedBrands = products
//                 .filter(p => p.attributes.Model === model)
//                 .map(p => ({ id: p.id, attributes: { BrandName: p.attributes.BrandName } }));

//             setBrandnames(relatedBrands);
//             if (relatedBrands.length) {
//                 form.setFieldsValue({ BrandName: relatedBrands[0].attributes.BrandName });
//             }
//         }
//     };
//     const handleOk = async () => {
//         try {
//             await form.validateFields();

//             const values = {
//                 ...form.getFieldsValue(),
//                 NameCreate: userName,
//                 Ticket: form.getFieldValue('Ticket') || generateInvoiceNumber(),
//                 Status: 'Đang mượn',
//             };

//             if (!values.SerialNumber || values.SerialNumber.length === 0) {
//                 message.error("Vui lòng nhập số serial!");
//                 return;
//             }

//             if (values.totalexport > maxQuantity) {
//                 message.error(`Số lượng vượt quá tồn kho hiện tại (${maxQuantity})`);
//                 return;
//             }

//             // 1. Gửi yêu cầu tạo phiếu xuất
//             const response = await createExportlists(values);
//             const exportItem = response.data;

//             // 2. Cập nhật kho
//             const warehouseList = await fetchWarehouseDetails();
//             const matched = warehouseList.data.find(
//                 w => w.attributes.Model === values.Model
//             );

//             if (matched) {
//                 const { DHG = 0, POS = 0, POSHN = 0 } = matched.attributes;
//                 const soLuong = values.totalexport;

//                 const updatePayload = {
//                     DHG: DHG - soLuong,
//                     POS: values.TypeKho === "POS" ? POS + soLuong : POS,
//                     POSHN: values.TypeKho === "POSHN" ? POSHN + soLuong : POSHN,
//                 };

//                 await updateWarehouseDetails(matched.id, updatePayload);
//             } else {
//                 message.warning("Không tìm thấy Model tương ứng trong kho.");
//             }

//             // 3. Đánh dấu phiếu đã xử lý
//             await updateExportlists(exportItem.id, { Check: true });

//             message.success("Xuất thiết bị và cập nhật kho thành công!");
//             form.resetFields();
//             onCreated(exportItem);
//         } catch (error) {
//             console.error("Lỗi khi điều hàng:", error);
//             message.error("Có lỗi xảy ra khi điều hàng.");
//         }
//     };

//     const handleModalCancel = () => {
//         form.resetFields();
//         setModels([]);
//         setBrandnames([]);
//         setWarning("");
//         onCancel();
//     };

//     return (
//         <Modal
//   title={
//     <div className="modal-header">
//       <PlusCircleOutlined className="icon" />
//       <span className="title">Điều hàng kho DHG</span>
//     </div>
//   }
//   open={isModalOpen}
//   onOk={handleOk}
//   onCancel={handleModalCancel}
//   okText="Lưu"
//   cancelText="Hủy"
//   width={800} // rộng hơn để bố trí 2-3 cột
//   className="add-exportlist-modal"
// >
//   <Form form={form} layout="vertical">
//     {/* Nhóm 1: Sản phẩm */}
//     <Row gutter={16}>
//       <Col span={12}>
//         <Form.Item label="Tên sản phẩm" name="ProductName" rules={[{ required: true, message: 'Chọn sản phẩm!' }]}>
//           <Select onChange={handleProductChange}>
//             {[...new Set(products.map(p => p.attributes.ProductName))].map((name, index) => (
//               <Option key={index} value={name}>{name}</Option>
//             ))}
//           </Select>
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item label="Model" name="Model" rules={[{ required: true, message: 'Chọn model!' }]}>
//           <Select onChange={handleModelChange} disabled={!models.length}>
//             {models.map(m => (
//               <Option key={m.id} value={m.attributes.Model}>{m.attributes.Model}</Option>
//             ))}
//           </Select>
//         </Form.Item>
//       </Col>
//     </Row>

//     <Row gutter={16}>
//       <Col span={12}>
//         <Form.Item label="Thương hiệu" name="BrandName" rules={[{ required: true, message: 'Chọn thương hiệu!' }]}>
//           <Select disabled={!brandnames.length}>
//             {brandnames.map(m => (
//               <Option key={m.id} value={m.attributes.BrandName}>{m.attributes.BrandName}</Option>
//             ))}
//           </Select>
//         </Form.Item>
//       </Col>
//       <Col span={6}>
//         <Form.Item label="ĐVT" name="DVT">
//           <Input disabled />
//         </Form.Item>
//       </Col>
//       <Col span={6}>
//         <Form.Item label="Loại" name="Type">
//           <Input disabled />
//         </Form.Item>
//       </Col>
//     </Row>

//     {/* Nhóm 2: Số lượng & Serial */}
//     <Row gutter={16}>
// <Col span={8}>
//   <Form.Item label="Số lượng" name="totalexport" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
//     <InputNumber
//       min={1}
//       max={maxQuantity}
//       placeholder={`Tối đa: ${maxQuantity}`}
//       style={{ width: '100%' }}
//     />
//   </Form.Item>
//   <div className={`stock-info ${maxQuantity === 0 ? 'red' : 'green'}`}>
//     Tồn kho: {maxQuantity}
//   </div>
//   {warning && (
//     <div className="stock-info red">{warning}</div>
//   )}
// </Col>
//       <Col span={16}>
//         <Form.Item
//   label="SerialNumber"
//   name="serial"
//   rules={[{ required: true, message: 'Nhập serial!' }]}
// >
//   <Input.TextArea
//     rows={3} // chiều cao mặc định
//     style={{
//       resize: 'none', // không cho kéo giãn
//       overflowY: 'auto', // bật thanh cuộn dọc khi vượt quá chiều cao
//       whiteSpace: 'pre-wrap', // tự xuống dòng khi dài
//       wordBreak: 'break-word', // cắt chữ nếu quá dài
//     }}
//     placeholder="Nhập serial..."
//   />
// </Form.Item>
//       </Col>
//     </Row>

//     {/* Nhóm 3: Kho & Phiếu */}
//     <Row gutter={16}>
//       <Col span={8}>
//         <Form.Item label="Kho" name="TypeKho" rules={[{ required: true, message: 'Chọn kho!' }]}>
//           <Select>
//             <Option value="POS">POS</Option>
//             <Option value="POSHN">POSHN</Option>
//           </Select>
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item label="Số phiếu" name="Ticket" initialValue={generateInvoiceNumber()}>
//           <Input disabled />
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item label="Trạng thái" name="Status" initialValue="Đang mượn">
//           <Input disabled />
//         </Form.Item>
//       </Col>
//     </Row>

//     {/* Nhóm 4: Người mượn & Người tạo */}
//     <Row gutter={16}>
//       <Col span={12}>
//         <Form.Item label="Tên người mượn" name="NameExport" rules={[{ required: true, message: 'Chọn tên!' }]}>
//           <Select>
//             <Option value="Đinh Huy Hùng">Đinh Huy Hùng</Option>
//             <Option value="Nguyễn Văn Luân">Nguyễn Văn Luân</Option>
//             <Option value="Tô Hoàng Nam">Tô Hoàng Nam</Option>
//             <Option value="Hoàng Văn Tùng">Hoàng Văn Tùng</Option>
//           </Select>
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item label="Tên người tạo" name="NameCreate" initialValue={userName}>
//           <Input disabled />
//         </Form.Item>
//       </Col>
//     </Row>
//   </Form>
// </Modal>

//     );
// };

// export default AddExportList;

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
import {
  createExportlists,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  updateExportlists,
} from "../../../services/dhgServices";
import { fetchUsers } from "../../../services/abicoServices";
import "./AddExportList.scss";

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
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [warning, setWarning] = useState("");
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
      setMaxQuantity(0);
      setWarning("");
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
    setWarning("");
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

      setMaxQuantity(selected.attributes.DHG);
      setWarning(
        selected.attributes.DHG === 0 ? "Sản phẩm này không có trong kho!" : ""
      );

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

      if (values.totalexport > maxQuantity) {
        message.error(`Số lượng vượt quá tồn kho hiện tại (${maxQuantity})`);
        return;
      }

      const response = await createExportlists(values);
      const exportItem = response.data;

      const warehouseList = await fetchWarehouseDetails();
      const matched = warehouseList.data.find(
        (w) => w.attributes.Model === values.Model
      );

      if (matched) {
        const { DHG = 0, POS = 0, POSHN = 0 } = matched.attributes;
        const soLuong = values.totalexport;

        const updatePayload = {
          DHG: DHG - soLuong,
          POS: values.TypeKho === "POS" ? POS + soLuong : POS,
          POSHN: values.TypeKho === "POSHN" ? POSHN + soLuong : POSHN,
        };

        await updateWarehouseDetails(matched.id, updatePayload);
      } else {
        message.warning("Không tìm thấy Model tương ứng trong kho.");
      }

      await updateExportlists(exportItem.id, { Check: true });

      message.success("Xuất thiết bị và cập nhật kho thành công!");
      form.resetFields();
      onCreated(exportItem);
    } catch (error) {
      console.error("Lỗi khi điều hàng:", error);
      message.error("Có lỗi xảy ra khi điều hàng.");
    }
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <PlusCircleOutlined className="icon" />
          <span className="title">Điều hàng kho DHG</span>
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

          {/* <Descriptions.Item label="Thương hiệu">
            <Form.Item name="BrandName" rules={[{ required: true, message: 'Chọn thương hiệu!' }]} noStyle>
              <Select readOnly={!brandnames.length}>
                {brandnames.map(m => (
                  <Option key={m.id} value={m.attributes.BrandName}>{m.attributes.BrandName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Descriptions.Item> */}

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
                style={{ width: 120 }}
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

          <Descriptions.Item label="Số lượng mượn">
            <Form.Item
              name="totalexport"
              rules={[{ required: true, message: "Nhập số lượng!" }]}
              noStyle
            >
              <InputNumber
                min={1}
                max={maxQuantity}
                style={{ width: "100%" }}
                placeholder={`Tối đa: ${maxQuantity}`}
              />
            </Form.Item>
            <div style={{ color: maxQuantity === 0 ? "red" : "green" }}>
              Tồn kho: {maxQuantity}
            </div>
            {warning && <div style={{ color: "red" }}>{warning}</div>}
          </Descriptions.Item>

          <Descriptions.Item label="Serial mượn" span={2}>
            <Form.Item
              name="SerialNumber"
              rules={[{ required: true, message: "Nhập serial!" }]}
              noStyle
            >
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="Người mượn hàng">
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

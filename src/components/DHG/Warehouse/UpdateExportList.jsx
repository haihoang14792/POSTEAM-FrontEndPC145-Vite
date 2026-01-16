import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Descriptions,
  Select,
  Tag,
  Button,
} from "antd";
import {
  updateExportlistsData,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  fetchExportlists,
} from "../../../services/dhgServices";
import "./UpdateExportList.scss";

const { Option } = Select;

const UpdateExportList = ({
  isModalOpen,
  onCancel,
  updatedData,
  onUpdated = () => {},
}) => {
  const [form] = Form.useForm();
  // const record = updatedData?.attributes || {};
  const record = useMemo(() => updatedData?.attributes || {}, [updatedData]);

  const [returnModalOpen, setReturnModalOpen] = useState(false);

  // const serialBorrowedList = (record.SerialNumber || '').split('\n').filter(s => s.trim() !== '');
  const serialBorrowedList = (record.SerialNumber || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  const [selectedReturnSerials, setSelectedReturnSerials] = useState([]);

  const [typeDeviceModalOpen, setTypeDeviceModalOpen] = useState(false);
  const [selectedTypeDevice, setSelectedTypeDevice] = useState(null);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        Ticket: record.Ticket || "",
        TypeKho: record.TypeKho || "",
        totalexport: record.totalexport || 0,
        totalexportLoan: record.totalexportLoan || 0,
        SerialNumber: record.SerialNumber || "",
        SerialNumberLoan: record.SerialNumberLoan || "",
      });
    }
  }, [record, form]);

  useEffect(() => {
    if (record) {
      const oldSerials = (record.SerialNumberDHG || "")
        .split("\n")
        .filter((s) => s.trim() !== "");
      setSelectedReturnSerials(oldSerials);
    }
  }, [record]);

  const openReturnModal = () => {
    setSelectedReturnSerials([]); // reset chọn serial khi mở modal
    setReturnModalOpen(true);
  };

  // const handleReturnOk = () => {
  //   form.setFieldsValue({
  //     totalexportDHG: selectedReturnSerials.length,
  //     SerialNumberDHG: selectedReturnSerials.join('\n'),
  //   });
  //   setReturnModalOpen(false);
  // };

  const handleReturnCancel = () => {
    setReturnModalOpen(false);
  };

  // Hàm xử lý chọn / bỏ chọn serial
  const onSelectReturnSerial = (serial, checked) => {
    if (checked) {
      setSelectedReturnSerials((prev) => [...prev, serial]);
    } else {
      setSelectedReturnSerials((prev) => prev.filter((s) => s !== serial));
    }
  };

  //Hàm xử lý điều chuyển kho
  const handleTransferStock = async (fromKho, toKho) => {
    try {
      const warehouseList = await fetchWarehouseDetails();
      const matched = warehouseList.data.find(
        (w) =>
          w.attributes.Model === record.Model &&
          w.attributes.BrandName === record.BrandName
      );

      if (!matched) {
        message.error("Không tìm thấy sản phẩm trong kho!");
        return;
      }

      const attrs = matched.attributes;
      const soLuong = record.totalexport;
      const model = record.Model;

      if (soLuong <= 0) {
        message.warning("Không có số lượng để điều chuyển!");
        return;
      }

      if ((attrs[fromKho] || 0) < soLuong) {
        message.error(`Kho ${fromKho} không đủ hàng để điều chuyển!`);
        return;
      }

      // Cập nhật tồn kho
      await updateWarehouseDetails(matched.id, {
        [fromKho]: (attrs[fromKho] || 0) - soLuong,
        [toKho]: (attrs[toKho] || 0) + soLuong,
      });

      // Cập nhật phiếu sang kho mới
      await updateExportlistsData(updatedData.id, { TypeKho: toKho });

      // Lấy lại toàn bộ danh sách và truyền cho onUpdated
      const refreshedList = await fetchExportlists();
      onUpdated(refreshedList.data);

      message.success(
        `Đã điều chuyển ${model} : ${soLuong} từ ${fromKho} sang ${toKho}!`
      );
      // onUpdated();
      onCancel();
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra khi điều chuyển!");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!updatedData?.id) {
        message.error("Không tìm thấy ID để cập nhật!");
        return;
      }
      const res = await updateExportlistsData(updatedData.id, values);
      message.success("Cập nhật thành công!");
      onUpdated(res);
      onCancel();
    } catch (err) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      title="Cập nhật phiếu mượn kho"
      open={isModalOpen}
      onCancel={onCancel}
      width={800}
      className="update-exportlist-modal"
      footer={[
        record.totalexport > 0 && record.TypeKho === "POS" && (
          <Button
            key="posToPoshn"
            type="primary"
            onClick={() => handleTransferStock("POS", "POSHN")}
          >
            POS → POSHN
          </Button>
        ),
        record.totalexport > 0 && record.TypeKho === "POSHN" && (
          <Button
            key="poshnToPos"
            type="primary"
            onClick={() => handleTransferStock("POSHN", "POS")}
          >
            POSHN → POS
          </Button>
        ),
        record.totalexport > 0 && !record.TypeDevice && (
          <Button
            key="confirmTypeDevice"
            type="primary"
            onClick={() => setTypeDeviceModalOpen(true)}
          >
            Xác nhận
          </Button>
        ),
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Tên sản phẩm">
            {record.ProductName}
          </Descriptions.Item>
          <Descriptions.Item label="Model">{record.Model}</Descriptions.Item>

          <Descriptions.Item label="Thương hiệu">
            {record.BrandName}
          </Descriptions.Item>
          <Descriptions.Item label="ĐVT">{record.DVT}</Descriptions.Item>

          <Descriptions.Item label="Kho">{record.TypeKho}</Descriptions.Item>

          <Descriptions.Item label="Số phiếu">
            {record.Ticket}
          </Descriptions.Item>

          <Descriptions.Item label="Ticket">
            {record.TicketDHG ? (
              // Nếu có dữ liệu thì hiển thị text
              <span>{record.TicketDHG}</span>
            ) : (
              // Nếu chưa có dữ liệu thì cho nhập form
              <Form.Item
                name="TicketDHG"
                noStyle
                rules={[
                  { required: true, message: "Vui lòng nhập số Ticket!" },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 1 }} />
              </Form.Item>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng mượn">
            {record.totalexport}
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng xuất">
            {record.totalexportLoan}
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng trả DHG" span={2}>
            {record.totalexportDHG}
          </Descriptions.Item>

          <Descriptions.Item label="Serial mượn" span={2}>
            <Form.Item name="SerialNumber" noStyle>
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item label="Serial xuất" span={2}>
            {record.SerialNumberLoan}
          </Descriptions.Item>
          <Descriptions.Item label="Serial trả DHG" span={2}>
            {record.SerialNumberDHG}
          </Descriptions.Item>
          <Descriptions.Item label="Người mượn hàng">
            {record.NameExport}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày mượn hàng">
            {record.createdAt
              ? new Date(record.createdAt).toLocaleDateString("vi-VN")
              : ""}
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú" span={2}>
            <Form.Item name="Note" noStyle>
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo phiếu">
            {record.NameCreate}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag
              color={record.Status === "Hoàn thành phiếu" ? "green" : "orange"}
            >
              {record.Status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thông tin">
            {record.TypeDevice}
          </Descriptions.Item>
        </Descriptions>
      </Form>
      <Modal
        title="Xác nhận loại xuất kho"
        open={typeDeviceModalOpen}
        onCancel={() => setTypeDeviceModalOpen(false)}
        onOk={async () => {
          if (!selectedTypeDevice) {
            message.warning("Vui lòng chọn loại xuất kho!");
            return;
          }
          try {
            await updateExportlistsData(updatedData.id, {
              TypeDevice: selectedTypeDevice,
            });

            // 🔥 Đóng modal
            setTypeDeviceModalOpen(false);

            message.success("Cập nhật loại xuất kho thành công!");

            //  ⏳ Chờ một chút rồi refresh trang
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } catch (err) {
            console.error("Lỗi khi cập nhật TypeDevice:", err);
            message.error("Có lỗi xảy ra khi cập nhật TypeDevice!");
          }
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn loại xuất kho"
          onChange={(val) => setSelectedTypeDevice(val)}
        >
          <Option value="QLTB">QLTB</Option>
          <Option value="TB">TB</Option>
          <Option value="POS">POS</Option>
        </Select>
      </Modal>
    </Modal>
  );
};

export default UpdateExportList;

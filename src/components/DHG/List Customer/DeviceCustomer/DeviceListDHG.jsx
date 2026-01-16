import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Descriptions,
  Row,
  Col,
  message,
  Form,
  Tag,
  Upload,
} from "antd";
import {
  SearchOutlined,
  UploadOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  fetchDeviceAll,
  createDeviceAll,
  updateDeviceBySTT,
} from "../../../../services/storeServices";
import "./DeviceList.scss";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [detailModal, setDetailModal] = useState({
    visible: false,
    record: null,
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const res = await fetchDeviceAll();
      setDevices(res);
      setFilteredList(res);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách thiết bị");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    let results = [...devices];
    if (values.filterField && values.searchTerm) {
      results = results.filter((item) => {
        const fieldValue = item.attributes[values.filterField] || "";
        return fieldValue
          .toString()
          .toLowerCase()
          .includes(values.searchTerm.toLowerCase());
      });
    }
    setFilteredList(results);
    setPagination({ ...pagination, current: 1 });
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredList(devices);
  };

  // Import devices from file, dùng confirm tương tự code cũ
  const handleImport = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      if (jsonData.length === 0) {
        message.warning("Tệp không có dữ liệu!");
        return;
      }
      Modal.confirm({
        title: `Xác nhận nhập ${jsonData.length} thiết bị?`,
        onOk: async () => {
          try {
            await Promise.all(
              jsonData.map((device) => createDeviceAll(device))
            );
            message.success("Import thành công!");
            loadDevices();
          } catch {
            message.error("Lỗi khi import thiết bị!");
          }
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // Update devices từ file
  const handleUpdate = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      if (jsonData.length === 0) {
        message.warning("Tệp không có dữ liệu!");
        return;
      }
      Modal.confirm({
        title: `Xác nhận cập nhật ${jsonData.length} thiết bị?`,
        onOk: async () => {
          try {
            const deviceList = await fetchDeviceAll();
            await Promise.all(
              jsonData.map((device) =>
                updateDeviceBySTT(device.STT, device, deviceList)
              )
            );
            message.success("Cập nhật thành công!");
            loadDevices();
          } catch {
            message.error("Lỗi khi cập nhật thiết bị!");
          }
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredList.map((device) => ({
        STT: device.id,
        Customer: device.attributes.Customer,
        DeliveryDate: device.attributes.DeliveryDate,
        DeviceName: device.attributes.DeviceName,
        BrandName: device.attributes.BrandName,
        Model: device.attributes.Model,
        SerialNumber: device.attributes.SerialNumber,
        Store: device.attributes.Store,
        Location: device.attributes.Location,
        Status: device.attributes.Status,
        Note: device.attributes.Note || "",
        CreatedAt: device.attributes.createdAt,
        UpdatedAt: device.attributes.updatedAt,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Devices");
    XLSX.writeFile(wb, "Device_List.xlsx");
  };

  // Thống kê theo Status
  const statusCounts = Object.values(
    filteredList.reduce((acc, item) => {
      const status = item.attributes.Status || "Chưa xác định";
      if (!acc[status]) {
        acc[status] = { label: status, count: 0 };
      }
      acc[status].count += 1;
      return acc;
    }, {})
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 70,
    },
    {
      title: "Ngày giao",
      dataIndex: ["attributes", "DeliveryDate"],
      key: "DeliveryDate",
      render: formatDate,
    },
    {
      title: "Tên thiết bị",
      dataIndex: ["attributes", "DeviceName"],
      key: "DeviceName",
    },
    { title: "Model", dataIndex: ["attributes", "Model"], key: "Model" },
    {
      title: "Serial Number",
      dataIndex: ["attributes", "SerialNumber"],
      key: "SerialNumber",
    },
    {
      title: "Khách hàng",
      dataIndex: ["attributes", "Customer"],
      key: "Customer",
    },
    { title: "Cửa hàng", dataIndex: ["attributes", "Store"], key: "Store" },
    { title: "Vị trí", dataIndex: ["attributes", "Location"], key: "Location" },
    {
      title: "Trạng thái",
      dataIndex: ["attributes", "Status"],
      key: "Status",
      align: "center",
      render: (status) => {
        let color =
          status === "Không sử dụng"
            ? "yellow"
            : status === "Không có thiết bị"
            ? "red"
            : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Chi tiết",
      key: "detail",
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => setDetailModal({ visible: true, record })}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};
  return (
    <div className="device-list-container">
      {/* <h1>Danh sách Thiết bị</h1> */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20, flexWrap: "wrap" }}
      >
        <Form.Item name="filterField">
          <Select
            placeholder="Chọn trường lọc"
            style={{ width: 180 }}
            allowClear
          >
            <Select.Option value="SerialNumber">Serial Number</Select.Option>
            <Select.Option value="DeviceName">Tên thiết bị</Select.Option>
            <Select.Option value="Customer">Khách hàng</Select.Option>
            <Select.Option value="BrandName">Thương hiệu</Select.Option>
            <Select.Option value="Model">Model</Select.Option>
            <Select.Option value="Store">Cửa hàng</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="searchTerm">
          <Input placeholder="Tìm kiếm..." style={{ width: 200 }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            style={{ marginRight: 8 }}
          >
            Tìm kiếm
          </Button>
        </Form.Item>

        <Form.Item>
          <Button icon={<ReloadOutlined />} onClick={resetFilters}>
            Làm mới
          </Button>
        </Form.Item>

        {account.Devicelist === true && (
          <>
            <Form.Item>
              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                onChange={({ file }) => handleImport(file)}
              >
                <Button icon={<UploadOutlined />}>Import</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                onChange={({ file }) => handleUpdate(file)}
              >
                <Button>Update</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="dashed"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Export Excel
              </Button>
            </Form.Item>
          </>
        )}
      </Form>{" "}
      {/* ĐÓNG FORM Ở ĐÂY */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        {statusCounts.map(({ label, count }) => (
          <Col key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 500 }}>{label}:</span>
              <span style={{ fontWeight: "bold" }}>{count}</span>
            </div>
          </Col>
        ))}
      </Row>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={filteredList}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
        }}
        // onRow={(record) => ({
        //   onClick: () => setDetailModal({ visible: true, record }),
        // })}
      />
      <Modal
        title="Chi tiết thiết bị"
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={null}
        width={700}
      >
        {detailModal.record && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Tên thiết bị">
              {detailModal.record.attributes.DeviceName}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              {detailModal.record.attributes.Model}
            </Descriptions.Item>
            <Descriptions.Item label="Serial Number">
              {detailModal.record.attributes.SerialNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {detailModal.record.attributes.Customer}
            </Descriptions.Item>
            <Descriptions.Item label="Cửa hàng">
              {detailModal.record.attributes.Store}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  detailModal.record.attributes.Status === "Không sử dụng"
                    ? "yellow"
                    : detailModal.record.attributes.Status ===
                      "Không có thiết bị"
                    ? "red"
                    : "green"
                }
              >
                {detailModal.record.attributes.Status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>
              {detailModal.record.attributes.Note || ""}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DeviceList;

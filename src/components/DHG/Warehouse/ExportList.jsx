import React, { useEffect, useState } from "react";
import {
  fetchExportlists,
  updateExportlistsData,
  fetchWarehouseDetails,
  updateWarehouseDetails,
} from "../../../services/dhgServices";
import * as XLSX from "xlsx";
import {
  Table,
  Tag,
  Button,
  Input,
  Modal,
  Descriptions,
  message,
  Form,
  Select,
  Row,
  Col,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  SafetyCertificateOutlined,
  ContainerOutlined,
  BookOutlined,
} from "@ant-design/icons";
import AddExportList from "./AddExportList";
import AddExportListW from "./AddExportListW";
import UpdateExportList from "./UpdateExportList";
import "./ExportList.scss";

const ExportList = () => {
  const [exportlist, setExportList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const [detailModal, setDetailModal] = useState({
    visible: false,
    record: null,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddModalOpenW, setIsAddModalOpenW] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);

  // Load danh sách xuất kho
  useEffect(() => {
    const loadExportList = async () => {
      try {
        const res = await fetchExportlists();
        const sortedData = res.data.sort(
          (a, b) =>
            new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
        );
        setExportList(sortedData);
        setFilteredList(sortedData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách xuất kho:", error);
        message.error("Không thể tải danh sách xuất kho");
      } finally {
        setLoading(false);
      }
    };
    loadExportList();
  }, []);

  // Tìm kiếm / lọc
  const handleSearch = (values) => {
    let results = [...exportlist];

    if (values.TypeKho) {
      results = results.filter(
        (t) => t?.attributes?.TypeKho === values.TypeKho
      );
    }
    // if (values.BrandName) {
    //   results = results.filter((t) => t?.attributes?.BrandName === values.BrandName);
    // }
    if (values.Status) {
      results = results.filter((t) => t?.attributes?.Status === values.Status);
    }
    if (values.NameExport) {
      results = results.filter(
        (t) => t?.attributes?.NameExport === values.NameExport
      );
    }
    if (values.searchText) {
      results = results.filter(
        (t) =>
          t?.attributes?.Model?.toLowerCase().includes(
            values.searchText.toLowerCase()
          ) ||
          t?.attributes?.ProductName?.toLowerCase().includes(
            values.searchText.toLowerCase()
          ) ||
          t?.attributes?.SerialNumber?.toLowerCase().includes(
            values.searchText.toLowerCase()
          ) ||
          t?.attributes?.SerialNumberLoan?.toLowerCase().includes(
            values.searchText.toLowerCase()
          ) ||
          t?.attributes?.SerialNumberDHG?.toLowerCase().includes(
            values.searchText.toLowerCase()
          )
      );
    }
    if (values.searchTextTicket) {
      results = results.filter(
        (t) =>
          t?.attributes?.Ticket?.toLowerCase().includes(
            values.searchTextTicket.toLowerCase()
          ) ||
          t?.attributes?.TicketDHG?.toLowerCase().includes(
            values.searchTextTicket.toLowerCase()
          )
      );
    }

    setFilteredList(results);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredList(exportlist);
  };

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredList.map((item) => ({
        "Tên sản phẩm": item.attributes.ProductName,
        Model: item.attributes.Model,
        ĐVT: item.attributes.DVT,
        "Số lượng": item.attributes.totalexport,
        Kho: item.attributes.TypeKho,
        Ticket: item.attributes.Ticket,
        "Serial mượn": item.attributes.SerialNumber,
        "Số lượng xuất": item.attributes.totalexportLoan,
        "Serial xuất": item.attributes.SerialNumberLoan,
        "Trạng thái": item.attributes.Status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExportList");
    XLSX.writeFile(wb, "ExportList.xlsx");
  };

  // Xác nhận hoàn thành phiếu
  const handleConfirmComplete = async (record) => {
    Modal.confirm({
      title: "Xác nhận hoàn thành phiếu",
      content: "Bạn có muốn xác nhận phiếu này đã hoàn thành không?",
      okText: "Xác nhận",
      cancelText: "Trở về",
      onOk: async () => {
        try {
          await updateExportlistsData(record.id, {
            Status: "Hoàn thành phiếu",
          });
          const updated = exportlist.map((item) =>
            item.id === record.id
              ? {
                  ...item,
                  attributes: {
                    ...item.attributes,
                    Status: "Hoàn thành phiếu",
                  },
                }
              : item
          );
          setExportList(updated);
          setFilteredList(updated);
          message.success("Cập nhật trạng thái thành công!");
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
      },
    });
  };

  // Xác nhận duyệt phiếu
  const handleConfirmApprove = async (record) => {
    Modal.confirm({
      title: "Xác nhận duyệt phiếu",
      content:
        "Bạn có muốn duyệt phiếu này và chuyển sang trạng thái 'Đang mượn' không?",
      okText: "Duyệt phiếu",
      cancelText: "Trở về",
      onOk: async () => {
        try {
          await updateExportlistsData(record.id, { Status: "Đang mượn" });
          const updated = exportlist.map((item) =>
            item.id === record.id
              ? {
                  ...item,
                  attributes: { ...item.attributes, Status: "Đang mượn" },
                }
              : item
          );
          setExportList(updated);
          setFilteredList(updated);

          // cập nhật lại record trong modal chi tiết
          setDetailModal({
            ...detailModal,
            record: {
              ...record,
              attributes: { ...record.attributes, Status: "Đang mượn" },
            },
          });

          message.success("Phiếu đã được duyệt thành công!");
        } catch (error) {
          console.error("Lỗi khi duyệt phiếu:", error);
          message.error("Có lỗi xảy ra khi duyệt phiếu!");
        }
      },
    });
  };

  // Trả kho DHG trực tiếp trong ExportList
  const handleReturnDHG = async (record) => {
    const Type = record.attributes.Type;
    const totalExport = record.attributes.totalexport || 0;

    if (totalExport === 0) {
      message.warning("Không có sản phẩm nào để trả!");
      return;
    }

    // --- Trường hợp Vật tư: nhập số lượng ---
    if (Type === "Vật tư") {
      let quantityToReturn = 0;

      Modal.confirm({
        title: "Trả kho Vật tư",
        content: (
          <Input
            type="number"
            min={1}
            max={totalExport}
            placeholder={`Nhập số lượng trả (tối đa ${totalExport})`}
            onChange={(e) => {
              quantityToReturn = Number(e.target.value);
            }}
          />
        ),
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          if (
            !quantityToReturn ||
            quantityToReturn <= 0 ||
            quantityToReturn > totalExport
          ) {
            message.warning("Số lượng trả không hợp lệ!");
            return;
          }

          try {
            // Cập nhật kho
            const warehouseList = await fetchWarehouseDetails();
            const matched = warehouseList.data.find(
              (w) => w.attributes.Model === record.attributes.Model
            );
            if (!matched)
              return message.error("Không tìm thấy sản phẩm trong kho!");

            const attrs = matched.attributes;
            const updatePayload = {
              DHG: (attrs.DHG || 0) + quantityToReturn,
              POS:
                record.attributes.TypeKho === "POS"
                  ? (attrs.POS || 0) - quantityToReturn
                  : attrs.POS,
              POSHN:
                record.attributes.TypeKho === "POSHN"
                  ? (attrs.POSHN || 0) - quantityToReturn
                  : attrs.POSHN,
            };
            await updateWarehouseDetails(matched.id, updatePayload);

            // Cập nhật phiếu
            await updateExportlistsData(record.id, {
              totalexport: totalExport - quantityToReturn,
              totalexportDHG:
                (record.attributes.totalexportDHG || 0) + quantityToReturn,
            });

            // Cập nhật state local
            const updated = exportlist.map((item) =>
              item.id === record.id
                ? {
                    ...item,
                    attributes: {
                      ...item.attributes,
                      totalexport: totalExport - quantityToReturn,
                      totalexportDHG:
                        (item.attributes.totalexportDHG || 0) +
                        quantityToReturn,
                    },
                  }
                : item
            );
            setExportList(updated);
            setFilteredList(updated);

            message.success("Trả kho Vật tư thành công!");
          } catch (err) {
            console.error(err);
            message.error("Có lỗi xảy ra khi trả kho Vật tư!");
          }
        },
      });
      return; // dừng hàm tại đây để không chạy logic serial
    }

    // --- Trường hợp bình thường: chọn serial ---
    const serialBorrowedList = (record.attributes.SerialNumber || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    if (!serialBorrowedList.length) {
      message.warning("Không có serial nào để trả!");
      return;
    }

    let selectedReturnSerials = [];
    Modal.confirm({
      title: "Chọn serial trả kho DHG",
      content: (
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          {serialBorrowedList.map((serial) => (
            <div key={serial} style={{ marginBottom: 4 }}>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    selectedReturnSerials.push(serial);
                  } else {
                    selectedReturnSerials = selectedReturnSerials.filter(
                      (s) => s !== serial
                    );
                  }
                }}
              >
                {serial}
              </Checkbox>
            </div>
          ))}
        </div>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        if (!selectedReturnSerials.length) {
          message.warning("Vui lòng chọn serial để trả!");
          return;
        }

        try {
          // Cập nhật kho
          const warehouseList = await fetchWarehouseDetails();
          const matched = warehouseList.data.find(
            (w) => w.attributes.Model === record.attributes.Model
          );
          if (!matched)
            return message.error("Không tìm thấy sản phẩm trong kho!");

          const attrs = matched.attributes;
          const soLuongTra = selectedReturnSerials.length;

          const updatePayload = {
            DHG: (attrs.DHG || 0) + soLuongTra,
            POS:
              record.attributes.TypeKho === "POS"
                ? (attrs.POS || 0) - soLuongTra
                : attrs.POS,
            POSHN:
              record.attributes.TypeKho === "POSHN"
                ? (attrs.POSHN || 0) - soLuongTra
                : attrs.POSHN,
          };
          await updateWarehouseDetails(matched.id, updatePayload);

          // Cập nhật phiếu
          const newSerialNumber = serialBorrowedList
            .filter((s) => !selectedReturnSerials.includes(s))
            .join(", ");
          const currentSerialDHG = record.attributes.SerialNumberDHG
            ? record.attributes.SerialNumberDHG.split("\n").filter((s) => s)
            : [];
          const updatedSerialDHG = [
            ...currentSerialDHG,
            ...selectedReturnSerials,
          ].join("\n");

          await updateExportlistsData(record.id, {
            totalexport: totalExport - soLuongTra,
            totalexportDHG:
              (record.attributes.totalexportDHG || 0) + soLuongTra,
            SerialNumber: newSerialNumber,
            SerialNumberDHG: updatedSerialDHG,
          });

          // Cập nhật state local
          const updated = exportlist.map((item) =>
            item.id === record.id
              ? {
                  ...item,
                  attributes: {
                    ...item.attributes,
                    totalexport: totalExport - soLuongTra,
                    totalexportDHG:
                      (item.attributes.totalexportDHG || 0) + soLuongTra,
                    SerialNumber: newSerialNumber,
                    SerialNumberDHG: updatedSerialDHG,
                  },
                }
              : item
          );
          setExportList(updated);
          setFilteredList(updated);
          message.success("Trả kho DHG thành công!");
        } catch (err) {
          console.error(err);
          message.error("Có lỗi xảy ra khi trả kho DHG!");
        }
      },
    });
  };

  // Tạo mảng đếm theo Model
  const statusIconMap = {
    "Đang mượn": <ClockCircleOutlined style={{ color: "orange" }} />,
    "Hoàn thành phiếu": <CheckCircleOutlined style={{ color: "green" }} />,
  };

  const statusCounts = Object.values(
    filteredList.reduce((acc, item) => {
      const status = item?.attributes?.Status || "Chưa xác định";
      if (!acc[status]) {
        acc[status] = {
          label: status,
          count: 0,
          icon: statusIconMap[status] || null,
        };
      }
      acc[status].count += 1;
      return acc;
    }, {})
  );

  // Mở modal cập nhật
  const handleUpdate = (record) => {
    setUpdatedData(record);
    setIsUpdateModalOpen(true);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

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
      title: "Tên sản phẩm",
      dataIndex: ["attributes", "ProductName"],
      width: 220,
    },
    {
      title: "Model",
      dataIndex: ["attributes", "Model"],
      width: 220,
    },
    {
      title: "Người mượn",
      dataIndex: ["attributes", "NameExport"],
      width: 200,
    },
    {
      title: "TicketDHG",
      dataIndex: ["attributes", "TicketDHG"],
      width: 150,
    },
    {
      title: "SL mượn",
      dataIndex: ["attributes", "totalexport"],
      align: "center",
      width: 100,
    },
    {
      title: "SL xuất",
      dataIndex: ["attributes", "totalexportLoan"],
      align: "center",
      width: 100,
    },
    {
      title: "SL trả",
      dataIndex: ["attributes", "totalexportDHG"],
      align: "center",
      width: 100,
    },
    {
      title: "Kho",
      dataIndex: ["attributes", "TypeKho"],
      align: "center",
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: ["attributes", "Status"],
      align: "center",
      render: (status) => (
        <Tag color={status === "Hoàn thành phiếu" ? "green" : "orange"}>
          {status}
        </Tag>
      ),
    },
  ];

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  return (
    <div className="exportlist-container">
      {/* <h1>Phiếu Mượn Kho DHG</h1> */}
      {account?.Exportlist === true && (
        <Button
          type="primary"
          onClick={() => setIsAddModalOpen(true)}
          style={{ marginBottom: 16 }}
        >
          ➕ Tạo Phiếu Xuất
        </Button>
      )}
      {account?.WritePOS === true && (
        <Button
          type="primary"
          onClick={() => setIsAddModalOpenW(true)}
          style={{ marginBottom: 16, marginLeft: 10 }}
        >
          ➕ Tạo Trả Kho / Bảo Hành
        </Button>
      )}
      {/* Form lọc */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20, flexWrap: "wrap" }}
      >
        <Form.Item name="TypeKho">
          <Select placeholder="-- Kho --" style={{ width: 160 }} allowClear>
            {[...new Set(exportlist.map((i) => i.attributes.TypeKho))].map(
              (kho) => (
                <Select.Option key={kho} value={kho}>
                  {kho}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item name="Status">
          <Select
            placeholder="-- Trạng thái --"
            style={{ width: 160 }}
            allowClear
          >
            {[...new Set(exportlist.map((i) => i.attributes.Status))].map(
              (status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>
        <Form.Item name="NameExport">
          <Select
            placeholder="--Người mượn--"
            style={{ width: 160 }}
            allowClear
          >
            {[...new Set(exportlist.map((i) => i.attributes.NameExport))].map(
              (namexport) => (
                <Select.Option key={namexport} value={namexport}>
                  {namexport}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item name="searchText">
          <Input placeholder="SP / Model / SN" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="searchTextTicket">
          <Input placeholder="Số phiếu / Ticket" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Tìm kiếm
          </Button>
        </Form.Item>

        <Form.Item>
          <Button onClick={resetFilters}>🧹 Reset</Button>
        </Form.Item>

        <Form.Item>
          <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
            Xuất Excel
          </Button>
        </Form.Item>
      </Form>

      <Row
        gutter={[12, 12]}
        style={{ marginBottom: 20 }}
        className="status-summary"
      >
        {statusCounts.map(({ label, count, icon }) => (
          <Col key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {icon}
              <span style={{ fontWeight: 500 }}>{label}:</span>
              <span style={{ fontWeight: "bold" }}>{count}</span>
            </div>
          </Col>
        ))}
      </Row>

      {/* Bảng */}
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={filteredList}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        scroll={{ x: 1200 }} // 👈 Khóa chiều rộng bảng
        //  tableLayout="fixed" // 👈 Giữ cố định layout
        onRow={(record) => ({
          onClick: () => setDetailModal({ visible: true, record }),
        })}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết phiếu mượn kho"
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={null}
        width={750}
      >
        {detailModal.record && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tên sản phẩm">
                {detailModal.record.attributes.ProductName}
              </Descriptions.Item>
              <Descriptions.Item label="Model">
                {detailModal.record.attributes.Model}
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">
                {detailModal.record.attributes.BrandName}
              </Descriptions.Item>
              <Descriptions.Item label="ĐVT">
                {detailModal.record.attributes.DVT}
              </Descriptions.Item>
              <Descriptions.Item label="Kho">
                {detailModal.record.attributes.TypeKho}
              </Descriptions.Item>
              <Descriptions.Item label="Số phiếu">
                {detailModal.record.attributes.Ticket}
              </Descriptions.Item>
              <Descriptions.Item label="TicketDHG">
                {detailModal.record.attributes.TicketDHG}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng mượn">
                {detailModal.record.attributes.totalexport}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng xuất">
                {detailModal.record.attributes.totalexportLoan}
              </Descriptions.Item>
              <Descriptions.Item label="Số trả DHG" span={2}>
                {detailModal.record.attributes.totalexportDHG}
              </Descriptions.Item>
              <Descriptions.Item label="Serial mượn" span={2}>
                <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                  {detailModal.record.attributes.SerialNumber}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Serial xuất" span={2}>
                <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                  {detailModal.record.attributes.SerialNumberLoan}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Serial trả DHG" span={2}>
                <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                  {detailModal.record.attributes.SerialNumberDHG}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Người mượn hàng">
                {detailModal.record.attributes.NameExport}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày mượn hàng">
                {new Date(
                  detailModal.record.attributes.createdAt
                ).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {detailModal.record.attributes.Note}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo phiếu">
                {detailModal.record.attributes.NameCreate}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    detailModal.record.attributes.Status === "Hoàn thành phiếu"
                      ? "green"
                      : "orange"
                  }
                >
                  {detailModal.record.attributes.Status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thông tin">
                {detailModal.record.attributes.TypeDevice}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              {account?.Exportlist === true && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleUpdate(detailModal.record)}
                >
                  Cập nhật sản phẩm
                </Button>
              )}
              {detailModal.record.attributes.Status === "Chờ duyệt" &&
                detailModal.record.attributes.TypeDevice &&
                (account?.Leader === true || account?.Exportlist === true) && ( // 👈 Thêm check Leader
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleConfirmApprove(detailModal.record)}
                  >
                    Duyệt phiếu
                  </Button>
                )}
              {detailModal.record.attributes.totalexport !== 0 &&
                detailModal.record.attributes.Status === "Đang mượn" &&
                account?.Exportlist === true && (
                  <Button
                    type="default"
                    onClick={() => handleReturnDHG(detailModal.record)}
                  >
                    Trả kho DHG
                  </Button>
                )}
              {detailModal.record.attributes.totalexport === 0 &&
                detailModal.record.attributes.Status === "Đang mượn" &&
                account?.Exportlist === true && (
                  <Button
                    type="primary"
                    danger
                    icon={<CheckOutlined />}
                    onClick={() => handleConfirmComplete(detailModal.record)}
                  >
                    Xác nhận hoàn thành
                  </Button>
                )}
            </div>
          </>
        )}
      </Modal>

      {/* Modal thêm */}
      <AddExportList
        isModalOpen={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onCreated={(newExportListData) => {
          setExportList((prev) => [newExportListData, ...prev]);
          setFilteredList((prev) => [newExportListData, ...prev]);
          setIsAddModalOpen(false);
        }}
      />

      <AddExportListW
        isModalOpen={isAddModalOpenW}
        onCancel={() => setIsAddModalOpenW(false)}
        onCreated={(newExportListData) => {
          setExportList((prev) => [newExportListData, ...prev]);
          setFilteredList((prev) => [newExportListData, ...prev]);
          setIsAddModalOpenW(false);
        }}
      />

      {/* Modal cập nhật */}
      {/* <UpdateExportList
        isModalOpen={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        updatedData={updatedData}
        onUpdated={(updatedExport) => {
          const updated = exportlist.map((item) =>
            item.id === updatedExport.id ? updatedExport : item
          );
          setExportList(updated);
          setFilteredList(updated);
          setIsUpdateModalOpen(false);
        }}
      /> */}
      <UpdateExportList
        isModalOpen={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        updatedData={updatedData}
        onUpdated={(updatedExport) => {
          const updated = exportlist.map((item) =>
            item.id === updatedExport.id ? updatedExport : item
          );
          setExportList(updated);
          setFilteredList(updated);

          // 🔥 Cập nhật lại record trong modal chi tiết nếu đang mở
          if (
            detailModal.visible &&
            detailModal.record?.id === updatedExport.id
          ) {
            setDetailModal({
              ...detailModal,
              record: updatedExport,
            });
          }

          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
};

export default ExportList;

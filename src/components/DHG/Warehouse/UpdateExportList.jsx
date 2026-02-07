import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Select,
  Tag,
  Button,
  Row,
  Col,
  Card,
  Divider,
  Statistic,
  Typography,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  BarcodeOutlined,
  ExportOutlined,
  ImportOutlined,
  SwapOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import {
  updateExportlistsData,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  fetchExportlists,
} from "../../../services/dhgServices";
import "./UpdateExportList.scss"; // Đảm bảo file này có import style hoặc dùng chung style với ExportList

const { Option } = Select;
const { Text } = Typography;

const UpdateExportList = ({
  isModalOpen,
  onCancel,
  updatedData,
  onUpdated = () => { },
}) => {
  const [form] = Form.useForm();

  // Dữ liệu bản ghi
  const record = useMemo(() => updatedData || {}, [updatedData]);
  // Lấy ID an toàn (Strapi v4/v5)
  const recordId = useMemo(() => updatedData?.documentId || updatedData?.id, [updatedData]);

  const [typeDeviceModalOpen, setTypeDeviceModalOpen] = useState(false);
  const [selectedTypeDevice, setSelectedTypeDevice] = useState(null);

  // Fill dữ liệu vào Form
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        TicketDHG: record.TicketDHG || "",
        SerialNumber: record.SerialNumber || "",
        Note: record.Note || "",
        SerialNumberDHG: record.SerialNumberDHG || "",
        // Các trường khác không cần set nếu không dùng input form để sửa
      });
    }
  }, [record, form]);

  // --- LOGIC XỬ LÝ (GIỮ NGUYÊN) ---
  const handleTransferStock = async (fromKho, toKho) => {
    try {
      if (!recordId) { message.error("Lỗi: Không tìm thấy ID phiếu!"); return; }

      const warehouseResponse = await fetchWarehouseDetails();
      const warehouseData = Array.isArray(warehouseResponse) ? warehouseResponse : warehouseResponse.data || [];
      const matched = warehouseData.find(w => w.Model === record.Model && w.BrandName === record.BrandName);

      if (!matched) { message.error("Không tìm thấy sản phẩm trong kho!"); return; }

      const soLuong = record.totalexport;
      if (soLuong <= 0) { message.warning("Không có số lượng để điều chuyển!"); return; }
      if ((matched[fromKho] || 0) < soLuong) { message.error(`Kho ${fromKho} không đủ hàng!`); return; }

      const warehouseId = matched.documentId || matched.id;
      await updateWarehouseDetails(warehouseId, {
        [fromKho]: (matched[fromKho] || 0) - soLuong,
        [toKho]: (matched[toKho] || 0) + soLuong,
      });

      await updateExportlistsData(recordId, { TypeKho: toKho });

      const refreshedList = await fetchExportlists();
      const refreshedData = Array.isArray(refreshedList) ? refreshedList : refreshedList.data || [];
      onUpdated(refreshedData);
      message.success(`Đã điều chuyển ${soLuong} ${record.Model} từ ${fromKho} sang ${toKho}!`);
      onCancel();
    } catch (err) {
      console.error(err);
      message.error("Lỗi điều chuyển kho!");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!recordId) { message.error("Lỗi ID!"); return; }

      const res = await updateExportlistsData(recordId, values);
      const updatedRecord = res.data || res;

      message.success("Cập nhật thành công!");
      onUpdated(updatedRecord);
      onCancel();
    } catch (err) {
      message.error("Lỗi cập nhật!");
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#fff7e6', padding: 8, borderRadius: '50%', color: '#fa8c16' }}>
            <FileTextOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#262626' }}>Cập Nhật Phiếu Mượn</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c' }}>{record.ProductName}</div>
          </div>
        </div>
      }
      open={isModalOpen}
      onCancel={onCancel}
      width={850}
      className="modern-detail-modal" // Sử dụng lại class CSS của ExportList
      footer={null} // Tắt footer mặc định để dùng footer custom
      centered
    >
      <Form form={form} layout="vertical">
        <div className="detail-modal-content">

          {/* --- SECTION 1: INFO CARDS --- */}
          <div className="info-section">
            <Row gutter={[24, 24]}>
              {/* Cột trái: Thông tin sản phẩm (Read-only) */}
              <Col span={12}>
                <Card title={<><InfoCircleOutlined /> Thông tin sản phẩm</>} size="small" bordered={false} className="info-card bg-gray">
                  <div className="info-row">
                    <span className="label">Model:</span>
                    <span className="value code">{record.Model}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Thương hiệu:</span>
                    <span className="value">{record.BrandName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Đơn vị:</span>
                    <span className="value">{record.DVT}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Kho hiện tại:</span>
                    <Tag color="cyan">{record.TypeKho}</Tag>
                  </div>
                  <div className="info-row">
                    <span className="label">Loại thiết bị:</span>
                    <Tag color="red">{record.TypeDevice}</Tag>
                  </div>
                </Card>
              </Col>

              {/* Cột phải: Thông tin phiếu (Có ô nhập TicketDHG) */}
              <Col span={12}>
                <Card title={<><FileTextOutlined /> Thông tin phiếu</>} size="small" bordered={false} className="info-card bg-gray">
                  <div className="info-row">
                    <span className="label">Trạng thái:</span>
                    <Tag color={record.Status === 'Hoàn thành phiếu' ? 'green' : 'orange'}>{record.Status}</Tag>
                  </div>
                  <div className="info-row">
                    <span className="label">Số phiếu nội bộ:</span>
                    <Tag color="blue">{record.Ticket}</Tag>
                  </div>

                  {/* Ô nhập Ticket Helpdesk - Logic: Nếu chưa có thì hiện Input, có rồi thì hiện text (hoặc vẫn cho sửa tùy logic bạn) */}
                  <div style={{ marginTop: 12, marginBottom: 8 }}>
                    {/* Ở đây mình để luôn là Input để có thể cập nhật lại nếu nhập sai */}
                    <Form.Item label="Ticket ĐHG:" name="TicketDHG" style={{ marginBottom: 0 }}>
                      <Input prefix={<BarcodeOutlined />} placeholder="Nhập số Ticket..." className="custom-input" />
                    </Form.Item>
                  </div>

                  <div className="info-row" style={{ marginTop: 4 }}>
                    <span className="label">Người mượn:</span>
                    <span className="value"><UserOutlined /> {record.NameExport}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Ngày tạo:</span>
                    <span className="value"><CalendarOutlined /> {record.createdAt ? new Date(record.createdAt).toLocaleDateString("vi-VN") : ""}</span>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* --- SECTION 2: STATS & SERIALS --- */}
          <div className="serial-section">
            <Row gutter={16} style={{ marginBottom: 12 }}>
              <Col span={8}>
                <Statistic
                  title="Số lượng Mượn"
                  value={record.totalexport}
                  valueStyle={{ color: '#1890ff', fontWeight: 700 }}
                  prefix={<ExportOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đã Xuất"
                  value={record.totalexportLoan}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đã Trả"
                  value={record.totalexportDHG}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<ImportOutlined />}
                />
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                {/* Form sửa Serial Mượn */}
                <Form.Item
                  label={<Text strong>Serial Mượn (Chỉnh sửa):</Text>}
                  name="SerialNumber"
                >
                  <Input.TextArea
                    rows={4}
                    className="custom-textarea code-font"
                    placeholder="Nhập danh sách serial..."
                    style={{ background: '#f0f5ff', borderColor: '#d6e4ff' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* Hiển thị Serial Đã trả (Read-only) */}
                <Form.Item
                  label={<Text strong>Serial Đã Trả:</Text>}
                  name="SerialNumberDHG"
                >
                  <Input.TextArea
                    rows={4}
                    className="custom-textarea code-font"
                    placeholder="Chưa có serial trả"
                    style={{ height: '98px', overflowY: 'auto' }}
                  />
                </Form.Item>
                {/* <div className="serial-block">
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Serial Đã Trả (Read-only):</Text>
                  <div className="serial-box return-serial" style={{ height: '98px', overflowY: 'auto' }}>
                    {record.SerialNumberDHG || "Chưa có serial trả"}
                  </div>
                </div> */}
              </Col>
            </Row>

            <Form.Item label="Ghi chú:" name="Note" style={{ marginTop: 12 }}>
              <Input.TextArea rows={2} placeholder="Ghi chú thêm..." />
            </Form.Item>
          </div>

          {/* --- SECTION 3: FOOTER ACTIONS --- */}
          <div className="modal-actions-footer">
            {/* Nút Điều chuyển kho */}
            {record.totalexport > 0 && record.TypeKho === "POS" && (
              <Button icon={<SwapOutlined />} className="btn-transfer" onClick={() => handleTransferStock("POS", "POSHN")}>
                POS → POSHN
              </Button>
            )}
            {record.totalexport > 0 && record.TypeKho === "POSHN" && (
              <Button icon={<SwapOutlined />} className="btn-transfer" onClick={() => handleTransferStock("POSHN", "POS")}>
                POSHN → POS
              </Button>
            )}

            {/* Nút Xác nhận loại */}
            {record.totalexport > 0 && !record.TypeDevice && (
              <Button icon={<CheckCircleOutlined />} type="dashed" onClick={() => { setSelectedTypeDevice(null); setTypeDeviceModalOpen(true); }}>
                Xác nhận loại
              </Button>
            )}

            <div style={{ flex: 1 }}></div> {/* Spacer đẩy các nút sau sang phải */}

            <Button icon={<CloseOutlined />} onClick={onCancel}>
              Hủy
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleOk}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Form>

      {/* --- MODAL CON: XÁC NHẬN LOẠI --- */}
      <Modal
        title="Xác nhận loại xuất kho"
        open={typeDeviceModalOpen}
        onCancel={() => setTypeDeviceModalOpen(false)}
        zIndex={1001}
        onOk={async () => {
          if (!selectedTypeDevice) { message.warning("Vui lòng chọn loại!"); return; }
          if (!recordId) { message.error("Lỗi ID!"); return; }
          try {
            await updateExportlistsData(recordId, { TypeDevice: selectedTypeDevice });
            message.success("Cập nhật thành công!");
            setTypeDeviceModalOpen(false);
            setTimeout(() => window.location.reload(), 500);
          } catch (err) {
            message.error("Lỗi cập nhật!");
          }
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn loại..."
          value={selectedTypeDevice}
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
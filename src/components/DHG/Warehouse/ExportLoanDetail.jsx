import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Spin, message, Card, Row, Col, Button, Tag } from "antd";
import { useMediaQuery } from "react-responsive";
import {
  CloseOutlined,
  LeftSquareTwoTone,
  CheckCircleTwoTone,
  SaveTwoTone,
  FileAddTwoTone,
  PrinterTwoTone,
  CalculatorTwoTone,
  MinusCircleTwoTone,
} from "@ant-design/icons";
import { Modal } from "antd";
import {
  fetchExportLoanPOS,
  updateExportLoanTicket,
  updateExportLoanPOS,
  fetchWarehouseDetails,
  updateWarehouseDetails,
  fetchExportLoanTicketPOS,
  updateExportLoanTicketv1,
} from "../../../services/dhgServices";

const statusColor = {
  "Đang tạo phiếu": "orange",
  "Đang chờ duyệt": "blue",
  Duyệt: "cyan",
  "Đã giao": "green",
  "Đã xuất hóa đơn": "green",
  "Xác nhận": "purple",
  "Chờ xuất hóa đơn": "volcano",
};

const ExportLoanDetail = () => {
  const { Votes } = useParams();
  const [ticket, setTicket] = useState(null); // phiếu tổng
  const [data, setData] = useState([]); // thiết bị
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  const [exportLoanData, setExportLoanData] = useState([]);

  // 📌 Viết function ở ngoài useEffect
  const fetchTicketAndDevices = async () => {
    setLoading(true);
    try {
      // 1️⃣ Phiếu tổng
      const ticketArray = await fetchExportLoanTicketPOS(Votes);
      console.log("ticketArray:", ticketArray);

      if (ticketArray?.length > 0) {
        setTicket(ticketArray[0]);
      }

      // 2️⃣ Chi tiết thiết bị
      const deviceResult = await fetchExportLoanPOS(Votes);
      console.log("deviceResult:", deviceResult);
      setData(deviceResult || []);
    } catch (err) {
      console.error(err);
      message.error("Lấy dữ liệu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 📌 useEffect chỉ gọi lại hàm này
  useEffect(() => {
    if (!Votes) return;
    fetchTicketAndDevices();
  }, [Votes]);

  //-------------------------------------------------------------------------------------------

  const handleApproveTicket = async () => {
    try {
      setLoading(true);

      if (!data || data.length === 0) {
        message.warning("Không có thiết bị trong phiếu để duyệt.");
        return;
      }

      // ✅ Cập nhật trạng thái phiếu tổng
      await updateExportLoanTicket(ticket.id, "Duyệt");
      message.success("Duyệt phiếu thành công!");

      // 🔄 Refresh lại ticket + devices
      await fetchTicketAndDevices();
    } catch (error) {
      console.error("Lỗi duyệt phiếu:", error);
      message.error("Lỗi duyệt phiếu.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm duyệt + update thiết bị + kho
  const handleApproveTicketAndUpdateDevices = async () => {
    try {
      setLoading(true);

      // 🔄 1. Fetch lại phiếu tổng mới nhất để check trạng thái
      const latestTicketArr = await fetchExportLoanTicketPOS(Votes);
      const latestTicket = latestTicketArr?.[0];

      if (!latestTicket) {
        message.error("❌ Không tìm thấy phiếu!");
        setLoading(false);
        return;
      }

      if (latestTicket.attributes.Status !== "Đang chờ duyệt") {
        message.error("❌ Phiếu đã được xử lý bởi người khác!");
        setLoading(false);
        return;
      }

      // 2. Update phiếu tổng
      //await updateExportLoanTicket(latestTicket.id, "Duyệt");
      // message.success("✅ Duyệt phiếu thành công!");
      await updateExportLoanTicketv1(latestTicket.id, {
        Status: "Duyệt",
        PersonApprove: account.Name,
      });

      message.success(`✅ Phiếu được duyệt bởi: ${account.Name}`);

      // 3. Update trạng thái thiết bị
      if (data.length > 0) {
        await Promise.all(
          data.map((device) => updateExportLoanPOS(device.id, "Duyệt"))
        );

        // 4. Cập nhật kho
        await updateWarehouseFromDevices(
          data.map((d) => ({ id: d.id, ...d.attributes }))
        );

        message.success("✅ Thiết bị và kho đã được cập nhật!");
      }

      // 5. Reload lại dữ liệu
      await fetchTicketAndDevices();
    } catch (error) {
      console.error("❌ Lỗi khi duyệt phiếu:", error);
      message.error("Đã có lỗi xảy ra khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  const updateWarehouseFromDevices = async (devices) => {
    try {
      const warehouseResponse = await fetchWarehouseDetails();
      const warehouseList = warehouseResponse.data;

      for (const device of devices) {
        if (!device) {
          console.warn("Thiết bị không hợp lệ:", device);
          continue;
        }

        const { Model, TypeKho, totalexport, Type } = device;

        if (!Model) {
          console.warn("Thiết bị thiếu Model:", device);
          continue;
        }

        // Tìm kho theo Model
        const kho = warehouseList.find((k) => k.attributes.Model === Model);
        if (!kho) {
          console.warn(`❌ Không tìm thấy kho cho Model: ${Model}`);
          continue;
        }

        const id = kho.id;
        const attributes = kho.attributes;

        // if (Type === "Vật tư") {
        //     console.log(`📦 Bỏ qua hoặc xử lý riêng vật tư: ${Model}`);
        //     continue;
        // }

        let updatedPOS = attributes.POS || 0;
        let updatedPOSHN = attributes.POSHN || 0;
        let totalXTK = attributes.totalXTK || 0;

        if (TypeKho === "POS") {
          updatedPOS -= totalexport || 0;
        } else if (TypeKho === "POSHN") {
          updatedPOSHN -= totalexport || 0;
        }

        totalXTK += totalexport || 0;

        const inventoryCK =
          (attributes.inventoryDK || 0) + (attributes.totalNTK || 0) - totalXTK;

        await updateWarehouseDetails(id, {
          POS: updatedPOS,
          POSHN: updatedPOSHN,
          totalXTK,
          inventoryCK,
        });

        console.log(`✅ Đã cập nhật kho cho Model ${Model}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật kho:", error);
    }
  };

  //-------------------------------------------------------------------------------------------

  const handleReturnTicket = () => {
    Modal.confirm({
      title: "Trả phiếu về trạng thái 'Đang tạo phiếu'",
      content: "Bạn có chắc chắn muốn trả phiếu này không?",
      okText: "Trả phiếu",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          await updateExportLoanTicket(ticket.id, "Đang tạo phiếu");

          // ✅ Cập nhật lại state thay vì reload
          setTicket((prev) => ({
            ...prev,
            attributes: {
              ...prev.attributes,
              Status: "Đang tạo phiếu",
            },
          }));

          message.success("Phiếu đã được trả về trạng thái 'Đang tạo phiếu'!");
        } catch (error) {
          message.error("Lỗi khi trả phiếu!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  //--------------------------------------------------------------------------------------------
  const handleReturnLeaderTicket = () => {
    Modal.confirm({
      title: "Bạn có chắc muốn hủy duyệt phiếu này?",
      content:
        "Thao tác này sẽ hoàn trả thiết bị về kho và chuyển phiếu về trạng thái 'Đang chờ duyệt'.",
      okText: "Hủy duyệt",
      cancelText: "Thoát",
      okType: "danger",
      onOk: async () => {
        try {
          setLoading(true);

          // 1. Cập nhật phiếu
          await updateExportLoanTicket(ticket.id, "Đang chờ duyệt");

          // 2. Lấy thiết bị trong phiếu từ data
          const savedDevices = data.map((d) => ({ id: d.id, ...d.attributes }));
          if (savedDevices.length === 0) {
            message.warning("Không có thiết bị nào để hoàn kho.");
            return;
          }

          // 3. Cập nhật trạng thái thiết bị
          await Promise.all(
            savedDevices.map((device) =>
              updateExportLoanPOS(device.id, "Đang chờ duyệt")
            )
          );

          // 4. Hoàn kho
          await updateWarehouseFromDevicescallback(savedDevices);

          // 5. Cập nhật ticket state
          setTicket((prev) => ({
            ...prev,
            attributes: {
              ...prev.attributes,
              Status: "Đang tạo phiếu",
            },
          }));

          message.success("↩️ Đã hủy duyệt phiếu và hoàn kho!");
        } catch (error) {
          console.error("❌ Lỗi khi hủy duyệt phiếu:", error);
          message.error("Có lỗi xảy ra khi hủy duyệt phiếu.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 👉 Hàm hoàn kho từ danh sách thiết bị
  const updateWarehouseFromDevicescallback = async (devices) => {
    try {
      const warehouseResponse = await fetchWarehouseDetails();
      const warehouseList = warehouseResponse.data;

      for (const device of devices) {
        if (!device?.Model) {
          console.warn("Thiết bị không hợp lệ:", device);
          continue;
        }

        const kho = warehouseList.find(
          (k) => k.attributes.Model === device.Model
        );
        if (!kho) {
          console.warn(`❌ Không tìm thấy kho cho Model: ${device.Model}`);
          continue;
        }

        const id = kho.id;
        const attributes = kho.attributes;

        let updatedPOS = attributes.POS || 0;
        let updatedPOSHN = attributes.POSHN || 0;
        let totalXTK = attributes.totalXTK || 0;

        // Hoàn trả về kho
        if (device.TypeKho === "POS") {
          updatedPOS += device.totalexport || 0;
        } else if (device.TypeKho === "POSHN") {
          updatedPOSHN += device.totalexport || 0;
        }

        totalXTK -= device.totalexport || 0;

        const inventoryCK =
          (attributes.inventoryDK || 0) + (attributes.totalNTK || 0) - totalXTK;

        await updateWarehouseDetails(id, {
          POS: updatedPOS,
          POSHN: updatedPOSHN,
          totalXTK,
          inventoryCK,
        });

        console.log(
          `↩️ Hoàn kho Model ${device.Model}: +${device.totalexport}`
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi hoàn kho:", error);
    }
  };

  //---------------------------------------------------------------------------------------------
  const renderActionButtons = () => {
    if (!ticket || !ticket.attributes) return null;

    const status = ticket.attributes.Status;
    const person = ticket.attributes.Person;

    return (
      <Row gutter={[8, 8]} style={{ marginBottom: 16, flexWrap: "wrap" }}>
        {/* <Col>
          <Button
            key="cancel"
            icon={<CloseOutlined />}
            onClick={() => console.log("Đóng")}
          >
            Đóng
          </Button>
        </Col> */}

        {/* Nút Trả / Duyệt Phiếu */}
        {(account.Leader === true || person === account.Name) &&
          status === "Đang chờ duyệt" && (
            <>
              <Col>
                <Button
                  key="return"
                  type="default"
                  danger
                  icon={<LeftSquareTwoTone />}
                  onClick={handleReturnTicket}
                >
                  Trả Phiếu
                </Button>
              </Col>
              <Col>
                <Button
                  key="approve"
                  type="primary"
                  icon={<CheckCircleTwoTone />}
                  onClick={handleApproveTicketAndUpdateDevices}
                  loading={loading}
                  disabled={loading}
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                >
                  {loading ? "Đang xử lý..." : "Duyệt Phiếu"}
                </Button>
              </Col>
            </>
          )}

        {(account.Leader === true || person === account.Name) &&
          status === "Duyệt" && (
            <>
              <Col>
                <Button
                  key="return"
                  danger
                  type="primary"
                  icon={<MinusCircleTwoTone />}
                  onClick={handleReturnLeaderTicket}
                >
                  Hủy duyệt
                </Button>
              </Col>
            </>
          )}

        {/* Nút Lưu / Gửi phiếu */}
        {/* {status === "Đang tạo phiếu" && person === account.Name && (
          <>
            <Col>
              <Button
                type="default"
                icon={<SaveTwoTone />}
                onClick={() => console.log("Lưu")}
              >
                Lưu
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<FileAddTwoTone />}
                style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                onClick={() => console.log("Gửi phiếu")}
              >
                Gửi phiếu
              </Button>
            </Col>
          </>
        )} */}

        {/* Nút In Phiếu */}
        {/* {(status === "Duyệt" ||
          status === "Đã giao" ||
          status === "Đã xuất hóa đơn") &&
          person === account.Name && (
            <Col>
              <Button
                type="primary"
                icon={<PrinterTwoTone />}
                style={{ backgroundColor: "#b65959ff", borderColor: "#9b59b6" }}
                onClick={() => console.log("In Phiếu")}
              >
                In Phiếu
              </Button>
            </Col>
          )} */}

        {/* Nút Xuất Hóa Đơn
        {status === "Chờ xuất hóa đơn" && account.Position === "SaleAdmin" && (
          <Col>
            <Button
              type="primary"
              icon={<CalculatorTwoTone />}
              style={{ backgroundColor: "#DD0000", borderColor: "#DD0000" }}
              onClick={() => console.log("Xuất hóa đơn")}
            >
              Xuất hóa đơn
            </Button>
          </Col>
        )} */}
      </Row>
    );
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["attributes", "ProductName"],
      key: "ProductName",
    },
    { title: "Model", dataIndex: ["attributes", "Model"], key: "Model" },
    {
      title: "Thương Hiệu",
      dataIndex: ["attributes", "BrandName"],
      key: "BrandName",
    },
    { title: "Type", dataIndex: ["attributes", "Type"], key: "Type" },
    { title: "DVT", dataIndex: ["attributes", "DVT"], key: "DVT" },
    { title: "Kho", dataIndex: ["attributes", "TypeKho"], key: "TypeKho" },
    {
      title: "Số lượng",
      dataIndex: ["attributes", "totalexport"],
      key: "totalexport",
    },
    {
      title: "Serial",
      dataIndex: ["attributes", "SerialNumber"],
      key: "SerialNumber",
    },
    {
      title: "Người xuất",
      dataIndex: ["attributes", "NameExportLoan"],
      key: "NameExportLoan",
    },
    {
      title: "Trạng thái",
      dataIndex: ["attributes", "Status"],
      key: "Status",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
  ];

  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <h2 style={{ marginBottom: 16 }}>Danh sách thiết bị - Phiếu: {Votes}</h2>
      {renderActionButtons()}

      {isMobile ? (
        <Row gutter={[12, 12]}>
          {data.map((item) => {
            const attr = item.attributes;
            return (
              <Col span={24} key={item.id}>
                <Card
                  size="small"
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  bodyStyle={{ padding: 12 }}
                >
                  <h3 style={{ marginBottom: 12 }}>{attr.ProductName}</h3>
                  <Row gutter={[8, 8]}>
                    {[
                      { label: "Model", value: attr.Model },
                      { label: "Thương Hiệu", value: attr.BrandName },
                      { label: "Loại", value: attr.Type },
                      { label: "Đơn vị tính", value: attr.DVT },
                      { label: "Kho", value: attr.TypeKho },
                      { label: "Số lượng", value: attr.totalexport },
                      { label: "Serial", value: attr.SerialNumber },
                      { label: "Người xuất", value: attr.NameExportLoan },
                      { label: "Trạng thái", value: attr.Status },
                    ].map((field, idx) => (
                      <Col span={12} key={idx}>
                        <div
                          style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 6,
                            padding: 6,
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <b>{field.label}:</b> {field.value}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      )}
    </Spin>
  );
};

export default ExportLoanDetail;

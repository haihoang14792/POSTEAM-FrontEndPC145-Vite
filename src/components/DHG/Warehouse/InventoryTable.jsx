import React, { useState, useEffect } from "react";
import {
  fetchWarehouseDetails,
  updateWarehouseDetails,
} from "../../../services/dhgServices";
import * as XLSX from "xlsx";
import {
  SearchOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  LockOutlined,
  ShopOutlined
} from "@ant-design/icons";
import {
  Input,
  Button,
  Table,
  Typography,
  Tooltip,
  Tag,
  message
} from "antd";
import ConfirmCloseInventory from "./ConfirmCloseInventory";
import "./InventoryTable.scss";

const { Title, Text } = Typography;

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Quản lý phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20, // Mặc định hiển thị 20 dòng
  });

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const loadData = async () => {
    try {
      setLoading(true);
      const warehouseResponse = await fetchWarehouseDetails();
      // Strapi v5 handling: check data structure
      const warehouseData = Array.isArray(warehouseResponse) ? warehouseResponse : (warehouseResponse.data || []);

      // Sắp xếp dữ liệu (ví dụ theo tên sản phẩm)
      const sortedData = warehouseData.sort((a, b) => a.ProductName?.localeCompare(b.ProductName));

      setData(sortedData);
      setFilteredData(sortedData);

      // Reset về trang 1 khi load lại data
      setPagination(prev => ({ ...prev, current: 1 }));

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error("Không thể tải dữ liệu kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);

  // --- Xử lý Tìm kiếm ---
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Reset về trang 1 khi bắt đầu tìm kiếm
    setPagination(prev => ({ ...prev, current: 1 }));

    if (!value) {
      setFilteredData(data);
      return;
    }

    const keyword = value.toLowerCase();
    const results = data.filter(
      (item) =>
        item.ProductName?.toLowerCase().includes(keyword) ||
        item.Model?.toLowerCase().includes(keyword)
    );
    setFilteredData(results);
  };

  // --- Xử lý thay đổi bảng (Phân trang) ---
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      message.warning("Không có dữ liệu để xuất");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Tên Sản Phẩm": item.ProductName,
        Model: item.Model,
        "ĐVT": item.DVT,
        "Tồn Đầu Kỳ": item.inventoryDK,
        "Nhập Trong Kỳ": item.totalNTK,
        "Xuất Trong Kỳ": item.totalXTK,
        "Tồn Cuối Kỳ": item.inventoryCK,
        "Kho DHG": item.DHG,
        "Kho POS": item.POS,
        "Kho POSHN": item.POSHN,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, `Inventory_${currentMonth}_${currentYear}.xlsx`);
    message.success("Xuất Excel thành công");
  };

  const handleChotKho = async () => {
    try {
      const currentMonthKey = Number(currentYear * 100 + currentMonth);
      const alreadyClosed = data.some(
        (item) => Number(item.closedMonth) === currentMonthKey
      );

      if (alreadyClosed) {
        message.warning("Một số dòng kho đã được chốt trong tháng này!");
        return;
      }

      setShowConfirmModal(false);
      setLoading(true);

      // Export backup before closing
      const worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          "Tên Sản Phẩm": item.ProductName,
          Model: item.Model,
          "ĐVT": item.DVT,
          "Tồn Đầu Kỳ": item.inventoryDK,
          "Nhập Trong Kỳ": item.totalNTK,
          "Xuất Trong Kỳ": item.totalXTK,
          "Tồn Cuối Kỳ": item.inventoryCK,
          "Kho DHG": item.DHG,
          "Kho POS": item.POS,
          "Kho POSHN": item.POSHN,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Before");
      XLSX.writeFile(
        workbook,
        `Inventory_Before_CK_${currentMonth}_${currentYear}.xlsx`
      );

      // Update logic
      const updates = data.map(item =>
        updateWarehouseDetails(item.id || item.documentId, {
          inventoryDK: item.inventoryCK,
          inventoryCK: item.inventoryCK,
          totalNTK: 0,
          totalXTK: 0,
          closedMonth: currentMonthKey,
        })
      );

      await Promise.all(updates);
      await loadData();
      message.success("Đã chốt kho POS thành công!");

    } catch (error) {
      console.error("Lỗi khi chốt kho POS:", error);
      message.error("Có lỗi xảy ra khi chốt kho");
    } finally {
      setLoading(false);
    }
  };

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const account = userData?.account || {};

  // --- Cấu hình cột ---
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Sản Phẩm',
      dataIndex: 'ProductName',
      key: 'ProductName',
      width: 250,
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => (a.ProductName || "").localeCompare(b.ProductName || ""),
    },
    {
      title: 'Model',
      dataIndex: 'Model',
      key: 'Model',
      width: 150,
      sorter: (a, b) => (a.Model || "").localeCompare(b.Model || ""),
    },
    {
      title: 'ĐVT',
      dataIndex: 'DVT',
      key: 'DVT',
      width: 80,
      align: 'center',
      render: (text) => <Tag>{text}</Tag>
    },
    {
      title: 'Tồn Đầu',
      dataIndex: 'inventoryDK',
      key: 'inventoryDK',
      align: 'right',
      width: 100,
    },
    {
      title: 'Nhập',
      dataIndex: 'totalNTK',
      key: 'totalNTK',
      align: 'right',
      width: 100,
      className: 'col-import'
    },
    {
      title: 'Xuất',
      dataIndex: 'totalXTK',
      key: 'totalXTK',
      align: 'right',
      width: 100,
      className: 'col-export',
      render: (val) => <span className="text-orange">{val}</span>
    },
    {
      title: 'Tồn Cuối',
      dataIndex: 'inventoryCK',
      key: 'inventoryCK',
      align: 'right',
      width: 100,
      sorter: (a, b) => a.inventoryCK - b.inventoryCK,
      render: (val) => <span className="text-green font-bold">{val}</span>
    },
    {
      title: 'Kho DHG',
      dataIndex: 'DHG',
      key: 'DHG',
      align: 'right',
      width: 100,
      render: (val) => <span className="text-blue">{val}</span>
    },
    {
      title: 'Kho POS',
      dataIndex: 'POS',
      key: 'POS',
      align: 'right',
      width: 100,
      render: (val) => <span className="text-red">{val}</span>
    },
    {
      title: 'Kho POSHN',
      dataIndex: 'POSHN',
      key: 'POSHN',
      align: 'right',
      width: 100,
      render: (val) => <span className="text-purple">{val}</span>
    },
  ];

  return (
    <div className="inventory-table-container">
      {/* HEADER DASHBOARD */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-box">
            <ShopOutlined />
          </div>
          <div className="header-titles">
            <Title level={4}>Quản lý Tồn Kho</Title>
            <Text type="secondary">Theo dõi nhập xuất tồn chi tiết theo thời gian thực</Text>
          </div>
        </div>

        <div className="header-right">
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Tìm tên SP hoặc Model..."
            value={searchText}
            onChange={handleSearch}
            className="search-input"
            allowClear
          />

          <div className="action-buttons">
            <Tooltip title="Tải lại dữ liệu">
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
                className="btn-icon"
              />
            </Tooltip>

            {account.Warehouse === true && (
              <>
                <Tooltip title="Xuất báo cáo Excel">
                  <Button
                    type="primary"
                    icon={<FileExcelOutlined />}
                    onClick={exportToExcel}
                    className="btn-excel"
                    style={{ backgroundColor: '#217346', borderColor: '#217346' }}
                  >
                    Excel
                  </Button>
                </Tooltip>

                <Tooltip title="Chốt số liệu tồn kho tháng này">
                  <Button
                    type="primary"
                    danger
                    icon={<LockOutlined />}
                    onClick={() => setShowConfirmModal(true)}
                    className="btn-lock"
                  >
                    Chốt Kho
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="table-wrapper">
        <Table
          rowKey={(record) => record.id || record.documentId || Math.random()} // Đảm bảo key duy nhất
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          // CẤU HÌNH PHÂN TRANG CHI TIẾT
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'], // Các tùy chọn số dòng
            showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} sản phẩm`,
            locale: { items_per_page: "/ trang" }
          }}
          onChange={handleTableChange} // Hàm bắt sự kiện thay đổi phân trang
          className="custom-table"
          scroll={{ x: 1200 }}
          bordered
          size="middle"
        />
      </div>

      {showConfirmModal && (
        <ConfirmCloseInventory
          onConfirm={handleChotKho}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default InventoryTable;
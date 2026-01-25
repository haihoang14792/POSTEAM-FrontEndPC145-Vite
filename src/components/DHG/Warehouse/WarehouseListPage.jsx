import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Typography,
  Tooltip,
  Tag,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  SearchOutlined,
  HomeOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { fetchListWarehouse } from '../../../services/dhgServices';
import AddWarehouseListModal from './AddWarehouseListModal';
import UpdateWarehouseListModal from './UpdateWarehouseListModal';

const { Title } = Typography;

const WarehouseListPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // State quản lý Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const res = await fetchListWarehouse();
      // Strapi v5: response có thể là mảng trực tiếp hoặc { data: [...] }
      const data = Array.isArray(res) ? res : (res.data || []);

      // Thêm key cho mỗi item để Antd Table hoạt động tốt nhất
      const mappedData = data.map(item => ({
        ...item, // Sửa: bỏ .attributes, spread trực tiếp item
        key: item.id || item.documentId
      }));

      setWarehouses(mappedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách kho:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      warehouses.map(warehouse => ({
        "ID": warehouse.id,
        "Tên kho": warehouse.NameKho, // Sửa: bỏ .attributes
        "Mô tả": warehouse.DescriptionKho, // Sửa: bỏ .attributes
        "Loại kho": warehouse.TypeKho, // Sửa: bỏ .attributes
        "Địa chỉ": warehouse.Address // Sửa: bỏ .attributes
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách kho");
    XLSX.writeFile(wb, "Danh_sach_kho.xlsx");
  };

  // --- Cấu hình cột cho bảng Ant Design ---
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên Kho',
      dataIndex: 'NameKho', // Sửa: bỏ ['attributes', ...] -> dùng string trực tiếp
      key: 'name',
      render: (text) => <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>,
      sorter: (a, b) => a.NameKho.localeCompare(b.NameKho), // Sửa: bỏ .attributes
    },
    {
      title: 'Loại Kho',
      dataIndex: 'TypeKho', // Sửa: bỏ ['attributes', ...]
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Kho tổng' ? 'geekblue' : 'green'}>
          {type || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'Address', // Sửa: bỏ ['attributes', ...]
      key: 'address',
      render: (text) => <span><HomeOutlined style={{ marginRight: 5 }} />{text}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'DescriptionKho', // Sửa: bỏ ['attributes', ...]
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa thông tin kho">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedWarehouse(record);
              setIsUpdateModalVisible(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  // Lọc dữ liệu trước khi hiển thị
  const filteredData = warehouses.filter(item =>
    // Sửa: bỏ .attributes
    item.NameKho?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Card
        bordered={false}
        style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        {/* Header: Tiêu đề và các nút thao tác */}
        <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: 20 }}>
          <Col xs={24} md={8}>
            <Title level={3} style={{ margin: 0 }}>Quản lý Kho hàng</Title>
          </Col>

          <Col xs={24} md={16}>
            <Row gutter={[10, 10]} justify="end">
              <Col xs={24} sm={10} md={12}>
                <Input
                  placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  allowClear
                />
              </Col>
              <Col>
                <Space>
                  <Button
                    onClick={handleExport}
                    icon={<FileExcelOutlined />}
                    style={{ backgroundColor: '#217346', color: 'white', borderColor: '#217346' }}
                  >
                    Xuất Excel
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                  >
                    Thêm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Body: Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          rowKey="id"
          locale={{ emptyText: 'Không có dữ liệu kho' }}
        />
      </Card>

      {/* --- Giữ nguyên logic Modal của bạn --- */}
      <AddWarehouseListModal
        isModalOpen={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onCreated={(newData) => {
          setWarehouses([...warehouses, { ...newData, key: newData.id }]);
          setIsModalVisible(false);
        }}
      />

      <UpdateWarehouseListModal
        isModalOpen={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        warehouseData={selectedWarehouse}
        onUpdated={(updatedData) => {
          setWarehouses(warehouses.map(w => w.id === updatedData.id ? updatedData : w));
          setIsUpdateModalVisible(false);
        }}
      />
    </div>
  );
};

export default WarehouseListPage;
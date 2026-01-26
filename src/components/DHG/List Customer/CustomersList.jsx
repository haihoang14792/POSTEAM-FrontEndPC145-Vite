import React, { useEffect, useState } from 'react';
import { fetchListCustomerPage } from '../../../services/storeServices';
import * as XLSX from 'xlsx';
import {
  FaFileExcel,
  FaSearch,
  FaRedoAlt,
  FaMapMarkerAlt,
  FaStore,
} from 'react-icons/fa';
import {
  Tag,
  Button,
  notification,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Descriptions,
  Card,
  Pagination,
  Row,
  Col,
  Empty,
  Spin
} from 'antd';
import './CustomersList.scss';

const { Option } = Select;

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // State phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({});

  const [selectedStore, setSelectedStore] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [form] = Form.useForm();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gọi API mỗi khi trang hoặc bộ lọc thay đổi
  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchListCustomerPage(
        pagination.current,
        pagination.pageSize,
        searchParams
      );

      // --- SỬA LỖI TẠI ĐÂY ---
      // res chính là object { data: [...], meta: ... } mà bạn thấy trong F12
      // Không cần chấm thêm .data.data nữa
      const rawData = res?.data || [];
      const meta = res?.meta?.pagination || { total: 0 };

      setCustomers(rawData);
      setPagination(prev => ({
        ...prev,
        total: meta.total
      }));

    } catch (err) {
      console.error(err);
      notification.error({ message: 'Lỗi tải danh sách!' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    const filters = {};
    if (values.Customer) filters.Customer = values.Customer;
    if (values.status) filters.Status = values.status;
    if (values.searchText) filters.searchText = values.searchText;

    setSearchParams(filters);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const resetFilters = () => {
    form.resetFields();
    setSearchParams({});
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleExport = async () => {
    try {
      notification.info({ message: 'Đang tải dữ liệu để xuất...' });
      const res = await fetchListCustomerPage(1, 10000, searchParams);
      const rawData = res?.data || [];

      const exportData = rawData.map((item, index) => ({
        STT: index + 1,
        'Khách hàng': item.Customer,
        'Mã CH': item.StoreID,
        'Địa chỉ': item.Address,
        'Địa chỉ Giao Hàng': item.AddressOFF,
        'Trạng thái': item.Status ? 'Mở' : 'Đóng',
        'Ngày mở': item.Open,
      }));

      if (exportData.length === 0) {
        notification.warning({ message: 'Không có dữ liệu!' });
        return;
      }

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'DanhSach');
      XLSX.writeFile(wb, `DS_CuaHang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (e) {
      notification.error({ message: 'Lỗi xuất file' });
    }
  };

  const renderStatus = (status) => (
    <Tag color={status ? 'success' : 'error'}>
      {status ? 'HOẠT ĐỘNG' : 'ĐÓNG CỬA'}
    </Tag>
  );

  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'Customer',
      width: 150
    },
    {
      title: 'Mã CH',
      dataIndex: 'StoreID',
      width: 120,
      render: (t) => <b style={{ color: '#1890ff' }}>{t}</b>
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      ellipsis: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      width: 120,
      align: 'center',
      render: renderStatus
    },
    {
      title: 'Hành động',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button size="small" type="primary" ghost onClick={() => {
          setSelectedStore(record);
          setIsDetailModalOpen(true);
        }}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="customers-list-container fade-in">
      <Card className="filter-card" bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="Customer" label="Khách hàng" style={{ marginBottom: 0 }}>
                <Input placeholder="Nhập tên KH" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="status" label="Trạng thái" style={{ marginBottom: 0 }}>
                <Select placeholder="Tất cả" allowClear>
                  <Option value="Mở">Hoạt động</Option>
                  <Option value="Đóng">Đóng cửa</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="searchText" label="Tìm kiếm" style={{ marginBottom: 0 }}>
                <Input prefix={<FaSearch className="text-muted" />} placeholder="Mã cửa hàng, địa chỉ..." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" htmlType="submit">Tìm</Button>
              <Button onClick={resetFilters} icon={<FaRedoAlt />}>Reset</Button>
              <Button onClick={handleExport} className="btn-excel" icon={<FaFileExcel />}>Excel</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <div className="list-content">
        {loading ? <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div> : (
          !isMobile ? (
            <Card bordered={false} className="table-card shadow-sm">
              <Table
                columns={columns}
                dataSource={customers}
                rowKey="id"
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                  onChange: (p, ps) => setPagination(prev => ({ ...prev, current: p, pageSize: ps })),
                  showTotal: (total) => `Tổng ${total} cửa hàng`
                }}
                scroll={{ x: 1000 }}
                size="middle"
              />
            </Card>
          ) : (
            <div className="mobile-list-wrapper">
              {customers.length > 0 ? customers.map(item => (
                <Card key={item.id} className="mobile-item-card" size="small">
                  <div className="card-header-mobile">
                    <span className="store-id">#{item.StoreID}</span>
                    {renderStatus(item.Status)}
                  </div>
                  <div className="card-body-row">
                    <FaStore className="icon" /> <strong>{item.Customer}</strong>
                  </div>
                  <div className="card-body-row">
                    <FaMapMarkerAlt className="icon" /> {item.Address}
                  </div>
                  <Button block style={{ marginTop: 10 }} onClick={() => {
                    setSelectedStore(item);
                    setIsDetailModalOpen(true);
                  }}>Xem chi tiết</Button>
                </Card>
              )) : <Empty description="Không có dữ liệu" />}

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Pagination
                  simple
                  current={pagination.current}
                  total={pagination.total}
                  pageSize={pagination.pageSize}
                  onChange={(p) => setPagination(prev => ({ ...prev, current: p }))}
                />
              </div>
            </div>
          )
        )}
      </div>

      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        title="Thông tin chi tiết"
        centered
        width={600}
      >
        {selectedStore && (
          <Descriptions column={1} bordered size="small" labelStyle={{ width: '140px', fontWeight: 'bold' }}>
            <Descriptions.Item label="Khách hàng">{selectedStore.Customer}</Descriptions.Item>
            <Descriptions.Item label="Mã cửa hàng">
              <Tag color="geekblue">{selectedStore.StoreID}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{renderStatus(selectedStore.Status)}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selectedStore.Address}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ nhận thư">{selectedStore.AddressOFF}</Descriptions.Item>
            <Descriptions.Item label="Ngày mở cửa">{selectedStore.Open}</Descriptions.Item>
            <Descriptions.Item label="Khu vực">{selectedStore.Area}</Descriptions.Item>
            <Descriptions.Item label="Công ty">{selectedStore.CompanyName}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CustomersList;
// import React, { useEffect, useState } from 'react';
// import { fetchListCustomer } from '../../../services/strapiServices';
// import * as XLSX from 'xlsx';
// import { FaFileExcel, FaSearch } from 'react-icons/fa';
// import {
//   Tag,
//   Button,
//   notification,
//   Modal,
//   Form,
//   Input,
//   Select,
//   Table,
//   Space,
//   Descriptions,
// } from 'antd';
// import './CustomersList.scss';

// const { Option } = Select;

// const CustomersList = () => {
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [form] = Form.useForm();
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   });

//   useEffect(() => {
//     loadCustomers();
//   }, []);

//   const loadCustomers = async () => {
//     try {
//       const data = await fetchListCustomer();
//       // Bỏ lọc chỉ Family Mart, lấy toàn bộ danh sách
//       const sorted = data.data.sort(
//         (a, b) =>
//           (a.attributes.StoreID || '').localeCompare(b.attributes.StoreID || '')
//       );
//       setCustomers(sorted);
//       setFilteredCustomers(sorted);
//       setLoading(false);
//     } catch (err) {
//       setError(err);
//       notification.error({
//         message: 'Lỗi tải dữ liệu!',
//         description: err.message,
//       });
//       setLoading(false);
//     }
//   };

//   const handleExport = () => {
//     if (filteredCustomers.length === 0) {
//       notification.warning({ message: 'Không có dữ liệu để xuất!' });
//       return;
//     }
//     const ws = XLSX.utils.json_to_sheet(
//       filteredCustomers.map((store) => ({
//         'Mã cửa hàng': store.attributes.StoreID,
//         'Địa chỉ': store.attributes.Address,
//         'Số điện thoại': store.attributes.Phone,
//         'Trạng thái': store.attributes.Status ? 'Mở' : 'Đóng',
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Customers');
//     XLSX.writeFile(wb, 'Customers_List.xlsx');
//   };

//   const handleSearch = (values) => {
//     let results = [...customers];

//     if (values.status && values.status !== 'Tất cả') {
//       results = results.filter(
//         (store) =>
//           (store.attributes.Status ? 'Mở' : 'Đóng') === values.status
//       );
//     }
//      if (values.Customer) {
//       results = results.filter((t) => t?.attributes?.Customer === values.Customer);
//     }
//     if (values.searchText) {
//       const searchLower = values.searchText.toLowerCase();
//       results = results.filter(
//         (store) =>
//           store.attributes.StoreID?.toLowerCase().includes(searchLower) ||
//           store.attributes.Address?.toLowerCase().includes(searchLower)
//       );
//     }

//     setFilteredCustomers(results);
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setFilteredCustomers(customers);
//   };

//   const columns = [
//     {
//       title: 'STT',
//       key: 'stt',
//       align: 'center',
//       width: 70,
//       render: (_, __, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//     },
//         {
//       title: 'Khách hàng',
//       dataIndex: ['attributes', 'Customer'],
//       width: 120,
//     },
//     {
//       title: 'Mã cửa hàng',
//       dataIndex: ['attributes', 'StoreID'],
//       width: 120,
//     },
//     {
//       title: 'Địa chỉ',
//       dataIndex: ['attributes', 'Address'],
//       width: 300,
//       ellipsis: true,
//     },
//     {
//       title: 'Số điện thoại',
//       dataIndex: ['attributes', 'Phone'],
//       width: 150,
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: ['attributes', 'Status'],
//       width: 120,
//       render: (status) => (
//         <Tag color={status ? 'green' : 'red'}>{status ? 'Mở' : 'Đóng'}</Tag>
//       ),
//     },
//     {
//       title: 'Chi tiết',
//       width: 100,
//       render: (_, record) => (
//         <Space>
//           <Button
//             size="small"
//             onClick={() => {
//               setSelectedStore(record);
//               setIsDetailModalOpen(true);
//             }}
//           >
//             Chi tiết
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div className="familymart-container">
//       {/* Form lọc */}
//       <Form
//         form={form}
//         layout="inline"
//         onFinish={handleSearch}
//         style={{ marginBottom: 20, flexWrap: 'wrap' }}
//       >
//             <Form.Item name="Customer">
//   <Select placeholder="-- Khách hàng --" style={{ width: 160 }} allowClear>
//     {[...new Set(customers.map((i) => i.attributes.Customer))].map((customer) => (
//       <Select.Option key={customer} value={customer}>
//         {customer}
//       </Select.Option>
//     ))}
//   </Select>
// </Form.Item>


//         <Form.Item name="status">
//           <Select placeholder="-- Trạng thái --" style={{ width: 160 }} allowClear>
//             <Option value="Mở">Mở</Option>
//             <Option value="Đóng">Đóng</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item name="searchText">
//           <Input placeholder="Mã / Địa chỉ" style={{ width: 200 }} />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" icon={<FaSearch />}>
//             Tìm kiếm
//           </Button>
//         </Form.Item>
//         <Form.Item>
//           <Button onClick={resetFilters}>Reset</Button>
//         </Form.Item>
//         <Form.Item>
//           <Button onClick={handleExport} icon={<FaFileExcel />}>
//             Xuất Excel
//           </Button>
//         </Form.Item>
//       </Form>

//       {/* Bảng */}
//       <Table
//         columns={columns}
//         dataSource={filteredCustomers}
//         rowKey="id"
//         pagination={{
//           ...pagination,
//           onChange: (page, pageSize) => {
//             setPagination({ current: page, pageSize });
//           },
//         }}
//         scroll={{ x: 900 }}
//       />

//       {/* Modal chi tiết */}
//       <Modal
//         open={isDetailModalOpen}
//         title="Chi tiết cửa hàng"
//         onCancel={() => setIsDetailModalOpen(false)}
//         footer={null}
//         width={600}
//       >
//         {selectedStore && (
//           <Descriptions bordered column={1} size="small">
//             <Descriptions.Item label="Mã cửa hàng">
//               {selectedStore.attributes.StoreID}
//             </Descriptions.Item>
//             <Descriptions.Item label="Địa chỉ">
//               {selectedStore.attributes.Address}
//             </Descriptions.Item>
//             <Descriptions.Item label="Số điện thoại">
//               {selectedStore.attributes.Phone}
//             </Descriptions.Item>
//             <Descriptions.Item label="Trạng thái">
//               <Tag color={selectedStore.attributes.Status ? 'green' : 'red'}>
//                 {selectedStore.attributes.Status ? 'Mở' : 'Đóng'}
//               </Tag>
//             </Descriptions.Item>
//             <Descriptions.Item label="Khu vực">
//               {selectedStore.attributes.Area || 'Không xác định'}
//             </Descriptions.Item>
//           </Descriptions>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default CustomersList;

import React, { useEffect, useState } from 'react';
import { fetchListCustomer } from '../../../services/strapiServices';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaSearch } from 'react-icons/fa';
import {
  Tag,
  Button,
  notification,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Space,
  Descriptions,
} from 'antd';
import './CustomersList.scss';

const { Option } = Select;

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    loadCustomers();

    // Lắng nghe thay đổi kích thước màn hình
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await fetchListCustomer();
      const sorted = data.data.sort(
        (a, b) =>
          (a.attributes.StoreID || '').localeCompare(b.attributes.StoreID || '')
      );
      setCustomers(sorted);
      setFilteredCustomers(sorted);
      setLoading(false);
    } catch (err) {
      setError(err);
      notification.error({
        message: 'Lỗi tải dữ liệu!',
        description: err.message,
      });
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (filteredCustomers.length === 0) {
      notification.warning({ message: 'Không có dữ liệu để xuất!' });
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      filteredCustomers.map((store) => ({
        'Mã cửa hàng': store.attributes.StoreID,
        'Địa chỉ': store.attributes.Address,
        'Số điện thoại': store.attributes.Phone,
        'Trạng thái': store.attributes.Status ? 'Mở' : 'Đóng',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, 'Customers_List.xlsx');
  };

  const handleSearch = (values) => {
    let results = [...customers];

    if (values.status && values.status !== 'Tất cả') {
      results = results.filter(
        (store) =>
          (store.attributes.Status ? 'Mở' : 'Đóng') === values.status
      );
    }
    if (values.Customer) {
      results = results.filter(
        (t) => t?.attributes?.Customer === values.Customer
      );
    }
    if (values.searchText) {
      const searchLower = values.searchText.toLowerCase();
      results = results.filter(
        (store) =>
          store.attributes.StoreID?.toLowerCase().includes(searchLower) ||
          store.attributes.Address?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCustomers(results);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredCustomers(customers);
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      align: 'center',
      width: 70,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Khách hàng',
      dataIndex: ['attributes', 'Customer'],
      width: 120,
    },
    {
      title: 'Mã cửa hàng',
      dataIndex: ['attributes', 'StoreID'],
      width: 120,
    },
    {
      title: 'Địa chỉ',
      dataIndex: ['attributes', 'Address'],
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['attributes', 'Phone'],
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: ['attributes', 'Status'],
      width: 120,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>{status ? 'Mở' : 'Đóng'}</Tag>
      ),
    },
    {
      title: 'Chi tiết',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelectedStore(record);
              setIsDetailModalOpen(true);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="familymart-container">
      {/* <h2>Danh sách khách hàng</h2> */}
      {/* Form lọc */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 20, flexWrap: 'wrap' }}
      >
        <Form.Item name="Customer">
          <Select placeholder="-- Khách hàng --" style={{ width: 160 }} allowClear>
            {[...new Set(customers.map((i) => i.attributes.Customer))].map(
              (customer) => (
                <Select.Option key={customer} value={customer}>
                  {customer}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item name="status">
          <Select placeholder="-- Trạng thái --" style={{ width: 160 }} allowClear>
            <Option value="Mở">Mở</Option>
            <Option value="Đóng">Đóng</Option>
          </Select>
        </Form.Item>

        <Form.Item name="searchText">
          <Input placeholder="Mã / Địa chỉ" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<FaSearch />}>
            Tìm kiếm
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={resetFilters}>Reset</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleExport} icon={<FaFileExcel />}>
            Xuất Excel
          </Button>
        </Form.Item>
      </Form>

      {/* Hiển thị bảng hoặc card tùy kích thước màn hình */}
      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
          scroll={{ x: 900 }}
        />
      ) : (
        <div className="customer-cards">
          {filteredCustomers.map((item, idx) => (
            <div key={item.id} className="customer-card">
              <p>
                <b>#{idx + 1}</b> {item.attributes.Customer}
              </p>
              <p><b>Mã cửa hàng:</b> {item.attributes.StoreID}</p>
              <p><b>Địa chỉ:</b> {item.attributes.Address}</p>
              <p><b>Số điện thoại:</b> {item.attributes.Phone}</p>
              <Tag color={item.attributes.Status ? 'green' : 'red'}>
                {item.attributes.Status ? 'Mở' : 'Đóng'}
              </Tag>
              <div style={{ marginTop: 6 }}>
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedStore(item);
                    setIsDetailModalOpen(true);
                  }}
                >
                  Chi tiết
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết */}
      <Modal
        open={isDetailModalOpen}
        title="Chi tiết cửa hàng"
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedStore && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã cửa hàng">
              {selectedStore.attributes.StoreID}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedStore.attributes.Address}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedStore.attributes.Phone}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedStore.attributes.Status ? 'green' : 'red'}>
                {selectedStore.attributes.Status ? 'Mở' : 'Đóng'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Khu vực">
              {selectedStore.attributes.Area || 'Không xác định'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CustomersList;

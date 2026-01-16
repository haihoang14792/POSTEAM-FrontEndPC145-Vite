import React, { useEffect, useState } from 'react';
import { fetchListWarehouse } from '../../../services/dhgServices';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaSearch, FaBuilding, FaPlus, FaEdit } from 'react-icons/fa';
import 'react-tabs/style/react-tabs.css';
import './WarehouseListPage.scss';
import AddWarehouseListModal from './AddWarehouseListModal';
import UpdateWarehouseListModal from './UpdateWarehouseListModal';

const WarehouseListPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const warehouseData = await fetchListWarehouse();
        console.log("Data nhận từ API:", warehouseData);
        setWarehouses(warehouseData.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    loadWarehouses();
  }, []);



  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      warehouses.map(warehouse => ({
        "Tên kho": warehouse.attributes.NameKho,
        "Mô tả kho": warehouse.attributes.DescriptionKho,
        "Kiểu kho": warehouse.attributes.TypeKho,
        "Địa chỉ kho": warehouse.attributes.Address
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Warehouses");
    XLSX.writeFile(wb, "Suppliers_List.xlsx");
  };

  const handleAddSupplier = () => {
    setIsModalVisible(true);
  };

  // Callback nhận dữ liệu warehouse mới từ modal thêm
  const handleModalOk = (newWarehouseData) => {
    setWarehouses(prev => [...prev, newWarehouseData]);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Mở modal cập nhật
  const handleUpdateWarehouse = () => {
    if (selectedWarehouse) {
      setIsUpdateModalVisible(true);
    }
  };

  // Callback sau khi cập nhật warehouse thành công
  const handleUpdateModalOk = (updatedWarehouseData) => {
    setWarehouses(prev =>
      prev.map(warehouse =>
        warehouse.id === updatedWarehouseData.id ? updatedWarehouseData : warehouse
      )
    );
    setSelectedWarehouse(updatedWarehouseData);
    setIsUpdateModalVisible(false);
  };

  const handleUpdateModalCancel = () => {
    setIsUpdateModalVisible(false);
  };

  const filteredWarehouses = warehouses.filter(warehouse => {
    const name = warehouse.attributes.NameKho?.toLowerCase().trim() || "";
    const search = searchTerm.trim().toLowerCase();
    return name.includes(search);
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="warehouse-container-ware">
      <div className="header-actions">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm kho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <button onClick={handleExport} className="btn btn-primary">
          <FaFileExcel /> Xuất Excel
        </button>
        <button onClick={handleAddSupplier} className="btn btn-success">
          <FaPlus /> Thêm kho
        </button>
      </div>

      <div className="split-container-ware">
        <div className="panel-list-ware">
          <h3 className="panel-title">Kho</h3>
          <ul>
            {filteredWarehouses.map(warehouse => (
              <li
                key={warehouse.id}
                className={`warehouse-item ${selectedWarehouse?.id === warehouse.id ? 'active' : ''}`}
                onClick={() => setSelectedWarehouse(warehouse)}
              >
                <FaBuilding className="warehouse-icon" /> {warehouse.attributes.NameKho}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel-details-ware">
          <h3 className="panel-title">Chi tiết kho</h3>
          {selectedWarehouse ? (
            <div className="warehouse-details">
              <p><strong>Tên kho:</strong> {selectedWarehouse.attributes.NameKho}</p>
              <p><strong>Mô tả kho:</strong> {selectedWarehouse.attributes.DescriptionKho}</p>
              <p><strong>Kiểu kho:</strong> {selectedWarehouse.attributes.TypeKho}</p>
              <p><strong>Địa chỉ:</strong> {selectedWarehouse.attributes.Address}</p>
              <button onClick={handleUpdateWarehouse} className="btn btn-warning">
                <FaEdit /> Cập nhật tên kho
              </button>
            </div>
          ) : (
            <p>Chọn kho để xem chi tiết</p>
          )}
        </div>
      </div>

      {/* Modal thêm nhà cung cấp */}
      <AddWarehouseListModal
        isModalOpen={isModalVisible}
        onCancel={handleModalCancel}
        onCreated={handleModalOk}
      />

      {/* Modal cập nhật nhà cung cấp */}
      <UpdateWarehouseListModal
        isModalOpen={isUpdateModalVisible}
        onCancel={handleUpdateModalCancel}
        warehouseData={selectedWarehouse}
        onUpdated={handleUpdateModalOk}
      />
    </div>
  );
};

export default WarehouseListPage;

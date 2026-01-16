import React, { useEffect, useState } from 'react';
import { fetchListSupplier } from '../../../services/dhgServices';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaSearch, FaBuilding, FaPlus, FaEdit } from 'react-icons/fa';
import 'react-tabs/style/react-tabs.css';
import './SupplierList.scss';
import AddSupplierModal from './AddSupplierModal';
import UpdateSupplierModal from './UpdateSupplierModal';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const suppliersData = await fetchListSupplier();
                setSuppliers(suppliersData.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        loadSuppliers();
    }, []);

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(
            suppliers.map(supplier => ({
                "Tên NCC": supplier.attributes.NameNCC,
                "Số điện thoại": supplier.attributes.Phone,
                "Email": supplier.attributes.Email,
                "Sản phẩm": supplier.attributes.Product,
                "Người liên hệ": supplier.attributes.NameContact
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
        XLSX.writeFile(wb, "Suppliers_List.xlsx");
    };

    const handleAddSupplier = () => {
        setIsModalVisible(true);
    };

    // Callback nhận dữ liệu supplier mới từ modal thêm
    const handleModalOk = (newSupplierData) => {
        setSuppliers(prev => [...prev, newSupplierData]);
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    // Mở modal cập nhật
    const handleUpdateSupplier = () => {
        if (selectedSupplier) {
            setIsUpdateModalVisible(true);
        }
    };

    // Callback sau khi cập nhật supplier thành công
    const handleUpdateModalOk = (updatedSupplierData) => {
        setSuppliers(prev =>
            prev.map(supplier =>
                supplier.id === updatedSupplierData.id ? updatedSupplierData : supplier
            )
        );
        setSelectedSupplier(updatedSupplierData);
        setIsUpdateModalVisible(false);
    };

    const handleUpdateModalCancel = () => {
        setIsUpdateModalVisible(false);
    };

    const filteredSuppliers = suppliers.filter(supplier => {
        const name = supplier.attributes.NameNCC?.toLowerCase().trim() || "";
        const search = searchTerm.trim().toLowerCase();
        return name.includes(search);
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="supplier-container-sup">
            <div className="header-actions">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhà cung cấp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={(e) => e.target.select()}
                    />
                </div>
                <button onClick={handleExport} className="btn btn-primary">
                    <FaFileExcel /> Xuất Excel
                </button>
                <button onClick={handleAddSupplier} className="btn btn-success">
                    <FaPlus /> Thêm nhà cung cấp
                </button>
            </div>

            <div className="split-container-sup">
                <div className="panel-list-sup">
                    <h3 className="panel-title">Nhà cung cấp</h3>
                    <ul>
                        {filteredSuppliers.map(supplier => (
                            <li
                                key={supplier.id}
                                className={`supplier-item ${selectedSupplier?.id === supplier.id ? 'active' : ''}`}
                                onClick={() => setSelectedSupplier(supplier)}
                            >
                                <FaBuilding className="supplier-icon" /> {supplier.attributes.NameNCC}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="panel-details-sup">
                    <h3 className="panel-title">Chi tiết nhà cung cấp</h3>
                    {selectedSupplier ? (
                        <div className="supplier-details">
                            <p><strong>Nhà cung cấp:</strong> {selectedSupplier.attributes.NameNCC}</p>
                            <p><strong>Số điện thoại:</strong> {selectedSupplier.attributes.Phone}</p>
                            <p><strong>Email:</strong> {selectedSupplier.attributes.Email}</p>
                            <p><strong>Sản phẩm:</strong> {selectedSupplier.attributes.Product}</p>
                            <p><strong>Người liên hệ:</strong> {selectedSupplier.attributes.NameContact}</p>
                            <button onClick={handleUpdateSupplier} className="btn btn-warning">
                                <FaEdit /> Cập nhật nhà cung cấp
                            </button>
                        </div>
                    ) : (
                        <p>Chọn một nhà cung cấp để xem chi tiết</p>
                    )}
                </div>
            </div>

            {/* Modal thêm nhà cung cấp */}
            <AddSupplierModal
                isModalOpen={isModalVisible}
                onCancel={handleModalCancel}
                onCreated={handleModalOk}
            />

            {/* Modal cập nhật nhà cung cấp */}
            <UpdateSupplierModal
                isModalOpen={isUpdateModalVisible}
                onCancel={handleUpdateModalCancel}
                supplierData={selectedSupplier}
                onUpdated={handleUpdateModalOk}
            />
        </div>
    );
};

export default SupplierList;

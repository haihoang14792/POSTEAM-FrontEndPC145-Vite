import React, { useEffect, useState } from 'react';
import { fetchDeviceList } from '../../../../services/storeServices';
import { useParams } from 'react-router-dom';

const DeviceFMV = () => {
    const { storeID } = useParams();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!storeID) return;

        const loadDevices = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetchDeviceList(storeID);
                console.log("📌 Dữ liệu từ API:", response);

                if (!response || !Array.isArray(response)) {
                    throw new Error("API trả về dữ liệu không đúng định dạng!");
                }

                const devicesData = response.map((item) => ({
                    id: item.id,
                    ...item.attributes, // Trích xuất toàn bộ dữ liệu từ `attributes`
                }));

                setDevices(devicesData);
            } catch (err) {
                console.error("❌ Lỗi khi fetch dữ liệu:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadDevices();
    }, [storeID]);

    if (loading) return <p>🔄 Đang tải dữ liệu...</p>;
    if (error) return <p>❌ Lỗi: {error.message}</p>;

    return (
        <div>
            <h2>Thiết bị FMV - Cửa hàng {storeID}</h2>
            <table className="table table-bordered table-hover mt-2">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Khách Hàng</th>
                        <th>Ngày Giao</th>
                        <th>Tên Thiết Bị</th>
                        <th>Thương Hiệu</th>
                        <th>Model</th>
                        <th>Serial Number</th>
                        <th>Cửa Hàng</th>
                        <th>Vị Trí</th>
                        <th>Trạng Thái</th>
                        <th>Ghi Chú</th>
                        <th>Ngày Tạo</th>
                        <th>Ngày Cập Nhật</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.length > 0 ? devices.map((device, index) => (
                        <tr key={device.id}>
                            <td>{index + 1}</td>
                            <td>{device.Customer}</td>
                            <td>{device.DeliveryDate ? new Date(device.DeliveryDate).toLocaleDateString("vi-VN") : "N/A"}</td>
                            <td>{device.DeviceName}</td>
                            <td>{device.BrandName}</td>
                            <td>{device.Model}</td>
                            <td>{device.SerialNumber}</td>
                            <td>{device.Store}</td>
                            <td>{device.Location}</td>
                            <td>{device.Status}</td>
                            <td>{device.Note || "Không có ghi chú"}</td>
                            <td>{device.createdAt ? new Date(device.createdAt).toLocaleDateString("vi-VN") : "N/A"}</td>
                            <td>{device.updatedAt ? new Date(device.updatedAt).toLocaleDateString("vi-VN") : "N/A"}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="13">🚫 Không có thiết bị nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DeviceFMV;

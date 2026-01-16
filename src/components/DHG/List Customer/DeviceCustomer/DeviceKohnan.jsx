import React, { useEffect, useState } from 'react';
import { fetchDeviceListv1 } from '../../../../services/storeServices'; // Giả sử bạn có hàm fetchDeviceList
import { useParams } from 'react-router-dom';

const DeviceKohnan = () => {
    const { storeID } = useParams();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDevices = async () => {
            try {
                const devicesData = await fetchDeviceListv1(storeID);
                // Kiểm tra xem devicesData có phải là mảng và có dữ liệu hay không
                if (devicesData && Array.isArray(devicesData)) {
                    setDevices(devicesData);
                } else {
                    setError(new Error('Dữ liệu trả về từ API không hợp lệ'));
                }

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        loadDevices();
    }, [storeID]);



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>Thiết bị Kohnan {storeID}</h2>
            <table className="table table-bordered table-hover mt-2">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Device Name</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Model</th>
                        <th scope="col">Serial Number</th>
                        <th scope="col">Location</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.length > 0 ? devices.map((device, index) => (
                        <tr key={device.id}>
                            <td>{index + 1}</td>
                            <td>{device.attributes.DeviceName}</td>
                            <td>{device.attributes.BrandName}</td>
                            <td>{device.attributes.Model}</td>
                            <td>{device.attributes.SerialNumber}</td>
                            <td>{device.attributes.DeviceLocation}</td>
                            <td>{device.attributes.Status ? "Hoạt động" : "Ngừng hoạt động"}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7">Không có thiết bị nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DeviceKohnan;

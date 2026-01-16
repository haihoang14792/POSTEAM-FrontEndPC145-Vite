import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  fetchDevice,
  updateDeviceStatus,
} from "../../../services/strapiServices";
import ModalStore from "./ModalStore";
import { useParams } from "react-router-dom";
import { deleteDevices } from "../../../services/storeServices";

const Devices = () => {
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState([]);

  const { storeId } = useParams(); // Sử dụng hook useParams để lấy storeId từ URL

  // Load store details when storeId changes
  useEffect(() => {
    const loadDeviceDetails = async () => {
      try {
        const deviceDetailsData = await fetchDevice(storeId);
        console.log("Dữ liệu trả về từ API:", deviceDetailsData);

        if (deviceDetailsData && Array.isArray(deviceDetailsData)) {
          setDeviceDetails(deviceDetailsData);
        } else {
          setError(new Error("Dữ liệu trả về từ API không hợp lệ"));
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadDeviceDetails();
  }, [storeId]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleConfirm = async (deviceId) => {
    try {
      const updatedDevice = await updateDeviceStatus(deviceId, {
        Status: true,
      });
      console.log("Cập nhật thiết bị:", updatedDevice);

      setDeviceDetails((prevDetails) =>
        prevDetails.map((device) =>
          device.id === deviceId
            ? { ...device, attributes: { ...device.attributes, Status: true } }
            : device
        )
      );
    } catch (error) {
      console.error("Error updating device status:", error);
    }
  };

  const handleAddDevice = (newDevice) => {
    setDeviceDetails((prevDetails) => [...prevDetails, newDevice]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDevices(deviceDetails.map((device) => device.id));
    } else {
      setSelectedDevices([]);
    }
  };

  const handleSelectDevice = (e, deviceId) => {
    if (e.target.checked) {
      setSelectedDevices((prev) => [...prev, deviceId]);
    } else {
      setSelectedDevices((prev) => prev.filter((id) => id !== deviceId));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteDevices(selectedDevices);
      setDeviceDetails((prevDetails) =>
        prevDetails.filter((device) => !selectedDevices.includes(device.id))
      );
      setSelectedDevices([]);
    } catch (error) {
      console.error("Error deleting devices:", error);
    }
  };

  const totalPages = Math.ceil(deviceDetails.length / itemsPerPage);
  const currentPageData = deviceDetails.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="mt-3">Danh sách thiết bị cho cửa hàng {storeId}</h2>
      <hr />
      <div className="container">
        <div className="store-header">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fa fa-plus mt-2"></i> Thêm thiết bị
          </button>
          <button
            className="btn btn-danger ml-2"
            onClick={handleDeleteSelected}
            disabled={selectedDevices.length === 0}
          >
            Xóa thiết bị đã chọn
          </button>
          <ModalStore
            showModal={showModal}
            handleClose={() => setShowModal(false)}
            handleAddDevice={handleAddDevice}
          />
        </div>
        <table className="table table-bordered table-hover mt-2">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedDevices.length === deviceDetails.length}
                />
              </th>
              <th scope="col">STT</th>
              <th scope="col">Location</th>
              <th scope="col">Item</th>
              <th scope="col">Model</th>
              <th scope="col">Qty</th>
              <th scope="col">Serial Number</th>
              <th scope="col">Trạng thái</th>
              <th>Xác nhận</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((device, index) => (
                <tr key={device.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedDevices.includes(device.id)}
                      onChange={(e) => handleSelectDevice(e, device.id)}
                    />
                  </td>
                  <td>{currentPage * itemsPerPage + index + 1}</td>
                  <td>{device.attributes.Location}</td>
                  <td>{device.attributes.Item}</td>
                  <td>{device.attributes.Model}</td>
                  <td>{device.attributes.Qty}</td>
                  <td>{device.attributes.SerialNumber}</td>
                  <td>
                    {device.attributes.Status
                      ? "Hoàn thành"
                      : "Chưa hoàn thành"}
                  </td>
                  <td>
                    {!device.attributes.Status && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleConfirm(device.id)}
                      >
                        Xác nhận
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={"Trước"}
            nextLabel={"Sau"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  );
};

export default Devices;

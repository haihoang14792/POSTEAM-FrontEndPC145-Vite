import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Đảm bảo bạn đã cài đặt react-bootstrap

const ImportModal = ({ show, onClose, data, onConfirm }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận nhập dữ liệu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Store Number</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Opening</th>
                            <th>Close</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.StoreID}</td>
                                <td>{row.Address}</td>
                                <td>{row.Phone}</td>
                                <td>{row.Open ? row.Open.toLocaleDateString() : ""}</td>
                                <td>{row.Close ? row.Close.toLocaleDateString() : ""}</td>
                                <td>{row.Status ? "Mở" : "Đóng"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImportModal;

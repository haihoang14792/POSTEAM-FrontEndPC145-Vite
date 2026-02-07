import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImportModalDevice = ({ show, handleClose, handleConfirmImport, fileName }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn có chắc chắn muốn import file <strong>{fileName}</strong> không?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleConfirmImport}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImportModalDevice;

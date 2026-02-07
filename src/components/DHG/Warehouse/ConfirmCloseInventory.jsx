import React from 'react';
import './ConfirmCloseInventory.scss';

const ConfirmCloseInventory = ({ onConfirm, onCancel }) => {
    return (
        <div className="confirm-close-inventory-modal">
            <div className="confirm-modal-content">
                <p className="text-lg font-semibold mb-4 text-gray-900 dark:text-black">
                    Bạn có chắc chắn muốn chốt kho POS tháng này không?
                </p>
                <div className="confirm-modal-buttons">
                    <button className="btn btn-secondary" onClick={onCancel}>Hủy</button>
                    <button className="btn btn-success" onClick={onConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCloseInventory;

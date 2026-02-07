// import { useState } from "react";
// import { Modal, Input, message } from "antd";

// const ExportInvoiceModal = ({ visible, onClose, onConfirm, ticketId, invoiceNumber, setInvoiceNumber }) => {
//     const handleConfirm = async () => {
//         if (!invoiceNumber.trim()) {
//             message.warning("Vui lòng nhập số hóa đơn!");
//             return;
//         }

//         await onConfirm(ticketId, invoiceNumber);
//         onClose();
//     };

//     return (
//         <Modal
//             title="Xác nhận xuất hóa đơn"
//             visible={visible}
//             onCancel={onClose}
//             onOk={handleConfirm}
//         >
//             <Input
//                 placeholder="Nhập số hóa đơn"
//                 value={invoiceNumber}
//                 onChange={(e) => setInvoiceNumber(e.target.value)}
//             />
//         </Modal>
//     );
// };

// export default ExportInvoiceModal;


import { Modal, Input, message } from "antd";

const ExportInvoiceModal = ({ visible, onClose, onConfirm, ticketId, invoiceNumber, setInvoiceNumber }) => {
    const handleConfirm = async () => {
        if (!invoiceNumber.trim()) {
            message.warning("Vui lòng nhập số hóa đơn!");
            return;
        }

        await onConfirm(ticketId, invoiceNumber);
        onClose();
    };

    return (
        <Modal
            title="Xác nhận xuất hóa đơn"
            // Thay đổi từ visible thành open để sửa lỗi cảnh báo
            open={visible}
            onCancel={onClose}
            onOk={handleConfirm}
            // Thêm thuộc tính này nếu bạn muốn reset nội dung sau khi đóng
            destroyOnClose={true}
        >
            <Input
                placeholder="Nhập số hóa đơn"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
            />
        </Modal>
    );
};

export default ExportInvoiceModal;
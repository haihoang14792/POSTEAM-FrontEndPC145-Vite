// import React, { useState, useEffect } from 'react';
// import { CModal, CModalBody, CModalHeader, CModalTitle, CButton } from '@coreui/react';

// const WelcomePopup = () => {
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         // Kiểm tra xem đã hiển thị popup lần nào chưa
//         const hasSeen = localStorage.getItem('hasSeenInternalPopup');
//         if (!hasSeen) {
//             setVisible(true);
//         }
//     }, []);

//     const handleClose = () => {
//         setVisible(false);
//         // Lưu trạng thái để không hiện lại
//         localStorage.setItem('hasSeenInternalPopup', 'true');
//     };

//     return (
//         <CModal
//             alignment="center"
//             visible={visible}
//             onClose={handleClose}
//             size="lg"
//             backdrop="static" // Ngăn đóng khi bấm ra ngoài nếu muốn bắt buộc xem
//         >
//             <CModalHeader>
//                 <CModalTitle>📢 Thông Báo Nội Bộ</CModalTitle>
//             </CModalHeader>
//             <CModalBody className="text-center">
//                 {/* Bạn thay đổi link hình ảnh/gif hoặc video của bạn ở đây */}
//                 <img
//                     src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXF4Z3RrZ3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxcaqzD08o/giphy.gif"
//                     alt="Notification"
//                     style={{ width: '100%', borderRadius: '8px' }}
//                 />
//                 <div className="mt-3">
//                     <p className="fw-bold">Chào mừng bạn đến với hệ thống quản lý POSTEAM!</p>
//                 </div>
//             </CModalBody>
//             <div className="p-3 text-end">
//                 <CButton color="primary" onClick={handleClose}>
//                     Tôi đã hiểu
//                 </CButton>
//             </div>
//         </CModal>
//     );
// };

// export default WelcomePopup;

import React, { useState, useEffect } from 'react';
import { CModal, CModalBody } from '@coreui/react';

const WelcomePopup = ({
    imageUrl = "",
    storageKey = "session_popup_active"
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Đổi từ localStorage sang sessionStorage
        const hasSeenInSession = sessionStorage.getItem(storageKey);

        if (!hasSeenInSession && imageUrl) {
            setVisible(true);
        }
    }, [storageKey, imageUrl]);

    const handleClose = () => {
        setVisible(false);
        // Lưu vào session: Tắt web mở lại sẽ tự xóa dòng này và hiện lại popup
        sessionStorage.setItem(storageKey, 'true');
    };

    return (
        <CModal
            alignment="center"
            visible={visible}
            onClose={handleClose}
            size="lg"
            contentClassName="bg-transparent border-0 shadow-none"
        >
            <CModalBody className="p-0 position-relative text-center">
                {/* Nút đóng nhanh (X) */}
                {/* <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        zIndex: 1060,
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '35px',
                        height: '35px',
                        fontSize: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ✕
                </button> */}

                {/* Chỉ hiển thị hình ảnh, click vào cũng đóng được */}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Popup Banner"
                        onClick={handleClose}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                    />
                )}
            </CModalBody>
        </CModal>
    );
};

export default WelcomePopup;
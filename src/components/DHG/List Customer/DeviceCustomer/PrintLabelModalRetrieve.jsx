// import { Modal, Button } from "antd";

// const PrintLabelModalRetrieve = ({ visible, onClose, deviceData }) => {
//     const handlePrint = () => {
//         if (!deviceData) return;

//         const formatDate = (isoString) => {
//             const date = new Date(isoString);
//             return date.toLocaleDateString('vi-VN'); // Định dạng dd/mm/yyyy theo locale Việt Nam
//         };

//         const formattedDeliveryDate = formatDate(deviceData.DeliveryDate);
//         const formattedCreatedAt = formatDate(deviceData.createdAt);
//         // Chuyển đổi trạng thái
//         let fixedStatus = "Unknown status";
//         if (deviceData.Status === "Thu hồi") {
//             fixedStatus = "Device error";
//         } else if (deviceData.Status === "Đang sử dụng") {
//             fixedStatus = "Device is active";
//         }

//         const labelUrl = `http://api.labelary.com/v1/printers/8dpmm/labels/3.15x1.97/0/quality=grayscale&width=80&height=50&units=mm&index=0&rotation=0&zpl=
//     %5EXA%0A
//     %5EFO15%2C15%5EGFA%2C924%2C924%2C11%2CgGF%2C%3A%3A%3A%3AFCJ03MFCJ03F%2CF8K01KFCK01F%2CF8L03IFCL01F%2CF8M07FEM01F%2CF8N0F8M01F%2CF8W01F%2C%3A%3A%3A%3A%3AF800FEO03F001F%2CF800IFM07FF001F%2CF800IF8K01IF001F%2CF800IFM0IF001F%2CF800FFEM07FF001F%2CF8007FCM03FF001F%2CF8007F8M01FE001F%2CF8007FO0FE001F%2CF8007EJ0FJ03E001F%2CFC007CI01F8I03E001F%2CFC0078I07FEI01E003F%2CFC003J0IFJ0E003F%2CFC002I01IF8I04003F%2CFCL03IFCL03F%2CFEL07IFEL03F%2CFEL0KFL07F%2CFEK01KF8K07F%2CFEK03KFCK07F%2CFFK07KFEK0FF%2CFFK0MFK0FF%2CFFJ01MF8J0FF%2CFF8I03MFCI01FF%2C%3AFFCI07MFEI01FF%2CFFCI0OFI03FF%2C%3A%3A%3AFFCI07MFEI03FF%2CFF8I03MFCI01FF%2C%3AFFJ01MF8J0FF%2CFFK0MFK0FF%2CFFK07KFEK0FF%2CFEK03KFCK07F%2CFEK01KF8K07F%2CFEL0KFL07F%2CFCL07IFEL07F%2CFCL03IFCL03F%2CFC002I01IF8I04003F%2CFC003J0IFJ0C003F%2CFC0078I03FEI01E003F%2CF8007CI01F8I03E003F%2CF8007EJ0FJ07E001F%2CF8007FO0FE001F%2CF8007F8M01FE001F%2CF800FFCM03FE001F%2CF800FFEM07FF001F%2CF800IFM0IF001F%2CF800IF8K01IF001F%2CF800FFEM0IF001F%2CF800F8O03F001F%2CF8W01F%2C%3A%3A%3A%3A%3AF8N0F8M01F%2CF8M07FEM01F%2CF8L03IFCL01F%2CF8K03KFCK01F%2CFCJ07MFCJ03F%2CgGF%2C%3A%3A%3A%3A%5EFS%0A
//     %5ECF0%2C30%0A
//     %5EFO120%2C40%5EFDDAI%20HOANG%20GIA%20Trading%20Co.%2C%20Ltd%5EFS%0A
//     %5ECF0%2C25%0A
//     %5EFO10%2C120%5EFDStore%20%3A%20${encodeURIComponent(deviceData.StoreRecall)}%5EFS%0A
//     %5EFO300%2C120%5EFDLocation%20%3A%20${encodeURIComponent(deviceData.Location)}%5EFS%0A
//     %5EFO10%2C160%5EFDDevices%20Name%3A%20${encodeURIComponent(deviceData.DeviceName)}%5EFS%0A
//     %5EFO300%2C160%5EFDModel%20%3A%20${encodeURIComponent(deviceData.Model)}%5EFS%0A
//     %5EFO10%2C200%5EFDS%2FN%20%3A%20${encodeURIComponent(deviceData.SerialNumber)}%5EFS%0A
//     %5EFO300%2C200%5EFDDate%20of%20delivery%20%3A%20${encodeURIComponent(formattedDeliveryDate)}%5EFS%0A
//     %5EFO10%2C240%5EFDRevocation%20date%3A%20${encodeURIComponent(formattedCreatedAt)}%5EFS%0A
//      %5EFO300%2C240%5EFDReceiving%20%3A%20${encodeURIComponent(deviceData.Store)}%5EFS%0A
//     %5EFO10%2C280%5EFDReason%20for%20recall%3A%20${encodeURIComponent(fixedStatus)}%5EFS%0A
//     %5EBY2%2C2%2C50%0A
//     %5EFO280%2C320%5EBC%5EFD${encodeURIComponent(deviceData.SerialNumber)}%5EFS%0A
//     %5EXZ`;

//         window.open(labelUrl, "_blank");
//     };


//     // Định nghĩa style
//     const rowStyle = {
//         fontSize: "16px",
//         margin: "8px 0",
//         padding: "5px 10px",
//         background: "#f9f9f9",
//         borderRadius: "8px",
//         display: "flex",
//         justifyContent: "space-between",
//     };

//     const labelStyle = {
//         color: "#333",
//         fontWeight: "bold",
//     };

//     // return (
//     //     <Modal title="In Nhãn Thiết Bị" visible={visible} onCancel={onClose} footer={null}>
//     //         {deviceData ? (
//     //             <>
//     //                 <p><b>Cửa Hàng:</b> {deviceData?.StoreRecall}</p>
//     //                 <p><b>Vị trí:</b> {deviceData.Location}</p>
//     //                 <p><b>Tên Thiết Bị:</b> {deviceData.DeviceName}</p>
//     //                 <p><b>Model:</b> {deviceData.Model}</p>
//     //                 <p><b>Serial:</b> {deviceData.SerialNumber}</p>
//     //                 <p><b>Ngày thu hồi:</b> {new Date(deviceData.createdAt).toLocaleDateString('vi-VN')}</p>
//     //                 <Button type="primary" onClick={handlePrint}>
//     //                     In Nhãn
//     //                 </Button>
//     //             </>
//     //         ) : (
//     //             <p>Không tìm thấy dữ liệu thiết bị.</p>
//     //         )}
//     //     </Modal>
//     // );
//     return (
//         <Modal
//             title="In Nhãn Thiết Bị"
//             visible={visible}
//             onCancel={onClose}
//             footer={null}
//             style={{ borderRadius: "10px", overflow: "hidden" }}
//         >
//             {deviceData ? (
//                 <div style={{ fontFamily: "Arial, sans-serif", padding: "10px" }}>
//                     <p style={{ ...rowStyle }}>
//                         <b style={labelStyle}>Cửa Hàng:</b> <span>{deviceData?.StoreRecall}</span>
//                     </p>
//                     <p style={{ ...rowStyle }}>
//                         <b style={labelStyle}>Vị trí:</b> <span>{deviceData.Location}</span>
//                     </p>
//                     <p style={{ ...rowStyle }}>
//                         <b style={labelStyle}>Tên Thiết Bị:</b> <span>{deviceData.DeviceName}</span>
//                     </p>
//                     <p style={{ ...rowStyle }}>
//                         <b style={labelStyle}>Model:</b> <span>{deviceData.Model}</span>
//                     </p>
//                     <p style={{ ...rowStyle }}>
//                         <b style={labelStyle}>Serial:</b> <span>{deviceData.SerialNumber}</span>
//                     </p>
//                     <p style={{ ...rowStyle }}>
//                         <b style={labelStyle}>Ngày thu hồi:</b>{" "}
//                         <span>{new Date(deviceData.createdAt).toLocaleDateString("vi-VN")}</span>
//                     </p>
//                     <Button
//                         type="primary"
//                         onClick={handlePrint}
//                         style={{
//                             width: "100%",
//                             background: "#1890ff",
//                             borderRadius: "8px",
//                             height: "40px",
//                             fontSize: "16px",
//                             marginTop: "15px",
//                             transition: "0.3s",
//                         }}
//                     >
//                         In Nhãn
//                     </Button>
//                 </div>
//             ) : (
//                 <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
//                     Không tìm thấy dữ liệu thiết bị.
//                 </p>
//             )}
//         </Modal>
//     );


// };

// export default PrintLabelModalRetrieve;

import { Modal, Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, EnvironmentOutlined, BarcodeOutlined, CalendarOutlined } from "@ant-design/icons";

const PrintLabelModalRetrieve = ({ visible, onClose, deviceData }) => {
    if (!deviceData) return null;

    const formatDate = (isoString) => new Date(isoString).toLocaleDateString("vi-VN");

    const formattedDeliveryDate = formatDate(deviceData.DeliveryDate);
    const formattedCreatedAt = formatDate(deviceData.createdAt);

    let fixedStatus = "Unknown status";
    let statusColor = "#888";
    let StatusIcon = null;
    if (deviceData.Status === "Thu hồi") {
        fixedStatus = "Device error";
        statusColor = "#ff4d4f";
        StatusIcon = <CloseCircleOutlined style={{ color: statusColor, fontSize: "18px" }} />;
    }
    if (deviceData.Status === "Đang sử dụng") {
        fixedStatus = "Device is active";
        statusColor = "#52c41a";
        StatusIcon = <CheckCircleOutlined style={{ color: statusColor, fontSize: "18px" }} />;
    }

    const storeRecall = deviceData.StoreRecall ? deviceData.StoreRecall : deviceData.Store;

    const handlePrint = () => {
        if (!deviceData) return;

        const labelUrl = `http://api.labelary.com/v1/printers/8dpmm/labels/3.15x1.97/0/quality=grayscale&width=80&height=50&units=mm&index=0&rotation=0&zpl=
            %5EXA%0A
             %5EFO15%2C15%5EGFA%2C924%2C924%2C11%2CgGF%2C%3A%3A%3A%3AFCJ03MFCJ03F%2CF8K01KFCK01F%2CF8L03IFCL01F%2CF8M07FEM01F%2CF8N0F8M01F%2CF8W01F%2C%3A%3A%3A%3A%3AF800FEO03F001F%2CF800IFM07FF001F%2CF800IF8K01IF001F%2CF800IFM0IF001F%2CF800FFEM07FF001F%2CF8007FCM03FF001F%2CF8007F8M01FE001F%2CF8007FO0FE001F%2CF8007EJ0FJ03E001F%2CFC007CI01F8I03E001F%2CFC0078I07FEI01E003F%2CFC003J0IFJ0E003F%2CFC002I01IF8I04003F%2CFCL03IFCL03F%2CFEL07IFEL03F%2CFEL0KFL07F%2CFEK01KF8K07F%2CFEK03KFCK07F%2CFFK07KFEK0FF%2CFFK0MFK0FF%2CFFJ01MF8J0FF%2CFF8I03MFCI01FF%2C%3AFFCI07MFEI01FF%2CFFCI0OFI03FF%2C%3A%3A%3AFFCI07MFEI03FF%2CFF8I03MFCI01FF%2C%3AFFJ01MF8J0FF%2CFFK0MFK0FF%2CFFK07KFEK0FF%2CFEK03KFCK07F%2CFEK01KF8K07F%2CFEL0KFL07F%2CFCL07IFEL07F%2CFCL03IFCL03F%2CFC002I01IF8I04003F%2CFC003J0IFJ0C003F%2CFC0078I03FEI01E003F%2CF8007CI01F8I03E003F%2CF8007EJ0FJ07E001F%2CF8007FO0FE001F%2CF8007F8M01FE001F%2CF800FFCM03FE001F%2CF800FFEM07FF001F%2CF800IFM0IF001F%2CF800IF8K01IF001F%2CF800FFEM0IF001F%2CF800F8O03F001F%2CF8W01F%2C%3A%3A%3A%3A%3AF8N0F8M01F%2CF8M07FEM01F%2CF8L03IFCL01F%2CF8K03KFCK01F%2CFCJ07MFCJ03F%2CgGF%2C%3A%3A%3A%3A%5EFS%0A
             %5ECF0%2C30%0A
             %5EFO120%2C40%5EFDDAI%20HOANG%20GIA%20Trading%20Co.%2C%20Ltd%5EFS%0A
             %5ECF0%2C25%0A
             %5EFO10%2C120%5EFDStore%20%3A%20${encodeURIComponent(storeRecall)}%5EFS%0A
             %5EFO300%2C120%5EFDLocation%20%3A%20${encodeURIComponent(deviceData.Location)}%5EFS%0A
             %5EFO10%2C160%5EFDDevices%20Name%3A%20${encodeURIComponent(deviceData.DeviceName)}%5EFS%0A
             %5EFO300%2C160%5EFDModel%20%3A%20${encodeURIComponent(deviceData.Model)}%5EFS%0A
             %5EFO10%2C200%5EFDS%2FN%20%3A%20${encodeURIComponent(deviceData.SerialNumber)}%5EFS%0A
             %5EFO300%2C200%5EFDDate%20of%20delivery%20%3A%20${encodeURIComponent(formattedDeliveryDate)}%5EFS%0A
             %5EFO10%2C240%5EFDRevocation%20date%3A%20${encodeURIComponent(formattedCreatedAt)}%5EFS%0A
              %5EFO300%2C240%5EFDReceiving%20%3A%20${encodeURIComponent(deviceData.Store)}%5EFS%0A
             %5EFO10%2C280%5EFDReason%20for%20recall%3A%20${encodeURIComponent(fixedStatus)}%5EFS%0A
             %5EBY1%2C2%2C70%0A
             %5EFO400%2C310%5EBC%5EFD${encodeURIComponent(deviceData.SerialNumber)}%5EFS%0A
             %5EXZ`;

        window.open(labelUrl, "_blank");
    };

    const rowStyle = {
        fontSize: "16px",
        margin: "8px 0",
        padding: "8px 12px",
        background: "#f0f2f5",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const labelStyle = {
        color: "#333",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    };

    return (
        <Modal
            title="In Nhãn Thiết Bị"
            visible={visible}
            onCancel={onClose}
            footer={null}
            style={{ borderRadius: "10px", overflow: "hidden" }}
        >
            <div style={{ fontFamily: "Arial, sans-serif", padding: "10px" }}>
                <p style={rowStyle}>
                    <span style={labelStyle}><EnvironmentOutlined /> Cửa Hàng:</span> <span>{storeRecall}</span>
                </p>
                <p style={rowStyle}>
                    <span style={labelStyle}><BarcodeOutlined /> Model:</span> <span>{deviceData.Model}</span>
                </p>
                <p style={rowStyle}>
                    <span style={labelStyle}><BarcodeOutlined /> Serial:</span> <span>{deviceData.SerialNumber}</span>
                </p>
                <p style={rowStyle}>
                    <span style={labelStyle}><CalendarOutlined /> Ngày thu hồi:</span> <span>{formattedCreatedAt}</span>
                </p>
                <p style={{ ...rowStyle, color: statusColor }}>
                    <span style={labelStyle}>{StatusIcon} Trạng thái:</span> <span>{fixedStatus}</span>
                </p>
                <Button
                    type="primary"
                    onClick={handlePrint}
                    style={{
                        width: "100%",
                        background: "#1890ff",
                        borderRadius: "8px",
                        height: "40px",
                        fontSize: "16px",
                        marginTop: "15px",
                        transition: "0.3s",
                    }}
                >
                    In Nhãn
                </Button>
            </div>
        </Modal>
    );
};

export default PrintLabelModalRetrieve;
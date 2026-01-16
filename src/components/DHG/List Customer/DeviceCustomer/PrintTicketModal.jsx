// import React, { useEffect, useState } from "react";
// import { Modal, Button } from "antd";
// import { PrinterOutlined } from "@ant-design/icons";

// const PrintTicketModal = ({ isOpen, onClose, ticket, handoverDevices, retrieveDevices, autoPrint }) => {
//     useEffect(() => {
//         if (isOpen && autoPrint) {
//             handlePrint();
//         }
//     }, [isOpen, autoPrint]);

//     const handlePrint = () => {
//         setTimeout(() => {
//             const printContent = document.getElementById("print-content").innerHTML;
//             const style = `
//                 <style>
//                     @page { size: A4; margin: 1cm; }
//                     body { margin: 0; padding: 1cm; font-family: Arial, sans-serif; }
//                     table { width: 100%; border-collapse: collapse; table-layout: fixed; }
//                     th, td { border: 1px solid black; padding: 8px; text-align: center; }
//                     th { background-color: #4CAF50; color: black; }
//                     img { max-width: 100%; height: auto; display: block; }
//                 </style>
//             `;

//             const newWindow = window.open("", "_blank");
//             newWindow.document.write("<html><head><title>In Phiếu</title>" + style + "</head><body>");
//             newWindow.document.write(printContent);
//             newWindow.document.write("</body></html>");
//             newWindow.document.close();

//             newWindow.onload = () => {
//                 setTimeout(() => {
//                     newWindow.print();
//                     onClose();
//                 }, 100);
//             };
//         }, 200);
//     };

//     return (
//         <Modal
//             title="Biên Bản Dịch Vụ Khách Hàng"
//             open={isOpen}
//             onCancel={onClose}
//             footer={[
//                 // <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
//                 //     In Phiếu
//                 // </Button>,
//                 <Button key="close" onClick={onClose}>Đóng</Button>
//             ]}
//             width={900}
//         >
//             <div id="print-content" style={{ padding: 20, fontSize: "14px", lineHeight: "1.6", width: "21cm", minHeight: "29.7cm", margin: "auto" }}>
//                 <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
//                     <img src="/LOGOAbico.png" alt="Company Logo" style={{ height: 80, marginRight: 15 }} />
//                     <div>
//                         <h2 style={{ margin: 0, marginBottom: 5 }}>CÔNG TY TNHH THƯƠNG MẠI ĐẠI HOÀNG GIA</h2>
//                         <p style={{ margin: 0, marginBottom: 3 }}>2F, HALO Building, 677/7 Điện Biên Phủ, Phường Thạnh Mỹ Tây, Tp.Hồ Chí Minh</p>
//                         <p style={{ margin: 0 }}>ĐT: 028 39333445 - Hotline: 1800588810 - MST: 0301291553</p>
//                     </div>
//                 </div>

//                 <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>Biên Bản Bàn Giao Thiết Bị</h2>
//                 <h3 style={{ textAlign: "center", textTransform: "uppercase" }}>Delivery Service</h3>
//                 <p style={{ textAlign: "right" }}>TPHCM, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>

//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
//                     <p style={{ width: "50%" }}><strong>Khách hàng:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Customer}</span></p>
//                     <p style={{ width: "50%" }}><strong>Số Phiếu:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Votes}</span></p>

//                 </div>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
//                     <p style={{ width: "50%" }}><strong>Cửa Hàng:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Store}</span></p>
//                     <p style={{ width: "50%" }}><strong>Người Phụ Trách:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Person}</span></p>
//                 </div>


//                 <h3>BÊN GIAO / THE DELIVERER: CÔNG TY TNHH THƯƠNG MẠI ĐẠI HOÀNG GIA</h3>
//                 <p><strong>Địa chỉ / Address:</strong> 2F, HALO Building, 677/7 Điện Biên Phủ , Phường Thạnh Mỹ Tây , Tp.Hồ Chí Minh</p>

//                 <h3>BÊN NHẬN/ THE RECIPIENT: CÔNG TY CỔ PHẦN FAMILYMART VIỆT NAM</h3>
//                 <p><strong>Địa chỉ / Address:</strong> Tầng 8, Toà nhà An Khánh ,Số 63 Phạm Ngọc Thạch, Phường Xuân Hòa , Thành phố Hồ Chí Minh.</p>
//                 <p><strong>Địa chỉ nhận hàng / Address:</strong> <span style={{ fontSize: "16px" }}>{ticket?.attributes?.Address}</span> </p>

//                 <p><strong>Biên bản được ký kết như sau: / The deliver notes was signed as below:</strong></p>

//                 <h3>1. Thiết bị bàn giao / nghiệm thu thiết bị bên dưới đầy đủ cho bên nhận, gồm có:</h3>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th style={{ width: "40px" }}>No.</th>
//                             <th style={{ width: "60px" }}>Location</th>
//                             <th style={{ width: "60px" }}>Item</th>
//                             <th style={{ width: "70px" }}>Model</th>
//                             <th style={{ width: "30px" }}>Q'ty</th>
//                             <th style={{ width: "150px" }}>Serial Number</th>
//                             <th style={{ width: "150px" }}>Thông tin bổ sung</th>
//                             <th style={{ width: "100px" }}>Note</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {handoverDevices?.map((device, index) => (
//                             <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{device.Location}</td>
//                                 <td>{device.DeviceName}</td>
//                                 <td>{device.Model}</td>
//                                 <td>{device.Quantity || 1}</td>
//                                 <td>{device.SerialNumber}</td>
//                                 <td>{device.AssetsCode}</td>
//                                 <td>{device.Note}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <h3>2. Thiết bị thu hồi / nghiệm thu thiết bị bên dưới đầy đủ cho bên giao, gồm có:</h3>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th style={{ width: "40px" }}>No.</th>
//                             <th style={{ width: "60px" }}>Location</th>
//                             <th style={{ width: "60px" }}>Item</th>
//                             <th style={{ width: "70px" }}>Model</th>
//                             <th style={{ width: "30px" }}>Q'ty</th>
//                             <th style={{ width: "150px" }}>Serial Number</th>
//                             <th style={{ width: "150px" }}>Lý do thu hồi</th>
//                             <th style={{ width: "100px" }}>Note</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {retrieveDevices?.map((device, index) => (
//                             <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{device.Location}</td>
//                                 <td>{device.DeviceName}</td>
//                                 <td>{device.Model}</td>
//                                 <td>{device.Quantity || 1}</td>
//                                 <td>{device.SerialNumber}</td>
//                                 <td>{device.Reason}</td>
//                                 <td>{device.Note}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between" }}>
//                     <p style={{ marginLeft: "3cm" }}>Khách hàng xác nhận</p>
//                     <p>Bộ phận IT</p>
//                     <p style={{ marginRight: "3cm" }}>Kỹ thuật viên</p>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default PrintTicketModal;

import React, { useEffect, useState, useMemo } from "react";
import { Modal, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { fetchListCustomer } from "../../../../services/strapiServices";

const PrintTicketModal = ({ isOpen, onClose, ticket, handoverDevices, retrieveDevices, autoPrint }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Load danh sách customer và chọn đúng CompanyName + AddressOFF
    useEffect(() => {
        if (isOpen && ticket) {
            const loadCustomer = async () => {
                try {
                    const res = await fetchListCustomer();
                    const customers = res?.data || [];
                    const found = customers.find(
                        (c) =>
                            c.attributes.Customer === ticket?.attributes?.Customer &&
                            c.attributes.StoreID === ticket?.attributes?.Store
                    );
                    setSelectedCustomer(found?.attributes || null);
                } catch (err) {
                    console.error("Error fetching customers:", err);
                }
            };
            loadCustomer();
        }
    }, [isOpen, ticket]);

    useEffect(() => {
        if (isOpen && autoPrint) {
            handlePrint();
        }
    }, [isOpen, autoPrint]);

    const handlePrint = () => {
        setTimeout(() => {
            const printContent = document.getElementById("print-content").innerHTML;
            const style = `
                <style>
                    @page { size: A4; margin: 1cm; }
                    body { margin: 0; padding: 1cm; font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
                    th, td { border: 1px solid black; padding: 8px; text-align: center; }
                    th { background-color: #4CAF50; color: black; }
                    img { max-width: 100%; height: auto; display: block; }
                </style>
            `;

            const newWindow = window.open("", "_blank");
            newWindow.document.write("<html><head><title>In Phiếu</title>" + style + "</head><body>");
            newWindow.document.write(printContent);
            newWindow.document.write("</body></html>");
            newWindow.document.close();

            newWindow.onload = () => {
                setTimeout(() => {
                    newWindow.print();
                    onClose();
                }, 100);
            };
        }, 200);
    };

    // So sánh tiếng Việt + có số
    const collator = new Intl.Collator("vi", { sensitivity: "base", numeric: true });

    // Hàm sort theo Location, rồi đến Item (tiebreaker cho ổn định)
    const sortByLocation = (a, b) => {
        const la = a?.Location ?? "";
        const lb = b?.Location ?? "";
        const byLoc = collator.compare(la, lb);
        if (byLoc !== 0) return byLoc;

        // tiebreaker để không bị "xáo trộn" giữa các item cùng Location
        const ia = a?.DeviceName ?? "";
        const ib = b?.DeviceName ?? "";
        return collator.compare(ia, ib);
    };

    // Mảng đã sắp xếp, không mutate dữ liệu gốc
    const sortedHandover = useMemo(
        () => (handoverDevices ?? []).slice().sort(sortByLocation),
        [handoverDevices]
    );

    const sortedRetrieve = useMemo(
        () => (retrieveDevices ?? []).slice().sort(sortByLocation),
        [retrieveDevices]
    );

    return (
        <Modal
            title="Biên Bản Dịch Vụ Khách Hàng"
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                    In Phiếu
                </Button>,
                <Button key="close" onClick={onClose}>Đóng</Button>
            ]}
            width={900}
        >
            <div
                id="print-content"
                style={{
                    padding: 20,
                    fontSize: "14px",
                    lineHeight: "1.6",
                    width: "21cm",
                    minHeight: "29.7cm",
                    margin: "auto",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
                    <img src="/LOGOAbico.png" alt="Company Logo" style={{ height: 80, marginRight: 15 }} />
                    <div>
                        <h2 style={{ margin: 0, marginBottom: 5 }}>
                            CÔNG TY TNHH THƯƠNG MẠI ĐẠI HOÀNG GIA
                        </h2>
                        <p style={{ margin: 0, marginBottom: 3 }}>
                            2F, HALO Building, 677/7 Điện Biên Phủ, Phường Thạnh Mỹ Tây, Tp.Hồ Chí Minh
                        </p>
                        <p style={{ margin: 0 }}>
                            ĐT: 028 39333445 - Hotline: 1800588810 - MST: 0301291553
                        </p>
                    </div>
                </div>

                <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>Biên Bản Bàn Giao Thiết Bị</h2>
                <h3 style={{ textAlign: "center", textTransform: "uppercase" }}>Delivery Service</h3>
                <p style={{ textAlign: "right" }}>
                    TPHCM, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </p>

                {/* Ticket info */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ width: "50%" }}>
                        <strong>Khách hàng:</strong>{" "}
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                            {ticket?.attributes?.Customer}
                        </span>
                    </p>
                    <p style={{ width: "50%" }}>
                        <strong>Số Phiếu:</strong>{" "}
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                            {ticket?.attributes?.Votes}
                        </span>
                    </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ width: "50%" }}>
                        <strong>Cửa Hàng:</strong>{" "}
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                            {ticket?.attributes?.Store}
                        </span>
                    </p>
                    <p style={{ width: "50%" }}>
                        <strong>Người Phụ Trách:</strong>{" "}
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                            {ticket?.attributes?.Person}
                        </span>
                    </p>
                </div>

                {/* Bên giao */}
                <h3>BÊN GIAO / THE DELIVERER: CÔNG TY TNHH THƯƠNG MẠI ĐẠI HOÀNG GIA</h3>
                <p>
                    <strong>Địa chỉ / Address:</strong> 2F, HALO Building, 677/7 Điện Biên Phủ , Phường Thạnh Mỹ Tây ,
                    Tp.Hồ Chí Minh
                </p>

                {/* Bên nhận (dynamically from API) */}
                <h3>
                    BÊN NHẬN / THE RECIPIENT:{" "}
                    {selectedCustomer?.CompanyName}
                </h3>
                <p>
                    <strong>Địa chỉ / Address:</strong>{" "}
                    {selectedCustomer?.AddressOFF}
                </p>
                <p>
                    <strong>Địa chỉ nhận hàng / Address:</strong>{" "}
                    {selectedCustomer?.Address}
                </p>

                <p>
                    <strong>Biên bản được ký kết như sau: / The deliver notes was signed as below:</strong>
                </p>

                {/* Bàn giao */}
                {sortedHandover && sortedHandover.length > 0 && (
                    <>
                        <h3>1. Thiết bị bàn giao / nghiệm thu thiết bị bên dưới đầy đủ cho bên nhận, gồm có:</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "40px" }}>No.</th>
                                    <th style={{ width: "60px" }}>Location</th>
                                    <th style={{ width: "60px" }}>Item</th>
                                    <th style={{ width: "100px" }}>Model</th>
                                    <th style={{ width: "30px" }}>Q'ty</th>
                                    <th style={{ width: "150px" }}>Serial Number</th>
                                    {ticket?.attributes?.Customer === "Family Mart" && (
                                        <th style={{ width: "100px" }}>Tình Trạng</th>
                                    )}
                                    <th style={{ width: "140px" }}>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedHandover.map((device, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{device.Location}</td>
                                        <td>{device.DeviceName}</td>
                                        <td>{device.Model}</td>
                                        <td>{device.Quantity || 1}</td>
                                        <td>{device.SerialNumber}</td>
                                        {ticket?.attributes?.Customer === "Family Mart" && (
                                            <td>{device.DeviceStatus}</td>
                                        )}
                                        <td>{device.Note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Thu hồi */}
                {sortedRetrieve && sortedRetrieve.length > 0 && (
                    <>
                        <h3>2. Thiết bị thu hồi / nghiệm thu thiết bị bên dưới đầy đủ cho bên giao, gồm có:</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "40px" }}>No.</th>
                                    <th style={{ width: "60px" }}>Location</th>
                                    <th style={{ width: "60px" }}>Item</th>
                                    <th style={{ width: "100px" }}>Model</th>
                                    <th style={{ width: "30px" }}>Q'ty</th>
                                    <th style={{ width: "150px" }}>Serial Number</th>
                                    {ticket?.attributes?.Customer === "Family Mart" && (
                                        <th style={{ width: "100px" }}>Tình trạng</th>
                                    )}
                                    <th style={{ width: "140px" }}>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRetrieve.map((device, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{device.Location}</td>
                                        <td>{device.DeviceName}</td>
                                        <td>{device.Model}</td>
                                        <td>{device.Quantity || 1}</td>
                                        <td>{device.SerialNumber}</td>
                                        {ticket?.attributes?.Customer === "Family Mart" && (
                                            <td>{device.DeviceStatus}</td>
                                        )}
                                        <td>{device.Note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Chữ ký */}
                {/* <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between" }}>
                    <p style={{ marginLeft: "3cm" }}>Khách hàng xác nhận</p>
                    <p>Bộ phận IT</p>
                    <p style={{ marginRight: "3cm" }}>Kỹ thuật viên</p>
                </div> */}
                <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                    <div style={{ flex: 1 }}>
                        <p>Khách hàng xác nhận</p>
                    </div>
                    {ticket?.attributes?.Customer === "Family Mart" && (
                        <div style={{ flex: 1 }}>
                            <p>Bộ phận IT</p>
                        </div>
                    )}
                    <div style={{ flex: 1 }}>
                        <p>Kỹ thuật viên</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PrintTicketModal;


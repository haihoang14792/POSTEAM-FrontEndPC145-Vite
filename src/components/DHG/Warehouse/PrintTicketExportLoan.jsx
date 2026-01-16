import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";

const PrintTicketExportLoan = ({ isOpen, onClose, ticket, handoverDevices, retrieveDevices, autoPrint }) => {
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
                    @page { size: A5; margin: 1cm; }
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

    return (
        <Modal
            title="Biên Bản Dịch Vụ Khách Hàng"
            open={isOpen}
            onCancel={onClose}
            footer={[
                // <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                //     In Phiếu
                // </Button>,
                <Button key="close" onClick={onClose}>Đóng</Button>
            ]}
            width={900}
        >
            <div id="print-content" style={{ padding: 20, fontSize: "14px", lineHeight: "1.6", width: "21cm", minHeight: "29.7cm", margin: "auto" }}>
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
                    <img src="/LOGOAbico.png" alt="Company Logo" style={{ height: 80, marginRight: 15 }} />
                    <div>
                        <h2 style={{ margin: 0, marginBottom: 5 }}>CÔNG TY TNHH THƯƠNG MẠI ĐẠI HOÀNG GIA</h2>
                        <p style={{ margin: 0, marginBottom: 3 }}>2F, HALO Building, 677/7 Điện Biên Phủ, Phường Thạnh Mỹ Tây, Tp.Hồ Chí Minh</p>
                        <p style={{ margin: 0 }}>ĐT: 028 39333445 - Hotline: 1800588810 - MST: 0301291553</p>
                    </div>
                </div>

                <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>PHIẾU XUẤT KHO NỘI BỘ</h2>
                <h3 style={{ textAlign: "center", textTransform: "uppercase" }}>INTERNAL WAREHOUSE DELIVERY NOTE</h3>
                <p style={{ textAlign: "right" }}>TPHCM, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ width: "50%" }}><strong>Số Phiếu:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Votes}</span></p>
                    <p style={{ width: "50%" }}><strong>Ticket Dingtalk:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Ticket}</span></p>

                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ width: "50%" }}><strong>Người đề nghị:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Person}</span></p>
                    <p style={{ width: "50%" }}><strong>Khách Hàng:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Customer}</span></p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ width: "50%" }}><strong>Cửa hàng:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.Store}</span></p>
                    <p style={{ width: "50%" }}><strong>Địa chỉ giao:</strong> <span style={{ fontWeight: "bold", fontSize: "18px" }}>{ticket?.attributes?.DeliveryAddress}</span></p>
                </div>

                <h3>1. Chi tiết sản phẩm, gồm có:</h3>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "40px" }}>No.</th>
                            <th style={{ width: "140px" }}>Tên sản phẩm</th>
                            <th style={{ width: "140px" }}>Model</th>
                            <th style={{ width: "40px" }}>Qty</th>
                            <th style={{ width: "40px" }}>ĐVT</th>
                            <th style={{ width: "160px" }}>SerialNumber</th>
                            <th style={{ width: "70px" }}>Kho</th>
                        </tr>
                    </thead>
                    <tbody>
                        {handoverDevices?.map((device, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{device.ProductName}</td>
                                <td>{device.Model}</td>
                                <td>{device.totalexport}</td>
                                <td>{device.DVT}</td>
                                {/* <td>{device.SerialNumber}</td> */}
                                <td style={{ maxWidth: "200px", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                                    {device.SerialNumber.split(",").map((sn, idx) => (
                                        <div key={idx}>{sn}</div>
                                    ))}
                                </td>

                                <td>{device.TypeKho}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between" }}>
                    <p style={{ marginLeft: "3cm" }}>Leader xác nhận</p>
                    <p>Thủ Kho</p>
                    <p style={{ marginRight: "3cm" }}>Người đề nghị</p>
                </div>
            </div>
        </Modal>
    );
};

export default PrintTicketExportLoan;

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { fetchStore, updateJobStatus } from "../../../services/jobServices";
import { deleteJobs } from "../../../services/storeServices";
import ModalStore from "./ModalStore";
import "./Store.scss";

// Icon components
const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const Store = () => {
    const { storeticket } = useParams();
    const location = useLocation();

    const [storeDetails, setStoreDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedJobs, setSelectedJobs] = useState([]);

    const [storeId, setStoreId] = useState("");
    const [ticket, setTicket] = useState("");

    useEffect(() => {
        if (location.state?.ticket) {
            setTicket(location.state.ticket);
        } else if (storeticket) {
            setTicket(storeticket);
        }
    }, [location.state, storeticket]);

    useEffect(() => {
        if (location.state?.storeId) {
            setStoreId(location.state.storeId);
        }
    }, [location.state]);

    useEffect(() => {
        const loadStoreDetails = async () => {
            try {
                if (!ticket) return;
                setLoading(true);
                const data = await fetchStore(ticket);

                if (Array.isArray(data)) {
                    setStoreDetails(data);
                } else {
                    throw new Error("Dữ liệu API không hợp lệ");
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadStoreDetails();
    }, [ticket]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleConfirm = async (jobId) => {
        try {
            await updateJobStatus(jobId, { StatusJob: true });
            setStoreDetails((prev) =>
                prev.map((job) =>
                    job.id === jobId
                        ? { ...job, attributes: { ...job.attributes, StatusJob: true } }
                        : job
                )
            );
        } catch (error) {
            console.error("Error updating job:", error);
        }
    };

    const handleAddJob = (newJob) => {
        setStoreDetails((prev) => [...prev, newJob]);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedJobs(storeDetails.map((job) => job.id));
        } else {
            setSelectedJobs([]);
        }
    };

    const handleSelectJob = (e, jobId) => {
        if (e.target.checked) {
            setSelectedJobs((prev) => [...prev, jobId]);
        } else {
            setSelectedJobs((prev) => prev.filter((id) => id !== jobId));
        }
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa các mục đã chọn?")) return;
        try {
            await deleteJobs(selectedJobs);
            setStoreDetails((prev) =>
                prev.filter((job) => !selectedJobs.includes(job.id))
            );
            setSelectedJobs([]);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const totalPages = Math.ceil(storeDetails.length / itemsPerPage);
    const currentPageData = storeDetails.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-50">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="alert alert-danger m-4" role="alert">
                <strong>Lỗi:</strong> {error.message}
            </div>
        );

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const account = userData?.account || {};

    return (
        <div className="store-container p-4">
            <div className="card shadow-sm border-0 rounded-3">
                {/* ===== HEADER ===== */}
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                    <div>
                        <h5 className="mb-1 fw-bold text-dark">
                            🏪 Cửa hàng: <span className="text-primary">{storeId || "N/A"}</span>
                        </h5>
                        <small className="text-muted">
                            Mã phiếu: <strong>{ticket}</strong> &nbsp;|&nbsp; Tổng công việc:{" "}
                            <strong>{storeDetails.length}</strong>
                        </small>
                    </div>
                    {account?.Projecter === true && (
                        <div className="action-buttons">
                            <button
                                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2 shadow-sm"
                                onClick={() => setShowModal(true)}
                            >
                                <IconPlus /> Thêm mới
                            </button>

                            <button
                                className={`btn btn-danger btn-sm d-inline-flex align-items-center gap-2 shadow-sm ms-2 ${selectedJobs.length === 0 ? "disabled" : ""
                                    }`}
                                onClick={handleDeleteSelected}
                                disabled={selectedJobs.length === 0}
                            >
                                <IconTrash /> Xóa ({selectedJobs.length})
                            </button>
                        </div>
                    )}
                </div>

                {/* ===== TABLE BODY ===== */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 custom-table">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: "50px" }}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input pointer"
                                            onChange={handleSelectAll}
                                            checked={
                                                selectedJobs.length === storeDetails.length &&
                                                storeDetails.length > 0
                                            }
                                        />
                                    </th>
                                    <th className="text-center" style={{ width: "60px" }}>#</th>
                                    <th style={{ minWidth: "200px" }}>Công việc</th>
                                    {/* Tăng độ rộng cột Mô tả */}
                                    <th style={{ minWidth: "350px" }}>Mô tả</th>
                                    <th style={{ minWidth: "110px" }}>Bắt đầu</th>
                                    <th style={{ minWidth: "110px" }}>Kết thúc</th>
                                    <th style={{ minWidth: "150px" }}>Ghi chú</th>
                                    <th className="text-center" style={{ width: "130px" }}>Trạng thái</th>
                                    <th className="text-center" style={{ width: "150px" }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData.length > 0 ? (
                                    currentPageData.map((job, index) => (
                                        <tr key={job.id} className={selectedJobs.includes(job.id) ? "table-active" : ""}>
                                            <td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input pointer"
                                                    checked={selectedJobs.includes(job.id)}
                                                    onChange={(e) => handleSelectJob(e, job.id)}
                                                />
                                            </td>
                                            <td className="text-center text-muted fw-bold">
                                                {currentPage * itemsPerPage + index + 1}
                                            </td>
                                            <td className="fw-semibold text-dark">
                                                {job.attributes.ListJob}
                                            </td>
                                            {/* Cho phép text wrap, không cắt bớt */}
                                            <td className="text-secondary small text-wrap">
                                                {job.attributes.DescriptionJob || "-"}
                                            </td>
                                            <td className="text-secondary small">
                                                {formatDate(job.attributes.DateJob)}
                                            </td>
                                            <td className="text-secondary small">
                                                {formatDate(job.attributes.DateEndJob)}
                                            </td>
                                            <td className="text-muted small fst-italic text-wrap">
                                                {job.attributes.Note || ""}
                                            </td>
                                            <td className="text-center">
                                                {job.attributes.StatusJob ? (
                                                    <span className="badge badge-soft-success">
                                                        Hoàn thành
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-soft-warning">
                                                        Chưa xong
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {account?.Projecter === true && (
                                                    !job.attributes.StatusJob ? (
                                                        // Nút xác nhận – chỉ Leader mới thấy
                                                        <button
                                                            className="btn-action-confirm"
                                                            onClick={() => handleConfirm(job.id)}
                                                        >
                                                            <IconCheck /> Xác nhận
                                                        </button>
                                                    ) : (
                                                        <span className="text-success small fw-bold">
                                                            <IconCheck /> Đã xong
                                                        </span>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center py-5 text-muted">
                                            <div className="d-flex flex-column align-items-center">
                                                <span style={{ fontSize: "2rem", marginBottom: "10px" }}>📭</span>
                                                Chưa có công việc nào
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ===== FOOTER / PAGINATION ===== */}
                {totalPages > 1 && (
                    <div className="card-footer bg-white border-top py-3">
                        <ReactPaginate
                            previousLabel={"← Trước"}
                            nextLabel={"Sau →"}
                            pageCount={totalPages}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-end mb-0"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakLabel={"..."}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                        />
                    </div>
                )}
            </div>

            <ModalStore
                showModal={showModal}
                handleClose={() => setShowModal(false)}
                handleAddJob={handleAddJob}
                storeId={storeId}
                ticket={ticket}
            />
        </div>
    );
};

export default Store;
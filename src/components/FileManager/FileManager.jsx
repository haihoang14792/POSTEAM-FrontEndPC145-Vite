// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//     CCard, CCardBody, CButton, CBreadcrumb, CBreadcrumbItem,
//     CSpinner, CModal, CModalHeader, CModalTitle, CModalBody,
//     CModalFooter, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
//     CFormInput, CInputGroup, CInputGroupText // Cập nhật import
// } from "@coreui/react";
// import CIcon from "@coreui/icons-react";
// // Thêm cilSearch vào import
// import { cilList, cilGrid, cilHome, cilCloudUpload, cilOptions, cilTrash, cilCloudDownload, cilSearch } from "@coreui/icons";
// import {
//     FaFolder, FaFolderPlus, FaFile, FaFilePdf, FaFileWord, FaFileExcel,
//     FaFilePowerpoint, FaFileImage, FaFileAudio, FaFileVideo,
//     FaFileCode, FaFileArchive
// } from "react-icons/fa";

// import "./FileManager.scss";

// const API = "http://113.161.81.49:1338/api";

// export default function FileManager() {
//     const [items, setItems] = useState([]);
//     const [currentFolder, setCurrentFolder] = useState("113uUYvU-nvwVdUFW-Cz3YyvtrKXVGAP1");
//     const [history, setHistory] = useState([{ id: "113uUYvU-nvwVdUFW-Cz3YyvtrKXVGAP1", name: "Trang chủ" }]);

//     // State cho tìm kiếm
//     const [searchQuery, setSearchQuery] = useState("");

//     // Loading chung cho danh sách và các tác vụ
//     const [loading, setLoading] = useState(false);

//     // State khóa nút khi đang submit form
//     const [submitting, setSubmitting] = useState(false);

//     const [viewMode, setViewMode] = useState("grid");
//     const [dragActive, setDragActive] = useState(false);

//     const [modalType, setModalType] = useState(null);
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [inputValue, setInputValue] = useState("");
//     const uploadInputRef = useRef(null);

//     // ... (Giữ nguyên hàm getFileIcon) ...
//     const getFileIcon = (mimeType, name) => {
//         if (mimeType === "application/vnd.google-apps.folder") return <FaFolder color="#FFC107" />;
//         const ext = name.split('.').pop().toLowerCase();
//         if (mimeType.includes("image")) return <FaFileImage color="#d93025" />;
//         if (mimeType.includes("pdf") || ext === "pdf") return <FaFilePdf color="#F40F02" />;
//         if (ext === "doc" || ext === "docx") return <FaFileWord color="#2b579a" />;
//         if (ext === "xls" || ext === "xlsx" || ext === "csv") return <FaFileExcel color="#217346" />;
//         if (ext === "ppt" || ext === "pptx") return <FaFilePowerpoint color="#d24726" />;
//         if (mimeType.includes("video") || ext === "mp4") return <FaFileVideo color="#d93025" />;
//         if (mimeType.includes("audio") || ext === "mp3") return <FaFileAudio color="#1a73e8" />;
//         if (mimeType.includes("zip") || mimeType.includes("rar")) return <FaFileArchive color="#5f6368" />;
//         if (ext === "js" || ext === "html" || ext === "css" || ext === "json") return <FaFileCode color="#1a73e8" />;
//         return <FaFile color="#5f6368" />;
//     };

//     const loadFiles = async (folderId) => {
//         setLoading(true);
//         // Reset search query khi chuyển thư mục để tránh nhầm lẫn
//         setSearchQuery("");
//         try {
//             const res = await axios.get(`${API}/drive/list?folderId=${folderId}`);
//             setItems(res.data);
//         } catch (err) {
//             console.error(err);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         loadFiles(currentFolder);
//     }, [currentFolder]);

//     // ... (Giữ nguyên các hàm handleUpload, handleDelete, handleRename, handleCreateFolder, handleDownload, handleItemClick, openModal, closeModal, handleBreadcrumb, handleDrag, handleDrop) ...

//     // --- CÁC HÀM XỬ LÝ SỰ KIỆN (Giữ nguyên logic cũ của bạn ở đây) ---
//     const handleUpload = async (file) => {
//         if (!file) return;
//         setLoading(true);
//         const form = new FormData();
//         form.append("file", file);
//         form.append("folderId", currentFolder);
//         try {
//             await axios.post(`${API}/drive/upload`, form);
//             loadFiles(currentFolder);
//         } catch (err) {
//             alert("Upload thất bại!");
//         }
//         setLoading(false);
//     };

//     const handleDelete = async () => {
//         if (!selectedItem) return;
//         setSubmitting(true);
//         try {
//             await axios.post(`${API}/drive/delete`, { fileId: selectedItem.id });
//             closeModal();
//             loadFiles(currentFolder);
//         } catch (err) {
//             alert("Xóa thất bại!");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleRename = async () => {
//         if (!selectedItem || !inputValue.trim()) return;
//         setSubmitting(true);
//         try {
//             await axios.post(`${API}/drive/rename`, {
//                 fileId: selectedItem.id,
//                 newName: inputValue
//             });
//             closeModal();
//             loadFiles(currentFolder);
//         } catch (err) {
//             alert("Đổi tên thất bại!");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleCreateFolder = async () => {
//         if (!inputValue.trim()) return;
//         setSubmitting(true);
//         try {
//             await axios.post(`${API}/drive/create-folder`, {
//                 name: inputValue,
//                 parentId: currentFolder
//             });
//             closeModal();
//             await loadFiles(currentFolder);
//         } catch (err) {
//             alert("Tạo thư mục thất bại!");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleDownload = async (item) => {
//         if (item.mimeType === "application/vnd.google-apps.folder") return;
//         const targetUrl = item.webContentLink || item.url || item.webViewLink;
//         if (!targetUrl) {
//             alert("Không tìm thấy đường dẫn tải xuống!");
//             return;
//         }
//         try {
//             setLoading(true);
//             const response = await axios.get(targetUrl, { responseType: 'blob' });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', item.name);
//             document.body.appendChild(link);
//             link.click();
//             link.parentNode.removeChild(link);
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error("Lỗi tải file (có thể do CORS):", error);
//             window.open(targetUrl, "_blank");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleItemClick = (item) => {
//         if (item.mimeType === "application/vnd.google-apps.folder") {
//             setCurrentFolder(item.id);
//             setHistory([...history, { id: item.id, name: item.name }]);
//         } else {
//             window.open(item.url || item.webViewLink, "_blank");
//         }
//     };

//     const openModal = (type, item = null) => {
//         setModalType(type);
//         setSelectedItem(item);
//         if (type === 'rename') setInputValue(item.name);
//         if (type === 'createFolder') setInputValue("");
//     };

//     const closeModal = () => {
//         setModalType(null);
//         setSelectedItem(null);
//         setInputValue("");
//         setSubmitting(false);
//     };

//     const handleBreadcrumb = (index) => {
//         const newHistory = history.slice(0, index + 1);
//         setHistory(newHistory);
//         setCurrentFolder(newHistory[index].id);
//     };

//     const handleDrag = (e) => {
//         e.preventDefault(); e.stopPropagation();
//         if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
//         else if (e.type === "dragleave") setDragActive(false);
//     };
//     const handleDrop = (e) => {
//         e.preventDefault(); e.stopPropagation();
//         setDragActive(false);
//         if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
//     };

//     // --- LOGIC LỌC DANH SÁCH ---
//     const filteredItems = items.filter(item =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="file-manager-container">
//             <CCard className="border-0 shadow-sm">
//                 <div className="drive-header">
//                     <div className="d-flex align-items-center gap-3">
//                         <CBreadcrumb className="drive-breadcrumb m-0">
//                             {history.map((h, i) => (
//                                 <CBreadcrumbItem key={i} onClick={() => handleBreadcrumb(i)}>
//                                     {i === 0 ? <CIcon icon={cilHome} /> : h.name}
//                                 </CBreadcrumbItem>
//                             ))}
//                         </CBreadcrumb>
//                     </div>

//                     <div className="d-flex gap-2 align-items-center">
//                         {/* --- UPDATE: Ô TÌM KIẾM --- */}
//                         <div style={{ width: '250px' }}>
//                             <CInputGroup size="sm">
//                                 <CInputGroupText className="bg-light border-end-0">
//                                     <CIcon icon={cilSearch} size="sm" />
//                                 </CInputGroupText>
//                                 <CFormInput
//                                     className="border-start-0 ps-0"
//                                     placeholder="Tìm tên file..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                 />
//                             </CInputGroup>
//                         </div>

//                         <CDropdown>
//                             <CDropdownToggle color="primary">
//                                 <CIcon icon={cilCloudUpload} className="me-2" /> Mới
//                             </CDropdownToggle>
//                             <CDropdownMenu>
//                                 <CDropdownItem onClick={() => openModal('createFolder')} style={{ cursor: 'pointer' }}>
//                                     <FaFolderPlus className="me-2 text-warning" size={18} /> Thư mục mới
//                                 </CDropdownItem>
//                                 <CDropdownItem onClick={() => uploadInputRef.current.click()} style={{ cursor: 'pointer' }}>
//                                     <CIcon icon={cilCloudUpload} className="me-2" /> Tải tệp lên
//                                 </CDropdownItem>
//                             </CDropdownMenu>
//                         </CDropdown>
//                         <input type="file" hidden ref={uploadInputRef} onChange={(e) => handleUpload(e.target.files[0])} />

//                         <div className="btn-group">
//                             <CButton color={viewMode === "grid" ? "info" : "light"} onClick={() => setViewMode("grid")}><CIcon icon={cilGrid} /></CButton>
//                             <CButton color={viewMode === "list" ? "info" : "light"} onClick={() => setViewMode("list")}><CIcon icon={cilList} /></CButton>
//                         </div>
//                     </div>
//                 </div>

//                 <CCardBody className={`drop-zone ${dragActive ? "active" : ""}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
//                     {loading ? (
//                         <div className="text-center py-5"><CSpinner color="primary" /> <div className="mt-2 text-muted">Đang xử lý...</div></div>
//                     ) : (
//                         <div className={viewMode === "grid" ? "d-flex flex-wrap gap-3" : "d-flex flex-column"}>
//                             {/* UPDATE: Sử dụng filteredItems để render */}
//                             {filteredItems.length === 0 && (
//                                 <div className="text-center w-100 text-muted mt-5">
//                                     {searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : "Thư mục trống"}
//                                 </div>
//                             )}
//                             {filteredItems.map((item) => (
//                                 viewMode === "grid" ? (
//                                     <div key={item.id} className="file-grid-item" onClick={() => handleItemClick(item)}>
//                                         <div className="item-preview">
//                                             {item.mimeType.includes("image") && item.thumbnailLink ? (
//                                                 <img src={item.thumbnailLink} alt={item.name} className="thumb" />
//                                             ) : (
//                                                 <span style={{ fontSize: '4rem' }}>{getFileIcon(item.mimeType, item.name)}</span>
//                                             )}
//                                         </div>
//                                         <div className="item-footer">
//                                             <div className="item-icon">{getFileIcon(item.mimeType, item.name)}</div>
//                                             <div className="item-name" title={item.name}>
//                                                 {/* Highlight text tìm kiếm (optional) */}
//                                                 {item.name}
//                                             </div>
//                                             <CDropdown className="item-actions" onClick={(e) => e.stopPropagation()}>
//                                                 <CDropdownToggle color="light" size="sm" caret={false} className="border-0 rounded-circle p-1">
//                                                     <CIcon icon={cilOptions} style={{ transform: 'rotate(90deg)' }} />
//                                                 </CDropdownToggle>
//                                                 <CDropdownMenu>
//                                                     {item.mimeType !== "application/vnd.google-apps.folder" && (
//                                                         <CDropdownItem onClick={() => handleDownload(item)} style={{ cursor: 'pointer' }}>
//                                                             <CIcon icon={cilCloudDownload} className="me-2" /> Tải xuống
//                                                         </CDropdownItem>
//                                                     )}
//                                                     <CDropdownItem onClick={() => openModal('rename', item)} style={{ cursor: 'pointer' }}>Đổi tên</CDropdownItem>
//                                                     <CDropdownItem className="text-danger" onClick={() => openModal('delete', item)} style={{ cursor: 'pointer' }}>
//                                                         <CIcon icon={cilTrash} className="me-2" /> Xóa
//                                                     </CDropdownItem>
//                                                 </CDropdownMenu>
//                                             </CDropdown>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div key={item.id} className="file-list-row" onClick={() => handleItemClick(item)}>
//                                         <div className="list-icon">{getFileIcon(item.mimeType, item.name)}</div>
//                                         <div className="list-name text-truncate">{item.name}</div>
//                                         <div className="list-size">--</div>
//                                         <div className="list-actions">
//                                             <CDropdown onClick={(e) => e.stopPropagation()}>
//                                                 <CDropdownToggle color="transparent" size="sm" caret={false}><CIcon icon={cilOptions} /></CDropdownToggle>
//                                                 <CDropdownMenu>
//                                                     {item.mimeType !== "application/vnd.google-apps.folder" && (
//                                                         <CDropdownItem onClick={() => handleDownload(item)} style={{ cursor: 'pointer' }}>
//                                                             <CIcon icon={cilCloudDownload} className="me-2" /> Tải xuống
//                                                         </CDropdownItem>
//                                                     )}
//                                                     <CDropdownItem onClick={() => openModal('rename', item)} style={{ cursor: 'pointer' }}>Đổi tên</CDropdownItem>
//                                                     <CDropdownItem className="text-danger" onClick={() => openModal('delete', item)} style={{ cursor: 'pointer' }}>
//                                                         <CIcon icon={cilTrash} className="me-2" /> Xóa
//                                                     </CDropdownItem>
//                                                 </CDropdownMenu>
//                                             </CDropdown>
//                                         </div>
//                                     </div>
//                                 )
//                             ))}
//                         </div>
//                     )}
//                 </CCardBody>
//             </CCard>

//             {/* --- MODALS (Giữ nguyên) --- */}
//             <CModal visible={modalType === 'delete'} onClose={!submitting ? closeModal : null}>
//                 <CModalHeader><strong>Xác nhận xóa</strong></CModalHeader>
//                 <CModalBody>Bạn có chắc chắn muốn xóa <b>{selectedItem?.name}</b>?</CModalBody>
//                 <CModalFooter>
//                     <CButton color="secondary" onClick={closeModal} disabled={submitting}>Hủy</CButton>
//                     <CButton color="danger" onClick={handleDelete} disabled={submitting}>
//                         {submitting ? <CSpinner size="sm" /> : "Xóa vĩnh viễn"}
//                     </CButton>
//                 </CModalFooter>
//             </CModal>

//             <CModal visible={modalType === 'rename'} onClose={!submitting ? closeModal : null}>
//                 <CModalHeader><strong>Đổi tên</strong></CModalHeader>
//                 <CModalBody>
//                     <CFormInput value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={submitting} />
//                 </CModalBody>
//                 <CModalFooter>
//                     <CButton color="secondary" onClick={closeModal} disabled={submitting}>Hủy</CButton>
//                     <CButton color="primary" onClick={handleRename} disabled={submitting}>
//                         {submitting ? <CSpinner size="sm" /> : "Lưu"}
//                     </CButton>
//                 </CModalFooter>
//             </CModal>

//             <CModal visible={modalType === 'createFolder'} onClose={!submitting ? closeModal : null}>
//                 <CModalHeader><strong>Thư mục mới</strong></CModalHeader>
//                 <CModalBody>
//                     <CFormInput
//                         placeholder="Tên thư mục..."
//                         value={inputValue}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         autoFocus
//                         disabled={submitting}
//                         onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder() }}
//                     />
//                 </CModalBody>
//                 <CModalFooter>
//                     <CButton color="secondary" onClick={closeModal} disabled={submitting}>Hủy</CButton>
//                     <CButton color="primary" onClick={handleCreateFolder} disabled={submitting}>
//                         {submitting ? <><CSpinner size="sm" component="span" aria-hidden="true" className="me-2" />Đang tạo...</> : "Tạo"}
//                     </CButton>
//                 </CModalFooter>
//             </CModal>
//         </div>
//     );
// }




import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Giữ lại axios gốc để download file từ link ngoài (Google Drive)
// Import axios service của bạn. Hãy điều chỉnh đường dẫn '../setup/axios strapi' cho đúng với cấu trúc thư mục thực tế
import strapiv1Instance from "../../setup/axios strapi";

import {
    CCard, CCardBody, CButton, CBreadcrumb, CBreadcrumbItem,
    CSpinner, CModal, CModalHeader, CModalTitle, CModalBody,
    CModalFooter, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
    CFormInput, CInputGroup, CInputGroupText
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilList, cilGrid, cilHome, cilCloudUpload, cilOptions, cilTrash, cilCloudDownload, cilSearch } from "@coreui/icons";
import {
    FaFolder, FaFolderPlus, FaFile, FaFilePdf, FaFileWord, FaFileExcel,
    FaFilePowerpoint, FaFileImage, FaFileAudio, FaFileVideo,
    FaFileCode, FaFileArchive
} from "react-icons/fa";

import "./FileManager.scss";

// Không cần khai báo API constant vì baseURL đã có trong service
// const API = "http://113.161.81.49:1338/api"; 

export default function FileManager() {
    const [items, setItems] = useState([]);
    const [currentFolder, setCurrentFolder] = useState("113uUYvU-nvwVdUFW-Cz3YyvtrKXVGAP1");
    const [history, setHistory] = useState([{ id: "113uUYvU-nvwVdUFW-Cz3YyvtrKXVGAP1", name: "Trang chủ" }]);

    // State cho tìm kiếm
    const [searchQuery, setSearchQuery] = useState("");

    // Loading chung cho danh sách và các tác vụ
    const [loading, setLoading] = useState(false);

    // State khóa nút khi đang submit form
    const [submitting, setSubmitting] = useState(false);

    const [viewMode, setViewMode] = useState("grid");
    const [dragActive, setDragActive] = useState(false);

    const [modalType, setModalType] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const uploadInputRef = useRef(null);

    // ... (Giữ nguyên hàm getFileIcon) ...
    const getFileIcon = (mimeType, name) => {
        if (mimeType === "application/vnd.google-apps.folder") return <FaFolder color="#FFC107" />;
        const ext = name.split('.').pop().toLowerCase();
        if (mimeType.includes("image")) return <FaFileImage color="#d93025" />;
        if (mimeType.includes("pdf") || ext === "pdf") return <FaFilePdf color="#F40F02" />;
        if (ext === "doc" || ext === "docx") return <FaFileWord color="#2b579a" />;
        if (ext === "xls" || ext === "xlsx" || ext === "csv") return <FaFileExcel color="#217346" />;
        if (ext === "ppt" || ext === "pptx") return <FaFilePowerpoint color="#d24726" />;
        if (mimeType.includes("video") || ext === "mp4") return <FaFileVideo color="#d93025" />;
        if (mimeType.includes("audio") || ext === "mp3") return <FaFileAudio color="#1a73e8" />;
        if (mimeType.includes("zip") || mimeType.includes("rar")) return <FaFileArchive color="#5f6368" />;
        if (ext === "js" || ext === "html" || ext === "css" || ext === "json") return <FaFileCode color="#1a73e8" />;
        return <FaFile color="#5f6368" />;
    };

    const loadFiles = async (folderId) => {
        setLoading(true);
        // Reset search query khi chuyển thư mục để tránh nhầm lẫn
        setSearchQuery("");
        try {
            // Thay axios bằng strapiv1Instance
            // Interceptor đã trả về data nên không cần .data ở đây
            const res = await strapiv1Instance.get(`/api/drive/list?folderId=${folderId}`);
            setItems(res);
        } catch (err) {
            console.error(err);
            // Toast đã được xử lý trong interceptor nên có thể không cần alert ở đây
        }
        setLoading(false);
    };

    useEffect(() => {
        loadFiles(currentFolder);
    }, [currentFolder]);

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const handleUpload = async (file) => {
        if (!file) return;
        setLoading(true);
        const form = new FormData();
        form.append("file", file);
        form.append("folderId", currentFolder);
        try {
            // Cần override Content-Type vì interceptor mặc định set application/json
            await strapiv1Instance.post(`/api/drive/upload`, form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            loadFiles(currentFolder);
        } catch (err) {
            // Lỗi đã được xử lý bởi interceptor (toast)
            console.error("Upload thất bại", err);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        setSubmitting(true);
        try {
            await strapiv1Instance.post(`/api/drive/delete`, { fileId: selectedItem.id });
            closeModal();
            loadFiles(currentFolder);
        } catch (err) {
            console.error("Xóa thất bại", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRename = async () => {
        if (!selectedItem || !inputValue.trim()) return;
        setSubmitting(true);
        try {
            await strapiv1Instance.post(`/api/drive/rename`, {
                fileId: selectedItem.id,
                newName: inputValue
            });
            closeModal();
            loadFiles(currentFolder);
        } catch (err) {
            console.error("Đổi tên thất bại", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateFolder = async () => {
        if (!inputValue.trim()) return;
        setSubmitting(true);
        try {
            await strapiv1Instance.post(`/api/drive/create-folder`, {
                name: inputValue,
                parentId: currentFolder
            });
            closeModal();
            await loadFiles(currentFolder);
        } catch (err) {
            console.error("Tạo thư mục thất bại", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownload = async (item) => {
        if (item.mimeType === "application/vnd.google-apps.folder") return;
        const targetUrl = item.webContentLink || item.url || item.webViewLink;
        if (!targetUrl) {
            alert("Không tìm thấy đường dẫn tải xuống!");
            return;
        }
        try {
            setLoading(true);
            // LƯU Ý: Sử dụng axios gốc cho việc download file từ link ngoài (ví dụ Google Drive)
            // Nếu dùng strapiv1Instance, nó sẽ gắn Authorization header của Strapi vào request gửi sang Google -> Lỗi CORS hoặc 403.
            // Ngoài ra interceptor ép kiểu trả về là response.data có thể làm hỏng luồng Blob.
            const response = await axios.get(targetUrl, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', item.name);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi tải file (có thể do CORS):", error);
            // Fallback: Mở tab mới
            window.open(targetUrl, "_blank");
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (item) => {
        if (item.mimeType === "application/vnd.google-apps.folder") {
            setCurrentFolder(item.id);
            setHistory([...history, { id: item.id, name: item.name }]);
        } else {
            window.open(item.url || item.webViewLink, "_blank");
        }
    };

    const openModal = (type, item = null) => {
        setModalType(type);
        setSelectedItem(item);
        if (type === 'rename') setInputValue(item.name);
        if (type === 'createFolder') setInputValue("");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
        setInputValue("");
        setSubmitting(false);
    };

    const handleBreadcrumb = (index) => {
        const newHistory = history.slice(0, index + 1);
        setHistory(newHistory);
        setCurrentFolder(newHistory[index].id);
    };

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
    };

    // --- LOGIC LỌC DANH SÁCH ---
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="file-manager-container">
            <CCard className="border-0 shadow-sm">
                <div className="drive-header">
                    <div className="d-flex align-items-center gap-3">
                        <CBreadcrumb className="drive-breadcrumb m-0">
                            {history.map((h, i) => (
                                <CBreadcrumbItem key={i} onClick={() => handleBreadcrumb(i)}>
                                    {i === 0 ? <CIcon icon={cilHome} /> : h.name}
                                </CBreadcrumbItem>
                            ))}
                        </CBreadcrumb>
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                        <div style={{ width: '250px' }}>
                            <CInputGroup size="sm">
                                <CInputGroupText className="bg-light border-end-0">
                                    <CIcon icon={cilSearch} size="sm" />
                                </CInputGroupText>
                                <CFormInput
                                    className="border-start-0 ps-0"
                                    placeholder="Tìm tên file..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </CInputGroup>
                        </div>

                        <CDropdown>
                            <CDropdownToggle color="primary">
                                <CIcon icon={cilCloudUpload} className="me-2" /> Mới
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem onClick={() => openModal('createFolder')} style={{ cursor: 'pointer' }}>
                                    <FaFolderPlus className="me-2 text-warning" size={18} /> Thư mục mới
                                </CDropdownItem>
                                <CDropdownItem onClick={() => uploadInputRef.current.click()} style={{ cursor: 'pointer' }}>
                                    <CIcon icon={cilCloudUpload} className="me-2" /> Tải tệp lên
                                </CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                        <input type="file" hidden ref={uploadInputRef} onChange={(e) => handleUpload(e.target.files[0])} />

                        <div className="btn-group">
                            <CButton color={viewMode === "grid" ? "info" : "light"} onClick={() => setViewMode("grid")}><CIcon icon={cilGrid} /></CButton>
                            <CButton color={viewMode === "list" ? "info" : "light"} onClick={() => setViewMode("list")}><CIcon icon={cilList} /></CButton>
                        </div>
                    </div>
                </div>

                <CCardBody className={`drop-zone ${dragActive ? "active" : ""}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                    {loading ? (
                        <div className="text-center py-5"><CSpinner color="primary" /> <div className="mt-2 text-muted">Đang xử lý...</div></div>
                    ) : (
                        <div className={viewMode === "grid" ? "d-flex flex-wrap gap-3" : "d-flex flex-column"}>
                            {filteredItems.length === 0 && (
                                <div className="text-center w-100 text-muted mt-5">
                                    {searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : "Thư mục trống"}
                                </div>
                            )}
                            {filteredItems.map((item) => (
                                viewMode === "grid" ? (
                                    <div key={item.id} className="file-grid-item" onClick={() => handleItemClick(item)}>
                                        <div className="item-preview">
                                            {item.mimeType.includes("image") && item.thumbnailLink ? (
                                                <img src={item.thumbnailLink} alt={item.name} className="thumb" />
                                            ) : (
                                                <span style={{ fontSize: '4rem' }}>{getFileIcon(item.mimeType, item.name)}</span>
                                            )}
                                        </div>
                                        <div className="item-footer">
                                            <div className="item-icon">{getFileIcon(item.mimeType, item.name)}</div>
                                            <div className="item-name" title={item.name}>
                                                {item.name}
                                            </div>
                                            <CDropdown className="item-actions" onClick={(e) => e.stopPropagation()}>
                                                <CDropdownToggle color="light" size="sm" caret={false} className="border-0 rounded-circle p-1">
                                                    <CIcon icon={cilOptions} style={{ transform: 'rotate(90deg)' }} />
                                                </CDropdownToggle>
                                                <CDropdownMenu>
                                                    {item.mimeType !== "application/vnd.google-apps.folder" && (
                                                        <CDropdownItem onClick={() => handleDownload(item)} style={{ cursor: 'pointer' }}>
                                                            <CIcon icon={cilCloudDownload} className="me-2" /> Tải xuống
                                                        </CDropdownItem>
                                                    )}
                                                    <CDropdownItem onClick={() => openModal('rename', item)} style={{ cursor: 'pointer' }}>Đổi tên</CDropdownItem>
                                                    <CDropdownItem className="text-danger" onClick={() => openModal('delete', item)} style={{ cursor: 'pointer' }}>
                                                        <CIcon icon={cilTrash} className="me-2" /> Xóa
                                                    </CDropdownItem>
                                                </CDropdownMenu>
                                            </CDropdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={item.id} className="file-list-row" onClick={() => handleItemClick(item)}>
                                        <div className="list-icon">{getFileIcon(item.mimeType, item.name)}</div>
                                        <div className="list-name text-truncate">{item.name}</div>
                                        <div className="list-size">--</div>
                                        <div className="list-actions">
                                            <CDropdown onClick={(e) => e.stopPropagation()}>
                                                <CDropdownToggle color="transparent" size="sm" caret={false}><CIcon icon={cilOptions} /></CDropdownToggle>
                                                <CDropdownMenu>
                                                    {item.mimeType !== "application/vnd.google-apps.folder" && (
                                                        <CDropdownItem onClick={() => handleDownload(item)} style={{ cursor: 'pointer' }}>
                                                            <CIcon icon={cilCloudDownload} className="me-2" /> Tải xuống
                                                        </CDropdownItem>
                                                    )}
                                                    <CDropdownItem onClick={() => openModal('rename', item)} style={{ cursor: 'pointer' }}>Đổi tên</CDropdownItem>
                                                    <CDropdownItem className="text-danger" onClick={() => openModal('delete', item)} style={{ cursor: 'pointer' }}>
                                                        <CIcon icon={cilTrash} className="me-2" /> Xóa
                                                    </CDropdownItem>
                                                </CDropdownMenu>
                                            </CDropdown>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </CCardBody>
            </CCard>

            {/* --- MODALS (Giữ nguyên) --- */}
            <CModal visible={modalType === 'delete'} onClose={!submitting ? closeModal : null}>
                <CModalHeader><strong>Xác nhận xóa</strong></CModalHeader>
                <CModalBody>Bạn có chắc chắn muốn xóa <b>{selectedItem?.name}</b>?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal} disabled={submitting}>Hủy</CButton>
                    <CButton color="danger" onClick={handleDelete} disabled={submitting}>
                        {submitting ? <CSpinner size="sm" /> : "Xóa vĩnh viễn"}
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={modalType === 'rename'} onClose={!submitting ? closeModal : null}>
                <CModalHeader><strong>Đổi tên</strong></CModalHeader>
                <CModalBody>
                    <CFormInput value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={submitting} />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal} disabled={submitting}>Hủy</CButton>
                    <CButton color="primary" onClick={handleRename} disabled={submitting}>
                        {submitting ? <CSpinner size="sm" /> : "Lưu"}
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={modalType === 'createFolder'} onClose={!submitting ? closeModal : null}>
                <CModalHeader><strong>Thư mục mới</strong></CModalHeader>
                <CModalBody>
                    <CFormInput
                        placeholder="Tên thư mục..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        disabled={submitting}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder() }}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal} disabled={submitting}>Hủy</CButton>
                    <CButton color="primary" onClick={handleCreateFolder} disabled={submitting}>
                        {submitting ? <><CSpinner size="sm" component="span" aria-hidden="true" className="me-2" />Đang tạo...</> : "Tạo"}
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
}
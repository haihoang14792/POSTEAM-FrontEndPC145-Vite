// import React, { useEffect, useState } from 'react'
// import {
//   CAvatar,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CWidgetStatsA,
//   CSpinner,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilPeople,
//   cilLaptop,
//   cilIndustry,
//   cilHome,
//   cilSpreadsheet,
//   cilOptions,
//   cilDescription,
//   cilCheckCircle,
//   cilClock,
//   cilWarning
// } from '@coreui/icons'
// import { CChartBar, CChartPie } from '@coreui/react-chartjs'

// // Import Services
// import { getUsers } from '../../services/userServices'
// import {
//   fetchDevices,
//   fetchTicket
// } from '../../services/storeServices'
// import {
//   fetchListSupplier,
//   fetchListWarehouse,
//   fetchImportlists,
//   fetchExportlists,
//   fetchExportLoanTicket
// } from '../../services/dhgServices'

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     usersCount: 0,
//     devicesCount: 0,
//     suppliersCount: 0,
//     warehousesCount: 0,
//     ticketsCount: 0,
//     importsCount: 0,
//     exportsCount: 0,
//   })

//   const [loading, setLoading] = useState(true)
//   const [deviceStatusData, setDeviceStatusData] = useState({})
//   const [pendingTickets, setPendingTickets] = useState([])

//   const extractData = (res) => {
//     if (!res) return []
//     if (Array.isArray(res)) return res
//     if (res.data && Array.isArray(res.data.data)) return res.data.data
//     if (res.data && Array.isArray(res.data)) return res.data
//     return []
//   }

//   useEffect(() => {
//     const loadDashboardData = async () => {
//       setLoading(true)

//       const safeRequest = async (promise, name) => {
//         try {
//           const res = await promise
//           return res
//         } catch (error) {
//           console.error(`❌ Lỗi API ${name}:`, error)
//           return null
//         }
//       }

//       const [
//         usersRes,
//         devicesRes,
//         suppliersRes,
//         warehousesRes,
//         deviceFormsRes,
//         exportTicketsRes,
//         importsRes,
//         exportsRes
//       ] = await Promise.all([
//         safeRequest(getUsers(), 'Users'),
//         safeRequest(fetchDevices(), 'Devices'),
//         safeRequest(fetchListSupplier(), 'Suppliers'),
//         safeRequest(fetchListWarehouse(), 'Warehouses'),
//         safeRequest(fetchTicket(), 'DeviceTickets'),
//         safeRequest(fetchExportLoanTicket(), 'ExportTickets'),
//         safeRequest(fetchImportlists(), 'Imports'),
//         safeRequest(fetchExportlists(), 'Exports')
//       ])

//       const usersCount = extractData(usersRes).length
//       const devicesList = Array.isArray(devicesRes) ? devicesRes : extractData(devicesRes)
//       const devicesCount = devicesList.length
//       const suppliersCount = extractData(suppliersRes).length
//       const warehousesCount = extractData(warehousesRes).length
//       const importsCount = extractData(importsRes).length
//       const exportsCount = extractData(exportsRes).length

//       const statusCount = devicesList.reduce((acc, device) => {
//         const attrs = device.attributes || device
//         const status = attrs.Status || 'Unknown'
//         acc[status] = (acc[status] || 0) + 1
//         return acc
//       }, {})

//       // --- XỬ LÝ PHIẾU CHỜ DUYỆT ---

//       let listDeviceForms = []
//       if (deviceFormsRes?.data && Array.isArray(deviceFormsRes.data)) {
//         listDeviceForms = deviceFormsRes.data
//       } else if (Array.isArray(deviceFormsRes)) {
//         listDeviceForms = deviceFormsRes
//       }

//       let listExportTickets = []
//       if (exportTicketsRes?.data && Array.isArray(exportTicketsRes.data)) {
//         listExportTickets = exportTicketsRes.data
//       } else if (Array.isArray(exportTicketsRes)) {
//         listExportTickets = exportTicketsRes
//       }

//       const formattedDeviceForms = listDeviceForms.map(item => ({
//         id: item.id,
//         code: item.attributes?.TicketName || item.attributes?.Ticket || `#${item.id}`,
//         type: 'QL Thiết Bị',
//         customer: item.attributes?.Customer || 'N/A',
//         status: item.attributes?.Status || 'Unknown',
//         date: item.attributes?.createdAt,
//         rawDate: new Date(item.attributes?.createdAt || 0),
//         model: item.attributes?.Model || ''
//       }))

//       const formattedExportTickets = listExportTickets.map(item => ({
//         id: item.id,
//         code: item.attributes?.TicketName || item.attributes?.Ticket || item.attributes?.NameExportLoan || `#EXP-${item.id}`,
//         type: 'Xuất Kho',
//         customer: item.attributes?.Customer || 'N/A',
//         status: item.attributes?.Status || 'Unknown',
//         date: item.attributes?.createdAt,
//         rawDate: new Date(item.attributes?.createdAt || 0),
//         model: item.attributes?.Model || ''
//       }))

//       const allTickets = [...formattedDeviceForms, ...formattedExportTickets]

//       // --- BỘ LỌC CHẶT CHẼ ---
//       const pendingList = allTickets.filter(t => {
//         // Chuẩn hóa status về chữ thường để so sánh
//         const s = (t.status || '').toLowerCase().trim();

//         if (!s) return false; // Không có status thì bỏ qua (hoặc coi là lỗi)

//         // 1. BLACKLIST (Những trạng thái CHẮC CHẮN KHÔNG lấy)
//         const excludeKeywords = [
//           'complete', 'done', 'hoàn thành', 'đã xong', 'finish', // Xong
//           'cancel', 'hủy', 'reject', 'từ chối',                 // Hủy/Từ chối
//           'approved', 'đã duyệt', 'approve',                    // Đã duyệt (Quan trọng)
//           'close', 'closed', 'đóng',                            // Đã đóng
//           'delivered', 'đã giao', 'giao hàng thành công'        // Đã giao
//         ];

//         if (excludeKeywords.some(k => s.includes(k))) return false;

//         // 2. WHITELIST (Những trạng thái lấy làm CHỜ DUYỆT)
//         // Chỉ lấy nếu chứa các từ khóa này
//         const acceptKeywords = [
//           'new', 'mới',
//           'pending', 'chờ', 'đang chờ',
//           'waiting', 'wait',
//           'process', 'xử lý', 'đang xử lý',
//           'created', 'vừa tạo'
//         ];

//         // Kiểm tra xem status có chứa từ khóa chấp nhận không
//         return acceptKeywords.some(k => s.includes(k));
//       }).sort((a, b) => b.rawDate - a.rawDate)

//       // Log để debug xem hệ thống lọc ra những trạng thái nào
//       console.log("Found Pending Tickets:", pendingList.length);
//       console.log("Unique Statuses in Pending:", [...new Set(pendingList.map(t => t.status))]);

//       setStats({
//         usersCount,
//         devicesCount,
//         suppliersCount,
//         warehousesCount,
//         ticketsCount: allTickets.length,
//         importsCount,
//         exportsCount
//       })
//       setDeviceStatusData(statusCount)
//       setPendingTickets(pendingList)
//       setLoading(false)
//     }

//     loadDashboardData()
//   }, [])

//   // Chart Data Setup
//   const chartPieData = {
//     labels: Object.keys(deviceStatusData),
//     datasets: [{
//       data: Object.values(deviceStatusData),
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
//     }],
//   }

//   const chartBarData = {
//     labels: ['Nhập Kho', 'Xuất Kho'],
//     datasets: [{
//       label: 'Số lượng phiếu',
//       backgroundColor: '#321fdb',
//       data: [stats.importsCount, stats.exportsCount],
//     }],
//   }

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
//         <CSpinner color="primary" />
//         <span className="ms-3">Đang tải dữ liệu hệ thống...</span>
//       </div>
//     )
//   }

//   return (
//     <>
//       <CRow>
//         <CCol xs={12} sm={6} lg={3}>
//           <CWidgetStatsA
//             className="mb-4"
//             color="primary"
//             value={<>{stats.usersCount} <span className="fs-6 fw-normal">User</span></>}
//             title="Nhân sự"
//             action={<CIcon icon={cilOptions} className="text-high-emphasis-inverse" />}
//             chart={<div className="mt-3 mx-3" style={{ height: '70px' }}><CIcon icon={cilPeople} size="5xl" className="text-white opacity-25" /></div>}
//           />
//         </CCol>
//         <CCol xs={12} sm={6} lg={3}>
//           <CWidgetStatsA
//             className="mb-4"
//             color="info"
//             value={<>{stats.devicesCount} <span className="fs-6 fw-normal">Thiết bị</span></>}
//             title="Tổng thiết bị"
//             action={<CIcon icon={cilOptions} className="text-high-emphasis-inverse" />}
//             chart={<div className="mt-3 mx-3" style={{ height: '70px' }}><CIcon icon={cilLaptop} size="5xl" className="text-white opacity-25" /></div>}
//           />
//         </CCol>
//         <CCol xs={12} sm={6} lg={3}>
//           <CWidgetStatsA
//             className="mb-4"
//             color="warning"
//             value={<>{stats.suppliersCount} <span className="fs-6 fw-normal">NCC</span></>}
//             title="Nhà Cung Cấp"
//             action={<CIcon icon={cilOptions} className="text-high-emphasis-inverse" />}
//             chart={<div className="mt-3 mx-3" style={{ height: '70px' }}><CIcon icon={cilIndustry} size="5xl" className="text-white opacity-25" /></div>}
//           />
//         </CCol>
//         <CCol xs={12} sm={6} lg={3}>
//           <CWidgetStatsA
//             className="mb-4"
//             color="danger"
//             value={<>{stats.warehousesCount} <span className="fs-6 fw-normal">Kho</span></>}
//             title="Kho bãi"
//             action={<CIcon icon={cilOptions} className="text-high-emphasis-inverse" />}
//             chart={<div className="mt-3 mx-3" style={{ height: '70px' }}><CIcon icon={cilHome} size="5xl" className="text-white opacity-25" /></div>}
//           />
//         </CCol>
//       </CRow>

//       <CRow>
//         <CCol xs={12} md={6}>
//           <CCard className="mb-4">
//             <CCardHeader>Thống kê Nhập / Xuất</CCardHeader>
//             <CCardBody>
//               <CChartBar data={chartBarData} />
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol xs={12} md={6}>
//           <CCard className="mb-4">
//             <CCardHeader>Trạng thái thiết bị</CCardHeader>
//             <CCardBody>
//               {Object.keys(deviceStatusData).length > 0 ? (
//                 <CChartPie data={chartPieData} />
//               ) : (
//                 <div className="text-center py-5">Chưa có dữ liệu thiết bị</div>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       <CRow>
//         <CCol xs>
//           <CCard className="mb-4">
//             <CCardHeader>
//               <strong>Phiếu Cần Xử Lý</strong> (Pending / New)
//             </CCardHeader>
//             <CCardBody>
//               <CRow className="mb-4">
//                 <CCol xs={12} md={6}>
//                   <div className="d-flex align-items-center border rounded p-3 bg-light">
//                     <CIcon icon={cilClock} size="xl" className="text-danger me-3" />
//                     <div>
//                       <div className="text-muted small">Đang chờ xử lý</div>
//                       <div className="fs-4 fw-bold text-dark">{pendingTickets.length} Phiếu</div>
//                     </div>
//                   </div>
//                 </CCol>
//               </CRow>

//               <CTable align="middle" className="mb-0 border" hover responsive>
//                 <CTableHead className="text-nowrap bg-light">
//                   <CTableRow>
//                     <CTableHeaderCell className="text-center" style={{ width: '50px' }}>#</CTableHeaderCell>
//                     <CTableHeaderCell>Loại Phiếu</CTableHeaderCell>
//                     <CTableHeaderCell>Mã Phiếu</CTableHeaderCell>
//                     <CTableHeaderCell>Khách hàng / Model</CTableHeaderCell>
//                     <CTableHeaderCell className="text-center">Trạng thái</CTableHeaderCell>
//                     <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {pendingTickets.length > 0 ? (
//                     pendingTickets.map((item, index) => (
//                       <CTableRow key={`${item.type}-${item.id}`}>
//                         <CTableDataCell className="text-center">
//                           {index + 1}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <span className={`badge ${item.type === 'Xuất Kho' ? 'bg-info text-white' : 'bg-success text-white'}`}>
//                             {item.type}
//                           </span>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="fw-semibold text-primary">{item.code}</div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="fw-bold">{item.customer}</div>
//                           <div className="small text-body-secondary">{item.model}</div>
//                         </CTableDataCell>
//                         <CTableDataCell className="text-center">
//                           <span className="badge bg-warning text-dark border border-warning">
//                             {item.status}
//                           </span>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="small text-muted">
//                             {item.rawDate.toLocaleDateString('vi-VN')} {item.rawDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
//                           </div>
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))
//                   ) : (
//                     <CTableRow>
//                       <CTableDataCell colSpan="6" className="text-center py-5">
//                         <div className="d-flex flex-column align-items-center">
//                           <CIcon icon={cilCheckCircle} size="4xl" className="text-success mb-3" />
//                           <h5 className="text-muted">Tuyệt vời! Không có phiếu tồn đọng.</h5>
//                         </div>
//                       </CTableDataCell>
//                     </CTableRow>
//                   )}
//                 </CTableBody>
//               </CTable>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </>
//   )
// }

// export default Dashboard


import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable,
  CTableBody, CTableDataCell, CTableHead, CTableHeaderCell,
  CTableRow, CWidgetStatsA, CSpinner, CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople, cilLaptop, cilIndustry, cilHome,
  cilCheckCircle, cilClock
} from '@coreui/icons'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'

// Import Services
import { getUsers } from '../../services/userServices'
import { fetchDevices, fetchTicket } from '../../services/storeServices'
import {
  fetchListSupplier,
  fetchWarehouseDetails,
  fetchImportlists,
  fetchExportlists,
  fetchExportLoanTicket
} from '../../services/dhgServices'

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    devicesTotal: 0,
    suppliersCount: 0,
    warehousesCount: 0,
    importsCount: 0,
    exportsCount: 0,
  })

  const [loading, setLoading] = useState(true)
  const [deviceStatusData, setDeviceStatusData] = useState({})
  const [pendingTickets, setPendingTickets] = useState([])

  // Hàm trích xuất dữ liệu cực kỳ an toàn
  const safeExtract = (res) => {
    if (!res) return [];
    // Xử lý các trường hợp Strapi: res.data.data (v4) hoặc res.data (v5)
    let raw = res.data?.data || res.data || res;
    return Array.isArray(raw) ? raw : [];
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const [
          usersRes, devicesRes, suppliersRes, warehouseDetailsRes,
          deviceFormsRes, exportTicketsRes, importsRes, exportsRes
        ] = await Promise.all([
          getUsers(), fetchDevices(), fetchListSupplier(), fetchWarehouseDetails(),
          fetchTicket(), fetchExportLoanTicket(), fetchImportlists(), fetchExportlists()
        ])

        const usersList = safeExtract(usersRes)
        const devicesList = safeExtract(devicesRes)
        const suppliersList = safeExtract(suppliersRes)
        const warehouseDetails = safeExtract(warehouseDetailsRes)
        const importsList = safeExtract(importsRes)
        const exportsList = safeExtract(exportsRes)
        const rawDeviceForms = safeExtract(deviceFormsRes)
        const rawExportTickets = safeExtract(exportTicketsRes)

        // 1. Tính tổng thiết bị thực tế (Cộng dồn số lượng trong kho)
        const totalQty = warehouseDetails.reduce((acc, item) => {
          const qty = item.attributes?.totalimport ?? item.totalimport ?? 0
          return acc + Number(qty)
        }, 0)

        // 2. Thống kê trạng thái thiết bị cho Pie Chart
        const statusMap = devicesList.reduce((acc, device) => {
          const status = device.attributes?.Status || device.Status || 'Khác'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})

        // 3. Xử lý PHIẾU CHỜ XỬ LÝ (QUAN TRỌNG: Sửa logic lọc)
        const formattedAll = [
          ...rawDeviceForms.map(item => ({
            id: item.id,
            code: item.attributes?.TicketName || item.attributes?.Votes || `TB-${item.id}`,
            type: 'Thiết Bị',
            customer: item.attributes?.Customer || 'N/A',
            status: item.attributes?.Status || 'Mới',
            date: new Date(item.attributes?.createdAt || item.createdAt),
          })),
          ...rawExportTickets.map(item => ({
            id: item.id,
            code: item.attributes?.Votes || item.attributes?.Ticket || `XK-${item.id}`,
            type: 'Xuất Kho',
            customer: item.attributes?.NameExportLoan || 'N/A',
            status: item.attributes?.Status || 'Mới',
            date: new Date(item.attributes?.createdAt || item.createdAt),
          }))
        ]

        // Lọc nghiêm ngặt: Chỉ lấy phiếu có trạng thái "Đang chờ", "Mới", "Pending"
        const filteredPending = formattedAll.filter(t => {
          const s = t.status ? t.status.toLowerCase().trim() : '';
          return s.includes('chờ') || s.includes('mới') || s.includes('pending') || s.includes('xử lý');
        }).sort((a, b) => b.date - a.date);

        setStats({
          usersCount: usersList.length,
          devicesTotal: totalQty,
          suppliersCount: suppliersList.length,
          warehousesCount: warehouseDetails.length,
          importsCount: importsList.length,
          exportsCount: exportsList.length
        })
        setDeviceStatusData(statusMap)
        setPendingTickets(filteredPending)

      } catch (error) {
        console.error("Lỗi đồng bộ dữ liệu Dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  // Cấu hình biểu đồ
  const chartPieData = {
    labels: Object.keys(deviceStatusData),
    datasets: [{
      data: Object.values(deviceStatusData),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  }

  const chartBarData = {
    labels: ['Nhập Kho', 'Xuất Kho'],
    datasets: [{
      label: 'Số lượng phiếu',
      backgroundColor: ['#321fdb', '#f87979'],
      data: [stats.importsCount, stats.exportsCount],
    }],
  }

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <CSpinner color="primary" variant="grow" />
        <div className="mt-3 text-muted fw-bold">Đang tải dữ liệu thực tế...</div>
      </div>
    )
  }

  return (
    <>
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 pb-3" color="primary"
            value={<div className="fs-3 fw-bold">{stats.usersCount}</div>}
            title="Nhân sự hệ thống"
            chart={<div className="mt-3 mx-3" style={{ height: '40px' }}><CIcon icon={cilPeople} size="3xl" className="text-white opacity-25" /></div>}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 pb-3" color="info"
            value={<div className="fs-3 fw-bold">{stats.devicesTotal.toLocaleString()}</div>}
            title="Tổng thiết bị trong kho"
            chart={<div className="mt-3 mx-3" style={{ height: '40px' }}><CIcon icon={cilLaptop} size="3xl" className="text-white opacity-25" /></div>}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 pb-3" color="warning"
            value={<div className="fs-3 fw-bold">{stats.suppliersCount}</div>}
            title="Nhà cung cấp"
            chart={<div className="mt-3 mx-3" style={{ height: '40px' }}><CIcon icon={cilIndustry} size="3xl" className="text-white opacity-25" /></div>}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4 pb-3" color="danger"
            value={<div className="fs-3 fw-bold">{stats.warehousesCount}</div>}
            title="Danh mục kho"
            chart={<div className="mt-3 mx-3" style={{ height: '40px' }}><CIcon icon={cilHome} size="3xl" className="text-white opacity-25" /></div>}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} lg={7}>
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="bg-white fw-bold">Thống kê Giao dịch</CCardHeader>
            <CCardBody>
              <CChartBar data={chartBarData} options={{ maintainAspectRatio: false }} style={{ height: '300px' }} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={5}>
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="bg-white fw-bold">Trạng thái thiết bị</CCardHeader>
            <CCardBody>
              <CChartPie data={chartPieData} options={{ maintainAspectRatio: false }} style={{ height: '300px' }} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs>
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="bg-white d-flex justify-content-between align-items-center">
              <span className="fw-bold text-danger"><CIcon icon={cilClock} className="me-2" />PHIẾU CHỜ XỬ LÝ (Đang chờ duyệt)</span>
              <CBadge color="danger" shape="rounded-pill">{pendingTickets.length}</CBadge>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="bg-light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">STT</CTableHeaderCell>
                    <CTableHeaderCell>Loại</CTableHeaderCell>
                    <CTableHeaderCell>Mã Phiếu</CTableHeaderCell>
                    <CTableHeaderCell>Khách hàng</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Trạng thái</CTableHeaderCell>
                    <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {pendingTickets.length > 0 ? (
                    pendingTickets.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                        <CTableDataCell><CBadge color={item.type === 'Xuất Kho' ? 'info' : 'success'}>{item.type}</CBadge></CTableDataCell>
                        <CTableDataCell className="fw-bold">{item.code}</CTableDataCell>
                        <CTableDataCell>{item.customer}</CTableDataCell>
                        <CTableDataCell className="text-center"><CBadge color="warning" className="text-dark">{item.status}</CBadge></CTableDataCell>
                        <CTableDataCell>{item.date.toLocaleDateString('vi-VN')}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center py-5 text-muted">
                        <CIcon icon={cilCheckCircle} size="3xl" className="text-success mb-2" /><br />
                        Không có phiếu nào đang chờ duyệt.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
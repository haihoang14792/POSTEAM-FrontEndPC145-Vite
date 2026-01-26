// import React from 'react'
// import classNames from 'classnames'

// import {
//   CAvatar,
//   CButton,
//   CButtonGroup,
//   CCard,
//   CCardBody,
//   CCardFooter,
//   CCardHeader,
//   CCol,
//   CProgress,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cibCcAmex,
//   cibCcApplePay,
//   cibCcMastercard,
//   cibCcPaypal,
//   cibCcStripe,
//   cibCcVisa,
//   cibGoogle,
//   cibFacebook,
//   cibLinkedin,
//   cifBr,
//   cifEs,
//   cifFr,
//   cifIn,
//   cifPl,
//   cifUs,
//   cibTwitter,
//   cilCloudDownload,
//   cilPeople,
//   cilUser,
//   cilUserFemale,
// } from '@coreui/icons'

// import avatar1 from '../../assets/images/avatars/1.jpg'
// import avatar2 from '../../assets/images/avatars/2.jpg'
// import avatar3 from '../../assets/images/avatars/3.jpg'
// import avatar4 from '../../assets/images/avatars/4.jpg'
// import avatar5 from '../../assets/images/avatars/5.jpg'
// import avatar6 from '../../assets/images/avatars/6.jpg'

// import WidgetsBrand from '../widgets/WidgetsBrand'
// import WidgetsDropdown from '../widgets/WidgetsDropdown'
// import MainChart from './MainChart'

// const Dashboard = () => {
//   const progressExample = [
//     { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
//     { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
//     { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
//     { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
//     { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
//   ]

//   const progressGroupExample1 = [
//     { title: 'Monday', value1: 34, value2: 78 },
//     { title: 'Tuesday', value1: 56, value2: 94 },
//     { title: 'Wednesday', value1: 12, value2: 67 },
//     { title: 'Thursday', value1: 43, value2: 91 },
//     { title: 'Friday', value1: 22, value2: 73 },
//     { title: 'Saturday', value1: 53, value2: 82 },
//     { title: 'Sunday', value1: 9, value2: 69 },
//   ]

//   const progressGroupExample2 = [
//     { title: 'Male', icon: cilUser, value: 53 },
//     { title: 'Female', icon: cilUserFemale, value: 43 },
//   ]

//   const progressGroupExample3 = [
//     { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
//     { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
//     { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
//     { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
//   ]

//   const tableExample = [
//     {
//       avatar: { src: avatar1, status: 'success' },
//       user: {
//         name: 'Yiorgos Avraamu',
//         new: true,
//         registered: 'Jan 1, 2023',
//       },
//       country: { name: 'USA', flag: cifUs },
//       usage: {
//         value: 50,
//         period: 'Jun 11, 2023 - Jul 10, 2023',
//         color: 'success',
//       },
//       payment: { name: 'Mastercard', icon: cibCcMastercard },
//       activity: '10 sec ago',
//     },
//     {
//       avatar: { src: avatar2, status: 'danger' },
//       user: {
//         name: 'Avram Tarasios',
//         new: false,
//         registered: 'Jan 1, 2023',
//       },
//       country: { name: 'Brazil', flag: cifBr },
//       usage: {
//         value: 22,
//         period: 'Jun 11, 2023 - Jul 10, 2023',
//         color: 'info',
//       },
//       payment: { name: 'Visa', icon: cibCcVisa },
//       activity: '5 minutes ago',
//     },
//     {
//       avatar: { src: avatar3, status: 'warning' },
//       user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
//       country: { name: 'India', flag: cifIn },
//       usage: {
//         value: 74,
//         period: 'Jun 11, 2023 - Jul 10, 2023',
//         color: 'warning',
//       },
//       payment: { name: 'Stripe', icon: cibCcStripe },
//       activity: '1 hour ago',
//     },
//     {
//       avatar: { src: avatar4, status: 'secondary' },
//       user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
//       country: { name: 'France', flag: cifFr },
//       usage: {
//         value: 98,
//         period: 'Jun 11, 2023 - Jul 10, 2023',
//         color: 'danger',
//       },
//       payment: { name: 'PayPal', icon: cibCcPaypal },
//       activity: 'Last month',
//     },
//     {
//       avatar: { src: avatar5, status: 'success' },
//       user: {
//         name: 'Agapetus Tadeáš',
//         new: true,
//         registered: 'Jan 1, 2023',
//       },
//       country: { name: 'Spain', flag: cifEs },
//       usage: {
//         value: 22,
//         period: 'Jun 11, 2023 - Jul 10, 2023',
//         color: 'primary',
//       },
//       payment: { name: 'Google Wallet', icon: cibCcApplePay },
//       activity: 'Last week',
//     },
//     {
//       avatar: { src: avatar6, status: 'danger' },
//       user: {
//         name: 'Friderik Dávid',
//         new: true,
//         registered: 'Jan 1, 2023',
//       },
//       country: { name: 'Poland', flag: cifPl },
//       usage: {
//         value: 43,
//         period: 'Jun 11, 2023 - Jul 10, 2023',
//         color: 'success',
//       },
//       payment: { name: 'Amex', icon: cibCcAmex },
//       activity: 'Last week',
//     },
//   ]

//   return (
//     <>
//       <WidgetsDropdown className="mb-4" />
//       <CCard className="mb-4">
//         <CCardBody>
//           <CRow>
//             <CCol sm={5}>
//               <h4 id="traffic" className="card-title mb-0">
//                 Traffic
//               </h4>
//               <div className="small text-body-secondary">January - July 2023</div>
//             </CCol>
//             <CCol sm={7} className="d-none d-md-block">
//               <CButton color="primary" className="float-end">
//                 <CIcon icon={cilCloudDownload} />
//               </CButton>
//               <CButtonGroup className="float-end me-3">
//                 {['Day', 'Month', 'Year'].map((value) => (
//                   <CButton
//                     color="outline-secondary"
//                     key={value}
//                     className="mx-0"
//                     active={value === 'Month'}
//                   >
//                     {value}
//                   </CButton>
//                 ))}
//               </CButtonGroup>
//             </CCol>
//           </CRow>
//           <MainChart />
//         </CCardBody>
//         <CCardFooter>
//           <CRow
//             xs={{ cols: 1, gutter: 4 }}
//             sm={{ cols: 2 }}
//             lg={{ cols: 4 }}
//             xl={{ cols: 5 }}
//             className="mb-2 text-center"
//           >
//             {progressExample.map((item, index, items) => (
//               <CCol
//                 className={classNames({
//                   'd-none d-xl-block': index + 1 === items.length,
//                 })}
//                 key={index}
//               >
//                 <div className="text-body-secondary">{item.title}</div>
//                 <div className="fw-semibold text-truncate">
//                   {item.value} ({item.percent}%)
//                 </div>
//                 <CProgress thin className="mt-2" color={item.color} value={item.percent} />
//               </CCol>
//             ))}
//           </CRow>
//         </CCardFooter>
//       </CCard>
//       <WidgetsBrand className="mb-4" withCharts />
//       <CRow>
//         <CCol xs>
//           <CCard className="mb-4">
//             <CCardHeader>Traffic {' & '} Sales</CCardHeader>
//             <CCardBody>
//               <CRow>
//                 <CCol xs={12} md={6} xl={6}>
//                   <CRow>
//                     <CCol xs={6}>
//                       <div className="border-start border-start-4 border-start-info py-1 px-3">
//                         <div className="text-body-secondary text-truncate small">New Clients</div>
//                         <div className="fs-5 fw-semibold">9,123</div>
//                       </div>
//                     </CCol>
//                     <CCol xs={6}>
//                       <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
//                         <div className="text-body-secondary text-truncate small">
//                           Recurring Clients
//                         </div>
//                         <div className="fs-5 fw-semibold">22,643</div>
//                       </div>
//                     </CCol>
//                   </CRow>
//                   <hr className="mt-0" />
//                   {progressGroupExample1.map((item, index) => (
//                     <div className="progress-group mb-4" key={index}>
//                       <div className="progress-group-prepend">
//                         <span className="text-body-secondary small">{item.title}</span>
//                       </div>
//                       <div className="progress-group-bars">
//                         <CProgress thin color="info" value={item.value1} />
//                         <CProgress thin color="danger" value={item.value2} />
//                       </div>
//                     </div>
//                   ))}
//                 </CCol>
//                 <CCol xs={12} md={6} xl={6}>
//                   <CRow>
//                     <CCol xs={6}>
//                       <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
//                         <div className="text-body-secondary text-truncate small">Pageviews</div>
//                         <div className="fs-5 fw-semibold">78,623</div>
//                       </div>
//                     </CCol>
//                     <CCol xs={6}>
//                       <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
//                         <div className="text-body-secondary text-truncate small">Organic</div>
//                         <div className="fs-5 fw-semibold">49,123</div>
//                       </div>
//                     </CCol>
//                   </CRow>

//                   <hr className="mt-0" />

//                   {progressGroupExample2.map((item, index) => (
//                     <div className="progress-group mb-4" key={index}>
//                       <div className="progress-group-header">
//                         <CIcon className="me-2" icon={item.icon} size="lg" />
//                         <span>{item.title}</span>
//                         <span className="ms-auto fw-semibold">{item.value}%</span>
//                       </div>
//                       <div className="progress-group-bars">
//                         <CProgress thin color="warning" value={item.value} />
//                       </div>
//                     </div>
//                   ))}

//                   <div className="mb-5"></div>

//                   {progressGroupExample3.map((item, index) => (
//                     <div className="progress-group" key={index}>
//                       <div className="progress-group-header">
//                         <CIcon className="me-2" icon={item.icon} size="lg" />
//                         <span>{item.title}</span>
//                         <span className="ms-auto fw-semibold">
//                           {item.value}{' '}
//                           <span className="text-body-secondary small">({item.percent}%)</span>
//                         </span>
//                       </div>
//                       <div className="progress-group-bars">
//                         <CProgress thin color="success" value={item.percent} />
//                       </div>
//                     </div>
//                   ))}
//                 </CCol>
//               </CRow>

//               <br />

//               <CTable align="middle" className="mb-0 border" hover responsive>
//                 <CTableHead className="text-nowrap">
//                   <CTableRow>
//                     <CTableHeaderCell className="bg-body-tertiary text-center">
//                       <CIcon icon={cilPeople} />
//                     </CTableHeaderCell>
//                     <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
//                     <CTableHeaderCell className="bg-body-tertiary text-center">
//                       Country
//                     </CTableHeaderCell>
//                     <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
//                     <CTableHeaderCell className="bg-body-tertiary text-center">
//                       Payment Method
//                     </CTableHeaderCell>
//                     <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {tableExample.map((item, index) => (
//                     <CTableRow v-for="item in tableItems" key={index}>
//                       <CTableDataCell className="text-center">
//                         <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div>{item.user.name}</div>
//                         <div className="small text-body-secondary text-nowrap">
//                           <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
//                           {item.user.registered}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell className="text-center">
//                         <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex justify-content-between text-nowrap">
//                           <div className="fw-semibold">{item.usage.value}%</div>
//                           <div className="ms-3">
//                             <small className="text-body-secondary">{item.usage.period}</small>
//                           </div>
//                         </div>
//                         <CProgress thin color={item.usage.color} value={item.usage.value} />
//                       </CTableDataCell>
//                       <CTableDataCell className="text-center">
//                         <CIcon size="xl" icon={item.payment.icon} />
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="small text-body-secondary text-nowrap">Last login</div>
//                         <div className="fw-semibold text-nowrap">{item.activity}</div>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))}
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
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsA,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilLaptop,
  cilIndustry,
  cilHome,
  cilSpreadsheet,
  cilOptions,
  cilDescription,
  cilCheckCircle,
  cilClock,
  cilWarning
} from '@coreui/icons'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'

// Import Services
import { getUsers } from '../../services/userServices'
import {
  fetchDevices,
  fetchTicket
} from '../../services/storeServices'
import {
  fetchListSupplier,
  fetchListWarehouse,
  fetchImportlists,
  fetchExportlists,
  fetchExportLoanTicket
} from '../../services/dhgServices'

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    devicesCount: 0,
    suppliersCount: 0,
    warehousesCount: 0,
    ticketsCount: 0,
    importsCount: 0,
    exportsCount: 0,
  })

  const [loading, setLoading] = useState(true)
  const [deviceStatusData, setDeviceStatusData] = useState({})
  const [pendingTickets, setPendingTickets] = useState([])

  const extractData = (res) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (res.data && Array.isArray(res.data.data)) return res.data.data
    if (res.data && Array.isArray(res.data)) return res.data
    return []
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)

      const safeRequest = async (promise, name) => {
        try {
          const res = await promise
          return res
        } catch (error) {
          console.error(`❌ Lỗi API ${name}:`, error)
          return null
        }
      }

      const [
        usersRes,
        devicesRes,
        suppliersRes,
        warehousesRes,
        deviceFormsRes,
        exportTicketsRes,
        importsRes,
        exportsRes
      ] = await Promise.all([
        safeRequest(getUsers(), 'Users'),
        safeRequest(fetchDevices(), 'Devices'),
        safeRequest(fetchListSupplier(), 'Suppliers'),
        safeRequest(fetchListWarehouse(), 'Warehouses'),
        safeRequest(fetchTicket(), 'DeviceTickets'),
        safeRequest(fetchExportLoanTicket(), 'ExportTickets'),
        safeRequest(fetchImportlists(), 'Imports'),
        safeRequest(fetchExportlists(), 'Exports')
      ])

      const usersCount = extractData(usersRes).length
      const devicesList = Array.isArray(devicesRes) ? devicesRes : extractData(devicesRes)
      const devicesCount = devicesList.length
      const suppliersCount = extractData(suppliersRes).length
      const warehousesCount = extractData(warehousesRes).length
      const importsCount = extractData(importsRes).length
      const exportsCount = extractData(exportsRes).length

      const statusCount = devicesList.reduce((acc, device) => {
        const attrs = device.attributes || device
        const status = attrs.Status || 'Unknown'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {})

      // --- XỬ LÝ PHIẾU CHỜ DUYỆT ---

      let listDeviceForms = []
      if (deviceFormsRes?.data && Array.isArray(deviceFormsRes.data)) {
        listDeviceForms = deviceFormsRes.data
      } else if (Array.isArray(deviceFormsRes)) {
        listDeviceForms = deviceFormsRes
      }

      let listExportTickets = []
      if (exportTicketsRes?.data && Array.isArray(exportTicketsRes.data)) {
        listExportTickets = exportTicketsRes.data
      } else if (Array.isArray(exportTicketsRes)) {
        listExportTickets = exportTicketsRes
      }

      const formattedDeviceForms = listDeviceForms.map(item => ({
        id: item.id,
        code: item.attributes?.TicketName || item.attributes?.Ticket || `#${item.id}`,
        type: 'QL Thiết Bị',
        customer: item.attributes?.Customer || 'N/A',
        status: item.attributes?.Status || 'Unknown',
        date: item.attributes?.createdAt,
        rawDate: new Date(item.attributes?.createdAt || 0),
        model: item.attributes?.Model || ''
      }))

      const formattedExportTickets = listExportTickets.map(item => ({
        id: item.id,
        code: item.attributes?.TicketName || item.attributes?.Ticket || item.attributes?.NameExportLoan || `#EXP-${item.id}`,
        type: 'Xuất Kho',
        customer: item.attributes?.Customer || 'N/A',
        status: item.attributes?.Status || 'Unknown',
        date: item.attributes?.createdAt,
        rawDate: new Date(item.attributes?.createdAt || 0),
        model: item.attributes?.Model || ''
      }))

      const allTickets = [...formattedDeviceForms, ...formattedExportTickets]

      // --- BỘ LỌC CHẶT CHẼ ---
      const pendingList = allTickets.filter(t => {
        // Chuẩn hóa status về chữ thường để so sánh
        const s = (t.status || '').toLowerCase().trim();

        if (!s) return false; // Không có status thì bỏ qua (hoặc coi là lỗi)

        // 1. BLACKLIST (Những trạng thái CHẮC CHẮN KHÔNG lấy)
        const excludeKeywords = [
          'complete', 'done', 'hoàn thành', 'đã xong', 'finish', // Xong
          'cancel', 'hủy', 'reject', 'từ chối',                 // Hủy/Từ chối
          'approved', 'đã duyệt', 'approve',                    // Đã duyệt (Quan trọng)
          'close', 'closed', 'đóng',                            // Đã đóng
          'delivered', 'đã giao', 'giao hàng thành công'        // Đã giao
        ];

        if (excludeKeywords.some(k => s.includes(k))) return false;

        // 2. WHITELIST (Những trạng thái lấy làm CHỜ DUYỆT)
        // Chỉ lấy nếu chứa các từ khóa này
        const acceptKeywords = [
          'new', 'mới',
          'pending', 'chờ', 'đang chờ',
          'waiting', 'wait',
          'process', 'xử lý', 'đang xử lý',
          'created', 'vừa tạo'
        ];

        // Kiểm tra xem status có chứa từ khóa chấp nhận không
        return acceptKeywords.some(k => s.includes(k));
      }).sort((a, b) => b.rawDate - a.rawDate)

      // Log để debug xem hệ thống lọc ra những trạng thái nào
      console.log("Found Pending Tickets:", pendingList.length);
      console.log("Unique Statuses in Pending:", [...new Set(pendingList.map(t => t.status))]);

      setStats({
        usersCount,
        devicesCount,
        suppliersCount,
        warehousesCount,
        ticketsCount: allTickets.length,
        importsCount,
        exportsCount
      })
      setDeviceStatusData(statusCount)
      setPendingTickets(pendingList)
      setLoading(false)
    }

    loadDashboardData()
  }, [])

  // Chart Data Setup
  const chartPieData = {
    labels: Object.keys(deviceStatusData),
    datasets: [{
      data: Object.values(deviceStatusData),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
    }],
  }

  const chartBarData = {
    labels: ['Nhập Kho', 'Xuất Kho'],
    datasets: [{
      label: 'Số lượng phiếu',
      backgroundColor: '#321fdb',
      data: [stats.importsCount, stats.exportsCount],
    }],
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <CSpinner color="primary" />
        <span className="ms-3">Đang tải dữ liệu hệ thống...</span>
      </div>
    )
  }

  return (
    <>
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={<>{stats.usersCount} <span className="fs-6 fw-normal">User</span></>}
            title="Nhân sự"
            action={<CIcon icon={cilOptions} className="text-high-emphasis-inverse" />}
            chart={<div className="mt-3 mx-3" style={{ height: '70px' }}><CIcon icon={cilPeople} size="5xl" className="text-white opacity-25" /></div>}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={<>{stats.devicesCount} <span className="fs-6 fw-normal">Thiết bị</span></>}
            title="Tổng thiết bị"
            action={<CIcon icon={cilOptions} className="text-high-emphasis-inverse" />}
            chart={<div className="mt-3 mx-3" style={{ height: '70px' }}><CIcon icon={cilLaptop} size="5xl" className="text-white opacity-25" /></div>}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={<>{stats.suppliersCount} <span className="fs-6 fw-normal">NCC</span></>}
            title="Nhà Cung Cấp"
            action={<CIcon icon={cilOptions} className="text-high-emphasis-inverse" />}
            chart={<div className="mt-3 mx-3" style={{ height: '70px' }}><CIcon icon={cilIndustry} size="5xl" className="text-white opacity-25" /></div>}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={<>{stats.warehousesCount} <span className="fs-6 fw-normal">Kho</span></>}
            title="Kho bãi"
            action={<CIcon icon={cilOptions} className="text-high-emphasis-inverse" />}
            chart={<div className="mt-3 mx-3" style={{ height: '70px' }}><CIcon icon={cilHome} size="5xl" className="text-white opacity-25" /></div>}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Thống kê Nhập / Xuất</CCardHeader>
            <CCardBody>
              <CChartBar data={chartBarData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Trạng thái thiết bị</CCardHeader>
            <CCardBody>
              {Object.keys(deviceStatusData).length > 0 ? (
                <CChartPie data={chartPieData} />
              ) : (
                <div className="text-center py-5">Chưa có dữ liệu thiết bị</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Phiếu Cần Xử Lý</strong> (Pending / New)
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                <CCol xs={12} md={6}>
                  <div className="d-flex align-items-center border rounded p-3 bg-light">
                    <CIcon icon={cilClock} size="xl" className="text-danger me-3" />
                    <div>
                      <div className="text-muted small">Đang chờ xử lý</div>
                      <div className="fs-4 fw-bold text-dark">{pendingTickets.length} Phiếu</div>
                    </div>
                  </div>
                </CCol>
              </CRow>

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap bg-light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center" style={{ width: '50px' }}>#</CTableHeaderCell>
                    <CTableHeaderCell>Loại Phiếu</CTableHeaderCell>
                    <CTableHeaderCell>Mã Phiếu</CTableHeaderCell>
                    <CTableHeaderCell>Khách hàng / Model</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Trạng thái</CTableHeaderCell>
                    <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {pendingTickets.length > 0 ? (
                    pendingTickets.map((item, index) => (
                      <CTableRow key={`${item.type}-${item.id}`}>
                        <CTableDataCell className="text-center">
                          {index + 1}
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className={`badge ${item.type === 'Xuất Kho' ? 'bg-info text-white' : 'bg-success text-white'}`}>
                            {item.type}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold text-primary">{item.code}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-bold">{item.customer}</div>
                          <div className="small text-body-secondary">{item.model}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <span className="badge bg-warning text-dark border border-warning">
                            {item.status}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="small text-muted">
                            {item.rawDate.toLocaleDateString('vi-VN')} {item.rawDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <CIcon icon={cilCheckCircle} size="4xl" className="text-success mb-3" />
                          <h5 className="text-muted">Tuyệt vời! Không có phiếu tồn đọng.</h5>
                        </div>
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
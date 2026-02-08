import React, { useEffect, useState, useMemo } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable,
  CTableBody, CTableDataCell, CTableHead, CTableHeaderCell,
  CTableRow, CWidgetStatsA, CSpinner, CBadge, CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople, cilLaptop, cilIndustry, cilHome,
  cilCheckCircle, cilClock, cilArrowTop, cilArrowBottom, cilWarning
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
  const [data, setData] = useState({
    users: [],
    devices: [],
    suppliers: [],
    warehouse: [],
    imports: [],
    exports: [],
    tickets: [],
    loading: true
  })

  // 1. Hàm trích xuất dữ liệu Strapi chuẩn hóa (v4 & v5)
  const normalizeStrapiData = (res) => {
    if (!res) return [];
    // Ưu tiên lấy từ data.data (v4) hoặc data (v5/v1 instance)
    const raw = res.data?.data || res.data || (Array.isArray(res) ? res : []);
    return Array.isArray(raw) ? raw : [];
  }

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [
          u, dev, sup, war, t1, t2, imp, exp
        ] = await Promise.all([
          getUsers(), fetchDevices(), fetchListSupplier(), fetchWarehouseDetails(),
          fetchTicket(), fetchExportLoanTicket(), fetchImportlists(), fetchExportlists()
        ]);

        setData({
          users: normalizeStrapiData(u),
          devices: normalizeStrapiData(dev),
          suppliers: normalizeStrapiData(sup),
          warehouse: normalizeStrapiData(war),
          tickets: [...normalizeStrapiData(t1), ...normalizeStrapiData(t2)],
          imports: normalizeStrapiData(imp),
          exports: normalizeStrapiData(exp),
          loading: false
        });
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    loadAllData();
  }, []);

  // 2. Tính toán Logic bằng useMemo để tối ưu hiệu năng
  const stats = useMemo(() => {
    const totalInventory = data.warehouse.reduce((sum, item) => {
      const qty = item.attributes?.totalimport ?? item.totalimport ?? 0;
      return sum + Number(qty);
    }, 0);

    const deviceStatus = data.devices.reduce((acc, dev) => {
      const status = dev.attributes?.Status || dev.Status || 'N/A';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const pendingList = data.tickets
      .map(t => {
        const attr = t.attributes || t;
        return {
          id: t.id,
          code: attr.Votes || attr.TicketName || attr.Ticket || `ID-${t.id}`,
          type: attr.TicketName ? 'Thiết Bị' : 'Xuất Kho',
          customer: attr.Customer || attr.NameExportLoan || 'Khách lẻ',
          status: attr.Status || 'Mới',
          date: new Date(attr.createdAt)
        }
      })
      .filter(t => {
        const s = t.status.toLowerCase();
        return s.includes('chờ') || s.includes('mới') || s.includes('pending') || s.includes('xử lý');
      })
      .sort((a, b) => b.date - a.date);

    return { totalInventory, deviceStatus, pendingList };
  }, [data]);

  // 3. Render Helper
  if (data.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="text-center">
          <CSpinner color="primary" size="lg" />
          <div className="mt-3 text-primary fw-bold">ĐANG ĐỒNG BỘ DỮ LIỆU HỆ THỐNG...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* HÀNG 1: CHỈ SỐ TỔNG QUAN */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            color="primary"
            value={<div className="fs-4">{data.users.length} <small className="fs-6 opacity-75">Người</small></div>}
            title="Nhân sự hệ thống"
            chart={<CIcon icon={cilPeople} size="3xl" className="my-4 opacity-25" />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            color="info"
            value={<div className="fs-4">{stats.totalInventory.toLocaleString()} <small className="fs-6 opacity-75">Cái</small></div>}
            title="Tồn kho thực tế"
            chart={<CIcon icon={cilLaptop} size="3xl" className="my-4 opacity-25" />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            color="warning"
            value={<div className="fs-4">{data.suppliers.length} <small className="fs-6 opacity-75">Đối tác</small></div>}
            title="Nhà cung cấp"
            chart={<CIcon icon={cilIndustry} size="3xl" className="my-4 opacity-25 text-dark" />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            color="danger"
            value={<div className="fs-4">{data.warehouse.length} <small className="fs-6 opacity-75">Vị trí</small></div>}
            title="Danh mục kho"
            chart={<CIcon icon={cilHome} size="3xl" className="my-4 opacity-25" />}
          />
        </CCol>
      </CRow>

      {/* HÀNG 2: BIỂU ĐỒ PHÂN TÍCH */}
      <CRow className="mb-4">
        <CCol lg={8}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader className="bg-white py-3 d-flex justify-content-between">
              <span className="fw-bold"><CIcon icon={cilArrowTop} className="text-success me-2" />Lưu lượng Nhập - Xuất</span>
              <div className="small text-muted">Dựa trên {data.imports.length + data.exports.length} giao dịch</div>
            </CCardHeader>
            <CCardBody>
              <CChartBar
                style={{ height: '300px' }}
                data={{
                  labels: ['Nhập Kho (Lô)', 'Xuất Kho (Lô)'],
                  datasets: [{
                    label: 'Số lượng phiếu đã xử lý',
                    backgroundColor: ['#321fdb', '#f9b115'],
                    data: [data.imports.length, data.exports.length],
                    barPercentage: 0.4
                  }]
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader className="bg-white py-3 fw-bold">Tỉ lệ Trạng thái Thiết bị</CCardHeader>
            <CCardBody className="d-flex align-items-center">
              <CChartPie
                style={{ height: '260px' }}
                data={{
                  labels: Object.keys(stats.deviceStatus),
                  datasets: [{
                    data: Object.values(stats.deviceStatus),
                    backgroundColor: ['#4bc0c0', '#36a2eb', '#ff6384', '#f9b115', '#9966ff'],
                  }]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* HÀNG 3: DANH SÁCH PHIẾU CHỜ */}
      <CRow>
        <CCol xs={12}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-danger fw-bold">
                <CIcon icon={cilWarning} className="me-2" />
                DANH SÁCH PHIẾU CẦN XỬ LÝ
              </h5>
              <CBadge color="danger" shape="rounded-pill" className="px-3 py-2">
                {stats.pendingList.length} Phiếu
              </CBadge>
            </CCardHeader>
            <CCardBody className="px-0">
              <CTable hover responsive align="middle" className="mb-0">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">#</CTableHeaderCell>
                    <CTableHeaderCell>Loại Phiếu</CTableHeaderCell>
                    <CTableHeaderCell>Mã Số</CTableHeaderCell>
                    <CTableHeaderCell>Khách Hàng / Đối Tác</CTableHeaderCell>
                    <CTableHeaderCell>Ngày Tạo</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Trạng Thái</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {stats.pendingList.length > 0 ? (
                    stats.pendingList.map((item, index) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell className="text-center text-muted small">{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={item.type === 'Xuất Kho' ? 'info' : 'success'} variant="outline">
                            {item.type}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="fw-bold">{item.code}</CTableDataCell>
                        <CTableDataCell>{item.customer}</CTableDataCell>
                        <CTableDataCell>{item.date.toLocaleDateString('vi-VN')}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge color="warning" className="text-dark p-2">
                            <CIcon icon={cilClock} className="me-1" /> {item.status}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center py-5">
                        <CIcon icon={cilCheckCircle} size="3xl" className="text-success mb-2 opacity-25" /><br />
                        <span className="text-muted">Tất cả phiếu đã được xử lý hoàn tất!</span>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
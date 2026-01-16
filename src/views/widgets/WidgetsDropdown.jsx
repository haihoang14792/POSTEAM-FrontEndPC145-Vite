import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchProjectDHG, fetchListCustomer } from '../../services/strapiServices';

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs'; // Xóa CChartBar vì không sử dụng
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info');
          widgetChartRef2.current.update();
        });
      }
    });
  }, [widgetChartRef1, widgetChartRef2]);

  const [storeCount, setStoreCount] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState({});
  const [percentChange, setPercentChange] = useState(0);

  const processData = (data) => {
    if (!data || !Array.isArray(data.data)) {
      console.error('Dữ liệu không đúng định dạng:', data);
      return { storeCount: 0, monthlyStats: {}, percentChange: 0 };
    }

    const projects = data.data;
    const storeCount = projects.length;
    const monthlyStats = projects.reduce((acc, project) => {
      const month = new Date(project.attributes.createdAt).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const months = Object.keys(monthlyStats).map(Number).sort((a, b) => a - b);
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2] ?? currentMonth;
    const currentMonthCount = monthlyStats[currentMonth] ?? 0;
    const previousMonthCount = monthlyStats[previousMonth] ?? 0;

    const percentChange = previousMonthCount
      ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
      : 0;

    return { storeCount, monthlyStats, percentChange };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProjectDHG();
        const { storeCount, monthlyStats, percentChange } = processData(data);

        setStoreCount(storeCount);
        setMonthlyStats(monthlyStats);
        setPercentChange(percentChange);
      } catch (error) {
        console.error('Failed to fetch project data:', error);
      }
    };

    loadData();
  }, []);

  const [activeStores, setActiveStores] = useState([]);

  const loadCustomerData = async () => {
    try {
      const response = await fetchListCustomer();
      console.log('Dữ liệu khách hàng:', response); // Kiểm tra cấu trúc dữ liệu ở đây

      if (response && response.data && Array.isArray(response.data)) {
        // const activeCount = response.data.filter(customer => customer.attributes.Status).length;
        setActiveStores(response.data.filter(customer => customer.attributes.Status)); // Lưu danh sách cửa hàng
      } else {
        console.error('Dữ liệu không đúng định dạng:', response);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu khách hàng:', error);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  const chartData = {
    labels: Object.keys(monthlyStats).map(month => `Tháng ${Number(month) + 1}`),
    datasets: [
      {
        label: 'Số lượng',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        data: Object.values(monthlyStats),
      },
    ],
  };

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              Store {storeCount}
              <span className="fs-6 fw-normal">
                ({percentChange.toFixed(2)}% {percentChange < 0 ? <CIcon icon={cilArrowBottom} /> : <CIcon icon={cilArrowTop} />})
              </span>
            </>
          }
          title="Dự án"
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={chartData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {activeStores.length}
              </span>
            </>
          }
          title="Cửa hàng đang hoạt động"
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '58px' }}
              data={{
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                datasets: [
                  {
                    label: 'Active Stores',
                    backgroundColor: 'rgba(255,255,255,.3)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [10, 20, 30, 40, 50, 60, 70], // Bạn có thể thay bằng dữ liệu thật nếu có
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              2.49%{' '}
              <span className="fs-6 fw-normal">
                (84.7% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Conversion Rate"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.3)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
};

export default WidgetsDropdown;

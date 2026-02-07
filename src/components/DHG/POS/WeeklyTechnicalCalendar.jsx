// import React, { useState } from 'react';
// import { Card, Table, Tag, Typography, Select, Space, Badge } from 'antd';
// import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
// import './WeeklyTechnicalCalendar.scss';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const WeeklyTechnicalCalendar = () => {
//     const [selectedWeek, setSelectedWeek] = useState('week4');

//     // Dữ liệu mẫu dựa trên file CSV bạn đã cung cấp 
//     const technicalStaff = [
//         { key: '1', name: 'Tô Hoàng Nam', week3: 'Lễ tết', week4: 'Trực T2-T6 & T7-CN' },
//         { key: '2', name: 'Nguyễn Phi Hoàng Long', week3: 'Lễ tết', week4: 'O' },
//         { key: '3', name: 'Tống Hồng Phong', week3: 'Lễ tết', week4: 'Trực T2-T6 & T7-CN' },
//         { key: '4', name: 'Hồ Đình Phong', week1: 'Trực T2-T6 & T7-CN', week2: '' },
//         { key: '5', name: 'Bùi Văn Ân', week1: '', week2: 'Trực T2-T6' },
//     ];

//     // Cấu trúc bảng chi tiết cho Tuần 4 (23/02/2026 - 01/03/2026) 
//     const detailedDailyData = [
//         { key: '1', staff: 'Tô Hoàng Nam', mon: 'X', tue: 'X', wed: 'X', thu: 'X', fri: 'X', sat: 'O', sun: 'O' },
//         { key: '2', staff: 'Nguyễn Phi Hoàng Long', mon: 'O', tue: 'O', wed: 'O', thu: 'O', fri: 'O', sat: 'X', sun: 'O' },
//         { key: '3', staff: 'Tống Hồng Phong', mon: 'X', tue: 'X', wed: 'X', thu: 'X', fri: 'X', sat: 'X', sun: 'X' },
//         { key: '4', staff: 'Nguyễn Văn Luân', mon: 'X', tue: 'X', wed: 'O', thu: 'O', fri: 'O', sat: 'O', sun: 'O' },
//     ];

//     const columns = [
//         { title: 'Kỹ Thuật', dataIndex: 'staff', key: 'staff', fixed: 'left', render: (text) => <b>{text}</b> },
//         { title: 'T2 (23/02)', dataIndex: 'mon', key: 'mon', render: (val) => renderStatus(val) },
//         { title: 'T3 (24/02)', dataIndex: 'tue', key: 'tue', render: (val) => renderStatus(val) },
//         { title: 'T4 (25/02)', dataIndex: 'wed', key: 'wed', render: (val) => renderStatus(val) },
//         { title: 'T5 (26/02)', dataIndex: 'thu', key: 'thu', render: (val) => renderStatus(val) },
//         { title: 'T6 (27/02)', dataIndex: 'fri', key: 'fri', render: (val) => renderStatus(val) },
//         {
//             title: 'T7 (28/02)',
//             dataIndex: 'sat',
//             key: 'sat',
//             className: 'weekend-column',
//             render: (val) => renderStatus(val, true)
//         },
//         {
//             title: 'CN (01/03)',
//             dataIndex: 'sun',
//             key: 'sun',
//             className: 'weekend-column',
//             render: (val) => renderStatus(val, true)
//         },
//     ];

//     const renderStatus = (status, isWeekend = false) => {
//         if (status === 'X') return <Badge status="processing" text="Trực chính" color={isWeekend ? 'red' : 'blue'} />;
//         if (status === 'O') return <Badge status="default" text="Nghỉ" />;
//         return <Text type="secondary">-</Text>;
//     };

//     return (
//         <div className="weekly-calendar-container">
//             <Card bordered={false} className="calendar-card">
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//                     <Space>
//                         <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
//                         <Title level={4} style={{ margin: 0 }}>Quản Lý Lịch Trực Kỹ Thuật</Title>
//                     </Space>

//                     <Space>
//                         <span>Chọn tuần:</span>
//                         <Select defaultValue="week4" style={{ width: 200 }} onChange={setSelectedWeek}>
//                             <Option value="week1">Tuần 1 (02/02 - 08/02)</Option>
//                             <Option value="week2">Tuần 2 (09/02 - 15/02)</Option>
//                             <Option value="week3">Tuần 3 (Lễ Tết)</Option>
//                             <Option value="week4">Tuần 4 (23/02 - 01/03)</Option>
//                         </Select>
//                     </Space>
//                 </div>

//                 <div className="summary-tags" style={{ marginBottom: 20 }}>
//                     <Tag color="blue">X: Trực chính (T2-T6)</Tag>
//                     <Tag color="red">X: Trực cuối tuần (T7-CN)</Tag>
//                     <Tag color="default">O: Nghỉ/Off</Tag>
//                 </div>

//                 <Table
//                     columns={columns}
//                     dataSource={detailedDailyData}
//                     pagination={false}
//                     bordered
//                     scroll={{ x: 800 }}
//                     summary={() => (
//                         <Table.Summary fixed>
//                             <Table.Summary.Row>
//                                 <Table.Summary.Cell index={0}><b>Tổng ca trực</b></Table.Summary.Cell>
//                                 <Table.Summary.Cell index={1} colSpan={7}>
//                                     <Text type="danger">Lưu ý: Tuần 3 là lịch nghỉ Lễ tết theo quy định.</Text>
//                                 </Table.Summary.Cell>
//                             </Table.Summary.Row>
//                         </Table.Summary>
//                     )}
//                 />
//             </Card>
//         </div>
//     );
// };

// export default WeeklyTechnicalCalendar;


// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Card, Table, Tag, Typography, Select, Space, Badge, Button, Tooltip, message } from 'antd';
// import { CalendarOutlined, PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import weekday from 'dayjs/plugin/weekday';
// import localeData from 'dayjs/plugin/localeData';
// import './WeeklyTechnicalCalendar.scss';

// // Import service chuẩn của bạn
// import { getDutySchedules, fetchUsers } from '../../../services/userServices';
// import DutyManagementModal from './DutyManagementModal';

// // Cấu hình để Thứ 2 là ngày bắt đầu tuần
// dayjs.extend(weekday);
// dayjs.extend(localeData);

// const { Title, Text } = Typography;
// const { Option } = Select;

// const WeeklyTechnicalCalendar = () => {
//     const [loading, setLoading] = useState(false);
//     const [staffList, setStaffList] = useState([]); // Chứa danh sách Name và id
//     const [dutyData, setDutyData] = useState([]);
//     const [currentDate, setCurrentDate] = useState(dayjs());
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingValues, setEditingValues] = useState(null);

//     // 1. Logic tính toán các tuần trong tháng hiện tại (Động 4 hoặc 5 tuần)
//     const weeksInMonth = useMemo(() => {
//         const startOfMonth = currentDate.startOf('month');
//         const endOfMonth = currentDate.endOf('month');
//         const weeks = [];

//         // Tìm ngày Thứ 2 của tuần chứa ngày 1 đầu tháng
//         let startPointer = startOfMonth.startOf('week').add(1, 'day');
//         if (startPointer.isAfter(startOfMonth)) {
//             startPointer = startPointer.subtract(1, 'week');
//         }

//         while (startPointer.isBefore(endOfMonth) || startPointer.isSame(endOfMonth, 'day')) {
//             const endPointer = startPointer.add(6, 'day');
//             weeks.push({
//                 start: startPointer,
//                 end: endPointer,
//                 label: `Tuần ${weeks.length + 1} (${startPointer.format('DD/MM')} - ${endPointer.format('DD/MM')})`
//             });
//             startPointer = startPointer.add(1, 'week');
//         }
//         return weeks;
//     }, [currentDate.format('YYYY-MM')]);

//     // 2. Xác định danh sách 7 ngày hiển thị chuẩn (Thứ 2 -> Chủ Nhật)
//     const days = useMemo(() => {
//         const start = currentDate.startOf('week').add(1, 'day');
//         return Array.from({ length: 7 }).map((_, i) => start.add(i, 'day'));
//     }, [currentDate]);

//     // 3. Fetch dữ liệu nhân viên và lịch trực
//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         try {
//             // Gọi fetchUsers từ abicoServices
//             const users = await fetchUsers();
//             // Map lại để lấy Name và lọc bỏ những user không hợp lệ (nếu cần)
//             const formattedStaff = users.map(u => ({
//                 id: u.id,
//                 Name: u.Name || u.username // Ưu tiên Name để lấy đủ họ tên
//             }));
//             setStaffList(formattedStaff);

//             const startOfMonth = currentDate.startOf('month').format('YYYY-MM-DD');
//             const endOfMonth = currentDate.endOf('month').format('YYYY-MM-DD');
//             const res = await getDutySchedules(startOfMonth, endOfMonth);

//             if (res.EC === 0) {
//                 setDutyData(res.DT || []);
//             }
//         } catch (error) {
//             console.error("Lỗi load dữ liệu:", error);
//             message.error("Không thể tải dữ liệu");
//         } finally {
//             setLoading(false);
//         }
//     }, [currentDate.format('YYYY-MM')]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const renderStatusCell = (record, date) => {
//         const dateStr = date.format('YYYY-MM-DD');
//         const isWeekend = [0, 6].includes(date.day());

//         const duty = dutyData?.find(item =>
//             item?.attributes?.duty_date === dateStr &&
//             item?.attributes?.technical?.data?.id === record.id
//         );

//         if (!duty) return (
//             <div className="cell-content" onClick={() => {
//                 setEditingValues({ technical: record.id, duty_date: dateStr });
//                 setIsModalOpen(true);
//             }}>
//                 <Text type="secondary">O</Text>
//             </div>
//         );

//         const shiftType = duty.attributes?.shift_type;
//         let color = "blue";
//         let text = "X";

//         if (shiftType === 'Holiday') {
//             color = "orange";
//             text = "LỄ";
//         } else if (isWeekend || shiftType === 'Weekend') {
//             color = "red";
//             text = "X";
//         }

//         return (
//             <div className="cell-content" onClick={() => {
//                 setEditingValues({
//                     id: duty.id,
//                     technical: record.id,
//                     duty_date: dateStr,
//                     shift_type: shiftType,
//                     task_note: duty.attributes?.task_note
//                 });
//                 setIsModalOpen(true);
//             }}>
//                 <Tooltip title={duty.attributes?.task_note || "Trực chính"}>
//                     <Badge status="processing" text={text} color={color} />
//                 </Tooltip>
//             </div>
//         );
//     };

//     const columns = [
//         {
//             title: 'Kỹ Thuật',
//             dataIndex: 'Name', // Sử dụng trường Name đã map
//             key: 'name',
//             fixed: 'left',
//             width: 180,
//             render: (text) => <b>{text}</b>
//         },
//         ...days.map((date) => ({
//             title: (
//                 <div style={{ textAlign: 'center' }}>
//                     <div style={{ color: [0, 6].includes(date.day()) ? '#ff4d4f' : 'inherit' }}>
//                         {date.format('dddd')}
//                     </div>
//                     <small>{date.format('DD/MM')}</small>
//                 </div>
//             ),
//             key: date.format('YYYY-MM-DD'),
//             className: [0, 6].includes(date.day()) ? 'weekend-column' : '',
//             render: (_, record) => renderStatusCell(record, date)
//         })),
//     ];

//     return (
//         <div className="weekly-calendar-container">
//             <Card bordered={false} className="calendar-card">
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '15px' }}>
//                     <Space>
//                         <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
//                         <Title level={4} style={{ margin: 0 }}>Quản Lý Lịch Trực Kỹ Thuật</Title>
//                     </Space>

//                     <Space wrap>
//                         <span>Chọn tuần:</span>
//                         <Select
//                             value={days[0].format('YYYY-MM-DD')}
//                             style={{ width: 250 }}
//                             onChange={(val) => setCurrentDate(dayjs(val))}
//                         >
//                             {weeksInMonth.map((w, idx) => (
//                                 <Option key={idx} value={w.start.format('YYYY-MM-DD')}>
//                                     {w.label}
//                                 </Option>
//                             ))}
//                         </Select>
//                         <Button icon={<LeftOutlined />} onClick={() => setCurrentDate(currentDate.subtract(1, 'week'))} />
//                         <Button onClick={() => setCurrentDate(dayjs())}>Hiện tại</Button>
//                         <Button icon={<RightOutlined />} onClick={() => setCurrentDate(currentDate.add(1, 'week'))} />
//                         <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingValues(null); setIsModalOpen(true); }}>
//                             Đăng ký
//                         </Button>
//                     </Space>
//                 </div>

//                 <div className="summary-tags" style={{ marginBottom: 20 }}>
//                     <Space wrap>
//                         <Tag color="blue">X: Trực chính (T2-T6)</Tag>
//                         <Tag color="red">X: Trực cuối tuần (T7-CN)</Tag>
//                         <Tag color="orange">LỄ: Trực Lễ/Tết</Tag>
//                         <Tag color="default">O: Nghỉ/Off</Tag>
//                     </Space>
//                 </div>

//                 <Table
//                     columns={columns}
//                     dataSource={staffList}
//                     rowKey="id"
//                     pagination={false}
//                     bordered
//                     loading={loading}
//                     scroll={{ x: 1000 }}
//                 />
//             </Card>

//             <DutyManagementModal
//                 visible={isModalOpen}
//                 staffList={staffList}
//                 initialValues={editingValues}
//                 onCancel={() => setIsModalOpen(false)}
//                 onSuccess={fetchData}
//             />
//         </div>
//     );
// };

// export default WeeklyTechnicalCalendar; 


// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Card, Table, Tag, Typography, Select, Space, Badge, Button, Tooltip, message } from 'antd';
// import { CalendarOutlined, PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import weekday from 'dayjs/plugin/weekday';
// import localeData from 'dayjs/plugin/localeData';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import 'dayjs/locale/vi'; // Sử dụng tiếng Việt để Thứ 2 là đầu tuần
// import './WeeklyTechnicalCalendar.scss';

// // Import services
// import { fetchUsers, getDutySchedules } from '../../../services/userServices';
// import DutyManagementModal from './DutyManagementModal';

// // Extend dayjs
// dayjs.extend(weekday);
// dayjs.extend(localeData);
// dayjs.extend(customParseFormat);
// dayjs.locale('vi'); // Quan trọng: Đặt locale là Việt Nam

// const { Title, Text } = Typography;
// const { Option } = Select;

// const WeeklyTechnicalCalendar = () => {
//     const [loading, setLoading] = useState(false);
//     const [staffList, setStaffList] = useState([]);
//     const [dutyData, setDutyData] = useState([]);
//     const [currentDate, setCurrentDate] = useState(dayjs());
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingValues, setEditingValues] = useState(null);

//     // 1. Logic xác định 7 ngày trong tuần (Luôn bắt đầu từ Thứ 2)
//     const days = useMemo(() => {
//         // startOf('week') khi dùng locale 'vi' sẽ là Thứ 2
//         const startOfWeek = currentDate.startOf('week');
//         return Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));
//     }, [currentDate]);

//     // 2. Logic tính toán các tuần trong tháng (Dùng để chọn tuần)
//     const weeksInMonth = useMemo(() => {
//         const startOfMonth = currentDate.startOf('month');
//         const endOfMonth = currentDate.endOf('month');
//         const weeks = [];

//         let startPointer = startOfMonth.startOf('week');

//         // Lặp để lấy hết các tuần có chứa ngày trong tháng này
//         while (startPointer.isBefore(endOfMonth)) {
//             const endPointer = startPointer.add(6, 'day');
//             weeks.push({
//                 start: startPointer,
//                 end: endPointer,
//                 label: `Tuần ${weeks.length + 1} (${startPointer.format('DD/MM')} - ${endPointer.format('DD/MM')})`
//             });
//             startPointer = startPointer.add(1, 'week');
//         }
//         return weeks;
//     }, [currentDate.format('YYYY-MM')]);

//     // 3. Fetch dữ liệu
//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         try {
//             const users = await fetchUsers();
//             // Lọc và format lại danh sách theo Name
//             const formattedStaff = users
//                 .filter(u => !u.blocked) // Chỉ lấy user không bị khóa
//                 .map(u => ({
//                     id: u.id,
//                     Name: u.Name || u.username
//                 }));
//             setStaffList(formattedStaff);

//             // Lấy dữ liệu lịch trực (trong khoảng rộng của tháng để bao phủ hết các tuần)
//             const startRange = currentDate.startOf('month').subtract(7, 'day').format('YYYY-MM-DD');
//             const endRange = currentDate.endOf('month').add(7, 'day').format('YYYY-MM-DD');
//             const res = await getDutySchedules(startRange, endRange);

//             if (res.EC === 0) {
//                 setDutyData(res.DT || []);
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             message.error("Lỗi tải dữ liệu lịch trực");
//         } finally {
//             setLoading(false);
//         }
//     }, [currentDate.format('YYYY-MM')]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     // 4. Render nội dung ô trạng thái
//     const renderStatusCell = (record, date) => {
//         const dateStr = date.format('YYYY-MM-DD');
//         const isWeekend = date.day() === 0 || date.day() === 6; // CN là 0, T7 là 6

//         const duty = dutyData?.find(item =>
//             item?.attributes?.duty_date === dateStr &&
//             item?.attributes?.technical?.data?.id === record.id
//         );

//         if (!duty) return (
//             <div className="cell-content" onClick={() => {
//                 setEditingValues({ technical: record.id, duty_date: dateStr });
//                 setIsModalOpen(true);
//             }}>
//                 <Text type="secondary">O</Text>
//             </div>
//         );

//         const shiftType = duty.attributes?.shift_type;
//         let badgeColor = "blue";
//         let displayText = "X";

//         if (shiftType === 'Holiday') {
//             badgeColor = "orange";
//             displayText = "LỄ";
//         } else if (isWeekend || shiftType === 'Weekend') {
//             badgeColor = "red";
//             displayText = "X";
//         }

//         return (
//             <div className="cell-content" onClick={() => {
//                 setEditingValues({
//                     id: duty.id,
//                     technical: record.id,
//                     duty_date: dateStr,
//                     shift_type: shiftType,
//                     task_note: duty.attributes?.task_note
//                 });
//                 setIsModalOpen(true);
//             }}>
//                 <Tooltip title={duty.attributes?.task_note || "Trực chính"}>
//                     <Badge status="processing" text={displayText} color={badgeColor} />
//                 </Tooltip>
//             </div>
//         );
//     };

//     const columns = [
//         {
//             title: 'Kỹ Thuật',
//             dataIndex: 'Name',
//             key: 'name',
//             fixed: 'left',
//             width: 180,
//             render: (text) => <b>{text}</b>
//         },
//         ...days.map((date) => ({
//             title: (
//                 <div style={{ textAlign: 'center' }}>
//                     <div style={{ color: (date.day() === 0 || date.day() === 6) ? '#ff4d4f' : 'inherit', fontWeight: 'bold' }}>
//                         {date.format('dddd')}
//                     </div>
//                     <small style={{ color: '#8c8c8c' }}>{date.format('DD/MM')}</small>
//                 </div>
//             ),
//             key: date.format('YYYY-MM-DD'),
//             className: (date.day() === 0 || date.day() === 6) ? 'weekend-column' : '',
//             render: (_, record) => renderStatusCell(record, date)
//         })),
//     ];

//     return (
//         <div className="weekly-calendar-container">
//             <Card bordered={false} className="calendar-card">
//                 <div className="calendar-header-custom">
//                     <Space size="middle">
//                         <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
//                         <Title level={4} style={{ margin: 0 }}>Quản Lý Lịch Trực</Title>
//                     </Space>

//                     <Space wrap className="calendar-controls">
//                         <span>Chọn tuần:</span>
//                         <Select
//                             value={days[0].format('YYYY-MM-DD')}
//                             style={{ width: 260 }}
//                             onChange={(val) => setCurrentDate(dayjs(val))}
//                         >
//                             {weeksInMonth.map((w, idx) => (
//                                 <Option key={idx} value={w.start.format('YYYY-MM-DD')}>
//                                     {w.label}
//                                 </Option>
//                             ))}
//                         </Select>
//                         <Button.Group>
//                             <Button icon={<LeftOutlined />} onClick={() => setCurrentDate(currentDate.subtract(1, 'week'))} />
//                             <Button onClick={() => setCurrentDate(dayjs())}>Hiện tại</Button>
//                             <Button icon={<RightOutlined />} onClick={() => setCurrentDate(currentDate.add(1, 'week'))} />
//                         </Button.Group>
//                         <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingValues(null); setIsModalOpen(true); }}>
//                             Đăng ký
//                         </Button>
//                     </Space>
//                 </div>

//                 <div className="summary-tags" style={{ margin: '16px 0' }}>
//                     <Space size={[0, 8]} wrap>
//                         <Tag color="blue">X: Trực chính (T2-T6)</Tag>
//                         <Tag color="red">X: Trực cuối tuần (T7-CN)</Tag>
//                         <Tag color="orange">LỄ: Trực Lễ/Tết</Tag>
//                         <Tag color="default">O: Nghỉ/Off</Tag>
//                     </Space>
//                 </div>

//                 <Table
//                     columns={columns}
//                     dataSource={staffList}
//                     rowKey="id"
//                     pagination={false}
//                     bordered
//                     loading={loading}
//                     scroll={{ x: 1000 }}
//                     size="middle"
//                 />
//             </Card>

//             <DutyManagementModal
//                 visible={isModalOpen}
//                 staffList={staffList}
//                 initialValues={editingValues}
//                 onCancel={() => setIsModalOpen(false)}
//                 onSuccess={fetchData}
//             />
//         </div>
//     );
// };

// export default WeeklyTechnicalCalendar;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Table, Tag, Typography, Select, Space, Badge, Button, Tooltip, message } from 'antd';
import { CalendarOutlined, PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/vi';
import './WeeklyTechnicalCalendar.scss';

import { fetchUsers } from '../../../services/abicoServices';
import { getDutySchedules } from '../../../services/userServices';
import DutyManagementModal from './DutyManagementModal';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale('vi');

const { Title, Text } = Typography;
const { Option } = Select;

const WeeklyTechnicalCalendar = () => {
    const [loading, setLoading] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [dutyData, setDutyData] = useState([]);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingValues, setEditingValues] = useState(null);

    // 1. Xác định đúng ngày bắt đầu hiển thị của tuần hiện tại (Luôn là Thứ 2)
    const currentWeekStart = useMemo(() => {
        // Nếu là Chủ Nhật (0), lùi lại 6 ngày để lấy Thứ 2 tuần trước
        // Nếu là Thứ 2-7, dùng startOf('week') của locale 'vi'
        return currentDate.day() === 0 ? currentDate.subtract(6, 'day') : currentDate.startOf('week');
    }, [currentDate]);

    // 2. Logic tính toán danh sách các tuần trong tháng (Động 4-5 tuần)
    const weeksInMonth = useMemo(() => {
        const startOfMonth = currentDate.startOf('month');
        const endOfMonth = currentDate.endOf('month');
        const weeks = [];

        // Tìm Thứ 2 đầu tiên để tính tuần: 
        // Nếu ngày 1 là CN, Thứ 2 tuần tới là ngày 2. Nếu ngày 1 là Thứ 2-7, lấy đầu tuần đó.
        let startPointer = startOfMonth.day() === 0 ? startOfMonth.add(1, 'day') : startOfMonth.startOf('week');

        while (startPointer.isBefore(endOfMonth) || startPointer.isSame(endOfMonth, 'day')) {
            const endPointer = startPointer.add(6, 'day');
            weeks.push({
                start: startPointer,
                end: endPointer,
                label: `Tuần ${weeks.length + 1} (${startPointer.format('DD/MM')} - ${endPointer.format('DD/MM')})`
            });
            startPointer = startPointer.add(1, 'week');
        }
        return weeks;
    }, [currentDate.format('YYYY-MM')]);

    // 3. Danh sách 7 ngày hiển thị trên cột (T2 -> CN)
    const days = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => currentWeekStart.add(i, 'day'));
    }, [currentWeekStart]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const users = await fetchUsers();
            setStaffList(users.filter(u => u.Weekly === true).map(u => ({ id: u.id, Name: u.Name || u.username })));

            const startRange = currentDate.startOf('month').format('YYYY-MM-DD');
            const endRange = currentDate.endOf('month').format('YYYY-MM-DD');
            const res = await getDutySchedules(startRange, endRange);

            if (res.EC === 0) {
                // Strapi v5: Dữ liệu nằm trực tiếp trong DT, dùng item.duty_date
                setDutyData(res.DT || []);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDate.format('YYYY-MM')]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const renderStatusCell = (record, date) => {
        const dateStr = date.format('YYYY-MM-DD');
        const isWeekend = [0, 6].includes(date.day());

        // FIX: So khớp dữ liệu Strapi v5
        const duty = dutyData?.find(item =>
            item?.duty_date === dateStr &&
            (item?.technical?.id === record.id || item?.technical?.data?.id === record.id)
        );

        if (!duty) return (
            <div className="cell-content" onClick={() => {
                setEditingValues({ technical: record.id, duty_date: dateStr });
                setIsModalOpen(true);
            }}>
                <Text type="secondary">O</Text>
            </div>
        );

        const shiftType = duty.shift_type;
        let color = "blue";
        let text = "X";

        if (shiftType === 'Holiday') { color = "orange"; text = "LỄ"; }
        else if (isWeekend) { color = "red"; }

        return (
            <div className="cell-content" onClick={() => {
                setEditingValues({
                    id: duty.id,
                    technical: record.id,
                    duty_date: dateStr,
                    shift_type: shiftType,
                    task_note: duty.task_note
                });
                setIsModalOpen(true);
            }}>
                <Tooltip title={duty.task_note || "Trực chính"}>
                    <Badge status="processing" text={text} color={color} />
                </Tooltip>
            </div>
        );
    };

    const columns = [
        { title: 'Kỹ Thuật', dataIndex: 'Name', key: 'name', fixed: 'left', width: 180, render: (t) => <b>{t}</b> },
        ...days.map(date => ({
            title: <div style={{ textAlign: 'center' }}><div>{date.format('dddd')}</div><small>{date.format('DD/MM')}</small></div>,
            key: date.format('YYYY-MM-DD'),
            className: [0, 6].includes(date.day()) ? 'weekend-column' : '',
            render: (_, record) => renderStatusCell(record, date)
        }))
    ];

    return (
        <div className="weekly-calendar-container">
            <Card bordered={false} className="calendar-card">
                <div className="calendar-header-custom" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                    <Space size="middle">
                        <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>Quản Lý Lịch Trực</Title>
                    </Space>

                    <Space wrap>
                        <span>Tuần:</span>
                        <Select
                            value={currentWeekStart.format('YYYY-MM-DD')}
                            style={{ width: 250 }}
                            onChange={v => setCurrentDate(dayjs(v))}
                        >
                            {weeksInMonth.map((w, i) => (
                                <Option key={i} value={w.start.format('YYYY-MM-DD')}>{w.label}</Option>
                            ))}
                        </Select>
                        <Button.Group>
                            <Button icon={<LeftOutlined />} onClick={() => setCurrentDate(currentDate.subtract(1, 'week'))} />
                            <Button onClick={() => setCurrentDate(dayjs())}>Hiện tại</Button>
                            <Button icon={<RightOutlined />} onClick={() => setCurrentDate(currentDate.add(1, 'week'))} />
                        </Button.Group>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingValues(null); setIsModalOpen(true); }}>
                            Đăng ký
                        </Button>
                    </Space>
                </div>

                <div className="summary-tags" style={{ marginBottom: 20 }}>
                    <Space wrap>
                        <Tag color="blue">X: Trực chính (T2-T6)</Tag>
                        <Tag color="red">X: Trực cuối tuần (T7-CN)</Tag>
                        <Tag color="orange">LỄ: Trực Lễ/Tết</Tag>
                        <Tag color="default">O: Nghỉ/Off</Tag>
                    </Space>
                </div>

                <Table columns={columns} dataSource={staffList} rowKey="id" pagination={false} bordered loading={loading} scroll={{ x: 1000 }} />
            </Card>
            <DutyManagementModal visible={isModalOpen} staffList={staffList} initialValues={editingValues} onCancel={() => setIsModalOpen(false)} onSuccess={fetchData} />
        </div>
    );
};

export default WeeklyTechnicalCalendar;
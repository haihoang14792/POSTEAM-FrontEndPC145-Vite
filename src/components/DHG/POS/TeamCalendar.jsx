import React, { useState } from 'react';
import { Select, Card, Row, Col, Table, Tag } from 'antd';
import './TeamCalendar.scss';

const { Option } = Select;

const TeamCalendar = () => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [viewMode, setViewMode] = useState('MONTH');

  // const calendarSrc = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
  //   'dhgpos@gmail.com'
  // )}&ctz=Asia%2FHo_Chi_Minh&mode=${viewMode}&showTitle=0&showPrint=0&showTabs=0&showCalendars=0`;

  const calendarSrc = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
    "abicovn93@gmail.com"
  )}&ctz=Asia%2FHo_Chi_Minh&mode=${viewMode}&showTitle=0&showPrint=0&showTabs=0&showCalendars=0`;




  return (
    <Card
      title="📅 Lịch phân công kỹ thuật"
      bordered={false}
      style={{ width: '100%', height: '100%' }}
    >
      <Row gutter={16} className="calendar-controls">
        <Col xs={24} sm={12} md={8}>
          <span>Chế độ xem:&nbsp;</span>
          <Select value={viewMode} onChange={setViewMode} style={{ width: '100%' }}>
            <Option value="DAY">Ngày</Option>
            <Option value="WEEK">Tuần</Option>
            <Option value="MONTH">Tháng</Option>
            <Option value="AGENDA">Danh sách</Option>
          </Select>
        </Col>
      </Row>

      <div className="calendar-frame">
        <iframe
          src={calendarSrc}
          style={{ border: 0 }}
          width="100%"
          height="700"
          frameBorder="0"
          scrolling="no"
          title="Lịch làm việc"
        ></iframe>
      </div>

      {/* <h3 style={{ marginTop: '24px' }}>📌 Bảng phân công ngày 16/06</h3>
      <Table
        dataSource={assignmentData}
        columns={columns}
        pagination={false}
        rowKey="name"
        bordered
      /> */}
    </Card>
  );
};

export default TeamCalendar;

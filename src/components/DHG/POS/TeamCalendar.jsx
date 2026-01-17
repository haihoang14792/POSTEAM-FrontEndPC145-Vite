import React, { useState } from 'react';
import { Select, Card, Row, Col } from 'antd';
import './TeamCalendar.scss';

const { Option } = Select;

const TeamCalendar = () => {
  // Biến selectedUser không dùng nên đã xóa
  const [viewMode, setViewMode] = useState('MONTH');

  const calendarSrc = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
    "abicovn93@gmail.com"
  )}&ctz=Asia%2FHo_Chi_Minh&mode=${viewMode}&showTitle=0&showPrint=0&showTabs=0&showCalendars=0`;

  return (
    <Card
      title="📅 Lịch phân công kỹ thuật"
      bordered={false}
      style={{ width: '100%', height: '100%' }}
    >
      <Row gutter={16} className="calendar-controls" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8, whiteSpace: 'nowrap' }}>Chế độ xem:</span>
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: '100%' }}
            >
              <Option value="DAY">Ngày</Option>
              <Option value="WEEK">Tuần</Option>
              <Option value="MONTH">Tháng</Option>
              <Option value="AGENDA">Danh sách</Option>
            </Select>
          </div>
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
    </Card>
  );
};

export default TeamCalendar;
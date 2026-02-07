import React from "react";
import "./Contact.scss";

const Contact = () => {
  return (
    <div className="apple-contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="headline">Liên hệ Đại Hoàng Gia.</h1>
          <p className="subhead">Chúng tôi luôn ở đây để hỗ trợ doanh nghiệp của bạn.</p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="contact-methods">
        <div className="container">
          <div className="methods-grid">

            {/* Card 1: Kinh doanh */}
            <div className="method-card">
              <div className="icon">💼</div>
              <h3>Tư vấn giải pháp</h3>
              <p>Bạn cần giải pháp POS hoặc máy in cho hệ thống mới? Chuyên gia của chúng tôi sẽ phản hồi trong 24h.</p>
              <a href="mailto:sales@daihoanggia.com" className="cta-link">Gửi email cho bộ phận Sales &gt;</a>
            </div>

            {/* Card 2: Kỹ thuật */}
            <div className="method-card">
              <div className="icon">🛠️</div>
              <h3>Hỗ trợ kỹ thuật</h3>
              <p>Gặp sự cố về vận hành hoặc cần bảo trì thiết bị Toshiba? Đội ngũ kỹ thuật luôn sẵn sàng.</p>
              <a href="tel:0123456789" className="cta-link">Gọi hỗ trợ ngay &gt;</a>
            </div>

            {/* Card 3: Văn phòng */}
            <div className="method-card">
              <div className="icon">📍</div>
              <h3>Ghé thăm chúng tôi</h3>
              <p>Trụ sở chính tại TP. Hồ Chí Minh. Hãy đến để trải nghiệm trực tiếp các dòng máy mới nhất.</p>
              <a href="https://maps.google.com" target="_blank" className="cta-link">Xem chỉ đường &gt;</a>
            </div>

          </div>
        </div>
      </section>

      {/* Simple Form Section - Tối giản kiểu Apple */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-wrapper">
            <h2>Gửi lời nhắn trực tiếp</h2>
            <form className="apple-form">
              <div className="input-group">
                <input type="text" placeholder="Họ và tên" required />
                <input type="email" placeholder="Email công việc" required />
              </div>
              <textarea placeholder="Chúng tôi có thể giúp gì cho bạn?" rows="5"></textarea>
              <button type="submit" className="btn-submit">Gửi thông điệp</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="contact-footer-info">
        <div className="container">
          <div className="info-row">
            <div className="info-item">
              <span>Hotline:</span>
              <p>(+84) 28 1234 5678</p>
            </div>
            <div className="info-item">
              <span>Thời gian làm việc:</span>
              <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
              <p>Thứ 7: 8:00 - 12:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
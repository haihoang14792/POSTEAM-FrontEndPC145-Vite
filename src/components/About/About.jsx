import "./About.scss";
const About = (props) => {
  return (
    <div className="app.container-about">
      <div className="container">
        <h1>Giới Thiệu Công Ty TNHH TM Đại Hoàng Gia</h1>
        <div className="space"></div>
        <p>
          Công ty TNHH Thương Mại Đại Hoàng Gia là đơn vị hàng đầu tại Việt Nam,
          chuyên cung cấp các sản phẩm máy in và hệ thống POS (Point of Sale),
          cùng với các dịch vụ liên quan. Với nhiều năm kinh nghiệm trong ngành,
          Đại Hoàng Gia đã khẳng định được vị thế của mình thông qua việc cung
          cấp các sản phẩm chất lượng và dịch vụ chuyên nghiệp.
        </p>

        <div className="section">
          <h2>1. Sản Phẩm Máy In Toshiba</h2>
          <div className="space"></div>
          <ul>
            <li>
              <strong>Máy MFP Toshiba màu:</strong> Đáp ứng nhu cầu in ấn hình
              ảnh, tài liệu màu với chất lượng sắc nét, phù hợp cho doanh nghiệp
              và cá nhân cần in ấn các tài liệu đòi hỏi độ chính xác về màu sắc.
            </li>
            <div className="space"></div>
            <li>
              <strong>Máy MFP Toshiba trắng đen:</strong> Mang lại giải pháp in
              ấn tiết kiệm và hiệu quả cho văn phòng và doanh nghiệp cần in số
              lượng lớn tài liệu văn bản.
            </li>
            <div className="space"></div>
            <li>
              <strong>Máy in barcode:</strong> Toshiba cung cấp các giải pháp in
              ấn mã vạch chuyên nghiệp, giúp doanh nghiệp quản lý hàng hóa và
              dịch vụ một cách hiệu quả.
            </li>
          </ul>
        </div>

        <div className="section">
          <h2>2. Hệ Thống POS Toshiba</h2>
          <div className="space"></div>
          <ul>
            <li>
              <strong>POS TCX800 và TCX810:</strong> Đây là các dòng máy tính
              tiền POS tiên tiến, được thiết kế với công nghệ mới nhất, đảm bảo
              hiệu suất cao, phù hợp cho nhiều loại hình kinh doanh như bán lẻ,
              nhà hàng và các dịch vụ khác.
            </li>
            <div className="space"></div>
            <li>
              <strong>Máy in TOSHIBA HSP100 và HSP150:</strong> Được thiết kế để
              in hóa đơn nhanh chóng và chính xác, các sản phẩm này mang lại sự
              tiện lợi và độ tin cậy cao trong quá trình sử dụng hàng ngày.
            </li>
          </ul>
        </div>

        <div className="section">
          <h2>3. Dịch Vụ Hỗ Trợ và Bảo Hành</h2>
          <div className="space"></div>
          <ul>
            <li>
              <strong>Dịch vụ tư vấn:</strong> Cung cấp giải pháp tư vấn chuyên
              nghiệp để giúp khách hàng lựa chọn sản phẩm phù hợp với nhu cầu.
            </li>
            <div className="space"></div>
            <li>
              <strong>Dịch vụ lắp đặt:</strong> Hỗ trợ lắp đặt và hướng dẫn sử
              dụng sản phẩm tại chỗ.
            </li>
            <div className="space"></div>
            <li>
              <strong>Dịch vụ bảo hành và sửa chữa:</strong> Hệ thống bảo hành
              của chúng tôi luôn sẵn sàng hỗ trợ khách hàng nhanh chóng, đảm bảo
              sản phẩm hoạt động ổn định và bền lâu.
            </li>
          </ul>
        </div>

        <div className="section">
          <h2>4. Dịch Vụ F&B và Siêu Thị</h2>
          <div className="space"></div>
          <p>
            Với nhiều năm kinh nghiệm phục vụ các khách hàng lớn tại Việt Nam,
            Đại Hoàng Gia cung cấp các dịch vụ cho các lĩnh vực F&B, siêu thị,
            và cửa hàng tiện lợi. Chúng tôi đã và đang đồng hành cùng nhiều
            thương hiệu lớn, cung cấp giải pháp tối ưu cho việc quản lý, vận
            hành, và phát triển kinh doanh.
          </p>
        </div>

        <div className="section">
          <h2>5. Cam Kết của Chúng Tôi</h2>
          <div className="space"></div>
          <p>
            Với phương châm “Chất lượng tạo nên uy tín”, Đại Hoàng Gia luôn đặt
            lợi ích của khách hàng lên hàng đầu. Chúng tôi cam kết cung cấp sản
            phẩm chính hãng, giá cả cạnh tranh, và dịch vụ tận tâm nhằm mang đến
            cho khách hàng trải nghiệm tốt nhất.
          </p>
          <div className="space"></div>
          <p>
            Công ty TNHH TM Đại Hoàng Gia tự hào là đối tác tin cậy của nhiều
            doanh nghiệp trên toàn quốc, luôn nỗ lực không ngừng để mang lại
            những giải pháp tốt nhất, góp phần vào sự phát triển bền vững của
            khách hàng và đối tác.
          </p>
        </div>
      </div>
    </div>
  );
};
export default About;

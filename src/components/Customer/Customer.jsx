import React, { useEffect, useState } from "react";
import {
  fetchProjectCustomers,
  fetchBanners,
} from "../../services/strapiServices.jsx";
import "./Customer.scss";

const Customer = (props) => {
  const [projectCustomers, setProjectCustomers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectCustomers = async () => {
      try {
        const customersData = await fetchProjectCustomers();
        const bannersData = await fetchBanners(); // Lấy dữ liệu từ bảng banners

        setProjectCustomers(customersData.data);
        setBanners(bannersData.data); // Giả sử `data.data` chứa danh sách banners
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadProjectCustomers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="container-kh">
        <div className="banner-image">
          {/* Hiển thị banner từ bảng banners với id = 1 */}
          {banners.map(
            (banner) =>
              banner.id === 1 && // Kiểm tra nếu id bằng 1
              banner.attributes.imgBanner &&
              banner.attributes.imgBanner.data.length > 0 && (
                <img
                  key={`banner-${banner.id}`}
                  src={`http://113.161.81.49:1338${banner.attributes.imgBanner.data[0].attributes.url}`}
                  alt={`Banner ${banner.id}`}
                  className="banner-image" // Thêm className để áp dụng CSS
                  onError={(e) => (e.target.src = "/path/to/default-image.png")}
                />
              )
          )}
        </div>
        <div className="container">
          <h2 className="mt-3">Danh sách khách hàng</h2>
          <hr />
          <div className="customer-dhg">
            {projectCustomers.map((customer) => (
              <li key={customer.id} className={`customer-item-${customer.id}`}>
                <a
                  href={customer.attributes.detailProject} // Đường dẫn đến trang mà bạn muốn liên kết
                  // target="_blank" // Mở liên kết trong tab mới
                  // rel="noopener noreferrer" // Cải thiện bảo mật khi mở liên kết trong tab mới
                  className="detail-link" // Thêm className nếu cần để định dạng CSS
                >
                  {customer.attributes.imgProject &&
                    customer.attributes.imgProject.data.length > 0 && (
                      <img
                        src={`http://113.161.81.49:1338${customer.attributes.imgProject.data[0].attributes.url}`}
                        alt={customer.attributes.Project}
                        style={{ maxWidth: "200px" }}
                        onError={(e) =>
                          (e.target.src = "/path/to/default-image.png")
                        } // Thay thế hình ảnh nếu có lỗi
                      />
                    )}
                </a>
                {/* Hiển thị hình ảnh dự án */}
                <h3 className="center-text mt-2">
                  {customer.attributes.Project}
                </h3>
                {/* <p>
                                    <span>Chi tiết khách hàng: </span>
                                    <a
                                        href={customer.attributes.detailProject} // Đường dẫn đến trang mà bạn muốn liên kết
                                        // target="_blank" // Mở liên kết trong tab mới
                                        // rel="noopener noreferrer" // Cải thiện bảo mật khi mở liên kết trong tab mới
                                        className="detail-link" // Thêm className nếu cần để định dạng CSS
                                    >
                                        {customer.attributes.detailProject}
                                    </a>
                                </p> */}
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;

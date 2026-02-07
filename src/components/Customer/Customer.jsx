import React, { useEffect, useState } from "react";
import { fetchProjectCustomers, fetchBanners } from "../../services/strapiServices.jsx";
import "./Customer.scss";

const Customer = () => {
  const [projectCustomers, setProjectCustomers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://113.161.81.49:1338";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersData, bannersData] = await Promise.all([
          fetchProjectCustomers(),
          fetchBanners()
        ]);
        setProjectCustomers(customersData.data);
        setBanners(bannersData.data);
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading-state">Đang tải danh sách đối tác...</div>;

  return (
    <div className="apple-customer-page">
      {/* Banner Section - Tràn viền và tối giản */}
      <section className="customer-hero">
        {banners.map((banner) => (
          banner.id === 1 && banner.attributes.imgBanner?.data?.[0] && (
            <div key={banner.id} className="hero-banner-wrapper">
              <img
                src={`${API_URL}${banner.attributes.imgBanner.data[0].attributes.url}`}
                alt="Banner Đối Tác"
                className="hero-img"
              />
              <div className="hero-overlay">
                <h1 className="display-title">Đối tác tin cậy.</h1>
                <p className="display-subhead">Chúng tôi tự hào đồng hành cùng những thương hiệu hàng đầu.</p>
              </div>
            </div>
          )
        ))}
      </section>

      {/* Partners Grid Section */}
      <section className="partners-section">
        <div className="container">
          <div className="section-header">
            <h2>Hệ sinh thái khách hàng</h2>
            <p>Sự thành công của khách hàng là thước đo giá trị của Đại Hoàng Gia.</p>
          </div>

          <div className="partners-grid">
            {projectCustomers.map((customer) => {
              const imgUrl = customer.attributes.imgProject?.data?.[0]?.attributes?.url;
              return (
                <div key={customer.id} className="partner-card">
                  <a href={customer.attributes.detailProject} className="partner-link">
                    <div className="logo-wrapper">
                      <img
                        src={imgUrl ? `${API_URL}${imgUrl}` : "/default-logo.png"}
                        alt={customer.attributes.Project}
                        className="partner-logo"
                      />
                    </div>
                    <div className="partner-info">
                      <h3>{customer.attributes.Project}</h3>
                      <span>Xem dự án &gt;</span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Quote Section */}
      <section className="customer-quote">
        <div className="container">
          <blockquote>
            "Hợp tác không chỉ là cung cấp thiết bị, mà là cùng nhau xây dựng tương lai bán lẻ bền vững."
          </blockquote>
        </div>
      </section>
    </div>
  );
};

export default Customer;
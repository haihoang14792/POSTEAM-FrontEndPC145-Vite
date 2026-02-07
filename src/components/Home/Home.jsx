// import React, { useEffect, useState } from "react";
// import "./Home.scss";
// import { getBanners, getGridProjects } from "../../services/homeServices";

// const Home = () => {
//   const [banners, setBanners] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const BACKEND_URL = import.meta.env.VITE_CUSTOMER_BACKEND_URL || "http://113.161.81.49:1339";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [bannerRes, projectRes] = await Promise.all([getBanners(), getGridProjects()]);
//         if (bannerRes?.data) setBanners(bannerRes.data);
//         if (projectRes?.data) setProjects(projectRes.data);
//       } catch (e) { console.error(e); } finally { setLoading(false); }
//     };
//     fetchData();
//   }, []);

//   // Sửa từ .find() sang .filter() để lấy mảng danh sách
//   // Cập nhật cách lấy dữ liệu trong Home.jsx
//   const headBanners = banners.filter(b => b.Type === "Head");
//   const topBanners = banners.filter(b => b.Type === "Top");
//   const getGridByGridType = (type) => projects.find(p => p.Type === type);

//   if (loading) return <div className="apple-loader"><span></span></div>;

//   return (
//     <div className="apple-theme-wrapper">
//       {/* PHẦN HERO HEAD - Cho phép cuộn ngang nếu có nhiều hình */}
//       <section className="hero-slider-wrapper">
//         <div className="apple-slider">
//           {headBanners.map((item, index) => (
//             <div key={index} className="hero-module hero-dark slider-item">
//               <div className="unit-copy-wrapper">
//                 <h2 className="label">Mới</h2>
//                 <h1 className="headline">{item.NameBanner}</h1>
//                 <h3 className="subhead">{item.Subhead}</h3>
//                 <div className="cta-wrapper">
//                   <button className="button-blue">Tìm hiểu thêm</button>
//                   <button className="button-link">Mua ngay &gt;</button>
//                 </div>
//               </div>
//               <div className="unit-image-wrapper">
//                 {item.imgBanner?.[0] && (
//                   <img src={`${BACKEND_URL}${item.imgBanner[0].url}`} alt="Banner" />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* SECTION 2: SECONDARY HERO - Cuộn ngang nếu có nhiều banner Top */}
//       <section className="hero-slider">
//         {topBanners.map((item, index) => (
//           <div key={index} className="hero-module hero-light">
//             <div className="unit-copy-wrapper">
//               <h1 className="headline">{item.NameBanner}</h1>
//               <h3 className="subhead">{item.Subhead}</h3>
//               <div className="cta-wrapper">
//                 <button className="button-blue">Tìm hiểu thêm</button>
//                 <button className="button-link">Mua ngay &gt;</button>
//               </div>
//             </div>
//             <div className="unit-image-wrapper">
//               {item.imgBanner?.[0] && <img src={`${BACKEND_URL}${item.imgBanner[0].url}`} alt="Top" />}
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* SECTION 3: BENTO GRID - GIỮ NGUYÊN 4 Ô */}
//       <section className="grid-tiles-container">
//         {["Grid1", "Grid2", "Grid3", "Grid4"].map((type, idx) => {
//           const item = getGridByGridType(type);
//           return (
//             <div key={idx} className={`tile tile-${type}`}>
//               <div className="tile-copy">
//                 <h4 className="tile-headline">{item?.Project || "Toshiba Solution"}</h4>
//                 <p className="tile-subhead">{item?.detailProject || "Công nghệ cho tương lai"}</p>
//               </div>
//               <div className="tile-image">
//                 {item?.imgProject?.[0] && <img src={`${BACKEND_URL}${item.imgProject[0].url}`} alt={type} />}
//               </div>
//             </div>
//           );
//         })}
//       </section>

//       <footer className="vision-footer">
//         <p><span>Đại Hoàng Gia.</span> Đối tác tin cậy mang công nghệ Toshiba đến mọi ngóc ngách của thị trường Việt Nam.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import "./Home.scss";
import { getBanners, getGridProjects } from "../../services/homeServices";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_CUSTOMER_BACKEND_URL || "http://113.161.81.49:1339";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, projectRes] = await Promise.all([getBanners(), getGridProjects()]);
        if (bannerRes?.data) setBanners(bannerRes.data);
        if (projectRes?.data) setProjects(projectRes.data);
      } catch (e) {
        console.error("Lỗi đồng bộ dữ liệu:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc danh sách banner theo Type để làm Slider
  const headBanners = banners.filter((b) => b.Type === "Head");
  const topBanners = banners.filter((b) => b.Type === "Top");

  // Hàm lấy dữ liệu cho 4 ô Grid
  const getGridItem = (type) => projects.find((p) => p.Type === type);

  if (loading) return <div className="apple-loader"><span></span></div>;

  return (
    <div className="apple-main-container">
      {/* SECTION 1: HERO HEAD SLIDER (Ví dụ: Các dòng máy POS mới) */}
      {headBanners.length > 0 && (
        <div className="hero-slider-wrapper">
          <div className="apple-slider">
            {headBanners.map((item, index) => (
              <section key={index} className="hero-module hero-dark slider-item">
                <div className="unit-copy-wrapper">
                  <h2 className="label">Mới</h2>
                  <h1 className="headline">{item.NameBanner}</h1>
                  <h3 className="subhead">{item.Subhead}</h3>
                  <div className="cta-wrapper">
                    <button className="button-blue">Tìm hiểu thêm</button>
                    <button className="button-link">Mua ngay &gt;</button>
                  </div>
                </div>
                <div className="unit-image-wrapper">
                  {item.imgBanner?.[0] && (
                    <img src={`${BACKEND_URL}${item.imgBanner[0].url}`} alt="Head" />
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: HERO TOP SLIDER (Ví dụ: Các dòng máy in) */}
      {topBanners.length > 0 && (
        <div className="hero-slider-wrapper">
          <div className="apple-slider">
            {topBanners.map((item, index) => (
              <section key={index} className="hero-module hero-light slider-item">
                <div className="unit-copy-wrapper">
                  <h1 className="headline">{item.NameBanner}</h1>
                  <h3 className="subhead">{item.Subhead}</h3>
                  <div className="cta-wrapper">
                    <button className="button-blue">Tìm hiểu thêm</button>
                    <button className="button-link">Mua ngay &gt;</button>
                  </div>
                </div>
                <div className="unit-image-wrapper">
                  {item.imgBanner?.[0] && (
                    <img src={`${BACKEND_URL}${item.imgBanner[0].url}`} alt="Top" />
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: BENTO GRID (4 ô dịch vụ chi tiết) */}
      <section className="bento-grid-container">
        {["Grid1", "Grid2", "Grid3", "Grid4"].map((type, idx) => {
          const item = getGridItem(type);
          return (
            <div key={idx} className="bento-tile">
              <div className="tile-copy">
                <h4 className="tile-headline">{item?.Project || "Toshiba Solution"}</h4>
                <p className="tile-subhead">{item?.detailProject || "Công nghệ cho tương lai"}</p>
              </div>
              <div className="tile-image">
                {item?.imgProject?.[0] && (
                  <img src={`${BACKEND_URL}${item.imgProject[0].url}`} alt={type} />
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* FOOTER VISION */}
      <footer className="apple-vision-footer">
        <p>
          <span>Đại Hoàng Gia.</span> Đối tác tin cậy mang công nghệ Toshiba đến mọi ngóc ngách của thị trường Việt Nam.
        </p>
      </footer>
    </div>
  );
};

export default Home;
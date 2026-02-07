import React, { useEffect, useState } from "react";
import { fetchBanners } from "../../services/strapiServices.jsx"; // Giả sử bạn có service lấy sản phẩm
import "./ProductShowcase.scss";

const ProductShowcase = () => {
    const [products, setProducts] = useState([
        {
            id: "mfp-color",
            name: "Toshiba MFP Color",
            tagline: "Đỉnh cao in ấn màu sắc.",
            description: "Chất lượng hình ảnh vượt trội với độ phân giải cao dành cho doanh nghiệp sáng tạo.",
            image: "/mfp-color.png", // Thay bằng URL ảnh PNG tách nền
            category: "Printers"
        },
        {
            id: "tcx800",
            name: "POS TCx800",
            tagline: "Sức mạnh trong tầm tay.",
            description: "Hệ thống bán hàng tối tân với màn hình cảm ứng đa điểm và hiệu năng cực đỉnh.",
            image: "/tcx800.png",
            category: "POS Systems",
            dark: true // Để áp dụng giao diện tối cho card này
        },
        {
            id: "hsp150",
            name: "Toshiba HSP150",
            tagline: "Tốc độ. Chính xác. Tin cậy.",
            description: "Máy in hóa đơn nhiệt tốc độ cao, hoạt động bền bỉ trong môi trường khắc nghiệt.",
            image: "/hsp150.png",
            category: "Accessories"
        }
    ]);

    return (
        <div className="apple-products-page">
            {/* Header Section */}
            <section className="product-hero">
                <div className="container">
                    <h2 className="category-label">Giải Pháp Phần Cứng</h2>
                    <h1 className="main-headline">Sản phẩm Toshiba chính hãng.</h1>
                    <p className="hero-desc">Được thiết kế để tối ưu hóa vận hành và thúc đẩy tăng trưởng doanh nghiệp.</p>
                </div>
            </section>

            {/* Product Grid Section */}
            <section className="product-grid">
                <div className="container">
                    {products.map((product) => (
                        <div key={product.id} className={`product-card ${product.dark ? 'dark-mode' : ''}`}>
                            <div className="product-info">
                                <span className="product-cat">{product.category}</span>
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-tagline">{product.tagline}</p>
                                <div className="product-actions">
                                    <button className="btn-learn">Tìm hiểu thêm &gt;</button>
                                    <button className="btn-buy">Mua ngay</button>
                                </div>
                            </div>
                            <div className="product-visual">
                                <img src={product.image} alt={product.name} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Section (Đề xuất thêm cho đúng chuẩn Apple) */}
            <section className="compare-bar">
                <div className="container">
                    <h2>Tìm sản phẩm phù hợp với bạn.</h2>
                    <a href="/compare" className="compare-link">So sánh các dòng máy &gt;</a>
                </div>
            </section>
        </div>
    );
};

export default ProductShowcase;
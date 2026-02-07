import strapiv2 from "../setup/post axiospublic"; // Import strapi từ file đã cấu hình

const getBanners = () => {
    return strapiv2.get("/api/banners?populate=*");
};

/**
 * Lấy danh sách dự án cho Grid Section
 * Sử dụng ?populate=* để lấy hình ảnh minh họa (imgProject)
 */
const getGridProjects = () => {
    return strapiv2.get("/api/projectcustomers?populate=*");
};

const getBrandVision = () => {
    return strapiv2.get("/api/vision");
};




export {
    getGridProjects,
    getBanners,
    getBrandVision
};
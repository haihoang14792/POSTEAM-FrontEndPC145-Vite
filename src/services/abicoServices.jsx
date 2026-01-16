import strapiv1Instance from "../setup/axios strapi role";

const fetchUsers = async () => {
  try {
    const response = await strapiv1Instance.get("/api/users");
    //console.log("Raw API Response:", response); // Kiểm tra toàn bộ response

    if (Array.isArray(response)) {
      return response; // Trả về nếu API trả về mảng trực tiếp
    } else if (response.data && Array.isArray(response.data)) {
      return response.data; // Nếu API bọc dữ liệu trong `data`
    } else {
      console.warn("API trả về không phải mảng:", response);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi gọi API fetchUsers:", error);
    return [];
  }
};

const updateUser = async (userId, data) => {
  try {
    const response = await strapiv1Instance.put(`/api/users/${userId}`, data);
    return response.data; // Trả về user đã cập nhật
  } catch (error) {
    console.error("Lỗi khi update user:", error);
    throw error;
  }
};

export { fetchUsers, updateUser };

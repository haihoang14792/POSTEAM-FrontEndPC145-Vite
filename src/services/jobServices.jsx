
import strapiv1Instance from "../setup/axios strapi role";

const fetchRecallDHGs = async () => {
    try {
        // Strapi v5: Thêm populate=* để lấy dữ liệu quan hệ
        const response = await strapiv1Instance.get(
            '/api/project-of-dhgs?filters[Detail][$eq]=Thu hồi&populate=*'
        );
        return response;
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};

const fetchProjectPlantDHGs = async () => {
    try {
        // Strapi v5: Thêm populate=*
        const response = await strapiv1Instance.get(
            '/api/project-of-dhgs?populate=*'
        );
        return response;
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};

const createRecallDHGs = async (ticketData) => {
    try {
        const res = await strapiv1Instance.post("/api/project-of-dhgs", {
            data: ticketData,
        });
        // Interceptor đã trả về body, res.data ở đây là entry vừa tạo
        return res.data;
    } catch (err) {
        throw err;
    }
};

const fetchStore = async (storeId) => {
    try {
        // LƯU Ý: Thay 'StoreID' bằng 'ListJob' nếu mã POSJOB... được lưu trong trường ListJob
        const response = await strapiv1Instance.get(
            `/api/stores?filters[Ticket][$eq]=${storeId}`
        );

        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error;
    }
};


const updateJobStatus = async (jobId, data) => {
    try {
        // Lưu ý: jobId ở đây phải là documentId (chuỗi ký tự) trong Strapi v5
        const response = await strapiv1Instance.put(`/api/stores/${jobId}`, {
            data,
        });
        // Strapi v5 trả về object phẳng hơn, bỏ bớt .data thừa nếu interceptor đã xử lý
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteJobs = async (documentId) => {
    try {
        // Strapi v5 dùng documentId để xóa
        const response = await strapiv1Instance.delete(`/api/stores/${documentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
    }
};


export {
    fetchRecallDHGs,
    createRecallDHGs,
    fetchStore,
    updateJobStatus,
    fetchProjectPlantDHGs,
    deleteJobs
};
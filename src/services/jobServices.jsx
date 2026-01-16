import strapiv1Instance from "../setup/axios strapi role";

const fetchRecallDHGs = async () => {
    try {
        const response = await strapiv1Instance.get(
            '/api/project-of-dhgs?filters[Detail][$eq]=Thu hồi'
        );
        return response;
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};

const fetchProjectPlantDHGs = async () => {
    try {
        const response = await strapiv1Instance.get(
            '/api/project-of-dhgs'
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
        return res.data;
    } catch (err) {
        throw err;
    }
};

const fetchStore = async (storeId) => {
    try {
        const response = await strapiv1Instance.get(`/api/stores?filters[Ticket][$eq]=${storeId}`);
        console.log('API Response:', response.data); // In ra dữ liệu trả về từ API để kiểm tra
        return response.data; // Trả về dữ liệu JSON từ API
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error;
    }
};


// const fetchStore = async (ticket) => {
//     try {
//         const response = await strapiv1Instance.get(
//             `/api/stores?filters[Ticket][$eq]=${ticket}`
//         );
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

const updateJobStatus = async (jobId, data) => {
    try {
        const response = await strapiv1Instance.put(`/api/stores/${jobId}`, {
            data,
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};


export {
    fetchRecallDHGs,
    createRecallDHGs,
    fetchStore,
    updateJobStatus,
    fetchProjectPlantDHGs
};

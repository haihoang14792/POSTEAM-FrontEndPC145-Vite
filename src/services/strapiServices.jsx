import strapi from "../setup/axiospublic"; // Import strapi từ file đã cấu hình

// Hàm để lấy dữ liệu sản phẩm từ Strapi
const fetchProjectCustomers = async () => {
    try {
        const response = await strapi.get('/api/projectcustomers?populate=imgProject');
        return response; // Trả dữ liệu về cho các hàm gọi
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};

const fetchBanners = async () => {
    try {
        const response = await strapi.get('/api/banners?populate=imgBanner');
        return response; // Trả dữ liệu về cho các hàm gọi
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};
const fetchFamilyMart = async () => {
    try {
        const response = await strapi.get('/api/family-marts');
        return response; // Trả dữ liệu về cho các hàm gọi
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};

const fetchHeaderHomepage = async () => {
    try {
        const response = await strapi.get('/api/headerhomepage?populate=DetailHeader');
        return response.data; // Trả dữ liệu về cho các hàm gọi
    } catch (error) {
        throw new Error('Error fetching header homepage data');
    }
};
const fetchProjectDHGs = async () => {
    try {
        const response = await strapi.get('/api/project-of-dhgs?populate=Logo&filters[Detail][$eq]=Dự án');
        return response; // Trả dữ liệu về cho các hàm gọi
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};

const createProjectDHG = async (projectData) => {
    try {
        // Gọi API POST tới endpoint content-type project-of-dhgs
        const response = await strapi.post('/api/project-of-dhgs', {
            data: projectData,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};


const fetchProjectDHG = async () => {
    try {
        const response = await strapi.get('/api/project-of-dhgs');
        return response; // Trả dữ liệu về cho các hàm gọi
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};


const createNewJob = async (jobData) => {
    try {
        const response = await strapi.post('/api/stores', {
            data: jobData, // Đóng gói dữ liệu trong thuộc tính 'data'
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
// strapiServices.js

const deleteJobs = async (jobId) => {
    try {
        const response = await strapi.delete(`/api/stores/${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};

// Hàm fetchDevice
const fetchDevice = async (storeId) => {
    try {
        const response = await strapi.get(`/api/device-customers?filters[StoreID][$eq]=${storeId}`);
        console.log('API Response:', response.data); // In ra dữ liệu trả về từ API để kiểm tra
        return response.data; // Trả về dữ liệu JSON từ API
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error;
    }
};


// Hàm updateDeviceStatus
const updateDeviceStatus = async (deviceId, data) => {
    try {
        const response = await strapi.put(`/api/device-customers/${deviceId}`, {
            data,
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// const fetchListCustomer = async () => {
//     try {
//         const response = await strapi.get('/api/customerlists');
//         return response; // Trả dữ liệu về cho các hàm gọi
//     } catch (error) {
//         throw new Error('Error fetching project customers');
//     }
// };


const fetchListCustomer = async (page = 1, pageSize = 10, filters = {}) => {
    try {
        const params = {
            'pagination[page]': page,
            'pagination[pageSize]': pageSize,
            'sort': 'StoreID:asc',
        };

        if (filters.Customer) {
            params['filters[Customer][$eq]'] = filters.Customer;
        }
        if (filters.Status) {
            params['filters[Status][$eq]'] = filters.Status === 'Mở';
        }
        if (filters.searchText) {
            params['filters[$or][0][StoreID][$containsi]'] = filters.searchText;
            params['filters[$or][1][Address][$containsi]'] = filters.searchText;
        }

        // axiospublic tự return data, nên ở đây response chính là {data: [], meta: {}}
        const response = await strapi.get('/api/customerlists', { params });
        return response;
    } catch (error) {
        throw error;
    }
};


const fetchListCustomers = async () => {
    try {
        const response = await strapi.get('/api/customerlists');
        return response.data.data; // Trả dữ liệu khách hàng về
    } catch (error) {
        throw new Error('Error fetching project customers');
    }
};





export {
    fetchProjectCustomers,
    fetchBanners,
    fetchFamilyMart,
    fetchHeaderHomepage,
    fetchProjectDHGs,
    createNewJob,
    deleteJobs,
    fetchDevice,
    updateDeviceStatus,
    fetchProjectDHG,
    fetchListCustomer,
    fetchListCustomers,
    createProjectDHG,
};
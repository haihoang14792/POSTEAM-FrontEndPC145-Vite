// import React from 'react';
// import { Modal, Form, Row, Col, Input, Select, notification } from 'antd';
// import { createNewStore } from '../../../services/storeServices';
// import './ModalStore.scss';

// const { Option } = Select;

// const ModalStore = ({ isOpen, onCancel, onSuccess, loading, setLoading }) => {
//     const [createForm] = Form.useForm();

//     const handleCreateStore = async (values) => {
//         try {
//             setLoading(true);
//             await createNewStore(values);
//             notification.success({
//                 message: 'Thành công',
//                 description: `Đã tạo cửa hàng ${values.StoreID} thành công!`
//             });
//             createForm.resetFields();
//             onSuccess(); // Gọi hàm loadData() ở component cha
//         } catch (err) {
//             console.error(err);
//             notification.error({
//                 message: 'Lỗi',
//                 description: 'Không thể tạo cửa hàng. Vui lòng kiểm tra lại mã cửa hàng có bị trùng không.'
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Modal
//             title="Thêm cửa hàng mới"
//             open={isOpen}
//             onCancel={onCancel}
//             onOk={() => createForm.submit()}
//             confirmLoading={loading}
//             width={750}
//             centered
//             className="store-modal-custom"
//         >
//             <Form
//                 form={createForm}
//                 layout="vertical"
//                 onFinish={handleCreateStore}
//                 className="modal-store-form"
//             >
//                 <Row gutter={16}>
//                     <Col span={12}>
//                         <Form.Item
//                             name="Customer"
//                             label="Tên khách hàng"
//                             rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
//                         >
//                             <Input placeholder="Ví dụ: Family Mart" />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item
//                             name="StoreID"
//                             label="Mã cửa hàng"
//                             rules={[{ required: true, message: 'Vui lòng nhập mã cửa hàng!' }]}
//                         >
//                             <Input placeholder="Ví dụ: FM001" />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item name="CompanyName" label="Tên công ty">
//                             <Input placeholder="Ví dụ: Công ty TNHH FamilyMart Việt Nam" />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item name="Area" label="Khu vực">
//                             <Select placeholder="Chọn khu vực">
//                                 <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
//                                 <Option value="Hà Nội">Hà Nội</Option>
//                                 <Option value="Miền Tây">Miền Tây</Option>
//                                 <Option value="Miền Trung">Miền Trung</Option>
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={24}>
//                         <Form.Item name="Address" label="Địa chỉ cửa hàng">
//                             <Input placeholder="Địa chỉ thực tế của cửa hàng" />
//                         </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                         <Form.Item name="AddressOFF" label="Địa chỉ nhận thư (Giao hàng)">
//                             <Input placeholder="Địa chỉ văn phòng hoặc nơi nhận hóa đơn" />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item name="Status" label="Trạng thái" initialValue="Mở">
//                             <Select>
//                                 <Option value="Mở">Hoạt động (Mở)</Option>
//                                 <Option value="Đóng">Đóng cửa (Đóng)</Option>
//                             </Select>
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item name="Open" label="Ngày mở cửa">
//                             <Input type="date" />
//                         </Form.Item>
//                     </Col>
//                 </Row>
//             </Form>
//         </Modal>
//     );
// };

// export default ModalStore;


import React from 'react';
import { Modal, Form, Row, Col, Input, Select, notification, Divider } from 'antd';
import {
    ShopOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    CalendarOutlined,
    IdcardOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { createNewStore } from '../../../services/storeServices';
import './ModalStore.scss';

const { Option } = Select;

const ModalStore = ({ isOpen, onCancel, onSuccess, loading, setLoading }) => {
    const [createForm] = Form.useForm();

    const handleCreateStore = async (values) => {
        try {
            setLoading(true);
            await createNewStore(values);
            notification.success({
                message: 'Thành công',
                description: `Đã tạo cửa hàng ${values.StoreID} thành công!`,
                placement: 'topRight'
            });
            createForm.resetFields();
            onSuccess();
        } catch (err) {
            console.error(err);
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Không thể tạo cửa hàng. Vui lòng kiểm tra mã cửa hàng hoặc kết nối mạng.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="modal-header-title">
                    <ShopOutlined className="header-icon" />
                    <span>Thêm cửa hàng mới</span>
                </div>
            }
            open={isOpen}
            onCancel={onCancel}
            onOk={() => createForm.submit()}
            confirmLoading={loading}
            width={750}
            centered
            className="store-modal-custom"
            okText="Tạo cửa hàng"
            cancelText="Hủy bỏ"
        >
            <Form
                form={createForm}
                layout="vertical"
                onFinish={handleCreateStore}
                className="modal-store-form"
                requiredMark={false}
            >
                <Divider orientation="left" plain><InfoCircleOutlined /> Thông tin cơ bản</Divider>
                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            name="Customer"
                            label="Tên khách hàng"
                            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                        >
                            <Input prefix={<IdcardOutlined />} placeholder="Ví dụ: Family Mart" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="StoreID"
                            label="Mã cửa hàng"
                            rules={[{ required: true, message: 'Vui lòng nhập mã cửa hàng!' }]}
                        >
                            <Input prefix={<ShopOutlined />} placeholder="Ví dụ: FM001" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item name="CompanyName" label="Tên công ty">
                            <Input placeholder="Công ty TNHH FamilyMart Việt Nam" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="Area" label="Khu vực">
                            <Select placeholder="Chọn khu vực" suffixIcon={<GlobalOutlined />}>
                                <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
                                <Option value="Hà Nội">Hà Nội</Option>
                                <Option value="Miền Tây">Miền Tây</Option>
                                <Option value="Miền Trung">Miền Trung</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left" plain><EnvironmentOutlined /> Địa chỉ & Trạng thái</Divider>
                <Row gutter={20}>
                    <Col span={24}>
                        <Form.Item name="Address" label="Địa chỉ cửa hàng">
                            <Input.TextArea
                                placeholder="Địa chỉ thực tế của cửa hàng"
                                autoSize={{ minRows: 2, maxRows: 3 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="AddressOFF" label="Địa chỉ nhận thư (Giao hàng)">
                            <Input placeholder="Địa chỉ văn phòng hoặc nơi nhận hóa đơn" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item name="Status" label="Trạng thái" initialValue="Mở">
                            <Select className="status-select">
                                <Option value="Mở">🟢 Hoạt động (Mở)</Option>
                                <Option value="Đóng">🔴 Đóng cửa (Đóng)</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="Open" label="Ngày mở cửa">
                            <Input type="date" prefix={<CalendarOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalStore;
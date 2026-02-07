import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, Input, message, Divider, Space, Tag } from 'antd';
import { UserOutlined, FormOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createDutySchedule, updateDutySchedule, fetchUsers } from '../../../services/userServices';

const { Option } = Select;

const DutyManagementModal = ({ visible, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [internalStaffList, setInternalStaffList] = useState([]); // Danh sách nhân viên lấy từ API
    const [loadingStaff, setLoadingStaff] = useState(false);

    // 1. Lấy danh sách nhân viên khi Modal hiển thị
    const loadStaffData = async () => {
        setLoadingStaff(true);
        try {
            const data = await fetchUsers(); // Lúc này data chỉ bao gồm người có Weekly = true
            if (data) {
                const formatted = data.map(user => ({
                    id: user.id,
                    Name: user.Name || user.username
                }));
                setInternalStaffList(formatted);
            }
        } catch (error) {
            message.error("Không thể tải danh sách kỹ thuật trực tuần");
        } finally {
            setLoadingStaff(false);
        }
    };
    useEffect(() => {
        if (visible) {
            loadStaffData(); // Gọi API lấy user mỗi khi mở Modal

            if (initialValues) {
                form.setFieldsValue({
                    technical: initialValues.technical,
                    duty_date: initialValues.duty_date ? dayjs(initialValues.duty_date) : dayjs(),
                    shift_type: initialValues.shift_type || 'Weekday',
                    task_note: initialValues.task_note || '',
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ duty_date: dayjs(), shift_type: 'Weekday' });
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setIsSubmitting(true);

            const payload = {
                technical: values.technical,
                duty_date: values.duty_date.format('YYYY-MM-DD'),
                shift_type: values.shift_type,
                task_note: values.task_note,
            };

            let res;
            if (initialValues?.id) {
                res = await updateDutySchedule(initialValues.id, payload);
            } else {
                res = await createDutySchedule(payload);
            }

            if (res && res.EC === 0) {
                message.success(res.EM || "Thành công");
                onSuccess();
                onCancel();
            } else {
                message.error(res?.EM || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Validate Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <FormOutlined style={{ color: '#1890ff' }} />
                    <span>{initialValues?.id ? 'Chỉnh sửa ca trực' : 'Đăng ký lịch trực kỹ thuật'}</span>
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={isSubmitting}
            okText="Lưu dữ liệu"
            cancelText="Hủy"
            width={500}
            destroyOnClose
        >
            <Divider style={{ margin: '12px 0 24px 0' }} />

            <Form form={form} layout="vertical" disabled={isSubmitting}>
                <Form.Item
                    name="technical"
                    label="Nhân viên trực"
                    rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                >
                    <Select
                        placeholder="Chọn kỹ thuật viên..."
                        showSearch
                        loading={loadingStaff}
                        optionFilterProp="children"
                        prefix={<UserOutlined />}
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {internalStaffList.map((staff) => (
                            <Option key={staff.id} value={staff.id}>
                                {staff.Name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="duty_date"
                    label="Ngày trực nhật"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày trực"
                    />
                </Form.Item>

                <Form.Item name="shift_type" label="Loại hình trực">
                    <Select>
                        <Option value="Weekday"><Tag color="blue">Ngày thường (T2-T6)</Tag></Option>
                        <Option value="Weekend"><Tag color="red">Cuối tuần (T7-CN)</Tag></Option>
                        <Option value="Holiday"><Tag color="orange">Ngày Lễ / Tết</Tag></Option>
                    </Select>
                </Form.Item>

                <Form.Item name="task_note" label="Ghi chú nhiệm vụ">
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập nội dung công việc..."
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DutyManagementModal;
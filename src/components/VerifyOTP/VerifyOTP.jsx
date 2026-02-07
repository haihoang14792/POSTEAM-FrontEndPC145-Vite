import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './VerifyOTP.scss';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Lấy email từ query params trong URL
        const params = new URLSearchParams(window.location.search);
        const emailFromParams = params.get('email');
        if (emailFromParams) {
            setEmail(emailFromParams);
        }
    }, []);

    const handleOTPChange = (event) => {
        setOtp(event.target.value);
    };

    const handleVerify = async (event) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('OTP:', otp);

        try {
            const response = await axios.post('http://192.168.1.145:8088/api/v1/verify-otp', {
                email,
                otp
            });

            console.log('Response:', response.data); // Log phản hồi để kiểm tra dữ liệu trả về

            if (response.data.EC === 0) {
                toast.success('Xác thực OTP thành công!');
            } else {
                toast.error(response.data.EM);
            }
        } catch (error) {
            console.error('Lỗi khi xác thực OTP:', error.response ? error.response.data : error.message);
            toast.error('Đã xảy ra lỗi khi xác thực OTP.');
        }
    };

    return (
        <div className="verify-otp-container">
            <h2>Xác Thực OTP</h2>
            <form onSubmit={handleVerify}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        readOnly
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="otp">Mã OTP:</label>
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={handleOTPChange}
                        required
                    />
                </div>
                <button type="submit">Xác Thực</button>
            </form>
        </div>
    );
};

export default VerifyOTP;

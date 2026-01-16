import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserCard.scss'; // Import CSS để style cho đúng mẫu
import logo from '../../../logo.jpg';

const UserCard = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserById = async (id) => {
            try {
                const response = await axios.get(`http://113.161.81.49:1338/api/users/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error('Lỗi khi fetch user:', error);
            }
        };

        fetchUserById(id);
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (!user) return <div>Đang tải...</div>;

    return (
        <div className="card-container">
            <div className="card-front">
                <div className="logo-header">
                    <img src="/LOGOAbico.png" alt="Logo" className="logo" />
                    <div className="company-info">
                        <p>CÔNG TY TNHH THƯƠNG MẠI</p>
                        <p>ABICO</p>
                    </div>
                </div>
                <div className="user-photo">
                    <img src={user.avatar || '/avatar-default.jpg'} alt="Avatar" />
                </div>
                <div className="user-info">
                    <h3>{user.Name}</h3>
                    <p>{user.Department || 'Chức vụ chưa cập nhật'}</p>

                    <div className="row-inline">
                        <p><strong>ID:</strong> {user.IDuser}</p>
                        <p><strong>Date:</strong> {formatDate(user.startingdate)}</p>
                    </div>

                    <p><strong>Email:</strong> {user.EmailDHG}</p>
                    <p><strong>Mobile:</strong> {user.Phone || 'Chưa cập nhật'}</p>
                    <p>
                        <strong>Tình trạng:</strong>{' '}
                        <span className={user.Status === "Đang làm việc" ? 'status-active' : 'status-inactive'}>
                            {user.Status || 'Chưa cập nhật'}
                        </span>
                    </p>
                </div>
                <div className="footercard">
                    <p>2F, HALO Building, 677/7 Điện Biên Phủ ,Thạnh Mỹ Tây ,Hồ Chí Minh</p>
                    <p className="footer-phone">1800 588810</p>
                </div>
            </div>

            <div className="card-back">
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://113.161.81.49:3000/card/${user.id}`}
                    alt="QR Code"
                    className="qr-code"
                />
                <div className="logo-back">
                    <img src="/LOGOAbico.png" alt="Logo" />
                    <p>Cho cuộc sống đơn giản hơn</p>
                </div>
            </div>
        </div>
    );
};

export default UserCard;

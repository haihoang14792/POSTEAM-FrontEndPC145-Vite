import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import ForgotPassword from '../components/Login/ForgotPassword';
import ResetPassword from '../components/Login/ResetPassword';
import PrivateRoutes from "./PrivateRoutes";
import Home from "../components/Home/Home";
import About from "../components/About/About";
import Dingtalk from "../components/Dingtalk/Dingtalk";
import ItemDHG from "../components/Dingtalk/ItemDHG";
import VerifyOTP from "../components/VerifyOTP/VerifyOTP";
import Customer from "../components/Customer/Customer";
import FamilyMart from "../components/Customer/FamilyMart";
import Kohnan from "../components/Customer/Kohnan";
import Sukiya from "../components/Customer/Sukiya";
import Project from "../components/DHG/Project/Project";
import Store from "../components/DHG/NewStore/Store";
import Page404 from "../Page404";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserCard from '../components/DHG/CompanyStaff/UserCard';
import UserCardAbico from '../components/DHG/CompanyStaff/UserCardAbico';


// const addCrispScript = () => {
//     if (window.$crisp) return; // Tránh chèn nhiều lần
//     window.$crisp = [];
//     window.CRISP_WEBSITE_ID = "804c8adb-868f-424d-8abb-05e7a13da5ff"; // Thay bằng ID của bạn
//     (function () {
//         const d = document;
//         const s = d.createElement("script");
//         s.src = "https://client.crisp.chat/l.js";
//         s.async = 1;
//         d.getElementsByTagName("head")[0].appendChild(s);
//     })();
// };
const addCrispScript = () => {
    if (window.$crisp) return; // Tránh chèn nhiều lần

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "804c8adb-868f-424d-8abb-05e7a13da5ff"; // Thay bằng ID của bạn

    // Đổi ngôn ngữ tùy domain
    if (window.location.hostname === "abico.com.vn") {
        window.$crisp.push(["config", "locale", "vi"]);
    } else if (window.location.hostname === "site2.com") {
        window.$crisp.push(["config", "locale", "en"]);
    }

    (function () {
        const d = document;
        const s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
    })();
};



const AppRoutes = () => {
    const location = useLocation();
    const allowedRoutes = ["/", "/customer", "/familymart"]; // Chỉ chạy trên các route này
    useEffect(() => {
        if (allowedRoutes.includes(location.pathname)) {
            addCrispScript();
        }
    }, [location.pathname]); // Chạy lại khi route thay đổi

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/familymart" element={<FamilyMart />} />
            <Route path="/kohnan" element={<Kohnan />} />
            <Route path="/sukiya" element={<Sukiya />} />
            {/* <Route path="/projects" element={<PrivateRoutes element={<Project />} />} />
            <Route path="/store/:storeId" element={<PrivateRoutes element={<Store />} />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             <Route path="/forgot-password" element={<ForgotPassword  />} />
             <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
			 <Route path="/card/:id" element={<UserCard />} />
			  <Route path="/card2/:id" element={<UserCardAbico />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
};

export default AppRoutes;

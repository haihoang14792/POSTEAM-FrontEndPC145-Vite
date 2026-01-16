// import { useEffect, useState, useContext } from 'react';
// import './Login.scss';
// import { useHistory, Link } from "react-router-dom";
// import { toast } from 'react-toastify';
// import { loginUser } from "../../services/userServices";
// import { UserContext } from '../../context/UserContext';

// const Login = () => {
//     const history = useHistory();
//     const { user, loginContext } = useContext(UserContext);
//     const [valueLogin, setValueLogin] = useState("");
//     const [password, setPassword] = useState("");
//     const [objValidInput, setObjValidInput] = useState({
//         isValidValueLogin: true,
//         isValidPassword: true
//     });

//     const handleCreateNewAccount = () => {
//         history.push("/register");
//     };

//     const handleForgotPassword = () => {
//         toast.info("Forgot password functionality not implemented.");
//     };

//     // const handleLogin = async () => {
//     //     setObjValidInput({
//     //         isValidValueLogin: true,
//     //         isValidPassword: true
//     //     });

//     //     if (!valueLogin) {
//     //         setObjValidInput({ isValidValueLogin: false, isValidPassword: true });
//     //         toast.error("Please enter your email address or phone number");
//     //         return;
//     //     }

//     //     if (!password) {
//     //         setObjValidInput({ isValidValueLogin: true, isValidPassword: false });
//     //         toast.error("Please enter your password");
//     //         return;
//     //     }

//     //     try {
//     //         const response = await loginUser(valueLogin, password);

//     //         if (response && +response.EC === 0) {
//     //             // Success
//     //             const { access_token: token, ...userData } = response.DT;
//     //             let data = {
//     //                 isAuthenticated: true,
//     //                 token: token,
//     //                 account: userData
//     //             };

//     //             localStorage.setItem('jwt', token);
//     //             loginContext(data);
//     //             history.push("/");
//     //             window.location.reload(); // Reload the page to reflect the changes
//     //         } else {
//     //             toast.error(response.EM);
//     //         }
//     //     } catch (error) {
//     //         toast.error("An error occurred while logging in.");
//     //     }
//     // };

//     const handleLogin = async () => {
//         setObjValidInput({
//             isValidValueLogin: true,
//             isValidPassword: true
//         });

//         if (!valueLogin) {
//             setObjValidInput({ isValidValueLogin: false, isValidPassword: true });
//             toast.error("Please enter your email address or phone number");
//             return;
//         }

//         if (!password) {
//             setObjValidInput({ isValidValueLogin: true, isValidPassword: false });
//             toast.error("Please enter your password");
//             return;
//         }

//         try {
//             const response = await loginUser(valueLogin, password);

//             if (response && response.EC === 0) {
//                 // Success
//                 const { token, ...userData } = response.DT; // Cập nhật cách lấy token và dữ liệu người dùng
//                 let data = {
//                     isAuthenticated: true,
//                     token: token,
//                     account: userData
//                 };

//                 localStorage.setItem('jwt', token);
//                 loginContext(data);
//                 history.push("/");
//                 window.location.reload(); // Reload the page to reflect the changes
//             } else {
//                 toast.error(response.EM);
//             }
//         } catch (error) {
//             console.error("Login error:", error);
//             toast.error("An error occurred while logging in.");
//         }
//     };


//     const handlePressEnter = (event) => {
//         if (event.key === "Enter") {
//             handleLogin();
//         }
//     };

//     useEffect(() => {
//         if (user && user.isAuthenticated) {
//             history.push('/');
//         }
//     }, [user, history]);

//     return (
//         <div className="login-container">
//             <div className="container">
//                 <div className="row px-3 px-sm-0">
//                     <div className="content-left col-12 d-none col-sm-7 d-sm-block">
//                         <div className='brand'>
//                             <Link to='/' className='underline'><span title='Trang chủ'>DHG</span></Link>
//                         </div>
//                         <div className='detail'>
//                             TEAM POS helps you connect and share with the people in your life.
//                         </div>
//                     </div>
//                     <div className="content-right col-sm-5 col-12 d-flex flex-column gap-3 py-3">
//                         <div className='brand d-sm-none'>
//                             TEAM POS
//                         </div>
//                         <input
//                             type='text'
//                             className={objValidInput.isValidValueLogin ? 'form-control' : 'form-control is-invalid'}
//                             placeholder='Email address or phone number'
//                             value={valueLogin}
//                             onChange={(event) => setValueLogin(event.target.value)}
//                         />
//                         <input
//                             type='password'
//                             className={objValidInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
//                             placeholder='Password'
//                             value={password}
//                             onChange={(event) => setPassword(event.target.value)}
//                             onKeyPress={handlePressEnter}
//                         />
//                         <button className='btn btn-primary' onClick={handleLogin}>Login</button>
//                         <span className='text-center'>
//                             <button className='forgot-password' onClick={handleForgotPassword}>
//                                 Forgot your password?
//                             </button>
//                         </span>
//                         <hr />
//                         <div className='text-center'>
//                             <button className='btn btn-success' onClick={handleCreateNewAccount}>
//                                 Create new account
//                             </button>
//                             <div className='mt-3 return'>
//                                 <Link to='/'>
//                                     <i className="fa fa-arrow-circle-left"></i>
//                                     <span title='Trở về trang chủ'>Trở về trang chủ</span>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { loginUser } from "../../services/userServices";
import { UserContext } from '../../context/UserContext';
import './Loginnam.scss';

const Loginnam = () => {
    const history = useHistory();
    const { user, loginContext } = useContext(UserContext);
    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");
    const [objValidInput, setObjValidInput] = useState({
        isValidValueLogin: true,
        isValidPassword: true
    });

    const handleCreateNewAccount = () => {
        history.push("/register");
    };

    const handleForgotPassword = () => {
        toast.info("Forgot password functionality not implemented.");
    };

    const handleLogin = async () => {
        setObjValidInput({
            isValidValueLogin: true,
            isValidPassword: true
        });

        if (!valueLogin) {
            setObjValidInput({ isValidValueLogin: false, isValidPassword: true });
            toast.error("Please enter your email address or phone number");
            return;
        }

        if (!password) {
            setObjValidInput({ isValidValueLogin: true, isValidPassword: false });
            toast.error("Please enter your password");
            return;
        }

        try {
            const response = await loginUser(valueLogin, password);

            if (response && +response.EC === 0) {
                // Success
                const { jwt, ...userData } = response.DT; // Đảm bảo rằng response.DT có jwt và userData đúng cấu trúc

                if (!userData.username) {
                    console.error("Username is missing in user data.");
                    toast.error("Username is missing.");
                    return;
                }

                let data = {
                    isAuthenticated: true,
                    token: jwt,
                    account: userData
                };

                localStorage.setItem('jwt', jwt);
                loginContext(data);
                history.push("/");
                window.location.reload(); // Reload the page to reflect the changes
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.error("Login error:", error.message);
            toast.error("An error occurred while logging in.");
        }
    };


    const handlePressEnter = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
        }
    }, [user, history]);

    return (
        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand'>
                            <Link to='/' className='underline'><span title='Trang chủ'>DHG</span></Link>
                        </div>
                        <div className='detail'>
                            TEAM POS helps you connect and share with the people in your life.
                        </div>
                    </div>
                    <div className="content-right col-sm-5 col-12 d-flex flex-column gap-3 py-3">
                        <div className='brand d-sm-none'>
                            TEAM POS
                        </div>
                        <input
                            type='text'
                            className={objValidInput.isValidValueLogin ? 'form-control' : 'form-control is-invalid'}
                            placeholder='Email address or phone number'
                            value={valueLogin}
                            onChange={(event) => setValueLogin(event.target.value)}
                        />
                        <input
                            type='password'
                            className={objValidInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                            placeholder='Password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyPress={handlePressEnter}
                        />
                        <button className='btn btn-primary' onClick={handleLogin}>Login</button>
                        <span className='text-center'>
                            <button className='forgot-password' onClick={handleForgotPassword}>
                                Forgot your password?
                            </button>
                        </span>
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={handleCreateNewAccount}>
                                Create new account
                            </button>
                            <div className='mt-3 return'>
                                <Link to='/'>
                                    <i className="fa fa-arrow-circle-left"></i>
                                    <span title='Trở về trang chủ'>Trở về trang chủ</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loginnam;

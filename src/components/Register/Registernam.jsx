import './Registernam.scss';
import { useHistory, Link } from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { registerNewUser } from '../../services/userServices';
import { UserContext } from '../../context/UserContext';

const Registernam = () => {
    const { user } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const defaultValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidPassword: true,
        isValidConfirmPassword: true
    };
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    let history = useHistory();

    const handleLogin = () => {
        history.push("/login");
    };

    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
        }
    }, [user, history]);

    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);
        if (!email) {
            toast.error("Email is required");
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false;
        }
        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            toast.error("Please enter a valid email address");
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false;
        }
        if (!phone) {
            toast.error("Phone is required");
            setObjCheckInput({ ...defaultValidInput, isValidPhone: false });
            return false;
        }
        if (!password) {
            toast.error("Password is required");
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setObjCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (isValidInputs()) {
            try {
                let serverData = await registerNewUser(email, phone, username, password);
                if (+serverData.EC === 0) {
                    toast.success(serverData.EM);
                    history.push("/login");
                } else {
                    toast.error(serverData.EM);
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra trong quá trình đăng ký.');
            }
        }
    };

    return (
        <div className="register-container">
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
                        <div className='form-group'>
                            <label>Email:</label>
                            <input type='text' className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'} placeholder='Email address'
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Phone Number:</label>
                            <input type='text' className={objCheckInput.isValidPhone ? 'form-control' : 'form-control is-invalid'} placeholder='Phone number'
                                value={phone} onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Username:</label>
                            <input type='text' className='form-control' placeholder='Username'
                                value={username} onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Password:</label>
                            <input type='password' className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Password'
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Re-enter password:</label>
                            <input type='password' className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Re-enter password'
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button className='btn btn-primary' onClick={handleRegister}>Register</button>
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={handleLogin}>
                                Already have an account? Login
                            </button>
                        </div>
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
    );
};

export default Registernam;

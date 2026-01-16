// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { UserContext } from '../context/UserContext';

// const PrivateRoutes = ({ component: Component, ...rest }) => {
//     const { user } = useContext(UserContext);

//     if (user && user.isAuthenticated === true) {
//         return <Component {...rest} />;
//     } else {
//         return <Navigate to="/login" />;
//     }
// };

// export default PrivateRoutes;


// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { UserContext } from '../context/UserContext';

// const PrivateRoutes = ({ element, ...rest }) => {
//     const { user } = useContext(UserContext);

//     if (user?.isAuthenticated) {
//         return element;
//     } else {
//         return <Navigate to="/login" />;
//     }
// };

// export default PrivateRoutes;


import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ element, ...rest }) => {
    const { user } = useContext(UserContext);

    if (user?.isAuthenticated) {
        return element;
    } else {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;

// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
//
// const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
//     const userRole = localStorage.getItem('userRole');
//     console.log("Role:", userRole);
//
//
//     return (
//         <Route
//             {...rest}
//             render={props =>
//                ["admin"].includes(userRole) ? (
//                     <Component {...props} />
//                 ) : (
//                     <Redirect to="/user/login" />
//                 )
//             }
//         />
//     );
// };
//
// export default ProtectedRoute;

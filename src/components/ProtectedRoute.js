import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    const userInfo = auth.userInfo;
    return (
        userInfo ? children : <Navigate to='/signin' />
    );
};

export default ProtectedRoute;;

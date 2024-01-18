import React from 'react'
import { LoginComponent } from '../authentication/LoginComponent';
import { Outlet } from 'react-router-dom';

const useAuth = () => {
    const token = localStorage.getItem("userId");
    if (token) {
        return true;
    }
    return false;
}

const ProtectedRouterComponent = () => {
    if (useAuth()) {
        return <Outlet></Outlet>
    }
    return <LoginComponent />
}

export default ProtectedRouterComponent;
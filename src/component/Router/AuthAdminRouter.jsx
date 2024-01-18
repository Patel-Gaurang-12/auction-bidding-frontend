import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { LoginComponent } from '../authentication/LoginComponent';

const useAuth = () => {
    const user = useSelector(state => state.user.value)
    const token = localStorage.getItem("userId");
    if (token && user && user.role === "admin") {
        return true;
    }
    return false;
}

export const AuthAdminRouter = () => {
    return useAuth() ? <Outlet /> : <LoginComponent />
}


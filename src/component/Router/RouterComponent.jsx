import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { SignupComponent } from '../authentication/SignupComponent'
import { LoginComponent } from '../authentication/LoginComponent'
import { Deshboard } from '../Deshboard/Deshboard'
import ProtectedRouterComponent from './ProtectedRouterComponent'

export const RouterComponent = () => {

    const router = createBrowserRouter([
        {
            path: "/login",
            element: <LoginComponent />,
            errorElement: <h2>Error</h2>
        },
        {
            path: "/register",
            element: <SignupComponent />,
            errorElement: <h2>Error</h2>
        },
        {
            element: <ProtectedRouterComponent />,
            children: [
                {
                    path: "/deshboard",
                    element: <Deshboard />,
                    errorElement: <h2>Error</h2>
                },
                {
                    path: "/deshboard1",
                    element: <h2>Deshboard with /deshboard</h2>,
                    errorElement: <h2>Error</h2>
                },
            ]
        }
    ])

    return (
        <RouterProvider router={router} />
    )
}

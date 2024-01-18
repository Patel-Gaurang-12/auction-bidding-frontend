import axios from "axios"
import { useMutation, useQuery } from "react-query"

const registerUser = (data) => {
    return axios.post("user/register", data)
}

const loginUser = (data) => {
    return axios.post("user/login", data)
}

const addPaymentAndAddress = (data) => {
    return axios.post("payment/add-payment", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const updateProductToPaid = (data) => {
    return axios.put("payment/update-payment-paid", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const getUserProfile = () => {
    return axios.get("http://localhost:9999/user/user-profile", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const getAllUsers = () => {
    return axios.get("user/users", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

// var uid = "";
const getPaymentAddress = () => {
    return axios.get("payment/get-payment", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const deleteUser = (id) => {
    return axios.delete("http://localhost:9999/user/user/" + id, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

export const useRegisterUser = () => {
    return useMutation("registerUser", registerUser, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useLoginUser = () => {
    return useMutation('loginUser', loginUser, {
        retry: 3,
        retryDelay: 400
    })
}

export const useGetUserProfile = () => {
    return useQuery("userProfile", getUserProfile, {
        retry: 3,
        retryDelay: 400
    })
}

export const useGetAllUsers = () => {
    return useQuery("getAllUsers", getAllUsers, {
        retry: 3,
        retryDelay: 400
    })
}

export const useDeleteUser = () => {
    return useMutation("deleteUsers", deleteUser, {
        retry: 3,
        retryDelay: 400
    })
}

export const useAddPayment = () => {
    return useMutation("useAddPayment", addPaymentAndAddress, {
        retry: 3,
        retryDelay: 400
    })
}

export const useGetPaymentAddressDetails = () => {
    return useQuery("getPaymentAddresDetails", getPaymentAddress, {
        retry: 3,
        retryDelay: 400
    })
}

export const useUpdatePaidProduct = () => {
    return useMutation("updatePaidProducts", updateProductToPaid, {
        retry: 3,
        retryDelay: 400
    })
} 
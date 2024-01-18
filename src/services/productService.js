import axios from "axios"
import { useMutation, useQuery } from "react-query"

const getAllProduct = () => {
    return axios.get("http://localhost:9999/product/get-product", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const getProductUserWise = () => {
    return axios.get("http://localhost:9999/product/get-user-wise-product/" + localStorage.getItem("id"), {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const getCategory = () => {
    return axios.get("http://localhost:9999/category/get-category", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

var pid = ""
const getProductById = () => {
    return axios.get("http://localhost:9999/product/get-product-id-wise/" + pid, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}


const addProduct = (data) => {
    return axios.post("http://localhost:9999/product/add-product", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const updateProductStatus = (data) => {
    return axios.put("http://localhost:9999/product/update-product/" + data.id, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const addBids = (data) => {
    return axios.post("http://localhost:9999/bid/add-bid", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const getBidsById = () => {
    return axios.get("http://localhost:9999/bid/get-bid/" + pid, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

export const useGetAllProduct = () => {
    return useQuery("getAllProductsss", getAllProduct, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useGetCategories = () => {
    return useQuery("getAllCategories", getCategory, {
        retry: 5,
        retryDelay: 1000
    })
}

export const usePostProduct = () => {
    return useMutation("usePostProduct", addProduct, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useGetProductById = (id) => {
    pid = id;
    return useQuery("getProductById", getProductById, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useAddBids = () => {
    return useMutation("useAddBidsOnProduct", addBids, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useGetBids = (id) => {
    pid = id;
    return useQuery("getBidsById", getBidsById, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useUpdateProductStatus = () => {
    return useMutation("updateProductStatus", updateProductStatus, {
        retry: 5,
        retryDelay: 1000
    })
}

export const useGetProductUserWise = () => {
    return useQuery("getProductUserWise", getProductUserWise, {
        retry: 5,
        retryDelay: 1000
    })
}
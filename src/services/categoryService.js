import axios from "axios"
import { useMutation, useQuery } from "react-query"

const addCategory = (data) => {
    return axios.post("http://localhost:9999/category/add-category", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const deleteCategory = id => {
    return axios.delete("http://localhost:9999/category/delete-category/" + id, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const deleteSubCategory = id => {
    return axios.delete("http://localhost:9999/sub-category/sub-category/" + id, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const getAllSubCategories = () => {
    return axios.get("http://localhost:9999/sub-category/sub-categories", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}

const addSubCategory = (data) => {
    return axios.post("http://localhost:9999/sub-category/add-subcategory", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userId")}`
        },
    })
}


export const usePostCategory = () => {
    return useMutation("addCategory", addCategory, {
        retry: 5,
        retryDelay: 500
    })
}

export const useDeleteCategory = () => {
    return useMutation("deleteCategory", deleteCategory, {
        retry: 5,
        retryDelay: 500
    })
}

export const useGetSubCategories = () => {
    return useQuery("getAllSubCategories", getAllSubCategories, {
        retry: 5,
        retryDelay: 500
    })
}

export const usePostSubCategory = () => {
    return useMutation("addSubCategory", addSubCategory, {
        retry: 5,
        retryDelay: 500
    })
}

export const useDeleteSubCategory = () => {
    return useMutation("deleteSubCategory", deleteSubCategory, {
        retry: 5,
        retryDelay: 500
    })
}
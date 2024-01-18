import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast'
import { usePostSubCategory } from '../../services/categoryService';
import { useGetCategories } from '../../services/productService';

export const AdminAddSubCategory = () => {

    const validation = {
        categoryId: {
            required: {
                value: true,
                message: "Category is required."
            }
        },
        subCategory: {
            required: {
                value: true,
                message: "Sub category is required."
            },
            maxLength: {
                value: 50,
                message: "Too many length of sub category."
            }
        }
    }

    var { register, handleSubmit, formState: { errors } } = useForm();
    const { data, isLoading } = useGetCategories();
    const mutation = usePostSubCategory();

    const handleForm = (data) => {
        mutation.mutate(data);
    }

    const [note, setnote] = useState(true)
    useEffect(() => {
        if (mutation.isSuccess && note) {
            toast.success("Sub category added successfully.");
            setnote(false);
            document.getElementById("forms").reset();
        }
        if (mutation.isLoading && !note) {
            setnote(true)
        }
    })

    return (
        <>
            <Toaster
                position='top-right'
                toastOptions={{
                    duration: 2000
                }}
            />
            <Container sx={{ width: { xs: "100%", sm: "100%", md: "50vw", xl: "50vw" } }}>
                <Paper sx={{ width: "100%", m: { xs: 1, sm: 1.5, md: 2, xl: 3 }, p: 2 }} elevation={3}>
                    <Typography variant='h6'>Add category</Typography>
                    {
                        mutation.isLoading || isLoading ? (
                            <>
                                <Box p={3} >
                                    <CircularProgress />
                                </Box>
                            </>
                        ) : (
                            <Stack spacing={3} direction="column" component="form" id="forms" onSubmit={handleSubmit(handleForm)} sx={{ mt: 1 }}>
                                <FormControl fullWidth margin='normal'>
                                    <InputLabel id="categoryId">Category</InputLabel>
                                    <Select
                                        {...register("categoryId", validation.categoryId)}
                                        labelId="Category"
                                        id="categoryId"
                                        label="category"
                                        name='categoryId'
                                    >
                                        <MenuItem>Select category</MenuItem>
                                        {data?.data?.data?.map((itm) => (
                                            <MenuItem value={itm._id} key={itm._id}>{itm.categoryName}</MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant='body2' color="red" fontWeight="500">{errors?.categoryId?.message}</Typography>
                                </FormControl>
                                <FormControl fullWidth >
                                    <TextField
                                        type='text'
                                        id="subCategory"
                                        label="Cub category name"
                                        name="subCategory"
                                        {...register("subCategory", validation.subCategory)}
                                    />
                                    <Typography variant='body2' color="red" fontWeight="500">{errors?.subCategory?.message}</Typography>
                                </FormControl>
                                <Button
                                    variant='outlined'
                                    type='submit'
                                    className='w-25'
                                    sx={{ alignSelf: "flex-end" }}>
                                    Submit
                                </Button>
                            </Stack>
                        )
                    }
                </Paper>
            </Container>
        </>
    )
}

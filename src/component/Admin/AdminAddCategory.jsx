import { Box, Button, CircularProgress, Container, FormControl, InputLabel, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Toaster, toast } from 'react-hot-toast'
import { usePostCategory } from '../../services/categoryService'

export const AdminAddCategory = () => {

    const validation = {
        categoryName: {
            required: {
                value: true,
                message: "Please, enter category name."
            },
            maxLength: {
                value: 200,
                message: "You can enter only 200 words."
            }
        }
    }

    var { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = usePostCategory();
    const handleForm = (data) => {
        mutation.mutate(data);
    }

    const [note, setnote] = useState(true)
    useEffect(() => {
        if (mutation.isSuccess && note) {
            toast.success("category added successfully.")
            setnote(false)
        }
        if (mutation.isLoading && !note) {
            setnote(true)
        }
    }, [mutation])
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
                        mutation.isLoading ? (
                            <>
                                <Box p={3} >
                                    <CircularProgress />
                                </Box>
                            </>
                        ) : (
                            <Stack spacing={3} direction="column" component="form" id="forms" onSubmit={handleSubmit(handleForm)} sx={{ mt: 1 }}>
                                <FormControl fullWidth >
                                    <TextField
                                        type='text'
                                        id="categoryName"
                                        label="Category name"
                                        name="categoryName"
                                        {...register("categoryName", validation.categoryName)}
                                    />
                                    <Typography variant='body2' color="red" fontWeight="500">{errors?.categoryName?.message}</Typography>
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

import { Box, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useDeleteSubCategory, useGetSubCategories } from '../../services/categoryService'

export const ListSubCategoryComponent = () => {

    const { data, isLoading, refetch } = useGetSubCategories();
    const mutation = useDeleteSubCategory();

    const [note, setnote] = useState(true)
    useEffect(() => {
        if (mutation.isSuccess && note) {
            toast.success("Sub category deleted successfully.")
            refetch()
            setnote(false)
        }
        if (mutation.isLoading) {
            setnote(true)
        }
    }, [isLoading, mutation])


    return (
        <>
            <Toaster
                position='top-right'
                toastOptions={{
                    duration: 2000
                }}
            />
            <Container>
                <Paper sx={{ m: { xs: 1, sm: 1.5, md: 2, xl: 3 }, p: 2 }} elevation={3}>
                    <Typography variant='h6'>All category</Typography>
                    <Box p={2}>
                        {
                            isLoading || data === undefined ? (
                                <Box p={3} >
                                    <CircularProgress />
                                </Box>
                            ) : (

                                <TableContainer>
                                    <Table sx={{ width: { xs: "100%", sm: "100%", md: "60vw", xl: "60vw" } }} aria-label="simple table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Category name</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Sub category name</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data?.data?.data?.map((row) => (
                                                <TableRow
                                                    key={row._id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row?.categoryId?.categoryName}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row?.subCategory}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <button className='btn btn-danger' onClick={() => mutation.mutate(row._id)}>Delete</button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )
                        }
                    </Box>
                </Paper>
            </Container>
        </>
    )
}

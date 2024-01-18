import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useDeleteUser, useGetAllUsers } from '../../services/userService';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';


export const AdminGetAllUsersComponent = () => {
    const [rows, setrows] = useState([])

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: '_id', headerName: '', width: "0" },
        { field: 'firstName', headerName: 'First name', width: 180 },
        { field: 'lastName', headerName: 'Last name', width: 180 },
        { field: 'userName', headerName: 'User name', width: 200 },
        {
            field: 'number',
            headerName: 'Number',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 100,
        },
        {
            field: 'actions', // Custom field for the action column
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <button
                    className='btn btn-danger'
                    onClick={() => handleButtonClick(params.row._id)} // Replace with your button click handler
                >
                    Delete
                </button>
            ),
        },
    ];


    function setRowsData(data) {
        var rowId = 1;
        const rowData = data.map(element => {
            return {
                id: rowId++,
                _id: element._id,
                firstName: element.firstName,
                lastName: element.lastName,
                userName: element.userName,
                number: element.contactNumber,
                email: element.email,
                role: element.role
            }
        })
        setrows(rowData)
    }

    const mutation = useDeleteUser();

    const { data, isLoading, refetch } = useGetAllUsers();
    const [note, setnote] = useState(true)
    const [deleteNote, setDeleteNote] = useState(true)
    useEffect(() => {
        if (data && note) {
            setRowsData(data?.data?.data)
            setnote(false)
        }
        if (isLoading) {
            setnote(true)
        }
        if (mutation.isSuccess && deleteNote) {
            toast.success("User deleted successfully.")
            setDeleteNote(false)
            refetch()
        }

        if (mutation.isLoading && !deleteNote) {
            setDeleteNote(true)
        }
    }, [isLoading, mutation])

    function handleButtonClick(id) {
        mutation.mutate(id);
    }
    return (
        <>
            <Toaster
                position='top-right'
                toastOptions={{
                    duration: 2000
                }}
            />
            <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
                {
                    data === undefined || isLoading ? (
                        <Box
                            height="20vh"
                            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : rows?.length === 0 ? (
                        <>
                            <Box m={2} ml={5}>
                                <Typography variant='h5'>No data available</Typography>
                            </Box>
                        </>
                    ) :
                        (
                            <Paper sx={{ width: { xs: "100%", sm: "100%", md: "90vw", xl: "90vw" }, my: 3, p: 1, pb: 10 }} elevation={3}>
                                <div style={{ height: 400 }}>
                                    <Box p={2}>
                                        <Typography variant='h5'>Users</Typography>
                                    </Box>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 5 },
                                            },
                                        }}
                                        pageSizeOptions={[5, 10]}
                                        checkboxSelection
                                    />
                                </div>
                            </Paper>
                        )}
            </Container>
        </>
    )
}

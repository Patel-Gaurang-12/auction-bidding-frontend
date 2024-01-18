import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, CssBaseline, Grid, Paper, Typography } from '@mui/material'
import { useGetAllProduct } from '../../services/productService'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { useGetUserProfile } from '../../services/userService';
import { Link, useNavigate } from 'react-router-dom';

export const Deshboard = () => {

    const navigate = useNavigate();
    const { data: userData, isLoading: userLoading, isError: userIsError, error: userError } = useGetUserProfile();
    const { data: productData, refetch, isLoading: productLoading, error: productError } = useGetAllProduct();
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const [productDatas, setproductDatas] = useState([])
    useEffect(() => {
        if (user._id === undefined && userData) {
            dispatch(addUser(userData.data.data))
        }

        if (productData !== undefined) {
            const data = productData?.data?.data.filter(data => data.status === "live");
            setproductDatas(data);
        }
        if (userIsError && userError.response?.data?.message === "token expired") {
            navigate("/session-expired")
        }
        refetch();
    }, [userLoading, productLoading])
    return (
        <>
            <CssBaseline />
            {
                productData === undefined || userLoading || productLoading ? (
                    <Box
                        height="20vh"
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <CircularProgress />
                    </Box>
                ) : productDatas?.length === 0 ? (
                    <>
                        <Box m={2} ml={5}>
                            <Typography variant='h5'>No data available</Typography>
                        </Box>
                    </>
                ) :
                    (
                        <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
                            <Paper sx={{ width: "90%", my: 3, p: 1 }} elevation={3}>
                                <Box m={2} ml={5}>
                                    <Typography variant='h5'>Hello, {user.firstName}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }} >
                                        {
                                            productDatas?.map(product => {
                                                return (
                                                    <Grid item xs={2} sm={4} md={4} display="flex" justifyContent="center" >
                                                        <Card sx={{ maxWidth: 445 }} >
                                                            <CardMedia
                                                                component="img"
                                                                alt="green iguana"
                                                                height="250"
                                                                image={product?.images[0]}
                                                            />
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h5" component="div">
                                                                    {product.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {product.subTitle}
                                                                </Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <Link className='btn btn-sm btn-primary w-100' to={`/single-listing/${product._id}`} >See More</Link>
                                                            </CardActions>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Box>
                            </Paper>
                        </Container >
                    )
            }
        </>
    )
}
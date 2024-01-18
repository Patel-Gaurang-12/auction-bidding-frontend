import React from 'react'
import { Badge, Box, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, CssBaseline, Grid, Paper, Typography } from '@mui/material'
import { useGetAllProduct } from '../../services/productService'
import { Link, useNavigate } from 'react-router-dom';


export const AdminAllListingComponent = () => {

    const { data: productData, isLoading: productLoading } = useGetAllProduct();

    return (
        <>
            <CssBaseline />
            {
                productData === undefined || productLoading ? (
                    <Box
                        height="20vh"
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <CircularProgress />
                    </Box>
                ) : productData?.data?.data?.length === 0 ? (
                    <>
                        <Box m={2} ml={5}>
                            <Typography variant='h5'>No data available</Typography>
                        </Box>
                    </>
                ) :
                    (
                        <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
                            <Paper sx={{ width: "90vw", my: 3, p: 1 }} elevation={3}>
                                <Box display="flex" justifyContent="space-between">
                                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }} >
                                        {
                                            productData?.data?.data?.map(product => {
                                                return (
                                                    <Grid item xs={2} sm={4} md={4} display="flex" justifyContent="center" >
                                                        <Badge color={
                                                            product.status == "live" ? "success" :
                                                                product.status == "pending" ? "warning" :
                                                                    product.status == "closed" ? "secondary" : "error"
                                                        } badgeContent={product.status}
                                                            sx={{ m: 1, position: "relative" }}
                                                        ></Badge>
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

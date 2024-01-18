import React, { useEffect, useState } from 'react'
import { Badge, Box, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, CssBaseline, Grid, Paper, Typography } from '@mui/material'
import { useGetAllProduct, useUpdateProductStatus } from '../../services/productService'
import { Link } from 'react-router-dom';

export const AdminRequestsComponent = () => {

  const { data: productData, isLoading: productLoading } = useGetAllProduct();

  const mutation = useUpdateProductStatus();
  const [products, setproducts] = useState([])
  useEffect(() => {
    if (productData) {
      const data = productData.data.data.filter(data => data.status === "pending");
      setproducts(data)
    }
  }, [productLoading])

  const handleApproveProduct = (id) => {
    mutation.mutate({ id: id, status: "live" })
  }

  const handleRejectProduct = (id) => {
    mutation.mutate({ id: id, status: "rejected" })
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
        <Paper sx={{ width: "90vw", my: 3, p: 1 }} elevation={3}>
          {
            productData === undefined || productLoading ? (
              <Box
                height="20vh"
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <CircularProgress />
              </Box>
            ) : products?.length === 0 ? (
              <>
                <Box m={2} ml={5}>
                  <Typography variant='h5'>No any request for listing...</Typography>
                </Box>
              </>
            ) :
              (
                <>
                  <h5 className='p-2 m-3'>Panding request for listing</h5>
                  <Box>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }} >
                      {
                        products?.map(product => {
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
                                <CardActions sx={{ display: "flex" }}>
                                  <Link className='btn btn-sm btn-primary mx-1 w-50' to={`/single-listing/${product._id}`} >See More</Link>
                                  <button className='btn btn-sm btn-success mx-1 w-50' onClick={() => { handleApproveProduct(product._id) }}>Approve</button>
                                  <button className='btn btn-sm btn-danger mx-1 w-50' onClick={() => { handleRejectProduct(product._id) }} >Reject</button>
                                </CardActions>
                              </Card>
                            </Grid>
                          )
                        })
                      }
                    </Grid>
                  </Box>
                </>
              )
          }
        </Paper>
      </Container >
    </>
  )
}

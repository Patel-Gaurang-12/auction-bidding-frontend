import { Avatar, Badge, Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, CssBaseline, Grid, Modal, Paper, Tab, Typography, createTheme, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetPaymentAddressDetails, useGetUserProfile, useUpdatePaidProduct } from '../../services/userService';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { useGetProductUserWise } from '../../services/productService';
import toast, { Toaster } from 'react-hot-toast';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const UserProfileComponent = () => {
  const id = useParams().id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = React.useState('1');
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  const isSmScreen = useMediaQuery(() => theme.breakpoints.down('sm'));
  const user = useSelector((stete) => stete.user.value)
  const { data: userData, isLoading: userLoading, isError, error, refetch: userRefetch } = useGetUserProfile();
  const { data: product, isLoading: productLoading, refetch: productRefetch } = useGetProductUserWise();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [payment, setpayment] = useState(0)
  const [pid, setPid] = useState("")
  function handlePaynow(data) {
    setpayment(data.amt);
    setPid(data.pid);
    handleOpen();

  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const mutation = useUpdatePaidProduct();
  const payNow = () => {
    mutation.mutate({ productId: pid })
  }

  const { data, refetch, isLoading } = useGetPaymentAddressDetails();
  const [note, setnote] = useState(true)
  useEffect(() => {
    if (isError && error.response.data.message === "token expired") {
      navigate("/session-expired")
    }
    if (user._id === undefined && userData) {
      dispatch(addUser(userData.data.data))
    }
    if (mutation.isSuccess && note) {
      handleClose()
      toast.success("payment accepted successfully.")
      // refetch()
      // productRefetch()
      // userRefetch()
      // setnote(false)
      window.location.reload()
    }
    if (mutation.isLoading && !note) {
      setnote(true)
    }
    console.log("user ", userData);
    console.log("product ", product);
    console.log("payment ", data);
    console.log("payment mutation ", mutation.data);
  }, [userLoading, productLoading, isLoading, mutation])

  return (
    <>
      <CssBaseline />
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000
        }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {
            mutation.isLoading || isLoading || productLoading || userLoading ? (
              <Box width="100%" height="100%">
                <Typography variant='h5'>Please, wait a second..</Typography>
                <Box p={3} >
                  <CircularProgress />
                </Box>
              </Box>
            ) : (
              data?.data?.data.length === 0 ? (
                <>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add your credential
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Your payment and address credential is not added!
                    <br />
                    First you have to add this.
                  </Typography>
                  <Link className='btn btn-primary' to="/address-card-details"> Add your credential</Link>
                </>
              ) : (
                <Box sx={{ p: 1 }}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Payment
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    You have to pay {payment}
                  </Typography>
                  <Button variant='contained' sx={{ my: 2 }} onClick={payNow}>Pay now</Button>
                </Box>
              )
            )
          }
        </Box>
      </Modal>
      {
        userLoading || productLoading || isLoading || userLoading ? (
          <Box
            height="20vh"
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper sx={{ width: "90%", my: 3, p: 1 }} elevation={3}>
              <Grid container
                direction={isSmScreen ? 'column' : 'row'}
                sx={{ width: '100%', p: 2 }} >
                <Grid item xs={6} md={4} display="flex" justifyContent="center" mt={1}>
                  <Avatar
                    sx={{
                      height: 150,
                      width: 150,
                      backgroundColor: 'transparent',
                    }}
                    src={user.profileUrl}
                  ></Avatar>
                </Grid>
                <Grid item direction="column" textAlign="left" xs={6} md={8}>
                  <Typography variant='h5' sx={{ fontWeight: "bold", fontFamily: "revert-layer" }}>{userData?.data?.data?.firstName} {userData?.data?.data?.lastName}</Typography>
                  <Typography variant='h6'>{userData?.data?.data?.userName}</Typography>
                  <Typography variant='body1'>{userData?.data?.data?.contactNumber}</Typography>
                  <Typography variant='body1'>{userData?.data?.data?.email}</Typography>
                  <Typography variant='body1'>{userData?.data?.data?.role}</Typography>
                </Grid>
              </Grid>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', display: "flex", justifyContent: "space-evenly" }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                      <Tab label={user.role === "buyer" ? "Won listing" : "My listing"} value="1" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Box marginTop={5}>
                      {
                        user?.role === "buyer" ? (
                          user?.win?.length === 0 ? (
                            <Box>
                              <Typography variant='h6'> No listing</Typography>
                            </Box>
                          ) : (
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }} >
                              {
                                user?.win?.map(product => {
                                  return (
                                    <Grid item xs={2} sm={4} md={4} display="flex" my={1}>
                                      <Badge color={
                                        product?.productId?.status == "live" ? "success" :
                                          product?.productId?.status == "pending" ? "warning" :
                                            product?.productId?.status == "closed" ? "secondary" : "error"
                                      } badgeContent={product?.productId?.status}
                                        sx={{ m: 1, position: "relative" }}
                                      ></Badge>
                                      <Card sx={{ maxWidth: 445 }} >
                                        <CardMedia
                                          component="img"
                                          alt="green iguana"
                                          height="250"
                                          image={product?.productId?.images[0]}
                                        />
                                        <CardContent>
                                          <Typography gutterBottom variant="h5" component="div">
                                            {product?.productId?.title}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            {product?.productId?.subTitle}
                                          </Typography>
                                          {
                                            product.isPaid === false ?
                                              <Typography variant='body1' color="red">Payment is panding..</Typography> : <Typography variant='body1' color="green">Your payment is done..</Typography>
                                          }
                                        </CardContent>
                                        <CardActions >
                                          <Link className='btn btn-sm btn-primary w-50 mx-1' to={`/single-listing/${product?.productId?._id}`} >See More</Link>
                                          <button onClick={() => handlePaynow({ amt: product?.winAmount, pid: product?.productId?._id })} className='btn btn-sm btn-success w-50 mx-1' disabled={product.isPaid}>Pay {product?.winAmount}</button>
                                        </CardActions>
                                      </Card>
                                    </Grid>
                                  )
                                }
                                )}
                            </Grid>
                          )
                        ) : (
                          product?.data?.data?.length === 0 ? (
                            <Box>
                              <Typography variant='h6'> No listing</Typography>
                            </Box>
                          ) : (
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }} >
                              {
                                product?.data?.data?.map(product => {
                                  return (
                                    <Grid item xs={2} sm={4} md={4} display="flex" my={1} justifyContent="center" >
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
                          )
                        )
                      }
                    </Box>
                  </TabPanel>
                  <TabPanel value="2">No bids placed yet.</TabPanel>
                  <TabPanel value="3">No bids won yet.</TabPanel>
                </TabContext>
              </Box>
            </Paper>
          </Container>
        )
      }
    </>
  )
}

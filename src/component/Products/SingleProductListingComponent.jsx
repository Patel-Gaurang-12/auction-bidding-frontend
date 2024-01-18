import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAddBids, useGetBids, useGetProductById } from '../../services/productService';
import { Box, Button, CircularProgress, Container, CssBaseline, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, createTheme, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';

export const SingleProductListingComponent = () => {
    const id = useParams().id;
    const { data, isLoading, refetch: productRefetch } = useGetProductById(id);
    const { data: bidData, isError: bidIsError, error: bidError, isLoading: bidLoading, refetch } = useGetBids(id);
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
    function convertToFormattedLocalDate(utcDateString) {
        const utcDate = new Date(utcDateString);
        const localDateString = utcDate.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata', // Change this to your desired time zone
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return localDateString;
    }

    var { register, handleSubmit, formState: { errors } } = useForm();
    const isSmScreen = useMediaQuery(() => theme.breakpoints.down('sm'));

    const bid = {
        required: {
            value: true,
            message: "Title is required."
        },
        min: {
            value: data?.data?.data?.reservePrice + 1 < bidData?.data?.data[0]?.amount + 1 ? bidData?.data?.data[0]?.amount + 1 : data?.data?.data?.reservePrice + 1,
            message: `You can not enter below ${data?.data?.data?.reservePrice + 1 < bidData?.data?.data[0]?.amount + 1 ? bidData?.data?.data[0]?.amount + 1 : data?.data?.data?.reservePrice + 1}£ amount.`
        }
    }

    const mutation = useAddBids();
    const submitData = (data) => {
        mutation.mutate({ amount: data.bid, productId: id })
        document.getElementById("")
    }

    const navigate = useNavigate();
    const [setClear, setsetClear] = useState(true)
    const [note, setnote] = useState(0)

    // const product = useSelector(state => state.product.value)
    useEffect(() => {
        if (bidIsError && bidError?.response?.data?.message === "token expired") {
            navigate("/session-expired")
        }
        if (mutation.isSuccess && note === 0) {
            toast.success("bid added successfully.")
            refetch()
            setnote(1)
            productRefetch()
        }
        if (mutation.isLoading && note === 1) {
            setnote(0)
        }
        if (bidLoading) {
            setnote(0)
        }
        return () => {
            window.removeEventListener('beforeunload', clearInterval(countdownInterval));
        };

    }, [isLoading, bidLoading, mutation])

    const countdownInterval = setInterval(() => {
        if (data?.data?.data.endDate && setClear) {
            updateCountdown(data?.data?.data.endDate)
        }
    }, 1000);

    function updateCountdown(data) {
        if (isLoading) {
            return;
        }
        console.log(" --> ", data);
        const currentTime = new Date().toISOString();
        const storedDate = new Date(data);
        const currentDateTime = new Date(currentTime);

        const timeDifference = storedDate - currentDateTime;

        if (timeDifference <= 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "Auction Closed";
            setsetClear(false)
        } else {
            const seconds = Math.floor(timeDifference / 1000) % 60;
            const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
            const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            // Update UI to show remaining time
            document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    const user = useSelector(state => state.user.value)

    return (
        <>
            <Toaster
                position='top-right'
                toastOptions={{
                    duration: 2000
                }}
            />
            <CssBaseline />
            {
                isLoading || data === undefined ? (
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
                                display="flex" justifyContent="space-around" alignItems="center"
                                direction={isSmScreen ? 'column' : 'row'}
                                sx={{ width: '100%' }} >
                                <Grid item xs={6} md={4} mt={1} display="flex" mx={5}>
                                    <Stack>
                                        <Swiper
                                            pagination={{
                                                type: 'bullets',
                                                clickable: true
                                            }}
                                            autoplay={{
                                                delay: 2500,
                                                disableOnInteraction: false,
                                            }}
                                            modules={[Autoplay, Pagination]}
                                            className="mySwiper"
                                            spaceBetween={20}
                                        >
                                            {data?.data?.data?.images?.map((img, index) => (
                                                <SwiperSlide key={index} className='d-flex mx-2 w-100'>
                                                    <img height="100%" width="100%" src={img} className='img-fluid my-2' alt="product" />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <Stack width="100%"
                                            component="form"
                                            onSubmit={handleSubmit(submitData)}
                                            direction={{ xs: "column", sm: "column", md: "row", xl: "row" }}
                                            mt={2} display="flex"
                                            alignItems="center"
                                            justifyContent="space-between">
                                            <TextField sx={{ my: 1, width: { xs: "100%", sm: "100%", md: "70%", xl: "70%" } }}
                                                id="outlined-basic"
                                                size="small"
                                                type='number'
                                                disabled={user?.role === "seller" || user?.role === "admin" ? true : false}
                                                label="Enter bid amount"
                                                variant="outlined"
                                                {...register("bid", bid)}
                                            />
                                            {
                                                mutation.isLoading ? (
                                                    <LoadingButton loading variant="outlined">
                                                        Submit
                                                    </LoadingButton>
                                                ) : (

                                                    <Button
                                                        variant='contained'
                                                        type='submit'
                                                        fullWidth
                                                        disabled={user?.role === "seller" || user?.role === "admin" ? true : false}
                                                        sx={{ my: 1, width: { xs: "100%", sm: "100%", md: "27%", xl: "27%" } }}
                                                        color="error"
                                                        size='large'
                                                    >
                                                        Bid now
                                                    </Button>
                                                )
                                            }
                                        </Stack>
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.bid?.message}</Typography>
                                        {
                                            user.role === "seller" ?
                                                <Typography variant='body2' color="red" fontWeight="500">Only buyers can bids.</Typography>
                                                : <></>
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item direction="row" textAlign="left" xs={6} md={4} mt={1}>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                        <Grid xs={6}>
                                            <Stack direction="column">
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Category</Typography>
                                                <Typography variant='subtitle1'>{data?.data?.data?.categoryId?.categoryName}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Stack direction="column">
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Item</Typography>
                                                <Typography variant='subtitle1'>{data?.data?.data?.title}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Stack direction="column">
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Item</Typography>
                                                <Typography variant='subtitle1'>{data?.data?.data?.title}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Stack direction="column">
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Sub title</Typography>
                                                <Typography variant='subtitle1'>{data?.data?.data?.subTitle}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Stack direction="column">
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Seller</Typography>
                                                <Typography variant='subtitle1'>{data?.data?.data?.userId?.userName}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Stack direction="column">
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Item</Typography>
                                                <Typography variant='subtitle1'>{data?.data?.data?.title}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Box width="80%" py={1}>
                                            <Stack direction="row" display="flex" alignItems="center" justifyContent="space-evenly" bgcolor="#F15A59" border="1px solid red" borderRadius={2} p={1}>
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }} id="countdown"></Typography>
                                            </Stack>
                                        </Box>
                                        <Box width="80%" py={1}>
                                            <Stack direction="row" display="flex" alignItems="center" justifyContent="space-evenly" bgcolor="#98fb98" border="1px solid green" borderRadius={2} p={1}>
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Reserve price</Typography>
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>{data?.data?.data?.reservePrice} £</Typography>
                                            </Stack>
                                        </Box>
                                        <Box width="80%" py={1}>
                                            <Stack direction="column" p={1}>
                                                <Typography variant='h6' sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Description</Typography>
                                                <Typography variant='subtitle2' sx={{ fontFamily: "sans-serif", wordWrap: 'break-word' }}>{data?.data?.data?.description}</Typography>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Stack padding={2} width="60%">
                                <Box borderBottom="1px solid black" p={1} my={2}>
                                    <Typography variant='h6'>Recently placed bids</Typography>
                                </Box>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        {
                                            bidData?.data?.data.length === 0 ? (
                                                <>
                                                    <Typography variant='body2' color="gray" p={1}>No bid placed yet in this product.</Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell align="left">Bid amount</TableCell>
                                                            <TableCell align="left">Time</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            bidData?.data?.data.map((row) => {
                                                                return (
                                                                    <>
                                                                        <TableRow
                                                                            key={row._id}>
                                                                            <TableCell align="left">{row?.userId?.userName}</TableCell>
                                                                            <TableCell align="left">{row?.amount}</TableCell>
                                                                            <TableCell align="left">{convertToFormattedLocalDate(row.date)}</TableCell>
                                                                        </TableRow>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                </>
                                            )
                                        }
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Paper>
                    </Container >
                )
            }
        </>
    )
}

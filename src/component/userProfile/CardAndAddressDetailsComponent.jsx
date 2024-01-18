import { Box, Button, CircularProgress, Container, CssBaseline, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast'
import { useAddPayment, useGetPaymentAddressDetails } from '../../services/userService';
import { useSelector } from 'react-redux';

export const CardAndAddressDetailsComponent = () => {

    const validation = {
        accountNumber: {
            required: {
                value: true,
                message: "Account Number is required."
            },
            maxLength: {
                value: 12,
                message: "Invalid account number."
            },
            minLength: {
                value: 12,
                message: "Invalid account number."
            }
        },
        hodlerName: {
            required: {
                value: true,
                message: "Card Hodler Name is required."
            },
            maxLength: {
                value: 100,
                message: "You can enter maximum 100 charater."
            }
        },
        cvv: {
            required: {
                value: true,
                message: "CVV is required."
            },
            maxLength: {
                value: 3,
                message: "Invalid CVV number."
            },
            minLength: {
                value: 3,
                message: "Invalid CVV number."
            }
        },
        address: {
            required: {
                value: true,
                message: "Address is required."
            },
            maxLength: {
                value: 2000,
                message: "You can enter only 2000 words."
            }
        },
        city: {
            required: {
                value: true,
                message: "City is required."
            },
            maxLength: {
                value: 50,
                message: "You can enter only 50 words."
            }
        },
        country: {
            required: {
                value: true,
                message: "Country is required."
            },
            maxLength: {
                value: 50,
                message: "You can enter only 50 words."
            }
        },
        state: {
            required: {
                value: true,
                message: "State is required."
            },
            maxLength: {
                value: 50,
                message: "You can enter only 50 words."
            }
        },
        pincode: {
            required: {
                value: true,
                message: "Pin code is required."
            },
            maxLength: {
                value: 6,
                message: "You can enter only 6 words."
            }
        }
    }
    var { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useAddPayment();

    const handleForm = (data) => {
        console.log(data);
        mutation.mutate(data);
    }

    const user = useSelector(state => state.user.value)
    const { data, isLoading } = useGetPaymentAddressDetails(user._id);

    const [note, setnote] = useState(true)
    useEffect(() => {
        if (mutation.isSuccess && note) {
            toast.success("Payment and address details are saved.")
            setnote(false)
            document.getElementById("forms").reset()
        }
        if (mutation.isLoading && !note) {
            setnote(true)
        }
        console.log(data);
    }, [mutation, isLoading])

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
                mutation.isLoading ? (
                    <Box
                        height="20vh"
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
                        <Paper sx={{ width: "90%", my: 3, p: 1 }} elevation={3}>
                            <Typography p={2} variant='h5'>Enter Card & address details</Typography>
                            <Stack direction={{ xs: "column", sm: "column", md: "row", xl: "row" }} component="form" id="forms" onSubmit={handleSubmit(handleForm)} sx={{ mt: 1 }}>
                                <Stack direction="column" width={{ xs: "100%", sm: "100%", md: "50%", xl: "50%" }} p={3} spacing={3}>
                                    <FormControl>
                                        <TextField
                                            type='number'
                                            id="accountNumber"
                                            label="Account number"
                                            name="accountNumber"
                                            {...register("accountNumber", validation.accountNumber)}
                                        />
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.accountNumber?.message}</Typography>
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            type='number'
                                            id="cvv"
                                            label="CVV"
                                            name="cvv"
                                            {...register("cvv", validation.cvv)}
                                        />
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.cvv?.message}</Typography>
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            id="address"
                                            label="Address(Landmark, House number etc.)"
                                            multiline
                                            rows={3}
                                            {...register("address", validation.address)}
                                        />
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.address?.message}</Typography>
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            type='number'
                                            id="pincode"
                                            label="Pin code"
                                            name="pincode"
                                            {...register("pincode", validation.pincode)}
                                        />
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.pincode?.message}</Typography>
                                    </FormControl>
                                </Stack>
                                <Stack direction="column" width={{ xs: "100%", sm: "100%", md: "50%", xl: "50%" }} p={3} spacing={3}>
                                    <FormControl>
                                        <TextField
                                            type='text'
                                            id="hodlerName"
                                            label="Card hodler name"
                                            name="hodlerName"
                                            {...register("hodlerName", validation.hodlerName)}
                                        />
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.hodlerName?.message}</Typography>
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            InputLabelProps={{ shrink: true }}
                                            type='text'
                                            id="city"
                                            label="City"
                                            name="city"
                                            {...register("city", validation.city)}
                                        />
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.city?.message}</Typography>
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            type='text'
                                            id="stete"
                                            label="State"
                                            name="state"
                                            {...register("state", validation.state)}
                                        />
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.state?.message}</Typography>
                                    </FormControl>
                                    <FormControl>
                                        <TextField
                                            type='text'
                                            id="country"
                                            label="Country"
                                            name="country"
                                            {...register("country", validation.country)}
                                        />
                                        <Typography variant='body2' color="red" fontWeight="500">{errors?.country?.message}</Typography>
                                    </FormControl>
                                    <Button
                                        variant='contained'
                                        type='submit'
                                        className='w-25'>
                                        Submit
                                    </Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Container>
                )
            }
        </>
    )
}

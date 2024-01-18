import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    IconButton,
    TextField,
    Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { blue } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLoginUser } from '../../services/userService';
import { Toaster, toast } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import MailLockIcon from '@mui/icons-material/MailLock';

const color = blue[500];

export const LoginComponent = () => {

    var [showpass, setShowpass] = useState(false);
    const [change, setchange] = useState(true)
    const validation = {
        email: {
            required: {
                value: true,
                message: "Email is required."
            },
            minLength: {
                value: 3,
                message: "minimum words length is 3."
            },
            maxLength: {
                value: 200,
                message: "maximum words length is 200."
            },
            pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email pattern."
            }
        },
        password: {
            required: {
                value: true,
                message: "Password is required."
            },
            minLength: {
                value: 8,
                message: "Minimum words length is 8."
            },
            maxLength: {
                value: 18,
                message: "Maximum words length is 18."
            },
            pattern: {
                value: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                message: "Invalid password pattern."
            }
        }
    }

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm();
    // const { register: mailRegister, handleSubmit: mailSubmit, formState: { errors: mailError } } = useForm();

    const mutation = useLoginUser();
    const handleForm = (data) => {
        mutation.mutate(data);
    }

    const dispatch = useDispatch()
    const setLocalstore = async (data) => {
        localStorage.setItem("userId", data?.data.token)
        localStorage.setItem("id", data?.data?.data._id)
        dispatch(addUser(data?.data?.data))
    }

    var [note, setnote] = useState(true)
    useEffect(() => {
        if (mutation.isSuccess && note === true) {
            setnote(false);
            toast.success("Mail send successfully.")
            setchange(false)
            console.log(mutation.data);
            setnote(false)
        }
        // if (mutation.isLoading && note === false) {
        //     setnote(true)
        // }
        if (mutation.isError && note === true) {
            if (mutation.error.response.data.message === "user not found." || mutation.error.response.data.message === "Invalid credential.") {
                toast.error("Invalid credential.")
            } else {
                toast.error("Something went wrong.")
            }
            setnote(false)
        }
    }, [mutation])


    const [userPin, setUserPin] = useState("")
    const checkValidation = (data) => {
        setUserPin(data.target.value)
        if (userPin.length === 6) {
            console.log(mutation.data.pin === userPin, mutation.data);
        }
        console.log(data.target.value);
    }

    const getLoginNow = () => {
        if (mutation.data.data.pin === parseFloat(userPin)) {
            document.getElementById("errorPin").display = "none";
            setLocalstore(mutation.data);
            navigate("/")
        } else {
            document.getElementById("errorPin").display = "block";
        }
    }

    return (
        <Container component="main" maxWidth="xl">
            <Toaster
                position='top-right'
                toastOptions={{
                    duration: 4000
                }}
            />
            <CssBaseline />
            <Box
                display={change === true ? "flex" : "none"}
                sx={{
                    marginTop: 8,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: color, width: 60, height: 60 }}>
                    <HttpsRoundedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" id="forms" onSubmit={handleSubmit(handleForm)} className="col-sm-12 col-md-8 col-lg-4" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type='email'
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        {...register("email", validation.email)}
                    />
                    <Typography variant='body2' color="red" fontWeight="500">{errors?.email?.message}</Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        id="password"
                        autoComplete="current-password"
                        {...register("password", validation.password)}
                        type={showpass === true ? "text" : "password"} InputProps={{
                            endAdornment: <IconButton onClick={() => { setShowpass(showpass ? false : true) }}>
                                {showpass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        }}
                    ></TextField>
                    <Typography variant='body2' color="red" fontWeight="500">{errors?.password?.message}</Typography>
                    {
                        mutation.isLoading || mutation.isSuccess ? (
                            <LoadingButton
                                loading
                                sx={{ mt: 3, mb: 2 }}
                                fullWidth
                                color='secondary'
                                variant="contained"
                            >
                                Loading
                            </LoadingButton>
                        ) : (

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        )
                    }
                    <Grid container display="flex" justifyContent="space-between">
                        <Grid item>
                            <Link variant="body2" style={{ paddingRight: 20 }}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link variant="body2" to="/register">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box
                display={change === false ? "flex" : "none"}
                sx={{
                    marginTop: 8,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: color, width: 60, height: 60 }}>
                    <MailLockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Email Verification
                </Typography>
                <Box component="form" id="forms" onSubmit={handleSubmit(handleForm)} className="col-sm-12 col-md-8 col-lg-4" noValidate sx={{ mt: 1 }}>
                    <TextField
                        label="Enter Verification Code"
                        variant="outlined"
                        fullWidth
                        type='number'
                        onKeyUp={checkValidation}
                    />
                    {/* <Typography variant='body2' color="red" fontWeight="500">{errors?.password?.message}</Typography> */}
                    <Typography variant='body2' color="red" fontWeight="500" id='errorPin'>Invalid pin!!!</Typography>
                    {
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={userPin.length === 6 ? false : true}
                            onClick={() => getLoginNow()}
                        >
                            Verify now
                        </Button>
                    }
                </Box>
            </Box>
        </Container>
    )
}

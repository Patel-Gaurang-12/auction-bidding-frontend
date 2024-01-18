import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { blue } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRegisterUser } from '../../services/userService';
import { Toaster, toast } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';

const color = blue[500];

const names = [
  "admin",
  "buyer",
  "seller"
]

export const SignupComponent = () => {

  var [showpass, setShowpass] = useState(false);

  const validation = {
    userName: {
      required: {
        value: true,
        message: "User name is required."
      },
      minLength: {
        value: 3,
        message: "Minimum words length is 3."
      },
      maxLength: {
        value: 200,
        message: "Maximum words length is 200."
      },
    },
    firstName: {
      required: {
        value: true,
        message: "First name is required."
      },
      minLength: {
        value: 3,
        message: "Minimum words length is 3."
      },
      maxLength: {
        value: 200,
        message: "Maximum words length is 200."
      },
    },
    lastName: {
      required: {
        value: true,
        message: "Last name is required."
      },
      minLength: {
        value: 3,
        message: "Minimum words length is 3."
      },
      maxLength: {
        value: 200,
        message: "Maximum words length is 200."
      },
    },
    contactNumber: {
      required: {
        value: true,
        message: "Contact is required."
      },
      minLength: {
        value: 3,
        message: "Minimum words length is 3."
      },
      maxLength: {
        value: 200,
        message: "Maximum words length is 200."
      },
    },
    role: {
      required: {
        value: true,
        message: "Select your role."
      },
    },
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

  var navigate = useNavigate()

  var { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useRegisterUser();
  const handleForm = (data) => {
    mutation.mutate(data);
  }

  // const setLocalstore = (data) => {
  //   localStorage.setItem("userId", data?.data.token)
  //   navigate("/")
  // }

  var [note, setnote] = useState(true)
  useEffect(() => {
    if (mutation.isSuccess && note === true) {
      setnote(false);
      toast.success("Account created successfully.")
      document.getElementById("forms").reset()
      // setLocalstore(mutation.data)
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);
      navigate("/login")
    }
    if (mutation.isLoading && note === false) {
      setnote(true)
    }
    if (mutation.isError && note === true) {
      toast.error("Something went wrong.")
      setnote(false)
    }
  }, [mutation])

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
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: color, width: 60, height: 60 }}>
          <PersonAddAltOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" id='forms' onSubmit={handleSubmit(handleForm)} noValidate sx={{ mt: 1 }} className="col-sm-12 col-md-8 col-lg-4">
          <TextField
            margin="normal"
            required
            fullWidth
            type='text'
            id="user-name"
            label="User name"
            name="user-name"
            {...register("userName", validation.userName)}
          />
          <Typography variant='body2' color="red" fontWeight="500">{errors?.userName?.message}</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            type='text'
            id="first-name"
            label="First name"
            name="first-name"
            {...register("firstName", validation.firstName)}
          />
          <Typography variant='body2' color="red" fontWeight="500">{errors?.firstName?.message}</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            type='text'
            id="last-name"
            label="Last name"
            name="last-name"
            {...register("lastName", validation.lastName)}
          />
          <Typography variant='body2' color="red" fontWeight="500">{errors?.lastName?.message}</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            type='text'
            id="contactNumber"
            label="Contect number"
            name="contact-number"
            {...register("contactNumber", validation.contactNumber)}
          />
          <Typography variant='body2' color="red" fontWeight="500">{errors?.contactNumber?.message}</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            type='email'
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            {...register("email", validation.email)}
          />
          <Typography variant='body2' color="red" fontWeight="500">{errors?.email?.message}</Typography>
          <FormControl fullWidth margin='normal'>
            <InputLabel id="Role">Role</InputLabel>
            <Select
              labelId="Role"
              id="Role"
              label="Role"
              {...register("role", validation.role)}
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
            </Select>
            <Typography variant='body2' color="red" fontWeight="500">{errors?.role?.message}</Typography>
          </FormControl>
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
            mutation.isLoading ? (
              <LoadingButton
                loading
                fullWidth
                variant="outlined"
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
                Register
              </Button>
            )
          }
          <Grid item mb={3}>
            <Link variant="body2" to="/login">
              Login now
            </Link>
          </Grid>
        </Box>
      </Box>
    </Container >
  )
}

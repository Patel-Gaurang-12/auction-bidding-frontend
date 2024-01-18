import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useGetCategories, usePostProduct } from '../../services/productService'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ReactImageUploading from 'react-images-uploading'
import { addUser } from '../../redux/userSlice'
import { useGetUserProfile } from '../../services/userService'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster, toast } from 'react-hot-toast'
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import axios from 'axios'

const steps = ['Select product details', 'Upload pictures', 'Create a product'];

export const AddProductListingComponent = () => {

    const validation = {
        categoryId: {
            required: {
                value: true,
                message: "Category is required."
            }
        },
        title: {
            required: {
                value: true,
                message: "Title is required."
            },
            maxLength: {
                value: 300,
                message: "You can enter maximum 300 charater."
            }
        },
        subTitle: {
            required: {
                value: true,
                message: "Sub title is required."
            },
            maxLength: {
                value: 300,
                message: "You can enter maximum 300 charater."
            }
        },
        description: {
            required: {
                value: true,
                message: "Please, enter description of your product."
            },
            maxLength: {
                value: 2000,
                message: "You can enter only 2000 words."
            }
        },
        reservePrice: {
            required: {
                value: true,
                message: "Please, enter reserve price."
            },
            max: {
                value: 999999999,
                message: "You can not enter price above 999999999."
            }
        },
        endDate: {
            required: {
                value: true,
                message: "Please, enter endDate, endDate is required."
            },
        },
        subCategory: {
            required: {
                value: true,
                message: "Sub category is required."
            }
        }
    }

    const { data: categories, isLoading: categoriesLoading, isError: categoryIsError, error: categoryError } = useGetCategories();
    const navigate = useNavigate()

    var { register, handleSubmit, formState: { errors } } = useForm();

    const [item, setItem] = useState({})
    const handleForm = (data) => {
        setItem(data)
        sethandlePage(true);
    }

    const user = useSelector((stete) => stete.user.value)
    const { data: userData, isLoading: userLoading, isError, error } = useGetUserProfile();
    const dispatch = useDispatch();

    var [changeCategory, setChangeCategory] = useState({
        category: "",
        subCategory: ""
    })
    const [changeCategoryName, setChangeCategoryName] = useState('')
    const [changeSubCategoryName, setSubChangeCategoryName] = useState('')
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [handlePage, sethandlePage] = useState(false)
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [subCategoriesData, setsubCategoriesData] = useState([])
    async function getSubCategoryFromDb(id) {
        const data = await axios.get("http://localhost:9999/sub-category/category-wise-sub-category/" + id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userId")}`
            }
        });
        setsubCategoriesData(data?.data?.data);
    }


    const handleChangeCategory = (value) => {
        setChangeCategoryName(categories.data.data.find(i => i._id === value.target.value).categoryName)
        changeCategory.category = value.target.value;
        getSubCategoryFromDb(value.target.value)
        setChangeCategory(changeCategory)
    }
    const handleChangeSubCategory = (value) => {
        setSubChangeCategoryName(subCategoriesData.find(i => i._id === value.target.value).subCategory)
        changeCategory.subCategory = value.target.value;
        setChangeCategory(changeCategory)
    }
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        sethandlePage(false)
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const mutation = usePostProduct();
    useEffect(() => {
        if (activeStep === steps.length) {
            handleClickOpen()
        }
        if (categoryIsError && categoryError?.response?.data?.message === "token expired") {
            navigate("/session-expired")
        }
        if (user._id === undefined && userData) {
            dispatch(addUser(userData.data.data))
        }
        if (mutation.isSuccess) {
            toast.success("Your listing added successfully.")
            setTimeout(() => {
                navigate("/")
            }, 2000);
        }
    }, [errors, categoriesLoading, activeStep, mutation])

    const [images, setImages] = useState([]);
    const maxNumber = 69;
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };
    {
        const getDataToBackend = () => {
            const formData = new FormData();
            formData.append("topLavelCategory", "AAAAAA");
            formData.append("secondLavelCategory", "BBBBBB")
            formData.append("thirdLavelCategory", "CCCCCC")
            formData.append("title", "Round neck t-shirt")
            formData.append("description", "Round neck t-shirtRound neck t-shirtRound neck t-shirtRound neck t-shirt")
            formData.append("price", 1200)
            formData.append("discountedPrice", 1000)
            formData.append("discountPersent", 10)
            formData.append("quantity", 150)
            formData.append("brand", "Levi's")
            formData.append("color", "red")
            formData.append("size", JSON.stringify({
                "name": "M",
                "quantity": 100
            }, {
                "name": "L",
                "quantity": 200
            }))
            images.forEach((image, index) => {
                formData.append(`img`, image.file);
            });
            handleClose()
            mutation.mutate(formData)
        }
    }

    return (
        <>
            <Toaster
                position='top-right'
                toastOptiocdns={{
                    duration: 2000
                }}
            />
            <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
                <Paper sx={{ width: "90%", my: { xs: 1, sm: 1.5, md: 2, xl: 3 }, p: 0 }} elevation={3}>
                    {
                        categoriesLoading && categories === undefined ? (
                            <Box
                                height="20vh"
                                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Box p={3} bgcolor="">
                                    <Typography variant='h6' fontWeight="600">Create listing.</Typography>
                                </Box>
                                <Box sx={{ width: '100%' }} px={0}>
                                    <Stepper activeStep={activeStep} alternativeLabel>
                                        {steps.map((label, index) => {
                                            const stepProps = {};
                                            const labelProps = {};
                                            return (
                                                <Step key={label} {...stepProps}>
                                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                                </Step>
                                            );
                                        })}
                                    </Stepper>
                                    <React.Fragment>
                                        {
                                            activeStep === 0 ? (
                                                <Stack direction={{ xs: "column", sm: "column", md: "row", xl: "row" }} component="form" id="forms" onSubmit={handleSubmit(handleForm)} sx={{ mt: 1 }}>
                                                    <Stack direction="column" width={{ xs: "100%", sm: "100%", md: "50%", xl: "50%" }} p={3} spacing={3}>
                                                        <FormControl fullWidth margin='normal'>
                                                            <InputLabel id="categoryId">Category</InputLabel>
                                                            <Select
                                                                {...register("categoryId", validation.categoryId)}
                                                                labelId="Category"
                                                                id="categoryId"
                                                                label="category"
                                                                name='categoryId'
                                                                value={changeCategory.category}
                                                                onChange={handleChangeCategory}
                                                            >
                                                                <MenuItem>Select category</MenuItem>
                                                                {categories?.data?.data?.map((itm) => (
                                                                    <MenuItem value={itm._id} key={itm._id}>{itm.categoryName}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            <Typography variant='body2' color="red" fontWeight="500">{errors?.categoryId?.message}</Typography>
                                                        </FormControl>
                                                        <FormControl>
                                                            <TextField
                                                                type='text'
                                                                id="subTitle"
                                                                label="Sub title"
                                                                name="subTitle"
                                                                {...register("subTitle", validation.subTitle)}
                                                            />
                                                            <Typography variant='body2' color="red" fontWeight="500">{errors?.subTitle?.message}</Typography>
                                                        </FormControl>
                                                        <FormControl>
                                                            <TextField
                                                                id="description"
                                                                label="description"
                                                                multiline
                                                                rows={5}
                                                                {...register("description", validation.description)}
                                                            />
                                                            <Typography variant='body2' color="red" fontWeight="500">{errors?.description?.message}</Typography>
                                                        </FormControl>
                                                    </Stack>
                                                    <Stack direction="column" width={{ xs: "100%", sm: "100%", md: "50%", xl: "50%" }} p={3} spacing={3}>
                                                        <FormControl fullWidth margin='normal'>
                                                            <InputLabel id="categoryId">Sub category</InputLabel>
                                                            <Select
                                                                {...register("subCategory", validation.subCategory)}
                                                                labelId="subCategory"
                                                                id="subCategory"
                                                                label="subCategory"
                                                                name='subCategory'
                                                                disabled={changeCategory?.category === "" ? true : false}
                                                                value={changeCategory.subCategory}
                                                                onChange={handleChangeSubCategory}
                                                            >
                                                                <MenuItem>Select sub category</MenuItem>
                                                                {
                                                                    subCategoriesData?.map(itm => <MenuItem value={itm._id}>{itm.subCategory}</MenuItem>)
                                                                }
                                                            </Select>
                                                            <Typography variant='body2' color="red" fontWeight="500">{errors?.subCategory?.message}</Typography>
                                                        </FormControl>
                                                        <FormControl>
                                                            <TextField
                                                                type='text'
                                                                id="Title"
                                                                label="Title"
                                                                name="Title"
                                                                {...register("title", validation.title)}
                                                            />
                                                            <Typography variant='body2' color="red" fontWeight="500">{errors?.title?.message}</Typography>
                                                        </FormControl>
                                                        <FormControl>
                                                            <TextField
                                                                InputLabelProps={{ shrink: true }}
                                                                type='datetime-local'
                                                                id="endDate"
                                                                label="End date"
                                                                name="endDate"
                                                                {...register("endDate", validation.endDate)}
                                                            />
                                                            <Typography variant='body2' color="red" fontWeight="500">{errors?.endDate?.message}</Typography>
                                                        </FormControl>
                                                        <FormControl>
                                                            <TextField
                                                                type='number'
                                                                id="reservePrice"
                                                                label="reserve Price"
                                                                name="reserve Price"
                                                                endAdornment={<InputAdornment position="start">
                                                                    <CurrencyPoundIcon />
                                                                </InputAdornment>}
                                                                {...register("reservePrice", validation.reservePrice)}
                                                            />
                                                            <Typography variant='body2' color="red" fontWeight="500">{errors?.reservePrice?.message}</Typography>
                                                        </FormControl>
                                                        <Button
                                                            variant='outlined'
                                                            type='submit'
                                                            className='w-25'
                                                            sx={{ alignSelf: "flex-end" }}>
                                                            Submit
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                            ) : activeStep === 1 ? (
                                                <>
                                                    <ReactImageUploading
                                                        multiple
                                                        value={images}
                                                        onChange={onChange}
                                                        maxNumber={maxNumber}
                                                        dataURLKey="data_url"
                                                        acceptType={["jpg", "png", "jpeg"]}
                                                    >
                                                        {({
                                                            imageList,
                                                            onImageUpload,
                                                            onImageRemoveAll,
                                                            onImageUpdate,
                                                            onImageRemove,
                                                            isDragging,
                                                            dragProps
                                                        }) => (
                                                            <div className="p-5">
                                                                <Stack spacing={2} >
                                                                    <Button
                                                                        variant='outlined'
                                                                        sx={{ width: "100%", height: "20vh" }}
                                                                        style={isDragging ? { color: "red" } : null}
                                                                        onClick={onImageUpload}
                                                                        {...dragProps}
                                                                    >
                                                                        <Typography variant='button'>Click or Drop here</Typography>
                                                                    </Button>
                                                                    <Button
                                                                        variant='outlined'
                                                                        color='error'
                                                                        sx={{ width: "20%", height: { xs: "10%", sm: "10%", md: "60%", xl: "80%" } }}
                                                                        onClick={onImageRemoveAll}>
                                                                        Remove all images
                                                                    </Button>
                                                                </Stack>
                                                                <Stack p={1} mt={2} direction="row" sx={{ overflowX: "scroll" }}>
                                                                    {imageList.map((image, index) => (
                                                                        <>
                                                                            <Card sx={{ maxWidth: 345, minWidth: 300, mx: 1 }}>
                                                                                <CardMedia
                                                                                    component="img"
                                                                                    height="240"
                                                                                    image={image.data_url}
                                                                                />
                                                                                <CardActions sx={{ m: 1, display: "flex", justifyContent: "space-between" }}>
                                                                                    <Button size="small"
                                                                                        onClick={() => onImageUpdate(index)}>
                                                                                        Update
                                                                                    </Button>
                                                                                    <Button
                                                                                        onClick={() => onImageRemove(index)}
                                                                                        size="small"
                                                                                        color='error'
                                                                                    >
                                                                                        Delete
                                                                                    </Button>
                                                                                </CardActions>
                                                                            </Card>
                                                                        </>
                                                                    ))}
                                                                </Stack>
                                                            </div>
                                                        )}
                                                    </ReactImageUploading>
                                                </>
                                            ) : (
                                                <Box width="100%" p={{ xs: 0.5, sm: 0.9, md: 1, xl: 3 }} >
                                                    <Grid container spacing={{ xs: 1, md: 2 }} textAlign="center" columns={{ xs: 2, sm: 8, md: 12 }}>
                                                        <Grid item xs={4} sm={4} md={4} >
                                                            <Typography fontWeight="500">Category : {changeCategoryName}</Typography>
                                                        </Grid>
                                                        <Grid item xs={4} sm={4} md={4} >
                                                            <Typography fontWeight="500">Sub Category : {changeSubCategoryName}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2} sm={4} md={4} >
                                                            <Typography>Title : {item?.title}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2} sm={4} md={4} >
                                                            <Typography>Sub Title : {item?.subTitle}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2} sm={4} md={4} >
                                                            <Typography>Reserve price : {item?.reservePrice}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2} sm={4} md={4} >
                                                            <Typography>Date : {item?.endDate}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Box p={3} width="100%" >
                                                        <Typography variant='h6'> description </Typography>
                                                        <Typography variant='body1' sx={{ maxWidth: '100%', wordWrap: 'break-word' }}> {item?.description}</Typography>
                                                    </Box>
                                                    <Box display="" my={3}>
                                                        <Stack mt={2} direction="row" sx={{ overflowX: "scroll" }}>
                                                            {images.map((image, index) => (
                                                                <>
                                                                    <Card sx={{ maxWidth: 345, minWidth: { xs: "100%", sm: "50%", md: "24%", xl: "24%" }, m: 1 }} elevation={2}>
                                                                        <CardMedia
                                                                            sx={{ p: 2 }}
                                                                            component="img"
                                                                            height="300"
                                                                            image={image.data_url}
                                                                        />
                                                                    </Card>
                                                                </>
                                                            ))}
                                                        </Stack>
                                                    </Box>
                                                </Box>
                                            )
                                        }
                                        <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
                                            <Button
                                                color="inherit"
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{ mr: 1 }}
                                            >
                                                Back
                                            </Button>
                                            <Box sx={{ display: "flex", width: "100%" }} />
                                            {
                                                handlePage || images.length !== 0 ? (
                                                    <Button
                                                        variant='contained'
                                                        className='w-25'
                                                        onClick={handleNext}
                                                    >
                                                        {activeStep === steps.length - 1 ? 'Finish & list my item' : 'Next'}
                                                    </Button>
                                                ) : (
                                                    <></>
                                                )
                                            }
                                        </Box>
                                    </React.Fragment>
                                </Box>
                            </>
                        )
                    }
                </Paper>
                <div>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        {/* {
                            mutation.isLoading ? (
                                <>
                                    <DialogTitle id="alert-dialog-title" display="flex" alignContent="center" alignItems="center" >
                                        Please, wait a second,
                                        we are listing your product.
                                    </DialogTitle>
                                    <Box p={3} >
                                        <CircularProgress />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <DialogTitle id="alert-dialog-title">
                                        Conformation for listing product!!
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to listing the give product?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button autoFocus>
                                            Agree
                                        </Button>
                                    </DialogActions>
                                </>
                            )
                        } */}
                    </Dialog >
                </div >
            </Container >
        </>
    )
}

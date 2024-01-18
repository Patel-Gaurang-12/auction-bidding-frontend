import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import GavelIcon from '@mui/icons-material/Gavel';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { useGetUserProfile } from '../../services/userService';

export const TopNavigarionbarComponent = (props) => {

    const { data: userData, isLoading: userLoading, isError: userIsError, error: userError } = useGetUserProfile();
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const pages = [];
    const settings = ['Profile', 'Logout'];
    if (user.role === "admin") {
        settings.splice(1, 0, "Add listing", "Deshboard");
    } else if (user.role === "seller") {
        settings.splice(1, 0, "Add listing");
    } else if (user.role === "buyer") {
        settings.splice(1, 0, "Address & Card details");
    }
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const navigate = useNavigate();
    const handleCloseUserMenu = (event) => {
        setAnchorElUser(null);
        switch (event) {
            case "Profile":
                navigate(`/profile/${localStorage.id}`)
                break;
            case "Add listing":
                navigate(`/add-listing`)
                break;
            case "Deshboard":
                navigate("/admin-deshboard")
                break;
            case "Address & Card details":
                navigate("/address-card-details")
                break;
            case "Logout":
                localStorage.clear();
                navigate("/login")
                break;
            default:
                break;
        }
    };


    const [display, setdisplay] = useState('block')
    useEffect(() => {
        if (user._id === undefined && userData) {
            dispatch(addUser(userData.data.data))
        }
        if (window.location.pathname === "/login" || window.location.pathname === "/register") {
            setdisplay("none")
        } else {
            setdisplay("block")
        }
    }, [window.location.pathname, userLoading])

    return (
        <AppBar position="static" sx={{ display: display }} >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <GavelIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Link to="/">
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            E_NILAM
                        </Typography>
                    </Link>
                    <Box >
                        {
                            user.role === "admin" ?
                                (
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={() => props.setdrawer(true)}
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>

                                ) : <></>
                        }
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <GavelIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Link to="/">
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            ENILAM
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={user?.firstName} src={user?.profileUrl} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {
                                settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}


{/* <AppBar position="fixed" open={open}>
    <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
            <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
            Persistent drawer
        </Typography>
    </Toolbar>
</AppBar> */}
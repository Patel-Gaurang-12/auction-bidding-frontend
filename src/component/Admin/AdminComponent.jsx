import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { AdminAddCategory } from './AdminAddCategory';
import { AdminRequestsComponent } from './AdminRequestsComponent';
import { ListCategoryComponent } from './ListCategoryComponent';
import { AdminAllListingComponent } from './AdminAllListingComponent';
import { AdminGetAllUsersComponent } from './AdminGetAllUsersComponent';
import { AdminAddSubCategory } from './AdminAddSubCategory';
import { ListSubCategoryComponent } from './ListSubCategoryComponent';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));



export const AdminComponent = (props) => {

    const [switchs, setswitchs] = useState("requests")
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
            <CssBaseline />
            <Drawer
                sx={{
                    zIndex: 999,
                    position: "fixed",
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={props.drawer}
            >
                <DrawerHeader>
                    <IconButton onClick={() => props.setdrawer(false)}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List sx={{ ml: 2 }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setswitchs("requests")}>
                            <ListItemText primary="Requests" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding onClick={() => setswitchs("all-listing")}>
                        <ListItemButton>
                            <ListItemText primary="All listings" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setswitchs("add-category")}>
                            <ListItemText primary="Add category" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding onClick={() => setswitchs("get-category")}>
                        <ListItemButton>
                            <ListItemText primary="List category" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding onClick={() => setswitchs("add-sub-category")}>
                        <ListItemButton>
                            <ListItemText primary="add sub category" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding onClick={() => setswitchs("list-sub-category")}>
                        <ListItemButton>
                            <ListItemText primary="List sub category" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setswitchs("users")}>
                            <ListItemText primary="Users" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box p={2} display="flex" alignItems="center" justifyContent="center">
                {(() => {
                    switch (switchs) {
                        case "requests":
                            return <AdminRequestsComponent />;
                        case "all-listing":
                            return <AdminAllListingComponent />;
                        case "add-category":
                            return <AdminAddCategory />;
                        case "get-category":
                            return <ListCategoryComponent />;
                        case "users":
                            return <AdminGetAllUsersComponent />;
                        case "add-sub-category":
                            return <AdminAddSubCategory />;
                        case "list-sub-category":
                            return <ListSubCategoryComponent />;
                        default:
                            return null;
                    }
                })()}
            </Box>
        </Box >
    )
}

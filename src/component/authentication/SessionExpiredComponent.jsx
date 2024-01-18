import { Box, Button, Container, Paper, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

export const SessionExpiredComponent = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper sx={{ width: "50%", my: 3, p: 5 }} elevation={3}>
                <Typography id="transition-modal-title" variant="h5" component="h2" fontWeight="600">
                    Session expired
                </Typography>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                    Your sesson is expired, <br />
                    Please, login back to track your Session.
                </Typography>
                <Box mt={3} display="flex" justifyContent="end">
                    <Button variant='outlined' onClick={() => navigate("/login")}> Login </Button>
                </Box>
            </Paper>
        </Container>
    )
}

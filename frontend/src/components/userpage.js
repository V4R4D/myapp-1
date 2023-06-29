
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import React, { Component, useCallback } from 'react';
import { useEffect, useState } from 'react'
import axios from "axios";
import { BrowserRouter as Router, Routes, Link as RouterLink, Route, Navigate } from 'react-router-dom';
import './../App.css'
import Login from './login';
import { useNavigate } from "react-router-dom";
import { validEmail, validPass, validName } from './validations.js';
import Check from './check';
import { Alert } from '@mui/material';
import encrypt from './encdata';
import decrypt from './decdata';
import {validsalary} from './validations';


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function User({ email }) {

    console.log(" email:" + email);

    const navigate = useNavigate();
    const [ep_type, setEp_type] = React.useState('');
    const [salary, setSalary] = useState('');
    const [salaryerr, setSalaryerr] = useState(false);
    const [submitted, setSubmitted] = React.useState(false);



    const triggerAPI = useCallback(async () => {
        console.log(" am i reaching here ? ")
        var enep_type = encrypt(ep_type)
        var ensalary = encrypt(salary)
        var enemail = encrypt(email)
        const res = await axios.post('/userpage', { type: enep_type, salary: ensalary, email: enemail });
        console.log(res)
    }, [ep_type, salary, email]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if(salaryerr){

        }
        else{
            setSubmitted(true);
            triggerAPI();
        }
        
    }, [triggerAPI])

    const handleemploymentselect = useCallback((e) => {
        console.log(" Am i selecting type ??");
        console.log(" ep-type=" + e.target.value);
        setEp_type(e.target.value);
    }, []);



    if (email == "") {
        console.log("User needs to login first!");
        return (
            <Check />
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {!submitted && <Alert severity="success">Welcome ,  You are successfully Logged in!</Alert>}
                {submitted && <Alert severity="success">Details Successfully recorded!!</Alert>}
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h3" variant="h20">
                        Your Email : {email}
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4 }} >
                        <Grid container spacing={2} >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label" value={ep_type}>Employment Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={ep_type}
                                    label="Employment Type"
                                    onChange={handleemploymentselect}
                                >
                                    <MenuItem value={"Intern"} >Intern</MenuItem>
                                    <MenuItem value={"FTE"}>FTE</MenuItem>
                                    {/* <MenuItem value={30}>Thirty</MenuItem> */}
                                </Select>
                            </FormControl>


                            <Grid container spacing={1} item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="salary"
                                    label="salary"
                                    type="text"
                                    value={salary}
                                    id="salary"
                                    autoComplete="new-password"
                                    onChange={(e) => {
                                        
                                        console.log(" salary:" + salary);
                                        if(!validsalary.test(e.target.value)){
                                            setSalaryerr(true);
                                        }
                                        else{
                                            setSalaryerr(false);
                                        }
                                        setSalary(e.target.value);
                                    }}
                                    sx={{
                                        '& fieldset': {
                                            borderColor: salaryerr ? "red" : "green",
                                            bordorwidth: 8
                                        }
                                    }}

                                />
                                {salaryerr && <Typography sx={{
                                    color: "red",
                                    fontSize: 10
                                }}>
                                    Salary should be in integers!
                                </Typography>}
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => {
                                        navigate("./../");
                                    }}
                                >
                                    Logout
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
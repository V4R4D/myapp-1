//check check
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

import React, { Component , useCallback } from 'react';
import { useEffect , useState } from 'react'
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink} from 'react-router-dom';
import '../App.css'
import { useNavigate } from "react-router-dom";
import {validEmail , validPass} from './validations.js';  
import { Alert } from '@mui/material';
import encrypt from './encdata';
import decrypt from './decdata';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/" sx = {{textDecoration :'none'}}>
        Fletch
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Login({ email, setemail }) {
  const [pass, setpass] = useState('');
  const [emailerror, setEmailError] = useState(false);
  const [passerror, setPassError] = useState(false);
  const [firstchange , setFirstChange] = useState(true);
  const [valid,setValid] = useState(true);
  const [incorrectpassword,setincorrectpassword] = useState(false);
  const [notregistered, setNotRegistered] = useState(false);
  const navigate = useNavigate();


  // const bcrypt = require('bcrypt');


  const validate = () => {
    if (!validEmail.test(email)) {
      setEmailError(true);
    }
    if (!validPass.test(pass)) {
      setPassError(true);
    }
  }


  const triggerAPI = useCallback(async () => {
    var enemail = encrypt(email);
    var enpass = encrypt(pass);
    const res = await axios.post('/', { email: email, password: enpass });
    console.log(res);
    if (res.data["status"] == "Incorrect Password try again!") {
      alert("Incorrect Password try again!");
      setincorrectpassword(true);
    }
    else if (res.data["status"] == "Email does not exist ,  Register first !") {
      alert("Email does not exist ,  Register first !");
      setNotRegistered(true);
      navigate('./signup');
    }
    else {
      navigate('./userpage')
    }
  }, [email, pass]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if(email == "" || emailerror){
      setValid(false);
    }

    return triggerAPI();

  }, [triggerAPI])

  

  const handleChangepass = useCallback((e) => {
    setpass(e.target.value)
  }, [])


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {incorrectpassword && <Alert severity="warning"> Incorrect Password! Try again</Alert>}
        {notregistered && <Alert severity="warning"> User not registered! Sign up first</Alert>}
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
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange = {(e) => {
                    console.log(e.target.value + "   " + typeof(e.target.value))
                    if(!validEmail.test(e.target.value)){
                      console.log(" email error");
                      setEmailError(true);
                    }
                    else{
                      setEmailError(false);
                    }
                    setemail(e.target.value);
                    setFirstChange(false);
                  }}
                  sx={{
                    '& fieldset':{
                      borderColor: emailerror ? "red" : (email == "" ? (firstchange ? "green" : "red") : "green"),
                      bordorwidth:8
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChangepass}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Log in
            </Button>
            
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./signup" sx = {{textDecoration :'none'}} variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./reset" sx = {{textDecoration :'none'}} variant="body2">
                  Forgot Password
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
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

import React, { Component, useCallback } from 'react';
import { useEffect, useState } from 'react'
import axios from "axios";
import { BrowserRouter as Router, Routes, Link as RouterLink, Route, Navigate } from 'react-router-dom';
import '../App.css'
import Login from './login';
import { useNavigate } from "react-router-dom";
import { validEmail, validPass, validName } from './validations.js';
import { Alert } from '@mui/material';
import encrypt from './encdata';
import decrypt from './decdata';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/" sx={{ textDecoration: 'none' }}>
        Fletch
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Signup({ email, setemail }) {

  const [fname, setfname] = useState('');

  const [pass1, setpass1] = useState('');
  const [pass2, setpass2] = useState('');
  const [emailregistration, setemailregistration] = useState(false);

  const [emailerror, setEmailError] = useState(false);
  const [passerror, setPassError] = useState(false);
  const [pass2error, setPass2Error] = useState(false);
  const [nameerror, setNameError] = useState(false);
  const [valid, setValid] = useState(true);

  const navigate = useNavigate();

  const triggerAPI = useCallback(async () => {
    var enemail = encrypt(email);
    var enpass = encrypt(pass1);
    var enfname = encrypt(fname);
    var key = encrypt(fname);
    var deemail = decrypt(enemail);
    var depass = decrypt(enpass);
    var defname = decrypt(enfname);


    console.log(" AM i reaching here ? ");
    var obj = { data: { email: email, password: enpass, fname: enfname , key : key } };
    var obj = {...obj , name : {my : "Varad"}};
    // const res = await axios.post('/signup', { data: { email: enemail, password: enpass, fname: enfname } });
    const res = await axios.post('/signup', obj);
    console.log("here res = ");
    console.log(res);
    console.log(" res.data = " + res.data);
    console.log(" res.data.status = " + res.data['status']);

    if (res.data["status"] == "Email is already registered!") {
      setemailregistration(true);
    }
    else if (res.data["status"] == " Account Successfully Created") {
      console.log(" Account created redirect to userpage now!");
      navigate('/userpage')
    }

  }, [email, pass1, fname]);

  const handleSubmit = useCallback((e) => {
    console.log(" is this getting validated ?");
    e.preventDefault();
    console.log(pass1)
    console.log(pass2)
    console.log(" here e is equal to ");
    console.log(e);
    if (nameerror || emailerror || passerror) {
      setValid(false);
    }
    else if (valid) {
      triggerAPI();
    }
  }, [triggerAPI])


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {emailregistration && <Alert severity="error">Email already exists! Try again</Alert>}
        {!valid && <Alert severity="warning">Enter valid deta</Alert>}
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
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  autoComplete="given-name"
                  name="fName"
                  required
                  fullWidth
                  id="firstName"
                  label="Name"
                  autoFocus
                  onChange={(e) => {
                    console.log(e.target.value + "   " + typeof (e.target.value))
                    if (!validName.test(e.target.value)) {
                      console.log(" name error");
                      setNameError(true);
                    }
                    else {
                      setNameError(false);
                    }
                    setfname(e.target.value);
                  }}
                  sx={{
                    '& fieldset': {
                      borderColor: nameerror ? "red" : "green",
                      bordorwidth: 8
                    }
                  }}
                />
                {nameerror && <Typography sx={{
                  color: "red",
                  fontSize: 12
                }}>
                  Enter a valid Name!
                </Typography>}

              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => {
                    console.log(e.target.value + "   " + typeof (e.target.value))
                    if (!validEmail.test(e.target.value)) {
                      console.log(" email error");
                      setEmailError(true);
                    }
                    else {
                      setEmailError(false);
                    }
                    setemail(e.target.value);
                  }}
                  sx={{
                    '& fieldset': {
                      borderColor: emailerror ? "red" : "green",
                      bordorwidth: 8
                    }
                  }}
                />
                {emailerror && <Typography sx={{
                  color: "red",
                  fontSize: 12
                }}>
                  Enter a valid email address!
                </Typography>}
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
                  onChange={(e) => {
                    console.log(e.target.value + "   " + typeof (e.target.value))
                    if (!validPass.test(e.target.value)) {
                      console.log(" Password error");
                      setPassError(true);
                    }
                    else {
                      setPassError(false);
                    }
                    setpass1(e.target.value);
                  }}
                  sx={{
                    '& fieldset': {
                      borderColor: passerror ? "red" : "green",
                      bordorwidth: 8
                    }
                  }}
                />
                {passerror && <Typography sx={{
                  fontSize: 12
                }}  >
                  Use 8 or more characters with a mix of letters, numbers & symbols.

                </Typography>}

              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="new-password"
                  onChange={(e) => {
                    if (e.target.value != pass1) {
                      setPass2Error(true);
                    }
                    else {
                      setPass2Error(false);
                    }
                    setpass2(e.target.value);
                  }}
                  sx={{
                    '& fieldset': {
                      borderColor: pass2error ? "red" : "green",
                      bordorwidth: 8
                    }
                  }}
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to='./../' sx={{ textDecoration: 'none' }} variant="body2">
                  Already have an account? Sign in
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
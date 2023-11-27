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
import { encryptText, encryptFile } from "./encdata";

import decrypt from './decdata';

import { GoogleLogin, GoogleLogout } from '@react-oauth/google';


const theme = createTheme();

export default function Login({ email, setemail }) {
  const [pass, setpass] = useState('');
  const [emailerror, setEmailError] = useState(false);
  const [passerror, setPassError] = useState(false);
  const [firstchange , setFirstChange] = useState(true);
  const [valid,setValid] = useState(true);
  const [incorrectpassword,setincorrectpassword] = useState(false);
  const [notregistered, setNotRegistered] = useState(false);
  const [googleignin , setgooglesignin] = useState(false);
  const navigate = useNavigate();




  const validate = () => {
    if (!validEmail.test(email)) {
      setEmailError(true);
    }
    if (!validPass.test(pass)) {
      setPassError(true);
    }
  }


  const triggerAPI = useCallback(async () => {
    var enemail = encryptText(email);
    var enpass = encryptText(pass);
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


  const GoogleOAuthProvider = require('@react-oauth/google').GoogleOAuthProvider;

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  
    return JSON.parse(jsonPayload);
  }
  
  const handleCredentialResponse = (response) => {
    if (response && response.credential) {
      const parsedToken = parseJwt(response.credential);
  
      // Extract user data from the parsed token
      const userData = {
        userId: parsedToken.sub, // Extract user ID
        userEmail: parsedToken.email, // Extract user email
        userName: parsedToken.name, // Extract user name
        // Extract other relevant user data as needed
      };
  
      console.log('User Data:', userData);
      const userEmail = userData?.userEmail;
      setemail(userEmail);
      setgooglesignin(true);
      // Now, you can use userData for your application's logic or authentication process
    } else {
      console.error('Invalid response or missing credential');
    }
  };
  
  const handleGoogleSignIn = (response) => {
    console.log('Google Sign-in successful:', response);
    handleCredentialResponse(response);
  
    // Extract email from the response or parsed token
     // Adjust this according to your response structure
  
    // Use navigate to redirect to '/userpage' and pass the email as a parameter
    console.log(" user email = " , email);
    
    // console.log(" useremail = " , userEmail);
    
  };
  useEffect(() => {
    if(email && googleignin){
      console.log(" email = " , email);
      navigate('/userpage');
    }
  },[email]);
  
  const handleGoogleSignInFailure = (error) => {
    console.error('Google Sign-in failed:', error);
  };
  


  

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

            <GoogleLogin onSuccess={handleGoogleSignIn} onFailure={handleGoogleSignInFailure} />


            
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
      </Container>
    </ThemeProvider>
  );
}
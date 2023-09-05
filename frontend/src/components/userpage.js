import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import React, { Component, useCallback } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Link as RouterLink,
  Route,
  Navigate,
} from "react-router-dom";
import "./../App.css";
import Login from "./login";
import { useNavigate } from "react-router-dom";
import { validEmail, validPass, validName } from "./validations.js";
import Check from "./check";
import { Alert } from "@mui/material";
import { encryptText, encryptFile } from "./encdata";

import decrypt from "./decdata";
import { validsalary } from "./validations";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function User({ email }) {
  console.log(" email:" + email);

  const navigate = useNavigate();
  const [ep_type, setEp_type] = React.useState("");
  const [salary, setSalary] = useState("");
  const [salaryerr, setSalaryerr] = useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const [data, setData] = useState("");
  const [saltKey, setSaltKey] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const [dataErr, setDataErr] = useState(false);
  const [saltKeyErr, setSaltKeyErr] = useState(false);

  const [selectedFile, setSelectedFile] = useState([]);

  

  const handleDataChange = useCallback(
    (e) => {
      setData(e.target.value);
      updateSubmitStatus(e.target.value, saltKey);
    },
    [saltKey]
  );

  const handleSaltKeyChange = useCallback(
    (e) => {
      setSaltKey(e.target.value);
      updateSubmitStatus(data, e.target.value);
    },
    [data]
  );

  const updateSubmitStatus = (dataValue, saltKeyValue) => {
    setIsSubmitEnabled(dataValue !== "" && saltKeyValue !== "");
  };

  //   const handleSubmit = useCallback(
  //     (e) => {
  //       e.preventDefault();
  //       if (salaryerr || data === "" || saltKey === "") {
  //         return;
  //       }
  //       setSubmitted(true);
  //       triggerAPI();
  //     },
  //     [salaryerr, data, saltKey, triggerAPI]
  //   );

  // const triggerAPI = useCallback(async () => {
  //   console.log(" am i reaching here ? ");
  //   var enep_type = encryptText(ep_type);
  //   var ensalary = encryptText(salary);
  //   var enemail = encryptText(email);
  //   var encryptedFiles = [];

  // for (const file of selectedFile) {
  //   // Encrypt each file and store it in encryptedFiles
  //   const encryptedFile = await encryptFile(file, '123456789');
  //   encryptedFiles.push(encryptedFile);
  // }

  //   const res = await axios.post("/userpage", {
  //     type: ep_type,
  //     salary: salary,
  //     email: email,
  //     file:encryptedFiles
  //   });
  //   console.log(res);
  // }, [ep_type, salary, email]);


  const triggerAPI = useCallback(async () => {
    console.log(" am I reaching here? ");
    var enep_type = encryptText(ep_type);
    var ensalary = encryptText(salary);
    var enemail = encryptText(email);
    
    console.log(" enep_type = " + enep_type)

    var encryptedFiles = [];

    try {
      for (const file of selectedFile) {
        // Encrypt each file and store it in encryptedFiles
        const encryptedFile = await encryptFile(file);
        console.log("Encrypted File:", encryptedFile);

        // Ensure that encryptedFile is a valid result
        if (encryptedFile) {
          encryptedFiles.push(encryptedFile);
        } else {
          console.error("Encryption failed for file:", file);
        }
      }

      // ... the rest of your code ...
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  
    // for (const file of selectedFile) {
    //   // Encrypt each file and store it in encryptedFiles
    //   const encryptedFile = await encryptFile(file);
    //   console.log(" enc file == " + encryptedFile)
    //   encryptedFiles.push(encryptedFile);
    //   // encryptedFiles.push(file);
    // }
  
    const formData = new FormData();
    formData.append('type', ep_type);
    formData.append('salary', salary);
    formData.append('email', email);
  
    // Append each encrypted file to the FormData object
    for (let i = 0; i < encryptedFiles.length; i++) {
      formData.append(`file${i}`, encryptedFiles[i]);
    }
  
    try {
      // Send the FormData object to the API
      console.log(" form data = " , formData)
      const res = await axios.post("/userpage", formData);
      console.log("Response:", res);
  
      // Log the encrypted file data
      console.log("Encrypted Files:", encryptedFiles);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [ep_type, salary, email, selectedFile]);
  

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (salaryerr || dataErr || saltKeyErr) {
        return;
      }

      setSubmitted(true);
      triggerAPI();
    },
    [salaryerr, dataErr, saltKeyErr, triggerAPI]
  );

  const handleemploymentselect = useCallback((e) => {
    console.log(" Am i selecting type ??");
    console.log(" ep-type=" + e.target.value);
    setEp_type(e.target.value);
  }, []);

  // const handleFileSelect = (event) => {
  //   const files = Array.from(event.target.files); // Convert FileList to an array
  //   setSelectedFile(files);
  // };

  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files); // Convert FileList to an array
    setSelectedFile((prevFiles) => [...prevFiles, ...newFiles]);
  };
  

  const handleCancelFile = (index) => {
    const updatedFiles = [...selectedFile];
    updatedFiles.splice(index, 1);
    setSelectedFile(updatedFiles);
  };

  if (email == "") {
    console.log("User needs to login first!");
    return <Check />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {!submitted && (
          <Alert severity="success">
            Welcome , You are successfully Logged in!
          </Alert>
        )}
        {submitted && (
          <Alert severity="success">Details Successfully recorded!!</Alert>
        )}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h3" variant="h20">
            Your Email : {email}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 4 }}
          >
            <Grid container spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" value={ep_type}>
                  Employment Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={ep_type}
                  label="Employment Type"
                  onChange={handleemploymentselect}
                >
                  <MenuItem value={"Intern"}>Intern</MenuItem>
                  <MenuItem value={"FTE"}>FTE</MenuItem>
                </Select>
              </FormControl>

              {/* New field for entering/uploading data/files */}
              <Grid container spacing={1} item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="data"
                  label="Enter/Upload Data/Files"
                  type="text"
                  value={data}
                  id="data"
                  autoComplete="off"
                  onChange={handleDataChange}
                  sx={{
                    "& fieldset": {
                      borderColor: dataErr ? "red" : "green",
                      bordorwidth: 8,
                    },
                  }}
                />
                {dataErr && (
                  <Typography
                    sx={{
                      color: "red",
                      fontSize: 10,
                    }}
                  >
                    Please enter data or upload files.
                  </Typography>
                )}

                <input
                  accept=".txt,.pdf,.doc,.docx" // Specify accepted file types
                  id="file-upload"
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  multiple
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    sx={{ mt: 1, mb: 1 }}
                  >
                    Upload File
                  </Button>
                  {/* Display cancel buttons for selected files */}

                  {console.log("selectedFile type:", typeof selectedFile)}

                  {/* {selectedFile && Array.isArray(selectedFile) && (
                    <div>
                      {selectedFile.map((file, index) => (
                        <div key={index}>
                          <span style={{ marginRight: "10px" }}>
                            {file.name}
                          </span>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleCancelFile(index)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ))}
                    </div>
                  )} */}

                  {selectedFile.length > 0 && (
                    <div>
                      {selectedFile.map((file, index) => (
                        <div key={index}>
                          <span style={{ marginRight: "10px" }}>
                            {file.name}
                          </span>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleCancelFile(index)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>
              </Grid>

              {/* New field for entering salt key */}
              <Grid container spacing={1} item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="saltKey"
                  label="Enter Salt Key"
                  type="password"
                  value={saltKey}
                  id="saltKey"
                  autoComplete="off"
                  onChange={handleSaltKeyChange}
                  sx={{
                    "& fieldset": {
                      borderColor: saltKeyErr ? "red" : "green",
                      bordorwidth: 8,
                    },
                  }}
                />
                {saltKeyErr && (
                  <Typography
                    sx={{
                      color: "red",
                      fontSize: 10,
                    }}
                  >
                    Please enter a valid salt key.
                  </Typography>
                )}
              </Grid>

              {/* The submit button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isSubmitEnabled}
              >
                Submit
              </Button>

              {/* Logout button */}
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
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

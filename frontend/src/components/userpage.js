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


// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
// import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import CssBaseline from '@mui/material/CssBaseline';
// import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
// import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
  // ThemeProvider,
  // CssBaseline,
  // Container,
  // Box,
  // Avatar,
  // Typography,
  // Button,
  // Grid,
  // TextField,
} from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { Alert } from "@mui/material";

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
const defaultTheme = createTheme();
const cards = [1, 2, 3];

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
  const [filePreviews, setFilePreviews] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);

 


  const renderSharedFiles = () => {
    if (sharedFiles.length === 0) {
      return <Typography>No files shared with you.</Typography>;
    }

    return sharedFiles.map((file, index) => (
      <div key={index}>
        {/* Display preview (if available) */}
        {file.preview && (
          <img
            src={file.preview}
            alt={`Preview ${index + 1}`}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        )}
        <Typography>{file.file_name}</Typography>
      </div>
    ));
  };
  useEffect(() => {
    // Replace the URL with your backend endpoint to fetch shared files
    fetch("/api/shared_files/" + email)
      .then((response) => response.json())
      .then((data) => setSharedFiles(data))
      .catch((error) => console.error("Error fetching shared files:", error));
  }, []);

  

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

  const uploadFile = async () =>{
    
    console.log(" in UPLOAD files we have : selected_file = " , selectedFile)
    
    try{
    const formData = new FormData();
    console.log("  reached till here")
    // Append each selected file to the formData
    // selectedFile.forEach((file, index) => {
    //   console.log(" formdata before addition : " , formData)
    //   formData.append(`file${index}`, file);
    //   console.log("  formdata after addition : " , formData)
    // });
    formData.append('file',selectedFile[0])
    formData.append('email', email);

    console.log("Form Data HERE ssisis :", formData);
    // const boundary = formData._boundary;

    console.log("  FormDATA made successfully !!!")
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    // Handle the response from the backend
    if (response.ok) {
      console.log('Files uploaded successfully!');
      // Add any further actions after successful upload
    } else {
      console.error('Upload failed:', response.statusText);
      // Handle error cases
    }
  } 
  catch (error) {
    console.error('Error uploading files:', error.message);
  }

  };

  const triggerAPI = useCallback(async () => {
    console.log(" am I reaching here? ");
    var enep_type = encryptText(ep_type);
    var ensalary = encryptText(salary);
    var enemail = encryptText(email);
    
    console.log(" enep_type = " + enep_type)

    var encryptedFiles = [];

  
    const formData = new FormData();
    // formData.append('type', ep_type);
    // formData.append('salary', salary);
    formData.append('email', email);

    // for (let i = 0; i < selectedFile.length; i++) {
    //   formData.append(`file${i}`, selectedFile[i]);
    // }
  
  
    try {
      // Send the FormData object to the API
      console.log(" form data in Userpage req  = " , formData)
      const res = await axios.post("/userpage", formData);
      console.log("Response:", res);
  
    } catch (error) {
      console.error("Error at formdata:", error);
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
    console.log(" newFiles= " , newFiles)
    console.log(" BB selectedFile = " , selectedFile)
    setSelectedFile((prevFiles) => [...prevFiles, ...newFiles],() => {
      uploadFile();
    });
    console.log(" AA selectedFile = " , selectedFile)
    // uploadFile();
  };



useEffect(() => {
  // This will run after the component re-renders with the updated state
  console.log("AA selectedFile =", selectedFile);

  // Check if selectedFile is not empty before calling uploadFile
  if (selectedFile.length > 0) {
      uploadFile();
  }
}, [selectedFile]);

const handleFileShare = async () => {
  try {
    // Extract necessary data like shared_with_email, file_id, etc.
    // ...

    const requestBody = {
      shared_by_email: email, // Get the logged-in user's email
      shared_with_email: sharedWithEmail, // Get shared email from input field or state
      file_id: selectedFileId, // Get the ID of the selected file to share
      // Other necessary data...
    };

    // Send POST request to the backend
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Handle the response as needed
    if (response.ok) {
      // File shared successfully, update UI or show a success message
    } else {
      // Handle error cases
    }
  } catch (error) {
    // Handle any exceptions or errors during the sharing process
  }
};
const fetchUploadedFiles = async () => {
  try {
    const response = await fetch('/api/my_files');

    if (response.ok) {
      const data = await response.json();
      setUploadedFiles(data); // Update state with fetched files data
    } else {
      // Handle error cases
    }
  } catch (error) {
    // Handle any exceptions or errors during fetching
  }
};

// Function to render shared files with previews
// const renderSharedFiles = () => {
//   return (
//     <div>
//       {/* Map through shared files and render previews */}
//       {sharedFiles.map((file, index) => (
//         <div key={index}>
//           {/* Render file previews or details */}
//           {/* Example: <PreviewComponent file={file} /> */}
//         </div>
//       ))}
//     </div>
//   );
// };

useEffect(() => {
  fetchUploadedFiles(); // Fetch uploaded files on component mount
  // Additional logic or actions on mount...
}, []);
  
  // const handleFileSelect = (event) => {
  //   const files = event.target.files;
  //   const updatedSelectedFiles = [];

  //   for (let i = 0; i < files.length; i++) {
  //     updatedSelectedFiles.push(files[i]);
  //   }

  //   setSelectedFile(updatedSelectedFiles);
  //   uploadFile();
  // };

  const handleCancelFile = (index) => {
    const updatedFiles = [...selectedFile];
    updatedFiles.splice(index, 1);
    setSelectedFile(updatedFiles);
  };

  if (email == "") {
    console.log("User needs to login first!");
    return <Check />;
  }

  // return (
  //   <ThemeProvider theme={theme}>
  //     <Container component="main" maxWidth="xs">
  //       <CssBaseline />
  //       {!submitted && (
  //         <Alert severity="success">
  //           Welcome , You are successfully Logged in!
  //         </Alert>
  //       )}
  //       {submitted && (
  //         <Alert severity="success">Details Successfully recorded!!</Alert>
  //       )}
  //       <Box
  //         sx={{
  //           marginTop: 8,
  //           display: "flex",
  //           flexDirection: "column",
  //           alignItems: "center",
  //         }}
  //       >
  //         <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
  //           <LockOutlinedIcon />
  //         </Avatar>
  //         <Typography component="h3" variant="h20">
  //           Your Email : {email}
  //         </Typography>
  //         <Box
  //           component="form"
  //           noValidate
  //           onSubmit={handleSubmit}
  //           sx={{ mt: 4 }}
  //         >
  //           <Grid container spacing={2}>
  //             <FormControl fullWidth>
  //               <InputLabel id="demo-simple-select-label" value={ep_type}>
  //                 Employment Type
  //               </InputLabel>
  //               <Select
  //                 labelId="demo-simple-select-label"
  //                 id="demo-simple-select"
  //                 value={ep_type}
  //                 label="Employment Type"
  //                 onChange={handleemploymentselect}
  //               >
  //                 <MenuItem value={"Intern"}>Intern</MenuItem>
  //                 <MenuItem value={"FTE"}>FTE</MenuItem>
  //               </Select>
  //             </FormControl>

  //             {/* New field for entering/uploading data/files */}
  //             <Grid container spacing={1} item xs={12}>
  //               <TextField
  //                 required
  //                 fullWidth
  //                 name="data"
  //                 label="Enter/Upload Data/Files"
  //                 type="text"
  //                 value={data}
  //                 id="data"
  //                 autoComplete="off"
  //                 onChange={handleDataChange}
  //                 sx={{
  //                   "& fieldset": {
  //                     borderColor: dataErr ? "red" : "green",
  //                     bordorwidth: 8,
  //                   },
  //                 }}
  //               />
  //               {dataErr && (
  //                 <Typography
  //                   sx={{
  //                     color: "red",
  //                     fontSize: 10,
  //                   }}
  //                 >
  //                   Please enter data or upload files.
  //                 </Typography>
  //               )}

  //               <input
  //                 accept=".txt,.pdf,.doc,.docx" // Specify accepted file types
  //                 id="file-upload"
  //                 type="file"
  //                 name="file"
  //                 onChange={handleFileSelect}
  //                 style={{ display: "none" }}
  //                 multiple
  //               />
  //               <label htmlFor="file-upload">
  //                 <Button
  //                   variant="contained"
  //                   component="span"
  //                   sx={{ mt: 1, mb: 1 }}
  //                 >
  //                   Select File
  //                 </Button>
  //                 {/* Display cancel buttons for selected files */}

  //                 {console.log("selectedFile type:", typeof selectedFile)}

  //                 {selectedFile.length > 0 && (
  //                   <div>
  //                     {selectedFile.map((file, index) => (
  //                       <div key={index}>
  //                         <span style={{ marginRight: "10px" }}>
  //                           {file.name}
  //                         </span>
  //                         <Button
  //                           variant="contained"
  //                           color="error"
  //                           size="small"
  //                           onClick={() => handleCancelFile(index)}
  //                         >
  //                           Cancel
  //                         </Button>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 )}
  //                 {/* {selectedFile.length > 0 && (
  //                   <div>
  //                     {selectedFile.map((file, index) => (
  //                       <div key={index}>
                          
  //                         <Button
  //                           variant="contained"
  //                           size="small"
  //                           onClick={() => uploadFile(file)}
  //                         >
  //                           Upload
  //                         </Button>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 )} */}
  //               </label>
  //             </Grid>
              

  //             {/* New field for entering salt key */}
  //             <Grid container spacing={1} item xs={12}>
  //               <TextField
  //                 required
  //                 fullWidth
  //                 name="saltKey"
  //                 label="Enter Salt Key"
  //                 type="password"
  //                 value={saltKey}
  //                 id="saltKey"
  //                 autoComplete="off"
  //                 onChange={handleSaltKeyChange}
  //                 sx={{
  //                   "& fieldset": {
  //                     borderColor: saltKeyErr ? "red" : "green",
  //                     bordorwidth: 8,
  //                   },
  //                 }}
  //               />
  //               {saltKeyErr && (
  //                 <Typography
  //                   sx={{
  //                     color: "red",
  //                     fontSize: 10,
  //                   }}
  //                 >
  //                   Please enter a valid salt key.
  //                 </Typography>
  //               )}
  //             </Grid>

  //             {/* The submit button */}
  //             <Button
  //               type="submit"
  //               fullWidth
  //               variant="contained"
  //               sx={{ mt: 3, mb: 2 }}
  //               disabled={!isSubmitEnabled}
  //             >
  //               Submit
  //             </Button>

  //             {/* Logout button */}
  //             <Grid container justifyContent="flex-end">
  //               <Grid item>
  //                 <Button
  //                   type="submit"
  //                   fullWidth
  //                   variant="contained"
  //                   sx={{ mt: 3, mb: 2 }}
  //                   onClick={() => {
  //                     navigate("./../");
  //                   }}
  //                 >
  //                   Logout
  //                 </Button>
  //               </Grid>
  //             </Grid>
  //           </Grid>
  //         </Box>
  //       </Box>
  //       <Copyright sx={{ mt: 5 }} />
  //     </Container>
  //   </ThemeProvider>
  // );

  return (
    <ThemeProvider>
      <Container component="main" maxWidth="xs">
        {/* Upload section */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {/* Your upload section code */}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h3" variant="h20">My Files</Typography>
          {/* Render shared files */}
          {renderSharedFiles()}
        </Box>

        {/* Display files shared with the user */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h3" variant="h20">Files Shared With You</Typography>
          {/* Render shared files */}
          {renderSharedFiles()}
        </Box>

        {/* Search and share with email input */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h3" variant="h20">Share Files</Typography>
          {/* Your share files UI components (e.g., input fields, buttons) */}
        </Box>

        {/* Button to submit file sharing */}
        <Button onClick={handleFileShare} variant="contained" sx={{ mt: 3, mb: 2 }}>Share File</Button>
      </Container>
    </ThemeProvider>

  //   <ThemeProvider theme={defaultTheme}>
  //   <CssBaseline />
  //   <AppBar position="relative">
  //     <Toolbar>
  //       <CameraIcon sx={{ mr: 2 }} />
  //       <Typography variant="h6" color="inherit" noWrap>
  //         Album layout
  //       </Typography>
  //     </Toolbar>
  //   </AppBar>
  //   <main>
  //     {/* Hero unit */}
  //     <Box
  //       sx={{
  //         bgcolor: 'background.paper',
  //         pt: 8,
  //         pb: 6,
  //       }}
  //     >
  //       <Container maxWidth="sm">
  //         <Typography
  //           component="h1"
  //           variant="h2"
  //           align="center"
  //           color="text.primary"
  //           gutterBottom
  //         >
  //           Album layout
  //         </Typography>
  //         <Typography variant="h5" align="center" color="text.secondary" paragraph>
  //           Something short and leading about the collection below—its contents,
  //           the creator, etc. Make it short and sweet, but not too short so folks
  //           don&apos;t simply skip over it entirely.
  //         </Typography>
  //         <Stack
  //           sx={{ pt: 4 }}
  //           direction="row"
  //           spacing={2}
  //           justifyContent="center"
  //         >
  //           <Button variant="contained">Main call to action</Button>
  //           <Button variant="outlined">Secondary action</Button>
  //         </Stack>
  //       </Container>
  //     </Box>
  //     <Container sx={{ py: 8 }} maxWidth="md">
  //       {/* End hero unit */}
  //       <Grid container spacing={4}>
  //         {cards.map((card) => (
  //           <Grid item key={card} xs={12} sm={6} md={4}>
  //             <Card
  //               sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
  //             >
  //               <CardMedia
  //                 component="div"
  //                 sx={{
  //                   // 16:9
  //                   pt: '56.25%',
  //                 }}
  //                 image="https://source.unsplash.com/random?wallpapers"
  //               />
  //               <CardContent sx={{ flexGrow: 1 }}>
  //                 <Typography gutterBottom variant="h5" component="h2">
  //                   Heading
  //                 </Typography>
  //                 <Typography>
  //                   This is a media card. You can use this section to describe the
  //                   content.
  //                 </Typography>
  //               </CardContent>
  //               <CardActions>
  //                 <Button size="small">View</Button>
  //                 <Button size="small">Edit</Button>
  //               </CardActions>
  //             </Card>
  //           </Grid>
  //         ))}
  //       </Grid>
  //     </Container>
  //   </main>
  //   {/* Footer */}
  //   <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
  //     <Typography variant="h6" align="center" gutterBottom>
  //       Footer
  //     </Typography>
  //     <Typography
  //       variant="subtitle1"
  //       align="center"
  //       color="text.secondary"
  //       component="p"
  //     >
  //       Something here to give the footer a purpose!
  //     </Typography>
  //     <Copyright />
  //   </Box>
  //   {/* End footer */}
  // </ThemeProvider>
  );
};




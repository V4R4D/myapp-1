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

import AppBar from "@mui/material/AppBar";

import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Stack from "@mui/material/Stack";

import { List, ListItem, ListItemText } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import AlertSnackbar from './AlertSnackbar';

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
  const [myFiles, setMyFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);

  const [sharedselectedFile, setSharedselectedFile] = useState([]);
  const [recipientEmails, setRecipientEmails] = useState("");

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [checkboxSelectedFile , setCheckboxSelectedFile] = useState([]);
  const [successAlert, setSuccessAlert] = useState({ open: false, message: '' });
  const [errorAlert, setErrorAlert] = useState({ open: false, message: '' });

  // Inside your User component function
  const [openDialog, setOpenDialog] = useState(false);

  // const handleSuccessAlertClose = () => setSuccessAlert({ ...successAlert, open: false });
  // const handleErrorAlertClose = () => setErrorAlert({ ...errorAlert, open: false });

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessAlert({ ...successAlert, open: false });
    setErrorAlert({ ...errorAlert, open: false });
  };

  const renderFiles = (files) => {
    if (files.length === 0) {
      return <Typography>No files shared with you.</Typography>;
    }

    const handleDownload = (file) => {
      // Handle the download functionality for the selected file
      // You can create a download link or implement your download logic here
      // For demonstration purposes, I'll simulate a download action
      console.log(`Downloading ${file.file_name}...`);
      // Simulated download
      // window.open(file.download_link); // Replace 'file.download_link' with the actual download link
    };

    const uniqueFiles = Array.from(
      new Set(files.map((file) => file.file_name))
    ); // Extract unique file names

    return uniqueFiles.map((fileName, index) => {
      const file = files.find((file) => file.file_name === fileName); // Find the file by its name
      return (
        <Card key={index} sx={{ maxWidth: 345, marginBottom: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <Checkbox
              checked={sharedselectedFile.includes(file)}
              onChange={() => handleFileSelection(file)}
              sx={{ mr: 1 }} // Add margin for separation
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <CardMedia
                component="img"
                height="30"
                image={file.preview || "https://via.placeholder.com/150"}
                alt={`Preview ${index + 1}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {file.file_name}
                </Typography>
                {/* Download button/icon */}
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* Replace the onClick handler with the appropriate download function */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </Button>
                  {/* Or you can use an icon for download */}
                  {/* <IconButton onClick={() => handleDownload(file)} aria-label="download">
                       <DownloadIcon />
                  </IconButton> */}
                </Stack>
              </CardContent>
            </div>
          </Box>
        </Card>
      );
    });
  };

  useEffect(() => {
    // Replace the URL with your backend endpoint to fetch shared files
    if (email) {
      // fetch("/api/shared_files/" + email)
      //   .then((response) => response.json())
      //   .then((data) => {
      //     // Filter unique files based on file name before setting the state
      //     const uniqueFiles = data.filter(
      //       (file, index, self) =>
      //         index === self.findIndex((f) => f.file_name === file.file_name)
      //     );
      //     setSharedselectedFile(uniqueFiles);
      //   })
      //   .catch((error) => console.error("Error fetching shared files:", error));
    }
  }, [email,myFiles]);
  useEffect(() => {
    setSharedselectedFile(sharedselectedFile);
    console.log(" sharedselectedFiles useeffect  = ", sharedselectedFile);

  }, [sharedselectedFile]);

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

  const uploadFile = async () => {
    console.log(" in UPLOAD files we have : selected_file = ", selectedFile);

    try {
      const formData = new FormData();
      console.log("  reached till here");
      formData.append("file", selectedFile[0]);
      formData.append("email", email);

      console.log("Form Data HERE ssisis :", formData);
      // const boundary = formData._boundary;

      console.log("  FormDATA made successfully !!!");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Handle the response from the backend
      if (response.ok) {
        console.log("Files uploaded successfully!");
        setSuccessAlert({ open: true, message: 'Files uploaded successfully!' });
        fetchUploadedFiles();
        // Add any further actions after successful upload
      } else {
        console.error("Upload failed:", response.statusText);
        setErrorAlert({ open: true, message: 'File upload failed!' });
        // Handle error cases
      }
    } catch (error) {
      console.error("Error uploading files:", error.message);
      setErrorAlert({ open: true, message: 'An error occurred during file upload!' });
    }
  };

  const triggerAPI = useCallback(async () => {
    console.log(" am I reaching here? ");
    var enep_type = encryptText(ep_type);
    var ensalary = encryptText(salary);
    var enemail = encryptText(email);

    console.log(" enep_type = " + enep_type);

    var encryptedFiles = [];

    const formData = new FormData();

    formData.append("email", email);
    try {
      // Send the FormData object to the API
      console.log(" form data in Userpage req  = ", formData);
      const res = await axios.post("/userpage", formData);
      console.log("Response:", res);
      setSuccessAlert({ open: true, message: 'Files uploaded successfully!' });
    } catch (error) {
      console.error("Error at formdata:", error);
    }
  }, [ep_type, salary, email, selectedFile]);

  const handleemploymentselect = useCallback((e) => {
    console.log(" Am i selecting type ??");
    console.log(" ep-type=" + e.target.value);
    setEp_type(e.target.value);
  }, []);

  // const handleFileSelect = (event) => {
  //   const newFiles = Array.from(event.target.files); // Convert FileList to an array
  //   console.log(" newFiles= ", newFiles);
  //   console.log(" BB selectedFile = ", selectedFile);
  //   setSelectedFile(
  //     (prevFiles) => [...prevFiles, ...newFiles],
  //     () => {
  //       uploadFile();
  //     }
  //   );
  //   setOpenUploadDialog(true);
  //   console.log(" AA selectedFile = ", selectedFile);
  //   // uploadFile();
  // };

  // useEffect(() => {
  //   // This will run after the component re-renders with the updated state
  //   console.log("AA in useEffect selectedFile =", selectedFile);
  //   renderFiles(selectedFile);

  //   // Check if selectedFile is not empty before calling uploadFile
  //   if (selectedFile.length > 0) {
  //     console.log(" is this the case???");
  //     uploadFile();
  //   }
  // }, [selectedFile]);

  const handleFileSelect = (event) => {
    const files = event.target.files;
  
    if (files && files.length > 0) {
      // Update selected files state with the files selected by the user
      setSelectedFile([...files]);
      setOpenUploadDialog(true);
    } else {
      // Handle the case where no files were selected
      // console.error('No files selected');
    }
  };
  

  const handleUpload = () => {
    uploadFile();
    setOpenUploadDialog(false);
  };

  const handleCloseUploadDialog = () => {
    setSelectedFile([]);
    setOpenUploadDialog(false);
  };

  const fetchUploadedFiles = async () => {
    try {
      console.log(
        " trying to fetch shared files from db..... with email = " + email
      );
      const response = await fetch("/api/my_files?user_email=" + email); // Pass the user's email as a parameter
      console.log(" got REsp from my_files as resp = " , response);

      if (response.ok) {
        const data = await response.json();
        console.log(" got and set MYfiles withd data = " , data);
        setMyFiles(data); // Update state with fetched files data
      } else {
        // Handle error cases
        setErrorAlert({ open: true, message: 'An error occurred during file Fetching!' });
      }
    } catch (error) {
      // Handle any exceptions or errors during fetching
      setErrorAlert({ open: true, message: 'An error occurred during file Fetching!' });
    }
  };

  const fetchSharedFiles = async () => {
    try {
      console.log(" tryign to get shaared filesw tih this user" , email);
      const response = await fetch("/api/shared_files/" + email); // Pass the user's email as a parameter
      console.log(" got response for shared_files as resp = " , response);

      if (response.ok) {
        const data = await response.json();
        console.log(" fetched and set shared files!!! with data = " ,data);
        setSharedFiles(data); // Update state with fetched files data
      } else {
        // Handle error cases
      }
    } catch (error) {
      // Handle any exceptions or errors during fetching
    }
  };

  useEffect(() => {
    if (email) {
      fetchUploadedFiles();
      fetchSharedFiles();
    } // Fetch uploaded files on component mount
    // Additional logic or actions on mount...
  }, [email]);

  const handleCancelFile = (index) => {
    const updatedFiles = [...selectedFile];
    updatedFiles.splice(index, 1);
    setSelectedFile(updatedFiles);
  };

  if (email == "") {
    console.log("User needs to login first!");
    return <Check />;
  }

  // const handleFileSelection = (file) => {
  //   if (sharedselectedFile.includes(file)) {
  //     setSharedselectedFile(
  //       sharedselectedFile.filter((selectedFile) => selectedFile !== file)
  //     );
  //   } else {
  //     setSharedselectedFile([...sharedselectedFile, file]);
  //   }
  //   console.log(" sharedselectedFiles = " , sharedselectedFile);
  // };

  const handleFileSelection = (file) => {
    console.log("  sharedselectedfile 11 = " , sharedselectedFile);
    setSharedselectedFile((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(file)) {
        return prevSelectedFiles.filter((selectedFile) => selectedFile !== file);
      } else {
        return [...prevSelectedFiles, file];
      }
    });
    console.log(" sharedselectedfiele = " , sharedselectedFile);
  };
  
  

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleRecipientEmailsChange = (event) => {
    setRecipientEmails(event.target.value);
  };

  const handleShareFiles = async () => {
    try {
      // Make sure to replace this with your actual backend URL
      const shareEndpoint = "/api/share";

      // Iterate through the selected files to share each one
      for (const file of sharedselectedFile) {
        const formData = new FormData();
        formData.append("shared_by_email", email); // Assuming 'email' is the logged-in user's email
        formData.append("shared_with_email", recipientEmails); // Assuming 'recipientEmails' contains the recipient's email(s)
        formData.append("file_id", file.file_id); // Assuming 'file.id' represents the file's ID

        // Send a POST request to the backend to share the file
        const response = await axios.post(shareEndpoint, formData);

        // Handle the response from the backend
        if (response.status === 200) {
          console.log("File shared successfully!");
          setSuccessAlert({ open: true, message: 'Files Shared successfully!' });
          // Perform any further actions upon successful sharing
        } else {
          console.error("Failed to share file:", response.data);
          setErrorAlert({ open: true, message: 'An error occurred during file Sharing!' });
          // Handle error cases
        }
      }

      // Close the dialog after sharing
      setOpenDialog(false);
    } catch (error) {
      console.error("Error sharing files:", error.message);
      setErrorAlert({ open: true, message: 'An error occurred during file Sharing!' });
      // Handle any exceptions or errors during file sharing
    }
  };

  const handleShare = () => {
    setSharedselectedFile([]);
    setRecipientEmails("");
  };

  // Function to handle opening the upload dialog
  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
    // Logic to fetch and set selected files
    // Replace this logic with your own file selection mechanism
  };

  // Function to handle opening the delete dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    // Logic to fetch and set selected files for deletion
    // Replace this logic with your own file selection mechanism
  };

  // Function to handle closing the delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Function to handle deleting files
  const handleDelete = async () => {
    try {
      // Get the email of the user (replace 'userEmail' with the actual variable containing the user's email)
      setSharedselectedFile([]);
  
      // Extract an array of filenames from the sharedselectedFile state
      const filenamesToDelete = sharedselectedFile.map(file => file.file_name);

      console.log(" filenames to delete = " , filenamesToDelete); 
  
      // Perform an API call to delete the files from the backend
      const deleteResponse = await fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          filenames: filenamesToDelete,
        }),
      });
  
      if (deleteResponse.ok) {
        // If the deletion is successful, close the delete dialog
        handleCloseDeleteDialog();
        setSuccessAlert({ open: true, message: 'Files deleted successfully!' });
  
        // Fetch the updated list of 'myFiles' after deletion from the backend
        fetchUploadedFiles();
      } else {
        // Handle error scenarios if the deletion fails
        console.error('Error deleting files:', deleteResponse.statusText);
        setErrorAlert({ open: true, message: 'File deleted failed!' });
      }
    } catch (error) {
      console.error('Error occurred while deleting files:', error.message);
      setErrorAlert({ open: true, message: 'An error occurred during file deletion!' });
    }
  };
  
  


  return (
    
    <div
      className="userpage"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
       <AlertSnackbar
        open={successAlert.open}
        severity="success"
        message={successAlert.message}
        handleClose={handleAlertClose}
      />
      <AlertSnackbar
        open={errorAlert.open}
        severity="error"
        message={errorAlert.message}
        handleClose={handleAlertClose}
      />
      {/* Grid container for three main sections */}
      <Grid container spacing={0} style={{ flex: "100%" }}>
        {/* First container */}
        <Grid
  item
  xs={1}
  style={{ backgroundColor: 'lightblue', flex: '15%' , paddingTop:"10%" }}
>
  {/* Your Upload button */}
  <input
    accept=".txt,.pdf,.doc,.docx"
    id="file-upload"
    type="file"
    name="file"
    onChange={handleFileSelect}
    multiple
    style={{ display: 'none' }}
  />
  <label htmlFor="file-upload">
    <Button variant="contained" color="primary" component="span" onClick={handleFileSelect}>
      Upload Files
    </Button>
  </label>

  {/* Dialog for displaying selected files to upload */}
  <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
    <DialogTitle>Selected Files</DialogTitle>
    <DialogContent>
      {selectedFile.length > 0 ? (
        <List>
          {selectedFile.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      ) : (
        <p>No files selected</p>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
      <Button onClick={handleUpload} variant="contained" color="primary">
        Upload
      </Button>
    </DialogActions>
  </Dialog>

  {/* Your Delete button */}
  <Button
    variant="contained"
    color="secondary"
    onClick={handleOpenDeleteDialog}
    style={{ marginTop: '10px' }}
  >
    Delete Files
  </Button>

  {/* Dialog for confirming file deletion */}
  <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
    <DialogTitle>Confirm File Deletion</DialogTitle>
    <DialogContent>
  {console.log("Contents of sharedselectedFile:", sharedselectedFile)}
  {sharedselectedFile.length > 0 ? (
    <List>
      {sharedselectedFile.map((file, index) => (
        <ListItem key={index}>
          <ListItemText primary={file.file_name} />
        </ListItem>
      ))}
    </List>
  ) : (
    <p>No files selected</p>
  )}
</DialogContent>

    <DialogActions>
      <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
      <Button onClick={handleDelete} variant="contained" color="secondary">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
</Grid>

        <Grid
          item
          xs={10}
          style={{
            backgroundColor: "lightgreen",
            flex: "85%",
            position: "relative",
          }}
        >
          <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* My Files section */}
              <Box
                sx={{ width: "100%", display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    My Files
                  </Typography>
                  <label htmlFor="file-upload">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Upload Files
                    </Button>
                  </label>
                  <input
                    accept=".txt,.pdf,.doc,.docx"
                    id="file-upload"
                    type="file"
                    name="file"
                    onClick={handleFileSelect}
                    multiple
                    style={{ display: "none" }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {renderFiles(myFiles)}
                </Box>
                {/* ... My Files content */}

                {/* Your Upload Files button */}
              </Box>
              <Typography variant="h5" gutterBottom>
                Shared Files
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {renderFiles(sharedFiles)} {/* Render sharedFiles */}
              </Box>

              {/* Shared Files section */}
              {/* ... Shared Files content */}

              {/* Share Files section */}
              <Box sx={{ width: "100%" }}>
                <Typography variant="h5" gutterBottom>
                  Share Files
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDialogOpen}
                >
                  Share
                </Button>
                <Dialog open={openDialog} onClose={handleDialogClose}>
                  <DialogTitle>Share Files with Recipients</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Recipient Email(s)"
                      type="email"
                      fullWidth
                      value={recipientEmails}
                      onChange={handleRecipientEmailsChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleShareFiles} color="primary">
                      Share
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Box>
          </Container>
        </Grid>

        {/* Third container */}
        <Grid
          item
          xs={1}
          style={{ backgroundColor: "lightyellow", flex: "5%" }}
        >
          {/* Logout Button */}
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              navigate("./../");
            }}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            Logout
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

// UpdateKnocker.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function UpdateKnocker({ selectedUser, onClose, refreshTableData }) {
  const [formData, setFormData] = useState({
   
    firstName: selectedUser.firstName || '',
    lastName: selectedUser.lastName || '',
    userName: selectedUser.userName || '',
    email: selectedUser.email || '',
    phone: selectedUser.phone || '',
  });
  const [isLoading, setIsLoading] = React.useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await axios.put(`http://34.122.133.247:3001/api/knocker?id=${selectedUser.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });



     

      toast.success('Knocker updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      

      setIsLoading(false);
      

      // Close the modal or navigate back
      onClose();
      refreshTableData();
    } catch (error) {
        console.log("error", error.response.data.message);
setIsLoading(false);

        toast.error(`Error: ${error.response.data}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
      console.error('Error updating user:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>

<CssBaseline />

<Box
sx={{
marginTop: 8,
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
}}
>

<Typography component="h1" variant="h5" style={{color:"#1565c0", fontWeight:"50rem", marginTop:"1rem" }}>
Update Knocker
</Typography>
<Box component="form" noValidate sx={{ mt: 3 }}>
<Grid container spacing={2}>
<Grid item xs={12} sm={6}>
 <TextField
   autoComplete="given-name"
   name="firstName"
   required
   fullWidth
   id="firstName"
   label="First Name"
   value={formData.firstName}               
   autoFocus
//    error={firstNameError !== ''}
//    helperText={firstNameError}
   onChange={handleChange}
 />

</Grid>
<Grid item xs={12} sm={6}>
 <TextField
   required
   fullWidth
   id="lastName"
   label="Last Name"
   name="lastName"
   value={formData.lastName}                 
   autoComplete="family-name"
//    error={lastNameError !== ''}
//    helperText={lastNameError}
   onChange={handleChange}

 />
</Grid>
<Grid item xs={12} sm={6}>
<TextField
 margin="normal"
 required
 fullWidth
 name="userName"
 label="User Name"
 value={formData.userName}            
 id="userName"
//  error={userNameError !== ''}
//    helperText={userNameError}
   onChange={handleChange}

/>
</Grid>

<Grid item xs={12} sm={6}>
<TextField
margin="normal"
required
fullWidth
 name="phone"
label="Phone Number"
 type="number"
 value={formData.phone} 
 id="phone"
 autoComplete="current-phone"
//  error={phoneError !== ''}
//    helperText={phoneError}
   onChange={handleChange}

/>
</Grid>
<Grid item xs={12}>
 <TextField
   required
   fullWidth
   id="email"
   label="Email Address"
   name="email"
   value={formData.email}                  
   autoComplete="email"
//    error={emailError !== ''}
//    helperText={emailError}
   onChange={handleChange}

 />
</Grid>
{/* <Grid item xs={12}>
 <TextField
   required
   fullWidth
   name="password"
   label="Password"
   type="password"
   id="password"
   value={formData.password}                  
   autoComplete="new-password"
//    error={passwordError !== ''}
//    helperText={passwordError}
   onChange={handleChange}

   
 />
</Grid> */}


</Grid>

<Grid>
{isLoading ? (
   <Button 
  
   color='primary'
type="button"
halfwidth='true'
variant="contained"
sx={{ mt: 3, mb: 5, mr:2 }}
   >
       Updating  <CircularProgress size={24} style={{color:"white", marginLeft:".5rem"}} />
   </Button> 
    )
    : 
    (
      <Button 
    onClick={handleUpdate}
    color='primary'
type="button"
halfwidth='true'
variant="contained"
sx={{ mt: 3, mb: 5, mr:2 }}
    >
        Update

    </Button>
       
    )}


    <Button 
    onClick={onClose}
    color='primary'
type="button"
halfwidth='true'
variant="contained"
sx={{ mt: 3, mb: 5 , ml:2}}
    >
        Cancel

    </Button>
</Grid>
</Box>
</Box>


</ThemeProvider>

  );
}



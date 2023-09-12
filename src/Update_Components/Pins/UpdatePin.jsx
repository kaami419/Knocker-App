import React, { useState } from 'react';
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
import './UpdatePin.css'

const defaultTheme = createTheme();


export default function UpdatePin({ selectedPin, onClose, refreshTableData }) {
  const [formData, setFormData] = useState(selectedPin);
  const [isLoading, setIsLoading] = React.useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setIsLoading(true);
        const response = await axios.put(`http://34.122.133.247:3001/api/pin?id=${selectedPin.id}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log("Update response:", response.data);
          toast.success('Pin updated successfully!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsLoading(false);
          


      onClose();
      refreshTableData();
    } catch (error) {
      // Handle errors, display error messages, etc.
      console.error('Error updating pin:', error);
      setIsLoading(false);
      toast.error(`Error: ${error}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
    Update Pin
    </Typography>
    <Box component="form" noValidate sx={{ mt: 3 }}>
    <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
     <TextField
       autoComplete="given-name"
       name="name"
       required
       fullWidth
       id="name"
       label="name"
       value={formData.name}               
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
       id="image"
       label="image"
       name="image"
       value={formData.image}                 
       autoComplete="family-name"
    //    error={lastNameError !== ''}
    //    helperText={lastNameError}
       onChange={handleChange}
    
     />
    </Grid>
    <Grid item xs={12} sm={12}>
    <TextField
    type='color'
     margin="normal"
     required
     fullWidth
     name="color"
     label="color"
     value={formData.color}            
     id="color"
    //  error={userNameError !== ''}
    //    helperText={userNameError}
       onChange={handleChange}
    
    />
    </Grid>
    

    
    
    </Grid>
    {/* <Grid>
    <Button variant='contained' color='primary' type="button" onClick={handleSubmit}>Update</Button>
    <Button variant='contained' color='primary' type="button" onClick={onClose}>Cancel</Button>
    </Grid> */}
    
    <Grid>
        <div className='btnDiv'>
<div style={{width:"50%"}}>
    {isLoading ? (
        
       <Button variant='contained' color='primary' type="button" >Updating <CircularProgress size={20} style={{color:"white", marginLeft:"1rem"}}  /></Button>
        )
        : 
        (
         <Button variant='contained' color='primary' type="button" onClick={handleSubmit} style={{marginRight:"1rem"} } sx={{mt:2, mb:2}}>Update</Button>
           
        )}

</div>
    
    <div style={{width:"50%"}}>
        <Button 
        onClick={onClose}
        color='primary'
    type="button"
    halfwidth='true'
    variant="contained"
    sx={{mt:2, mb:2}}
        >
            Cancel
    
        </Button>
        </div>
        </div>

        </Grid>
        
    
    </Box>
    </Box>
    
    
    </ThemeProvider>
  );
}

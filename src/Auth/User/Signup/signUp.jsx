import * as React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import { NavLink } from 'react-router-dom';
import './signUp.css'
import axios from 'axios';
import StickyHeadTable from '../../../DashBoard/Table/Table';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { CircularProgress } from '@mui/material';


const defaultTheme = createTheme();

export default function UserSignUp({selectedUser, editingPin}) {
  const [table, setTable] = React.useState(false);
  const token = localStorage.getItem('token');
  const [firstNameError, setFirstNameError] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState("");
  const [userNameError, setUserNameError] = React.useState("");
  const [userTypeError, setUserTypeError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalContent, setModalContent] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    firstName: selectedUser ? selectedUser.firstName : '',
    lastName: selectedUser ? selectedUser.lastName : '',
    userName: selectedUser ? selectedUser.userName : '',
    email: selectedUser ? selectedUser.email: '',
    phone: selectedUser ? selectedUser.phone: '',
    password: selectedUser ? selectedUser.password: '',
    userType: "Knocker"
  });

  const navigate= useNavigate()


  // React.useEffect(() => {
  //   // Populate the form fields with selectedUser data when component mounts
  //   setFormData({
  //     firstName: selectedUser ? selectedUser.firstName : '',
  //     lastName: selectedUser ? selectedUser.lastName : '',
  //     userName: selectedUser ? selectedUser.userName : '',
  //     email: selectedUser ? selectedUser.email : '',
  //     phone: selectedUser ? selectedUser.phone : '',
  //     password: selectedUser ? selectedUser.password: '',

  //   });
  // }, [selectedUser]);

 

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setOpenModal(true);
  };

 
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = new FormData(event.currentTarget);
  
    const formData = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      password: data.get('password'),
      phone: data.get('phone'), 
      email: data.get('email'),
      userName: data.get('userName'),
      userType: "Knocker"
    };

    if (!formData.firstName) {
      setFirstNameError("First Name is required.");
    } else {
      setFirstNameError("");
    }
    if (!formData.lastName) {
      setLastNameError("Last Name is required.");
    } else {
      setLastNameError("");
    }
    if (!formData.userName) {
      setUserNameError("User Name is required.");
    } else {
      setUserNameError("");
    }
    if (!formData.email) {
      setEmailError("Email is required.");
    } else {
      setEmailError("");
    }
    if (!formData.password) {
      setPasswordError("Password is required.");
    } else {
      setPasswordError("");
    }
    if (!formData.phone) {
      setPhoneError("Phone Number is required.");
    } else {
      setPhoneError("");
    }

    
    if (
      firstNameError &&
      lastNameError &&
      userNameError &&
      userTypeError &&
      emailError &&
      passwordError &&
      phoneError
    ) {
      setErrorMessage("Please fill in all required fields.");
      return; 
    }
const req= "192.168.100.18"
setIsLoading(true);
  
    try {
      const response = await axios.post('http://192.168.100.18:3001/api/admin/create/user', formData,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      toast.success('Knocker created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // console.log('API Response:', response.data);
      
      // alert('Success: Knocker created successfully.');
      // navigate('/Dashboard/knockersList')
      setTable(!table)
      
     
    } catch (error) {
      console.error('API Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        
        setErrorMessage(error.response.data.message); 
        console.log("error msg:", errorMessage);
        // handleModalOpen('Error', error.response.data.message);
        toast.error(`Error: ${errorMessage}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setErrorMessage("An error occurred. Please try again later."); 
        toast.error(`Error: ${errorMessage}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      
    }
  };
   
  React.useEffect(() => {
    setFormData({
      firstName: selectedUser ? selectedUser.firstName : '',
      lastName: selectedUser ? selectedUser.lastName : '',
      userName: selectedUser ? selectedUser.userName : '',
      email: selectedUser ? selectedUser.email : '',
      phone: selectedUser ? selectedUser.phone : '',
      password: selectedUser ? selectedUser.password: '',

    });
  }, [selectedUser]);

  const handleUpdateUser = async () => {
    // Construct the updated user data object
    const updatedUserData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      userName: formData.userName
    };

    try {
      const response = await axios.put(
        `http://192.168.100.18:3001/api/knocker?id=${selectedUser.id}`,{
        updatedUserData},{
          headers:{
            Authorization: `Bearer ${token}`,

          }
        }
      );

      toast.success('Knocker updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTable(!table)

      // navigate('/Dashboard/knockersList')
    } catch (error) {
      // setErrorMessage(error.response.data.message); 

      toast.error(`${error.response.data.message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      {table? 
      <StickyHeadTable/>
      :
    <ThemeProvider theme={defaultTheme}>
                   {/* <div className='createKnockerPageBtnsDiv'> */}
            {/* <NavLink to={'/Dashboard'}> */}
            {/* <Button variant='contained' color='primary'  onClick={()=>{ navigate('/Dashboard/knockerTable');setTable(!table);}}>View Knocker List</Button> */}
            {/* </NavLink> */}
            {/* </div> */}
      <Container component="main" maxWidth="md" className='signUpContainer'>
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
            Register Knocker
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  error={firstNameError !== ''}
                  helperText={firstNameError}
                  onChange={handleInputChange}
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
                  error={lastNameError !== ''}
                  helperText={lastNameError}
                  onChange={handleInputChange}

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
                error={userNameError !== ''}
                  helperText={userNameError}
                  onChange={handleInputChange}

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
                error={phoneError !== ''}
                  helperText={phoneError}
                  onChange={handleInputChange}

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
                  error={emailError !== ''}
                  helperText={emailError}
                  onChange={handleInputChange}

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
                  value={formData.password}                  
                  autoComplete="new-password"
                  error={passwordError !== ''}
                  helperText={passwordError}
                  onChange={handleInputChange}

                  
                />
              </Grid>
  

            </Grid>
            <Grid >
            {isLoading ? (
                  <Button 
                  halfwidth="true"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  >   
          <CircularProgress color="inherit" size={24} /> 
          </Button>
        ) : (
            editingPin ? (
              <Button
              style={{ marginBottom: "1.90rem"}}
              halfwidth='true'
          color="primary"
          variant="contained"
          sx={{ mt: 3, mb: 5 }}
          onClick={handleUpdateUser}
        >
          Update
        </Button>
          
            ) : (
              <Button
            color='primary'
              type="submit"
              halfwidth='true'
              variant="contained"
              sx={{ mt: 3, mb: 5 }}
            >
              Create
            </Button>
            )
        )}
      </Grid>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
}

{/* <Dialog
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
      >
        <DialogTitle id="modal-title" >{modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{modalContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}


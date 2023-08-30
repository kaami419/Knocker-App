import * as React from 'react';
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
  const [formData, setFormData] = React.useState({
    firstName: selectedUser ? selectedUser.firstName : '',
    lastName: selectedUser ? selectedUser.lastName : '',
    userName: selectedUser ? selectedUser.userName : '',
    email: selectedUser ? selectedUser.email: '',
    phone: selectedUser ? selectedUser.phone: '',
    password: selectedUser ? selectedUser.password: '',
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
    // console.log("token",token);
    
    const data = new FormData(event.currentTarget);
  
    const formData = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      password: data.get('password'),
      phone: data.get('phone'), 
      email: data.get('email'),
      userName: data.get('userName'),
      userType: data.get('userType')
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
    if (!formData.userType) {
      setUserTypeError("User Type is required.");
    } else {
      setUserTypeError("");
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

  
    try {
      const response = await axios.post('https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/admin/create/user', formData,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      // console.log('API Response:', response.data);
      
      // alert('Success: Knocker created successfully.');
      // navigate('/Dashboard/knockersList')
      setTable(!table)
      
     
    } catch (error) {
      console.error('API Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); 
        handleModalOpen('Error', error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again later."); 
        handleModalOpen('Error', 'An error occurred. Please try again later.');
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
        `https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/knocker?id=${selectedUser.id}`,{
        updatedUserData},{
          headers:{
            Authorization: `Bearer ${token}`,

          }
        }
      );

      console.log('User updated:', selectedUser.id);
      // alert(`Success: ${response.data.message}`)
      setTable(!table)

      // navigate('/Dashboard/knockersList')
    } catch (error) {
      console.error('Error updating user:', error);
      // alert(error.response.data.message)
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
                  value={formData.firstName} // Bind to formData.firstName                  
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
                  value={formData.lastName} // Bind to formData.firstName                  
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
                value={formData.userName} // Bind to formData.firstName              
                id="userName"
                // autoComplete="current-userName"
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
              name="userType"
              label="User Type"            
                id="userType"
              autoComplete="current-userType"
              defaultValue={"Knocker"}
              error={userTypeError !== ''}
              helperText={userTypeError}
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
                  value={formData.email} // Bind to formData.firstName                  
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
                  value={formData.password} // Bind to formData.firstName                  
                  autoComplete="new-password"
                  error={passwordError !== ''}
                  helperText={passwordError}
                  onChange={handleInputChange}

                  
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
              margin="normal"
               required
               fullWidth
                name="phone"
               label="Phone Number"
                type="number"
                value={formData.phone} // Pre-filled value
                id="phone"
                autoComplete="current-phone"
                error={phoneError !== ''}
                  helperText={phoneError}
                  onChange={handleInputChange}

              />
              </Grid>

            </Grid>
            <Grid>
            {editingPin ? (
              <Button
              style={{ marginBottom: ".90rem"}}
              halfwidth='true'
          color="primary"
          variant="contained"
          onClick={handleUpdateUser}
        >
          Update
        </Button>
          
            ) : (
              <Button
            // className='createKnockerBtn'
            color='primary'
              type="submit"
              halfwidth='true'
              variant="contained"
              sx={{ mt: 3, mb: 5 }}
            >
              Create
            </Button>
            )}
      </Grid>
            <Grid container justifyContent="flex-end">
              {/* <Grid item>
                <NavLink to={'/UserSignin'} variant="body2" style={{textDecorationColor: 'rgba(25, 118, 210, 0.4)',color: '#1976d2'}}>
                  Already have an account? Sign in
                </NavLink>
              </Grid> */}
            </Grid>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
}

<Dialog
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
      </Dialog>
    </div>
  );
}


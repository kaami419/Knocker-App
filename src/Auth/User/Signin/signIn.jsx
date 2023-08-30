import * as React  from 'react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { NavLink } from 'react-router-dom';



const defaultTheme = createTheme();

export default function UserSignin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [openModal, setOpenModal] = React.useState(false);
const [modalTitle, setModalTitle] = React.useState('');
const [modalContent, setModalContent] = React.useState('');
const [emailError, setEmailError] = React.useState('');
const [passwordError, setPasswordError] = React.useState('');

const handleModalClose = () => {
  setOpenModal(false);
};

const handleModalOpen = (title, content) => {
  setModalTitle(title);
  setModalContent(content);
  setOpenModal(true);
};

const validateEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(email);
};

const validateForm = () => {
  let isValid = true;
  setEmailError('');
  setPasswordError('');

  if (formData.email.trim() === '') {
    setEmailError('Email is required');
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    setEmailError('Invalid email format');
    isValid = false;
  }

  if (formData.password.trim() === '') {
    setPasswordError('Password is required');
    isValid = false;
  }

  return isValid;
};
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (event) => {
        event.preventDefault();
      
        if (!validateForm()) {
          return;
        }
const req= "192.168.100.18"

        try {
          const response = await axios.post(
            'https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/auth/signIn',
            formData,
            {
              auth: {
                username: 'knocker',
                password: '12345',
              },
            }
          );
          // console.log("data", response.data.user.email)
      
          if (response.status === 200) {
            const token = response.data.token;
            toast.success('Sign-in successful!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            // handleModalOpen('Success: Sign-in successful.');
            // alert("Success: Sign-in successful.")
            localStorage.setItem('token', token);

            // console.log('Sign-in successful');
            navigate('/Dashboard/knockerTable')
            
          } 
        } catch (error) {
          // console.error('Error occurred during sign-in:', error);
          // handleModalOpen(`${error.response.data.message}`);
          toast.error(`Error: ${error.response.data.message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // alert(``)
          // console.log('Error response:', error.response.statusText);

        }
      };
  
    return (

      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
           item
           xs={false}
           sm={4}
           md={7}
        sx={{
           backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2OTI2MDU3OTA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080)',
           backgroundRepeat: 'no-repeat',
             backgroundColor: (t) =>
               t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}
      />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: '#1565c0' }} style={{width:"3.5rem", height:"3.5rem"}}>
                <AdminPanelSettingsIcon   fontSize='large'/>
              </Avatar>
              <Typography component="h1" variant="h5" style={{color:"#1565c0"}}>
                Admin Sign in
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  error={emailError !== ''}
                  helperText={emailError}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={passwordError !== ''}
                  helperText={passwordError}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                {/* <NavLink to={'/Dashboard'}> */}
                <Button
                // onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                {/* </NavLink> */}

                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  {/* <Grid item>
                    <NavLink to={'/'} variant="body2" style={{textDecorationColor: 'rgba(25, 118, 210, 0.4)',color: '#1976d2'}}>
                      {"Don't have an account? Sign Up"}
                    </NavLink>
                  </Grid> */}
                </Grid>
                {/* <Copyright sx={{ mt: 5 }} /> */}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Dialog
  open={openModal}
  onClose={handleModalClose}
  aria-labelledby="modal-title"
>
  <DialogTitle id="modal-title">{modalTitle}</DialogTitle>
  <DialogContent>
    <DialogContentText>{modalContent}</DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleModalClose} color="primary" autoFocus>
      Close
    </Button>
  </DialogActions>
</Dialog>
<ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </ThemeProvider>
      
    );
  }


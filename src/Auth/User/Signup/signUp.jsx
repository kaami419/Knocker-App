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


const defaultTheme = createTheme();

export default function UserSignUp() {
  const navigate= useNavigate()
  const [table, setTable] = React.useState(false);
  const token = localStorage.getItem('token');

 
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("token",token);
    
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
  
    try {
      const response = await axios.post('http://192.168.100.18:3001/api/admin/create/user', formData,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      console.log('API Response:', response.data);
      navigate('/')
    } catch (error) {
      console.error('API Error:', error);
      
    }
  };

  return (
    <div>
      {table? 
      <StickyHeadTable/>
      :
    <ThemeProvider theme={defaultTheme}>
                   <div className='createKnockerPageBtnsDiv'>
            <NavLink to={'/'}>
            <button className='gotoDashboard' onClick={()=>{setTable(!table)}}>View List</button>
            </NavLink>
            </div>
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
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="userName"
                label="User Name"
                type="text"
                id="userName"
                autoComplete="current-userName"
              />
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
              name="userType"
              label="User Type"
               type="text"
                id="userType"
              autoComplete="current-userType"
              />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
                id="phone"
                autoComplete="current-phone"
              />
              </Grid>

            </Grid>
            <Button
            className='createKnockerBtn'
              type="submit"
              halfWidth
              variant="contained"
              sx={{ mt: 3, mb: 5 }}
            >
              Create Knocker
            </Button>
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
    </div>
  );
}


// import * as React from 'react';
// // import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// // import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { NavLink } from 'react-router-dom';
// import './signUp.css'
// import axios from 'axios';

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// const defaultTheme = createTheme();

// export default function UserSignUp() {
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
    
  //   const data = new FormData(event.currentTarget);
  
  //   const formData = {
  //     firstName: data.get('firstName'),
  //     lastName: data.get('lastName'),
  //     password: data.get('password'),
  //     phone: data.get('phone'), 
  //     email: data.get('email'),
  //     userName: data.get('userName'),
  //     userType: data.get('userType')
  //   };
  
  //   try {
  //     const response = await axios.post('http://localhost:3001/api/admin/create/user', formData);
  //     console.log('API Response:', response.data);
  //     // Handle success, maybe show a success message or redirect to another page
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     // Handle error, show an error message to the user
  //   }
  // };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid
//           item
//           xs={false}
//           sm={4}
//           md={7}
//           sx={{
//             backgroundImage: 'url(https://images.unsplash.com/photo-1476610182048-b716b8518aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2OTIzNTg3ODI&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080)',
//             backgroundRepeat: 'no-repeat',
//             backgroundColor: (t) =>
//               t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         />
        
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             }}
//           >
//                 <div className='createKnockerPageBtnsDiv'>
//                     <NavLink to={'/'}>
//                     <button className='gotoDashboard'>Go to Dashboard</button>
//                     </NavLink>
//                 </div>

//             <Typography component="h1" variant="h5" color="#1976d2" fontWeight={100}>
//               Create Knocker
//             </Typography>
//             <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>     
//             <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="firstName"
//                 label="First Name"
//                 type="text"
//                 id="firstName"
//                 autoComplete="current-firstName"
//               />
//                <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="lastName"
//                 label="Last Name"
//                 type="text"
//                 id="lastName"
//                 autoComplete="current-lastName"
//               />
//                 <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="userName"
//                 label="User Name"
//                 type="text"
//                 id="userName"
//                 autoComplete="current-userName"
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email Address"
//                 name="email"
//                 autoComplete="email"
//                 autoFocus
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 autoComplete="current-password"
//               />
//                 <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="UserType"
//                 label="User Type"
//                 type="text"
//                 id="userType"
//                 autoComplete="current-userType"
//               />
//                 <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="phone"
//                 label="Phone Number"
//                 type="number"
//                 id="phone"
//                 autoComplete="current-phone"
//               />
              
//               <FormControlLabel
//                 control={<Checkbox value="remember" color="primary" />}
//                 label="Remember me"
//               />
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//               >
//                 Create
//               </Button>
//               <Grid container>
//                 <Grid item xs>
//                   {/* <Link href="#" variant="body2">
//                     Forgot password?
//                   </Link> */}
//                 </Grid>
//                 <Grid item>
//                 <NavLink to={'/UserSignin'} variant="body2" style={{textDecorationColor: 'rgba(25, 118, 210, 0.4)',color: '#1976d2'}}>
//                     {"Already have an account? Sign in"}
//                   </NavLink>
//                 </Grid>
//               </Grid>
//               {/* <Copyright sx={{ mt: 5 }} /> */}
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// }
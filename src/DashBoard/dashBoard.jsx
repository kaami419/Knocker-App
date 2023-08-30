import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
// import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
// import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import { FourthListItems, MainListItems, SecondaryListItems, FifthListItems , ThirdListItems} from './listItems';
import './dashboard.css'
import { NavLink } from 'react-router-dom';
import StickyHeadTable from './Table/Table';
import PreRegisterationTable from './Table/PreRegisterationTable';
import AreaTable from './Table/AreaTable';
import { useNavigate, useParams } from 'react-router-dom';
import PinTable from './Table/PinTable';
import AssignAreaToKnocker from '../AssignArea/AssignArea';
import UserSignUp from '../Auth/User/Signup/signUp';
import MapDisplay from '../Map/Map';
import CreatePin from '../Pins/Pins';




const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const navigate = useNavigate()


  const [open, setOpen] = React.useState(true);
  // const [selectedComponent, setSelectedComponent] = React.useState('knockerTable'); 
  // const [selectedComponentLink, setSelectedComponentLink] = React.useState('knockerTable'); 
  const { selectedComponent } = useParams();
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // const handleSidebarItemClick = (componentName) => {

  //   setSelectedComponent(componentName);
  //   if (selectedComponent === 'knockerTable' ) {
  //     navigate('/Dashboard/knockersList')
  //   }
  //   if (selectedComponent === 'pre-registration') {
  //     navigate('/Dashboard/preRegisteration')
      
  //   }
  //   if (selectedComponent === 'area' ) {
  //     navigate('/Dashboard/area')
  //   }
  //   if (selectedComponent === 'pins' ) {
  //     navigate('/Dashboard/pinsList')
  //   }
  //   if (selectedComponent === 'assignArea' ) {
  //     navigate('/Dashboard/assignArea')
  //   }
    
  // };

  const handleSidebarItemClick = (componentName) => {
    if (componentName === 'knockerTable') {
      navigate('/Dashboard/knockerTable');
    } else if (componentName === 'pre-registration') {
      navigate('/Dashboard/pre-registration');
    } else if (componentName === 'area') {
      navigate('/Dashboard/area');
    } else if (componentName === 'pins') {
      navigate('/Dashboard/pins');
    } else if (componentName === 'assignArea') {
      navigate('/Dashboard/assignArea');
    }else if (componentName === 'signUp') {
      navigate('/Dashboard/signUp');
    }else if (componentName === 'map') {
      navigate('/Dashboard/map');
    }else if (componentName === 'createPin') {
      navigate('/Dashboard/createPin');
    }
    // setSelectedComponent(componentName);

  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('user')
  };

  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>

           <NavLink to={'/'}>
           <button className='navbarbutton2' onClick={handleLogout}>Logout</button>
           </NavLink>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
       
         
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
          <MainListItems handleSidebarItemClick={handleSidebarItemClick}/>
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems handleSidebarItemClick={handleSidebarItemClick}/>
            <Divider sx={{ my: 1 }} />
            <ThirdListItems handleSidebarItemClick={handleSidebarItemClick}/>
            <Divider sx={{ my: 1 }} />
            <FourthListItems handleSidebarItemClick={handleSidebarItemClick}/>
            <Divider sx={{my:1}}/>
            <FifthListItems handleSidebarItemClick={handleSidebarItemClick}/>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 6, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                
                 {selectedComponent === 'knockerTable' && <StickyHeadTable />}
                {selectedComponent === 'pre-registration' && <PreRegisterationTable />}
                {selectedComponent === 'area' && <AreaTable showAreaSelection={true} />}
                {selectedComponent === 'pins' && <PinTable />}
                {selectedComponent=== 'assignArea' && <AssignAreaToKnocker/>}
                {selectedComponent=== 'createKnocker' && <UserSignUp/>}
                {selectedComponent=== 'map' && <MapDisplay/>}
                {selectedComponent=== 'createPin' && <CreatePin/>}





                
                
              </Grid>
            </Grid>
          
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
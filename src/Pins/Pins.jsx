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
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PinTable from '../DashBoard/Table/PinTable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




const defaultTheme = createTheme({});

export default function CreatePin({selectedPin, editingPin}) {
    const [pin, setPin]= React.useState(false);
    const [pinData, setPinData] = React.useState({
        name: '',
        image: '',
      });
    const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (selectedPin) {
      setPinData({
        name: selectedPin.name,
        image: selectedPin.image,
      });
    }
  }, [selectedPin]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
      
        const pinData = {
          name: data.get('name'), 
          image: data.get('image'), 
        };
      
        try {
          const response = await axios.post('https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/pin', pinData,{
            headers: {
              Authorization: `Bearer ${token}` 
            }
          });
          console.log('Pin created:', response.data);
          toast.success(`${response.data.message}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setPin(!pin)

        } catch (error) {
          
          toast.error(`Error: ${error.response.data.message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.error('Error creating pin:', error);

        }
      };

      const handleUpdate = async () => {
        try {
          const response = await axios.put(
            `https://arbitrary-lxvlpwp3rq-uc.a.run.app/api/pin?id=${selectedPin.id}`,
            {
              name: pinData.name,
              image: pinData.image,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log('Pin updated:', response.data);
          toast.success(`${response.data.message}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // alert('Pin updated successfully');
          setPin(!pin)
        } catch (error) {
          toast.error(`Error: ${error.response.data}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.error('Error updating pin:', error);
        }
      };

      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPinData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const navigate=useNavigate()
      

  return (
    <div>
    {pin?<PinTable/>:
    <div>
                   {/* <div className='viewAreaListDiv'>
           <Button variant='contained' color='primary' onClick={()=>{setPin(!pin); navigate("/Dashboard/pins")}}>View Pins Listing</Button>
           </div> */}
    <ThemeProvider theme={defaultTheme} >
      <Container component="main" maxWidth="xs" style={{backgroundColor:"white"}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1565c0' }}>
            <FmdGoodIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{color:"#1565c0"}}>
            Create A Pin
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Name"
              label="Name"
              name="name"
              autoComplete="current-Name"
              autoFocus
              value={pinData.name}
              onChange={handleInputChange}
            />
            <TextField
            //   margin="normal"
              required
              fullWidth
              id="Image"
              label="Image Link"
              name="image"
              value={pinData.image}
              onChange={handleInputChange}
            //   autoComplete="current-Image"
            //   autoFocus
            />
             {editingPin ? (
                <Button
                // style={{marginLeft:"7.5rem"}}
            onClick={handleUpdate}
            halfWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Pin
          </Button>
            
             ) :(
              <Button
              type="submit"
              halfWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create This Pin
            </Button>
             )}

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
        }
        </div>
  );
}